// 07.00 (devkit, PS5UPDATE-devkit-7_00_00_44) -- generated from
// libSceNKWebKit / libkernel_web / libSceLibcInternal / 700_dvk_kernel.elf.
// file offset = rva + 0x4000

// host-constructor candidates: webkitBase = nativeCtorAddr - hc
// parseInt's NativeExecutable::m_constructor is callHostFunctionAsConstructor
// (JSObject.cpp passes it to JSFunction::create for every putDirectNativeFunction).
// This build has clang CFI, so the *address-taken* value is the function's
// jump-table entry, NOT its body: the body is at 0x003B5780 and three 8-byte
// `jmp rel32; int3 int3 int3` slots point at it. Only 0x00010AE8 yields a
// 0x4000-aligned base (measured ctor 0x835470ae8 -> base 0x835460000); main.js
// rejects the other two on alignment, exactly as it does for 9.00's three.
const OFFSET_wk_host_constructor_candidates = [0x00010AE8, 0x00010590, 0x000114C0];
// vtable[0] of HTMLTextAreaElement - the ICF-folded WebCore Element destructor, which
// is slot 0 of 201 vtables of 150+ slots in this NKWebKit (retail and devkit agree).
// 7.00 is BELOW 9.00, so main.js really does take the vtable branch here; it used to
// carry the WKDownloadGetTypeID export 0x006E6910 like the 9.00+ files do, where the
// branch is dead. That value is slot 0 of nothing longer than a 20-slot vtable and would
// have produced a wrong WebKit base on the first read. Derived 2026-08-26 by a method
// that reproduces the shipped value on all nine other sub-9.00 firmwares, 8.20 among
// them, whose value is confirmed by hardware. See E:\ps5\dwarf\P2JB_RE\REPORT.md.
const OFFSET_wk_vtable_first_element     = 0x0003D720;
// Import GOT slots, MEASURED on the console, not taken from the relocation
// tables. DT_JMPREL/DT_RELA give r_offset 0x03E16EE0 (memset, 8zTFvBIAIN8#P#Q)
// and 0x03E14910 (__stack_chk_guard, f7uOxY9mM1U#C#D), but at runtime those
// two addresses hold WebKit-internal code pointers -- they are in .data.rel.ro
// among the vtables, not in the import GOT. Sweeping the RW data segments for
// pointers leaving the module and testing them against the known symbol
// offsets found the real slots exactly one 16KB page higher, independently for
// both symbols:
//   __stack_chk_guard  reloc 0x03E14910 -> real 0x03E18910   (+0x4000)
//   memset             reloc 0x03E16EE0 -> real 0x03E1AEE0   (+0x4000)
// Measured values: guard 0x80e5411d0 -> libkernel_web 0x80e4d4000,
// memset 0x82b9cce70 -> libSceLibcInternal 0x82b9b8000; both 0x4000-aligned and
// both inside their module's image. If another firmware's profile is ever
// derived the same way, check for this page bias before trusting r_offset.
const OFFSET_wk_memset_import                  = 0x03E1AEE0;
const OFFSET_wk___stack_chk_guard_import       = 0x03E18910;

