import { readFileAsDataUrl } from '../../lib/readFileAsDataUrl'
import { useSiteContent } from '../../content/SiteContentContext'
import { useToast } from '../../components/Toast'
import { ImagePreview } from '../components/ImagePreview'

type BannerKey = keyof ReturnType<typeof useSiteContent>['content']['pageBanners']

const fields: { key: BannerKey; label: string; hint?: string }[] = [
  { key: 'hakkimizda', label: 'Hakkımızda banner' },
  { key: 'iletisim', label: 'İletişim banner' },
  { key: 'danismanlikHub', label: 'Danışmanlık ana sayfa banner' },
  { key: 'egitimHub', label: 'Eğitim ana sayfa banner' },
  { key: 'sektorelHub', label: 'Sektörel ana sayfa banner' },
  { key: 'danismanlikDetay', label: 'Danışmanlık detay banner', hint: 'Tüm danışmanlık detay sayfalarında kullanılır.' },
  { key: 'egitimDetay', label: 'Eğitim detay banner', hint: 'Tüm eğitim detay sayfalarında kullanılır.' },
  { key: 'sektorelDetay', label: 'Sektörel detay banner', hint: 'Tüm sektörel detay sayfalarında kullanılır.' },
]

export function BannerSettingsPage() {
  const { content, updateContent } = useSiteContent()
  const toast = useToast()

  function save(key: BannerKey, value: string) {
    updateContent((c) => ({
      ...c,
      pageBanners: {
        ...c.pageBanners,
        [key]: value,
      },
    }))
    toast('Banner kaydedildi.')
  }

  async function onFilePicked(key: BannerKey, file?: File) {
    if (!file) return
    const value = await readFileAsDataUrl(file)
    save(key, value)
  }

  return (
    <div>
      <h1 className="admin-page-title">Bannerlar</h1>
      <p className="admin-page-subtitle">
        Ana sayfa hariç sayfaların üst görselleri. Kaydettiğiniz dosyalar hem herkese açık sitede hem ilgili yönetim sayfalarında (Hakkımızda, Site ve metinler, hizmet listeleri ve düzenleme) aynı şekilde görünür.
      </p>

      <section className="admin-card mt-8">
        <div className="space-y-5">
          {fields.map((f) => {
            const value = content.pageBanners[f.key]
            return (
              <div key={f.key} className="grid items-start gap-3 sm:grid-cols-[15rem_1fr]">
                <label className="admin-label pt-2">{f.label}</label>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="admin-btn admin-btn-secondary cursor-pointer">
                      Dosya seç
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                        className="sr-only"
                        onChange={(e) => {
                          void onFilePicked(f.key, e.target.files?.[0])
                            .catch(() => toast('Banner dosyası okunamadı.', 'error'))
                            .finally(() => {
                              e.target.value = ''
                            })
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      onClick={() => save(f.key, '')}
                    >
                      Temizle
                    </button>
                  </div>
                  {f.hint ? <p className="mt-1 text-xs text-slate-500">{f.hint}</p> : null}
                  <ImagePreview url={value} className="mt-2" />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
