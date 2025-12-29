const { parse, generate } = require('../dist/index.js');

console.log('=== Debug While Loop Body ===\n');

const whileLoop = `while [ $i -lt 10 ]; do
    echo "Count: $i"
    i=$((i + 1))
done`;

console.log('Input:');
console.log(whileLoop);

try {
  const ast = parse(whileLoop);
  console.log('\n✅ Parse successful');

  console.log('\n--- While Loop Body Analysis ---');
  const whileStmt = ast.body[0];
  console.log('Body statements count:', whileStmt.body.length);

  whileStmt.body.forEach((stmt, index) => {
    console.log(`\nStatement ${index + 1}:`);
    console.log('Type:', stmt.type);
    if (stmt.type === 'Command') {
      console.log('Command name:', stmt.name.text);
      console.log('Arguments:', stmt.arguments.map(arg => arg.text));
    }
    console.log('Full statement:', JSON.stringify(stmt, null, 2));
  });

  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(generated);

} catch (error) {
  console.log('\n❌ Failed:', error.message);
}