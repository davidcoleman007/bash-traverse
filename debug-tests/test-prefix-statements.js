const { parse, generate } = require('../dist/index.js');

console.log('Testing prefixStatements approach...\n');

// Test 1: Variable assignment prefix
console.log('Test 1: NODE_ENV=production npm run build');
try {
  const ast1 = parse('NODE_ENV=production npm run build');
  console.log('AST:', JSON.stringify(ast1, null, 2));
  const generated1 = generate(ast1);
  console.log('Generated:', generated1);
  console.log('✅ Test 1 passed\n');
} catch (error) {
  console.log('❌ Test 1 failed:', error.message);
}

// Test 2: Multiple variable assignments
console.log('Test 2: NODE_ENV=production DEBUG=true npm run build');
try {
  const ast2 = parse('NODE_ENV=production DEBUG=true npm run build');
  console.log('AST:', JSON.stringify(ast2, null, 2));
  const generated2 = generate(ast2);
  console.log('Generated:', generated2);
  console.log('✅ Test 2 passed\n');
} catch (error) {
  console.log('❌ Test 2 failed:', error.message);
}

// Test 3: Pipeline with variable assignment
console.log('Test 3: NODE_ENV=production && npm run build');
try {
  const ast3 = parse('NODE_ENV=production && npm run build');
  console.log('AST:', JSON.stringify(ast3, null, 2));
  const generated3 = generate(ast3);
  console.log('Generated:', generated3);
  console.log('✅ Test 3 passed\n');
} catch (error) {
  console.log('❌ Test 3 failed:', error.message);
}