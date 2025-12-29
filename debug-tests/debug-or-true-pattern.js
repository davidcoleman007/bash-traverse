const { parse, generate } = require('../dist/index.js');

console.log('=== || true Pattern Debug ===\n');

const testCases = [
  'version_found=`npm view $package_name versions | grep "$package_version"` || true',
  'result=`command` || true',
  'output=$(command) || true',
  'data=`echo "test"` || true',
  'if [ -z "$version_found" ]; then echo "empty"; fi'
];

testCases.forEach((input, index) => {
  console.log(`\n--- Test Case ${index + 1} ---`);
  console.log('Input:', input);

  try {
    const ast = parse(input);
    const generated = generate(ast);
    console.log('Generated:', generated);

    if (input === generated) {
      console.log('✅ PERFECT MATCH');
    } else {
      console.log('❌ MISMATCH');
      console.log('Original length:', input.length);
      console.log('Generated length:', generated.length);

      // Find first difference
      const minLength = Math.min(input.length, generated.length);
      for (let i = 0; i < minLength; i++) {
        if (input[i] !== generated[i]) {
          console.log(`First difference at position ${i}:`);
          console.log(`  Original: "${input[i]}" (${input.charCodeAt(i)})`);
          console.log(`  Generated: "${generated[i]}" (${generated.charCodeAt(i)})`);
          console.log(`  Context: "${input.substring(Math.max(0, i-10), i+10)}"`);
          break;
        }
      }
    }

  } catch (error) {
    console.log('❌ Parse error:', error.message);
  }
});

console.log('\n=== Debug Complete ===');