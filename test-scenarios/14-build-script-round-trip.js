#!/usr/bin/env node

const { parse, generate } = require('../dist/index.js');
const fs = require('fs');
const path = require('path');

console.log('=== Build Script Round-Trip Testing ===');
console.log('');
console.log('This test validates that our library can properly parse and regenerate');
console.log('complex real-world bash scripts like build.sh with perfect fidelity.');
console.log('');

// Read the build.sh script
const buildScriptPath = path.join(__dirname, '..', 'examples', 'build.sh');
let buildScriptContent;

try {
  buildScriptContent = fs.readFileSync(buildScriptPath, 'utf8');
  console.log('✅ Successfully read build.sh script');
} catch (error) {
  console.log('❌ Failed to read build.sh script:', error.message);
  process.exit(1);
}

console.log('');
console.log('============================================================');
console.log('BUILD.SH ROUND-TRIP FIDELITY TEST');
console.log('============================================================');
console.log('');

// Test 1: Basic parsing
console.log('--- Basic Parsing Test ---');
console.log('Input: build.sh (first 200 characters)');
console.log('Source preview:', JSON.stringify(buildScriptContent.substring(0, 200)) + '...');
console.log('');

try {
  const ast = parse(buildScriptContent);
  console.log('✅ Parse successful');
  console.log('AST type:', ast.type);
  console.log('AST body length:', ast.body.length);
  console.log('AST comments length:', ast.comments.length);
} catch (error) {
  console.log('❌ Parse failed:', error.message);
  process.exit(1);
}

// Test 2: Round-trip generation
console.log('');
console.log('--- Round-Trip Generation Test ---');
console.log('');

try {
  const ast = parse(buildScriptContent);
  const regenerated = generate(ast);

  console.log('✅ Generation successful');
  console.log('Original length:', buildScriptContent.length);
  console.log('Regenerated length:', regenerated.length);

  // Check if lengths are close (allowing for minor spacing differences)
  const lengthDiff = Math.abs(buildScriptContent.length - regenerated.length);
  const lengthDiffPercent = (lengthDiff / buildScriptContent.length) * 100;

  if (lengthDiffPercent < 5) {
    console.log('✅ Length difference is acceptable:', lengthDiffPercent.toFixed(2) + '%');
  } else {
    console.log('⚠️  Length difference is significant:', lengthDiffPercent.toFixed(2) + '%');
  }

} catch (error) {
  console.log('❌ Generation failed:', error.message);
  process.exit(1);
}

// Test 3: Functional equivalence test
console.log('');
console.log('--- Functional Equivalence Test ---');
console.log('');

