import { useState, useEffect } from 'react';
import { generateQuestion } from '../utils/questionGenerator';
import Nutcracker from './Nutcracker';
import AnswerNut from './AnswerNut';

function GameScreen({
  level,
  questionNumber,
  score,
  strikes,
  onCorrectAnswer,
  onIncorrectAnswer,
  gameActive
}) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [nutcrackerState, setNutcrackerState] = useState('idle');
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  // Generate question when level or question number changes
  useEffect(() => {
    if (gameActive) {
      const newQuestion = generateQuestion(level);
      setQuestion(newQuestion);
      setSelectedAnswer(null);
      setNutcrackerState('idle');
      setShowLevelComplete(false);
    }
  }, [level, questionNumber, gameActive]);

  // Keyboard support for answer selection (1-4)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameActive || selectedAnswer !== null) return;

      const key = e.key;
      if (['1', '2', '3', '4'].includes(key)) {
        const index = parseInt(key) - 1;
        if (question && question.answers[index] !== undefined) {
          handleAnswerClick(question.answers[index]);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [question, selectedAnswer, gameActive]);

  const handleAnswerClick = (answer) => {
    if (!gameActive || selectedAnswer !== null) return;

    setSelectedAnswer(answer);

    if (answer === question.correctAnswer) {
      // Correct answer
      setNutcrackerState('cracking');

      // Show level complete message if last question
      if (questionNumber === 5) {
        setTimeout(() => {
          setShowLevelComplete(true);
        }, 500);
      }

      onCorrectAnswer();
    } else {
      // Incorrect answer
      setNutcrackerState('broken');
      onIncorrectAnswer();
    }
  };

  if (!question) {
    return <div className="screen game-screen">Loading...</div>;
  }

  return (
    <div className="screen game-screen">
      {/* Header with game stats */}
      <div className="game-header">
        <div className="stat">
          <span className="stat-label">LEVEL</span>
          <span className="stat-value">{level}/10</span>
        </div>
        <div className="stat">
          <span className="stat-label">SCORE</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat strikes-display">
          <span className="stat-label">STRIKES</span>
          <div className="strike-icons">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`strike-icon ${i < strikes ? 'active' : 'lost'}`}
                aria-label={i < strikes ? 'Strike remaining' : 'Strike lost'}
              >
                ♔
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main game area */}
      <div className="game-main">
        {/* Question display */}
        <div className="question-display">
          <h2 className="pixel-text question-text">
            {question.question}
          </h2>
        </div>

        {/* Nutcracker character */}
        <div className="character-area">
          <Nutcracker state={nutcrackerState} />
        </div>

        {/* Level complete message */}
        {showLevelComplete && questionNumber === 5 && (
          <div className="level-complete-message">
            {level < 10 ? `LEVEL ${level} COMPLETE!` : 'GAME COMPLETE!'}
          </div>
        )}
      </div>

      {/* Answer choices */}
      <div className="answer-area">
        <div className="answer-grid">
          {question.answers.map((answer, index) => (
            <AnswerNut
              key={index}
              answer={answer}
              index={index}
              onClick={() => handleAnswerClick(answer)}
              isSelected={selectedAnswer === answer}
              isCorrect={answer === question.correctAnswer}
              showResult={selectedAnswer !== null}
              disabled={selectedAnswer !== null || !gameActive}
            />
          ))}
        </div>
        <div className="keyboard-hint pixel-text-small">
          Press 1-4 to select answer
        </div>
      </div>
    </div>
  );
}

export default GameScreen;
