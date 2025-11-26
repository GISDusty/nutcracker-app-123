import { useState, useEffect } from 'react';

function LeaderboardScreen({ onBack }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  const fetchLeaderboard = async (ageGroup) => {
    try {
      setLoading(true);
      const url = ageGroup === 'all' ? '/api/leaderboard' : `/api/leaderboard?ageGroup=${ageGroup}`;
      const response = await fetch(url);

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
      const demoData = [
        { initials: 'AAA', score: 50, age: 5 },
        { initials: 'BBB', score: 48, age: 7 },
        { initials: 'CCC', score: 45, age: 9 },
        { initials: 'DDD', score: 42, age: 12 },
        { initials: 'EEE', score: 40, age: 4 },
        { initials: 'FFF', score: 35, age: 6 },
        { initials: 'GGG', score: 30, age: 8 },
        { initials: 'HHH', score: 25, age: 11 },
        { initials: 'III', score: 20, age: 5 },
        { initials: 'JJJ', score: 15, age: 7 },
      ];

      let filteredData = demoData;
      if (ageGroup === '5_under') {
        filteredData = demoData.filter(d => d.age <= 5);
      } else if (ageGroup === '6_7') {
        filteredData = demoData.filter(d => d.age >= 6 && d.age <= 7);
      } else if (ageGroup === '8_10') {
        filteredData = demoData.filter(d => d.age >= 8 && d.age <= 10);
      } else if (ageGroup === '11_up') {
        filteredData = demoData.filter(d => d.age >= 11);
      }

      setLeaderboard(filteredData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen leaderboard-screen">
      <h1 className="pixel-title">LEADERBOARD</h1>

      <div className="leaderboard-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          className={`pixel-button ${activeTab === 'all' ? 'primary' : ''}`}
          onClick={() => setActiveTab('all')}
          style={{ fontSize: '0.8rem', padding: '5px 10px' }}
        >
          ALL AGES
        </button>
        <button
          className={`pixel-button ${activeTab === '5_under' ? 'primary' : ''}`}
          onClick={() => setActiveTab('5_under')}
          style={{ fontSize: '0.8rem', padding: '5px 10px' }}
        >
          5 & UNDER
        </button>
        <button
          className={`pixel-button ${activeTab === '6_7' ? 'primary' : ''}`}
          onClick={() => setActiveTab('6_7')}
          style={{ fontSize: '0.8rem', padding: '5px 10px' }}
        >
          6-7
        </button>
        <button
          className={`pixel-button ${activeTab === '8_10' ? 'primary' : ''}`}
          onClick={() => setActiveTab('8_10')}
          style={{ fontSize: '0.8rem', padding: '5px 10px' }}
        >
          8-10
        </button>
        <button
          className={`pixel-button ${activeTab === '11_up' ? 'primary' : ''}`}
          onClick={() => setActiveTab('11_up')}
          style={{ fontSize: '0.8rem', padding: '5px 10px' }}
        >
          11+
        </button>
      </div>

      {loading ? (
        <div className="pixel-text">Loading...</div>
      ) : (
        <>
          {error && <div className="error-message pixel-text-small">{error}</div>}

          <div className="leaderboard-table">
            <div className="leaderboard-header pixel-text">
              <div className="rank-col">RANK</div>
              <div className="initials-col">PLAYER</div>
              <div className="age-col">AGE</div>
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
                    <div className="age-col">{entry.age || '-'}</div>
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
