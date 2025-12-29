// Core AST node interface
export interface ASTNode {
  type: string;
  loc?: SourceLocation;
  [key: string]: any;
}

// Source location information
export interface SourceLocation {
  start: Position;
  end: Position;
  source?: string;
}

export interface Position {
  line: number;
  column: number;
  offset: number;
}

// Basic token types
export interface Token {
  type: string;
  value: string;
  loc: SourceLocation;
}

// Word/identifier nodes
export interface Word extends ASTNode {
  type: 'Word';
  text: string;
  quoted?: boolean;
  quoteType?: '"' | "'" | '`';
}

// Comment nodes
export interface Comment extends ASTNode {
  type: 'Comment';
  value: string;
  leading: boolean; // true if before node, false if after
}

// Shebang nodes
export interface Shebang extends ASTNode {
  type: 'Shebang';
  text: string;
}

export interface NewlineStatement extends ASTNode {
  type: 'Newline';
  count: number; // How many newlines
}

export interface SemicolonStatement extends ASTNode {
  type: 'Semicolon';
}

export interface DoubleSemicolonStatement extends ASTNode {
  type: 'DoubleSemicolon';
}

export interface SpaceStatement extends ASTNode {
  type: 'Space';
  value: string; // The actual space characters (spaces, tabs)
}

// Line continuation statement
export interface LineContinuationStatement extends ASTNode {
  type: 'LineContinuation';
  value: string; // The backslash and newline characters
}

// Continuation marker statement
export interface ContinuationMarkerStatement extends ASTNode {
  type: 'ContinuationMarker';
  value: string; // The backslash and newline characters
}

// Variable assignment for prefix statements
export interface VariableAssignment extends ASTNode {
  type: 'VariableAssignment';
  name: Word;
  value: Word;
}

// Test expression for [ ... ] and [[ ... ]] syntax
export interface TestExpression extends ASTNode {
  type: 'TestExpression';
  elements: TestElement[]; // Array of operators and arguments in order
  negated?: boolean;
  extended?: boolean; // true for [[ ... ]], false for [ ... ]
}

export interface TestElement extends ASTNode {
  type: 'TestElement';
  operator?: Word; // The test operator (if this is an operator)
  argument?: Word; // The argument (if this is an argument)
  isOperator: boolean;
}

// Define Statement type
export type Statement =
  | Command
  | Pipeline
  | TestExpression
  | IfStatement
  | ForStatement
  | WhileStatement
  | UntilStatement
  | CaseStatement
  | FunctionDefinition
  | Subshell
  | BraceGroup
  | Comment
  | Shebang
  | NewlineStatement
  | SemicolonStatement
  | DoubleSemicolonStatement
  | SpaceStatement
  | LineContinuationStatement
  | ContinuationMarkerStatement
  | VariableAssignment;

// Command structures
export interface Command extends ASTNode {
  type: 'Command';
  name: Word;
  arguments: Word[];
  redirects: Redirect[];
  hereDocument?: HereDocument; // Here document content
  prefixStatements?: Statement[]; // Variable assignments and other prefix statements
  async?: boolean;
  leadingComments?: Comment[];
  trailingComments?: Comment[];
  hasSpaceBefore?: boolean; // Track critical spaces
  hasSpaceAfter?: boolean;
  indentation?: string; // Store actual indentation
}

export interface Pipeline extends ASTNode {
  type: 'Pipeline';
  commands: Command[];
  operators: string[]; // '|', '&&', '||'
  spacesBeforeOperators?: Token[][]; // Space tokens before each operator
  negated?: boolean;
}

// Control structures
export interface IfStatement extends ASTNode {
  type: 'IfStatement';
  condition: Statement;
  semicolonAfterCondition?: SemicolonStatement; // Semicolon between condition and 'then'
  thenBody: Statement[];
  elifClauses: ElifClause[];
  elseBody?: Statement[];
}

export interface ElifClause extends ASTNode {
  type: 'ElifClause';
  condition: Statement;
  semicolonAfterCondition?: SemicolonStatement; // Semicolon between condition and 'then'
  body: Statement[];
}

