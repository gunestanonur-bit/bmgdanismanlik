import { useSiteContent } from '../../content/SiteContentContext'
import { useToast } from '../../components/Toast'
import type { HeroSlide, HeroStatCard } from '../../content/types'
import { ImagePreview } from '../components/ImagePreview'

export function HeroSettingsPage() {
  const { content, updateContent } = useSiteContent()
  const toast = useToast()

  function persistSlides(slides: HeroSlide[]) {
    updateContent((c) => ({ ...c, heroSlides: slides }))
    toast('Slaytlar kaydedildi.')
  }

  function persistStats(stats: HeroStatCard[]) {
    updateContent((c) => ({ ...c, heroStats: stats }))
    toast('İstatistik kartları kaydedildi.')
  }

  return (
    <div>
      <h1 className="admin-page-title">Hero slider</h1>
      <p className="admin-page-subtitle">Ana sayfa tam ekran görselleri ve alt istatistik kartları.</p>

      <section className="admin-card mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="admin-section-title">Slaytlar</h2>
            <p className="mt-0.5 text-sm text-slate-500">{content.heroSlides.length} görsel</p>
          </div>
          <button
            type="button"
            onClick={() =>
              persistSlides([
                ...content.heroSlides,
                {
                  id: String(Date.now()),
                  src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=85',
                  alt: 'Yeni slayt',
                  title: 'Yeni slayt başlığı',
                  description: 'Yeni slayt açıklaması',
                },
              ])
            }
            className="admin-btn admin-btn-primary"
          >
            + Slayt ekle
          </button>
        </div>
        <div className="mt-6 space-y-6">
          {content.heroSlides.map((slide, i) => (
            <div key={slide.id} className="admin-card-soft">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-500">
                  #{i + 1}
                </span>
                <button
                  type="button"
                  className="admin-btn admin-btn-danger px-3 py-1.5 text-xs"
                  onClick={() => {
                    persistSlides(content.heroSlides.filter((_, j) => j !== i))
                    toast('Slayt silindi.', 'warning')
                  }}
                >
                  Sil
                </button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Görsel URL</label>
                  <input
                    defaultValue={slide.src}
                    key={slide.src}
                    className="admin-input mt-1"
                    onBlur={(e) => {
                      const next = [...content.heroSlides]
                      next[i] = { ...slide, src: e.target.value }
                      persistSlides(next)
                    }}
                  />
                  <ImagePreview url={slide.src} className="mt-2" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Slayt başlığı</label>
                  <input
                    defaultValue={slide.title ?? ''}
                    key={slide.title}
                    className="admin-input mt-1"
                    onBlur={(e) => {
                      const next = [...content.heroSlides]
                      next[i] = { ...slide, title: e.target.value }
                      persistSlides(next)
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">Slayt açıklaması</label>
                  <textarea
                    defaultValue={slide.description ?? ''}
                    key={slide.description}
                    className="admin-input mt-1 min-h-[84px]"
                    onBlur={(e) => {
                      const next = [...content.heroSlides]
                      next[i] = { ...slide, description: e.target.value }
                      persistSlides(next)
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Alt metin</label>
                  <input
                    defaultValue={slide.alt}
                    key={slide.alt}
                    className="admin-input mt-1"
                    onBlur={(e) => {
                      const next = [...content.heroSlides]
                      next[i] = { ...slide, alt: e.target.value }
                      persistSlides(next)
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-card mt-8">
        <h2 className="admin-section-title">Hero altı — cam kartlar</h2>
        <p className="mt-1 text-sm text-slate-500">Soldaki sütun etiket, sağdaki değer</p>
        <div className="mt-4 space-y-3">
          <div className="grid gap-2 px-1 sm:grid-cols-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Etiket</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Değer</p>
          </div>
          {content.heroStats.map((row, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-2">
              <input
                defaultValue={row.label}
                key={row.label}
                placeholder="Etiket"
                className="admin-input"
                onBlur={(e) => {
                  const next = [...content.heroStats]
                  next[i] = { ...row, label: e.target.value }
                  persistStats(next)
                }}
              />
              <input
                defaultValue={row.value}
                key={row.value}
                placeholder="Değer"
                className="admin-input"
                onBlur={(e) => {
                  const next = [...content.heroStats]
                  next[i] = { ...row, value: e.target.value }
                  persistStats(next)
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
