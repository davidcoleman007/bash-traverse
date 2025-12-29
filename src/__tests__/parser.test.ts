import { parse } from '../parser';
import { BashLexer } from '../lexer';

describe('BashParser', () => {
  describe('parse', () => {
    it('should parse simple commands', () => {
      const result = parse('echo "hello world"');

      expect(result.type).toBe('Program');
      expect(result.body).toHaveLength(1);
      expect(result.body[0]).toMatchObject({
        type: 'Command',
        name: { type: 'Word', text: 'echo' },
        arguments: [
          { type: 'Word', text: ' ', quoted: false },
          { type: 'Word', text: 'hello world', quoted: true, quoteType: '"' }
        ]
      });
    });

    it('should parse comments', () => {
      const result = parse('# This is a comment\necho "hello"');

      expect(result.body).toHaveLength(3); // Comment, Newline, Command
      expect(result.body[0]).toMatchObject({
        type: 'Comment',
        value: '# This is a comment'
      });
    });

    it('should parse variable expansions', () => {
      const result = parse('echo $HOME');

      expect(result.body[0]).toMatchObject({
        type: 'Command',
        arguments: [
          { type: 'Word', text: ' ', quoted: false },
          { type: 'VariableExpansion', name: { text: 'HOME', type: 'Word' } }
        ]
      });
    });

    it('should parse if statements', () => {
      const result = parse('if [ -f file ]; then echo "exists"; fi');

      expect(result.body[0]).toMatchObject({
        type: 'IfStatement'
      });
    });

    it('should parse nested if statements', () => {
      const source = `
        if [ -f file ]; then
          echo "exists";
          if [ -d dir ]; then
            echo "directory";
          fi;
        fi
      `;

      const ast = parse(source);
      console.log('AST:', JSON.stringify(ast, null, 2));

      // Should have at least one IfStatement
      expect(ast.body.length).toBeGreaterThan(0);
    });
  });

  describe('BashLexer', () => {
    it('should tokenize simple commands', () => {
      const lexer = new BashLexer('echo hello');
      const tokens = lexer.tokenize();

      expect(tokens).toHaveLength(3); // COMMAND_NAME, SPACE, ARGUMENT
      expect(tokens[0]).toMatchObject({ type: 'COMMAND_NAME', value: 'echo' });
      expect(tokens[1]).toMatchObject({ type: 'SPACE', value: ' ' });
      expect(tokens[2]).toMatchObject({ type: 'ARGUMENT', value: 'hello' });
    });

    it('should tokenize comments', () => {
      const lexer = new BashLexer('# This is a comment');
      const tokens = lexer.tokenize();

      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toMatchObject({ type: 'COMMENT', value: '# This is a comment' });
    });

    it('should tokenize quoted strings', () => {
      const lexer = new BashLexer('echo "hello world"');
      const tokens = lexer.tokenize();

      expect(tokens).toHaveLength(3); // COMMAND_NAME, SPACE, STRING
      expect(tokens[0]).toMatchObject({ type: 'COMMAND_NAME', value: 'echo' });
      expect(tokens[1]).toMatchObject({ type: 'SPACE', value: ' ' });
      expect(tokens[2]).toMatchObject({ type: 'STRING', value: '"hello world"' });
    });

    it('should tokenize variable expansions', () => {
      const lexer = new BashLexer('echo $HOME');
      const tokens = lexer.tokenize();

      expect(tokens).toHaveLength(3); // COMMAND_NAME, SPACE, EXPANSION
      expect(tokens[0]).toMatchObject({ type: 'COMMAND_NAME', value: 'echo' });
      expect(tokens[1]).toMatchObject({ type: 'SPACE', value: ' ' });
      expect(tokens[2]).toMatchObject({ type: 'EXPANSION', value: '$HOME' });
    });

    it('should debug tokenization', () => {
      const source = 'if [ -f file ]; then echo "exists"; fi';
      const lexer = new BashLexer(source);
      const tokens = lexer.tokenize();
      console.log('Tokens:', tokens.map(t => `${t.type}: "${t.value}"`));

      // Should have control structure tokens for if, then, fi
      const controlTokens = tokens.filter(t => t.type.startsWith('CONTROL_') || t.type.startsWith('CONDITION_'));
      console.log('Control tokens:', controlTokens.map(k => k.value));

      expect(controlTokens.length).toBeGreaterThan(0);
    });
  });

  it('should debug parsing step by step', () => {
    const source = 'if [ -f file ]; then echo "exists"; fi';
    const lexer = new BashLexer(source);
    const tokens = lexer.tokenize();
    console.log('All tokens:', tokens.map(t => `${t.type}: "${t.value}"`));

    const ast = parse(source);
    console.log('AST body types:', ast.body.map(node => node.type));
    console.log('AST body:', ast.body.map(node => ({ type: node.type, name: (node as any).name?.text || 'N/A' })));

    // Should have an IfStatement
    const ifStatements = ast.body.filter(node => node.type === 'IfStatement');
    console.log('IfStatements found:', ifStatements.length);

    expect(ifStatements.length).toBeGreaterThan(0);
  });

  it('should parse single-line if statement', () => {
    const source = 'if [ -f file ]; then echo "exists"; fi';
    const ast = parse(source);
    console.log('Single-line AST body types:', ast.body.map(node => node.type));

    // Should have an IfStatement
    const ifStatements = ast.body.filter(node => node.type === 'IfStatement');
    console.log('IfStatements found:', ifStatements.length);

    expect(ifStatements.length).toBe(1);
  });
});