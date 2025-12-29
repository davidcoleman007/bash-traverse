#!/usr/bin/env node

const { BashLexer } = require('../dist');

/**
 * Debug script to see what tokens are generated for control flow structures
 */

const testCases = [
  'if [[ "$var" =~ pattern ]]; then',
  'if [ -n "$VAR" ]; then',
  'for i in 1 2 3; do',
  'for i in 1 2 3; do echo $i; done'
];

function debugControlFlowTokens() {
  console.log('🔍 Debugging control flow tokens...\n');

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

debugControlFlowTokens();