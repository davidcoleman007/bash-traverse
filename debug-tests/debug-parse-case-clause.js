const { BashLexer } = require('../dist/index.js');

// Test the parseCaseClause method specifically
const input = `case $1 in
start) echo "Starting..." ;;
stop) echo "Stopping..." ;;
*) echo "Unknown command" ;;
esac`;

console.log('=== ParseCaseClause Debug ===\n');

console.log('Input:');
console.log(input);
console.log('\n--- Tokenization ---');

const lexer = new BashLexer(input);
const tokens = lexer.tokenize();

console.log('Tokens:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});

console.log('\n--- Simulating parseCaseClause ---');

// Simulate the parseCaseClause method
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

const consume = (type, message) => {
  const token = peek();
  if (!token || token.type !== type) {
    throw new Error(`${message}, got ${token ? token.type : 'EOF'}`);
  }
  advance();
  return token;
};

// Simulate parseCaseClause
const parseCaseClause = () => {
  console.log(`\nparseCaseClause called at position ${current}`);
  console.log('Current token:', peek() ? `${peek().type} "${peek().value}"` : 'EOF');

  // Check if we've reached the end of case statement
  if (match('CONTROL_ESAC')) {
    console.log('❌ Found CONTROL_ESAC, returning null');
    return null;
  }

  // Parse patterns until we hit the closing parenthesis
  const patterns = [];
  console.log('Parsing patterns...');
  while (!match('RPAREN') && !match('CONTROL_ESAC')) {
    const token = peek();
    if (token?.type === 'NEWLINE') {
      console.log(`  Skipping NEWLINE`);
      advance();
    } else {
      console.log(`  Adding pattern: ${token.type} "${token.value}"`);
      patterns.push(token);
      advance();
    }
  }

  console.log(`Patterns found: ${patterns.length}`);

  if (!match('RPAREN')) {
    console.log('❌ No RPAREN found, returning null');
    return null;
  }

  console.log('✅ Found RPAREN, consuming');
  advance(); // consume ')'

  // Parse the statements until we hit ;;
  console.log('Parsing statements...');
  const statements = [];
  while (!match('DOUBLE_SEMICOLON') && !match('CONTROL_ESAC')) {
    const token = peek();
    if (!token) break;

    if (token.type === 'NEWLINE') {
      console.log(`  Skipping NEWLINE`);
      advance();
      continue;
    }

    console.log(`  Adding statement: ${token.type} "${token.value}"`);
    statements.push(token);
    advance();
  }

  console.log(`Statements found: ${statements.length}`);

  // Check if the next token is CONTROL_ESAC (end of case statement)
  if (match('CONTROL_ESAC')) {
    console.log('Found CONTROL_ESAC, no need for ;;');
  } else {
    console.log('Consuming DOUBLE_SEMICOLON');
    consume('DOUBLE_SEMICOLON', 'Expected ;;');
    statements.push({ type: 'DoubleSemicolon' });
  }

  if (patterns.length > 0) {
    console.log('✅ Returning CaseClause');
    return {
      type: 'CaseClause',
      patterns: patterns,
      statements: statements
    };
  }

  console.log('❌ No patterns, returning null');
  return null;
};

// Skip to after "case $1 in"
while (current < tokens.length && !match('CONTROL_IN')) {
  advance();
}
advance(); // consume "in"

console.log('\nStarting parseCaseClause calls...');

let clauseCount = 0;
while (true) {
  // Skip any newlines
  while (match('NEWLINE')) {
    advance();
  }

  // If we're at esac, stop
  if (match('CONTROL_ESAC')) {
    console.log('Found CONTROL_ESAC, stopping');
    break;
  }

  const clause = parseCaseClause();
  if (clause) {
    clauseCount++;
    console.log(`✅ Parsed clause ${clauseCount}`);
  } else {
    console.log('❌ parseCaseClause returned null, breaking');
    break;
  }
}

console.log(`\nTotal clauses parsed: ${clauseCount}`);