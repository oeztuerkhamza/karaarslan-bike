# 🌍 Karaarslan Bike — İngilizce & Fransızca SEO Planı

> **Hedef:** "bike rental lünen", "used bike lünen", "buy bike lünen" (EN) ve "louer vélo lünen", "acheter vélo lünen", "vélo occasion lünen" (FR) aramalarında Google'da ilk sayfaya çıkmak.

---

## 📊 Mevcut Durum & Temel Sorunlar

### ❌ EN SEO'nun Neden Kötü Olduğu

| Sorun                                                                                   | Etki                                                                                       |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Blog URL'leri Almanca slug kullanıyor (`/en/ratgeber/gebrauchtes-fahrrad-kaufen-tipps`) | Google bu URL'yi İngilizce içerik olarak değerlendirmiyor                                  |
| "Ratgeber" kelimesi İngilizce URL'de kalıyor (`/en/ratgeber/`)                          | İngilizce kullanıcılar için anlamsız — güven sorunu                                        |
| EN hedef anahtar kelime yoğunluğu yetersiz                                              | Sayfa içerikleri "bike shop lünen", "bike rental lünen" gibi terimleri tekrarlamıyor       |
| Backlink yok (EN)                                                                       | Google EN sayfalarını otorite sayfası olarak görmüyor                                      |
| EN blog makaleleri arama odaklı değil                                                   | Makale başlıkları EN aramalarla eşleşmiyor                                                 |

### ❌ FR SEO'nun Neden Kötü Olduğu

| Sorun                                     | Etki                                                                                    |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| Blog URL'leri tamamen Almanca             | FR aramaların hiçbiri bu URL'lerle eşleşmiyor                                           |
| Ruhr bölgesindeki Fransızca konuşan kitle hedeflenmiyor | Ruhrgebiet'te yaşayan/çalışan Fransızca konuşan sakinler ve uluslararası ziyaretçiler var ama hizmet sunulmuyor |
| `fr` hreflang var ama FR-özgün içerik yok | Google FR sayfaları Almanca içeriğin çevirisi olarak görüyor                            |
| FR blog makaleleri sıfır                  | Fransız kullanıcılara yönelik bilgi içeriği yok                                         |
| "Ratgeber" FR URL'de                      | FR kullanıcılar için hiç anlamlı değil                                                  |

---

## 🚨 AŞAMA 1: Kritik URL Düzeltmeleri (En Büyük SEO Kazancı)

### 1.1 — Blog Route'larına Dil Özelleştirmesi Ekle

**Sorun:** `/en/ratgeber/gebrauchtes-fahrrad-kaufen-tipps` URL'si Google için İngilizce değil.

**Çözüm:** Dile göre blog slug'larını ve route prefix'ini çevir.

**`app.routes.ts`'de değişiklik:**

```typescript
// Mevcut (YANLIŞ):
{ path: 'ratgeber', ... }
{ path: 'ratgeber/:slug', ... }

// Yeni (DOĞRU — dile göre farklı path):
// DE: /de/ratgeber/:slug
// EN: /en/guide/:slug   ← İngilizce
// FR: /fr/guide/:slug   ← Fransızca (veya /fr/conseils/:slug)
```

**Bunun için `app.routes.ts`'e dil-özel route ekle:**

```typescript
{
  path: ':lang',
  children: [
    // Mevcut rotalar...

    // DE özel
    { path: 'ratgeber', ... },
    { path: 'ratgeber/:slug', ... },

    // EN/FR için alias — aynı component, farklı path
    { path: 'guide', ... },        // /en/guide, /fr/guide
    { path: 'guide/:slug', ... },  // /en/guide/buying-used-bike
    { path: 'conseils', ... },     // /fr/conseils (opsiyonel alternatif)
  ]
}
```

**`BlogArticle` modeline `slugTranslations` ekle:**

```typescript
export interface BlogArticle {
  slug: string; // DE slug (mevcut)
  slugTranslations: Partial<Record<Language, string>>; // EN/FR slug'ları
  // ...
}
```

**Örnek:**

```typescript
{
  slug: 'gebrauchtes-fahrrad-kaufen-tipps',  // DE
  slugTranslations: {
    en: 'buying-used-bike-tips',              // /en/guide/buying-used-bike-tips
    fr: 'acheter-velo-occasion-conseils',     // /fr/guide/acheter-velo-occasion-conseils
  },
}
```

