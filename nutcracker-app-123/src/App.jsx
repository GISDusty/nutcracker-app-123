import { useState, useEffect } from 'react';
import './styles/App.css';
import './styles/PixelArt.css';
import './styles/Animations.css';
import './styles/Leaderboard.css';

// Components
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import HelpScreen from './components/HelpScreen';
import GameOverScreen from './components/GameOverScreen';

// Utils
import soundManager from './utils/soundManager';

function App() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start', 'game', 'leaderboard', 'help', 'gameOver'

  // Game state
  const [currentLevel, setCurrentLevel] = useState(1); // 1-10
  const [currentQuestion, setCurrentQuestion] = useState(1); // 1-5 per level
  const [score, setScore] = useState(0); // 0-50
  const [strikes, setStrikes] = useState(3); // 0-3
  const [gameActive, setGameActive] = useState(false);

  // Initialize sound on first user interaction
  useEffect(() => {
    const initSound = () => {
      soundManager.init();
      document.removeEventListener('click', initSound);
    };
    document.addEventListener('click', initSound);

    return () => {
      document.removeEventListener('click', initSound);
    };
  }, []);

  /**
   * Start a new game
   */
  const startNewGame = () => {
    setCurrentLevel(1);
    setCurrentQuestion(1);
    setScore(0);
    setStrikes(3);
    setGameActive(true);
    setCurrentScreen('game');
    soundManager.playClick();
  };

  /**
   * Navigate to a screen
   */
  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    soundManager.playClick();
  };

  /**
   * Handle correct answer
   */
  const handleCorrectAnswer = () => {
    const newScore = score + 1;
    setScore(newScore);
    soundManager.playCorrect();

    // Check if this was the last question of the level
    if (currentQuestion === 5) {
      // Level complete!
      soundManager.playLevelComplete();

      // Check if this was the last level
      if (currentLevel === 10) {
        // Game complete!
        setGameActive(false);
        setTimeout(() => {
          setCurrentScreen('gameOver');
        }, 1500);
      } else {
        // Move to next level
        setTimeout(() => {
          setCurrentLevel(currentLevel + 1);
          setCurrentQuestion(1);
        }, 1500);
      }
    } else {
      // Next question in same level
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 1200);
    }
  };

  /**
   * Handle incorrect answer
   */
  const handleIncorrectAnswer = () => {
    const newStrikes = strikes - 1;
    setStrikes(newStrikes);
    soundManager.playIncorrect();

    if (newStrikes === 0) {
      // Game over!
      setGameActive(false);
      setTimeout(() => {
        setCurrentScreen('gameOver');
      }, 1500);
    } else {
      // Continue to next question
      if (currentQuestion === 5) {
        // Move to next level even with wrong answer
        if (currentLevel < 10) {
          setTimeout(() => {
            setCurrentLevel(currentLevel + 1);
            setCurrentQuestion(1);
          }, 1200);
        } else {
          // Last question of last level - game over
          setGameActive(false);
          setTimeout(() => {
            setCurrentScreen('gameOver');
          }, 1500);
        }
      } else {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
        }, 1200);
      }
    }
  };

  /**
   * Render current screen
   */
  const renderScreen = () => {
    switch (currentScreen) {
      case 'start':
        return (
          <StartScreen
            onStartGame={startNewGame}
            onShowLeaderboard={() => navigateTo('leaderboard')}
            onShowHelp={() => navigateTo('help')}
          />
        );

      case 'game':
        return (
          <GameScreen
            level={currentLevel}
            questionNumber={currentQuestion}
            score={score}
            strikes={strikes}
            onCorrectAnswer={handleCorrectAnswer}
            onIncorrectAnswer={handleIncorrectAnswer}
            gameActive={gameActive}
            onMainMenu={() => navigateTo('start')}
          />
        );

      case 'leaderboard':
        return (
          <LeaderboardScreen
            onBack={() => navigateTo('start')}
          />
        );

      case 'help':
        return (
          <HelpScreen
            onBack={() => navigateTo('start')}
          />
        );

      case 'gameOver':
        return (
          <GameOverScreen
            score={score}
            onPlayAgain={startNewGame}
            onMainMenu={() => navigateTo('start')}
            onShowLeaderboard={() => navigateTo('leaderboard')}
          />
        );

      default:
        return <StartScreen onStartGame={startNewGame} />;
    }
  };

  return (
    <div className="app pixel-container">
      {renderScreen()}
    </div>
  );
}

export default App;
