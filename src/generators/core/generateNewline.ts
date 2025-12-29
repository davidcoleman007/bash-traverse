import { NewlineStatement } from '../../types';
import { getConfig } from '../config';

/**
 * Newline generator
 * Handles newline generation with configurable line terminators
 */
export function generateNewline(_newline: NewlineStatement): string {
  const config = getConfig();
  return config.lineTerminator;
}