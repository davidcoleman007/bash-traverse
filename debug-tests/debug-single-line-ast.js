const { parse, generate } = require('../dist/index.js');

console.log('=== Single-Line If-Else AST Analysis ===\n');

const input = 'if [ -f file.txt ]; then echo "exists"; else echo "not found"; fi';
console.log('Input:', input);

try {
  const ast = parse(input);
  console.log('\nAST structure:');
  console.log(JSON.stringify(ast, null, 2));

  console.log('\nGenerated:');
  const generated = generate(ast);
  console.log(generated);

  console.log('\nCharacter analysis:');
  console.log('Input length:', input.length);
  console.log('Generated length:', generated.length);

  // Find where the difference is
  const minLength = Math.min(input.length, generated.length);
  for (let i = 0; i < minLength; i++) {
    if (input[i] !== generated[i]) {
      console.log(`First difference at position ${i}:`);
      console.log(`  Input: '${input[i]}' (${input.charCodeAt(i)})`);
      console.log(`  Generated: '${generated[i]}' (${generated.charCodeAt(i)})`);
      console.log(`  Context: "${input.substring(Math.max(0, i-10), i+10)}"`);
      console.log(`  Generated context: "${generated.substring(Math.max(0, i-10), i+10)}"`);
      break;
    }
  }

} catch (error) {
  console.log('Error:', error.message);
}