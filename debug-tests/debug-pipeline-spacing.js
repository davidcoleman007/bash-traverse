const { parse, generate } = require('../dist/index.js');

console.log('=== Pipeline Spacing Debug ===\n');

const input = 'version_found=`npm view $package_name versions | grep "$package_version"` || true';

console.log('Input:', input);
console.log('Input with visible spaces:');
console.log(input.replace(/ /g, '_'));

try {
  const ast = parse(input);

  // Look for space tokens in the first command
  const firstCommand = ast.body[0].commands[0];
  console.log('\nFirst command arguments:');
  firstCommand.arguments.forEach((arg, i) => {
    console.log(`  ${i}: ${arg.type} - "${arg.text || arg.value || 'N/A'}"`);
  });

  console.log('\nGenerated:');
  const generated = generate(ast);
  console.log(generated);
  console.log('Generated with visible spaces:');
  console.log(generated.replace(/ /g, '_'));

} catch (error) {
  console.log('Error:', error.message);
}

console.log('\n=== Debug Complete ===');