#!/usr/bin/env node

const { parse, generate } = require('../dist');

console.log('🔍 Debugging heredoc spacing...\n');

const testCase = 'cat << EOF\nHello World\nThis is a here document\nEOF';

console.log('Original:');
console.log(`"${testCase}"`);

try {
  const ast = parse(testCase);
  console.log('\n✅ Parsed successfully');

  const command = ast.body[0];
  if (command.type === 'Command' && command.hereDocument) {
    console.log('\nHeredoc content (raw):');
    console.log(`"${command.hereDocument.content}"`);

    console.log('\nHeredoc content (with visible newlines):');
    console.log(`"${command.hereDocument.content.replace(/\n/g, '\\n')}"`);

    console.log('\nHeredoc content length:', command.hereDocument.content.length);
    console.log('Heredoc content char codes:');
    for (let i = 0; i < command.hereDocument.content.length; i++) {
      const char = command.hereDocument.content[i];
      console.log(`  ${i}: '${char}' (${char.charCodeAt(0)})`);
    }
  }

  const generated = generate(ast);
  console.log('\nGenerated:');
  console.log(`"${generated}"`);

  console.log('\nGenerated (with visible newlines):');
  console.log(`"${generated.replace(/\n/g, '\\n')}"`);

} catch (error) {
  console.log('❌ Parse failed:', error.message);
}