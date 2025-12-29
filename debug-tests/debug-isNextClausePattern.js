const { parse } = require('../dist');

console.log('=== Testing isNextClausePattern Function ===\n');

const caseCode = 'case $var in start) echo "Starting";; stop) echo "Stopping";; esac';

console.log('Original:', caseCode);

// Check lexer output
console.log('\n--- Lexer Output ---');
const { BashLexer } = require('../dist');
const lexer = new BashLexer(caseCode);
const tokens = lexer.tokenize();
console.log('Tokens:');
tokens.forEach((token, index) => {
  console.log(`  ${index}: ${token.type} = "${token.value}"`);
});

// Manually test isNextClausePattern logic
console.log('\n--- Testing isNextClausePattern Logic ---');

// Simulate the isNextClausePattern function
const testIsNextClausePattern = (startIndex) => {
  console.log(`\nTesting from position ${startIndex}:`);
  let offset = 0;
  let hasWord = false;

  while (true) {
    const token = tokens[startIndex + offset];
    if (!token) {
      console.log(`  No token at offset ${offset}, returning false`);
      return false;
    }

    console.log(`  Offset ${offset}: ${token.type} = "${token.value}"`);

    if (token.type === 'NEWLINE') {
      offset++;
      continue;
    }

    if (token.type === 'CONTROL_ESAC') {
      console.log(`  Found CONTROL_ESAC, returning false`);
      return false;
    }

    if (token.type === 'RPAREN') {
      console.log(`  Found RPAREN, hasWord = ${hasWord}, returning ${hasWord}`);
      return hasWord;
    }

    // Acceptable pattern tokens: WORD, CHAR, OPERATOR, PIPE, ASTERISK, etc.
    if (
      token.type === 'WORD' ||
      token.type === 'CHAR' ||
      token.type === 'OPERATOR' ||
      token.type === 'PIPE' ||
      token.type === 'ASTERISK'
    ) {
      if (token.type === 'WORD') {
        hasWord = true;
        console.log(`  Found WORD, hasWord = true`);
      }
      offset++;
      continue;
    }

    console.log(`  Found unexpected token ${token.type}, returning false`);
    return false;
  }
};

// Test from position 8 (after first clause, at "stop")
console.log('\n--- Testing from position 8 (after first clause) ---');
const result = testIsNextClausePattern(8);
console.log(`Result: ${result}`);