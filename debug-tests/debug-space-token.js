const { parse, generate } = require('../dist/index.js');

console.log('=== Space Token Debug ===\n');

const input = 'version_found=`npm view $package_name versions | grep "$package_version"` || true';

console.log('Input:', input);

try {
  const ast = parse(input);

  // Look at the first command's arguments
  const firstCommand = ast.body[0].commands[0];
  console.log('\nFirst command arguments:');
  firstCommand.arguments.forEach((arg, i) => {
    console.log(`  ${i}: ${arg.type} - "${arg.text || arg.value || 'N/A'}"`);
    if (arg.type === 'Word') {
      console.log(`    Word details: text="${arg.text}", quoted=${arg.quoted}`);
    }
  });

  // Test generating just the space token
  const spaceToken = firstCommand.arguments[2]; // The space token
  console.log('\nTesting space token generation:');
  console.log('Space token:', spaceToken);
  const generatedSpace = require('../dist/generators/text/generateWord').generateWord(spaceToken);
  console.log('Generated space:', `"${generatedSpace}"`);
  console.log('Space char codes:', generatedSpace.split('').map(c => c.charCodeAt(0)));

  console.log('\nFull generated:');
  const generated = generate(ast);
  console.log(generated);

} catch (error) {
  console.log('Error:', error.message);
}

console.log('\n=== Debug Complete ===');