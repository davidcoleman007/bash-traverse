# bash-traverse

A comprehensive bash parser with rich AST output for transformation and analysis, designed specifically for codemod tools like bashcodeshift.

Bash-traverse was built to support safe, large-scale transformation of real-world bash scripts. 
Existing parsers provide ASTs suitable for inspection, but fall short when round-trip fidelity, 
structural preservation, and deterministic generation are required for codemod tooling and 
automated refactors.

**IMPORTANT**
Status: Experimental. Designed for real-world bash transformation, but not yet stable 
enough to treat as a drop-in engine for production refactors.

## Features

- **Rich AST Structure**: Detailed node types with location information, similar to Babel/jscodeshift
- **Full Bash Support**: Handles all bash language constructs including control structures, functions, expansions, and more
- **Comment Preservation**: Comments are first-class citizens in the AST
- **TypeScript**: Full TypeScript support with comprehensive type definitions
- **No Dependencies**: Zero runtime dependencies for maximum compatibility
- **Extensible**: Plugin system for custom node types and transformations
- **Round-trip Support**: Parse → Transform → Generate with full fidelity
- **Modular Architecture**: Clean, maintainable generator system with single responsibility
- **Structural Validation**: Comprehensive round-trip testing for all multi-line constructs

## 🚀 Current Status

Many common structures are supported with comprehensive bash parsing and generation 
capabilities. All major bash features are fully implemented and tested, including:

- ✅ **Basic Commands and Pipelines** - Full support for simple and complex command structures
- ✅ **Control Structures** - Complete if/then/else, for, while, until, case/esac support
- ✅ **Variable Assignment and Expansion** - Environment variables, arrays, and expansions
- ✅ **Line Continuations** - Backslash line continuation with 100% round-trip fidelity
- ✅ **Heredocs and Here-strings** - Multi-line string literals with proper formatting
- ✅ **Command Substitution** - `$(command)` and backtick syntax
- ✅ **Test Expressions** - `[ ... ]` and `[[ ... ]]` with all operators
- ✅ **Function Definitions** - Function declarations with proper scope handling
- ✅ **Comments and Shebangs** - First-class comment support with preservation
- ✅ **Round-trip Fidelity** - Parse → Transform → Generate with perfect accuracy

### Real-World Validation

The implementation has been validated with production bash scripts including:
- Complex CI/CD pipelines with multiple line continuations
- Docker and Kubernetes deployment scripts
- Build automation scripts with heredocs and variable expansions

For these inputs, parse → generate round-trips preserve structure and behavior, 
with no observed fidelity loss for supported constructs.


### 📊 Syntax Coverage

Supported and unsupported constructs are tracked explicitly and evolve as the parser and generator mature. For details, see **[Syntax Coverage Documentation](docs/syntax-coverage.md)**.

### Known Limitations

- Certain rarely used bash edge cases and shell-specific extensions are not yet fully supported.
- Interactive shell behaviors and runtime-dependent expansions are intentionally out of scope.

## Installation

```bash
npm install bash-traverse
```

## Quick Start

```typescript
import { parse, generate } from 'bash-traverse';

// Parse bash script
const ast = parse(`
#!/bin/bash
# This is a comment
echo "Hello, World!"
if [ -f file.txt ]; then
  echo "File exists"
fi
`);

// Generate code back with full fidelity
const code = generate(ast);
```

## API Reference

### `parse(source: string, plugins?: BashPlugin[]): Program`

Parses a bash script into an AST.

```typescript
interface ParserOptions {
  locations?: boolean;    // Include source location information
  comments?: boolean;     // Include comments in AST
  ranges?: boolean;       // Include character ranges
  sourceType?: 'script' | 'module';
}
```

### `generate(ast: Program, options?: GeneratorOptions): string`

Generates bash code from an AST with full structural fidelity.

```typescript
interface GeneratorOptions {
  comments?: boolean;     // Include comments in output
  compact?: boolean;      // Minimize whitespace
  indent?: string;        // Indentation string
  lineTerminator?: string; // Line ending
}
```

