const { parse, generate } = require('../dist/index');

console.log('=== Final Difference Analysis ===\n');

const testCase = {
  name: 'If-Else Statement',
  code: 'if [ -f file.txt ]; then\n    echo "file exists"\nelse\n    echo "file not found"\nfi'
};

console.log(`--- ${testCase.name} ---`);
console.log('Original input:');
console.log(testCase.code);

const ast = parse(testCase.code);
const output = generate(ast);

console.log('\nFirst generation:');
console.log(output);

// Show the difference visually
console.log('\n=== VISUAL COMPARISON ===');
console.log('Original:  " else" (1 space)');
console.log('Generated: "  else" (2 spaces)');

// Show character-by-character comparison
const originalLines = testCase.code.split('\n');
const generatedLines = output.split('\n');

console.log('\n=== LINE-BY-LINE COMPARISON ===');
for (let i = 0; i < Math.max(originalLines.length, generatedLines.length); i++) {
  const original = originalLines[i] || '';
  const generated = generatedLines[i] || '';

  if (original !== generated) {
    console.log(`Line ${i + 1}:`);
    console.log(`  Original:  "${original}"`);
    console.log(`  Generated: "${generated}"`);

    // Show character codes for the difference
    const minLength = Math.min(original.length, generated.length);
    for (let j = 0; j < minLength; j++) {
      if (original[j] !== generated[j]) {
        console.log(`    Char ${j}: '${original[j]}' (${original.charCodeAt(j)}) vs '${generated[j]}' (${generated.charCodeAt(j)})`);
      }
    }
  }
}