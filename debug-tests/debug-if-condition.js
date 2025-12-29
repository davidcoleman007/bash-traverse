const { parse, generate } = require('../dist/index.js');

console.log('=== Debug If Statement Condition ===\n');

const ifStatement = `if [ -f file.txt ]; then
    echo "file exists"
fi`;

console.log('Input:');
console.log(ifStatement);

try {
  const ast = parse(ifStatement);
  console.log('\n✅ Parse successful');

  console.log('\n--- Condition Analysis ---');
  const ifStmt = ast.body[0];
  console.log('Condition:', JSON.stringify(ifStmt.condition, null, 2));

  if (ifStmt.condition && Array.isArray(ifStmt.condition)) {
    console.log('Condition is an array with', ifStmt.condition.length, 'statements');
    ifStmt.condition.forEach((stmt, index) => {
      console.log(`Statement ${index}:`, stmt.type);
      if (stmt.type === 'TestExpression') {
        console.log('  Arguments:', stmt.arguments.map(arg => arg.text));
        console.log('  Operators:', stmt.operators.map(op => op.text));
      }
    });
  }

  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(generated);

} catch (error) {
  console.log('\n❌ Failed:', error.message);
}