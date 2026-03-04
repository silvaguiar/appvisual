// =============================================
// APP.JS — Main Application (SPA Router + Pages)
// =============================================

let currentRoute = '';

// ---- ROUTER ----
function navigateTo(route) {
  window.location.hash = route;
}

function getRoute() {
  return window.location.hash.slice(1) || 'dashboard';
}

async function handleRoute() {
  const route = getRoute();
  if (route === currentRoute) return;
  currentRoute = route;

  if (!Auth.isLoggedIn()) {
    renderLogin();
    return;
  }

  // Check if user is pending approval
  if (Auth.isPending()) {
    renderPending();
    return;
  }

  const [page, ...params] = route.split('/');
  updateActiveNav(page);

  switch (page) {
    case 'dashboard': await renderDashboard(); break;
    case 'companies': await renderCompanies(); break;
    case 'company': await renderCompanyDetail(params[0]); break;
    case 'group': await renderGroupDetail(params[0]); break;
    case 'users':
      if (Auth.isAdmin()) await renderUsers();
      else navigateTo('dashboard');
      break;
    case 'permissions':
      if (Auth.isAdmin()) await renderPermissions();
      else navigateTo('dashboard');
      break;
    case 'panel': await viewPanel(params[0]); break;
    default: await renderDashboard();
  }
}

// ---- RENDER LOGIN ----
function renderLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="login-wrapper">
      <div class="login-box">
        <div class="login-logo">
          <div class="logo-icon">${Icons.barChart}</div>
          <h1>App BI</h1>
          <p>Gerenciador de Painéis Power BI</p>
        </div>
        <div class="login-error" id="login-error"></div>
        <div class="login-success" id="login-success"></div>
        <form id="login-form">
          <div class="form-group">
            <label>E-mail</label>
            <input type="email" class="form-input" id="login-email" placeholder="seu@email.com" autocomplete="email" required>
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input type="password" class="form-input" id="login-pass" placeholder="Digite sua senha" autocomplete="current-password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:0.5rem" id="login-btn">
            Entrar
          </button>
        </form>
        <div style="text-align:center;margin-top:1rem">
          <button type="button" class="btn-link" onclick="showForgotPassword()" id="forgot-link"
            style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:0.85rem;font-family:inherit">
            Esqueci minha senha
          </button>
        </div>
        <form id="forgot-form" style="display:none">
          <div class="form-group">
            <label>E-mail cadastrado</label>
            <input type="email" class="form-input" id="forgot-email" placeholder="seu@email.com" autocomplete="email" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:0.5rem" id="forgot-btn">
            Enviar link de recuperação
          </button>
          <div style="text-align:center;margin-top:0.75rem">
            <button type="button" class="btn-link" onclick="showLoginForm()"
              style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:0.85rem;font-family:inherit">
              ← Voltar ao login
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;
    const errorEl = document.getElementById('login-error');
    const successEl = document.getElementById('login-success');
    const btn = document.getElementById('login-btn');
    btn.disabled = true; btn.textContent = 'Entrando...';
    errorEl.classList.remove('show');
    successEl.classList.remove('show');
    try {
      await Auth.login(email, pass);
      if (Auth.isPending()) {
        renderPending();
        return;
      }
      currentRoute = '';
      navigateTo('dashboard');
      renderApp();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.add('show');
      btn.disabled = false; btn.textContent = 'Entrar';
    }
  });

  document.getElementById('forgot-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    const errorEl = document.getElementById('login-error');
    const successEl = document.getElementById('login-success');
    const btn = document.getElementById('forgot-btn');
    btn.disabled = true; btn.textContent = 'Enviando...';
    errorEl.classList.remove('show');
    successEl.classList.remove('show');
    try {
      const { error } = await db.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname,
      });
      if (error) throw new Error(error.message);
      successEl.textContent = 'Link de recuperação enviado para seu e-mail!';
      successEl.classList.add('show');
      btn.disabled = false; btn.textContent = 'Enviar link de recuperação';
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.add('show');
      btn.disabled = false; btn.textContent = 'Enviar link de recuperação';
    }
  });
}

function showForgotPassword() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('forgot-link').style.display = 'none';
  document.getElementById('forgot-form').style.display = '';
  document.getElementById('login-error').classList.remove('show');
  document.getElementById('login-success').classList.remove('show');
}

function showLoginForm() {
  document.getElementById('login-form').style.display = '';
  document.getElementById('forgot-link').style.display = '';
  document.getElementById('forgot-form').style.display = 'none';
  document.getElementById('login-error').classList.remove('show');
  document.getElementById('login-success').classList.remove('show');
}

// ---- PENDING APPROVAL SCREEN ----
function renderPending() {
  const session = Auth.getSession();
  const name = session ? session.name : 'Usuário';
  document.getElementById('app').innerHTML = `
    <div class="login-wrapper">
      <div class="login-box" style="text-align:center">
        <div class="login-logo">
          <div class="logo-icon" style="background:linear-gradient(135deg, #f59e0b, #ef4444)">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h1>Aguardando Aprovação</h1>
        </div>
        <div style="color:var(--text-secondary);margin-bottom:1.5rem;line-height:1.6">
          <p>Olá, <strong style="color:var(--text-primary)">${name}</strong>!</p>
          <p style="margin-top:0.75rem">Sua conta foi criada com sucesso. Um administrador precisa aprovar seu acesso antes que você possa utilizar o sistema.</p>
          <p style="margin-top:0.75rem;font-size:0.82rem;color:var(--text-muted)">Você receberá acesso assim que sua conta for aprovada.</p>
        </div>
        <button class="btn btn-ghost" style="width:100%;justify-content:center" onclick="doLogout()">
          ${Icons.logout} Voltar ao Login
        </button>
      </div>
    </div>
  `;
}

