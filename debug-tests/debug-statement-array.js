const { parse, generate } = require('../dist/index.js');

// Let's test with a simple case first
const source = `function test() {
    echo "Hello"
    echo "World"
}`;

console.log('=== Statement Array Generation Debug ===\n');

try {
  const ast = parse(source);
  console.log('✅ Parsed successfully');

  // Get the function body statements
  const functionDef = ast.body[0];
  console.log('Function body statements:');
  functionDef.body.forEach((stmt, index) => {
    console.log(`  ${index}: ${stmt.type}`);
  });

  console.log('\n---\n');

  // Let's manually trace what should happen
  console.log('Manual trace of statement array generation:');
  const statements = functionDef.body;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`\nProcessing statement ${i}: ${statement.type}`);

    if (statement.type === 'Newline') {
      console.log(`  -> Adding newline`);
      continue;
    }

    if (statement.type === 'Semicolon') {
      console.log(`  -> Adding semicolon`);
      continue;
    }

    // Check if we should add a semicolon before this statement
    if (i > 0) {
      const prevStatement = statements[i - 1];
      console.log(`  -> Previous statement: ${prevStatement.type}`);

      if (prevStatement.type !== 'Semicolon') {
        // Check for newlines between this and previous non-semicolon statement
        let hasNewlineBetween = false;
        for (let j = i - 1; j >= 0; j--) {
          const checkStatement = statements[j];
          console.log(`    -> Checking statement ${j}: ${checkStatement.type}`);

          if (checkStatement.type === 'Newline') {
            hasNewlineBetween = true;
            console.log(`    -> Found newline, will NOT add semicolon`);
            break;
          }
          if (checkStatement.type !== 'Semicolon' && checkStatement.type !== 'Newline') {
            console.log(`    -> Found non-semicolon/non-newline, stopping search`);
            break;
          }
        }

        if (!hasNewlineBetween) {
          console.log(`  -> Will add semicolon`);
        } else {
          console.log(`  -> Will NOT add semicolon (newline found)`);
        }
      }
    }

    console.log(`  -> Adding statement: ${statement.type}`);
  }

} catch (error) {
  console.error('❌ Error:', error.message);
}