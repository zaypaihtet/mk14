const express = require("express");
const router = express.Router();
const {
  getDashboardStats, getUsers, getAgents, createAgent, toggleBanUser, deleteUser,
  getDeposits, updateDepositStatus, getWithdrawals, updateWithdrawalStatus,
  getBets2D, publishResult2D, publishResult3D,
} = require("../controllers/adminController");
const { authenticate, adminOnly } = require("../middleware/auth");

router.use(authenticate, adminOnly);

router.get("/dashboard", getDashboardStats);
router.get("/users", getUsers);
router.get("/agents", getAgents);
router.post("/agents", createAgent);
router.patch("/users/:id/ban", toggleBanUser);
router.delete("/users/:id", deleteUser);
router.get("/deposits", getDeposits);
router.patch("/deposits/:id/status", updateDepositStatus);
router.get("/withdrawals", getWithdrawals);
router.patch("/withdrawals/:id/status", updateWithdrawalStatus);
router.get("/bets/2d", getBets2D);
router.post("/results/2d", publishResult2D);
router.post("/results/3d", publishResult3D);

const pool = require("../db");

router.get("/config", async (req, res) => {
  try {
    const result = await pool.query("SELECT key, value FROM lottery_config");
    const config = {};
    result.rows.forEach((r) => { config[r.key] = r.value; });
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/config", async (req, res) => {
  try {
    const entries = Object.entries(req.body);
    for (const [key, value] of entries) {
      await pool.query(
        "UPDATE lottery_config SET value=$1, updated_at=NOW() WHERE key=$2",
        [String(value), key]
      );
    }
    res.json({ message: "Config updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
