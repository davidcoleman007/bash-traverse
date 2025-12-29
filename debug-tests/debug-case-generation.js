const { parse, generate } = require('../dist/index.js');

const source = `case $var in
    start)
        echo "Starting"
        ;;
    stop)
        echo "Stopping"
        ;;
esac`;

console.log('=== Case Statement Generation Debug ===\n');
console.log('Original source:');
console.log(JSON.stringify(source, null, 2));
console.log('\n---\n');

try {
  // Parse the source
  const ast = parse(source);
  console.log('✅ Parsed successfully');

  // Generate from AST
  const generated = generate(ast);
  console.log('Generated output:');
  console.log(JSON.stringify(generated, null, 2));
  console.log('\n---\n');

  // Compare
  console.log('Original vs Generated:');
  console.log('Original:');
  console.log(source);
  console.log('\nGenerated:');
  console.log(generated);
  console.log('\n---\n');

  // Check if they match
  if (source === generated) {
    console.log('✅ Round-trip successful - Original and generated are identical');
  } else {
    console.log('❌ Round-trip failed - Original and generated differ');
    console.log('\nDifferences:');
    console.log('Original length:', source.length);
    console.log('Generated length:', generated.length);

    // Show character-by-character comparison
    const minLength = Math.min(source.length, generated.length);
    for (let i = 0; i < minLength; i++) {
      if (source[i] !== generated[i]) {
        console.log(`Mismatch at position ${i}: original="${source[i]}" (${source.charCodeAt(i)}) vs generated="${generated[i]}" (${generated.charCodeAt(i)})`);
        break;
      }
    }
  }

} catch (error) {
  console.error('❌ Error:', error.message);
}