// ---- RENDER APP SHELL ----
function renderApp() {
  if (!Auth.isLoggedIn()) { renderLogin(); return; }
  if (Auth.isPending()) { renderPending(); return; }
  const session = Auth.getSession();
  const isAdmin = session.role === 'admin';
  const initials = session.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  document.getElementById('app').innerHTML = `
    <button class="mobile-toggle" onclick="toggleSidebar()">${Icons.menu}</button>
    <div class="app-layout">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="logo-sm">${Icons.barChart}</div>
          <h2>App BI</h2>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-section">
            <div class="nav-section-title">Menu</div>
            <div class="nav-item" data-nav="dashboard" onclick="navigateTo('dashboard')">${Icons.dashboard} <span>Dashboard</span></div>
            <div class="nav-item" data-nav="companies" onclick="navigateTo('companies')">${Icons.building} <span>Empresas</span></div>
          </div>
          ${isAdmin ? `
          <div class="nav-section">
            <div class="nav-section-title">Administração</div>
            <div class="nav-item" data-nav="users" onclick="navigateTo('users')">${Icons.users} <span>Usuários</span></div>
            <div class="nav-item" data-nav="permissions" onclick="navigateTo('permissions')">${Icons.shield} <span>Permissões</span></div>
          </div>` : ''}
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">${initials}</div>
            <div class="user-details">
              <div class="user-name">${session.name}</div>
              <div class="user-role">${isAdmin ? 'Administrador' : 'Usuário'}</div>
            </div>
          </div>
          <button class="btn-logout" onclick="doLogout()">${Icons.logout} <span>Sair</span></button>
        </div>
      </aside>
      <main class="main-content" id="main-content"></main>
    </div>
  `;
  currentRoute = '';
  handleRoute();
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

function updateActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.nav === page ||
      (page === 'company' && el.dataset.nav === 'companies') ||
      (page === 'group' && el.dataset.nav === 'companies'));
  });
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('open');
}

async function doLogout() {
  await Auth.logout();
  currentRoute = '';
  navigateTo('');
  renderLogin();
}

// ---- DASHBOARD ----
async function renderDashboard() {
  const mc = document.getElementById('main-content');
  mc.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:50vh;color:var(--text-muted)">Carregando...</div>';
  const isAdmin = Auth.isAdmin();
  const session = Auth.getSession();
  const [allCompanies, allGroups, allPanels] = await Promise.all([
    CompanyStore.getAll(), GroupStore.getAll(), PanelStore.getAll()
  ]);
  const allUsers = isAdmin ? await UserStore.getAll() : [];

  let companies, groups, panels;
  if (isAdmin) {
    companies = allCompanies; groups = allGroups; panels = allPanels;
  } else {
    companies = await PermissionStore.getCompaniesForUser(session.userId);
    groups = await PermissionStore.getGroupsForUser(session.userId);
    const gIds = new Set(groups.map(g => g.id));
    panels = allPanels.filter(p => gIds.has(p.group_id));
  }

  mc.innerHTML = `
    <div class="fade-in">
      <div class="page-header"><div class="page-header-top"><div>
        <h1>Dashboard</h1>
        <p class="breadcrumb">Bem-vindo, <span>${session.name}</span></p>
      </div></div></div>
      <div class="page-body">
        <div class="stats-grid">
          ${statCard('building', 'Empresas', companies.length, '#6366f1')}
          ${statCard('folder', 'Grupos', groups.length, '#a855f7')}
          ${statCard('monitor', 'Painéis', panels.length, '#22c55e')}
          ${isAdmin ? statCard('users', 'Usuários', allUsers.length, '#f59e0b') : ''}
        </div>
        ${companies.length > 0 ? `
          <div class="section-title">${Icons.building} Empresas</div>
          <div class="cards-grid">
            ${companies.slice(0, 6).map(c => {
    const gc = allGroups.filter(g => g.company_id === c.id).length;
    const pc = allPanels.filter(p => allGroups.some(g => g.id === p.group_id && g.company_id === c.id)).length;
    return companyCard(c, gc, pc, isAdmin);
  }).join('')}
          </div>
        ` : emptyState('building', 'Nenhuma empresa cadastrada')}
      </div>
    </div>
  `;
}

// ---- COMPANIES PAGE ----
async function renderCompanies() {
  const mc = document.getElementById('main-content');
  mc.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:50vh;color:var(--text-muted)">Carregando...</div>';
  const isAdmin = Auth.isAdmin();
  const session = Auth.getSession();
  const [allGroups, allPanels] = await Promise.all([GroupStore.getAll(), PanelStore.getAll()]);
  let companies = isAdmin ? await CompanyStore.getAll() : await PermissionStore.getCompaniesForUser(session.userId);

  // Store for filter reuse
  window._cacheCompanies = companies;
  window._cacheGroups = allGroups;
  window._cachePanels = allPanels;

  mc.innerHTML = `
    <div class="fade-in">
      <div class="page-header"><div class="page-header-top">
        <h1>Empresas</h1>
        ${isAdmin ? `<button class="btn btn-primary" onclick="openCompanyModal()">${Icons.plus} Nova Empresa</button>` : ''}
      </div></div>
      <div class="page-body">
        <div class="toolbar">${searchBar('Buscar empresas...', filterCompanies)}</div>
        <div class="cards-grid" id="companies-container">
          ${renderCompanyCards(companies, allGroups, allPanels, isAdmin)}
        </div>
      </div>
    </div>
  `;
}

