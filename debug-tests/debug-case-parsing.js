const { parse, BashLexer, BashParser } = require('../dist');

console.log('=== Case Statement Parsing Debug ===\n');

const source = `case $var in
    start)
        echo "Starting"
        ;;
    stop)
        echo "Stopping"
        ;;
esac`;

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

  // Test the full case statement parsing
  console.log('Testing full case statement parsing:');

  const ast = parse(source);
  console.log('✅ Parsed successfully');
  console.log('AST:', JSON.stringify(ast, null, 2));

} catch (error) {
  console.log(`❌ Parse failed: ${error.message}`);
  console.log('Stack:', error.stack);
}