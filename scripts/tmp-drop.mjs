import pg from "pg";
const { Pool } = pg;
const pool = new Pool({ connectionString: "postgres://fortu851:wUNXTe5joMO1ckaBMB0354ScA@168.119.64.101:5432/fortu851", ssl: false });
(async () => {
  const res = await pool.query(`SELECT tablename FROM pg_tables WHERE schemaname='public'`);
  for (const r of res.rows) {
    await pool.query(`DROP TABLE IF EXISTS public."${r.tablename}" CASCADE`);
    console.log("dropped", r.tablename);
  }
  const types = await pool.query(`SELECT typname FROM pg_type WHERE typname IN ('expense_category')`);
  for (const t of types.rows) { try { await pool.query(`DROP TYPE IF EXISTS expense_category CASCADE`); } catch(e) { console.log("type skip", e.message); } }
  await pool.end();
  console.log("done");
})();
