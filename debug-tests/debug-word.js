#!/usr/bin/env node

// Test the generateWord logic directly
console.log('🧪 Testing generateWord logic...\n');

// Simulate the generateWord logic
function generateWord(word) {
  if (word.quoted) {
    // If the text already contains quotes, don't add more
    if (word.text.startsWith('"') && word.text.endsWith('"')) {
      return word.text;
    }
    if (word.text.startsWith("'") && word.text.endsWith("'")) {
      return word.text;
    }

    const quote = word.quoteType || '"';
    return `${quote}${word.text}${quote}`;
  }
  return word.text;
}

// Test cases
const testCases = [
  {
    name: 'Unquoted word',
    word: {
      type: 'Word',
      text: 'echo',
      quoted: false
    },
    expected: 'echo'
  },
  {
    name: 'Quoted word',
    word: {
      type: 'Word',
      text: 'hello world',
      quoted: true,
      quoteType: '"'
    },
    expected: '"hello world"'
  },
  {
    name: 'Already quoted word',
    word: {
      type: 'Word',
      text: '"hello world"',
      quoted: true,
      quoteType: '"'
    },
    expected: '"hello world"'
  }
];

for (const testCase of testCases) {
  console.log(`\n${testCase.name}:`);
  console.log('Input:', JSON.stringify(testCase.word, null, 2));
  const result = generateWord(testCase.word);
  console.log('Result:', `"${result}"`);
  console.log('Expected:', `"${testCase.expected}"`);
  console.log('Match:', result === testCase.expected);
}