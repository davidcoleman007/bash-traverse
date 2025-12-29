import { Program } from '../../types';
import { generateNode } from './generateNode';

/**
 * Program generator
 * Generates the complete program from the AST root
 */
export function generateProgram(program: Program): string {
  let result = '';

  // Generate each statement directly (no array joining to preserve exact formatting)
  for (const statement of program.body) {
    result += generateNode(statement);
  }

  return result;
}