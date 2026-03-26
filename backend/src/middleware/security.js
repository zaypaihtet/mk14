const rateLimit = require("express-rate-limit");

const APP_SECRET = process.env.APP_HEADER_SECRET || "6230fb95f27b1b92aa6e3a670563e71f26f9c70c639e4aba8886deb279e32029";

// ── General API rate limiter (100 req / 15 min per IP) ─────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "တောင်းဆိုမှု အလွန်များနေပါသည်။ ခဏ နောက်မှ ထပ်ကြိုးစားပါ" },
  skip: (req) => req.path === "/api/health",
});

// ── Strict auth limiter (10 attempts / 15 min per IP) ──────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Login ကြိုးစားမှု အလွန်များနေပါသည်။ ၁၅ မိနစ် နောက်မှ ထပ်ကြိုးစားပါ" },
});

// ── Bet rate limiter (30 bets / min per IP) ────────────────────────────────
const betLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Bet submission မြန်မြန် ပို့လွန်းနေပါသည်" },
});

// ── Custom app-header validation ───────────────────────────────────────────
// Frontend sends X-App-Key header; direct Burp/curl calls won't have it
const requireAppHeader = (req, res, next) => {
  const key = req.headers["x-app-key"];
  if (!key || key !== APP_SECRET) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// ── Sanitize string fields to strip common XSS / injection patterns ────────
const sanitizeBody = (req, _res, next) => {
  const sanitize = (val) => {
    if (typeof val !== "string") return val;
    return val
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/<[^>]+>/g, "")
      .trim();
  };
  const walk = (obj) => {
    if (!obj || typeof obj !== "object") return;
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "string") obj[key] = sanitize(obj[key]);
      else if (typeof obj[key] === "object") walk(obj[key]);
    }
  };
  walk(req.body);
  walk(req.query);
  next();
};

module.exports = { generalLimiter, authLimiter, betLimiter, requireAppHeader, sanitizeBody };
