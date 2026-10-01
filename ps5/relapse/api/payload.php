<?php
/* Reference handler for  POST api/payload/<name>
 * ------------------------------------------------------------------
 * The ELF tile menu cannot deliver a payload by itself: JavaScript has no raw
 * sockets, and an HTTP POST straight to the console's port 9021 would prepend
 * HTTP headers, so elfldr would not see \x7fELF at offset 0. The page therefore
 * asks the SERVER to open the TCP connection and write the file verbatim.
 *
 * The console is the one making this request, so its address is simply
 * REMOTE_ADDR - no configuration, no hardcoded IP.
 *
 * Drop this next to the site and route  api/payload/<name>  to it. With Apache
 * the .htaccess shipped alongside does that. Reply is the JSON the page expects:
 *     {"ok":true,"bytes":N}
 */
header('Content-Type: application/json');

$PORT       = 9021;
$PAYLOAD_DIR = __DIR__ . '/../payloads';

function fail($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

/* name comes from the URL. Accept ONLY a bare filename of the expected shape -
 * no directories, no traversal - then confirm the resolved path really is inside
 * payloads/ before opening it. */
$name = basename($_SERVER['PATH_INFO'] ?? $_GET['name'] ?? '');
if ($name === '' || !preg_match('/^[A-Za-z0-9._-]+\.(elf|bin)$/', $name))
    fail('bad payload name');

$path = realpath($PAYLOAD_DIR . '/' . $name);
$root = realpath($PAYLOAD_DIR);
if ($path === false || $root === false || strpos($path, $root) !== 0)
    fail('payload not found', 404);

$data = @file_get_contents($path);
if ($data === false || strlen($data) === 0) fail('payload unreadable', 404);

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
if ($ip === '') fail('no client address');
if (strpos($ip, '::ffff:') === 0) $ip = substr($ip, 7);   // IPv4-mapped IPv6

$sock = @stream_socket_client("tcp://$ip:$PORT", $errno, $errstr, 5);
if (!$sock) fail("connect $ip:$PORT failed: $errstr ($errno)", 502);

stream_set_timeout($sock, 15);
$sent = 0; $len = strlen($data);
while ($sent < $len) {
    $n = @fwrite($sock, substr($data, $sent, 65536));
    if ($n === false || $n === 0) { fclose($sock); fail("write failed after $sent bytes", 502); }
    $sent += $n;
}
fclose($sock);

echo json_encode(['ok' => true, 'bytes' => $sent, 'name' => $name, 'to' => "$ip:$PORT"]);
