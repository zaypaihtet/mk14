const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { JWT_SECRET } = require("../middleware/auth");

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const register = async (req, res) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ message: "အချက်အလက်များ မပြည့်စုံပါ" });
  }
  try {
    const existing = await pool.query("SELECT id FROM users WHERE phone = $1", [phone]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "ဖုန်းနံပါတ် မှတ်ပုံတင်ပြီးသားဖြစ်သည်" });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const referral_code = generateReferralCode();
    const result = await pool.query(
      `INSERT INTO users (name, phone, password_hash, referral_code)
       VALUES ($1, $2, $3, $4) RETURNING id, name, phone, role, balance, referral_code`,
      [name, phone, password_hash, referral_code]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ message: "အကောင့်ဖွင့်ပြီးပါပြီ", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server မှာ ပြဿနာဖြစ်နေသည်" });
  }
};

const login = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ message: "ဖုန်းနံပါတ်နှင့် စကားဝှက် ဖြည့်ပါ" });
  }
  try {
    const result = await pool.query("SELECT * FROM users WHERE phone = $1", [phone]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "ဖုန်းနံပါတ် သို့မဟုတ် စကားဝှက် မမှန်ကန်ပါ" });
    }
    const user = result.rows[0];
    if (user.is_banned) {
      return res.status(403).json({ message: "အကောင့်ကို ပိတ်ထားသည်" });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "ဖုန်းနံပါတ် သို့မဟုတ် စကားဝှက် မမှန်ကန်ပါ" });
    }
    const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      message: "အကောင့်ဝင်ပြီးပါပြီ",
      token,
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role, balance: user.balance, referral_code: user.referral_code },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server မှာ ပြဿနာဖြစ်နေသည်" });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, phone, role, balance, referral_code, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "အကောင့် မတွေ့ပါ" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server မှာ ပြဿနာဖြစ်နေသည်" });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "စကားဝှက် ဖြည့်ပါ" });
  }
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    const user = result.rows[0];
    const valid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!valid) return res.status(401).json({ message: "လက်ရှိ စကားဝှက် မမှန်ကန်ပါ" });
    const password_hash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [password_hash, req.user.id]);
    res.json({ message: "စကားဝှက် ပြောင်းပြီးပါပြီ" });
  } catch (err) {
    res.status(500).json({ message: "Server မှာ ပြဿနာဖြစ်နေသည်" });
  }
};

module.exports = { register, login, getMe, changePassword };
