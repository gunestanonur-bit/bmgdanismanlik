/** Danışmanlık listesi ve detay sayfaları için Unsplash görselleri */

export const CONSULTING_HUB_HERO =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2400&q=85'

export const CONSULTING_HUB_SECONDARY =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85'

/** Detay sayfası hero + liste kartı üst görseli (slug bazlı) */
export const serviceHeroBySlug: Record<string, string> = {
  'iso-9001':
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=85',
  'iso-14001':
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=85',
  'iso-45001':
    'https://images.unsplash.com/photo-1581092160562-40aa08f7880a?auto=format&fit=crop&w=2000&q=85',
  'iso-10002':
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2000&q=85',
  'iso-31000':
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=85',
  'iso-27001':
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=2000&q=85',
  'iso-50001':
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2000&q=85',
  'as-9100':
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=85',
  'iatf-16949':
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=2000&q=85',
}

export function getServiceHeroImage(slug: string): string {
  return serviceHeroBySlug[slug] ?? serviceHeroBySlug['iso-9001']!
}
