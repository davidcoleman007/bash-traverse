const { parse, generate } = require('../dist/index.js');

console.log('=== Pipeline Commands Debug ===\n');

const input = 'version_found=`npm view $package_name versions | grep "$package_version"` || true';

console.log('Input:', input);

try {
  const ast = parse(input);
  const pipeline = ast.body[0];

  console.log('\nPipeline structure:');
  console.log('Commands count:', pipeline.commands.length);
  console.log('Operators:', pipeline.operators);

  // Test generating each command separately
  console.log('\nGenerating commands separately:');
  pipeline.commands.forEach((command, i) => {
    console.log(`\nCommand ${i}:`);
    const commandGenerated = require('../dist/generators/core/generateNode').generateNode(command);
    console.log(`Generated: "${commandGenerated}"`);
    console.log('Length:', commandGenerated.length);
  });

  // Test the pipeline generator manually
  console.log('\nTesting pipeline generator manually:');
  const { generatePipeline } = require('../dist/generators/core/generatePipeline');
  const pipelineGenerated = generatePipeline(pipeline);
  console.log(`Pipeline generated: "${pipelineGenerated}"`);
  console.log('Length:', pipelineGenerated.length);

  // Compare with full generation
  const fullGenerated = generate(ast);
  console.log('\nFull generation:');
  console.log(`"${fullGenerated}"`);
  console.log('Length:', fullGenerated.length);

} catch (error) {
  console.log('Error:', error.message);
}

console.log('\n=== Debug Complete ===');