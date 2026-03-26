const pool = require("../db");

/**
 * Core 2D publish logic — used by both admin HTTP route and auto-scheduler.
 * Returns { winnersCount, message }
 */
const runPublish2D = async (result_number, session, result_date) => {
  const padded = String(result_number).padStart(2, "0");

  // Save / upsert result
  await pool.query(
    `INSERT INTO lottery_results_2d (result_number, session, result_date)
     VALUES ($1, $2, $3)
     ON CONFLICT (result_date, session) DO UPDATE SET result_number = EXCLUDED.result_number`,
    [padded, session, result_date]
  );

  // Fetch all pending bets for this date + session
  const bets = await pool.query(
    "SELECT * FROM lottery_bets_2d WHERE bet_date = $1 AND session = $2 AND status = 'pending'",
    [result_date, session]
  );

  let winnersCount = 0;
  const winnerInfos = [];

  for (const bet of bets.rows) {
    // Support both single `number` column and JSON `numbers` array column
    let betNumbers;
    if (bet.numbers !== undefined) {
      betNumbers = Array.isArray(bet.numbers) ? bet.numbers : JSON.parse(bet.numbers || "[]");
    } else {
      betNumbers = [bet.number];
    }
    const won = betNumbers.includes(padded) || betNumbers.includes(result_number.toString());
    const multiplier = bet.multiplier || 85;

    if (won) {
      const winAmount = bet.amount * multiplier;
      await pool.query(
        "UPDATE lottery_bets_2d SET status = 'won', win_amount = $1 WHERE id = $2",
        [winAmount, bet.id]
      );
      await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [winAmount, bet.user_id]);

      const userRow = await pool.query("SELECT name FROM users WHERE id = $1", [bet.user_id]);
      const userName = userRow.rows[0]?.name || "User";
      winnerInfos.push({ name: userName, win_amount: winAmount });

      await pool.query(
        "INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)",
        [
          bet.user_id,
          "🏆 2D နိုင်ပါသည်!",
          `ဂုဏ်ယူပါသည် ${userName}! ${padded} ထွက်ပြီး ${Number(winAmount).toLocaleString()} ကျပ် နိုင်ပါသည်။ Wallet ထဲ ငွေထည့်ပြီးပါပြီ။`,
        ]
      );
      winnersCount++;
    } else {
      await pool.query("UPDATE lottery_bets_2d SET status = 'lost' WHERE id = $1", [bet.id]);
    }
  }

  // Global broadcast notification
  const sessionLabel = session === "morning" ? "မနက်" : "ညနေ";
  const winnerNames  = winnerInfos.map((w) => w.name).join("၊ ");
  const globalMsg = winnersCount > 0
    ? `${result_date} ${sessionLabel} 2D ရလဒ် ${padded} ထွက်ပါပြီ!\n🏆 နိုင်သူများ — ${winnerNames}`
    : `${result_date} ${sessionLabel} 2D ရလဒ် ${padded} ထွက်ပါပြီ။`;

  await pool.query(
    "INSERT INTO notifications (user_id, title, message) VALUES (NULL, $1, $2)",
    [`2D ရလဒ် ${padded} ထွက်ပါပြီ`, globalMsg]
  );

  return { winnersCount, message: `ရလဒ် ${padded} ထုတ်ပြန်ပြီး — နိုင်သူ ${winnersCount} ဦး` };
};

module.exports = { runPublish2D };
