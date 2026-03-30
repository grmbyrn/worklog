#/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ISSUES_DIR="$ROOT_DIR/.github/ISSUES"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install it and authenticate (gh auth login)."
  exit 2
fi

for f in "$ISSUES_DIR"/*.md; do
  # skip README
  ["$f" = "$ISSUES_DIR/README.md"] && continue
  title=$(sed -n '1s/^Title: \(.*\)/\1/p' "$f" | sed -n '1p')
  if [ -z "$title" ]; then
    echo "Skipping $f: no Title line found"
    continue
  fi
  echo "Creating issue: $title"
  gh issue create --title "$title" --body-file "$f" || {
    echo "Failed to create issue: $title"
    exit 1
  }
  sleep 0.2
done

echo "All issues processed."
