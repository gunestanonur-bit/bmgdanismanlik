import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logoutAdmin } from './auth'

const navGroups = [
  {
    title: 'Genel',
    items: [
      { to: '/admin/dashboard', label: 'Özet' },
      { to: '/admin/site', label: 'Site & metinler' },
      { to: '/admin/about', label: 'Hakkımızda' },
      { to: '/admin/hero', label: 'Hero slider' },
      { to: '/admin/visuals', label: 'Görseller (URL)' },
      { to: '/admin/banners', label: 'Bannerlar' },
    ],
  },
  {
    title: 'Hizmetler',
    items: [
      { to: '/admin/consulting', label: 'Danışmanlık hizmetleri' },
      { to: '/admin/training', label: 'Eğitim programları' },
      { to: '/admin/sectoral', label: 'Sektörel hizmetler' },
    ],
  },
] as const

export function AdminLayout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-100/80">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-slate-800/80 bg-gradient-to-b from-slate-950 to-slate-900 text-slate-200 lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3 px-4 py-4 lg:flex-col lg:items-stretch lg:px-6 lg:py-8">
            <div>
              <p className="font-[family-name:var(--font-display)] text-xl font-bold text-white">BMG</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">İçerik Yönetimi</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logoutAdmin()
                navigate('/admin/login', { replace: true })
              }}
              className="admin-btn rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800"
            >
              Çıkış
            </button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-8" aria-label="Yönetim menüsü">
            <div className="flex w-full gap-3 lg:flex-col">
              {navGroups.map((group) => (
                <div key={group.title} className="min-w-max lg:min-w-0">
                  <p className="mb-2 hidden px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 lg:block">
                    {group.title}
                  </p>
                  <div className="flex gap-1 lg:flex-col">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition lg:whitespace-normal ${
                            isActive
                              ? 'bg-primary-700 text-white shadow-lg shadow-primary-900/20'
                              : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>
          <div className="hidden border-t border-slate-800 px-6 py-4 text-xs text-slate-500 lg:block">
            Değişiklikler anında kaydedilir.
          </div>
        </aside>

        <div className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
