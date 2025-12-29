const { BashLexer } = require('../dist/lexer');

console.log('=== Token Type Debug ===\n');

// Test cases that are failing
const testCases = [
  {
    name: 'Pipeline with &&',
    code: 'npm install && npm test'
  },
  {
    name: 'Pipeline with ||',
    code: 'npm install || echo "failed"'
  },
  {
    name: 'Complex Variable Assignment with &&',
    code: 'NODE_ENV=production npm install && npm test'
  }
];

for (const testCase of testCases) {
  console.log(`--- ${testCase.name} ---`);
  console.log('Input:', testCase.code);

  try {
    const lexer = new BashLexer(testCase.code);
    const tokens = lexer.tokenize();

    console.log('Tokens:');
    tokens.forEach((token, index) => {
      console.log(`  ${index}: ${token.type} "${token.value}"`);
    });

    console.log('\nFirst token type:', tokens[0]?.type);
    console.log('Second token type:', tokens[1]?.type);

  } catch (error) {
    console.log('❌ Lexer failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');
}