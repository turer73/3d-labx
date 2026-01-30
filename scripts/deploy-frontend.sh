#!/bin/bash
# Deploy frontend with automatic backup
# Usage: ./scripts/deploy-frontend.sh [commit message]

set -e

cd "C:/3dlabx/tech-portal-frontend"

echo "Building frontend..."
npm run build

echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=tech-portal

cd "C:/3dlabx"

# Auto backup if there are changes
if ! git diff --quiet || ! git diff --staged --quiet; then
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
    MESSAGE="${1:-Auto backup after deploy: $TIMESTAMP}"

    git add -u
    git commit -m "$MESSAGE

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

    echo "Backup created: $MESSAGE"
else
    echo "No changes to backup"
fi

echo "Deploy complete!"
