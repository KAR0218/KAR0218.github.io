function makeid() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function zeroFill(number, width) {
  width -= number.toString().length;

  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
  }

  return number + '';
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

var _dview;

function u2d(low, hi) {
  if (!_dview) {
    _dview = new DataView(new ArrayBuffer(16));
  }
  _dview.setUint32(0, hi);
  _dview.setUint32(4, low);
  return _dview.getFloat64(0);
}

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
  };

  this.add32 = function (val) {
    var new_lo = (((this.low >>> 0) + val) & 0xFFFFFFFF) >>> 0;
    var new_hi = (this.hi >>> 0);

    if (new_lo < this.low) {
      new_hi++;
    }

    return new int64(new_lo, new_hi);
  };

  this.sub32 = function (val) {
    var new_lo = (((this.low >>> 0) - val) & 0xFFFFFFFF) >>> 0;
    var new_hi = (this.hi >>> 0);

    if (new_lo > (this.low) & 0xFFFFFFFF) {
      new_hi--;
    }

    return new int64(new_lo, new_hi);
  };

  this.sub32inplace = function (val) {
    var new_lo = (((this.low >>> 0) - val) & 0xFFFFFFFF) >>> 0;
    var new_hi = (this.hi >>> 0);

    if (new_lo > (this.low) & 0xFFFFFFFF) {
      new_hi--;
    }

    this.hi = new_hi;
    this.low = new_lo;
  };

  this.and32 = function (val) {
    var new_lo = this.low & val;
    var new_hi = this.hi;
    return new int64(new_lo, new_hi);
  };

  this.and64 = function (vallo, valhi) {
    var new_lo = this.low & vallo;
    var new_hi = this.hi & valhi;
    return new int64(new_lo, new_hi);
  };

  this.toString = function (val) {
    val = 16;
    var lo_str = (this.low >>> 0).toString(val);
    var hi_str = (this.hi >>> 0).toString(val);

    if (this.hi == 0) {
      return lo_str;
    }

    lo_str = zeroFill(lo_str, 8);

    return hi_str + lo_str;
  };

  this.toPacked = function () {
    return {
      hi: this.hi,
      low: this.low,
    };
  };

  this.setPacked = function (pck) {
    this.hi = pck.hi;
    this.low = pck.low;
    return this;
  };

  return this;
}
