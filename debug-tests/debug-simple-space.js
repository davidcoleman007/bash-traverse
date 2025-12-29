const { parse, generate } = require('../dist/index.js');

console.log('=== Simple Space Debug ===\n');

const testCases = [
  'echo "hello" ',
  'echo "hello"',
  'var=value ',
  'var=value'
];

testCases.forEach((input, index) => {
  console.log(`\n--- Test Case ${index + 1} ---`);
  console.log('Input:', `"${input}"`);

  try {
    const ast = parse(input);
    console.log('AST body length:', ast.body.length);

    if (ast.body.length > 0) {
      const firstNode = ast.body[0];
      console.log('First node type:', firstNode.type);

      if (firstNode.type === 'Command') {
        console.log('Command arguments count:', firstNode.arguments.length);
        firstNode.arguments.forEach((arg, i) => {
          console.log(`  Arg ${i}: ${arg.type} - "${arg.text || arg.value || 'N/A'}"`);
        });
      }
    }

    const generated = generate(ast);
    console.log('Generated:', `"${generated}"`);
    console.log('Match:', input === generated ? '✅ YES' : '❌ NO');

  } catch (error) {
    console.log('Error:', error.message);
  }
});

console.log('\n=== Debug Complete ===');