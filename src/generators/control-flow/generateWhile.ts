import { WhileStatement } from '../../types';
import { generateNode } from '../index';

/**
 * While statement generator
 * Pure AST-driven generation - minimal spacing for structural parts
 */
export function generateWhileStatement(whileStatement: WhileStatement): string {
  let result = '';

  // while keyword
  result += 'while';

  // condition
  result += ' ' + generateNode(whileStatement.condition);

  // semicolon after condition (if present)
  if (whileStatement.semicolonAfterCondition) {
    result += generateNode(whileStatement.semicolonAfterCondition);
  }

  // do
  result += ' do';

  // body - each statement generates itself with its own spacing
  for (const statement of whileStatement.body) {
    result += generateNode(statement);
  }

  // done
  result += 'done';

  return result;
}