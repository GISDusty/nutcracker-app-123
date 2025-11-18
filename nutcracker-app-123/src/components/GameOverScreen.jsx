import { useState, useEffect } from 'react';

function GameOverScreen({ score, onPlayAgain, onMainMenu, onShowLeaderboard }) {
  const [isTopTen, setIsTopTen] = useState(false);
  const [initials, setInitials] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkIfTopTen();
  }, [score]);

  const checkIfTopTen = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const leaderboard = await response.json();

        // Check if score makes top 10
        if (leaderboard.length < 10) {
          setIsTopTen(true);
        } else {
          const lowestScore = leaderboard[leaderboard.length - 1].score;
          setIsTopTen(score > lowestScore);
        }
      } else {
        // If API fails, assume top 10 for good UX
        setIsTopTen(score >= 30);
      }
    } catch (error) {
      console.error('Error checking leaderboard:', error);
      setIsTopTen(score >= 30);
    }
  };

  const getPerformanceMessage = () => {
    if (score >= 45) return "Perfect! You're a Math Master!";
    if (score >= 35) return "Excellent Work!";
    if (score >= 25) return "Great Job!";
    if (score >= 15) return "Good Try!";
    return "Keep Practicing!";
  };

  const handleInitialsChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    setInitials(value.slice(0, 3));
  };

  const handleSubmit = async () => {
    if (initials.length !== 3 || submitting) return;

    setSubmitting(true);

    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initials, score }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onShowLeaderboard();
        }, 1500);
      } else {
        throw new Error('Failed to submit score');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Failed to submit score. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="screen game-over-screen">
      <h1 className="pixel-title">GAME OVER!</h1>

      <div className="final-score">
        <div className="pixel-text">FINAL SCORE</div>
        <div className="score-display pixel-title">{score} / 50</div>
      </div>

      <div className="performance-message pixel-text">
        {getPerformanceMessage()}
      </div>

      {isTopTen && !submitted && (
        <div className="top-ten-entry">
          <div className="congrats-message pixel-text">
            🎉 You made the Top 10! 🎉
          </div>

          <div className="initials-input-group">
            <label htmlFor="initials" className="pixel-text">
              Enter Your Initials (3 letters):
            </label>
            <input
              id="initials"
              type="text"
              className="pixel-input"
              value={initials}
              onChange={handleInitialsChange}
              maxLength={3}
              placeholder="ABC"
              aria-label="Enter your initials"
              autoFocus
            />
          </div>

          <button
            className="pixel-button primary"
            onClick={handleSubmit}
            disabled={initials.length !== 3 || submitting}
            aria-label="Submit to leaderboard"
          >
            {submitting ? 'SUBMITTING...' : 'SUBMIT TO LEADERBOARD'}
          </button>
        </div>
      )}

      {submitted && (
        <div className="submitted-message pixel-text">
          Score submitted! Redirecting to leaderboard...
        </div>
      )}

      <div className="button-group">
        <button
          className="pixel-button primary"
          onClick={onPlayAgain}
          aria-label="Play again"
        >
          PLAY AGAIN
        </button>
        <button
          className="pixel-button"
          onClick={onMainMenu}
          aria-label="Return to main menu"
        >
          MAIN MENU
        </button>
      </div>
    </div>
  );
}

export default GameOverScreen;
