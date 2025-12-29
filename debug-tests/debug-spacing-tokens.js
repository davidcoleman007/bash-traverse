const { BashLexer } = require('../dist/lexer');

console.log('=== Spacing Token Debug ===\n');

const testCases = [
  {
    name: 'Function Definition',
    code: 'function build() {\n    echo "Building project..."\n    npm run build\n}'
  },
  {
    name: 'Brace Group',
    code: '{\n    echo "Starting group"\n    npm install\n    echo "Group complete"\n}'
  },
  {
    name: 'If-Else Statement',
    code: 'if [ -f file.txt ]; then\n    echo "file exists"\nelse\n    echo "file not found"\nfi'
  }
];

for (const testCase of testCases) {
  console.log(`--- ${testCase.name} ---`);
  console.log('Input:', testCase.code);

  const lexer = new BashLexer(testCase.code);
  const tokens = lexer.tokenize();

  tokens.forEach((token, i) => {
    console.log(`${i}: ${token.type} "${token.value.replace(/\n/g, '\\n')}"`);
  });

  console.log('\n' + '='.repeat(50) + '\n');
}