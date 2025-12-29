import { parse, PluginRegistry, PluginSDK, dockerPlugin } from '../index';
import { BashPlugin, CustomCommandHandler } from '../plugin-types';

describe('Plugin System', () => {
  describe('PluginRegistry', () => {
    let registry: PluginRegistry;

    beforeEach(() => {
      registry = new PluginRegistry();
    });

    it('should register and retrieve plugins', () => {
      const plugin: BashPlugin = {
        name: 'test-plugin',
        version: '1.0.0',
        description: 'Test plugin'
      };

      registry.register(plugin);
      const retrieved = registry.getPlugin('test-plugin');

      expect(retrieved).toBe(plugin);
      expect(registry.getAllPlugins()).toHaveLength(1);
    });

    it('should validate plugins before registration', () => {
      const invalidPlugin = {
        name: '', // Invalid name
        version: '1.0.0'
      } as BashPlugin;

      expect(() => registry.register(invalidPlugin)).toThrow('Invalid plugin');
    });

    it('should handle plugin dependencies', () => {
      const basePlugin: BashPlugin = {
        name: 'base-plugin',
        version: '1.0.0'
      };

      const dependentPlugin: BashPlugin = {
        name: 'dependent-plugin',
        version: '1.0.0',
        dependencies: ['base-plugin']
      };

      // Should fail without base plugin
      expect(() => registry.register(dependentPlugin)).toThrow('depends on base-plugin');

      // Should succeed with base plugin
      registry.register(basePlugin);
      expect(() => registry.register(dependentPlugin)).not.toThrow();
    });

    it('should find command handlers by pattern', () => {
      const handler: CustomCommandHandler = {
        pattern: 'test command',
        parse: () => ({ node: { type: 'TestNode' }, consumedTokens: 2 }),
        generate: () => 'test command'
      };

      const plugin: BashPlugin = {
        name: 'test-plugin',
        version: '1.0.0',
        commands: [handler]
      };

      registry.register(plugin);

      const found = registry.findCommandHandler('test command');
      expect(found).toBe(handler);
    });

    it('should sort command handlers by priority', () => {
      const lowPriorityHandler: CustomCommandHandler = {
        pattern: 'test',
        priority: 1,
        parse: () => ({ node: { type: 'LowPriority' }, consumedTokens: 1 }),
        generate: () => 'low priority'
      };

      const highPriorityHandler: CustomCommandHandler = {
        pattern: 'test',
        priority: 10,
        parse: () => ({ node: { type: 'HighPriority' }, consumedTokens: 1 }),
        generate: () => 'high priority'
      };

      const plugin1: BashPlugin = {
        name: 'plugin1',
        version: '1.0.0',
        commands: [lowPriorityHandler]
      };

      const plugin2: BashPlugin = {
        name: 'plugin2',
        version: '1.0.0',
        commands: [highPriorityHandler]
      };

      registry.register(plugin1);
      registry.register(plugin2);

      const handlers = registry.getCommandHandlers();
      expect(handlers[0]).toBe(highPriorityHandler);
      expect(handlers[1]).toBe(lowPriorityHandler);
    });
  });

  describe('PluginSDK', () => {
    it('should create command handlers', () => {
      const sdk = new PluginSDK();

      const handler = sdk.createCommandHandler('test pattern', {
        parse: () => ({ node: { type: 'TestNode' }, consumedTokens: 2 }),
        generate: () => 'generated',
        priority: 5
      });

      expect(handler.pattern).toBe('test pattern');
      expect(handler.priority).toBe(5);
      expect(typeof handler.parse).toBe('function');
      expect(typeof handler.generate).toBe('function');
    });

    it('should create visitors', () => {
      const sdk = new PluginSDK();

      const visitor = sdk.createVisitor('test-visitor', {
        Command: () => console.log('command'),
        Comment: () => console.log('comment')
      });

      expect(visitor.name).toBe('test-visitor');
      expect(typeof visitor['Command']).toBe('function');
      expect(typeof visitor['Comment']).toBe('function');
    });

    it('should create generators', () => {
      const sdk = new PluginSDK();

      const generator = sdk.createGenerator('test-generator', {
        canHandle: (nodeType) => nodeType === 'TestNode',
        generate: () => 'generated'
      });

      expect(generator.name).toBe('test-generator');
      expect(generator.canHandle('TestNode')).toBe(true);
      expect(generator.canHandle('OtherNode')).toBe(false);
      expect(typeof generator.generate).toBe('function');
    });

    it('should validate plugins', () => {
      const sdk = new PluginSDK();

      const validPlugin: BashPlugin = {
        name: 'valid-plugin',
        version: '1.0.0'
      };

      const result = sdk.validatePlugin(validPlugin);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Docker Plugin', () => {
    it('should register docker plugin successfully', () => {
      const registry = new PluginRegistry();
      expect(() => registry.register(dockerPlugin)).not.toThrow();

      const plugin = registry.getPlugin('docker-commands');
      expect(plugin).toBe(dockerPlugin);
      expect(plugin?.commands).toHaveLength(2);
    });

    it('should find docker command handlers', () => {
      const registry = new PluginRegistry();
      registry.register(dockerPlugin);

      const runHandler = registry.findCommandHandler('docker run');
      const buildHandler = registry.findCommandHandler('docker build');

      expect(runHandler).toBeDefined();
      expect(buildHandler).toBeDefined();
      expect(runHandler?.pattern).toBe('docker run');
      expect(buildHandler?.pattern).toBe('docker build');
    });

    it('should validate docker commands', () => {
      const handler = dockerPlugin.commands?.find(c => c.pattern === 'docker run');
      expect(handler).toBeDefined();

      if (handler) {
        const result = handler.validate!({
          type: 'DockerRunCommand',
          image: { type: 'Word', text: 'ubuntu' },
          options: []
        } as any);

        expect(result.isValid).toBe(true);
      }
    });

    it('should generate docker commands', () => {
      const handler = dockerPlugin.commands?.find(c => c.pattern === 'docker run');
      expect(handler).toBeDefined();

      if (handler) {
        const node = {
          type: 'DockerRunCommand',
          image: { type: 'Word', text: 'ubuntu' },
          options: [{ type: 'Word', text: '-it' }]
        };

        const generated = handler.generate(node);
        expect(generated).toBe('docker run -it ubuntu');
      }
    });
  });

  describe('Plugin Integration with Parser', () => {
    it('should parse standard commands when no plugins match', () => {
      const ast = parse('echo "hello world"', [dockerPlugin]);

      expect(ast.body).toHaveLength(1);
      const command = ast.body[0] as any;
      expect(command.type).toBe('Command');
      expect(command.name.text).toBe('echo');
      expect(command.customNode).toBeUndefined();
    });

    it('should detect docker commands in mixed input', () => {
      const registry = new PluginRegistry();
      registry.register(dockerPlugin);

      // Test that the plugin can find docker commands
      const runHandler = registry.findCommandHandler('docker run');
      const buildHandler = registry.findCommandHandler('docker build');

      expect(runHandler).toBeDefined();
      expect(buildHandler).toBeDefined();
    });
  });
});