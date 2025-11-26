import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .limit(5);

        if (error) throw error;

        console.log('Connection successful!');
        console.log('Rows found:', data.length);
        console.log('Data:', data);
    } catch (error) {
        console.error('Database test failed:', error);
        process.exit(1);
    }
}

test();
