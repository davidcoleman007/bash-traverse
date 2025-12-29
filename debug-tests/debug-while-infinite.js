const { parse } = require('../dist');

console.log('=== Debugging While Loop Infinite Loop ===\n');

const whileCode = 'while [ $i -lt 10 ]; do echo $i; done';

console.log('Original code:', whileCode);
console.log('Length:', whileCode.length);

// Let's first check the lexer output
console.log('\n--- Lexer Output ---');
const { BashLexer } = require('../dist');
const lexer = new BashLexer(whileCode);
const tokens = lexer.tokenize();
console.log('Tokens:');
tokens.forEach((token, index) => {
  console.log(`  ${index}: ${token.type} = "${token.value}"`);
});

console.log('\n--- Starting Parse ---');
try {
  const ast = parse(whileCode);
  console.log('✅ Parse completed successfully!');
  console.log('AST type:', ast.type);
  console.log('AST body length:', ast.body.length);
} catch (error) {
  console.log('❌ Parse failed:', error.message);
  console.log('Stack trace:', error.stack);
}