### `traverse(ast: Program, visitor: Visitor, plugins?: BashPlugin[]): void`

Traverses the AST and calls visitor functions.

```typescript
interface Visitor {
  [nodeType: string]: (path: NodePath) => void;
}
```

## AST Node Types

### Basic Nodes
- `Program` - Root node containing all statements
- `Comment` - Comments with leading/trailing information
- `Word` - Words, identifiers, and quoted strings
- `Newline` - Newline statements for multi-line constructs
- `Semicolon` - Semicolon statements for command separation

### Commands
- `Command` - Simple commands with name, arguments, and redirections
- `Pipeline` - Commands connected by pipes
- `CompoundList` - Lists of commands with separators
- `VariableAssignment` - Variable assignments (e.g., `VAR=value`)

### Control Structures
- `IfStatement` - if/then/else/elif/fi constructs
- `ForStatement` - for loops
- `WhileStatement` - while loops
- `UntilStatement` - until loops
- `CaseStatement` - case/esac constructs with clauses

### Functions and Subshells
- `FunctionDefinition` - Function definitions
- `Subshell` - Subshell expressions
- `BraceGroup` - Brace groups

*For a complete list of supported features and syntax coverage, see [Syntax Coverage Documentation](docs/syntax-coverage.md)*

### Expansions
- `VariableExpansion` - Variable expansions ($var, ${var})
- `CommandSubstitution` - Command substitution ($() and backticks)
- `ArithmeticExpansion` - Arithmetic expansions $(())

### Redirections
- `Redirect` - File redirections
- `HereDocument` - Here documents

## Architecture

The parser is built with a modular, maintainable architecture:

### Core Components
1. **Lexer** (`src/lexer.ts`) - Tokenizes bash source code with explicit token types
2. **Parser** (`src/parser.ts`) - Converts tokens to AST with modular parsing functions
3. **Traverser** (`src/traverse.ts`) - Walks and transforms AST
4. **Generator** (`src/generators/`) - Modular code generation system
5. **Types** (`src/types.ts`) - TypeScript type definitions

### Modular Generator System

The generator system has been refactored into a clean, modular architecture:

```
src/generators/
├── index.ts                    # Main generator entry point
├── structural.ts               # Structural token generators
├── words.ts                    # Word and text generators
├── control-flow/               # Control flow generators
│   ├── index.ts               # Control flow exports
│   ├── generateIf.ts          # If statement generator
│   ├── generateWhile.ts       # While loop generator
│   ├── generateUntil.ts       # Until loop generator
│   ├── generateFor.ts         # For loop generator
│   └── generateCase.ts        # Case statement generator
└── statements/                 # Statement body generators
    ├── index.ts               # Statement exports
    ├── generateBlockBody.ts   # Block body generator
    ├── generateConditionBody.ts # Condition body generator
    └── generateLoopBody.ts    # Loop body generator
```

### Key Architectural Improvements

- **Single Responsibility**: Each generator function is in its own file
- **No Duplicates**: Eliminated duplicate implementations that caused "fix one, break another" cycles
- **Structural Fidelity**: Preserves original semicolons and formatting
- **Clean Imports**: Proper modular import/export structure
- **Round-trip Validation**: All multi-line constructs pass structural validation

## Comprehensive AST Documentation

### Program Node

The root node containing all statements and comments.

```typescript
interface Program {
  type: 'Program';
  body: Statement[];
  comments: Comment[];
  loc?: SourceLocation;
}
```

**Example:**
```typescript
const ast = parse('echo "hello" # comment');
// {
//   "type": "Program",
//   "body": [
//     {
//       "type": "Command",
//       "name": { "type": "Word", "text": "echo" },
//       "arguments": [{ "type": "Word", "text": "\"hello\"", "quoted": true }],
//       "redirects": []
//     }
//   ],
//   "comments": [
//     {
//       "type": "Comment",
//       "value": "# comment",
//       "leading": false,
//       "trailing": true
//     }
//   ]
// }
```

### Command Node

Represents a simple command with name, arguments, and redirections.

