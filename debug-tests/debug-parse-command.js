const { BashLexer, BashParser } = require('../dist');

console.log('=== Parse Command Debug ===\n');

// Test a simple command with newline
const source = `echo "hello"
echo "world"`;

console.log('Source:', JSON.stringify(source));
console.log('---');

try {
  const lexer = new BashLexer(source);
  const tokens = lexer.tokenize();
  console.log('Tokens:');
  tokens.forEach((token, i) => {
    const marker = token.type === 'NEWLINE' ? ' ← NEWLINE' : '';
    console.log(`  ${i}: ${token.type} "${token.value}"${marker}`);
  });

  console.log('\n---\n');

  // Test parseCommand directly
  const parser = new BashParser();
  parser.tokens = tokens;
  parser.current = 0;

  console.log('Testing parseCommand:');
  console.log(`Initial current: ${parser.current}`);

  // Debug parseCommand step by step
  console.log('\nDebugging parseCommand:');

  // Step 1: Check initial token
  const token = parser.peek();
  console.log(`1. Initial token: ${token?.type} "${token?.value}"`);

  // Step 2: Parse command name
  const commandName = parser.parseWord();
  console.log(`2. Command name: ${commandName.type} "${commandName.text}"`);
  console.log(`   Current after parseWord: ${parser.current}`);

  // Step 3: Check for custom handler
  const customHandler = parser.findCustomCommandHandler(commandName);
  console.log(`3. Custom handler: ${customHandler ? 'found' : 'not found'}`);

  // Step 4: Parse standard command with debugging
  console.log(`4. Calling parseStandardCommand...`);
  console.log(`   Current before parseStandardCommand: ${parser.current}`);

  // Debug the while loop inside parseStandardCommand
  console.log('\nDebugging while loop in parseStandardCommand:');
  let iteration = 0;
  while (!parser.isAtEnd() && !parser.match('SEMICOLON') && !parser.match('NEWLINE') && !parser.match('RBRACE') && !parser.match('AND') && !parser.match('OR')) {
    iteration++;
    const currentToken = parser.peek();
    console.log(`Iteration ${iteration}: current=${parser.current}, token=${currentToken?.type} "${currentToken?.value}"`);
    console.log(`  isAtEnd=${parser.isAtEnd()}, match('NEWLINE')=${parser.match('NEWLINE')}`);

    if (parser.match('REDIRECT')) {
      console.log('  → Parsing redirect');
      parser.parseRedirect();
    } else if (parser.match('OPERATOR') && parser.peek()?.value === '=') {
      console.log('  → Parsing variable assignment');
      parser.parseWord(); // consume the operator
      parser.parseWord(); // consume the value
    } else {
      console.log('  → Parsing word');
      parser.parseWord();
    }
  }

  console.log(`\nWhile loop ended at current=${parser.current}`);
  console.log(`Next token: ${parser.peek()?.type} "${parser.peek()?.value}"`);

  // Now call the actual parseStandardCommand
  parser.current = 1; // Reset to after command name
  const command = parser.parseStandardCommand(commandName);
  console.log(`   parseStandardCommand returned: ${command.type}`);
  console.log(`   Current after parseStandardCommand: ${parser.current}`);

  console.log(`\nFinal result: type=${command.type}, final current=${parser.current}`);

} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}