import { TestExpression } from '../../types';
import { generateNode } from './generateNode';

/**
 * TestExpression generator
 * Test expressions commonly need explicit spacing: "[ -f file.txt ]"
 */
export function generateTestExpression(node: TestExpression): string {
  // Use double brackets for extended test expressions, single brackets for POSIX
  const brackets = node.extended ? '[[' : '[';
  const closeBrackets = node.extended ? ']]' : ']';

  let result = brackets;

  // Generate elements in the order they appear
  for (let i = 0; i < node.elements.length; i++) {
    const element = node.elements[i];

    if (element && element.isOperator && element.operator) {
      result += ' ' + generateNode(element.operator);
    } else if (element && !element.isOperator && element.argument) {
      result += ' ' + generateNode(element.argument);
    }
  }

  result += ' ' + closeBrackets;
  return result;
}