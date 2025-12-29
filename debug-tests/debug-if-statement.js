const { parse, generate } = require('../dist/index.js');

console.log('=== Debug If Statement ===\n');

const ifStatement = `if [ -f file.txt ]; then
    echo "file exists"
fi`;

console.log('Input:');
console.log(ifStatement);

try {
  const ast = parse(ifStatement);
  console.log('\n✅ Parse successful');
  console.log('Condition type:', ast.body[0].condition.type);
  console.log('Then body statements:', ast.body[0].thenBody.length);

  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(generated);

  // Test round-trip
  const ast2 = parse(generated);
  console.log('\n✅ Round-trip parse successful');

} catch (error) {
  console.log('\n❌ Failed:', error.message);
}