**Süre:** 1-2 gün  
**Etki:** ⭐⭐⭐⭐⭐ — En kritik değişiklik. Mevcut blog içeriğini EN/FR arama sonuçlarına dahil eder.

> ⚠️ **Dikkat:** Mevcut `/en/ratgeber/...` URL'leri için 301 redirect ekle, aksi hâlde Google'daki (az da olsa) değerini kaybedersin.

---

### 1.2 — EN/FR için Blog Slug Çevirileri (Blog Data)

`blog.data.ts`'deki tüm makalelere `slugTranslations` ekle:

| DE Slug                            | EN Slug                          | FR Slug                            |
| ---------------------------------- | -------------------------------- | ---------------------------------- |
| `gebrauchtes-fahrrad-kaufen-tipps` | `buying-used-bike-luenen-tips`   | `acheter-velo-occasion-luenen`     |
| `welches-fahrrad-passt-zu-mir`     | `which-bike-is-right-for-me`     | `quel-velo-choisir`                |
| `fahrrad-rahmengroesse-berechnen`  | `bike-frame-size-guide`          | `taille-cadre-velo-guide`          |
| `e-bike-gebraucht-kaufen`          | `buying-used-e-bike-guide`       | `acheter-velo-electrique-occasion` |
| `fahrrad-inspektion-kosten`        | `bike-inspection-cost-luenen`    | `inspection-velo-prix-luenen`      |

---

## 🎯 AŞAMA 2: EN Anahtar Kelime Stratejisi

### Hedef Anahtar Kelimeler (İngilizce)

Lünen ve Ruhr bölgesindeki İngilizce konuşanlar ağırlıklı olarak **uluslararası sakinler, öğrenciler (yakındaki TU Dortmund), expat ve çalışanlar**dır.

#### Satın Alma Odaklı (Yüksek Niyet):

| Anahtar Kelime              | Aylık Hacim (tahmini) | Rekabet |
| --------------------------- | --------------------- | ------- |
| `buy used bike lünen`       | 50-200                | Düşük   |
| `used bike shop lünen`      | 100-300               | Düşük   |
| `second hand bike lünen`    | 100-400               | Düşük   |
| `buy bicycle dortmund`      | 100-300               | Düşük   |
| `bike shop lünen`           | 200-500               | Orta    |
| `used e-bike lünen`         | 50-150                | Düşük   |

#### Kiralama Odaklı (Yerel/Ziyaretçi Trafiği):

| Anahtar Kelime               | Aylık Hacim (tahmini) | Rekabet |
| ---------------------------- | --------------------- | ------- |
| `bike rental lünen`          | 100-400               | Düşük   |
| `rent a bike lünen`          | 100-300               | Düşük   |
| `bicycle rental lünen`       | 50-200                | Düşük   |
| `bike hire dortmund`         | 100-300               | Orta    |
| `cheap bike rental lünen`    | 50-150                | Düşük   |

#### Bilgi Odaklı (Blog İçerikleri):

| Anahtar Kelime                 | Blog Başlığı                                        |
| ------------------------------ | --------------------------------------------------- |
| `how to buy used bike germany` | Buying a Used Bike in Germany — The Complete Guide  |
| `bike frame size guide`        | Bike Frame Size Calculator & Guide                  |
| `used e-bike buying guide`     | Used E-Bike Buying Guide: Battery, Motor & Warranty |
| `cycling in the ruhr area`     | Cycling Around Lünen — Routes, Rentals & Tips       |

### 2.1 — EN İçin Öncelikli Yeni Blog Makaleleri

**Makale 1 (Kiralama — En Yüksek Etki):**

- Başlık: `Bike Rental in Lünen — Complete Guide 2026`
- Slug: `/en/guide/bike-rental-luenen-guide`
- Hedef keywords: "bike rental lünen", "rent a bike lünen"
- İçerik: Kiralama fiyatları, nasıl rezervasyon yapılır, nerede alınır, güzergâhlar
- Schema: `FAQPage` + `LocalBusiness`

**Makale 2 (Expat/Öğrenci):**

- Başlık: `Buy a Used Bike in Lünen — Expat & Student Guide`
- Slug: `/en/guide/buy-used-bike-luenen-expat-guide`
- Hedef keywords: "used bike lünen", "second hand bike lünen"
- İçerik: Lünen ve Ruhr bölgesinde yaşayanlar (TU Dortmund öğrencileri dahil) için nereden alınır, ne kadar ödenebilir, ne aranır

