const path = require('path');
const fs = require('fs');
const argv  = require('process').argv;
const factory = require('../../lib/common/token-factory');

const expected = []
const text = argv[2];

if (text != null) {
    //const text = `This is a [simple] test.`

    text.split(' ').forEach(function (item, index, arr) {
        if (item.endsWith(',')) {
            // COMMA
            expected.push(factory.word(item.slice(0, -1)));
            expected.push(factory.character(','));
        } else if (item.endsWith('.')) {
            // PERIOD
            expected.push(factory.word(item.slice(0, -1)))
            expected.push(factory.character('.'));
        } else if (item.endsWith('!')) {
            // EXCLAMATION POINT
            expected.push(factory.word(item.slice(0, -1)))
            expected.push(factory.character('!'));
        }
        else if (item.endsWith('?')) {
            // QUESTION MARK
            expected.push(factory.word(item.slice(0, -1)))
            expected.push(factory.character('?'));
        } else if (item.endsWith(';')) {
            // SEMI-COLON
            expected.push(factory.word(item.slice(0, -1)))
            expected.push(factory.character(';'));
        } else if (item.endsWith(':')) {
            // COLON
            expected.push(factory.word(item.slice(0, -1)))
            expected.push(factory.character(':'));
        } else if (item.startsWith(`{`) && item.endsWith('}')) {
            // BRACKET PHRASE
            expected.push({ type: `{`, value: `{` });
            expected.push(factory.word(item.slice(1, -1)));
            expected.push({ type: `}`, value: `}` });
        } else if (item.startsWith(`[`) && item.endsWith(']')) {
            // BRACE PHRASE
            expected.push({ type: `[`, value: `[` });
            expected.push(factory.word(item.slice(1, -1)));
            expected.push({ type: `]`, value: `]` });
        } else if (item.startsWith(`(`) && item.endsWith(')')) {
            // PARENTHESIS PHRASE
            expected.push(factory.word(item));
        } else if (item.startsWith(`"`) && item.endsWith('"')) {
            // DOUBLE QUOTE PHRASE
            expected.push({ type: `"`, value: `"` });
            expected.push(factory.word(item.slice(1, -1)));
            expected.push({ type: `"`, value: `"` });
        } else if (item.startsWith(`'`) && item.endsWith(`'`)) {
            // SINGLE QUOTE PHRASE
            expected.push({ type: `'`, value: `'` });
            expected.push(factory.word(item.slice(1, -1)));
            expected.push({ type: `'`, value: `'` });
        }
        else {
            expected.push(factory.word(item));
        }

        if (index < (arr.length) - 1) {
            // Don't add a space if this is the last item
            expected.push(factory.whitespace(1));
        }
    });

    const fileName = path.join(__dirname, 'test-data.json');
    const data = JSON.stringify({ name: 'TEST_NAME', skip: false, text, tests: expected }, null, 2);
    fs.writeFileSync(fileName, data);
} else {
    console.error(`Please specify input line(s).`)
}