const OFFSET_lk___stack_chk_guard              = 0x0006D1D0;
const OFFSET_lk_pthread_create_name_np         = 0x00001CE0;
const OFFSET_lk_pthread_join                   = 0x00032820;
const OFFSET_lk_pthread_exit                   = 0x00022630;
// Stage-5 payload loader ABI.  These exact scePthread exports are used by the
// original AioShellcode loader together with an explicit 0x80000-byte stack.
const OFFSET_lk_scePthreadCreate               = 0x0000E220;
const OFFSET_lk_scePthreadJoin                 = 0x00014A40;
const OFFSET_lk_scePthreadAttrInit             = 0x000295F0;
const OFFSET_lk_scePthreadAttrSetstacksize     = 0x000176C0;
const OFFSET_lk_scePthreadAttrSetdetachstate   = 0x00016EC0;
const OFFSET_lk_scePthreadAttrDestroy          = 0x00020530;
const OFFSET_lk_sceKernelSendNotificationRequest = 0x00008BE0;
const OFFSET_lk_sysctlbyname                   = 0x00027330;
const OFFSET_lk_pthread_create                 = 0x00030150;
const OFFSET_lk_getpid                         = 0x00036760;
// TAILQ head written by _thr_link()'s TAILQ_INSERT_HEAD at 0x0002B960
// (tle at +0x38, as main.js assumes).  Same address as 9.00-13.60.
const OFFSET_lk__thread_list                   = 0x00064218;
/* Saved PC the idle Worker parks on, as a RANKED list -- main.js takes the
 * first entry that appears exactly once on the worker stack.
 *
 * MEASURED on a live 7.00 devkit, not read off the binary. The static guess
 * 0x389B1 ("return address of the blocking call inside cond_wait_common
 * 0x38840, the branch pthread_cond_wait takes") is NOT on the stack -- the
 * fingerprint scan found 0 of it. Sweeping the parked worker stack for
 * libkernel pointers produced this chain, newest frame (lowest offset) first:
 *
 *     0x7fb28  lk+0x2d85c   umtx wait wrapper (deepest, in the syscall)
 *     0x7fb48  lk+0x39843   _thr_ucond_wait
 *     0x7fb78  lk+0x38f31   cond_wait_common      <-- 0x38840 + 0x6f1
 *     0x7fc38  lk+0x33d1e   pthread_cond_wait
 *     0x7ffc8  lk+0x39ac0   thread entry (oldest)
 *
 * i.e. exactly libthr's pthread_cond_wait -> cond_wait_common ->
 * _thr_ucond_wait -> _thr_umtx_timedwait_uint. 0x38F31 is the same function
 * the original constant aimed at, just the call site that actually runs, so
 * it keeps the intended pivot frame. The other two are ranked behind it as
 * fallbacks in case a future build shifts that call.
 * The cond_wait selector at lk+0x64014 reads 1 on this console, confirming
 * pthread_cond_wait really does take the 0x38840 body -- so the wrong-body
 * explanation is ruled out and the call site is the whole story.
 * previous (never matched): 0x000389B1 */
const OFFSET_lk_worker_wait_return             = [0x00038F31, 0x00039843, 0x00033D1E];
// Byte that selects WHICH cond_wait_common body pthread_cond_wait calls:
// 1 -> 0x38840 (the body 0x389B1 above was taken from), 0 -> 0x38BE0.
// probe700.html reads this too. main.js reports it when the fingerprint scan
// comes up empty, because a fingerprint from the body that is NOT running can
// never appear on the stack.
const OFFSET_lk_cond_wait_selector             = 0x00064014;
const OFFSET_lk_sleep                          = 0x00025C50;
const OFFSET_lk_sceKernelGetCurrentCpu         = 0x000028A0;

const OFFSET_lc_memset                         = 0x00014E70;
const OFFSET_lc_malloc                         = 0x00005E80;
const OFFSET_lc_free                           = 0x00005E90;
const OFFSET_lc_memcpy                         = 0x00003CD0;
const OFFSET_lc_strcmp                         = 0x000408D0;
const OFFSET_lc_memcmp                         = 0x00040890;
const OFFSET_lc_vsnprintf                      = 0x0005C620;
const OFFSET_lc_setjmp                         = 0x0005AF10;
const OFFSET_lc_longjmp                        = 0x0005AF60;

// Fallback estimate only; main.js fingerprints the saved worker PC at runtime.
const OFFSET_WORKER_STACK_OFFSET         = 0x0007FB68;

