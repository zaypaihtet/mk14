const express = require("express");
const router = express.Router();
const { getNotifications, markRead, sendNotification } = require("../controllers/notificationController");
const { authenticate, adminOnly } = require("../middleware/auth");
const pool = require("../db");

router.get("/", authenticate, getNotifications);
router.put("/:id/read", authenticate, markRead);
router.post("/", authenticate, adminOnly, sendNotification);

// Unread notification count
router.get("/count", authenticate, async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT COUNT(*) FROM notifications WHERE (user_id = $1 OR user_id IS NULL) AND is_read = FALSE",
      [req.user.id]
    );
    res.json({ count: parseInt(r.rows[0].count) });
  } catch {
    res.status(500).json({ count: 0 });
  }
});

module.exports = router;
