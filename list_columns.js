import 'dotenv/config';
import db from './src/models/db.js';

async function main() {
  try {
    const res = await db.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name IN ('organization', 'organizations')
      ORDER BY table_name, ordinal_position
    `);
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

main();
