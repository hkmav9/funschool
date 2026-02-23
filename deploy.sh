#!/bin/bash
set -e

# ── FunSchool Deploy Script ──────────────────────────────────────────
# Usage:  ./deploy.sh "your commit message"
# Does:   1) Bump SW cache version
#         2) git add + commit + push to GitHub
#         3) firebase deploy

COMMIT_MSG="${1:-"chore: deploy update"}"
SW_FILE="sw.js"

# 1. Bump service worker cache version
CURRENT=$(grep -o 'funschool-v[0-9]*' "$SW_FILE" | grep -o '[0-9]*$')
NEXT=$((CURRENT + 1))
sed -i '' "s/funschool-v${CURRENT}/funschool-v${NEXT}/" "$SW_FILE"
echo "✔  SW cache bumped: funschool-v${CURRENT} → funschool-v${NEXT}"

# 2. Commit & push to GitHub
git add -A
git commit -m "$COMMIT_MSG"
git push origin main
echo "✔  Pushed to GitHub"

# 3. Deploy to Firebase
~/.npm-global/bin/firebase deploy
echo "✔  Deployed to https://funschool-app.web.app"
