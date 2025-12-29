import { ArithmeticExpansion } from '../../types';

/**
 * ArithmeticExpansion generator
 * Handles arithmetic expansion generation
 */
export function generateArithmeticExpansion(expansion: ArithmeticExpansion): string {
  return `$((${expansion.expression}))`;
}