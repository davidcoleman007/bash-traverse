const { parse, generate } = require('../dist/index.js');

console.log('=== Debug While Loop AST ===\n');

const whileLoop = `while [ $i -lt 10 ]; do
    echo "Count: $i"
    i=$((i + 1))
done`;

console.log('Input:');
console.log(whileLoop);

try {
  const ast = parse(whileLoop);
  console.log('\n✅ Parse successful');
  console.log('AST:', JSON.stringify(ast, null, 2));

} catch (error) {
  console.log('\n❌ Failed:', error.message);
}