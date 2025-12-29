import { Comment } from '../../types';
import { getConfig } from '../config';

/**
 * Comment generator
 * Handles comment generation with configurable options
 */
export function generateComment(comment: Comment): string {
  const config = getConfig();

  if (!config.comments) {
    return '';
  }

  return comment.value;
}