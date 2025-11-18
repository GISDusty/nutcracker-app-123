# Product Requirements Document (PRD): Nutcracker App 123

* **Date:** November 17, 2025
* **Version:** 1.2 (Implementation Ready)

---

## 1. 🎯 Overview

**"Nutcracker App 123"** is a retro 80s-style pixel art math quiz game. The application is intended to be a fun and educational tool, teaching basic math skills in an engaging, themed environment. The player helps a Nutcracker solve math problems, with 10 levels of increasing difficulty.

## 2. 👩‍💻 Technical Stack

* **Language:** JavaScript
* **Framework/Library:** React
* **Styling:** CSS (to achieve 80s pixel art aesthetic)
* **Database:** Vercel Postgres (for persistent leaderboard)
* **Hosting:** Vercel
* **Sound:** Web Audio API (generated synthesized sounds)
* **Graphics:** CSS-based pixel art (no external image assets needed)

## 3. 🎨 Theme, Aesthetics, & Sound

### Visual Style
* **Theme:** 80s retro pixel art with Christmas/Nutcracker theme
* **Font:** Blocky, pixelated font (monospace or pixel-style web font)
* **Colors:** Classic 80s palette (bright primary colors, high contrast)
* **All UI Elements:** Blocky and pixelated appearance

### Character Design
* **Nutcracker Character:** CSS-based pixel art sprite
  * Idle state
  * Cracking nut animation (success)
  * Broken jaw animation (failure)

### Animations
* **Correct Answer:** Nutcracker successfully cracking a nut (1-2 second animation)
* **Incorrect Answer:** Nutcracker's jaw breaking (1-2 second animation)
* **Strike Loss:** Visual feedback on strike icons

### Sound Effects
All sounds generated using Web Audio API with retro 8-bit style:
* **Correct Answer:** "Nut crack" sound (short, satisfying crack)
* **Incorrect Answer:** "Jaw break" or "error/fail" sound (descending tone)
* **Button Click:** Simple "blip" or "click" sound for menu navigation
* **Level Complete:** Optional victory jingle

## 4. 🎮 Core Gameplay & Rules

* **Game Structure:** 10 levels total
* **Level Structure:** 5 questions per level (50 questions total)
* **Lives System:** Player starts with **3 strikes (lives)** for the *entire game*
* **Losing a Strike:** A strike is lost when the player selects an incorrect answer
* **Game Over Conditions:**
    1.  Player loses all 3 strikes, OR
    2.  Player successfully completes all 10 levels (50 questions)
* **Scoring:** 1 point per correct answer (maximum score: 50)

## 5. 📈 Level Difficulty Progression

### Question Generation Rules

| Level | Operation Type | Range | Wrong Answer Range |
|-------|---------------|-------|-------------------|
| 1 | Single Digit Addition | 1-5 + 1-5 | ±1 to ±3 |
| 2 | Single Digit Addition (harder) | 5-9 + 5-9 | ±2 to ±5 |
| 3 | Single Digit Subtraction | 5-9 - 1-5 | ±1 to ±3 |
| 4 | Double Digit Addition (no carry) | 10-49 + 10-49 (no carry) | ±3 to ±7 |
| 5 | Double Digit Subtraction (no borrow) | 20-49 - 10-25 (no borrow) | ±3 to ±7 |
| 6 | Single Digit Multiplication | 2-5 × 2-5 | ±2 to ±5 |
| 7 | Single Digit Multiplication (harder) | 6-9 × 6-9 | ±5 to ±10 |
| 8 | Double Digit Addition (with carry) | 10-49 + 10-49 (forces carry) | ±5 to ±12 |
| 9 | Double Digit Subtraction (with borrow) | 30-99 - 10-49 (forces borrow) | ±5 to ±12 |
| 10 | Multiplication & Division Mix | 6-12 × 6-12 OR 20-100 ÷ 2-10 | ±8 to ±15 |

### Division Rules (Level 10)
* Only generate division problems that result in **whole numbers** (no remainders)
* Verify: `dividend % divisor === 0`

### Multiple Choice Generation
* **4 answer choices** displayed as pixel-art "nuts"
* **1 correct answer** + **3 wrong answers**
* Wrong answers should be:
  * Within the specified range for that level
  * Never negative (for subtraction)
  * Unique (no duplicate answers)
  * Not obviously wrong (avoid answers like 0 for multiplication)

