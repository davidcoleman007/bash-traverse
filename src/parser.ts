import { BashLexer } from './lexer';
import { Token, Program, ASTNode, SourceLocation, Comment, Command, Redirect, FunctionDefinition, Shebang, BraceGroup, Pipeline, Statement, NewlineStatement, SpaceStatement, TestExpression, TestElement, Word, VariableAssignment, ContinuationMarkerStatement } from './types';
import { PluginRegistry } from './plugin-registry';
import { BashPlugin } from './plugin-types';
import { parseIfStatement, parseWhileStatement, parseUntilStatement, parseForStatement, parseCaseStatement } from './parsers';

export class BashParser {
  private tokens: Token[] = [];
  public current: number = 0;
  private pluginRegistry: PluginRegistry;

  constructor(plugins?: BashPlugin[]) {
    this.pluginRegistry = new PluginRegistry();
    if (plugins) {
      plugins.forEach(plugin => this.pluginRegistry.register(plugin));
    }
  }

  parse(source: string): Program {
    const lexer = new BashLexer(source);
    this.tokens = lexer.tokenize();
    this.current = 0;

    const program: Program = {
      type: 'Program',
      body: this.parseStatementArray(),
      comments: []
    };

    return program;
  }

  public isAtEnd(): boolean {
    return this.current >= this.tokens.length;
  }

  public peek(offset: number = 0): Token | null {
    if (this.current + offset >= this.tokens.length) return null;
    return this.tokens[this.current + offset] || null;
  }

  public advance(): Token | null {
    if (this.isAtEnd()) return null;
    return this.tokens[this.current++] || null;
  }

  public match(type: string): boolean {
    const token = this.peek();
    return token?.type === type;
  }

  public consume(type: string, message: string): Token {
    const token = this.peek();
    if (token?.type === type) {
      return this.advance()!;
    }
    throw new Error(`${message}, got ${token?.type || 'EOF'}`);
  }

  public parsePosixTestExpression(): TestExpression {
    this.consume('TEST_START', 'Expected [');

    const elements: TestElement[] = [];
    let negated = false;

    while (!this.isAtEnd()) {
      const token = this.peek();
      if (!token) break;

      if (token.type === 'TEST_END') {
        this.advance(); // consume ']'
        break;
      }

      if (token.type === 'UNARY_TEST_OPERATOR' || token.type === 'BINARY_TEST_OPERATOR' || token.type === 'BOOLEAN_OPERATOR' || token.type === 'TEST_OPERATOR') {
        this.advance();
        elements.push({
          type: 'TestElement',
          operator: {
          type: 'Word',
          text: token.value,
            loc: token.loc
          } as Word,
          isOperator: true,
          loc: token.loc
        } as TestElement);
      } else if (token.type === 'WORD' || token.type === 'ARGUMENT' || token.type === 'EXPANSION' || token.type === 'STRING') {
        this.advance();
        elements.push({
          type: 'TestElement',
          argument: {
          type: 'Word',
          text: token.value,
            loc: token.loc
          } as Word,
          isOperator: false,
          loc: token.loc
        } as TestElement);
      } else {
        // Skip other tokens (like spaces, etc.)
        this.advance();
      }
    }

    const loc = this.createLocation(
      elements.length > 0 ? elements[0]?.loc : undefined,
      elements.length > 0 ? elements[elements.length - 1]?.loc : undefined
    );

    return {
      type: 'TestExpression',
      elements: elements as any,
      negated,
      extended: false, // POSIX test expression [ ... ]
      ...(loc && { loc })
    };
  }

