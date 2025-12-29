#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parse } = require('../dist');

/**
 * Debug script to identify parsing issues in build.sh
 */

function debugBuildParsing() {
  console.log('🔍 Debugging build.sh parsing...\n');

  const buildPath = path.join(__dirname, 'examples', 'build.sh');
  const content = fs.readFileSync(buildPath, 'utf8');

  console.log(`📁 File: ${buildPath}`);
  console.log(`📏 Content length: ${content.length} characters\n`);

  // Split into lines and test each line
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    if (line.trim() === '') continue;

    try {
      parse(line);
      // console.log(`✅ Line ${lineNumber}: OK`);
    } catch (error) {
      console.log(`❌ Line ${lineNumber}: ${error.message}`);
      console.log(`   Content: "${line}"`);
      console.log('');
    }
  }
}

debugBuildParsing();