#!/usr/bin/env node

const { parse, generate } = require('../dist');

/**
 * Debug script to trace parser steps for the for loop
 */

const testCase = 'for i in 1 2 3; do echo $i; done';

function debugParserSteps() {
  console.log('🔍 Debugging parser steps for for loop...\n');
  console.log(`Testing: "${testCase}"`);

  try {
    // Let's manually trace what should happen
    console.log('  📊 Expected parser flow:');
    console.log('    1. Parse "for" keyword');
    console.log('    2. Parse variable "i"');
    console.log('    3. Parse "in" keyword');
    console.log('    4. Parse wordlist ["1", "2", "3"]');
    console.log('    5. Parse semicolon ";"');
    console.log('    6. Parse "do" keyword');
    console.log('    7. Parse body:');
    console.log('       - Space');
    console.log('       - Command "echo $i"');
    console.log('       - Semicolon ";"');
    console.log('       - Space');
    console.log('    8. Parse "done" keyword');

    const ast = parse(testCase);
    const firstStatement = ast.body[0];

    console.log('\n  📊 Actual AST:');
    console.log(`    Type: ${firstStatement.type}`);
    console.log(`    Variable: ${firstStatement.variable.text}`);
    console.log(`    Wordlist: ${firstStatement.wordlist?.map(w => w.text).join(', ')}`);
    console.log(`    Body length: ${firstStatement.body.length}`);

    console.log('\n  📊 Body contents:');
    firstStatement.body.forEach((stmt, index) => {
      console.log(`    ${index}: ${stmt.type}`);
      if (stmt.type === 'Command') {
        console.log(`      Command: ${stmt.name.text} ${stmt.arguments.map(arg => arg.text).join(' ')}`);
      } else if (stmt.type === 'Space') {
        console.log(`      Space: "${stmt.value}"`);
      } else if (stmt.type === 'Semicolon') {
        console.log(`      Semicolon: ";"`);
      }
    });

    const generated = generate(ast);
    console.log(`\n  📊 Generated: "${generated}"`);
    console.log(`  📊 Match: ${testCase === generated ? '✅ YES' : '❌ NO'}`);

  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
}

debugParserSteps();