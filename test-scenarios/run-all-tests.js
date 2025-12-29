const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Running All bash-traverse Test Scenarios\n');
console.log('='.repeat(60) + '\n');

const testFiles = [
  // Core functionality tests
  '01-basic-parsing.js',
  '02-function-parsing.js',
  '03-pipeline-parsing.js',
  '04-variable-assignment.js',
  '05-control-structures.js',
  '06-integration-tests.js',

  // Prefix statements tests
  '07-prefix-statements.js',
  '08-prefix-statements-advanced.js',
  '09-prefix-statements-edge-cases.js',

  // Comprehensive tests (new)
  '10-comprehensive-round-trip.js',
  '11-spacing-fidelity.js',

  // Specialized tests (new)
  '12-heredoc-tests.js',
  '13-test-expression-tests.js',
  '14-build-script-round-trip.js',
  '15-case-statement-indentation.js',
  '16-pre-merge-test-round-trip.js'
];

const results = [];

// Run each test file
for (const testFile of testFiles) {
  console.log(`📋 Running ${testFile}...`);
  console.log('-'.repeat(40));

  try {
    const output = execSync(`node ${testFile}`, {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: 'pipe'
    });

    console.log(output);
    results.push({ file: testFile, status: '✅ PASSED' });
  } catch (error) {
    console.log('❌ Test failed:');
    console.log(error.stdout || error.message);
    results.push({ file: testFile, status: '❌ FAILED' });
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

// Summary
console.log('📊 Test Results Summary:');
console.log('='.repeat(40));

// Group results by category
const coreTests = results.filter(r => r.file.match(/^0[1-6]-/));
const prefixTests = results.filter(r => r.file.match(/^0[7-9]-/));
const comprehensiveTests = results.filter(r => r.file.match(/^1[0-1]-/));
const specializedTests = results.filter(r => r.file.match(/^1[2-9]-/));

console.log('\n🔧 Core Functionality Tests:');
coreTests.forEach(result => {
  console.log(`  ${result.status} ${result.file}`);
});

console.log('\n🔧 Prefix Statements Tests:');
prefixTests.forEach(result => {
  console.log(`  ${result.status} ${result.file}`);
});

console.log('\n🔧 Comprehensive Tests:');
comprehensiveTests.forEach(result => {
  console.log(`  ${result.status} ${result.file}`);
});

console.log('\n🔧 Specialized Tests:');
specializedTests.forEach(result => {
  console.log(`  ${result.status} ${result.file}`);
});

const passed = results.filter(r => r.status.includes('PASSED')).length;
const total = results.length;

console.log('\n' + '='.repeat(40));
console.log(`🎯 Overall: ${passed}/${total} test suites passed`);

if (passed === total) {
  console.log('🎉 All tests passed! bash-traverse is ready for production!');
} else {
  console.log('⚠️  Some tests failed. Please review the output above.');
}

console.log('\n📁 Test files created:');
testFiles.forEach(file => {
  console.log(`  - ${file}`);
});

console.log('\n🔧 To run individual tests:');
console.log('  cd test-scenarios');
console.log('  node <test-file-name>');

console.log('\n🔧 To run specific test categories:');
console.log('  # Core functionality only:');
console.log('  node 01-basic-parsing.js 02-function-parsing.js 03-pipeline-parsing.js 04-variable-assignment.js 05-control-structures.js 06-integration-tests.js');
console.log('  # Comprehensive tests only:');
console.log('  node 10-comprehensive-round-trip.js 11-spacing-fidelity.js');