**Makale 3 (Bisiklet güzergâhları — Ruhr bölgesi):**

- Başlık: `Cycling Around Lünen — Best Routes, Bike Rentals & Tips`
- Slug: `/en/guide/cycling-luenen-routes-rentals`
- Hedef keywords: "cycling in the ruhr area", "bike rental lünen"
- İçerik: En iyi güzergâhlar (Römer-Lippe-Route, Seseke-Weg, Datteln-Hamm-Kanal-Radweg, RadrevierRuhr), kiralama nereden

### 2.2 — EN Ana Sayfa İçerik İyileştirmeleri

Ana sayfada EN dilinde şu metinler **H2 seviyesinde** olmalı:

- "Bike Shop in Lünen — New & Used Bikes" ← şu an H1'de "Bikes in Lünen — new & used." var, iyi
- Altında "Whether you're an international resident looking to **rent a bike in Lünen**, a student needing a **used bike**, or a local searching for a **new bicycle** — Karaarslan Bike has you covered."

**Mevcut EN `heroSub`:**

> "New and certified used bikes in Lünen — fair prices, sustainable refurbishment, personal advice."

**Önerilen EN `heroSub` (anahtar kelime zenginleştirilmiş):**

> "Buy or rent a bike in Lünen ✓ Inspected used bikes from €80 ✓ Bike rental from €6.80/day ✓ City, Trekking & E-Bikes ✓ Pick up same day."

---

## 🇫🇷 AŞAMA 3: FR Anahtar Kelime Stratejisi

### Neden FR SEO Bir Fırsattır

Ruhrgebiet, Almanya'nın en kalabalık ve en çok uluslararası nüfusa sahip metropol bölgesidir. Lünen ve çevresinde (Dortmund, Unna, Hamm) yaşayan/çalışan **Fransızca konuşan sakinler, expat ve uluslararası ziyaretçiler** mevcut. Bu kitlenin bir kısmı **Almanca bilmiyor** ve Google'da **Fransızca** arama yapıyor.

Burada hedef sınır turizmi değil; bölgedeki Fransızca konuşanlara **genel Fransızca dil hizmeti** sunmaktır. Yerel rakipler FR içerik üretmiyor — sen üretirsen bu nişte rakipsiz olursun.

### Hedef Anahtar Kelimeler (Fransızca)

#### Kiralama Odaklı (Yerel Fransızca konuşanlar):

| Anahtar Kelime                      | Tahmini Hacim | Rekabet   |
| ----------------------------------- | ------------- | --------- |
| `location vélo Lünen`               | 30-150        | Çok Düşük |
| `louer vélo Lünen`                  | 30-120        | Çok Düşük |
| `louer un vélo à Lünen`             | 20-80         | Çok Düşük |
| `location vélo Dortmund`            | 50-200        | Düşük     |
| `magasin de vélo Lünen`             | 30-120        | Çok Düşük |

#### Satın Alma Odaklı:

| Anahtar Kelime                      | Tahmini Hacim | Rekabet   |
| ----------------------------------- | ------------- | --------- |
| `acheter vélo Lünen`                | 30-120        | Çok Düşük |
| `vélo occasion Lünen`               | 30-120        | Çok Düşük |
| `achat vélo Allemagne`              | 100-300       | Düşük     |
| `vélo électrique occasion Lünen`    | 20-80         | Çok Düşük |

#### Bölgesel Fırsat (Ruhrgebiet Fransızca konuşan kitle):

| Anahtar Kelime                      | Bağlantı                                            |
| ----------------------------------- | --------------------------------------------------- |
| `location vélo Dortmund Lünen`      | Bölgedeki Fransızca konuşan sakinler                |
| `magasin vélo francophone Ruhr`     | Fransızca hizmet arayan expatlar                    |
| `vélo Ruhr itinéraire`              | Ruhr bölgesi bisiklet güzergâhları (RadrevierRuhr)  |

### 3.1 — FR İçin Öncelikli Blog Makaleleri

**Makale 1 (En Büyük FR Fırsatı):**

- Başlık: `Location de vélos à Lünen — Tarifs, Réservation & Adresse`
- Slug: `/fr/guide/location-velo-luenen`
- Hedef keywords: "location vélo Lünen", "louer vélo Lünen"
- İçerik: Kiralama fiyatları, dahil olanlar, nereden alınır, güzergâhlar
- Schema: `FAQPage`, `LocalBusiness` + fiyatlar

