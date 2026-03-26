const APP_SECRET = process.env.APP_HEADER_SECRET || "6230fb95f27b1b92aa6e3a670563e71f26f9c70c639e4aba8886deb279e32029";

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

module.exports = { requireAppHeader, sanitizeBody };
