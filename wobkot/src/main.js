const logger = {
  verbose: true,

  init() {
    this.console = document.getElementById('console');
    this.liveLog = document.getElementById('liveLog');
    if (this.liveLog) this.liveLog.textContent = 'Starting WebKit...';
  },
  info(msg) {
    this.log('[+]', msg);
  },
  error(msg) {
    this.log('[-]', msg);
  },
  debug(msg) {
    if (this.verbose) this.log('[*]', msg);
  },
  log(prefix, msg) {
    // Always replace the previous message. Never append or create log history.
    const message = String(msg).replace(/\s+/g, ' ').trim();
    const line = `${prefix} ${message}`;
    if (this.liveLog) {
      this.liveLog.textContent = line;
      this.liveLog.title = line;
    }
  },
};

window.onerror = function (message, source, line, column, error) {
  let msg = message;

  if (error && error.stack) {
    msg += `\n${error.stack}`;
  } else {
    msg += `\n@${source}:${line}:${column}`;
  }

  logger.error(msg);
  return true;
};

window.onunhandledrejection = function (event) {
  const err = event.reason;

  let msg = err && err.message ? err.message : String(err);

  if (err && err.stack) {
    msg += `\n${err.stack}`;
  }

  logger.error(msg);
};

function load_script(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.head.appendChild(script);
  });
}

async function load_file(src) {
  const res = await fetch(src);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${src}`);
  }

  const buf = await res.arrayBuffer();
  return new Uint8Array(buf);
}

async function main() {
  await load_script('src/misc.js');

  version.init();

  if (version.console !== 4) {
    throw new Error(`PS4 only host. Detected PlayStation ${version.console}`);
  }

  await load_script('src/ps4/impl.js');
  await load_script('src/userland.js');
  await userland_main();

  await load_script('src/kernel.js');
  await kernel_main();
}

logger.init();
main();
