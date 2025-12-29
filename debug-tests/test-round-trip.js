const { parse, generate } = require('../dist/index.js');
const fs = require('fs');

console.log('=== Round-Trip Testing ===\n');

function testRoundTrip(name, input, expectedOutput = null) {
  console.log(`\n--- ${name} ---`);
  console.log('Input:');
  console.log(input);

  try {
    // Parse the input
    const ast = parse(input);
    console.log('\n✅ Parse successful');

    // Generate code from AST
    const generated = generate(ast);
    console.log('\nGenerated:');
    console.log(generated);

    // Parse the generated code
    const roundTripAst = parse(generated);
    console.log('\n✅ Round-trip parse successful');

    // Generate again from round-trip AST
    const roundTripGenerated = generate(roundTripAst);
    console.log('\nRound-trip generated:');
    console.log(roundTripGenerated);

    // Compare outputs
    if (generated === roundTripGenerated) {
      console.log('\n✅ Round-trip fidelity: PERFECT');
    } else {
      console.log('\n❌ Round-trip fidelity: FAILED');
      console.log('First generation:', generated);
      console.log('Round-trip generation:', roundTripGenerated);
    }

    if (expectedOutput && generated !== expectedOutput) {
      console.log('\n⚠️  Generation differs from expected output');
      console.log('Expected:', expectedOutput);
      console.log('Got:', generated);
    }

  } catch (error) {
    console.log('\n❌ Failed:', error.message);
    console.log('Error stack:', error.stack);
  }
}

// Test 1: Simple echo command
testRoundTrip('Simple Echo', 'echo "hello world"');

// Test 2: Variable assignment
testRoundTrip('Variable Assignment', 'NAME="John Doe"');

// Test 3: Variable expansion
testRoundTrip('Variable Expansion', 'echo "Hello $NAME"');

// Test 4: Simple if statement
testRoundTrip('Simple If Statement',
`if [ -f file.txt ]; then
    echo "file exists"
fi`);

// Test 5: If-else statement
testRoundTrip('If-Else Statement',
`if [ -f file.txt ]; then
    echo "file exists"
else
    echo "file not found"
fi`);

// Test 6: For loop
testRoundTrip('For Loop',
`for i in 1 2 3; do
    echo "Number: $i"
done`);

// Test 7: While loop
testRoundTrip('While Loop',
`while [ $i -lt 10 ]; do
    echo "Count: $i"
    i=$((i + 1))
done`);

// Test 8: Case statement
testRoundTrip('Case Statement',
`case $1 in
    start)
        echo "Starting..."
        ;;
    stop)
        echo "Stopping..."
        ;;
    *)
        echo "Unknown command"
        ;;
esac`);

// Test 9: Function definition
testRoundTrip('Function Definition',
`function build() {
    echo "Building project..."
    npm run build
}`);

// Test 10: Pipeline
testRoundTrip('Pipeline',
`npm install && npm test || echo "Tests failed"`);

// Test 11: Brace group
testRoundTrip('Brace Group',
`{
    echo "Starting group"
    npm install
    echo "Group complete"
}`);

// Test 12: Comments and shebang
testRoundTrip('Comments and Shebang',
`#!/bin/bash
# Build and test script
echo "Hello world"`);

// Test 13: Complex variable assignments
testRoundTrip('Complex Variable Assignments',
`NODE_ENV=production npm install && npm test`);

// Test 14: Nested control structures
testRoundTrip('Nested Control Structures',
`if [ -d "src" ]; then
    for file in src/*.js; do
        if [ -f "$file" ]; then
            echo "Processing $file"
        fi
    done
fi`);

// Test 15: Test expressions with operators
testRoundTrip('Test Expressions',
`if [ -f file.txt -a -r file.txt ]; then
    echo "File exists and is readable"
fi`);

// Test 16: Arithmetic expansion
testRoundTrip('Arithmetic Expansion',
`i=$((i + 1))
result=$((a * b + c))`);

// Test 17: Command substitution
testRoundTrip('Command Substitution',
`version=$(node --version)
files=$(ls *.js)`);

// Test 18: Here documents
testRoundTrip('Here Document',
`cat << EOF
Hello World
This is a here document
EOF`);

// Test 19: Multiple statements with separators
testRoundTrip('Multiple Statements',
`echo "First"; echo "Second"
echo "Third" && echo "Fourth"`);

// Test 20: Complex case statement
testRoundTrip('Complex Case Statement',
`case $1 in
    start|begin)
        echo "Starting..."
        ;;
    stop|end)
        echo "Stopping..."
        ;;
    restart)
        echo "Restarting..."
        ;;
    *)
        echo "Unknown command: $1"
        exit 1
        ;;
esac`);

console.log('\n=== Round-Trip Testing Complete ===');