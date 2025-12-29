const { parse } = require('../dist/parser');
const { generate } = require('../dist/generator');

console.log('=== Spacing Issues Debug ===\n');

// Test cases that are failing due to spacing
const testCases = [
  {
    name: 'If-Else Statement',
    code: 'if [ -f file.txt ]; then\n    echo "file exists"\nelse\n    echo "file not found"\nfi'
  },
  {
    name: 'Function Definition',
    code: 'function build() {\n    echo "Building project..."\n    npm run build\n}'
  },
  {
    name: 'Brace Group',
    code: '{\n    echo "Starting group"\n    npm install\n    echo "Group complete"\n}'
  }
];

for (const testCase of testCases) {
  console.log(`--- ${testCase.name} ---`);
  console.log('Input:');
  console.log(testCase.code);

  try {
    const ast = parse(testCase.code);
    console.log('\n✅ Parse successful');

    const generated = generate(ast);
    console.log('\nGenerated:');
    console.log(generated);

    console.log('\nComparison:');
    console.log('Original length:', testCase.code.length);
    console.log('Generated length:', generated.length);
    console.log('Match:', testCase.code === generated);

    if (testCase.code !== generated) {
      console.log('\n❌ Spacing difference detected!');

      // Show character-by-character differences
      const originalLines = testCase.code.split('\n');
      const generatedLines = generated.split('\n');

      console.log('\nLine-by-line comparison:');
      const maxLines = Math.max(originalLines.length, generatedLines.length);

      for (let i = 0; i < maxLines; i++) {
        const origLine = originalLines[i] || '';
        const genLine = generatedLines[i] || '';

        if (origLine !== genLine) {
          console.log(`Line ${i + 1}:`);
          console.log(`  Original: "${origLine}" (length: ${origLine.length})`);
          console.log(`  Generated: "${genLine}" (length: ${genLine.length})`);

          // Show character differences
          const maxChars = Math.max(origLine.length, genLine.length);
          for (let j = 0; j < maxChars; j++) {
            const origChar = origLine[j] || '[MISSING]';
            const genChar = genLine[j] || '[MISSING]';
            if (origChar !== genChar) {
              console.log(`    Char ${j}: '${origChar}' (${origChar.charCodeAt(0)}) vs '${genChar}' (${genChar.charCodeAt(0)})`);
            }
          }
        }
      }
    } else {
      console.log('✅ Spacing preserved perfectly!');
    }

  } catch (error) {
    console.log('❌ Parse failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');
}