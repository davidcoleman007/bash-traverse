#!/usr/bin/env node

const { parse } = require('../dist');

console.log('🔍 Analyzing newline structure in AST...\n');

const testCase = `#!/bin/bash -e
# -e to exit on first error.

# This script is responsible for building the project's static content.
# It is also responsible for running code coverage (i.e. SonarQube).
#
# Developers are free to alter the build process, even significantly, as long
# as they ensure:
# - Their build produces a dist folder
# - Their entry point asset exists at the top of dist
# - All child assets are placed in dist/__VERSION__
#
# They also must acknowledge that at deploy time:
# - The string __VERSION__ will be replaced in all of their assets with a
#   string unique to the deployment
# - The contents of the dist/__VERSION__ folder will be deployed to a new
#   subfolder of dist in the S3 bucket named using that same unique string
# - Any files under dist/__VERSION__ will be assigned a long cache time
#   (default 1 day). All other files will be assigned a short cache time
#   (default 1 minute).`;

try {
  const ast = parse(testCase);
  console.log('✅ Parse successful!');

  console.log('\n📊 AST Structure Analysis:');
  console.log('Total statements:', ast.body.length);

  let newlineCount = 0;
  let commentCount = 0;
  let otherCount = 0;

  for (let i = 0; i < ast.body.length; i++) {
    const node = ast.body[i];
    console.log(`${i}: ${node.type}`);

    if (node.type === 'Newline') {
      newlineCount++;
      console.log(`   Newline count: ${node.count}`);
    } else if (node.type === 'Comment') {
      commentCount++;
    } else {
      otherCount++;
    }
  }

  console.log('\n📈 Summary:');
  console.log(`Newlines: ${newlineCount}`);
  console.log(`Comments: ${commentCount}`);
  console.log(`Other: ${otherCount}`);

  // Show the original structure
  console.log('\n🔍 Original structure:');
  const lines = testCase.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') {
      console.log(`${i}: [EMPTY LINE]`);
    } else if (line.trim().startsWith('#')) {
      console.log(`${i}: [COMMENT] ${line}`);
    } else {
      console.log(`${i}: [CODE] ${line}`);
    }
  }

} catch (error) {
  console.log('❌ Parse failed:', error.message);
}