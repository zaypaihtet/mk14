#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  TwoDbet VPS Installer
#  Usage: sudo bash install.sh
# ═══════════════════════════════════════════════════════════════
set -uo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $1"; }
success() { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
ask()     { echo -ne "${BLUE}[INPUT]${NC} $1"; }

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        TwoDbet VPS Auto Installer            ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════╝${NC}"
echo ""

# ── 1. Check prerequisites ────────────────────────────────────
info "Prerequisites စစ်ဆေးနေသည်..."

command -v node   >/dev/null 2>&1 || error "Node.js မရှိပါ။  'apt install nodejs' ဖြင့် ထည့်ပါ"
command -v npm    >/dev/null 2>&1 || error "npm မရှိပါ။"
command -v psql   >/dev/null 2>&1 || error "PostgreSQL မရှိပါ။  'apt install postgresql' ဖြင့် ထည့်ပါ"
command -v nginx  >/dev/null 2>&1 || error "Nginx မရှိပါ။  'apt install nginx' ဖြင့် ထည့်ပါ"
command -v pm2    >/dev/null 2>&1 || { warn "pm2 မရှိ၊ install လုပ်နေသည်..."; npm install -g pm2 > /dev/null 2>&1; success "pm2 install ပြီး"; }

success "Prerequisites အားလုံး ရှိနေပါသည်"

# ── 2. Domain ချိန်ညှိ ─────────────────────────────────────────
echo ""
echo -e "${CYAN}── Domain Configuration ────────────────────────${NC}"
echo ""

ask "သင့် domain name ထည့်ပါ (ဥပမာ: twod.high-value.xyz): "
read -r DOMAIN
[ -z "$DOMAIN" ] && error "Domain name မထည့်ဘဲ ဆက်မသွားနိုင်ပါ"

ask "SSL (HTTPS) certbot ဖြင့် ထည့်မလား? (Y/n): "
read -r USE_SSL
USE_SSL="${USE_SSL:-Y}"

ask "SSL email (certbot အတွက်, Let's Encrypt): "
read -r SSL_EMAIL

success "Domain: $DOMAIN"

# ── 3. .env setup ─────────────────────────────────────────────
ENV_FILE="$PROJECT_DIR/.env"

echo ""
echo -e "${CYAN}── .env Configuration ──────────────────────────${NC}"

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

  ask "JWT Secret (Enter ရိုက်ရင် random generate လုပ်မည်): "
  read -r JWT_SECRET
  if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || cat /proc/sys/kernel/random/uuid | tr -d '-')
    info "JWT Secret auto-generated"
  fi

  ask "App Header Secret (Enter ရိုက်ရင် default သုံးမည်): "
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
  set -o allexport; source "$ENV_FILE" 2>/dev/null; set +o allexport || true
  DB_URL="$DATABASE_URL"
  BACKEND_PORT="${BACKEND_PORT:-8000}"
fi

# DB_NAME / DB_USER / DB_HOST fallback from URL
if [ -z "$DB_NAME" ]; then
  DB_NAME=$(echo "$DB_URL" | grep -oP '(?<=/)[^?/]+$' || echo "twodbet")
fi
if [ -z "$DB_USER" ]; then
  DB_USER=$(echo "$DB_URL" | grep -oP '(?<=//)[^:@]+' || echo "postgres")
fi
DB_HOST="${DB_HOST:-localhost}"

# ── 4. PostgreSQL database ────────────────────────────────────
echo ""
echo -e "${CYAN}── Database Setup ───────────────────────────────${NC}"

# Helper: run psql command trying multiple auth methods
psql_run() {
  local db="$1"; shift
  local cmd=("$@")
  # Method 1: with password + host
  if [ -n "$DB_PASS" ]; then
    PGPASSWORD="$DB_PASS" psql -U "$DB_USER" -h "$DB_HOST" -d "$db" "${cmd[@]}" > /dev/null 2>&1 && return 0
  fi
  # Method 2: sudo -u postgres (peer auth)
  sudo -u postgres psql -d "$db" "${cmd[@]}" > /dev/null 2>&1 && return 0
  # Method 3: DATABASE_URL direct
  if [ -n "$DB_URL" ]; then
    psql "$DB_URL" "${cmd[@]}" > /dev/null 2>&1 && return 0
  fi
  # Method 4: no password, localhost
  PGPASSWORD="" psql -U "$DB_USER" -h "$DB_HOST" -d "$db" "${cmd[@]}" > /dev/null 2>&1 && return 0
  return 1
}

# Helper: check db exists
db_exists() {
  local result
  result=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null) && [ "$result" = "1" ] && return 0
  [ -n "$DB_PASS" ] && result=$(PGPASSWORD="$DB_PASS" psql -U "$DB_USER" -h "$DB_HOST" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null) && [ "$result" = "1" ] && return 0
  return 1
}

