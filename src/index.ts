// Main exports
export { parse, BashParser } from './parser';
export { generate } from './generators';
export { traverse, findNodes, findNode, hasNode, countNodes, transform } from './traverse';

// Type exports
export * from './types';

// Plugin system exports
export * from './plugin-types';
export { PluginRegistry } from './plugin-registry';
export { PluginSDK } from './plugin-sdk';

// Plugin examples
export { dockerPlugin } from './plugins/docker-plugin';

// Lexer export (for advanced usage)
export { BashLexer } from './lexer';