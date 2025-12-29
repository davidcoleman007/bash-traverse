const { parse, generate } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug If-Else Statement ===\n');

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

// Find where the else body starts
console.log('\n--- Finding else body start ---');
let elseStartIndex = -1;
for (let i = 0; i < tokens.length; i++) {
  if (tokens[i].type === 'CONTROL_ELSE') {
    elseStartIndex = i + 1;
    break;
  }
}

console.log(`Else body starts at token index: ${elseStartIndex}`);
if (elseStartIndex >= 0 && elseStartIndex < tokens.length) {
  console.log(`First else body token: ${tokens[elseStartIndex].type} "${tokens[elseStartIndex].value}"`);
}

// Now let's parse and see what happens
try {
  const ast = parse(ifElseStatement);
  console.log('\n✅ Parse successful');

  console.log('\n--- If-Else Analysis ---');
  const ifStmt = ast.body[0];
  console.log('Then body statements:', ifStmt.thenBody.length);
  console.log('Else body statements:', ifStmt.elseBody ? ifStmt.elseBody.length : 0);

  if (ifStmt.elseBody) {
    ifStmt.elseBody.forEach((stmt, index) => {
      console.log(`Else statement ${index}:`, stmt.type);
      if (stmt.type === 'Command') {
        console.log(`  Command name: ${stmt.name.text}`);
        console.log(`  Arguments: ${stmt.arguments.map(arg => arg.text)}`);
      }
    });
  }

} catch (error) {
  console.log('\n❌ Failed:', error.message);
}