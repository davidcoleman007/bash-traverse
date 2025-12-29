const { parse, generate } = require('../dist/index.js');

const testCases = [
  {
    name: 'Function Definition',
    source: `function test() {
    echo "Hello"
    echo "World"
}`,
  },
  {
    name: 'If Statement',
    source: `if [ -f file.txt ]; then
    echo "File exists"
    echo "Processing..."
fi`,
  },
  {
    name: 'While Loop',
    source: `while [ $i -lt 10 ]; do
    echo "Count: $i"
    i=$((i + 1))
done`,
  },
  {
    name: 'For Loop',
    source: `for item in a b c; do
    echo "Item: $item"
    echo "Processing..."
done`,
  },
  {
    name: 'Brace Group',
    source: `{
    echo "Starting"
    echo "Processing"
    echo "Done"
}`,
  },
  {
    name: 'Case Statement (Reference)',
    source: `case $var in
    start)
        echo "Starting"
        ;;
    stop)
        echo "Stopping"
        ;;
esac`,
  }
];

console.log('=== Multi-line Constructs Debug ===\n');

function normalize(str) {
  return str.replace(/\s+/g, ' ').trim();
}

let totalTests = 0;
let passedTests = 0;

for (const testCase of testCases) {
  totalTests++;
  console.log(`\n--- Testing ${testCase.name} ---`);

  try {
    // Parse
    const ast = parse(testCase.source);
    console.log('✅ Parsed successfully');

    // Generate
    const generated = generate(ast);
    console.log('✅ Generated successfully');

    // Compare
    const normalizedOriginal = normalize(testCase.source);
    const normalizedGenerated = normalize(generated);

    if (normalizedOriginal === normalizedGenerated) {
      console.log('✅ Structural round-trip successful');
      passedTests++;
    } else {
      console.log('❌ Structural round-trip failed');
      console.log('Original (normalized):', JSON.stringify(normalizedOriginal));
      console.log('Generated (normalized):', JSON.stringify(normalizedGenerated));
    }

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

console.log(`\n=== Summary ===`);
console.log(`Passed: ${passedTests}/${totalTests}`);
console.log(`Failed: ${totalTests - passedTests}/${totalTests}`);