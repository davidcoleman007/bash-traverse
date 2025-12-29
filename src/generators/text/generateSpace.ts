import { SpaceStatement } from '../../types';

/**
 * Space generator
 * Handles space tokens for preserving exact spacing
 */
export function generateSpace(space: SpaceStatement): string {
  return space.value;
}