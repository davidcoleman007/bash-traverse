#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parse, generate } = require('../dist');

/**
 * Comprehensive validation script for build.sh
 * Tests round-trip parsing and generation with detailed analysis
 */

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ Error reading file ${filePath}:`, error.message);
    return null;
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`❌ Error writing file ${filePath}:`, error.message);
    return false;
  }
}

function analyzeDifferences(original, generated) {
  const differences = [];
  const maxLength = Math.max(original.length, generated.length);

  for (let i = 0; i < maxLength; i++) {
    const origChar = i < original.length ? original[i] : '[MISSING]';
    const genChar = i < generated.length ? generated[i] : '[MISSING]';

    if (origChar !== genChar) {
      differences.push({
        position: i,
        original: origChar,
        generated: genChar,
        originalCode: origChar.charCodeAt(0),
        generatedCode: genChar.charCodeAt(0)
      });
    }
  }

  return differences;
}

function validateBuildScript() {
  console.log('🧪 Testing build.sh validation...\n');

  const buildPath = path.join(__dirname, 'examples', 'build.sh');
  const originalContent = readFile(buildPath);

  if (!originalContent) {
    console.error('❌ Could not read build.sh');
    return false;
  }

  console.log(`📁 Testing file: ${buildPath}`);
  console.log(`📏 Original size: ${originalContent.length} characters\n`);

  // Step 1: Parse the original content
  console.log('🔍 Step 1: Parsing original content...');
  let ast;
  try {
    ast = parse(originalContent);
    console.log('✅ Parse successful!');
    console.log(`📊 AST contains ${ast.body.length} statements\n`);
  } catch (error) {
    console.error('❌ Parse failed:', error.message);
    return false;
  }

  // Step 2: Generate content from AST
  console.log('🔄 Step 2: Generating content from AST...');
  let generatedContent;
  try {
    generatedContent = generate(ast);
    console.log('✅ Generation successful!');
    console.log(`📏 Generated size: ${generatedContent.length} characters\n`);
  } catch (error) {
    console.error('❌ Generation failed:', error.message);
    return false;
  }

  // Step 3: Round-trip validation
  console.log('🔄 Step 3: Round-trip validation...');
  let roundTripAst;
  try {
    roundTripAst = parse(generatedContent);
    console.log('✅ Round-trip parse successful!');
    console.log(`📊 Round-trip AST contains ${roundTripAst.body.length} statements\n`);
  } catch (error) {
    console.error('❌ Round-trip parse failed:', error.message);
    return false;
  }

  // Step 4: Content comparison
  console.log('🔍 Step 4: Content comparison...');
  const isExactMatch = originalContent === generatedContent;
  console.log(`📊 Exact match: ${isExactMatch ? '✅ YES' : '❌ NO'}`);

  if (!isExactMatch) {
    console.log('\n📋 Detailed analysis:');
    console.log(`   Original length: ${originalContent.length}`);
    console.log(`   Generated length: ${generatedContent.length}`);

    const differences = analyzeDifferences(originalContent, generatedContent);
    console.log(`   Differences found: ${differences.length}`);

    if (differences.length > 0) {
      console.log('\n🔍 First 10 differences:');
      differences.slice(0, 10).forEach(diff => {
        console.log(`   Position ${diff.position}: '${diff.original}' (${diff.originalCode}) vs '${diff.generated}' (${diff.generatedCode})`);
      });

      if (differences.length > 10) {
        console.log(`   ... and ${differences.length - 10} more differences`);
      }
    }
  }

  // Step 5: Save generated content for inspection
  const generatedPath = path.join(__dirname, 'examples', 'build-generated.sh');
  if (writeFile(generatedPath, generatedContent)) {
    console.log(`\n💾 Generated content saved to: ${generatedPath}`);
  }

  // Step 6: AST structure analysis
  console.log('\n📊 Step 5: AST structure analysis...');
  const nodeTypes = new Map();

  function countNodeTypes(node) {
    const type = node.type;
    nodeTypes.set(type, (nodeTypes.get(type) || 0) + 1);

    // Recursively count child nodes
    if (node.body && Array.isArray(node.body)) {
      node.body.forEach(countNodeTypes);
    }
    if (node.arguments && Array.isArray(node.arguments)) {
      node.arguments.forEach(countNodeTypes);
    }
    if (node.commands && Array.isArray(node.commands)) {
      node.commands.forEach(countNodeTypes);
    }
    if (node.elements && Array.isArray(node.elements)) {
      node.elements.forEach(countNodeTypes);
    }
    if (node.thenBody && Array.isArray(node.thenBody)) {
      node.thenBody.forEach(countNodeTypes);
    }
    if (node.elseBody && Array.isArray(node.elseBody)) {
      node.elseBody.forEach(countNodeTypes);
    }
    if (node.elifClauses && Array.isArray(node.elifClauses)) {
      node.elifClauses.forEach(clause => {
        if (clause.body && Array.isArray(clause.body)) {
          clause.body.forEach(countNodeTypes);
        }
      });
    }
  }

  countNodeTypes(ast);

  console.log('📈 Node type distribution:');
  const sortedTypes = Array.from(nodeTypes.entries()).sort((a, b) => b[1] - a[1]);
  sortedTypes.forEach(([type, count]) => {
    console.log(`   ${type}: ${count}`);
  });

  // Step 7: Summary and recommendations
  console.log('\n📋 Step 6: Summary and recommendations...');

  const issues = [];
  if (!isExactMatch) {
    issues.push('Content mismatch detected');
  }

  if (ast.body.length !== roundTripAst.body.length) {
    issues.push('AST structure changed during round-trip');
  }

  if (issues.length === 0) {
    console.log('🎉 All tests passed! The parser and generator are working perfectly.');
    console.log('✅ Round-trip fidelity: 100%');
    console.log('✅ AST preservation: 100%');
    console.log('✅ Content preservation: 100%');
  } else {
    console.log('⚠️  Issues detected:');
    issues.forEach(issue => console.log(`   - ${issue}`));
    console.log('\n🔧 Recommendations:');
    console.log('   - Review the differences in the generated content');
    console.log('   - Check for spacing or formatting issues');
    console.log('   - Verify that all node types are handled correctly');
  }

  return issues.length === 0;
}

// Run the validation
if (require.main === module) {
  const success = validateBuildScript();
  process.exit(success ? 0 : 1);
}

module.exports = { validateBuildScript };