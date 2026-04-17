export type ConsultingService = {
  slug: string
  code: string
  title: string
  summary: string
  intro: string
  offerings: string[]
  processSteps: { title: string; text: string }[]
}

/** Danışmanlık hizmetleri — liste + detay sayfaları */
export const consultingServices: readonly ConsultingService[] = [
  {
    slug: 'iso-9001',
    code: 'ISO 9001',
    title: 'Kalite Yönetim Sistemi Danışmanlık Hizmeti',
    summary:
      'Müşteri memnuniyeti ve sürekli iyileştirme odaklı kalite yönetimini kurumsal kültürünüze entegre edin.',
    intro:
      'ISO 9001, kuruluşunuzun müşteri ve yasal gereksinimleri karşılayan ürün ve hizmetleri tutarlı biçimde sunmasını ve sürekli iyileştirmeyi hedeflemesini sağlayan uluslararası bir kalite yönetim sistemi standardıdır. Süreçlerinizi netleştirip ölçülebilir performans göstergeleriyle yönetmenize yardımcı oluruz.',
    offerings: [
      'Kapsam ve bağlam analizi, paydaş ve beklentilerin belirlenmesi',
      'Süreç haritalama, risk ve fırsatların yönetimi',
      'Kalite politikası ve hedeflerin kurumsal yapı ile uyumu',
      'Dokümantasyon, uygulama, iç tetkik ve yönetim gözden geçirme desteği',
      'Belgelendirme öncesi hazırlık ve denetim koordinasyonu',
    ],
    processSteps: [
      { title: 'Keşif', text: 'Mevcut durum, süreçler ve beklentilerin ortak değerlendirmesi.' },
      { title: 'Tasarım', text: 'KYS mimarisi, prosedürler ve rol/sorumlulukların netleştirilmesi.' },
      { title: 'Uygulama', text: 'Saha içi destek, iç tetkikler ve düzeltici faaliyetler.' },
      { title: 'Sertifikasyon', text: 'Denetim hazırlığı ve sürekli iyileştirme döngüsü.' },
    ],
  },
  {
    slug: 'iso-14001',
    code: 'ISO 14001',
    title: 'Çevre Yönetim Sistemi Danışmanlık Hizmeti',
    summary:
      'Çevresel etkilerin yönetimi, uyumluluk ve sürdürülebilirlik hedefleriniz için sistematik bir yapı.',
    intro:
      'ISO 14001, çevresel performansınızı iyileştirmenize yardımcı olan bir çevre yönetim sistemi çerçevesi sunar. Önemli çevresel yönleri, yükümlülükleri ve operasyonel kontrolleri sistematik biçimde yönetmenize destek oluruz.',
    offerings: [
      'Çevresel bağlam ve önemli çevresel yönlerin belirlenmesi',
      'Hedefler, göstergeler ve operasyonel kontroller',
      'Acil durum hazırlığı ve iletişim süreçleri',
      'İç tetkik ve üst yönetim gözden geçirmesi',
      'Belgelendirme sürecine hazırlık',
    ],
    processSteps: [
      { title: 'Çevresel profil', text: 'Etki değerlendirmesi ve mevzuat uygunluğu.' },
      { title: 'Sistem kurulumu', text: 'Politika, hedefler ve dokümantasyon yapısı.' },
      { title: 'Operasyon', text: 'Uygulama, ölçüm ve düzeltici aksiyonlar.' },
      { title: 'İyileştirme', text: 'Denetim hazırlığı ve sürekli gelişim.' },
    ],
  },
  {
    slug: 'iso-45001',
    code: 'ISO 45001',
    title: 'İş Sağlığı ve Güvenliği Yönetim Sistemi Danışmanlık Hizmeti',
    summary:
      'İSG risklerinin kontrolü, çalışan katılımı ve güvenli çalışma ortamı için entegre yaklaşım.',
    intro:
      'ISO 45001, iş sağlığı ve güvenliği risklerini azaltmayı ve çalışanların sağlığını korumayı amaçlayan bir yönetim sistemidir. Tehlike tanımlama, risk değerlendirme ve operasyonel kontrolleri kurumsal süreçlerinizle bütünleştiririz.',
    offerings: [
      'İSG bağlamı ve çalışan katılımı mekanizmaları',
      'Tehlike kaynağı tanımlama ve risk değerlendirme',
      'İş ekipmanı, acil durum ve olay araştırma süreçleri',
      'Performans izleme ve iç tetkik',
      'Belgelendirme ve sürekli iyileştirme',
    ],
    processSteps: [
      { title: 'Risk envanteri', text: 'Tehlike ve risklerin önceliklendirilmesi.' },
      { title: 'Sistem', text: 'Politika, hedefler ve operasyonel kontroller.' },
      { title: 'Ölçme', text: 'Olaylar, tatbikatlar ve düzeltici faaliyetler.' },
      { title: 'Gözden geçirme', text: 'Üst yönetim ve denetim hazırlığı.' },
    ],
  },
  {
    slug: 'iso-10002',
    code: 'ISO 10002',
    title: 'Müşteri Memnuniyeti Yönetim Sistemi Danışmanlığı',
    summary:
      'Şikâyet yönetimi ve müşteri geri bildirim süreçlerini ölçülebilir ve iyileştirilebilir hale getirin.',
    intro:
      'ISO 10002, müşteri şikâyetlerinin etkin şekilde ele alınması için yönergeler sunar. Müşteri deneyimini iyileştirmek ve güven oluşturmak için şikâyet süreçlerinizi şeffaf ve izlenebilir kılarız.',
    offerings: [
      'Şikâyet kanalları ve kayıt sınıflandırması',
      'İnceleme, kök neden analizi ve çözüm süreçleri',
      'Müşteri geri bildirimleri ile iyileştirme döngüsü',
      'Eğitim ve iletişim şablonları',
      'Performans göstergeleri ve raporlama',
    ],
    processSteps: [
      { title: 'Mevcut süreç', text: 'Şikâyet akışının haritalanması.' },
      { title: 'Tasarım', text: 'Politika, yetki ve eskalasyon kuralları.' },
      { title: 'Uygulama', text: 'Araçlar, eğitim ve izleme.' },
      { title: 'İyileştirme', text: 'Analiz ve müşteri memnuniyeti hedefleri.' },
    ],
  },
  {
    slug: 'iso-31000',
    code: 'ISO 31000',
    title: 'Kurumsal Risk Yönetim Sistemi Danışmanlık Hizmeti',
    summary:
      'Kurumsal risklerin tanımlanması, analizi ve stratejik kararlarla uyumlu yönetimi.',
    intro:
      'ISO 31000, risk yönetimi ilkeleri ve süreçleri için rehber sunar. Stratejik, operasyonel ve uyumluluk risklerini tek çatı altında değerlendirip yönetişimle uyumlu hale getirmenize yardımcı oluruz.',
    offerings: [
      'Risk bağlamı ve kriterlerin tanımı',
      'Risk değerlendirme atölyeleri ve önceliklendirme',
      'İş süreçleri ile risk kayıtlarının entegrasyonu',
      'Raporlama ve üst yönetim sunumları',
      'Sürekli izleme ve gözden geçirme',
    ],
    processSteps: [
      { title: 'Çerçeve', text: 'Kapsam, roller ve risk dilinin netleştirilmesi.' },
      { title: 'Değerlendirme', text: 'Tanımlama, analiz ve önceliklendirme.' },
      { title: 'Tedbirler', text: 'İşleme planları ve sorumluluklar.' },
      { title: 'İzleme', text: 'Göstergeler ve iyileştirme.' },
    ],
  },
  {
    slug: 'iso-27001',
    code: 'ISO 27001',
    title: 'Bilgi Güvenliği Yönetim Sistemi Danışmanlık Hizmeti',
    summary:
      'Bilgi varlıklarının gizlilik, bütünlük ve erişilebilirlik gereksinimlerine göre korunması.',
    intro:
      'ISO/IEC 27001, bilgi güvenliği yönetim sistemi (BGYS) için gereksinimleri tanımlar. Varlık envanteri, risk işleme ve kontrollerin seçimi ile siber ve operasyonel tehditlere karşı yapınızı güçlendiririz.',
    offerings: [
      'Kapsam ve bilgi varlıklarının envanteri',
      'Risk değerlendirme ve Statement of Applicability',
      'Politika, erişim kontrolü ve olay yönetimi',
      'İç tetkik ve düzeltici aksiyonlar',
      'Belgelendirme hazırlığı',
    ],
    processSteps: [
      { title: 'Envanter', text: 'Varlıklar ve tehditlerin belirlenmesi.' },
      { title: 'Risk', text: 'Analiz ve kontrol seçimi.' },
      { title: 'Uygulama', text: 'BGYS dokümantasyonu ve uygulama.' },
      { title: 'Doğrulama', text: 'İç tetkik ve sertifikasyon.' },
    ],
  },
  {
    slug: 'iso-50001',
    code: 'ISO 50001',
    title: 'Enerji Yönetim Sistemi Danışmanlık Hizmeti',
    summary:
      'Enerji performansının izlenmesi, hedefler ve verimlilik iyileştirmeleri için sistematik çerçeve.',
    intro:
      'ISO 50001, enerji performansını sürekli iyileştirmeyi hedefleyen bir enerji yönetim sistemidir. Enerji taban çizgisi, EnPI ve enerji incelemeleri ile tüketimi ve maliyetleri yönetmenize destek oluruz.',
    offerings: [
      'Enerji politikası ve enerji incelemeleri',
      'Önemli enerji kullanımlarının tanımı ve veri toplama',
      'Hedefler, eylem planları ve operasyonel kontrol',
      'İzleme ve ölçüm altyapısı',
      'Belgelendirme ve sürekli iyileştirme',
    ],
    processSteps: [
      { title: 'Temel çizgi', text: 'Enerji kullanımı ve göstergeler.' },
      { title: 'Sistem', text: 'Hedefler ve eylem planları.' },
      { title: 'Uygulama', text: 'Operasyon ve bakım süreçleri.' },
      { title: 'Performans', text: 'İzleme ve denetim hazırlığı.' },
    ],
  },
  {
    slug: 'as-9100',
    code: 'AS 9100',
    title: 'Havacılık Uzay ve Savunma Sanayi KYS Danışmanlık Hizmeti',
    summary:
      'Havacılık ve savunma sektörüne özgü kalite gereksinimleri ve tedarik zinciri uyumu.',
    intro:
      'AS 9100, havacılık, uzay ve savunma sanayisinde ISO 9001 tabanlı ek şartları içerir. Özel süreçler, yapılandırma yönetimi ve tedarik zinciri gereksinimlerinde uyum sağlamanıza yardımcı oluruz.',
    offerings: [
      'Sektörel şartların mevcut süreçlerle eşleştirilmesi',
      'Yapılandırma yönetimi ve risk temelli düşünme',
      'Özel süreçler ve ürün güvenliği odakları',
      'İç tetkik ve ikinci/üçüncü taraf denetim hazırlığı',
      'Öğrenme organizasyonu ve sürekli iyileştirme',
    ],
    processSteps: [
      { title: 'Gap analizi', text: 'AS 9100 şartlarına göre boşlukların tespiti.' },
      { title: 'Tasarım', text: 'Süreç ve dokümantasyon uyumu.' },
      { title: 'Uygulama', text: 'Saha desteği ve iç tetkikler.' },
      { title: 'Denetim', text: 'Hazırlık ve düzeltici aksiyonlar.' },
    ],
  },
  {
    slug: 'iatf-16949',
    code: 'IATF 16949',
    title: 'Otomotiv Kalite Yönetim Sistemi Danışmanlık Hizmeti',
    summary:
      'Otomotiv endüstrisi için özel kalite araçları ve üretim süreçlerinde sürekli iyileştirme.',
    intro:
      'IATF 16949, otomotiv sektöründe kalite yönetim sistemi için uluslararası gereksinimleri tanımlar. Müşteri özel şartları, çekirdek araçlar ve üretim süreçlerinde otomotiv odaklı uyum sağlamanıza destek veririz.',
    offerings: [
      'Müşteri özel şartları ve CSR uyumu',
      'APQP, PPAP, FMEA, MSA, SPC gibi araçların süreçlere entegrasyonu',
      'Üretim süreçlerinde sürekli iyileştirme ve sorun çözme',
      'Tedarik zinciri ve saha denetimleri hazırlığı',
      'Belgelendirme ve seri üretim desteği',
    ],
    processSteps: [
      { title: 'Kapsam', text: 'Ürün grupları ve müşteri şartları.' },
      { title: 'Sistem', text: 'KYS ve çekirdek araçlar.' },
      { title: 'Uygulama', text: 'Üretim ve tedarik süreçleri.' },
      { title: 'Performans', text: 'İç tetkik ve IATF denetim hazırlığı.' },
    ],
  },
]

export function getConsultingBySlug(slug: string): ConsultingService | undefined {
  return consultingServices.find((s) => s.slug === slug)
}