function renderCompanyCards(companies, allGroups, allPanels, isAdmin) {
  if (companies.length === 0) return emptyState('building', 'Nenhuma empresa encontrada');
  return companies.map(c => {
    const gc = allGroups.filter(g => g.company_id === c.id).length;
    const pc = allPanels.filter(p => allGroups.some(g => g.id === p.group_id && g.company_id === c.id)).length;
    return companyCard(c, gc, pc, isAdmin);
  }).join('');
}

function filterCompanies(query) {
  let companies = window._cacheCompanies || [];
  if (query) {
    const q = query.toLowerCase();
    companies = companies.filter(c => c.name.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q));
  }
  document.getElementById('companies-container').innerHTML =
    renderCompanyCards(companies, window._cacheGroups || [], window._cachePanels || [], Auth.isAdmin());
}

async function openCompanyModal(companyId) {
  const company = companyId ? await CompanyStore.getById(companyId) : null;
  const title = company ? 'Editar Empresa' : 'Nova Empresa';
  const selectedColor = company ? company.color : GROUP_COLORS[0];
  const colorsHTML = GROUP_COLORS.map(c => `
    <div class="color-option ${c === selectedColor ? 'selected' : ''}" style="background:${c}" onclick="selectCompanyColor(this, '${c}')" data-color="${c}">${Icons.check}</div>
  `).join('');

  openModal(title, `
    <form id="company-form">
      <div class="form-group"><label>Nome da Empresa</label>
        <input type="text" class="form-input" id="company-name" value="${company ? company.name : ''}" placeholder="Ex: Empresa XYZ" required></div>
      <div class="form-group"><label>Descrição</label>
        <textarea class="form-textarea" id="company-desc" placeholder="Descrição opcional">${company ? company.description : ''}</textarea></div>
      <div class="form-group"><label>Cor</label>
        <div class="color-options">${colorsHTML}</div>
        <input type="hidden" id="company-color" value="${selectedColor}"></div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn-primary">${company ? 'Salvar' : 'Criar Empresa'}</button>
      </div>
    </form>
  `);

  document.getElementById('company-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('company-name').value.trim();
    const description = document.getElementById('company-desc').value.trim();
    const color = document.getElementById('company-color').value;
    if (!name) return;
    try {
      if (company) { await CompanyStore.update(company.id, { name, description, color }); showToast('Empresa atualizada!'); }
      else { await CompanyStore.create({ name, description, color }); showToast('Empresa criada!'); }
      closeModal(); currentRoute = ''; handleRoute();
    } catch (err) { showToast(err.message, 'error'); }
  });
}

