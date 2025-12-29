const { BashLexer } = require('../dist/index.js');

// Test the clause detection logic step by step
const input = `case $1 in
start) echo "Starting..." ;;
stop) echo "Stopping..." ;;
*) echo "Unknown command" ;;
esac`;

console.log('=== Clause Detection Step Debug ===\n');

console.log('Input:');
console.log(input);
console.log('\n--- Tokenization ---');

const lexer = new BashLexer(input);
const tokens = lexer.tokenize();

console.log('Tokens:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});

console.log('\n--- Simulating Clause Detection ---');

// Simulate the clause detection logic
let current = 0;

const peek = (offset = 0) => {
  const index = current + offset;
  return index < tokens.length ? tokens[index] : null;
};

const match = (type) => {
  const token = peek();
  return token && token.type === type;
};

const advance = () => {
  if (current < tokens.length) {
    current++;
  }
};

// Helper to check if the next tokens form a valid clause pattern
const isNextClausePattern = () => {
  let offset = 0;
  while (true) {
    const token = peek(offset);
    if (!token) return false;
    if (token.type === 'NEWLINE') {
      offset++;
      continue;
    }
    if (token.type === 'CONTROL_ESAC') return false;
    if (token.type === 'RPAREN') return true;
    // Acceptable pattern tokens: WORD, CHAR, OPERATOR, PIPE, ASTERISK, etc.
    if (
      token.type === 'WORD' ||
      token.type === 'CHAR' ||
      token.type === 'OPERATOR' ||
      token.type === 'PIPE' ||
      token.type === 'ASTERISK'
    ) {
      offset++;
      continue;
    }
    // If we hit anything else, not a clause pattern
    return false;
  }
};

// Skip to after "case $1 in"
while (current < tokens.length && !match('CONTROL_IN')) {
  advance();
}
advance(); // consume "in"

console.log('\nStarting clause detection at position:', current);
console.log('Current token:', peek() ? `${peek().type} "${peek().value}"` : 'EOF');

let clauseCount = 0;
while (true) {
  // Skip any newlines
  while (match('NEWLINE')) {
    console.log(`Skipping NEWLINE at position ${current}`);
    advance();
  }

  // If we're at esac, stop
  if (match('CONTROL_ESAC')) {
    console.log(`Found CONTROL_ESAC at position ${current}, stopping`);
    break;
  }

  console.log(`\nChecking for clause pattern at position ${current}`);
  console.log('Current token:', peek() ? `${peek().type} "${peek().value}"` : 'EOF');

  // Only parse a clause if we see a valid clause pattern (ending with RPAREN)
  if (isNextClausePattern()) {
    console.log('✅ Found clause pattern!');
    clauseCount++;

    // Simulate parsing the clause (skip until we hit ;; or esac)
    console.log('Parsing clause...');
    while (!match('DOUBLE_SEMICOLON') && !match('CONTROL_ESAC')) {
      console.log(`  Skipping ${peek().type} "${peek().value}"`);
      advance();
    }

    if (match('DOUBLE_SEMICOLON')) {
      console.log(`  Found DOUBLE_SEMICOLON, consuming`);
      advance();
    }

    console.log(`Finished clause ${clauseCount}`);
  } else {
    console.log('❌ Not a clause pattern, breaking');
    break;
  }
}

console.log(`\nTotal clauses found: ${clauseCount}`);