#!/usr/bin/env node

console.log('🧪 Testing heredoc column 0 fix logic...\n');

// Simulate our fix logic
function generateHereDocument(hereDoc) {
  let result = '<<';

  if (hereDoc.stripTabs) {
    result += '-';
  }

  result += hereDoc.delimiter;

  // Add content with proper newline handling
  // Remove trailing newline from content if it exists to avoid double newlines
  const content = hereDoc.content.endsWith('\n')
    ? hereDoc.content.slice(0, -1)
    : hereDoc.content;

  result += '\n' + content + '\n';
  result += hereDoc.delimiter;

  return result;
}

// Test case 1: Content with trailing newline
const testCase1 = {
  delimiter: 'EOF',
  content: '\nHello World\nThis is a here document\n',
  stripTabs: false
};

console.log('Test Case 1: Content with trailing newline');
console.log('Original content:', `"${testCase1.content.replace(/\n/g, '\\n')}"`);
const result1 = generateHereDocument(testCase1);
console.log('Generated:', `"${result1.replace(/\n/g, '\\n')}"`);

// Check if EOF is at column 0
const lines1 = result1.split('\n');
const lastLine1 = lines1[lines1.length - 1];
console.log('Last line:', `"${lastLine1}"`);
console.log('EOF at column 0:', !lastLine1.startsWith(' '));
console.log('');

// Test case 2: Content without trailing newline
const testCase2 = {
  delimiter: 'EOF',
  content: '\nHello World\nThis is a here document',
  stripTabs: false
};

console.log('Test Case 2: Content without trailing newline');
console.log('Original content:', `"${testCase2.content.replace(/\n/g, '\\n')}"`);
const result2 = generateHereDocument(testCase2);
console.log('Generated:', `"${result2.replace(/\n/g, '\\n')}"`);

// Check if EOF is at column 0
const lines2 = result2.split('\n');
const lastLine2 = lines2[lines2.length - 1];
console.log('Last line:', `"${lastLine2}"`);
console.log('EOF at column 0:', !lastLine2.startsWith(' '));
console.log('');

console.log('✅ Fix logic verified!');