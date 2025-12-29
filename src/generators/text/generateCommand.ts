import { Command } from '../../types';
import { generateNode } from '../index';
import { generateHereDocument } from './generateHereDocument';

/**
 * Command generator
 * Handles command generation with proper spacing preservation
 */
export function generateCommand(command: Command): string {
  const parts: string[] = [];

  // Variable assignment prefixes (e.g., NODE_ENV=production)
  if (command.prefixStatements && command.prefixStatements.length > 0) {
    for (const prefixStatement of command.prefixStatements) {
      parts.push(generateNode(prefixStatement));
    }
  }

  // Command name
  parts.push(generateNode(command.name));

  // Arguments
  for (const arg of command.arguments) {
    parts.push(generateNode(arg));
  }

  // Redirects
  if (command.redirects && Array.isArray(command.redirects)) {
    for (const redirect of command.redirects) {
      parts.push(generateNode(redirect));
    }
  }

  // Concatenate parts with proper spacing
  let result = '';
  for (let i = 0; i < parts.length; i++) {
    result += parts[i];
          // Add preserved spaces between prefix statements and command name
      if (i === 0 && command.prefixStatements && command.prefixStatements.length > 0) {
        // Use preserved spaces if available, otherwise add a single space
        if (command.name['spacesAfterPrefix'] && command.name['spacesAfterPrefix'].length > 0) {
          for (const spaceToken of command.name['spacesAfterPrefix']) {
            result += spaceToken.value;
          }
        } else {
          result += ' ';
        }
      }
  }

  // Generate heredoc (no extra space needed)
  if (command.hereDocument) {
    result += generateHereDocument(command.hereDocument);
  }

  return result;
}