const { parse, generate } = require('../dist');

console.log('🔍 Debugging build.sh specific issue...\n');

// Test the problematic line specifically
const testLine = 'if [[ "$BUILD_TYPE" == "build" && -d dist-test ]]; then echo "test"; fi';

console.log('Testing line:', testLine);
console.log('==================================================');

// Parse the line
const ast = parse(testLine);
console.log('AST:');
console.log(JSON.stringify(ast, null, 2));

console.log('\n==================================================');

// Generate from AST
const generated = generate(ast);
console.log('Generated:');
console.log(generated);

console.log('\n==================================================');
console.log('Match:', testLine === generated ? '✅ YES' : '❌ NO');
if (testLine !== generated) {
    console.log('Original:', JSON.stringify(testLine));
    console.log('Generated:', JSON.stringify(generated));
}