```typescript
interface Command {
  type: 'Command';
  name: Word;
  arguments: Word[];
  redirects: Redirect[];
  prefixStatements?: Statement[]; // Variable assignments before command
  async?: boolean;
  loc?: SourceLocation;
}
```

**Examples:**

**Simple command:**
```typescript
const ast = parse('ls -la /home/user');
// {
//   "type": "Command",
//   "name": { "type": "Word", "text": "ls" },
//   "arguments": [
//     { "type": "Word", "text": "-la" },
//     { "type": "Word", "text": "/home/user" }
//   ],
//   "redirects": []
// }
```

**Command with prefix statements:**
```typescript
const ast = parse('NODE_ENV=production npm run build');
// {
//   "type": "Command",
//   "name": { "type": "Word", "text": "npm" },
//   "arguments": [
//     { "type": "Word", "text": "run" },
//     { "type": "Word", "text": "build" }
//   ],
//   "prefixStatements": [
//     {
//       "type": "VariableAssignment",
//       "name": { "type": "Word", "text": "NODE_ENV" },
//       "value": { "type": "Word", "text": "production" }
//     }
//   ],
//   "redirects": []
// }
```

### Control Structures

#### IfStatement Node

Represents if/then/else/elif/fi constructs with proper semicolon handling.

```typescript
interface IfStatement {
  type: 'IfStatement';
  condition: Statement;
  semicolonAfterCondition?: SemicolonStatement;
  thenBody: Statement[];
  elifClauses: ElifClause[];
  elseBody?: Statement[];
  loc?: SourceLocation;
}
```

**Example:**
```typescript
const ast = parse(`
if [ -f file.txt ]; then
  echo "File exists"
elif [ -d dir ]; then
  echo "Directory exists"
else
  echo "Neither exists"
fi
`);
// {
//   "type": "IfStatement",
//   "condition": {
//     "type": "TestExpression",
//     "elements": [
//       { "type": "TestElement", "operator": { "type": "Word", "text": "-f" }, "isOperator": true },
//       { "type": "TestElement", "argument": { "type": "Word", "text": "file.txt" }, "isOperator": false }
//     ]
//   },
//   "thenBody": [
//     {
//       "type": "Command",
//       "name": { "type": "Word", "text": "echo" },
//       "arguments": [{ "type": "Word", "text": "\"File exists\"", "quoted": true }]
//     }
//   ],
//   "elifClauses": [
//     {
//       "type": "ElifClause",
//       "condition": { /* ... */ },
//       "body": [ /* ... */ ]
//     }
//   ],
//   "elseBody": [
//     {
//       "type": "Command",
//       "name": { "type": "Word", "text": "echo" },
//       "arguments": [{ "type": "Word", "text": "\"Neither exists\"", "quoted": true }]
//     }
//   ]
// }
```

#### WhileStatement Node

Represents while loops with proper structural semicolons.

```typescript
interface WhileStatement {
  type: 'WhileStatement';
  condition: TestExpression;
  semicolonAfterCondition?: SemicolonStatement;
  body: Statement[];
  loc?: SourceLocation;
}
```

**Example:**
```typescript
const ast = parse('while [ $i -lt 10 ]; do echo $i; i=$((i+1)); done');
// {
//   "type": "WhileStatement",
//   "condition": {
//     "type": "TestExpression",
//     "elements": [
//       { "type": "TestElement", "argument": { "type": "Word", "text": "$i" }, "isOperator": false },
//       { "type": "TestElement", "operator": { "type": "Word", "text": "-lt" }, "isOperator": true },
//       { "type": "TestElement", "argument": { "type": "Word", "text": "10" }, "isOperator": false }
//     ]
//   },
//   "body": [
//     {
//       "type": "Command",
//       "name": { "type": "Word", "text": "echo" },
//       "arguments": [{ "type": "VariableExpansion", "name": { "type": "Word", "text": "i" } }]
//     },
//     {
//       "type": "VariableAssignment",
//       "name": { "type": "Word", "text": "i" },
//       "value": { "type": "ArithmeticExpansion", "expression": "i+1" }
//     }
//   ]
// }
```

