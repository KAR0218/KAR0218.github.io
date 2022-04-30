window.nameforsyscall = swapkeyval(window.syscallnames);
window.syscalls = {};

/* Get syscall name by index */
function swapkeyval(json) {
  var ret = {};
  for (var key in json) {
    if (json.hasOwnProperty(key)) {
      ret[json[key]] = key;
    }
  }
  return ret;
}

/* A short ass map of system call names -> number, you shouldn't need to touch this */
window.syscallnames = {
  "sys_write": 4,
  "sys_close": 6,
  "sys_setuid": 23,
  "sys_ioctl": 54,
  "sys_mprotect": 74,
  "sys_socket": 97,
  "sys_connect": 98,
  "sys_setsockopt": 105,
  "sys_getsockopt": 118,
  "sys_nanosleep": 240,
  "sys_mlockall": 324,
  "sys_munlockall": 325,
  "sys_kqueue": 362,
  "sys_kevent": 363,
  "sys_mmap": 477,
  "sys_jitshm_create": 533,
  "sys_jitshm_alias": 534,
}