  public parseExtendedTestExpression(): TestExpression {
    this.consume('EXTENDED_TEST_START', 'Expected [[');

    const elements: TestElement[] = [];
    let negated = false;

    while (!this.isAtEnd()) {
      const token = this.peek();
      if (!token) break;

      // Stop at closing double bracket
      if (token.type === 'EXTENDED_TEST_END') {
        this.advance(); // consume the closing ]]
        break;
      }

      // Handle negation
      if (token.type === 'WORD' && token.value === '!') {
        this.advance();
        negated = !negated;
        continue;
      }

      if (token.type === 'UNARY_TEST_OPERATOR' || token.type === 'BINARY_TEST_OPERATOR' || token.type === 'BOOLEAN_OPERATOR' || token.type === 'TEST_OPERATOR' || token.type === 'LOGICAL_OR' || token.type === 'LOGICAL_AND') {
        this.advance();
        elements.push({
          type: 'TestElement',
          operator: {
            type: 'Word',
            text: token.value,
            loc: token.loc
          } as Word,
          isOperator: true,
          loc: token.loc
        } as TestElement);
      } else if (token.type === 'WORD' || token.type === 'ARGUMENT' || token.type === 'EXPANSION' || token.type === 'STRING' || token.type === 'REGEX_PATTERN') {
        this.advance();
        elements.push({
          type: 'TestElement',
          argument: {
            type: 'Word',
            text: token.value,
            loc: token.loc
          } as Word,
          isOperator: false,
          loc: token.loc
        } as TestElement);
      } else {
        // Skip other tokens (like spaces, etc.)
        this.advance();
      }
    }

    const loc = this.createLocation(
      elements.length > 0 ? elements[0]?.loc : undefined,
      elements.length > 0 ? elements[elements.length - 1]?.loc : undefined
    );

    return {
      type: 'TestExpression',
      elements: elements as any,
      negated,
      extended: true, // Bash extended test expression [[ ... ]]
      ...(loc && { loc })
    };
  }

  public parseStatement(): ASTNode | null {
    const token = this.peek();
    if (!token) return null;

    switch (token.type) {
      case 'NEWLINE':
        // Parse newlines as statements to preserve formatting
        const newlineToken = this.advance();
        return {
          type: 'Newline',
          count: 1,
          ...(newlineToken?.loc && { loc: newlineToken.loc })
        } as NewlineStatement;
      case 'SEMICOLON':
        // Parse semicolon as a statement
        const semicolonToken = this.advance();
        return {
          type: 'Semicolon',
          ...(semicolonToken?.loc && { loc: semicolonToken.loc })
        };
      case 'SHEBANG':
        return this.parseShebang();
      case 'COMMENT':
        return this.parseComment();
          case 'SPACE':
      return this.parseSpace();
    case 'CONTINUATION_MARKER':
      return this.parseContinuationMarker();
      case 'BRACE_START':
        return this.parseBraceGroup();
      case 'TEST_START':
        // This is a POSIX test expression [ ... ]
        return this.parsePosixTestExpression();
      case 'EXTENDED_TEST_START':
        // This is a Bash extended test expression [[ ... ]]
        return this.parseExtendedTestExpression();
      case 'CONTROL_IF':
        this.advance(); // consume the control keyword
        return parseIfStatement(this);
      case 'CONTROL_FOR':
        this.advance(); // consume the control keyword
        return parseForStatement(this);
      case 'CONTROL_WHILE':
        this.advance(); // consume the control keyword
        return parseWhileStatement(this);
      case 'CONTROL_UNTIL':
        this.advance(); // consume the control keyword
        return parseUntilStatement(this);
      case 'CONTROL_CASE':
        this.advance(); // consume the control keyword
        return parseCaseStatement(this);
      case 'CONTROL_FUNCTION':
        this.advance(); // consume the control keyword
            return this.parseFunctionDefinition();
      case 'CONTROL_EXPORT':
        // Export statements are handled as commands
        return this.parseCommand();
      case 'CONTROL_ELSE':
      case 'CONDITION_END':  // fi
      case 'LOOP_END':       // done
      case 'CONTROL_ESAC':
        // These keywords mark the end of a statement array, not the beginning of a new statement
        return null;
      case 'BRACE_START':
        return this.parseBraceGroup();
      case 'BRACE_END':
        // This should be handled by the calling context
        return null;
      case 'WORD':
      case 'COMMAND_NAME':
      case 'ARGUMENT':
        // Check if this might be a pipeline by looking ahead for pipeline operators
        if (this.isPipelineStart()) {
          return this.parsePipeline();
        }
        // Check if this might be a test command (starts with '[' or 'test')
        if (token.value === '[' || token.value === 'test') {
          return this.parseCommand();
        }
        return this.parseCommand();
      default:
        return this.parseCommand();
    }
  }

  private parseComment(): Comment {
    const token = this.consume('COMMENT', 'Expected comment');
    return {
      type: 'Comment',
      value: token.value,
      leading: true,
      loc: token.loc
    };
  }

