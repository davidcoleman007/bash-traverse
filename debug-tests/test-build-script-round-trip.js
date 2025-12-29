const { parse, generate } = require('../dist/index.js');
const fs = require('fs');
const path = require('path');

console.log('=== Build Script Round-Trip Test ===\n');
console.log('Testing our primary use case: examples/build.sh\n');

// Read the original build.sh file
const buildScriptPath = path.join(__dirname, '..', 'examples', 'build.sh');
const originalScript = fs.readFileSync(buildScriptPath, 'utf8');

console.log('📁 Original script length:', originalScript.length, 'characters');
console.log('📁 Original script lines:', originalScript.split('\n').length);

// Test round-trip fidelity
try {
  console.log('\n🔄 Step 1: Parsing original script...');
  const ast = parse(originalScript);
  console.log('✅ Parse successful');

  console.log('\n🔄 Step 2: Generating code from AST...');
  const generated = generate(ast);
  console.log('✅ Generation successful');

  console.log('\n📊 Comparison Analysis:');
  console.log('='.repeat(50));
  console.log('Original length:', originalScript.length);
  console.log('Generated length:', generated.length);
  console.log('Length difference:', Math.abs(originalScript.length - generated.length));

  // Character-by-character comparison
  const minLength = Math.min(originalScript.length, generated.length);
  let firstDifference = -1;
  let differences = 0;

  for (let i = 0; i < minLength; i++) {
    if (originalScript[i] !== generated[i]) {
      if (firstDifference === -1) {
        firstDifference = i;
      }
      differences++;
    }
  }

  console.log('\n🔍 Character Analysis:');
  console.log('='.repeat(50));
  console.log('Total differences:', differences);
  console.log('Difference percentage:', ((differences / originalScript.length) * 100).toFixed(2) + '%');

  if (firstDifference !== -1) {
    console.log('\n📍 First difference at position:', firstDifference);
    const contextSize = 50;
    const start = Math.max(0, firstDifference - contextSize);
    const end = Math.min(originalScript.length, firstDifference + contextSize);

    console.log('\nOriginal context:');
    console.log('"' + originalScript.substring(start, end) + '"');
    console.log('Generated context:');
    console.log('"' + generated.substring(start, end) + '"');

    console.log('\nCharacter codes:');
    console.log('Original:', originalScript.charCodeAt(firstDifference), '("' + originalScript[firstDifference] + '")');
    console.log('Generated:', generated.charCodeAt(firstDifference), '("' + generated[firstDifference] + '")');
  }

  // Test if generated script is valid bash
  console.log('\n🧪 Testing generated script validity...');
  const testFile = 'test-build-generated.sh';
  fs.writeFileSync(testFile, generated);

  const { execSync } = require('child_process');
  try {
    // Test syntax without executing
    execSync(`bash -n ${testFile}`, { encoding: 'utf8' });
    console.log('✅ Generated script has valid bash syntax');
  } catch (syntaxError) {
    console.log('❌ Generated script has syntax errors:', syntaxError.message);
  }

  // Test round-trip fidelity
  console.log('\n🔄 Step 3: Testing round-trip fidelity...');
  const roundTripAst = parse(generated);
  const roundTripGenerated = generate(roundTripAst);

  if (generated === roundTripGenerated) {
    console.log('✅ Round-trip fidelity: PERFECT');
  } else {
    console.log('❌ Round-trip fidelity: FAILED');
    console.log('First generation length:', generated.length);
    console.log('Round-trip generation length:', roundTripGenerated.length);
  }

  // Overall assessment
  console.log('\n🎯 Overall Assessment:');
  console.log('='.repeat(50));

  if (differences === 0) {
    console.log('🎉 PERFECT FIDELITY! Original and generated are identical!');
  } else if (differences < 10) {
    console.log('✅ EXCELLENT FIDELITY! Only minor differences detected.');
  } else if (differences < 50) {
    console.log('✅ GOOD FIDELITY! Some differences but within acceptable range.');
  } else if (differences < 100) {
    console.log('⚠️  MODERATE FIDELITY! Several differences detected.');
  } else {
    console.log('❌ POOR FIDELITY! Many differences detected.');
  }

  // Clean up
  fs.unlinkSync(testFile);

} catch (error) {
  console.log('❌ Test failed:', error.message);
  console.log('Stack trace:', error.stack);
}

console.log('\n=== Build Script Round-Trip Test Complete ===');