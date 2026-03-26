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

module.exports = router;