**Makale 2 (Bölgedeki Fransızca konuşanlar):**

- Başlık: `Louer un vélo à Lünen — Guide pour les francophones de la Ruhr`
- Slug: `/fr/guide/louer-velo-luenen-francophones`
- Hedef keywords: "location vélo Lünen", "magasin vélo francophone Ruhr"
- İçerik: Dortmund/Unna/Hamm'dan nasıl ulaşılır, Fransızca hizmet, tavsiyeler

**Makale 3 (Ruhr güzergâhları):**

- Başlık: `À vélo autour de Lünen — Itinéraires de la région de la Ruhr`
- Slug: `/fr/guide/velo-luenen-itineraires-ruhr`
- Hedef keywords: "vélo Ruhr itinéraire", "itinéraire vélo Lünen"
- İçerik: Ruhr bölgesi bisiklet güzergâhları (Römer-Lippe-Route, Seseke-Weg, RadrevierRuhr), Lünen'den ne gerekli, kiralama

\*\*Makale 4 (Satın alma):

- Başlık: `Acheter un vélo à Lünen — Guide 2026 pour les francophones`
- Slug: `/fr/guide/acheter-velo-luenen`
- Hedef keywords: "acheter vélo Lünen", "vélo occasion Lünen"

### 3.2 — FR Ana Sayfa ve Meta İyileştirmeleri

**Mevcut FR `metaTitle`:**

> `Acheter & louer un vélo à Lünen | Karaarslan Bike`

✅ İyi — değiştirme.

**Önerilen FR `metaDescription`:**

> `Achetez ou louez un vélo à Lünen ✓ 100+ vélos certifiés ✓ Ville, Trekking, VAE ✓ Location dès 6,80 €/jour ✓ 3 mois de garantie. Votre magasin de vélos à Lünen, dans la Ruhr.`

**Mevcut FR `heroSub`:**

> (Henüz görülmedi — kontrol et)

**Önerilen FR `heroSub` (anahtar kelime zenginleştirilmiş):**

> "Achetez ou louez votre vélo à Lünen ✓ Vélos inspectés dès 80 € ✓ Location dès 6,80 €/jour ✓ Retrait immédiat ✓ Service en français dans la Ruhr."

---

## 🛠️ AŞAMA 4: Teknik Uygulamalar

### 4.1 — `blog.data.ts`'e `slugTranslations` Ekle

```typescript
export interface BlogArticle {
  slug: string;
  slugTranslations?: Partial<Record<Language, string>>;
  // ...
}
```

`ratgeber-detail.component.ts`'de slug yönetimi:

```typescript
// Mevcut dilden doğru slug'ı al
const currentSlug = article.slugTranslations?.[lang] ?? article.slug;
```

### 4.2 — `app.routes.ts`'e EN/FR/TR Route Alias'ları Ekle

```typescript
// Her dil için guide route'u
{ path: 'guide', loadComponent: () => import('./pages/ratgeber/ratgeber.component')... },
{ path: 'guide/:slug', loadComponent: () => import('./pages/ratgeber-detail/ratgeber-detail.component')... },
```

`ratgeber-detail.component.ts` slug resolver'ında dil kontrolü yap.

### 4.3 — Sitemap'e EN/FR Blog URL'leri Ekle

