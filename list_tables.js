import 'dotenv/config';
import db from './src/models/db.js';

async function main() {
  try {
    const res = await db.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
        AND table_type = 'BASE TABLE'
      ORDER BY table_schema, table_name
    `);
    console.log('tables:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

main();
