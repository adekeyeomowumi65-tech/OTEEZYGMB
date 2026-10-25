const ADMIN_SUPABASE_URL = "https://bgtbxvfqzssllaiktaau.supabase.co";
const ADMIN_SUPABASE_KEY = "sb_publishable_h3sUzxA-I7za-S6ry7RuLA_qkB5iYvb";
const adminClient = window.supabase.createClient(ADMIN_SUPABASE_URL, ADMIN_SUPABASE_KEY);

// Call this at the top of every protected admin page (dashboard, tour editor, etc.)
// Redirects to login if nobody's signed in.
async function requireAdminAuth() {
  const { data: { session } } = await adminClient.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

async function adminLogout() {
  await adminClient.auth.signOut();
  window.location.href = 'login.html';
}
