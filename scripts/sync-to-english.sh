#!/bin/bash
# sync-to-english.sh
# Türkçe sitedeki değişiklikleri İngilizce siteye senkronize eder
# Kullanım: ./scripts/sync-to-english.sh [commit mesajı]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
TR_SITE="$ROOT_DIR/tech-portal-frontend"
EN_SITE="$ROOT_DIR/tech-portal-frontend-en"

echo "🔄 Türkçe → İngilizce Site Senkronizasyonu"
echo "=========================================="

# 1. Senkronize edilecek dosyaları kopyala (özel dosyalar hariç)
echo ""
echo "📁 Dosyalar kopyalanıyor..."

# Components (Header hariç - özel çeviri var)
rsync -av --exclude="Header.astro" "$TR_SITE/src/components/" "$EN_SITE/src/components/"

# Layouts (BaseLayout hariç - özel çeviri var)
rsync -av --exclude="BaseLayout.astro" "$TR_SITE/src/layouts/" "$EN_SITE/src/layouts/"

# Styles
rsync -av "$TR_SITE/src/styles/" "$EN_SITE/src/styles/"

# Public assets
rsync -av "$TR_SITE/public/" "$EN_SITE/public/"

# 2. Yeni sayfaları kontrol et ve kopyala
echo ""
echo "📄 Yeni sayfalar kontrol ediliyor..."

# Türkçe URL -> İngilizce URL mapping
declare -A URL_MAP=(
    ["3d-baski"]="3d-printing"
    ["rehberler"]="guides"
    ["sorun-cozumleri"]="troubleshooting"
    ["incelemeler"]="reviews"
    ["topluluk"]="community"
    ["filamentler"]="filaments"
    ["iletisim"]="contact"
    ["hakkimizda"]="about"
    ["gizlilik"]="privacy"
    ["profil"]="profile"
    ["auth/giris"]="auth/login"
    ["auth/kayit"]="auth/register"
)

# Yeni dosyaları listele (son 24 saat içinde değişen)
NEW_FILES=$(find "$TR_SITE/src/pages" -type f -name "*.astro" -mtime -1 2>/dev/null || true)

if [ -n "$NEW_FILES" ]; then
    echo "Yeni/değişen dosyalar bulundu:"
    echo "$NEW_FILES"
    echo ""
    echo "⚠️  Bu dosyaları manuel olarak İngilizce siteye eklemeniz gerekebilir."
fi

# 3. Build İngilizce site
echo ""
echo "🔨 İngilizce site build ediliyor..."
cd "$EN_SITE"
npm run build

# 4. Deploy
echo ""
echo "🚀 İngilizce site deploy ediliyor..."
npx wrangler pages deploy dist --project-name=tech-portal-frontend-en --commit-dirty=true

# 5. Git commit (opsiyonel)
COMMIT_MSG="${1:-Sync from Turkish site}"
echo ""
echo "📝 Git commit: $COMMIT_MSG"
cd "$ROOT_DIR"
git add tech-portal-frontend-en/
git commit -m "$COMMIT_MSG" || echo "Commit için değişiklik yok"

echo ""
echo "✅ Senkronizasyon tamamlandı!"
echo "🌐 İngilizce site: https://en.3d-labx.com"
