# Claude Code Implementation Prompt

## Project: Nutcracker App 123

Hi Claude Code! Please build the **Nutcracker App 123** game based on the attached PRD (v1.2).

## Overview
This is a retro 80s-style pixel art math quiz game where players help a Nutcracker solve math problems across 10 progressively difficult levels. The game features:
- 10 levels with 5 questions each (50 total)
- 3 strikes (lives) for the entire game
- Generated Web Audio API sound effects
- CSS-based pixel art graphics
- Persistent leaderboard using Vercel Postgres

## Technical Requirements
- **Framework:** React with Vite
- **Styling:** CSS (80s pixel art aesthetic)
- **Database:** Vercel Postgres
- **Hosting:** Vercel
- **Sound:** Web Audio API (no external audio files)
- **Graphics:** CSS-based pixel art (no image assets)

## Implementation Priority

### Phase 1: Core Game Logic
1. Set up React project with Vite
2. Create basic routing/navigation between 5 screens:
   - Start Screen
   - Game Screen
   - Leaderboard Screen
   - Help Screen
   - Game Over Screen
3. Implement question generation algorithm (see PRD Section 5)
4. Implement game state management:
   - Track current level (1-10)
   - Track current question (1-5)
   - Track score (0-50)
   - Track strikes remaining (0-3)
5. Implement answer validation logic
6. Test game flow from start to finish

### Phase 2: Visual Design
1. Apply 80s pixel art styling:
   - Pixelated fonts (consider 'Press Start 2P' from Google Fonts)
   - Bright, high-contrast color palette
   - Blocky, non-anti-aliased UI elements
2. Create CSS-based Nutcracker character sprite
3. Design answer "nuts" as pixel art buttons
4. Create strike indicator icons (Nutcracker heads)
5. Style all screens with retro aesthetic

### Phase 3: Animations
1. Nutcracker cracking nut animation (correct answer)
2. Nutcracker broken jaw animation (incorrect answer)
3. Strike loss visual feedback
4. Level transition effects
5. Button hover/click states

### Phase 4: Sound Effects
1. Create SoundManager class using Web Audio API
2. Implement sound effects:
   - Correct answer (nut crack)
   - Incorrect answer (jaw break)
   - Button clicks (blip)
   - Level complete (victory jingle - optional)
3. Handle iOS/Safari audio initialization (requires user interaction)

### Phase 5: Database Integration
1. Set up Vercel Postgres database
2. Create `leaderboard` table with migration
3. Create API route: `GET /api/leaderboard` (fetch top 10)
4. Create API route: `POST /api/leaderboard` (submit score)
5. Implement leaderboard screen with data fetching
6. Implement score submission on game over screen

### Phase 6: Polish & Testing
1. Add keyboard navigation (Tab, Enter, 1-4 keys)
2. Implement responsive design for mobile/tablet
3. Add accessibility features (ARIA labels, focus indicators)
4. Test on different browsers (Chrome, Firefox, Safari)
5. Test on mobile devices
6. Performance optimization

## Key Implementation Details

### Question Generator Algorithm
```javascript
// Pseudo-code structure
function generateQuestion(level) {
  const config = LEVEL_CONFIGS[level];
  
  // Generate operands based on level
  const num1 = randomInt(config.min, config.max);
  const num2 = randomInt(config.min, config.max);
  
  // Calculate correct answer
  const correctAnswer = calculate(num1, num2, config.operation);
  
  // Generate 3 wrong answers within range
  const wrongAnswers = generateWrongAnswers(
    correctAnswer, 
    config.wrongAnswerRange
  );
  
  // Shuffle all 4 answers
  const answers = shuffle([correctAnswer, ...wrongAnswers]);
  
  return {
    question: `${num1} ${config.operator} ${num2} = ?`,
    correctAnswer,
    answers
  };
}
```

### Sound Manager Structure
```javascript
class SoundManager {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  playCorrect() {
    // Sharp click sound at 800Hz
  }
  
  playIncorrect() {
    // Descending tone from 400Hz to 100Hz
  }
  
  playClick() {
    // Quick blip at 600Hz
  }
}
```

### Database Schema
```sql
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  initials VARCHAR(3) NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
```

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
│   │   ├── Nutcracker.jsx
│   │   └── AnswerNut.jsx
│   ├── utils/
│   │   ├── questionGenerator.js
│   │   ├── soundManager.js
│   │   └── gameLogic.js
│   ├── styles/
│   │   ├── App.css
│   │   ├── PixelArt.css
│   │   └── Animations.css
│   ├── App.jsx
│   └── main.jsx
├── api/
│   └── leaderboard.js
└── vercel.json
```

## Specific Requests

1. **Start with Phase 1** - Get the core game logic working first before styling
2. **Use environment variables** for database connection (provide `.env.example` file)
3. **Add comments** in code for key logic sections
4. **Make it modular** - Separate concerns (game logic, UI, sound, etc.)
5. **Include a README** with:
   - Setup instructions
   - How to run locally
   - How to deploy to Vercel
   - Database setup steps
   - Environment variables needed

## Testing Checklist
- [ ] All 10 levels generate appropriate questions
- [ ] Wrong answers are never duplicates or negative
- [ ] Division problems have no remainders
- [ ] Strike system works correctly
- [ ] Score calculation is accurate
- [ ] Game over triggers at 0 strikes OR level 10 completion
- [ ] Leaderboard only shows top 10
- [ ] Initials validation (3 letters, A-Z only)
- [ ] Sound effects play correctly
- [ ] Animations are smooth
- [ ] Responsive on mobile devices
- [ ] Keyboard navigation works

## Questions Welcome!
If anything in the PRD is unclear or you need clarification on game logic, animations, or styling decisions, please ask before proceeding!

---

**Let's build an awesome retro math game! 🎄🔢🥜**
