// Question Generator for Nutcracker App 123
// Generates math questions for all 10 levels with appropriate difficulty

// Level configuration based on PRD Section 5
const LEVEL_CONFIGS = {
  1: {
    type: 'addition',
    min1: 1, max1: 5,
    min2: 1, max2: 5,
    wrongAnswerMin: 1, wrongAnswerMax: 3,
    description: 'Single Digit Addition (Easy)'
  },
  2: {
    type: 'addition',
    min1: 5, max1: 9,
    min2: 5, max2: 9,
    wrongAnswerMin: 2, wrongAnswerMax: 5,
    description: 'Single Digit Addition (Harder)'
  },
  3: {
    type: 'subtraction',
    min1: 5, max1: 9,
    min2: 1, max2: 5,
    wrongAnswerMin: 1, wrongAnswerMax: 3,
    description: 'Single Digit Subtraction'
  },
  4: {
    type: 'addition_no_carry',
    min1: 10, max1: 49,
    min2: 10, max2: 49,
    wrongAnswerMin: 3, wrongAnswerMax: 7,
    description: 'Double Digit Addition (No Carry)'
  },
  5: {
    type: 'subtraction_no_borrow',
    min1: 20, max1: 49,
    min2: 10, max2: 25,
    wrongAnswerMin: 3, wrongAnswerMax: 7,
    description: 'Double Digit Subtraction (No Borrow)'
  },
  6: {
    type: 'multiplication',
    min1: 2, max1: 5,
    min2: 2, max2: 5,
    wrongAnswerMin: 2, wrongAnswerMax: 5,
    description: 'Single Digit Multiplication'
  },
  7: {
    type: 'multiplication',
    min1: 6, max1: 9,
    min2: 6, max2: 9,
    wrongAnswerMin: 5, wrongAnswerMax: 10,
    description: 'Single Digit Multiplication (Harder)'
  },
  8: {
    type: 'addition_with_carry',
    min1: 10, max1: 49,
    min2: 10, max2: 49,
    wrongAnswerMin: 5, wrongAnswerMax: 12,
    description: 'Double Digit Addition (With Carry)'
  },
  9: {
    type: 'subtraction_with_borrow',
    min1: 30, max1: 99,
    min2: 10, max2: 49,
    wrongAnswerMin: 5, wrongAnswerMax: 12,
    description: 'Double Digit Subtraction (With Borrow)'
  },
  10: {
    type: 'mixed',
    wrongAnswerMin: 8, wrongAnswerMax: 15,
    description: 'Multiplication & Division Mix'
  }
};

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Check if addition would require carrying
 */
function hasCarry(num1, num2) {
  const ones1 = num1 % 10;
  const ones2 = num2 % 10;
  return (ones1 + ones2) >= 10;
}

/**
 * Check if subtraction would require borrowing
 */
function hasBorrow(num1, num2) {
  const ones1 = num1 % 10;
  const ones2 = num2 % 10;
  return ones2 > ones1;
}

/**
 * Generate addition question with no carry
 */
function generateAdditionNoCarry(config) {
  let num1, num2;
  let attempts = 0;

  do {
    num1 = randomInt(config.min1, config.max1);
    num2 = randomInt(config.min2, config.max2);
    attempts++;
  } while (hasCarry(num1, num2) && attempts < 100);

  return { num1, num2, operator: '+' };
}

/**
 * Generate addition question with carry
 */
function generateAdditionWithCarry(config) {
  let num1, num2;
  let attempts = 0;

  do {
    num1 = randomInt(config.min1, config.max1);
    num2 = randomInt(config.min2, config.max2);
    attempts++;
  } while (!hasCarry(num1, num2) && attempts < 100);

  return { num1, num2, operator: '+' };
}

/**
 * Generate subtraction question with no borrow
 */
function generateSubtractionNoBorrow(config) {
  let num1, num2;
  let attempts = 0;

  do {
    num1 = randomInt(config.min1, config.max1);
    num2 = randomInt(config.min2, Math.min(config.max2, num1));
    attempts++;
  } while (hasBorrow(num1, num2) && attempts < 100);

  return { num1, num2, operator: '-' };
}

/**
 * Generate subtraction question with borrow
 */
function generateSubtractionWithBorrow(config) {
  let num1, num2;
  let attempts = 0;

  do {
    num1 = randomInt(config.min1, config.max1);
    num2 = randomInt(config.min2, Math.min(config.max2, num1));
    attempts++;
  } while (!hasBorrow(num1, num2) && attempts < 100);

  return { num1, num2, operator: '-' };
}

/**
 * Generate division question (Level 10)
 * CRITICAL: Must result in whole numbers only (no remainders)
 */
