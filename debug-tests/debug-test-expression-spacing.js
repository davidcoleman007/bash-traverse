const { BashLexer } = require('../dist/lexer');
const { parse } = require('../dist/parser');

console.log('=== Test Expression Spacing Debug ===\n');

const testCase = 'if [ -f file.txt ]; then\n    echo "file exists"\nelse\n    echo "file not found"\nfi';

console.log('Input:');
console.log(testCase);
console.log('\n--- Tokenization ---');

const lexer = new BashLexer(testCase);
const tokens = lexer.tokenize();
console.log('Tokens:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} = "${token.value}"`);
});

console.log('\n--- Parsing ---');
try {
  const ast = parse(testCase);
  console.log('Parse successful');

  // Find the if statement
  const ifStatement = ast.body.find(node => node.type === 'IfStatement');
  if (ifStatement) {
    console.log('\nIf statement condition:');
    console.log('Type:', ifStatement.condition.type);
    if (ifStatement.condition.type === 'TestExpression') {
      console.log('Elements:', ifStatement.condition.elements.length);
      ifStatement.condition.elements.forEach((element, index) => {
        if (element.isOperator && element.operator) {
          console.log(`  ${index}: Operator "${element.operator.text}"`);
        } else if (!element.isOperator && element.argument) {
          console.log(`  ${index}: Argument "${element.argument.text}"`);
        }
      });
    }
  }

} catch (error) {
  console.log('Parse failed:', error.message);
  console.log('Error stack:', error.stack);
}