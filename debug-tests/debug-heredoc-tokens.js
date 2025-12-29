#!/usr/bin/env node

const { BashLexer } = require('../dist');

/**
 * Debug script to see what tokens are generated for heredoc syntax
 */

const testCases = [
  'cat << EOF',
  'cat << EOF\nhello world\nEOF',
  'cat <<- EOF\n\tcontent\nEOF'
];

function debugHeredocTokens() {
  console.log('🔍 Debugging heredoc tokens...\n');

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

debugHeredocTokens();