#### CaseStatement Node

Represents case/esac constructs with proper clause handling.

```typescript
interface CaseStatement {
  type: 'CaseStatement';
  expression: ASTNode;
  clauses: CaseClause[];
  loc?: SourceLocation;
}

interface CaseClause {
  type: 'CaseClause';
  patterns: ASTNode[];
  statements: Statement[];
  clauseStart: number;
  clauseEnd: number;
  loc?: SourceLocation;
}
```

**Example:**
```typescript
const ast = parse(`
case $var in
  start)
    echo "Starting"
    ;;
  stop)
    echo "Stopping"
    ;;
esac
`);
// {
//   "type": "CaseStatement",
//   "expression": { "type": "VariableExpansion", "name": { "type": "Word", "text": "var" } },
//   "clauses": [
//     {
//       "type": "CaseClause",
//       "patterns": [{ "type": "Word", "text": "start" }],
//       "statements": [
//         { "type": "Newline", "count": 1 },
//         {
//           "type": "Command",
//           "name": { "type": "Word", "text": "echo" },
//           "arguments": [{ "type": "Word", "text": "\"Starting\"", "quoted": true }]
//         },
//         { "type": "Newline", "count": 1 },
//         { "type": "DoubleSemicolon" }
//       ]
//     }
//   ]
// }
```

### FunctionDefinition Node

Represents function definitions with proper body handling.

```typescript
interface FunctionDefinition {
  type: 'FunctionDefinition';
  name: Word;
  hasParentheses?: boolean;
  body: Statement[];
  loc?: SourceLocation;
}
```

**Example:**
```typescript
const ast = parse(`
function test() {
  echo "Hello"
  echo "World"
}
`);
// {
//   "type": "FunctionDefinition",
//   "name": { "type": "Word", "text": "test" },
//   "hasParentheses": true,
//   "body": [
//     { "type": "Newline", "count": 1 },
//     {
//       "type": "Command",
//       "name": { "type": "Word", "text": "echo" },
//       "arguments": [{ "type": "Word", "text": "\"Hello\"", "quoted": true }]
//     },
//     { "type": "Newline", "count": 1 },
//     {
//       "type": "Command",
//       "name": { "type": "Word", "text": "echo" },
//       "arguments": [{ "type": "Word", "text": "\"World\"", "quoted": true }]
//     },
//     { "type": "Newline", "count": 1 }
//   ]
// }
```

### Expansion Nodes

#### VariableExpansion Node

Represents variable expansions like `$var` or `${var}`.

```typescript
interface VariableExpansion {
  type: 'VariableExpansion';
  name: Word;
  modifier?: ExpansionModifier;
  loc?: SourceLocation;
}
```

**Example:**
```typescript
const ast = parse('echo $HOME');
// {
//   "type": "Command",
//   "name": { "type": "Word", "text": "echo" },
//   "arguments": [
//     {
//       "type": "VariableExpansion",
//       "name": { "type": "Word", "text": "HOME" }
//     }
//   ]
// }
```

#### CommandSubstitution Node

Represents command substitution with `$()` or backticks.

```typescript
interface CommandSubstitution {
  type: 'CommandSubstitution';
  command: Statement[];
  style: '$()' | '``';
  loc?: SourceLocation;
}
```

**Examples:**

**$() style:**
```typescript
const ast = parse('echo $(date)');
// {
//   "type": "Command",
//   "name": { "type": "Word", "text": "echo" },
//   "arguments": [
//     {
//       "type": "CommandSubstitution",
//       "command": [
//         {
//           "type": "Command",
//           "name": { "type": "Word", "text": "date" },
//           "arguments": []
//         }
//       ],
//       "style": "$()"
//     }
//   ]
// }
```

**Backtick style:**
```typescript
const ast = parse('echo `date`');
// {
//   "type": "Command",
//   "name": { "type": "Word", "text": "echo" },
//   "arguments": [
//     {
//       "type": "CommandSubstitution",
//       "command": [ /* same as above */ ],
//       "style": "``"
//     }
//   ]
// }
```

