#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parse, generate } = require('../dist');

/**
 * Quick validation script for build.sh
 * Fast test for basic functionality
 */

function quickValidation() {
  console.log('⚡ Quick validation test...\n');

  const buildPath = path.join(__dirname, 'examples', 'build.sh');

  try {
    // Read and parse
    const original = fs.readFileSync(buildPath, 'utf8');
    const ast = parse(original);

    // Generate
    const generated = generate(ast);

    // Quick comparison
    const isMatch = original === generated;

    console.log(`📁 File: ${buildPath}`);
    console.log(`📏 Original: ${original.length} chars`);
    console.log(`📏 Generated: ${generated.length} chars`);
    console.log(`📊 Match: ${isMatch ? '✅ YES' : '❌ NO'}`);
    console.log(`📈 AST statements: ${ast.body.length}`);

    if (!isMatch) {
      console.log('\n⚠️  Differences detected - run test-build-validation.js for detailed analysis');
      return false;
    }

    console.log('\n🎉 Quick validation passed!');
    return true;

  } catch (error) {
    console.error('❌ Quick validation failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  const success = quickValidation();
  process.exit(success ? 0 : 1);
}

module.exports = { quickValidation };