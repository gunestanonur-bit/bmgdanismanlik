/** Editable site content — single source for public site + admin */

export type NavItem = {
  id: string
  label: string
  labelShort?: string
}

export type SiteInfo = {
  name: string
  tagline: string
  description: string
  url: string
  googleBusinessProfileUrl: string
  email: string
  phone: string
  address: string
  logo: string
  favicon: string
}

export type HeroSlide = {
  id: string
  src: string
  alt: string
  title?: string
  description?: string
}

export type HeroStatCard = {
  label: string
  value: string
}

export type ConsultingService = {
  slug: string
  code: string
  title: string
  summary: string
  intro: string
  introImageUrl?: string
  offerings: string[]
  offeringsImageUrl?: string
  customSectionTitle?: string
  customSectionItems?: string[]
  customSectionImageUrl?: string
  processImageUrl?: string
  processSteps: { title: string; text: string }[]
}

export type TrainingService = ConsultingService
export type SectoralService = ConsultingService

/** /hakkimizda + ana sayfa Hakkımızda bölümü */
export type AboutPageContent = {
  heroImageUrl: string
  heroEyebrow: string
  heroTitle: string
  /** Boşsa hero altında site.tagline gösterilir */
  heroSubtitleOverride: string
  metaDescription: string
  mainParagraph: string
  bullets: string[]
  sideCardTitle: string
  sideCardText: string
  focusAreas: string[]
  ctaStripTitle: string
}

export type SiteVisuals = {
  consulting: {
    hubHero: string
    hubSecondary: string
    serviceHeroBySlug: Record<string, string>
  }
  training: {
    hubHero: string
    hubSecondary: string
  }
  sectoral: {
    hubHero: string
    hubSecondary: string
    heroBySlug: Record<string, string>
  }
}

/** Ana sayfa bölümleri + footer — önceden bileşen içinde sabit metinlerdi */
export type HomeSectionCopy = {
  contactEyebrow: string
  contactTitle: string
  contactIntro: string
  consultingEyebrow: string
  consultingTitle: string
  consultingIntro: string
  trainingEyebrow: string
  trainingTitle: string
  trainingIntro: string
  trainingHubButton: string
  sectoralEyebrow: string
  sectoralTitle: string
  sectoralIntro: string
  sectoralHubButton: string
  footerCtaPrimary: string
  footerCtaSecondary: string
  footerHeadingExplore: string
  footerHeadingServices: string
  footerHeadingContact: string
  footerBottomTagline: string
  whatsappTooltip: string
  whatsappPresetMessage: string
}

export type PageBanners = {
  hakkimizda: string
  iletisim: string
  danismanlikHub: string
  egitimHub: string
  sektorelHub: string
  danismanlikDetay: string
  egitimDetay: string
  sektorelDetay: string
}

export type EmailSettings = {
  recipientEmail: string
  fromName: string
  subjectPrefix: string
  successMessage: string
}

export type ContactMessage = {
  id: string
  ad: string
  email: string
  telefon: string
  konu: string
  mesaj: string
  isRead: boolean
  repliedAt: string | null
  replyText: string
  createdAt: string
}

export type SiteContent = {
  site: SiteInfo
  navItems: NavItem[]
  trainingHighlights: string[]
  sectoralHighlights: string[]
  heroSlides: HeroSlide[]
  heroStats: HeroStatCard[]
  consultingServices: ConsultingService[]
  trainingServices: TrainingService[]
  sectoralServices: SectoralService[]
  aboutPage: AboutPageContent
  visuals: SiteVisuals
  pageBanners: PageBanners
  homeSectionCopy: HomeSectionCopy
  emailSettings: EmailSettings
}

export const CONTENT_VERSION = 1 as const
