/**
 * Loop-related structural generators
 */

export function generateLoopStart(): string {
  return 'do';
}

export function generateLoopEnd(): string {
  return 'done';
}

export function generateWhileKeyword(): string {
  return 'while';
}

export function generateUntilKeyword(): string {
  return 'until';
}

export function generateForKeyword(): string {
  return 'for';
}

export function generateInKeyword(): string {
  return 'in';
}