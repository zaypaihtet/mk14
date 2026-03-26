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
        "UPDATE lottery_config SET value=$1, updated_at=NOW() WHERE key=$2",
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

module.exports = router;
