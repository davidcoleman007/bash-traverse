import { CaseStatement, CaseClause } from '../../types';
import { generateNode } from '../index';
import {
  generateCaseStart,
  generateCaseIn,
  generateCaseEnd
} from '../structural';

/**
 * Case statement generator
 * Case statements commonly need explicit spacing: "case $1 in"
 */
export function generateCaseStatement(caseStatement: CaseStatement): string {
  let result = '';

  // case keyword
  result += generateCaseStart();

  // expression (commonly needs space after 'case')
  result += ' ' + generateNode(caseStatement.expression);

  // in
  result += generateCaseIn();

  // Add newlines after 'in' if they exist
  if (caseStatement.newlinesAfterIn) {
    for (const newline of caseStatement.newlinesAfterIn) {
      result += generateNode(newline);
    }
  }

  // clauses
  for (let i = 0; i < caseStatement.clauses.length; i++) {
    const clause = caseStatement.clauses[i];
    if (clause) {
      const clauseStr = generateCaseClause(clause);
      if (clauseStr) {
        result += clauseStr;
        // Add newline between clauses (but not after the last one)
        if (i < caseStatement.clauses.length - 1) {
          result += '\n';
        }
      }
    }
  }

  // esac
  result += generateCaseEnd(caseStatement.esacIndentation);

  return result;
}

/**
 * Case clause generator
 * Case clauses commonly need explicit spacing: "    start)"
 */
export function generateCaseClause(caseClause: CaseClause): string {
  let result = '';

  // Add indentation before patterns
  if (caseClause.indentation) {
    result += caseClause.indentation;
  }

  // patterns - join without spaces and add ) directly
  for (const pattern of caseClause.patterns) {
    result += generateNode(pattern);
  }
  result += ')';

  // statements
  if (caseClause.statements.length > 0) {
    for (let i = 0; i < caseClause.statements.length; i++) {
      const statement = caseClause.statements[i];
      if (!statement) continue;
      // Output all statements, including DoubleSemicolon
      const generated = generateNode(statement);
      if (generated) {
        result += generated;
      }
    }
  }

  // Do NOT add ;; manually here
  // result += generateClauseEnd();

  return result;
}