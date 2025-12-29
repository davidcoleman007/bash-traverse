const { parse, generate } = require('../dist/index.js');

const source = `function test() {
    echo "Hello"
    echo "World"
}`;

console.log('=== Function Definition Newline Debug ===\n');
console.log('Source:');
console.log(JSON.stringify(source, null, 2));
console.log('\n---\n');

try {
  const ast = parse(source);
  console.log('✅ Parsed successfully');

  // Inspect the function body
  const functionDef = ast.body[0];
  console.log('Function body statements:');
  functionDef.body.forEach((stmt, index) => {
    console.log(`  ${index}: ${stmt.type} - ${JSON.stringify(stmt)}`);
  });

  console.log('\n---\n');

  const generated = generate(ast);
  console.log('Generated:');
  console.log(JSON.stringify(generated, null, 2));

} catch (error) {
  console.error('❌ Error:', error.message);
}