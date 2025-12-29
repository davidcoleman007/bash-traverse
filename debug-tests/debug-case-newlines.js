const { parse, BashParser } = require('../dist/index.js');

// Test case statement with newlines
const testCase = `case $foo in
  start)
    echo "Starting"
    ;;
  stop)
    echo "Stopping"
    ;;
esac`;

console.log('=== CASE STATEMENT NEWLINE DEBUGGING ===\n');

console.log('1. Original code:');
console.log(testCase);
console.log('\n2. Token stream:');
const parser = new BashParser(testCase);
let token;
let tokenCount = 0;
while ((token = parser.advance()) && !parser.isAtEnd()) {
  console.log(`${tokenCount++}: ${token.type} "${token.value}"`);
}

console.log('\n3. Parsing result:');
try {
  const ast = parse(testCase);
  console.log(JSON.stringify(ast, null, 2));
} catch (error) {
  console.error('Parse error:', error.message);
}

console.log('\n4. Generated code:');
try {
  const ast = parse(testCase);
  const { generate } = require('../dist/index.js');
  const generated = generate(ast);
  console.log(generated);
} catch (error) {
  console.error('Generation error:', error.message);
}