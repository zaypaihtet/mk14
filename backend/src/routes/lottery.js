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

router.get("/history/2d-external", async (req, res) => {
  try {
    const response = await fetch("https://backend.shwemyanmar2d.com/api/lv/twod-result", {
      headers: { "Accept": "application/json" }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch 2D history" });
  }
});

router.get("/live/2d", async (req, res) => {
  try {
    const response = await fetch("https://luke.2dboss.com/api/luke/twod-result-live", {
      headers: { "Accept": "application/json" }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch live 2D result" });
  }
});

module.exports = router;
