import { BraceGroup } from '../../types';
import { generateBlockBody } from '../statements';
import { generateBlockStart, generateBlockEnd } from '../structural';

/**
 * BraceGroup generator
 * Handles brace group generation with proper spacing
 */
export function generateBraceGroup(braceGroup: BraceGroup): string {
  let result = '';

  result += generateBlockStart();

  const body = generateBlockBody(braceGroup.body);
  if (body) {
    result += body;
  }

  result += generateBlockEnd();

  return result;
}