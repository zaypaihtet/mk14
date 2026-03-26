#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  TwoDbet VPS Installer  —  sudo bash install.sh
#  ပြီးသောstep တွေကို အလိုအလျောက် skip လုပ်သည်
# ═══════════════════════════════════════════════════════════════

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $1"; }
success() { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[SKIP]${NC}  $1"; }
err()     { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
ask()     { echo -ne "${BLUE}[INPUT]${NC} $1"; }

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$PROJECT_DIR/.env"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        TwoDbet VPS Auto Installer            ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════╝${NC}"
echo ""

# ════════════════════════════════════════════════
# Helper: run psql with any working method
# ════════════════════════════════════════════════
psql_any() {
  # $1 = database, remaining = psql args
  local db="$1"; shift
  local args=("$@")
  local url
  url=$(grep -m1 '^DATABASE_URL=' "$ENV_FILE" 2>/dev/null | cut -d= -f2- || echo "")

  # 1) via DATABASE_URL
  [ -n "$url" ] && psql "$url" "${args[@]}" > /dev/null 2>&1 && return 0
  # 2) su postgres (works even when sudo not configured)
  su -s /bin/sh postgres -c "psql -d $db $(printf '%q ' "${args[@]}")" > /dev/null 2>&1 && return 0
  # 3) sudo -u postgres
  sudo -u postgres psql -d "$db" "${args[@]}" > /dev/null 2>&1 && return 0
  # 4) direct as root (if pg_hba allows)
  psql -U postgres -d "$db" "${args[@]}" > /dev/null 2>&1 && return 0
  return 1
}

# ════════════════════════════════════════════════
# Helper: test DB URL connection
# ════════════════════════════════════════════════
test_db_url() {
  local url="$1"
  psql "$url" -c "SELECT 1;" > /dev/null 2>&1
}

# ════════════════════════════════════════════════
# 1. Prerequisites
# ════════════════════════════════════════════════
echo -e "${CYAN}── [1] Prerequisites ───────────────────────────${NC}"
command -v node  >/dev/null 2>&1 || err "Node.js မရှိပါ — 'apt install nodejs'"
command -v npm   >/dev/null 2>&1 || err "npm မရှိပါ"
command -v psql  >/dev/null 2>&1 || err "PostgreSQL မရှိပါ — 'apt install postgresql'"
command -v nginx >/dev/null 2>&1 || err "Nginx မရှိပါ — 'apt install nginx'"
command -v pm2   >/dev/null 2>&1 || { info "pm2 install လုပ်နေသည်..."; npm i -g pm2 >/dev/null 2>&1; }
success "Prerequisites OK"

# ════════════════════════════════════════════════
# 2. Domain
# ════════════════════════════════════════════════
echo ""
echo -e "${CYAN}── [2] Domain ──────────────────────────────────${NC}"

ask "Domain name (ဥပမာ: twod.high-value.xyz): "
read -r DOMAIN
[ -z "$DOMAIN" ] && err "Domain name မထည့်ဘဲ ဆက်မသွားနိုင်ပါ"

ask "SSL/HTTPS ထည့်မလား? (Y/n): "
read -r USE_SSL; USE_SSL="${USE_SSL:-Y}"

ask "SSL email (certbot, blank ရလဲ OK): "
read -r SSL_EMAIL

success "Domain: $DOMAIN"

# ════════════════════════════════════════════════
# 3. .env
# ════════════════════════════════════════════════
echo ""
echo -e "${CYAN}── [3] .env Configuration ──────────────────────${NC}"

if [ -f "$ENV_FILE" ]; then
  warn ".env ရှိပြီး — skip (ထပ်ရေးချင်ရင် ဖျက်ပြီး ပြန် run ပါ)"
  # load values
  DB_URL=$(grep -m1 '^DATABASE_URL=' "$ENV_FILE" | cut -d= -f2-)
  BACKEND_PORT=$(grep -m1 '^BACKEND_PORT=' "$ENV_FILE" | cut -d= -f2-)
  BACKEND_PORT="${BACKEND_PORT:-8000}"
else
  ask "PostgreSQL DB name (default: twodbet): "; read -r DB_NAME; DB_NAME="${DB_NAME:-twodbet}"
  ask "PostgreSQL user (default: postgres): ";  read -r DB_USER; DB_USER="${DB_USER:-postgres}"
  ask "PostgreSQL password (blank = auto-set): "; read -rs DB_PASS; echo ""
  ask "PostgreSQL host (default: localhost): ";  read -r DB_HOST; DB_HOST="${DB_HOST:-localhost}"
  ask "Backend port (default: 8000): ";          read -r BACKEND_PORT; BACKEND_PORT="${BACKEND_PORT:-8000}"
  ask "JWT Secret (Enter = auto): ";             read -r JWT_SECRET
  [ -z "$JWT_SECRET" ] && JWT_SECRET=$(openssl rand -hex 32) && info "JWT Secret auto-generated"
  ask "App Header Secret (Enter = default): ";   read -r APP_HDR
  APP_HDR="${APP_HDR:-6230fb95f27b1b92aa6e3a670563e71f26f9c70c639e4aba8886deb279e32029}"

  if [ -z "$DB_PASS" ]; then
    DB_URL="postgresql://${DB_USER}@${DB_HOST}:5432/${DB_NAME}"
  else
    DB_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:5432/${DB_NAME}"
  fi

  cat > "$ENV_FILE" <<EOF
DATABASE_URL=${DB_URL}
BACKEND_PORT=${BACKEND_PORT}
JWT_SECRET=${JWT_SECRET}
APP_HEADER_SECRET=${APP_HDR}
NODE_ENV=production
EOF
  success ".env ဆောက်ပြီး"
fi

# Parse DB fields from URL
DB_USER=$(echo "$DB_URL" | grep -oP '(?<=//)[^:@]+' || echo "postgres")
DB_NAME=$(echo "$DB_URL" | grep -oP '[^/]+$'        || echo "twodbet")
DB_HOST=$(echo "$DB_URL" | grep -oP '(?<=@)[^:/]+'  || echo "localhost")

# ════════════════════════════════════════════════
# 4. DB Connection — auto-fix if needed
# ════════════════════════════════════════════════
echo ""
echo -e "${CYAN}── [4] Database Connection ─────────────────────${NC}"

info "Connection စစ်ဆေးနေသည်..."

if test_db_url "$DB_URL"; then
  success "DB connection OK — skip"
else
  warn "URL ဖြင့် connect မရ — password auto-fix လုပ်နေသည်..."
  AUTO_PASS=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9' | head -c 14)

  # Set password via any available method (root can use su)
  PW_SET=false
  su -s /bin/sh postgres -c "psql -c \"ALTER USER ${DB_USER} WITH PASSWORD '${AUTO_PASS}';\"" > /dev/null 2>&1 && PW_SET=true
  if [ "$PW_SET" = false ]; then
    sudo -u postgres psql -c "ALTER USER ${DB_USER} WITH PASSWORD '${AUTO_PASS}';" > /dev/null 2>&1 && PW_SET=true
  fi
  if [ "$PW_SET" = false ]; then
    psql -U postgres -c "ALTER USER ${DB_USER} WITH PASSWORD '${AUTO_PASS}';" > /dev/null 2>&1 && PW_SET=true
  fi

  if [ "$PW_SET" = false ]; then
    err "PostgreSQL password မသတ်မှတ်နိုင်ပါ\nManual: sudo -u postgres psql -c \"ALTER USER postgres WITH PASSWORD 'yourpassword';\"\nပြီးရင် .env ထဲ DATABASE_URL ကို update လုပ်ပါ"
  fi

  NEW_URL="postgresql://${DB_USER}:${AUTO_PASS}@${DB_HOST}:5432/${DB_NAME}"
  sed -i "s|^DATABASE_URL=.*|DATABASE_URL=${NEW_URL}|" "$ENV_FILE"
  DB_URL="$NEW_URL"

  if test_db_url "$DB_URL"; then
    success "DB connection auto-fix ပြီး ✓"
  else
    err "DB connection မရပါ — pg_hba.conf စစ်ဆေးပါ (local md5 ဖြစ်ရမည်)"
  fi
fi

# ════════════════════════════════════════════════
# 5. Database & Schema
# ════════════════════════════════════════════════
echo ""
echo -e "${CYAN}── [5] Database & Schema ───────────────────────${NC}"

# Check if DB exists
DB_EXISTS=$(psql "$DB_URL" -tAc "SELECT 1;" 2>/dev/null && echo "yes" || echo "no")

if [ "$DB_EXISTS" = "no" ]; then
  info "Database '$DB_NAME' ဆောက်နေသည်..."
  su -s /bin/sh postgres -c "createdb $DB_NAME" > /dev/null 2>&1 || \
  sudo -u postgres createdb "$DB_NAME" > /dev/null 2>&1 || \
  psql "$DB_URL" -c "CREATE DATABASE $DB_NAME;" > /dev/null 2>&1 || \
  err "Database ဆောက်မရပါ"
  success "Database '$DB_NAME' ဆောက်ပြီး"
fi

# Check if tables exist already
SCHEMA_FILE="$PROJECT_DIR/backend/schema.sql"
[ -f "$SCHEMA_FILE" ] || err "backend/schema.sql မတွေ့ပါ"

TABLE_COUNT=$(psql "$DB_URL" -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" 2>/dev/null || echo "0")
TABLE_COUNT=$(echo "$TABLE_COUNT" | tr -d '[:space:]')

if [ "${TABLE_COUNT:-0}" -ge 8 ] 2>/dev/null; then
  warn "Tables ($TABLE_COUNT) ရှိပြီး — schema skip"
else
  info "Schema တပ်ဆင်နေသည်..."
  if psql "$DB_URL" -f "$SCHEMA_FILE" > /dev/null 2>&1; then
    success "Schema တပ်ဆင်ပြီး"
  else
    err "Schema တပ်ဆင်မရပါ — 'psql \$DATABASE_URL -f backend/schema.sql' ကြည့်ပါ"
  fi
fi

# ════════════════════════════════════════════════
# 6. Dependencies & Build
# ════════════════════════════════════════════════
echo ""
echo -e "${CYAN}── [6] Dependencies & Build ────────────────────${NC}"

# Backend
if [ -d "$PROJECT_DIR/backend/node_modules" ]; then
  warn "Backend node_modules ရှိပြီး — skip"
else
  info "Backend npm install..."
  if OUT=$(cd "$PROJECT_DIR/backend" && npm install --production 2>&1); then
    success "Backend dependencies တပ်ဆင်ပြီး"
  else
    err "Backend npm install မရပါ:\n$OUT"
  fi
fi

# Frontend
if [ -d "$PROJECT_DIR/node_modules" ]; then
  warn "Frontend node_modules ရှိပြီး — skip"
else
  info "Frontend npm install..."
  if OUT=$(cd "$PROJECT_DIR" && npm install 2>&1); then
    success "Frontend dependencies တပ်ဆင်ပြီး"
  else
    err "Frontend npm install မရပါ:\n$OUT"
  fi
fi

# Build — skip if dist/ exists and no src changes
NEED_BUILD=true
if [ -d "$PROJECT_DIR/dist" ]; then
  DIST_TIME=$(stat -c %Y "$PROJECT_DIR/dist" 2>/dev/null || echo 0)
  SRC_TIME=$(find "$PROJECT_DIR/src" -newer "$PROJECT_DIR/dist" -name "*.jsx" -o -name "*.tsx" -o -name "*.js" -o -name "*.ts" 2>/dev/null | wc -l)
  SRC_TIME=$(echo "$SRC_TIME" | tr -d '[:space:]')
  if [ "${SRC_TIME:-0}" -eq 0 ]; then
    warn "dist/ ရှိပြီး၊ src မပြောင်း — build skip"
    NEED_BUILD=false
  fi
fi

if [ "$NEED_BUILD" = true ]; then
  info "Frontend build လုပ်နေသည် (ခဏစောင့်ပါ)..."
  if OUT=$(cd "$PROJECT_DIR" && npm run build 2>&1); then
    success "Frontend build ပြီး → dist/"
  else
    err "Frontend build မရပါ:\n$OUT"
  fi
fi

# ════════════════════════════════════════════════
# 7. PM2
# ════════════════════════════════════════════════
echo ""
echo -e "${CYAN}── [7] PM2 Backend Process ─────────────────────${NC}"

# Free the port first
fuser -k "${BACKEND_PORT}/tcp" > /dev/null 2>&1 || true
sleep 1

# Always delete existing twodbet process and start fresh so .env is reloaded
pm2 delete twodbet > /dev/null 2>&1 || true
sleep 1

info "PM2 start (.env vars load လုပ်ပြီး)..."
ENV_VARS=$(grep -v '^\s*#' "$ENV_FILE" | grep -v '^\s*$' | xargs)
if OUT=$(env $ENV_VARS pm2 start "$PROJECT_DIR/backend/src/app.js" \
    --name twodbet \
    --log ~/.pm2/logs/twodbet-out.log \
    --error ~/.pm2/logs/twodbet-error.log 2>&1); then
  success "PM2 start ပြီး"
else
  err "PM2 start မရပါ:\n$OUT"
fi

pm2 save > /dev/null 2>&1
STARTUP_CMD=$(pm2 startup 2>/dev/null | grep -E "^sudo|^env" || true)
[ -n "$STARTUP_CMD" ] && eval "$STARTUP_CMD" > /dev/null 2>&1 || true
success "PM2 reboot-safe setup ပြီး"

# ════════════════════════════════════════════════
# 8. Nginx
# ════════════════════════════════════════════════
echo ""
echo -e "${CYAN}── [8] Nginx ($DOMAIN) ─────────────────────────${NC}"

NGINX_CONF="/etc/nginx/sites-available/twodbet"
NGINX_ENABLED="/etc/nginx/sites-enabled/twodbet"
DIST_PATH="$PROJECT_DIR/dist"

mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

# Only rewrite if domain changed or file missing
CURRENT_DOMAIN=$(grep -m1 'server_name' "$NGINX_CONF" 2>/dev/null | awk '{print $2}' | tr -d ';' || echo "")

if [ "$CURRENT_DOMAIN" = "$DOMAIN" ] && [ -f "$NGINX_CONF" ]; then
  warn "Nginx config '$DOMAIN' ရှိပြီး — skip"
else
  info "Nginx config ရေးနေသည်..."
  cat > "$NGINX_CONF" <<NGINX_EOF
server {
    listen 80;
    server_name ${DOMAIN};

    root ${DIST_PATH};
    index index.html;

    location /api/ {
        proxy_pass http://localhost:${BACKEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }

    location /uploads/ {
        proxy_pass http://localhost:${BACKEND_PORT};
        proxy_set_header Host \$host;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
NGINX_EOF
  success "Nginx config ရေးပြီး"
fi

# Ensure include exists in nginx.conf
grep -q "sites-enabled" /etc/nginx/nginx.conf 2>/dev/null || \
  sed -i '/http {/a\\tinclude /etc/nginx/sites-enabled/*;' /etc/nginx/nginx.conf

# Enable site
[ -L "$NGINX_ENABLED" ] || ln -s "$NGINX_CONF" "$NGINX_ENABLED"
[ -L "/etc/nginx/sites-enabled/default" ] && rm -f /etc/nginx/sites-enabled/default || true

nginx -t > /dev/null 2>&1 && success "Nginx config valid" || err "Nginx config error — 'nginx -t' စစ်ပါ"
systemctl reload nginx > /dev/null 2>&1 && success "Nginx reload ပြီး"

# ════════════════════════════════════════════════
# 9. SSL
# ════════════════════════════════════════════════
if [[ "$USE_SSL" =~ ^[Yy]$ ]]; then
  echo ""
  echo -e "${CYAN}── [9] SSL / HTTPS ──────────────────────────────${NC}"

  CERT_PATH="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
  if [ -f "$CERT_PATH" ]; then
    warn "SSL cert '$DOMAIN' ရှိပြီး — skip (renew: certbot renew)"
  else
    command -v certbot >/dev/null 2>&1 || { info "certbot install..."; apt-get install -y certbot python3-certbot-nginx > /dev/null 2>&1; }

    info "SSL certificate ရယူနေသည်..."
    CB_FLAGS="--nginx -d $DOMAIN --non-interactive --agree-tos --redirect"
    [ -n "$SSL_EMAIL" ] && CB_FLAGS="$CB_FLAGS --email $SSL_EMAIL" || CB_FLAGS="$CB_FLAGS --register-unsafely-without-email"

    if eval certbot $CB_FLAGS > /dev/null 2>&1; then
      success "SSL certificate ရပြီး — HTTPS အသုံးပြုနိုင်ပြီ"
    else
      warn "SSL မရပါ — domain DNS ချိန်ညှိမှု ကောင်းရဲ့လားစစ်ပါ (HTTP ဖြင့် ဆက်သုံးနိုင်သည်)"
    fi

    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | sort -u | crontab -
    success "SSL auto-renew cron ထည့်ပြီး"
  fi
else
  info "SSL skip"
fi

# ════════════════════════════════════════════════
# Done
# ════════════════════════════════════════════════
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Setup ပြီးစီးပါပြီ!  ✓               ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
[[ "$USE_SSL" =~ ^[Yy]$ ]] && PROTO="https" || PROTO="http"
echo -e "  Website  : ${CYAN}${PROTO}://${DOMAIN}${NC}"
echo -e "  Admin    : ${CYAN}09000000000${NC}  /  ${CYAN}admin123${NC}"
echo -e "  ${YELLOW}(Login ဝင်ပြီးချက်ချင်း password ပြောင်းပါ!)${NC}"
echo ""
echo -e "  pm2 log twodbet       ${CYAN}# logs ကြည့်ရန်${NC}"
echo -e "  pm2 restart twodbet   ${CYAN}# restart${NC}"
echo -e "  bash install.sh       ${CYAN}# ပြန် run ရင် ပြီးသောstep skip မည်${NC}"
echo ""