function selectCompanyColor(el, color) {
  document.querySelectorAll('.color-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('company-color').value = color;
}

function editCompany(id) { event.stopPropagation(); openCompanyModal(id); }

async function deleteCompany(id) {
  event.stopPropagation();
  const company = await CompanyStore.getById(id);
  confirmAction(`Excluir empresa <strong>"${company.name}"</strong> e todos os dados?`, async () => {
    await CompanyStore.delete(id); showToast('Empresa excluída'); currentRoute = ''; handleRoute();
  });
}

// ---- COMPANY DETAIL (groups) ----
async function renderCompanyDetail(companyId) {
  const mc = document.getElementById('main-content');
  mc.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:50vh;color:var(--text-muted)">Carregando...</div>';
  const company = await CompanyStore.getById(companyId);
  const isAdmin = Auth.isAdmin();
  if (!company) { navigateTo('companies'); return; }
  if (!isAdmin && !(await PermissionStore.userHasCompany(Auth.getSession().userId, companyId))) { navigateTo('companies'); return; }

  let groups = isAdmin
    ? await GroupStore.getByCompany(companyId)
    : await PermissionStore.getGroupsForUserInCompany(Auth.getSession().userId, companyId);
  const allPanels = await PanelStore.getAll();

  window._cacheDetailGroups = groups;
  window._cacheDetailPanels = allPanels;

  mc.innerHTML = `
    <div class="fade-in">
      <div class="page-header"><div>
        <button class="btn-back" onclick="navigateTo('companies')">${Icons.back} Voltar</button>
        <div class="page-header-top" style="margin-top:0.75rem">
          <h1 style="display:flex;align-items:center;gap:0.5rem">
            <span style="color:${company.color}">${Icons.building}</span> ${company.name}
          </h1>
          ${isAdmin ? `<button class="btn btn-primary" onclick="openGroupModal('${companyId}')">${Icons.plus} Novo Grupo</button>` : ''}
        </div>
        ${company.description ? `<p class="breadcrumb">${company.description}</p>` : ''}
      </div></div>
      <div class="page-body">
        <div class="toolbar">${searchBar('Buscar grupos...', (q) => filterGroupsInCompany(companyId, q))}</div>
        <div class="cards-grid" id="groups-container">
          ${groups.length > 0 ? groups.map(g => groupCard(g, allPanels.filter(p => p.group_id === g.id).length, isAdmin)).join('') : emptyState('folder', 'Nenhum grupo nesta empresa')}
        </div>
      </div>
    </div>
  `;
}

function filterGroupsInCompany(companyId, query) {
  let groups = window._cacheDetailGroups || [];
  const panels = window._cacheDetailPanels || [];
  if (query) {
    const q = query.toLowerCase();
    groups = groups.filter(g => g.name.toLowerCase().includes(q) || (g.description || '').toLowerCase().includes(q));
  }
  document.getElementById('groups-container').innerHTML = groups.length > 0
    ? groups.map(g => groupCard(g, panels.filter(p => p.group_id === g.id).length, Auth.isAdmin())).join('')
    : emptyState('folder', 'Nenhum grupo encontrado');
}

async function openGroupModal(companyId, groupId) {
  const group = groupId ? await GroupStore.getById(groupId) : null;
  const title = group ? 'Editar Grupo' : 'Novo Grupo';
  const selectedColor = group ? group.color : GROUP_COLORS[0];
  const colorsHTML = GROUP_COLORS.map(c => `
    <div class="color-option ${c === selectedColor ? 'selected' : ''}" style="background:${c}" onclick="selectGroupColor(this, '${c}')">${Icons.check}</div>
  `).join('');

  openModal(title, `
    <form id="group-form">
      <div class="form-group"><label>Nome do Grupo</label>
        <input type="text" class="form-input" id="group-name" value="${group ? group.name : ''}" placeholder="Ex: Financeiro" required></div>
      <div class="form-group"><label>Descrição</label>
        <textarea class="form-textarea" id="group-desc" placeholder="Descrição opcional">${group ? group.description : ''}</textarea></div>
      <div class="form-group"><label>Cor</label>
        <div class="color-options">${colorsHTML}</div>
        <input type="hidden" id="group-color" value="${selectedColor}"></div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn-primary">${group ? 'Salvar' : 'Criar Grupo'}</button>
      </div>
    </form>
  `);

  document.getElementById('group-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('group-name').value.trim();
    const description = document.getElementById('group-desc').value.trim();
    const color = document.getElementById('group-color').value;
    if (!name) return;
    try {
      if (group) { await GroupStore.update(group.id, { name, description, color }); showToast('Grupo atualizado!'); }
      else { await GroupStore.create({ name, description, color, companyId }); showToast('Grupo criado!'); }
      closeModal(); currentRoute = ''; handleRoute();
    } catch (err) { showToast(err.message, 'error'); }
  });
}

