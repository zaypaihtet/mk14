const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "twodbet_secret_key_2024";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token မပါဘဲ ဝင်ရောက်ခြင်း" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token မမှန်ကန်ပါ" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin သာ ဝင်ရောက်ခွင့်ရှိသည်" });
  }
  next();
};

module.exports = { authenticate, adminOnly, JWT_SECRET };
