import { HereDocument } from '../../types';
import { generateNode } from '../index';

/**
 * HereDocument generator
 * Handles heredoc generation with proper newline handling
 */
export function generateHereDocument(hereDoc: HereDocument): string {
  let result = '<< ';

  if (hereDoc.stripTabs) {
    result += '-';
  }

  result += generateNode(hereDoc.delimiter);

  // Add content directly since it already includes the proper newlines
  result += hereDoc.content;
  result += generateNode(hereDoc.delimiter);

  return result;
}