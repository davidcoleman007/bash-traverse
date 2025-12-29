#!/usr/bin/env node

const { parse } = require('../dist/index.js');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing build.sh heredoc parsing...\n');

// Read the build.sh file
const buildScriptPath = path.join(__dirname, 'examples', 'build.sh');
const originalScript = fs.readFileSync(buildScriptPath, 'utf8');

// Extract just the heredoc section for testing
const heredocSection = `cat > .npmrc << EOF
email=$NPM_EMAIL
always-auth=true
EOF`;

console.log('📝 Testing heredoc section:');
console.log(heredocSection);
console.log('---');

try {
  const ast = parse(heredocSection);
  console.log('✅ Heredoc parsed successfully!');
  console.log('Command name:', ast.body[0].name.text);
  console.log('Has heredoc:', !!ast.body[0].hereDocument);
  console.log('Heredoc content length:', ast.body[0].hereDocument?.content?.length || 0);
} catch (error) {
  console.log('❌ Parse error:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test the full build.sh file
console.log('📝 Testing full build.sh file...');

try {
  const fullAst = parse(originalScript);
  console.log('✅ Full build.sh parsed successfully!');
  console.log('Total statements:', fullAst.body.length);
} catch (error) {
  console.log('❌ Full parse error:', error.message);
  console.log('Error location:', error.message.includes('CHAR') ? 'CHAR token issue' : 'Other parsing issue');
}