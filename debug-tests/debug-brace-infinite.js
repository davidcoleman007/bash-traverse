const { parse } = require('../dist');

console.log('=== Debugging Brace Group Infinite Loop ===\n');

const braceCode = '{ echo "hello"; echo "world"; }';

console.log('Original code:', braceCode);
console.log('Length:', braceCode.length);

// Check lexer output
console.log('\n--- Lexer Output ---');
const { BashLexer } = require('../dist');
const lexer = new BashLexer(braceCode);
const tokens = lexer.tokenize();
console.log('Tokens:');
tokens.forEach((token, index) => {
  console.log(`  ${index}: ${token.type} = "${token.value}"`);
});

console.log('\n--- Starting Parse ---');
try {
  const ast = parse(braceCode);
  console.log('✅ Parse completed successfully!');
  console.log('AST type:', ast.type);
  console.log('AST body length:', ast.body.length);
} catch (error) {
  console.log('❌ Parse failed:', error.message);
  console.log('Stack trace:', error.stack);
}