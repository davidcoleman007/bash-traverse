import { Word } from '../../types';

/**
 * Word generator
 * Handles quoted and unquoted words
 */
export function generateWord(word: Word): string {
  // If the word was originally quoted, preserve the quotes
  if (word.quoted) {
    const quote = word.quoteType || '"';
    return `${quote}${word.text}${quote}`;
  }

  // If the word was not quoted, return as-is
  return word.text;
}