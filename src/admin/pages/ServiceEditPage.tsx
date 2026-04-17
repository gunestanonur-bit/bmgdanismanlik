import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSiteContent } from '../../content/SiteContentContext'
import { useToast } from '../../components/Toast'
import type { ConsultingService } from '../../content/types'
import { supabase } from '../../lib/supabase'

type Kind = 'consulting' | 'training' | 'sectoral'

const labels: Record<Kind, { back: string; list: string; editBase: string; name: string }> = {
  consulting: { back: '/admin/consulting', list: 'Danışmanlık listesi', editBase: '/admin/consulting', name: 'Danışmanlık' },
  training: { back: '/admin/training', list: 'Eğitim listesi', editBase: '/admin/training', name: 'Eğitim' },
  sectoral: { back: '/admin/sectoral', list: 'Sektörel liste', editBase: '/admin/sectoral', name: 'Sektörel' },
}

function serviceKey(kind: Kind): 'consultingServices' | 'trainingServices' | 'sectoralServices' {
  if (kind === 'consulting') return 'consultingServices'
  if (kind === 'training') return 'trainingServices'
  return 'sectoralServices'
}

type Draft = {
  slug: string
  code: string
  title: string
  summary: string
  intro: string
  introImageUrl: string
  offerings: string[]
  offeringsImageUrl: string
  customSectionTitle: string
  customSectionItems: string[]
  customSectionImageUrl: string
  processImageUrl: string
  processSteps: { title: string; text: string }[]
}

