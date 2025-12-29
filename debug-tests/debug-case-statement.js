const { parse, generate } = require('../dist/index');

console.log('=== Case Statement Spacing Debug ===\n');

const testCase = {
  name: 'Case Statement',
  code: 'case $1 in\n    start)\n        echo "Starting..."\n        ;;\n    stop)\n        echo "Stopping..."\n        ;;\n    *)\n        echo "Unknown command"\n        ;;\nesac'
};

console.log(`--- ${testCase.name} ---`);
const ast = parse(testCase.code);
const output = generate(ast);
const visible = output.replace(/ /g, '_').replace(/\n/g, '\\n');
console.log('Input:', testCase.code);
console.log('Visible output:', visible);
console.log('Expected:', 'case_$1_in\\n____start)\\n________echo_"Starting..."\\n________;;\\n____stop)\\n________echo_"Stopping..."\\n________;;\\n____*)\\n________echo_"Unknown_command"\\n________;;\\nesac');