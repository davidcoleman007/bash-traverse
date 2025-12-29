const { parse, generate } = require('../dist');

console.log('🔍 Debugging case statement issue...\n');

// Test the problematic case statement specifically
const testCase = `case "$check_artifact" in publish)
            (cd dist-test; npm publish)
        ;;
        conflict)
        echo "Attempted to override previously published version"
        exit 1
        ;;
        error*)
        echo $check_artifact
        exit 1
        ;;
        skip)
        echo "Published artifact has not changed.  Skipping publish."
        exit 1
        ;;
    esac`;

console.log('Testing case statement:');
console.log('==================================================');
console.log(testCase);
console.log('==================================================');

// Parse the case statement
const ast = parse(testCase);
console.log('AST:');
console.log(JSON.stringify(ast, null, 2));

console.log('\n==================================================');

// Generate from AST
const generated = generate(ast);
console.log('Generated:');
console.log(generated);

console.log('\n==================================================');
console.log('Match:', testCase === generated ? '✅ YES' : '❌ NO');
if (testCase !== generated) {
    console.log('Original:', JSON.stringify(testCase));
    console.log('Generated:', JSON.stringify(generated));

    // Show character-by-character differences
    console.log('\nCharacter-by-character comparison:');
    const maxLength = Math.max(testCase.length, generated.length);
    for (let i = 0; i < maxLength; i++) {
        const origChar = i < testCase.length ? testCase[i] : '[MISSING]';
        const genChar = i < generated.length ? generated[i] : '[MISSING]';
        if (origChar !== genChar) {
            console.log(`Position ${i}: '${origChar}' vs '${genChar}' (${origChar.charCodeAt(0)} vs ${genChar.charCodeAt(0)})`);
        }
    }
}