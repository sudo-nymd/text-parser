import { Token, TokenTypes } from '../src/common/token-types';
import { Tokenizer, ModuleName } from '../src/tokenizer';
import * as factory from '../src/common/token-factory'
import * as logger from './lib/logger';
import * as fs from 'fs';
import path = require('path');
import { expect } from 'chai';
import { resourceLimits } from 'worker_threads';

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

    it.skip(`Generates Test Data Using Brute Force`, function (done) {
        const expected = []

        const text = `test:test this is the phrase; this is after.`;
        //const text = `This is a [simple] test.`

        text.split(/\s(?=(?:"[^"]*"|[^"])*$)/g).forEach(function (item, index, arr) {
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
                expected.push(factory.phrase(item));
            } else if (item.startsWith(`[`) && item.endsWith(']')) {
                // BRACE PHRASE
                expected.push(factory.phrase(item));
            } else if (item.startsWith(`(`) && item.endsWith(')')) {
                // PARENTHESIS PHRASE
                expected.push(factory.phrase(item));
            } else if (item.startsWith(`"`) && item.endsWith('"')) {
                // DOUBLE QUOTE PHRASE
                expected.push(factory.phrase(item));
            } else if (item.startsWith(`'`) && item.endsWith(`'`)) {
                // SINGLE QUOTE PHRASE
                expected.push(factory.phrase(item));
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