import { useMemo } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FadeIn } from '../components/FadeIn'
import { ReadingProgress } from '../components/ReadingProgress'
import { SeoHelmet } from '../components/SeoHelmet'
import { getPageBanner, getTrainingBySlug, getTrainingHeroImage } from '../content/selectors'
import { useSiteContent } from '../content/SiteContentContext'
import { useActiveSection } from '../hooks/useActiveSection'
import { breadcrumbJsonLd, faqPageJsonLd, organizationJsonLd, serviceDetailJsonLd } from '../lib/seo'

function SectionImage({ src, alt }: { src?: string; alt: string }) {
  const value = src?.trim()
  if (!value) return null
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <img src={value} alt={alt} className="h-56 w-full object-cover object-center sm:h-72" loading="lazy" decoding="async" />
    </div>
  )
}

export function TrainingServicePage() {
  const { content } = useSiteContent()
  const { slug } = useParams<{ slug: string }>()
  const { pathname } = useLocation()
  const service = slug ? getTrainingBySlug(content, slug) : undefined

  if (!service) {
    return <Navigate to="/egitim" replace />
  }

  const heroImage = getTrainingHeroImage(content, service.slug)
  const pageBanner = getPageBanner(content, 'egitimDetay', heroImage)
  const related = content.trainingServices.filter((s) => s.slug !== service.slug).slice(0, 4)
  const { site } = content
  const pageTitle = `${service.code} ${service.title} | ${site.name}`

  const bc = [
    { name: 'Ana sayfa', path: '/' },
    { name: 'Eğitim', path: '/egitim' },
    { name: `${service.code}`, path: pathname },
  ]

  const jsonLd = [
    organizationJsonLd(site.url, site),
    serviceDetailJsonLd(site.url, pathname, {
      title: service.title,
      summary: service.summary,
      slug: service.slug,
    }),
    breadcrumbJsonLd(site.url, bc),
    ...(service.processSteps.length > 0
      ? [faqPageJsonLd(service.processSteps.map((s) => ({ question: s.title, answer: s.text })))]
      : []),
  ]

  const tocIds = useMemo(() => ['giris', 'program-icerik', 'benzersiz', 'program-akisi'], [])
  const activeSection = useActiveSection(tocIds)

  const L = {
    bc: 'Sayfa konumu',
    badge: 'Eğitim',
    summary: 'Özet',
    program: 'Program içeriği',
    flow: 'Tipik program akışı',
    unique: service.customSectionTitle?.trim() || 'Programa özel farklar',
    uniqueEmpty: 'Bu bölüm için içerik admin panelinden eklenebilir.',
    flowNote: 'Süre ve modüller kurumunuza göre özelleştirilebilir.',
    ctaTitle: `${service.code} eğitimi için talep oluşturun`,
    ctaSub: 'Katılımcı sayısı, süre ve yerleşim için birlikte planlayalım.',
    ctaBtn: 'İletişim formu',
    back: '← Tüm eğitim programları',
    contact: 'İletişime geçin',
    toc: 'Bu sayfada',
    quick: 'Hızlı iletişim',
    other: 'Diğer programlar',
    seeAll: 'Tümünü gör',
    tocSummary: 'Özet',
    tocProgram: 'Program içeriği',
    tocUnique: service.customSectionTitle?.trim() || 'Programa özel farklar',
    tocFlow: 'Program akışı',
  }

  return (
    <>
      <SeoHelmet
        title={pageTitle}
        description={service.summary}
        siteUrl={site.url}
        pathname={pathname}
        siteName={site.name}
        ogImage={pageBanner}
        ogType="article"
        jsonLd={jsonLd}
      />
      <ReadingProgress />

      <section className="relative min-h-[min(56vh,28rem)] overflow-hidden">
        <img
          src={pageBanner}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#70151C]/40 to-black/35" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_120%,rgba(112,21,28,0.35),transparent)]" aria-hidden />

        <div className="relative z-10 mx-auto flex min-h-[min(56vh,28rem)] max-w-6xl flex-col justify-end px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
          <nav className="mb-6 text-sm text-white/75" aria-label={L.bc}>
            <Link to="/" className="transition hover:text-white">
              Ana sayfa
            </Link>
            <span className="mx-2 text-white/40" aria-hidden>
              /
            </span>
            <Link to="/egitim" className="transition hover:text-white">
              Eğitim
            </Link>
            <span className="mx-2 text-white/40" aria-hidden>
              /
            </span>
            <span className="text-white" aria-current="page">
              {service.code}
            </span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/95 backdrop-blur-md">
              {L.badge}
            </span>
            <h1 className="mt-5 max-w-4xl font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.15] tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-5xl">
              <span className="text-primary-200">{service.code}</span>
              <span className="mt-2 block text-white sm:mt-1">{service.title}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/88 sm:text-lg">{service.summary}</p>
          </motion.div>
        </div>
      </section>

      <article className="border-b border-slate-200/80 bg-gradient-to-b from-slate-50/80 to-white pb-20 pt-12 sm:pb-24 sm:pt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0">
              <FadeIn>
                <div
                  id="giris"
                  className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:p-8"
                >
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-slate-900">{L.summary}</h2>
                  <SectionImage
                    src={service.introImageUrl}
                    alt={`${service.code} ${service.title} giris bolumu gorseli`}
                  />
                  <p className="mt-4 text-base leading-relaxed text-slate-600">{service.intro}</p>
                </div>
              </FadeIn>

              <FadeIn>
                <section className="mt-10 scroll-mt-28" id="program-icerik" aria-labelledby="program-icerik-baslik">
                  <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
                    <h2 id="program-icerik-baslik" className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-900">
                      {L.program}
                    </h2>
                  </div>
                  <SectionImage
                    src={service.offeringsImageUrl}
                    alt={`${service.code} ${service.title} program icerigi gorseli`}
                  />
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {service.offerings.map((line) => (
                      <li
                        key={line}
                        className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-primary-200/80 hover:shadow-md"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-xs font-bold text-white">
                          ✓
                        </span>
                        <span className="text-[15px] leading-relaxed text-slate-700">{line}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </FadeIn>

              <FadeIn>
                <section className="mt-14 scroll-mt-28" id="benzersiz" aria-labelledby="benzersiz-baslik">
                  <h2 id="benzersiz-baslik" className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-900">
                    {L.unique}
                  </h2>
                  <SectionImage
                    src={service.customSectionImageUrl}
                    alt={`${service.code} ${service.title} ozel bolum gorseli`}
                  />
                  {service.customSectionItems && service.customSectionItems.length > 0 ? (
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                      {service.customSectionItems.map((line) => (
                        <li
                          key={line}
                          className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-primary-200/80 hover:shadow-md"
                        >
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-xs font-bold text-white">
                            +
                          </span>
                          <span className="text-[15px] leading-relaxed text-slate-700">{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">{L.uniqueEmpty}</p>
                  )}
                </section>
              </FadeIn>

              <FadeIn>
                <section className="mt-14 scroll-mt-28" id="program-akisi" aria-labelledby="program-akisi-baslik">
                  <h2 id="program-akisi-baslik" className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-900">
                    {L.flow}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">{L.flowNote}</p>
                  <SectionImage
                    src={service.processImageUrl}
                    alt={`${service.code} ${service.title} program akisi gorseli`}
                  />

                  <ol className="mt-8 space-y-4">
                    {service.processSteps.map((step, i) => (
                      <li
                        key={step.title}
                        className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-slate-900/[0.02]"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-sm font-bold text-white shadow-md">
                          {i + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold text-slate-900">{step.title}</h3>
                          <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{step.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </FadeIn>

              <FadeIn>
                <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 shadow-2xl">
                  <div className="relative px-6 py-10 sm:px-10">
                    <img
                      src={pageBanner}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-[#70151C]/35" aria-hidden />
                    <div className="relative z-10 max-w-xl">
                      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-white sm:text-2xl">{L.ctaTitle}</h2>
                      <p className="mt-2 text-sm text-white/85">{L.ctaSub}</p>
                      <Link
                        to="/iletisim"
                        className="mt-6 inline-flex rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
                      >
                        {L.ctaBtn}
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn>
                <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-10 sm:flex-row sm:items-center sm:justify-between">
                  <Link to="/egitim" className="text-sm font-semibold text-primary-700 hover:underline">
                    {L.back}
                  </Link>
                  <Link
                    to="/iletisim"
                    className="inline-flex justify-center rounded-2xl bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700"
                  >
                    {L.contact}
                  </Link>
                </div>
              </FadeIn>
            </div>

            <aside className="md:sticky md:top-28 md:self-start">
              <nav
                className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-900/5"
                aria-label="Sayfa içi"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{L.toc}</p>
                <ul className="mt-4 space-y-1">
                  {([['giris', L.tocSummary], ['program-icerik', L.tocProgram], ['benzersiz', L.tocUnique], ['program-akisi', L.tocFlow]] as const).map(([id, label]) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          activeSection === id
                            ? 'border-l-2 border-primary-600 bg-primary-50 text-primary-800'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-slate-200 pt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{L.quick}</p>
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-2 block text-sm font-semibold text-primary-700 hover:underline"
                  >
                    {site.email}
                  </a>
                </div>
              </nav>

              <div className="mt-6 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-5 shadow-lg shadow-slate-900/5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{L.other}</p>
                <ul className="mt-3 space-y-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        to={`/egitim/${r.slug}`}
                        className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-white hover:shadow-sm"
                      >
                        <span className="font-medium text-primary-700">{r.code}</span>
                        <span aria-hidden className="text-slate-400">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to="/egitim" className="mt-4 block text-center text-xs font-semibold text-primary-700 hover:underline">
                  {L.seeAll}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  )
}
