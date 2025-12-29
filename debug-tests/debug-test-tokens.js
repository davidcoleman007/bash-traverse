#!/usr/bin/env node

const { BashLexer } = require('../dist');

/**
 * Debug script to see what tokens are generated for test expressions
 */

const testCases = [
  '[ -n "$VAR" ]',
  '[[ -n "$VAR" ]]',
  '[[ "$auth" =~ email\\ *=\\ *([[:graph:]]*) ]]',
  '[[ "$BUILD_TYPE" == "deploy-ephemeral" ]]'
];

function debugTestTokens() {
  console.log('🔍 Debugging test expression tokens...\n');

  for (const testCase of testCases) {
    console.log(`Testing: "${testCase}"`);

    const lexer = new BashLexer(testCase);
    const tokens = lexer.tokenize();

    console.log('  Tokens:');
    tokens.forEach((token, index) => {
      console.log(`    ${index}: ${token.type} = "${token.value}"`);
    });

    console.log('');
  }
}

debugTestTokens();