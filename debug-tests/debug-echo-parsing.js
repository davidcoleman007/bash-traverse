const { parse, generate } = require('../dist/index.js');

console.log('=== Debug Echo Command Parsing ===\n');

const echoTests = [
  'echo "hello world"',
  'echo "Count: $i"',
  'echo "Starting..."'
];

echoTests.forEach((test, index) => {
  console.log(`\n--- Echo Test ${index + 1} ---`);
  console.log('Input:', test);

  try {
    const ast = parse(test);
    console.log('✅ Parse successful');
    console.log('Command name:', ast.body[0].name.text);
    console.log('Arguments:', ast.body[0].arguments.map(arg => arg.text));
    console.log('Full AST:', JSON.stringify(ast.body[0], null, 2));

    const generated = generate(ast);
    console.log('Generated:', generated);

  } catch (error) {
    console.log('❌ Failed:', error.message);
  }
});