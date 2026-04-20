import { Link } from 'react-router-dom'
import { useSiteContent } from '../../content/SiteContentContext'
import { getPageBanner } from '../../content/selectors'
import type { PageBanners } from '../../content/types'

export function AdminPageBannerPreview({
  bannerKey,
  fallback,
  title,
  publicPath,
}: {
  bannerKey: keyof PageBanners
  fallback: string
  title: string
  /** Public route for “open live page” */
  publicPath?: string
}) {
  const { content } = useSiteContent()
  const url = getPageBanner(content, bannerKey, fallback)
  const custom = Boolean(content.pageBanners[bannerKey].trim())

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm ring-1 ring-black/5">
      <div className="relative h-40 sm:h-48">
        <img src={url} alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-10 sm:px-5 sm:pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/75">Sayfa bannerı</p>
              <p className="mt-0.5 text-sm font-medium text-white">{title}</p>
              <p className="mt-1 text-xs text-white/65">
                {custom
                  ? 'Özel banner kayıtlı; herkese açık sitede böyle görünür.'
                  : 'Banner ayarlı değil; yedek görsel kullanılıyor (Görseller veya ilgili içerik alanları).'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {publicPath ? (
                <Link
                  to={publicPath}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Canlı sayfayı aç
                </Link>
              ) : null}
              <Link
                to="/admin/banners"
                className="inline-flex rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Bannerı düzenle
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
