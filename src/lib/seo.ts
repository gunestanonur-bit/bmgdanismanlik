/** Strip trailing slash except for root. */
export function normalizeSiteUrl(url: string): string {
  const t = url.trim()
  if (t.length <= 1) return t
  return t.replace(/\/+$/, '')
}

export function absoluteUrl(siteUrl: string, pathname: string): string {
  const base = normalizeSiteUrl(siteUrl)
  if (!pathname || pathname === '/') return `${base}/`
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${base}${p}`
}

function resolveAssetUrl(siteUrl: string, assetPath: string): string {
  const raw = assetPath.trim()
  if (!raw) return absoluteUrl(siteUrl, '/favicon.svg')
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith('data:') || raw.startsWith('blob:')) return raw
  return absoluteUrl(siteUrl, raw.startsWith('/') ? raw : `/${raw}`)
}

export function hreflangAlternates(
  siteUrl: string,
  pathname: string,
): { hrefLang: string; href: string }[] {
  return [
    { hrefLang: 'tr', href: absoluteUrl(siteUrl, pathname) },
    { hrefLang: 'x-default', href: absoluteUrl(siteUrl, pathname) },
  ]
}

export function breadcrumbJsonLd(
  siteUrl: string,
  items: { name: string; path?: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(siteUrl, item.path) } : {}),
    })),
  }
}

export function organizationJsonLd(
  siteUrl: string,
  site: {
    name: string
    description: string
    email: string
    phone: string
    address: string
    logo?: string
    favicon?: string
    googleBusinessProfileUrl?: string
  },
) {
  const base = normalizeSiteUrl(siteUrl)
  const sameAs = [site.googleBusinessProfileUrl?.trim()].filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: site.name,
    url: `${base}/`,
    description: site.description,
    logo: resolveAssetUrl(siteUrl, site.logo || site.favicon || '/favicon.svg'),
    email: site.email,
    telephone: site.phone,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TR',
      streetAddress: site.address,
    },
  }
}

export function webSiteJsonLd(siteUrl: string, site: { name: string; description: string }) {
  const base = normalizeSiteUrl(siteUrl)
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    url: `${base}/`,
    name: site.name,
    description: site.description,
    inLanguage: 'tr-TR',
    publisher: { '@id': `${base}/#organization` },
  }
}

export function professionalServiceJsonLd(
  siteUrl: string,
  site: { name: string; description: string; url: string; googleBusinessProfileUrl?: string },
) {
  const base = normalizeSiteUrl(siteUrl)
  const sameAs = [site.googleBusinessProfileUrl?.trim()].filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${base}/#professional-service`,
    name: site.name,
    description: site.description,
    url: site.url || `${base}/`,
    areaServed: { '@type': 'Country', name: 'Turkey' },
    availableLanguage: ['Turkish'],
    provider: { '@id': `${base}/#organization` },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

export function localBusinessJsonLd(
  siteUrl: string,
  site: {
    name: string
    description: string
    url: string
    email: string
    phone: string
    address: string
    logo?: string
    favicon?: string
    googleBusinessProfileUrl?: string
  },
) {
  const base = normalizeSiteUrl(siteUrl)
  const sameAs = [site.googleBusinessProfileUrl?.trim()].filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${base}/#local-business`,
    name: site.name,
    url: site.url || `${base}/`,
    description: site.description,
    image: resolveAssetUrl(siteUrl, site.logo || site.favicon || '/favicon.svg'),
    email: site.email,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TR',
      streetAddress: site.address,
    },
    areaServed: { '@type': 'Country', name: 'Turkey' },
    availableLanguage: ['Turkish'],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

export function serviceDetailJsonLd(
  siteUrl: string,
  pathname: string,
  service: { title: string; summary: string; slug: string },
) {
  const base = normalizeSiteUrl(siteUrl)
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    url: absoluteUrl(siteUrl, pathname),
    provider: { '@id': `${base}/#organization` },
    areaServed: { '@type': 'Country', name: 'Turkey' },
  }
}

export function faqPageJsonLd(
  items: { question: string; answer: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
