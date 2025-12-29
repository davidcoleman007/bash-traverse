#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parse, generate } = require('../dist/index.js');

console.log('🧪 Testing bash-traverse against build.sh\n');

// Read the build.sh file
const buildScriptPath = path.join(__dirname, 'examples', 'build.sh');
const originalScript = fs.readFileSync(buildScriptPath, 'utf8');

console.log('📖 Original build.sh content:');
console.log('=' .repeat(50));
console.log(originalScript);
console.log('=' .repeat(50));

try {
  // Parse the original script
  console.log('\n🔍 Parsing original script...');
  const ast = parse(originalScript);
  console.log('✅ Parse successful!');
  console.log(`   - Total statements: ${ast.body.length}`);
  console.log(`   - Statement types: ${ast.body.map(stmt => stmt.type).join(', ')}`);

  // Find the npm install command
  console.log('\n🔍 Looking for npm install command...');
  let npmInstallIndex = -1;
  let npmInstallStatement = null;

  for (let i = 0; i < ast.body.length; i++) {
    const statement = ast.body[i];
    if (statement.type === 'Command' && statement.name?.text === 'npm') {
      const args = statement.arguments || [];
      if (args.some(arg => arg.text === 'install')) {
        npmInstallIndex = i;
        npmInstallStatement = statement;
        break;
      }
    }
  }

  if (npmInstallIndex === -1) {
    console.log('❌ Could not find npm install command');
    process.exit(1);
  }

  console.log(`✅ Found npm install at index ${npmInstallIndex}`);
  console.log(`   - Command: ${npmInstallStatement.name.text} ${npmInstallStatement.arguments?.map(arg => arg.text).join(' ') || ''}`);

  // Create a new statement to insert after npm install
  const newStatement = {
    type: 'Command',
    name: {
      type: 'Word',
      text: 'echo',
      loc: npmInstallStatement.loc
    },
    arguments: [
      {
        type: 'Word',
        text: '"Dependencies installed successfully!"',
        quoted: true,
        quoteType: '"',
        loc: npmInstallStatement.loc
      }
    ],
    loc: npmInstallStatement.loc
  };

  // Insert the new statement after npm install
  console.log('\n🔧 Inserting new statement after npm install...');
  ast.body.splice(npmInstallIndex + 1, 0, newStatement);
  console.log('✅ Statement inserted!');

  // Generate the modified script
  console.log('\n🔧 Generating modified script...');
  const modifiedScript = generate(ast);
  console.log('✅ Generation successful!');

  // Display the modified script
  console.log('\n📝 Modified build.sh content:');
  console.log('=' .repeat(50));
  console.log(modifiedScript);
  console.log('=' .repeat(50));

  // Save the modified script
  const modifiedScriptPath = path.join(__dirname, 'examples', 'build-modified.sh');
  fs.writeFileSync(modifiedScriptPath, modifiedScript);
  console.log(`\n💾 Modified script saved to: ${modifiedScriptPath}`);

  // Test round-trip parsing
  console.log('\n🔄 Testing round-trip parsing...');
  const roundTripAst = parse(modifiedScript);
  const roundTripScript = generate(roundTripAst);

  if (modifiedScript === roundTripScript) {
    console.log('✅ Round-trip parsing successful!');
  } else {
    console.log('❌ Round-trip parsing failed!');
    console.log('Differences:');
    console.log('Original length:', modifiedScript.length);
    console.log('Round-trip length:', roundTripScript.length);
  }

  // Show the specific changes
  console.log('\n📊 Summary of changes:');
  console.log(`   - Original statements: ${ast.body.length - 1}`);
  console.log(`   - Modified statements: ${ast.body.length}`);
  console.log(`   - Added: echo "Dependencies installed successfully!"`);

  console.log('\n🎉 Test completed successfully!');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}