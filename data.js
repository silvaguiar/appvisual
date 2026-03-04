// =============================================
// DATA LAYER — Supabase CRUD Operations
// =============================================

// ---- USERS (Profiles) ----
const UserStore = {
  async getAll() {
    const { data, error } = await db
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });
    return data || [];
  },

  async getById(id) {
    const { data } = await db
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  },

  async create({ name, email, password, role = 'user' }) {
    const { data, error } = await db.rpc('invite_user', {
      p_email: email,
      p_name: name,
      p_password: password,
      p_role: role,
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, updates) {
    const updateData = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.role !== undefined) updateData.role = updates.role;
    if (updates.active !== undefined) updateData.active = updates.active;

    const { data, error } = await db
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id) {
    // Delete profile (cascades from auth.users)
    const { error } = await db
      .from('profiles')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};

// ---- COMPANIES ----
const CompanyStore = {
  async getAll() {
    const { data } = await db
      .from('companies')
      .select('*')
      .order('created_at', { ascending: true });
    return data || [];
  },

  async getById(id) {
    const { data } = await db
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  },

  async create({ name, description, color }) {
    const { data, error } = await db
      .from('companies')
      .insert({ name, description: description || '', color: color || '#6366f1' })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, updates) {
    const { data, error } = await db
      .from('companies')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id) {
    const { error } = await db
      .from('companies')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};

// ---- GROUPS ----
const GroupStore = {
  async getAll() {
    const { data } = await db
      .from('groups')
      .select('*')
      .order('created_at', { ascending: true });
    return data || [];
  },

  async getById(id) {
    const { data } = await db
      .from('groups')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  },

  async getByCompany(companyId) {
    const { data } = await db
      .from('groups')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: true });
    return data || [];
  },

  async create({ name, description, color, companyId }) {
    const { data, error } = await db
      .from('groups')
      .insert({ name, description: description || '', color: color || '#6366f1', company_id: companyId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, updates) {
    const dbUpdates = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.companyId !== undefined) dbUpdates.company_id = updates.companyId;

    const { data, error } = await db
      .from('groups')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id) {
    const { error } = await db
      .from('groups')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};

// ---- PANELS ----
const PanelStore = {
  async getAll() {
    const { data } = await db
      .from('panels')
      .select('*')
      .order('created_at', { ascending: true });
    return data || [];
  },

  async getById(id) {
    const { data } = await db
      .from('panels')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  },

  async getByGroup(groupId) {
    const { data } = await db
      .from('panels')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });
    return data || [];
  },

  async getByCompany(companyId) {
    const { data } = await db
      .from('panels')
      .select('*, groups!inner(company_id)')
      .eq('groups.company_id', companyId);
    return data || [];
  },

  async create({ name, description, url, groupId }) {
    const { data, error } = await db
      .from('panels')
      .insert({ name, description: description || '', url, group_id: groupId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async update(id, updates) {
    const dbUpdates = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.url !== undefined) dbUpdates.url = updates.url;
    if (updates.groupId !== undefined) dbUpdates.group_id = updates.groupId;

    const { data, error } = await db
      .from('panels')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id) {
    const { error } = await db
      .from('panels')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};

// ---- PERMISSIONS ----
const PermissionStore = {
  async getAll() {
    const { data } = await db
      .from('permissions')
      .select('*');
    return data || [];
  },

  async getByUser(userId) {
    const { data } = await db
      .from('permissions')
      .select('*')
      .eq('user_id', userId);
    return data || [];
  },

  async getByCompany(companyId) {
    const { data } = await db
      .from('permissions')
      .select('*')
      .eq('company_id', companyId);
    return data || [];
  },

  async userHasGroup(userId, groupId) {
    // Check direct group permission (where panel_id is null)
    const { data: directPerm } = await db
      .from('permissions')
      .select('id')
      .eq('user_id', userId)
      .eq('group_id', groupId)
      .is('panel_id', null)
      .limit(1);

    if (directPerm && directPerm.length > 0) return true;

    // Check company-wide permission
    const group = await GroupStore.getById(groupId);
    if (!group) return false;

    const { data: companyPerm } = await db
      .from('permissions')
      .select('id')
      .eq('user_id', userId)
      .eq('company_id', group.company_id)
      .is('group_id', null)
      .limit(1);

    return companyPerm && companyPerm.length > 0;
  },

  async userHasPanel(userId, panelId) {
    const { data: directPerm } = await db
      .from('permissions')
      .select('id')
      .eq('user_id', userId)
      .eq('panel_id', panelId)
      .limit(1);

    if (directPerm && directPerm.length > 0) return true;

    // Check group or company permission
    const panel = await PanelStore.getById(panelId);
    if (!panel) return false;

    return await this.userHasGroup(userId, panel.group_id);
  },

  async userHasCompany(userId, companyId) {
    const { data } = await db
      .from('permissions')
      .select('id')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .limit(1);
    return data && data.length > 0;
  },

  async getCompaniesForUser(userId) {
    const { data: perms } = await db
      .from('permissions')
      .select('company_id')
      .eq('user_id', userId);

    if (!perms || perms.length === 0) return [];

    const companyIds = [...new Set(perms.map(p => p.company_id))];
    const { data: companies } = await db
      .from('companies')
      .select('*')
      .in('id', companyIds);
    return companies || [];
  },

  async getGroupsForUserInCompany(userId, companyId) {
    const perms = await this.getByUser(userId);
    const companyPerms = perms.filter(p => p.company_id === companyId);

    // If has company-wide permission, return all groups
    if (companyPerms.some(p => !p.group_id)) {
      return await GroupStore.getByCompany(companyId);
    }

    const groupIds = companyPerms.map(p => p.group_id).filter(Boolean);
    if (groupIds.length === 0) return [];

    const { data } = await db
      .from('groups')
      .select('*')
      .in('id', groupIds);
    return data || [];
  },

  async getGroupsForUser(userId) {
    const companies = await this.getCompaniesForUser(userId);
    let allGroups = [];
    for (const c of companies) {
      const groups = await this.getGroupsForUserInCompany(userId, c.id);
      allGroups = allGroups.concat(groups);
    }
    return allGroups;
  },

  async getUsersForCompany(companyId) {
    const { data: perms } = await db
      .from('permissions')
      .select('user_id')
      .eq('company_id', companyId);

    if (!perms || perms.length === 0) return [];

    const userIds = [...new Set(perms.map(p => p.user_id))];
    const { data: profiles } = await db
      .from('profiles')
      .select('*')
      .in('id', userIds);
    return profiles || [];
  },

  async grant(userId, companyId, groupId = null, panelId = null) {
    const insert = { user_id: userId, company_id: companyId };
    if (groupId) insert.group_id = groupId;
    if (panelId) insert.panel_id = panelId;

    const query = db.from('permissions').select('id').eq('user_id', userId).eq('company_id', companyId);
    if (groupId) query.eq('group_id', groupId); else query.is('group_id', null);
    if (panelId) query.eq('panel_id', panelId); else query.is('panel_id', null);

    const { data } = await query.limit(1);

    if (!data || data.length === 0) {
      const { error } = await db.from('permissions').insert(insert);
      if (error && !error.message.includes('duplicate')) {
        throw new Error(error.message);
      }
    }
  },

  async revoke(userId, companyId, groupId = null, panelId = null) {
    let query = db
      .from('permissions')
      .delete()
      .eq('user_id', userId)
      .eq('company_id', companyId);

    if (groupId) {
      query = query.eq('group_id', groupId);
    } else {
      query = query.is('group_id', null);
    }

    if (panelId) {
      query = query.eq('panel_id', panelId);
    } else {
      query = query.is('panel_id', null);
    }

    await query;
  },

  async revokeAllForUserInCompany(userId, companyId) {
    await db
      .from('permissions')
      .delete()
      .eq('user_id', userId)
      .eq('company_id', companyId);
  },
};

// ---- Seed (no-op for Supabase, handled by auth signup) ----
async function seedData() {
  // Nothing to seed - admin user is created via signup
}
