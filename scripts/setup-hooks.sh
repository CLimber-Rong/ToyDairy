#!/usr/bin/env bash
# One-time (or re-run) setup: point this clone at .githooks so every push runs pre-push.
# Usage: ./scripts/setup-hooks.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

chmod +x scripts/pre-push.sh scripts/setup-hooks.sh .githooks/pre-push 2>/dev/null || true
git config core.hooksPath .githooks

echo "core.hooksPath -> $(git config --get core.hooksPath)"
echo "Hooks ready. Every git push will run scripts/pre-push.sh"
echo "Bypass (emergency only): git push --no-verify"
