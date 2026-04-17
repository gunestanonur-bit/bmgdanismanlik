import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDefaultAboutPage } from '../../content/buildDefault'
import { useSiteContent } from '../../content/SiteContentContext'
import { useToast } from '../../components/Toast'
import type { AboutPageContent } from '../../content/types'

export function AboutSettingsPage() {
  const { content, updateContent } = useSiteContent()
  const toast = useToast()
  const source = content.aboutPage

  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [draft, setDraft] = useState<AboutPageContent>(() => ({ ...source }))
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [resetConfirm, setResetConfirm] = useState(false)

  const isDirty = useCallback(() => JSON.stringify(draft) !== JSON.stringify(source), [draft, source])

  const handleSave = useCallback(() => {
    if (JSON.stringify(draft) !== JSON.stringify(source)) {
      setSaveStatus('saving')
      updateContent((c) => ({ ...c, aboutPage: { ...draft } }))
      setSaveStatus('saved')
      toast('Hakkımızda içeriği kaydedildi.')
    }
  }, [draft, source, updateContent, toast])

  const handleCancel = useCallback(() => {
    setDraft({ ...source })
    setResetConfirm(false)
    setMode('view')
  }, [source])

  useEffect(() => {
    if (mode === 'edit') setDraft({ ...source })
  }, [mode, source])

  useEffect(() => {
    if (saveStatus !== 'saved') return
    const t = window.setTimeout(() => setSaveStatus('idle'), 2000)
    return () => clearTimeout(t)
  }, [saveStatus])

  useEffect(() => {
    if (mode !== 'edit') return
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      if (e.key === 'Escape') {
        handleCancel()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, handleSave, handleCancel])

  function handleReset() {
    const fresh = getDefaultAboutPage()
    setDraft(fresh)
    updateContent((c) => ({ ...c, aboutPage: fresh }))
    setSaveStatus('saved')
    setResetConfirm(false)
    toast('Varsayılan içerik yüklendi.', 'warning')
  }

  function patch(partial: Partial<AboutPageContent>) {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  function focusSection(sectionId: string) {
    const firstField = document.querySelector<HTMLElement>(`#${sectionId} input, #${sectionId} textarea`)
    firstField?.focus()
  }

  function deleteSection(sectionId: string) {
    const defaults = getDefaultAboutPage()
    if (sectionId === 'hero') {
      patch({
        heroImageUrl: defaults.heroImageUrl,
        heroEyebrow: defaults.heroEyebrow,
        heroTitle: defaults.heroTitle,
        heroSubtitleOverride: defaults.heroSubtitleOverride,
      })
      return
    }
    if (sectionId === 'seo') {
      patch({ metaDescription: defaults.metaDescription })
      return
    }
    if (sectionId === 'text') {
      patch({ mainParagraph: defaults.mainParagraph })
      return
    }
    if (sectionId === 'bullets') {
      patch({ bullets: defaults.bullets })
      return
    }
    if (sectionId === 'card') {
      patch({
        sideCardTitle: defaults.sideCardTitle,
        sideCardText: defaults.sideCardText,
        focusAreas: defaults.focusAreas,
      })
      return
    }
    if (sectionId === 'cta') {
      patch({ ctaStripTitle: defaults.ctaStripTitle })
    }
  }

  const dirty = isDirty()

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-primary-50/40 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">Yönetim Paneli</p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Hakkımızda
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Ana sayfa ve Hakkımızda sayfası içeriklerini profesyonel bir şekilde yönetin.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/hakkimizda"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            Önizle
          </Link>
          {mode === 'view' ? (
            <ActionButton variant="primary" onClick={() => setMode('edit')} icon={<PencilIcon className="h-4 w-4" />}>
              Düzenle
            </ActionButton>
          ) : (
            <>
              <ActionButton
                variant="primary"
                onClick={handleSave}
                disabled={!dirty || saveStatus === 'saving'}
                icon={saveStatus === 'saving' ? <Spinner className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />}
              >
                {saveStatus === 'saving' ? 'Kaydediliyor...' : saveStatus === 'saved' ? 'Kaydedildi' : 'Kaydet'}
              </ActionButton>
              <ActionButton variant="secondary" onClick={handleCancel} disabled={saveStatus === 'saving'}>
                İptal
              </ActionButton>
              {resetConfirm ? (
                <span className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm">
                  <span className="font-medium text-red-800">Sıfırlansın mı?</span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="font-semibold text-red-600 hover:underline"
                  >
                    Evet
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetConfirm(false)}
                    className="font-medium text-slate-600 hover:underline"
                  >
                    Hayır
                  </button>
                </span>
              ) : (
                <ActionButton
                  variant="danger"
                  onClick={() => setResetConfirm(true)}
                  icon={<TrashIcon className="h-4 w-4" />}
                >
                  Sıfırla
                </ActionButton>
              )}
            </>
          )}
          </div>
        </div>
      </header>

      <aside className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Değişken:</span>{' '}
        Metinlerde <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">{'{name}'}</code> kullandığınızda şirket adı otomatik yerleştirilir.
      </aside>

      {mode === 'view' ? (
        <AboutViewContent data={source} />
      ) : (
        <AboutEditForm
          draft={draft}
          patch={patch}
          onSaveSection={handleSave}
          onEditSection={focusSection}
          onDeleteSection={deleteSection}
        />
      )}
    </div>
  )
}

