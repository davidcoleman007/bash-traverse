const { parse } = require('../dist/index.js');

// Test the actual parser with debug output
const input = `case $1 in
start) echo "Starting..." ;;
stop) echo "Stopping..." ;;
*) echo "Unknown command" ;;
esac`;

console.log('=== Actual Parser Debug ===\n');

console.log('Input:');
console.log(input);
console.log('\n--- Parsing ---');

try {
  const ast = parse(input);
  console.log('✅ Parse successful');

  console.log('\n--- AST Structure ---');
  const caseStatement = ast.body[0];
  console.log('Case statement type:', caseStatement.type);
  console.log('Number of clauses:', caseStatement.clauses.length);

  caseStatement.clauses.forEach((clause, index) => {
    console.log(`\nClause ${index + 1}:`);
    console.log('  Patterns:', clause.patterns.map(p => p.text || p.value).join(', '));
    console.log('  Statements:', clause.statements.map(s => s.type).join(', '));
  });

} catch (error) {
  console.log('❌ Parse failed:', error.message);
  console.log('Error stack:', error.stack);
}