# bash-traverse Documentation Tree

This document provides a complete tree view of the documentation structure in the bash-traverse repository for easy reference from other repositories.

## Repository Structure

```
bash-traverse/
├── README.md                           # Main project README (20KB, 859 lines)
├── TESTING.md                          # Testing guidelines and procedures (3.6KB, 147 lines)
├── docs/                               # 📚 Main documentation directory
│   ├── README.md                       # Documentation overview (5.3KB, 193 lines)
│   ├── api-guide.md                    # Complete API reference (17KB, 811 lines)
│   ├── quick-reference.md              # Quick reference guide (5.7KB, 265 lines)
│   ├── practical-examples.md           # Practical usage examples (20KB, 805 lines)
│   ├── bashcodeshift-integration-examples.md  # Integration with babel-codeshift (14KB, 611 lines)
│   ├── prefix-statements-ast.md        # AST structure for prefix statements (7.6KB, 291 lines)
│   ├── function-body-parsing-refactor.md  # Function parsing implementation details (4.3KB, 149 lines)
│   └── bash-traverse-parsing-scenarios.md  # Parsing scenarios and edge cases (8.7KB, 340 lines)
├── test-scenarios/                     # 🧪 Comprehensive test scenarios
│   ├── README.md                       # Test scenarios overview (4.4KB, 97 lines)
│   ├── run-all-tests.js                # Test runner script (3.3KB, 112 lines)
│   ├── test-parsing-scenarios.js       # Parsing scenario tests (2.6KB, 86 lines)
│   ├── 01-basic-parsing.js             # Basic parsing tests (2.6KB, 76 lines)
│   ├── 02-function-parsing.js          # Function parsing tests (4.2KB, 130 lines)
│   ├── 03-pipeline-parsing.js          # Pipeline parsing tests (4.8KB, 134 lines)
│   ├── 04-variable-assignment.js       # Variable assignment tests (5.0KB, 134 lines)
│   ├── 05-control-structures.js        # Control structure tests (5.9KB, 195 lines)
│   ├── 06-integration-tests.js         # Integration tests (5.1KB, 189 lines)
│   ├── 07-prefix-statements.js         # Prefix statement tests (5.0KB, 155 lines)
│   ├── 08-prefix-statements-advanced.js  # Advanced prefix statement tests (7.0KB, 211 lines)
│   ├── 09-prefix-statements-edge-cases.js  # Edge case prefix statement tests (7.1KB, 211 lines)
│   ├── 10-comprehensive-round-trip.js  # Comprehensive round-trip tests (6.6KB, 268 lines)
│   ├── 11-spacing-fidelity.js          # Spacing fidelity tests (5.9KB, 216 lines)
│   ├── 12-heredoc-tests.js             # Here document tests (4.0KB, 159 lines)
│   ├── 13-test-expression-tests.js     # Test expression tests (5.1KB, 188 lines)
│   └── 14-build-script-round-trip.js   # Build script round-trip tests (9.5KB, 305 lines)
├── examples/                           # 📝 Example scripts
│   ├── build.sh                        # Basic build script example (5.6KB, 133 lines)
│   └── build-modified.sh               # Modified build script example (5.6KB, 242 lines)
├── debug-tests/                        # 🔍 Debug and development tests
│   ├── test-*.js                       # Various test files for debugging specific issues
│   ├── debug-*.js                      # Debug scripts for investigating parsing/generation
│   └── *.sh                           # Shell script test files
├── src/                                # 💻 Source code
│   ├── index.ts                        # Main entry point
│   ├── lexer.ts                        # Bash lexer implementation
│   ├── parser.ts                       # Bash parser implementation
│   ├── generator.ts                    # Code generator implementation
│   ├── types.ts                        # TypeScript type definitions
│   ├── plugin-*.ts                     # Plugin system files
│   ├── parsers/                        # Parser modules
│   ├── generators/                     # Generator modules
│   └── __tests__/                      # Unit tests
├── dist/                               # 📦 Compiled JavaScript output
├── node_modules/                       # Dependencies
├── package.json                        # Project configuration
├── package-lock.json                   # Dependency lock file
├── tsconfig.json                       # TypeScript configuration
├── jest.config.js                      # Jest test configuration
├── .eslintrc.js                        # ESLint configuration
├── .prettierrc                         # Prettier configuration
├── .gitignore                          # Git ignore rules
├── .npmrc                              # NPM configuration
└── example-tab-stripping-heredoc.sh    # Example heredoc with tab stripping
```

## Key Documentation Files

### Core Documentation
- **`README.md`** - Main project overview, installation, and basic usage
- **`docs/README.md`** - Documentation index and navigation
- **`docs/api-guide.md`** - Complete API reference with all functions and types
- **`docs/quick-reference.md`** - Quick reference for common operations
- **`docs/practical-examples.md`** - Real-world usage examples and patterns

### Integration & Advanced Topics
- **`docs/bashcodeshift-integration-examples.md`** - Integration with babel-codeshift for AST transformations
- **`docs/prefix-statements-ast.md`** - Detailed AST structure for prefix statements (variable assignments)
- **`docs/function-body-parsing-refactor.md`** - Implementation details for function parsing
- **`docs/bash-traverse-parsing-scenarios.md`** - Edge cases and complex parsing scenarios

### Testing & Validation
- **`TESTING.md`** - Testing guidelines and procedures
- **`test-scenarios/README.md`** - Overview of test scenarios
- **`test-scenarios/run-all-tests.js`** - Script to run all test scenarios

## Usage from Other Repositories

When referencing this documentation from another repository, you can:

1. **Link to specific files**: Reference the full path to any documentation file
2. **Reference test scenarios**: Use the test files in `test-scenarios/` as examples
3. **Copy examples**: Use the examples in `examples/` and `docs/practical-examples.md`
4. **Check API**: Refer to `docs/api-guide.md` for complete API documentation

## Quick Reference Paths

- **Main README**: `/README.md`
- **API Documentation**: `/docs/api-guide.md`
- **Quick Reference**: `/docs/quick-reference.md`
- **Practical Examples**: `/docs/practical-examples.md`
- **Integration Examples**: `/docs/bashcodeshift-integration-examples.md`
- **Test Scenarios**: `/test-scenarios/`
- **Example Scripts**: `/examples/`

## File Sizes and Complexity

- **Large files (>10KB)**: `README.md`, `docs/practical-examples.md`, `docs/api-guide.md`, `docs/bashcodeshift-integration-examples.md`
- **Medium files (5-10KB)**: Most test scenario files, `docs/quick-reference.md`, `docs/prefix-statements-ast.md`
- **Small files (<5KB)**: Configuration files, simple test files, debug scripts

This structure provides comprehensive documentation for the bash-traverse library, covering everything from basic usage to advanced integration patterns and edge case handling.