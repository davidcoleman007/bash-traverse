#!/usr/bin/env node

const { parse, generate } = require('../dist');

/**
 * Test script for heredoc functionality
 * Tests << EOF syntax and content handling
 */

const testCases = [
  // Simple heredoc
  'cat << EOF\nhello world\nEOF',

  // Heredoc with variable
  'cat << EOF\nHello $USER\nEOF',

  // Heredoc with indentation
  'cat << EOF\n  indented content\nEOF',

  // Heredoc with multiple lines
  'cat << EOF\nline 1\nline 2\nline 3\nEOF',

  // Heredoc with tab stripping
  'cat <<- EOF\n\tcontent\nEOF',

  // Heredoc with quoted delimiter
  'cat << "EOF"\n$USER content\nEOF',

  // Complex heredoc (from build.sh)
  'cat >> .npmrc << EOF\nemail=$NPM_EMAIL\nlegacy-peer-deps=true\nEOF'
];

function testHeredoc() {
  console.log('🧪 Testing heredoc functionality...\n');

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      console.log(`Testing: "${testCase}"`);

      const ast = parse(testCase);
      console.log(`  ✅ Parse successful`);
      console.log(`  📊 AST type: ${ast.type}`);

      if (ast.body.length > 0) {
        const firstStatement = ast.body[0];
        console.log(`  📊 First statement type: ${firstStatement.type}`);

        if (firstStatement.type === 'Command' && firstStatement.hereDocument) {
          console.log(`  📊 Has heredoc: true`);
          console.log(`  📊 Heredoc delimiter: ${firstStatement.hereDocument.delimiter.text}`);
          console.log(`  📊 Heredoc content length: ${firstStatement.hereDocument.content.length}`);
        }
      }

      const generated = generate(ast);
      const isMatch = testCase === generated;

      if (isMatch) {
        console.log(`  ✅ Round-trip successful`);
        passed++;
      } else {
        console.log(`  ❌ Round-trip failed`);
        console.log(`     Original: "${testCase}"`);
        console.log(`     Generated: "${generated}"`);
        failed++;
      }

      console.log('');

    } catch (error) {
      console.log(`  ❌ Parse failed: ${error.message}`);
      failed++;
      console.log('');
    }
  }

  console.log(`📊 Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('🎉 All heredoc tests passed!');
    return true;
  } else {
    console.log('⚠️  Some heredoc tests failed - needs more work');
    return false;
  }
}

if (require.main === module) {
  testHeredoc();
}

module.exports = { testHeredoc };