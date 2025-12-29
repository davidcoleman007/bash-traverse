const { parse } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('🔍 Debugging Nested If Statements\n');

const nestedCase = `if [ -f file ]; then
          echo "exists";
          if [ -d dir ]; then
            echo "directory";
          fi;
        fi`;

console.log('Input:');
console.log(nestedCase);
console.log('\n' + '='.repeat(60));

// Step 1: Tokenize
console.log('Step 1: Tokenization');
const lexer = new BashLexer(nestedCase);
const tokens = lexer.tokenize();
console.log('All tokens:');
tokens.forEach((token, index) => {
  console.log(`${index.toString().padStart(2)}: ${token.type.padEnd(15)} "${token.value}"`);
});

console.log('\n' + '='.repeat(60));

// Step 2: Analyze the issue
console.log('Step 2: Token Analysis');
console.log('The issue:');
console.log('- Token 12: KEYWORD "if" - This should trigger parseIfStatement()');
console.log('- Token 13: LBRACKET "[" - This is the test expression');
console.log('- Token 18: KEYWORD "then" - This is the nested if\'s then');
console.log('');
console.log('But the parser is encountering:');
console.log('- Token 13: LBRACKET "[" - and parsing it as TestExpression ✅ (correct)');
console.log('- Token 18: KEYWORD "then" - and parsing it as Command ❌ (wrong!)');
console.log('');
console.log('The problem: The parser should encounter Token 12 (KEYWORD "if") first,');
console.log('but it\'s encountering Token 13 (LBRACKET "[") first.');
console.log('');
console.log('This means the parser is not correctly positioned when it encounters the nested if.');

console.log('\n' + '='.repeat(60));

// Step 3: Parse step by step
console.log('Step 3: Parsing Analysis');
try {
  const parser = new (require('../dist/parser.js')).BashParser();
  parser.tokens = tokens;
  parser.current = 0;

  console.log('Starting parse...');
  console.log('Initial token index:', parser.current);
  console.log('Initial token:', tokens[parser.current]?.type, tokens[parser.current]?.value);

  const ast = parser.parse(nestedCase);
  console.log('✅ Parse successful!');
  console.log('Final AST body types:', ast.body.map(node => node.type));

} catch (error) {
  console.log('❌ Parse failed:', error.message);
  console.log('Error location:', error.stack?.split('\n')[1] || 'unknown');
}