import { IfStatement } from '../../types';
import { generateNode } from '../index';

/**
 * If statement generator
 * If statements commonly need explicit spacing: "if [condition]; then"
 */
export function generateIfStatement(ifStatement: IfStatement): string {
  let result = '';

  // if keyword
  result += 'if';

  // condition (commonly needs space after 'if')
  result += ' ' + generateNode(ifStatement.condition);

  // semicolon after condition (if present)
  if (ifStatement['semicolonAfterCondition']) {
    result += generateNode(ifStatement['semicolonAfterCondition']);
  }

  // then keyword (commonly needs space before)
  result += ' then';

  // then body - each statement generates itself with its own spacing
  for (const statement of ifStatement.thenBody) {
    result += generateNode(statement);
  }

  // elif clauses
  for (const elifClause of ifStatement.elifClauses) {
    result += ' elif';
    result += ' ' + generateNode(elifClause.condition);

    // semicolon after elif condition (if present)
    if (elifClause.semicolonAfterCondition) {
      result += generateNode(elifClause.semicolonAfterCondition);
    }

    result += ' then';
    for (const statement of elifClause.body) {
      result += generateNode(statement);
    }
  }

  // else clause - no explicit space addition, let AST handle spacing
  if (ifStatement.elseBody) {
    result += 'else'; // Let the AST Space nodes handle spacing
    for (const statement of ifStatement.elseBody) {
      result += generateNode(statement);
    }
  }

  // fi keyword
  result += 'fi';

  return result;
}