function selectGroupColor(el, color) {
  document.querySelectorAll('.color-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('group-color').value = color;
}

async function editGroup(id) {
  event.stopPropagation();
  const group = await GroupStore.getById(id);
  if (group) openGroupModal(group.company_id, id);
}

async function deleteGroup(id) {
  event.stopPropagation();
  const group = await GroupStore.getById(id);
  confirmAction(`Excluir grupo <strong>"${group.name}"</strong>?`, async () => {
    await GroupStore.delete(id); showToast('Grupo excluído'); currentRoute = ''; handleRoute();
  });
}

// ---- GROUP DETAIL (panels) ----
async function renderGroupDetail(groupId) {
  const mc = document.getElementById('main-content');
  mc.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:50vh;color:var(--text-muted)">Carregando...</div>';
  const group = await GroupStore.getById(groupId);
  const isAdmin = Auth.isAdmin();
  if (!group) { navigateTo('companies'); return; }
  if (!isAdmin && !(await PermissionStore.userHasGroup(Auth.getSession().userId, groupId))) { navigateTo('companies'); return; }

  const panels = await PanelStore.getByGroup(groupId);
  const company = await CompanyStore.getById(group.company_id);

  window._cacheGroupPanels = panels;

  mc.innerHTML = `
    <div class="fade-in">
      <div class="page-header"><div>
        <button class="btn-back" onclick="navigateTo('company/${group.company_id}')">${Icons.back} Voltar a ${company ? company.name : 'empresa'}</button>
        <div class="page-header-top" style="margin-top:0.75rem">
          <h1 style="display:flex;align-items:center;gap:0.5rem">
            <span style="color:${group.color}">${Icons.folder}</span> ${group.name}
          </h1>
          ${isAdmin ? `<button class="btn btn-primary" onclick="openPanelModal('${groupId}')">${Icons.plus} Novo Painel</button>` : ''}
        </div>
        ${group.description ? `<p class="breadcrumb">${group.description}</p>` : ''}
      </div></div>
      <div class="page-body">
        <div class="toolbar">${searchBar('Buscar painéis...', (q) => filterPanels(groupId, q))}</div>
        <div class="panels-grid" id="panels-container">
          ${panels.length > 0 ? panels.map(p => panelCard(p, isAdmin)).join('') : emptyState('monitor', 'Nenhum painel neste grupo')}
        </div>
      </div>
    </div>
  `;
}

function filterPanels(groupId, query) {
  let panels = window._cacheGroupPanels || [];
  if (query) {
    const q = query.toLowerCase();
    panels = panels.filter(p => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
  }
  document.getElementById('panels-container').innerHTML = panels.length > 0
    ? panels.map(p => panelCard(p, Auth.isAdmin())).join('')
    : emptyState('monitor', 'Nenhum painel encontrado');
}

async function openPanelModal(groupId, panelId) {
  const panel = panelId ? await PanelStore.getById(panelId) : null;
  const title = panel ? 'Editar Painel' : 'Novo Painel';
  const gId = panel ? panel.group_id : groupId;
  const currentGroup = await GroupStore.getById(gId);
  const companyGroups = currentGroup ? await GroupStore.getByCompany(currentGroup.company_id) : await GroupStore.getAll();
  const groupOptions = companyGroups.map(g =>
    `<option value="${g.id}" ${g.id === gId ? 'selected' : ''}>${g.name}</option>`
  ).join('');

  openModal(title, `
    <form id="panel-form">
      <div class="form-group"><label>Nome do Painel</label>
        <input type="text" class="form-input" id="panel-name" value="${panel ? panel.name : ''}" placeholder="Ex: Vendas Mensal" required></div>
      <div class="form-group"><label>Descrição</label>
        <textarea class="form-textarea" id="panel-desc" placeholder="Descrição opcional">${panel ? panel.description : ''}</textarea></div>
      <div class="form-group"><label>Link do Power BI</label>
        <input type="url" class="form-input" id="panel-url" value="${panel ? panel.url : ''}" placeholder="https://app.powerbi.com/view?r=..." required></div>
      <div class="form-group"><label>Grupo</label>
        <select class="form-select" id="panel-group">${groupOptions}</select></div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn-primary">${panel ? 'Salvar' : 'Criar Painel'}</button>
      </div>
    </form>
  `);

  document.getElementById('panel-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('panel-name').value.trim();
    const description = document.getElementById('panel-desc').value.trim();
    const url = document.getElementById('panel-url').value.trim();
    const selectedGroup = document.getElementById('panel-group').value;
    if (!name || !url) return;
    try {
      if (panel) { await PanelStore.update(panel.id, { name, description, url, groupId: selectedGroup }); showToast('Painel atualizado!'); }
      else { await PanelStore.create({ name, description, url, groupId: selectedGroup }); showToast('Painel criado!'); }
      closeModal(); currentRoute = ''; handleRoute();
    } catch (err) { showToast(err.message, 'error'); }
  });
}

async function editPanel(id) {
  event.stopPropagation();
  const panel = await PanelStore.getById(id);
  if (panel) openPanelModal(panel.group_id, id);
}

async function deletePanel(id) {
  event.stopPropagation();
  const panel = await PanelStore.getById(id);
  confirmAction(`Excluir painel <strong>"${panel.name}"</strong>?`, async () => {
    await PanelStore.delete(id); showToast('Painel excluído'); currentRoute = ''; handleRoute();
  });
}

// ---- VIEW PANEL (MASKED IFRAME) ----
async function viewPanel(panelId) {
  const panel = await PanelStore.getById(panelId);
  if (!panel) return;
  if (!Auth.isAdmin()) {
    if (!(await PermissionStore.userHasGroup(Auth.getSession().userId, panel.group_id))) {
      showToast('Acesso negado', 'error'); return;
    }
  }
  const group = await GroupStore.getById(panel.group_id);

  const viewer = document.createElement('div');
  viewer.className = 'panel-viewer';
  viewer.id = 'panel-viewer';
  viewer.innerHTML = `
    <div class="panel-viewer-header">
      <button class="btn-icon" onclick="closePanelViewer()" title="Fechar">${Icons.back}</button>
      <h3>${panel.name}</h3>
      <span class="badge badge-admin" style="margin-left:auto">${group ? group.name : ''}</span>
      <button class="btn-icon" onclick="toggleFullscreen()" title="Tela Cheia">${Icons.expand}</button>
    </div>
    <div style="flex:1;overflow:hidden;position:relative;background:#0a0a1a;">
      <div id="panel-loading" style="position:absolute;inset:0;background:#0a0a1a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.25rem;z-index:10;transition:opacity 0.5s ease;">
        <div style="width:44px;height:44px;border:3px solid rgba(255,255,255,0.08);border-top-color:#6366f1;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
        <p style="font-size:1rem;font-weight:600;color:#f0f0ff;">Carregando painel...</p>
        <span style="font-size:0.82rem;color:#555570;">${panel.name}</span>
      </div>
      <iframe id="panel-iframe" src="${panel.url}" allowfullscreen
        style="width:100%;height:calc(100% + 40px);border:none;opacity:0;transition:opacity 0.5s ease;"></iframe>
    </div>
  `;
  document.body.appendChild(viewer);

  const iframe = document.getElementById('panel-iframe');
  if (iframe) { iframe.addEventListener('load', () => setTimeout(revealPanel, 3000)); }
  setTimeout(revealPanel, 15000);
  history.pushState(null, '', `#panel/${panelId}`);
}

function revealPanel() {
  const overlay = document.getElementById('panel-loading');
  if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 600); }
  const iframe = document.getElementById('panel-iframe');
  if (iframe) { iframe.style.opacity = '1'; }
}

function closePanelViewer() {
  const viewer = document.getElementById('panel-viewer');
  if (viewer) { viewer.remove(); if (getRoute().startsWith('panel/')) history.back(); }
}

function toggleFullscreen() {
  const v = document.getElementById('panel-viewer');
  if (!v) return;
  document.fullscreenElement ? document.exitFullscreen() : v.requestFullscreen();
}

