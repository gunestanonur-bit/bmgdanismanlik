export const site = {
  name: 'BMG Danışmanlık',
  tagline: 'Yönetim sistemi danışmanlığında güvenilir ortağınız',
  description:
    'ISO ve sektörel standartlarda kurumsal danışmanlık, eğitim ve uygulama desteği sunuyoruz. Süreçlerinizi güçlendirin, belgelendirme yolculuğunuzu birlikte planlayalım.',
  url: 'https://example.com',
  email: 'info@example.com',
  phone: '+90 (___) ___ __ __',
  address: 'Türkiye',
  logo: '',
  favicon: '/favicon.svg',
} as const

/** `labelShort` is used in the desktop pill nav to avoid overflow; full `label` stays for mobile & tooltips */
export const navItems = [
  { id: 'hakkimizda', label: 'Hakkımızda' },
  { id: 'danismanlik', label: 'Danışmanlık Hizmetlerimiz', labelShort: 'Danışmanlık' },
  { id: 'egitim', label: 'Eğitim Hizmetlerimiz', labelShort: 'Eğitim' },
  { id: 'sektorel', label: 'Sektörel Hizmetler', labelShort: 'Sektörel' },
  { id: 'iletisim', label: 'Bize Ulaşın', labelShort: 'İletişim' },
] as const

export type NavItem = (typeof navItems)[number]

export const trainingHighlights = [
  'Yönetim sistemi farkındalık ve iç tetkik eğitimleri',
  'Risk temelli düşünme ve süreç yaklaşımı atölyeleri',
  'Kuruma özel dokümantasyon ve uygulama çalışmaları',
] as const

export const sectoralHighlights = [
  'Sektörünüze özgü mevzuat ve müşteri şartları ile uyumlu süreç tasarımı',
  'Üretim, hizmet ve proje tabanlı organizasyonlara özel uygulama rehberliği',
  'Tedarik zinciri ve ikinci taraf değerlendirmelerine hazırlık desteği',
] as const
