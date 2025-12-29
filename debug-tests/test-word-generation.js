#!/usr/bin/env node

const { parse, generate } = require('../dist');

console.log('🧪 Testing word generation...\n');

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
      console.log(`  ${i}: "${arg.text}" (quoted: ${arg.quoted}, quoteType: ${arg.quoteType})`);
    }
  }

  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(`"${generated}"`);

  console.log('\nGenerated length:', generated.length);
  console.log('Original length:', testCase.length);
  console.log('Match:', generated === testCase);

} catch (error) {
  console.log('❌ Failed:', error.message);
}