const { parse, generate } = require('../dist');

console.log('🔍 Testing variable esac indentation levels...\n');

// Test different indentation levels for esac
const testCases = [
  {
    name: 'No indentation',
    code: `case $1 in
    start)
        echo "Starting..."
        ;;
esac`
  },
  {
    name: '2 spaces indentation',
    code: `case $1 in
    start)
        echo "Starting..."
        ;;
  esac`
  },
  {
    name: '4 spaces indentation',
    code: `case $1 in
    start)
        echo "Starting..."
        ;;
    esac`
  },
  {
    name: '8 spaces indentation',
    code: `case $1 in
    start)
        echo "Starting..."
        ;;
        esac`
  },
  {
    name: 'Tab indentation',
    code: `case $1 in
    start)
        echo "Starting..."
        ;;
	esac`
  }
];

testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}:`);
  console.log('Original:');
  console.log(testCase.code);

  try {
    const ast = parse(testCase.code);
    const caseStmt = ast.body[0];

    console.log('\nAST:');
    console.log('Type:', caseStmt.type);
    console.log('Clauses:', caseStmt.clauses.length);
    console.log('Esac indentation:', `"${caseStmt.esacIndentation}"`);
    console.log('Esac indentation length:', caseStmt.esacIndentation?.length || 0);

    const generated = generate(ast);
    console.log('\nGenerated:');
    console.log(generated);

    console.log('\nMatch:', generated === testCase.code ? '✅ YES' : '❌ NO');

    if (generated !== testCase.code) {
      console.log('\nCharacter-by-character comparison:');
      const minLength = Math.min(testCase.code.length, generated.length);
      for (let i = 0; i < minLength; i++) {
        if (testCase.code[i] !== generated[i]) {
          console.log(`Position ${i}: '${testCase.code[i]}' vs '${generated[i]}' (${testCase.code.charCodeAt(i)} vs ${generated.charCodeAt(i)})`);
          console.log('Context:');
          console.log('Original:', testCase.code.substring(Math.max(0, i-10), i+10));
          console.log('Generated:', generated.substring(Math.max(0, i-10), i+10));
          break;
        }
      }
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(50));
});