## 6. 🖥️ Screens & User Flow

### Screen A: Start Screen (Default Screen)
**Elements:**
* Pixel art game title: **"Nutcracker App 123"**
* Nutcracker character sprite (idle animation)
* Button: "Start Game"
* Button: "Leaderboard"
* Button: "Help"

**Flow:**
* "Start Game" → Resets score to 0, strikes to 3, navigates to Screen B (Level 1, Question 1)
* "Leaderboard" → Navigates to Screen C
* "Help" → Navigates to Screen D
* Play button click sound on all buttons

### Screen B: Game Screen
**Elements:**
* **Header:**
  * Current Level: "Level: X/10"
  * Current Score: "Score: XX"
  * Strikes Display: 3 Nutcracker-head icons (show remaining lives)
* **Main Area:**
  * Math question: "X + Y = ?" (large, pixelated font)
  * Nutcracker character (center stage for animations)
* **Answer Area:**
  * Four (4) answer choices styled as pixel-art "nuts"
  * Clickable/tappable with hover effects

**Flow:**
* Player clicks a "nut" (answer)
* **On Correct Answer:**
  1. Play "crack nut" sound
  2. Trigger Nutcracker cracking animation (1-2 seconds)
  3. Add 1 point to score
  4. Load next question
  5. If 5th question of level, show "Level Complete!" briefly, then load next level
  6. If Level 10, Question 5, navigate to Screen E
* **On Incorrect Answer:**
  1. Play "jaw break" sound
  2. Trigger Nutcracker jaw break animation (1-2 seconds)
  3. Subtract 1 strike (dim/remove one icon)
  4. If strikes = 0, navigate to Screen E (Game Over)
  5. Otherwise, load next question

**Keyboard Support:**
* Keys 1-4 select answer choices

### Screen C: Leaderboard Screen
**Elements:**
* Title: "Leaderboard" (pixel art style)
* Table displaying Top 10 scores:
  * Columns: Rank | Initials | Score
  * Format: `1. ABC 50`
* Button: "Back"

**Data Source:**
* Fetched from Vercel Postgres database
* Query: `SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10`

**Flow:**
* "Back" button → Navigate to Screen A

### Screen D: Help Screen
**Elements:**
* Title: "How to Play" (pixel art style)
* Instructions Text (pixelated font):
  ```
  Welcome to Nutcracker App 123!
  
  • Help the Nutcracker crack nuts by solving math problems
  • There are 10 levels with 5 questions each
  • Be careful! You only get 3 strikes (lives) for the entire game
  • Answer correctly to score points
  • Get a high score to make the Top 10 Leaderboard!
  
  Click a nut to select your answer!
  ```
* Button: "Back"

**Flow:**
* "Back" button → Navigate to Screen A

### Screen E: Game Over Screen
**Elements:**
* Title: "Game Over!" (pixel art style)
* Display: "Final Score: XX / 50"
* Performance message based on score:
  * 45-50: "Perfect! You're a Math Master!"
  * 35-44: "Excellent Work!"
  * 25-34: "Great Job!"
  * 15-24: "Good Try!"
  * 0-14: "Keep Practicing!"

**Conditional Logic:**
* **If score is Top 10:**
  * Display: "🎉 You made the Top 10! 🎉"
  * Text input field: "Enter Your Initials (3 letters):"
  * Input validation: Exactly 3 characters, A-Z only
  * Button: "Submit to Leaderboard"
* **If score is NOT Top 10:**
  * Display performance message only
  * No input field

**Buttons:**
* "Play Again" → Navigate to Screen B (new game)
* "Main Menu" → Navigate to Screen A

**Flow:**
* **If Top 10:** 
  1. Player enters 3 initials (auto-capitalize, limit to 3 chars)
  2. Click "Submit to Leaderboard"
  3. Save to database: `INSERT INTO leaderboard (initials, score, date) VALUES ($1, $2, NOW())`
  4. Navigate to Screen C (Leaderboard)
* "Play Again" → Reset game state, start new game
* "Main Menu" → Return to start screen

## 7. 🗄️ Database Schema

### Vercel Postgres Setup

**Table: `leaderboard`**
```sql
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  initials VARCHAR(3) NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
```

**API Endpoints Needed:**
* `GET /api/leaderboard` - Fetch top 10 scores
* `POST /api/leaderboard` - Submit new score (with validation)

