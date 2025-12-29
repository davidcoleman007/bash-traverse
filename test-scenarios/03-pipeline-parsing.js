const { parse, generate } = require('../dist/index.js');

console.log('=== Pipeline and Compound Command Tests ===\n');

// Test 1: Simple pipeline with |
console.log('1. Simple pipeline with |:');
const simplePipeline = 'npm install | grep "success"';
console.log('Input:', simplePipeline);
try {
  const ast = parse(simplePipeline);
  const pipeline = ast.body[0];
  if (pipeline.type === 'Pipeline') {
    console.log('✅ Pipeline parsed successfully');
    console.log('Number of commands:', pipeline.commands.length);
    console.log('Operators:', pipeline.operators);
    console.log('Commands:', pipeline.commands.map(cmd => cmd.name?.text));
  } else {
    console.log('❌ Not parsed as Pipeline, got:', pipeline.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 2: Compound command with &&
console.log('2. Compound command with &&:');
const compoundAnd = 'npm install && npm test';
console.log('Input:', compoundAnd);
try {
  const ast = parse(compoundAnd);
  const pipeline = ast.body[0];
  if (pipeline.type === 'Pipeline') {
    console.log('✅ Compound command parsed successfully');
    console.log('Number of commands:', pipeline.commands.length);
    console.log('Operators:', pipeline.operators);
    console.log('Commands:', pipeline.commands.map(cmd => cmd.name?.text));
  } else {
    console.log('❌ Not parsed as Pipeline, got:', pipeline.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 3: Compound command with ||
console.log('3. Compound command with ||:');
const compoundOr = 'npm install || echo "failed"';
console.log('Input:', compoundOr);
try {
  const ast = parse(compoundOr);
  const pipeline = ast.body[0];
  if (pipeline.type === 'Pipeline') {
    console.log('✅ Compound command parsed successfully');
    console.log('Number of commands:', pipeline.commands.length);
    console.log('Operators:', pipeline.operators);
    console.log('Commands:', pipeline.commands.map(cmd => cmd.name?.text));
  } else {
    console.log('❌ Not parsed as Pipeline, got:', pipeline.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 4: Complex pipeline with multiple operators
console.log('4. Complex pipeline with multiple operators:');
const complexPipeline = 'npm install && npm test || echo "failed"';
console.log('Input:', complexPipeline);
try {
  const ast = parse(complexPipeline);
  const pipeline = ast.body[0];
  if (pipeline.type === 'Pipeline') {
    console.log('✅ Complex pipeline parsed successfully');
    console.log('Number of commands:', pipeline.commands.length);
    console.log('Operators:', pipeline.operators);
    console.log('Commands:', pipeline.commands.map(cmd => cmd.name?.text));
  } else {
    console.log('❌ Not parsed as Pipeline, got:', pipeline.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 5: Pipeline with arguments
console.log('5. Pipeline with arguments:');
const pipelineWithArgs = 'npm install --save-dev | grep "added"';
console.log('Input:', pipelineWithArgs);
try {
  const ast = parse(pipelineWithArgs);
  const pipeline = ast.body[0];
  if (pipeline.type === 'Pipeline') {
    console.log('✅ Pipeline with arguments parsed successfully');
    console.log('First command args:', pipeline.commands[0]?.arguments?.map(arg => arg.text));
    console.log('Second command args:', pipeline.commands[1]?.arguments?.map(arg => arg.text));
  } else {
    console.log('❌ Not parsed as Pipeline, got:', pipeline.type);
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 6: Code generation for pipeline
console.log('6. Pipeline code generation:');
const pipelineToGenerate = 'npm install && npm test';
console.log('Input:', pipelineToGenerate);
try {
  const ast = parse(pipelineToGenerate);
  const generated = generate(ast);
  console.log('Generated:', generated);
  console.log('✅ Generation successful');
} catch (error) {
  console.log('❌ Generation failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 7: Multiple pipelines
console.log('7. Multiple pipelines:');
const multiplePipelines = `npm install | grep "success"
npm test && npm run build`;
console.log('Input:');
console.log(multiplePipelines);
try {
  const ast = parse(multiplePipelines);
  console.log('✅ Multiple pipelines parsed successfully');
  console.log('Number of statements:', ast.body.length);
  console.log('Statement types:', ast.body.map(stmt => stmt.type));
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

console.log('🎯 Pipeline parsing tests completed!');