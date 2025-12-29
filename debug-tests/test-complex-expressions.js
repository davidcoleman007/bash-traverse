#!/usr/bin/env node

const { parse, generate } = require('../dist');

/**
 * Test script for complex test expressions
 * Focuses on [[ ... ]] and [ ... ] syntax
 */

const testCases = [
  // Simple test expressions
  '[ -n "$VAR" ]',
  '[ -z "$VAR" ]',
  '[ "$VAR" = "value" ]',

  // Extended test expressions
  '[[ -n "$VAR" ]]',
  '[[ -z "$VAR" ]]',
  '[[ "$VAR" = "value" ]]',

  // Complex extended test expressions
  '[[ "$auth" =~ email\\ *=\\ *([[:graph:]]*) ]]',
  '[[ "$BUILD_TYPE" == "deploy-ephemeral" ]]',
  '[[ "$BUILD_TYPE" != "deploy-ephemeral" ]]',
  '[[ "$BUILD_TYPE" == "build" || "$BUILD_TYPE" == "deploy-ephemeral" ]]',

  // POSIX test expressions
  '[ -n "$SONAR_TOKEN" ]',
  '[ -z "$sha" ]',
  '[ -z "$package_name" ]',
  '[ -z "$package_version" ]',
  '[ -z "$version_found" ]'
];

function testComplexExpressions() {
  console.log('🧪 Testing complex test expressions...\n');

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      console.log(`Testing: "${testCase}"`);

      const ast = parse(testCase);
      console.log(`  ✅ Parse successful`);
      console.log(`  📊 AST type: ${ast.type}`);

      if (ast.type === 'TestExpression') {
        console.log(`  📊 Extended: ${ast.extended}`);
        console.log(`  📊 Elements: ${ast.elements.length}`);
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
    console.log('🎉 All complex test expressions working!');
    return true;
  } else {
    console.log('⚠️  Some complex test expressions need work');
    return false;
  }
}

if (require.main === module) {
  testComplexExpressions();
}

module.exports = { testComplexExpressions };