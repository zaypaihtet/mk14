const express = require("express");
const router = express.Router();
const { getNotifications, markRead, sendNotification } = require("../controllers/notificationController");
const { authenticate, adminOnly } = require("../middleware/auth");
const pool = require("../db");

router.get("/", authenticate, getNotifications);
router.put("/:id/read", authenticate, markRead);
router.post("/", authenticate, adminOnly, sendNotification);

// Unread notification count (supports ?since=<ISO> for broadcast notifications)
router.get("/count", authenticate, async (req, res) => {
  try {
    const since = req.query.since ? new Date(req.query.since) : null;
    let r;
    if (since && !isNaN(since.getTime())) {
      // User-specific unread + broadcast created after last_seen
      r = await pool.query(
        `SELECT COUNT(*) FROM notifications
         WHERE (user_id = $1 AND is_read = FALSE)
            OR (user_id IS NULL AND created_at > $2)`,
        [req.user.id, since]
      );
    } else {
      r = await pool.query(
        "SELECT COUNT(*) FROM notifications WHERE (user_id = $1 OR user_id IS NULL) AND is_read = FALSE",
        [req.user.id]
      );
    }
    res.json({ count: parseInt(r.rows[0].count) });
  } catch {
    res.status(500).json({ count: 0 });
  }
});

// Mark all as read (user-specific) + returns server time for last_seen
router.put("/read-all", authenticate, async (req, res) => {
  try {
    await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE",
      [req.user.id]
    );
    res.json({ ok: true, seenAt: new Date().toISOString() });
  } catch {
    res.status(500).json({ ok: false });
  }
});

module.exports = router;
