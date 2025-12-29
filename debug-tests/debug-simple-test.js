#!/usr/bin/env node

const { parse } = require('../dist');

/**
 * Simple debug script for standalone test expressions
 */

const testCases = [
  '[ -n "$VAR" ]',
  '[[ -n "$VAR" ]]'
];

function debugSimpleTest() {
  console.log('🔍 Debugging simple test expressions...\n');

  for (const testCase of testCases) {
    console.log(`Testing: "${testCase}"`);

    try {
      const ast = parse(testCase);
      console.log(`  ✅ Parse successful`);
      console.log(`  📊 AST type: ${ast.type}`);
      console.log(`  📊 Body length: ${ast.body.length}`);

      if (ast.body.length > 0) {
        const firstStatement = ast.body[0];
        console.log(`  📊 First statement type: ${firstStatement.type}`);

        if (firstStatement.type === 'TestExpression') {
          console.log(`  📊 Extended: ${firstStatement.extended}`);
          console.log(`  📊 Elements: ${firstStatement.elements.length}`);
        }
      }

      console.log('');

    } catch (error) {
      console.log(`  ❌ Parse failed: ${error.message}`);
      console.log('');
    }
  }
}

debugSimpleTest();