function generateDivisionQuestion() {
  const divisor = randomInt(2, 10);
  const quotient = randomInt(Math.floor(20 / divisor), Math.floor(100 / divisor));
  const dividend = divisor * quotient;

  // Verify no remainder
  if (dividend % divisor !== 0) {
    console.error('Division question has remainder!', { dividend, divisor });
  }

  return { num1: dividend, num2: divisor, operator: '÷' };
}

/**
 * Generate multiplication question (Level 10)
 */
function generateMultiplicationHard() {
  const num1 = randomInt(6, 12);
  const num2 = randomInt(6, 12);
  return { num1, num2, operator: '×' };
}

/**
 * Calculate the correct answer based on operator
 */
function calculateAnswer(num1, num2, operator) {
  switch (operator) {
    case '+': return num1 + num2;
    case '-': return num1 - num2;
    case '×': return num1 * num2;
    case '÷': return num1 / num2;
    default: throw new Error(`Unknown operator: ${operator}`);
  }
}

/**
 * Generate 3 unique wrong answers that are plausible
 */
function generateWrongAnswers(correctAnswer, minOffset, maxOffset) {
  const wrongAnswers = new Set();
  const maxAttempts = 100;
  let attempts = 0;

  while (wrongAnswers.size < 3 && attempts < maxAttempts) {
    // Generate offset (can be positive or negative)
    const offset = randomInt(minOffset, maxOffset) * (Math.random() < 0.5 ? 1 : -1);
    const wrongAnswer = correctAnswer + offset;

    // Ensure wrong answer is:
    // 1. Not the correct answer
    // 2. Not negative
    // 3. Not already in the set
    // 4. Not obviously wrong (e.g., 0 for multiplication)
    if (wrongAnswer !== correctAnswer &&
        wrongAnswer >= 0 &&
        wrongAnswer > 0 &&
        !wrongAnswers.has(wrongAnswer)) {
      wrongAnswers.add(wrongAnswer);
    }

    attempts++;
  }

  // If we couldn't generate 3 unique answers, fill with sequential offsets
  while (wrongAnswers.size < 3) {
    const offset = wrongAnswers.size + minOffset;
    const wrongAnswer = correctAnswer + offset;
    if (wrongAnswer >= 1 && wrongAnswer !== correctAnswer) {
      wrongAnswers.add(wrongAnswer);
    }
  }

  return Array.from(wrongAnswers);
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 */
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Main function: Generate a complete question for a given level
 */
export function generateQuestion(level) {
  if (level < 1 || level > 10) {
    throw new Error(`Invalid level: ${level}. Must be 1-10.`);
  }

  const config = LEVEL_CONFIGS[level];
  let questionData;

  // Generate numbers and operator based on level type
  switch (config.type) {
    case 'addition':
      questionData = {
        num1: randomInt(config.min1, config.max1),
        num2: randomInt(config.min2, config.max2),
        operator: '+'
      };
      break;

    case 'subtraction':
      const num1 = randomInt(config.min1, config.max1);
      const num2 = randomInt(config.min2, Math.min(config.max2, num1));
      questionData = { num1, num2, operator: '-' };
      break;

    case 'addition_no_carry':
      questionData = generateAdditionNoCarry(config);
      break;

    case 'subtraction_no_borrow':
      questionData = generateSubtractionNoBorrow(config);
      break;

    case 'multiplication':
      questionData = {
        num1: randomInt(config.min1, config.max1),
        num2: randomInt(config.min2, config.max2),
        operator: '×'
      };
      break;

    case 'addition_with_carry':
      questionData = generateAdditionWithCarry(config);
      break;

    case 'subtraction_with_borrow':
      questionData = generateSubtractionWithBorrow(config);
      break;

    case 'mixed':
      // Level 10: Mix of multiplication and division
      if (Math.random() < 0.5) {
        questionData = generateMultiplicationHard();
      } else {
        questionData = generateDivisionQuestion();
      }
      break;

    default:
      throw new Error(`Unknown question type: ${config.type}`);
  }

  const { num1, num2, operator } = questionData;
  const correctAnswer = calculateAnswer(num1, num2, operator);

  // Generate wrong answers
  const wrongAnswers = generateWrongAnswers(
    correctAnswer,
    config.wrongAnswerMin,
    config.wrongAnswerMax
  );

  // Combine and shuffle all answers
  const allAnswers = shuffle([correctAnswer, ...wrongAnswers]);

  return {
    level,
    question: `${num1} ${operator} ${num2} = ?`,
    num1,
    num2,
    operator,
    correctAnswer,
    answers: allAnswers,
    description: config.description
  };
}

/**
 * Get level configuration (useful for debugging/testing)
 */
export function getLevelConfig(level) {
  return LEVEL_CONFIGS[level];
}
