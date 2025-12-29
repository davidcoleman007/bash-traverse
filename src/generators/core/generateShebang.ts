import { Shebang } from '../../types';

/**
 * Shebang generator
 * Handles shebang line generation
 */
export function generateShebang(shebang: Shebang): string {
  return shebang.text;
}