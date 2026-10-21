#!/bin/bash
set -e

# ── FunSchool Deploy Script ──────────────────────────────────────────
# Usage:  ./deploy.sh ["commit message"]
# Does:   1) Bump SW cache version
#         2) git add + commit (skipped if nothing changed)
#         3) git push to GitHub  (non-fatal: a failed push never blocks the deploy)
#         4) firebase deploy
# Non-interactive, so it is safe to run from Claude Code.

cd "$(dirname "$0")"

COMMIT_MSG="${1:-"chore: deploy update"}"
SW_FILE="sw.js"

# Locate the firebase CLI
if command -v firebase >/dev/null 2>&1; then
    FIREBASE="$(command -v firebase)"
elif [ -x "$HOME/.npm-global/bin/firebase" ]; then
    FIREBASE="$HOME/.npm-global/bin/firebase"
else
    echo "✘  firebase CLI not found (npm i -g firebase-tools)"; exit 1
fi

# 1. Bump service worker cache version
CURRENT=$(grep -o 'funschool-v[0-9]*' "$SW_FILE" | grep -o '[0-9]*$')
NEXT=$((CURRENT + 1))
sed -i '' "s/funschool-v${CURRENT}/funschool-v${NEXT}/" "$SW_FILE"
echo "✔  SW cache bumped: funschool-v${CURRENT} → funschool-v${NEXT}"

# 2. Commit
git add -A
if git diff --cached --quiet; then
    echo "•  Nothing to commit"
else
    git commit -q -m "$COMMIT_MSG"
    echo "✔  Committed: $COMMIT_MSG"
fi

# 3. Push (non-fatal, never prompts for credentials)
if GIT_TERMINAL_PROMPT=0 git push origin main; then
    echo "✔  Pushed to GitHub"
else
    echo "⚠  GitHub push failed (check credentials) — continuing with deploy"
fi

# 4. Deploy to Firebase
"$FIREBASE" deploy --only hosting --non-interactive
echo "✔  Deployed to https://funschool-app.web.app"