// --- gadget substitutions unique to this build ------------------------------
// CORRECTED 2026-08-28.  The text below used to claim this libSceNKWebKit "has
// no `pop r9 ; ret` anywhere in .text", and shipped a zeroing stand-in at
// 0x010BF949 (45 31 c9 4d 85 c9 0f 95 c0 c3 = xor r9d,r9d ; test ; setne al ;
// ret) with OFFSET_wk_r9_zero_only = true.  That claim is FALSE.  Read straight
// out of both dumps, retail and devkit:
//     rva 0x002773C6 = 47 59 c3  -> REX.B + pop rcx = a REAL `pop r9 ; ret`
//     rva 0x00214613 = 5a c3     -> a REAL `pop rdx ; ret`
// So this build needs no r9 stand-in at all.  "pop r9" now points at the real
// gadget and the flag is false, which makes 7.00 structurally identical to
// 7.01-8.60 (all of which are also real `pop r9 ; ret`, verified byte-for-byte)
// and takes verify2 from 25/26 to 26/26 on retail and devkit.
//
// Worth remembering: NO shipped engine ever read this flag - it is honoured only
// in slopdev/slopkit/rop.js.  So while the flag said "consumes no stack slot",
// poopsploit/poop2jb were pushing gadget AND value, i.e. one stack slot the
// gadget never popped.  A workaround is evidence someone could not find a
// gadget, not evidence it is absent.
const OFFSET_wk_r9_zero_only             = false;
// "cmp [rcx], eax" is really `cmp eax, [rcx] ; ret`, i.e. the operands are
// swapped.  ZF is unaffected by the swap, so branch_types.EQUAL (the only
// type the engine uses) is exact; rop.js throws on the ordered types.
const OFFSET_wk_cmp_operands_reversed    = true;
/* `mov [rdi], rsi ; ret` at 0x7527F0 is NOT that instruction on this build.
 * Established by execution, since the text is execute-only and cannot be read:
 *   probe=rsp  SILENT -- pop rsp 0x6EEE1 and the stack switch both work
 *   probe=p    SILENT -- pop rdi 0x31434 and pop rsi 0xB7098 each consume
 *                        exactly one stack slot and return correctly
 *   probe=w    CRASH  -- those same two pops PLUS this store, twice
 * The store is the only difference between the last two, so 0x7527F0 is it.
 * Route 8-byte stores through `mov [rdi], rax` 0x79337 instead. That one is
 * cross-checked by its own neighbour: "mov [rdi], eax" is 0x79338, exactly one
 * byte later, which is what `48 89 07 C3` vs `89 07 C3` looks like -- the same
 * store with the REX prefix skipped. 0x7527F0 has no such corroboration.
 * rop.js honours this in push_write8, push_copy8 and push_write_ptr8. */
const OFFSET_wk_store_via_rax            = true;
/* Run the gadget conformance suite once prepare() succeeds. This whole profile
 * came out of the same generator that produced the bad 0x7527F0, and the text
 * is execute-only so nothing here can be verified by reading it. With a working
 * chain the remaining gadgets CAN be checked by executing them and comparing
 * the result, which beats discovering the next bad one by bisecting crashes. */
const OFFSET_wk_gadget_selftest          = true;

// --- 7.00 bootstrap: the idle-Worker hijack does not work on JSC 613 --------
// The Worker never parks at a return address any stack scan can find (its wait
// is a raw syscall; the PLT is `jmp [GOT]`, so nothing rets through a slot we
// control). Instead we fake a C++ vtable on the leaked textarea impl, take one
// virtual dispatch to get `rdi = this`, and pivot with longjmp. main.js runs a
// non-destructive milestone first to confirm the virtual call and find the
// trigger op; OFFSET_wk_vtable_trigger is filled in once the device reports it.
const OFFSET_wk_bootstrap                 = "";  // JIT-less: JS-frame (LLInt) pivot is not viable; native worker-stack hijack is the JIT-independent path
// mov rsp, rdi ; ret  -- the pivot for a `rdi = this` virtual call (fallback;
// longjmp is used as the primary pivot since its jmp_buf is fully attacker-built:
// +0x00 rip, +0x10 rsp, standard FreeBSD amd64 layout, confirmed in libc 613).
const OFFSET_wk_stack_pivot_mov_rsp_rdi   = 0x0080C579;
// set once the milestone reports which JS/DOM op yielded the virtual call
const OFFSET_wk_vtable_trigger            = "";
// 7.00's JSC is 613.1; 9.00+ is 616.1. JSArrayBufferView gained a
// `size_t m_byteOffset` member between them, so the tail differs:
//   613: +0x18 size_t m_length, +0x20 uint32 m_mode              sizeof 0x28
//   616: +0x18 size_t m_length, +0x20 size_t m_byteOffset,
//        +0x28 uint8  m_mode                                     sizeof 0x30
// Measured on this console: structureID 0xdc63, butterfly 0x881a24038,
// m_vector 0x881a7ae00, m_length 0x100, and +0x20 = 02 00 00 00 --
// TypedArrayMode 2 == WastefulTypedArray, which is exactly what
// `new Uint8Array(new ArrayBuffer(0x100))` must be. core.js checks m_mode
// here instead of the m_byteOffset that this version does not have.
const OFFSET_jsc_abv_mode_at_0x20        = true;

