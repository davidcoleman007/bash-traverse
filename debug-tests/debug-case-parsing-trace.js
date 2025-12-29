const { parse } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Detailed Case Statement Parsing Trace ===\n');

const caseStatement = `case $1 in
    start)
        echo "Starting..."
        ;;
esac`;

console.log('Input:');
console.log(caseStatement);
console.log('\n--- Token Stream ---');
const lexer = new BashLexer(caseStatement);
const tokens = lexer.tokenize();
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});

console.log('\n--- Manual Parsing Trace ---');

// Simulate the case statement parsing step by step
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

// Simulate parseCaseStatement
console.log('\n=== CASE STATEMENT PARSING ===');

console.log('\n1. Consuming "case"');
consume('KEYWORD', 'Expected case');
console.log('Position after "case":', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n2. Parsing expression');
advance(); // consume EXPANSION
console.log('Position after expression:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n3. Consuming "in"');
consume('KEYWORD', 'Expected in');
console.log('Position after "in":', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n4. Starting clause parsing');
console.log('Position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n5. Parsing pattern "start"');
advance(); // consume WORD "start"
console.log('Position after pattern:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n6. Consuming ")"');
consume('RPAREN', 'Expected )');
console.log('Position after ")":', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

console.log('\n7. Starting manual body parsing');
console.log('Position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

// Simulate the manual body parsing loop
console.log('\n8. Manual body parsing loop:');
while (!match('DOUBLE_SEMICOLON') && (!match('KEYWORD') || peek()?.value !== 'esac')) {
  const token = peek();
  console.log('  Loop iteration - Token:', token?.type, '"' + token?.value + '"');

  if (token?.type === 'NEWLINE') {
    console.log('    parseStatement() called - sees NEWLINE, advances and returns null');
    advance();
    console.log('    Position after NEWLINE:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');
  } else if (token?.type === 'WORD') {
    console.log('    parseStatement() called - sees WORD, calls parseCommand()');
    console.log('    parseCommand() should parse: echo "Starting..."');

    // Simulate parseCommand for "echo "Starting...""
    const commandName = advance(); // consume "echo"
    console.log('    parseCommand consumed name:', commandName?.value);
    console.log('    Position after name:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');

    // Simulate parseStandardCommand
    const args = [];
    while (!match('NEWLINE') && !match('DOUBLE_SEMICOLON')) {
      const arg = advance();
      args.push(arg);
      console.log('    parseStandardCommand consumed arg:', arg?.value);
      console.log('    Position after arg:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');
    }

    console.log('    parseCommand result - name:', commandName?.value, 'args:', args.map(a => a.value));
    break; // Exit the loop after parsing the command
  } else {
    advance();
  }
}

console.log('\n9. Body parsing complete');
console.log('Position:', current, 'Token:', peek()?.type, '"' + peek()?.value + '"');