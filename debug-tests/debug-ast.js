#!/usr/bin/env node

const { parse } = require('../dist');

console.log('🔍 Debugging AST structure...\n');

const testCase = 'echo   "hello world"';

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
    console.log('   Full node:', JSON.stringify(node, null, 2));
  }

} catch (error) {
  console.log('❌ Parse failed:', error.message);
  console.log('Stack:', error.stack);
}