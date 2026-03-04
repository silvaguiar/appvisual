// =============================================
// AUTH MODULE — Supabase Authentication
// =============================================

const Auth = {
    _session: null,
    _profile: null,

    async init() {
        const { data: { session } } = await db.auth.getSession();
        if (session) {
            this._session = session;
            await this._loadProfile(session.user.id);
        }

        db.auth.onAuthStateChange(async (event, session) => {
            this._session = session;
            if (session) {
                await this._loadProfile(session.user.id);
            } else {
                this._profile = null;
            }
        });
    },

    async _loadProfile(userId) {
        const { data, error } = await db
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (data) {
            this._profile = data;
        }
    },

    async login(email, password) {
        const { data, error } = await db.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (error.message.includes('Invalid login')) {
                throw new Error('E-mail ou senha incorretos');
            }
            throw new Error(error.message);
        }

        this._session = data.session;
        await this._loadProfile(data.user.id);

        return data;
    },

    async signup(email, password, name, role = 'user') {
        const { data, error } = await db.auth.signUp({
            email,
            password,
            options: {
                data: { name, role },
            },
        });

        if (error) throw new Error(error.message);
        return data;
    },

    async logout() {
        await db.auth.signOut();
        this._session = null;
        this._profile = null;
    },

    isLoggedIn() {
        return !!this._session;
    },

    isPending() {
        return this._profile && this._profile.active === false;
    },

    isActive() {
        return this._profile && this._profile.active !== false;
    },

    isAdmin() {
        return this._profile?.role === 'admin';
    },

    getSession() {
        if (!this._session || !this._profile) return null;
        return {
            userId: this._session.user.id,
            email: this._session.user.email,
            name: this._profile.name,
            role: this._profile.role,
            active: this._profile.active,
        };
    },

    getUser() {
        return this._session?.user || null;
    },
};
