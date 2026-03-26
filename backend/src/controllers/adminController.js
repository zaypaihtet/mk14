const bcrypt = require("bcryptjs");
const pool = require("../db");

const getDashboardStats = async (req, res) => {
  try {
    const [users, agents, deposits, withdrawals, bets2d, bets3d] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'user'"),
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'agent'"),
      pool.query("SELECT COUNT(*), COALESCE(SUM(amount),0) AS total FROM deposits WHERE status = 'approved'"),
      pool.query("SELECT COUNT(*), COALESCE(SUM(amount),0) AS total FROM withdrawals WHERE status = 'approved'"),
      pool.query("SELECT COUNT(*) FROM lottery_bets_2d WHERE bet_date = NOW()::DATE"),
      pool.query("SELECT COUNT(*) FROM lottery_bets_3d"),
    ]);
    res.json({
      users: users.rows[0].count,
      agents: agents.rows[0].count,
      deposits: { count: deposits.rows[0].count, total: deposits.rows[0].total },
      withdrawals: { count: withdrawals.rows[0].count, total: withdrawals.rows[0].total },
      bets2d_today: bets2d.rows[0].count,
      bets3d_total: bets3d.rows[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, phone, role, balance, is_banned, referral_code, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const getAgents = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, phone, role, balance, is_banned, referral_code, created_at FROM users WHERE role = 'agent' ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const createAgent = async (req, res) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password) return res.status(400).json({ message: "အချက်အလက်မပြည့်စုံပါ" });
  try {
    const existing = await pool.query("SELECT id FROM users WHERE phone = $1", [phone]);
    if (existing.rows.length > 0) return res.status(409).json({ message: "ဖုန်းနံပါတ် ရှိပြီးသား" });
    const password_hash = await bcrypt.hash(password, 10);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const result = await pool.query(
      "INSERT INTO users (name, phone, password_hash, role, referral_code) VALUES ($1,$2,$3,'agent',$4) RETURNING id,name,phone,role",
      [name, phone, password_hash, code]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const toggleBanUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE users SET is_banned = NOT is_banned WHERE id = $1 RETURNING id, is_banned",
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "User မတွေ့ပါ" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1 AND role != 'admin'", [id]);
    res.json({ message: "ဖျက်ပြီးပါပြီ" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const getDeposits = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, u.name, u.phone FROM deposits d
       JOIN users u ON d.user_id = u.id
       ORDER BY d.created_at DESC`
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const updateDepositStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Status မမှန်ကန်ပါ" });
  try {
    const dep = await pool.query("SELECT * FROM deposits WHERE id = $1", [id]);
    if (dep.rows.length === 0) return res.status(404).json({ message: "မတွေ့ပါ" });
    const deposit = dep.rows[0];
    if (deposit.status !== "pending") return res.status(400).json({ message: "ပြောင်းလဲ၍ မရတော့ပါ" });
    await pool.query("UPDATE deposits SET status = $1 WHERE id = $2", [status, id]);
    if (status === "approved") {
      await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [deposit.amount, deposit.user_id]);
    }
    res.json({ message: `Deposit ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getWithdrawals = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.*, u.name, u.phone FROM withdrawals w
       JOIN users u ON w.user_id = u.id
       ORDER BY w.created_at DESC`
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const updateWithdrawalStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Status မမှန်ကန်ပါ" });
  try {
    const wdr = await pool.query("SELECT * FROM withdrawals WHERE id = $1", [id]);
    if (wdr.rows.length === 0) return res.status(404).json({ message: "မတွေ့ပါ" });
    const withdrawal = wdr.rows[0];
    if (withdrawal.status !== "pending") return res.status(400).json({ message: "ပြောင်းလဲ၍ မရတော့ပါ" });
    await pool.query("UPDATE withdrawals SET status = $1 WHERE id = $2", [status, id]);
    if (status === "rejected") {
      await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [withdrawal.amount, withdrawal.user_id]);
    }
    res.json({ message: `Withdrawal ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getBets2D = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.name, u.phone FROM lottery_bets_2d b
       JOIN users u ON b.user_id = u.id
       ORDER BY b.created_at DESC LIMIT 200`
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const { runPublish2D } = require("../services/publish2D");

const publishResult2D = async (req, res) => {
  const { result_number, session, result_date } = req.body;
  if (!result_number || !session || !result_date)
    return res.status(400).json({ message: "အချက်အလက်မပြည့်စုံပါ" });
  try {
    const { message } = await runPublish2D(result_number, session, result_date);
    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const publishResult3D = async (req, res) => {
  const { result_number, result_date } = req.body;
  if (!result_number || !result_date) return res.status(400).json({ message: "အချက်အလက်မပြည့်စုံပါ" });
  try {
    await pool.query(
      "INSERT INTO lottery_results_3d (result_number, result_date) VALUES ($1, $2)",
      [result_number, result_date]
    );
    const bets = await pool.query(
      "SELECT * FROM lottery_bets_3d WHERE bet_date = $1 AND status = 'pending'",
      [result_date]
    );
    let winnersCount = 0;
    for (const bet of bets.rows) {
      const numbers = Array.isArray(bet.numbers) ? bet.numbers : JSON.parse(bet.numbers || "[]");
      const won = numbers.includes(result_number);
      const multiplier = bet.multiplier || 600;
      if (won) {
        const winAmount = bet.amount * multiplier;
        await pool.query(
          "UPDATE lottery_bets_3d SET status = 'won', win_amount = $1 WHERE id = $2",
          [winAmount, bet.id]
        );
        await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [winAmount, bet.user_id]);
        winnersCount++;
      } else {
        await pool.query("UPDATE lottery_bets_3d SET status = 'lost' WHERE id = $1", [bet.id]);
      }
    }
    res.json({ message: `3D ရလဒ် ထုတ်ပြန်ပြီးပါပြီ — နိုင်သူ ${winnersCount} ဦး` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDashboardStats, getUsers, getAgents, createAgent, toggleBanUser, deleteUser,
  getDeposits, updateDepositStatus, getWithdrawals, updateWithdrawalStatus,
  getBets2D, publishResult2D, publishResult3D,
};
