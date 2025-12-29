#!/usr/bin/env node

// Test the SPACE token logic directly
console.log('🧪 Testing SPACE token logic...\n');

// Simulate the isWhitespace function
function isWhitespace(char) {
  return /\s/.test(char) && char !== '\n';
}

// Simulate the readSpace logic
function readSpace(source, startPos) {
  let value = '';
  let position = startPos;

  while (position < source.length && isWhitespace(source[position])) {
    value += source[position];
    position++;
  }

  return { value, endPos: position };
}

const testCase = 'echo   "hello world"';  // Multiple spaces

console.log('Original:');
console.log(`"${testCase}"`);
console.log('Length:', testCase.length);

// Show character by character
console.log('\nCharacter analysis:');
for (let i = 0; i < testCase.length; i++) {
  const char = testCase[i];
  const code = char.charCodeAt(0);
  console.log(`${i}: '${char}' (${code}) - isWhitespace: ${isWhitespace(char)}`);
}

// Test SPACE token generation
console.log('\nSPACE token generation:');
let pos = 0;
while (pos < testCase.length) {
  const char = testCase[pos];

  if (isWhitespace(char)) {
    const spaceResult = readSpace(testCase, pos);
    console.log(`SPACE token at position ${pos}: "${spaceResult.value}" (length: ${spaceResult.value.length})`);
    pos = spaceResult.endPos;
  } else {
    // Skip non-whitespace characters
    pos++;
  }
}

console.log('\nExpected tokens:');
console.log('1. WORD: "echo"');
console.log('2. SPACE: "   " (3 spaces)');
console.log('3. STRING: ""hello world""');
console.log('4. SPACE: " " (1 space)');
console.log('5. WORD: "world"');