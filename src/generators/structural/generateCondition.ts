/**
 * Condition-related structural generators
 */

export function generateConditionStart(): string {
  return 'then';
}

export function generateConditionEnd(): string {
  return 'fi';
}

export function generateIfKeyword(): string {
  return 'if';
}

export function generateElifKeyword(): string {
  return 'elif';
}

export function generateElseKeyword(): string {
  return 'else';
}