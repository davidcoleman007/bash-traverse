const { parse } = require('../dist');

console.log('=== Debugging Case Statement EOF Issue ===\n');

const caseCode = 'case $var in start) echo "Starting";; stop) echo "Stopping";; esac';

console.log('Original code:', caseCode);
console.log('Length:', caseCode.length);

// Check lexer output
console.log('\n--- Lexer Output ---');
const { BashLexer } = require('../dist');
const lexer = new BashLexer(caseCode);
const tokens = lexer.tokenize();
console.log('Tokens:');
tokens.forEach((token, index) => {
  console.log(`  ${index}: ${token.type} = "${token.value}"`);
});

console.log('\n--- Starting Parse ---');
try {
  const ast = parse(caseCode);
  console.log('✅ Parse completed successfully!');
  console.log('AST type:', ast.type);
  console.log('AST body length:', ast.body.length);
} catch (error) {
  console.log('❌ Parse failed:', error.message);
  console.log('Stack trace:', error.stack);
}