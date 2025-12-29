const { parse, generate } = require('../dist/index.js');

console.log('=== Basic Parsing Tests ===\n');

// Test 1: Simple command
console.log('1. Simple command:');
const simpleCommand = 'echo "hello world"';
console.log('Input:', simpleCommand);
try {
  const ast = parse(simpleCommand);
  console.log('✅ Parsed successfully');
  console.log('Command name:', ast.body[0]?.name?.text);
  console.log('Arguments:', ast.body[0]?.arguments?.map(arg => arg.text));
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 2: Multiple commands
console.log('2. Multiple commands:');
const multipleCommands = `npm install
npm test
npm run build`;
console.log('Input:');
console.log(multipleCommands);
try {
  const ast = parse(multipleCommands);
  console.log('✅ Parsed successfully');
  console.log('Number of commands:', ast.body.length);
  console.log('Commands:', ast.body.map(cmd => cmd.name?.text));
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 3: Command with arguments
console.log('3. Command with arguments:');
const commandWithArgs = 'npm install --save-dev jest typescript';
console.log('Input:', commandWithArgs);
try {
  const ast = parse(commandWithArgs);
  console.log('✅ Parsed successfully');
  console.log('Command name:', ast.body[0]?.name?.text);
  console.log('Arguments:', ast.body[0]?.arguments?.map(arg => arg.text));
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 4: Quoted strings
console.log('4. Quoted strings:');
const quotedStrings = 'echo "Hello World" \'Single quotes\' "Mixed \'quotes\'"';
console.log('Input:', quotedStrings);
try {
  const ast = parse(quotedStrings);
  console.log('✅ Parsed successfully');
  console.log('Arguments:', ast.body[0]?.arguments?.map(arg => ({ text: arg.text, quoted: arg.quoted })));
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 5: Variable expansion
console.log('5. Variable expansion:');
const variableExpansion = 'echo $HOME ${USER:-default}';
console.log('Input:', variableExpansion);
try {
  const ast = parse(variableExpansion);
  console.log('✅ Parsed successfully');
  console.log('Arguments:', ast.body[0]?.arguments?.map(arg => ({ type: arg.type, text: arg.text })));
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

console.log('🎯 Basic parsing tests completed!');