export interface ForStatement extends ASTNode {
  type: 'ForStatement';
  variable: Word;
  wordlist?: Word[];
  semicolonAfterWordlist?: SemicolonStatement; // Semicolon between wordlist and 'do'
  body: Statement[];
}

export interface WhileStatement extends ASTNode {
  type: 'WhileStatement';
  condition: TestExpression;
  semicolonAfterCondition?: SemicolonStatement; // Semicolon between condition and 'do'
  body: Statement[];
}

export interface UntilStatement extends ASTNode {
  type: 'UntilStatement';
  condition: TestExpression;
  body: Statement[];
}

export interface CaseStatement extends ASTNode {
  type: 'CaseStatement';
  expression: ASTNode; // Can be Word, VariableExpansion, etc.
  clauses: CaseClause[];
  newlinesAfterIn?: Statement[]; // Newline tokens after 'in' for fidelity
  esacIndentation?: string; // Indentation before 'esac' for fidelity
}

export interface CaseClause extends ASTNode {
  type: 'CaseClause';
  patterns: ASTNode[]; // Can be Word, VariableExpansion, etc.
  statements: Statement[];
  // Explicit boundaries for robust parsing
  clauseStart: number; // Token position where clause starts
  clauseEnd: number;   // Token position where clause ends (after ;;)
  indentation?: string; // Store actual indentation for the pattern line
}

// Functions and subshells
export interface FunctionDefinition extends ASTNode {
  type: 'FunctionDefinition';
  name: Word;
  body: Statement[];
  hasParentheses?: boolean; // true if function name() syntax was used
}

export interface Subshell extends ASTNode {
  type: 'Subshell';
  body: Statement[];
}

export interface BraceGroup extends ASTNode {
  type: 'BraceGroup';
  body: Statement[];
}

// Redirections
export interface Redirect extends ASTNode {
  type: 'Redirect';
  operator: string; // '>', '<', '>>', '<<', '2>&1', etc.
  target: Word;
  fd?: number; // file descriptor
}

export interface HereDocument extends ASTNode {
  type: 'HereDocument';
  delimiter: Word;
  content: string;
  stripTabs?: boolean;
}

// Expansions
export interface VariableExpansion extends ASTNode {
  type: 'VariableExpansion';
  name: Word;
  modifier?: ExpansionModifier;
}

export interface ExpansionModifier extends ASTNode {
  type: 'ExpansionModifier';
  operator: string; // ':-', ':=', ':+', etc.
  value: Word;
}

export interface CommandSubstitution extends ASTNode {
  type: 'CommandSubstitution';
  command: Statement[];
  style: '$()' | '``';
}

export interface ArithmeticExpansion extends ASTNode {
  type: 'ArithmeticExpansion';
  expression: string;
}

// Arrays and assignments
export interface ArrayElement extends ASTNode {
  type: 'ArrayElement';
  index?: Word;
  value: Word;
}

export interface ArrayAssignment extends ASTNode {
  type: 'ArrayAssignment';
  name: Word;
  elements: ArrayElement[];
}

export interface Assignment extends ASTNode {
  type: 'Assignment';
  name: Word;
  value: Word;
}

// Root program
export interface Program extends ASTNode {
  type: 'Program';
  body: Statement[];
  comments: Comment[];
}

// Parser options
export interface ParserOptions {
  locations?: boolean;
  comments?: boolean;
  ranges?: boolean;
  sourceType?: 'script' | 'module';
}

// Traversal types
export interface NodePath<T = ASTNode> {
  node: T;
  parent: NodePath | null;
  parentKey: string | null;
  parentIndex: number | null;
  type: string;
  get(key: string): NodePath | null;
  getNode(key: string): ASTNode | null;
  isNodeType(type: string): boolean;
  replaceWith(node: ASTNode): void;
  insertBefore(node: ASTNode): void;
  insertAfter(node: ASTNode): void;
  remove(): void;
}

export interface Visitor {
  [nodeType: string]: (path: NodePath) => void;
}

// Generator options
export interface GeneratorOptions {
  comments?: boolean;
  compact?: boolean;
  indent?: string;
  lineTerminator?: string;
}