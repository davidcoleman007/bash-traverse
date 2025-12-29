const { parse } = require('../dist/index');

console.log('=== Pipeline Parsing Debug ===\n');

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
  },
  {
    name: 'Multiple Statements with &&',
    code: 'echo "First"; echo "Second" && echo "Third"'
  }
];

for (const testCase of testCases) {
  console.log(`--- ${testCase.name} ---`);
  console.log('Input:', testCase.code);

  try {
    const ast = parse(testCase.code);
    console.log('✅ Parse successful');

    console.log('AST body length:', ast.body.length);
    if (ast.body.length > 0) {
      const firstNode = ast.body[0];
      console.log('First node type:', firstNode.type);

      if (firstNode.type === 'Pipeline') {
        console.log('✅ Parsed as Pipeline');
        console.log('Commands:', firstNode.commands.length);
        console.log('Operators:', firstNode.operators);
        console.log('Command names:', firstNode.commands.map(cmd => cmd.name?.text || cmd.type));
      } else {
        console.log('❌ Not parsed as Pipeline, got:', firstNode.type);
      }
    }

  } catch (error) {
    console.log('❌ Parse failed:', error.message);
    console.log('Error stack:', error.stack);
  }

  console.log('\n' + '='.repeat(50) + '\n');
}