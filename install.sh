#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  TwoDbet VPS Installer
#  Usage: bash install.sh
# ═══════════════════════════════════════════════════════════════
set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $1"; }
success() { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
ask()     { echo -e "${BLUE}[INPUT]${NC} $1"; }

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        TwoDbet VPS Auto Installer        ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"
echo ""

# ── 1. Check prerequisites ───────────────────────────────────
info "Prerequisites စစ်ဆေးနေသည်..."

command -v node  >/dev/null 2>&1 || error "Node.js မရှိပါ။  'apt install nodejs' ဖြင့် ထည့်ပါ"
command -v npm   >/dev/null 2>&1 || error "npm မရှိပါ။"
command -v psql  >/dev/null 2>&1 || error "PostgreSQL မရှိပါ။  'apt install postgresql' ဖြင့် ထည့်ပါ"
command -v pm2   >/dev/null 2>&1 || { warn "pm2 မရှိ၊ install လုပ်နေသည်..."; npm install -g pm2; }

success "Prerequisites အားလုံး ရှိနေပါသည်"

# ── 2. .env setup ────────────────────────────────────────────
ENV_FILE="$PROJECT_DIR/.env"

echo ""
echo -e "${CYAN}── .env Configuration ─────────────────────${NC}"

if [ -f "$ENV_FILE" ]; then
  warn ".env ဖိုင် ရှိပြီးသားဖြစ်သည်"
  ask "ထပ်ရေးမလား? (y/N): "
  read -r overwrite_env
  overwrite_env="${overwrite_env:-N}"
else
  overwrite_env="y"
fi

if [[ "$overwrite_env" =~ ^[Yy]$ ]]; then
  ask "PostgreSQL database name (default: twodbet): "
  read -r DB_NAME; DB_NAME="${DB_NAME:-twodbet}"

  ask "PostgreSQL username (default: postgres): "
  read -r DB_USER; DB_USER="${DB_USER:-postgres}"

  ask "PostgreSQL password (blank if none): "
  read -rs DB_PASS; echo ""

  ask "PostgreSQL host (default: localhost): "
  read -r DB_HOST; DB_HOST="${DB_HOST:-localhost}"

  ask "Backend port (default: 8000): "
  read -r BACKEND_PORT; BACKEND_PORT="${BACKEND_PORT:-8000}"

  ask "JWT Secret (Enter ကို ရိုက်ရင် random generate လုပ်မည်): "
  read -r JWT_SECRET
  if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || cat /proc/sys/kernel/random/uuid | tr -d '-')
  fi

  ask "App Header Secret (Enter ကို ရိုက်ရင် default ကို သုံးမည်): "
  read -r APP_HEADER_SECRET
  APP_HEADER_SECRET="${APP_HEADER_SECRET:-6230fb95f27b1b92aa6e3a670563e71f26f9c70c639e4aba8886deb279e32029}"

  if [ -z "$DB_PASS" ]; then
    DB_URL="postgresql://${DB_USER}@${DB_HOST}:5432/${DB_NAME}"
  else
    DB_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:5432/${DB_NAME}"
  fi

  cat > "$ENV_FILE" <<EOF
# Database
DATABASE_URL=${DB_URL}

# Backend
BACKEND_PORT=${BACKEND_PORT}
JWT_SECRET=${JWT_SECRET}
APP_HEADER_SECRET=${APP_HEADER_SECRET}
NODE_ENV=production
EOF

  success ".env ဖိုင် ဆောက်ပြီးပါပြီ → $ENV_FILE"
else
  info ".env ဖိုင် မပြောင်းဘဲ ဆက်သွားမည်"
  source "$ENV_FILE" 2>/dev/null || true
  DB_URL="$DATABASE_URL"
fi

# ── 3. PostgreSQL database ───────────────────────────────────
echo ""
echo -e "${CYAN}── Database Setup ──────────────────────────${NC}"

if [ -z "$DB_NAME" ]; then
  DB_NAME=$(echo "$DB_URL" | grep -oP '(?<=/)[^?]+$' || echo "twodbet")
fi
if [ -z "$DB_USER" ]; then
  DB_USER=$(echo "$DB_URL" | grep -oP '(?<=//)[^:@]+' || echo "postgres")
fi

info "Database '$DB_NAME' စစ်ဆေးနေသည်..."

DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null || echo "")
if [ "$DB_EXISTS" != "1" ]; then
  info "Database '$DB_NAME' မရှိ၊ ဆောက်နေသည်..."
  sudo -u postgres createdb "$DB_NAME" 2>/dev/null && success "Database '$DB_NAME' ဆောက်ပြီးပါပြီ" || warn "Database ဆောက်မရပါ — ကိုယ်တိုင် ဆောက်ပါ"
