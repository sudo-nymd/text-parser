import { Token, TokenTypes } from '../src/common/token-types';
import { Tokenizer, ModuleName } from '../src/tokenizer';
import * as factory from '../src/common/token-factory'
import * as logger from './lib/logger';
import * as fs from 'fs';
import path = require('path');
import { expect } from 'chai';
import { Keywords } from '../src/plugins/keywords';
import { argv } from 'process';

// "Stateless" logging functions (avoid clashes with Mocha's hijackng of "this")
const LOGENTRY = logger.create(ModuleName);
const log = (msg: string | object, src?: string) => logger.log(LOGENTRY, msg, src);
const debug = (msg: object, src?: string) => logger.debug(LOGENTRY, msg, src);
const error = (msg: string | object, src?: string) => logger.error(LOGENTRY, msg, src);
const warn = (msg: string | object, src?: string) => logger.warn(LOGENTRY, msg, src);

describe(`Tests the "${ModuleName}" Module.`, function () {

    afterEach(() => {
        // Flush logging buffer after every test!
        logger.flush(LOGENTRY);
    });

    it(`Tests the init() method.`, function(done) {

        // NULL text should throw
        expect(() => {
            new Tokenizer().init(null);
        }).to.throw(ReferenceError);

        // NULL plugin spec should throw
        expect(() => {
            new Tokenizer().init('test', [null]);
        }).to.throw(ReferenceError);

        // Invalid plugin name should throw
        expect(() => {
            // @ts-ignore
            new Tokenizer().init('test', [{ type: TokenTypes.Word, pluginName: 'test', regex: /.*/g }]);
        }, 'invalid plugin type').to.throw(/plugin type/i);

        // Null plugin regex should throw
        expect(() => {
            // @ts-ignore
            new Tokenizer().init('test', [{ type: TokenTypes.Plugin, pluginName: 'test' }]);
        }, 'invalid plugin regex').to.throw(/plugin regex/i);

        // Invalid plugin regex should throw
        expect(() => {
            // @ts-ignore
            new Tokenizer().init('test', [{ type: TokenTypes.Plugin, pluginName: 'test', regex: {} }]);
        }, 'invalid plugin regex').to.throw(/plugin regex/i);

        done();
    })

    it(`Tests the Keywords Plugin`, function(done) {
        const KEYWORDS = [
            'chinook',
            'sirocco',
            'zephyr',
            'gale-force'
        ]

        const plugin = new Keywords()
        
        done();
    });

    it(`Tests Tokenizer Using Files from "./tokenizer-test-data".`, function (done) {

        const files = fs.readdirSync(path.join(__dirname, './tokenizer-test-data'));
        
        files.forEach(function (file) {
            const { name, text, skip, tests } = require(path.join(__dirname, './tokenizer-test-data', file));

            if (skip !== null && skip == false) {
                log(`Running test "${name}" from file "${file}"...`);
                const results = [];
                const tokenizer = new Tokenizer();
                tokenizer.init(text);

                let count = 0;
                while (tokenizer.hasMoreTokens()) {
                    const actual = tokenizer.getNextToken();
                    const expected = tests[count];
                    results.push({ actual, expected });
                    count++;
                }

                debug(results);

                results.forEach(function (result) {
                    expect(result.actual).to.have.deep.equal(result.expected);
                });
            } else {
                log(`Skipping test "${name}" from file "${file}"...`);
            }
        })

        done();
    });

    it.only(`Generates Tokenizer Test Data.`, function (done) {
        const expected = []

        const text = `{test} "test" this is the phrase; this is after.`
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
                expected.push({ type: `{`, value: `{`});
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
        done();
    })

});