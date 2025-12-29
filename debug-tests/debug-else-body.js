const { parse, generate } = require('../dist/index.js');

console.log('=== Debug Else Body Parsing ===\n');

const elseBody = `else
    echo "file not found"`;

console.log('Input:');
console.log(elseBody);

try {
  const ast = parse(elseBody);
  console.log('\n✅ Parse successful');
  console.log('Statements:', ast.body.length);

  ast.body.forEach((stmt, i) => {
    console.log(`Statement ${i}:`, stmt.type);
    if (stmt.type === 'Command') {
      console.log(`  Command name: ${stmt.name.text}`);
      console.log(`  Arguments: ${stmt.arguments.map(arg => arg.text)}`);
    }
  });

} catch (error) {
  console.log('\n❌ Failed:', error.message);
}