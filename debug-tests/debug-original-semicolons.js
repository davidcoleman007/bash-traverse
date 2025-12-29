const { parse, generate } = require('../dist/index.js');

const testCases = [
  {
    name: 'Function Definition',
    source: `function test() {
    echo "Hello"
    echo "World"
}`
  },
  {
    name: 'If Statement',
    source: `if [ -f file.txt ]; then
    echo "File exists"
    echo "Processing..."
fi`
  },
  {
    name: 'While Loop',
    source: `while [ $i -lt 10 ]; do
    echo "Count: $i"
    i=$((i + 1))
done`
  },
  {
    name: 'For Loop',
    source: `for item in a b c; do
    echo "Item: $item"
    echo "Processing..."
done`
  }
];

console.log('=== Original Semicolon Check ===\n');

testCases.forEach(testCase => {
  console.log(`--- ${testCase.name} ---`);
  console.log('Original source:');
  console.log(JSON.stringify(testCase.source));
  console.log('');

  // Check for semicolons in the original
  const semicolonCount = (testCase.source.match(/;/g) || []).length;
  console.log(`Semicolons in original: ${semicolonCount}`);

  if (semicolonCount > 0) {
    const semicolonPositions = [];
    for (let i = 0; i < testCase.source.length; i++) {
      if (testCase.source[i] === ';') {
        semicolonPositions.push(i);
      }
    }
    console.log(`Semicolon positions: ${semicolonPositions.join(', ')}`);
  }

  console.log('');
});