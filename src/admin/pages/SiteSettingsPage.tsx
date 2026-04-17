import { useSiteContent } from '../../content/SiteContentContext'
import { useToast } from '../../components/Toast'
import type { NavItem } from '../../content/types'

export function SiteSettingsPage() {
  const { content, updateContent } = useSiteContent()
  const toast = useToast()

  function saveSite(partial: Partial<typeof content.site>) {
    updateContent((c) => ({ ...c, site: { ...c.site, ...partial } }))
    toast('Kaydedildi.')
  }

  function saveHighlights(which: 'training' | 'sectoral', lines: string) {
    const arr = lines
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    updateContent((c) =>
      which === 'training' ? { ...c, trainingHighlights: arr } : { ...c, sectoralHighlights: arr },
    )
    toast('Kaydedildi.')
  }

  function saveNav(items: NavItem[]) {
    updateContent((c) => ({ ...c, navItems: items }))
    toast('Kaydedildi.')
  }

  async function onFilePicked(which: 'logo' | 'favicon', file?: File) {
    if (!file) return
    const dataUrl = await readAsDataUrl(file)
    saveSite({ [which]: dataUrl })
  }

  return (
    <div>
      <h1 className="admin-page-title">Site & metinler</h1>
      <p className="admin-page-subtitle">Genel bilgiler, menü ve öne çıkan maddeler.</p>

      <section className="admin-card mt-8">
        <h2 className="admin-section-title">Kurumsal bilgiler</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Site adı" value={content.site.name} onBlur={(v) => saveSite({ name: v })} />
          <Field label="Canonical URL" value={content.site.url} onBlur={(v) => saveSite({ url: v })} />
          <Field label="E-posta" value={content.site.email} onBlur={(v) => saveSite({ email: v })} />
          <Field label="Telefon" value={content.site.phone} onBlur={(v) => saveSite({ phone: v })} />
          <div className="sm:col-span-2">
            <label className="admin-label">Logo dosyası</label>
            <p className="mt-1 text-xs text-slate-500">PNG, JPG, SVG (öneri: yatay logo)</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label className="admin-btn admin-btn-secondary cursor-pointer">
                Dosya seç
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  className="sr-only"
                  onChange={(e) => {
                    void onFilePicked('logo', e.target.files?.[0])
                      .catch(() => toast('Logo dosyası okunamadı.', 'error'))
                      .finally(() => {
                        e.target.value = ''
                      })
                  }}
                />
              </label>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => saveSite({ logo: '' })}>
                Logoyu temizle
              </button>
            </div>
            {content.site.logo ? (
              <img src={content.site.logo} alt="Site logosu önizleme" className="mt-3 h-12 max-w-[16rem] rounded-md object-contain" />
            ) : null}
          </div>
          <div className="sm:col-span-2">
            <label className="admin-label">Favicon dosyası</label>
            <p className="mt-1 text-xs text-slate-500">ICO, PNG veya SVG (öneri: kare)</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label className="admin-btn admin-btn-secondary cursor-pointer">
                Dosya seç
                <input
                  type="file"
                  accept="image/x-icon,image/png,image/svg+xml"
                  className="sr-only"
                  onChange={(e) => {
                    void onFilePicked('favicon', e.target.files?.[0])
                      .catch(() => toast('Favicon dosyası okunamadı.', 'error'))
                      .finally(() => {
                        e.target.value = ''
                      })
                  }}
                />
              </label>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => saveSite({ favicon: '/favicon.svg' })}>
                Varsayılan favicon
              </button>
            </div>
            {content.site.favicon ? (
              <img src={content.site.favicon} alt="Favicon önizleme" className="mt-3 h-10 w-10 rounded-md object-contain" />
            ) : null}
          </div>
          <div className="sm:col-span-2">
            <Field label="Adres" value={content.site.address} onBlur={(v) => saveSite({ address: v })} />
          </div>
          <div className="sm:col-span-2">
            <label className="admin-label">Kısa slogan (hero)</label>
            <textarea
              defaultValue={content.site.tagline}
              key={content.site.tagline}
              rows={2}
              className="admin-input mt-2"
              onBlur={(e) => saveSite({ tagline: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="admin-label">Açıklama (SEO / hero)</label>
            <textarea
              defaultValue={content.site.description}
              key={content.site.description}
              rows={4}
              className="admin-input mt-2"
              onBlur={(e) => saveSite({ description: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="admin-card mt-8">
        <h2 className="admin-section-title">Eğitim — öne çıkanlar</h2>
        <p className="mt-1 text-sm text-slate-500">Her satır bir madde</p>
        <textarea
          defaultValue={content.trainingHighlights.join('\n')}
          key={content.trainingHighlights.join('|')}
          rows={5}
          className="admin-input mt-4 font-mono"
          onBlur={(e) => saveHighlights('training', e.target.value)}
        />
      </section>

      <section className="admin-card mt-8">
        <h2 className="admin-section-title">Sektörel — öne çıkanlar</h2>
        <p className="mt-1 text-sm text-slate-500">Her satır bir madde</p>
        <textarea
          defaultValue={content.sectoralHighlights.join('\n')}
          key={content.sectoralHighlights.join('|')}
          rows={5}
          className="admin-input mt-4 font-mono"
          onBlur={(e) => saveHighlights('sectoral', e.target.value)}
        />
      </section>

      <section className="admin-card mt-8">
        <h2 className="admin-section-title">Menü öğeleri</h2>
        <p className="mt-1 text-sm text-slate-500">
          <span className="font-medium text-amber-700">Dikkat:</span> id değiştirirseniz sayfa yönlendirmeleri kırılabilir.
        </p>
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-3 gap-2 px-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">ID</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tam etiket</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kısa etiket</p>
          </div>
          {content.navItems.map((item, i) => (
            <div key={item.id} className="admin-card-soft grid gap-2 sm:grid-cols-3">
              <input
                defaultValue={item.id}
                className="admin-input font-mono text-xs"
                onBlur={(e) => {
                  const id = e.target.value.trim() || item.id
                  const next = [...content.navItems]
                  next[i] = { ...item, id }
                  saveNav(next)
                }}
              />
              <input
                defaultValue={item.label}
                className="admin-input sm:col-span-1"
                onBlur={(e) => {
                  const next = [...content.navItems]
                  next[i] = { ...item, label: e.target.value }
                  saveNav(next)
                }}
              />
              <input
                placeholder="Kısa etiket (isteğe bağlı)"
                defaultValue={item.labelShort ?? ''}
                className="admin-input"
                onBlur={(e) => {
                  const v = e.target.value.trim()
                  const next = [...content.navItems]
                  next[i] = { ...item, ...(v ? { labelShort: v } : { labelShort: undefined }) }
                  saveNav(next)
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error ?? new Error('Dosya okunamadı.'))
    reader.readAsDataURL(file)
  })
}

function Field({
  label,
  value,
  onBlur,
}: {
  label: string
  value: string
  onBlur: (v: string) => void
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <input
        defaultValue={value}
        key={value}
        className="admin-input mt-2"
        onBlur={(e) => onBlur(e.target.value)}
      />
    </div>
  )
}
