const pool = require("../db");

const getNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications
       WHERE user_id = $1 OR user_id IS NULL
       ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const markRead = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    res.json({ message: "ဖတ်ပြီးပါပြီ" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const sendNotification = async (req, res) => {
  const { title, message, user_id } = req.body;
  if (!title || !message) return res.status(400).json({ message: "Title နှင့် Message ဖြည့်ပါ" });
  try {
    const result = await pool.query(
      "INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3) RETURNING *",
      [user_id || null, title, message]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getNotifications, markRead, sendNotification };
