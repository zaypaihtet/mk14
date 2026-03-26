const pool = require("../db");
const { runPublish2D } = require("./publish2D");

const EXTERNAL_2D_API   = "https://luke.2dboss.com/api/luke/twod-result-live";
const EXTERNAL_3D_API   = "https://api.thai2d3dgame.com/api/result/GetList3dResult?searchKey=&pageNumber=1&rowsOfPage=1";
const CHECK_INTERVAL_MS = 60 * 1000; // every 1 minute

// Parse "DD/MM/YYYY" → "YYYY-MM-DD"
const parseDate = (ddmmyyyy = "") => {
  const [dd, mm, yyyy] = ddmmyyyy.split("/");
  if (!dd || !mm || !yyyy) return null;
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
};

const isReal = (val) => val && val !== "--" && !isNaN(Number(val));

// Check if a 2D result is already published
const alreadyPublished2D = async (result_date, session) => {
  const row = await pool.query(
    "SELECT id FROM lottery_results_2d WHERE result_date = $1 AND session = $2",
    [result_date, session]
  );
  return row.rows.length > 0;
};

// Check if a 3D result is already published for the given date
const alreadyPublished3D = async (result_date) => {
  const row = await pool.query(
    "SELECT id FROM lottery_results_3d WHERE result_date = $1",
    [result_date]
  );
  return row.rows.length > 0;
};

// Auto-publish 3D result + process winning bets
const runPublish3D = async (result_number, result_date) => {
  // Insert result
  await pool.query(
    "INSERT INTO lottery_results_3d (result_number, result_date) VALUES ($1, $2)",
    [result_number, result_date]
  );

  // Process pending bets for this date
  const bets = await pool.query(
    "SELECT * FROM lottery_bets_3d WHERE bet_date = $1 AND status = 'pending'",
    [result_date]
  );

  let winnersCount = 0;
  for (const bet of bets.rows) {
    const numbers = Array.isArray(bet.numbers) ? bet.numbers : JSON.parse(bet.numbers || "[]");
    const won = numbers.includes(result_number);
    const multiplier = bet.multiplier || 600;
    if (won) {
      const winAmount = bet.amount * multiplier;
      await pool.query(
        "UPDATE lottery_bets_3d SET status = 'won', win_amount = $1 WHERE id = $2",
        [winAmount, bet.id]
      );
      await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [winAmount, bet.user_id]);
      winnersCount++;
    } else {
      await pool.query("UPDATE lottery_bets_3d SET status = 'lost' WHERE id = $1", [bet.id]);
    }
  }
  return { winnersCount };
};

// ── 2D check ──────────────────────────────────────────────────────────────────
const checkAndPublish2D = async () => {
  try {
    const res  = await fetch(EXTERNAL_2D_API, { headers: { Accept: "application/json" } });
    const json = await res.json();
    const data = json?.data;
    if (!data) return;

    const result_date = parseDate(data.date);
    if (!result_date) return;

    if (isReal(data.result_1200)) {
      const done = await alreadyPublished2D(result_date, "morning");
      if (!done) {
        const { message } = await runPublish2D(data.result_1200, "morning", result_date);
        console.log(`[AutoPublish 2D] Morning ${result_date}: ${message}`);
      }
    }

    if (isReal(data.result_430)) {
      const done = await alreadyPublished2D(result_date, "evening");
      if (!done) {
        const { message } = await runPublish2D(data.result_430, "evening", result_date);
        console.log(`[AutoPublish 2D] Evening ${result_date}: ${message}`);
      }
    }
  } catch (err) {
    console.error("[AutoPublish 2D] Error:", err.message);
  }
};

// ── 3D check ──────────────────────────────────────────────────────────────────
const checkAndPublish3D = async () => {
  try {
    const res  = await fetch(EXTERNAL_3D_API, { headers: { Accept: "application/json" } });
    const json = await res.json();
    const latest = json?.results?.[0];
    if (!latest || !latest.number || !latest.for_date_time) return;

    // Normalise date → "YYYY-MM-DD"
    const result_date = latest.for_date_time.slice(0, 10);
    if (!result_date) return;

    const done = await alreadyPublished3D(result_date);
    if (!done) {
      const { winnersCount } = await runPublish3D(latest.number, result_date);
      console.log(`[AutoPublish 3D] ${result_date}: ${latest.number} (winners: ${winnersCount})`);
    }
  } catch (err) {
    console.error("[AutoPublish 3D] Error:", err.message);
  }
};

const startAutoPublish = () => {
  console.log("[AutoPublish] Scheduler started — checking every 60s");

  // Run both immediately on startup
  checkAndPublish2D();
  checkAndPublish3D();

  // 2D: every 60s
  setInterval(checkAndPublish2D, CHECK_INTERVAL_MS);

  // 3D: every 4 hours (results only come on 1st & 16th of month)
  setInterval(checkAndPublish3D, 4 * 60 * 60 * 1000);
};

module.exports = { startAutoPublish };
