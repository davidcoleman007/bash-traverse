const { parse, generate } = require('../dist');

console.log('🔍 Debugging esac indentation...\n');

// Test the specific case from build.sh
const testCase = `case "$check_artifact" in publish)
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

console.log('Original:');
console.log(testCase);
console.log('Original length:', testCase.length);

try {
  const ast = parse(testCase);
  const caseStmt = ast.body[0];

  console.log('\nAST:');
  console.log('Type:', caseStmt.type);
  console.log('Clauses:', caseStmt.clauses.length);
  console.log('Newlines after in:', caseStmt.newlinesAfterIn?.length || 0);
  console.log('Esac indentation:', `"${caseStmt.esacIndentation}"`);

  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(generated);
  console.log('Generated length:', generated.length);

  console.log('\nMatch:', generated === testCase ? '✅ YES' : '❌ NO');

  if (generated !== testCase) {
    console.log('\nCharacter-by-character comparison:');
    const minLength = Math.min(testCase.length, generated.length);
    for (let i = 0; i < minLength; i++) {
      if (testCase[i] !== generated[i]) {
        console.log(`Position ${i}: '${testCase[i]}' vs '${generated[i]}' (${testCase.charCodeAt(i)} vs ${generated.charCodeAt(i)})`);
        console.log('Context:');
        console.log('Original:', testCase.substring(Math.max(0, i-10), i+10));
        console.log('Generated:', generated.substring(Math.max(0, i-10), i+10));
        break;
      }
    }
  }

} catch (error) {
  console.log('❌ Error:', error.message);
}