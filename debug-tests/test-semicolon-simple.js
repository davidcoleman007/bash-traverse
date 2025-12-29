#!/usr/bin/env node

const { parse, generate } = require('../dist');

/**
 * Simple test for semicolon parsing
 */

const testCase = 'echo hello; echo world';

function testSemicolonSimple() {
  console.log('🔍 Testing simple semicolon parsing...\n');
  console.log(`Testing: "${testCase}"`);

  try {
    const ast = parse(testCase);
    console.log(`  📊 Body length: ${ast.body.length}`);

    console.log('  📊 Body statements:');
    ast.body.forEach((stmt, index) => {
      console.log(`    ${index}: ${stmt.type}`);
      if (stmt.type === 'Command') {
        console.log(`      Command: ${stmt.name.text} ${stmt.arguments.map(arg => arg.text).join(' ')}`);
      } else if (stmt.type === 'Semicolon') {
        console.log(`      Semicolon: ";"`);
      }
    });

    const generated = generate(ast);
    console.log(`  📊 Generated: "${generated}"`);
    console.log(`  📊 Match: ${testCase === generated ? '✅ YES' : '❌ NO'}`);

  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
}

testSemicolonSimple();