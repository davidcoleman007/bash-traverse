#!/usr/bin/env node

const { parse, generate } = require('../dist');

console.log('🧪 Testing shell-level token granularity...\n');

const testCases = [
  'npx write-version',
  'echo "hello world"',
  '[[ "$auth" =~ email\\ *=\\ *([[:graph:]]*) ]]',
  'npm run bundle : aggregation'
];

for (const testCase of testCases) {
  console.log('='.repeat(50));
  console.log('Test case:', testCase);
  console.log('='.repeat(50));

  try {
    const ast = parse(testCase);
    console.log('✅ Parse successful!');

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

    if (testCase !== generated) {
      console.log('❌ Round-trip failed');

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
    } else {
      console.log('✅ Round-trip successful!');
    }

  } catch (error) {
    console.log('❌ Parse failed:', error.message);
  }

  console.log('\n');
}