#### ArithmeticExpansion Node

Represents arithmetic expansions with `$((expression))`.

```typescript
interface ArithmeticExpansion {
  type: 'ArithmeticExpansion';
  expression: string;
  loc?: SourceLocation;
}
```

**Example:**
```typescript
const ast = parse('echo $((1 + 2))');
// {
//   "type": "Command",
//   "name": { "type": "Word", "text": "echo" },
//   "arguments": [
//     {
//       "type": "ArithmeticExpansion",
//       "expression": "1 + 2"
//     }
//   ]
// }
```

### Pipeline Node

Represents commands connected by pipes.

```typescript
interface Pipeline {
  type: 'Pipeline';
  commands: Command[];
  operators: string[]; // '|', '&&', '||'
  negated?: boolean;
  loc?: SourceLocation;
}
```

**Example:**
```typescript
const ast = parse('ls -la | grep "\\.txt$" | wc -l');
// {
//   "type": "Pipeline",
//   "commands": [
//     {
//       "type": "Command",
//       "name": { "type": "Word", "text": "ls" },
//       "arguments": [{ "type": "Word", "text": "-la" }]
//     },
//     {
//       "type": "Command",
//       "name": { "type": "Word", "text": "grep" },
//       "arguments": [{ "type": "Word", "text": "\"\\.txt$\"", "quoted": true }]
//     },
//     {
//       "type": "Command",
//       "name": { "type": "Word", "text": "wc" },
//       "arguments": [{ "type": "Word", "text": "-l" }]
//     }
//   ],
//   "operators": ["|", "|"]
// }
```

### Redirect Node

Represents file redirections.

```typescript
interface Redirect {
  type: 'Redirect';
  operator: string;
  target: Word;
  fd?: number;
  loc?: SourceLocation;
}
```

**Example:**
```typescript
const ast = parse('echo "output" 2> error.log');
// {
//   "type": "Command",
//   "name": { "type": "Word", "text": "echo" },
//   "arguments": [{ "type": "Word", "text": "\"output\"", "quoted": true }],
//   "redirects": [
//     {
//       "type": "Redirect",
//       "operator": "2>",
//       "target": { "type": "Word", "text": "error.log" },
//       "fd": 2
//     }
//   ]
// }
```

## Example Usage

### Basic Parsing

```typescript
import { parse } from 'bash-traverse';

const script = `
#!/bin/bash
# Check if file exists
if [ -f "config.json" ]; then
  echo "Config file found"
  source config.json
else
  echo "Config file not found"
  exit 1
fi
`;

const ast = parse(script);
console.log(JSON.stringify(ast, null, 2));
```

### AST Traversal

```typescript
import { parse, traverse } from 'bash-traverse';

const ast = parse('echo "hello" && echo "world"');

traverse(ast, {
  Command(path) {
    console.log('Found command:', path.node.name.text);
  },
  Comment(path) {
    console.log('Found comment:', path.node.value);
  }
});
```

### Code Generation with Full Fidelity

```typescript
import { parse, generate } from 'bash-traverse';

const ast = parse('echo "hello" # comment');
const code = generate(ast, { comments: true });
// Output: echo "hello" # comment

// Round-trip validation
const ast2 = parse(code);
const code2 = generate(ast2);
// code === code2 (structural fidelity)
```

### Transformation Example

```typescript
import { parse, generate, traverse } from 'bash-traverse';

function transformEchoToPrintf(script: string): string {
  const ast = parse(script);

  traverse(ast, {
    Command(path) {
      if (path.node.name.text === 'echo') {
        path.node.name.text = 'printf';
        path.node.arguments.unshift({
          type: 'Word',
          text: '%s\\n'
        });
      }
    }
  });

  return generate(ast);
}

// Transform echo commands to printf
const result = transformEchoToPrintf('echo "Hello, World!"');
// Output: printf '%s\n' "Hello, World!"
```

### Complex Transformation Example

