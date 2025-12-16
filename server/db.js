// ====================== Imports ======================
import pg from "pg";
import dotenv from "dotenv";

// ====================== Config ======================
dotenv.config();
const { Pool } = pg;
const { DATABASE_URL, NODE_ENV } = process.env;

// ====================== Pool ======================
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export default pool;
