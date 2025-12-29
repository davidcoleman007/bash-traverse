const { BashLexer } = require('../dist/lexer');
const { parse } = require('../dist/parser');

console.log('=== While Loop Tokenization Debug ===\n');

const whileCode = 'while [ $i -lt 10 ]; do\n    echo "Count: $i"\n    i=$((i + 1))\ndone';

console.log('Input code:');
console.log(whileCode);
console.log('\n--- Tokenization ---');

const lexer = new BashLexer(whileCode);
const tokens = lexer.tokenize();
console.log('Tokens:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} = "${token.value}"`);
});

console.log('\n--- Parsing ---');
try {
  const ast = parse(whileCode);
  console.log('Parse successful');
  console.log('AST:', JSON.stringify(ast, null, 2));
} catch (error) {
  console.log('Parse failed:', error.message);
  console.log('Error stack:', error.stack);
}