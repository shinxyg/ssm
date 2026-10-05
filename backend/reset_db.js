import pg from 'pg';
import dotenv from 'dotenv';
import { initDB, pool } from './db.js';

dotenv.config();

async function resetAllTables() {
  try {
    await initDB();
    const client = await pool.connect();

    // Clear all records from all application tables in PostgreSQL database
    await client.query('DELETE FROM aics_applications;');
    await client.query('DELETE FROM appointments;');
    await client.query('DELETE FROM pwd_applications;');
    await client.query('DELETE FROM senior_applications;');
    await client.query('DELETE FROM livelihood_applications;');
    await client.query('DELETE FROM solo_parent_applications;');
    await client.query('DELETE FROM educational_applications;');
    await client.query('DELETE FROM financial_disbursements;');

    console.log('🧹 Successfully deleted ALL records from ALL database tables in PostgreSQL!');
    console.log('✨ PostgreSQL database is 100% empty and ready for fresh re-applications.');

    client.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error resetting database:', err);
    process.exit(1);
  }
}

resetAllTables();
