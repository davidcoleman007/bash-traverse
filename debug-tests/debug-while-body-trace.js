const { parse, generate } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug While Loop Body Parsing ===\n');

const whileLoop = `while [ $i -lt 10 ]; do
    echo "Count: $i"
    i=$((i + 1))
done`;

console.log('Input:');
console.log(whileLoop);

// Get the token stream
const lexer = new BashLexer(whileLoop);
const tokens = lexer.tokenize();

console.log('\nToken stream:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});

// Find where the while loop body starts
console.log('\n--- Finding while loop body start ---');
let bodyStartIndex = -1;
for (let i = 0; i < tokens.length; i++) {
  if (tokens[i].type === 'KEYWORD' && tokens[i].value === 'do') {
    bodyStartIndex = i + 1;
    break;
  }
}

console.log(`Body starts at token index: ${bodyStartIndex}`);
if (bodyStartIndex >= 0 && bodyStartIndex < tokens.length) {
  console.log(`First body token: ${tokens[bodyStartIndex].type} "${tokens[bodyStartIndex].value}"`);
}

// Now let's parse and see what happens
try {
  const ast = parse(whileLoop);
  console.log('\n✅ Parse successful');

  console.log('\n--- While Loop Body Analysis ---');
  const whileStmt = ast.body[0];
  console.log('Body statements count:', whileStmt.body.length);

  whileStmt.body.forEach((stmt, index) => {
    console.log(`\nStatement ${index + 1}:`);
    console.log('Type:', stmt.type);
    if (stmt.type === 'Command') {
      console.log('Command name:', stmt.name.text);
      console.log('Arguments:', stmt.arguments.map(arg => arg.text));
    }
  });

} catch (error) {
  console.log('\n❌ Failed:', error.message);
}