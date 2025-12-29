#!/usr/bin/env node

const { generate } = require('../dist');

console.log('🧪 Testing generateWord method directly...\n');

// Create a test that forces us to use the actual generateWord method
const ast = {
  type: 'Program',
  body: [
    {
      type: 'Command',
      name: {
        type: 'Word',
        text: 'echo',
        quoted: false
      },
      arguments: [
        {
          type: 'Word',
          text: '   ',
          quoted: false
        },
        {
          type: 'Word',
          text: 'hello world',
          quoted: true,
          quoteType: '"'
        }
      ],
      redirects: [],
      hereDocument: null
    }
  ],
  comments: []
};

console.log('AST:');
console.log(JSON.stringify(ast, null, 2));

try {
  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(`"${generated}"`);

  // Let's analyze the output character by character
  console.log('\nCharacter analysis:');
  console.log('Generated length:', generated.length);
  for (let i = 0; i < generated.length; i++) {
    const char = generated[i];
    const code = char.charCodeAt(0);
    console.log(`${i}: '${char}' (${code})`);
  }

  const expected = 'echo   "hello world"';
  console.log('\nExpected:');
  console.log(`"${expected}"`);
  console.log('Expected length:', expected.length);

  console.log('\nMatch:', generated === expected);

  // Find where the difference starts
  const minLength = Math.min(generated.length, expected.length);
  for (let i = 0; i < minLength; i++) {
    if (generated[i] !== expected[i]) {
      console.log(`\nFirst difference at position ${i}:`);
      console.log(`Generated: '${generated[i]}' (${generated[i].charCodeAt(0)})`);
      console.log(`Expected: '${expected[i]}' (${expected[i].charCodeAt(0)})`);
      break;
    }
  }

} catch (error) {
  console.log('❌ Failed:', error.message);
  console.log('Stack:', error.stack);
}