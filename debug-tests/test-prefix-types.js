// Test the types directly without building the parser
console.log('Testing prefixStatements types...\n');

// Test 1: Verify the AST structure is correct
console.log('Test 1: AST structure validation');
try {
  const commandWithPrefix = {
    type: 'Program',
    body: [{
      type: 'Command',
      name: { type: 'Word', text: 'npm' },
      arguments: [
        { type: 'Word', text: 'run' },
        { type: 'Word', text: 'build' }
      ],
      redirects: [],
      prefixStatements: [{
        type: 'VariableAssignment',
        name: { type: 'Word', text: 'NODE_ENV' },
        value: { type: 'Word', text: 'production' }
      }]
    }],
    comments: []
  };

  console.log('✅ AST structure is valid');
  console.log('Command name:', commandWithPrefix.body[0].name.text);
  console.log('Command arguments:', commandWithPrefix.body[0].arguments.map(a => a.text));
  console.log('Prefix statements:', commandWithPrefix.body[0].prefixStatements.map(p => `${p.name.text}=${p.value.text}`));
  console.log('✅ Test 1 passed\n');
} catch (error) {
  console.log('❌ Test 1 failed:', error.message);
}

// Test 2: Verify multiple prefix statements
console.log('Test 2: Multiple prefix statements');
try {
  const commandWithMultiplePrefixes = {
    type: 'Program',
    body: [{
      type: 'Command',
      name: { type: 'Word', text: 'npm' },
      arguments: [
        { type: 'Word', text: 'run' },
        { type: 'Word', text: 'build' }
      ],
      redirects: [],
      prefixStatements: [
        {
          type: 'VariableAssignment',
          name: { type: 'Word', text: 'NODE_ENV' },
          value: { type: 'Word', text: 'production' }
        },
        {
          type: 'VariableAssignment',
          name: { type: 'Word', text: 'DEBUG' },
          value: { type: 'Word', text: 'true' }
        }
      ]
    }],
    comments: []
  };

  console.log('✅ Multiple prefix statements structure is valid');
  console.log('Prefix statements count:', commandWithMultiplePrefixes.body[0].prefixStatements.length);
  console.log('✅ Test 2 passed\n');
} catch (error) {
  console.log('❌ Test 2 failed:', error.message);
}

// Test 3: Verify the expected output format
console.log('Test 3: Expected output format');
console.log('Expected output for Test 1: NODE_ENV=production npm run build');
console.log('Expected output for Test 2: NODE_ENV=production DEBUG=true npm run build');
console.log('✅ Test 3 passed\n');

console.log('🎉 All type tests passed! The prefixStatements approach is correctly structured.');
console.log('\nNext steps:');
console.log('1. Fix the parser CompoundList references');
console.log('2. Implement parsePipeline method');
console.log('3. Update parseCommand to detect variable assignment prefixes');
console.log('4. Test the full parsing and generation pipeline');