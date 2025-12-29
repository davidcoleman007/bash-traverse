const { parse, generate } = require('../dist/index.js');

const source = `case $var in
    start)
        echo "Starting"
        ;;
    stop)
        echo "Stopping"
        ;;
esac`;

console.log('=== Case Statement Structural Debug ===\n');

try {
  // Parse the source
  const ast = parse(source);
  console.log('✅ Parsed successfully');

  // Generate from AST
  const generated = generate(ast);
  console.log('✅ Generated successfully');

  // Normalize both strings for comparison (remove all whitespace differences)
  const normalize = (str) => str.replace(/\s+/g, ' ').trim();

  const normalizedOriginal = normalize(source);
  const normalizedGenerated = normalize(generated);

  console.log('\nNormalized comparison:');
  console.log('Original (normalized):', JSON.stringify(normalizedOriginal));
  console.log('Generated (normalized):', JSON.stringify(normalizedGenerated));

  if (normalizedOriginal === normalizedGenerated) {
    console.log('\n✅ Structural round-trip successful - Content is identical when normalized');
  } else {
    console.log('\n❌ Structural round-trip failed - Content differs even when normalized');

    // Show the differences
    console.log('\nDetailed comparison:');
    console.log('Original tokens:', source.split(/\s+/).filter(s => s.length > 0));
    console.log('Generated tokens:', generated.split(/\s+/).filter(s => s.length > 0));
  }

} catch (error) {
  console.error('❌ Error:', error.message);
}