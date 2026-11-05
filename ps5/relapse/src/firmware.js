"use strict";

const supportedFirmware = [
  "13.60", "13.42", "13.40", "13.20", "13.00",
  "12.70", "12.60", "12.40", "12.20", "12.02", "12.00",
  "11.60", "11.20", "11.00",
  "10.60", "10.40", "10.20", "10.01", "10.00",
  "9.60", "9.40", "9.20", "9.00",
  "8.60", "8.40", "8.20", "8.00",
  "7.61", "7.60", "7.40", "7.20", "7.01", "7.00",
];
const firmwareUserAgent = navigator.userAgent;
const firmwareMatch = /PlayStation 5\/(\d+\.\d+)/.exec(firmwareUserAgent);
const firmwareVersion = firmwareMatch ? firmwareMatch[1] : "";

window.fw_str = firmwareVersion;
window.firmware = {
  rejection() {
    if (!firmwareUserAgent.includes("PlayStation 5")) {
      return "PlayStation 5 Required";
    }

    if (!firmwareVersion) {
      return "FW version not found";
    }

    if (!supportedFirmware.includes(firmwareVersion)) {
      return `FW ${firmwareVersion} is not supported`;
    }

    return null;
  },
};
