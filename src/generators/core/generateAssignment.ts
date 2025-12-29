import { Assignment } from '../../types';
import { generateNode } from './generateNode';

/**
 * Assignment generator
 * Handles basic assignment generation
 */
export function generateAssignment(assignment: Assignment): string {
  return `${generateNode(assignment.name)}=${generateNode(assignment.value)}`;
}