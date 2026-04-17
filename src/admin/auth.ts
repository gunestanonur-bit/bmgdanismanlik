/**
 * Admin authentication backed by Supabase Auth.
 *
 * Setup: in Supabase Dashboard → Authentication → Users, create the admin user
 * with an email and a strong password. That email/password is what you type at /admin/login.
 *
 * Legacy fallback: if Supabase is not configured (no env vars), the app falls
 * back to the VITE_ADMIN_PASSWORD env var for local development only.
 */
import { supabase } from '../lib/supabase'

const HAS_SUPABASE = !!(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ── Supabase-backed auth ──────────────────────────────────────

export async function signIn(email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!HAS_SUPABASE) {
    // Dev fallback — password-only gate
    const expected = import.meta.env.VITE_ADMIN_PASSWORD ?? '5444691'
    if (password === expected) {
      sessionStorage.setItem('bmg_admin_session', '1')
      return { ok: true }
    }
    return { ok: false, error: 'Şifre hatalı.' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function signOut(): Promise<void> {
  if (!HAS_SUPABASE) {
    sessionStorage.removeItem('bmg_admin_session')
    return
  }
  await supabase.auth.signOut()
}

/** Returns true if there is an active admin session (sync best-effort). */
export function isAdminSession(): boolean {
  if (!HAS_SUPABASE) {
    try {
      return sessionStorage.getItem('bmg_admin_session') === '1'
    } catch {
      return false
    }
  }
  // supabase.auth.getSession() is async; ProtectedAdmin uses a hook instead.
  // This sync version reads from the internal storage Supabase maintains.
  const raw = localStorage.getItem(`sb-${new URL(import.meta.env.VITE_SUPABASE_URL ?? 'https://x.supabase.co').hostname.split('.')[0]}-auth-token`)
  if (!raw) return false
  try {
    const parsed = JSON.parse(raw) as { access_token?: string }
    return !!parsed.access_token
  } catch {
    return false
  }
}

// Legacy shim — keeps old callers working during migration
export function loginAdmin(password: string): boolean {
  const expected = import.meta.env.VITE_ADMIN_PASSWORD ?? '5444691'
  if (password === expected) {
    sessionStorage.setItem('bmg_admin_session', '1')
    return true
  }
  return false
}

export function logoutAdmin(): void {
  sessionStorage.removeItem('bmg_admin_session')
  if (HAS_SUPABASE) supabase.auth.signOut().catch(() => undefined)
}
