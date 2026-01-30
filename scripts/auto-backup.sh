#!/bin/bash
# Auto backup script for 3D-labX
# Runs after each deploy to create automatic git commits

cd "C:/3dlabx"

# Get current timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M")

# Check if there are changes
if git diff --quiet && git diff --staged --quiet; then
    echo "No changes to backup"
    exit 0
fi

# Add all tracked files
git add -u

# Create commit with timestamp
git commit -m "Auto backup: $TIMESTAMP

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

echo "Backup complete: $TIMESTAMP"
