const { parse, generate } = require('../dist/index.js');

// Test case statement AST structure
const input = `case $1 in
    start)
        echo "Starting..."
        ;;
    stop)
        echo "Stopping..."
        ;;
    *)
        echo "Unknown command"
        ;;
esac`;

console.log('=== Case Statement AST Debug ===\n');

console.log('Input:');
console.log(input);
console.log('\n--- Parsing ---');
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
  console.log('  Statement details:');
  clause.statements.forEach((stmt, stmtIndex) => {
    console.log(`    ${stmtIndex}: ${stmt.type}`);
    if (stmt.type === 'Command') {
      console.log(`      Command: ${stmt.name.text} ${stmt.arguments.map(a => a.text).join(' ')}`);
    }
  });
});

console.log('\n--- Generation ---');
const generated = generate(ast);
console.log('Generated:');
console.log(generated);

console.log('\n--- Round-trip Parse ---');
const roundTripAst = parse(generated);
console.log('✅ Round-trip parse successful');

console.log('\n--- Round-trip AST Structure ---');
const roundTripCaseStatement = roundTripAst.body[0];
console.log('Case statement type:', roundTripCaseStatement.type);
console.log('Number of clauses:', roundTripCaseStatement.clauses.length);

roundTripCaseStatement.clauses.forEach((clause, index) => {
  console.log(`\nClause ${index + 1}:`);
  console.log('  Patterns:', clause.patterns.map(p => p.text || p.value).join(', '));
  console.log('  Statements:', clause.statements.map(s => s.type).join(', '));
  console.log('  Statement details:');
  clause.statements.forEach((stmt, stmtIndex) => {
    console.log(`    ${stmtIndex}: ${stmt.type}`);
    if (stmt.type === 'Command') {
      console.log(`      Command: ${stmt.name.text} ${stmt.arguments.map(a => a.text).join(' ')}`);
    }
  });
});