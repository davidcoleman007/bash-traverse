import { Statement } from "../../types";
import { generateNode } from "../index";

export function generateBlockBody(statements: Statement[]): string {
  if (statements.length === 0) {
    return '';
  }

  let result = '';

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (!statement) continue;

    const generated = generateNode(statement);
    if (!generated) continue;

    // Add the generated content directly without extra spacing
    result += generated;
  }

  return result;
}
