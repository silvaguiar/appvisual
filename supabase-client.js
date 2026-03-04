// =============================================
// SUPABASE CLIENT — Connection & Config
// =============================================

const SUPABASE_URL = 'https://amjyppvhwgaqvanwtzlb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtanlwcHZod2dhcXZhbnd0emxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0Nzk5NjcsImV4cCI6MjA4ODA1NTk2N30.A0W2vOfqtMt6-IEa4jK6Fg8JzhGcx_ZC1gjht3qyg-c';

// Initialize Supabase client
// The CDN exposes 'supabase' on window with createClient
const _supabaseLib = window.supabase;
const db = _supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Supabase client initialized:', !!db.auth);
