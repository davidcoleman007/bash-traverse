#!/usr/bin/env node

const { parse, generate } = require('../dist');

console.log('🧪 Testing test expression parsing fix...\n');

const testCases = [
  'if [[ -n "$ARTIFACTORY_USER" ]]; then echo "test"; fi',
  'if [[ "$auth" =~ email\\ *=\\ *([[:graph:]]*) ]]; then echo "match"; fi',
  'if [ -f file.txt ]; then echo "exists"; fi'
];

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}:`);
  console.log(`Original: ${testCase}`);

  try {
    const ast = parse(testCase);
    console.log('✅ Parsed successfully');

    // Inspect the test expression
    const statement = ast.body[0];
    if (statement.type === 'IfStatement') {
      console.log('Test expression type:', statement.condition.type);
      if (statement.condition.type === 'TestExpression') {
        console.log('Elements count:', statement.condition.elements.length);
        console.log('Elements:', statement.condition.elements.map(el => ({
          isOperator: el.isOperator,
          text: el.isOperator ? el.operator?.text : el.argument?.text
        })));
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