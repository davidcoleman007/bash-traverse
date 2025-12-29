const { parse, generate } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug parseWord Method ===\n');

// Test different token sequences
const tests = [
  'echo "hello"',
  '"hello" echo',
  'echo',
  '"hello"'
];

tests.forEach((test, index) => {
  console.log(`\n--- Test ${index + 1} ---`);
  console.log('Input:', test);

  // Get tokens
  const lexer = new BashLexer(test);
  const tokens = lexer.tokenize();

  console.log('Tokens:');
  tokens.forEach((token, i) => {
    console.log(`  ${i}: ${token.type} "${token.value}"`);
  });

  // Parse and see what happens
  try {
    const ast = parse(test);
    console.log('Parse result:');
    ast.body.forEach((stmt, i) => {
      console.log(`  Statement ${i}: ${stmt.type}`);
      if (stmt.type === 'Command') {
        console.log(`    Command name: ${stmt.name.text}`);
        console.log(`    Arguments: ${stmt.arguments.map(arg => arg.text)}`);
      }
    });
  } catch (error) {
    console.log('Parse failed:', error.message);
  }
});