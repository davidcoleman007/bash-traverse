const { parse, generate } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Complex Test Expression ===\n');

const testExpr = '[ -f file.txt -a -r file.txt ]';

console.log('Input:', testExpr);

// Get tokens
const lexer = new BashLexer(testExpr);
const tokens = lexer.tokenize();

console.log('\nToken stream:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});

// Parse and see what happens
try {
  const ast = parse(testExpr);
  console.log('\n✅ Parse successful');
  console.log('AST:', JSON.stringify(ast.body[0], null, 2));

  const generated = generate(ast);
  console.log('\nGenerated:', generated);

} catch (error) {
  console.log('\n❌ Failed:', error.message);
}