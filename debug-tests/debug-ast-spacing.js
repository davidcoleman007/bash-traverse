const { parse } = require('../dist/index');

console.log('=== AST Spacing Debug ===\n');

// Test cases with spacing issues
const testCases = [
  {
    name: 'If-Else Statement',
    code: 'if [ -f file.txt ]; then\n    echo "file exists"\nelse\n    echo "file not found"\nfi'
  },
  {
    name: 'Function Definition',
    code: 'function build() {\n    echo "Building project..."\n    npm run build\n}'
  },
  {
    name: 'Brace Group',
    code: '{\n    echo "Starting group"\n    npm install\n    echo "Group complete"\n}'
  }
];

for (const testCase of testCases) {
  console.log(`--- ${testCase.name} ---`);
  console.log('Input:', testCase.code);

  try {
    const ast = parse(testCase.code);
    console.log('✅ Parse successful');

    // Find the main node
    const mainNode = ast.body[0];
    console.log('Main node type:', mainNode.type);

    if (mainNode.type === 'IfStatement') {
      console.log('IfStatement structure:');
      console.log('  Condition:', mainNode.condition.type);
      console.log('  Then body length:', mainNode.thenBody.length);
      console.log('  Else body length:', mainNode.elseBody ? mainNode.elseBody.length : 0);

      console.log('\nThen body statements:');
      mainNode.thenBody.forEach((stmt, index) => {
        console.log(`  ${index}: ${stmt.type} "${stmt.value || stmt.text || 'N/A'}"`);
      });

      if (mainNode.elseBody) {
        console.log('\nElse body statements:');
        mainNode.elseBody.forEach((stmt, index) => {
          console.log(`  ${index}: ${stmt.type} "${stmt.value || stmt.text || 'N/A'}"`);
        });
      }
    } else if (mainNode.type === 'FunctionDefinition') {
      console.log('FunctionDefinition structure:');
      console.log('  Name:', mainNode.name.text);
      console.log('  Body length:', mainNode.body.length);

      console.log('\nBody statements:');
      mainNode.body.forEach((stmt, index) => {
        console.log(`  ${index}: ${stmt.type} "${stmt.value || stmt.text || 'N/A'}"`);
      });
    } else if (mainNode.type === 'BraceGroup') {
      console.log('BraceGroup structure:');
      console.log('  Body length:', mainNode.body.length);

      console.log('\nBody statements:');
      mainNode.body.forEach((stmt, index) => {
        console.log(`  ${index}: ${stmt.type} "${stmt.value || stmt.text || 'N/A'}"`);
      });
    }

  } catch (error) {
    console.log('❌ Parse failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');
}