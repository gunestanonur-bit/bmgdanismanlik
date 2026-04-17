import { Link } from 'react-router-dom'
import { useSiteContent } from '../../content/SiteContentContext'
import { useToast } from '../../components/Toast'
import { supabase } from '../../lib/supabase'

type Kind = 'consulting' | 'training' | 'sectoral'

const titles: Record<Kind, { title: string; desc: string; base: string }> = {
  consulting: {
    title: 'Danışmanlık hizmetleri',
    desc: 'Her satır bir detay sayfasına gider. Slug URL’de kullanılır.',
    base: '/admin/consulting',
  },
  training: {
    title: 'Eğitim programları',
    desc: 'Programlar ve detay sayfaları.',
    base: '/admin/training',
  },
  sectoral: {
    title: 'Sektörel hizmetler',
    desc: 'Sektörel detay sayfaları.',
    base: '/admin/sectoral',
  },
}

export function ServiceListPage({ kind }: { kind: Kind }) {
  const { content, updateContent } = useSiteContent()
  const toast = useToast()
  const list =
    kind === 'consulting'
      ? content.consultingServices
      : kind === 'training'
        ? content.trainingServices
        : content.sectoralServices
  const meta = titles[kind]
  const key = kind === 'consulting' ? 'consultingServices' : kind === 'training' ? 'trainingServices' : 'sectoralServices'

  async function removeService(slug: string) {
    if (!confirm('Bu hizmet silinecek. Emin misiniz?')) return
    updateContent((c) => ({
      ...c,
      [key]: c[key].filter((s) => s.slug !== slug),
    }))
    toast('Hizmet silindi.', 'warning')

    try {
      const { error } = await supabase.from('services').delete().eq('kind', kind).eq('slug', slug)
      if (error) throw error
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Silme sırasında hata oluştu.'
      toast(`Yerelde silindi, sunucuya kaydedilemedi: ${msg}`, 'error')
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">{meta.title}</h1>
      <p className="admin-page-subtitle">{meta.desc}</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Kod</th>
              <th className="px-4 py-3">Başlık</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.slug} className="border-b border-slate-100 transition hover:bg-slate-50/80 last:border-0">
                <td className="px-4 py-3 font-semibold text-primary-800">{s.code}</td>
                <td className="max-w-md px-4 py-3 text-slate-700">{s.title}</td>
                <td className="px-4 py-3">
                  <code className="text-xs text-slate-600">{s.slug}</code>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      to={`${meta.base}/${encodeURIComponent(s.slug)}`}
                      className="admin-btn admin-btn-secondary px-3 py-1.5 text-xs"
                    >
                      Düzenle
                    </Link>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger px-3 py-1.5 text-xs"
                      onClick={() => {
                        void removeService(s.slug)
                      }}
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
