const { parse, generate } = require('../dist/index.js');
const fs = require('fs');
const path = require('path');

console.log('=== Build Script Difference Analysis ===\n');

// Read the original build.sh file
const buildScriptPath = path.join(__dirname, 'examples', 'build.sh');
const originalScript = fs.readFileSync(buildScriptPath, 'utf8');

// Parse and generate
const ast = parse(originalScript);
const generated = generate(ast);

console.log('🔍 Analyzing differences...\n');

// Find all differences with context
const minLength = Math.min(originalScript.length, generated.length);
let differences = [];
let currentDiff = null;

for (let i = 0; i < minLength; i++) {
  if (originalScript[i] !== generated[i]) {
    if (!currentDiff) {
      currentDiff = {
        position: i,
        original: originalScript[i],
        generated: generated[i],
        context: {
          before: originalScript.substring(Math.max(0, i - 20), i),
          after: originalScript.substring(i + 1, Math.min(originalScript.length, i + 20))
        }
      };
    } else if (i === currentDiff.position + 1) {
      // Consecutive difference, extend current diff
      currentDiff.original += originalScript[i];
      currentDiff.generated += generated[i];
    } else {
      // New difference
      differences.push(currentDiff);
      currentDiff = {
        position: i,
        original: originalScript[i],
        generated: generated[i],
        context: {
          before: originalScript.substring(Math.max(0, i - 20), i),
          after: originalScript.substring(i + 1, Math.min(originalScript.length, i + 1 + 20))
        }
      };
    }
  } else if (currentDiff) {
    // End of current difference
    differences.push(currentDiff);
    currentDiff = null;
  }
}

if (currentDiff) {
  differences.push(currentDiff);
}

console.log(`📊 Found ${differences.length} difference groups\n`);

// Categorize differences
const categories = {
  'spacing': 0,
  'newlines': 0,
  'quotes': 0,
  'other': 0
};

differences.forEach((diff, index) => {
  const isSpacing = /^\s+$/.test(diff.original) || /^\s+$/.test(diff.generated);
  const isNewline = diff.original.includes('\n') || diff.generated.includes('\n');
  const isQuotes = diff.original.includes('"') || diff.generated.includes('"') ||
                   diff.original.includes("'") || diff.generated.includes("'");

  if (isSpacing) {
    categories.spacing++;
  } else if (isNewline) {
    categories.newlines++;
  } else if (isQuotes) {
    categories.quotes++;
  } else {
    categories.other++;
  }

  // Show first 10 differences in detail
  if (index < 10) {
    console.log(`Difference ${index + 1} at position ${diff.position}:`);
    console.log(`  Context: "${diff.context.before}[${diff.original}]${diff.context.after}"`);
    console.log(`  Original: "${diff.original}" (${diff.original.split('').map(c => c.charCodeAt(0)).join(', ')})`);
    console.log(`  Generated: "${diff.generated}" (${diff.generated.split('').map(c => c.charCodeAt(0)).join(', ')})`);
    console.log('');
  }
});

console.log('📈 Difference Categories:');
console.log('='.repeat(40));
console.log(`Spacing differences: ${categories.spacing}`);
console.log(`Newline differences: ${categories.newlines}`);
console.log(`Quote differences: ${categories.quotes}`);
console.log(`Other differences: ${categories.other}`);
console.log(`Total: ${differences.length}`);

// Show specific examples of each category
console.log('\n🔍 Specific Examples:');
console.log('='.repeat(40));

// Spacing examples
const spacingDiffs = differences.filter(diff => /^\s+$/.test(diff.original) || /^\s+$/.test(diff.generated));
if (spacingDiffs.length > 0) {
  console.log('\nSpacing differences:');
  spacingDiffs.slice(0, 3).forEach((diff, i) => {
    console.log(`  ${i + 1}. Position ${diff.position}: "${diff.original}" → "${diff.generated}"`);
  });
}

// Newline examples
const newlineDiffs = differences.filter(diff => diff.original.includes('\n') || diff.generated.includes('\n'));
if (newlineDiffs.length > 0) {
  console.log('\nNewline differences:');
  newlineDiffs.slice(0, 3).forEach((diff, i) => {
    console.log(`  ${i + 1}. Position ${diff.position}: "${diff.original}" → "${diff.generated}"`);
  });
}

// Quote examples
const quoteDiffs = differences.filter(diff =>
  diff.original.includes('"') || diff.generated.includes('"') ||
  diff.original.includes("'") || diff.generated.includes("'")
);
if (quoteDiffs.length > 0) {
  console.log('\nQuote differences:');
  quoteDiffs.slice(0, 3).forEach((diff, i) => {
    console.log(`  ${i + 1}. Position ${diff.position}: "${diff.original}" → "${diff.generated}"`);
  });
}

console.log('\n=== Analysis Complete ===');