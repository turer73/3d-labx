# Claude Code Project Instructions

## Proje: 3D-labX Tech Portal

Bu proje için Claude Code'a tam yetki verilmiştir.

## Yetkiler

- Tüm dosyaları okuma/yazma/düzenleme
- Tüm bash komutlarını çalıştırma
- Wrangler deploy işlemleri
- Git işlemleri
- npm/pnpm komutları
- API ve Frontend değişiklikleri

## Proje Yapısı

```
C:\3dlabx\
├── tech-portal-api/     # Cloudflare Workers API
│   ├── src/index.js     # Ana API kodu
│   └── wrangler.json    # Cloudflare config
├── tech-portal-frontend/ # Astro SSR Frontend
│   └── src/
├── scripts/             # Deploy ve backup scriptleri
│   ├── deploy-frontend.sh
│   ├── deploy-api.sh
│   ├── deploy-all.sh
│   └── auto-backup.sh
└── .claude-session.json  # Oturum durumu
```

## Önemli Bilgiler

- **API URL:** https://tech-portal-api.turgut-d01.workers.dev
- **Frontend URL:** https://3d-labx.com
- **R2 Public URL:** https://pub-9142f11355e84e1da1dd96a4c14e4afb.r2.dev
- **Admin Secret:** Tur04520,
- **D1 Database ID:** f9456434-6c54-43a2-8374-d7695a51626f
- **GitHub Repo:** https://github.com/turer73/3d-labx

## Devam Etme Talimatı

Yeni oturum başladığında:
1. Bu dosyayı oku
2. `.claude-session.json` dosyasını kontrol et
3. Bekleyen görevleri tamamla
4. Kullanıcıya kısa özet ver

## İzin Verilen Komutlar

Aşağıdaki komutlar onay olmadan çalıştırılabilir:
- `npx wrangler deploy`
- `npm install`, `npm run build`
- `git add`, `git commit`, `git push`
- Dosya okuma/yazma/düzenleme
- API testleri (curl/fetch)

## Deploy Scriptleri

Her deploy sonrası otomatik git backup yapılır:

```bash
# Sadece Frontend deploy
./scripts/deploy-frontend.sh "Commit mesajı"

# Sadece API deploy
./scripts/deploy-api.sh "Commit mesajı"

# Her ikisini birden deploy
./scripts/deploy-all.sh "Commit mesajı"

# Manuel backup
./scripts/auto-backup.sh
```

**ÖNEMLİ:** Her değişiklik sonrası backup alınmalı!
