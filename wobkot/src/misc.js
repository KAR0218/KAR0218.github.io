//#region Constants
const is_worker = typeof WorkerGlobalScope !== 'undefined' && globalThis instanceof WorkerGlobalScope;
const version = {
  console: undefined,
  major: undefined,
  minor: undefined,

  init() {
    const ua = navigator.userAgent;

    logger.info(`Agent: ${ua}`);

    const match = /PlayStation\s+(\d+)[/ ](\d+)\.(\d+)/.exec(ua);
    if (!match) {
      throw new Error(`Unsupported user agent: ${ua}`);
    }

    const [, console, major, minor] = match;

    this.console = Number.parseInt(console, 10);
    this.major = Number.parseInt(major, 10);
    this.minor = Number.parseInt(minor, 16);
  },
  toString() {
    if (this.major === undefined || this.minor === undefined) {
      throw new Error('Version has not been initialized');
    }

    return `${this.major}.${this.minor.toString(16).padStart(2, '0')}`;
  },
};
//#endregion
//#region Classes
class BInt {
  /** @param  {[number, number]|number|string|BInt|ArrayLike<number>} */
  constructor(...args) {
    let lo = 0;
    let hi = 0;

    switch (args.length) {
      case 0:
        break;
      case 1:
        let value = args[0];
        switch (typeof value) {
          case 'boolean':
            lo = value ? 1 : 0;
            break;
          case 'number':
            if (Number.isNaN(value)) {
              throw new TypeError(`Number ${value} is NaN`);
            }

            if (Number.isInteger(value)) {
              if (!Number.isSafeInteger(value)) {
                throw new RangeError(`Integer ${value} outside safe 53-bit range`);
              }

              lo = value >>> 0;
              hi = Math.floor(value / 0x100000000) >>> 0;
            } else {
              BInt.View.setFloat64(0, value, true);

              lo = BInt.View.getUint32(0, true);
              hi = BInt.View.getUint32(4, true);
            }

            break;
          case 'string':
            // remove 0x prefix
            if (value.charCodeAt(0) === 0x30 && value.charCodeAt(1) === 0x78) {
              value = value.slice(2);
            }

            if (value.length > 0x10) {
              throw new RangeError(`String ${value} is out of range !!`);
            }

            if (!BInt.Hex.test(value)) {
              throw new RangeError(`String ${value} is not valid hex !!`);
            }

            value = value.padStart(16, '0');

            hi = parseInt(value.slice(0, 8), 16);
            lo = parseInt(value.slice(8), 16);

            break;
          case 'object':
            if (value !== null) {
              if (Number.isInteger(value.lo) && Number.isInteger(value.hi)) {
                lo = value.lo >>> 0;
                hi = value.hi >>> 0;
                break;
              } else if (ArrayBuffer.isView(value) && value.byteLength === BInt.View.byteLength) {
                new Uint8Array(BInt.View.buffer).set(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));

                lo = BInt.View.getUint32(0, true);
                hi = BInt.View.getUint32(4, true);
                break;
              }
            }
          default:
            throw new TypeError(`Unsupported value ${value} !!`);
        }
        break;
      case 2:
        hi = args[0];
        lo = args[1];

        if (!Number.isInteger(hi)) {
          throw new RangeError(`hi value ${hi} is not an integer !!`);
        }

        if (!Number.isInteger(lo)) {
          throw new RangeError(`lo value ${lo} is not an integer !!`);
        }

        hi >>>= 0;
        lo >>>= 0;

        break;
      default:
        throw new TypeError('Unsupported input !!');
    }

