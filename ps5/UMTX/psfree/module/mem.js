/* Copyright (C) 2023-2024 anonymous

This file is part of PSFree.

PSFree is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

PSFree is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.  */

import { Int, lohi_from_one } from './int64.js';
import { view_m_vector, view_m_length } from './offset.js';

export let mem = null;

// cache some constants
const off_vector = view_m_vector / 4;
const off_vector2 = (view_m_vector + 4) / 4;
const isInteger = Number.isInteger;

function init_module(memory) {
    mem = memory;
}

function add_and_set_addr(mem, offset, base_lo, base_hi) {
    const values = lohi_from_one(offset);
    const main = mem._main;

    const low = base_lo + values[0];

    // no need to use ">>> 0" to convert to unsigned here
    main[off_vector] = low;
    main[off_vector2] = base_hi + values[1] + (low > 0xffffffff);
}

export class Addr extends Int {
    read8(offset) {
        const m = mem;
        if (isInteger(offset) && 0 <= offset && offset <= 0xffffffff) {
            m._set_addr_direct(this);
        } else {
            add_and_set_addr(m, offset, this.low, this.high);
            offset = 0;
        }

        return m.read8_at(offset);
    }

    read16(offset) {
        const m = mem;
        if (isInteger(offset) && 0 <= offset && offset <= 0xffffffff) {
            m._set_addr_direct(this);
        } else {
            add_and_set_addr(m, offset, this.low, this.high);
            offset = 0;
        }

        return m.read16_at(offset);
    }

    read32(offset) {
        const m = mem;
        if (isInteger(offset) && 0 <= offset && offset <= 0xffffffff) {
            m._set_addr_direct(this);
        } else {
            add_and_set_addr(m, offset, this.low, this.high);
            offset = 0;
        }

        return m.read32_at(offset);
    }

    read64(offset) {
        const m = mem;
        if (isInteger(offset) && 0 <= offset && offset <= 0xffffffff) {
            m._set_addr_direct(this);
        } else {
            add_and_set_addr(m, offset, this.low, this.high);
            offset = 0;
        }

        return m.read64_at(offset);
    }

    readp(offset) {
        const m = mem;
        if (isInteger(offset) && 0 <= offset && offset <= 0xffffffff) {
            m._set_addr_direct(this);
        } else {
            add_and_set_addr(m, offset, this.low, this.high);
            offset = 0;
        }

        return m.readp_at(offset);
    }

    write8(offset, value) {
        const m = mem;
        if (isInteger(offset) && 0 <= offset && offset <= 0xffffffff) {
            m._set_addr_direct(this);
        } else {
            add_and_set_addr(m, offset, this.low, this.high);
            offset = 0;
        }

        m.write8_at(offset, value);
    }

    write16(offset, value) {
        const m = mem;
        if (isInteger(offset) && 0 <= offset && offset <= 0xffffffff) {
            m._set_addr_direct(this);
        } else {
            add_and_set_addr(m, offset, this.low, this.high);
            offset = 0;
        }

        m.write16_at(offset, value);
    }

    write32(offset, value) {
        const m = mem;
        if (isInteger(offset) && 0 <= offset && offset <= 0xffffffff) {
            m._set_addr_direct(this);
        } else {
            add_and_set_addr(m, offset, this.low, this.high);
            offset = 0;
        }

        m.write32_at(offset, value);
    }

    write64(offset, value) {
        const m = mem;
        if (isInteger(offset) && 0 <= offset && offset <= 0xffffffff) {
            m._set_addr_direct(this);
        } else {
            add_and_set_addr(m, offset, this.low, this.high);
            offset = 0;
        }

        m.write64_at(offset, value);
    }
}

// expected:
// * main - Uint32Array whose m_vector points to worker
// * worker - DataView
//
// addrof() expectations:
// * obj - we will store objects at .addr
// * addr_addr - Int where to read out the address. the address used to store
//   the value of .addr
//
// the relative read/write methods expect the offset to be a unsigned 32-bit
// integer
export class Memory {
    constructor(main, worker, obj, addr_addr)  {
        this._main = main;
        this._worker = worker;
        this._obj = obj;
        this._addr_low = addr_addr.low;
        this._addr_high = addr_addr.high;

        main[view_m_length / 4] = 0xffffffff;

        init_module(this);
    }

