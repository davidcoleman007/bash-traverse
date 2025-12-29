const { parse, generate } = require('../dist');

console.log('=== Spacing Analysis ===\n');

// Test 1: If Statement
console.log('=== Test 1: If Statement ===');
const ifCode = 'if [ -f file.txt ]; then echo "exists"; fi';
console.log('Original:', ifCode);

const { BashLexer } = require('../dist');
const ifLexer = new BashLexer(ifCode);
const ifTokens = ifLexer.tokenize();
console.log('Tokens:');
ifTokens.forEach((token, index) => {
  console.log(`  ${index}: ${token.type} = "${token.value}"`);
});

try {
  const ifAst = parse(ifCode);
  const ifGenerated = generate(ifAst);
  console.log('Generated:', ifGenerated);
  console.log('Missing spaces:');
  console.log('  - After "if":', ifCode.includes('if [') ? '✅' : '❌', 'vs', ifGenerated.includes('if [') ? '✅' : '❌');
  console.log('  - Before "]":', ifCode.includes('] ') ? '✅' : '❌', 'vs', ifGenerated.includes('] ') ? '✅' : '❌');
} catch (error) {
  console.log('❌ Error:', error.message);
}

console.log('\n=== Test 2: While Loop ===');
const whileCode = 'while [ $i -lt 10 ]; do echo $i; done';
console.log('Original:', whileCode);

const whileLexer = new BashLexer(whileCode);
const whileTokens = whileLexer.tokenize();
console.log('Tokens:');
whileTokens.forEach((token, index) => {
  console.log(`  ${index}: ${token.type} = "${token.value}"`);
});

try {
  const whileAst = parse(whileCode);
  const whileGenerated = generate(whileAst);
  console.log('Generated:', whileGenerated);
  console.log('Missing spaces:');
  console.log('  - After "while":', whileCode.includes('while [') ? '✅' : '❌', 'vs', whileGenerated.includes('while [') ? '✅' : '❌');
  console.log('  - Before "]":', whileCode.includes('] ') ? '✅' : '❌', 'vs', whileGenerated.includes('] ') ? '✅' : '❌');
  console.log('  - Before "done":', whileCode.includes(' done') ? '✅' : '❌', 'vs', whileGenerated.includes(' done') ? '✅' : '❌');
} catch (error) {
  console.log('❌ Error:', error.message);
}