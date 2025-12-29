const { BashLexer, BashParser } = require('../dist');

console.log('=== Parse Statement Array Debug ===\n');

// Test a simple case with newlines
const source = `echo "hello"
echo "world"`;

console.log('Source:', JSON.stringify(source));
console.log('---');

try {
  const lexer = new BashLexer(source);
  const tokens = lexer.tokenize();
  console.log('Tokens:');
  tokens.forEach((token, i) => {
    const marker = token.type === 'NEWLINE' ? ' ← NEWLINE' : '';
    console.log(`  ${i}: ${token.type} "${token.value}"${marker}`);
  });

  console.log('\n---\n');

  // Test parseStatementArray directly
  const parser = new BashParser();
  parser.tokens = tokens;
  parser.current = 0;

  console.log('Testing parseStatementArray:');

  // Debug: manually step through the parsing
  console.log('Manual parsing:');
  let iteration = 0;
  while (!parser.isAtEnd()) {
    iteration++;
    console.log(`\nIteration ${iteration}:`);
    console.log(`  Parser current: ${parser.current}`);
    console.log(`  Parser isAtEnd: ${parser.isAtEnd()}`);

    const token = parser.peek();
    console.log(`  Current token: ${token?.type} "${token?.value}"`);

    const statement = parser.parseStatement();
    console.log(`  parseStatement returned: ${statement ? statement.type : 'null'}`);

    if (statement) {
      if (statement.type === 'Newline') {
        console.log('  → Skipping newline statement');
      } else {
        console.log('  → Adding statement to array');
      }
    }

    console.log(`  Parser current after: ${parser.current}`);
  }

  // Reset and test the actual function
  parser.current = 0;
  const statements = parser.parseStatementArray();
  console.log('\nFinal statements:', statements.length);

  statements.forEach((stmt, i) => {
    console.log(`  ${i}: ${stmt.type}${stmt.type === 'Newline' ? ' (newline)' : ''}`);
  });

} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}