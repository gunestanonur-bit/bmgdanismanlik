import { Helmet } from 'react-helmet-async'
import { absoluteUrl, hreflangAlternates } from '../lib/seo'

type SeoHelmetProps = {
  title: string
  description: string
  siteUrl: string
  pathname: string
  siteName?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  jsonLd?: Record<string, unknown>[]
  noindex?: boolean
  children?: React.ReactNode
}

export function SeoHelmet({
  title,
  description,
  siteUrl,
  pathname,
  siteName,
  ogImage,
  ogType = 'website',
  jsonLd = [],
  noindex = false,
  children,
}: SeoHelmetProps) {
  const canonical = absoluteUrl(siteUrl, pathname)
  const alts = hreflangAlternates(siteUrl, pathname)

  return (
    <Helmet htmlAttributes={{ lang: 'tr' }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      <link rel="canonical" href={canonical} />
      {alts.map((a) => (
        <link key={a.hrefLang} rel="alternate" hrefLang={a.hrefLang} href={a.href} />
      ))}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {siteName ? <meta property="og:site_name" content={siteName} /> : null}
      <meta property="og:locale" content="tr_TR" />
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      {ogImage ? <meta property="og:image:alt" content={title} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
      {children}
    </Helmet>
  )
}
