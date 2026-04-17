import { useSiteContent } from '../../content/SiteContentContext'
import { useToast } from '../../components/Toast'
import { ImagePreview } from '../components/ImagePreview'

export function VisualsSettingsPage() {
  const { content, updateContent } = useSiteContent()
  const toast = useToast()

  function touch() {
    toast('Görsel URL kaydedildi.')
  }

  return (
    <div>
      <h1 className="admin-page-title">Görseller (URL)</h1>
      <p className="admin-page-subtitle">Hub sayfaları ve hizmet detay görselleri. Tam görsel adresini yapıştırın.</p>

      <section className="admin-card mt-8">
        <h2 className="admin-section-title">Danışmanlık hub</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <UrlField
            label="Ana hero görseli"
            value={content.visuals.consulting.hubHero}
            onBlur={(v) => {
              updateContent((c) => ({
                ...c,
                visuals: { ...c.visuals, consulting: { ...c.visuals.consulting, hubHero: v } },
              }))
              touch()
            }}
          />
          <UrlField
            label="İkincil görsel"
            value={content.visuals.consulting.hubSecondary}
            onBlur={(v) => {
              updateContent((c) => ({
                ...c,
                visuals: { ...c.visuals, consulting: { ...c.visuals.consulting, hubSecondary: v } },
              }))
              touch()
            }}
          />
        </div>
      </section>

      <section className="admin-card mt-8">
        <h2 className="admin-section-title">Eğitim hub</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <UrlField
            label="Ana hero"
            value={content.visuals.training.hubHero}
            onBlur={(v) => {
              updateContent((c) => ({
                ...c,
                visuals: { ...c.visuals, training: { ...c.visuals.training, hubHero: v } },
              }))
              touch()
            }}
          />
          <UrlField
            label="İkincil"
            value={content.visuals.training.hubSecondary}
            onBlur={(v) => {
              updateContent((c) => ({
                ...c,
                visuals: { ...c.visuals, training: { ...c.visuals.training, hubSecondary: v } },
              }))
              touch()
            }}
          />
        </div>
      </section>

      <section className="admin-card mt-8">
        <h2 className="admin-section-title">Sektörel hub</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <UrlField
            label="Ana hero"
            value={content.visuals.sectoral.hubHero}
            onBlur={(v) => {
              updateContent((c) => ({
                ...c,
                visuals: { ...c.visuals, sectoral: { ...c.visuals.sectoral, hubHero: v } },
              }))
              touch()
            }}
          />
          <UrlField
            label="İkincil"
            value={content.visuals.sectoral.hubSecondary}
            onBlur={(v) => {
              updateContent((c) => ({
                ...c,
                visuals: { ...c.visuals, sectoral: { ...c.visuals.sectoral, hubSecondary: v } },
              }))
              touch()
            }}
          />
        </div>
      </section>

    </div>
  )
}

function UrlField({
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
      <ImagePreview url={value} className="mt-2" />
    </div>
  )
}
