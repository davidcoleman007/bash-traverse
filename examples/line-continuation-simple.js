const { parse, generate } = require('../dist');

console.log('=== Simple Backslash Line Continuation Examples ===\n');

// Example 1: Basic line continuation
console.log('1. Basic Line Continuation:');
const basicScript = 'echo hello \\\n  world';
console.log('Input:', basicScript);
const basicAst = parse(basicScript);
const basicGenerated = generate(basicAst);
console.log('Generated:', basicGenerated);
console.log('Match:', basicScript === basicGenerated);
console.log();

// Example 2: Manual AST construction
console.log('2. Manual AST Construction:');
const manualAst = {
  type: 'Program',
  body: [
    {
      type: 'Command',
      name: { type: 'Word', text: 'echo' },
      arguments: [
        { type: 'Word', text: 'hello' },
        { type: 'LineContinuation', value: '\\\n' },
        { type: 'Word', text: 'world' }
      ]
    }
  ]
};

const manualGenerated = generate(manualAst);
console.log('Generated from manual AST:');
console.log(manualGenerated);
console.log();

// Example 3: Programmatic generation function
console.log('3. Programmatic Generation:');
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
            parts.push({ type: 'LineContinuation', value: '\\\n' });
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

// Example 4: AST structure analysis
console.log('4. AST Structure Analysis:');
const analysisScript = 'echo hello \\\n  world \\\n  with \\\n  continuations';

const analysisAst = parse(analysisScript);
console.log('Script:', analysisScript);
console.log('AST body length:', analysisAst.body.length);

// Count line continuations
const lineContinuations = analysisAst.body.filter(node =>
  node.type === 'LineContinuation'
).length;
console.log(`LineContinuation nodes: ${lineContinuations}`);

// Show AST structure
console.log('AST structure:');
console.log(JSON.stringify(analysisAst, null, 2));
console.log();

console.log('=== Simple Examples Complete ===');