const express = require("express");
const router = express.Router();
const { getBalance, submitDeposit, submitWithdraw, getTransactions } = require("../controllers/walletController");
const { authenticate } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/balance", authenticate, getBalance);
router.post("/deposit", authenticate, upload.single("receipt"), submitDeposit);
router.post("/withdraw", authenticate, submitWithdraw);
router.get("/transactions", authenticate, getTransactions);

module.exports = router;
