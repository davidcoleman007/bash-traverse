const { parse, generate } = require('../dist/index.js');

console.log('=== Comprehensive Round-Trip Testing ===\n');
console.log('This test covers all the scenarios we fixed during development\n');

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
      return true;
    } else {
      console.log('\n❌ Round-trip fidelity: FAILED');
      console.log('First generation:', generated);
      console.log('Round-trip generation:', roundTripGenerated);
      return false;
    }

  } catch (error) {
    console.log('\n❌ Failed:', error.message);
    console.log('Error stack:', error.stack);
    return false;
  }
}

// Track results
const results = [];

// ===== BASIC PARSING =====
console.log('\n' + '='.repeat(60));
console.log('BASIC PARSING TESTS');
console.log('='.repeat(60));

results.push(testRoundTrip('Simple Echo', 'echo "hello world"'));
results.push(testRoundTrip('Variable Assignment', 'NAME="John Doe"'));
results.push(testRoundTrip('Variable Expansion', 'echo $HOME ${USER:-default} $((2 + 2))'));

// ===== CONTROL STRUCTURES =====
console.log('\n' + '='.repeat(60));
console.log('CONTROL STRUCTURES TESTS');
console.log('='.repeat(60));

results.push(testRoundTrip('Simple If Statement',
`if [ -f file.txt ]; then
    echo "file exists"
fi`));

results.push(testRoundTrip('If-Else Statement',
`if [ -f file.txt ]; then
    echo "file exists"
else
    echo "file not found"
fi`));

results.push(testRoundTrip('For Loop',
`for i in 1 2 3; do
    echo "Number: $i"
done`));

results.push(testRoundTrip('While Loop',
`while [ $i -lt 10 ]; do
    echo "Count: $i"
    i=$((i + 1))
done`));

results.push(testRoundTrip('Case Statement',
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
esac`));

results.push(testRoundTrip('Brace Group',
`{
    echo "Starting group"
    npm install
    echo "Group complete"
}`));

// ===== FUNCTION DEFINITIONS =====
console.log('\n' + '='.repeat(60));
console.log('FUNCTION DEFINITION TESTS');
console.log('='.repeat(60));

results.push(testRoundTrip('Function Definition',
`function build() {
    echo "Building project..."
    npm run build
}`));

results.push(testRoundTrip('Function Definition - No Parens',
`function build {
    echo "Building project..."
    npm run build
}`));

// ===== PIPELINES AND COMPOUND COMMANDS =====
console.log('\n' + '='.repeat(60));
console.log('PIPELINE AND COMPOUND COMMAND TESTS');
console.log('='.repeat(60));

results.push(testRoundTrip('Pipeline',
`npm install && npm test || echo "Tests failed"`));

results.push(testRoundTrip('Complex Variable Assignments',
`NODE_ENV=production npm install && npm test`));

results.push(testRoundTrip('Multiple Statements',
`echo "First"; echo "Second"
echo "Third" && echo "Fourth"`));

// ===== TEST EXPRESSIONS =====
console.log('\n' + '='.repeat(60));
console.log('TEST EXPRESSION TESTS');
console.log('='.repeat(60));

results.push(testRoundTrip('Test Expressions',
`if [ -f file.txt -a -r file.txt ]; then
    echo "File exists and is readable"
fi`));

results.push(testRoundTrip('Extended Test Expressions',
`if [[ -f file.txt && -r file.txt ]]; then
    echo "File exists and is readable"
fi`));

// ===== EXPANSIONS =====
console.log('\n' + '='.repeat(60));
console.log('EXPANSION TESTS');
console.log('='.repeat(60));

results.push(testRoundTrip('Arithmetic Expansion',
`i=$((i + 1))
result=$((a * b + c))`));

results.push(testRoundTrip('Command Substitution',
`version=$(node --version)
files=$(ls *.js)`));

results.push(testRoundTrip('Variable Expansion', 'echo $HOME ${USER:-default} $((2 + 2))'));

// ===== HERE DOCUMENTS =====
console.log('\n' + '='.repeat(60));
console.log('HERE DOCUMENT TESTS');
console.log('='.repeat(60));

results.push(testRoundTrip('Here Document',
`cat << EOF
Hello World
This is a here document
EOF`));

results.push(testRoundTrip('Here Document with Variable',
`cat << EOF
Hello $USER
Current directory: $PWD
EOF`));

// ===== COMMENTS AND SHEBANG =====
console.log('\n' + '='.repeat(60));
console.log('COMMENTS AND SHEBANG TESTS');
console.log('='.repeat(60));

results.push(testRoundTrip('Comments and Shebang',
`#!/bin/bash
# Build and test script
echo "Hello world"`));

results.push(testRoundTrip('Inline Comments',
`echo "Hello" # This is a comment
echo "World"`));

// ===== NESTED STRUCTURES =====
console.log('\n' + '='.repeat(60));
console.log('NESTED STRUCTURE TESTS');
console.log('='.repeat(60));

results.push(testRoundTrip('Nested Control Structures',
`if [ -d "src" ]; then
    for file in src/*.js; do
        if [ -f "$file" ]; then
            echo "Processing $file"
        fi
    done
fi`));

results.push(testRoundTrip('Complex Case Statement',
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
esac`));

// ===== EDGE CASES =====
console.log('\n' + '='.repeat(60));
console.log('EDGE CASE TESTS');
console.log('='.repeat(60));

results.push(testRoundTrip('Empty Function',
`function empty() {
}`));

results.push(testRoundTrip('Single Line If',
`if [ -f file.txt ]; then echo "exists"; fi`));

results.push(testRoundTrip('Single Line For',
`for i in 1 2 3; do echo $i; done`));

results.push(testRoundTrip('Empty Brace Group',
`{
}`));

// ===== SUMMARY =====
console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));

const passed = results.filter(r => r === true).length;
const total = results.length;

console.log(`\n🎯 Results: ${passed}/${total} tests passed`);
console.log(`📊 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

if (passed === total) {
  console.log('\n🎉 ALL TESTS PASSED! bash-traverse is ready for production!');
} else {
  console.log('\n⚠️  Some tests failed. Please review the output above.');
}

console.log('\n=== Comprehensive Round-Trip Testing Complete ===');