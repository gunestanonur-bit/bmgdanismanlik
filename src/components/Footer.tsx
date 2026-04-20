import { Link } from 'react-router-dom'
import { FadeIn } from './FadeIn'
import { useSiteContent } from '../content/SiteContentContext'

const year = new Date().getFullYear()

const NAV_PATHS: Record<string, string> = {
  danismanlik: '/danismanlik',
  egitim: '/egitim',
  sektorel: '/sektorel',
  iletisim: '/iletisim',
  hakkimizda: '/hakkimizda',
}

function navTo(itemId: string) {
  return NAV_PATHS[itemId] ?? `/#${itemId}`
}

const headingClass =
  'text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500'

const linkClass =
  'group inline-flex items-center gap-1.5 rounded-lg py-1.5 text-sm text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'

export function Footer() {
  const { content } = useSiteContent()
  const { site, navItems, homeSectionCopy: h } = content
  const explore = navItems.filter((i) => i.id === 'hakkimizda' || i.id === 'iletisim')
  const services = navItems.filter((i) => i.id === 'danismanlik' || i.id === 'egitim' || i.id === 'sektorel')

  return (
    <footer className="relative overflow-hidden border-t border-slate-800/90 bg-gradient-to-b from-slate-950 via-[#0a0d12] to-black text-slate-300">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/45 to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-primary-600/12 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-slate-600/10 blur-3xl" aria-hidden />

      <FadeIn className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link
              to="/"
              className="inline-flex items-center gap-3 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-white transition hover:opacity-90"
            >
              {site.logo ? (
                <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-950/20 ring-1 ring-white/20">
                  <img src={site.logo} alt={`${site.name} logosu`} className="h-full w-full object-contain p-1" />
                </span>
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-slate-900 text-base font-bold text-white shadow-lg shadow-primary-900/30 ring-1 ring-white/15">
                  B
                </span>
              )}
            </Link>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">{site.tagline}</p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-500">{site.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/iletisim"
                className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-900/30 transition hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {h.footerCtaPrimary}
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700/90 bg-slate-900/40 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {h.footerCtaSecondary}
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-2">
            <div>
              <h2 className={headingClass}>{h.footerHeadingExplore}</h2>
              <ul className="mt-5 space-y-1">
                {explore.map((item) => (
                  <li key={item.id}>
                    <Link to={navTo(item.id)} className={linkClass}>
                      <span className="h-1 w-1 rounded-full bg-primary-500/0 transition group-hover:bg-primary-400" aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className={headingClass}>{h.footerHeadingServices}</h2>
              <ul className="mt-5 space-y-1">
                {services.map((item) => (
                  <li key={item.id}>
                    <Link to={navTo(item.id)} className={linkClass}>
                      <span className="h-1 w-1 rounded-full bg-primary-500/0 transition group-hover:bg-primary-400" aria-hidden />
                      <span className="leading-snug">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className={headingClass}>{h.footerHeadingContact}</h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">E-posta</span>
                <a href={`mailto:${site.email}`} className="mt-1 inline-block text-slate-300 transition hover:text-white">
                  {site.email}
                </a>
              </li>
              <li>
                <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">Telefon</span>
                <a
                  href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}
                  className="mt-1 inline-block text-slate-300 transition hover:text-white"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">Adres</span>
                <span className="mt-1 block leading-relaxed text-slate-400">{site.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 sm:flex-row sm:gap-6">
          <p className="text-center text-xs text-slate-500 sm:text-left">
            © {year} {site.name}. Tüm hakları saklıdır.
          </p>
          <p className="text-center text-[11px] text-slate-600 sm:text-right">{h.footerBottomTagline}</p>
        </div>
      </FadeIn>
    </footer>
  )
}