## 8. 🎵 Sound Implementation Details

### Web Audio API Sound Generation

**Correct Answer Sound (Nut Crack):**
* Short, sharp click sound
* Frequency: 800Hz spike, quick decay
* Duration: ~0.1 seconds

**Incorrect Answer Sound (Jaw Break):**
* Descending tone (failure sound)
* Start: 400Hz, End: 100Hz
* Duration: ~0.3 seconds

**Button Click Sound:**
* Simple blip
* Frequency: 600Hz
* Duration: ~0.05 seconds

**Level Complete Sound (Optional):**
* Ascending arpeggio
* Notes: C-E-G-C (262, 330, 392, 523 Hz)
* Duration: ~0.5 seconds

### Sound Manager Class Structure
```javascript
class SoundManager {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  playCorrect() { /* Generate crack sound */ }
  playIncorrect() { /* Generate break sound */ }
  playClick() { /* Generate blip sound */ }
  playLevelComplete() { /* Generate victory jingle */ }
}
```

## 9. 🎨 CSS Pixel Art Implementation

### Design Approach
* Use CSS Grid or pseudo-elements to create blocky pixel characters
* Alternative: Use HTML5 Canvas for more complex sprites
* All elements should have crisp, non-anti-aliased edges

### Key CSS Properties
```css
* {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.pixel-text {
  font-family: 'Press Start 2P', monospace; /* or similar pixel font */
  text-rendering: geometricPrecision;
}
```

### Nutcracker Character Sprites
**Idle State:** Simple blocky nutcracker figure
**Crack Animation:** Nutcracker with nut, cracking motion
**Break Animation:** Nutcracker with broken jaw pieces

### Answer "Nuts"
* Oval/circular blocky shapes
* Distinct color for each (brown variations)
* Hover state: slight scale/glow effect
* Click state: brief squish animation

## 10. 📱 Responsive Design

* **Desktop:** Optimal experience, full layout
* **Tablet:** Slightly scaled UI, touch-friendly buttons
* **Mobile:** Portrait orientation, stacked layout, large touch targets
* Minimum button size: 44x44px for accessibility

## 11. ♿ Accessibility

* Keyboard navigation support (Tab, Enter, 1-4 keys)
* ARIA labels for screen readers
* High contrast text for readability
* Focus indicators on interactive elements
* Sound effects should be optional (future: mute toggle)

## 12. ⚡ Performance Considerations

* Minimize re-renders during animations
* Lazy load leaderboard data
* Cache sound generation contexts
* Optimize CSS animations (use `transform` and `opacity`)

## 13. ❌ Out of Scope (For v1.2)

* Timers per question
* Background music (looping tracks)
* User accounts / authentication
* Difficulty selection
* Badges or achievement system
* Social sharing
* Multi-language support
* Mute/volume controls (consider for v1.3)

## 14. 🚀 Deployment Checklist

- [ ] Set up Vercel project
- [ ] Configure Vercel Postgres database
- [ ] Run database migration (create leaderboard table)
- [ ] Set environment variables for database connection
- [ ] Test on multiple devices/browsers
- [ ] Verify sound works on iOS/Safari (requires user interaction first)
- [ ] Test leaderboard functionality end-to-end
- [ ] Verify all animations play smoothly
- [ ] Check responsive design on mobile

---

## 15. 📝 Implementation Notes

### Recommended File Structure
```
nutcracker-app-123/
├── src/
│   ├── components/
│   │   ├── StartScreen.jsx
│   │   ├── GameScreen.jsx
│   │   ├── LeaderboardScreen.jsx
│   │   ├── HelpScreen.jsx
│   │   ├── GameOverScreen.jsx
│   │   ├── Nutcracker.jsx (character component)
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
│   └── leaderboard.js (Vercel serverless function)
└── public/
    └── index.html
```

### State Management
Consider using React Context or a simple state management pattern for:
* Current level
* Current question number
* Score
* Strikes remaining
* Game state (start, playing, game over)

### Question Generation Algorithm
```javascript
function generateQuestion(level) {
  // 1. Determine operation type based on level
  // 2. Generate random numbers within level's range
  // 3. Calculate correct answer
  // 4. Generate 3 unique wrong answers within specified range
  // 5. Shuffle all 4 answers
  // 6. Return question object
}
```

---

**End of PRD v1.2**
