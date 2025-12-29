const { parse, generate } = require('../dist/index.js');

console.log('=== Function Parsing Tests ===\n');

// Test 1: Function with parentheses syntax
console.log('1. Function with parentheses syntax:');
const functionWithParens = `function test() {
    echo "hello"
}`;
console.log('Input:');
console.log(functionWithParens);
try {
  const ast = parse(functionWithParens);
  const functionDef = ast.body.find(node => node.type === 'FunctionDefinition');
  if (functionDef) {
    console.log('✅ Function parsed successfully');
    console.log('Function name:', functionDef.name?.text);
    console.log('Has parentheses:', functionDef.hasParentheses);
    console.log('Body statements:', functionDef.body.length);

    if (functionDef.body.length > 0) {
      const firstCommand = functionDef.body[0];
      console.log('First command type:', firstCommand.type);
      if (firstCommand.type === 'Command') {
        console.log('Command name:', firstCommand.name?.text);
        console.log('Arguments:', firstCommand.arguments?.map(arg => arg.text));
      }
    }
  } else {
    console.log('❌ Function not found in AST');
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 2: Function with brace syntax
console.log('2. Function with brace syntax:');
const functionWithBraces = `function test {
    echo "hello"
}`;
console.log('Input:');
console.log(functionWithBraces);
try {
  const ast = parse(functionWithBraces);
  const functionDef = ast.body.find(node => node.type === 'FunctionDefinition');
  if (functionDef) {
    console.log('✅ Function parsed successfully');
    console.log('Function name:', functionDef.name?.text);
    console.log('Has parentheses:', functionDef.hasParentheses);
    console.log('Body statements:', functionDef.body.length);
  } else {
    console.log('❌ Function not found in AST');
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 3: Function with multiple commands
console.log('3. Function with multiple commands:');
const functionWithMultipleCommands = `function build() {
    npm install
    npm test
    npm run build
}`;
console.log('Input:');
console.log(functionWithMultipleCommands);
try {
  const ast = parse(functionWithMultipleCommands);
  const functionDef = ast.body.find(node => node.type === 'FunctionDefinition');
  if (functionDef) {
    console.log('✅ Function parsed successfully');
    console.log('Body statements:', functionDef.body.length);
    console.log('Commands:', functionDef.body.map(stmt =>
      stmt.type === 'Command' ? stmt.name?.text : stmt.type
    ));
  } else {
    console.log('❌ Function not found in AST');
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 4: Function with complex body
console.log('4. Function with complex body:');
const functionWithComplexBody = `function deploy() {
    echo "Starting deployment..."
    if [ -f "package.json" ]; then
        npm install
    fi
    echo "Deployment complete"
}`;
console.log('Input:');
console.log(functionWithComplexBody);
try {
  const ast = parse(functionWithComplexBody);
  const functionDef = ast.body.find(node => node.type === 'FunctionDefinition');
  if (functionDef) {
    console.log('✅ Function parsed successfully');
    console.log('Body statements:', functionDef.body.length);
    console.log('Statement types:', functionDef.body.map(stmt => stmt.type));
  } else {
    console.log('❌ Function not found in AST');
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 5: Code generation
console.log('5. Function code generation:');
const functionToGenerate = `function test() {
    echo "hello"
}`;
console.log('Input:');
console.log(functionToGenerate);
try {
  const ast = parse(functionToGenerate);
  const generated = generate(ast);
  console.log('Generated:');
  console.log(generated);
  console.log('✅ Generation successful');
} catch (error) {
  console.log('❌ Generation failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

console.log('🎯 Function parsing tests completed!');