```typescript
import { parse, generate, traverse } from 'bash-traverse';

function addErrorHandling(script: string): string {
  const ast = parse(script);

  traverse(ast, {
    Command(path) {
      // Add error handling to critical commands
      const criticalCommands = ['rm', 'mv', 'cp'];
      if (criticalCommands.includes(path.node.name.text)) {
        // Wrap in if statement with error checking
        const originalCommand = path.node;
        const ifStatement = {
          type: 'IfStatement',
          condition: originalCommand,
          thenBody: [
            {
              type: 'Command',
              name: { type: 'Word', text: 'echo' },
              arguments: [{ type: 'Word', text: '"Command failed"', quoted: true }],
              redirects: []
            }
          ],
          elifClauses: []
        };

        path.replace(ifStatement);
      }
    }
  });

  return generate(ast);
}

const result = addErrorHandling('rm important_file.txt');
// Output: if rm important_file.txt ; then echo "Command failed" ; fi
```

### AST Analysis Example

```typescript
import { parse, findNodes, countNodes } from 'bash-traverse';

function analyzeScript(source: string) {
  const ast = parse(source);

  const commands = findNodes(ast, 'Command');
  const functions = findNodes(ast, 'FunctionDefinition');
  const complexity = countNodes(ast, 'IfStatement') +
                   countNodes(ast, 'ForStatement') +
                   countNodes(ast, 'WhileStatement');

  return {
    commandCount: commands.length,
    functionCount: functions.length,
    complexity
  };
}

const analysis = analyzeScript(`
#!/bin/bash
function test() {
  echo "Hello"
}
if [ -f file.txt ]; then
  echo "File exists"
fi
`);
// Output: { commandCount: 2, functionCount: 1, complexity: 1 }
```

### Round-trip Validation

```typescript
import { parse, generate } from 'bash-traverse';

function validateRoundTrip(script: string): boolean {
  const ast1 = parse(script);
  const generated = generate(ast1);
  const ast2 = parse(generated);
  const regenerated = generate(ast2);

  // Normalize whitespace for comparison
  const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
  return normalize(script) === normalize(regenerated);
}

// Test various constructs
const testCases = [
  'function test() { echo "Hello"; echo "World"; }',
  'if [ -f file.txt ]; then echo "exists"; fi',
  'while [ $i -lt 10 ]; do echo $i; i=$((i+1)); done',
  'for item in a b c; do echo $item; done',
  'case $var in start) echo "start";; stop) echo "stop";; esac'
];

testCases.forEach(testCase => {
  console.log(`${testCase}: ${validateRoundTrip(testCase) ? '✅' : '❌'}`);
});
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
npm run test:watch
```

### Round-trip Validation

```bash
# Test structural round-trip for all multi-line constructs
node debug-multiline-constructs.js
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Formatting

```bash
npm run format
```

## Recent Improvements

### Modular Generator Architecture

- **Eliminated Duplicates**: Removed duplicate generator functions that caused "fix one, break another" cycles
- **Single Responsibility**: Each generator function is in its own file with clear naming
- **Clean Imports**: Proper modular import/export structure
- **Structural Fidelity**: Preserves original semicolons and formatting

### Semicolon Handling

- **Preserve Original**: Only add semicolons if they were present in the original source
- **Structural Semicolons**: Preserve required semicolons (before `then`, `do`, etc.)
- **No Automatic Addition**: Eliminated automatic semicolon insertion between statements
- **Proper Spacing**: Fixed spacing around semicolons and parentheses

### Round-trip Validation

- **All Constructs Working**: Function definitions, if statements, while/for loops, brace groups, and case statements
- **Structural Correctness**: 6/6 multi-line constructs pass round-trip validation
- **Newline Preservation**: Proper handling of newlines in multi-line constructs
- **Consistent Behavior**: All control flow constructs work correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite and round-trip validation
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Related Projects

- [bashcodeshift](https://github.com/davidcoleman007/bashcodeshift) - Codemod framework for bash scripts
- [@babel/traverse](https://github.com/babel/babel/tree/main/packages/babel-traverse) - JavaScript AST traversal (inspiration)
