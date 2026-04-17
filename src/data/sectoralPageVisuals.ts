import { getServiceHeroImage } from './consultingPageVisuals'

export const SECTORAL_HUB_HERO =
  'https://images.unsplash.com/photo-1581092160562-40aa08f7880a?auto=format&fit=crop&w=2400&q=85'

export const SECTORAL_HUB_SECONDARY =
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1600&q=85'

export const sectoralHeroBySlug: Record<string, string> = {
  'as-9100-havacilik-savunma':
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=85',
  eydep:
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=85',
  'mevcut-durum-analizi':
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=85',
  'tesis-guvenlik-belgesi':
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=2000&q=85',
}

export function getSectoralHeroImage(slug: string): string {
  return sectoralHeroBySlug[slug] ?? getServiceHeroImage('iso-9001')
}
