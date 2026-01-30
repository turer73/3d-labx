#!/bin/bash
# Deploy API with automatic backup
# Usage: ./scripts/deploy-api.sh [commit message]

set -e

cd "C:/3dlabx/tech-portal-api"

echo "Deploying API to Cloudflare Workers..."
npx wrangler deploy

cd "C:/3dlabx"

# Auto backup if there are changes
if ! git diff --quiet || ! git diff --staged --quiet; then
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
    MESSAGE="${1:-Auto backup after API deploy: $TIMESTAMP}"

    git add -u
    git commit -m "$MESSAGE

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

    echo "Backup created: $MESSAGE"
else
    echo "No changes to backup"
fi

echo "API Deploy complete!"
