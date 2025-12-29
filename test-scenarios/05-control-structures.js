const { parse, generate } = require('../dist/index.js');

console.log('=== Control Structures Tests ===\n');

// Test 1: Simple if statement
console.log('1. Simple if statement:');
const simpleIf = `if [ -f file.txt ]; then
    echo "file exists"
fi`;
console.log('Input:');
console.log(simpleIf);
try {
  const ast = parse(simpleIf);
  const ifStatement = ast.body[0];
  if (ifStatement.type === 'IfStatement') {
    console.log('✅ If statement parsed successfully');
    console.log('Condition statements:', ifStatement.condition.length);
    console.log('Then body statements:', ifStatement.thenBody.length);
    console.log('Has else body:', !!ifStatement.elseBody);
  } else {
    console.log('❌ Not parsed as IfStatement, got:', ifStatement.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 2: If statement with else
console.log('2. If statement with else:');
const ifWithElse = `if [ -f file.txt ]; then
    echo "file exists"
else
    echo "file not found"
fi`;
console.log('Input:');
console.log(ifWithElse);
try {
  const ast = parse(ifWithElse);
  const ifStatement = ast.body[0];
  if (ifStatement.type === 'IfStatement') {
    console.log('✅ If-else statement parsed successfully');
    console.log('Then body statements:', ifStatement.thenBody.length);
    console.log('Else body statements:', ifStatement.elseBody?.length || 0);
  } else {
    console.log('❌ Not parsed as IfStatement, got:', ifStatement.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 3: For loop
console.log('3. For loop:');
const forLoop = `for i in 1 2 3; do
    echo "Number: $i"
done`;
console.log('Input:');
console.log(forLoop);
try {
  const ast = parse(forLoop);
  const forStatement = ast.body[0];
  if (forStatement.type === 'ForStatement') {
    console.log('✅ For loop parsed successfully');
    console.log('Variable:', forStatement.variable?.text);
    console.log('Wordlist:', forStatement.wordlist?.map(w => w.text));
    console.log('Body statements:', forStatement.body.length);
  } else {
    console.log('❌ Not parsed as ForStatement, got:', forStatement.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 4: While loop
console.log('4. While loop:');
const whileLoop = `while [ $i -lt 10 ]; do
    echo "Count: $i"
    i=$((i + 1))
done`;
console.log('Input:');
console.log(whileLoop);
try {
  const ast = parse(whileLoop);
  const whileStatement = ast.body[0];
  if (whileStatement.type === 'WhileStatement') {
    console.log('✅ While loop parsed successfully');
    console.log('Condition type:', whileStatement.condition?.type);
    console.log('Body statements:', whileStatement.body.length);
  } else {
    console.log('❌ Not parsed as WhileStatement, got:', whileStatement.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 5: Case statement
console.log('5. Case statement:');
const caseStatement = `case $1 in
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
console.log(caseStatement);
try {
  const ast = parse(caseStatement);
  const caseStmt = ast.body[0];
  if (caseStmt.type === 'CaseStatement') {
    console.log('✅ Case statement parsed successfully');
    console.log('Expression:', caseStmt.expression?.name?.text || caseStmt.expression?.text);
    console.log('Number of clauses:', caseStmt.clauses.length);
  } else {
    console.log('❌ Not parsed as CaseStatement, got:', caseStmt.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 6: Brace group
console.log('6. Brace group:');
const braceGroup = `{
    echo "Starting group"
    npm install
    echo "Group complete"
}`;
console.log('Input:');
console.log(braceGroup);
try {
  const ast = parse(braceGroup);
  const brace = ast.body[0];
  if (brace.type === 'BraceGroup') {
    console.log('✅ Brace group parsed successfully');
    console.log('Body statements:', brace.body.length);
  } else {
    console.log('❌ Not parsed as BraceGroup, got:', brace.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 7: Nested control structures
console.log('7. Nested control structures:');
const nestedStructures = `if [ -d "src" ]; then
    for file in src/*.js; do
        if [ -f "$file" ]; then
            echo "Processing $file"
        fi
    done
fi`;
console.log('Input:');
console.log(nestedStructures);
try {
  const ast = parse(nestedStructures);
  const ifStatement = ast.body[0];
  if (ifStatement.type === 'IfStatement') {
    console.log('✅ Nested control structures parsed successfully');
    console.log('Then body statements:', ifStatement.thenBody.length);
    console.log('Statement types in then body:', ifStatement.thenBody.map(stmt => stmt.type));
  } else {
    console.log('❌ Not parsed as IfStatement, got:', ifStatement.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 8: Code generation for control structures
console.log('8. Control structure code generation:');
const structureToGenerate = `if [ -f file.txt ]; then
    echo "exists"
fi`;
console.log('Input:');
console.log(structureToGenerate);
try {
  const ast = parse(structureToGenerate);
  const generated = generate(ast);
  console.log('Generated:');
  console.log(generated);
  console.log('✅ Generation successful');
} catch (error) {
  console.log('❌ Generation failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

console.log('🎯 Control structures tests completed!');