// ---- USERS PAGE ----
async function renderUsers() {
  const mc = document.getElementById('main-content');
  mc.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:50vh;color:var(--text-muted)">Carregando...</div>';
  const users = await UserStore.getAll();
  const session = Auth.getSession();
  const pendingUsers = users.filter(u => u.active === false);
  const activeUsers = users.filter(u => u.active !== false);

  mc.innerHTML = `
    <div class="fade-in">
      <div class="page-header"><div class="page-header-top">
        <div>
          <h1>Usuários ${pendingUsers.length > 0 ? `<span class="badge badge-warning" style="font-size:0.7rem;vertical-align:middle;margin-left:0.5rem">${pendingUsers.length} pendente${pendingUsers.length > 1 ? 's' : ''}</span>` : ''}</h1>
        </div>
        <button class="btn btn-primary" onclick="openInviteModal()">${Icons.plus} Convidar Usuário</button>
      </div></div>
      <div class="page-body">
        ${pendingUsers.length > 0 ? `
          <div class="section-title" style="color:var(--warning);display:flex;align-items:center;gap:0.5rem">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Aguardando Aprovação
          </div>
          <div class="table-container" style="margin-bottom:2rem;border:1px solid rgba(245,158,11,0.2);border-radius:var(--radius-md)">
            ${renderPendingTable(pendingUsers)}
          </div>
        ` : ''}
        <div class="toolbar">${searchBar('Buscar usuários...', filterUsers)}</div>
        <div class="table-container" id="users-table-container">${renderUsersTable(activeUsers, session.userId)}</div>
      </div>
    </div>
  `;
  window._cacheUsers = activeUsers;
}

function renderPendingTable(users) {
  return `<table><thead><tr>
    <th>Usuário</th><th>Status</th><th style="width:160px">Ações</th>
  </tr></thead><tbody>${users.map(u => {
    const initials = u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    return `<tr style="background:rgba(245,158,11,0.04)">
      <td><div style="display:flex;align-items:center;gap:0.5rem">
        <div class="user-avatar" style="width:32px;height:32px;font-size:0.75rem;background:linear-gradient(135deg,#f59e0b,#ef4444)">${initials}</div>
        <div><div style="color:var(--text-primary);font-weight:500">${u.name}</div></div>
      </div></td>
      <td><span class="badge badge-warning">Pendente</span></td>
      <td><div class="table-actions" style="gap:0.4rem">
        <button class="btn btn-sm" style="background:var(--success);color:#fff;padding:0.35rem 0.75rem;border:none;border-radius:6px;font-size:0.78rem;cursor:pointer" onclick="approveUser('${u.id}')">✓ Aprovar</button>
        <button class="btn btn-sm" style="background:var(--danger);color:#fff;padding:0.35rem 0.75rem;border:none;border-radius:6px;font-size:0.78rem;cursor:pointer" onclick="rejectUser('${u.id}')">✕ Rejeitar</button>
      </div></td>
    </tr>`;
  }).join('')}</tbody></table>`;
}

function renderUsersTable(users, currentUserId) {
  if (users.length === 0) return emptyState('users', 'Nenhum usuário ativo');
  return `<table><thead><tr>
    <th>Usuário</th><th>Perfil</th><th>Status</th><th style="width:100px">Ações</th>
  </tr></thead><tbody>${users.map(u => `
    <tr>
      <td><div style="display:flex;align-items:center;gap:0.5rem">
        <div class="user-avatar" style="width:32px;height:32px;font-size:0.75rem">${u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</div>
        <div><div style="color:var(--text-primary);font-weight:500">${u.name}</div></div>
      </div></td>
      <td><span class="badge badge-${u.role}">${u.role === 'admin' ? 'Admin' : 'Usuário'}</span></td>
      <td><span class="badge badge-active">Ativo</span></td>
      <td><div class="table-actions">
        <button class="btn-icon btn-sm" onclick="openEditUserModal('${u.id}')" title="Editar">${Icons.edit}</button>
      </div></td>
    </tr>
  `).join('')}</tbody></table>`;
}

async function approveUser(userId) {
  try {
    await UserStore.update(userId, { active: true });
    showToast('Usuário aprovado com sucesso!', 'success');
    currentRoute = ''; handleRoute();
  } catch (err) { showToast(err.message, 'error'); }
}

async function rejectUser(userId) {
  const user = await UserStore.getById(userId);
  confirmAction(`Rejeitar e excluir <strong>"${user.name}"</strong>?`, async () => {
    await UserStore.delete(userId);
    showToast('Usuário rejeitado');
    currentRoute = ''; handleRoute();
  });
}

function filterUsers(query) {
  let users = window._cacheUsers || [];
  if (query) {
    const q = query.toLowerCase();
    users = users.filter(u => u.name.toLowerCase().includes(q));
  }
  document.getElementById('users-table-container').innerHTML = renderUsersTable(users, Auth.getSession().userId);
}

async function openEditUserModal(userId) {
  const user = await UserStore.getById(userId);
  if (!user) return;
  openModal('Editar Usuário', `
    <form id="user-form">
      <div class="form-group"><label>Nome</label>
        <input type="text" class="form-input" id="user-name" value="${user.name}" required></div>
      <div class="form-row">
        <div class="form-group"><label>Perfil</label>
          <select class="form-select" id="user-role">
            <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuário</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
          </select></div>
        <div class="form-group"><label>Status</label>
          <select class="form-select" id="user-active">
            <option value="true" ${user.active !== false ? 'selected' : ''}>Ativo</option>
            <option value="false" ${user.active === false ? 'selected' : ''}>Inativo</option>
          </select></div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  `);
  document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await UserStore.update(userId, {
        name: document.getElementById('user-name').value.trim(),
        role: document.getElementById('user-role').value,
        active: document.getElementById('user-active').value === 'true',
      });
      showToast('Usuário atualizado!');
      closeModal(); currentRoute = ''; handleRoute();
    } catch (err) { showToast(err.message, 'error'); }
  });
}

