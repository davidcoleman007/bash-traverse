const { parse, generate } = require('../dist/index.js');
const { BashLexer } = require('../dist/lexer.js');

console.log('=== Debug Parser Position ===\n');

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

// Create a simple parser to trace position
class DebugParser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  peek() {
    return this.tokens[this.current] || null;
  }

  advance() {
    const token = this.peek();
    this.current++;
    return token;
  }

  match(type) {
    const token = this.peek();
    return token && token.type === type;
  }

  trace(message) {
    const token = this.peek();
    console.log(`[${this.current}] ${message}: ${token ? `${token.type} "${token.value}"` : 'EOF'}`);
  }
}

console.log('\n--- Tracing Parser Position ---');
const debugParser = new DebugParser(tokens);

// Simulate the case statement parsing process
debugParser.trace('Start');
debugParser.advance(); // consume CONTROL_CASE
debugParser.trace('After consuming CONTROL_CASE');

debugParser.advance(); // consume EXPANSION
debugParser.trace('After consuming EXPANSION');

debugParser.advance(); // consume CONTROL_IN
debugParser.trace('After consuming CONTROL_IN');

debugParser.advance(); // consume NEWLINE
debugParser.trace('After consuming NEWLINE');

// Now we should be at the first clause
debugParser.trace('About to parse first clause');

// Simulate parsing the first clause
debugParser.advance(); // consume WORD "start"
debugParser.trace('After consuming WORD "start"');

debugParser.advance(); // consume RPAREN
debugParser.trace('After consuming RPAREN');

debugParser.advance(); // consume WORD "echo"
debugParser.trace('After consuming WORD "echo"');

debugParser.advance(); // consume STRING
debugParser.trace('After consuming STRING');

debugParser.advance(); // consume DOUBLE_SEMICOLON
debugParser.trace('After consuming DOUBLE_SEMICOLON');

debugParser.advance(); // consume NEWLINE
debugParser.trace('After consuming NEWLINE');

// Now we should be at the second clause
debugParser.trace('About to parse second clause');

// Simulate parsing the second clause
debugParser.advance(); // consume WORD "stop"
debugParser.trace('After consuming WORD "stop"');

debugParser.advance(); // consume RPAREN
debugParser.trace('After consuming RPAREN');

debugParser.advance(); // consume WORD "echo"
debugParser.trace('After consuming WORD "echo"');

debugParser.advance(); // consume STRING
debugParser.trace('After consuming STRING');

debugParser.advance(); // consume DOUBLE_SEMICOLON
debugParser.trace('After consuming DOUBLE_SEMICOLON');

debugParser.advance(); // consume NEWLINE
debugParser.trace('After consuming NEWLINE');

// Now we should be at the third clause
debugParser.trace('About to parse third clause');

// Simulate parsing the third clause
debugParser.advance(); // consume WORD "*"
debugParser.trace('After consuming WORD "*"');

debugParser.advance(); // consume RPAREN
debugParser.trace('After consuming RPAREN');

debugParser.advance(); // consume WORD "echo"
debugParser.trace('After consuming WORD "echo"');

debugParser.advance(); // consume STRING
debugParser.trace('After consuming STRING');

debugParser.advance(); // consume DOUBLE_SEMICOLON
debugParser.trace('After consuming DOUBLE_SEMICOLON');

debugParser.advance(); // consume NEWLINE
debugParser.trace('After consuming NEWLINE');

// Now we should be at CONTROL_ESAC
debugParser.trace('About to parse next clause (should be CONTROL_ESAC)');

if (debugParser.match('CONTROL_ESAC')) {
  console.log('✅ Found CONTROL_ESAC - case statement should end here');
} else {
  console.log('❌ Expected CONTROL_ESAC but found:', debugParser.peek());
}