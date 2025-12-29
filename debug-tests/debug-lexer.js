#!/usr/bin/env node

const { BashLexer } = require('../dist');

console.log('🔍 Debugging lexer step by step...\n');

const testCase = 'echo   "hello world"';  // Multiple spaces

console.log('Original:');
console.log(`"${testCase}"`);
console.log('Length:', testCase.length);

// Show character by character
console.log('\nCharacter analysis:');
for (let i = 0; i < testCase.length; i++) {
  const char = testCase[i];
  const code = char.charCodeAt(0);
  console.log(`${i}: '${char}' (${code}) - isWhitespace: ${/\s/.test(char) && char !== '\n'}`);
}

try {
  const lexer = new BashLexer(testCase);
  const tokens = lexer.tokenize();

  console.log('\nGenerated tokens:');
  console.log('Total tokens:', tokens.length);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    console.log(`${i}: ${token.type} = "${token.value}" (length: ${token.value.length})`);
  }

  // Test individual characters
  console.log('\nTesting individual characters:');
  const testChars = [' ', '\t', '\n'];
  for (const char of testChars) {
    console.log(`'${char}' (${char.charCodeAt(0)}): isWhitespace = ${/\s/.test(char) && char !== '\n'}`);
  }

} catch (error) {
  console.log('❌ Tokenization failed:', error.message);
  console.log('Stack:', error.stack);
}