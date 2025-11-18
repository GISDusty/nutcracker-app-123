// Answer choice component styled as a pixel art "nut"

function AnswerNut({
  answer,
  index,
  onClick,
  isSelected,
  isCorrect,
  showResult,
  disabled
}) {
  const getClassName = () => {
    let className = 'answer-nut';

    if (showResult && isSelected) {
      className += isCorrect ? ' correct' : ' incorrect';
    } else if (!disabled) {
      className += ' clickable';
    }

    if (disabled) {
      className += ' disabled';
    }

    return className;
  };

  const getAriaLabel = () => {
    let label = `Answer ${index + 1}: ${answer}`;
    if (showResult && isSelected) {
      label += isCorrect ? ' (Correct!)' : ' (Incorrect)';
    }
    return label;
  };

  return (
    <button
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
      aria-label={getAriaLabel()}
      tabIndex={disabled ? -1 : 0}
    >
      <div className="nut-shell">
        <div className="nut-texture"></div>
      </div>
      <div className="answer-value pixel-text">
        {answer}
      </div>
      <div className="keyboard-number pixel-text-small">
        {index + 1}
      </div>
    </button>
  );
}

export default AnswerNut;