    this.lo = lo;
    this.hi = hi;
  }

  get i() {
    const hi = this.hi | 0;

    if (hi < -0x200000 || hi > 0x1fffff) {
      throw new RangeError(`${this} outside safe 53-bit range`);
    }

    return hi * 0x100000000 + this.lo;
  }

  get u() {
    if (this.hi > 0x1fffff) {
      throw new RangeError(`${this} outside safe 53-bit range`);
    }

    return this.hi * 0x100000000 + this.lo;
  }

  get d() {
    const hi_word = this.hi >>> 16;
    if (hi_word === 0xffff || hi_word === 0xfffe) {
      throw new RangeError(`${this} cannot be represented as double`);
    }

    BInt.View.setUint32(0, this.lo, true);
    BInt.View.setUint32(4, this.hi, true);

    return BInt.View.getFloat64(0, true);
  }

  toString() {
    return '0x' + this.hi.toString(16).padStart(8, '0') + this.lo.toString(16).padStart(8, '0');
  }

  [Symbol.toPrimitive](hint) {
    return hint === 'string' ? this.toString() : this.i;
  }

  getBit(idx) {
    if (idx < 0 || idx > 63) {
      throw new RangeError(`Bit ${idx} is out of range !!`);
    }

    return (idx < 32 ? this.lo >>> idx : this.hi >>> (idx - 32)) & 1;
  }

  setBit(idx, value) {
    if (idx < 0 || idx > 63) {
      throw new RangeError(`Bit ${idx} is out of range !!`);
    }

    if (idx < 32) {
      this.lo = (value ? this.lo | (1 << idx) : this.lo & ~(1 << idx)) >>> 0;
    } else {
      idx = idx - 32;
      this.hi = (value ? this.hi | (1 << idx) : this.hi & ~(1 << idx)) >>> 0;
    }
  }

  cmp(value) {
    value = value instanceof BInt ? value : new BInt(value);
    if (this.hi !== value.hi) return this.hi > value.hi ? 1 : -1;
    if (this.lo !== value.lo) return this.lo > value.lo ? 1 : -1;
    return 0;
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
      throw new RangeError('add overflowed !!');
    }

    return BInt.New(hi, lo);
  }

  sub(value) {
    value = value instanceof BInt ? value : new BInt(value);

    if (this.hi < value.hi || (this.hi === value.hi && this.lo < value.lo)) {
      throw new RangeError('sub underflowed !!');
    }

    const b = this.lo < value.lo ? 1 : 0;
    const hi = this.hi - value.hi - b;
    const lo = this.lo - value.lo;

    return BInt.New(hi, lo);
  }

  mul(value) {
    value = value instanceof BInt ? value : new BInt(value);

    const a0 = this.lo & 0xffff;
    const a1 = this.lo >>> 16;
    const a2 = this.hi & 0xffff;
    const a3 = this.hi >>> 16;

    const b0 = value.lo & 0xffff;
    const b1 = value.lo >>> 16;
    const b2 = value.hi & 0xffff;
    const b3 = value.hi >>> 16;

    // Any partial product at limb index >= 4 means the result exceeds 64 bits
    if ((a3 && b1 | b2 | b3) || (b3 && a1 | a2) || (a2 && b2)) {
      throw new RangeError('mul overflowed !!');
    }

    let c0 = a0 * b0;
    let c1 = (c0 >>> 16) + a1 * b0;
    let c2 = Math.floor(c1 / 0x10000);
    c1 = (c1 & 0xffff) + a0 * b1;
    c2 += Math.floor(c1 / 0x10000);
    c0 &= 0xffff;
    c1 &= 0xffff;
    c2 += a2 * b0 + a1 * b1 + a0 * b2;
    let c3 = Math.floor(c2 / 0x10000);
    c2 &= 0xffff;
    c3 += a3 * b0 + a2 * b1 + a1 * b2 + a0 * b3;

    if (c3 > 0xffff) {
      throw new RangeError('mul overflowed !!');
    }

    const hi = ((c3 << 16) | c2) >>> 0;
    const lo = ((c1 << 16) | c0) >>> 0;

    return BInt.New(hi, lo);
  }

  divmod(value) {
    value = value instanceof BInt ? value : new BInt(value);

    if (value.hi === 0 && value.lo === 0) {
      throw new Error('Division by zero');
    }

    // Fast path: both operands fit in 32 bits
    if (this.hi === 0 && value.hi === 0) {
      const q = Math.floor(this.lo / value.lo);
      return {
        q: BInt.New(0, q >>> 0),
        r: BInt.New(0, (this.lo - q * value.lo) >>> 0),
      };
    }

    // Fast path: dividend < divisor
    if (this.hi < value.hi || (this.hi === value.hi && this.lo < value.lo)) {
      return { q: mk(0, 0), r: mk(this.hi, this.lo) };
    }

    let rh = 0;
    let rl = 0;
    let qh = 0;
    let ql = 0;
    for (let i = 63; i >= 0; i--) {
      const top = rh >>> 31;
      rh = ((rh << 1) | (rl >>> 31)) >>> 0;
      rl = ((rl << 1) | ((i < 32 ? this.lo >>> i : this.hi >>> (i - 32)) & 1)) >>> 0;

      if (top || rh > value.hi || (rh === value.hi && rl >= value.lo)) {
        const borrow = rl < value.lo ? 1 : 0;
        rh = (rh - value.hi - borrow) >>> 0;
        rl = (rl - value.lo) >>> 0;
        if (i < 32) ql = (ql | (1 << i)) >>> 0;
        else qh = (qh | (1 << (i - 32))) >>> 0;
      }
    }

    return { q: BInt.New(qh, ql), r: BInt.New(rh, rl) };
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

    return BInt.New(hi, lo);
  }

  and(value) {
    value = value instanceof BInt ? value : new BInt(value);

    const lo = (this.lo & value.lo) >>> 0;
    const hi = (this.hi & value.hi) >>> 0;

    return BInt.New(hi, lo);
  }

  or(value) {
    value = value instanceof BInt ? value : new BInt(value);

    const lo = (this.lo | value.lo) >>> 0;
    const hi = (this.hi | value.hi) >>> 0;

    return BInt.New(hi, lo);
  }

  not() {
    const lo = ~this.lo >>> 0;
    const hi = ~this.hi >>> 0;

    return BInt.New(hi, lo);
  }

  shl(count) {
    if (count < 0 || count > 63) {
      throw new RangeError(`Shift ${count} bits out of range !!`);
    }

    if (count === 0) {
      return BInt.New(this);
    }

    const lo = count < 32 ? (this.lo << count) >>> 0 : 0;
    const hi = count < 32 ? ((this.hi << count) | (this.lo >>> (32 - count))) >>> 0 : (this.lo << (count - 32)) >>> 0;

    return BInt.New(hi, lo);
  }

  shr(count) {
    if (count < 0 || count > 63) {
      throw new RangeError(`Shift ${count} bits out of range !!`);
    }

    if (count === 0) {
      return BInt.New(this);
    }

    const lo = count < 32 ? ((this.lo >>> count) | (this.hi << (32 - count))) >>> 0 : this.hi >>> (count - 32);
    const hi = count < 32 ? this.hi >>> count : 0;

    return BInt.New(hi, lo);
  }

  alignUp(alignment) {
    if (alignment <= 0 || (alignment & (alignment - 1)) !== 0) {
      throw new RangeError('alignment must be power of 2');
    }

    const mask = alignment - 1;

    let lo = this.lo + mask;
    const c = lo > 0xffffffff ? 1 : 0;
    let hi = this.hi + c;

    if (hi > 0xffffffff) {
      throw new RangeError('alignUp overflowed !!');
    }

    lo &= ~mask;

    return BInt.New(hi, lo);
  }

  alignDown(alignment) {
    if (alignment <= 0 || (alignment & (alignment - 1)) !== 0) {
      throw new RangeError('alignment must be power of 2');
    }

    const mask = alignment - 1;

    const lo = this.lo & ~mask;
    const hi = this.hi;

    return BInt.New(hi, lo);
  }
}
//#endregion
//#region Extensions
Number.prototype.alignUp = function (alignment) {
  const mask = alignment - 1;
  return (this + mask) & ~mask;
};

