export type SectoralService = {
  slug: string
  code: string
  title: string
  summary: string
  intro: string
  offerings: string[]
  processSteps: { title: string; text: string }[]
}

/** Sektörel hizmetler — liste + detay */
export const sectoralServices: readonly SectoralService[] = [
  {
    slug: 'as-9100-havacilik-savunma',
    code: 'AS 9100',
    title:
      'Havacılık Uzay ve Savunma Sanayi Kalite Yönetim Sistemi Eğitim, Danışmanlık ve Belgelendirme Hizmetleri',
    summary:
      'AS 9100 kapsamında eğitim, sistem kurulumu / iyileştirme ve belgelendirme sürecine uçtan uca destek.',
    intro:
      'Havacılık, uzay ve savunma sanayisinde kalite yönetim sistemi gereksinimleri; ISO 9001 temeli üzerine sektörel ek şartlarla birlikte ele alınır. Ekibinizin yetkinliğini eğitimlerle güçlendirir, dokümantasyon ve uygulamada yanınızda olur, belgelendirme öncesi hazırlık ve denetim koordinasyonunu birlikte yürütürüz.',
    offerings: [
      'AS 9100 farkındalık ve derinleşme eğitimleri',
      'Gap analizi ve yol haritası (eğitim + danışmanlık + belgelendirme)',
      'Özel süreçler, yapılandırma yönetimi ve tedarik zinciri uyumu',
      'İç tetkik ve ikinci / üçüncü taraf denetim hazırlığı',
      'Sertifikasyon sürecinde teknik dosya ve uygulama desteği',
    ],
    processSteps: [
      { title: 'Keşif', text: 'Kapsam, müşteri şartları ve mevcut KYS’nin değerlendirilmesi.' },
      { title: 'Plan', text: 'Eğitim takvimi, danışmanlık adımları ve belgelendirme hedefi.' },
      { title: 'Uygulama', text: 'Dokümantasyon, saha desteği ve iç tetkikler.' },
      { title: 'Belgelendirme', text: 'Denetim hazırlığı ve sürekli iyileştirme.' },
    ],
  },
  {
    slug: 'eydep',
    code: 'EYDEP',
    title: 'EYDEP Başvuru İşlemleri ve Danışmanlık Hizmetleri',
    summary:
      'Elektronik Yol Denetim Sistemi (EYDEP) başvuru süreçlerinde rehberlik ve uyum desteği.',
    intro:
      'EYDEP kapsamında başvuru öncesi gereksinimlerin netleştirilmesi, belge ve süreç hazırlığı, sistem üzerinden başvuru adımlarının takibi konularında danışmanlık sunuyoruz. Kurumunuza özel iş paketi ve zaman planı ile ilerlenir.',
    offerings: [
      'Mevcut süreç ve belge envanterinin çıkarılması',
      'Başvuru öncesi eksiklerin kapatılması ve şablon desteği',
      'EYDEP portal süreçlerinde adım adım rehberlik',
      'İletişim ve revizyon döngüsünde koordinasyon',
    ],
    processSteps: [
      { title: 'Ön değerlendirme', text: 'Uygunluk ve ön koşulların kontrolü.' },
      { title: 'Hazırlık', text: 'Belgelerin tamamlanması ve iç onaylar.' },
      { title: 'Başvuru', text: 'Portal işlemleri ve takip.' },
      { title: 'Sonuç', text: 'Geri bildirim ve düzeltici aksiyonlar.' },
    ],
  },
  {
    slug: 'mevcut-durum-analizi',
    code: 'Analiz',
    title: 'AS9100 ve EYDEP Mevcut Durum Analizleri',
    summary:
      'AS 9100 ve EYDEP gereksinimlerine göre mevcut durumun objektif analizi ve önceliklendirilmiş aksiyon planı.',
    intro:
      'Kurumunuzun süreçleri, dokümantasyonu ve uygulamaları; seçilen kapsamda AS 9100 ve/veya EYDEP beklentileri ile karşılaştırılır. Güçlü yönler, boşluklar ve riskler raporlanır; yol haritası ve öncelikler netleştirilir.',
    offerings: [
      'Görüşme ve süreç gözlemi ile veri toplama',
      'Şart-karşılaştırma (checklist) ve kanıt incelemesi',
      'Gap raporu ve önceliklendirilmiş aksiyon listesi',
      'Yönetim özeti sunumu ve soru-cevap oturumu',
    ],
    processSteps: [
      { title: 'Kapsam', text: 'Analiz sınırı ve ilgili standart / mevzuat.' },
      { title: 'Saha', text: 'Kayıt incelemesi ve örnek iz süreçleri.' },
      { title: 'Rapor', text: 'Bulgular, riskler ve öneriler.' },
      { title: 'Plan', text: 'İyileştirme ve takip adımları.' },
    ],
  },
  {
    slug: 'tesis-guvenlik-belgesi',
    code: 'Tesis Güvenlik',
    title: 'Tesis Güvenlik Belgesi Danışmanlık Hizmetleri',
    summary:
      'Tesis güvenlik belgesi süreçlerinde uyum, dokümantasyon ve başvuru hazırlığı.',
    intro:
      'Tesis güvenliği ile ilgili yükümlülüklerin yerine getirilmesi için gerekli organizasyonel ve teknik hazırlıkların değerlendirilmesi, eksiklerin giderilmesi ve başvuru paketinin oluşturulması konularında danışmanlık veriyoruz. Güncel mevzuat ve kurum beklentileri dikkate alınır.',
    offerings: [
      'Mevcut tesis ve süreçlerin güvenlik açısından gözden geçirilmesi',
      'Gerekli plan, prosedür ve kayıt yapısının önerilmesi',
      'Başvuru öncesi kontrol listeleri ve dosya düzeni',
      'Başvuru sonrası geri bildirim ve revizyon desteği',
    ],
    processSteps: [
      { title: 'Tespit', text: 'Saha / uzaktan ön inceleme ve gereksinimler.' },
      { title: 'Uyum', text: 'Eksiklerin kapatılması ve belgeleme.' },
      { title: 'Başvuru', text: 'Paketin tamamlanması ve iletim.' },
      { title: 'İzleme', text: 'Sonuç ve sürekli uyum hatırlatmaları.' },
    ],
  },
]

export function getSectoralBySlug(slug: string): SectoralService | undefined {
  return sectoralServices.find((s) => s.slug === slug)
}
