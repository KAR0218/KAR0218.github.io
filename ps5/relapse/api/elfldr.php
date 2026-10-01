<?php
/* Reference handler for  GET api/elfldr
 * ------------------------------------------------------------------
 * Connect-tests the requesting console on tcp/9021 and reports whether elfldr is
 * listening, so the payload menu can say "elfldr is not up" once, up front, rather
 * than letting you discover it one failed tile at a time.
 *
 * ps-exploit-host.exe answers this itself (src/http.c). This file is the portable
 * equivalent for any other host. If it is absent the page degrades quietly: the
 * probe fails, the tiles stay enabled, and a click reports the real error.
 *
 * The console is the one making the request, so its address is REMOTE_ADDR.
 */
header('Content-Type: application/json');
header('Cache-Control: no-store');

$PORT = 9021;
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
if (strpos($ip, '::ffff:') === 0) $ip = substr($ip, 7);   // IPv4-mapped IPv6

$up = false;
if ($ip !== '') {
    $sock = @stream_socket_client("tcp://$ip:$PORT", $errno, $errstr, 1.5);
    if ($sock) { $up = true; fclose($sock); }
}
echo json_encode(['up' => $up]);
