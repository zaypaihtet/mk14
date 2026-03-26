require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");
const lotteryRoutes = require("./routes/lottery");
const notificationRoutes = require("./routes/notifications");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.BACKEND_PORT || 8000;

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/lottery", lotteryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`TwoDbet Backend running on http://localhost:${PORT}`);
});

module.exports = app;
// Note: To serve built frontend in production, add:
// const path = require('path');
// app.use(express.static(path.join(__dirname, '../../dist')));
// app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../dist/index.html')));
