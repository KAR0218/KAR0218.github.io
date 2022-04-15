var payload = PLS;

window.mira_blob_2_len = PLS.length;
window.mira_blob_2 = malloc(window.mira_blob_2_len);
write_mem(window.mira_blob_2, payload);