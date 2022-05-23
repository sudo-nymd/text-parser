import * as logger from './lib/logger';
import Tokenizer from '../src/tokenizer';
import { Token } from '../src/common/token-types';
import { expect } from 'chai';
import { TestDefinition as DATES_TEST_DEF } from './plugin-dates-test-def';
import { TestDefinition as KEYWORDS_TEST_DEF } from './plugin-keywords-test-def';
import { TestDefinition as TOKENS_TEST_DEF } from './tokenizer-test-def';

// "Stateless" logging functions (avoid clashes with Mocha's hijackng of "this")
const LOGENTRY = logger.create(`START`);
const log = (msg: string | object, src?: string) => logger.log(LOGENTRY, msg, src);
const debug = (msg: object, src?: string) => logger.debug(LOGENTRY, msg, src);
const error = (msg: string | object, src?: string) => logger.error(LOGENTRY, msg, src);
const warn = (msg: string | object, src?: string) => logger.warn(LOGENTRY, msg, src);

describe(`Tests the Tokenizer module.`, function () {
    afterEach(() => {
        // Flush logging buffer after every test!
        logger.flush(LOGENTRY);
    });

    it(`Tests the Dates Plugin`, function (done) {

        const tokenizer = new Tokenizer();

        // Grab metadata about current executing Mocha test.
        const { title } = this.test;
        
        // Loop through each test def...
        DATES_TEST_DEF.tests.forEach(function(test) {
            const { name, text, expected } = test;
            const tokens = [];
            debug({ msg: `Starting test name "${test.name}".`, text: text});

            // ...Initialize tokenizer with plugins ...
            tokenizer.init(text, DATES_TEST_DEF.plugins);

            // ... process each token ...
            while (tokenizer.hasMoretokens()) {
                const token = tokenizer.getNextToken();
                tokens.push(token);
                debug(token);
            }

            // ...check counts of tokens.
            const actual = DATES_TEST_DEF.getStatistics(tokens);
            expect(actual, `"${title}" - "${name}"`).to.have.deep.equals(expected);
        })

        done();
    })

    it(`Tests the Keywords Plugin`, function (done) {
        const tokenizer = new Tokenizer();

        // Grab metadata about current executing Mocha test.
        const { title } = this.test;

        // Loop through each test def...
        KEYWORDS_TEST_DEF.tests.forEach(function (test) {
            const { name, text, expected } = test;
            const tokens = [];
            debug({ msg: `Starting test name "${test.name}".`, text: text });

            // ...Initialize tokenizer with plugins ...
            tokenizer.init(text, [KEYWORDS_TEST_DEF.plugins]);

            // ... process each token ...
            while (tokenizer.hasMoretokens()) {
                const token = tokenizer.getNextToken();
                tokens.push(token);
                debug(token);
            }

            // ...check counts of tokens.
            const actual = KEYWORDS_TEST_DEF.getStatistics(tokens);
            expect(actual, `"${title}" - "${name}"`).to.have.deep.equals(expected);
        })

        done();
    })

    it(`Tests Each Line for Tokens`, function (done) {
        
        const tokenizer = new Tokenizer();

        // Grab metadata about current executing Mocha test.
        const { title } = this.test;

        // Loop through each test def...
        TOKENS_TEST_DEF.multipleTokenTests.forEach(function (test) {
            const { name, text, expected } = test;
            const tokens = [];
            debug({ msg: `Starting test name "${test.name}".`, text: text });

            // ...Initialize tokenizer with plugins ...
            tokenizer.init(text, [TOKENS_TEST_DEF.plugins]);

            // ... process each token ...
            while (tokenizer.hasMoretokens()) {
                const token = tokenizer.getNextToken();
                tokens.push(token);
                debug(token);
            }

            // ...check counts of tokens.
            const actual = TOKENS_TEST_DEF.getStatistics(tokens);
            expect(actual, `"${title}" - "${name}"`).to.have.deep.equals(expected);
        })

        done();
    })

    it(`Tests a String of Tokens.`, (done)=> {
        // Create a long string of text by joining test tokens with spaces.
        const text = TOKENS_TEST_DEF.singleTokenTests.map((test) => {
            return test.text;
        }).join(' ');

        const tokenizer = new Tokenizer();
        debug({ msg: `Initializing tokenzier`, text: text});
        tokenizer.init(text);

        let tokenCount = 0; // Keep track of each token processed.
        let testCount = 0;  // Index into our test data array.
        while(tokenizer.hasMoretokens()) {
            const token = tokenizer.getNextToken();
            debug(token);
            if (tokenCount % 2 === 0) {
                // Grab our test expected values
                const { text, expected } = TOKENS_TEST_DEF.singleTokenTests[testCount];
                expect(token.value, `Token value at position ${tokenCount} does not match`).to.equal(text)
                expect(token.type, `Token type at position ${tokenCount} does not match`).to.equal(expected.subType);
                testCount++;
            } else {
                // Every other token should be whitespace
                expect(token.value, `Token value at position ${tokenCount} does not match`).to.equal(' ')
                expect(token.type, `Token type at position ${tokenCount} does not match`).to.equal('whitespace');
            }
            tokenCount++;
        }

        // Check the count of returned tokens. We added spaces, so 
        // we should account for those: 
        //      A space for every token (* 2) minus 1
        const expectedCount = TOKENS_TEST_DEF.singleTokenTests.length * 2 - 1;
        expect(tokenCount, `count of tokens`).to.equal(expectedCount);

        done();
    })

    it(`Tests the Individual Tokens.`, function (done) {

        const tokenizer = new Tokenizer();

        TOKENS_TEST_DEF.singleTokenTests.forEach((test) => {
            const { text, expected } = test;
            tokenizer.init(text);

            while (tokenizer.hasMoretokens()) {
                const token = tokenizer.getNextToken();
                debug(token, text);
                expect(token.value, `token.value`).to.equal(text);
                expect(token.type, `token.type`).to.equal(expected.subType);
            }
        });

        done();
    });
});