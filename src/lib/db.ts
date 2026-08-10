import pg from "pg";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://fortu851:wUNXTe5joMO1ckaBMB0354ScA@168.119.64.101:5432/fortu851";

export const pool = new Pool({
  connectionString,
  host: process.env.PGHOST || "168.119.64.101",
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || "fortu851",
  user: process.env.PGUSER || "fortu851",
  password: process.env.PGPASSWORD || "wUNXTe5joMO1ckaBMB0354ScA",
  ssl: false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
});

export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<pg.QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== "production") {
      console.log("Executed query", { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error("Database Query Error:", { text, error });
    throw error;
  }
}
