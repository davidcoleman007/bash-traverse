import { Redirect } from '../../types';
import { generateNode } from './generateNode';

/**
 * Redirect generator
 * Handles redirection generation with file descriptors
 */
export function generateRedirect(redirect: Redirect): string {
  let result = '';

  if (redirect.fd !== undefined && redirect.fd !== 1) {
    result += `${redirect.fd}`;
  }

  result += redirect.operator;
  result += generateNode(redirect.target);

  return result;
}