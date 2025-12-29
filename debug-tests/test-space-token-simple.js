#!/usr/bin/env node

const { parse, generate } = require('../dist');

console.log('🧪 Testing SPACE token as statements...\n');

const testCase = 'echo   "hello world"';  // Multiple spaces

console.log('Original:');
console.log(`"${testCase}"`);

try {
  const ast = parse(testCase);
  console.log('\n✅ Parse successful!');

  console.log('\nAST structure:');
  console.log('Total statements:', ast.body.length);

  for (let i = 0; i < ast.body.length; i++) {
    const node = ast.body[i];
    console.log(`${i}: ${node.type}`);

    if (node.type === 'Command') {
      console.log(`   Command name: ${node.name.text}`);
      console.log(`   Arguments: ${node.arguments.map(arg => arg.text).join(', ')}`);
    } else if (node.type === 'Space') {
      console.log(`   Space value: "${node.value}" (length: ${node.value.length})`);
    }
  }

  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(`"${generated}"`);

  console.log('\nComparison:');
  console.log('Original length:', testCase.length);
  console.log('Generated length:', generated.length);
  console.log('Match:', testCase === generated);

} catch (error) {
  console.log('❌ Parse failed:', error.message);
  console.log('Stack:', error.stack);
}