let my_worker = this;

self.onmessage = function (event) {
    self.postMessage(1);
}