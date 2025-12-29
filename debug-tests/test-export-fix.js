#!/usr/bin/env node

const { parse, generate } = require('../dist');

console.log('🧪 Testing export command parsing fix...\n');

const testCases = [
  'export NPM_EMAIL="${BASH_REMATCH[1]}"',
  'export NPM_AUTH="${BASH_REMATCH[1]}"',
  'export PATH=/usr/bin:/bin'
];

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}:`);
  console.log(`Original: ${testCase}`);

  try {
    const ast = parse(testCase);
    console.log('✅ Parsed successfully');

    // Inspect the command
    const command = ast.body[0];
    if (command.type === 'Command') {
      console.log('Command name:', command.name.text);
      console.log('Arguments count:', command.arguments.length);
      console.log('Arguments:', command.arguments.map(arg => arg.text));

      // Check if the export argument is properly combined
      if (command.arguments.length === 1 && command.arguments[0].text.includes('=')) {
        console.log('✅ Export argument properly combined');
      } else if (command.arguments.length === 3 && command.arguments[1].text === '=') {
        console.log('❌ Export argument still separated');
      }
    }

    const generated = generate(ast);
    console.log(`Generated: "${generated}"`);

    const roundTrip = parse(generated);
    console.log('Round-trip:', testCase === generated ? '✅ SAME' : '❌ DIFFERENT');

    if (testCase !== generated) {
      console.log('Original:', `"${testCase}"`);
      console.log('Generated:', `"${generated}"`);
    }

  } catch (error) {
    console.log('❌ Parse failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');
});