# Debug Tests

This folder contains all the debug test files created during the development of bash-traverse. These files were instrumental in identifying and fixing parsing, generation, and spacing issues.

## Overview

- **Total debug files**: 151
- **Purpose**: Development debugging and regression testing
- **Status**: All issues identified in these files have been resolved and incorporated into the main test suite

## File Categories

### 🔧 Core Parsing Debug Files
- `debug-actual-parser.js` - Parser functionality testing
- `debug-ast.js` - AST structure analysis
- `debug-ast-spacing.js` - Spacing preservation in AST
- `debug-ast-structure.js` - AST structure validation

### 🏗️ Build Script Debug Files
- `debug-build-parsing.js` - Build script parsing issues
- `debug-build-script-differences.js` - Build script round-trip analysis
- `test-build-script-round-trip.js` - Build script fidelity testing

### 🔄 Pipeline Debug Files
- `debug-pipeline-structure.js` - Pipeline AST structure
- `debug-pipeline-spacing.js` - Pipeline spacing analysis
- `debug-pipeline-commands.js` - Pipeline command generation
- `debug-or-true-pattern.js` - `|| true` pattern debugging

### 📝 Spacing Debug Files
- `debug-space-token.js` - Space token generation
- `debug-command-concatenation.js` - Command concatenation analysis
- `debug-simple-space.js` - Simple space token testing

### 🎯 Control Structure Debug Files
- `debug-case-*.js` - Case statement debugging (18 files)
- `debug-if-*.js` - If statement debugging (8 files)
- `debug-while-*.js` - While loop debugging (6 files)
- `debug-for-*.js` - For loop debugging (2 files)

### 🔤 Function Debug Files
- `debug-function-*.js` - Function definition debugging (3 files)

### 🧪 Test Expression Debug Files
- `debug-test-*.js` - Test expression debugging (7 files)

### 📄 Here Document Debug Files
- `debug-heredoc-*.js` - Here document debugging (5 files)

### 🔗 Token Debug Files
- `debug-token-*.js` - Token analysis (16 files)
- `debug-lexer-*.js` - Lexer debugging (2 files)
- `debug-parser-*.js` - Parser debugging (6 files)

### 🎨 Generation Debug Files
- `debug-generation-*.js` - Code generation debugging (3 files)

### 📊 Analysis Files
- `debug-coverage-analysis.js` - Test coverage analysis
- `debug-*.js` - Various other debugging scenarios

## Key Issues Resolved

### ✅ Pipeline Spacing
- **Issue**: `|| true` patterns missing spaces
- **Fix**: Added space after operators in pipeline generator
- **Files**: `debug-or-true-pattern.js`, `debug-pipeline-*.js`

### ✅ Function Spacing
- **Issue**: Function name spacing not preserved
- **Fix**: Collect space tokens in AST and emit them in generator
- **Files**: `debug-function-*.js`

### ✅ Control Structure Spacing
- **Issue**: Inconsistent spacing in if/else, for/while, case statements
- **Fix**: Hybrid approach - explicit spacing for mandatory cases, AST-driven for flexible cases
- **Files**: `debug-if-*.js`, `debug-while-*.js`, `debug-for-*.js`, `debug-case-*.js`

### ✅ Test Expression Spacing
- **Issue**: Missing spaces in `[ ]` and `[[ ]]` expressions
- **Fix**: Explicit spacing in test expression generator
- **Files**: `debug-test-*.js`

### ✅ Build Script Fidelity
- **Issue**: 311 differences (5.40%) in build.sh round-trip
- **Fix**: Pipeline spacing fix resolved all differences
- **Result**: 100% perfect fidelity achieved
- **Files**: `debug-build-script-*.js`

## Current Status

🎉 **All debug issues have been resolved and incorporated into the main test suite:**

- ✅ **13 comprehensive test scenarios** in `test-scenarios/`
- ✅ **100% success rate** on all test suites
- ✅ **Perfect round-trip fidelity** for build.sh script
- ✅ **Production-ready** for bashcodeshift integration

## Usage

These debug files serve as:
1. **Historical reference** for issues that were identified and fixed
2. **Regression tests** to ensure fixes remain working
3. **Development examples** for understanding the parsing/generation process
4. **Troubleshooting tools** for future issues

## Running Debug Tests

```bash
# Run a specific debug test
node debug-tests/debug-or-true-pattern.js

# Run the build script round-trip test
node debug-tests/test-build-script-round-trip.js

# Run coverage analysis
node debug-tests/debug-coverage-analysis.js
```

## Integration with Main Test Suite

All the scenarios identified in these debug files have been systematically converted into the main test suite:

- **Core functionality**: `test-scenarios/01-06-*.js`
- **Comprehensive tests**: `test-scenarios/10-comprehensive-round-trip.js`
- **Spacing fidelity**: `test-scenarios/11-spacing-fidelity.js`
- **Specialized tests**: `test-scenarios/12-13-*.js`

The debug files remain as valuable development tools and regression tests for the bash-traverse library.