const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Lexer Test Operator Categorization ===\n');

const tests = [
  '[ -f file.txt ]',
  '[ $i -lt 10 ]',
  '[ -f file.txt -a -r file.txt ]',
  '[ $i -eq 5 -o $j -gt 0 ]'
];

tests.forEach((test, index) => {
  console.log(`\n--- Test ${index + 1} ---`);
  console.log('Input:', test);

  const lexer = new BashLexer(test);
  const tokens = lexer.tokenize();

  console.log('Tokens:');
  tokens.forEach((token, i) => {
    console.log(`  ${i}: ${token.type} "${token.value}"`);
  });
});