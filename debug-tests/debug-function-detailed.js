const { BashLexer } = require('../dist/lexer');
const { parse } = require('../dist/parser');

console.log('=== Detailed Function Parsing Debug ===\n');

const functionCode = 'function build() {\n    echo "Building project..."\n    npm run build\n}';

console.log('Input code:');
console.log(functionCode);
console.log('\n--- Tokenization ---');

const lexer = new BashLexer(functionCode);
const tokens = lexer.tokenize();
console.log('Tokens (after post-processing):');
tokens.forEach((token, index) => {
  console.log(`${index}: ${token.type} = "${token.value}"`);
});

console.log('\n--- Step-by-step parsing ---');

// Simulate the parser's behavior
let currentIndex = 0;

function peek() {
  return tokens[currentIndex];
}

function advance() {
  return tokens[currentIndex++];
}

function match(type) {
  return tokens[currentIndex]?.type === type;
}

function consume(type, message) {
  const token = tokens[currentIndex];
  if (token?.type !== type) {
    throw new Error(`${message}, got ${token?.type || 'EOF'}`);
  }
  return tokens[currentIndex++];
}

console.log('\n1. Starting with token:', peek()?.type, '=', peek()?.value);

// Simulate parseStatement dispatch for CONTROL_FUNCTION
if (match('CONTROL_FUNCTION')) {
  console.log('2. Found CONTROL_FUNCTION, advancing...');
  advance(); // consume 'function'
  console.log('3. After consuming function, current token:', peek()?.type, '=', peek()?.value);
}

// Simulate parseFunctionDefinition
console.log('4. Entering parseFunctionDefinition...');

// Parse function name
const nameToken = advance(); // consume function name
console.log('5. Parsed function name:', nameToken?.type, '=', nameToken?.value);
console.log('6. Current token after parsing name:', peek()?.type, '=', peek()?.value);

// Check for function arguments
if (match('FUNCTION_ARGS_START')) {
  console.log('7. Found FUNCTION_ARGS_START, parsing arguments...');
  consume('FUNCTION_ARGS_START', 'Expected (');
  console.log('8. After consuming FUNCTION_ARGS_START, current token:', peek()?.type, '=', peek()?.value);

  consume('FUNCTION_ARGS_END', 'Expected )');
  console.log('9. After consuming FUNCTION_ARGS_END, current token:', peek()?.type, '=', peek()?.value);

  consume('BRACE_START', 'Expected {');
  console.log('10. After consuming BRACE_START, current token:', peek()?.type, '=', peek()?.value);
} else {
  console.log('7. No FUNCTION_ARGS_START found, checking for BRACE_START...');
  consume('BRACE_START', 'Expected {');
  console.log('8. After consuming BRACE_START, current token:', peek()?.type, '=', peek()?.value);
}

console.log('\n--- Full parsing ---');
try {
  const ast = parse(functionCode);
  console.log('Parse successful');
  console.log('AST:', JSON.stringify(ast, null, 2));
} catch (error) {
  console.log('Parse failed:', error.message);
  console.log('Error stack:', error.stack);
}