const { parse, generate } = require('bash-traverse');

console.log('=== Bash-Traverse Parsing Scenarios Test ===\n');

// Scenario 1: Multi-line script parsing
console.log('1. Multi-line script parsing:');
const multiLineScript = `npm install
npm test
npm run build`;

console.log('Input:');
console.log(multiLineScript);
console.log('\nAST:');
const ast1 = parse(multiLineScript);
console.log(JSON.stringify(ast1, null, 2));
console.log('\nRegenerated:');
console.log(generate(ast1));
console.log('\n' + '='.repeat(50) + '\n');

// Scenario 1b: Code Generation Formatting Issue
console.log('1b. Code Generation Formatting Issue:');
console.log('Problem: Multi-line input gets collapsed to single line');
console.log('Input (multi-line):');
console.log(multiLineScript);
console.log('\nRegenerated (should preserve formatting):');
console.log(generate(ast1));
console.log('\nExpected (should be multi-line):');
console.log('npm install\nnpm test\nnpm run build');
console.log('\n' + '='.repeat(50) + '\n');

// Scenario 2: Function definition syntax
console.log('2. Function definition syntax:');
const functionScript = `function test() {
    echo "hello"
}`;

console.log('Input:');
console.log(functionScript);
console.log('\nAST:');
const ast2 = parse(functionScript);
console.log(JSON.stringify(ast2, null, 2));
console.log('\nRegenerated:');
console.log(generate(ast2));
console.log('\n' + '='.repeat(50) + '\n');

// Scenario 3: Shebang and comments
console.log('3. Shebang and comments:');
const shebangScript = `#!/bin/bash
# This is a comment
npm install`;

console.log('Input:');
console.log(shebangScript);
console.log('\nAST:');
const ast3 = parse(shebangScript);
console.log(JSON.stringify(ast3, null, 2));
console.log('\nRegenerated:');
console.log(generate(ast3));
console.log('\n' + '='.repeat(50) + '\n');

// Scenario 4: Pipeline and compound commands
console.log('4. Pipeline and compound commands:');
const pipelineScript = `npm install | grep "success"
npm install && npm test`;

console.log('Input:');
console.log(pipelineScript);
console.log('\nAST:');
const ast4 = parse(pipelineScript);
console.log(JSON.stringify(ast4, null, 2));
console.log('\nRegenerated:');
console.log(generate(ast4));
console.log('\n' + '='.repeat(50) + '\n');

// Scenario 5: Complex bash constructs
console.log('5. Complex bash constructs:');
const complexScript = `NODE_ENV=production npm run build
echo "Installing $(npm list --depth=0)"`;

console.log('Input:');
console.log(complexScript);
console.log('\nAST:');
const ast5 = parse(complexScript);
console.log(JSON.stringify(ast5, null, 2));
console.log('\nRegenerated:');
console.log(generate(ast5));