/* VERIFIED byte-for-byte on 2026-08-21 against
 * PS5UPDATE-devkit-7_00_00_44 .. system_ex_b/common_ex/lib/libSceNKWebKit.sprx
 * (PT_LOAD[0]: vaddr 0, file offset 0x4000, so file = rva + 0x4000).
 * Every entry below decodes to exactly the instruction its name claims, with
 * two deliberate exceptions, both already flagged above:
 *   pop r9        0x010BF949 = 45 31 c9 4d 85 c9 0f 95 c0 c3  (the zeroing
 *                 stand-in; OFFSET_wk_r9_zero_only)
 *   cmp [rcx],eax 0x035F9049 = 3b 01 c3  (operands reversed;
 *                 OFFSET_wk_cmp_operands_reversed)
 * The executable segment runs 0x0 .. 0x3673D22 (54.5 MB), so every address
 * here is inside it. An earlier reading of the probe results -- that text
 * ended near 1.2 MB and the high gadgets pointed into data -- was WRONG;
 * the chain crashes have another cause. */
let wk_gadgetmap = {
	"ret": 0x00000042,
	"pop rdi": 0x00031434,
	"pop rsi": 0x000B7098,
	// 0x21461C, not the 0x214613 this profile shipped: verified `5a c3` in
	// system_ex_b/common_ex/lib/libSceNKWebKit.sprx from
	// PS5UPDATE-devkit-7_00_00_44. 0x214613 is not a pop.
	"pop rdx": 0x0021461C,
	"pop rcx": 0x00032473,
	"pop rax": 0x000A6CAB,
	"pop rsp": 0x0006EEE1,
	"pop r8": 0x004C5D31,
	"pop r9": 0x002773C6,
	"mov [rdi], rsi": 0x007527F0,
	"mov [rdi], rax": 0x00079337,
	"mov [rdi], eax": 0x00079338,
	"mov rax, [rax]": 0x0012A439,
	"add rax, rcx": 0x00024321,
	"cmp [rcx], eax": 0x035F9049,
	"inc dword [rax]": 0x000B70B5,
	"seta al": 0x0021A9C2,
	"setb al": 0x000A2B46,
	"sete al": 0x0001CF1F,
	"setg al": 0x015C5876,
	"setl al": 0x00681ECF,
	"shl rax, 3": 0x02488363,
	"shl rax, 4": 0x00572686,
	"shr rax, 3": 0x01308FC3,
	"shr rax, 4": 0x02D60B54,
	"infloop": 0x000037D1,
};

