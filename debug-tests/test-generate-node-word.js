#!/usr/bin/env node

const { generate } = require('../dist');

console.log('🧪 Testing generateNode with Word...\n');

// Test generateNode with a Word node
const ast = {
  type: 'Program',
  body: [
    {
      type: 'Word',
      text: 'hello world',
      quoted: true,
      quoteType: '"'
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

  const expected = '"hello world"';
  console.log('\nExpected:');
  console.log(`"${expected}"`);

  console.log('\nMatch:', generated === expected);

} catch (error) {
  console.log('❌ Failed:', error.message);
  console.log('Stack:', error.stack);
}