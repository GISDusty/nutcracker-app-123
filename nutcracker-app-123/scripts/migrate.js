import { db } from '@vercel/postgres';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
    try {
        console.log('Reading migration file...');
        const migrationPath = path.join(__dirname, '../database/migration.sql');
        const sql = await fs.readFile(migrationPath, 'utf8');

        console.log('Executing migration...');
        // Execute the SQL directly using the pool
        await db.query(sql);

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
