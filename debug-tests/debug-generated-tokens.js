const { parse, generate } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Generated Code Tokens ===\n');

const ifStatement = `if [ -f file.txt ]; then
    echo "file exists"
fi`;

console.log('Original:');
console.log(ifStatement);

try {
  const ast = parse(ifStatement);
  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(generated);

  console.log('\n--- Token Stream of Generated Code ---');
  const lexer = new BashLexer(generated);
  const tokens = lexer.tokenize();
  tokens.forEach((token, index) => {
    console.log(`${index}: ${token.type} "${token.value}"`);
  });

  console.log('\n--- Parse Generated Code ---');
  const roundTripAst = parse(generated);
  console.log('✅ Round-trip parse successful');

} catch (error) {
  console.log('\n❌ Failed:', error.message);
}