export function ServiceEditPage({ kind }: { kind: Kind }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { content, updateContent } = useSiteContent()
  const toast = useToast()
  const key = serviceKey(kind)
  const list = content[key]
  const decoded = slug ? decodeURIComponent(slug) : ''
  const svc = list.find((s) => s.slug === decoded)

  const [draft, setDraft] = useState<Draft | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const initialDraftRef = useRef<Draft | null>(null)
  const isDirty = useMemo(() => {
    if (!draft || !initialDraftRef.current) return false
    return JSON.stringify(draft) !== JSON.stringify(initialDraftRef.current)
  }, [draft])

  useEffect(() => {
    let cancelled = false
    async function loadService() {
      const s = list.find((x) => x.slug === decoded)
      if (!s) return

      const { data } = await supabase
        .from('services')
        .select(
          'slug, code, title, summary, intro, intro_image_url, offerings, offerings_image_url, custom_section_title, custom_section_items, custom_section_image_url, process_image_url, process_steps',
        )
        .eq('kind', kind)
        .eq('slug', decoded)
        .maybeSingle()

      const fallback: Draft = {
        slug: s.slug,
        code: s.code,
        title: s.title,
        summary: s.summary,
        intro: s.intro,
        introImageUrl: s.introImageUrl ?? '',
        offerings: s.offerings,
        offeringsImageUrl: s.offeringsImageUrl ?? '',
        customSectionTitle: s.customSectionTitle ?? '',
        customSectionItems: s.customSectionItems ?? [],
        customSectionImageUrl: s.customSectionImageUrl ?? '',
        processImageUrl: s.processImageUrl ?? '',
        processSteps: s.processSteps,
      }

      const row = data as {
        slug: string
        code: string
        title: string
        summary: string
        intro: string
        intro_image_url: string | null
        offerings: string[]
        offerings_image_url: string | null
        custom_section_title: string | null
        custom_section_items: string[] | null
        custom_section_image_url: string | null
        process_image_url: string | null
        process_steps: { title: string; text: string }[]
      } | null

      const loaded: Draft = row
        ? {
            slug: row.slug || fallback.slug,
            code: row.code || fallback.code,
            title: row.title ?? fallback.title,
            summary: row.summary ?? fallback.summary,
            intro: row.intro ?? fallback.intro,
            introImageUrl: row.intro_image_url ?? fallback.introImageUrl,
            offerings: Array.isArray(row.offerings) ? row.offerings : fallback.offerings,
            offeringsImageUrl: row.offerings_image_url ?? fallback.offeringsImageUrl,
            customSectionTitle: row.custom_section_title ?? fallback.customSectionTitle,
            customSectionItems: Array.isArray(row.custom_section_items) ? row.custom_section_items : fallback.customSectionItems,
            customSectionImageUrl: row.custom_section_image_url ?? fallback.customSectionImageUrl,
            processImageUrl: row.process_image_url ?? fallback.processImageUrl,
            processSteps: Array.isArray(row.process_steps) ? row.process_steps : fallback.processSteps,
          }
        : fallback

      if (cancelled) return
      setDraft(loaded)
      initialDraftRef.current = loaded
    }
    void loadService()
    return () => {
      cancelled = true
    }
  }, [decoded, kind, list])

  if (!slug || !svc) {
    return (
      <div className="admin-card mt-4 text-center">
        <p className="text-slate-600">Hizmet bulunamadı.</p>
        <Link to={labels[kind].back} className="mt-4 inline-block text-sm font-semibold text-primary-700 hover:underline">
          ← {labels[kind].list}
        </Link>
      </div>
    )
  }

  if (!draft) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Yükleniyor…
      </div>
    )
  }

  const meta = labels[kind]

  async function save() {
    const d = draft
    const s = svc
    if (!d || !s || isSaving) return
    setIsSaving(true)
    const oldSlug = s.slug
    try {
      const { error } = await supabase.from('services').upsert(
        {
          kind,
          slug: d.slug,
          code: d.code,
          title: d.title,
          summary: d.summary,
          intro: d.intro,
          intro_image_url: d.introImageUrl,
          offerings: d.offerings,
          offerings_image_url: d.offeringsImageUrl,
          custom_section_title: d.customSectionTitle,
          custom_section_items: d.customSectionItems,
          custom_section_image_url: d.customSectionImageUrl,
          process_image_url: d.processImageUrl,
          process_steps: d.processSteps,
        },
        { onConflict: 'kind,slug' },
      )
      if (error) throw error

      updateContent((c) => {
        const arr = [...c[key]]
        const i = arr.findIndex((x) => x.slug === oldSlug)
        if (i < 0) return c
        arr[i] = {
          ...arr[i],
          slug: d.slug,
          code: d.code,
          title: d.title,
          summary: d.summary,
          intro: d.intro,
          introImageUrl: d.introImageUrl,
          offerings: d.offerings,
          offeringsImageUrl: d.offeringsImageUrl,
          customSectionTitle: d.customSectionTitle,
          customSectionItems: d.customSectionItems,
          customSectionImageUrl: d.customSectionImageUrl,
          processImageUrl: d.processImageUrl,
          processSteps: d.processSteps,
        } as ConsultingService
        return { ...c, [key]: arr }
      })
      initialDraftRef.current = d

      toast('Hizmet kaydedildi.')
      if (d.slug !== oldSlug) {
        navigate(`${meta.editBase}/${encodeURIComponent(d.slug)}`, { replace: true })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Kaydetme sırasında hata oluştu.'
      toast(msg, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm">
        <Link to={meta.back} className="text-slate-500 hover:text-primary-700">
          {meta.name}
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-medium text-slate-800">{draft?.title || svc.title}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <h1 className="admin-page-title text-2xl">Hizmeti düzenle</h1>
        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Kaydedilmemiş değişiklikler
            </span>
          )}
          <button type="button" onClick={save} disabled={!isDirty} className="admin-btn admin-btn-primary">
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          <Link to={meta.back} className="admin-btn admin-btn-secondary">
            İptal
          </Link>
        </div>
      </div>

      <div className="admin-card mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label">Slug (URL)</label>
            <input
              value={draft.slug}
              onChange={(e) =>
                setDraft({ ...draft, slug: e.target.value.trim().toLowerCase().replace(/\s+/g, '-') })
              }
              className="admin-input mt-2 font-mono"
            />
          </div>
          <div>
            <label className="admin-label">Kod</label>
            <input
              value={draft.code}
              onChange={(e) => setDraft({ ...draft, code: e.target.value })}
              className="admin-input mt-2"
            />
          </div>
        </div>

        <div>
          <label className="admin-label">Başlık</label>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="admin-input mt-2 text-base font-medium"
          />
        </div>

        <div>
          <label className="admin-label">Özet</label>
          <p className="mt-0.5 text-xs text-slate-500">Kart ve liste görünümlerinde kullanılır</p>
          <textarea
            value={draft.summary}
            rows={3}
            onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            className="admin-input mt-2"
          />
        </div>

        <div>
          <label className="admin-label">Giriş metni</label>
          <p className="mt-0.5 text-xs text-slate-500">Detay sayfası üst paragrafı</p>
          <textarea
            value={draft.intro}
            rows={6}
            onChange={(e) => setDraft({ ...draft, intro: e.target.value })}
            className="admin-input mt-2"
          />
        </div>

        <div>
          <label className="admin-label">Giriş bölümü görsel URL</label>
          <input
            value={draft.introImageUrl}
            onChange={(e) => setDraft({ ...draft, introImageUrl: e.target.value })}
            className="admin-input mt-2"
          />
        </div>

        <div>
          <label className="admin-label">Sunulanlar</label>
          <p className="mt-0.5 text-xs text-slate-500">Her satır bir madde</p>
          <textarea
            value={draft.offerings.join('\n')}
            rows={8}
            onChange={(e) =>
              setDraft({
                ...draft,
                offerings: e.target.value
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            className="admin-input mt-2 font-mono"
          />
        </div>

        <div>
          <label className="admin-label">Sunulanlar bölümü görsel URL</label>
          <input
            value={draft.offeringsImageUrl}
            onChange={(e) => setDraft({ ...draft, offeringsImageUrl: e.target.value })}
            className="admin-input mt-2"
          />
        </div>

        <div>
          <label className="admin-label">Benzersiz bölüm başlığı</label>
          <p className="mt-0.5 text-xs text-slate-500">Detay sayfasında sunulanlar ile süreç arasına eklenir</p>
          <input
            value={draft.customSectionTitle}
            onChange={(e) => setDraft({ ...draft, customSectionTitle: e.target.value })}
            className="admin-input mt-2"
          />
        </div>

        <div>
          <label className="admin-label">Benzersiz bölüm görsel URL</label>
          <input
            value={draft.customSectionImageUrl}
            onChange={(e) => setDraft({ ...draft, customSectionImageUrl: e.target.value })}
            className="admin-input mt-2"
          />
        </div>

        <div>
          <label className="admin-label">Benzersiz bölüm maddeleri</label>
          <p className="mt-0.5 text-xs text-slate-500">Her satır bir madde</p>
          <textarea
            value={draft.customSectionItems.join('\n')}
            rows={6}
            onChange={(e) =>
              setDraft({
                ...draft,
                customSectionItems: e.target.value
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            className="admin-input mt-2 font-mono"
          />
        </div>

        <div>
          <p className="admin-label">Süreç adımları</p>
          <div className="mt-3 space-y-3">
            {draft.processSteps.map((step, i) => (
              <div key={i} className="admin-card-soft">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-500">Adım {i + 1}</span>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger px-3 py-1.5 text-xs"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        processSteps: draft.processSteps.filter((_, j) => j !== i),
                      })
                    }
                  >
                    Sil
                  </button>
                </div>
                <input
                  value={step.title}
                  placeholder="Adım başlığı"
                  className="admin-input mt-2 font-semibold"
                  onChange={(e) => {
                    const next = [...draft.processSteps]
                    next[i] = { ...step, title: e.target.value }
                    setDraft({ ...draft, processSteps: next })
                  }}
                />
                <textarea
                  value={step.text}
                  placeholder="Adım açıklaması"
                  rows={2}
                  className="admin-input mt-2"
                  onChange={(e) => {
                    const next = [...draft.processSteps]
                    next[i] = { ...step, text: e.target.value }
                    setDraft({ ...draft, processSteps: next })
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="admin-btn w-full justify-center rounded-xl border border-dashed border-slate-300 text-slate-600 hover:border-primary-300 hover:text-primary-700"
              onClick={() =>
                setDraft({
                  ...draft,
                  processSteps: [...draft.processSteps, { title: '', text: '' }],
                })
              }
            >
              + Adım ekle
            </button>
          </div>
        </div>

        <div>
          <label className="admin-label">Süreç bölümü görsel URL</label>
          <input
            value={draft.processImageUrl}
            onChange={(e) => setDraft({ ...draft, processImageUrl: e.target.value })}
            className="admin-input mt-2"
          />
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={save}
            disabled={!isDirty || isSaving}
            className="admin-btn admin-btn-primary px-6"
          >
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          <Link to={meta.back} className="admin-btn admin-btn-secondary px-6">
            İptal
          </Link>
        </div>
      </div>
    </div>
  )
}
