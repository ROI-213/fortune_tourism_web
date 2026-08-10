import pg from "pg";
const { Pool } = pg;
const pool = new Pool({ connectionString: "postgres://fortu851:wUNXTe5joMO1ckaBMB0354ScA@168.119.64.101:5432/fortu851", ssl: false });
(async () => {
  await pool.query(`ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE`);
  console.log("vehicles.deleted_at added");
  await pool.end();
})();
