/*
 * p2jb_lk.js — per-firmware libkernel_web.sprx offsets for rop-worker.js's
 * synchronous fireSync executor. window.P2JB_LK[fw] -> rop_worker.init({lk}).
 *
 * RE'd from I:\EXTRACTED\<fw>\system_b\common\lib\libkernel_web.sprx
 * (E:\ps5\p2jb\lk\lkfind.py). Method VALIDATED: reproduces netctrl's known-good
 * 10.00 offsets exactly (pop_rsp 0x343AA, syscall_wrapper 0x1A5B7, setjmp 0x1CB43,
 * longjmp 0x1CB9C, slot_expect 0x190DB, thread_list 0x64218). Convention: rva =
 * file_off - 0x4000. NO GUESSING — every value is a validated signature match.
 *
 * Signatures:
 *   syscall_wrapper : 49 89 ca 0f 05 c3            (mov r10,rcx; syscall; ret)
 *   setjmp          : 48 89 f9 48 8b 14 24 48 89 11
 *   longjmp         : 48 89 fa 89 f0 48 8b 0a 48 8b 5a 08
 *   slot_expect     : eb 15 4c 89 f7 48 89 de b9 01 00 00 00 31 d2  (cond_wait resume)
 *   thread_list     : lea rax,[rip+X]; mov r15,[rax]; test r15,r15  -> X
 *
 * NOT here:
 *   pop_rsp  — `5C C3` was REMOVED from libkernel_web in 12.xx (whole-file count 0;
 *              present once on 10.00). The adapter supplies the WEBKIT pop rsp
 *              (libSceNKWebKit gadgets["pop rsp"], verified 12.00-12.70) via
 *              W.gadgets.pop_rsp instead. rop-worker g() falls through to it.
 *   slot_off — parked-worker stack offset; a RUNTIME value (stack depth), not in
 *              the module. rop-worker scans the 0x80000 worker stack for the
 *              qword == kbase+slot_expect and uses that offset (no guess).
 *   pthread_next/stack/stacksz — libthr struct fields 0x38/0xA8/0xB0; the thread-
 *              walk head (`4c 8b 38 4d 85 ff`) is byte-identical 10.00..12.70, so
 *              the struct layout is unchanged. rop-worker defaults apply.
 */
// pthread_create = scePthreadCreate export (NID 6UgtwV+0zb4), resolved from the
// libkernel_web dynsym = 0x79B0 on BOTH size groups (12.00..12.70). p2jb's leak-worker
// + elf_run spawn threads through this (4-arg: pthread_t*, attr=NULL, start, arg).
// NOTE: p2jb.js's ORIGINAL setjmp/longjmp/Thrd_create were libc_base+0x58F80/0x58FD0/
// 0x4BF0 — WRONG for this build (0x58F80 lands in FPU-math code -> spawned thread ran
// garbage -> SIGILL/WebProcess crash). setjmp/longjmp are the SIMPLE _setjmp-style in
// libkernel_web (0x1D3B3/0x1D40C, rip@0/rsp@0x10/fpu@0x40, IDA-verified) — same ones
// fireSync uses. libc setjmp@0x5b850 is sigsetjmp (saves sigmask) -> wrong for p2jb's
// manual jmpbuf. The adapter feeds these to p2jb via window.P2JB_SETJMP/LONGJMP/PTHREAD_CREATE.
window.P2JB_LK = {
    // group A: libkernel_web 528364 bytes
    "12.00": { syscall_wrapper: 0x1AE27, setjmp: 0x1D3B3, longjmp: 0x1D40C, pthread_create: 0x79B0, slot_expect: 0x197FB, thread_list: 0x64218 },
    "12.02": { syscall_wrapper: 0x1AE27, setjmp: 0x1D3B3, longjmp: 0x1D40C, pthread_create: 0x79B0, slot_expect: 0x197FB, thread_list: 0x64218 },
    "12.20": { syscall_wrapper: 0x1AE27, setjmp: 0x1D3B3, longjmp: 0x1D40C, pthread_create: 0x79B0, slot_expect: 0x197FB, thread_list: 0x64218 },
    // group B: libkernel_web 544860 bytes
    "12.40": { syscall_wrapper: 0x1AE47, setjmp: 0x1D3D3, longjmp: 0x1D42C, pthread_create: 0x79B0, slot_expect: 0x1981B, thread_list: 0x68218 },
    "12.60": { syscall_wrapper: 0x1AE47, setjmp: 0x1D3D3, longjmp: 0x1D42C, pthread_create: 0x79B0, slot_expect: 0x1981B, thread_list: 0x68218 },
    "12.70": { syscall_wrapper: 0x1AE47, setjmp: 0x1D3D3, longjmp: 0x1D42C, pthread_create: 0x79B0, slot_expect: 0x1981B, thread_list: 0x68218 },
};
