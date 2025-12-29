import { ArrayElement } from '../../types';
import { generateNode } from './generateNode';

/**
 * ArrayElement generator
 * Handles array element generation with optional index
 */
export function generateArrayElement(element: ArrayElement): string {
  if (element.index) {
    return `[${generateNode(element.index)}]=${generateNode(element.value)}`;
  } else {
    return generateNode(element.value);
  }
}