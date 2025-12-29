const { parse, generate } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Case Statement Logic ===\n');

const generatedCase = `case $1 in
start ) echo "Starting..." ;;
stop ) echo "Stopping..." ;;
* ) echo "Unknown command" ;;
esac`;

console.log('Generated case statement:');
console.log(generatedCase);

// Get the token stream
const lexer = new BashLexer(generatedCase);
const tokens = lexer.tokenize();

console.log('\nToken stream:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});

// Simulate the case statement parsing logic
console.log('\n--- Simulating Case Statement Logic ---');

let current = 0;

function peek(offset = 0) {
  return tokens[current + offset] || null;
}

function advance() {
  const token = peek();
  current++;
  return token;
}

function match(type) {
  const token = peek();
  return token && token.type === type;
}

function trace(message) {
  const token = peek();
  console.log(`[${current}] ${message}: ${token ? `${token.type} "${token.value}"` : 'EOF'}`);
}

// Simulate the case statement parsing
trace('Start');
advance(); // consume CONTROL_CASE
trace('After consuming CONTROL_CASE');

advance(); // consume EXPANSION
trace('After consuming EXPANSION');

advance(); // consume CONTROL_IN
trace('After consuming CONTROL_IN');

advance(); // consume NEWLINE
trace('After consuming NEWLINE');

// Now we should be at the first clause
trace('About to check for first clause');

// Check if we're at a WORD followed by RPAREN
if (match('WORD')) {
  const nextToken = peek(1);
  console.log(`  Next token: ${nextToken ? `${nextToken.type} "${nextToken.value}"` : 'EOF'}`);

  if (nextToken && nextToken.type === 'RPAREN') {
    console.log('  ✅ This is a clause pattern');
  } else {
    console.log('  ❌ This is not a clause pattern');
  }
} else {
  console.log('  ❌ Not at a WORD');
}

// Simulate parsing the first clause
advance(); // consume WORD "start"
trace('After consuming WORD "start"');

advance(); // consume RPAREN
trace('After consuming RPAREN');

advance(); // consume WORD "echo"
trace('After consuming WORD "echo"');

advance(); // consume STRING
trace('After consuming STRING');

advance(); // consume DOUBLE_SEMICOLON
trace('After consuming DOUBLE_SEMICOLON');

advance(); // consume NEWLINE
trace('After consuming NEWLINE');

// Now we should be at the second clause
trace('About to check for second clause');

// Check if we're at a WORD followed by RPAREN
if (match('WORD')) {
  const nextToken = peek(1);
  console.log(`  Next token: ${nextToken ? `${nextToken.type} "${nextToken.value}"` : 'EOF'}`);

  if (nextToken && nextToken.type === 'RPAREN') {
    console.log('  ✅ This is a clause pattern');
  } else {
    console.log('  ❌ This is not a clause pattern');
  }
} else {
  console.log('  ❌ Not at a WORD');
}

// Simulate parsing the second clause
advance(); // consume WORD "stop"
trace('After consuming WORD "stop"');

advance(); // consume RPAREN
trace('After consuming RPAREN');

advance(); // consume WORD "echo"
trace('After consuming WORD "echo"');

advance(); // consume STRING
trace('After consuming STRING');

advance(); // consume DOUBLE_SEMICOLON
trace('After consuming DOUBLE_SEMICOLON');

advance(); // consume NEWLINE
trace('After consuming NEWLINE');

// Now we should be at the third clause
trace('About to check for third clause');

// Check if we're at a WORD followed by RPAREN
if (match('WORD')) {
  const nextToken = peek(1);
  console.log(`  Next token: ${nextToken ? `${nextToken.type} "${nextToken.value}"` : 'EOF'}`);

  if (nextToken && nextToken.type === 'RPAREN') {
    console.log('  ✅ This is a clause pattern');
  } else {
    console.log('  ❌ This is not a clause pattern');
  }
} else {
  console.log('  ❌ Not at a WORD');
}

// Simulate parsing the third clause
advance(); // consume WORD "*"
trace('After consuming WORD "*"');

advance(); // consume RPAREN
trace('After consuming RPAREN');

advance(); // consume WORD "echo"
trace('After consuming WORD "echo"');

advance(); // consume STRING
trace('After consuming STRING');

advance(); // consume DOUBLE_SEMICOLON
trace('After consuming DOUBLE_SEMICOLON');

advance(); // consume NEWLINE
trace('After consuming NEWLINE');

// Now we should be at CONTROL_ESAC
trace('About to check for next clause');

// Check if we're at a WORD followed by RPAREN
if (match('WORD')) {
  const nextToken = peek(1);
  console.log(`  Next token: ${nextToken ? `${nextToken.type} "${nextToken.value}"` : 'EOF'}`);

  if (nextToken && nextToken.type === 'RPAREN') {
    console.log('  ✅ This is a clause pattern');
  } else {
    console.log('  ❌ This is not a clause pattern');
  }
} else {
  console.log('  ❌ Not at a WORD');
}

// Check if we're at CONTROL_ESAC
if (match('CONTROL_ESAC')) {
  console.log('  ✅ Found CONTROL_ESAC - case statement should end here');
} else {
  console.log('  ❌ Expected CONTROL_ESAC but found:', peek());
}