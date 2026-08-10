import pg from "pg";
const { Pool } = pg;
const pool = new Pool({ connectionString: "postgres://fortu851:wUNXTe5joMO1ckaBMB0354ScA@168.119.64.101:5432/fortu851", ssl: false });
(async () => {
  const c = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='enquiries' ORDER BY ordinal_position`);
  console.log("enquiries cols:", c.rows.map(r=>r.column_name).join(", "));
  const v = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='vehicles' ORDER BY ordinal_position`);
  console.log("vehicles cols:", v.rows.map(r=>r.column_name).join(", "));
  const e = await pool.query(`SELECT COUNT(*)::int AS n FROM enquiries`);
  console.log("enquiries count:", e.rows[0].n);
  await pool.end();
})();
