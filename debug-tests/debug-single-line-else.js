const { parse, generate } = require('../dist/index.js');

console.log('=== Single-Line If-Else Spacing Test ===\n');

const testCases = [
  'if [ -f file.txt ]; then echo "exists"; else echo "not found"; fi',
  'if [ -f file.txt ]; then echo "exists";  else echo "not found"; fi',
  'if [ -f file.txt ]; then echo "exists";   else echo "not found"; fi'
];

testCases.forEach((input, index) => {
  console.log(`\n--- Test Case ${index + 1} ---`);
  console.log('Input:', input);

  try {
    const ast = parse(input);
    const generated = generate(ast);
    console.log('Generated:', generated);

    // Test if it's valid bash
    const fs = require('fs');
    const testFile = `test-single-line-${index}.sh`;
    fs.writeFileSync(testFile, generated);

    const { execSync } = require('child_process');
    const result = execSync(`bash ${testFile}`, { encoding: 'utf8' });
    console.log('Bash execution result:', result.trim());

    // Clean up
    fs.unlinkSync(testFile);

  } catch (error) {
    console.log('Error:', error.message);
  }
});

console.log('\n=== Analysis ===');
console.log('Both versions work in bash, so we should match the input exactly!');