const express = require("express");
const router = express.Router();
const {
  getResults2D, getResults3D,
  placeBet2D, placeBet3D,
  getBettingHistory2D, getBettingHistory3D
} = require("../controllers/lotteryController");
const { authenticate } = require("../middleware/auth");

router.get("/results/2d", getResults2D);
router.get("/results/3d", getResults3D);
router.post("/bet/2d", authenticate, placeBet2D);
router.post("/bet/3d", authenticate, placeBet3D);
router.get("/history/2d", authenticate, getBettingHistory2D);
router.get("/history/3d", authenticate, getBettingHistory3D);

module.exports = router;
