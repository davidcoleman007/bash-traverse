const { generate } = require('../dist/index.js');

console.log('Testing prefixStatements approach manually...\n');

// Test 1: Command with variable assignment prefix
console.log('Test 1: Command with NODE_ENV=production prefix');
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

  const generated1 = generate(commandWithPrefix);
  console.log('Generated:', generated1);
  console.log('✅ Test 1 passed\n');
} catch (error) {
  console.log('❌ Test 1 failed:', error.message);
}

// Test 2: Command with multiple variable assignment prefixes
console.log('Test 2: Command with multiple variable assignments');
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

  const generated2 = generate(commandWithMultiplePrefixes);
  console.log('Generated:', generated2);
  console.log('✅ Test 2 passed\n');
} catch (error) {
  console.log('❌ Test 2 failed:', error.message);
}

// Test 3: Regular command without prefix
console.log('Test 3: Regular command without prefix');
try {
  const regularCommand = {
    type: 'Program',
    body: [{
      type: 'Command',
      name: { type: 'Word', text: 'npm' },
      arguments: [
        { type: 'Word', text: 'run' },
        { type: 'Word', text: 'build' }
      ],
      redirects: []
    }],
    comments: []
  };

  const generated3 = generate(regularCommand);
  console.log('Generated:', generated3);
  console.log('✅ Test 3 passed\n');
} catch (error) {
  console.log('❌ Test 3 failed:', error.message);
}