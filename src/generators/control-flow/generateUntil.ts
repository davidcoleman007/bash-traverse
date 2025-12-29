import { UntilStatement } from '../../types';
import { generateNode } from '../index';

/**
 * Until statement generator
 * Pure AST-driven generation - minimal spacing for structural parts
 */
export function generateUntilStatement(untilStatement: UntilStatement): string {
  let result = '';

  // until keyword
  result += 'until';

  // condition
  result += generateNode(untilStatement.condition);

  // do
  result += 'do';

  // body - each statement generates itself with its own spacing
  for (const statement of untilStatement.body) {
    result += generateNode(statement);
  }

  // done
  result += 'done';

  return result;
}