else
  success "Database '$DB_NAME' ရှိပြီးသားဖြစ်သည်"
fi

# ── 4. Run schema.sql ────────────────────────────────────────
SCHEMA_FILE="$PROJECT_DIR/backend/schema.sql"

if [ -f "$SCHEMA_FILE" ]; then
  info "Database schema တပ်ဆင်နေသည်..."
  if [ -n "$DB_PASS" ]; then
    PGPASSWORD="$DB_PASS" psql -U "$DB_USER" -h "${DB_HOST:-localhost}" -d "$DB_NAME" -f "$SCHEMA_FILE" > /dev/null 2>&1 \
      && success "Schema တပ်ဆင်ပြီးပါပြီ" \
      || warn "Schema တပ်ဆင်ရာ error ဖြစ်ခဲ့သည် — psql ဖြင့် ကိုယ်တိုင် run နိုင်သည်"
  else
    sudo -u postgres psql -d "$DB_NAME" -f "$SCHEMA_FILE" > /dev/null 2>&1 \
      && success "Schema တပ်ဆင်ပြီးပါပြီ" \
      || warn "Schema တပ်ဆင်ရာ error ဖြစ်ခဲ့သည် — psql ဖြင့် ကိုယ်တိုင် run နိုင်သည်"
  fi
else
  error "backend/schema.sql မတွေ့ပါ"
fi

# ── 5. Install backend dependencies ─────────────────────────
echo ""
echo -e "${CYAN}── Dependencies တပ်ဆင်နေသည် ───────────────${NC}"

info "Backend npm install..."
cd "$PROJECT_DIR/backend" && npm install --production > /dev/null 2>&1
success "Backend dependencies တပ်ဆင်ပြီး"

# ── 6. Build frontend ────────────────────────────────────────
info "Frontend dependencies တပ်ဆင်နေသည်..."
cd "$PROJECT_DIR" && npm install > /dev/null 2>&1
success "Frontend dependencies တပ်ဆင်ပြီး"

info "Frontend build လုပ်နေသည် (ခဏစောင့်ပါ)..."
cd "$PROJECT_DIR" && npm run build > /dev/null 2>&1
success "Frontend build ပြီးပါပြီ → dist/"

# ── 7. PM2 setup ─────────────────────────────────────────────
echo ""
echo -e "${CYAN}── PM2 Setup ───────────────────────────────${NC}"

cd "$PROJECT_DIR"

PM2_EXISTS=$(pm2 list | grep -c "twodbet" || true)
if [ "$PM2_EXISTS" -gt "0" ]; then
  info "PM2 process ရှိပြီးသား — restart လုပ်နေသည်..."
  pm2 restart twodbet --update-env
else
  info "PM2 process အသစ် ဆောက်နေသည်..."
  pm2 start backend/src/app.js \
    --name twodbet \
    --env production \
    --log ~/.pm2/logs/twodbet-out.log \
    --error ~/.pm2/logs/twodbet-error.log
fi

pm2 save > /dev/null 2>&1
success "PM2 setup ပြီးပါပြီ"

# ── 8. Nginx config hint ─────────────────────────────────────
echo ""
echo -e "${CYAN}── Nginx Configuration ─────────────────────${NC}"
echo ""
warn "Nginx config ကို ဒီပုံစံဖြင့် ပြင်ပါ —"
echo ""
cat <<'NGINX'
  server {
      listen 80;
      server_name your-domain.com;

      root /var/www/html/twodbet/dist;
      index index.html;

      location /api/ {
          proxy_pass http://localhost:8000;
          proxy_http_version 1.1;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
      }

      location /uploads/ {
          proxy_pass http://localhost:8000;
      }

      location / {
          try_files $uri $uri/ /index.html;
      }
  }
NGINX
echo ""
warn "ပြင်ပြီးနောက် — sudo nginx -t && sudo systemctl reload nginx"

# ── Done ─────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Setup ပြီးစီးပါပြီ! ✓            ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Admin Login:"
echo -e "  Phone    : ${CYAN}09000000000${NC}"
echo -e "  Password : ${CYAN}admin123${NC}"
echo -e "  (Login ဝင်ပြီးချက်ချင်း password ပြောင်းပါ)"
echo ""
echo -e "  PM2 logs : ${CYAN}pm2 log twodbet${NC}"
echo ""
