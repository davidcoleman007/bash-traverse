#!/usr/bin/env node

const { parse, generate } = require('../dist');

/**
 * Debug script to trace semicolon parsing step by step
 */

const testCase = 'for i in 1 2 3; do echo $i; done';

function debugSemicolonParsing() {
  console.log('🔍 Debugging semicolon parsing step by step...\n');
  console.log(`Testing: "${testCase}"`);

  try {
    const ast = parse(testCase);
    const firstStatement = ast.body[0];

    console.log(`  📊 Statement type: ${firstStatement.type}`);

    if (firstStatement.type === 'ForStatement') {
      console.log(`  📊 Variable: ${firstStatement.variable.text}`);
      console.log(`  📊 Wordlist: ${firstStatement.wordlist?.length || 0} items`);
      console.log(`  📊 Body length: ${firstStatement.body.length}`);

      console.log('  📊 Body statements:');
      firstStatement.body.forEach((stmt, index) => {
        console.log(`    ${index}: ${stmt.type} = ${JSON.stringify(stmt)}`);
      });

      // Check if there are any semicolon statements in the body
      const semicolonStatements = firstStatement.body.filter(stmt => stmt.type === 'Semicolon');
      console.log(`  📊 Semicolon statements in body: ${semicolonStatements.length}`);
    }

    const generated = generate(ast);
    console.log(`  📊 Generated: "${generated}"`);
    console.log(`  📊 Match: ${testCase === generated ? '✅ YES' : '❌ NO'}`);

    if (testCase !== generated) {
      console.log('  🔍 Character-by-character comparison:');
      const maxLength = Math.max(testCase.length, generated.length);
      for (let i = 0; i < maxLength; i++) {
        const origChar = i < testCase.length ? testCase[i] : '[MISSING]';
        const genChar = i < generated.length ? generated[i] : '[MISSING]';
        if (origChar !== genChar) {
          console.log(`    Position ${i}: '${origChar}' vs '${genChar}'`);
        }
      }
    }

  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
}

debugSemicolonParsing();