function openInviteModal() {
  openModal('Convidar Usuário', `
    <form id="invite-form">
      <p style="color:var(--text-secondary);margin-bottom:1rem;font-size:0.85rem">O usuário receberá acesso com a senha temporária definida abaixo.</p>
      <div class="form-group"><label>Nome Completo</label>
        <input type="text" class="form-input" id="invite-name" placeholder="Nome do usuário" required></div>
      <div class="form-group"><label>E-mail</label>
        <input type="email" class="form-input" id="invite-email" placeholder="email@empresa.com" required></div>
      <div class="form-group"><label>Senha Temporária</label>
        <input type="text" class="form-input" id="invite-pass" placeholder="Mínimo 6 caracteres" required minlength="6" value="${generateTempPassword()}"></div>
      <div class="form-row">
        <div class="form-group"><label>Perfil</label>
          <select class="form-select" id="invite-role">
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select></div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn-primary">Convidar</button>
      </div>
    </form>
  `);
  document.getElementById('invite-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('invite-name').value.trim();
    const email = document.getElementById('invite-email').value.trim();
    const password = document.getElementById('invite-pass').value;
    const role = document.getElementById('invite-role').value;
    try {
      await UserStore.create({ name, email, password, role });
      showToast(`Usuário "${name}" convidado com sucesso!`, 'success');
      closeModal(); currentRoute = ''; handleRoute();
    } catch (err) { showToast(err.message, 'error'); }
  });
}

function generateTempPassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let pass = '';
  for (let i = 0; i < 8; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
}

// ---- PERMISSIONS PAGE ----
async function renderPermissions() {
  const mc = document.getElementById('main-content');
  mc.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:50vh;color:var(--text-muted)">Carregando...</div>';
  const [users, companies] = await Promise.all([UserStore.getAll(), CompanyStore.getAll()]);
  const nonAdminUsers = users.filter(u => u.role !== 'admin');

  mc.innerHTML = `
    <div class="fade-in">
      <div class="page-header"><div class="page-header-top"><div>
        <h1>Permissões</h1>
        <p class="breadcrumb">Defina quais usuários podem acessar cada empresa e seus grupos</p>
      </div></div></div>
      <div class="page-body">
        ${nonAdminUsers.length === 0 || companies.length === 0
      ? emptyState('shield', nonAdminUsers.length === 0 ? 'Nenhum usuário para gerenciar' : 'Crie empresas primeiro')
      : renderPermissionsMatrix(nonAdminUsers, companies)}
      </div>
    </div>
  `;
}

function renderPermissionsMatrix(users, companies) {
  const usersHTML = users.map(u => `
    <div class="perm-item">
      <div class="perm-item-info">
        <div class="user-avatar" style="width:28px;height:28px;font-size:0.65rem">${u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}</div>
        <div><div style="font-weight:500;font-size:0.85rem">${u.name}</div></div>
      </div>
      <button class="btn btn-sm btn-ghost" onclick="openUserPermModal('${u.id}')">${Icons.edit} Editar</button>
    </div>
  `).join('');
  const companiesHTML = companies.map(c => `
    <div class="perm-item">
      <div class="perm-item-info">
        <div class="dot" style="background:${c.color}"></div>
        <div><div style="font-weight:500;font-size:0.85rem">${c.name}</div></div>
      </div>
      <button class="btn btn-sm btn-ghost" onclick="openCompanyPermModal('${c.id}')">${Icons.edit} Editar</button>
    </div>
  `).join('');
  return `<div class="perm-grid">
    <div class="perm-box"><div class="perm-box-header">${Icons.users} Por Usuário</div><div class="perm-list">${usersHTML}</div></div>
    <div class="perm-box"><div class="perm-box-header">${Icons.building} Por Empresa</div><div class="perm-list">${companiesHTML}</div></div>
  </div>`;
}

async function openUserPermModal(userId) {
  const user = await UserStore.getById(userId);
  if (!user) return;
  const companies = await CompanyStore.getAll();
  const allPerms = await PermissionStore.getAll();

  const listHTML = await Promise.all(companies.map(async (c) => {
    const groups = await GroupStore.getByCompany(c.id);
    const hasCompanyPerm = allPerms.some(p => p.user_id === userId && p.company_id === c.id && !p.group_id);
    const groupsHTML = groups.map(g => {
      const hasGroup = allPerms.some(p => p.user_id === userId && (p.group_id === g.id || (p.company_id === c.id && !p.group_id)));
      return `<div class="perm-sub-item">
        <span style="font-size:0.82rem;color:var(--text-secondary);padding-left:1.5rem">${Icons.folder} ${g.name}</span>
        <label class="perm-toggle"><input type="checkbox" ${hasGroup ? 'checked' : ''} ${hasCompanyPerm ? 'disabled' : ''} onchange="toggleGroupPerm('${userId}','${c.id}','${g.id}',this.checked)"><span class="slider"></span></label>
      </div>`;
    }).join('');
    return `<div class="perm-company-block">
      <div class="perm-item" style="background:rgba(0,0,0,0.15)">
        <div class="perm-item-info"><div class="dot" style="background:${c.color}"></div>
        <div><div style="font-weight:600;font-size:0.85rem">${c.name}</div><div style="font-size:0.7rem;color:var(--text-muted)">Acesso total</div></div></div>
        <label class="perm-toggle"><input type="checkbox" ${hasCompanyPerm ? 'checked' : ''} onchange="toggleCompanyPerm('${userId}','${c.id}',this.checked)"><span class="slider"></span></label>
      </div>
      ${groupsHTML}
    </div>`;
  }));

  openModal(`Permissões: ${user.name}`, `
    <div style="max-height:400px;overflow-y:auto;">${listHTML.join('')}</div>
    <div class="form-actions"><button class="btn btn-primary" onclick="closeModal()">Fechar</button></div>
  `, { width: '520px' });
}

