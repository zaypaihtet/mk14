require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const phone = "09000000000";
  const password = "Admin@2024!";
  const name = "Admin";

  const existing = await pool.query("SELECT id FROM users WHERE phone = $1", [phone]);
  if (existing.rows.length > 0) {
    console.log("Admin user already exists");
    await pool.end();
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const referral_code = "ADMIN01";

  await pool.query(
    "INSERT INTO users (name, phone, password_hash, role, referral_code) VALUES ($1,$2,$3,'admin',$4)",
    [name, phone, password_hash, referral_code]
  );

  console.log("✓ Admin user created:");
  console.log("  Phone:", phone);
  console.log("  Password:", password);
  await pool.end();
}

seed().catch(console.error);
