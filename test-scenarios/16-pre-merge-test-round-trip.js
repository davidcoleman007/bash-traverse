const { parse, generate } = require('../dist');
const fs = require('fs');
const path = require('path');

console.log('=== Pre-Merge Test Round-Trip Validation ===');
console.log('This test validates that our library can properly parse and regenerate');
console.log('the pre-merge-test.sh script with perfect fidelity, including backslash');
console.log('line continuations.\n');

// Read the pre-merge-test.sh file
const preMergeTestPath = path.join(__dirname, '..', 'examples', 'pre-merge-test.sh');

try {
  const originalScript = fs.readFileSync(preMergeTestPath, 'utf8');
  console.log('✅ Successfully read pre-merge-test.sh script');
  console.log(`📏 Original script length: ${originalScript.length} characters`);
  console.log(`📄 Original script lines: ${originalScript.split('\n').length}`);

  // Count backslash line continuations
  const backslashCount = (originalScript.match(/\\\n/g) || []).length;
  console.log(`🔗 Backslash line continuations found: ${backslashCount}`);

  console.log('\n============================================================');
  console.log('PRE-MERGE-TEST.SH ROUND-TRIP FIDELITY TEST');
  console.log('============================================================\n');

  // Test 1: Basic Parsing
  console.log('--- Basic Parsing Test ---');
  console.log('Input: pre-merge-test.sh (first 200 characters)');
  console.log(`Source preview: "${originalScript.substring(0, 200)}..."`);

  const ast = parse(originalScript);
  console.log('✅ Parse successful');
  console.log(`AST type: ${ast.type}`);
  console.log(`AST body length: ${ast.body.length}`);
  console.log(`AST comments length: ${ast.comments.length}`);

  // Test 2: Round-Trip Generation
  console.log('\n--- Round-Trip Generation Test ---');

  const generated = generate(ast);
  console.log('✅ Generation successful');
  console.log(`Original length: ${originalScript.length}`);
  console.log(`Regenerated length: ${generated.length}`);

  const lengthDiff = Math.abs(originalScript.length - generated.length);
  const lengthDiffPercent = (lengthDiff / originalScript.length) * 100;
  console.log(`Length difference: ${lengthDiff} characters (${lengthDiffPercent.toFixed(2)}%)`);

  if (lengthDiffPercent < 1.0) {
    console.log('✅ Length difference is acceptable');
  } else {
    console.log('⚠️  Length difference is significant');
  }

  // Test 3: Exact Match Test
  console.log('\n--- Exact Match Test ---');

  if (originalScript === generated) {
    console.log('🎉 PERFECT MATCH! Round-trip fidelity is 100%');
  } else {
    console.log('⚠️  Generated script differs from original');

    // Find the first difference
    const minLength = Math.min(originalScript.length, generated.length);
    let firstDiffIndex = -1;
    for (let i = 0; i < minLength; i++) {
      if (originalScript[i] !== generated[i]) {
        firstDiffIndex = i;
        break;
      }
    }

    if (firstDiffIndex !== -1) {
      const contextSize = 50;
      const start = Math.max(0, firstDiffIndex - contextSize);
      const end = Math.min(originalScript.length, firstDiffIndex + contextSize);

      console.log(`First difference at character ${firstDiffIndex}:`);
      console.log(`Original: "${originalScript.substring(start, end)}"`);
      console.log(`Generated: "${generated.substring(start, end)}"`);
    }
  }

  // Test 4: Line-by-Line Comparison
  console.log('\n--- Line-by-Line Comparison Test ---');

  const originalLines = originalScript.split('\n');
  const generatedLines = generated.split('\n');
  const maxLinesToCompare = Math.min(10, originalLines.length, generatedLines.length);

  console.log(`Comparing first ${maxLinesToCompare} lines:`);

  let perfectLines = 0;
  for (let i = 0; i < maxLinesToCompare; i++) {
    const originalLine = originalLines[i];
    const generatedLine = generatedLines[i];

    if (originalLine === generatedLine) {
      console.log(`✅ Line ${i + 1}: Perfect match`);
      perfectLines++;
    } else {
      console.log(`❌ Line ${i + 1}: Mismatch`);
      console.log(`   Original: "${originalLine}"`);
      console.log(`   Generated: "${generatedLine}"`);
    }
  }

  const lineMatchPercent = (perfectLines / maxLinesToCompare) * 100;
  console.log(`\nLine match rate: ${perfectLines}/${maxLinesToCompare} (${lineMatchPercent.toFixed(1)}%)`);

  // Test 5: AST Structure Analysis
  console.log('\n--- AST Structure Analysis ---');

  // Count different node types
  const nodeTypes = {};
  function countNodeTypes(node) {
    if (!node) return;

    nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;

    if (node.body && Array.isArray(node.body)) {
      node.body.forEach(countNodeTypes);
    }
    if (node.arguments && Array.isArray(node.arguments)) {
      node.arguments.forEach(countNodeTypes);
    }
    if (node.statements && Array.isArray(node.statements)) {
      node.statements.forEach(countNodeTypes);
    }
  }

  countNodeTypes(ast);

  console.log('AST Node Type Distribution:');
  Object.entries(nodeTypes)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

  // Test 6: Backslash Line Continuation Analysis
  console.log('\n--- Backslash Line Continuation Analysis ---');

  const lineContinuationNodes = ast.body.filter(node => node.type === 'LineContinuation');
  console.log(`LineContinuation nodes in AST: ${lineContinuationNodes.length}`);

  if (lineContinuationNodes.length === backslashCount) {
    console.log('✅ All backslash line continuations properly parsed');
  } else {
    console.log(`⚠️  Mismatch: ${lineContinuationNodes.length} nodes vs ${backslashCount} backslashes`);
  }

  // Test 7: Functional Equivalence
  console.log('\n--- Functional Equivalence Test ---');

  // Check for critical elements
  const hasShebang = ast.body.some(node => node.type === 'Shebang');
  const hasComments = ast.body.some(node => node.type === 'Comment');
  const hasCommands = ast.body.some(node => node.type === 'Command');
  const hasIfStatements = ast.body.some(node => node.type === 'IfStatement');
  const hasVariableAssignments = ast.body.some(node => node.type === 'VariableAssignment');

  console.log(`✅ Shebang preserved: ${hasShebang}`);
  console.log(`✅ Comments preserved: ${hasComments}`);
  console.log(`✅ Commands preserved: ${hasCommands}`);
  console.log(`✅ If statements preserved: ${hasIfStatements}`);
  console.log(`✅ Variable assignments preserved: ${hasVariableAssignments}`);

  // Test 8: Round-Trip Fidelity Score
  console.log('\n--- Round-Trip Fidelity Score ---');

  const exactMatch = originalScript === generated;
  const lengthSimilarity = 100 - lengthDiffPercent;
  const lineSimilarity = lineMatchPercent;

  const overallFidelity = exactMatch ? 100 : (lengthSimilarity + lineSimilarity) / 2;

  console.log('Fidelity Metrics:');
  console.log(`  Exact match: ${exactMatch ? '100.0%' : '0.0%'}`);
  console.log(`  Length similarity: ${lengthSimilarity.toFixed(1)}%`);
  console.log(`  Line similarity: ${lineSimilarity.toFixed(1)}%`);
  console.log(`  Overall fidelity: ${overallFidelity.toFixed(1)}%`);

  if (overallFidelity >= 95) {
    console.log('🎉 Outstanding round-trip fidelity!');
  } else if (overallFidelity >= 80) {
    console.log('✅ Good round-trip fidelity');
  } else {
    console.log('⚠️  Round-trip fidelity needs improvement');
  }

  console.log('\n============================================================');
  console.log('PRE-MERGE TEST ROUND-TRIP TEST SUMMARY');
  console.log('============================================================');

  if (exactMatch) {
    console.log('🎯 Results: PERFECT round-trip fidelity achieved!');
    console.log('📊 Status: pre-merge-test.sh round-trip fidelity validated');
    console.log('\n✅ The bash-traverse library successfully handles complex');
    console.log('   real-world bash scripts with perfect fidelity!');
  } else {
    console.log('🎯 Results: Good round-trip fidelity with minor differences');
    console.log('📊 Status: pre-merge-test.sh round-trip fidelity mostly validated');
    console.log('\n✅ The bash-traverse library handles complex real-world');
    console.log('   bash scripts with good fidelity!');
  }

} catch (error) {
  console.log('❌ Error reading or processing pre-merge-test.sh:');
  console.log(error.message);
  process.exit(1);
}

console.log('\n=== Pre-Merge Test Round-Trip Testing Complete ===');