const { parse, generate } = require('../dist/index.js');

console.log('=== Command Concatenation Debug ===\n');

const input = 'version_found=`npm view $package_name versions | grep "$package_version"` || true';

console.log('Input:', input);

try {
  const ast = parse(input);

  // Look at the first command
  const firstCommand = ast.body[0].commands[0];
  console.log('\nFirst command structure:');
  console.log('Name:', firstCommand.name.text);
  console.log('Arguments count:', firstCommand.arguments.length);

  // Test generating each part separately
  console.log('\nGenerating parts separately:');
  const parts = [];

  // Command name
  const namePart = require('../dist/generators/text/generateWord').generateWord(firstCommand.name);
  parts.push(namePart);
  console.log(`Name part: "${namePart}"`);

  // Arguments
  firstCommand.arguments.forEach((arg, i) => {
    const argPart = require('../dist/generators/core/generateNode').generateNode(arg);
    parts.push(argPart);
    console.log(`Arg ${i} part: "${argPart}"`);
  });

  // Concatenate manually
  const manualResult = parts.join('');
  console.log('\nManual concatenation result:');
  console.log(`"${manualResult}"`);
  console.log('Length:', manualResult.length);

  // Compare with full generation
  const fullGenerated = generate(ast);
  console.log('\nFull generation result:');
  console.log(`"${fullGenerated}"`);
  console.log('Length:', fullGenerated.length);

  // Check if they match
  if (manualResult === fullGenerated) {
    console.log('\n✅ Manual and full generation match');
  } else {
    console.log('\n❌ Manual and full generation differ');
    console.log('Manual:', manualResult);
    console.log('Full:', fullGenerated);
  }

} catch (error) {
  console.log('Error:', error.message);
}

console.log('\n=== Debug Complete ===');