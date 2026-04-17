import { type FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { isAdminSession, signIn } from '../auth'

const HAS_SUPABASE = !!(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

export function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard'

  if (isAdminSession()) {
    return <Navigate to={from} replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn(HAS_SUPABASE ? email : 'admin', password)
    if (result.ok) {
      navigate(from, { replace: true })
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600/20">
          <svg className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">Yönetim paneli</h1>
        <p className="mt-2 text-sm text-slate-400">Site içeriğini düzenlemek için giriş yapın.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {HAS_SUPABASE && (
            <div>
              <label htmlFor="admin-email" className="text-sm font-medium text-slate-300">
                E-posta
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-600/30"
              />
            </div>
          )}
          <div>
            <label htmlFor="admin-pass" className="text-sm font-medium text-slate-300">
              Şifre
            </label>
            <input
              id="admin-pass"
              type="password"
              autoComplete="current-password"
              autoFocus={!HAS_SUPABASE}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-600/30"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-900/50 bg-red-900/20 px-4 py-2.5">
              <svg className="h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password || (HAS_SUPABASE && !email)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-900/30 transition hover:-translate-y-0.5 hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Giriş yapılıyor…
              </>
            ) : (
              'Giriş yap'
            )}
          </button>
        </form>

        {!import.meta.env.PROD && !HAS_SUPABASE && (
          <p className="mt-6 rounded-xl border border-slate-800 bg-slate-800/50 px-3 py-2 text-center text-xs text-slate-500">
            Geliştirme ortamı — varsayılan şifre:{' '}
            <code className="text-slate-300">{import.meta.env.VITE_ADMIN_PASSWORD ?? '5444691'}</code>
          </p>
        )}
        {!import.meta.env.PROD && HAS_SUPABASE && (
          <p className="mt-6 rounded-xl border border-slate-800 bg-slate-800/50 px-3 py-2 text-center text-xs text-slate-500">
            Supabase Auth — Supabase Dashboard'dan oluşturduğunuz kullanıcı bilgilerini girin.
          </p>
        )}
      </div>
    </div>
  )
}
