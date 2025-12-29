const { parse, generate } = require('../dist');

console.log('=== Backslash Line Continuation Examples ===\n');

// Example 1: Simple line continuation
console.log('1. Simple Line Continuation:');
const simpleScript = `echo hello \\
  world`;
console.log('Input:', simpleScript);
const simpleAst = parse(simpleScript);
const simpleGenerated = generate(simpleAst);
console.log('Generated:', simpleGenerated);
console.log('Match:', simpleScript === simpleGenerated);
console.log();

// Example 2: Command with multiple continuations
console.log('2. Command with Multiple Continuations:');
const complexScript = 'echo "hello" \\\n' +
  '  "world" \\\n' +
  '  "test"';
console.log('Input:', complexScript);
const complexAst = parse(complexScript);
const complexGenerated = generate(complexAst);
console.log('Generated:', complexGenerated);
console.log('Match:', complexScript === complexGenerated);
console.log();

// Example 3: Long pipeline with continuations
console.log('3. Long Pipeline with Continuations:');
const pipelineScript = 'npx dc-test-runner \\\n' +
  '  --client=dc-web \\\n' +
  '  --env=stage \\\n' +
  '  --grid=openstack3';
console.log('Input:', pipelineScript);
const pipelineAst = parse(pipelineScript);
const pipelineGenerated = generate(pipelineAst);
console.log('Generated:', pipelineGenerated);
console.log('Match:', pipelineScript === pipelineGenerated);
console.log();

// Example 4: Variable assignment with continuation
console.log('4. Variable Assignment with Continuation:');
const varScript = 'result=$(echo "hello" \\\n' +
  '  | grep "hello" \\\n' +
  '  | wc -l)';
console.log('Input:', varScript);
const varAst = parse(varScript);
const varGenerated = generate(varAst);
console.log('Generated:', varGenerated);
console.log('Match:', varScript === varGenerated);
console.log();

// Example 5: Programmatic generation
console.log('5. Programmatic Generation:');
function createLongCommand(commandName, options) {
  const ast = {
    type: 'Program',
    body: [
      {
        type: 'Command',
        name: { type: 'Word', text: commandName },
        arguments: options.flatMap((option, index) => {
          const parts = [{ type: 'Word', text: option }];
          if (index < options.length - 1) {
            parts.push({ type: 'ContinuationMarker', value: '\\\n' });
          }
          return parts;
        })
      }
    ]
  };

  return generate(ast);
}

const dockerCommand = createLongCommand('docker', [
  'run',
  '--name my-container',
  '--env-file .env',
  '--volume $(pwd):/app',
  '--publish 3000:3000',
  'my-image'
]);

console.log('Generated Docker command:');
console.log(dockerCommand);
console.log();

// Example 6: Complex pipeline generation
console.log('6. Complex Pipeline Generation:');
function createPipeline(commands) {
  const ast = {
    type: 'Program',
    body: [
      {
        type: 'Pipeline',
        commands: commands.map((cmd, index) => ({
          type: 'Command',
          name: { type: 'Word', text: cmd.name },
                  arguments: cmd.args.flatMap((arg, argIndex) => {
          const parts = [{ type: 'Word', text: arg }];
          if (argIndex < cmd.args.length - 1) {
            parts.push({ type: 'ContinuationMarker', value: '\\\n' });
          }
          return parts;
        })
        }))
      }
    ]
  };

  return generate(ast);
}

const pipeline = createPipeline([
  {
    name: 'find',
    args: ['.', '-name', '"*.js"']
  },
  {
    name: 'grep',
    args: ['-v', 'node_modules']
  },
  {
    name: 'xargs',
    args: ['grep', '-l', '"TODO"']
  },
  {
    name: 'head',
    args: ['-10']
  }
]);

console.log('Generated pipeline:');
console.log(pipeline);
console.log();

// Example 7: AST structure analysis
console.log('7. AST Structure Analysis:');
const analysisScript = 'echo hello \\\n' +
  '  world \\\n' +
  '  with \\\n' +
  '  multiple \\\n' +
  '  continuations';

const analysisAst = parse(analysisScript);
console.log('Script:', analysisScript);
console.log('AST body length:', analysisAst.body.length);

// Count different node types
const nodeTypes = {};
function countNodeTypes(node) {
  if (!node) return;

  nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;

  if (node.body && Array.isArray(node.body)) {
    node.body.forEach(countNodeTypes);
  }
  if (node.arguments && Array.isArray(node.arguments)) {
    node.arguments.forEach(countNodeTypes);
  }
  if (node.statements && Array.isArray(node.statements)) {
    node.statements.forEach(countNodeTypes);
  }
}

countNodeTypes(analysisAst);
console.log('Node type distribution:');
Object.entries(nodeTypes)
  .sort(([,a], [,b]) => b - a)
  .forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

// Count line continuations
const lineContinuations = analysisAst.body.filter(node =>
  node.type === 'LineContinuation'
).length;
console.log(`LineContinuation nodes: ${lineContinuations}`);
console.log();

// Example 8: Round-trip fidelity test
console.log('8. Round-Trip Fidelity Test:');
const testScripts = [
  'echo hello \\\n  world',
  'sed -E \\\n  -e "s/old/new/" \\\n  -e "s/foo/bar/" \\\n  file.txt',
  'npx dc-test-runner \\\n  --client=dc-web \\\n  --env=stage \\\n  --grid=openstack3'
];

let perfectMatches = 0;
testScripts.forEach((script, index) => {
  const ast = parse(script);
  const generated = generate(ast);
  const isMatch = script === generated;
  if (isMatch) perfectMatches++;

  console.log(`Test ${index + 1}: ${isMatch ? '✅ PASS' : '❌ FAIL'}`);
  if (!isMatch) {
    console.log(`  Original: "${script}"`);
    console.log(`  Generated: "${generated}"`);
  }
});

console.log(`\nResults: ${perfectMatches}/${testScripts.length} perfect matches`);
console.log();

console.log('=== Examples Complete ===');