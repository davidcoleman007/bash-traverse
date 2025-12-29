const { parse, BashLexer } = require('../dist');

console.log('=== Parse Statement Debug ===\n');

// Test a simple case with newlines
const source = `echo "hello"
echo "world"`;

console.log('Source:', JSON.stringify(source));
console.log('---');

try {
  // First check the tokens
  const lexer = new BashLexer(source);
  const tokens = lexer.tokenize();
  console.log('Tokens:');
  tokens.forEach((token, i) => {
    const marker = token.type === 'NEWLINE' ? ' ← NEWLINE' : '';
    console.log(`  ${i}: ${token.type} "${token.value}"${marker}`);
  });

  console.log('\n---\n');

  const ast = parse(source);
  console.log('✅ Parsed successfully');
  console.log('Program body statements:', ast.body.length);

  ast.body.forEach((stmt, i) => {
    console.log(`  ${i}: ${stmt.type}${stmt.type === 'Newline' ? ' (newline)' : ''}`);
  });

} catch (error) {
  console.log(`❌ Parse failed: ${error.message}`);
}