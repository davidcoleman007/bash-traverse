const { parse, generate } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Else Body Parsing ===\n');

const ifElseStatement = `if [ -f file.txt ]; then
    echo "file exists"
else
    echo "file not found"
fi`;

console.log('Input:');
console.log(ifElseStatement);

// Get the token stream
const lexer = new BashLexer(ifElseStatement);
const tokens = lexer.tokenize();

console.log('\nToken stream:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});

// Find the else section
console.log('\n--- Finding else section ---');
let elseStartIndex = -1;
for (let i = 0; i < tokens.length; i++) {
  if (tokens[i].type === 'CONTROL_ELSE') {
    elseStartIndex = i;
    break;
  }
}

console.log('Else keyword at token index:', elseStartIndex);
if (elseStartIndex >= 0) {
  console.log('Tokens after else:');
  for (let i = elseStartIndex + 1; i < Math.min(elseStartIndex + 10, tokens.length); i++) {
    console.log(`  ${i}: ${tokens[i].type} "${tokens[i].value}"`);
  }
}

// Try to parse just the else body
console.log('\n--- Testing else body parsing ---');
const elseBody = `else
    echo "file not found"`;

console.log('Else body input:');
console.log(elseBody);

try {
  const ast = parse(elseBody);
  console.log('\n✅ Else body parse successful');
  console.log('AST:', JSON.stringify(ast, null, 2));
} catch (error) {
  console.log('\n❌ Else body parse failed:', error.message);
  console.log('Stack:', error.stack);
}