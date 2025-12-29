import { parse, generate } from '../index';

describe('Modular Generators', () => {
  describe('Control Flow Generators', () => {
    describe('If Statement Generator', () => {
      it('should generate simple if statements', () => {
        const source = 'if [ -f file ]; then echo "exists"; fi';
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('if [ -f file ]; then');
        expect(generated).toContain('echo "exists"');
        expect(generated).toContain('fi');
      });

      it('should generate if-else statements', () => {
        const source = 'if [ -f file ]; then echo "exists"; else echo "not found"; fi';
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('if [ -f file ]; then');
        expect(generated).toContain('else');
        expect(generated).toContain('fi');
      });

      it('should generate if-elif-else statements', () => {
        const source = `if [ -f file ]; then
  echo "file exists"
elif [ -d dir ]; then
  echo "directory exists"
else
  echo "neither exists"
fi`;
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('if [ -f file ]; then');
        expect(generated).toContain('elif [ -d dir ]; then');
        expect(generated).toContain('else');
        expect(generated).toContain('fi');
      });
    });

    describe('While Loop Generator', () => {
      it('should generate while loops', () => {
        const source = 'while [ $i -lt 10 ]; do echo $i; i=$((i + 1)); done';
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('while [ $i -lt 10 ]; do');
        expect(generated).toContain('echo $i');
        expect(generated).toContain('i=$((i + 1))');
        expect(generated).toContain('done');
      });

      it('should handle while true loops', () => {
        const source = 'while true; do echo "loop"; done';
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('while true; do');
        expect(generated).toContain('done');
      });
    });

    describe('For Loop Generator', () => {
      it('should generate for loops with list', () => {
        const source = 'for item in a b c; do echo $item; done';
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('for item in a b c; do');
        expect(generated).toContain('echo $item');
        expect(generated).toContain('done');
      });
    });

    describe('Case Statement Generator', () => {
      it('should generate case statements', () => {
        const source = `case $var in
  start)
    echo "Starting"
    ;;
  stop)
    echo "Stopping"
    ;;
esac`;
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('case $var in');
        expect(generated).toContain('start)');
        expect(generated).toContain('stop)');
        expect(generated).toContain(';;');
        expect(generated).toContain('esac');
      });
    });
  });

  describe('Statement Body Generators', () => {
    describe('Block Body Generator', () => {
      it('should generate function bodies', () => {
        const source = `function test() {
  echo "Hello"
  echo "World"
}`;
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('function test() {');
        expect(generated).toContain('echo "Hello"');
        expect(generated).toContain('echo "World"');
        expect(generated).toContain('}');
      });

      it('should handle empty function bodies', () => {
        const source = 'function empty() { }';
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('function empty() {');
        expect(generated).toContain('}');
      });
    });

    describe('Condition Body Generator', () => {
      it('should generate if statement bodies', () => {
        const source = `if [ -f file ]; then
  echo "File exists"
  echo "Processing..."
fi`;
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('if [ -f file ]; then');
        expect(generated).toContain('echo "File exists"');
        expect(generated).toContain('echo "Processing..."');
        expect(generated).toContain('fi');
      });
    });

    describe('Loop Body Generator', () => {
      it('should generate loop bodies', () => {
        const source = `while [ $i -lt 10 ]; do
  echo "Count: $i"
  i=$((i + 1))
done`;
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('while [ $i -lt 10 ]; do');
        expect(generated).toContain('echo "Count: $i"');
        expect(generated).toContain('i=$((i + 1))');
        expect(generated).toContain('done');
      });
    });
  });

  describe('Core Generators', () => {
    describe('Function Definition Generator', () => {
      it('should generate function definitions', () => {
        const source = 'function test() { echo "Hello"; }';
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('function test() {');
        expect(generated).toContain('echo "Hello"');
        expect(generated).toContain('}');
      });
    });

    describe('Test Expression Generator', () => {
      it('should generate POSIX test expressions', () => {
        const source = 'if [ -f file ]; then echo "exists"; fi';
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('[ -f file ]');
      });

      it('should generate extended test expressions', () => {
        const source = 'if [[ -f file && -r file ]]; then echo "readable"; fi';
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('[[ -f file && -r file ]]');
      });
    });

    describe('Pipeline Generator', () => {
      it('should generate simple pipelines', () => {
        const source = 'echo "hello" | grep "h"';
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('echo "hello"');
        expect(generated).toContain('|');
        expect(generated).toContain('grep "h"');
      });

      it('should generate logical pipelines', () => {
        const source = 'command1 && command2 || command3';
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('command1');
        expect(generated).toContain('&&');
        expect(generated).toContain('command2');
        expect(generated).toContain('||');
        expect(generated).toContain('command3');
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complex nested structures', () => {
      const source = `function process() {
  if [ -f input.txt ]; then
    while [ $i -lt 10 ]; do
      echo "Processing $i"
      i=$((i + 1))
    done
  fi
}`;
        const ast = parse(source);
        const generated = generate(ast);

        // Should contain all structural elements
        expect(generated).toContain('function process() {');
        expect(generated).toContain('if [ -f input.txt ]; then');
        expect(generated).toContain('while [ $i -lt 10 ]; do');
        expect(generated).toContain('done');
        expect(generated).toContain('fi');
        expect(generated).toContain('}');
    });

    it('should handle mixed control structures', () => {
      const source = `for item in a b c; do
  case $item in
    a)
      echo "Found a"
      ;;
    *)
      echo "Found $item"
      ;;
  esac
done`;
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('for item in a b c; do');
        expect(generated).toContain('case $item in');
        expect(generated).toContain('a)');
        expect(generated).toContain('*)');
        expect(generated).toContain(';;');
        expect(generated).toContain('esac');
        expect(generated).toContain('done');
    });

    it('should handle variable assignments and expansions', () => {
      const source = 'NODE_ENV=production echo "Hello $USER"';
        const ast = parse(source);
        const generated = generate(ast);

        expect(generated).toContain('NODE_ENV=production');
        expect(generated).toContain('echo "Hello $USER"');
    });
  });
});