Number.prototype.alignDown = function (alignment) {
  const mask = alignment - 1;
  return this & ~mask;
};

Number.prototype.hex = function (padded = false, maxLength = 16) {
  let str = this.toString(16);

  if (padded) {
    str = str.padStart(maxLength, '0');
  }

  return `0x${str}`;
};

Object.getPrototypeOf(Uint8Array.prototype).hex = function () {
  return Array.from(this, (x) => x.hex()).join(',');
};

DataView.prototype.getBInt = function (byteOffset, littleEndian = false) {
  const lo = DataView.prototype.getUint32.call(this, byteOffset, littleEndian);
  const hi = DataView.prototype.getUint32.call(this, byteOffset + 4, littleEndian);
  return littleEndian ? BInt.New(hi, lo) : BInt.New(lo, hi);
};

DataView.prototype.setBInt = function (byteOffset, value, littleEndian = false) {
  value = value instanceof BInt ? value : new BInt(value);

  if (littleEndian) {
    DataView.prototype.setUint32.call(this, byteOffset, value.lo, true);
    DataView.prototype.setUint32.call(this, byteOffset + 4, value.hi, true);
  } else {
    DataView.prototype.setUint32.call(this, byteOffset, value.hi, false);
    DataView.prototype.setUint32.call(this, byteOffset + 4, value.lo, false);
  }
};
//#endregion
//#region Static
BInt.View = new DataView(new ArrayBuffer(8));
BInt.Hex = /^[0-9a-fA-F]*$/;
BInt.New = function (hi, lo) {
  const value = new BInt();
  value.hi = hi;
  value.lo = lo;
  return value;
};
//#endregion
