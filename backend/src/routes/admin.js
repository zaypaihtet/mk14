const express = require("express");
const router = express.Router();
const {
  getDashboardStats, getUsers, getAgents, createAgent, toggleBanUser, deleteUser,
  getDeposits, updateDepositStatus, getWithdrawals, updateWithdrawalStatus,
  getBets2D, publishResult2D, publishResult3D,
} = require("../controllers/adminController");
const { authenticate, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(authenticate, adminOnly);

router.get("/dashboard", getDashboardStats);
router.get("/users", getUsers);
router.get("/agents", getAgents);
router.post("/agents", createAgent);
router.patch("/users/:id/ban", toggleBanUser);
router.delete("/users/:id", deleteUser);
router.get("/deposits", getDeposits);
router.patch("/deposits/:id/status", updateDepositStatus);
router.get("/withdrawals", getWithdrawals);
router.patch("/withdrawals/:id/status", updateWithdrawalStatus);
router.get("/bets/2d", getBets2D);
router.post("/results/2d", publishResult2D);
router.post("/results/3d", publishResult3D);

const pool = require("../db");
const { sendTelegram } = require("../utils/telegram");

// Test Telegram connection
router.post("/telegram/test", async (req, res) => {
  try {
    await sendTelegram("✅ <b>KM Fourteen Bot Test</b>\nTelegram Bot ချိတ်ဆက်မှု အောင်မြင်ပါသည်!");
    res.json({ message: "Test message ပေးပို့ပြီးပါပြီ" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get("/config", async (req, res) => {
  try {
    const result = await pool.query("SELECT key, value FROM lottery_config");
    const config = {};
    result.rows.forEach((r) => { config[r.key] = r.value; });
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/config", async (req, res) => {
  try {
    const entries = Object.entries(req.body);
    for (const [key, value] of entries) {
      await pool.query(
        `INSERT INTO lottery_config (key, value) VALUES ($2, $1)
         ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
        [String(value), key]
      );
    }
    res.json({ message: "Config updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Banner / Logo upload
router.post("/upload/banner", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "ဖိုင် မတင်မိပါ" });
  const url = `/uploads/${req.file.filename}`;
  try {
    await pool.query(
      "INSERT INTO lottery_config (key, value) VALUES ('banner_url', $1) ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()",
      [url]
    );
    res.json({ url });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Multi-banner: add one image to banner_urls array
router.post("/upload/banners", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "ဖိုင် မတင်မိပါ" });
  const url = `/uploads/${req.file.filename}`;
  try {
    const current = await pool.query("SELECT value FROM lottery_config WHERE key = 'banner_urls'");
    const arr = JSON.parse(current.rows[0]?.value || "[]");
    arr.push(url);
    await pool.query(
      "INSERT INTO lottery_config (key, value) VALUES ('banner_urls', $1) ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()",
      [JSON.stringify(arr)]
    );
    res.json({ url, banners: arr });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Multi-banner: delete one image by index
router.delete("/banners/:index", async (req, res) => {
  const idx = parseInt(req.params.index, 10);
  try {
    const current = await pool.query("SELECT value FROM lottery_config WHERE key = 'banner_urls'");
    const arr = JSON.parse(current.rows[0]?.value || "[]");
    if (idx < 0 || idx >= arr.length) return res.status(400).json({ message: "Index မမှန်ကန်ပါ" });
    arr.splice(idx, 1);
    await pool.query(
      "UPDATE lottery_config SET value = $1, updated_at = NOW() WHERE key = 'banner_urls'",
      [JSON.stringify(arr)]
    );
    res.json({ banners: arr });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/upload/logo", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "ဖိုင် မတင်မိပါ" });
  const url = `/uploads/${req.file.filename}`;
  try {
    await pool.query(
      "INSERT INTO lottery_config (key, value) VALUES ('logo_url', $1) ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()",
      [url]
    );
    res.json({ url });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin notification management
router.get("/notifications", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100"
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/notifications/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM notifications WHERE id = $1", [req.params.id]);
    res.json({ message: "ဖျက်ပြီးပါပြီ" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ── 2D Number Limits ─────────────────────────────────────────────────────────
// Helper: get today's total bet per number
async function getNumberTotals() {
  const r = await pool.query(`
    SELECT elem AS number, SUM(amount)::int AS today_total
    FROM lottery_bets_2d,
         jsonb_array_elements_text(numbers::jsonb) AS elem
    WHERE bet_date = CURRENT_DATE
    GROUP BY elem
  `);
  const map = {};
  r.rows.forEach((row) => { map[row.number] = row.today_total; });
  return map;
}

router.get("/number-limits/2d", async (req, res) => {
  try {
    const limits = await pool.query("SELECT * FROM lottery_number_limits_2d");
    const totals = await getNumberTotals();
    const limitsMap = {};
    limits.rows.forEach((r) => { limitsMap[r.number] = r; });

    const data = Array.from({ length: 100 }, (_, i) => {
      const n = i.toString().padStart(2, "0");
      const lim = limitsMap[n] || { number: n, is_blocked: false, day_limit: 0 };
      const today_total = totals[n] || 0;
      return { number: n, is_blocked: lim.is_blocked, day_limit: lim.day_limit, today_total };
    });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Bulk update: [{number, is_blocked, day_limit}]
router.put("/number-limits/2d", async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates)) return res.status(400).json({ message: "updates array လိုသည်" });
    for (const u of updates) {
      await pool.query(
        `INSERT INTO lottery_number_limits_2d (number, is_blocked, day_limit)
         VALUES ($1, $2, $3)
         ON CONFLICT (number) DO UPDATE SET is_blocked = $2, day_limit = $3`,
        [u.number, !!u.is_blocked, parseInt(u.day_limit) || 0]
      );
    }
    res.json({ message: "Updated" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Set global day_limit for ALL numbers at once
router.patch("/number-limits/2d/global", async (req, res) => {
  try {
    const { day_limit } = req.body;
    const limit = parseInt(day_limit) || 0;
    for (let i = 0; i < 100; i++) {
      const n = i.toString().padStart(2, "0");
      await pool.query(
        `INSERT INTO lottery_number_limits_2d (number, day_limit)
         VALUES ($1, $2)
         ON CONFLICT (number) DO UPDATE SET day_limit = $2`,
        [n, limit]
      );
    }
    res.json({ message: "Global limit updated" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Holiday management ────────────────────────────────────────────────────────
router.get("/holidays", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM lottery_holidays ORDER BY holiday_date ASC");
    res.json(r.rows);
  } catch { res.status(500).json({ message: "Server error" }); }
});

router.post("/holidays", async (req, res) => {
  const { holiday_date, description } = req.body;
  if (!holiday_date || !description) return res.status(400).json({ message: "Date နှင့် ဖော်ပြချက် ဖြည့်ပါ" });
  try {
    const r = await pool.query(
      "INSERT INTO lottery_holidays (holiday_date, description) VALUES ($1, $2) ON CONFLICT (holiday_date) DO UPDATE SET description = $2, created_at = NOW() RETURNING *",
      [holiday_date, description]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete("/holidays/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM lottery_holidays WHERE id = $1", [req.params.id]);
    res.json({ message: "ဖျက်ပြီးပါပြီ" });
  } catch { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;
