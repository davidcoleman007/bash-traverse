#!/usr/bin/env node

const { parse } = require('../dist');

/**
 * Debug script to see what tokens the parser sees for heredoc
 */

const testCase = 'cat << EOF\nhello world\nEOF';

function debugParserTokens() {
  console.log('🔍 Debugging parser tokens for heredoc...\n');
  console.log(`Testing: "${testCase}"`);

  try {
    const ast = parse(testCase);
    console.log('✅ Parse successful!');
    console.log(`📊 AST type: ${ast.type}`);
    console.log(`📊 Body length: ${ast.body.length}`);

    if (ast.body.length > 0) {
      const firstStatement = ast.body[0];
      console.log(`📊 First statement type: ${firstStatement.type}`);

      if (firstStatement.type === 'Command') {
        console.log(`📊 Command name: ${firstStatement.name.text}`);
        console.log(`📊 Arguments count: ${firstStatement.arguments.length}`);
        console.log(`📊 Has heredoc: ${!!firstStatement.hereDocument}`);

        if (firstStatement.hereDocument) {
          console.log(`📊 Heredoc delimiter: ${firstStatement.hereDocument.delimiter.text}`);
          console.log(`📊 Heredoc content: "${firstStatement.hereDocument.content}"`);
        }
      }
    }
  } catch (error) {
    console.log(`❌ Parse failed: ${error.message}`);
    console.log(`📊 Error stack: ${error.stack}`);
  }
}

debugParserTokens();