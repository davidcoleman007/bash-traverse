const { parse, generate } = require('../dist');
const { generateNode } = require('../dist/generators');

console.log('=== Step-by-Step Case Parsing Debug ===\n');

const testCase = 'case $var in start) echo "Starting";; stop) echo "Stopping";; esac';

console.log('Original:', testCase);

try {
  // Parse
  const ast = parse(testCase);
  console.log('✅ Parsed successfully');
  console.log('AST:', JSON.stringify(ast, null, 2));

  // Inspect the AST for DoubleSemicolon nodes
  console.log('\n--- AST Inspection ---');
  if (ast.body && ast.body.length > 0) {
    const caseStatement = ast.body[0];
    if (caseStatement.type === 'CaseStatement' && caseStatement.clauses) {
      console.log(`Found ${caseStatement.clauses.length} clauses`);
      caseStatement.clauses.forEach((clause, clauseIndex) => {
        console.log(`\nClause ${clauseIndex + 1}:`);
        console.log(`  Patterns: ${clause.patterns.map(p => p.text).join(', ')}`);
        console.log(`  Statements count: ${clause.statements.length}`);
        clause.statements.forEach((stmt, stmtIndex) => {
          console.log(`    Statement ${stmtIndex + 1}: ${stmt.type}`);
          if (stmt.type === 'DoubleSemicolon') {
            console.log(`      -> This is a DoubleSemicolon node`);
          }
        });
      });
    }
  }

  // Test individual statement generation
  console.log('\n--- Individual Statement Generation ---');
  if (ast.body && ast.body.length > 0) {
    const caseStatement = ast.body[0];
    if (caseStatement.type === 'CaseStatement' && caseStatement.clauses) {
      caseStatement.clauses.forEach((clause, clauseIndex) => {
        console.log(`\nClause ${clauseIndex + 1} statements:`);
        clause.statements.forEach((stmt, stmtIndex) => {
          const generated = generateNode(stmt);
          console.log(`  Statement ${stmtIndex + 1} (${stmt.type}): "${generated}"`);
        });
      });
    }
  }

  // Generate
  const generated = generate(ast);
  console.log('Generated:', `"${generated}"`);

  // Round-trip
  const roundTrip = parse(generated);
  console.log('Round-trip:', testCase === generated ? '✅ SAME' : '❌ DIFFERENT');

} catch (error) {
  console.log('❌ Parse failed:', error.message);
  console.log('Error details:', error);

  // Let's trace the token stream to see where we are
  console.log('\n--- Token Stream Analysis ---');
  const { BashLexer } = require('../dist');
  const lexer = new BashLexer(testCase);
  const tokens = lexer.tokenize();

  tokens.forEach((token, index) => {
    console.log(`${index.toString().padStart(2)}: ${token.type.padEnd(20)} = "${token.value}"`);
  });
}