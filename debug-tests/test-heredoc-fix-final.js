#!/usr/bin/env node

const { parse, generate } = require('../dist');

console.log('🧪 Testing final heredoc spacing fix...\n');

const testCase = 'cat << EOF\nHello World\nThis is a here document\nEOF';

console.log('Original:');
console.log(`"${testCase}"`);

try {
  const ast = parse(testCase);
  console.log('\n✅ Parsed successfully');

  const command = ast.body[0];
  if (command.type === 'Command' && command.hereDocument) {
    console.log('\nHeredoc content (with visible newlines):');
    console.log(`"${command.hereDocument.content.replace(/\n/g, '\\n')}"`);

    // Check if content ends with newline
    const endsWithNewline = command.hereDocument.content.endsWith('\n');
    console.log('Content ends with newline:', endsWithNewline);

    // Show what our fix should do
    const content = endsWithNewline
      ? command.hereDocument.content.slice(0, -1)
      : command.hereDocument.content;

    console.log('Content after fix (with visible newlines):');
    console.log(`"${content.replace(/\n/g, '\\n')}"`);
  }

  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(`"${generated}"`);

  console.log('\nGenerated (with visible newlines):');
  console.log(`"${generated.replace(/\n/g, '\\n')}"`);

  // Check if the closing delimiter is at column 0
  const lines = generated.split('\n');
  const lastLine = lines[lines.length - 1];
  console.log('\nLast line:', `"${lastLine}"`);
  console.log('Last line starts with space:', lastLine.startsWith(' '));
  console.log('Last line starts with EOF:', lastLine.trim() === 'EOF');

} catch (error) {
  console.log('❌ Parse failed:', error.message);
}