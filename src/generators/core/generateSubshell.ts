import { Subshell } from '../../types';
import { generateBlockBody } from '../statements';

/**
 * Subshell generator
 * Handles subshell generation with parentheses
 */
export function generateSubshell(subshell: Subshell): string {
  const body = generateBlockBody(subshell.body);
  return `(${body})`;
}