let syscall_map = {
	0x001: 0x00036A1A,
	0x002: 0x000383E0,
	0x003: 0x000365E0,
	0x004: 0x00036540,
	0x005: 0x00036BE0,
	0x006: 0x00037210,
	0x007: 0x00035E00,
	0x00A: 0x00037F20,
	0x00C: 0x000378B0,
	0x00F: 0x00037290,
	0x014: 0x00036760,
	0x017: 0x00036260,
	0x018: 0x00037890,
	0x019: 0x00036C20,
	0x01B: 0x00036CC0,
	0x01C: 0x00036EF0,
	0x01D: 0x00037A60,
	0x01E: 0x00036160,
	0x01F: 0x00035F80,
	0x020: 0x000380C0,
	0x021: 0x00037BE0,
	0x022: 0x00037D60,
	0x023: 0x00037730,
	0x024: 0x00038610,
	0x025: 0x00036BC0,
	0x027: 0x00036660,
	0x029: 0x00037C40,
	0x02A: 0x000365B0,
	0x02B: 0x00038280,
	0x02C: 0x000385D0,
	0x02F: 0x00036100,
	0x031: 0x000360E0,
	0x032: 0x00037990,
	0x035: 0x00036320,
	0x036: 0x00036480,
	0x037: 0x00037770,
	0x038: 0x00037670,
	0x03B: 0x00036EAD,
	0x041: 0x000372F0,
	0x049: 0x00036AE0,
	0x04A: 0x00037870,
	0x04B: 0x000369D0,
	0x04E: 0x00036BA0,
	0x04F: 0x00036060,
	0x050: 0x00036600,
	0x053: 0x00036040,
	0x056: 0x00035E60,
	0x059: 0x000376D0,
	0x05A: 0x00037AE0,
	0x05C: 0x000370F0,
	0x05D: 0x00036C40,
	0x05F: 0x000360A0,
	0x060: 0x00036FD0,
	0x061: 0x00036820,
	0x062: 0x000378D0,
	0x063: 0x00038240,
	0x064: 0x00035E20,
	0x065: 0x00037E60,
	0x066: 0x000381E0,
	0x068: 0x00037EE0,
	0x069: 0x00037130,
	0x06A: 0x00036420,
	0x071: 0x00037430,
	0x072: 0x00036E00,
	0x074: 0x000385F0,
	0x075: 0x000386D0,
	0x076: 0x00035DE0,
	0x078: 0x00037070,
	0x079: 0x00036ED0,
	0x07A: 0x00037B40,
	0x07C: 0x00036A60,
	0x07D: 0x000372D0,
	0x07E: 0x000381C0,
	0x07F: 0x00036DC0,
	0x080: 0x00037D40,
	0x083: 0x00036D40,
	0x085: 0x00038630,
	0x086: 0x00038460,
	0x087: 0x000377F0,
	0x088: 0x00037570,
	0x089: 0x000367C0,
	0x08A: 0x00035CD0,
	0x08C: 0x00038180,
	0x08D: 0x000372B0,
	0x093: 0x00037510,
	0x0A5: 0x00036000,
	0x0B6: 0x00037FC0,
	0x0B7: 0x00035E40,
	0x0BC: 0x00038020,
	0x0BD: 0x00038420,
	0x0BE: 0x00036DE0,
	0x0BF: 0x000364E0,
	0x0C0: 0x000377B0,
	0x0C2: 0x00036D20,
	0x0C3: 0x00036900,
	0x0C4: 0x00037F40,
	0x0CA: 0x00037D20,
	0x0CB: 0x000373B0,
	0x0CC: 0x00037DC0,
	0x0CE: 0x00036860,
	0x0D1: 0x00036E40,
	0x0E8: 0x00035F00,
	0x0E9: 0x00037370,
	0x0EA: 0x00038390,
	0x0EB: 0x00037F60,
	0x0EC: 0x000366C0,
	0x0ED: 0x00038440,
	0x0EE: 0x000378F0,
	0x0EF: 0x00036A80,
	0x0F0: 0x00037E20,
	0x0F1: 0x00037650,
	0x0F2: 0x00036620,
	0x0F3: 0x000374B0,
	0x0F7: 0x00037EC0,
	0x0FB: 0x000369F9,
	0x0FD: 0x00037A80,
	0x110: 0x00038220,
	0x121: 0x00037930,
	0x122: 0x00036E60,
	0x136: 0x00036B60,
	0x13B: 0x00038040,
	0x144: 0x000366E0,
	0x145: 0x00037B00,
	0x147: 0x000367E0,
	0x148: 0x00037450,
	0x149: 0x00035FA0,
	0x14A: 0x00036E20,
	0x14B: 0x00036C80,
	0x14C: 0x00036220,
	0x14D: 0x00036340,
	0x14E: 0x00036570,
	0x154: 0x00035D30,
	0x155: 0x00035D70,
	0x157: 0x00037C60,
	0x159: 0x00037D80,
	0x15A: 0x000379C0,
	0x16A: 0x00037FA0,
	0x16B: 0x000361E0,
	0x17B: 0x00036180,
	0x188: 0x000362A0,
	0x189: 0x00038710,
	0x18D: 0x00036740,
	0x190: 0x00036300,
	0x191: 0x00037090,
	0x192: 0x00037950,
	0x193: 0x000386F0,
	0x194: 0x00036440,
	0x195: 0x00037E80,
	0x196: 0x00037B60,
	0x197: 0x000362C0,
	0x198: 0x00037B20,
	0x1A0: 0x00038000,
	0x1A1: 0x00037CA0,
	0x1A5: 0x00036964,
	0x1A6: 0x000376B0,
	0x1A7: 0x000377D0,
	0x1AD: 0x000369B0,
	0x1AE: 0x00036080,
	0x1AF: 0x000363E0,
	0x1B0: 0x00036D80,
	0x1B1: 0x00036400,
	0x1B9: 0x00037A40,
	0x1BA: 0x00035D50,
	0x1BB: 0x00036680,
	0x1BC: 0x00037710,
	0x1C6: 0x00035DD0,
	0x1C7: 0x00038140,
	0x1C8: 0x000380A0,
	0x1D0: 0x00037A00,
	0x1D2: 0x00036F90,
	0x1DB: 0x00036720,
	0x1DC: 0x00037850,
	0x1DD: 0x00038120,
	0x1DE: 0x00037C20,
	0x1DF: 0x00036CA0,
	0x1E0: 0x00036700,
	0x1E1: 0x00035CF0,
	0x1E2: 0x00038690,
	0x1E3: 0x00038100,
	0x1E6: 0x00036920,
	0x1E7: 0x00038500,
	0x1E8: 0x00037CC0,
	0x1F3: 0x000360C0,
	0x203: 0x00037790,
	0x20A: 0x000371B0,
	0x214: 0x00037270,
	0x215: 0x00036FF0,
	0x216: 0x000375D0,
	0x217: 0x000364C0,
	0x218: 0x00037310,
	0x21A: 0x00037250,
	0x21B: 0x000366A0,
	0x21C: 0x000375F0,
	0x21D: 0x000371D0,
	0x21E: 0x00037490,
	0x21F: 0x00037C80,
	0x220: 0x00037610,
	0x221: 0x00037BA0,
	0x222: 0x00036990,
	0x223: 0x00037470,
	0x224: 0x00036D60,
	0x225: 0x00036F70,
	0x226: 0x00035F40,
	0x227: 0x00035EC0,
	0x228: 0x000384E0,
	0x229: 0x00037550,
	0x22A: 0x00037B80,
	0x22B: 0x00037810,
	0x22C: 0x000370D0,
	0x22D: 0x00036E80,
	0x22E: 0x00036B80,
	0x22F: 0x00038770,
	0x230: 0x00036640,
	0x233: 0x00036FB0,
	0x234: 0x00036020,
	0x235: 0x00037030,
	0x236: 0x00037050,
	0x237: 0x00037AC0,
	0x23C: 0x000368C0,
	0x249: 0x00037F00,
	0x24A: 0x00036AA0,
	0x24B: 0x00037350,
	0x24C: 0x00035EA0,
	0x24F: 0x000364A0,
	0x250: 0x000367A0,
	0x251: 0x00038260,
	0x252: 0x00037150,
	0x253: 0x00036140,
	0x254: 0x00037FE0,
	0x256: 0x00036F50,
	0x257: 0x000382C0,
	0x258: 0x00035D10,
	0x259: 0x00036880,
	0x25A: 0x00036F10,
	0x25B: 0x00037DA0,
	0x25C: 0x00036380,
	0x25D: 0x00036AC0,
	0x25E: 0x00036280,
	0x25F: 0x000373F0,
	0x260: 0x000386B0,
	0x262: 0x00038750,
	0x263: 0x00036590,
	0x264: 0x000384C0,
	0x265: 0x00035CB0,
	0x267: 0x00037010,
	0x268: 0x000380E0,
	0x269: 0x000376F0,
	0x26A: 0x000373D0,
	0x26B: 0x000361C0,
	0x26C: 0x000362E0,
	0x26E: 0x00035EE0,
	0x26F: 0x00037330,
	0x270: 0x00038730,
	0x271: 0x00037CE0,
	0x272: 0x00036800,
	0x273: 0x00035E80,
	0x274: 0x000374F0,
	0x275: 0x000368A0,
	0x276: 0x000370B0,
	0x278: 0x00038670,
	0x279: 0x00036B40,
	0x27A: 0x00036B00,
	0x27B: 0x00036C00,
	0x27C: 0x00036840,
	0x27D: 0x00037590,
	0x27E: 0x00036940,
	0x27F: 0x00038790,
	0x280: 0x00037910,
	0x281: 0x00036460,
	0x282: 0x00036CE0,
	0x283: 0x00037AA0,
	0x286: 0x000383C0,
	0x287: 0x000375B0,
	0x288: 0x00035F20,
	0x289: 0x00038160,
	0x28C: 0x00035FC0,
	0x28D: 0x00036780,
	0x28E: 0x00036520,
	0x28F: 0x00037F80,
	0x290: 0x00037BC0,
	0x291: 0x00036C60,
	0x292: 0x000363C0,
	0x293: 0x000368E0,
	0x294: 0x00038650,
	0x295: 0x00037E00,
	0x296: 0x00036360,
	0x297: 0x00037190,
	0x298: 0x00036240,
	0x299: 0x00037D00,
	0x29A: 0x00037170,
	0x29B: 0x00036120,
	0x29C: 0x00037830,
	0x29D: 0x000382A0,
	0x29E: 0x000381A0,
	0x29F: 0x00037C00,
	0x2A0: 0x00038060,
	0x2A1: 0x00038200,
	0x2A2: 0x00038080,
	0x2A3: 0x00037110,
	0x2A4: 0x000379E0,
	0x2A5: 0x000374D0,
	0x2A6: 0x00036F30,
	0x2A7: 0x00036500,
	0x2A8: 0x00037230,
	0x2A9: 0x00037A20,
	0x2AA: 0x000361A0,
	0x2AB: 0x00038520,
	0x2AC: 0x00036D00,
	0x2AD: 0x00035F60,
	0x2AE: 0x00035DB0,
	0x2AF: 0x000363A0,
	0x2B0: 0x00036DA0,
	0x2B1: 0x000384A0,
	0x2B2: 0x00037750,
	0x2B3: 0x00037690,
	0x2B4: 0x00037E40,
	0x2B5: 0x00037390,
	0x2B6: 0x000371F0,
	0x2C1: 0x00036200,
	0x2C9: 0x00038480,
	0x2CC: 0x00036A40,
	0x2CD: 0x00037530,
	0x2CE: 0x00036B20,
	0x2CF: 0x00035D90,
	0x2D0: 0x00037DE0,
	0x2D1: 0x00037EA0,
	0x2D2: 0x00035FE0,
	0x2D5: 0x00037630,
};

