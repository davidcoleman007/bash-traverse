const { parse } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Detailed While Loop Debug ===\n');

// Test the problematic while loop
const whileLoop = `while [ $i -lt 10 ]; do
    echo "Count: $i"
    i=$((i + 1))
done`;

console.log('Input:');
console.log(whileLoop);
console.log('\n--- Token Stream ---');
const lexer = new BashLexer(whileLoop);
const tokens = lexer.tokenize();
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});

// Let's trace through the parsing step by step
console.log('\n--- Step-by-Step Trace ---');
let current = 0;

function peek(offset = 0) {
  return tokens[current + offset] || null;
}

function advance() {
  const token = tokens[current];
  current++;
  return token || null;
}

function match(type) {
  const token = peek();
  return token?.type === type;
}

function consume(type, message) {
  const token = peek();
  if (token?.type === type) {
    return advance();
  }
  throw new Error(`${message}, got ${token?.type || 'EOF'} at position ${current}`);
}

console.log('Starting at position:', current);
console.log('Current token:', peek()?.type, '"' + peek()?.value + '"');

// Simulate the while statement parsing step by step
console.log('\n=== WHILE STATEMENT PARSING ===');

console.log('\n1. parseStatement() called - sees KEYWORD "while"');
console.log('Position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n2. parseWhileStatement() called');
consume('KEYWORD', 'Expected while');
console.log('Position after "while":', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n3. parseStatement() called for condition - sees LBRACKET "["');
console.log('Position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n4. parseTestExpression() called');
consume('LBRACKET', 'Expected [');
console.log('Position after "[":', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n5. Parsing test expression content');
// Parse the test expression content
while (!match('RBRACKET')) {
  const token = peek();
  console.log('  Parsing token:', token?.type, '"' + token?.value + '"');
  advance();
}
console.log('Position after test content:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n6. Consuming "]"');
consume('RBRACKET', 'Expected ]');
console.log('Position after "]":', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n7. Consuming semicolon');
consume('SEMICOLON', 'Expected ;');
console.log('Position after ";":', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n8. Consuming "do"');
consume('KEYWORD', 'Expected do');
console.log('Position after "do":', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n9. parseStatementArray() called for body');
console.log('Starting position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

// Simulate parseStatementArray for body
while (!match('KEYWORD') || peek()?.value !== 'done') {
  const token = peek();
  console.log('parseStatementArray loop - Token:', token?.type, '"' + token?.value + '"');

  if (token?.type === 'NEWLINE') {
    console.log('  parseStatement() called - sees NEWLINE, advances and returns null');
    advance();
    console.log('  parseStatementArray continues - position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');
  } else if (token?.type === 'WORD') {
    console.log('  parseStatement() called - sees WORD, calls parseCommand()');
    // Simulate parseCommand
    while (!match('NEWLINE') && !match('KEYWORD')) {
      advance();
    }
    console.log('  parseCommand finished - position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');
  } else {
    advance();
  }
}

console.log('\n10. Body parsing complete');
console.log('Position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n11. Attempting to consume "done"');
console.log('Current position:', current);
console.log('Current token:', peek()?.type, '"' + peek()?.value + '"');
console.log('Remaining tokens:', tokens.slice(current).map(t => `${t.type} "${t.value}"`));

try {
  consume('KEYWORD', 'Expected done');
  console.log('✅ Successfully consumed done');
} catch (error) {
  console.log('❌ Failed to consume done:', error.message);
}