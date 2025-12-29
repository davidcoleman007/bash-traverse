import { Program, Visitor, NodePath, ASTNode } from './types';
import { BashPlugin } from './plugin-types';

// NodePath implementation for AST traversal
class NodePathImpl<T extends ASTNode = ASTNode> implements NodePath<T> {
  node: T;
  parent: NodePath | null;
  parentKey: string | null;
  parentIndex: number | null;
  type: string;

  constructor(node: T, parent: NodePath | null = null, parentKey: string | null = null, parentIndex: number | null = null) {
    this.node = node;
    this.parent = parent;
    this.parentKey = parentKey;
    this.parentIndex = parentIndex;
    this.type = node.type;
  }

  get(key: string): NodePath | null {
    const value = (this.node as any)[key];
    if (value === undefined || value === null) {
      return null;
    }

    if (Array.isArray(value)) {
      // Return first element if it's an array
      return value.length > 0 ? new NodePathImpl(value[0], this, key, 0) : null;
    }

    if (typeof value === 'object' && value.type) {
      return new NodePathImpl(value, this, key, null);
    }

    return null;
  }

  getNode(key: string): ASTNode | null {
    const value = (this.node as any)[key];
    if (value === undefined || value === null) {
      return null;
    }

    if (Array.isArray(value)) {
      return value.length > 0 ? value[0] : null;
    }

    if (typeof value === 'object' && value.type) {
      return value;
    }

    return null;
  }

  isNodeType(type: string): boolean {
    return this.type === type;
  }

  replaceWith(node: ASTNode): void {
    if (!this.parent) {
      throw new Error('Cannot replace root node');
    }

    if (this.parentKey && this.parentIndex !== null) {
      // Array element
      const parentNode = this.parent.node as any;
      parentNode[this.parentKey][this.parentIndex] = node;
    } else if (this.parentKey) {
      // Object property
      const parentNode = this.parent.node as any;
      parentNode[this.parentKey] = node;
    }

    // Update this node
    this.node = node as T;
    this.type = node.type;
  }

  insertBefore(node: ASTNode): void {
    if (!this.parent || this.parentKey === null || this.parentIndex === null) {
      throw new Error('Cannot insert before: not an array element');
    }

    const parentNode = this.parent.node as any;
    parentNode[this.parentKey].splice(this.parentIndex, 0, node);

    // Update indices for subsequent elements
    const parentPath = this.parent as NodePathImpl;
    for (let i = this.parentIndex + 1; i < parentNode[this.parentKey].length; i++) {
      const childPath = parentPath.get(this.parentKey);
      if (childPath && i < parentNode[this.parentKey].length) {
        (childPath as NodePathImpl).parentIndex = i;
      }
    }
  }

  insertAfter(node: ASTNode): void {
    if (!this.parent || this.parentKey === null || this.parentIndex === null) {
      throw new Error('Cannot insert after: not an array element');
    }

    const parentNode = this.parent.node as any;
    parentNode[this.parentKey].splice(this.parentIndex + 1, 0, node);

    // Update indices for subsequent elements
    const parentPath = this.parent as NodePathImpl;
    for (let i = this.parentIndex + 2; i < parentNode[this.parentKey].length; i++) {
      const childPath = parentPath.get(this.parentKey);
      if (childPath && i < parentNode[this.parentKey].length) {
        (childPath as NodePathImpl).parentIndex = i;
      }
    }
  }

  remove(): void {
    if (!this.parent || this.parentKey === null || this.parentIndex === null) {
      throw new Error('Cannot remove: not an array element');
    }

    const parentNode = this.parent.node as any;
    parentNode[this.parentKey].splice(this.parentIndex, 1);

    // Update indices for subsequent elements
    const parentPath = this.parent as NodePathImpl;
    for (let i = this.parentIndex; i < parentNode[this.parentKey].length; i++) {
      const childPath = parentPath.get(this.parentKey);
      if (childPath && i < parentNode[this.parentKey].length) {
        (childPath as NodePathImpl).parentIndex = i;
      }
    }
  }
}

// Traversal context for managing state during traversal
interface TraversalContext {
  visitors: Visitor[];
  pluginVisitors: any[];
  enterHooks: Map<string, ((path: NodePath) => void)[]>;
  exitHooks: Map<string, ((path: NodePath) => void)[]>;
}

