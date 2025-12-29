const { parse, generate } = require('../dist');

console.log('=== AST Structure Debug ===\n');

const testCases = [
  // Function with newlines
  `function test() {
    echo "hello"
    echo "world"
}`,

  // Case statement with newlines
  `case $var in
    start)
        echo "Starting"
        ;;
    stop)
        echo "Stopping"
        ;;
esac`
];

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}:`);
  console.log('Input:', JSON.stringify(testCase));
  console.log('---');

  try {
    const ast = parse(testCase);
    console.log('✅ Parsed successfully');

    // Inspect the body statements
    if (ast.body && ast.body.length > 0) {
      const mainStatement = ast.body[0];
      console.log('Main statement type:', mainStatement.type);

      if (mainStatement.body) {
        console.log('Body statements:', mainStatement.body.length);
        mainStatement.body.forEach((stmt, i) => {
          console.log(`  ${i}: ${stmt.type}${stmt.type === 'Newline' ? ' (newline)' : ''}`);
        });
      }

      if (mainStatement.clauses) {
        console.log('Clauses:', mainStatement.clauses.length);
        mainStatement.clauses.forEach((clause, i) => {
          console.log(`  Clause ${i} statements:`, clause.statements.length);
          clause.statements.forEach((stmt, j) => {
            console.log(`    ${j}: ${stmt.type}${stmt.type === 'Newline' ? ' (newline)' : ''}`);
          });
        });
      }
    }

    const generated = generate(ast);
    console.log('Generated:', JSON.stringify(generated));

  } catch (error) {
    console.log(`❌ Parse failed: ${error.message}`);
  }

  console.log('\n');
});