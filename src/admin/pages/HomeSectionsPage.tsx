import { useEffect, useMemo, useState } from 'react'
import { useSiteContent } from '../../content/SiteContentContext'
import type { HomeSectionCopy } from '../../content/types'
import { useToast } from '../../components/Toast'

const groups: { title: string; keys: (keyof HomeSectionCopy)[] }[] = [
  {
    title: 'Ana sayfa — iletişim bölümü',
    keys: ['contactEyebrow', 'contactTitle', 'contactIntro'],
  },
  {
    title: 'Ana sayfa — danışmanlık grid',
    keys: ['consultingEyebrow', 'consultingTitle', 'consultingIntro'],
  },
  {
    title: 'Ana sayfa — eğitim',
    keys: ['trainingEyebrow', 'trainingTitle', 'trainingIntro', 'trainingHubButton'],
  },
  {
    title: 'Ana sayfa — sektörel',
    keys: ['sectoralEyebrow', 'sectoralTitle', 'sectoralIntro', 'sectoralHubButton'],
  },
  {
    title: 'Footer',
    keys: [
      'footerCtaPrimary',
      'footerCtaSecondary',
      'footerHeadingExplore',
      'footerHeadingServices',
      'footerHeadingContact',
      'footerBottomTagline',
    ],
  },
  {
    title: 'WhatsApp',
    keys: ['whatsappTooltip', 'whatsappPresetMessage'],
  },
]

const labels: Record<keyof HomeSectionCopy, string> = {
  contactEyebrow: 'Üst etiket',
  contactTitle: 'Başlık',
  contactIntro: 'Giriş paragrafı',
  consultingEyebrow: 'Üst etiket',
  consultingTitle: 'Başlık',
  consultingIntro: 'Giriş paragrafı',
  trainingEyebrow: 'Üst etiket',
  trainingTitle: 'Başlık',
  trainingIntro: 'Giriş paragrafı',
  trainingHubButton: 'Hub sayfası düğmesi',
  sectoralEyebrow: 'Üst etiket',
  sectoralTitle: 'Başlık',
  sectoralIntro: 'Giriş paragrafı',
  sectoralHubButton: 'Hub sayfası düğmesi',
  footerCtaPrimary: 'Birincil düğme',
  footerCtaSecondary: 'İkincil düğme',
  footerHeadingExplore: 'Sütun: keşif başlığı',
  footerHeadingServices: 'Sütun: hizmetler başlığı',
  footerHeadingContact: 'Sütun: iletişim başlığı',
  footerBottomTagline: 'Alt satır (küçük metin)',
  whatsappTooltip: 'Balon ipucu',
  whatsappPresetMessage: 'wa.me ön doldurulmuş mesaj',
}

export function HomeSectionsPage() {
  const { content, updateContent } = useSiteContent()
  const toast = useToast()
  const [draft, setDraft] = useState<HomeSectionCopy>(content.homeSectionCopy)

  useEffect(() => {
    setDraft(content.homeSectionCopy)
  }, [content.homeSectionCopy])

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(content.homeSectionCopy),
    [draft, content.homeSectionCopy],
  )

  function saveAll() {
    if (!isDirty) return
    updateContent((c) => ({
      ...c,
      homeSectionCopy: { ...draft },
    }))
    toast('Metinler kaydedildi.')
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="admin-page-title">Ana sayfa ve footer metinleri</h1>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          disabled={!isDirty}
          onClick={saveAll}
        >
          Metinleri kaydet
        </button>
      </div>
      <p className="admin-page-subtitle">
        Önceden kodda sabit olan başlıklar ve paragraflar buradan yönetilir. Hizmet listeleri ve öne çıkan maddeler için ilgili yönetim sayfalarını kullanın.
      </p>

      {groups.map((g) => (
        <section key={g.title} className="admin-card mt-8">
          <h2 className="admin-section-title">{g.title}</h2>
          <div className="mt-4 space-y-4">
            {g.keys.map((key) => {
              const multiline = key.includes('Intro') || key === 'footerBottomTagline' || key === 'whatsappPresetMessage'
              const val = draft[key]
              return (
                <div key={key}>
                  <label className="admin-label">{labels[key]}</label>
                  {multiline ? (
                    <textarea
                      value={val}
                      rows={key.includes('Intro') ? 4 : 2}
                      className="admin-input mt-2"
                      onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      value={val}
                      className="admin-input mt-2"
                      onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
