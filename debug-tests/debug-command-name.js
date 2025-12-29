const { parse, generate } = require('../dist/index.js');

console.log('=== Debug Command Name Assignment ===\n');

const echoCommand = 'echo "Count: $i"';

console.log('Input:', echoCommand);

try {
  const ast = parse(echoCommand);
  console.log('\n✅ Parse successful');
  console.log('Command name:', ast.body[0].name.text);
  console.log('Arguments:', ast.body[0].arguments.map(arg => arg.text));

  const generated = generate(ast);
  console.log('\nGenerated:', generated);

} catch (error) {
  console.log('\n❌ Failed:', error.message);
}

console.log('\n--- Testing in while loop context ---');

const whileLoop = `while [ $i -lt 10 ]; do
    echo "Count: $i"
    i=$((i + 1))
done`;

console.log('\nWhile loop input:');
console.log(whileLoop);

try {
  const ast2 = parse(whileLoop);
  console.log('\n✅ Parse successful');

  const whileStmt = ast2.body[0];
  console.log('Body statements count:', whileStmt.body.length);

  whileStmt.body.forEach((stmt, index) => {
    console.log(`\nStatement ${index + 1}:`);
    console.log('Type:', stmt.type);
    if (stmt.type === 'Command') {
      console.log('Command name:', stmt.name.text);
      console.log('Arguments:', stmt.arguments.map(arg => arg.text));
    }
  });

} catch (error) {
  console.log('\n❌ Failed:', error.message);
}