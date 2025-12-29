import { LineContinuationStatement } from '../../types';

/**
 * Generate line continuation statement
 * Outputs the backslash and newline characters
 */
export function generateLineContinuation(node: LineContinuationStatement): string {
  // Return the original value (backslash + newline)
  return node.value;
}