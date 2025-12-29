const { parse } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Case Command Parsing ===\n');

// Test just the command that's failing in case statement
const simpleCommand = `echo "Starting..."`;

console.log('Input:');
console.log(simpleCommand);
console.log('\n--- Token Stream ---');
const lexer = new BashLexer(simpleCommand);
const tokens = lexer.tokenize();
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});

console.log('\n--- Parse Attempt ---');
try {
  const ast = parse(simpleCommand);
  console.log('✅ Parse successful');
  console.log('Command name:', ast.body[0]?.name?.text);
  console.log('Arguments:', ast.body[0]?.arguments?.map(arg => arg.text));
  console.log('AST:', JSON.stringify(ast, null, 2));
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}

console.log('\n=== Test in case statement context ===\n');

// Test the same command in a case statement
const caseCommand = `case $1 in
    start)
        echo "Starting..."
        ;;
esac`;

console.log('Input:');
console.log(caseCommand);
console.log('\n--- Parse Attempt ---');
try {
  const ast = parse(caseCommand);
  console.log('✅ Parse successful');
  const caseBody = ast.body[0]?.clauses[0]?.statements[0];
  console.log('Case body command name:', caseBody?.name?.text);
  console.log('Case body arguments:', caseBody?.arguments?.map(arg => arg.text));
  console.log('Case body AST:', JSON.stringify(caseBody, null, 2));
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}