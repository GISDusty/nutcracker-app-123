import { useState, useEffect } from 'react';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
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

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && over.id === 'nutcracker') {
      handleAnswerClick(active.data.current.answer);
    }
  };

  if (!question) {
    return <div className="screen game-screen">Loading...</div>;
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="screen game-screen">
        {/* Header with game stats */}
        {/* Top Bar: Question (Left) and Stats (Right) */}
        <div className="game-top-bar">
          <div className="question-container-top">
            <h2 className="pixel-text question-text-large">
              {question.question}
            </h2>
          </div>

          <div className="stats-container-top">
            <div className="stat">
              <span className="stat-label">LEVEL: </span>
              <span className="stat-value">{level}/10</span>
            </div>
            <div className="stat">
              <span className="stat-label">SCORE: </span>
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
        </div>

        {/* Main game content wrapper for desktop layout */}
        <div className="game-content-wrapper">
          {/* Main game area (Left Panel on Desktop) */}
          <div className="game-main">
            {/* Nutcracker character (Question removed from here) */}

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

          {/* Answer choices (Right Panel on Desktop) */}
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
              Drag nut to nutcracker or press 1-4
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default GameScreen;
