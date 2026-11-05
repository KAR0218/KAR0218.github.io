import { establishPrimitive } from "./webkit.js";
import { installWindowP } from "./utils/mem.js";

const output = document.getElementById("console");
const MAX_CONSOLE_LINES = 80;
let mirrorQueued = false;

function queueParentLogMirror() {
  if (window.parent === window || mirrorQueued) return;
  mirrorQueued = true;
  setTimeout(() => {
    mirrorQueued = false;
    try {
      window.parent.postMessage({ type: "wkal", kind: "log" }, "*");
    } catch (e) {}
  }, 50);
}

function writeLog(message, type = "log", replace = false) {
  let line = replace ? output.lastElementChild : null;
  if (!line) {
    line = document.createElement("div");
    output.appendChild(line);
  }
  let marker = "*";
  if (type === "error") marker = "-";
  if (type === "info" || type === "success") marker = "+";
  line.textContent = `[${marker}] ${message}`;
  const logType = String(type || "log").toUpperCase().replace(/^LOG-/, "");
  line.className = "LOG-" + logType;
  line.style.color = "#fff";
  while (output.childElementCount > MAX_CONSOLE_LINES) {
    output.removeChild(output.firstElementChild);
  }
  output.scrollTop = output.scrollHeight;
  /* Coalesce bursts of log notifications. The parent already polls the iframe
     every 500 ms; one notification per 50 ms is enough to wake it without
     creating a postMessage for every emit(). */
  queueParentLogMirror();
}

function writeEvent(name, detail, type) {
  writeLog(detail == null || detail === "" ? name : `${name}: ${detail}`,
    type || (name === "Failed" ? "error" : "log"));
}

window.writeLog = writeLog;
window.jb = { mark: writeEvent };

async function getPrimitive() {
  writeLog("Starting WebKit exploit");
  const primitive = installWindowP(await establishPrimitive(writeEvent));
  if (!primitive || typeof primitive.read8 !== "function")
    throw new Error("Memory primitive unavailable");

  writeLog("ARW ready", "success");
  return primitive;
}

function getWebKitBase() {
  const ctor = globalThis.__ps5NativeCtor;
  if (typeof ctor !== "number" || typeof OFFSET_wk_host_constructor_candidates === "undefined")
    throw new Error("WebKit base inputs are unavailable");

  for (const offset of OFFSET_wk_host_constructor_candidates) {
    const base = ctor - offset;
    if (base >= 0x800000000 && base < 0x900000000 && base % 0x4000 === 0)
      return base;
  }

  throw new Error("WebKit base not found");
}

async function run() {
  const rejection = window.firmware.rejection();
  if (rejection)
    throw new Error(rejection);
  writeLog("Credits: ntfargo, ufm42, Sonic_Iso, Jordy, Dr. Yenyen, TheFlow, SlidyBat, Flatz, cow, nhk, bollarz, Sleirsgoevy, EchoStretch, EarthOnion", "info");
  writeLog(`Agent: ${navigator.userAgent}`, "info");
  writeLog(`Firmware: ${window.fw_str}`, "info");
  const primitive = await getPrimitive();
  writeLog(`WebKit base: 0x${getWebKitBase().toString(16)}`, "info");

  await import("./relapse_exploit.js");
  await main(primitive);
}

run().catch((error) => writeLog(error instanceof Error ? error.message : String(error), "error"));