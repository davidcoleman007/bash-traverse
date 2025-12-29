const { parse, generate } = require('../dist/index.js');

console.log('=== Debug Simple If Statement ===\n');

const simpleIf = `if [ -f file.txt ]; then
    echo "file exists"
fi`;

console.log('Input:');
console.log(simpleIf);

try {
  const ast = parse(simpleIf);
  console.log('\n✅ Parse successful');
  console.log('AST:', JSON.stringify(ast.body[0], null, 2));

  const generated = generate(ast);
  console.log('\nGenerated:', generated);

} catch (error) {
  console.log('\n❌ Failed:', error.message);
  console.log('Stack:', error.stack);
}