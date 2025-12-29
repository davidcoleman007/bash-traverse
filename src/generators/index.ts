import { Program, GeneratorOptions } from '../types';

import { generateNode } from './core';
import { initConfig } from './config';

/**
 * Main generator function
 * Entry point for code generation
 */
export function generate(ast: Program, options?: GeneratorOptions): string {
  // Initialize global config
  initConfig(options);

  // Generate the program
  return generateNode(ast);
}

// Re-export all generators
export * from './core';
export * from './text';
export * from './structural';
export * from './statements';
export * from './control-flow';
export * from './config';