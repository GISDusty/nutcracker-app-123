function HelpScreen({ onBack }) {
  return (
    <div className="screen help-screen">
      <h1 className="pixel-title">HOW TO PLAY</h1>

      <div className="help-content pixel-text">
        <p>Welcome to Nutcracker App 123!</p>

        <ul className="help-list">
          <li>Help the Nutcracker crack nuts by solving math problems</li>
          <li>There are 10 levels with 5 questions each</li>
          <li>Be careful! You only get 3 strikes (lives) for the entire game</li>
          <li>Answer correctly to score points</li>
          <li>Get a high score to make the Top 10 Leaderboard!</li>
        </ul>

        <p className="help-section">
          <strong>How to Answer:</strong>
          <br />
          Click a nut to select your answer, or press keys 1-4 on your keyboard!
        </p>

        <p className="help-section">
          <strong>Scoring:</strong>
          <br />
          Each correct answer = 1 point
          <br />
          Maximum score = 50 points
        </p>
      </div>

      <div className="button-group">
        <button
          className="pixel-button primary"
          onClick={onBack}
          aria-label="Back to main menu"
        >
          BACK
        </button>
      </div>
    </div>
  );
}

export default HelpScreen;
