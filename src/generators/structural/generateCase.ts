/**
 * Case-related structural generators
 * Case statements commonly need explicit spacing: "case $1 in"
 */

export function generateCaseStart(): string {
  return 'case';
}

export function generateCaseEnd(esacIndentation?: string): string {
  const indent = esacIndentation || '';
  return '\n' + indent + 'esac';
}

export function generateCaseIn(): string {
  return ' in';
}

export function generateClauseEnd(): string {
  return ';;';
}