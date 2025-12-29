const { BashLexer } = require('../dist/lexer');

console.log('=== Debug Line Continuation Tokens ===\n');

// Test 1: Simple line continuation
console.log('1. Simple line continuation:');
const simpleScript = 'echo hello \\\n  world';
const simpleLexer = new BashLexer(simpleScript);
const simpleTokens = simpleLexer.tokenize();
console.log('Tokens:');
simpleTokens.forEach((token, index) => {
  console.log(`  ${index}: ${token.type} "${token.value}"`);
});
console.log();

// Test 2: Complex line continuation with quotes
console.log('2. Complex line continuation with quotes:');
const complexScript = 'echo "hello" \\\n  "world" \\\n  "test"';
const complexLexer = new BashLexer(complexScript);
const complexTokens = complexLexer.tokenize();
console.log('Tokens:');
complexTokens.forEach((token, index) => {
  console.log(`  ${index}: ${token.type} "${token.value}"`);
});
console.log();

// Test 3: Sed command with line continuations
console.log('3. Sed command with line continuations:');
const sedScript = 'sed -E \\\n  -e "s/old/new/" \\\n  -e "s/foo/bar/" \\\n  file.txt';
const sedLexer = new BashLexer(sedScript);
const sedTokens = sedLexer.tokenize();
console.log('Tokens:');
sedTokens.forEach((token, index) => {
  console.log(`  ${index}: ${token.type} "${token.value}"`);
});
console.log();

// Test 4: Pipeline with line continuations
console.log('4. Pipeline with line continuations:');
const pipelineScript = 'npx dc-test-runner \\\n  --client=dc-web \\\n  --env=stage \\\n  --grid=openstack3';
const pipelineLexer = new BashLexer(pipelineScript);
const pipelineTokens = pipelineLexer.tokenize();
console.log('Tokens:');
pipelineTokens.forEach((token, index) => {
  console.log(`  ${index}: ${token.type} "${token.value}"`);
});
console.log();

console.log('=== Debug Complete ===');