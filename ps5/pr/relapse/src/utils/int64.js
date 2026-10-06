function sliceBacking(backing, offset) {
  if (offset < 0 || offset > backing.byteLength)
    throw new RangeError("int64: backing overflow");

  return new Uint8Array(
    backing.buffer,
    backing.byteOffset + offset,
    backing.byteLength - offset,
  );
}

export function int64(low = 0, hi = 0) {
  this.low = low >>> 0;
  this.hi = hi >>> 0;
  this.backing = null;
}

int64.prototype.add32 = function (value) {
  const low = (this.low + value) >>> 0;
  const hi = (this.hi + (low < this.low ? 1 : 0)) >>> 0;
  const result = new int64(low, hi);

  if (this.backing !== null)
    result.backing = sliceBacking(this.backing, value);

  return result;
};

int64.prototype.add32inplace = function (value) {
  const low = (this.low + value) >>> 0;
  this.hi = (this.hi + (low < this.low ? 1 : 0)) >>> 0;
  this.low = low;

  if (this.backing !== null)
    this.backing = sliceBacking(this.backing, value);
};

int64.prototype.sub32inplace = function (value) {
  const low = (this.low - value) >>> 0;
  this.hi = (this.hi - (low > this.low ? 1 : 0)) >>> 0;
  this.low = low;
};

int64.prototype.toString = function (radix = 16) {
  const low = this.low.toString(radix);
  if (this.hi === 0)
    return low;

  const width = radix === 16 ? 8 : Math.ceil(32 / Math.log2(radix));
  return this.hi.toString(radix) + low.padStart(width, "0");
};

globalThis.int64 = int64;
