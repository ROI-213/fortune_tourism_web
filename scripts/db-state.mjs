import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgres://fortu851:wUNXTe5joMO1ckaBMB0354ScA@168.119.64.101:5432/fortu851",
  ssl: false,
  connectionTimeoutMillis: 8000,
});

async function main() {
  const tables = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`
  );
  console.log("TABLES (" + tables.rows.length + "):");
  for (const r of tables.rows) {
    const cnt = await pool.query(`SELECT COUNT(*)::int AS n FROM "${r.table_name}"`).catch(() => ({ rows: [{ n: "?" }] }));
    console.log(` - ${r.table_name}  (${cnt.rows[0].n})`);
  }
}

main()
  .catch((e) => {
    console.error("CONNECTION ERROR:", e.message);
    process.exit(1);
  })
  .finally(() => pool.end());
