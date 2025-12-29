const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Token Stream ===\n');

const ifStatement = `if [ -f file.txt ]; then
    echo "file exists"
fi`;

console.log('Input:');
console.log(ifStatement);

const lexer = new BashLexer(ifStatement);
const tokens = lexer.tokenize();

console.log('\nToken stream:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});