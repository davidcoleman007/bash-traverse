#!/usr/bin/env node

const { parse } = require('../dist');

/**
 * Debug script to examine heredoc content structure
 */

const testCase = 'cat << EOF\nhello world\nEOF';

function debugHeredocContent() {
  console.log('🔍 Debugging heredoc content structure...\n');
  console.log(`Testing: "${testCase}"`);

  try {
    const ast = parse(testCase);
    const firstStatement = ast.body[0];

    if (firstStatement.type === 'Command' && firstStatement.hereDocument) {
      const hereDoc = firstStatement.hereDocument;
      console.log(`📊 Heredoc content: "${hereDoc.content}"`);
      console.log(`📊 Content length: ${hereDoc.content.length}`);
      console.log(`📊 Content bytes:`, Array.from(hereDoc.content).map(c => c.charCodeAt(0)));
      console.log(`📊 Content starts with newline: ${hereDoc.content.startsWith('\n')}`);
      console.log(`📊 Content ends with newline: ${hereDoc.content.endsWith('\n')}`);

      // Show the original input structure
      console.log('\n📊 Original input structure:');
      const lines = testCase.split('\n');
      lines.forEach((line, index) => {
        console.log(`  Line ${index}: "${line}"`);
      });
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

debugHeredocContent();