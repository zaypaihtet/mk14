const pool = require("../db");
const path = require("path");

const getBalance = async (req, res) => {
  try {
    const result = await pool.query("SELECT balance FROM users WHERE id = $1", [req.user.id]);
    res.json({ balance: result.rows[0].balance });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const submitDeposit = async (req, res) => {
  const { amount, method, note } = req.body;
  if (!amount || !method) return res.status(400).json({ message: "Amount နှင့် Method ဖြည့်ပါ" });
  const receipt_image = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const result = await pool.query(
      `INSERT INTO deposits (user_id, amount, method, receipt_image, note)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, parseInt(amount), method, receipt_image, note || null]
    );
    res.status(201).json({ message: "ငွေဖြည့်မှု တင်ပြပြီးပါပြီ။ Admin အတည်ပြုရန် စောင့်ပါ", deposit: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const submitWithdraw = async (req, res) => {
  const { amount, account_number, account_name, bank_method } = req.body;
  if (!amount || !account_number || !account_name || !bank_method) {
    return res.status(400).json({ message: "အချက်အလက်များ မပြည့်စုံပါ" });
  }
  try {
    const userResult = await pool.query("SELECT balance FROM users WHERE id = $1", [req.user.id]);
    const balance = userResult.rows[0].balance;
    if (balance < parseInt(amount)) {
      return res.status(400).json({ message: "လက်ကျန်ငွေ မလုံလောက်ပါ" });
    }
    await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [parseInt(amount), req.user.id]);
    const result = await pool.query(
      `INSERT INTO withdrawals (user_id, amount, account_number, account_name, bank_method)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, parseInt(amount), account_number, account_name, bank_method]
    );
    res.status(201).json({ message: "ငွေထုတ်မှု တင်ပြပြီးပါပြီ", withdrawal: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTransactions = async (req, res) => {
  try {
    const deposits = await pool.query(
      `SELECT id, amount, method, status, created_at, 'deposit' AS type FROM deposits WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    const withdrawals = await pool.query(
      `SELECT id, amount, bank_method AS method, status, created_at, 'withdrawal' AS type FROM withdrawals WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    const all = [...deposits.rows, ...withdrawals.rows].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(all);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getBalance, submitDeposit, submitWithdraw, getTransactions };
