/* ═══════════════════════════════════════
   INIT — jeśli token już jest, wejdź od razu
═══════════════════════════════════════ */

// Sync API URL inputs po załadowaniu DOM
document.getElementById('api-base-input').value = API_BASE;
document.getElementById('api-base-input2').value = API_BASE;

if (JWT_TOKEN && CURRENT_USER) {
  enterApp();
}
