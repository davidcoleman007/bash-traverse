import { CommandSubstitution } from '../../types';
import { generateBlockBody } from '../statements';

/**
 * CommandSubstitution generator
 * Handles command substitution with different styles
 */
export function generateCommandSubstitution(substitution: CommandSubstitution): string {
  const command = generateBlockBody(substitution.command);

  if (substitution.style === '$()') {
    return `$(${command})`;
  } else {
    return `\`${command}\``;
  }
}