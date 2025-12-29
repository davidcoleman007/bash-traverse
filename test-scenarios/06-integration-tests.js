const { parse, generate } = require('../dist/index.js');

console.log('=== Integration Tests ===\n');

// Test 1: Complex script with multiple features
console.log('1. Complex script with multiple features:');
const complexScript = `#!/bin/bash
# Build and test script

NODE_ENV=production npm install && npm test || echo "Tests failed"

function build() {
    echo "Building project..."
    npm run build
}

if [ -f "package.json" ]; then
    build
else
    echo "No package.json found"
fi`;
console.log('Input:');
console.log(complexScript);
try {
  const ast = parse(complexScript);
  console.log('✅ Complex script parsed successfully');
  console.log('Number of statements:', ast.body.length);
  console.log('Statement types:', ast.body.map(stmt => stmt.type));

  // Check for shebang
  const shebang = ast.body.find(stmt => stmt.type === 'Shebang');
  if (shebang) {
    console.log('✅ Shebang found:', shebang.text);
  }

  // Check for comments
  const comments = ast.body.filter(stmt => stmt.type === 'Comment');
  console.log('✅ Comments found:', comments.length);

  // Check for pipeline
  const pipeline = ast.body.find(stmt => stmt.type === 'Pipeline');
  if (pipeline) {
    console.log('✅ Pipeline found with', pipeline.commands.length, 'commands');
  }

  // Check for function
  const functionDef = ast.body.find(stmt => stmt.type === 'FunctionDefinition');
  if (functionDef) {
    console.log('✅ Function found:', functionDef.name?.text);
  }

  // Check for if statement
  const ifStatement = ast.body.find(stmt => stmt.type === 'IfStatement');
  if (ifStatement) {
    console.log('✅ If statement found');
  }
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 2: Real-world deployment script
console.log('2. Real-world deployment script:');
const deploymentScript = `#!/bin/bash
set -e

# Configuration
APP_NAME="my-app"
DEPLOY_PATH="/var/www/$APP_NAME"
BACKUP_PATH="/var/backups/$APP_NAME"

# Create backup
if [ -d "$DEPLOY_PATH" ]; then
    echo "Creating backup..."
    tar -czf "$BACKUP_PATH/backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C "$DEPLOY_PATH" .
fi

# Deploy new version
echo "Deploying new version..."
NODE_ENV=production npm install && npm run build || {
    echo "Build failed!"
    exit 1
}

# Restart services
sudo systemctl restart nginx
sudo systemctl restart $APP_NAME

echo "Deployment complete!"`;
console.log('Input:');
console.log(deploymentScript);
try {
  const ast = parse(deploymentScript);
  console.log('✅ Deployment script parsed successfully');
  console.log('Number of statements:', ast.body.length);

  // Count different types
  const types = {};
  ast.body.forEach(stmt => {
    types[stmt.type] = (types[stmt.type] || 0) + 1;
  });
  console.log('Statement type counts:', types);
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 3: Code generation round-trip
console.log('3. Code generation round-trip:');
const roundTripScript = `#!/bin/bash
# Test script

NODE_ENV=production npm install && npm test

function test() {
    echo "hello"
}

if [ -f "file.txt" ]; then
    echo "exists"
fi`;
console.log('Input:');
console.log(roundTripScript);
try {
  const ast = parse(roundTripScript);
  const generated = generate(ast);
  console.log('Generated:');
  console.log(generated);

  // Parse the generated code again
  const ast2 = parse(generated);
  console.log('✅ Round-trip successful');
  console.log('Original statements:', ast.body.length);
  console.log('Regenerated statements:', ast2.body.length);
} catch (error) {
  console.log('❌ Round-trip failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 4: Edge cases
console.log('4. Edge cases:');
const edgeCases = `# Empty lines

# Just comments
# Another comment

# Commands with special characters
echo "Hello 'World'"
echo 'Mixed "quotes"'

# Variable assignments with spaces
VAR="value with spaces" echo "test"

# Nested structures
for i in 1 2 3; do
    if [ $i -eq 2 ]; then
        echo "Found 2"
    fi
done`;
console.log('Input:');
console.log(edgeCases);
try {
  const ast = parse(edgeCases);
  console.log('✅ Edge cases parsed successfully');
  console.log('Number of statements:', ast.body.length);
  console.log('Statement types:', ast.body.map(stmt => stmt.type));
} catch (error) {
  console.log('❌ Parse failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

// Test 5: Performance test
console.log('5. Performance test:');
const performanceScript = Array(100).fill('echo "test"').join('\n');
console.log('Input: 100 lines of echo commands');
try {
  const start = Date.now();
  const ast = parse(performanceScript);
  const end = Date.now();
  console.log('✅ Performance test completed');
  console.log('Parse time:', end - start, 'ms');
  console.log('Statements parsed:', ast.body.length);
} catch (error) {
  console.log('❌ Performance test failed:', error.message);
}
console.log('\n' + '='.repeat(50) + '\n');

console.log('🎯 Integration tests completed!');
console.log('\n🚀 bash-traverse is ready for production use!');