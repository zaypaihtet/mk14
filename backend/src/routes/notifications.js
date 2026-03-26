const express = require("express");
const router = express.Router();
const { getNotifications, markRead, sendNotification } = require("../controllers/notificationController");
const { authenticate, adminOnly } = require("../middleware/auth");

router.get("/", authenticate, getNotifications);
router.put("/:id/read", authenticate, markRead);
router.post("/", authenticate, adminOnly, sendNotification);

module.exports = router;
