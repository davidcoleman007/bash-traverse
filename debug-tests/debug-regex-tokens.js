#!/usr/bin/env node

const { BashLexer } = require('../dist');

/**
 * Debug script to analyze regex pattern tokens
 */

const testCases = [
  '[[ "$auth" =~ email\\ *=\\ *([[:graph:]]*) ]]',
  '[[ "$BUILD_TYPE" == "build" || "$BUILD_TYPE" == "deploy-ephemeral" ]]',
  '[[ "$var" =~ pattern ]]',
  '[[ "$var" =~ [a-z]+ ]]'
];

function debugRegexTokens() {
  console.log('🔍 Debugging regex pattern tokens...\n');

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

debugRegexTokens();