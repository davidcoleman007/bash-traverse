#!/usr/bin/env node

const { parse, generate } = require('../dist');

console.log('🔍 Debugging generation...\n');

const testCase = 'echo   "hello world"';

console.log('Original:');
console.log(`"${testCase}"`);

try {
  const ast = parse(testCase);
  console.log('\n✅ Parse successful!');

  // Check the command arguments
  const command = ast.body[0];
  if (command.type === 'Command') {
    console.log('\nCommand structure:');
    console.log('Name:', command.name.text);
    console.log('Arguments:');
    for (let i = 0; i < command.arguments.length; i++) {
      const arg = command.arguments[i];
      console.log(`  ${i}: "${arg.text}" (length: ${arg.text.length})`);
    }

    // Simulate generation
    console.log('\nSimulated generation:');
    let result = command.name.text;
    console.log('After name:', `"${result}"`);

    for (let i = 0; i < command.arguments.length; i++) {
      const arg = command.arguments[i];
      result += arg.text;
      console.log(`After arg ${i}:`, `"${result}"`);
    }

    console.log('\nFinal result:', `"${result}"`);
    console.log('Expected:', `"${testCase}"`);
    console.log('Match:', result === testCase);
  }

} catch (error) {
  console.log('❌ Failed:', error.message);
}