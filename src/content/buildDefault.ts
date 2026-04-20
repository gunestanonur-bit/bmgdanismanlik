import { consultingServices } from '../data/consultingServices'
import { trainingServices } from '../data/trainingServices'
import { sectoralServices } from '../data/sectoralServices'
import { defaultHomeSectionCopy } from '../data/homeSectionCopy'
import { navItems, sectoralHighlights, site, trainingHighlights } from '../data/site'
import { heroSlides } from '../data/heroSlides'
import {
  CONSULTING_HUB_HERO,
  CONSULTING_HUB_SECONDARY,
  serviceHeroBySlug,
} from '../data/consultingPageVisuals'
import { TRAINING_HUB_HERO, TRAINING_HUB_SECONDARY } from '../data/trainingPageVisuals'
import { SECTORAL_HUB_HERO, SECTORAL_HUB_SECONDARY, sectoralHeroBySlug } from '../data/sectoralPageVisuals'
import type {
  AboutPageContent,
  ConsultingService,
  HomeSectionCopy,
  NavItem,
  SectoralService,
  SiteContent,
  TrainingService,
} from './types'

export const defaultAboutPage: AboutPageContent = {
  heroImageUrl:
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2400&q=85',
  heroEyebrow: 'Kurumsal Uzmanlık',
  heroTitle: 'BMG Danışmanlık Hakkımızda',
  heroSubtitleOverride:
    'Kalite yönetim sistemleri, AS 9100 ve ISO 9001 danışmanlığında uzman ekibimizle savunma ve havacılık sanayiine yönelik sürdürülebilir gelişim sağlıyoruz.',
  metaDescription:
    'BMG Danışmanlık; kalite yönetim sistemleri, ISO 9001 ve AS 9100 alanlarında belgelendirme desteği, süreç iyileştirme ve teknik eğitim hizmetleri sunar.',
  mainParagraph:
    '{name}, kalite yönetim sistemleri alanında uzmanlaşmış bir danışmanlık firmasıdır. Kuruluşların stratejik hedeflerine ulaşabilmesi için ölçülebilir, sürdürülebilir ve denetlenebilir yönetim modelleri tasarlarız. ISO 9001 ve AS 9100 başta olmak üzere uluslararası standartlara uyum, belgelendirme hazırlığı, süreç performansı ve operasyonel mükemmellik konularında uçtan uca destek sunarız.\n\nSavunma ve havacılık sanayiindeki saha deneyimimizle; risk temelli düşünme, tedarik zinciri uyumu, izlenebilirlik, dokümantasyon disiplini ve denetim başarısını birlikte yönetiriz. Mevcut durum analizinden teknik eğitim ve belgelendirme sonrası sürekli iyileştirme adımlarına kadar kurumunuza özel yol haritası oluşturur, kalıcı değer üretiriz.',
  bullets: [
    'ISO 9001 ve AS 9100 belgelendirme süreçlerinde uçtan uca danışmanlık',
    'Kalite yönetim sistemi kurulumu, dokümantasyon ve uygulama eşliği',
    'Süreç iyileştirme, risk yönetimi ve performans göstergesi tasarımı',
    'İç tetkik, yönetim gözden geçirmesi ve denetim hazırlık desteği',
  ],
  sideCardTitle: 'Savunma ve Havacılıkta Güvenilir Çözüm Ortağı',
  sideCardText:
    'Profesyonel kadromuz; mevcut durum analizinden belgelendirme sonrası sürekli iyileştirme adımlarına kadar kurumunuza değer katan sonuçlarla yanınızdadır.',
  focusAreas: ['AS 9100 ve ISO 9001 uzmanlığı', 'Belgelendirme ve denetim hazırlığı', 'Süreç geliştirme ve teknik eğitim'],
  ctaStripTitle: 'Danışmanlık, eğitim ve sektörel hizmetlerimizi keşfedin',
}

/** Fresh copy for reset — do not mutate */
export function getDefaultAboutPage(): AboutPageContent {
  return clone(defaultAboutPage)
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

/** Default public content — same as bundled `src/data/*` */
export function buildDefaultSiteContent(): SiteContent {
  return {
    site: clone(site) as SiteContent['site'],
    navItems: clone(navItems as unknown as NavItem[]) as NavItem[],
    trainingHighlights: [...trainingHighlights],
    sectoralHighlights: [...sectoralHighlights],
    heroSlides: heroSlides.map((s) => ({
      id: s.id,
      src: s.src,
      alt: s.alt,
      title: s.title,
      description: s.description,
    })),
    heroStats: [
      { label: 'Standart kapsamı', value: 'ISO & sektörel' },
      { label: 'Yaklaşım', value: 'Süreç odaklı' },
      { label: 'Dil', value: 'Türkçe' },
    ],
    consultingServices: clone(consultingServices as unknown as ConsultingService[]) as ConsultingService[],
    trainingServices: clone(trainingServices as unknown as TrainingService[]) as TrainingService[],
    sectoralServices: clone(sectoralServices as unknown as SectoralService[]) as SectoralService[],
    aboutPage: clone(defaultAboutPage),
    visuals: {
      consulting: {
        hubHero: CONSULTING_HUB_HERO,
        hubSecondary: CONSULTING_HUB_SECONDARY,
        serviceHeroBySlug: { ...serviceHeroBySlug },
      },
      training: {
        hubHero: TRAINING_HUB_HERO,
        hubSecondary: TRAINING_HUB_SECONDARY,
      },
      sectoral: {
        hubHero: SECTORAL_HUB_HERO,
        hubSecondary: SECTORAL_HUB_SECONDARY,
        heroBySlug: { ...sectoralHeroBySlug },
      },
    },
    pageBanners: {
      hakkimizda: '',
      iletisim: '',
      danismanlikHub: '',
      egitimHub: '',
      sektorelHub: '',
      danismanlikDetay: '',
      egitimDetay: '',
      sektorelDetay: '',
    },
    homeSectionCopy: clone(defaultHomeSectionCopy) as HomeSectionCopy,
    emailSettings: {
      recipientEmail: site.email,
      fromName: 'BMG Danismanlik Website',
      subjectPrefix: 'Yeni Iletisim Formu',
      successMessage: 'Mesajiniz iletildi. En kisa surede sizinle iletisime gececegiz.',
    },
  }
}
