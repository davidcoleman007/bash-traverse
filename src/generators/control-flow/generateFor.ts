import { ForStatement } from '../../types';
import { generateNode } from '../index';

/**
 * For statement generator
 * For loops always need explicit spacing: "for i in 1 2 3; do"
 */
export function generateForStatement(forStatement: ForStatement): string {
  let result = '';

  // for keyword
  result += 'for';

  // variable (always needs space after 'for')
  result += ' ' + generateNode(forStatement.variable);

  // in keyword (always needs space before and after)
  result += ' in';

  // word list (spaces between words)
  if (forStatement.wordlist && forStatement.wordlist.length > 0) {
    for (let i = 0; i < forStatement.wordlist.length; i++) {
      const word = forStatement.wordlist[i];
      if (word) {
        result += ' ' + generateNode(word);
      }
    }
  }

  // semicolon after wordlist (if present)
  if (forStatement.semicolonAfterWordlist) {
    result += ';';
  }

  // do keyword (always needs space before)
  result += ' do';

  // body - each statement generates itself with its own spacing
  for (const statement of forStatement.body) {
    result += generateNode(statement);
  }

  // done keyword
  result += 'done';

  return result;
}