// Vercel Serverless Function for Leaderboard API
// Handles GET (fetch top 10) and POST (submit score) requests

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * CORS headers for API responses
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Main API handler
 */
export default async function handler(req, res) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    if (req.method === 'GET') {
      return await handleGet(req, res);
    } else if (req.method === 'POST') {
      return await handlePost(req, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * GET /api/leaderboard
 * Fetch top 10 scores from database
 */
async function handleGet(req, res) {
  try {
    // Get age group from query params
    const { ageGroup } = req.query;

    let query = supabase
      .from('leaderboard')
      .select('initials, score, age, created_at')
      .order('score', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(10);

    if (ageGroup === '5_under') {
      query = query.lte('age', 5);
    } else if (ageGroup === '6_7') {
      query = query.gte('age', 6).lte('age', 7);
    } else if (ageGroup === '8_10') {
      query = query.gte('age', 8).lte('age', 10);
    } else if (ageGroup === '11_up') {
      query = query.gte('age', 11);
    }

    const { data, error } = await query;

    if (error) throw error;

    const leaderboard = data.map(row => ({
      initials: row.initials,
      score: row.score,
      age: row.age,
      createdAt: row.created_at
    }));

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error('GET Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * POST /api/leaderboard
 * Submit a new score to the leaderboard
 */
async function handlePost(req, res) {
  try {
    const { initials, score, age } = req.body;

    // Validate initials
    if (!initials || typeof initials !== 'string') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Initials are required and must be a string'
      });
    }

    if (initials.length !== 3) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Initials must be exactly 3 characters'
      });
    }

    if (!/^[A-Z]{3}$/.test(initials)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Initials must be 3 uppercase letters (A-Z)'
      });
    }

    // Validate score
    if (typeof score !== 'number') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Score must be a number'
      });
    }

    if (score < 0 || score > 50) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Score must be between 0 and 50'
      });
    }

    if (!Number.isInteger(score)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Score must be an integer'
      });
    }

    // Validate age
    if (typeof age !== 'number') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Age must be a number'
      });
    }

    if (age < 0 || age > 120) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Age must be between 0 and 120'
      });
    }

    if (!Number.isInteger(age)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Age must be an integer'
      });
    }

    // Insert score into database
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([{ initials, score, age }])
      .select();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Score submitted successfully',
      data: { initials, score, age }
    });
  } catch (error) {
    console.error('POST Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