// Firmware-specific kernel offsets, from 700_dvk_kernel.elf (already the
// unwrapped kernel; the SLB2-wrapped copy is kernel.dec.bin).  Text-relative
// except for the two invariant syscall-stack frame offsets.  Nothing in the
// engine reads these -- allproc is walked at runtime -- so the four Sony
// flag words below are left at 0 rather than guessed.
const OFFSET_KERNEL_STACK_COOKIE                = 0x00000930;
const OFFSET_KERNEL_STACK_SYS_SCHED_YIELD_RET   = 0x00000808;
// kdata_base = text_base + text_size = 0xffffffff80210000 + 0xC50000.
const OFFSET_KERNEL_DATA                        = 0x00C50000;
const OFFSET_KERNEL_SYS_SCHED_YIELD_RET         = 0x00000000; // not derived
// LIST_INIT(&allproc) in procinit() at 0xffffffff8074DEBB -> kdata+0x2859D50.
const OFFSET_KERNEL_ALLPROC                     = 0x034A9D50;
/* Derived 2026-08-25 by rip-relative signature vote against this firmware own
 * x86_kernel.elf (retail I:/americana and devkit I:/EXTRACTED agree).
 * SECURITY_FLAGS voted 0x01718064 from the 7.01, 8.00 and 12.00 anchors, and is
 * independently equal to the 7.01 file value on an identical OFFSET_KERNEL_DATA
 * (0x00C50000), so 7.00 and 7.01 share this kdata layout. TARGETID/QA/UTOKEN follow
 * the fixed in-block deltas +0x09/+0x24/+0x8C that hold on every other firmware. */
const OFFSET_KERNEL_SECURITY_FLAGS              = 0x01718064;
const OFFSET_KERNEL_TARGETID                    = 0x0171806D;
const OFFSET_KERNEL_QA_FLAGS                    = 0x01718088;
const OFFSET_KERNEL_UTOKEN_FLAGS                = 0x017180F0;
// VFS_ROOT(mp, LK_EXCLUSIVE, &rootvnode) at 0xffffffff80E2BCFA -> kdata+0x30C7510.
const OFFSET_KERNEL_ROOTVNODE                   = 0x03D17510;
