#!/usr/bin/env node

const { parse, generate } = require('../dist');

/**
 * Debug script for remaining complex test expression cases
 */

const testCases = [
  '[[ "$auth" =~ email\\ *=\\ *([[:graph:]]*) ]]',
  '[[ "$BUILD_TYPE" == "build" || "$BUILD_TYPE" == "deploy-ephemeral" ]]'
];

function debugComplexCases() {
  console.log('🔍 Debugging complex test expression cases...\n');

  for (const testCase of testCases) {
    console.log(`Testing: "${testCase}"`);

    try {
      const ast = parse(testCase);
      const firstStatement = ast.body[0];

      console.log(`  📊 AST type: ${ast.type}`);
      console.log(`  📊 First statement type: ${firstStatement.type}`);

      if (firstStatement.type === 'TestExpression') {
        console.log(`  📊 Extended: ${firstStatement.extended}`);
        console.log(`  📊 Elements count: ${firstStatement.elements.length}`);

        console.log('  📊 Elements:');
        firstStatement.elements.forEach((element, index) => {
          console.log(`    ${index}: isOperator=${element.isOperator}`);
          if (element.isOperator && element.operator) {
            console.log(`      Operator: ${element.operator.text}`);
          }
          if (!element.isOperator && element.argument) {
            console.log(`      Argument: ${element.argument.text}`);
          }
        });

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
      }

      console.log('');

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      console.log('');
    }
  }
}

debugComplexCases();