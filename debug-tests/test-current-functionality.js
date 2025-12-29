#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parse, generate } = require('../dist');

/**
 * Test script for currently working functionality
 * Focuses on basic commands and simple structures
 */

const testCases = [
  // Basic commands
  'echo "hello world"',
  'npm install',
  'npm run build',
  'mkdir dist',
  'rm -rf dist',

  // Commands with arguments
  'npx write-version -v "$EPHEMERAL_ARTIFACT_VERSION"',
  'npm run bundle:aggregation',

  // Variable assignments
  'export NPM_EMAIL="${BASH_REMATCH[1]}"',
  'export NPM_AUTH="${BASH_REMATCH[1]}"',

  // Simple comments
  '# This is a comment',
  '# -e to exit on first error.',

  // Basic echo statements
  'echo "Copying .npmrc to .npmrc.copy"',
  'echo "Replacing _auth and email in .npmrc"',
  'echo "Package published: $package_name@$package_version"',

  // Simple variable usage
  'auth=$(<~/.npmrc)',

  // Basic file operations
  'cp .npmrc .npmrc.copy',
  'egrep -v \'_auth|email\' .npmrc.copy > .npmrc',
];

function testCurrentFunctionality() {
  console.log('🧪 Testing currently working functionality...\n');

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      const ast = parse(testCase);
      const generated = generate(ast);
      const isMatch = testCase === generated;

      if (isMatch) {
        console.log(`✅ "${testCase}"`);
        passed++;
      } else {
        console.log(`❌ "${testCase}"`);
        console.log(`   Generated: "${generated}"`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ "${testCase}" - ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('🎉 All basic functionality tests passed!');
    return true;
  } else {
    console.log('⚠️  Some tests failed - parser needs more work for complex Bash syntax');
    return false;
  }
}

if (require.main === module) {
  const success = testCurrentFunctionality();
  process.exit(success ? 0 : 1);
}

module.exports = { testCurrentFunctionality };