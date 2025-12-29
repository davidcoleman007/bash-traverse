const { parse, generate } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Case Statement Step by Step ===\n');

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

// Simulate the parsing process step by step
console.log('\n--- Simulating Parsing Process ---');

let current = 0;

function peek() {
  return tokens[current] || null;
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

// Simulate case statement parsing
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
trace('About to parse first clause');

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
trace('About to parse second clause');

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
trace('About to parse third clause');

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
trace('About to parse next clause (should be CONTROL_ESAC)');

if (match('CONTROL_ESAC')) {
  console.log('✅ Found CONTROL_ESAC - case statement should end here');
} else {
  console.log('❌ Expected CONTROL_ESAC but found:', peek());
}