async function toggleCompanyPerm(userId, companyId, checked) {
  if (checked) {
    await PermissionStore.grant(userId, companyId, null);
    const groups = await GroupStore.getByCompany(companyId);
    for (const g of groups) { await PermissionStore.revoke(userId, companyId, g.id); }
  } else {
    await PermissionStore.revokeAllForUserInCompany(userId, companyId);
  }
  openUserPermModal(userId);
}

async function toggleGroupPerm(userId, companyId, groupId, checked) {
  if (checked) { await PermissionStore.grant(userId, companyId, groupId); }
  else { await PermissionStore.revoke(userId, companyId, groupId); }
  openUserPermModal(userId);
}

async function openCompanyPermModal(companyId) {
  const company = await CompanyStore.getById(companyId);
  if (!company) return;
  const users = (await UserStore.getAll()).filter(u => u.role !== 'admin');
  const groups = await GroupStore.getByCompany(companyId);
  const allPerms = await PermissionStore.getAll();

  const listHTML = users.map(u => {
    const hasCompanyPerm = allPerms.some(p => p.user_id === u.id && p.company_id === companyId && !p.group_id);
    const initials = u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const groupsHTML = groups.map(g => {
      const hasGroup = allPerms.some(p => p.user_id === u.id && (p.group_id === g.id || (p.company_id === companyId && !p.group_id)));
      return `<div class="perm-sub-item">
        <span style="font-size:0.82rem;color:var(--text-secondary);padding-left:1.5rem">${Icons.folder} ${g.name}</span>
        <label class="perm-toggle"><input type="checkbox" ${hasGroup ? 'checked' : ''} ${hasCompanyPerm ? 'disabled' : ''} onchange="toggleGroupPermFromCompany('${u.id}','${companyId}','${g.id}',this.checked)"><span class="slider"></span></label>
      </div>`;
    }).join('');
    return `<div class="perm-company-block">
      <div class="perm-item" style="background:rgba(0,0,0,0.15)">
        <div class="perm-item-info"><div class="user-avatar" style="width:24px;height:24px;font-size:0.6rem">${initials}</div>
        <div><div style="font-weight:600;font-size:0.85rem">${u.name}</div><div style="font-size:0.7rem;color:var(--text-muted)">Acesso total</div></div></div>
        <label class="perm-toggle"><input type="checkbox" ${hasCompanyPerm ? 'checked' : ''} onchange="toggleCompanyPermFromCompany('${u.id}','${companyId}',this.checked)"><span class="slider"></span></label>
      </div>
      ${groupsHTML}
    </div>`;
  }).join('');

  openModal(`Permissões: ${company.name}`, `
    <div style="max-height:400px;overflow-y:auto;">${listHTML || '<p style="color:var(--text-muted);text-align:center;padding:2rem">Nenhum usuário</p>'}</div>
    <div class="form-actions"><button class="btn btn-primary" onclick="closeModal()">Fechar</button></div>
  `, { width: '520px' });
}

async function toggleCompanyPermFromCompany(userId, companyId, checked) {
  if (checked) {
    await PermissionStore.grant(userId, companyId, null);
    const groups = await GroupStore.getByCompany(companyId);
    for (const g of groups) { await PermissionStore.revoke(userId, companyId, g.id); }
  } else {
    await PermissionStore.revokeAllForUserInCompany(userId, companyId);
  }
  openCompanyPermModal(companyId);
}

async function toggleGroupPermFromCompany(userId, companyId, groupId, checked) {
  if (checked) { await PermissionStore.grant(userId, companyId, groupId); }
  else { await PermissionStore.revoke(userId, companyId, groupId); }
  openCompanyPermModal(companyId);
}

// ---- INIT ----
window.addEventListener('hashchange', () => { currentRoute = ''; handleRoute(); });
window.addEventListener('load', async () => {
  try {
    console.log('App init starting...');
    if (typeof supabase === 'undefined' || !supabase) {
      console.error('Supabase not loaded');
      document.getElementById('app').innerHTML = '<div style="color:#ef4444;padding:2rem;text-align:center;font-family:Inter,sans-serif"><h2>Erro de Carregamento</h2><p>Supabase não foi carregado corretamente.</p></div>';
      return;
    }
    await Auth.init();
    console.log('Auth init done, logged in:', Auth.isLoggedIn());
    renderApp();
    console.log('App rendered');
  } catch (err) {
    console.error('Init error:', err);
    renderLogin();
  }
});
