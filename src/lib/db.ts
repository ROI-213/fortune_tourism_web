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

let columnsEnsured = false;

export async function ensureBusinessColumns() {
  if (columnsEnsured) return;
  columnsEnsured = true;
  try {
    await pool.query(`
      -- flight_bookings
      ALTER TABLE flight_bookings ADD COLUMN IF NOT EXISTS passenger_name TEXT;
      ALTER TABLE flight_bookings ADD COLUMN IF NOT EXISTS phone TEXT;
      ALTER TABLE flight_bookings ADD COLUMN IF NOT EXISTS date_of_birth DATE;
      ALTER TABLE flight_bookings ADD COLUMN IF NOT EXISTS passenger_age INTEGER;
      ALTER TABLE flight_bookings ADD COLUMN IF NOT EXISTS passenger_gender TEXT;
      ALTER TABLE flight_bookings ADD COLUMN IF NOT EXISTS infant TEXT;
      ALTER TABLE flight_bookings ADD COLUMN IF NOT EXISTS passport_id TEXT;
      ALTER TABLE flight_bookings ADD COLUMN IF NOT EXISTS ticket_number TEXT;
      ALTER TABLE flight_bookings ADD COLUMN IF NOT EXISTS seat_number TEXT;
      ALTER TABLE flight_bookings ADD COLUMN IF NOT EXISTS customer_id INTEGER;

      -- train_bookings
      ALTER TABLE train_bookings ADD COLUMN IF NOT EXISTS passenger_name TEXT;
      ALTER TABLE train_bookings ADD COLUMN IF NOT EXISTS passenger_phone TEXT;
      ALTER TABLE train_bookings ADD COLUMN IF NOT EXISTS date_of_birth DATE;
      ALTER TABLE train_bookings ADD COLUMN IF NOT EXISTS passenger_age INTEGER;
      ALTER TABLE train_bookings ADD COLUMN IF NOT EXISTS infant TEXT;
      ALTER TABLE train_bookings ADD COLUMN IF NOT EXISTS seat_berth TEXT;
      ALTER TABLE train_bookings ADD COLUMN IF NOT EXISTS amount NUMERIC(12,2);
      ALTER TABLE train_bookings ADD COLUMN IF NOT EXISTS ticket_status TEXT;
      ALTER TABLE train_bookings ADD COLUMN IF NOT EXISTS customer_id INTEGER;

      -- bus_bookings
      ALTER TABLE bus_bookings ADD COLUMN IF NOT EXISTS passenger_name TEXT;
      ALTER TABLE bus_bookings ADD COLUMN IF NOT EXISTS passenger_phone TEXT;
      ALTER TABLE bus_bookings ADD COLUMN IF NOT EXISTS date_of_birth DATE;
      ALTER TABLE bus_bookings ADD COLUMN IF NOT EXISTS passenger_age INTEGER;
      ALTER TABLE bus_bookings ADD COLUMN IF NOT EXISTS infant TEXT;
      ALTER TABLE bus_bookings ADD COLUMN IF NOT EXISTS seat_number TEXT;
      ALTER TABLE bus_bookings ADD COLUMN IF NOT EXISTS amount NUMERIC(12,2);
      ALTER TABLE bus_bookings ADD COLUMN IF NOT EXISTS customer_id INTEGER;
    `);
  } catch (err) {
    console.error("Column verification error:", err);
  }
}

export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<pg.QueryResult<T>> {
  await ensureBusinessColumns();
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
