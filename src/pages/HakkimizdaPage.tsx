import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FadeIn } from '../components/FadeIn'
import { SeoHelmet } from '../components/SeoHelmet'
import { formatAboutNamePlaceholder } from '../content/aboutText'
import { getPageBanner } from '../content/selectors'
import { useSiteContent } from '../content/SiteContentContext'
import { breadcrumbJsonLd, organizationJsonLd, professionalServiceJsonLd } from '../lib/seo'

export function HakkimizdaPage() {
  const { content } = useSiteContent()
  const { site, aboutPage: a } = content
  const pageBanner = getPageBanner(content, 'hakkimizda', a.heroImageUrl)
  const { pathname } = useLocation()
  const title = `Hakkımızda | ${site.name} - AS 9100 ve ISO 9001 Danışmanlığı`

  const heroSubtitle = a.heroSubtitleOverride.trim() || site.tagline
  const mainText = formatAboutNamePlaceholder(a.mainParagraph, site.name)
  const metaDesc =
    a.metaDescription.trim() ||
    `${site.name}; kalite yönetim sistemleri, ISO 9001 ve AS 9100 belgelendirme desteği, süreç iyileştirme ve teknik eğitim hizmetleri sunar.`

  return (
    <>
      <SeoHelmet
        title={title}
        description={metaDesc}
        siteUrl={site.url}
        pathname={pathname}
        siteName={site.name}
        ogImage={pageBanner}
        jsonLd={[
          organizationJsonLd(site.url, site),
          professionalServiceJsonLd(site.url, site),
          breadcrumbJsonLd(site.url, [
            { name: 'Ana sayfa', path: '/' },
            { name: 'Hakkımızda', path: '/hakkimizda' },
          ]),
        ]}
      />

      <section className="relative min-h-[min(52vh,28rem)] overflow-hidden">
        <img
          src={pageBanner}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a0c]/95 via-[#70151C]/55 to-black/45" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.1),transparent)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[min(52vh,28rem)] max-w-6xl flex-col justify-end px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 lg:pb-20">
          <nav className="mb-8 text-sm text-white/70" aria-label="Sayfa konumu">
            <Link to="/" className="transition hover:text-white">
              Ana sayfa
            </Link>
            <span className="mx-2 text-white/40" aria-hidden>
              /
            </span>
            <span className="text-white">Hakkımızda</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary-200">{a.heroEyebrow}</p>
            <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-sm sm:text-5xl">
              {a.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">{heroSubtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="hakkimizda-baslik">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <FadeIn className="lg:col-span-7">
              <h2 id="hakkimizda-baslik" className="sr-only">
                {a.heroTitle}
              </h2>
              <p className="whitespace-pre-line text-lg leading-relaxed text-slate-600">{mainText}</p>
              <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                {a.bullets.map((item) => (
                  <li
                    key={item}
                    className="group flex gap-4 rounded-2xl border border-slate-200/80 bg-white/60 px-4 py-3.5 text-slate-700 shadow-sm transition hover:border-primary-200/80 hover:shadow-md"
                  >
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-[10px] font-bold text-white shadow-sm"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span className="text-[15px] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-primary-600/[0.08] via-slate-50 to-slate-100 p-8 shadow-xl shadow-slate-900/5">
                <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary-600/15 blur-2xl" aria-hidden />
                <p className="font-[family-name:var(--font-display)] text-xl font-bold leading-tight text-slate-900">
                  {a.sideCardTitle}
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{a.sideCardText}</p>
                <div className="mt-8 space-y-4 border-t border-slate-200/80 pt-8">
                  {a.focusAreas.map((t) => (
                    <div key={t} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <span className="h-1 w-1 rounded-full bg-primary-600" aria-hidden />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="mt-16 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-8 sm:p-10 lg:p-12">
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-primary-700">
                {a.ctaStripTitle}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link
                  to="/danismanlik"
                  className="rounded-2xl border border-primary-200/90 bg-white px-6 py-3 text-sm font-semibold text-primary-800 shadow-sm transition hover:border-primary-300 hover:bg-primary-50"
                >
                  Danışmanlık
                </Link>
                <Link
                  to="/egitim"
                  className="rounded-2xl border border-primary-200/90 bg-white px-6 py-3 text-sm font-semibold text-primary-800 shadow-sm transition hover:border-primary-300 hover:bg-primary-50"
                >
                  Eğitim
                </Link>
                <Link
                  to="/sektorel"
                  className="rounded-2xl border border-primary-200/90 bg-white px-6 py-3 text-sm font-semibold text-primary-800 shadow-sm transition hover:border-primary-300 hover:bg-primary-50"
                >
                  Sektörel hizmetler
                </Link>
                <Link
                  to="/iletisim"
                  className="rounded-2xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700"
                >
                  İletişime geçin
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
