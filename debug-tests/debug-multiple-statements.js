const { parse, generate } = require('../dist/index.js');

console.log('=== Debug Multiple Statements ===\n');

const ifStatement = `if [ -f file.txt ]; then
    echo "file exists"
    echo "processing file"
fi`;

console.log('Input:');
console.log(ifStatement);

try {
  const ast = parse(ifStatement);
  console.log('\n✅ Parse successful');
  console.log('Then body statements:', ast.body[0].thenBody.length);

  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(generated);

  // Parse the generated code
  const roundTripAst = parse(generated);
  console.log('\n✅ Round-trip parse successful');

} catch (error) {
  console.log('\n❌ Failed:', error.message);
}