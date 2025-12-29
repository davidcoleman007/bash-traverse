const { parse, generate } = require('../dist/index.js');

console.log('=== Debug Newline Parsing ===\n');

const tests = [
  'echo "hello"',
  '\necho "hello"',
  'echo "hello"\n',
  '\necho "hello"\n'
];

tests.forEach((test, index) => {
  console.log(`\n--- Test ${index + 1} ---`);
  console.log('Input:', JSON.stringify(test));

  try {
    const ast = parse(test);
    console.log('✅ Parse successful');
    console.log('Statements:', ast.body.length);

    ast.body.forEach((stmt, i) => {
      console.log(`Statement ${i}:`, stmt.type);
      if (stmt.type === 'Command') {
        console.log(`  Command name: ${stmt.name.text}`);
        console.log(`  Arguments: ${stmt.arguments.map(arg => arg.text)}`);
      }
    });

  } catch (error) {
    console.log('❌ Failed:', error.message);
  }
});