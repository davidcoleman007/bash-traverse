const { parse, generate } = require('../dist/index.js');

// Test case statement generation
const input = `case $1 in
    start)
        echo "Starting..."
        ;;
    stop)
        echo "Stopping..."
        ;;
    *)
        echo "Unknown command"
        ;;
esac`;

console.log('=== Case Statement Semicolon Debug ===\n');

console.log('Input:');
console.log(input);
console.log('\n--- Parsing ---');
const ast = parse(input);
console.log('✅ Parse successful');

console.log('\n--- Generation ---');
const generated = generate(ast);
console.log('Generated:');
console.log(generated);

console.log('\n--- Round-trip Parse ---');
const roundTripAst = parse(generated);
console.log('✅ Round-trip parse successful');

console.log('\n--- Round-trip Generation ---');
const roundTripGenerated = generate(roundTripAst);
console.log('Round-trip generated:');
console.log(roundTripGenerated);

console.log('\n--- Comparison ---');
console.log('First generation length:', generated.length);
console.log('Round-trip generation length:', roundTripGenerated.length);
console.log('Match:', generated === roundTripGenerated ? '✅ YES' : '❌ NO');

// Show the differences
if (generated !== roundTripGenerated) {
  console.log('\n--- Differences ---');
  console.log('First generation:');
  console.log(JSON.stringify(generated));
  console.log('\nRound-trip generation:');
  console.log(JSON.stringify(roundTripGenerated));
}