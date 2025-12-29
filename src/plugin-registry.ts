import {
  BashPlugin,
  CustomCommandHandler,
  VisitorPlugin,
  GeneratorPlugin,
  ValidationResult,
  PluginRegistry as IPluginRegistry
} from './plugin-types';

export class PluginRegistry implements IPluginRegistry {
  private plugins: Map<string, BashPlugin> = new Map();
  private commandHandlers: CustomCommandHandler[] = [];
  private visitors: VisitorPlugin[] = [];
  private generators: GeneratorPlugin[] = [];

  register(plugin: BashPlugin): void {
    // Validate plugin before registration
    const validation = this.validatePlugin(plugin);
    if (!validation.isValid) {
      throw new Error(`Invalid plugin ${plugin.name}: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Check dependencies
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(`Plugin ${plugin.name} depends on ${dep} which is not registered`);
        }
      }
    }

    // Register plugin
    this.plugins.set(plugin.name, plugin);

    // Register command handlers
    if (plugin.commands) {
      this.commandHandlers.push(...plugin.commands);
      // Sort by priority (higher priority first)
      this.commandHandlers.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    }

    // Register visitors
    if (plugin.visitors) {
      this.visitors.push(...plugin.visitors);
    }

    // Register generators
    if (plugin.generators) {
      this.generators.push(...plugin.generators);
    }
  }

  unregister(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} is not registered`);
    }

    // Remove command handlers
    if (plugin.commands) {
      this.commandHandlers = this.commandHandlers.filter(
        handler => !plugin.commands!.includes(handler)
      );
    }

    // Remove visitors
    if (plugin.visitors) {
      this.visitors = this.visitors.filter(
        visitor => !plugin.visitors!.includes(visitor)
      );
    }

    // Remove generators
    if (plugin.generators) {
      this.generators = this.generators.filter(
        generator => !plugin.generators!.includes(generator)
      );
    }

    // Remove plugin
    this.plugins.delete(pluginName);
  }

  getPlugin(name: string): BashPlugin | undefined {
    return this.plugins.get(name);
  }

  getAllPlugins(): BashPlugin[] {
    return Array.from(this.plugins.values());
  }

  getCommandHandlers(): CustomCommandHandler[] {
    return [...this.commandHandlers];
  }

  getVisitors(): VisitorPlugin[] {
    return [...this.visitors];
  }

  getGenerators(): GeneratorPlugin[] {
    return [...this.generators];
  }

  validatePlugin(plugin: BashPlugin): ValidationResult {
    const errors: any[] = [];
    const warnings: any[] = [];

    // Basic validation
    if (!plugin.name || typeof plugin.name !== 'string') {
      errors.push({ message: 'Plugin must have a valid name', node: plugin });
    }

    if (!plugin.version || typeof plugin.version !== 'string') {
      errors.push({ message: 'Plugin must have a valid version', node: plugin });
    }

    // Check for duplicate plugin name
    if (this.plugins.has(plugin.name)) {
      errors.push({ message: `Plugin ${plugin.name} is already registered`, node: plugin });
    }

    // Validate command handlers
    if (plugin.commands) {
      for (const handler of plugin.commands) {
        if (!handler.pattern || typeof handler.pattern !== 'string') {
          errors.push({ message: 'Command handler must have a valid pattern', node: handler });
        }
        if (typeof handler.parse !== 'function') {
          errors.push({ message: 'Command handler must have a parse function', node: handler });
        }
        if (typeof handler.generate !== 'function') {
          errors.push({ message: 'Command handler must have a generate function', node: handler });
        }
      }
    }

    // Validate visitors
    if (plugin.visitors) {
      for (const visitor of plugin.visitors) {
        if (!visitor.name || typeof visitor.name !== 'string') {
          errors.push({ message: 'Visitor must have a valid name', node: visitor });
        }
      }
    }

    // Validate generators
    if (plugin.generators) {
      for (const generator of plugin.generators) {
        if (!generator.name || typeof generator.name !== 'string') {
          errors.push({ message: 'Generator must have a valid name', node: generator });
        }
        if (typeof generator.canHandle !== 'function') {
          errors.push({ message: 'Generator must have a canHandle function', node: generator });
        }
        if (typeof generator.generate !== 'function') {
          errors.push({ message: 'Generator must have a generate function', node: generator });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Helper method to find the best matching command handler
  findCommandHandler(commandStart: string): CustomCommandHandler | null {
    return this.commandHandlers.find(handler =>
      commandStart.startsWith(handler.pattern)
    ) || null;
  }

  // Helper method to get all generators that can handle a node type
  getGeneratorsForNodeType(nodeType: string): GeneratorPlugin[] {
    return this.generators.filter(generator => generator.canHandle(nodeType));
  }
}