// Helper function to get all child nodes of a given node
function getChildNodes(node: ASTNode): Array<{ key: string; value: any; index?: number }> {
  const children: Array<{ key: string; value: any; index?: number }> = [];

  for (const [key, value] of Object.entries(node)) {
    if (key === 'type' || key === 'loc') continue;

    if (Array.isArray(value)) {
      // Array of nodes
      value.forEach((item, index) => {
        if (item && typeof item === 'object' && item.type) {
          children.push({ key, value: item, index });
        }
      });
    } else if (value && typeof value === 'object' && value.type) {
      // Single node
      children.push({ key, value });
    }
  }

  return children;
}

// Main traversal function
function traverseNode(node: ASTNode, context: TraversalContext, parent: NodePath | null = null, parentKey: string | null = null, parentIndex: number | null = null): void {
  const path = new NodePathImpl(node, parent, parentKey, parentIndex);

  // Call enter hooks
  const enterHooks = context.enterHooks.get(node.type) || [];
  for (const hook of enterHooks) {
    hook(path);
  }

  // Call visitor for this node type
  const allVisitors = [...context.visitors, ...context.pluginVisitors];
  for (const visitor of allVisitors) {
    const visitorFn = visitor[node.type];
    if (visitorFn && typeof visitorFn === 'function') {
      visitorFn(path);
    }
  }

  // Traverse children
  const children = getChildNodes(node);
  for (const child of children) {
    traverseNode(child.value, context, path, child.key, child.index);
  }

  // Call exit hooks
  const exitHooks = context.exitHooks.get(node.type) || [];
  for (const hook of exitHooks) {
    hook(path);
  }
}

// Main traverse function
export function traverse(ast: Program, visitor: Visitor, plugins?: BashPlugin[]): void {
  const context: TraversalContext = {
    visitors: [visitor],
    pluginVisitors: [],
    enterHooks: new Map(),
    exitHooks: new Map()
  };

  // Add plugin visitors
  if (plugins) {
    for (const plugin of plugins) {
      if (plugin.visitors) {
        context.pluginVisitors.push(...plugin.visitors);
      }
    }
  }

  // Process enter/exit hooks from visitors
  for (const visitor of context.visitors) {
    for (const [nodeType, visitorFn] of Object.entries(visitor)) {
      if (nodeType.startsWith('enter')) {
        const actualNodeType = nodeType.slice(5); // Remove 'enter' prefix
        if (!context.enterHooks.has(actualNodeType)) {
          context.enterHooks.set(actualNodeType, []);
        }
        context.enterHooks.get(actualNodeType)!.push(visitorFn);
      } else if (nodeType.startsWith('exit')) {
        const actualNodeType = nodeType.slice(4); // Remove 'exit' prefix
        if (!context.exitHooks.has(actualNodeType)) {
          context.exitHooks.set(actualNodeType, []);
        }
        context.exitHooks.get(actualNodeType)!.push(visitorFn);
      }
    }
  }

  // Start traversal from root
  traverseNode(ast, context);
}

// Utility functions for common traversal patterns

// Find all nodes of a specific type
export function findNodes(ast: Program, nodeType: string): NodePath[] {
  const results: NodePath[] = [];

  traverse(ast, {
    [nodeType]: (path) => {
      results.push(path);
    }
  });

  return results;
}

// Find the first node of a specific type
export function findNode(ast: Program, nodeType: string): NodePath | null {
  let result: NodePath | null = null;

  traverse(ast, {
    [nodeType]: (path) => {
      if (!result) {
        result = path;
      }
    }
  });

  return result;
}

// Check if AST contains a specific node type
export function hasNode(ast: Program, nodeType: string): boolean {
  let found = false;

  traverse(ast, {
    [nodeType]: () => {
      found = true;
    }
  });

  return found;
}

// Count nodes of a specific type
export function countNodes(ast: Program, nodeType: string): number {
  let count = 0;

  traverse(ast, {
    [nodeType]: () => {
      count++;
    }
  });

  return count;
}

// Transform AST by applying a visitor that can modify nodes
export function transform(ast: Program, visitor: Visitor, plugins?: BashPlugin[]): Program {
  // Clone the AST to avoid modifying the original
  const clonedAst = JSON.parse(JSON.stringify(ast));

  traverse(clonedAst, visitor, plugins);

  return clonedAst;
}