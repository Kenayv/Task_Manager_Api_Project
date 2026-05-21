/* ═══════════════════════════════════════
   TASKS STATE
═══════════════════════════════════════ */
let allTasks = [];
let currentView = 'my';    // 'my' | 'shared'
let currentFilter = 'all'; // 'all' | 'todo' | 'inprogress' | 'done'

function setView(v) {
  currentView = v;
  document.getElementById('nav-my').classList.toggle('active', v === 'my');
  document.getElementById('nav-shared').classList.toggle('active', v === 'shared');
  document.getElementById('view-title').textContent = v === 'my' ? 'Moje zadania' : 'Udostępnione mi';
  loadTasks();
}

function setFilter(f) {
  currentFilter = f;
  ['all','todo','inprogress','done'].forEach(x => {
    document.getElementById('filter-' + x).classList.toggle('active', x === f);
  });
  renderTasks();
}

async function loadTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '<div class="loading-row"><div class="spinner"></div> Ładowanie...</div>';
  try {
    /* Endpoints:
       GET /api/Task          → moje zadania → [{ id, title, description, status, createdAt, ... }]
       GET /api/Task/shared   → udostępnione → [{ id, title, description, status, sharedBy, permission, ... }]
       — status powinien być: "todo" | "inprogress" | "done" (lub dostosuj mapowanie poniżej) */
    const endpoint = currentView === 'my' ? '/api/Task' : '/api/Task/shared';
    allTasks = await api('GET', endpoint);
    // Mapowanie statusu — jeśli backend zwraca np. 0/1/2 lub "Todo"/"InProgress"/"Done"
    allTasks = allTasks.map(normalizeTask);
    renderTasks();
  } catch (e) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-icon">⚠</div>
      <div class="empty-title">Błąd połączenia z API</div>
      <div class="empty-sub">${e.message}</div>
    </div>`;
  }
}

/* Normalizacja statusów z backendu */
function normalizeTask(t) {
  const statusMap = {
    0: 'todo', 1: 'inprogress', 2: 'done',
    'Todo': 'todo', 'InProgress': 'inprogress', 'Done': 'done',
    'todo': 'todo', 'inprogress': 'inprogress', 'done': 'done',
    'pending': 'todo', 'in_progress': 'inprogress', 'completed': 'done'
  };
  return { ...t, status: statusMap[t.status] || 'todo' };
}

function renderTasks() {
  const list = document.getElementById('task-list');
  let tasks = allTasks;
  if (currentFilter !== 'all') tasks = tasks.filter(t => t.status === currentFilter);

  if (!tasks.length) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-icon">◻</div>
      <div class="empty-title">Brak zadań</div>
      <div class="empty-sub">Utwórz pierwsze zadanie klikając "+ Nowe zadanie"</div>
    </div>`;
    return;
  }

  list.innerHTML = tasks.map(t => taskCardHTML(t)).join('');
}

const statusLabels = { todo: 'Do zrobienia', inprogress: 'W trakcie', done: 'Gotowe' };
const statusDot    = { todo: 'dot-todo', inprogress: 'dot-inprogress', done: 'dot-done' };
const statusBadge  = { todo: 'badge-todo', inprogress: 'badge-inprogress', done: 'badge-done' };

