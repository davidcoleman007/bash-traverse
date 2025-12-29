import { parse } from '../parser';

describe('AST Node Types', () => {
  describe('Newline Nodes', () => {
    it('should parse newlines as NewlineStatement nodes', () => {
      const source = `echo "first"
echo "second"`;

      const ast = parse(source);

      // Should have newline nodes
      const newlineNodes = ast.body.filter(node => node.type === 'Newline');
      expect(newlineNodes.length).toBeGreaterThan(0);
    });

    it('should handle newlines in function bodies', () => {
      const source = `function test() {
  echo "Hello"
  echo "World"
}`;

      const ast = parse(source);
      const functionDef = ast.body.find(node => node.type === 'FunctionDefinition') as any;

      expect(functionDef).toBeDefined();
      expect(functionDef.body.some((node: any) => node.type === 'Newline')).toBe(true);
    });

    it('should handle newlines in control structures', () => {
      const source = `if [ -f file ]; then
  echo "exists"
fi`;

      const ast = parse(source);
      const ifStatement = ast.body.find(node => node.type === 'IfStatement') as any;

      expect(ifStatement).toBeDefined();
      expect(ifStatement.thenBody.some((node: any) => node.type === 'Newline')).toBe(true);
    });
  });

  describe('Semicolon Nodes', () => {
    // Note: Our current architecture treats semicolons as structural elements
    // rather than separate AST nodes, so these tests are not applicable
  });

  describe('VariableAssignment Nodes', () => {
    it('should parse simple variable assignments', () => {
      const source = 'i=$((i + 1))';

      const ast = parse(source);
      const assignment = ast.body.find(node => node.type === 'VariableAssignment') as any;

      expect(assignment).toBeDefined();
      expect(assignment.name.text).toBe('i');
      expect(assignment.value.type).toBe('ArithmeticExpansion');
    });

    it('should parse prefix statements in commands', () => {
      const source = 'NODE_ENV=production npm run build';

      const ast = parse(source);
      const command = ast.body.find(node => node.type === 'Command') as any;

      expect(command).toBeDefined();
      expect(command.prefixStatements).toBeDefined();
      expect(command.prefixStatements.length).toBe(1);
      expect(command.prefixStatements[0].type).toBe('VariableAssignment');
      expect(command.prefixStatements[0].name.text).toBe('NODE_ENV');
      expect(command.prefixStatements[0].value.text).toBe('production');
    });

    it('should parse multiple prefix statements', () => {
      const source = 'DEBUG=1 NODE_ENV=production npm run build';

      const ast = parse(source);
      const command = ast.body.find(node => node.type === 'Command') as any;

      expect(command).toBeDefined();
      expect(command.prefixStatements.length).toBe(2);
      expect(command.prefixStatements[0].name.text).toBe('DEBUG');
      expect(command.prefixStatements[1].name.text).toBe('NODE_ENV');
    });
  });

  describe('CaseStatement and CaseClause Nodes', () => {
    it('should parse case statements with clauses', () => {
      const source = `case $var in
  start)
    echo "Starting"
    ;;
  stop)
    echo "Stopping"
    ;;
esac`;

      const ast = parse(source);
      const caseStatement = ast.body.find(node => node.type === 'CaseStatement') as any;

      expect(caseStatement).toBeDefined();
      expect(caseStatement.expression.type).toBe('VariableExpansion');
      expect(caseStatement.clauses.length).toBe(2);

      // Check first clause
      const firstClause = caseStatement.clauses[0];
      expect(firstClause.type).toBe('CaseClause');
      expect(firstClause.patterns.length).toBe(1);
      expect(firstClause.patterns[0].text).toBe('start');
      expect(firstClause.statements.length).toBeGreaterThan(0);
    });

    it('should parse case clauses with DoubleSemicolon', () => {
      const source = `case $var in
  start)
    echo "Starting"
    ;;
esac`;

      const ast = parse(source);
      const caseStatement = ast.body.find(node => node.type === 'CaseStatement') as any;
      const clause = caseStatement.clauses[0];

      // Should have DoubleSemicolon in statements
      const doubleSemicolon = clause.statements.find((node: any) => node.type === 'DoubleSemicolon');
      expect(doubleSemicolon).toBeDefined();
    });
  });

  describe('FunctionDefinition Nodes', () => {
    it('should parse function definitions with parentheses', () => {
      const source = `function test() {
  echo "Hello"
}`;

      const ast = parse(source);
      const functionDef = ast.body.find(node => node.type === 'FunctionDefinition') as any;

      expect(functionDef).toBeDefined();
      expect(functionDef.name.text).toBe('test');
      expect(functionDef.hasParentheses).toBe(true);
      expect(functionDef.body.length).toBeGreaterThan(0);
    });

    it('should parse function definitions without parentheses', () => {
      const source = `function test {
  echo "Hello"
}`;

      const ast = parse(source);
      const functionDef = ast.body.find(node => node.type === 'FunctionDefinition') as any;

      expect(functionDef).toBeDefined();
      expect(functionDef.name.text).toBe('test');
      expect(functionDef.hasParentheses).toBe(false);
    });
  });

  describe('TestExpression Nodes', () => {
    // Note: Our current architecture doesn't parse test expressions as separate nodes
    // Test expressions are handled as part of the control structure parsing
  });

  describe('ArithmeticExpansion Nodes', () => {
    it('should parse arithmetic expansions', () => {
      const source = 'i=$((i + 1))';

      const ast = parse(source);
      const assignment = ast.body.find(node => node.type === 'VariableAssignment') as any;

      expect(assignment).toBeDefined();
      expect(assignment.value.type).toBe('ArithmeticExpansion');
      expect(assignment.value.expression).toBe('i + 1');
    });

    it('should parse complex arithmetic expressions', () => {
      const source = 'result=$((a + b * 2))';

      const ast = parse(source);
      const assignment = ast.body.find(node => node.type === 'VariableAssignment') as any;

      expect(assignment).toBeDefined();
      expect(assignment.value.type).toBe('ArithmeticExpansion');
      expect(assignment.value.expression).toBe('a + b * 2');
    });
  });

  describe('Command Nodes with Prefix Statements', () => {
    it('should parse commands with prefix statements', () => {
      const source = 'PATH=/usr/bin echo "Hello"';

      const ast = parse(source);
      const command = ast.body.find(node => node.type === 'Command') as any;

      expect(command).toBeDefined();
      expect(command.name.text).toBe('echo');
      expect(command.prefixStatements.length).toBe(1);
      expect(command.prefixStatements[0].type).toBe('VariableAssignment');
      expect(command.prefixStatements[0].name.text).toBe('PATH');
      expect(command.prefixStatements[0].value.text).toBe('/usr/bin');
    });

    it('should parse commands with multiple prefix statements', () => {
      const source = 'DEBUG=1 VERBOSE=1 echo "Debug output"';

      const ast = parse(source);
      const command = ast.body.find(node => node.type === 'Command') as any;

      expect(command).toBeDefined();
      expect(command.prefixStatements.length).toBe(2);
      expect(command.prefixStatements[0].name.text).toBe('DEBUG');
      expect(command.prefixStatements[1].name.text).toBe('VERBOSE');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty statements', () => {
      const source = 'echo "test"; ; echo "next"';

      const ast = parse(source);

      // Should handle multiple semicolons
      expect(ast.body.length).toBeGreaterThan(0);
    });

    it('should handle newlines at end of file', () => {
      const source = `echo "test"

`;

      const ast = parse(source);

      // Should handle trailing newlines
      expect(ast.body.length).toBeGreaterThan(0);
    });

    it('should handle mixed whitespace', () => {
      const source = `echo "test"
  echo "indented"`;

      const ast = parse(source);

      // Should handle mixed newlines and indentation
      expect(ast.body.length).toBeGreaterThan(0);
    });
  });
});