```xml
<!-- EN Blog Articles (EN slugs) -->
<url>
  <loc>https://karaarslan-bike.de/en/guide/buying-used-bike-luenen-tips</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://karaarslan-bike.de/en/guide/buying-used-bike-luenen-tips"/>
  <xhtml:link rel="alternate" hreflang="de" href="https://karaarslan-bike.de/de/ratgeber/gebrauchtes-fahrrad-kaufen-tipps"/>
  <xhtml:link rel="alternate" hreflang="fr" href="https://karaarslan-bike.de/fr/guide/acheter-velo-occasion-luenen"/>
  <lastmod>2026-04-12</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 4.4 — 301 Yönlendirmeler (Eski → Yeni URL)

Nginx'e eklenecek yönlendirmeler:

```nginx
# Eski Almanca slug'lu EN/FR blog URL'leri → yeni İngilizce/Fransızca sluglar
location = /en/ratgeber/gebrauchtes-fahrrad-kaufen-tipps {
  return 301 /en/guide/buying-used-bike-luenen-tips;
}
location = /fr/ratgeber/gebrauchtes-fahrrad-kaufen-tipps {
  return 301 /fr/guide/acheter-velo-occasion-luenen;
}
# ... diğer makaleler için aynı şekilde
```

### 4.5 — Schema.org'u EN/FR İçin Güçlendir

Her EN ve FR sayfasında `LocalBusiness` schema'sına `availableLanguage` ekle:

```json
{
  "@type": "BikeStore",
  "name": "Karaarslan Bike",
  "availableLanguage": ["German", "English", "French", "Turkish"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Alstedder Straße 5",
    "addressLocality": "Lünen",
    "postalCode": "44534",
    "addressCountry": "DE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.6236,
    "longitude": 7.5130
  }
}
```

---

## 📝 AŞAMA 5: İçerik Üretim Planı

### Öncelik Sırası (Etki/Efora Göre)

| #   | İçerik                         | Dil | URL                                       | Hedef Keyword             | Hafta   |
| --- | ------------------------------ | --- | ----------------------------------------- | ------------------------- | ------- |
| 1   | Bike Rental Lünen Guide        | EN  | `/en/guide/bike-rental-luenen`            | bike rental lünen         | Hafta 1 |
| 2   | Location vélo Lünen            | FR  | `/fr/guide/location-velo-luenen`          | location vélo Lünen       | Hafta 1 |
| 3   | Buy Used Bike Lünen (Expat)    | EN  | `/en/guide/buy-used-bike-luenen`          | used bike lünen           | Hafta 2 |
| 4   | Acheter vélo Lünen             | FR  | `/fr/guide/acheter-velo-luenen`           | acheter vélo Lünen        | Hafta 2 |
| 5   | Cycling Around Lünen Routes    | EN  | `/en/guide/cycling-luenen`                | cycling in the ruhr area  | Hafta 3 |
| 6   | Vélo autour de Lünen (Ruhr)    | FR  | `/fr/guide/velo-luenen-itineraires-ruhr`  | vélo Ruhr itinéraire      | Hafta 3 |
| 7   | Used E-Bike Guide              | EN  | `/en/guide/used-e-bike-buying-guide`      | used e-bike lünen         | Hafta 4 |
| 8   | Louer vélo Lünen (francophones)| FR  | `/fr/guide/louer-velo-luenen-francophones`| location vélo Lünen       | Hafta 4 |

### Makale İçerik Standartları

Her EN/FR makale şunları içermeli:

- **Min. 800 kelime** (ideal 1200-1500)
- **H1, H2, H3** başlık hiyerarşisi
- **FAQ bölümü** (en az 3 soru-cevap) → `FAQPage` schema
- **İç link**: Showroom, kiralama, iletişim sayfalarına
- **CTA** (Call to Action): WhatsApp butonu veya rezervasyon linki
- **Yerel bilgi**: Alstedder Straße 5, Lünen
- **Hedef keyword** başlıkta, ilk paragrafta ve meta'da

---

## 🔗 AŞAMA 6: Backlink & Otorite Oluşturma

### EN için Backlink Kaynakları

1. **Expat/Student Fora:**
   - ExpatForum.com (Germany section)
   - Reddit: r/germany, r/dortmund, r/Ruhrgebiet, r/expats
   - Internations Dortmund/Ruhr group

2. **Yerel/Ziyaretçi Siteleri:**
   - TripAdvisor Lünen/Dortmund listelemeleri
   - Stadt Lünen turizm/ziyaretçi sayfaları
   - Hostel ve Airbnb community foraları (Dortmund/Ruhr)

3. **Bisiklet Siteleri:**
   - Cycling Europe route sites
   - RadrevierRuhr & Römer-Lippe-Route — Karaarslan Bike kiralama noktası olarak eklet

### FR için Backlink Kaynakları

1. **Almanya'daki Fransızca Topluluklar:**
   - lepetitjournal.com (Allemagne / Düsseldorf-Cologne baskısı)
   - connexion-emploi.com (Fransız-Alman iş/yaşam portalı)
   - Institut français NRW (Düsseldorf/Köln) etkinlik ve dizinleri

2. **FR Bisiklet Foraları:**
   - Velo101.com
   - Cyclotourisme France foraları
   - Reddit: r/velo

3. **Expat & Francophone Dizinleri:**
   - Fransızca konuşan expat Facebook grupları (Ruhr/NRW)
   - francophones-allemagne dizinleri ve toplulukları

4. **Yerel/Bölgesel Medya:**
   - Ruhr bölgesi yerel haber siteleri (Lünen/Dortmund)
   - Çok dilli işletme dizinleri (FR profil seçeneği olanlar)

---

## 📊 AŞAMA 7: Ölçüm & Takip

### Google Search Console Kurulumu

1. **Property ekle:** `karaarslan-bike.de`
2. **Performance > Countries:** DE, FR, GB, US, AT, CH filtreleri ekle
3. **Queries filtresi:** EN için "bike", "bicycle", "rental" — FR için "vélo", "location", "acheter"
4. **Haftalık kontrol:** Hangi EN/FR aramalar tıklama getiriyor?

### KPI'lar (3 Aylık Hedefler)

| Metrik                            | Mevcut | Hedef (3 ay) |
| --------------------------------- | ------ | ------------ |
| EN organik tıklama/ay             | ~0-50  | 300+         |
| FR organik tıklama/ay             | ~0-30  | 150+         |
| "bike rental lünen" sıralama      | 20+    | 5-10         |
| "location vélo Lünen" sıralama    | 20+    | 3-7          |
| EN sayfa sayısı indexlenen        | 10     | 20+          |
| FR sayfa sayısı indexlenen        | 10     | 20+          |

---

## ⚡ Hızlı Kazanç Listesi (Bu Hafta Yapılabilecekler)

1. **[ ] FR `heroSub` metni güncelle** → Ruhr'da Fransızca hizmeti vurgula ("Service en français dans la Ruhr")
2. **[ ] EN `heroSub` metni güncelle** → "bike rental lünen" kelimesini dahil et
3. **[ ] EN FAQ'ya 5 yeni soru-cevap ekle** → "bike rental lünen" odaklı
4. **[ ] FR FAQ'ya 5 yeni soru-cevap ekle** → "location vélo lünen" odaklı
5. **[ ] Sitemap'i güncelle** → Tüm EN/FR blog URL'lerini doğru slug'larla ekle
6. **[ ] `blog.data.ts`'e `slugTranslations` ekle** → EN/FR slug'larını tanımla
7. **[ ] `app.routes.ts`'e `/guide/` route ekle** → EN/FR için İngilizce URL prefix
8. **[ ] İlk EN blog makalesi yaz:** "Bike Rental in Lünen — Guide 2026"
9. **[ ] İlk FR blog makalesi yaz:** "Location de vélos à Lünen — Guide complet"
10. **[ ] Google Search Console'a sitemap gönder** → Yeni URL'lerin indexlenmesini hızlandır

---

## 🗓️ Zaman Çizelgesi

| Hafta       | Görevler                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------- |
| **Hafta 1** | URL düzeltmeleri (slugTranslations + guide route) + 2 blog makalesi (EN kiralama + FR kiralama) |
| **Hafta 2** | 2 blog makalesi (EN expat + FR achat) + FAQ güncellemeleri + sitemap                            |
| **Hafta 3** | 2 blog makalesi (EN cycling Ruhr + FR Ruhr itinéraires) + Schema.org güncellemeleri             |
| **Hafta 4** | 2 blog makalesi + Backlink outreach başlangıcı                                                  |
| **Ay 2**    | GSC analizi + içerik optimizasyonu + yeni makaleler                                             |
| **Ay 3**    | Backlink kampanyası + performans değerlendirme                                                  |

---

## 💡 Ekstra: Google Business Profile (Çok Kritik)

Google Business Profile'ına **EN ve FR dil desteği** ekle:

1. Google Business Profile'ı aç
2. "Add language" → English ve French ekle
3. Her dilde ayrı **Business Description** yaz:
   - EN: "Bike shop in Lünen — buy, sell & rent bicycles. City bikes, trekking, e-bikes. From €6.80/day rental. 3-month warranty on used bikes."
   - FR: "Magasin de vélos à Lünen — achat, vente & location. Vélos de ville, VTT, VAE. Location dès 6,80 €/jour. Service en français dans la Ruhr."
4. **Google Posts** yaz (haftada 1) — EN ve FR'de

Google Business Profile EN/FR ziyaretçilerine doğrudan ulaşmanın en hızlı yoludur.