  private parseSpace(): SpaceStatement {
    const token = this.consume('SPACE', 'Expected space');
    return {
      type: 'Space',
      value: token.value,
      loc: token.loc
    };
  }

  private parseContinuationMarker(): ContinuationMarkerStatement {
    const token = this.consume('CONTINUATION_MARKER', 'Expected continuation marker');
    return {
      type: 'ContinuationMarker',
      value: token.value,
      loc: token.loc
    };
  }

  private parseShebang(): Shebang {
    const token = this.consume('SHEBANG', 'Expected shebang');
    return {
      type: 'Shebang',
      text: token.value,
      loc: token.loc
    };
  }

  private parsePipeline(): Pipeline {
    const commands: (Command | VariableAssignment)[] = [];
    const operators: string[] = [];
    const spacesBeforeOperators: Token[][] = [];

    // Parse the first command
    const firstCommand = this.parseCommand(true); // Pass true for pipeline context
    commands.push(firstCommand);

    // Parse subsequent commands connected by operators
    while (this.match('PIPE') || this.match('LOGICAL_AND') || this.match('LOGICAL_OR') ||
           (this.match('SPACE') && this.peek(1) && (this.peek(1)?.type === 'PIPE' || this.peek(1)?.type === 'LOGICAL_AND' || this.peek(1)?.type === 'LOGICAL_OR'))) {

      // Collect space tokens before the operator
      const spacesBefore: Token[] = [];
      while (this.match('SPACE')) {
        spacesBefore.push(this.advance()!);
      }

      const operator = this.advance();
      if (operator) {
        operators.push(operator.value);
        spacesBeforeOperators.push(spacesBefore);
      }

      // Skip space tokens after the operator (they belong to the next command)
      while (this.match('SPACE')) {
        this.advance();
      }

      const command = this.parseCommand(true); // Pass true for pipeline context
      commands.push(command);
    }

    const loc = this.createLocation(commands[0]?.loc, commands[commands.length - 1]?.loc);
    return {
      type: 'Pipeline',
      commands: commands as any,
      operators: operators,
      spacesBeforeOperators: spacesBeforeOperators,
      ...(loc && { loc })
    };
  }

  public parseCommand(inPipelineContext: boolean = false): Command | VariableAssignment {
    // Check for variable assignment prefix (e.g., NODE_ENV=production)
    const prefixStatements: Statement[] = [];

    // Skip SPACE tokens before command name, but only if not in pipeline context
    if (!inPipelineContext) {
      while (this.match('SPACE')) {
        this.advance();
      }
    }

    // Command name can be a WORD token or certain control keywords (like exit, break, etc.)
    const token = this.peek();
    if (!token) {
      throw new Error(`Expected command name, got EOF`);
    }



    // Allow control keywords as commands in certain contexts (like case clause bodies)
    const allowedControlCommands = [
      'CONTROL_EXIT', 'CONTROL_BREAK', 'CONTROL_CONTINUE', 'CONTROL_RETURN', 'CONTROL_EXPORT'
    ];

    // Allow various token types that can start commands
    const allowedCommandStartTokens = [
      'WORD', 'COMMAND_NAME', 'ARGUMENT', 'LPAREN', 'SUBSHELL_START', 'COMMAND_SUBSTITUTION', 'ARITHMETIC_EXPANSION',
      'STRING', 'FLAG', 'TEST_OPERATOR', 'UNARY_TEST_OPERATOR', 'BINARY_TEST_OPERATOR', 'CONTINUATION_MARKER' // Allow test operators as command arguments
    ];

    if (!allowedCommandStartTokens.includes(token.type) && !allowedControlCommands.includes(token.type)) {
      throw new Error(`Expected command name, got ${token.type}`);
    }

    let commandName = this.parseWord();

    // Look ahead to see if this is a variable assignment prefix
    while ((this.match('OPERATOR') || this.match('BINARY_TEST_OPERATOR')) && this.peek()?.value === '=') {
      // This is a variable assignment prefix
      const varName = commandName;
      this.advance(); // consume the = token
      const varValue = this.parseWord();

      const loc = this.createLocation(varName.loc, varValue.loc);
      prefixStatements.push({
        type: 'VariableAssignment',
        name: varName as any,
        value: varValue as any,
        ...(loc && { loc })
      });

      // Check if there's another word for the actual command name
      // Collect space tokens between variable assignment and command name
      const spacesAfterPrefix: Token[] = [];
      while (this.match('SPACE')) {
        spacesAfterPrefix.push(this.advance()!);
      }

      // Look ahead to see if there's a command name after the variable assignment
      const nextToken = this.peek();
      if (nextToken && (nextToken.type === 'WORD' || nextToken.type === 'COMMAND_NAME' || nextToken.type === 'ARGUMENT')) {
        commandName = this.parseWord();
        // Store the spaces for later use in generation
        if (spacesAfterPrefix.length > 0) {
          (commandName as any).spacesAfterPrefix = spacesAfterPrefix;
        }
      } else {
        // This is a pure variable assignment command (e.g., i=value)
        // In pipeline context, don't consume spaces after variable assignment
        if (inPipelineContext) {
          // Don't consume the space - it belongs to the pipeline operator
          // Rewind to before the spaces we just consumed
          for (let i = 0; i < spacesAfterPrefix.length; i++) {
            this.current--;
          }
        }

        // Return a VariableAssignment instead of a Command
        const loc = this.createLocation(varName.loc, varValue.loc);
        return {
          type: 'VariableAssignment',
          name: varName as any,
          value: varValue as any,
          ...(loc && { loc })
        };
      }
    }

    // Check for custom command patterns first
    const customHandler = this.findCustomCommandHandler(commandName);
    if (customHandler) {
      const command = this.parseCustomCommand(commandName, customHandler);
      if (prefixStatements.length > 0) {
        command.prefixStatements = prefixStatements;
      }
      return command;
    }

    // Fall back to standard command parsing
    const command = this.parseStandardCommand(commandName);
    if (prefixStatements.length > 0) {
      command.prefixStatements = prefixStatements;
    }
    return command;
  }

