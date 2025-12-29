const { parse, generate } = require('../dist/index.js');

// Test the clause detection logic
const input = `case $1 in
start ) echo "Starting..." ;;
stop ) echo "Stopping..." ;;
* ) echo "Unknown command" ;;
esac`;

console.log('=== Clause Detection Debug ===\n');

console.log('Input:');
console.log(input);
console.log('\n--- Parsing ---');
const ast = parse(input);
console.log('✅ Parse successful');

console.log('\n--- Generation ---');
const generated = generate(ast);
console.log('Generated:');
console.log(generated);

console.log('\n--- Round-trip Parse ---');
const roundTripAst = parse(generated);
console.log('✅ Round-trip parse successful');

console.log('\n--- Comparison ---');
console.log('Original clauses:', ast.body[0].clauses.length);
console.log('Round-trip clauses:', roundTripAst.body[0].clauses.length);

// Show the differences in clause structure
console.log('\n--- Original AST ---');
ast.body[0].clauses.forEach((clause, index) => {
  console.log(`Clause ${index + 1}:`);
  console.log(`  Patterns: ${clause.patterns.map(p => p.text || p.value).join(', ')}`);
  console.log(`  Statements: ${clause.statements.map(s => s.type).join(', ')}`);
});

console.log('\n--- Round-trip AST ---');
roundTripAst.body[0].clauses.forEach((clause, index) => {
  console.log(`Clause ${index + 1}:`);
  console.log(`  Patterns: ${clause.patterns.map(p => p.text || p.value).join(', ')}`);
  console.log(`  Statements: ${clause.statements.map(s => s.type).join(', ')}`);
});