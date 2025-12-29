const { parse, generate } = require('../dist/index.js');

console.log('=== Test Expression Testing ===\n');
console.log('This test covers all test expression scenarios we debugged\n');

function testExpression(name, input, expectedOutput = null) {
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

    // Test if it's valid bash
    const fs = require('fs');
    const testFile = `test-expression-${Date.now()}.sh`;
    fs.writeFileSync(testFile, generated);

    const { execSync } = require('child_process');
    const result = execSync(`bash ${testFile}`, { encoding: 'utf8' });
    console.log('\nBash execution result:', result.trim());

    // Clean up
    fs.unlinkSync(testFile);

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
    return false;
  }
}

// Track results
const results = [];

// ===== POSIX TEST EXPRESSIONS =====
console.log('\n' + '='.repeat(60));
console.log('POSIX TEST EXPRESSIONS');
console.log('='.repeat(60));

results.push(testExpression('Simple File Test',
`if [ -f file.txt ]; then
    echo "file exists"
fi`));

results.push(testExpression('File and Readable Test',
`if [ -f file.txt -a -r file.txt ]; then
    echo "File exists and is readable"
fi`));

results.push(testExpression('String Comparison',
`if [ "$name" = "test" ]; then
    echo "name is test"
fi`));

results.push(testExpression('Numeric Comparison',
`if [ $count -gt 10 ]; then
    echo "count is greater than 10"
fi`));

results.push(testExpression('Complex POSIX Test',
`if [ -f file.txt -a -r file.txt -a "$user" = "admin" ]; then
    echo "All conditions met"
fi`));

// ===== EXTENDED TEST EXPRESSIONS =====
console.log('\n' + '='.repeat(60));
console.log('EXTENDED TEST EXPRESSIONS');
console.log('='.repeat(60));

results.push(testExpression('Simple Extended Test',
`if [[ -f file.txt ]]; then
    echo "file exists"
fi`));

results.push(testExpression('Extended Test with AND',
`if [[ -f file.txt && -r file.txt ]]; then
    echo "File exists and is readable"
fi`));

results.push(testExpression('Extended Test with OR',
`if [[ -f file.txt || -d directory ]]; then
    echo "Either file exists or directory exists"
fi`));

results.push(testExpression('Extended String Comparison',
`if [[ "$name" == "test" ]]; then
    echo "name is test"
fi`));

results.push(testExpression('Extended Pattern Matching',
`if [[ "$file" =~ \\.txt$ ]]; then
    echo "file ends with .txt"
fi`));

results.push(testExpression('Complex Extended Test',
`if [[ -f file.txt && -r file.txt && "$user" == "admin" ]]; then
    echo "All conditions met"
fi`));

// ===== TEST EXPRESSION EDGE CASES =====
console.log('\n' + '='.repeat(60));
console.log('TEST EXPRESSION EDGE CASES');
console.log('='.repeat(60));

results.push(testExpression('Negated Test',
`if [ ! -f file.txt ]; then
    echo "file does not exist"
fi`));

results.push(testExpression('Extended Negated Test',
`if [[ ! -f file.txt ]]; then
    echo "file does not exist"
fi`));

results.push(testExpression('Test with Variable Expansion',
`if [ -f "$filename" ]; then
    echo "file exists"
fi`));

results.push(testExpression('Test with Command Substitution',
`if [ -f "$(echo file.txt)" ]; then
    echo "file exists"
fi`));

results.push(testExpression('Empty Test',
`if [ ]; then
    echo "empty test"
fi`));

// ===== NESTED TEST EXPRESSIONS =====
console.log('\n' + '='.repeat(60));
console.log('NESTED TEST EXPRESSIONS');
console.log('='.repeat(60));

results.push(testExpression('Nested POSIX Tests',
`if [ -d "src" ] && [ -f "src/main.js" ]; then
    echo "src directory and main.js exist"
fi`));

results.push(testExpression('Nested Extended Tests',
`if [[ -d "src" ]] && [[ -f "src/main.js" ]]; then
    echo "src directory and main.js exist"
fi`));

results.push(testExpression('Mixed Test Types',
`if [ -d "src" ] && [[ -f "src/main.js" ]]; then
    echo "mixed test types"
fi`));

// ===== SUMMARY =====
console.log('\n' + '='.repeat(60));
console.log('TEST EXPRESSION SUMMARY');
console.log('='.repeat(60));

const passed = results.filter(r => r === true).length;
const total = results.length;

console.log(`\n🎯 Results: ${passed}/${total} test expression tests passed`);
console.log(`📊 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

if (passed === total) {
  console.log('\n🎉 ALL TEST EXPRESSION TESTS PASSED! Test expression handling is perfect!');
} else {
  console.log('\n⚠️  Some test expression tests failed. Please review the output above.');
}

console.log('\n=== Test Expression Testing Complete ===');