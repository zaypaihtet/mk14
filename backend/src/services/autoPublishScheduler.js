const pool = require("../db");
const { runPublish2D } = require("./publish2D");

const EXTERNAL_API = "https://luke.2dboss.com/api/luke/twod-result-live";
const CHECK_INTERVAL_MS = 60 * 1000; // every 1 minute

// Parse "DD/MM/YYYY" → "YYYY-MM-DD"
const parseDate = (ddmmyyyy = "") => {
  const [dd, mm, yyyy] = ddmmyyyy.split("/");
  if (!dd || !mm || !yyyy) return null;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
};

const isReal = (val) => val && val !== "--" && !isNaN(Number(val));

// Check if a result is already published in DB
const alreadyPublished = async (result_date, session) => {
  const row = await pool.query(
    "SELECT id FROM lottery_results_2d WHERE result_date = $1 AND session = $2",
    [result_date, session]
  );
  return row.rows.length > 0;
};

const checkAndPublish = async () => {
  try {
    const res  = await fetch(EXTERNAL_API, { headers: { Accept: "application/json" } });
    const json = await res.json();
    const data = json?.data;
    if (!data) return;

    const result_date = parseDate(data.date);
    if (!result_date) return;

    // ── Morning 12:00 ──────────────────────────────────────────
    if (isReal(data.result_1200)) {
      const done = await alreadyPublished(result_date, "morning");
      if (!done) {
        const { message } = await runPublish2D(data.result_1200, "morning", result_date);
        console.log(`[AutoPublish] Morning 2D ${result_date}: ${message}`);
      }
    }

    // ── Evening 4:30 ───────────────────────────────────────────
    if (isReal(data.result_430)) {
      const done = await alreadyPublished(result_date, "evening");
      if (!done) {
        const { message } = await runPublish2D(data.result_430, "evening", result_date);
        console.log(`[AutoPublish] Evening 2D ${result_date}: ${message}`);
      }
    }
  } catch (err) {
    console.error("[AutoPublish] Error:", err.message);
  }
};

const startAutoPublish = () => {
  console.log("[AutoPublish] Scheduler started — checking every 60s");
  checkAndPublish(); // run immediately on startup
  setInterval(checkAndPublish, CHECK_INTERVAL_MS);
};

module.exports = { startAutoPublish };
