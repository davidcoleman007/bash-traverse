const { BashLexer } = require('../dist/lexer');
const { parse } = require('../dist/parser');

console.log('=== Case Statement Tokenization Debug ===\n');

const caseCode = 'case $1 in\n    start)\n        echo "Starting..."\n        ;;\n    stop)\n        echo "Stopping..."\n        ;;\n    *)\n        echo "Unknown command"\n        ;;\nesac';

console.log('Input code:');
console.log(caseCode);
console.log('\n--- Tokenization ---');

const lexer = new BashLexer(caseCode);
const tokens = lexer.tokenize();
console.log('Tokens:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} = "${token.value}"`);
});

console.log('\n--- Parsing ---');
try {
  const ast = parse(caseCode);
  console.log('Parse successful');
  console.log('AST:', JSON.stringify(ast, null, 2));
} catch (error) {
  console.log('Parse failed:', error.message);
  console.log('Error stack:', error.stack);
}