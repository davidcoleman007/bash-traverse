const { parse, generate } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Match Method ===\n');

const generatedCase = `case $1 in
start ) echo "Starting..." ;;
stop ) echo "Stopping..." ;;
* ) echo "Unknown command" ;;
esac`;

// Get the token stream
const lexer = new BashLexer(generatedCase);
const tokens = lexer.tokenize();

console.log('Token stream:');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} "${token.value}"`);
});

// Test the match method at different positions
console.log('\n--- Testing Match Method ---');

for (let i = 0; i < tokens.length; i++) {
  const token = tokens[i];
  const isControlEsac = token.type === 'CONTROL_ESAC';
  console.log(`Position ${i}: ${token.type} "${token.value}" - is CONTROL_ESAC: ${isControlEsac}`);

  if (isControlEsac) {
    console.log(`  ✅ Found CONTROL_ESAC at position ${i}`);
  }
}