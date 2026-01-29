# 3D-labX Deployment Rehberi

Bu rehber, 3D-labX projesini Cloudflare'e deploy etmek için gerekli adımları içerir.

## Ön Gereksinimler

1. [Cloudflare hesabı](https://dash.cloudflare.com/sign-up)
2. [Node.js 18+](https://nodejs.org/)
3. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
4. [Google Gemini API Key](https://makersuite.google.com/app/apikey)

## 1. Backend API Deployment

### 1.1 Wrangler'a Giriş

```bash
cd tech-portal-api
npx wrangler login
```

### 1.2 D1 Veritabanı Oluşturma

```bash
# Veritabanı oluştur
npx wrangler d1 create tech-portal-db

# Çıktıdaki database_id'yi kopyala ve wrangler.json'a yapıştır
```

`wrangler.json` dosyasındaki `YOUR_DATABASE_ID_HERE` kısmını gerçek database_id ile değiştirin.

### 1.3 Veritabanı Şemasını Uygulama

```bash
# Şemayı uygula
npx wrangler d1 execute tech-portal-db --file=./schema.sql
```

### 1.4 Secrets Ayarlama

```bash
# Gemini API Key
npx wrangler secret put GEMINI_API_KEY
# İstendiğinde API key'inizi yapıştırın

# Admin Secret (güçlü bir rastgele string)
npx wrangler secret put ADMIN_SECRET
# Örnek: openssl rand -hex 32 ile oluşturabilirsiniz
```

### 1.5 Deploy

```bash
npx wrangler deploy
```

Deploy sonrası URL'inizi not edin (örn: `https://tech-portal-api.YOUR-SUBDOMAIN.workers.dev`)

## 2. Frontend Deployment

### 2.1 API URL Güncelleme

`src/lib/api.ts` dosyasındaki API URL'ini güncelleyin:

```typescript
return "https://tech-portal-api.YOUR-SUBDOMAIN.workers.dev";
```

### 2.2 Cloudflare Pages Projesi Oluşturma

1. [Cloudflare Dashboard](https://dash.cloudflare.com) > Workers & Pages > Create application > Pages
2. Git repository'nizi bağlayın veya Direct Upload seçin
3. Build ayarları:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `tech-portal-frontend`

### 2.3 Environment Variables

Pages projesinde şu environment variables'ları ekleyin:

| Variable | Açıklama |
|----------|----------|
| `ADMIN_SECRET` | API ile aynı secret (Worker'da ayarladığınız) |
| `ADMIN_PASSWORD` | Admin paneli şifresi |

### 2.4 Custom Domain (Opsiyonel)

1. Pages projesinde "Custom domains" sekmesi
2. Domain ekleyin (örn: 3d-labx.com)
3. DNS ayarlarını yapın

## 3. Doğrulama

### API Test

```bash
# Health check
curl https://tech-portal-api.YOUR-SUBDOMAIN.workers.dev/api/health

# Posts listesi (boş dönecek)
curl https://tech-portal-api.YOUR-SUBDOMAIN.workers.dev/api/posts
```

### Admin Panel

1. `https://YOUR-PAGES-URL/admin/posts` adresine gidin
2. Kullanıcı adı: herhangi bir değer
3. Şifre: `ADMIN_PASSWORD` olarak ayarladığınız değer

## 4. Cron Job

Cron job otomatik olarak her 6 saatte bir çalışır ve RSS kaynaklarından içerik çeker.

Manuel tetikleme:
```bash
npx wrangler d1 execute tech-portal-db --command="SELECT * FROM posts LIMIT 5"
```

## 5. Sorun Giderme

### CORS Hataları

API'de CORS headers zaten ekli. Eğer hata alıyorsanız:
1. Browser cache'i temizleyin
2. API URL'inin doğru olduğundan emin olun

### 403 Forbidden (Admin)

- `ADMIN_SECRET` değerlerinin API ve Frontend'de aynı olduğundan emin olun
- Secrets'ı yeniden deploy edin: `npx wrangler deploy`

### Veritabanı Hataları

```bash
# Veritabanını kontrol et
npx wrangler d1 execute tech-portal-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

## 6. Güncelleme

### API Güncelleme
```bash
cd tech-portal-api
npx wrangler deploy
```

### Frontend Güncelleme
Git push yapın veya Dashboard'dan manuel deploy edin.

---

## Yerel Geliştirme

### API
```bash
cd tech-portal-api
cp .dev.vars.example .dev.vars  # Değerleri doldurun
npm run dev
```

### Frontend
```bash
cd tech-portal-frontend
cp .dev.vars.example .dev.vars  # Değerleri doldurun
npm run dev
```
