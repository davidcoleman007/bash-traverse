const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Echo Tokenization ===\n');

const echoCommand = 'echo "Count: $i"';

console.log('Input:', echoCommand);

const lexer = new BashLexer(echoCommand);
const tokens = lexer.tokenize();

console.log('\nToken stream:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});

console.log('\n--- Testing in while loop context ---');
const whileLoop = `while [ $i -lt 10 ]; do
    echo "Count: $i"
    i=$((i + 1))
done`;

console.log('\nWhile loop input:');
console.log(whileLoop);

const lexer2 = new BashLexer(whileLoop);
const tokens2 = lexer2.tokenize();

console.log('\nWhile loop token stream:');
tokens2.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});