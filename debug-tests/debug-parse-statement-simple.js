const { BashLexer } = require('../dist');

console.log('=== Parse Statement Simple Debug ===\n');

// Test just a newline
const source = '\n';

console.log('Source:', JSON.stringify(source));
console.log('---');

try {
  const lexer = new BashLexer(source);
  const tokens = lexer.tokenize();
  console.log('Tokens:');
  tokens.forEach((token, i) => {
    console.log(`  ${i}: ${token.type} "${token.value}"`);
  });

  // Now let's manually test parseStatement
  const { BashParser } = require('../dist');
  const parser = new BashParser();
  parser.tokens = tokens;
  parser.current = 0;

  console.log('\nTesting parseStatement:');
  const result = parser.parseStatement();
  console.log('Result:', result ? result.type : 'null');

} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}