const { parse, generate } = require('../dist/index.js');

console.log('=== Here Document Testing ===\n');
console.log('This test covers all heredoc scenarios we debugged\n');

function testHeredoc(name, input, expectedOutput = null) {
  console.log(`\n--- ${name} ---`);
  console.log('Input:');
  console.log(input);

  try {
    // Parse the input
    const ast = parse(input);
    console.log('\n✅ Parse successful');

    // Generate code from AST
    const generated = generate(ast);
    console.log('\nGenerated:');
    console.log(generated);

    // Test if it's valid bash
    const fs = require('fs');
    const testFile = `test-heredoc-${Date.now()}.sh`;
    fs.writeFileSync(testFile, generated);

    const { execSync } = require('child_process');
    const result = execSync(`bash ${testFile}`, { encoding: 'utf8' });
    console.log('\nBash execution result:', result.trim());

    // Clean up
    fs.unlinkSync(testFile);

    // Test round-trip fidelity
    const roundTripAst = parse(generated);
    const roundTripGenerated = generate(roundTripAst);

    if (generated === roundTripGenerated) {
      console.log('\n✅ Round-trip fidelity: PERFECT');
      return true;
    } else {
      console.log('\n❌ Round-trip fidelity: FAILED');
      console.log('First generation:', generated);
      console.log('Round-trip generation:', roundTripGenerated);
      return false;
    }

  } catch (error) {
    console.log('\n❌ Failed:', error.message);
    return false;
  }
}

// Track results
const results = [];

// ===== BASIC HEREDOC TESTS =====
console.log('\n' + '='.repeat(60));
console.log('BASIC HEREDOC TESTS');
console.log('='.repeat(60));

results.push(testHeredoc('Basic Here Document',
`cat << EOF
Hello World
This is a here document
EOF`));

results.push(testHeredoc('Here Document with Variable',
`cat << EOF
Hello $USER
Current directory: $PWD
EOF`));

results.push(testHeredoc('Here Document with Command Substitution',
`cat << EOF
Version: $(node --version)
Files: $(ls *.js)
EOF`));

// ===== HEREDOC WITH TAB STRIPPING =====
console.log('\n' + '='.repeat(60));
console.log('HEREDOC WITH TAB STRIPPING TESTS');
console.log('='.repeat(60));

results.push(testHeredoc('Here Document with Tab Stripping',
`cat <<- EOF
	Hello World
	This is a here document with tabs
		More indented content
EOF`));

results.push(testHeredoc('Here Document Mixed Indentation',
`cat <<- EOF
	Hello World
This is mixed indentation
		More indented content
EOF`));

// ===== HEREDOC IN PIPELINES =====
console.log('\n' + '='.repeat(60));
console.log('HEREDOC IN PIPELINES TESTS');
console.log('='.repeat(60));

results.push(testHeredoc('Here Document in Pipeline',
`cat << EOF | grep "Hello"
Hello World
This is a here document
Goodbye World
EOF`));

results.push(testHeredoc('Here Document with Variable Assignment',
`output=$(cat << EOF
Hello World
This is a here document
EOF
)
echo "$output"`));

// ===== HEREDOC EDGE CASES =====
console.log('\n' + '='.repeat(60));
console.log('HEREDOC EDGE CASES TESTS');
console.log('='.repeat(60));

results.push(testHeredoc('Empty Here Document',
`cat << EOF
EOF`));

results.push(testHeredoc('Here Document with Special Characters',
`cat << 'EOF'
Hello $USER
This has "quotes" and 'quotes'
And $variables that should not expand
EOF`));

results.push(testHeredoc('Here Document with Heredoc in Content',
`cat << EOF
This contains a heredoc:
cat << INNER
inner content
INNER
EOF`));

// ===== SUMMARY =====
console.log('\n' + '='.repeat(60));
console.log('HEREDOC TEST SUMMARY');
console.log('='.repeat(60));

const passed = results.filter(r => r === true).length;
const total = results.length;

console.log(`\n🎯 Results: ${passed}/${total} heredoc tests passed`);
console.log(`📊 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

if (passed === total) {
  console.log('\n🎉 ALL HEREDOC TESTS PASSED! Here document handling is perfect!');
} else {
  console.log('\n⚠️  Some heredoc tests failed. Please review the output above.');
}

console.log('\n=== Here Document Testing Complete ===');