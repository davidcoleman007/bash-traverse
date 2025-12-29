const { parse, generate } = require('../dist');

console.log('Testing Explicit Structural Tokens...\n');

// Test 1: Simple if statement
console.log('=== Test 1: Simple If Statement ===');
const ifCode = 'if [ -f file.txt ]; then echo "exists"; fi';
console.log('Original:', ifCode);
try {
  const ast = parse(ifCode);
  console.log('✅ Parsed successfully');
  const generated = generate(ast);
  console.log('Generated:', generated);
  console.log('Round-trip:', generated === ifCode ? '✅ PERFECT' : '❌ DIFFERENT');
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}

console.log('\n=== Test 2: Simple While Loop ===');
const whileCode = 'while [ $i -lt 10 ]; do echo $i; i=$((i + 1)); done';
console.log('Original:', whileCode);
try {
  const ast = parse(whileCode);
  console.log('✅ Parsed successfully');
  const generated = generate(ast);
  console.log('Generated:', generated);
  console.log('Round-trip:', generated === whileCode ? '✅ PERFECT' : '❌ DIFFERENT');
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}

console.log('\n=== Test 3: Simple Case Statement ===');
const caseCode = 'case $var in start) echo "Starting";; stop) echo "Stopping";; esac';
console.log('Original:', caseCode);
try {
  const ast = parse(caseCode);
  console.log('✅ Parsed successfully');
  const generated = generate(ast);
  console.log('Generated:', generated);
  console.log('Round-trip:', generated === caseCode ? '✅ PERFECT' : '❌ DIFFERENT');
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}

console.log('\n=== Test 4: Brace Group ===');
const braceCode = '{ echo "hello"; echo "world"; }';
console.log('Original:', braceCode);
try {
  const ast = parse(braceCode);
  console.log('✅ Parsed successfully');
  const generated = generate(ast);
  console.log('Generated:', generated);
  console.log('Round-trip:', generated === braceCode ? '✅ PERFECT' : '❌ DIFFERENT');
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}