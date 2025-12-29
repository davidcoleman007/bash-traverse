const { parse, generate } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Command Parsing Trace ===\n');

const echoCommand = 'echo "Count: $i"';

console.log('Input:', echoCommand);

// First, let's see the token stream
const lexer = new BashLexer(echoCommand);
const tokens = lexer.tokenize();

console.log('\nToken stream:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});

// Now let's trace the parsing manually
console.log('\n--- Manual Parsing Trace ---');

// Simulate the parser state
let current = 0;

function peek(offset = 0) {
  return tokens[current + offset] || null;
}

function advance() {
  return tokens[current++] || null;
}

function match(type) {
  const token = peek();
  return token && token.type === type;
}

function consume(type, message) {
  const token = peek();
  if (!token || token.type !== type) {
    throw new Error(`${message}, got ${token ? token.type : 'EOF'}`);
  }
  return advance();
}

// Trace parseCommand()
console.log('\nStep 1: parseCommand() starts');
console.log(`Current position: ${current}, next token: ${peek()?.type} "${peek()?.value}"`);

// Step 1: Parse command name
console.log('\nStep 2: parseWord() for command name');
const commandNameToken = advance();
console.log(`Consumed token: ${commandNameToken.type} "${commandNameToken.value}"`);
console.log(`Current position: ${current}, next token: ${peek()?.type} "${peek()?.value}"`);

// Step 2: Check for variable assignment prefix
console.log('\nStep 3: Check for variable assignment prefix');
if (match('OPERATOR') && peek()?.value === '=') {
  console.log('Found variable assignment prefix');
} else {
  console.log('No variable assignment prefix found');
}

// Step 3: Check for custom command handler
console.log('\nStep 4: Check for custom command handler');
console.log('Command name text:', commandNameToken.value);

// Step 4: Parse standard command
console.log('\nStep 5: parseStandardCommand()');
console.log(`Current position: ${current}, next token: ${peek()?.type} "${peek()?.value}"`);

// Parse arguments
const args = [];
while (current < tokens.length && !match('SEMICOLON') && !match('NEWLINE')) {
  console.log(`\nParsing argument at position ${current}`);
  const token = peek();
  console.log(`Next token: ${token.type} "${token.value}"`);

  if (token.type === 'REDIRECT') {
    console.log('Found redirect, stopping argument parsing');
    break;
  } else if (token.type === 'OPERATOR' && token.value === '=') {
    console.log('Found = operator, handling as variable assignment');
    args.push(advance()); // consume the operator
    args.push(advance()); // consume the value
  } else {
    console.log('Consuming word as argument');
    args.push(advance());
  }
}

console.log('\nFinal result:');
console.log('Command name:', commandNameToken.value);
console.log('Arguments:', args.map(arg => arg.value));
console.log('Current position:', current);