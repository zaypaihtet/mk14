const pool = require("../db");

// Helper – get a single config value
const getConfigVal = async (key, fallback) => {
  const r = await pool.query("SELECT value FROM lottery_config WHERE key = $1", [key]);
  return r.rows[0] ? r.rows[0].value : fallback;
};

const getResults2D = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM lottery_results_2d ORDER BY result_date DESC, session ASC LIMIT 30"
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const getResults3D = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM lottery_results_3d ORDER BY result_date DESC LIMIT 20"
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const placeBet2D = async (req, res) => {
  const { numbers, amount, session } = req.body;
  if (!numbers || !Array.isArray(numbers) || numbers.length === 0 || !amount || !session) {
    return res.status(400).json({ message: "အချက်အလက်များ မပြည့်စုံပါ" });
  }
  if (!["morning", "evening"].includes(session)) {
    return res.status(400).json({ message: "Session မမှန်ကန်ပါ" });
  }
  const perBet = parseInt(amount);
  const total = perBet * numbers.length;

  try {
    // ── Check blocked numbers & day limits ──────────────────────
    const limitsResult = await pool.query(
      "SELECT number, is_blocked, day_limit FROM lottery_number_limits_2d WHERE number = ANY($1)",
      [numbers]
    );
    const totalsResult = await pool.query(
      `SELECT elem AS number, SUM(amount)::int AS today_total
       FROM lottery_bets_2d,
            jsonb_array_elements_text(numbers::jsonb) AS elem
       WHERE bet_date = CURRENT_DATE AND elem = ANY($1)
       GROUP BY elem`,
      [numbers]
    );
    const limMap = {};
    limitsResult.rows.forEach((r) => { limMap[r.number] = r; });
    const totMap = {};
    totalsResult.rows.forEach((r) => { totMap[r.number] = r.today_total; });

    for (const n of numbers) {
      const lim = limMap[n];
      if (lim?.is_blocked) {
        return res.status(400).json({ message: `${n} နံပါတ်ကို ပိတ်ထားသည်` });
      }
      if (lim?.day_limit > 0) {
        const already = parseInt(totMap[n]) || 0;
        const remaining = lim.day_limit - already;
        if (remaining <= 0) {
          return res.status(400).json({ message: `${n} — ထိုးနိုင်သောဖိုး ပြည့်ပြီ` });
        }
        if (perBet > remaining) {
          return res.status(400).json({ message: `${n} — ကျန်ထိုးနိုင်သောဖိုး ${remaining.toLocaleString()} ကျပ်သာ` });
        }
      }
    }

    // ── Fetch multiplier ────────────────────────────────────────
    const multiplierVal = await getConfigVal("multiplier_2d", "85");
    const multiplier = parseInt(multiplierVal) || 85;

    const userResult = await pool.query("SELECT balance FROM users WHERE id = $1", [req.user.id]);
    if (userResult.rows[0].balance < total) {
      return res.status(400).json({ message: "လက်ကျန်ငွေ မလုံလောက်ပါ" });
    }
    await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [total, req.user.id]);
    const bet = await pool.query(
      `INSERT INTO lottery_bets_2d (user_id, numbers, amount, total_amount, session, bet_date, multiplier)
       VALUES ($1, $2, $3, $4, $5, NOW()::DATE, $6) RETURNING *`,
      [req.user.id, JSON.stringify(numbers), perBet, total, session, multiplier]
    );
    res.status(201).json({ message: "ထိုးကောင်းပြီ", bet: bet.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const placeBet3D = async (req, res) => {
  const { numbers, amount } = req.body;
  if (!numbers || !Array.isArray(numbers) || numbers.length === 0 || !amount) {
    return res.status(400).json({ message: "အချက်အလက်များ မပြည့်စုံပါ" });
  }
  const perBet = parseInt(amount);
  const total = perBet * numbers.length;

  try {
    const multiplierVal = await getConfigVal("multiplier_3d", "600");
    const multiplier = parseInt(multiplierVal) || 600;

    const userResult = await pool.query("SELECT balance FROM users WHERE id = $1", [req.user.id]);
    if (userResult.rows[0].balance < total) {
      return res.status(400).json({ message: "လက်ကျန်ငွေ မလုံလောက်ပါ" });
    }
    await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [total, req.user.id]);
    const bet = await pool.query(
      `INSERT INTO lottery_bets_3d (user_id, numbers, amount, total_amount, bet_date, multiplier)
       VALUES ($1, $2, $3, $4, NOW()::DATE, $5) RETURNING *`,
      [req.user.id, JSON.stringify(numbers), perBet, total, multiplier]
    );
    res.status(201).json({ message: "ထိုးကောင်းပြီ", bet: bet.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getBettingHistory2D = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM lottery_bets_2d WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const getBettingHistory3D = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM lottery_bets_3d WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getResults2D, getResults3D, placeBet2D, placeBet3D, getBettingHistory2D, getBettingHistory3D };
