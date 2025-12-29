import { ASTNode, Program, Command, Word, Comment, Shebang, NewlineStatement, SemicolonStatement, SpaceStatement, Pipeline, Subshell, BraceGroup, FunctionDefinition, Redirect, VariableExpansion, CommandSubstitution, ArithmeticExpansion, Assignment, VariableAssignment, ArrayAssignment, ArrayElement, HereDocument, TestExpression, IfStatement, ForStatement, WhileStatement, UntilStatement, CaseStatement, CaseClause, LineContinuationStatement, ContinuationMarkerStatement } from '../../types';
import { generateProgram } from './generateProgram';
import { generateCommand } from '../text/generateCommand';
import { generateWord } from '../text/generateWord';
import { generateComment } from './generateComment';
import { generateShebang } from './generateShebang';
import { generateNewline } from './generateNewline';
import { generateSemicolon } from './generateSemicolon';
import { generateSpace } from '../text/generateSpace';
import { generatePipeline } from './generatePipeline';
import { generateSubshell } from './generateSubshell';
import { generateBraceGroup } from './generateBraceGroup';
import { generateRedirect } from './generateRedirect';
import { generateVariableExpansion } from './generateVariableExpansion';
import { generateCommandSubstitution } from './generateCommandSubstitution';
import { generateArithmeticExpansion } from './generateArithmeticExpansion';
import { generateAssignment } from './generateAssignment';
import { generateVariableAssignment } from './generateVariableAssignment';
import { generateArrayAssignment } from './generateArrayAssignment';
import { generateArrayElement } from './generateArrayElement';
import { generateHereDocument } from '../text/generateHereDocument';
import { generateTestExpression } from './generateTestExpression';
import { generateFunctionDefinition } from './generateFunctionDefinition';
import { generateLineContinuation } from './generateLineContinuation';
import { generateContinuationMarker } from './generateContinuationMarker';
import { generateIfStatement, generateForStatement, generateWhileStatement, generateUntilStatement, generateCaseStatement, generateCaseClause } from '../control-flow';

/**
 * Main node generator dispatcher
 * Routes to appropriate generator based on node type
 */
export function generateNode(node: ASTNode): string {
  switch (node.type) {
    case 'Program':
      return generateProgram(node as Program);
    case 'Command':
      return generateCommand(node as Command);
    case 'Word':
      return generateWord(node as Word);
    case 'Comment':
      return generateComment(node as Comment);
    case 'Shebang':
      return generateShebang(node as Shebang);
    case 'Newline':
      return generateNewline(node as NewlineStatement);
    case 'Semicolon':
      return generateSemicolon(node as SemicolonStatement);
    case 'DoubleSemicolon':
      return ';;';  // This represents CLAUSE_END in the AST
    case 'Space':
      return generateSpace(node as SpaceStatement);
    case 'SpaceStatement':
      return generateSpace(node as SpaceStatement);
    case 'Pipeline':
      return generatePipeline(node as Pipeline);
    case 'Subshell':
      return generateSubshell(node as Subshell);
    case 'BraceGroup':
      return generateBraceGroup(node as BraceGroup);
    case 'FunctionDefinition':
      return generateFunctionDefinition(node as FunctionDefinition);
    case 'Redirect':
      return generateRedirect(node as Redirect);
    case 'VariableExpansion':
      return generateVariableExpansion(node as VariableExpansion);
    case 'CommandSubstitution':
      return generateCommandSubstitution(node as CommandSubstitution);
    case 'ArithmeticExpansion':
      return generateArithmeticExpansion(node as ArithmeticExpansion);
    case 'Assignment':
      return generateAssignment(node as Assignment);
    case 'VariableAssignment':
      return generateVariableAssignment(node as VariableAssignment);
    case 'ArrayAssignment':
      return generateArrayAssignment(node as ArrayAssignment);
    case 'ArrayElement':
      return generateArrayElement(node as ArrayElement);
    case 'HereDocument':
      return generateHereDocument(node as HereDocument);
    case 'TestExpression':
      return generateTestExpression(node as TestExpression);
    case 'IfStatement':
      return generateIfStatement(node as IfStatement);
    case 'ForStatement':
      return generateForStatement(node as ForStatement);
    case 'WhileStatement':
      return generateWhileStatement(node as WhileStatement);
    case 'UntilStatement':
      return generateUntilStatement(node as UntilStatement);
    case 'CaseStatement':
      return generateCaseStatement(node as CaseStatement);
    case 'CaseClause':
      return generateCaseClause(node as CaseClause);
    case 'LineContinuation':
      return generateLineContinuation(node as LineContinuationStatement);
    case 'ContinuationMarker':
      return generateContinuationMarker(node as ContinuationMarkerStatement);
    default:
      throw new Error(`Unknown node type: ${(node as any).type}`);
  }
}