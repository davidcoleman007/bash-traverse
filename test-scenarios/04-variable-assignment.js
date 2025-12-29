const { parse, generate } = require('../dist/index.js');

console.log('=== Variable Assignment Tests ===\n');

// Test 1: Simple variable assignment
console.log('1. Simple variable assignment:');
const simpleAssignment = 'NODE_ENV=production npm run build';
console.log('Input:', simpleAssignment);
try {
  const ast = parse(simpleAssignment);
  const command = ast.body[0];
  if (command.type === 'Command') {
    console.log('✅ Variable assignment parsed successfully');
    console.log('Command name:', command.name?.text);
    console.log('Arguments:', command.arguments?.map(arg => arg.text));
  } else {
    console.log('❌ Not parsed as Command, got:', command.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 2: Multiple variable assignments
console.log('2. Multiple variable assignments:');
const multipleAssignments = 'NODE_ENV=production DEBUG=true npm run build';
console.log('Input:', multipleAssignments);
try {
  const ast = parse(multipleAssignments);
  const command = ast.body[0];
  if (command.type === 'Command') {
    console.log('✅ Multiple variable assignments parsed successfully');
    console.log('Command name:', command.name?.text);
    console.log('Arguments:', command.arguments?.map(arg => arg.text));
  } else {
    console.log('❌ Not parsed as Command, got:', command.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 3: Variable assignment with quoted values
console.log('3. Variable assignment with quoted values:');
const quotedAssignment = 'MESSAGE="Hello World" echo $MESSAGE';
console.log('Input:', quotedAssignment);
try {
  const ast = parse(quotedAssignment);
  const command = ast.body[0];
  if (command.type === 'Command') {
    console.log('✅ Quoted variable assignment parsed successfully');
    console.log('Command name:', command.name?.text);
    console.log('Arguments:', command.arguments?.map(arg => ({ text: arg.text, quoted: arg.quoted })));
  } else {
    console.log('❌ Not parsed as Command, got:', command.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 4: Variable assignment with complex values
console.log('4. Variable assignment with complex values:');
const complexAssignment = 'PATH="/usr/bin:/usr/local/bin" npm install';
console.log('Input:', complexAssignment);
try {
  const ast = parse(complexAssignment);
  const command = ast.body[0];
  if (command.type === 'Command') {
    console.log('✅ Complex variable assignment parsed successfully');
    console.log('Command name:', command.name?.text);
    console.log('Arguments:', command.arguments?.map(arg => arg.text));
  } else {
    console.log('❌ Not parsed as Command, got:', command.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 5: Variable assignment in pipeline
console.log('5. Variable assignment in pipeline:');
const assignmentInPipeline = 'NODE_ENV=production npm install && npm test';
console.log('Input:', assignmentInPipeline);
try {
  const ast = parse(assignmentInPipeline);
  const pipeline = ast.body[0];
  if (pipeline.type === 'Pipeline') {
    console.log('✅ Variable assignment in pipeline parsed successfully');
    console.log('First command name:', pipeline.commands[0]?.name?.text);
    console.log('First command args:', pipeline.commands[0]?.arguments?.map(arg => arg.text));
    console.log('Operators:', pipeline.operators);
  } else {
    console.log('❌ Not parsed as Pipeline, got:', pipeline.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 6: Code generation for variable assignment
console.log('6. Variable assignment code generation:');
const assignmentToGenerate = 'NODE_ENV=production npm run build';
console.log('Input:', assignmentToGenerate);
try {
  const ast = parse(assignmentToGenerate);
  const generated = generate(ast);
  console.log('Generated:', generated);
  console.log('✅ Generation successful');
} catch (error) {
  console.log('❌ Generation failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 7: Multiple variable assignments across lines
console.log('7. Multiple variable assignments across lines:');
const multiLineAssignments = `NODE_ENV=production npm install
DEBUG=true npm test`;
console.log('Input:');
console.log(multiLineAssignments);
try {
  const ast = parse(multiLineAssignments);
  console.log('✅ Multi-line variable assignments parsed successfully');
  console.log('Number of commands:', ast.body.length);
  console.log('Commands:', ast.body.map(cmd => ({
    name: cmd.name?.text,
    args: cmd.arguments?.map(arg => arg.text)
  })));
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

console.log('🎯 Variable assignment tests completed!');