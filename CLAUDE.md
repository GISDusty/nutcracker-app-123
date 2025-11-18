# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nutcracker App 123** is a retro 80s-style pixel art math quiz game built with React. Players help a Nutcracker character solve 50 math problems across 10 progressively difficult levels, with only 3 strikes (lives) for the entire game. The game features CSS-based pixel art, Web Audio API sound effects, and a persistent leaderboard stored in Vercel Postgres.

## Tech Stack

- **Framework:** React with Vite
- **Styling:** Pure CSS (pixel art aesthetic, no external images)
- **Database:** Vercel Postgres
- **Hosting:** Vercel
- **Sound:** Web Audio API (synthesized retro 8-bit sounds)
- **Font:** Pixelated web font (e.g., 'Press Start 2P')

## Development Commands

```bash
# Initial setup
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Architecture

### Component Structure

The app uses a single-page application structure with 5 main screens:

1. **StartScreen** - Landing page with game title, buttons for Start Game, Leaderboard, and Help
2. **GameScreen** - Main gameplay with question display, 4 answer choices (styled as "nuts"), Nutcracker character animations, and HUD (level, score, strikes)
3. **LeaderboardScreen** - Displays top 10 scores from database
4. **HelpScreen** - Game instructions
5. **GameOverScreen** - Final score display, performance message, optional Top 10 entry

### Core Game Logic

**State Management:**
- Current level (1-10)
- Current question within level (1-5)
- Total score (0-50, 1 point per correct answer)
- Strikes remaining (0-3)
- Game state (start, playing, game over)

**Question Generation Algorithm (`utils/questionGenerator.js`):**
Each of the 10 levels has specific rules for question type, number ranges, and wrong answer generation:

- Level 1-2: Single digit addition (increasing difficulty)
- Level 3: Single digit subtraction
- Level 4-5: Double digit addition/subtraction (no carry/borrow)
- Level 6-7: Single digit multiplication (increasing difficulty)
- Level 8-9: Double digit addition/subtraction (with carry/borrow)
- Level 10: Mixed multiplication and division

**Critical Requirements:**
- Division problems must have whole number answers (no remainders): `dividend % divisor === 0`
- Wrong answers must be unique, non-negative, and plausible (not obviously wrong)
- Each level has specific ranges for both correct answers and wrong answer offsets (see PRD Section 5)

### Visual Design Philosophy

**80s Pixel Art Aesthetic:**
- All CSS-based, no external image files
- Sharp, blocky edges with `image-rendering: pixelated` and `crisp-edges`
- Bright, high-contrast color palette
- Monospace/pixel font rendering
- Answer choices styled as pixel-art "nuts"
- Nutcracker character has 3 states: idle, cracking (success), broken jaw (failure)

**Animations:**
- Correct answer: 1-2 second Nutcracker cracking animation + sound
- Incorrect answer: 1-2 second broken jaw animation + sound
- Strike loss: Visual feedback on strike indicator icons
- All animations should use `transform` and `opacity` for performance

### Sound System

The `SoundManager` class (`utils/soundManager.js`) generates all sounds using Web Audio API:

- **Correct answer:** Short crack sound (800Hz spike, ~0.1s)
- **Incorrect answer:** Descending tone (400Hz → 100Hz, ~0.3s)
- **Button click:** Simple blip (600Hz, ~0.05s)
- **Level complete (optional):** Ascending arpeggio (C-E-G-C: 262, 330, 392, 523 Hz)

**Important:** iOS/Safari requires user interaction before playing audio. Initialize AudioContext on first user click.

### Database & API

**Schema:**
```sql
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  initials VARCHAR(3) NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
```

**API Routes (`api/leaderboard.js`):**
- `GET /api/leaderboard` - Fetch top 10 scores ordered by score DESC
- `POST /api/leaderboard` - Submit new score (validate 3 A-Z initials, score 0-50)

**Environment Variables:**
- Database connection details (see `.env.example`)
- Store in Vercel project settings for production

## File Structure

```
nutcracker-app-123/
├── src/
│   ├── components/
│   │   ├── StartScreen.jsx
│   │   ├── GameScreen.jsx
│   │   ├── LeaderboardScreen.jsx
│   │   ├── HelpScreen.jsx
│   │   ├── GameOverScreen.jsx
│   │   ├── Nutcracker.jsx         # Character sprite with animations
│   │   └── AnswerNut.jsx           # Answer choice button
│   ├── utils/
│   │   ├── questionGenerator.js   # Core game logic for question generation
│   │   ├── soundManager.js        # Web Audio API sound effects
│   │   └── gameLogic.js           # Helper functions
│   ├── styles/
│   │   ├── App.css
│   │   ├── PixelArt.css           # Pixel art styling utilities
│   │   └── Animations.css         # Nutcracker and UI animations
│   ├── App.jsx                    # Main app with routing/navigation
│   └── main.jsx
├── api/
│   └── leaderboard.js             # Vercel serverless functions
├── public/
│   └── index.html
└── vercel.json
```

## Implementation Guidelines

### When Adding Features

1. **Game Logic Changes:** Always verify against the 10-level progression table in `Nutcracker_App_123_PRD_v1.2.md` Section 5
2. **Styling:** Maintain pixel art aesthetic - blocky, high contrast, no smooth gradients
3. **Animations:** Keep animations short (1-2s) and use CSS transforms for performance
4. **Sound:** Use Web Audio API only, no external audio files
5. **Accessibility:** Add keyboard support (Tab, Enter, 1-4 for answers), ARIA labels, focus indicators

### Common Development Tasks

**Test Question Generation:**
```javascript
// Verify all 10 levels generate valid questions
for (let level = 1; level <= 10; level++) {
  const question = generateQuestion(level);
  console.log(`Level ${level}:`, question);
  // Verify answer uniqueness, non-negativity, proper ranges
}
```

**Test Division (Level 10):**
```javascript
// Ensure no remainders
const divQuestion = generateDivisionQuestion();
console.assert(divQuestion.dividend % divQuestion.divisor === 0);
```

**Verify Leaderboard Submission:**
```bash
# POST request with sample data
curl -X POST http://localhost:5173/api/leaderboard \
  -H "Content-Type: application/json" \
  -d '{"initials":"ABC","score":42}'
