# Testing bash-traverse

This document describes the testing infrastructure for bash-traverse.

## Test Scripts

### Quick Tests

```bash
# Quick validation of basic functionality
npm run validate:quick

# Test currently working features
npm run validate:current

# Show progress report
npm run progress
```

### Comprehensive Tests

```bash
# Full validation with detailed analysis
npm run validate

# Debug parsing issues in build.sh
npm run debug:build
```

## Test Scripts Overview

### `test-build-validation.js`
Comprehensive validation script that tests the full `examples/build.sh` file:
- Parses the entire file
- Generates content from AST
- Performs round-trip validation
- Provides detailed difference analysis
- Saves generated content for inspection
- Analyzes AST structure

### `test-quick-validation.js`
Fast validation for basic functionality:
- Quick parse/generate cycle
- Basic content comparison
- Minimal output for CI/CD

### `test-current-functionality.js`
Tests the currently working features:
- Basic commands (echo, npm, mkdir, etc.)
- Variable assignments
- Command substitution
- Basic redirections
- Simple comments

### `test-progress-tracker.js`
Progress tracking and reporting:
- Lists working features
- Identifies areas needing work
- Provides test case results
- Shows progress percentage
- Suggests next priorities

### `debug-build-parsing.js`
Debugging tool for parsing issues:
- Tests each line of build.sh individually
- Identifies specific parsing failures
- Shows exact error messages and content

## Current Status

### ✅ Working Features (50% complete)
- Basic command parsing (echo, npm, mkdir, etc.)
- Command arguments and flags
- Variable assignments (export VAR=value)
- Command substitution ($(...))
- Basic redirections (> and <)
- SPACE token preservation
- Shell-level token granularity
- Word generation with proper quoting
- Modular generator architecture
- Global config system

### 🔧 Areas Needing Work
- Comment generation (comments parse but don't generate)
- Complex test expressions ([[ ... ]] with regex)
- Heredoc parsing and generation
- Control flow structures (if, while, for)
- Function definitions
- Case statements
- Pipeline operators (|, &&, ||)
- Array assignments
- Complex variable expansions
- Subshell parsing

## Next Priorities

1. **Fix comment generation** - Comments parse correctly but don't generate
2. **Implement heredoc parsing** - Support for `<< EOF` syntax
3. **Fix complex test expressions** - Handle `[[ ... ]]` with regex patterns
4. **Add control flow structures** - if, while, for, case statements

## Running Tests

```bash
# Build the project first
npm run build

# Run quick validation
npm run validate:quick

# Check progress
npm run progress

# Full validation (may fail due to incomplete features)
npm run validate
```

## Expected Output

### Successful Test
```
🎉 All basic functionality tests passed!
📈 Progress: 6/12 test cases passing (50%)
📈 Making progress! Basic features are working.
```

### Failed Test
```
⚠️  Some tests failed - parser needs more work for complex Bash syntax
📈 Progress: 4/12 test cases passing (33%)
🚧 Early stages - basic infrastructure is in place.
```

## Contributing

When adding new features:
1. Add test cases to `test-current-functionality.js`
2. Update the progress tracker with new working features
3. Run `npm run progress` to verify improvements
4. Update this documentation

## Continuous Integration

The test scripts are designed to work in CI/CD environments:
- `npm run validate:quick` - Fast validation for PR checks
- `npm run progress` - Progress reporting for releases
- `npm run validate` - Full validation for release candidates