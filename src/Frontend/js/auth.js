/* ═══════════════════════════════════════
   AUTH
═══════════════════════════════════════ */
let currentTab = 'login';

function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tab-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('tab-register').style.display = tab === 'register' ? 'block' : 'none';
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register'));
  });
}

async function doLogin() {
  const userEmail = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');
  errEl.textContent = '';

  if (!userEmail || !password) { errEl.textContent = 'Wypełnij wszystkie pola.'; return; }

  btn.disabled = true;
  btn.textContent = 'Logowanie...';
  try {
    /* Endpoint: POST /api/Account/Login
       Body: { email, password }
       Response: { token: "...", user: { id, username, email } }
       — dostosuj klucze do swojego response */
    const data = await api('POST', '/api/Account/Login', {userEmail, password });
    JWT_TOKEN = data.accessToken;   
    CURRENT_USER = data.userName;      
    console.log(JWT_TOKEN);  
    console.log(CURRENT_USER);  
    localStorage.setItem('jwt_token', JWT_TOKEN);
    localStorage.setItem('current_user', JSON.stringify(CURRENT_USER));
    enterApp();
  } catch (e) {
    errEl.textContent = e.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Zaloguj się';
  }
}

async function doRegister() {
  const username = document.getElementById('reg-username').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const errEl = document.getElementById('reg-error');
  const btn = document.getElementById('reg-btn');
  errEl.textContent = '';

  if (!username || !email || !password) { errEl.textContent = 'Wypełnij wszystkie pola.'; return; }
  if (password.length < 6) { errEl.textContent = 'Hasło musi mieć min. 6 znaków.'; return; }

  btn.disabled = true;
  btn.textContent = 'Rejestracja...';
  try {
    /* Endpoint: POST /api/Account/Register
       Body: { username, email, password }
       Response: { token?, user? } lub 204 */
    const data = await api('POST', '/api/Account/Register', { username, email, password });
    if (data?.token) {
      JWT_TOKEN = data.accessToken;
      CURRENT_USER = data.userName;
      localStorage.setItem('jwt_token', JWT_TOKEN);
      localStorage.setItem('current_user', JSON.stringify(CURRENT_USER));
      enterApp();
    } else {
      toast('Konto utworzone! Zaloguj się.', 'success');
      switchTab('login');
    }
  } catch (e) {
    errEl.textContent = e.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Zarejestruj się';
  }
}

function doLogout() {
  JWT_TOKEN = null;
  CURRENT_USER = null;
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('current_user');
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('app-screen').classList.remove('visible');
}

function enterApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app-screen').classList.add('visible');
  const name = CURRENT_USER?.username || CURRENT_USER?.email || 'user';
  document.getElementById('user-display').textContent = '@' + name;
  loadTasks();
}
