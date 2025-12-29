#!/usr/bin/env node

const { generate } = require('../dist');

console.log('🧪 Testing direct generation...\n');

// Create a simple AST manually
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

  const expected = 'echo   "hello world"';
  console.log('\nExpected:');
  console.log(`"${expected}"`);

  console.log('\nMatch:', generated === expected);
  console.log('Generated length:', generated.length);
  console.log('Expected length:', expected.length);

} catch (error) {
  console.log('❌ Failed:', error.message);
  console.log('Stack:', error.stack);
}