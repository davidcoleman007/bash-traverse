const { parse } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Detailed Parser Trace ===\n');

// Test the problematic if-else statement
const ifWithElse = `if [ -f file.txt ]; then
    echo "file exists"
else
    echo "file not found"
fi`;

console.log('Input:');
console.log(ifWithElse);
console.log('\n--- Token Stream ---');
const lexer = new BashLexer(ifWithElse);
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

// Simulate the if statement parsing step by step
console.log('\n=== IF STATEMENT PARSING ===');

console.log('\n1. parseStatement() called - sees KEYWORD "if"');
console.log('Position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n2. parseIfStatement() called');
consume('KEYWORD', 'Expected if');
console.log('Position after "if":', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n3. Parsing condition [ -f file.txt ]');
// Skip the test expression
while (!match('KEYWORD') || peek()?.value !== 'then') {
  advance();
  console.log('Advanced to:', peek()?.type, '"' + peek()?.value + '"');
}

console.log('\n4. Consuming "then"');
consume('KEYWORD', 'Expected then');
console.log('Position after "then":', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n5. parseStatementArray() called for then body');
console.log('Starting position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

// Simulate parseStatementArray for then body
while (!match('KEYWORD') || !['fi', 'elif', 'else'].includes(peek()?.value)) {
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

console.log('\n6. Then body parsing complete');
console.log('Position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

if (peek()?.value === 'else') {
  console.log('\n7. Found "else", consuming it');
  advance();
  console.log('Position after "else":', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

  console.log('\n8. parseStatementArray() called for else body');
  console.log('Starting position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

  // Simulate parseStatementArray for else body
  while (!match('KEYWORD') || !['fi', 'elif', 'else'].includes(peek()?.value)) {
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

  console.log('\n9. Else body parsing complete');
  console.log('Position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');
}

console.log('\n10. Attempting to consume "fi"');
console.log('Current position:', current);
console.log('Current token:', peek()?.type, '"' + peek()?.value + '"');
console.log('Remaining tokens:', tokens.slice(current).map(t => `${t.type} "${t.value}"`));

try {
  consume('KEYWORD', 'Expected fi');
  console.log('✅ Successfully consumed fi');
} catch (error) {
  console.log('❌ Failed to consume fi:', error.message);
}