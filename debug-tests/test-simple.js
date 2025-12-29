#!/usr/bin/env node

const { parse, generate } = require('../dist');

console.log('🧪 Simple test...\n');

const testCase = 'echo   "hello world"';

console.log('Original:');
console.log(`"${testCase}"`);

try {
  const ast = parse(testCase);
  console.log('\n✅ Parse successful!');

  // Check the command arguments
  const command = ast.body[0];
  if (command.type === 'Command') {
    console.log('\nCommand arguments:');
    for (let i = 0; i < command.arguments.length; i++) {
      const arg = command.arguments[i];
      console.log(`${i}: "${arg.text}" (length: ${arg.text.length})`);
    }
  }

  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(`"${generated}"`);

  console.log('\nGenerated length:', generated.length);
  console.log('Original length:', testCase.length);

} catch (error) {
  console.log('❌ Failed:', error.message);
}