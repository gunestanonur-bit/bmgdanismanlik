export type TrainingService = {
  slug: string
  code: string
  title: string
  summary: string
  intro: string
  offerings: string[]
  processSteps: { title: string; text: string }[]
}

/** Eğitim programları — liste + detay sayfaları */
export const trainingServices: readonly TrainingService[] = [
  {
    slug: 'iso-9001',
    code: 'ISO 9001',
    title: 'Kalite Yönetim Sistemi Eğitimi',
    summary:
      'KYS temelleri, süreç yaklaşımı ve iç tetkik becerileri ile ekiplerinizi güçlendirin.',
    intro:
      'Bu eğitim; ISO 9001 standardının mantığını, süreç yönetimini ve sürekli iyileştirmeyi katılımcıların günlük işine bağlar. Yönetim sistemi farkındalığından iç tetkire kadar ihtiyaca göre modüler yapılandırılabilir.',
    offerings: [
      'Standardın yapısı, bağlam ve süreç yaklaşımı',
      'Risk ve fırsatların ele alınması, hedefler ve performans izleme',
      'Dokümantasyon hiyerarşisi ve kayıt yönetimi',
      'İç tetkik teknikleri ve bulgu raporlama',
      'Yönetim gözden geçirmesi ve düzeltici faaliyetler',
    ],
    processSteps: [
      { title: 'Ön analiz', text: 'Katılımcı profili ve kurumsal beklentilerin netleştirilmesi.' },
      { title: 'Program', text: 'Teorik oturumlar, örnek olaylar ve grup çalışmaları.' },
      { title: 'Uygulama', text: 'Şablonlar ve senaryolarla pratik uygulama.' },
      { title: 'Değerlendirme', text: 'Kısa sınav veya ödev ile öğrenme çıktılarının kontrolü.' },
    ],
  },
  {
    slug: 'iso-14001',
    code: 'ISO 14001',
    title: 'Çevre Yönetim Sistemi Eğitimi',
    summary:
      'Çevresel yönler, yasal uyum ve sürekli iyileştirme için sistem bilinci kazandırır.',
    intro:
      'ISO 14001 çerçevesinde çevre politikasından acil duruma kadar temel kavramları işleriz. Operasyonel kontroller ve performans ölçümü için ortak bir dil oluşturulur.',
    offerings: [
      'Çevresel bağlam ve önemli çevresel yönler',
      'Hedefler, göstergeler ve operasyonel kontrol',
      'Acil durum ve iletişim',
      'İç tetkik ve uyumluluk değerlendirmesi',
    ],
    processSteps: [
      { title: 'Hazırlık', text: 'Kurum örneği ve mevzuat hatırlatması.' },
      { title: 'İçerik', text: 'Modül bazlı anlatım ve vaka çalışmaları.' },
      { title: 'Atölye', text: 'Risk/etki örnekleri ve kontrol listeleri.' },
      { title: 'Kapanış', text: 'Özet ve gelişim önerileri.' },
    ],
  },
  {
    slug: 'iso-45001',
    code: 'ISO 45001',
    title: 'İş Sağlığı ve Güvenliği Yönetim Sistemi Eğitimi',
    summary:
      'Tehlike tanımlama, risk değerlendirme ve katılım kültürü için uygulamalı öğrenme.',
    intro:
      'İSG yönetim sisteminin ISO 45001 ile nasıl örtüştüğünü; tehlike kaynaklarından olay araştırmaya kadar ele alırız. Sahadaki gerçek senaryolarla desteklenir.',
    offerings: [
      'İSG politikası ve çalışan katılımı',
      'Tehlike tanımlama ve risk değerlendirme yöntemleri',
      'İş ekipmanı, kişisel koruyucu donanım ve acil durum',
      'Olay araştırma ve düzeltici faaliyetler',
    ],
    processSteps: [
      { title: 'Ön test', text: 'Beklenti ve ön bilgi seviyesi.' },
      { title: 'Modüller', text: 'Konu anlatımı ve grup tartışmaları.' },
      { title: 'Saha örnekleri', text: 'Risk matrisi ve kontrol örnekleri.' },
      { title: 'Sonuç', text: 'Değerlendirme ve sertifika / katılım belgesi.' },
    ],
  },
  {
    slug: 'iso-10002',
    code: 'ISO 10002',
    title: 'Müşteri Memnuniyeti Yönetim Sistemi Eğitimi',
    summary:
      'Şikâyet yönetimi ve müşteri geri bildirimlerini yapılandırılmış süreçlere dönüştürün.',
    intro:
      'ISO 10002 ilkeleri doğrultusunda şikâyet kanalları, kayıt, inceleme ve müşteri memnuniyetinin ölçülmesi üzerine odaklanır. İletişim ve eskalasyon kuralları netleştirilir.',
    offerings: [
      'Şikâyet yaşam döngüsü ve sınıflandırma',
      'Kök neden ve çözüm süreçleri',
      'Müşteri geri bildirimi ve iyileştirme döngüsü',
      'Örnek formlar ve KPI önerileri',
    ],
    processSteps: [
      { title: 'Senaryo', text: 'Örnek şikâyet dosyası üzerinden yürüyüş.' },
      { title: 'Araçlar', text: '5 Neden, balık kılçığı gibi teknikler.' },
      { title: 'Rol oyunu', text: 'Müşteri iletişimi ve kayıt tutma.' },
      { title: 'Özet', text: 'Kuruma özel aksiyon listesi.' },
    ],
  },
  {
    slug: 'iso-31000',
    code: 'ISO 31000',
    title: 'Kurumsal Risk Yönetim Sistemi Eğitimi',
    summary:
      'Risk dilini, değerlendirme yöntemlerini ve raporlamayı kurumunuza uyarlayın.',
    intro:
      'ISO 31000 ilkeleri ile risk tanımlama, analiz, değerlendirme ve işleme adımları uygulamalı olarak işlenir. Stratejik ve operasyonel risk örnekleri kullanılır.',
    offerings: [
      'Risk kriterleri ve ölçekler',
      'Kimliklendirme ve analiz teknikleri',
      'İşleme seçenekleri ve izleme',
      'Üst yönetim raporlaması',
    ],
    processSteps: [
      { title: 'Çerçeve', text: 'Kurumsal risk bağlamının tanımı.' },
      { title: 'Atölye', text: 'Örnek risk kayıtları üzerinde çalışma.' },
      { title: 'Önceliklendirme', text: 'Skorlama ve matris kullanımı.' },
      { title: 'Plan', text: 'Sonraki adımlar ve şablonlar.' },
    ],
  },
  {
    slug: 'iso-27001',
    code: 'ISO 27001',
    title: 'Bilgi Güvenliği Yönetim Sistemi Eğitimi',
    summary:
      'BGYS kapsamı, kontroller ve risk değerlendirmesi için temel yetkinlik.',
    intro:
      'Bilgi varlıkları, tehditler ve ISO/IEC 27001 Annex A kontrolleri giriş seviyesinden ileri seviyeye modüler anlatılır. Siber farkındalık ile birlikte düşünülür.',
    offerings: [
      'Kapsam ve bilgi varlığı envanteri',
      'Risk değerlendirme ve SoA mantığı',
      'Erişim kontrolü, olay yönetimi ve süreklilik',
      'İç tetkik ve denetim hazırlığı',
    ],
    processSteps: [
      { title: 'Temeller', text: 'Gizlilik, bütünlük, erişilebilirlik.' },
      { title: 'Uygulama', text: 'Örnek varlık ve tehdit listeleri.' },
      { title: 'Kontroller', text: 'Seçilmiş Annex A maddeleri üzerinden geçiş.' },
      { title: 'Kapanış', text: 'Kaynaklar ve sertifikasyon yol haritası.' },
    ],
  },
  {
    slug: 'iso-50001',
    code: 'ISO 50001',
    title: 'Enerji Yönetim Sistemi Eğitimi',
    summary:
      'Enerji incelemesi, EnPI ve sürekli iyileştirme için sistem bilgisi.',
    intro:
      'ISO 50001 ile enerji politikasından performans izlemeye kadar süreçler anlatılır. Veri toplama ve enerji taban çizgisi kavramları örneklerle desteklenir.',
    offerings: [
      'Enerji politikası ve enerji incelemesi',
      'Önemli enerji kullanımları ve EnPI',
      'Hedefler, eylem planları ve işletme kontrolleri',
      'Ölçüm ve doğrulama hatırlatmaları',
    ],
    processSteps: [
      { title: 'Giriş', text: 'Enerji akışı ve tesis örneği.' },
      { title: 'Modüller', text: 'Standardın başlıklarıyla uyumlu anlatım.' },
      { title: 'Sayısal örnek', text: 'Basit EnPI ve hedef hesabı.' },
      { title: 'Değerlendirme', text: 'Soru-cevap ve özet.' },
    ],
  },
  {
    slug: 'as-9100',
    code: 'AS 9100',
    title: 'Havacılık Uzay ve Savunma Sanayi Kalite Yönetim Sistemi Eğitimi',
    summary:
      'AS 9100 ek şartları, yapılandırma yönetimi ve havacılık odaklı kalite araçları.',
    intro:
      'ISO 9001 temeli üzerine AS 9100’un getirdiği özel gereksinimler; yapılandırma yönetimi, risk, özel süreçler ve tedarik zinciri konularında derinleştirilir.',
    offerings: [
      'Sektörel bağlam ve müşteri şartları',
      'Ürün güvenliği ve özel süreçler',
      'Yapılandırma yönetimi ve izlenebilirlik',
      'İç tetkik ve ikinci taraf hazırlığı',
    ],
    processSteps: [
      { title: 'Karşılaştırma', text: 'ISO 9001 ile farkların haritası.' },
      { title: 'Derinlemesine', text: 'Seçili AS maddeleri ve örnekler.' },
      { title: 'Ödev', text: 'Örnek süreç üzerinde gap analizi.' },
      { title: 'Özet', text: 'Denetim soruları ve kaynaklar.' },
    ],
  },
  {
    slug: 'iatf-16949',
    code: 'IATF 16949',
    title: 'Otomotiv Kalite Yönetim Sistemi Eğitimi',
    summary:
      'Otomotiv çekirdek araçları ve müşteri özel şartları ile uyumlu KYS bilgisi.',
    intro:
      'IATF 16949 gereksinimleri; APQP, PPAP, FMEA, MSA, SPC gibi araçlarla ilişkili şekilde anlatılır. Üretim ve tedarik süreçlerine özel vurgu yapılır.',
    offerings: [
      'Standardın yapısı ve müşteri özel şartları',
      'Çekirdek araçların rolü ve entegrasyonu',
      'Sürekli iyileştirme ve sorun çözme',
      'İç tetkik ve saha denetimi hazırlığı',
    ],
    processSteps: [
      { title: 'Genel bakış', text: 'Otomotiv kalite ekosistemi.' },
      { title: 'Araçlar', text: 'Her araç için kısa derinleşme.' },
      { title: 'Vaka', text: 'Örnek parça ve süreç üzerinden ödev.' },
      { title: 'Kapanış', text: 'Sık denetim bulguları ve öneriler.' },
    ],
  },
]

export function getTrainingBySlug(slug: string): TrainingService | undefined {
  return trainingServices.find((s) => s.slug === slug)
}