  private findCustomCommandHandler(name: ASTNode): any {
    const commandStart = name['text'];
    const nextToken = this.peek();
    const fullCommandStart = nextToken ? `${commandStart} ${nextToken.value}` : commandStart;

    return this.pluginRegistry.findCommandHandler(fullCommandStart);
  }

  private parseCustomCommand(name: ASTNode, handler: any): Command {
    const startIndex = this.current - 1; // Adjust for the name we already consumed

    // Parse using the custom handler
    const result = handler.parse(this.tokens, startIndex);

    // Advance the parser position
    this.current = startIndex + result.consumedTokens;

    // Return the custom node as a command
    return {
      type: 'Command',
      name: name as any,
      arguments: [],
      redirects: [],
      customNode: result.node,
      loc: result.node.loc
    };
  }

  private parseStandardCommand(name: ASTNode): Command {
    const args: ASTNode[] = [];
    const redirects: Redirect[] = [];
    let hereDocument: any = null;

    while (!this.isAtEnd() && !this.match('SEMICOLON') && !this.match('NEWLINE') && !this.match('BRACE_END') && !this.match('LOGICAL_AND') && !this.match('LOGICAL_OR')) {
      if (this.match('REDIRECT')) {
        redirects.push(this.parseRedirect() as Redirect);
      } else if (this.match('HEREDOC_START')) {
        // Parse heredoc
        hereDocument = this.parseHereDocument();
      } else if (this.match('OPERATOR') && this.peek()?.value === '=') {
        // Handle variable assignment within command
        args.push(this.parseWord()); // consume the operator
        args.push(this.parseWord()); // consume the value
      } else if (name['text'] === 'export' && this.match('WORD') && this.peek(1)?.type === 'OPERATOR' && this.peek(1)?.value === '=') {
        // For export commands, combine VAR=value into a single argument
        const varName = this.parseWord();
        this.consume('OPERATOR', 'Expected =');
        const varValue = this.parseWord();

        // Create a combined word: VAR=value
        const combinedText = `${varName['text']}=${varValue['text']}`;
        const loc = this.createLocation(varName.loc, varValue.loc);
        args.push({
          type: 'Word',
          text: combinedText,
          quoted: false,
          ...(loc && { loc })
        });
      } else {
        args.push(this.parseWord());
      }
    }

    // Don't consume any terminating tokens - let higher-level parsing handle them
    // This ensures 100% round-trip fidelity

    const lastArg = args.length > 0 ? args[args.length - 1] : name;
    const loc = this.createLocation(name.loc, lastArg?.loc);

    return {
      type: 'Command',
      name: name as any,
      arguments: args as any,
      redirects: redirects as any,
      hereDocument: hereDocument,
      ...(loc && { loc })
    };
  }

