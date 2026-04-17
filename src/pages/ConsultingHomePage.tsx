import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '../components/AnimatedCounter'
import { FadeIn } from '../components/FadeIn'
import { SeoHelmet } from '../components/SeoHelmet'
import { getConsultingHeroImage, getPageBanner } from '../content/selectors'
import { useSiteContent } from '../content/SiteContentContext'
import { organizationJsonLd } from '../lib/seo'

export function ConsultingHomePage() {
  const { content } = useSiteContent()
  const { site, consultingServices } = content
  const { hubHero, hubSecondary } = content.visuals.consulting
  const pageBanner = getPageBanner(content, 'danismanlikHub', hubHero)
  const { pathname } = useLocation()
  const title = `Danışmanlık hizmetlerimiz | ${site.name}`
  const hubStats = [
    { label: 'Kapsam', value: '9+', sub: 'standart & sektörel' },
    { label: 'Yaklaşım', value: 'Süreç', sub: 'odaklı danışmanlık' },
    { label: 'Destek', value: 'Uçtan uca', sub: 'belgelendirme hazırlığı' },
  ]
  const features = [
    {
      title: 'Kuruma özel kapsam',
      text: 'Önceliklerinize göre yol haritası; gereksiz dokümantasyon yükü olmadan uygulanabilir sistem.',
    },
    {
      title: 'Denetim hazırlığı',
      text: 'İç tetkik ve yönetim gözden geçirme ile üçüncü taraf denetim öncesi hazırlık.',
    },
    {
      title: 'Sürekli iyileştirme',
      text: 'Sertifikasyon sonrası performans izleme ve iyileştirme döngüsüne rehberlik.',
    },
  ]
  const metaDesc =
    'ISO 9001, ISO 14001, ISO 45001 ve diğer yönetim sistemi standartlarında danışmanlık. Kurumsal süreçleriniz için uçtan uca destek.'

  return (
    <>
      <SeoHelmet
        title={title}
        description={metaDesc}
        siteUrl={site.url}
        pathname={pathname}
        siteName={site.name}
        ogImage={pageBanner}
        jsonLd={[organizationJsonLd(site.url, site)]}
      />

      {/* Hero */}
      <section className="relative min-h-[min(72vh,40rem)] overflow-hidden">
        <img
          src={pageBanner}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a0c]/95 via-[#70151C]/45 to-black/40" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.12),transparent)]" aria-hidden />

        <div className="relative z-10 mx-auto flex min-h-[min(72vh,40rem)] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24">
          <nav className="mb-8 text-sm text-white/70" aria-label="Sayfa konumu">
            <Link to="/" className="transition hover:text-white">
              Ana sayfa
            </Link>
            <span className="mx-2 text-white/40" aria-hidden>
              /
            </span>
            <span className="text-white">Danışmanlık</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary-200">Uzmanlık alanlarımız</p>
            <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-[3.25rem]">
              Danışmanlık hizmetlerimiz
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
              ISO ve sektörel standartlarda sistem kurulumu, güçlendirme ve sürekli iyileştirme. Her hizmet için ayrıntılı sayfalar ve doğrudan iletişim seçenekleri.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {hubStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-md"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">{s.label}</p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-white">
                  <AnimatedCounter value={s.value} />
                </p>
                <p className="mt-0.5 text-sm text-white/75">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split feature — görsel + metin */}
      <section className="relative border-b border-slate-200/80 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <FadeIn>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5">
                <img
                  src={hubSecondary}
                  alt=""
                  className="aspect-[4/3] w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden />
                <p className="absolute bottom-5 left-5 right-5 text-sm font-medium text-white/95">
                  Ekiplerinizle birlikte süreçleri netleştiriyor, belgelendirme yolculuğunu planlıyoruz.
                </p>
              </div>
            </FadeIn>
            <FadeIn>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600">Neden birlikte?</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Kurumsal gerçekliğinize uygun sistem
              </h2>
              <ul className="mt-8 space-y-5">
                {features.map((f) => (
                  <li key={f.title} className="flex gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-xs font-bold text-white">
                      ✓
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900">{f.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{f.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Hizmet kartları — üstte fotoğraf */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20 lg:py-24" aria-labelledby="hizmet-listesi">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-200/60 to-transparent" aria-hidden />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionTitle id="hizmet-listesi" />
          </FadeIn>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {consultingServices.map((item, index) => (
              <FadeIn key={item.slug} delay={index * 0.05}>
                <article className="card-glow group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-900/[0.04] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-900/10">
                  <div className="relative h-36 overflow-hidden sm:h-44">
                    <img
                      src={getConsultingHeroImage(content, item.slug)}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" aria-hidden />
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary-800 shadow-sm">
                      {item.code}
                    </span>
                    <span className="absolute bottom-4 right-4 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold tabular-nums text-white backdrop-blur-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-[family-name:var(--font-display)] text-base font-bold leading-snug text-slate-900">
                      {item.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{item.summary}</p>
                    <Link
                      to={`/danismanlik/${item.slug}`}
                      className="mt-5 inline-flex items-center text-sm font-semibold text-primary-700 transition group-hover:gap-2"
                    >
                      Detaylı bilgi
                      <span className="ml-1 transition group-hover:translate-x-0.5" aria-hidden>
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <p className="mt-14 text-center">
              <Link
                to="/iletisim"
                className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-10 py-4 text-sm font-semibold text-white shadow-xl shadow-primary-600/30 transition hover:bg-primary-700"
              >
                Teklif veya ön görüşme talep edin
              </Link>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Alt CTA bandı */}
      <section className="relative overflow-hidden border-t border-slate-200/80 bg-slate-900 py-16 sm:py-20">
        <img
          src={pageBanner}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/60 to-[#70151C]/35" aria-hidden />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">
            Hangi standart size uygun?
          </h2>
          <p className="mt-4 text-white/85">
            Kısa bir ön görüşmede ihtiyacınızı birlikte netleştirelim; size özel yol haritası ve süre tahmini sunalım.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/iletisim"
              className="inline-flex rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
            >
              İletişime geçin
            </Link>
            <Link
              to="/"
              className="inline-flex rounded-2xl border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function SectionTitle({ id }: { id: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-600">Hizmetler</p>
      <h2 id={id} className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Standart ve sektörel çözümler
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        Aşağıdan ilgilendiğiniz standarda ait detay sayfasına geçebilir veya doğrudan bizimle iletişime geçebilirsiniz.
      </p>
    </div>
  )
}
