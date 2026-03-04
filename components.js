// =============================================
// REUSABLE UI COMPONENTS
// =============================================

const Icons = {
  dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  folder: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  monitor: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  logout: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  eye: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  back: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  expand: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  key: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
  barChart: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
  link: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  building: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
};

const GROUP_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
  '#f43f5e', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
];

// ---- TOAST ----
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" class="toast-close">${Icons.close}</button>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-show'));
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ---- MODAL ----
function openModal(title, contentHTML, options = {}) {
  closeModal();
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'app-modal';
  const width = options.width || '480px';
  modal.innerHTML = `
    <div class="modal" style="max-width:${width}">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="btn-icon" onclick="closeModal()">${Icons.close}</button>
      </div>
      <div class="modal-body">${contentHTML}</div>
    </div>
  `;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('modal-show'));
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
}

function closeModal() {
  const modal = document.getElementById('app-modal');
  if (modal) {
    modal.classList.remove('modal-show');
    setTimeout(() => modal.remove(), 200);
  }
}

// ---- CONFIRM ----
function confirmAction(message, onConfirm) {
  openModal('Confirmação', `
    <p style="margin-bottom:1.5rem;color:var(--text-secondary)">${message}</p>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-danger" id="confirm-btn">Confirmar</button>
    </div>
  `);
  document.getElementById('confirm-btn').addEventListener('click', () => {
    closeModal();
    onConfirm();
  });
}

// ---- STAT CARD ----
function statCard(icon, label, value, color) {
  return `
    <div class="stat-card" style="--accent:${color}">
      <div class="stat-icon">${Icons[icon]}</div>
      <div class="stat-info">
        <span class="stat-value">${value}</span>
        <span class="stat-label">${label}</span>
      </div>
    </div>
  `;
}

// ---- EMPTY STATE ----
function emptyState(icon, text) {
  return `
    <div class="empty-state">
      <div class="empty-icon">${Icons[icon]}</div>
      <p>${text}</p>
    </div>
  `;
}

// ---- GROUP CARD ----
function groupCard(group, panelCount, isAdmin) {
  const actions = isAdmin ? `
    <div class="card-actions">
      <button class="btn-icon btn-sm" onclick="editGroup('${group.id}')" title="Editar">${Icons.edit}</button>
      <button class="btn-icon btn-sm btn-icon-danger" onclick="deleteGroup('${group.id}')" title="Excluir">${Icons.trash}</button>
    </div>
  ` : '';
  return `
    <div class="card group-card" onclick="navigateTo('group/${group.id}')" style="--card-accent:${group.color}">
      <div class="card-accent"></div>
      <div class="card-header">
        <div class="card-icon" style="background:${group.color}20;color:${group.color}">${Icons.folder}</div>
        <div class="card-title-area">
          <h3 class="card-title">${group.name}</h3>
          <span class="card-subtitle">${panelCount} ${panelCount === 1 ? 'painel' : 'painéis'}</span>
        </div>
        ${actions}
      </div>
      ${group.description ? `<p class="card-desc">${group.description}</p>` : ''}
    </div>
  `;
}

// ---- COMPANY CARD ----
function companyCard(company, groupCount, panelCount, isAdmin) {
  const actions = isAdmin ? `
    <div class="card-actions" onclick="event.stopPropagation()">
      <button class="btn-icon btn-sm" onclick="editCompany('${company.id}')" title="Editar">${Icons.edit}</button>
      <button class="btn-icon btn-sm btn-icon-danger" onclick="deleteCompany('${company.id}')" title="Excluir">${Icons.trash}</button>
    </div>
  ` : '';
  return `
    <div class="card group-card" onclick="navigateTo('company/${company.id}')" style="--card-accent:${company.color}">
      <div class="card-accent"></div>
      <div class="card-header">
        <div class="card-icon" style="background:${company.color}20;color:${company.color}">${Icons.building}</div>
        <div class="card-title-area">
          <h3 class="card-title">${company.name}</h3>
          <span class="card-subtitle">${groupCount} ${groupCount === 1 ? 'grupo' : 'grupos'} &middot; ${panelCount} ${panelCount === 1 ? 'painel' : 'painéis'}</span>
        </div>
        ${actions}
      </div>
      ${company.description ? `<p class="card-desc">${company.description}</p>` : ''}
    </div>
  `;
}

// ---- PANEL CARD ----
function panelCard(panel, isAdmin) {
  const actions = isAdmin ? `
    <div class="card-actions" onclick="event.stopPropagation()">
      <button class="btn-icon btn-sm" onclick="editPanel('${panel.id}')" title="Editar">${Icons.edit}</button>
      <button class="btn-icon btn-sm btn-icon-danger" onclick="deletePanel('${panel.id}')" title="Excluir">${Icons.trash}</button>
    </div>
  ` : '';
  return `
    <div class="card panel-card" onclick="viewPanel('${panel.id}')">
      <div class="panel-thumb">
        ${Icons.barChart}
      </div>
      <div class="card-body">
        <div class="card-header" style="padding:0">
          <div class="card-title-area">
            <h3 class="card-title">${panel.name}</h3>
            ${panel.description ? `<span class="card-subtitle">${panel.description}</span>` : ''}
          </div>
          ${actions}
        </div>
      </div>
    </div>
  `;
}

// ---- SEARCH BAR ----
function searchBar(placeholder, onInput) {
  const id = 'search-' + Date.now();
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', e => onInput(e.target.value));
  }, 50);
  return `
    <div class="search-bar">
      ${Icons.search}
      <input type="text" id="${id}" placeholder="${placeholder}" autocomplete="off">
    </div>
  `;
}