```

### Responsive Design

- Desktop: Optimal layout with full pixel art details
- Tablet: Touch-friendly buttons (min 44x44px)
- Mobile: Portrait orientation, stacked layout, large touch targets

### Keyboard Shortcuts

- `Tab` - Navigate between buttons
- `Enter` - Activate focused button
- `1-4` - Select answer choices during gameplay

## Testing Checklist

Before deployment, verify:
- All 10 levels generate appropriate difficulty questions
- Wrong answers are never duplicates, negative, or obviously incorrect
- Division problems (Level 10) never have remainders
- Strike system correctly tracks 0-3 lives across entire game
- Score calculation: 1 point per correct answer, max 50
- Game over triggers at 0 strikes OR completing Level 10, Question 5
- Leaderboard shows only top 10 scores, sorted DESC
- Initials validation: exactly 3 letters, A-Z only, auto-capitalized
- All sound effects play on user interaction (test iOS/Safari specifically)
- Animations are smooth and don't cause performance issues
- Responsive layout works on mobile devices
- Keyboard navigation functions correctly

## Deployment to Vercel

1. Connect GitHub repo to Vercel project
2. Set environment variables in Vercel dashboard (database credentials)
3. Run database migration to create `leaderboard` table
4. Deploy from main branch
5. Test leaderboard functionality in production
6. Verify Web Audio API works on iOS/Safari (requires user gesture)

## Out of Scope (v1.2)

Do NOT implement these features (reserved for future versions):
- Timers per question
- Background music loops
- User authentication/accounts
- Difficulty selection
- Achievements/badges system
- Social sharing
- Multi-language support
- Mute/volume controls

## Additional Documentation

- Full requirements: `Nutcracker_App_123_PRD_v1.2.md`
- Implementation guide: `Claude_Code_Implementation_Prompt.md`
