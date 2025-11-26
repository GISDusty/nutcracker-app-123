import { db } from '@vercel/postgres';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function test() {
    try {
        console.log('Testing database connection...');
        const result = await db.query('SELECT * FROM leaderboard LIMIT 5');
        console.log('Connection successful!');
        console.log('Rows found:', result.rowCount);
        console.log('Data:', result.rows);
    } catch (error) {
        console.error('Database test failed:', error);
        process.exit(1);
    }
}

test();
