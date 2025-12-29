import { FunctionDefinition } from '../../types';
import { generateNode } from './generateNode';
import { generateBlockBody } from '../statements';
import { generateBlockStart, generateBlockEnd, generateFunctionKeyword } from '../structural';

/**
 * FunctionDefinition generator
 * Handles function definition generation with proper spacing
 */
export function generateFunctionDefinition(functionDef: FunctionDefinition): string {
  let result = '';

  result += generateFunctionKeyword();

  // Emit spaces between 'function' and the function name
  if (functionDef['spaces'] && Array.isArray(functionDef['spaces'])) {
    for (const space of functionDef['spaces']) {
      result += generateNode(space);
    }
  }

  result += generateNode(functionDef.name);

  if (functionDef.hasParentheses) {
    result += '()';
  }

  result += ' ' + generateBlockStart();

  const body = generateBlockBody(functionDef.body);
  if (body) {
    result += body;
  }

  result += generateBlockEnd();

  return result;
}