function taskCardHTML(t) {
  const isShared = currentView === 'shared';
  const canEdit = !isShared || t.permission === 'edit';

  return `<div class="task-card${isShared ? ' shared' : ''}">
    <div class="task-status-dot ${statusDot[t.status] || 'dot-todo'}"></div>
    <div class="task-body">
      <div class="task-title">${esc(t.title)}</div>
      ${t.description ? `<div class="task-desc">${esc(t.description)}</div>` : ''}
      <div class="task-meta">
        <span class="badge ${statusBadge[t.status] || 'badge-todo'}">${statusLabels[t.status] || t.status}</span>
        ${isShared ? `<span class="badge badge-shared">od: ${esc(t.sharedBy || t.ownerName || '?')}</span>` : ''}
        ${isShared && t.permission ? `<span class="badge badge-todo">${t.permission === 'edit' ? 'edycja' : 'odczyt'}</span>` : ''}
      </div>
    </div>
    <div class="task-actions">
      ${canEdit ? `<button class="icon-btn" title="Edytuj" onclick="openEditModal(${t.id})">✎</button>` : ''}
      ${!isShared ? `<button class="icon-btn" title="Udostępnij" onclick="openShareModal(${t.id})">⇋</button>` : ''}
      ${canEdit ? `<button class="icon-btn danger" title="Usuń" onclick="openDeleteModal(${t.id})">✕</button>` : ''}
    </div>
  </div>`;
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ═══════════════════════════════════════
   CREATE / EDIT TASK
═══════════════════════════════════════ */
function openCreateModal() {
  document.getElementById('task-modal-title').textContent = 'Nowe zadanie';
  document.getElementById('edit-task-id').value = '';
  document.getElementById('task-title-input').value = '';
  document.getElementById('task-desc-input').value = '';
  document.getElementById('task-status-input').value = 'todo';
  document.getElementById('task-error').textContent = '';
  openModal('task-modal');
}

function openEditModal(id) {
  const t = allTasks.find(x => x.id === id);
  if (!t) return;
  document.getElementById('task-modal-title').textContent = 'Edytuj zadanie';
  document.getElementById('edit-task-id').value = id;
  document.getElementById('task-title-input').value = t.title || '';
  document.getElementById('task-desc-input').value = t.description || '';
  document.getElementById('task-status-input').value = t.status || 'todo';
  document.getElementById('task-error').textContent = '';
  openModal('task-modal');
}

async function saveTask() {
  const id = document.getElementById('edit-task-id').value;
  const title = document.getElementById('task-title-input').value.trim();
  const description = document.getElementById('task-desc-input').value.trim();
  const deadline = null;
  const errEl = document.getElementById('task-error');
  errEl.textContent = '';

  if (!title) { errEl.textContent = 'Tytuł jest wymagany.'; return; }

  const btn = document.getElementById('save-task-btn');
  btn.disabled = true;
  btn.textContent = 'Zapisywanie...';

  const body = { title, description, deadline };

  try {
    if (id) {
      await api('PUT', `/api/Task/${id}`, body);
      toast('Zadanie zaktualizowane', 'success');
    } else {
      await api('POST', '/api/Task', body);
      toast('Zadanie utworzone', 'success');
    }
    closeModal('task-modal');
    loadTasks();
  } catch (e) {
    errEl.textContent = e.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Zapisz';
  }
}

/* ═══════════════════════════════════════
   SHARE TASK
═══════════════════════════════════════ */
function openShareModal(id) {
  document.getElementById('share-task-id').value = id;
  document.getElementById('share-user-input').value = '';
  document.getElementById('share-permission-input').value = 'read';
  document.getElementById('share-error').textContent = '';
  openModal('share-modal');
}

async function shareTask() {
  const id = document.getElementById('share-task-id').value;
  const userIdentifier = document.getElementById('share-user-input').value.trim();
  const permission = document.getElementById('share-permission-input').value;
  const errEl = document.getElementById('share-error');
  errEl.textContent = '';

  if (!userIdentifier) { errEl.textContent = 'Podaj email lub nazwę użytkownika.'; return; }

  try {
    /* Endpoint: POST /api/Task/{id}/share
       Body: { userIdentifier, permission }
       — dostosuj do swojego API (może być userId, email, username) */
    await api('POST', `/api/Task/${id}/share`, { userIdentifier, permission });
    toast('Zadanie udostępnione', 'success');
    closeModal('share-modal');
  } catch (e) {
    errEl.textContent = e.message;
  }
}

/* ═══════════════════════════════════════
   DELETE TASK
═══════════════════════════════════════ */
function openDeleteModal(id) {
  document.getElementById('delete-task-id').value = id;
  openModal('delete-modal');
}

async function deleteTask() {
  const id = document.getElementById('delete-task-id').value;
  try {
    await api('DELETE', `/Api/Task/${id}`);
    toast('Zadanie usunięte', 'success');
    closeModal('delete-modal');
    loadTasks();
  } catch (e) {
    toast(e.message, 'error');
  }
}
