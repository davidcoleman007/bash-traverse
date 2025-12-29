const { parse, generate } = require('../dist/index.js');

console.log('=== Case Statement Indentation Fidelity Tests ===\n');

// Test 1: Case statement with mixed indentation (from build.sh)
console.log('1. Case statement with mixed indentation (build.sh style):');
const caseMixedIndent = `case "$check_artifact" in publish)
            (cd dist-test; npm publish)
        ;;
        conflict)
        echo "Attempted to override previously published version"
        exit 1
        ;;
        error*)
        echo $check_artifact
        exit 1
        ;;
        skip)
        echo "Published artifact has not changed.  Skipping publish."
        exit 1
        ;;
    esac`;

console.log('Input:');
console.log(caseMixedIndent);
try {
  const ast = parse(caseMixedIndent);
  const caseStmt = ast.body[0];
  if (caseStmt.type === 'CaseStatement') {
    console.log('✅ Case statement parsed successfully');
    console.log('Number of clauses:', caseStmt.clauses.length);

    // Check indentation capture
    caseStmt.clauses.forEach((clause, i) => {
      console.log(`  Clause ${i + 1} indentation: "${clause.indentation}"`);
    });

    // Test generation
    const generated = generate(ast);
    console.log('Generated:');
    console.log(generated);

    // Test round-trip fidelity
    if (generated === caseMixedIndent) {
      console.log('✅ PERFECT FIDELITY - Generated matches original exactly');
    } else {
      console.log('❌ FIDELITY ISSUE - Generated differs from original');
      console.log('Original length:', caseMixedIndent.length);
      console.log('Generated length:', generated.length);
      console.log('Difference percentage:', ((Math.abs(caseMixedIndent.length - generated.length) / caseMixedIndent.length) * 100).toFixed(2) + '%');
    }
  } else {
    console.log('❌ Not parsed as CaseStatement, got:', caseStmt.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 2: Case statement with consistent indentation
console.log('2. Case statement with consistent indentation:');
const caseConsistentIndent = `case $1 in
    start)
        echo "Starting..."
        ;;
    stop)
        echo "Stopping..."
        ;;
    *)
        echo "Unknown command"
        ;;
esac`;

console.log('Input:');
console.log(caseConsistentIndent);
try {
  const ast = parse(caseConsistentIndent);
  const caseStmt = ast.body[0];
  if (caseStmt.type === 'CaseStatement') {
    console.log('✅ Case statement parsed successfully');

    // Check indentation capture
    caseStmt.clauses.forEach((clause, i) => {
      console.log(`  Clause ${i + 1} indentation: "${clause.indentation}"`);
    });

    // Test generation
    const generated = generate(ast);
    console.log('Generated:');
    console.log(generated);

    // Test round-trip fidelity
    if (generated === caseConsistentIndent) {
      console.log('✅ PERFECT FIDELITY - Generated matches original exactly');
    } else {
      console.log('❌ FIDELITY ISSUE - Generated differs from original');
    }
  } else {
    console.log('❌ Not parsed as CaseStatement, got:', caseStmt.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 3: Case statement with no indentation
console.log('3. Case statement with no indentation:');
const caseNoIndent = `case $1 in
start)
echo "Starting..."
;;
stop)
echo "Stopping..."
;;
*)
echo "Unknown command"
;;
esac`;

console.log('Input:');
console.log(caseNoIndent);
try {
  const ast = parse(caseNoIndent);
  const caseStmt = ast.body[0];
  if (caseStmt.type === 'CaseStatement') {
    console.log('✅ Case statement parsed successfully');

    // Check indentation capture
    caseStmt.clauses.forEach((clause, i) => {
      console.log(`  Clause ${i + 1} indentation: "${clause.indentation}"`);
    });

    // Test generation
    const generated = generate(ast);
    console.log('Generated:');
    console.log(generated);

    // Test round-trip fidelity
    if (generated === caseNoIndent) {
      console.log('✅ PERFECT FIDELITY - Generated matches original exactly');
    } else {
      console.log('❌ FIDELITY ISSUE - Generated differs from original');
    }
  } else {
    console.log('❌ Not parsed as CaseStatement, got:', caseStmt.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 4: Case statement with tab indentation
console.log('4. Case statement with tab indentation:');
const caseTabIndent = `case $1 in
	start)
		echo "Starting..."
		;;
	stop)
		echo "Stopping..."
		;;
	*)
		echo "Unknown command"
		;;
esac`;

console.log('Input:');
console.log(caseTabIndent);
try {
  const ast = parse(caseTabIndent);
  const caseStmt = ast.body[0];
  if (caseStmt.type === 'CaseStatement') {
    console.log('✅ Case statement parsed successfully');

    // Check indentation capture
    caseStmt.clauses.forEach((clause, i) => {
      console.log(`  Clause ${i + 1} indentation: "${clause.indentation}"`);
    });

    // Test generation
    const generated = generate(ast);
    console.log('Generated:');
    console.log(generated);

    // Test round-trip fidelity
    if (generated === caseTabIndent) {
      console.log('✅ PERFECT FIDELITY - Generated matches original exactly');
    } else {
      console.log('❌ FIDELITY ISSUE - Generated differs from original');
    }
  } else {
    console.log('❌ Not parsed as CaseStatement, got:', caseStmt.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 5: Case statement with complex patterns
console.log('5. Case statement with complex patterns:');
const caseComplexPatterns = `case "$BUILD_TYPE" in
    build|dev)
        echo "Building for $BUILD_TYPE"
        ;;
    test)
        echo "Running tests"
        ;;
    *)
        echo "Unknown build type"
        ;;
esac`;

console.log('Input:');
console.log(caseComplexPatterns);
try {
  const ast = parse(caseComplexPatterns);
  const caseStmt = ast.body[0];
  if (caseStmt.type === 'CaseStatement') {
    console.log('✅ Case statement parsed successfully');

    // Check indentation capture
    caseStmt.clauses.forEach((clause, i) => {
      console.log(`  Clause ${i + 1} indentation: "${clause.indentation}"`);
      console.log(`  Clause ${i + 1} patterns:`, clause.patterns.map(p => p.text));
    });

    // Test generation
    const generated = generate(ast);
    console.log('Generated:');
    console.log(generated);

    // Test round-trip fidelity
    if (generated === caseComplexPatterns) {
      console.log('✅ PERFECT FIDELITY - Generated matches original exactly');
    } else {
      console.log('❌ FIDELITY ISSUE - Generated differs from original');
    }
  } else {
    console.log('❌ Not parsed as CaseStatement, got:', caseStmt.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

console.log('🎯 Case statement indentation fidelity tests completed!');