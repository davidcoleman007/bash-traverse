import { ASTNode, Token, SourceLocation, NodePath } from './types';

// Core plugin interfaces
export interface BashPlugin {
  name: string;
  version: string;
  description?: string;
  commands?: CustomCommandHandler[];
  visitors?: VisitorPlugin[];
  generators?: GeneratorPlugin[];
  dependencies?: string[]; // Plugin names this plugin depends on
}

export interface CustomCommandHandler {
  pattern: string; // e.g., "docker run", "kubectl get"
  priority?: number; // Higher priority handlers are checked first
  parse: (tokens: Token[], startIndex: number) => {
    node: ASTNode;
    consumedTokens: number;
  };
  generate: (node: ASTNode) => string;
  validate?: (node: ASTNode) => ValidationResult;
}

export interface VisitorPlugin {
  name: string;
  [nodeType: string]: string | ((path: NodePath) => void | any);
}

export interface GeneratorPlugin {
  name: string;
  canHandle: (nodeType: string) => boolean;
  generate: (node: ASTNode, options?: PluginGeneratorOptions) => string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  message: string;
  node: ASTNode;
  loc?: SourceLocation;
}

export interface ValidationWarning {
  message: string;
  node: ASTNode;
  loc?: SourceLocation;
}

export interface PluginGeneratorOptions {
  indent?: string;
  lineTerminator?: string;
  compact?: boolean;
}

// Plugin registry for managing plugins
export interface PluginRegistry {
  register(plugin: BashPlugin): void;
  unregister(pluginName: string): void;
  getPlugin(name: string): BashPlugin | undefined;
  getAllPlugins(): BashPlugin[];
  getCommandHandlers(): CustomCommandHandler[];
  getVisitors(): VisitorPlugin[];
  getGenerators(): GeneratorPlugin[];
  validatePlugin(plugin: BashPlugin): ValidationResult;
}

// Plugin SDK for easier plugin development
export interface PluginSDK {
  createCommandHandler(
    pattern: string,
    handlers: {
      parse: CustomCommandHandler['parse'];
      generate: CustomCommandHandler['generate'];
      validate?: CustomCommandHandler['validate'];
      priority?: number;
    }
  ): CustomCommandHandler;

  createVisitor(
    name: string,
    visitors: Record<string, (path: NodePath) => void>
  ): VisitorPlugin;

  createGenerator(
    name: string,
    handlers: {
      canHandle: (nodeType: string) => boolean;
      generate: (node: ASTNode, options?: PluginGeneratorOptions) => string;
    }
  ): GeneratorPlugin;

  validatePlugin(plugin: BashPlugin): ValidationResult;
}