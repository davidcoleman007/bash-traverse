const { parse, generate } = require('../dist/index');

console.log('=== For Loop Spacing Debug ===\n');

const testCase = {
  name: 'For Loop',
  code: 'for i in 1 2 3; do\n    echo "Number: $i"\ndone'
};

console.log(`--- ${testCase.name} ---`);
const ast = parse(testCase.code);
const output = generate(ast);
const visible = output.replace(/ /g, '_').replace(/\n/g, '\\n');
console.log('Input:', testCase.code);
console.log('Visible output:', visible);
console.log('Expected:', 'for_i_in_1_2_3;do\\n____echo_"Number:_$i"\\ndone');