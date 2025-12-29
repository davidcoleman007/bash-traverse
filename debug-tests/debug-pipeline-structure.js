const { parse, generate } = require('../dist/index.js');

console.log('=== Pipeline Structure Debug ===\n');

const input = 'version_found=`npm view $package_name versions | grep "$package_version"` || true';

console.log('Input:', input);

try {
  const ast = parse(input);
  console.log('\nAST structure:');
  console.log(JSON.stringify(ast, null, 2));

  console.log('\nGenerated:');
  const generated = generate(ast);
  console.log(generated);

} catch (error) {
  console.log('Error:', error.message);
}

console.log('\n=== Debug Complete ===');