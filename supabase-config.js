// Supabase Configuration – Mad Chicken Portal
const SUPABASE_URL = 'https://uiteolcphsikrhtrcmzq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-eNqeF41p3-etLajL1fv-A_HJ6lKhwL';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Auto auth guard ─────────────────────────────────────────
// Protects every page except index.html and admin.html
(function () {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  if (page === 'index.html' || page === 'admin.html') return;

  document.addEventListener('DOMContentLoaded', async function () {
    var result = await db.auth.getSession();
    var session = result.data.session;

    if (!session) {
      window.location.replace('index.html');
      return;
    }

    // Show manager name in nav
    var welcomeEl = document.querySelector('.nav-right span');
    if (welcomeEl && session.user.email) {
      var name = (session.user.user_metadata && session.user.user_metadata.full_name)
        ? session.user.user_metadata.full_name
        : session.user.email.split('@')[0];
      welcomeEl.textContent = 'Welcome, ' + name;
    }

    // Wire all logout buttons to actually sign out
    document.querySelectorAll('.logout').forEach(function (btn) {
      btn.onclick = async function () {
        await db.auth.signOut();
        window.location.href = 'index.html';
      };
    });
  });
})();
