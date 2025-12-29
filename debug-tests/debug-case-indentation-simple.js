const { parse, generate } = require('../dist');

console.log('🔍 Debugging case statement indentation...\n');

// Test a simple case statement
const simpleCase = `case $1 in
    start)
        echo "Starting..."
        ;;
esac`;

console.log('Original:');
console.log(simpleCase);
console.log('Original length:', simpleCase.length);

try {
  const ast = parse(simpleCase);
  const caseStmt = ast.body[0];

  console.log('\nAST:');
  console.log('Type:', caseStmt.type);
  console.log('Clauses:', caseStmt.clauses.length);

  caseStmt.clauses.forEach((clause, i) => {
    console.log(`  Clause ${i + 1}:`);
    console.log(`    Indentation: "${clause.indentation}"`);
    console.log(`    Patterns:`, clause.patterns.map(p => p.text));
  });

  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(generated);
  console.log('Generated length:', generated.length);

  console.log('\nMatch:', generated === simpleCase ? '✅ YES' : '❌ NO');

  if (generated !== simpleCase) {
    console.log('\nCharacter-by-character comparison:');
    const minLength = Math.min(simpleCase.length, generated.length);
    for (let i = 0; i < minLength; i++) {
      if (simpleCase[i] !== generated[i]) {
        console.log(`Position ${i}: '${simpleCase[i]}' vs '${generated[i]}' (${simpleCase.charCodeAt(i)} vs ${generated.charCodeAt(i)})`);
        break;
      }
    }
  }

} catch (error) {
  console.log('❌ Error:', error.message);
}