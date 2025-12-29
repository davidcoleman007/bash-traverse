import { Token, SourceLocation } from '../types';

/**
 * Parser interface that parser modules can use
 * This abstracts the parser methods that modules need
 */
export interface BashParser {
  // Token management
  isAtEnd(): boolean;
  peek(offset?: number): Token | null;
  advance(): Token | null;
  match(type: string): boolean;
  consume(type: string, message: string): Token;

  // Current position
  current: number;

  // Parsing methods
  parseStatement(): any;
  parsePosixTestExpression(): any;
  parseExtendedTestExpression(): any;
  parseWord(): any;
  parseCommand(): any;

  // Utility methods
  createLocation(start: SourceLocation | undefined, end: SourceLocation | undefined): SourceLocation | undefined;
}