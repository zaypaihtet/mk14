const pool = require("../db");

const MULTIPLIER_2D = 85;
const MULTIPLIER_3D = 600;

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
    const userResult = await pool.query("SELECT balance FROM users WHERE id = $1", [req.user.id]);
    if (userResult.rows[0].balance < total) {
      return res.status(400).json({ message: "လက်ကျန်ငွေ မလုံလောက်ပါ" });
    }
    await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [total, req.user.id]);
    const bet = await pool.query(
      `INSERT INTO lottery_bets_2d (user_id, numbers, amount, total_amount, session, bet_date)
       VALUES ($1, $2, $3, $4, $5, NOW()::DATE) RETURNING *`,
      [req.user.id, JSON.stringify(numbers), perBet, total, session]
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
    const userResult = await pool.query("SELECT balance FROM users WHERE id = $1", [req.user.id]);
    if (userResult.rows[0].balance < total) {
      return res.status(400).json({ message: "လက်ကျန်ငွေ မလုံလောက်ပါ" });
    }
    await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [total, req.user.id]);
    const bet = await pool.query(
      `INSERT INTO lottery_bets_3d (user_id, numbers, amount, total_amount, bet_date)
       VALUES ($1, $2, $3, $4, NOW()::DATE) RETURNING *`,
      [req.user.id, JSON.stringify(numbers), perBet, total]
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
