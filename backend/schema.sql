-- ─────────────────────────────────────────────────────────────
--  TwoDbet Database Schema
--  Run: psql -U postgres -d twodbet -f schema.sql
-- ─────────────────────────────────────────────────────────────

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  phone         VARCHAR(20)   NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          VARCHAR(20)   NOT NULL DEFAULT 'user',
  balance       BIGINT        NOT NULL DEFAULT 0,
  is_banned     BOOLEAN       NOT NULL DEFAULT FALSE,
  referral_code VARCHAR(20),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Deposits ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deposits (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount        BIGINT        NOT NULL,
  method        VARCHAR(50)   NOT NULL,
  receipt_image VARCHAR(255),
  note          TEXT,
  status        VARCHAR(20)   NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Withdrawals ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS withdrawals (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount         BIGINT       NOT NULL,
  account_number VARCHAR(50)  NOT NULL,
  account_name   VARCHAR(100) NOT NULL,
  bank_method    VARCHAR(50)  NOT NULL,
  status         VARCHAR(20)  NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Lottery Results 2D ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS lottery_results_2d (
  id            SERIAL PRIMARY KEY,
  result_number VARCHAR(10)   NOT NULL,
  session       VARCHAR(20)   NOT NULL,
  result_date   DATE          NOT NULL,
  published     BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT lottery_results_2d_date_session_key UNIQUE (result_date, session)
);

-- ── Lottery Results 3D ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS lottery_results_3d (
  id            SERIAL PRIMARY KEY,
  result_number VARCHAR(10)   NOT NULL,
  result_date   DATE          NOT NULL,
  published     BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Lottery Bets 2D ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lottery_bets_2d (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  numbers      TEXT          NOT NULL,
  amount       BIGINT        NOT NULL,
  total_amount BIGINT        NOT NULL,
  session      VARCHAR(20)   NOT NULL,
  bet_date     DATE          NOT NULL,
  status       VARCHAR(20)   NOT NULL DEFAULT 'pending',
  multiplier   INTEGER       NOT NULL DEFAULT 85,
  win_amount   BIGINT,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Lottery Bets 3D ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lottery_bets_3d (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  numbers      TEXT          NOT NULL,
  amount       BIGINT        NOT NULL,
  total_amount BIGINT        NOT NULL,
  bet_date     DATE          NOT NULL,
  status       VARCHAR(20)   NOT NULL DEFAULT 'pending',
  multiplier   INTEGER       NOT NULL DEFAULT 600,
  win_amount   BIGINT,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Notifications ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(255) NOT NULL,
  message    TEXT         NOT NULL,
  is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Lottery Config ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lottery_config (
  key        VARCHAR(100) PRIMARY KEY,
  value      TEXT         NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Lottery Holidays ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lottery_holidays (
  id           SERIAL PRIMARY KEY,
  holiday_date DATE         NOT NULL UNIQUE,
  description  VARCHAR(255),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
--  Default Config Values
-- ─────────────────────────────────────────────────────────────
INSERT INTO lottery_config (key, value) VALUES
  ('2d_morning_close', '11:58'),
  ('2d_evening_close', '15:58'),
  ('3d_enabled',       'true'),
  ('3d_open_days',     'MON,TUE,WED,THU,FRI,SAT'),
  ('show_dubai_2d',    'true'),
  ('show_dubai_3d',    'true'),
  ('show_mega_2d',     'true'),
  ('multiplier_2d',    '85'),
  ('multiplier_3d',    '600'),
  ('contact_facebook', ''),
  ('contact_viber',    ''),
  ('contact_phone',    ''),
  ('site_name',        'KM Fourteen'),
  ('marquee_text',     'Myanmar2D 85ဆ၊ Myanmar3D 600ဆ၊ Dubai2D 85ဆ — ရောင်းပိတ်ချိန် မနက် 11:58 AM၊ ညနေ 3:58 PM'),
  ('popup_title',      'အထူးကမ်းလှမ်းချက်!'),
  ('popup_text',       'ယနေ့ပဲ စတင်ကစားပါ!'),
  ('wave_number',      ''),
  ('wave_name',        ''),
  ('kpay_number',      ''),
  ('kpay_name',        '')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
--  Default Admin Account
--  phone: 09000000000  password: admin123
-- ─────────────────────────────────────────────────────────────
INSERT INTO users (name, phone, password_hash, role, referral_code)
VALUES (
  'Admin',
  '09000000000',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  'ADMIN0'
) ON CONFLICT (phone) DO NOTHING;
