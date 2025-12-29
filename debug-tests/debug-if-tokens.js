const { BashLexer } = require('../dist/lexer');
const { parse } = require('../dist/parser');

console.log('=== If Statement Tokenization Debug ===\n');

const ifStatement = 'if [ -f file.txt ]; then\n    echo "file exists"\nelse\n    echo "file not found"\nfi';

console.log('Input:');
console.log(ifStatement);
console.log('\n--- Tokenization ---');

const lexer = new BashLexer(ifStatement);
const tokens = lexer.tokenize();
console.log('Tokens:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} = "${token.value}"`);
});

console.log('\n--- Parsing ---');
try {
  const ast = parse(ifStatement);
  console.log('Parse successful');

  // Find the if statement
  const ifStmt = ast.body.find(node => node.type === 'IfStatement');
  if (ifStmt) {
    console.log('\nIf statement analysis:');
    console.log('Then body statements:', ifStmt.thenBody.length);
    console.log('Else body statements:', ifStmt.elseBody ? ifStmt.elseBody.length : 0);

    console.log('\nThen body statement types:');
    ifStmt.thenBody.forEach((stmt, index) => {
      console.log(`  ${index}: ${stmt.type}`);
    });

    if (ifStmt.elseBody) {
      console.log('\nElse body statement types:');
      ifStmt.elseBody.forEach((stmt, index) => {
        console.log(`  ${index}: ${stmt.type}`);
      });
    }
  }

} catch (error) {
  console.log('Parse failed:', error.message);
  console.log('Error stack:', error.stack);
}