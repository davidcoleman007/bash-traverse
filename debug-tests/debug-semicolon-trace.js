const { parse, generate } = require('../dist/index.js');

const source = `function test() {
    echo "Hello"
    echo "World"
}`;

console.log('=== Semicolon Trace Debug ===\n');

try {
  const ast = parse(source);
  console.log('✅ Parsed successfully');

  // Let's manually trace the generation
  console.log('\n--- Manual Generation Trace ---');

  const functionDef = ast.body[0];
  console.log('Function name:', functionDef.name.text);
  console.log('Function body statements:');
  functionDef.body.forEach((stmt, index) => {
    console.log(`  ${index}: ${stmt.type} - ${JSON.stringify(stmt)}`);
  });

  console.log('\n--- Full Generation ---');
  const generated = generate(ast);
  console.log('Generated:', JSON.stringify(generated));

} catch (error) {
  console.error('❌ Error:', error.message);
}