# Karaarslan Bike Projesi — İlerleme Takibi

Bu dosya, BikeHaus Freiburg projesinin Karaarslan Bike firması için uyarlanma sürecini adım adım kaydeder.
Kaldığın yerden devam etmek için bu dosyayı oku.

---

## Durum: � Production'da Canlı — Mail Sunucusu Aktif

### Bilinen Bilgiler

| Bilgi     | Değer              |
| --------- | ------------------ |
| Firma adı | Karaarslan Bike    |
| Domain    | karaarslan-bike.de |

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
  - Tüm "Bike Haus Freiburg" → "Karaaslan Bisiklet" → "Karaarslan Bike" olarak değiştirildi
  - WhatsApp, Instagram, Facebook linkleri → [PLACEHOLDER] yapıldı
  - Adres, şehir bilgileri → [PLACEHOLDER] yapıldı

### Adım 4b — Firma Adı & Domain Güncelleme (2026-05-04)

- Tüm "Karaaslan Bisiklet" → "Karaarslan Bike" (36 dosya)
- Tüm `[DOMAIN]` → `karaarslan-bike.de` (36 dosya)
- JWT Issuer/Audience, DB adı, Nginx, Docker Compose dahil

### Adım 5 — HTML Meta & Schema

- `BikeHaus.Homepage/src/index.html` güncellendi
  - title, meta description, meta keywords güncellendi
  - schema.org LocalBusiness verisi güncellendi
  - DNS prefetch URL'leri → [PLACEHOLDER] yapıldı

### Adım 6 — Docker Compose

- `docker-compose.yml` güncellendi: domain, servis adları

### Adım 7 — Nginx Config

- `nginx/nginx.conf` güncellendi: server_name direktifleri
- `mail.karaarslan-bike.de` reverse proxy bloğu eklendi (SOGo WebObjects header'ları dahil)

### Adım 8 — Sunucu & Docker Deploy (2026-05-04/05)

- VPS: Netcup, IP `152.53.250.199`, Ubuntu 22.04
- GitHub repo: `oeztuerkhamza/karaarslan-bike` (master branch)
- `/opt/karaarslan/` → symlink `/opt/bikehaus/`
- `docker compose up -d` ile tüm servisler ayağa kalktı
- SSL: Let's Encrypt (certbot Docker), tüm subdomain'ler dahil (karaarslan-bike.de, www, admin, api, mail)
- Servisler: `karaaslan-app` (API), `karaaslan-client` (admin SPA), `karaaslan-homepage` (SSR), `karaaslan-nginx`

### Adım 9 — Mailcow Mail Sunucusu (2026-05-05)

- Mailcow `/opt/mailcow/` dizinine kuruldu (18 container, hepsi Up)
- `mailcow.conf` manuel oluşturuldu (generate_config.sh dondu)
- SSL sertifikası: `mail.karaarslan-bike.de` için certbot `--expand` ile yenilendi
- `dhparams.pem` oluşturuldu
- `HTTPS_BIND=0.0.0.0`, `HTTP_PORT=8080`, `HTTPS_PORT=8444`
- Mailbox'lar: `no-reply@karaarslan-bike.de`, `info@karaarslan-bike.de`
- DNS: MX, SPF, DKIM, DMARC, PTR (IPv4+IPv6) kayıtları eklendi ve doğrulandı
- SMTP 587/STARTTLS test edildi (swaks ile)
- Uygulama `.env` SMTP ayarları güncellendi
- SOGo webmail login sonrası "Unauthorized" düzeltildi (x-webobjects-\* header'ları eklendi)
- Günlük SSL yenileme cron: `/etc/cron.d/certbot-mailcow` → `/opt/renew-certs.sh`

---

## ⏳ Bekleyen / Yapılabilecek Adımlar

### Adım 10 — Logo & Görseller (❗ Henüz Yapılmadı)

Değiştirilecek dosyalar:

- `BikeHaus.Homepage/src/assets/logo.svg`
- `BikeHaus.Homepage/src/assets/logo.png`
- `BikeHaus.Homepage/src/assets/logo.webp`
- `BikeHaus.Homepage/src/assets/og-image.jpg` (1200×630px)
- `BikeHaus.Client/src/assets/logo.svg`
- `BikeHaus.Homepage/src/assets/shop/` (7 adet dükkân fotoğrafı)

### Adım 11 — Gerçek Firma Bilgilerini Doldur (❗ Kısmen Eksik)

Aşağıdaki bilgiler hâlâ placeholder:

| Bilgi            | Placeholder          | Doldurulacak Dosyalar                                 |
| ---------------- | -------------------- | ----------------------------------------------------- |
| Adres            | `[ADRES]`            | translation.service.ts, home.component.ts, index.html |
| Telefon/WhatsApp | `[TELEFON]`          | translation.service.ts                                |
| Instagram URL    | `[INSTAGRAM_URL]`    | translation.service.ts                                |
| Facebook URL     | `[FACEBOOK_URL]`     | translation.service.ts                                |
| Google Places ID | `[GOOGLE_PLACES_ID]` | appsettings.json                                      |
| Çalışma saatleri | `[CALISMA_SAATLERI]` | index.html (schema.org), translation.service.ts       |

### Adım 12 — Test (❗ Yapılacak)

- [ ] Kiralama formu → e-posta bildirimi geliyor mu? (SMTP entegrasyonu test)
- [ ] SOGo webmail → gelen/giden mail testi (Gmail'e gönder, spam değil mi?)
- [ ] Mailcow restart sonrası container'lar otomatik başlıyor mu? (reboot testi)
- [ ] SSL yenileme cron testi (`bash /opt/renew-certs.sh` çalışıyor mu?)

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
