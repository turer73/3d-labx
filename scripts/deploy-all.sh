#!/bin/bash
# Deploy both API and Frontend with automatic backup
# Usage: ./scripts/deploy-all.sh [commit message]

set -e

TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
MESSAGE="${1:-Full deploy: $TIMESTAMP}"

echo "========================================"
echo "Starting full deployment..."
echo "========================================"

# Deploy API
echo ""
echo "[1/3] Deploying API..."
cd "C:/3dlabx/tech-portal-api"
npx wrangler deploy

# Build and Deploy Frontend
echo ""
echo "[2/3] Building and deploying frontend..."
cd "C:/3dlabx/tech-portal-frontend"
npm run build
npx wrangler pages deploy dist --project-name=tech-portal

# Auto backup
echo ""
echo "[3/3] Creating backup..."
cd "C:/3dlabx"

if ! git diff --quiet || ! git diff --staged --quiet; then
    git add -u
    git commit -m "$MESSAGE

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
    echo "Backup created!"
else
    echo "No changes to backup"
fi

echo ""
echo "========================================"
echo "Full deployment complete!"
echo "========================================"
echo "API: https://tech-portal-api.turgut-d01.workers.dev"
echo "Frontend: https://3d-labx.com"
echo "========================================"
