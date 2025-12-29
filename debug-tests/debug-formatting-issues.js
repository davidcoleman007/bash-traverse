const { parse, generate } = require('../dist');

console.log('=== Formatting Issues Debug ===\n');

const testCases = [
  // Test expression spacing
  'if [ -f file.txt ]; then echo "exists"; fi',

  // Variable assignment preservation
  'NODE_ENV=production npm run build',

  // Function formatting (should preserve newlines)
  `function test() {
    echo "hello"
    echo "world"
}`,

  // Case statement formatting
  `case $var in
    start)
        echo "Starting"
        ;;
    stop)
        echo "Stopping"
        ;;
esac`,

  // While loop with arithmetic
  'while [ $i -lt 10 ]; do echo "test"; i=$((i + 1)); done'
];

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: "${testCase}"`);
  console.log('---');

  try {
    const ast = parse(testCase);
    console.log('✅ Parsed successfully');

    const generated = generate(ast);
    console.log(`Generated: "${generated}"`);

    // Check for specific issues
    if (generated.includes('[ -f ]') && testCase.includes('[ -f file.txt ]')) {
      console.log('❌ ISSUE: Test expression missing filename!');
    }

    if (testCase.includes('NODE_ENV=') && !generated.includes('NODE_ENV=')) {
      console.log('❌ ISSUE: Variable assignment lost during generation!');
    }

    if (testCase.includes('function') && testCase.includes('\n') && !generated.includes('\n')) {
      console.log('❌ ISSUE: Function formatting collapsed to single line!');
    }

    // Round-trip test
    try {
      const roundTripAst = parse(generated);
      const roundTripGenerated = generate(roundTripAst);

      if (generated === roundTripGenerated) {
        console.log('✅ Round-trip successful');
      } else {
        console.log('❌ Round-trip failed - generated code changed');
        console.log(`Round-trip: "${roundTripGenerated}"`);
      }
    } catch (roundTripError) {
      console.log('❌ Round-trip failed - generated code cannot be parsed');
      console.log(`Error: ${roundTripError.message}`);
    }

  } catch (error) {
    console.log(`❌ Parse failed: ${error.message}`);
  }

  console.log('\n');
});