import { BashPlugin } from '../plugin-types';
import { ASTNode, Token } from '../types';

// Simplified Docker plugin implementation
export const dockerPlugin: BashPlugin = {
  name: 'docker-commands',
  version: '1.0.0',
  description: 'Plugin for parsing and generating Docker commands',
  commands: [
    // Docker run command handler
    {
      pattern: 'docker run',
      priority: 10,
      parse: (tokens: Token[], startIndex: number) => {
        let consumedTokens = 0;
        const options: ASTNode[] = [];
        let image: ASTNode | undefined;

        // Skip 'docker' and 'run'
        consumedTokens += 2;

        // Parse options and image
        while (startIndex + consumedTokens < tokens.length) {
          const token = tokens[startIndex + consumedTokens];
          if (!token) break;

          if (token.type === 'WORD' || token.type === 'STRING') {
            if (token.value.startsWith('-')) {
              // This is an option
              options.push({
                type: 'Word',
                text: token.value,
                loc: token.loc
              });
              consumedTokens++;
            } else {
              // This should be the image name
              if (!image) {
                image = {
                  type: 'Word',
                  text: token.value,
                  loc: token.loc
                };
                consumedTokens++;
              } else {
                // Additional arguments after image
                break;
              }
            }
          } else {
            break;
          }
        }

        if (!image) {
          throw new Error('Docker run command requires an image name');
        }

        const node: ASTNode = {
          type: 'DockerRunCommand',
          image,
          options
        };

        return { node, consumedTokens };
      },
      generate: (node: ASTNode) => {
        const dockerNode = node as any;
        let command = 'docker run';

        // Add options
        dockerNode.options.forEach((opt: any) => {
          command += ` ${opt['text']}`;
        });

        // Add image
        command += ` ${dockerNode.image['text']}`;

        return command;
      },
      validate: (node: ASTNode) => {
        const dockerNode = node as any;
        const errors: any[] = [];
        const warnings: any[] = [];

        if (!dockerNode.image) {
          errors.push({
            message: 'Docker run command requires an image',
            node: dockerNode
          });
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings
        };
      }
    },

    // Docker build command handler
    {
      pattern: 'docker build',
      priority: 10,
      parse: (tokens: Token[], startIndex: number) => {
        let consumedTokens = 0;
        const options: ASTNode[] = [];
        let context: ASTNode | undefined;

        // Skip 'docker' and 'build'
        consumedTokens += 2;

        while (startIndex + consumedTokens < tokens.length) {
          const token = tokens[startIndex + consumedTokens];
          if (!token) break;

          if (token.type === 'WORD' || token.type === 'STRING') {
            if (token.value.startsWith('-')) {
              // This is an option
              options.push({
                type: 'Word',
                text: token.value,
                loc: token.loc
              });
              consumedTokens++;
            } else {
              // This should be the build context
              if (!context) {
                context = {
                  type: 'Word',
                  text: token.value,
                  loc: token.loc
                };
                consumedTokens++;
              }
            }
          } else {
            break;
          }
        }

        if (!context) {
          throw new Error('Docker build command requires a build context');
        }

        const node: ASTNode = {
          type: 'DockerBuildCommand',
          context,
          options
        };

        return { node, consumedTokens };
      },
      generate: (node: ASTNode) => {
        const dockerNode = node as any;
        let command = 'docker build';

        // Add options
        dockerNode.options.forEach((opt: any) => {
          command += ` ${opt['text']}`;
        });

        // Add context
        command += ` ${dockerNode.context['text']}`;

        return command;
      }
    }
  ],

  visitors: [
    {
      name: 'docker-optimizer',
      DockerRunCommand: (path: any) => {
        const node = path.node as any;

        // Add --rm flag if not present
        const hasRm = node.options.some((opt: any) => opt['text'] === '--rm');
        if (!hasRm) {
          node.options.push({
            type: 'Word',
            text: '--rm',
            loc: node.loc
          });
        }
      },

      DockerBuildCommand: (path: any) => {
        const node = path.node as any;

        // Add --no-cache flag for faster builds in development
        const hasNoCache = node.options.some((opt: any) => opt['text'] === '--no-cache');
        if (!hasNoCache) {
          node.options.push({
            type: 'Word',
            text: '--no-cache',
            loc: node.loc
          });
        }
      }
    }
  ],

  generators: [
    {
      name: 'docker-generator',
      canHandle: (nodeType: string) => {
        return ['DockerRunCommand', 'DockerBuildCommand'].includes(nodeType);
      },
      generate: (node: ASTNode) => {
        switch (node.type) {
          case 'DockerRunCommand':
            return generateDockerRun(node as any);
          case 'DockerBuildCommand':
            return generateDockerBuild(node as any);
          default:
            throw new Error(`Unknown Docker command type: ${node.type}`);
        }
      }
    }
  ]
};

// Helper functions for generation
function generateDockerRun(node: any): string {
  let command = 'docker run';

  // Add options
  node.options.forEach((opt: any) => {
    command += ` ${opt['text']}`;
  });

  // Add image
  command += ` ${node.image['text']}`;

  return command;
}

function generateDockerBuild(node: any): string {
  let command = 'docker build';

  // Add options
  node.options.forEach((opt: any) => {
    command += ` ${opt['text']}`;
  });

  // Add context
  command += ` ${node.context['text']}`;

  return command;
}