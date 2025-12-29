#!/usr/bin/env node

console.log('🧪 Testing newline fix logic...\n');

// Simulate our fix logic
function generateProgram(program) {
  let result = '';

  // Generate body statements with proper newline preservation
  for (const statement of program.body) {
    const generated = generateNode(statement);
    if (generated) {
      result += generated;
    }
  }

  return result;
}

function generateNode(node) {
  switch (node.type) {
    case 'Shebang':
      return generateShebang(node);
    case 'Newline':
      return generateNewline(node);
    case 'Comment':
      return generateComment(node);
    default:
      return '';
  }
}

function generateShebang(shebang) {
  return shebang.text;
}

function generateNewline(newline) {
  return '\n'.repeat(newline.count);
}

function generateComment(comment) {
  return comment.text;
}

// Test case: Simulate the AST structure we saw
const testProgram = {
  body: [
    { type: 'Shebang', text: '#!/bin/bash -e' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '# -e to exit on first error.' },
    { type: 'Newline', count: 1 },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '# This script is responsible for building the project\'s static content.' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '# It is also responsible for running code coverage (i.e. SonarQube).' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '#' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '# Developers are free to alter the build process, even significantly, as long' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '# as they ensure:' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '# - Their build produces a dist folder' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '# - Their entry point asset exists at the top of dist' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '# - All child assets are placed in dist/__VERSION__' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '#' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '# They also must acknowledge that at deploy time:' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '# - The string __VERSION__ will be replaced in all of their assets with a' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '#   string unique to the deployment' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '# - The contents of the dist/__VERSION__ folder will be deployed to a new' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '#   subfolder of dist in the S3 bucket named using that same unique string' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '# - Any files under dist/__VERSION__ will be assigned a long cache time' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '#   (default 1 day). All other files will be assigned a short cache time' },
    { type: 'Newline', count: 1 },
    { type: 'Comment', text: '#   (default 1 minute).' }
  ]
};

console.log('Original structure:');
const original = `#!/bin/bash -e
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

console.log(`"${original}"`);

console.log('\nGenerated with fix:');
const generated = generateProgram(testProgram);
console.log(`"${generated}"`);

console.log('\nComparison:');
console.log('Original length:', original.length);
console.log('Generated length:', generated.length);
console.log('Match:', original === generated);

if (original === generated) {
  console.log('✅ Newline fix logic verified!');
} else {
  console.log('❌ Newline fix logic needs adjustment');

  // Show differences
  const originalLines = original.split('\n');
  const generatedLines = generated.split('\n');

  console.log('\nLine-by-line comparison:');
  const maxLines = Math.max(originalLines.length, generatedLines.length);
  for (let i = 0; i < maxLines; i++) {
    const orig = originalLines[i] || '[MISSING]';
    const gen = generatedLines[i] || '[MISSING]';
    if (orig !== gen) {
      console.log(`${i}: "${orig}" vs "${gen}"`);
    }
  }
}