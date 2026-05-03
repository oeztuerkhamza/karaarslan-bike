# Karaaslan Projesi — İlerleme Takibi

Bu dosya, BikeHaus Freiburg projesinin Karaaslan firması için uyarlanma sürecini adım adım kaydeder.
Kaldığın yerden devam etmek için bu dosyayı oku.

---

## Durum: 🟡 Kod Değişiklikleri Tamamlandı — Firma Bilgileri Bekleniyor

---

## ✅ Tamamlanan Adımlar

### Adım 1 — Proje Kopyalama
- `d:\projects\bikehausfreiburg` → `d:\projects\Karaaslan` olarak kopyalandı
- node_modules, .git, dist, veritabanı dosyaları hariç tutuldu

### Adım 2 — SEO: Lünen & Çevresi
- `index.html` güncellendi: geo bölge `DE-NW`, koordinatlar `51.6167, 7.5167`, `addressRegion: Nordrhein-Westfalen`
- `areaServed` schema: Freiburg çevresi → Dortmund, Werne, Selm, Bergkamen, Kamen, Castrop-Rauxel, Hamm, Unna, Schwerte, Herne, Kreis Unna
- Keywords: Lünen çevresindeki ilçelerle güncellendi
- `translation.service.ts`: tüm "im Breisgau" → "im Ruhrgebiet", Fransızca/İngilizce şehir adları düzeltildi
- `home.component.ts`: JSON-LD koordinatlar ve areaServed güncellendi

### Adım 3 — Backend Konfigürasyon (appsettings.json)
- `BikeHaus.API/appsettings.json` güncellendi: JWT Issuer/Audience, DB adı, firma adı
- `BikeHaus.API/appsettings.Production.json` güncellendi: SMTP, firma adı

### Adım 3 — Frontend Ortam Dosyaları
- `BikeHaus.Homepage/src/environments/environment.prod.ts` → domain placeholder güncellendi
- `BikeHaus.Client/src/environments/environment.prod.ts` → domain placeholder güncellendi

### Adım 4 — Çeviri Servisi (Homepage)
- `BikeHaus.Homepage/src/app/services/translation.service.ts` güncellendi
  - Tüm "Bike Haus Freiburg" → "Karaaslan Bisiklet" olarak değiştirildi
  - WhatsApp, Instagram, Facebook linkleri → [PLACEHOLDER] yapıldı
  - Adres, şehir bilgileri → [PLACEHOLDER] yapıldı

### Adım 5 — HTML Meta & Schema
- `BikeHaus.Homepage/src/index.html` güncellendi
  - title, meta description, meta keywords güncellendi
  - schema.org LocalBusiness verisi güncellendi
  - DNS prefetch URL'leri → [PLACEHOLDER] yapıldı

### Adım 6 — Docker Compose
- `docker-compose.yml` güncellendi: domain, servis adları

### Adım 7 — Nginx Config
- `nginx/nginx.conf` güncellendi: server_name direktifleri

---

## ⏳ Bekleyen Adımlar (Bilgi Gelince Yapılacak)

### Adım 8 — Logo & Görseller (❗ Bilgi Gerekli)
Değiştirilecek dosyalar:
- `BikeHaus.Homepage/src/assets/logo.svg`
- `BikeHaus.Homepage/src/assets/logo.png`
- `BikeHaus.Homepage/src/assets/logo.webp`
- `BikeHaus.Homepage/src/assets/og-image.jpg` (1200×630px)
- `BikeHaus.Client/src/assets/logo.svg`
- `BikeHaus.Homepage/src/assets/shop/` (7 adet dükkân fotoğrafı)

### Adım 9 — Gerçek Firma Bilgilerini Doldur (❗ Bilgi Gerekli)
Aşağıdaki bilgiler placeholder olarak bırakıldı, doldurulması gerekiyor:

| Bilgi | Placeholder | Doldurulacak Dosyalar |
|-------|-------------|----------------------|
| Domain adı | `[DOMAIN]` | docker-compose.yml, nginx.conf, environment.prod.ts, index.html |
| Adres | `[ADRES]` | translation.service.ts, home.component.ts, index.html |
| Telefon/WhatsApp | `[TELEFON]` | translation.service.ts |
| E-posta | `[EMAIL]` | appsettings.json, appsettings.Production.json |
| Instagram URL | `[INSTAGRAM_URL]` | translation.service.ts |
| Facebook URL | `[FACEBOOK_URL]` | translation.service.ts |
| Google Places ID | `[GOOGLE_PLACES_ID]` | appsettings.json |
| SMTP Host | `[SMTP_HOST]` | appsettings.Production.json |
| Çalışma saatleri | `[CALISMA_SAATLERI]` | index.html (schema.org), translation.service.ts |

### Adım 10 — Git Repo Kurulumu (❗ Sunucu Gerekli)
```bash
cd d:\projects\Karaaslan
git init
git remote add origin https://github.com/[KULLANICI]/karaaslan-bisiklet
git add .
git commit -m "feat: initial Karaaslan setup from BikeHaus template"
git push -u origin main
```

### Adım 11 — Sunucu Kurulumu (❗ VPS Gerekli)
- VPS al (Ubuntu 22.04 önerilir)
- Docker & Docker Compose kur
- DNS kayıtlarını ekle (A records: domain + admin + api + mail)
- `.env` dosyasını oluştur (JWT secret, Google API keys, SMTP password)
- `docker compose up -d --build` ile ilk deploy

### Adım 12 — Test
- [ ] `https://[DOMAIN]` → homepage yüklüyor mu?
- [ ] `https://admin.[DOMAIN]` → admin paneli açılıyor mu?
- [ ] Admin girişi → bisiklet ekle → homepage'de görünüyor mu?
- [ ] Kiralama formu → e-posta bildirimi geliyor mu?
- [ ] SSL sertifikası geçerli mi?

---

## Placeholder Referansı

Aşağıdaki placeholder'lar kodun içine yazıldı, tek tek arama-değiştirme ile güncellenebilir:

```
[DOMAIN]          → Firma domaini (örn. karaaslanbisiklet.com)
[FIRMA_ADI]       → Kısa firma adı (örn. Karaaslan Bisiklet)
[ADRES]           → Tam sokak adresi
[SEHIR]           → Şehir adı
[PLZ]             → Posta kodu
[TELEFON]         → Telefon numarası
[EMAIL]           → İletişim e-postası
[INSTAGRAM_URL]   → Instagram profil linki
[FACEBOOK_URL]    → Facebook profil linki
[WA_NUMARA]       → WhatsApp numarası (uluslararası format, örn. 4915566300011)
[GOOGLE_PLACES_ID]→ Google Places API Place ID
[LAT]             → Enlem koordinatı
[LNG]             → Boylam koordinatı
[SMTP_HOST]       → E-posta sunucusu adresi
```
