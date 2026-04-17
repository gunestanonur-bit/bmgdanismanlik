import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SeoHelmet } from '../components/SeoHelmet'
import { useSiteContent } from '../content/SiteContentContext'

export function NotFoundPage() {
  const { content } = useSiteContent()
  const { site } = content
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Ana sayfa', desc: 'Başlangıç noktasına dönün' },
    { to: '/danismanlik', label: 'Danışmanlık', desc: 'ISO ve yönetim sistemi danışmanlığı' },
    { to: '/egitim', label: 'Eğitim', desc: 'Sertifikasyon ve kapasite programları' },
    { to: '/sektorel', label: 'Sektörel hizmetler', desc: 'Havacılık, savunma ve özel sektörler' },
    { to: '/iletisim', label: 'İletişim', desc: 'Bizimle doğrudan iletişime geçin' },
  ]

  return (
    <>
      <SeoHelmet
        title={`Sayfa bulunamadı | ${site.name}`}
        description="Aradığınız sayfa bulunamadı."
        siteUrl={site.url}
        pathname={pathname}
        siteName={site.name}
        noindex
      />

      <div className="mx-auto max-w-2xl px-4 py-24 sm:py-32">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-[family-name:var(--font-display)] text-8xl font-extrabold tracking-tight text-slate-100 sm:text-9xl">
            404
          </p>
          <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-primary-600">
            Sayfa bulunamadı
          </p>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-bold text-slate-900 sm:text-3xl">
            Bu adreste bir şey yok
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-500">
            Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
            <br />
            Aşağıdan devam edebilirsiniz.
          </p>
        </motion.div>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2">
          {links.map(({ to, label, desc }) => (
            <li key={to}>
              <Link
                to={to}
                className="card-glow group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm transition hover:border-primary-200 hover:shadow-md"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition group-hover:bg-primary-50 group-hover:text-primary-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="mt-0.5 text-xs leading-snug text-slate-500">{desc}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