info "Database '$DB_NAME' စစ်ဆေးနေသည်..."

if ! db_exists; then
  info "Database '$DB_NAME' မရှိ၊ ဆောက်နေသည်..."
  created=false
  sudo -u postgres createdb "$DB_NAME" 2>/dev/null && created=true
  if [ "$created" = false ] && [ -n "$DB_PASS" ]; then
    PGPASSWORD="$DB_PASS" psql -U "$DB_USER" -h "$DB_HOST" -d postgres -c "CREATE DATABASE $DB_NAME;" > /dev/null 2>&1 && created=true
  fi
  if [ "$created" = false ]; then
    PGPASSWORD="" psql -U "$DB_USER" -h "$DB_HOST" -d postgres -c "CREATE DATABASE $DB_NAME;" > /dev/null 2>&1 && created=true
  fi
  [ "$created" = true ] && success "Database '$DB_NAME' ဆောက်ပြီးပါပြီ" || error "Database '$DB_NAME' ဆောက်မရပါ — PostgreSQL service running မရှိနိုင်ပါ ('systemctl start postgresql' ကြိုးစားပါ)"
else
  success "Database '$DB_NAME' ရှိပြီးသားဖြစ်သည်"
fi

# ── 5. Run schema.sql ─────────────────────────────────────────
SCHEMA_FILE="$PROJECT_DIR/backend/schema.sql"

[ -f "$SCHEMA_FILE" ] || error "backend/schema.sql မတွေ့ပါ"

info "Database schema တပ်ဆင်နေသည်..."

schema_ok=false
# Try each method in turn, capture errors for last-resort display
SCHEMA_ERR=""

if [ -n "$DB_PASS" ]; then
  SCHEMA_ERR=$(PGPASSWORD="$DB_PASS" psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -f "$SCHEMA_FILE" 2>&1) && schema_ok=true
fi
if [ "$schema_ok" = false ]; then
  SCHEMA_ERR=$(sudo -u postgres psql -d "$DB_NAME" -f "$SCHEMA_FILE" 2>&1) && schema_ok=true
fi
if [ "$schema_ok" = false ] && [ -n "$DB_URL" ]; then
  SCHEMA_ERR=$(psql "$DB_URL" -f "$SCHEMA_FILE" 2>&1) && schema_ok=true
