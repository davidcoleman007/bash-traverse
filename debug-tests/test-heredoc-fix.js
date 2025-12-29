#!/usr/bin/env node

const { parse, generate } = require('../dist');

console.log('🧪 Testing heredoc parsing fix...\n');

const testCases = [
  'cat >> .npmrc << EOF\n//artifactory/:_auth=$NPM_AUTH\nemail=$NPM_EMAIL\nlegacy-peer-deps=true\nEOF',
  'cat << EOF\nHello World\nThis is a here document\nEOF'
];

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}:`);
  console.log(`Original: ${testCase}`);

  try {
    const ast = parse(testCase);
    console.log('✅ Parsed successfully');

    // Inspect the command
    const command = ast.body[0];
    if (command.type === 'Command') {
      console.log('Command name:', command.name.text);
      console.log('Has heredoc:', !!command.hereDocument);
      if (command.hereDocument) {
        console.log('Heredoc delimiter:', command.hereDocument.delimiter.text);
        console.log('Heredoc content length:', command.hereDocument.content.length);
        console.log('Heredoc content:', command.hereDocument.content);
      }
    }

    const generated = generate(ast);
    console.log(`Generated: "${generated}"`);

    const roundTrip = parse(generated);
    console.log('Round-trip:', testCase === generated ? '✅ SAME' : '❌ DIFFERENT');

    if (testCase !== generated) {
      console.log('Original:', `"${testCase}"`);
      console.log('Generated:', `"${generated}"`);
    }

  } catch (error) {
    console.log('❌ Parse failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');
});