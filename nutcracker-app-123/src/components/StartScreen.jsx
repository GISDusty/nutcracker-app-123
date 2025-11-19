import Nutcracker from './Nutcracker';

function StartScreen({ onStartGame, onShowLeaderboard, onShowHelp }) {
  return (
    <div className="screen start-screen">
      <h1 className="pixel-title game-title">
        NUTCRACKER
        <br />
        APP 123
      </h1>

      <div className="character-display">
        <Nutcracker state="idle" />

        {/* Pile of Nuts Decoration */}
        <div className="pile-of-nuts">
          <div className="decor-nut nut-1">
            <div className="nut-shell">
              <div className="nut-texture"></div>
            </div>
          </div>
          <div className="decor-nut nut-2">
            <div className="nut-shell">
              <div className="nut-texture"></div>
            </div>
          </div>
          <div className="decor-nut nut-3">
            <div className="nut-shell">
              <div className="nut-texture"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="button-group">
        <button
          className="pixel-button primary"
          onClick={onStartGame}
          aria-label="Start Game"
        >
          START GAME
        </button>
        <button
          className="pixel-button"
          onClick={onShowLeaderboard}
          aria-label="View Leaderboard"
        >
          LEADERBOARD
        </button>
        <button
          className="pixel-button"
          onClick={onShowHelp}
          aria-label="View Help"
        >
          HELP
        </button>
      </div>
    </div>
  );
}

export default StartScreen;
