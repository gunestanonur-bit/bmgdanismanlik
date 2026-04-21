import { Link } from 'react-router-dom'
import { useSiteContent } from '../../content/SiteContentContext'
import { useToast } from '../../components/Toast'
import { HAS_SUPABASE_CONFIG } from '../../lib/supabase'

const navCards = [
  {
    to: '/admin/site',
    label: 'Site & metinler',
    tag: 'Site',
    desc: 'Kurumsal bilgiler, iletişim, menü',
    icon: '🏢',
  },
  {
    to: '/admin/about',
    label: 'Hakkımızda',
    tag: 'Hakkımızda',
    desc: 'Ana sayfa bölümü + /hakkimizda',
    icon: '📄',
  },
  {
    to: '/admin/hero',
    label: 'Hero slider',
    tag: 'Hero',
    desc: 'Ana sayfa görselleri ve kartlar',
    icon: '🖼️',
  },
  {
    to: '/admin/consulting',
    label: 'Danışmanlık',
    tag: 'Danışmanlık',
    desc: 'Hizmet sayfaları ve içerik',
    icon: '📋',
  },
  {
    to: '/admin/training',
    label: 'Eğitim programları',
    tag: 'Eğitim',
    desc: 'Program sayfaları ve içerik',
    icon: '🎓',
  },
  {
    to: '/admin/sectoral',
    label: 'Sektörel hizmetler',
    tag: 'Sektörel',
    desc: 'Sektörel detay sayfaları',
    icon: '🏭',
  },
  {
    to: '/admin/visuals',
    label: 'Görseller (URL)',
    tag: 'Görseller',
    desc: 'Hub ve detay sayfa görselleri',
    icon: '🌄',
  },
  {
    to: '/admin/banners',
    label: 'Bannerlar',
    tag: 'Banner',
    desc: 'Ana sayfa hariç sayfa bannerları',
    icon: '🧩',
  },
  {
    to: '/admin/home-sections',
    label: 'Ana sayfa metinleri',
    tag: 'Metin',
    desc: 'Iletisim, bolum basliklari ve footer',
    icon: '📝',
  },
  {
    to: '/admin/email',
    label: 'E-posta ayarlari',
    tag: 'E-posta',
    desc: 'Iletisim formu gonderim ayarlari',
    icon: '✉️',
  },
  {
    to: '/admin/all-data',
    label: 'Tum veri editoru',
    tag: 'JSON',
    desc: 'Tum modeli tek ekranda duzenle',
    icon: '🧠',
  },
] as const

export function AdminDashboard() {
  const { content, exportJson, importJson, resetToBundledDefaults, hasCustomData } = useSiteContent()
  const toast = useToast()

  const kpis = [
    {
      label: 'Toplam Hizmet',
      value: content.consultingServices.length + content.trainingServices.length + content.sectoralServices.length,
    },
    { label: 'Hero Slaytı', value: content.heroSlides.length },
    { label: 'Menü Öğesi', value: content.navItems.length },
    { label: 'Odak Alanı', value: content.aboutPage.focusAreas.length },
  ]

  return (
    <div>
      <h1 className="admin-page-title">Özet</h1>
      <p className="admin-page-subtitle">
        Tüm içerik tarayıcınızda saklanır (localStorage). Yedek için dışa aktarın; başka cihazda içe aktarın.
      </p>

      {!HAS_SUPABASE_CONFIG && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <span className="mt-0.5 text-red-500">⚠</span>
          <p className="text-sm text-red-800">
            Supabase ortam degiskenleri tanimli degil. Dashboard kayitlari sadece tarayicida kalir, veritabanina yazilmaz.
          </p>
        </div>
      )}

      {hasCustomData && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="mt-0.5 text-amber-500">⚠</span>
          <p className="text-sm text-amber-900">
            Kayıtlı özel içerik aktif. Sıfırlamak için aşağıdaki <strong>Varsayılanlara dön</strong> düğmesini kullanın.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="admin-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{kpi.label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {navCards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group admin-card flex flex-col gap-3 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">{card.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wide text-primary-700">
                {card.tag}
              </span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 transition group-hover:text-primary-800">
                {card.label}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">{card.desc}</p>
            </div>
            <div className="mt-auto flex items-center gap-1 text-xs font-medium text-primary-700 opacity-0 transition group-hover:opacity-100">
              <span>Düzenle</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="admin-card mt-10">
        <h2 className="admin-section-title">Yedek & sıfırlama</h2>
        <p className="mt-1 text-sm text-slate-500">
          JSON dosyasıyla içeriği dışa aktarın, yedekleyin veya başka bir cihaza taşıyın.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              exportJson()
              toast('JSON dışa aktarıldı.')
            }}
            className="admin-btn admin-btn-primary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            JSON dışa aktar
          </button>
          <label className="admin-btn admin-btn-secondary cursor-pointer">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
            </svg>
            JSON içe aktar
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return
                const reader = new FileReader()
                reader.onload = () => {
                  const text = String(reader.result ?? '')
                  const r = importJson(text)
                  if (r.ok) {
                    toast('İçerik başarıyla içe aktarıldı.')
                  } else {
                    toast(r.error, 'error')
                  }
                  e.target.value = ''
                }
                reader.onerror = () => toast('Dosya okunamadı.', 'error')
                reader.readAsText(f)
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              if (confirm('Tüm özel içerik silinip varsayılan kurulum içeriği yüklenecek. Emin misiniz?')) {
                resetToBundledDefaults()
                toast('Varsayılan içerik yüklendi.', 'warning')
              }
            }}
            className="admin-btn admin-btn-danger"
          >
            Varsayılanlara dön
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        <Link to="/" className="font-semibold text-primary-700 hover:underline">
          ← Siteye dön
        </Link>
      </p>
    </div>
  )
}
