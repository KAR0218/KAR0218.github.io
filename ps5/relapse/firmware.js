(function () {
  "use strict";

  const SUPPORTED = [
    "13.60", "13.42", "13.40", "13.20", "13.00", "12.70",
    "12.60", "12.40", "12.20", "12.02", "12.00", "11.60",
    "11.20", "11.00", "10.40", "10.20", "10.01", "10.00",
    "9.60", "9.40", "9.20", "9.00", "8.60", "8.40",
    "8.20", "8.00", "7.61", "7.60", "7.40", "7.20",
    "7.01", "7.00",
  ];

  const USER_AGENT_VERSION = /PlayStation 5\/(\d+\.\d+)/;
  const match = USER_AGENT_VERSION.exec(navigator.userAgent);
  const version = match ? match[1] : "";

  // main.js and the exploit read these directly.
  window.fw_str = version;
  window.fw_float = parseFloat(version);
  window.SUPPORTED_FIRMWARES = SUPPORTED.slice();

  window.firmware = {
    version,
    supported: SUPPORTED.slice(),
    isPlayStation: /PlayStation 5/.test(navigator.userAgent),

    /** Human-readable reason this console cannot be used, or null. */
    rejection() {
      if (!this.isPlayStation)
        return (
          "this page only runs on a PlayStation 5 (saw: " +
          navigator.userAgent +
          ")"
        );
      if (!version)
        return (
          "could not read a firmware version out of: " + navigator.userAgent
        );
      if (SUPPORTED.indexOf(version) < 0)
        return (
          "firmware " +
          version +
          " has no offsets. Copy offsets/TEMPLATE.js to" +
          " offsets/" +
          version +
          '.js, fill it in, and add "' +
          version +
          '" to' +
          " SUPPORTED in firmware.js. Present: " +
          SUPPORTED.join(", ")
        );
      return null;
    },
  };
})();
