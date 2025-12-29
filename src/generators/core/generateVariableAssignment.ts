import { VariableAssignment } from '../../types';
import { generateNode } from './generateNode';

/**
 * VariableAssignment generator
 * Handles variable assignment generation
 */
export function generateVariableAssignment(assignment: VariableAssignment): string {
  return `${generateNode(assignment.name)}=${generateNode(assignment.value)}`;
}