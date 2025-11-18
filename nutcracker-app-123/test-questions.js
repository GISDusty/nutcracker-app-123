// Test script for question generation
// Run with: node test-questions.js

import { generateQuestion } from './src/utils/questionGenerator.js';

console.log('🎯 Testing Question Generation for All 10 Levels\n');
console.log('='.repeat(70));

// Test each level
for (let level = 1; level <= 10; level++) {
  console.log(`\n📊 LEVEL ${level}`);
  console.log('-'.repeat(70));

  // Generate 3 sample questions for each level
  for (let i = 1; i <= 3; i++) {
    try {
      const question = generateQuestion(level);

      // Verify question structure
      if (!question.question || !question.answers || question.answers.length !== 4) {
        console.error(`❌ Invalid question structure!`, question);
        continue;
      }

      // Verify correct answer is in the answers array
      if (!question.answers.includes(question.correctAnswer)) {
        console.error(`❌ Correct answer not in answers array!`, question);
        continue;
      }

      // Check for duplicate answers
      const uniqueAnswers = new Set(question.answers);
      if (uniqueAnswers.size !== 4) {
        console.error(`❌ Duplicate answers found!`, question.answers);
        continue;
      }

      // Check for negative answers
      const hasNegative = question.answers.some(ans => ans < 0);
      if (hasNegative) {
        console.error(`❌ Negative answer found!`, question.answers);
        continue;
      }

      // Special check for division (Level 10)
      if (question.operator === '÷') {
        const remainder = question.num1 % question.num2;
        if (remainder !== 0) {
          console.error(`❌ Division has remainder! ${question.num1} ÷ ${question.num2} = ${question.num1 / question.num2}`);
          continue;
        }
      }

      // Display question
      console.log(`  ${i}. ${question.question} → Answer: ${question.correctAnswer}`);
      console.log(`     Choices: [${question.answers.join(', ')}]`);
      console.log(`     ✅ Valid!`);

    } catch (error) {
      console.error(`❌ Error generating question for level ${level}:`, error.message);
    }
  }
}

console.log('\n' + '='.repeat(70));
console.log('✨ Question Generation Test Complete!\n');

// Test edge cases
console.log('\n🔬 Testing Edge Cases');
console.log('-'.repeat(70));

// Test Level 10 division specifically (100 times to ensure no remainders)
console.log('\n  Testing Level 10 Division (100 iterations)...');
let divisionErrors = 0;
for (let i = 0; i < 100; i++) {
  const question = generateQuestion(10);
  if (question.operator === '÷') {
    const remainder = question.num1 % question.num2;
    if (remainder !== 0) {
      divisionErrors++;
      console.error(`  ❌ Division error: ${question.num1} ÷ ${question.num2} has remainder ${remainder}`);
    }
  }
}

if (divisionErrors === 0) {
  console.log('  ✅ All division problems have no remainders!');
} else {
  console.error(`  ❌ Found ${divisionErrors} division problems with remainders!`);
}

// Test answer uniqueness (1000 questions)
console.log('\n  Testing answer uniqueness (1000 questions)...');
let duplicateErrors = 0;
for (let i = 0; i < 1000; i++) {
  const level = Math.floor(Math.random() * 10) + 1;
  const question = generateQuestion(level);
  const uniqueAnswers = new Set(question.answers);
  if (uniqueAnswers.size !== 4) {
    duplicateErrors++;
  }
}

if (duplicateErrors === 0) {
  console.log('  ✅ All questions have unique answers!');
} else {
  console.error(`  ❌ Found ${duplicateErrors} questions with duplicate answers!`);
}

console.log('\n' + '='.repeat(70));
console.log('🎉 All Tests Complete!\n');
