// @ts-check

function zeroFill(number, width) {
    width -= number.toString().length;

    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }

    return number + ""; // always return a string
}

/**
 * Represents a 64-bit integer.
 * @constructor
 * @param {number} low - The lower 32 bits.
 * @param {number} hi - The higher 32 bits.
 * @returns {int64}
 */
function int64(low, hi) {
    // number >>> 0 = convert to unsigned
    /** @type {number} */
    this.low = (low >>> 0);
    /** @type {number} */
    this.hi = (hi >>> 0);

    /** @type {Uint8Array|Uint16Array|Uint32Array} */
    this.backing = null;

    /** @this {int64} */
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
        
            // this reuses the original backing buffer, so no big allocation here
            this.backing = new Uint8Array(this.backing.buffer, val, this.backing.byteLength - val);
        }
    }

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
        
            // this reuses the original backing buffer, so no big allocation here
            ret.backing = new Uint8Array(this.backing.buffer, val, this.backing.byteLength - val);
        }

        return ret;
    }

    this.sub32 = function (val) {
        let new_lo = (((this.low >>> 0) - val) & 0xFFFFFFFF) >>> 0;
        let new_hi = (this.hi >>> 0);

        // @ts-ignore
        if (new_lo > (this.low) & 0xFFFFFFFF) {
            new_hi--;
        }

        return new int64(new_lo, new_hi);
    }

    /** @this {int64} */
    this.sub32inplace = function (val) {
        let new_lo = (((this.low >>> 0) - val) & 0xFFFFFFFF) >>> 0;
        let new_hi = (this.hi >>> 0);

        // @ts-ignore
        if (new_lo > (this.low) & 0xFFFFFFFF) {
            new_hi--;
        }

        this.hi = new_hi;
        this.low = new_lo;
    }

    this.and32 = function (val) {
        let new_lo = this.low & val;
        let new_hi = this.hi;
        return new int64(new_lo, new_hi);
    }

    this.and64 = function (vallo, valhi) {
        let new_lo = this.low & vallo;
        let new_hi = this.hi & valhi;
        return new int64(new_lo, new_hi);
    }

    /** 
     * @param {number} radix
     * @returns {string}
     */
    this.toString = function (radix = 16) {
        let lo_str = (this.low >>> 0).toString(radix);
        let hi_str = (this.hi >>> 0).toString(radix);

        if (this.hi == 0) {
            return lo_str;
        } else {
            // explicit check for 16 so its faster since in practice this is all thats used
            const width = radix === 16 ? 8 : Math.ceil(32 / Math.log2(radix));
            lo_str = zeroFill(lo_str, width);
        }

        return hi_str + lo_str;
    }

    return this;
}