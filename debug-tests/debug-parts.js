#!/usr/bin/env node

const { generate } = require('../dist');

console.log('🔍 Debugging parts generation...\n');

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
  // Simulate the generation step by step
  console.log('\nSimulating generation:');

  const command = ast.body[0];
  const parts = [];

  // Generate command name
  const name = command.name.text;
  parts.push(name);
  console.log('1. Name:', `"${name}"`);

  // Generate arguments
  for (let i = 0; i < command.arguments.length; i++) {
    const arg = command.arguments[i];
    let generated;

    if (arg.quoted) {
      const quote = arg.quoteType || '"';
      generated = `${quote}${arg.text}${quote}`;
    } else {
      generated = arg.text;
    }

    parts.push(generated);
    console.log(`${i + 2}. Argument ${i}:`, `"${generated}"`);
  }

  // Join parts
  const result = parts.join('');
  console.log('\nParts array:', parts.map(p => `"${p}"`));
  console.log('Joined result:', `"${result}"`);

  // Compare with actual generation
  const actualGenerated = generate(ast);
  console.log('\nActual generated:', `"${actualGenerated}"`);
  console.log('Simulated result:', `"${result}"`);
  console.log('Match:', result === actualGenerated);

  const expected = 'echo   "hello world"';
  console.log('\nExpected:', `"${expected}"`);
  console.log('Actual match:', actualGenerated === expected);

} catch (error) {
  console.log('❌ Failed:', error.message);
  console.log('Stack:', error.stack);
}