import { useState, useEffect } from 'react';

function LeaderboardScreen({ onBack }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaderboard');

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      setLeaderboard(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Unable to load leaderboard. Using demo data.');

      // Demo data for development
      setLeaderboard([
        { initials: 'AAA', score: 50 },
        { initials: 'BBB', score: 48 },
        { initials: 'CCC', score: 45 },
        { initials: 'DDD', score: 42 },
        { initials: 'EEE', score: 40 },
        { initials: 'FFF', score: 35 },
        { initials: 'GGG', score: 30 },
        { initials: 'HHH', score: 25 },
        { initials: 'III', score: 20 },
        { initials: 'JJJ', score: 15 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen leaderboard-screen">
      <h1 className="pixel-title">LEADERBOARD</h1>

      {loading ? (
        <div className="pixel-text">Loading...</div>
      ) : (
        <>
          {error && <div className="error-message pixel-text-small">{error}</div>}

          <div className="leaderboard-table">
            <div className="leaderboard-header pixel-text">
              <div className="rank-col">RANK</div>
              <div className="initials-col">PLAYER</div>
              <div className="score-col">SCORE</div>
            </div>

            <div className="leaderboard-body">
              {leaderboard.length === 0 ? (
                <div className="pixel-text empty-message">
                  No scores yet. Be the first!
                </div>
              ) : (
                leaderboard.map((entry, index) => (
                  <div key={index} className="leaderboard-row pixel-text">
                    <div className="rank-col">{index + 1}</div>
                    <div className="initials-col">{entry.initials}</div>
                    <div className="score-col">{entry.score}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

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

export default LeaderboardScreen;
