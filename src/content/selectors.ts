import type { SiteContent } from './types'

export function getConsultingBySlug(content: SiteContent, slug: string) {
  return content.consultingServices.find((s) => s.slug === slug)
}

export function getTrainingBySlug(content: SiteContent, slug: string) {
  return content.trainingServices.find((s) => s.slug === slug)
}

export function getSectoralBySlug(content: SiteContent, slug: string) {
  return content.sectoralServices.find((s) => s.slug === slug)
}

export function getConsultingHeroImage(content: SiteContent, _slug: string) {
  return content.visuals.consulting.hubHero || content.visuals.consulting.hubSecondary || ''
}

export function getTrainingHeroImage(content: SiteContent, _slug: string) {
  return content.visuals.training.hubHero || content.visuals.training.hubSecondary || getConsultingHeroImage(content, _slug)
}

export function getSectoralHeroImage(content: SiteContent, _slug: string) {
  return content.visuals.sectoral.hubHero || content.visuals.sectoral.hubSecondary || getConsultingHeroImage(content, _slug)
}

export function getPageBanner(content: SiteContent, key: keyof SiteContent['pageBanners'], fallback: string) {
  return content.pageBanners[key].trim() || fallback
}
