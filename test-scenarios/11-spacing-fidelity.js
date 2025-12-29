const { parse, generate } = require('../dist/index.js');

console.log('=== Spacing Fidelity Testing ===\n');
console.log('This test specifically validates the spacing fixes we implemented\n');

function testSpacingFidelity(name, input, expectedOutput = null) {
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

    // Compare with expected output if provided
    if (expectedOutput) {
      if (generated === expectedOutput) {
        console.log('\n✅ Generation matches expected output');
      } else {
        console.log('\n❌ Generation differs from expected output');
        console.log('Expected:', expectedOutput);
        console.log('Got:', generated);

        // Show character-by-character difference
        const minLength = Math.min(generated.length, expectedOutput.length);
        for (let i = 0; i < minLength; i++) {
          if (generated[i] !== expectedOutput[i]) {
            console.log(`First difference at position ${i}: '${generated[i]}' (${generated.charCodeAt(i)}) vs '${expectedOutput[i]}' (${expectedOutput.charCodeAt(i)})`);
            break;
          }
        }
      }
    }

    // Test round-trip fidelity
    const roundTripAst = parse(generated);
    const roundTripGenerated = generate(roundTripAst);

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

// ===== FUNCTION SPACING TESTS =====
console.log('\n' + '='.repeat(60));
console.log('FUNCTION SPACING TESTS');
console.log('='.repeat(60));

results.push(testSpacingFidelity('Function Definition - Space After Function',
`function build() {
    echo "Building project..."
    npm run build
}`));

results.push(testSpacingFidelity('Function Definition - No Parens',
`function build {
    echo "Building project..."
    npm run build
}`));

// ===== CONTROL STRUCTURE SPACING TESTS =====
console.log('\n' + '='.repeat(60));
console.log('CONTROL STRUCTURE SPACING TESTS');
console.log('='.repeat(60));

results.push(testSpacingFidelity('If Statement - Multi-line',
`if [ -f file.txt ]; then
    echo "file exists"
fi`));

results.push(testSpacingFidelity('If-Else Statement - Multi-line',
`if [ -f file.txt ]; then
    echo "file exists"
else
    echo "file not found"
fi`));

results.push(testSpacingFidelity('If Statement - Single-line',
`if [ -f file.txt ]; then echo "exists"; else echo "not found"; fi`));

results.push(testSpacingFidelity('For Loop - Multi-line',
`for i in 1 2 3; do
    echo "Number: $i"
done`));

results.push(testSpacingFidelity('For Loop - Single-line',
`for i in 1 2 3; do echo $i; done`));

results.push(testSpacingFidelity('While Loop - Multi-line',
`while [ $i -lt 10 ]; do
    echo "Count: $i"
    i=$((i + 1))
done`));

results.push(testSpacingFidelity('Case Statement - Multi-line',
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

// ===== TEST EXPRESSION SPACING TESTS =====
console.log('\n' + '='.repeat(60));
console.log('TEST EXPRESSION SPACING TESTS');
console.log('='.repeat(60));

results.push(testSpacingFidelity('Test Expression - POSIX',
`if [ -f file.txt -a -r file.txt ]; then
    echo "File exists and is readable"
fi`));

results.push(testSpacingFidelity('Test Expression - Extended',
`if [[ -f file.txt && -r file.txt ]]; then
    echo "File exists and is readable"
fi`));

// ===== PIPELINE SPACING TESTS =====
console.log('\n' + '='.repeat(60));
console.log('PIPELINE SPACING TESTS');
console.log('='.repeat(60));

results.push(testSpacingFidelity('Pipeline - Simple',
`npm install && npm test`));

results.push(testSpacingFidelity('Pipeline - Complex',
`npm install && npm test || echo "Tests failed"`));

results.push(testSpacingFidelity('Variable Assignment Prefix',
`NODE_ENV=production npm install && npm test`));

// ===== BRACE GROUP SPACING TESTS =====
console.log('\n' + '='.repeat(60));
console.log('BRACE GROUP SPACING TESTS');
console.log('='.repeat(60));

results.push(testSpacingFidelity('Brace Group - Multi-line',
`{
    echo "Starting group"
    npm install
    echo "Group complete"
}`));

results.push(testSpacingFidelity('Brace Group - Empty',
`{
}`));

// ===== EDGE CASE SPACING TESTS =====
console.log('\n' + '='.repeat(60));
console.log('EDGE CASE SPACING TESTS');
console.log('='.repeat(60));

results.push(testSpacingFidelity('Empty Function',
`function empty() {
}`));

results.push(testSpacingFidelity('Function with Comments',
`function build() {
    # Build the project
    echo "Building..."
    npm run build
}`));

results.push(testSpacingFidelity('Nested Structures',
`if [ -d "src" ]; then
    for file in src/*.js; do
        if [ -f "$file" ]; then
            echo "Processing $file"
        fi
    done
fi`));

// ===== SUMMARY =====
console.log('\n' + '='.repeat(60));
console.log('SPACING FIDELITY SUMMARY');
console.log('='.repeat(60));

const passed = results.filter(r => r === true).length;
const total = results.length;

console.log(`\n🎯 Results: ${passed}/${total} spacing tests passed`);
console.log(`📊 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

if (passed === total) {
  console.log('\n🎉 ALL SPACING TESTS PASSED! Spacing fidelity is perfect!');
} else {
  console.log('\n⚠️  Some spacing tests failed. Please review the output above.');
}

console.log('\n=== Spacing Fidelity Testing Complete ===');