  public parseWord(): ASTNode {
    const token = this.advance();
    if (!token) throw new Error('Unexpected end of input');

    if (token.type === 'EXPANSION') {
      return {
        type: 'VariableExpansion',
        name: { type: 'Word', text: token.value.slice(1) },
        loc: token.loc
      };
    } else if (token.type === 'COMMAND_SUBSTITUTION') {
      // Parse the command inside $(...)
      const commandText = token.value.slice(2, -1); // Remove $() wrapper
      // For now, create a simple command structure
      return {
        type: 'CommandSubstitution',
        command: [{
          type: 'Command',
          name: { type: 'Word', text: commandText.trim() },
          arguments: [],
          redirects: [],
          loc: token.loc
        }],
        style: '$()',
        loc: token.loc
      };
    } else if (token.type === 'BACKTICK_SUBSTITUTION') {
      // Parse the command inside `...`
      const commandText = token.value.slice(1, -1); // Remove `` wrapper
      // For now, create a simple command structure
      return {
        type: 'CommandSubstitution',
        command: [{
          type: 'Command',
          name: { type: 'Word', text: commandText.trim() },
          arguments: [],
          redirects: [],
          loc: token.loc
        }],
        style: 'backticks',
        loc: token.loc
      };
    } else if (token.type === 'ARITHMETIC_EXPANSION') {
      // Parse the expression inside $(())
      const expression = token.value.slice(3, -2); // Remove $(()) wrapper
      return {
        type: 'ArithmeticExpansion',
        expression: expression.trim(),
        loc: token.loc
      };
    } else if (token.type === 'TEST_OPERATOR') {
      // Test operators like -lt, -gt, -eq, etc.
      return {
        type: 'Word',
        text: token.value,
        quoted: false,
        loc: token.loc
      };
    } else if (token.type === 'COMMAND_NAME' || token.type === 'ARGUMENT' || token.type === 'FLAG' || token.type === 'FUNCTION_NAME') {
      // Shell-level tokens
      return {
        type: 'Word',
        text: token.value,
        quoted: false,
        loc: token.loc
      };
    } else if (token.type === 'REGEX_PATTERN') {
      // Regex patterns for =~ operator
      return {
        type: 'Word',
        text: token.value,
        quoted: false,
        loc: token.loc
      };
    }

    // Handle STRING tokens by extracting quote information
    let text = token.value;
    let quoted = false;
    let quoteType: '"' | "'" | undefined = undefined;

    if (token.type === 'STRING') {
      quoted = true;
      if (token.value.startsWith('"') && token.value.endsWith('"')) {
        quoteType = '"';
        text = token.value.slice(1, -1); // Remove quotes
      } else if (token.value.startsWith("'") && token.value.endsWith("'")) {
        quoteType = "'";
        text = token.value.slice(1, -1); // Remove quotes
      }
    }

    return {
      type: 'Word',
      text: text,
      quoted: quoted,
      quoteType: quoteType,
      loc: token.loc
    };
  }

  private parseRedirect(): Redirect {
    const token = this.consume('REDIRECT', 'Expected redirect');
    const target = this.parseWord();
    const loc = this.createLocation(token.loc, target.loc);

    return {
      type: 'Redirect',
      operator: token.value,
      target: target as any,
      ...(loc && { loc })
    };
  }

