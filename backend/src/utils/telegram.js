const pool = require("../db");

async function getConfigVal(key) {
  try {
    const r = await pool.query("SELECT value FROM lottery_config WHERE key = $1", [key]);
    return r.rows[0]?.value || "";
  } catch { return ""; }
}

async function sendTelegram(text) {
  const token = await getConfigVal("telegram_bot_token");
  const chatId = await getConfigVal("telegram_chat_id");
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
  } catch (err) {
    console.error("[Telegram] Failed to send:", err.message);
  }
}

module.exports = { sendTelegram };
