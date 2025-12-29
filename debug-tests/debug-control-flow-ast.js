#!/usr/bin/env node

const { parse, generate } = require('../dist');

/**
 * Debug script to examine control flow AST structure
 */

const testCases = [
  'if [[ "$var" =~ pattern ]]; then echo "match"; fi',
  'for i in 1 2 3; do echo $i; done'
];

function debugControlFlowAST() {
  console.log('🔍 Debugging control flow AST structure...\n');

  for (const testCase of testCases) {
    console.log(`Testing: "${testCase}"`);

    try {
      const ast = parse(testCase);
      const firstStatement = ast.body[0];

      console.log(`  📊 Statement type: ${firstStatement.type}`);

      if (firstStatement.type === 'IfStatement') {
        console.log(`  📊 Condition: ${firstStatement.condition.type}`);
        console.log(`  📊 Then body length: ${firstStatement.thenBody.length}`);
        console.log(`  📊 Elif clauses: ${firstStatement.elifClauses.length}`);
        console.log(`  📊 Has else: ${!!firstStatement.elseBody}`);

        // Check if there are any semicolon statements in the body
        const semicolonStatements = firstStatement.thenBody.filter(stmt => stmt.type === 'Semicolon');
        console.log(`  📊 Semicolon statements in body: ${semicolonStatements.length}`);
      } else if (firstStatement.type === 'ForStatement') {
        console.log(`  📊 Variable: ${firstStatement.variable.text}`);
        console.log(`  📊 Wordlist: ${firstStatement.wordlist?.length || 0} items`);
        console.log(`  📊 Body length: ${firstStatement.body.length}`);

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

      console.log('');

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      console.log('');
    }
  }
}

debugControlFlowAST();