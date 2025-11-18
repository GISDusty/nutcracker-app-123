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
