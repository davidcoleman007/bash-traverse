import { GeneratorOptions } from '../types';

/**
 * Global generator configuration
 * Singleton pattern for accessing generator options throughout the codebase
 */
let globalConfig: Required<GeneratorOptions> | null = null;

/**
 * Initialize the global generator configuration
 */
export function initConfig(options: GeneratorOptions = {}): void {
  globalConfig = {
    comments: options.comments ?? true,
    compact: options.compact ?? false,
    indent: options.indent ?? '  ',
    lineTerminator: options.lineTerminator ?? '\n'
  };
}

/**
 * Get the current global configuration
 */
export function getConfig(): Required<GeneratorOptions> {
  if (!globalConfig) {
    // Initialize with defaults if not set
    initConfig();
  }
  return globalConfig!;
}

/**
 * Reset the global configuration (useful for testing)
 */
export function resetConfig(): void {
  globalConfig = null;
}

/**
 * Get a specific config option with optional override
 */
export function getConfigOption<K extends keyof GeneratorOptions>(
  key: K,
  override?: GeneratorOptions[K]
): Required<GeneratorOptions>[K] {
  const config = getConfig();
  return (override !== undefined ? override : config[key]) as Required<GeneratorOptions>[K];
}