import fs from "fs";
import path from "path";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://fortu851:wUNXTe5joMO1ckaBMB0354ScA@168.119.64.101:5432/fortu851",
  ssl: false,
  connectionTimeoutMillis: 10000,
});

async function main() {
  const migrationsDir = path.join(process.cwd(), "src", "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    console.log(`Applying ${file} ...`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    await pool.query(sql);
    console.log(`  done.`);
  }

  const tables = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`
  );
  console.log("\nTABLES (" + tables.rows.length + "):");
  for (const r of tables.rows) {
    console.log(` - ${r.table_name}`);
  }
}

main()
  .catch((e) => {
    console.error("MIGRATION ERROR:", e.message);
    process.exit(1);
  })
  .finally(() => pool.end());