    private parseHereDocument(): any {
    const start = this.peek()?.loc;

    // Consume HEREDOC_START or HEREDOC_START_TAB_STRIP token
    const startToken = this.peek();
    let stripTabs = false;

    if (startToken?.type === 'HEREDOC_START_TAB_STRIP') {
      this.consume('HEREDOC_START_TAB_STRIP', 'Expected <<-');
      stripTabs = true;
    } else {
      this.consume('HEREDOC_START', 'Expected <<');
    }

    // Skip over SPACE tokens to find the delimiter
    while (this.match('SPACE')) {
      this.advance();
    }

    // Parse the delimiter
    const delimiterToken = this.consume('HEREDOC_DELIMITER', 'Expected heredoc delimiter');
    const delimiter: Word = {
      type: 'Word',
      text: delimiterToken.value,
      loc: delimiterToken.loc
    };

    // Parse the content
    const contentToken = this.consume('HEREDOC_CONTENT', 'Expected heredoc content');

    // Parse the closing delimiter
    const closingDelimiterToken = this.consume('HEREDOC_DELIMITER', 'Expected closing heredoc delimiter');

    // Parse content for variable substitutions
    const parsedContent = this.parseHeredocContent(contentToken?.value || '');

    return {
      type: 'HereDocument',
      delimiter: delimiter,
      content: contentToken.value,
      parsedContent: parsedContent,
      stripTabs: stripTabs,
      loc: this.createLocation(start, closingDelimiterToken.loc)
    };
  }