    addrof(object) {
        // typeof considers null as a object. blacklist it as it isn't a
        // JSObject
        if ((typeof object !== 'object' || object === null)
            && typeof object !== 'function'
        ) {
            throw TypeError('argument not a JS object');
        }

        const obj = this._obj;
        const worker = this._worker;
        const main = this._main;

        obj.addr = object;

        main[off_vector] = this._addr_low;
        main[off_vector2] = this._addr_high;

        const res = new Addr(
            worker.getUint32(0, true),
            worker.getUint32(4, true),
        );
        obj.addr = null;

        return res;
    }

    // expects addr to be a Int
    _set_addr_direct(addr) {
        const main = this._main;
        main[off_vector] = addr.low;
        main[off_vector2] = addr.high;
    }

    set_addr(addr) {
        const values = lohi_from_one(addr);
        const main = this._main;
        main[off_vector] = values[0];
        main[off_vector2] = values[1];
    }

    get_addr() {
        return new Addr(main[off_vector], main[off_vector2]);
    }

    read8(addr) {
        this.set_addr(addr);
        return this._worker.getUint8(0);
    }

    read16(addr) {
        this.set_addr(addr);
        return this._worker.getUint16(0, true);
    }

    read32(addr) {
        this.set_addr(addr);
        return this._worker.getUint32(0, true);
    }

    read64(addr) {
        this.set_addr(addr);
        const worker = this._worker;
        return new Int(worker.getUint32(0, true), worker.getUint32(4, true));
    }

    // returns a pointer instead of an Int
    readp(addr) {
        this.set_addr(addr);
        const worker = this._worker;
        return new Addr(worker.getUint32(0, true), worker.getUint32(4, true));
    }

    read8_at(offset) {
        if (!isInteger(offset)) {
            throw TypeError('offset not a integer');
        }
        return this._worker.getUint8(offset);
    }

    read16_at(offset) {
        if (!isInteger(offset)) {
            throw TypeError('offset not a integer');
        }
        return this._worker.getUint16(offset, true);
    }

    read32_at(offset) {
        if (!isInteger(offset)) {
            throw TypeError('offset not a integer');
        }
        return this._worker.getUint32(offset, true);
    }

    read64_at(offset) {
        if (!isInteger(offset)) {
            throw TypeError('offset not a integer');
        }
        const worker = this._worker;
        return new Int(
            worker.getUint32(offset, true),
            worker.getUint32(offset + 4, true),
        );
    }

    readp_at(offset) {
        if (!isInteger(offset)) {
            throw TypeError('offset not a integer');
        }
        const worker = this._worker;
        return new Addr(
            worker.getUint32(offset, true),
            worker.getUint32(offset + 4, true),
        );
    }

    // writes using 0 as a base address don't work because we are using a
    // DataView as a worker. work around this by doing something like "new
    // Addr(-1, -1).write8(1, 0)"
    //
    // see setIndex() from
    // WebKit/Source/JavaScriptCore/runtime/JSGenericTypedArrayView.h at PS4
    // 8.00

    write8(addr, value) {
        this.set_addr(addr);
        this._worker.setUint8(0, value);
    }

    write16(addr, value) {
        this.set_addr(addr);
        this._worker.setUint16(0, value, true);
    }

    write32(addr, value) {
        this.set_addr(addr);
        this._worker.setUint32(0, value, true);
    }

    write64(addr, value) {
        const values = lohi_from_one(value);
        this.set_addr(addr);
        const worker = this._worker;
        worker.setUint32(0, values[0], true);
        worker.setUint32(4, values[1], true);
    }

    write8_at(offset, value) {
        if (!isInteger(offset)) {
            throw TypeError('offset not a integer');
        }
        this._worker.setUint8(offset, value);
    }

    write16_at(offset, value) {
        if (!isInteger(offset)) {
            throw TypeError('offset not a integer');
        }
        this._worker.setUint16(offset, value, true);
    }

    write32_at(offset, value) {
        if (!isInteger(offset)) {
            throw TypeError('offset not a integer');
        }
        this._worker.setUint32(offset, value, true);
    }

    write64_at(offset, value) {
        if (!isInteger(offset)) {
            throw TypeError('offset not a integer');
        }
        const values = lohi_from_one(value);
        const worker = this._worker;
        worker.setUint32(offset, values[0], true);
        worker.setUint32(offset + 4, values[1], true);
    }
}
