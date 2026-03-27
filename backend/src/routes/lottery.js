const express = require("express");
const router = express.Router();
const {
  getResults2D, getResults3D,
  placeBet2D, placeBet3D,
  getBettingHistory2D, getBettingHistory3D
} = require("../controllers/lotteryController");
const { authenticate } = require("../middleware/auth");
const pool = require("../db");

router.get("/results/2d", getResults2D);
router.get("/results/3d", getResults3D);

// Public: 2D number status (blocked + today totals vs limits)
router.get("/number-status/2d", async (req, res) => {
  try {
    const limits = await pool.query("SELECT * FROM lottery_number_limits_2d");
    const totals = await pool.query(`
      SELECT elem AS number, SUM(amount)::int AS today_total
      FROM lottery_bets_2d,
           jsonb_array_elements_text(numbers::jsonb) AS elem
      WHERE bet_date = CURRENT_DATE
      GROUP BY elem
    `);
    const limitsMap = {};
    limits.rows.forEach((r) => { limitsMap[r.number] = r; });
    const totalsMap = {};
    totals.rows.forEach((r) => { totalsMap[r.number] = r.today_total; });

    const data = Array.from({ length: 100 }, (_, i) => {
      const n = i.toString().padStart(2, "0");
      const lim = limitsMap[n] || { is_blocked: false, day_limit: 0 };
      const today_total = parseInt(totalsMap[n]) || 0;
      const is_full = lim.day_limit > 0 && today_total >= lim.day_limit;
      return {
        number: n,
        is_blocked: lim.is_blocked || is_full,
        day_limit: lim.day_limit,
        today_total,
        is_full,
      };
    });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.post("/bet/2d", authenticate, placeBet2D);
router.post("/bet/3d", authenticate, placeBet3D);
router.get("/history/2d", authenticate, getBettingHistory2D);
router.get("/history/3d", authenticate, getBettingHistory3D);

// Public: recent 2D winners
router.get("/winners/2d", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.id, b.numbers, b.amount, b.win_amount, b.session, b.bet_date,
             u.name, r.result_number
      FROM lottery_bets_2d b
      JOIN users u ON b.user_id = u.id
      LEFT JOIN lottery_results_2d r ON r.result_date = b.bet_date AND r.session = b.session
      WHERE b.status = 'won'
      ORDER BY b.bet_date DESC, b.created_at DESC
      LIMIT 15
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/history/2d-external", async (req, res) => {
  try {
    const response = await fetch("https://backend.shwemyanmar2d.com/api/lv/twod-result", {
      headers: { "Accept": "application/json" }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch 2D history" });
  }
});

router.get("/live/2d", async (req, res) => {
  try {
    const response = await fetch("https://luke.2dboss.com/api/luke/twod-result-live", {
      headers: { "Accept": "application/json" }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch live 2D result" });
  }
});

// Public: check if a date is a holiday (today if no ?date= param)
// Sundays are always holidays for 2D. Specific dates come from lottery_holidays table.
router.get("/is-holiday", async (req, res) => {
  try {
    const dateStr = req.query.date || new Date().toISOString().slice(0, 10);
    const d = new Date(dateStr + "T00:00:00Z");
    const dayOfWeek = d.getUTCDay(); // 0=Sun

    if (dayOfWeek === 0) {
      return res.json({ isHoliday: true, description: "တနင်္ဂနွေ ပိတ်ရက်", date: dateStr });
    }
    if (dayOfWeek === 6) {
      return res.json({ isHoliday: true, description: "စနေ ပိတ်ရက်", date: dateStr });
    }

    const r = await pool.query("SELECT * FROM lottery_holidays WHERE holiday_date = $1", [dateStr]);
    if (r.rows.length > 0) {
      return res.json({ isHoliday: true, description: r.rows[0].description, date: dateStr });
    }

    res.json({ isHoliday: false, date: dateStr });
  } catch (err) {
    res.status(500).json({ isHoliday: false, error: err.message });
  }
});

// Public: upcoming holidays list (next 30 days)
router.get("/upcoming-holidays", async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT * FROM lottery_holidays WHERE holiday_date >= CURRENT_DATE ORDER BY holiday_date ASC LIMIT 10"
    );
    res.json(r.rows);
  } catch {
    res.status(500).json([]);
  }
});

module.exports = router;
