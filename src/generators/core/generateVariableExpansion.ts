import { VariableExpansion } from '../../types';
import { generateNode } from './generateNode';

/**
 * VariableExpansion generator
 * Handles variable expansion generation with modifiers
 */
export function generateVariableExpansion(expansion: VariableExpansion): string {
  let result = `$${generateNode(expansion.name)}`;

  if (expansion.modifier) {
    result += generateNode(expansion.modifier);
  }

  return result;
}