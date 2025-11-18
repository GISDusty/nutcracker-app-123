# Nutcracker App 123

A retro 80s-style pixel art math quiz game built with React. Help the Nutcracker solve 50 math problems across 10 progressively difficult levels with only 3 strikes!

## Features

- **10 Levels** with 5 questions each (50 total questions)
- **3 Strikes System** - One game, three lives
- **Progressive Difficulty** - From simple addition to complex multiplication and division
- **80s Pixel Art Aesthetic** - Pure CSS pixel art, no external images
- **Retro Sound Effects** - Web Audio API synthesized 8-bit sounds
- **Persistent Leaderboard** - Top 10 scores stored in Vercel Postgres
- **Keyboard Support** - Full keyboard navigation (Tab, Enter, 1-4 keys)
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **Framework:** React 19 with Vite
- **Styling:** Pure CSS (pixel art aesthetic)
- **Database:** Vercel Postgres
- **Hosting:** Vercel
- **Sound:** Web Audio API (no external audio files)
- **Font:** Press Start 2P (Google Fonts)

## Local Development

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nutcracker-app-123
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional for local development):
```bash
cp .env.example .env.local
```

4. Start development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

### Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

## Game Rules

### Objective
Help the Nutcracker crack nuts by solving math problems correctly!

### How to Play
1. Click "Start Game" from the main menu
2. Read the math question
3. Click on a nut (or press 1-4) to select your answer
4. Get points for correct answers
5. Avoid losing all 3 strikes!

### Scoring
- Each correct answer = 1 point
- Maximum score = 50 points
- Top 10 scores are saved to the leaderboard

### Level Progression

| Level | Type | Difficulty |
|-------|------|-----------|
| 1 | Addition | Single digit (easy) |
| 2 | Addition | Single digit (harder) |
| 3 | Subtraction | Single digit |
| 4 | Addition | Double digit (no carry) |
| 5 | Subtraction | Double digit (no borrow) |
| 6 | Multiplication | Single digit (easy) |
| 7 | Multiplication | Single digit (harder) |
| 8 | Addition | Double digit (with carry) |
| 9 | Subtraction | Double digit (with borrow) |
| 10 | Mixed | Multiplication & Division |

## Deployment to Vercel

### Step 1: Create Vercel Project

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite configuration

### Step 2: Set Up Vercel Postgres

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database"
3. Select "Postgres"
4. Choose a name and region
5. Click "Create"

### Step 3: Run Database Migration

1. In the Vercel Postgres dashboard, click "Query"
2. Copy the contents of `database/migration.sql`
3. Paste and execute the SQL to create the leaderboard table
4. Verify the table was created successfully

### Step 4: Deploy

1. Vercel will automatically set environment variables from the Postgres database
2. Deploy from the main branch
3. Wait for deployment to complete
4. Visit your deployed site!

### Step 5: Test

- Test the game flow from start to finish
- Submit a score to verify leaderboard functionality
- Test on iOS/Safari to ensure Web Audio API works (requires user interaction)
- Test responsive design on mobile devices

## Project Structure

```
nutcracker-app-123/
├── src/
│   ├── components/          # React components
│   │   ├── StartScreen.jsx
│   │   ├── GameScreen.jsx
│   │   ├── LeaderboardScreen.jsx
│   │   ├── HelpScreen.jsx
│   │   ├── GameOverScreen.jsx
│   │   ├── Nutcracker.jsx   # Character sprite
│   │   └── AnswerNut.jsx    # Answer button
│   ├── utils/              # Game logic
│   │   ├── questionGenerator.js  # Question generation
│   │   └── soundManager.js       # Web Audio API
│   ├── styles/             # CSS files
│   │   ├── App.css         # Main styles
│   │   ├── PixelArt.css    # Pixel art components
│   │   └── Animations.css  # Nutcracker animations
│   ├── App.jsx             # Main app component
│   └── main.jsx
├── api/
│   └── leaderboard.js      # Vercel serverless API
├── database/
│   └── migration.sql       # Database schema
├── public/
├── .env.example            # Environment template
├── vercel.json             # Vercel configuration
└── package.json
```

## Key Implementation Details

### Question Generation Algorithm

The `questionGenerator.js` handles all 10 levels with specific rules:

- **Division problems** (Level 10) always result in whole numbers (no remainders)
- **Wrong answers** are generated within plausible ranges, never negative
- All answer choices are unique
- Difficulty increases progressively through levels

### Sound System

The `SoundManager` class uses Web Audio API to generate retro sounds:

- **Important:** iOS/Safari requires user interaction before playing audio
- All sounds are synthesized (no external audio files)
- Retro 8-bit style using square and sawtooth waves

### Pixel Art Styling

All graphics are pure CSS:

- No external image files
- `image-rendering: pixelated` for sharp edges
- CSS Grid and pseudo-elements for sprites
- 80s color palette (magenta, cyan, yellow)

### Animations

CSS animations for:

- Nutcracker cracking (correct answer)
- Nutcracker broken jaw (incorrect answer)
- Idle breathing effect
- UI transitions and effects

## Testing Checklist

Before deploying to production, verify:

- ✅ All 10 levels generate appropriate questions
- ✅ Wrong answers are never duplicates or negative
- ✅ Division problems have no remainders
- ✅ Strike system tracks 0-3 lives correctly
- ✅ Score calculation (1 point per correct, max 50)
- ✅ Game over triggers correctly
- ✅ Leaderboard shows top 10, sorted by score DESC
- ✅ Initials validation (3 letters, A-Z only)
- ✅ Sound effects play on user interaction
- ✅ Animations are smooth
- ✅ Responsive on mobile
- ✅ Keyboard navigation works

## Keyboard Controls

- **Tab** - Navigate between buttons
- **Enter** - Activate focused button
- **1-4** - Select answer choices during gameplay

## Accessibility Features

- Keyboard navigation support
- ARIA labels on interactive elements
- High contrast text
- Focus indicators
- Reduced motion support for accessibility preferences

## Known Limitations

- iOS/Safari requires user interaction before playing audio
- Leaderboard requires Vercel Postgres database connection
- Local development shows demo leaderboard data if DB not configured

## Future Enhancements (Out of Scope for v1.2)

- Timers per question
- Background music loops
- User authentication/accounts
- Difficulty selection
- Achievements/badges system
- Social sharing
- Multi-language support
- Mute/volume controls

## Troubleshooting

### Sound not playing on iOS/Safari
- Web Audio API requires user interaction first
- Sound will initialize on first click/tap

### Leaderboard not loading
- Verify Vercel Postgres database is created
- Check environment variables are set in Vercel dashboard
- Verify `migration.sql` was executed successfully

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires 18+)
- Clear `node_modules` and `dist` folders, then reinstall

## Contributing

This is a educational project built as a demonstration of retro game design with modern web technologies.

## License

MIT

---

**Made with ❤️ and 8-bit nostalgia**