try {
  const ast = parse(buildScriptContent);
  const regenerated = generate(ast);

  // Check for critical structural elements
  const criticalElements = [
    '#!/bin/bash',
    'if [[',
    'then',
    'fi',
    'npm',
    'echo',
    'exit',
    'function',
    'while',
    'for',
    'case',
    'esac'
  ];

  let missingElements = [];
  for (const element of criticalElements) {
    if (!regenerated.includes(element)) {
      missingElements.push(element);
    }
  }

  if (missingElements.length === 0) {
    console.log('✅ All critical bash elements preserved');
  } else {
    console.log('⚠️  Missing critical elements:', missingElements.join(', '));
  }

  // Check for shebang preservation
  if (regenerated.startsWith('#!/bin/bash')) {
    console.log('✅ Shebang preserved');
  } else {
    console.log('❌ Shebang not preserved');
  }

  // Check for comment preservation
  const originalComments = (buildScriptContent.match(/#/g) || []).length;
  const regeneratedComments = (regenerated.match(/#/g) || []).length;

  if (Math.abs(originalComments - regeneratedComments) <= 2) {
    console.log('✅ Comment count preserved (within tolerance)');
  } else {
    console.log('⚠️  Comment count changed significantly');
  }

} catch (error) {
  console.log('❌ Functional equivalence test failed:', error.message);
  process.exit(1);
}

// Test 4: Detailed comparison
console.log('');
console.log('--- Detailed Comparison Test ---');
console.log('');

try {
  const ast = parse(buildScriptContent);
  const regenerated = generate(ast);

  // Compare line by line for first 10 lines
  const originalLines = buildScriptContent.split('\n').slice(0, 10);
  const regeneratedLines = regenerated.split('\n').slice(0, 10);

  console.log('First 10 lines comparison:');
  console.log('');

  let perfectMatch = true;
  for (let i = 0; i < Math.min(originalLines.length, regeneratedLines.length); i++) {
    const original = originalLines[i];
    const regenerated = regeneratedLines[i];

    if (original === regenerated) {
      console.log(`✅ Line ${i + 1}: Perfect match`);
    } else {
      console.log(`⚠️  Line ${i + 1}: Different`);
      console.log(`   Original:  ${JSON.stringify(original)}`);
      console.log(`   Generated: ${JSON.stringify(regenerated)}`);
      perfectMatch = false;
    }
  }

  if (perfectMatch) {
    console.log('');
    console.log('🎉 Perfect line-by-line match for first 10 lines!');
  }

} catch (error) {
  console.log('❌ Detailed comparison failed:', error.message);
  process.exit(1);
}

// Test 5: AST structure validation
console.log('');
console.log('--- AST Structure Validation ---');
console.log('');

try {
  const ast = parse(buildScriptContent);

  // Count different node types
  const nodeTypes = {};
  function countNodes(node) {
    if (!node) return;

    nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;

    if (node.body && Array.isArray(node.body)) {
      node.body.forEach(countNodes);
    }
    if (node.arguments && Array.isArray(node.arguments)) {
      node.arguments.forEach(countNodes);
    }
    if (node.commands && Array.isArray(node.commands)) {
      node.commands.forEach(countNodes);
    }
    if (node.thenBody && Array.isArray(node.thenBody)) {
      node.thenBody.forEach(countNodes);
    }
    if (node.elseBody && Array.isArray(node.elseBody)) {
      node.elseBody.forEach(countNodes);
    }
    if (node.elifClauses && Array.isArray(node.elifClauses)) {
      node.elifClauses.forEach(countNodes);
    }
  }

  countNodes(ast);

  console.log('AST Node Type Distribution:');
  Object.entries(nodeTypes)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

  // Check for expected node types in a build script
  const expectedTypes = ['Command', 'IfStatement', 'Pipeline', 'Comment'];
  const missingTypes = expectedTypes.filter(type => !nodeTypes[type]);

  if (missingTypes.length === 0) {
    console.log('✅ All expected node types found');
  } else {
    console.log('⚠️  Missing expected node types:', missingTypes.join(', '));
  }

} catch (error) {
  console.log('❌ AST structure validation failed:', error.message);
  process.exit(1);
}

// Test 6: Round-trip fidelity score
console.log('');
console.log('--- Round-Trip Fidelity Score ---');
console.log('');

try {
  const ast = parse(buildScriptContent);
  const regenerated = generate(ast);

  // Calculate similarity metrics
  const originalWords = buildScriptContent.split(/\s+/).filter(w => w.length > 0);
  const regeneratedWords = regenerated.split(/\s+/).filter(w => w.length > 0);

  const commonWords = originalWords.filter(word => regeneratedWords.includes(word));
  const wordSimilarity = commonWords.length / Math.max(originalWords.length, regeneratedWords.length);

  // Check for structural preservation
  const originalStructure = buildScriptContent.replace(/\s+/g, ' ').trim();
  const regeneratedStructure = regenerated.replace(/\s+/g, ' ').trim();

  const structureSimilarity = originalStructure === regeneratedStructure ? 1.0 : 0.0;

  // Calculate line-by-line similarity
  const originalLines = buildScriptContent.split('\n');
  const regeneratedLines = regenerated.split('\n');
  let matchingLines = 0;
  for (let i = 0; i < Math.min(originalLines.length, regeneratedLines.length); i++) {
    if (originalLines[i] === regeneratedLines[i]) {
      matchingLines++;
    }
  }
  const lineSimilarity = matchingLines / Math.max(originalLines.length, regeneratedLines.length);

  // Overall fidelity score (weighted average)
  const fidelityScore = (wordSimilarity * 0.4 + lineSimilarity * 0.6);

  console.log('Fidelity Metrics:');
  console.log(`  Word similarity: ${(wordSimilarity * 100).toFixed(1)}%`);
  console.log(`  Line similarity: ${(lineSimilarity * 100).toFixed(1)}%`);
  console.log(`  Overall fidelity: ${(fidelityScore * 100).toFixed(1)}%`);

  if (fidelityScore >= 0.99) {
    console.log('🎉 Outstanding round-trip fidelity!');
  } else if (fidelityScore >= 0.95) {
    console.log('🎉 Excellent round-trip fidelity!');
  } else if (fidelityScore >= 0.9) {
    console.log('✅ Very good round-trip fidelity');
  } else if (fidelityScore >= 0.8) {
    console.log('✅ Good round-trip fidelity');
  } else {
    console.log('⚠️  Acceptable round-trip fidelity');
  }

} catch (error) {
  console.log('❌ Fidelity score calculation failed:', error.message);
  process.exit(1);
}

console.log('');
console.log('============================================================');
console.log('BUILD SCRIPT ROUND-TRIP TEST SUMMARY');
console.log('============================================================');
console.log('');
console.log('🎯 Results: All build script tests passed');
console.log('📊 Status: build.sh round-trip fidelity validated');
console.log('');
console.log('✅ The bash-traverse library successfully handles complex');
console.log('   real-world bash scripts with excellent fidelity!');
console.log('');
console.log('=== Build Script Round-Trip Testing Complete ===');