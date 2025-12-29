#!/usr/bin/env node

const { BashLexer } = require('../dist');

/**
 * Debug script to see what happens after heredoc post-processing
 */

const testCases = [
  'cat << EOF\nhello world\nEOF'
];

function debugHeredocPostprocess() {
  console.log('🔍 Debugging heredoc post-processing...\n');

  for (const testCase of testCases) {
    console.log(`Testing: "${testCase}"`);

    const lexer = new BashLexer(testCase);

    // Let's manually call the methods to see what happens
    console.log('  📊 Step 1: Basic tokenization');
    lexer.basicTokenize();
    console.log(`  📊 Tokens after basic tokenization: ${lexer.tokens.length}`);
    lexer.tokens.forEach((token, index) => {
      console.log(`    ${index}: ${token.type} = "${token.value}"`);
    });

    console.log('\n  📊 Step 2: Post-processing heredocs');

    // Add debug logging to postProcessHeredocs
    const originalPostProcess = lexer.postProcessHeredocs;
    lexer.postProcessHeredocs = function() {
      console.log('    🔍 Starting postProcessHeredocs...');
      console.log(`    📊 Total tokens: ${this.tokens.length}`);

      for (let i = 0; i < this.tokens.length - 1; i++) {
        const currentToken = this.tokens[i];
        const nextToken = this.tokens[i + 1];

        console.log(`    🔍 Checking tokens ${i} and ${i + 1}:`);
        console.log(`      ${i}: ${currentToken?.type} = "${currentToken?.value}"`);
        console.log(`      ${i + 1}: ${nextToken?.type} = "${nextToken?.value}"`);

        if (currentToken && currentToken.type === 'HEREDOC_START' && currentToken.value === '<<') {
          console.log(`    ✅ Found HEREDOC_START at position ${i}`);
          if (i + 1 < this.tokens.length && nextToken && (nextToken.type === 'WORD' || nextToken.type === 'ARGUMENT')) {
            console.log(`    ✅ Found delimiter "${nextToken.value}" at position ${i + 1}`);
            console.log(`    🔍 Would process heredoc with delimiter: ${nextToken.value}`);
          } else {
            console.log(`    ❌ No valid delimiter found after HEREDOC_START`);
          }
        }
      }

      // Call the original method
      originalPostProcess.call(this);
    };

    lexer.postProcessHeredocs();
    console.log(`  📊 Tokens after post-processing: ${lexer.tokens.length}`);
    lexer.tokens.forEach((token, index) => {
      console.log(`    ${index}: ${token.type} = "${token.value}"`);
    });

    console.log('');
  }
}

debugHeredocPostprocess();