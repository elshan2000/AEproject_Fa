#!/usr/bin/env bash
# Production deployment script (VPS / bare-metal with Node + PM2).
# Run as the app user (not root) on the server.
#
# Prerequisites on the server:
#   - Node 20 LTS, npm
#   - PM2 (npm i -g pm2)
#   - PostgreSQL running (or docker-compose.db.yml)
#   - .env file present in the project root (never commit it)
#
# Usage:
#   ./scripts/deploy.sh

set -euo pipefail

BLUE='\033[0;34m'; GREEN='\033[0;32m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${BLUE}[deploy]${NC} $*"; }
ok()   { echo -e "${GREEN}[deploy]${NC} $*"; }
fail() { echo -e "${RED}[deploy]${NC} $*" >&2; exit 1; }

# ── Sanity checks ─────────────────────────────────────────────────────────────
[[ -f .env ]] || fail ".env not found. Copy .env.example and fill in real values."
command -v node >/dev/null || fail "node not found."
command -v pm2  >/dev/null || fail "pm2 not found. Run: npm i -g pm2"

# Load env for the deploy steps (DATABASE_URL, SESSION_SECRET …)
set -a; source .env; set +a

# ── Pull latest code ──────────────────────────────────────────────────────────
log "Pulling latest changes …"
git pull --ff-only

# ── Install dependencies ──────────────────────────────────────────────────────
log "Installing dependencies …"
npm ci --prefer-offline

# ── Run pending DB migrations ─────────────────────────────────────────────────
log "Running database migrations …"
npx prisma migrate deploy

# ── Build ─────────────────────────────────────────────────────────────────────
log "Building Next.js …"
npm run build

# ── Copy public assets into standalone output ─────────────────────────────────
log "Copying static assets to standalone bundle …"
cp -r public .next/standalone/public

# Ensure uploads dir exists and preserve any existing uploads
mkdir -p .next/standalone/public/uploads
if [[ -d public/uploads ]]; then
  cp -rn public/uploads/. .next/standalone/public/uploads/ 2>/dev/null || true
fi

# ── Reload PM2 (zero-downtime cluster reload) ─────────────────────────────────
log "Reloading PM2 process …"
if pm2 list | grep -q "flower-shop"; then
  pm2 reload ecosystem.config.cjs --env production
else
  pm2 start ecosystem.config.cjs --env production
fi

pm2 save

ok "Deployment complete."