  private parseHeredocContent(content: string): ASTNode[] {
    const lines = content.split('\n');
    const parsedLines: ASTNode[] = [];

    for (const line of lines) {
      if (line.trim() === '') {
        // Empty line
        parsedLines.push({
          type: 'Word',
          text: '\n',
          loc: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 1, offset: 1 } }
        });
      } else {
        // Parse line for variable expansions
        const parsedLine = this.parseLineForExpansions(line);
        parsedLines.push(parsedLine);
      }
    }

    return parsedLines;
  }

  private parseLineForExpansions(line: string): ASTNode {
    // Simple parsing for variable expansions in heredoc content
    // This is a basic implementation - can be enhanced later

    // Check for simple variable expansions like $VAR
    const varMatch = line.match(/\$([a-zA-Z_][a-zA-Z0-9_]*)/);
    if (varMatch) {
      return {
        type: 'VariableExpansion',
        name: {
          type: 'Word',
          text: varMatch[1],
          loc: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: varMatch[1]?.length || 0, offset: varMatch[1]?.length || 0 } }
        },
        loc: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: line.length, offset: line.length } }
      };
    }

    // Return as plain word if no expansions found
    return {
      type: 'Word',
      text: line,
      loc: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: line.length, offset: line.length } }
    };
  }











  private parseFunctionDefinition(): FunctionDefinition {
    // 'function' keyword already consumed by parseStatement dispatch

    // Skip over any space tokens before the function name
    const spaces: SpaceStatement[] = [];
    while (this.match('SPACE')) {
      const spaceToken = this.advance();
      if (spaceToken) {
        spaces.push({
          type: 'Space',
          value: spaceToken.value,
          loc: spaceToken.loc
        } as SpaceStatement);
      }
    }

    const name = this.parseWord();

    // Support both function name() and function name { syntax
    let hasParentheses = false;
    if (this.match('FUNCTION_ARGS_START')) {
      // function name() syntax
      this.consume('FUNCTION_ARGS_START', 'Expected (');
      this.consume('FUNCTION_ARGS_END', 'Expected )');

      // Skip over any space tokens before the opening brace (but don't collect them)
      while (this.match('SPACE')) {
        this.advance();
      }

      this.consume('BRACE_START', 'Expected {');
      hasParentheses = true;
    } else if (this.match('SUBSHELL_START')) {
      // function name() syntax (fallback for backward compatibility)
      this.consume('SUBSHELL_START', 'Expected (');
      this.consume('SUBSHELL_END', 'Expected )');

      // Skip over any space tokens before the opening brace (but don't collect them)
      while (this.match('SPACE')) {
        this.advance();
      }

      this.consume('BRACE_START', 'Expected {');
      hasParentheses = true;
    } else {
      // function name { syntax
      // Skip over any space tokens before the opening brace (but don't collect them)
      while (this.match('SPACE')) {
        this.advance();
      }

      this.consume('BRACE_START', 'Expected {');
    }

    const body = this.parseStatementArray();
    this.consume('BRACE_END', 'Expected }');

    const loc = this.createLocation(name.loc, body.length > 0 ? body[body.length - 1]?.loc : undefined);
    return {
      type: 'FunctionDefinition',
      name: name as any,
      body: body as any,
      hasParentheses,
      spaces, // Include the spaces in the AST
      ...(loc && { loc })
    };
  }

  private parseBraceGroup(): BraceGroup {
    this.consume('BRACE_START', 'Expected {');
    const body = this.parseStatementArray();
    this.consume('BRACE_END', 'Expected }');

    const loc = this.createLocation(body.length > 0 ? body[0]?.loc : undefined, body.length > 0 ? body[body.length - 1]?.loc : undefined);
    return {
      type: 'BraceGroup',
      body: body as any,
      ...(loc && { loc })
    };
  }

  private parseStatementArray(): Statement[] {
    const statements: Statement[] = [];

    while (!this.isAtEnd()) {
      const token = this.peek();
      if (!token) break;

      // Stop if we encounter control structure keywords that end the statement array
      if (token.type === 'CONDITION_END' || token.type === 'LOOP_END' || token.type === 'CONTROL_ESAC' || token.type === 'CONTROL_ELSE') {
        break;
      }
      // Stop if we encounter closing brace
      if (token.type === 'BRACE_END') {
        break;
      }

      // Parse the next statement
      const statement = this.parseStatement();

      if (statement) {
        statements.push(statement as Statement);
      } else {
        // If we can't parse a statement, check if we've reached the end
        const nextToken = this.peek();
        if (nextToken && (nextToken.type === 'BRACE_END' ||
            nextToken.type === 'CONDITION_END' || nextToken.type === 'LOOP_END' || nextToken.type === 'CONTROL_ESAC' || nextToken.type === 'CONTROL_ELSE')) {
          break;
        }
        // If we can't parse a statement and we're not at the end, advance to avoid infinite loop
        if (!this.isAtEnd()) {
          this.advance();
        }
      }
    }

    return statements;
  }



  private isPipelineStart(): boolean {
    // Look ahead to see if this is the start of a pipeline
    // We need to find a pipeline operator (|, &&, ||) before encountering a newline without backslash
    let offset = 1;
    let parenDepth = 0;
    let braceDepth = 0;
    let inCommandSubstitution = false;
    let inTestExpression = false;

    while (true) {
      const token = this.peek(offset);
      if (!token) break; // End of tokens

      // Track parentheses and braces to avoid detecting operators inside them
      if (token.type === 'SUBSHELL_START') {
        parenDepth++;
      } else if (token.type === 'SUBSHELL_END') {
        parenDepth--;
      } else if (token.type === 'BRACE_START') {
        braceDepth++;
      } else if (token.type === 'BRACE_END') {
        braceDepth--;
      } else if (token.type === 'COMMAND_SUBSTITUTION' || token.type === 'BACKTICK') {
        // Skip over command substitution content - we don't need to track start/end
        // since our lexer creates a single token for the entire substitution
        offset++;
        continue;
      } else if (token.type === 'EXTENDED_TEST_START') {
        // Enter test expression context
        inTestExpression = true;
      } else if (token.type === 'EXTENDED_TEST_END') {
        // Exit test expression context
        inTestExpression = false;
      }

      // Only consider pipeline operators if we're not inside parentheses, braces, command substitution, or test expressions
      if (parenDepth === 0 && braceDepth === 0 && !inCommandSubstitution && !inTestExpression) {
        // If we find a pipeline operator, this is a pipeline
        if (token.type === 'LOGICAL_AND' || token.type === 'LOGICAL_OR' || token.type === 'PIPE') {
          return true;
        }
      }

      // If we find a newline without backslash, this is NOT a pipeline
      if (token.type === 'NEWLINE') {
        return false;
      }

      // If we find a backslash, check if next token is newline (line continuation)
      if (token.type === 'WORD' && token.value === '\\') {
        const nextToken = this.peek(offset + 1);
        if (nextToken?.type === 'NEWLINE') {
          offset += 2; // Skip both backslash and newline
          continue;
        }
      }

      offset++;
    }

    return false;
  }

  public createLocation(start: SourceLocation | undefined, end: SourceLocation | undefined): SourceLocation | undefined {
    if (!start || !end) return undefined;
    return {
      start: start.start,
      end: end.end,
      ...(start.source && { source: start.source })
    };
  }
}

export function parse(source: string, plugins?: BashPlugin[]): Program {
  const parser = new BashParser(plugins);
  return parser.parse(source);
}