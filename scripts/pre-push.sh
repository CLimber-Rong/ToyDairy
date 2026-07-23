#!/usr/bin/env bash
# Toy Dairy — pre-push checks
# Called by .githooks/pre-push on every `git push`.
# Manual: ./scripts/pre-push.sh [remote] [url]
#
# Exit 0 = allow push; non-zero = abort push.
# Compatible with macOS Bash 3.2 (no mapfile).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

REMOTE="${1:-origin}"
URL="${2:-}"

RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[0;33m'
CYAN=$'\033[0;36m'
NC=$'\033[0m'

ok()   { echo "${GREEN}✓${NC} $*"; }
warn() { echo "${YELLOW}!${NC} $*"; }
fail() { echo "${RED}✗${NC} $*" >&2; exit 1; }
info() { echo "${CYAN}→${NC} $*"; }

echo ""
echo "${CYAN}══════════════════════════════════════${NC}"
echo "${CYAN}  Toy Dairy pre-push${NC}"
echo "${CYAN}══════════════════════════════════════${NC}"
info "remote: ${REMOTE}${URL:+ ($URL)}"
info "branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')"
info "commit: $(git rev-parse --short HEAD 2>/dev/null || echo '?')"
echo ""

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "not a git repository"

# ── Collect commit ranges being pushed (from pre-push stdin) ────────────────
RANGES=""
if [[ ! -t 0 ]]; then
  while read -r local_ref local_sha remote_ref remote_sha || [[ -n "${local_ref:-}" ]]; do
    [[ -z "${local_ref:-}" ]] && continue
    if [[ "$local_sha" =~ ^0+$ ]]; then
      info "delete ${remote_ref} — skip content checks for this ref"
      continue
    fi
    if [[ "$remote_sha" =~ ^0+$ ]]; then
      RANGES="${RANGES}${local_sha}"$'\n'
    else
      RANGES="${RANGES}${remote_sha}..${local_sha}"$'\n'
    fi
  done
fi

if [[ -z "$RANGES" ]]; then
  if git rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
    RANGES="@{u}..HEAD"
  else
    RANGES="HEAD"
  fi
fi

# ── 1. Block secret-like paths ──────────────────────────────────────────────
SECRET_REGEX='(^|/)\.env($|\.)|(^|/)id_rsa$|(^|/)id_ed25519$|\.pem$|\.p12$|credentials\.json$|serviceAccount.*\.json$|(^|/)secrets?\.ya?ml$'

suspects=""
while IFS= read -r range; do
  [[ -z "$range" ]] && continue
  if [[ "$range" == *".."* ]]; then
    paths="$(git diff --name-only --diff-filter=ACM "$range" 2>/dev/null || true)"
  else
    paths="$(git diff-tree --no-commit-id --name-only -r "$range" 2>/dev/null || git ls-tree -r --name-only "$range" 2>/dev/null || true)"
  fi
  while IFS= read -r path; do
    [[ -z "$path" ]] && continue
    if echo "$path" | grep -Eq "$SECRET_REGEX"; then
      suspects="${suspects}${path}"$'\n'
    fi
  done <<< "$paths"
done <<< "$RANGES"

while IFS= read -r path; do
  [[ -z "$path" ]] && continue
  if echo "$path" | grep -Eq "$SECRET_REGEX"; then
    suspects="${suspects}${path}"$'\n'
  fi
done < <(git ls-files)

if [[ -n "$suspects" ]]; then
  suspects="$(printf '%s' "$suspects" | sort -u)"
  echo "${RED}Refusing push: secret-like files are tracked or in push range:${NC}" >&2
  printf '%s\n' "$suspects" | while IFS= read -r f; do
    [[ -n "$f" ]] && echo "  - $f" >&2
  done
  echo "Untrack / remove before pushing (and rotate any exposed keys)." >&2
  exit 1
fi
ok "no secret-like files in push range or index"

# ── 2. Scan blob text for high-confidence key patterns ──────────────────────
KEY_GREP='(BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY|AKIA[0-9A-Z]{16}|sk-[a-zA-Z0-9]{20,}|api[_-]?key[[:space:]]*[:=][[:space:]]*['\''\"][^'\''\"]{16,})'

key_hits=0
while IFS= read -r range; do
  [[ -z "$range" ]] && continue
  if [[ "$range" == *".."* ]]; then
    changed="$(git diff --name-only --diff-filter=ACM "$range" 2>/dev/null || true)"
  else
    changed="$(git diff-tree --no-commit-id --name-only -r "$range" 2>/dev/null || true)"
  fi
  while IFS= read -r path; do
    [[ -z "$path" ]] && continue
    case "$path" in
      *.png|*.jpg|*.jpeg|*.gif|*.webp|*.ico|*.pdf|*.zip|*.gz|*.woff*|*.mp4|*.mov) continue ;;
    esac
    if git show "HEAD:$path" 2>/dev/null | grep -Eiq "$KEY_GREP"; then
      echo "${RED}  possible secret content in: $path${NC}" >&2
      key_hits=$((key_hits + 1))
    fi
  done <<< "$changed"
done <<< "$RANGES"

if [[ "$key_hits" -gt 0 ]]; then
  fail "possible secrets in file contents ($key_hits file(s)). Fix or use: git push --no-verify (last resort)"
fi
ok "no high-confidence secret patterns in changed text"

# ── 3. Dirty worktree (warn only) ───────────────────────────────────────────
if [[ -n "$(git status --porcelain)" ]]; then
  warn "working tree is dirty — uncommitted changes will NOT be pushed"
  git status -sb | head -20
else
  ok "working tree clean"
fi

# ── 4. Package scripts when web/ / server/ exist ────────────────────────────
run_npm_script() {
  local dir="$1"
  local name="$2"
  [[ -f "$dir/package.json" ]] || return 0
  command -v npm >/dev/null 2>&1 || { warn "npm not found — skip $dir $name"; return 0; }
  if node -e "const p=require('./${dir}/package.json'); process.exit(p.scripts && p.scripts['${name}'] ? 0 : 1)" 2>/dev/null; then
    info "npm run ${name} (in ${dir})"
    (cd "$dir" && npm run "$name") || fail "npm run ${name} failed in ${dir}"
    ok "${dir}: ${name}"
  fi
}

for dir in web server; do
  if [[ -d "$dir" && -f "$dir/package.json" ]]; then
    run_npm_script "$dir" "lint"
    run_npm_script "$dir" "typecheck"
    run_npm_script "$dir" "test"
  fi
done

if [[ ! -d web && ! -d server ]]; then
  ok "no web/server packages yet — skipped lint/test"
fi

# ── 5. Upstream hint ────────────────────────────────────────────────────────
branch="$(git rev-parse --abbrev-ref HEAD)"
if git rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
  ok "upstream: $(git rev-parse --abbrev-ref '@{u}')"
else
  warn "no upstream for '${branch}' (first push: git push -u ${REMOTE} ${branch})"
fi

echo ""
ok "pre-push checks passed — continuing push"
echo ""
exit 0
