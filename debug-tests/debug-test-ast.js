#!/usr/bin/env node

const { parse, generate } = require('../dist');

/**
 * Debug script to examine AST structure of test expressions
 */

const testCases = [
  '[ "$VAR" = "value" ]',
  '[[ "$VAR" = "value" ]]',
  '[[ "$BUILD_TYPE" == "deploy-ephemeral" ]]'
];

function debugTestAST() {
  console.log('🔍 Debugging test expression AST structure...\n');

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
      }

      console.log('');

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      console.log('');
    }
  }
}

debugTestAST();