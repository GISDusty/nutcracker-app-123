// Vercel Serverless Function for Leaderboard API
// Handles GET (fetch top 10) and POST (submit score) requests

import { sql } from '@vercel/postgres';

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

    let result;

    if (ageGroup === '5_under') {
      result = await sql`
        SELECT initials, score, age, created_at
        FROM leaderboard
        WHERE age <= 5
        ORDER BY score DESC, created_at ASC
        LIMIT 10
      `;
    } else if (ageGroup === '6_7') {
      result = await sql`
        SELECT initials, score, age, created_at
        FROM leaderboard
        WHERE age >= 6 AND age <= 7
        ORDER BY score DESC, created_at ASC
        LIMIT 10
      `;
    } else if (ageGroup === '8_10') {
      result = await sql`
        SELECT initials, score, age, created_at
        FROM leaderboard
        WHERE age >= 8 AND age <= 10
        ORDER BY score DESC, created_at ASC
        LIMIT 10
      `;
    } else if (ageGroup === '11_up') {
      result = await sql`
        SELECT initials, score, age, created_at
        FROM leaderboard
        WHERE age >= 11
        ORDER BY score DESC, created_at ASC
        LIMIT 10
      `;
    } else {
      // Default: show all or handle legacy behavior
      // For now, let's just show top 10 overall if no group specified
      result = await sql`
        SELECT initials, score, age, created_at
        FROM leaderboard
        ORDER BY score DESC, created_at ASC
        LIMIT 10
      `;
    }

    const leaderboard = result.rows.map(row => ({
      initials: row.initials,
      score: row.score,
      age: row.age,
      createdAt: row.created_at
    }));

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error('GET Error:', error);

    // If table doesn't exist, return empty array
    if (error.message.includes('relation "leaderboard" does not exist')) {
      console.warn('Leaderboard table does not exist. Please run migration.');
      return res.status(200).json([]);
    }

    throw error;
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
    await sql`
      INSERT INTO leaderboard (initials, score, age)
      VALUES (${initials}, ${score}, ${age})
    `;

    return res.status(201).json({
      success: true,
      message: 'Score submitted successfully',
      data: { initials, score, age }
    });
  } catch (error) {
    console.error('POST Error:', error);

    // If table doesn't exist, provide helpful error message
    if (error.message.includes('relation "leaderboard" does not exist')) {
      return res.status(500).json({
        error: 'Database error',
        message: 'Leaderboard table does not exist. Please run the database migration.'
      });
    }

    throw error;
  }
}
