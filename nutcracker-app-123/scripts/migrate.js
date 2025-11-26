import pg from 'pg';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
    // Use POSTGRES_URL if available, otherwise construct from other vars
    const connectionString = process.env.POSTGRES_URL;

    if (!connectionString) {
        console.error('Error: POSTGRES_URL environment variable is not set.');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false // Required for some hosted Postgres (like Heroku/Vercel/Supabase)
        }
    });

    try {
        console.log('Reading migration file...');
        const migrationPath = path.join(__dirname, '../database/migration.sql');
        const sql = await fs.readFile(migrationPath, 'utf8');

        console.log('Executing migration...');
        const client = await pool.connect();
        try {
            await client.query(sql);
        } finally {
            client.release();
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

migrate();
