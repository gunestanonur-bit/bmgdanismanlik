import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SeoHelmet } from '../components/SeoHelmet'
import { HERO_SLIDE_IMAGE_FALLBACK } from '../components/HeroSlider'
import { Hero } from '../components/sections/Hero'
import { AboutSection } from '../components/sections/AboutSection'
import { ConsultingSection } from '../components/sections/ConsultingSection'
import { TrainingSection } from '../components/sections/TrainingSection'
import { SectoralSection } from '../components/sections/SectoralSection'
import { ContactSection } from '../components/sections/ContactSection'
import { useSiteContent } from '../content/SiteContentContext'
import {
  localBusinessJsonLd,
  organizationJsonLd,
  professionalServiceJsonLd,
  webSiteJsonLd,
} from '../lib/seo'

export function HomePage() {
  const { content } = useSiteContent()
  const { site, heroSlides } = content
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => window.clearTimeout(t)
  }, [location.hash, location.pathname])

  const pageTitle = `${site.name} | ISO ve Yönetim Sistemi Danışmanlığı`
  const ogImage = heroSlides[0]?.src?.trim() || HERO_SLIDE_IMAGE_FALLBACK

  const jsonLdBlocks = [
    organizationJsonLd(site.url, site),
    localBusinessJsonLd(site.url, site),
    webSiteJsonLd(site.url, site),
    professionalServiceJsonLd(site.url, {
      name: site.name,
      description: site.description,
      url: site.url,
      googleBusinessProfileUrl: site.googleBusinessProfileUrl,
    }),
  ]

  return (
    <>
      <SeoHelmet
        title={pageTitle}
        description={site.description}
        siteUrl={site.url}
        pathname={location.pathname}
        siteName={site.name}
        ogImage={ogImage}
        jsonLd={jsonLdBlocks}
      >
        <meta
          name="keywords"
          content="ISO 9001, ISO 14001, ISO 45001, ISO 27001, IATF 16949, AS 9100, danışmanlık, kalite yönetimi, Türkiye"
        />
      </SeoHelmet>

      <Hero />
      <AboutSection />
      <ConsultingSection />
      <TrainingSection />
      <SectoralSection />
      <ContactSection />
    </>
  )
}
