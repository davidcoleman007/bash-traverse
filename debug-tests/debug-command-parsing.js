const { parse } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Command Parsing ===\n');

// Test simple command parsing
const simpleCommand = `echo "Starting..."`;

console.log('Input:');
console.log(simpleCommand);
console.log('\n--- Token Stream ---');
const lexer = new BashLexer(simpleCommand);
const tokens = lexer.tokenize();
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});
console.log('\n--- Parse Attempt ---');

try {
  const ast = parse(simpleCommand);
  console.log('✅ Parse successful');
  console.log('AST:', JSON.stringify(ast, null, 2));
} catch (error) {
  console.log('❌ Parse failed:', error.message);
  console.log('Error stack:', error.stack);
}