fi
if [ "$schema_ok" = false ]; then
  SCHEMA_ERR=$(PGPASSWORD="" psql -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" -f "$SCHEMA_FILE" 2>&1) && schema_ok=true
fi

if [ "$schema_ok" = true ]; then
  success "Schema တပ်ဆင်ပြီးပါပြီ"
else
  error "Schema တပ်ဆင်မရပါ။\n  Error: $SCHEMA_ERR"
fi

# ── 6. Install dependencies ───────────────────────────────────
echo ""
echo -e "${CYAN}── Dependencies တပ်ဆင်နေသည် ─────────────────────${NC}"

info "Backend npm install..."
if OUT=$(cd "$PROJECT_DIR/backend" && npm install --production 2>&1); then
  success "Backend dependencies တပ်ဆင်ပြီး"
else
  error "Backend npm install မရပါ:\n$OUT"
fi

info "Frontend npm install..."
if OUT=$(cd "$PROJECT_DIR" && npm install 2>&1); then
  success "Frontend dependencies တပ်ဆင်ပြီး"
else
  error "Frontend npm install မရပါ:\n$OUT"
fi

info "Frontend build လုပ်နေသည် (ခဏစောင့်ပါ)..."
if OUT=$(cd "$PROJECT_DIR" && npm run build 2>&1); then
  success "Frontend build ပြီးပါပြီ → $PROJECT_DIR/dist/"
else
  error "Frontend build မရပါ:\n$OUT"
fi

# ── 7. PM2 setup ──────────────────────────────────────────────
echo ""
echo -e "${CYAN}── PM2 Setup ────────────────────────────────────${NC}"

cd "$PROJECT_DIR"

# Load .env into pm2 environment
ENV_ARGS=""
if [ -f "$ENV_FILE" ]; then
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue
    ENV_ARGS="$ENV_ARGS --env-var $line"
  done < "$ENV_FILE"
fi

PM2_EXISTS=$(pm2 list 2>/dev/null | grep -c "twodbet" || echo "0")
if [ "$PM2_EXISTS" -gt "0" ]; then
  info "PM2 process ရှိပြီးသား — restart လုပ်နေသည်..."
  pm2 restart twodbet --update-env 2>/dev/null
else
  info "PM2 process အသစ် ဆောက်နေသည်..."
  env $(cat "$ENV_FILE" | grep -v '^#' | xargs) pm2 start backend/src/app.js \
    --name twodbet \
    --log ~/.pm2/logs/twodbet-out.log \
    --error ~/.pm2/logs/twodbet-error.log
fi

pm2 save > /dev/null 2>&1
pm2 startup 2>/dev/null | grep -E "^sudo" | bash 2>/dev/null || true
success "PM2 setup ပြီးပါပြီ (server reboot လုပ်ရင်လည်း အလိုအလျောက် start မည်)"

# ── 8. Nginx config ───────────────────────────────────────────
echo ""
echo -e "${CYAN}── Nginx Domain Setup ($DOMAIN) ─────────────────${NC}"

NGINX_CONF="/etc/nginx/sites-available/twodbet"
NGINX_ENABLED="/etc/nginx/sites-enabled/twodbet"
DIST_PATH="$PROJECT_DIR/dist"

info "Nginx config ရေးနေသည်..."

cat > "$NGINX_CONF" <<NGINX_EOF
server {
    listen 80;
    server_name ${DOMAIN};

    root ${DIST_PATH};
    index index.html;

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:${BACKEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 60s;
    }

    # Uploaded files proxy
    location /uploads/ {
        proxy_pass http://localhost:${BACKEND_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    # React SPA - catch all routes
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
NGINX_EOF

success "Nginx config ရေးပြီး → $NGINX_CONF"

# Enable site
if [ ! -L "$NGINX_ENABLED" ]; then
  ln -s "$NGINX_CONF" "$NGINX_ENABLED"
  success "Site enabled"
fi

# Remove default site if exists
[ -L "/etc/nginx/sites-enabled/default" ] && rm /etc/nginx/sites-enabled/default && info "Default site ဖျက်လိုက်သည်"

# Test nginx config
nginx -t 2>/dev/null && success "Nginx config စစ်ဆေးချက် ကောင်းသည်" || error "Nginx config error ရှိသည် — 'nginx -t' ဖြင့် စစ်ပါ"

systemctl reload nginx 2>/dev/null && success "Nginx reload ပြီး"

# ── 9. SSL / HTTPS ────────────────────────────────────────────
if [[ "$USE_SSL" =~ ^[Yy]$ ]]; then
  echo ""
  echo -e "${CYAN}── SSL (HTTPS) Setup ────────────────────────────${NC}"

  if ! command -v certbot >/dev/null 2>&1; then
    info "Certbot install လုပ်နေသည်..."
    apt-get install -y certbot python3-certbot-nginx > /dev/null 2>&1
    success "Certbot install ပြီး"
  fi

  info "SSL certificate ရယူနေသည် ($DOMAIN)..."
  if [ -n "$SSL_EMAIL" ]; then
    certbot --nginx \
      -d "$DOMAIN" \
      --non-interactive \
      --agree-tos \
      --email "$SSL_EMAIL" \
      --redirect 2>/dev/null \
      && success "SSL certificate ရပြီး! HTTPS အသုံးပြုနိုင်ပြီ" \
      || warn "SSL certificate ရယူမရပါ — domain DNS ချိန်ညှိမှု ကောင်းရဲ့လားစစ်ပါ"
  else
    certbot --nginx \
      -d "$DOMAIN" \
      --non-interactive \
      --agree-tos \
      --register-unsafely-without-email \
      --redirect 2>/dev/null \
      && success "SSL certificate ရပြီး! HTTPS အသုံးပြုနိုင်ပြီ" \
      || warn "SSL certificate ရယူမရပါ — domain DNS ချိန်ညှိမှု ကောင်းရဲ့လားစစ်ပါ"
  fi

  # Auto-renew cron
  (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | sort -u | crontab -
  success "SSL auto-renew cron ထည့်ပြီး (နေ့တိုင်း နံနက် ၃ နာရီ စစ်ဆေးမည်)"
else
  info "SSL setup ကျော်သွားမည်"
fi

# ── Done ──────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Setup ပြီးစီးပါပြီ!  ✓               ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""

if [[ "$USE_SSL" =~ ^[Yy]$ ]]; then
  echo -e "  Website  : ${CYAN}https://${DOMAIN}${NC}"
else
  echo -e "  Website  : ${CYAN}http://${DOMAIN}${NC}"
fi
echo ""
echo -e "  Admin Login:"
echo -e "  Phone    : ${CYAN}09000000000${NC}"
echo -e "  Password : ${CYAN}admin123${NC}"
echo -e "  ${YELLOW}(Login ဝင်ပြီးချက်ချင်း password ပြောင်းပါ!)${NC}"
echo ""
echo -e "  ${BOLD}အသုံးဝင်သော commands:${NC}"
echo -e "  pm2 log twodbet          ${CYAN}# backend logs ကြည့်ရန်${NC}"
echo -e "  pm2 restart twodbet      ${CYAN}# backend restart${NC}"
echo -e "  pm2 status               ${CYAN}# process status ကြည့်ရန်${NC}"
echo -e "  certbot renew --dry-run  ${CYAN}# SSL renew test${NC}"
echo ""
