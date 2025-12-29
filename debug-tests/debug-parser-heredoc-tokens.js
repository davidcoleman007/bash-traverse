#!/usr/bin/env node

const { BashLexer } = require('../dist');

/**
 * Debug script to see what tokens the parser sees for heredoc
 */

const testCase = 'cat << EOF\nhello world\nEOF';

function debugParserHeredocTokens() {
  console.log('🔍 Debugging parser heredoc tokens...\n');
  console.log(`Testing: "${testCase}"`);

  // Get the tokens that the parser would see
  const lexer = new BashLexer(testCase);
  const tokens = lexer.tokenize();

  console.log('📊 Tokens that parser sees:');
  tokens.forEach((token, index) => {
    console.log(`  ${index}: ${token.type} = "${token.value}"`);
  });

  // Now let's simulate what the parser does
  console.log('\n🔍 Simulating parser behavior:');

  let current = 0;

  // Simulate parseCommand -> parseStandardCommand -> parseHereDocument
  console.log('📊 Looking for HEREDOC_START token...');

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    console.log(`  Position ${i}: ${token.type} = "${token.value}"`);

    if (token.type === 'HEREDOC_START') {
      console.log(`  ✅ Found HEREDOC_START at position ${i}`);
      current = i;

      // Now simulate parseHereDocument
      console.log('  📊 Starting parseHereDocument...');

      // Consume HEREDOC_START
      current++;
      console.log(`  📊 After consuming HEREDOC_START, current = ${current}`);

      if (current < tokens.length) {
        const nextToken = tokens[current];
        console.log(`  📊 Next token: ${nextToken.type} = "${nextToken.value}"`);

        if (nextToken.type === 'HEREDOC_DELIMITER') {
          console.log('  ✅ Found HEREDOC_DELIMITER');
          current++;

          if (current < tokens.length) {
            const contentToken = tokens[current];
            console.log(`  📊 Content token: ${contentToken.type} = "${contentToken.value}"`);

            if (contentToken.type === 'HEREDOC_CONTENT') {
              console.log('  ✅ Found HEREDOC_CONTENT');
              current++;

              if (current < tokens.length) {
                const closingToken = tokens[current];
                console.log(`  📊 Closing token: ${closingToken.type} = "${closingToken.value}"`);

                if (closingToken.type === 'HEREDOC_DELIMITER') {
                  console.log('  ✅ Found closing HEREDOC_DELIMITER');
                  console.log('  🎉 Heredoc parsing would succeed!');
                } else {
                  console.log('  ❌ Expected closing HEREDOC_DELIMITER');
                }
              }
            } else {
              console.log('  ❌ Expected HEREDOC_CONTENT');
            }
          }
        } else {
          console.log('  ❌ Expected HEREDOC_DELIMITER');
        }
      }
      break;
    }
  }
}

debugParserHeredocTokens();