function AboutViewContent({ data }: { data: AboutPageContent }) {
  const metaLen = data.metaDescription.trim().length
  return (
    <div className="space-y-6">
      <SectionCard title="Hero" desc="Sayfa başlığı ve görsel">
        <dl className="grid gap-3 sm:grid-cols-2">
          <ViewField label="Üst etiket" value={data.heroEyebrow} />
          <ViewField label="Ana başlık" value={data.heroTitle} />
          <ViewField label="Görsel URL" value={data.heroImageUrl} truncate className="sm:col-span-2" />
          {data.heroSubtitleOverride && (
            <ViewField label="Alt metin" value={data.heroSubtitleOverride} className="sm:col-span-2" />
          )}
        </dl>
      </SectionCard>
      <SectionCard title="Ana metin" desc="Giriş paragrafı">
        <p className="whitespace-pre-wrap text-slate-700">{data.mainParagraph || '—'}</p>
      </SectionCard>
      <SectionCard title="SEO" desc="Meta açıklama">
        <dl className="space-y-2">
          <ViewField label="Meta açıklama" value={data.metaDescription || '—'} />
          <div>
            <dt className="text-xs font-medium text-slate-500">Uzunluk</dt>
            <dd className={`mt-0.5 text-sm ${metaLen >= 140 && metaLen <= 170 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {metaLen} karakter {metaLen >= 140 && metaLen <= 170 ? '(onerilen aralikta)' : '(onerilen: 140-170)'}
            </dd>
          </div>
        </dl>
      </SectionCard>
      <SectionCard title="Madde işaretleri" desc={`${data.bullets.length} madde`}>
        <ul className="list-inside list-disc space-y-1 text-slate-700">
          {data.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </SectionCard>
      <SectionCard title="Sağ kart" desc="Bilgi kartı">
        <dl className="space-y-2">
          <ViewField label="Başlık" value={data.sideCardTitle} />
          <ViewField label="Metin" value={data.sideCardText} />
          <div>
            <dt className="text-xs font-medium text-slate-500">Odak alanları</dt>
            <dd className="mt-0.5 text-slate-700">{data.focusAreas.join(' · ') || '—'}</dd>
          </div>
        </dl>
      </SectionCard>
      <SectionCard title="Alt CTA" desc="Cagri seridi">
        <ViewField label="Serit basligi" value={data.ctaStripTitle} />
      </SectionCard>
    </div>
  )
}

function SectionCard({
  title,
  desc,
  children,
}: {
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <p className="mt-0.5 text-sm text-slate-500">{desc}</p>
      </div>
      <div className="p-6">{children}</div>
    </section>
  )
}

function ViewField({
  label,
  value,
  truncate,
  className = '',
}: {
  label: string
  value: string
  truncate?: boolean
  className?: string
}) {
  const v = value || '—'
  return (
    <div className={className}>
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className={`mt-0.5 text-slate-700 ${truncate ? 'truncate' : ''}`} title={truncate ? v : undefined}>
        {v}
      </dd>
    </div>
  )
}

function AboutEditForm({
  draft,
  patch,
  onSaveSection,
  onEditSection,
  onDeleteSection,
}: {
  draft: AboutPageContent
  patch: (p: Partial<AboutPageContent>) => void
  onSaveSection: () => void
  onEditSection: (sectionId: string) => void
  onDeleteSection: (sectionId: string) => void
}) {
  const metaLen = draft.metaDescription.trim().length
  const sectionLinks = [
    { id: 'hero', label: 'Hero' },
    { id: 'seo', label: 'SEO' },
    { id: 'text', label: 'Ana Metin' },
    { id: 'bullets', label: 'Maddeler' },
    { id: 'card', label: 'Sag Kart' },
    { id: 'cta', label: 'CTA' },
  ]

  return (
    <div className="space-y-6">
      <nav className="sticky top-3 z-10 rounded-xl border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur">
        <ul className="flex flex-wrap gap-2">
          {sectionLinks.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-primary-200 hover:text-primary-700"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <EditSection
        id="hero"
        title="1. Hero alanı"
        desc="Sayfa başlığı, görsel ve üst metin"
        onSave={onSaveSection}
        onEdit={onEditSection}
        onDelete={onDeleteSection}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field className="sm:col-span-2" label="Hero görsel URL" value={draft.heroImageUrl} onChange={(v) => patch({ heroImageUrl: v })} />
          <Field label="Üst etiket (eyebrow)" value={draft.heroEyebrow} onChange={(v) => patch({ heroEyebrow: v })} />
          <Field label="Ana başlık (H1)" value={draft.heroTitle} onChange={(v) => patch({ heroTitle: v })} />
          <div className="sm:col-span-2">
            <TextareaField
              label="Alt metin"
              hint="Boş bırakırsanız site sloganı kullanılır"
              value={draft.heroSubtitleOverride}
              rows={2}
              onChange={(v) => patch({ heroSubtitleOverride: v })}
            />
          </div>
        </div>
      </EditSection>

      <EditSection id="seo" title="2. SEO" desc="Arama sonuçları için meta açıklama" onSave={onSaveSection} onEdit={onEditSection} onDelete={onDeleteSection}>
        <TextareaField
          label="Meta açıklama"
          hint={`Bos birakirsaniz otomatik uretilir. Onerilen uzunluk: 140-170 karakter (su an: ${metaLen})`}
          value={draft.metaDescription}
          rows={3}
          onChange={(v) => patch({ metaDescription: v })}
        />
      </EditSection>

      <EditSection id="text" title="3. Ana metin" desc="Sayfanın giriş paragrafı" onSave={onSaveSection} onEdit={onEditSection} onDelete={onDeleteSection}>
        <TextareaField
          label="Giriş paragrafı"
          value={draft.mainParagraph}
          rows={5}
          onChange={(v) => patch({ mainParagraph: v })}
        />
      </EditSection>

      <EditSection id="bullets" title="4. Madde işaretleri" desc="Her satır bir madde" onSave={onSaveSection} onEdit={onEditSection} onDelete={onDeleteSection}>
        <TextareaField
          label="Madde listesi"
          hint="Satır sonu ile ayırın"
          value={draft.bullets.join('\n')}
          rows={6}
          mono
          onChange={(v) =>
            patch({
              bullets: v
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </EditSection>

      <EditSection id="card" title="5. Sağ panel kartı" desc="İçerik alanının yanındaki bilgi kartı" onSave={onSaveSection} onEdit={onEditSection} onDelete={onDeleteSection}>
        <div className="space-y-4">
          <Field label="Kart başlığı" value={draft.sideCardTitle} onChange={(v) => patch({ sideCardTitle: v })} />
          <TextareaField label="Kart metni" value={draft.sideCardText} rows={3} onChange={(v) => patch({ sideCardText: v })} />
          <TextareaField
            label="Odak alanları"
            hint="Her satır bir madde"
            value={draft.focusAreas.join('\n')}
            rows={4}
            mono
            onChange={(v) =>
              patch({
                focusAreas: v
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>
      </EditSection>

      <EditSection id="cta" title="6. Alt CTA şeridi" desc="Sayfa altındaki çağrı alanı" onSave={onSaveSection} onEdit={onEditSection} onDelete={onDeleteSection}>
        <div>
          <Field label="Şerit başlığı" value={draft.ctaStripTitle} onChange={(v) => patch({ ctaStripTitle: v })} />
          <p className="mt-2 text-xs text-slate-500">Butonlar sabit: Danışmanlık, Eğitim, Sektörel, İletişim</p>
        </div>
      </EditSection>
    </div>
  )
}

function EditSection({
  id,
  title,
  desc,
  onSave,
  onEdit,
  onDelete,
  children,
}: {
  id: string
  title: string
  desc: string
  onSave: () => void
  onEdit: (sectionId: string) => void
  onDelete: (sectionId: string) => void
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20 rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{desc}</p>
          </div>
          <div className="flex items-center gap-2">
            <ActionButton variant="secondary" onClick={() => onEdit(id)} icon={<PencilIcon className="h-4 w-4" />}>
              Düzenle
            </ActionButton>
            <ActionButton variant="primary" onClick={onSave} icon={<CheckIcon className="h-4 w-4" />}>
              Kaydet
            </ActionButton>
            <ActionButton variant="danger" onClick={() => onDelete(id)} icon={<TrashIcon className="h-4 w-4" />}>
              Sil
            </ActionButton>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  className = '',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} mt-1.5`}
      />
    </div>
  )
}

function TextareaField({
  label,
  hint,
  value,
  rows,
  mono,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  rows: number
  mono?: boolean
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`${inputBase} mt-2 ${mono ? 'font-mono' : ''}`}
      />
    </div>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'danger'

function ActionButton({
  variant,
  onClick,
  disabled,
  icon,
  children,
}: {
  variant: ButtonVariant
  onClick: () => void
  disabled?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  const base =
    'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const styles: Record<ButtonVariant, string> = {
    primary: 'border border-transparent bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-400',
    danger: 'border border-red-200 bg-white text-red-700 hover:bg-red-50 focus:ring-red-400',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]}`}
    >
      {icon}
      {children}
    </button>
  )
}

const inputBase =
  'w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className ?? ''}`} fill="none" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}
