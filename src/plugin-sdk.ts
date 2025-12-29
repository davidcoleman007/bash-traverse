import {
  BashPlugin,
  CustomCommandHandler,
  VisitorPlugin,
  GeneratorPlugin,
  ValidationResult,
  PluginSDK as IPluginSDK,
  PluginGeneratorOptions
} from './plugin-types';
import { ASTNode, Token, NodePath, SourceLocation } from './types';

export class PluginSDK implements IPluginSDK {
  createCommandHandler(
    pattern: string,
    handlers: {
      parse: CustomCommandHandler['parse'];
      generate: CustomCommandHandler['generate'];
      validate?: CustomCommandHandler['validate'];
      priority?: number;
    }
  ): CustomCommandHandler {
    const handler: CustomCommandHandler = {
      pattern,
      priority: handlers.priority || 0,
      parse: handlers.parse,
      generate: handlers.generate
    };

    if (handlers.validate) {
      handler.validate = handlers.validate;
    }

    return handler;
  }

  createVisitor(
    name: string,
    visitors: Record<string, (path: NodePath) => void>
  ): VisitorPlugin {
    return {
      name,
      ...visitors
    } as VisitorPlugin;
  }

  createGenerator(
    name: string,
    handlers: {
      canHandle: (nodeType: string) => boolean;
      generate: (node: ASTNode, options?: PluginGeneratorOptions) => string;
    }
  ): GeneratorPlugin {
    return {
      name,
      canHandle: handlers.canHandle,
      generate: handlers.generate
    };
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

  // Utility functions for plugin developers
  static createLocation(start: SourceLocation | undefined, end: SourceLocation | undefined): SourceLocation | undefined {
    if (!start || !end) return undefined;
    return {
      start: start.start,
      end: end.end,
      ...(start.source && { source: start.source })
    };
  }

  static parseWord(tokens: Token[], startIndex: number): { word: ASTNode; consumedTokens: number } {
    if (startIndex >= tokens.length) {
      throw new Error('Unexpected end of tokens');
    }

    const token = tokens[startIndex];
    if (!token) {
      throw new Error('Token is undefined');
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

    const word: ASTNode = {
      type: 'Word',
      text: text,
      quoted: quoted,
      quoteType: quoteType,
      loc: token.loc
    };

    return { word, consumedTokens: 1 };
  }

  static parseWords(tokens: Token[], startIndex: number, count: number): { words: ASTNode[]; consumedTokens: number } {
    const words: ASTNode[] = [];
    let consumedTokens = 0;

    for (let i = 0; i < count && startIndex + i < tokens.length; i++) {
      const { word, consumedTokens: consumed } = this.parseWord(tokens, startIndex + i);
      words.push(word);
      consumedTokens += consumed;
    }

    return { words, consumedTokens };
  }

  static parseUntil(tokens: Token[], startIndex: number, predicate: (token: Token) => boolean): { words: ASTNode[]; consumedTokens: number } {
    const words: ASTNode[] = [];
    let consumedTokens = 0;
    let i = startIndex;

    while (i < tokens.length && !predicate(tokens[i]!)) {
      const { word, consumedTokens: consumed } = this.parseWord(tokens, i);
      words.push(word);
      consumedTokens += consumed;
      i += consumed;
    }

    return { words, consumedTokens };
  }

  static findToken(tokens: Token[], startIndex: number, predicate: (token: Token) => boolean): number {
    for (let i = startIndex; i < tokens.length; i++) {
      const token = tokens[i];
      if (token && predicate(token)) {
        return i;
      }
    }
    return -1;
  }

  static findTokenByType(tokens: Token[], startIndex: number, type: string): number {
    return this.findToken(tokens, startIndex, token => token.type === type);
  }

  static findTokenByValue(tokens: Token[], startIndex: number, value: string): number {
    return this.findToken(tokens, startIndex, token => token.value === value);
  }
}