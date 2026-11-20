(function () {
  "use strict";

  const PORT = 9021;
  const CHUNK_SIZE = 0x4000;
  let initialized = false;
  let connectSyscall = null;

  function setProgress(message) {
    const element = document.getElementById("payloadProgress");
    if (element) element.textContent = message;
  }

  function log(message, type) {
    if (type === "error") logger.error(message);
    else logger.info(message);
  }

  function buildMenu() {
    const view = document.getElementById("payloads-view");
    const grid = view && view.querySelector(".payloadGrid");
    if (!view || !grid) throw new Error("Payload menu elements are missing");

    if (grid.children.length) return view;

    const tiles = window.PAYLOAD_TILES;
    if (!Array.isArray(tiles) || tiles.length === 0) {
      throw new Error("payloads.js did not provide PAYLOAD_TILES");
    }

    for (const tile of tiles) {
      const item = document.createElement("a");
      item.href = "#";
      item.className = "btn payloadTile";
      item.tabIndex = 0;

      const title = document.createElement("span");
      title.className = "payload-btn-title";
      title.textContent = tile.title || tile.name;

      const description = document.createElement("span");
      description.className = "payload-btn-description";
      description.textContent = tile.description || "";

      const info = document.createElement("span");
      info.className = "payload-btn-info";
      info.textContent = tile.info || tile.name;

      item.append(title, description, info);
      item.addEventListener("click", async function (event) {
        event.preventDefault();
        if (item.classList.contains("busy")) return;

        item.classList.remove("sent", "failed");
        item.classList.add("busy");
        setProgress("Sending " + (tile.title || tile.name) + "...");

        try {
          const byteCount = await sendPayload(tile.name);
          item.classList.remove("busy", "failed");
          item.classList.add("sent");
          setProgress("Sent " + (tile.title || tile.name) + " · " + byteCount + " bytes");
          log((tile.title || tile.name) + ": sent " + byteCount + " bytes to 127.0.0.1:" + PORT, "success");
        } catch (error) {
          item.classList.remove("busy", "sent");
          item.classList.add("failed");
          const message = error && error.message ? error.message : String(error);
          setProgress("Failed to send " + (tile.title || tile.name) + ": " + message);
          log((tile.title || tile.name) + ": " + message, "error");
        }
      });

      grid.appendChild(item);
    }

    return view;
  }

  function showMenu() {
    const view = buildMenu();
    const consoleView = document.getElementById("console-view");
    if (consoleView) consoleView.classList.remove("selected");
    view.classList.add("selected");
    document.body.classList.add("payload-view-active");

    // Remove the pre-menu scrolling log history. From this point onward,
    // logger.info/error writes only the newest line into payloadNetworkStatus.
    const oldLog = document.getElementById("scr");
    if (oldLog) oldLog.textContent = "";
    if (logger && logger.console) logger.console.textContent = "";

    const status = document.getElementById("payloadNetworkStatus");
    if (status) {
      status.textContent = "ELF Loader target · 127.0.0.1:" + PORT;
      status.title = status.textContent;
    }
    setProgress("Select a payload to send it to the ELF loader.");
    log("Jailbreak stage completed · Payload Manager ready", "success");
  }

  async function sendPayload(name) {
    if (typeof name !== "string" || !name || name.includes("/") || name.includes("\\")) {
      throw new Error("Invalid payload filename");
    }

    const bytes = await load_file("payloads/" + encodeURIComponent(name));
    if (bytes.length < 4 ||
        bytes[0] !== 0x7f || bytes[1] !== 0x45 ||
        bytes[2] !== 0x4c || bytes[3] !== 0x46) {
      throw new Error(name + " is not a valid ELF file");
    }

    // Keep the Uint8Array alive while its backing memory is passed to write().
    const payloadAddress = bytes.buffer.data();
    const sockaddr = mem.alloc(16);
    const view = arw.view(sockaddr);
    view.setUint8(0, 16);                 // sin_len
    view.setUint8(1, 2);                  // AF_INET
    view.setUint16(2, 0x3d23, true);       // htons(9021)
    view.setUint32(4, 0x0100007f, true);   // 127.0.0.1

    let fd = -1;
    try {
      fd = fn.socket.invoke(2, 1, 0);     // AF_INET, SOCK_STREAM
      if (fd < 0) throw new SyscallError("socket() failed");

      if (!connectSyscall) connectSyscall = new NativeFunction(0x62, "number");
      if (connectSyscall.invoke(fd, sockaddr, 16) === -1) {
        throw new SyscallError("connect() to ELF Loader port " + PORT + " failed");
      }

      let offset = 0;
      while (offset < bytes.length) {
        const amount = Math.min(CHUNK_SIZE, bytes.length - offset);
        const written = fn.write.invoke(fd, payloadAddress.add(offset), amount).i;
        if (written <= 0) {
          throw new SyscallError("write() failed while sending " + name);
        }
        offset += written;
      }

      return bytes.length;
    } finally {
      if (fd >= 0) {
        try { fn.close.invoke(fd); } catch (error) {}
      }
      try { mem.free(sockaddr); } catch (error) {}
    }
  }

  async function initialize() {
    if (initialized) return;
    showMenu();
    initialized = true;
  }

  window.WobkotPayloadManager = {
    initialize,
    sendPayload
  };
})();
