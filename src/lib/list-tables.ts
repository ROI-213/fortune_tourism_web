import { pool } from './db';

(async () => {
  try {
    const res = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public';`);
    console.log('Tables:', res.rows.map(r => r.table_name).join(', '));
  } catch (err) {
    console.error('Error querying tables:', err);
  } finally {
    await pool.end();
  }
})();
