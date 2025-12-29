import { ArrayAssignment } from '../../types';
import { generateNode } from './generateNode';

/**
 * ArrayAssignment generator
 * Handles array assignment generation
 */
export function generateArrayAssignment(arrayAssignment: ArrayAssignment): string {
  let result = '';

  result += generateNode(arrayAssignment.name);
  result += '=(';

  for (const element of arrayAssignment.elements) {
    result += generateNode(element);
  }

  result += ')';

  return result;
}