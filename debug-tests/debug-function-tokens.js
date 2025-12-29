#!/usr/bin/env node

const { BashLexer } = require('../dist/lexer');
const { parse } = require('../dist/parser');

console.log('=== Function Tokenization Debug ===\n');

const functionCode = 'function build() {\n    echo "Building project..."\n    npm run build\n}';

console.log('Input code:');
console.log(functionCode);
console.log('\n--- Tokenization ---');

const lexer = new BashLexer(functionCode);
const tokens = lexer.tokenize();
console.log('Tokens:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} = "${token.value}"`);
});

console.log('\n--- Parsing ---');
try {
  const ast = parse(functionCode);
  console.log('Parse successful');
  console.log('AST:', JSON.stringify(ast, null, 2));
} catch (error) {
  console.log('Parse failed:', error.message);
  console.log('Error stack:', error.stack);
}