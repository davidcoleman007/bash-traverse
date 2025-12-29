import { ContinuationMarkerStatement } from '../../types';

/**
 * Generate continuation marker statement
 * Outputs the backslash and newline characters
 */
export function generateContinuationMarker(node: ContinuationMarkerStatement): string {
  // Return the original value (backslash + newline)
  return node.value;
}