const fs = require('fs');
const path = require('path');

console.log('=== Debug Files vs Test Scenarios Coverage Analysis ===\n');

// Get all debug files
const debugFiles = fs.readdirSync('.').filter(file => file.startsWith('debug-') && file.endsWith('.js'));
console.log(`📁 Total debug files: ${debugFiles.length}\n`);

// Categorize debug files
const categories = {
  'function': debugFiles.filter(f => f.includes('function')),
  'case': debugFiles.filter(f => f.includes('case')),
  'if': debugFiles.filter(f => f.includes('if')),
  'while': debugFiles.filter(f => f.includes('while')),
  'for': debugFiles.filter(f => f.includes('for')),
  'pipeline': debugFiles.filter(f => f.includes('pipeline')),
  'test': debugFiles.filter(f => f.includes('test')),
  'spacing': debugFiles.filter(f => f.includes('spacing')),
  'heredoc': debugFiles.filter(f => f.includes('heredoc')),
  'variable': debugFiles.filter(f => f.includes('variable')),
  'command': debugFiles.filter(f => f.includes('command')),
  'semicolon': debugFiles.filter(f => f.includes('semicolon')),
  'newline': debugFiles.filter(f => f.includes('newline')),
  'ast': debugFiles.filter(f => f.includes('ast')),
  'parser': debugFiles.filter(f => f.includes('parser')),
  'lexer': debugFiles.filter(f => f.includes('lexer')),
  'token': debugFiles.filter(f => f.includes('token')),
  'generation': debugFiles.filter(f => f.includes('generation')),
  'other': debugFiles.filter(f => !f.includes('function') && !f.includes('case') && !f.includes('if') &&
                                !f.includes('while') && !f.includes('for') && !f.includes('pipeline') &&
                                !f.includes('test') && !f.includes('spacing') && !f.includes('heredoc') &&
                                !f.includes('variable') && !f.includes('command') && !f.includes('semicolon') &&
                                !f.includes('newline') && !f.includes('ast') && !f.includes('parser') &&
                                !f.includes('lexer') && !f.includes('token') && !f.includes('generation'))
};

// Test scenarios coverage
const testScenarios = {
  '../test-scenarios/01-basic-parsing.js': ['command', 'variable', 'basic'],
  '../test-scenarios/02-function-parsing.js': ['function'],
  '../test-scenarios/03-pipeline-parsing.js': ['pipeline'],
  '../test-scenarios/04-variable-assignment.js': ['variable'],
  '../test-scenarios/05-control-structures.js': ['if', 'while', 'for', 'case'],
  '../test-scenarios/06-integration-tests.js': ['integration', 'complex'],
  '../test-scenarios/07-prefix-statements.js': ['variable', 'prefix'],
  '../test-scenarios/08-prefix-statements-advanced.js': ['variable', 'prefix', 'complex'],
  '../test-scenarios/09-prefix-statements-edge-cases.js': ['variable', 'edge-cases'],
  '../test-scenarios/10-comprehensive-round-trip.js': ['comprehensive', 'all'],
  '../test-scenarios/11-spacing-fidelity.js': ['spacing', 'fidelity']
};

console.log('📊 Debug Files by Category:');
console.log('='.repeat(50));
Object.entries(categories).forEach(([category, files]) => {
  if (files.length > 0) {
    console.log(`${category.padEnd(15)}: ${files.length} files`);
  }
});

console.log('\n📋 Test Scenarios Coverage:');
console.log('='.repeat(50));
Object.entries(testScenarios).forEach(([file, coverage]) => {
  console.log(`${file.padEnd(35)}: ${coverage.join(', ')}`);
});

// Check for gaps
console.log('\n🔍 Coverage Gaps Analysis:');
console.log('='.repeat(50));

// Check if we have debug files for each major category
const majorCategories = ['function', 'case', 'if', 'while', 'for', 'pipeline', 'test', 'spacing', 'heredoc', 'variable', 'command'];
majorCategories.forEach(category => {
  const debugCount = categories[category]?.length || 0;
  const testCoverage = Object.values(testScenarios).some(coverage => coverage.includes(category));

  if (debugCount > 0 && !testCoverage) {
    console.log(`⚠️  ${category}: ${debugCount} debug files but no dedicated test scenario`);
  } else if (debugCount === 0 && testCoverage) {
    console.log(`⚠️  ${category}: Test scenario exists but no debug files`);
  } else if (debugCount > 0 && testCoverage) {
    console.log(`✅ ${category}: ${debugCount} debug files + test coverage`);
  }
});

// Check for debug files that might not be covered
console.log('\n📝 Debug Files Not Covered by Test Scenarios:');
console.log('='.repeat(50));
const coveredCategories = new Set();
Object.values(testScenarios).forEach(coverage => {
  coverage.forEach(cat => coveredCategories.add(cat));
});

categories.other.forEach(file => {
  console.log(`  - ${file}`);
});

console.log('\n🎯 Recommendations:');
console.log('='.repeat(50));
console.log('1. Our comprehensive tests (10, 11) cover most scenarios');
console.log('2. Consider adding specific test scenarios for:');
console.log('   - Heredoc handling');
console.log('   - Complex edge cases');
console.log('   - Parser/lexer specific issues');
console.log('3. The debug files serve as excellent regression tests');
console.log('4. Consider running all debug files as part of CI/CD');