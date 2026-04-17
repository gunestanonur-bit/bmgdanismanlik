import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SeoHelmet } from '../components/SeoHelmet'
import { ContactPanel } from '../components/sections/ContactSection'
import { getPageBanner } from '../content/selectors'
import { useSiteContent } from '../content/SiteContentContext'
import { organizationJsonLd } from '../lib/seo'

const CONTACT_HERO =
  'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=2400&q=85'

export function ContactPage() {
  const { content } = useSiteContent()
  const { site } = content
  const pageBanner = getPageBanner(content, 'iletisim', CONTACT_HERO)
  const { pathname } = useLocation()
  const title = `İletişim | ${site.name}`
  const metaDesc = `${site.name} ile iletişime geçin. Danışmanlık, eğitim ve belgelendirme talepleriniz için form veya doğrudan e-posta ve telefon.`

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
            <span className="text-white">İletişim</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary-200">
              Bize yazın veya arayın
            </p>
            <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-sm sm:text-5xl">
              İletişim
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">
              Talebinizi iletin; en kısa sürede size dönüş yapalım. Formu doldurabilir veya doğrudan e-posta ve telefon ile ulaşabilirsiniz.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-slate-50/50 pb-20 pt-10 sm:pb-24 sm:pt-14" aria-labelledby="iletisim-baslik">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ContactPanel />
        </div>
      </section>
    </>
  )
}
