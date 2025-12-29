const { parse } = require('../dist/index');

console.log('=== Spacing AST Debug ===\n');

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
  const main = ast.body[0];
  if (main.type === 'FunctionDefinition' || main.type === 'BraceGroup') {
    console.log('First node in body:', main.body[0]?.type, JSON.stringify(main.body[0]));
    console.log('Last node in body:', main.body[main.body.length-1]?.type, JSON.stringify(main.body[main.body.length-1]));
  } else if (main.type === 'IfStatement') {
    console.log('First node in thenBody:', main.thenBody[0]?.type, JSON.stringify(main.thenBody[0]));
    console.log('Last node in thenBody:', main.thenBody[main.thenBody.length-1]?.type, JSON.stringify(main.thenBody[main.thenBody.length-1]));
    if (main.elseBody) {
      console.log('First node in elseBody:', main.elseBody[0]?.type, JSON.stringify(main.elseBody[0]));
      console.log('Last node in elseBody:', main.elseBody[main.elseBody.length-1]?.type, JSON.stringify(main.elseBody[main.elseBody.length-1]));
    }
  }
  console.log('\n' + '='.repeat(50) + '\n');
}