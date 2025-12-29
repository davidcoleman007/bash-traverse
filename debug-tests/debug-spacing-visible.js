const { parse, generate } = require('../dist/index');

console.log('=== Spacing Visible Output Debug ===\n');

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
  const ast = parse(testCase.code);
  const output = generate(ast);
  const visible = output.replace(/ /g, '_').replace(/\n/g, '\\n');
  console.log('Visible output:', visible);
  console.log('\n' + '='.repeat(50) + '\n');
}