const { parse } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Parser State ===\n');

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

// Let's trace through the parsing manually
console.log('\n--- Manual Parsing Trace ---');
let current = 0;

function peek(offset = 0) {
  return tokens[current + offset] || null;
}

function advance() {
  return tokens[current++] || null;
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

// Simulate the if statement parsing
console.log('\n1. Consuming "if"');
consume('KEYWORD', 'Expected if');
console.log('Position after if:', current);

console.log('\n2. Parsing condition [ -f file.txt ]');
// Skip the test expression
while (!match('KEYWORD') || peek()?.value !== 'then') {
  advance();
  console.log('Advanced to:', peek()?.type, '"' + peek()?.value + '"');
}

console.log('\n3. Consuming "then"');
consume('KEYWORD', 'Expected then');
console.log('Position after then:', current);

console.log('\n4. Parsing then body');
// Parse statements until we hit 'else' or 'fi'
while (!match('KEYWORD') || !['fi', 'elif', 'else'].includes(peek()?.value)) {
  const token = peek();
  console.log('Parsing statement at:', token?.type, '"' + token?.value + '"');

  if (token?.type === 'NEWLINE') {
    advance();
    console.log('Consumed newline, position:', current);
  } else if (token?.type === 'WORD') {
    // Parse a command
    while (!match('NEWLINE') && !match('KEYWORD')) {
      advance();
    }
    console.log('Parsed command, position:', current);
  } else {
    advance();
  }
}

console.log('\n5. Found end of then body at:', peek()?.type, '"' + peek()?.value + '"');

if (peek()?.value === 'else') {
  console.log('\n6. Consuming "else"');
  advance();
  console.log('Position after else:', current);

  console.log('\n7. Parsing else body');
  while (!match('KEYWORD') || !['fi', 'elif', 'else'].includes(peek()?.value)) {
    const token = peek();
    console.log('Parsing statement at:', token?.type, '"' + token?.value + '"');

    if (token?.type === 'NEWLINE') {
      advance();
      console.log('Consumed newline, position:', current);
    } else if (token?.type === 'WORD') {
      // Parse a command
      while (!match('NEWLINE') && !match('KEYWORD')) {
        advance();
      }
      console.log('Parsed command, position:', current);
    } else {
      advance();
    }
  }

  console.log('\n8. Found end of else body at:', peek()?.type, '"' + peek()?.value + '"');
}

console.log('\n9. Attempting to consume "fi"');
console.log('Current position:', current);
console.log('Current token:', peek()?.type, '"' + peek()?.value + '"');
console.log('Remaining tokens:', tokens.slice(current).map(t => `${t.type} "${t.value}"`));

try {
  consume('KEYWORD', 'Expected fi');
  console.log('✅ Successfully consumed fi');
} catch (error) {
  console.log('❌ Failed to consume fi:', error.message);
}