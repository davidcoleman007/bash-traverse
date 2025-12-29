#!/usr/bin/env node

const { parse, generate } = require('../dist');

console.log('🧪 Testing SPACE token implementation (detailed)...\n');

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
    }
  }

  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(`"${generated}"`);

  console.log('\nComparison:');
  console.log('Original length:', testCase.length);
  console.log('Generated length:', generated.length);
  console.log('Match:', testCase === generated);

  if (testCase === generated) {
    console.log('✅ SPACE token test passed!');
  } else {
    console.log('❌ SPACE token test failed');

    // Show differences
    const originalChars = testCase.split('');
    const generatedChars = generated.split('');

    console.log('\nCharacter-by-character comparison:');
    const maxChars = Math.max(originalChars.length, generatedChars.length);
    for (let i = 0; i < maxChars; i++) {
      const orig = originalChars[i] || '[MISSING]';
      const gen = generatedChars[i] || '[MISSING]';
      if (orig !== gen) {
        console.log(`${i}: '${orig}' (${orig.charCodeAt(0)}) vs '${gen}' (${gen.charCodeAt(0)})`);
      }
    }
  }

  // Test with indentation
  console.log('\n' + '='.repeat(50));
  console.log('Testing indentation preservation...');

  const indentedCase = '  echo "hello world"';  // Leading spaces

  console.log('\nOriginal (with indentation):');
  console.log(`"${indentedCase}"`);

  const indentedAst = parse(indentedCase);
  const indentedGenerated = generate(indentedAst);

  console.log('\nGenerated (with indentation):');
  console.log(`"${indentedGenerated}"`);

  console.log('\nIndentation comparison:');
  console.log('Original length:', indentedCase.length);
  console.log('Generated length:', indentedGenerated.length);
  console.log('Match:', indentedCase === indentedGenerated);

} catch (error) {
  console.log('❌ Parse failed:', error.message);
}