import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `answer-${answer}`,
    data: { answer },
    disabled: disabled || showResult
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 1 : 1, // Keep opacity 1 for better visuals, rely on scale/shadow
    touchAction: 'none',
    willChange: 'transform', // Optimize performance
    transition: 'none', // IMPORTANT: Disable CSS transitions during drag to prevent lag
    outline: 'none', // Remove default outline
    border: 'none', // Ensure no border
    boxShadow: 'none', // Remove any default box shadow
    background: 'transparent' // Ensure transparent background
  } : undefined;

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

    if (isDragging) {
      className += ' dragging';
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
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={getClassName()}
      onClick={onClick}
      disabled={disabled}
      aria-label={getAriaLabel()}
      tabIndex={disabled ? -1 : 0}
    >
      <div className={`nut-shell ${isDragging ? 'nut-dragging-highlight' : ''}`}>
        <div className="nut-texture"></div>
        <div className="keyboard-number pixel-text-small">
          {index + 1}
        </div>
      </div>
      <div className="answer-value pixel-text">
        {answer}
      </div>
    </button>
  );
}

export default AnswerNut;
