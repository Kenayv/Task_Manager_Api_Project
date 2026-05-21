/* ═══════════════════════════════════════
   CONFIG — dostosuj endpoint
═══════════════════════════════════════ */

/*
  Mapowanie endpointów — dopasuj do swojego ASP.NET Core API:
  POST   /api/Account/Register   → rejestracja //FIXME: nie ma tego endpointu
  POST   /api/Account/Login      → login → zwraca { token, user }
  GET    /api/Task           → lista moich zadań
  GET    /api/Task/Shared    → zadania udostępnione mi //FIXME: nie ma tego endpointu
  POST   /api/Task           → utwórz zadanie
  PUT    /api/Task/{id}      → edytuj zadanie
  DELETE /api/Task/{id}      → usuń zadanie
  POST   /api/Task/{id}/Share → udostępnij { userId/email, permission }
*/

let API_BASE = localStorage.getItem('api_base');

if (!API_BASE || API_BASE === 'undefined') {
  API_BASE = 'http://localhost:5279';
}
let JWT_TOKEN = localStorage.getItem('jwt_token') || null;

const storedUser = localStorage.getItem('current_user');

let CURRENT_USER = null;

try {
  CURRENT_USER =
    storedUser && storedUser !== 'undefined'
      ? JSON.parse(storedUser)
      : null;
} catch {
  CURRENT_USER = null;
}
function setApiBase(val) {
  API_BASE = val.replace(/\/$/, '');
  localStorage.setItem('api_base', API_BASE);
  document.getElementById('api-base-input').value = API_BASE;
  document.getElementById('api-base-input2').value = API_BASE;
}
//  const data = await api('POST', '/api/Account/Login', { email, password });
async function api(method, path, body = null, bearerToken = '') {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json'}
  };
  if (JWT_TOKEN) opts.headers['Authorization'] = `Bearer ${JWT_TOKEN}`;
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(API_BASE + path, opts);
  const text = await res.text();

  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { message: text }; }

  if (!res.ok) {
    const msg = data?.message || data?.title || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}
