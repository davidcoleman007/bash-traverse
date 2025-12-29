#!/usr/bin/env node

const { BashLexer } = require('../dist');

console.log('🔍 Debugging token generation...\n');

const testCase = 'echo   "hello world"';  // Multiple spaces

console.log('Original:');
console.log(`"${testCase}"`);

try {
  const lexer = new BashLexer(testCase);
  const tokens = lexer.tokenize();

  console.log('\nGenerated tokens:');
  console.log('Total tokens:', tokens.length);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    console.log(`${i}: ${token.type} = "${token.value}"`);
  }

} catch (error) {
  console.log('❌ Tokenization failed:', error.message);
  console.log('Stack:', error.stack);
}