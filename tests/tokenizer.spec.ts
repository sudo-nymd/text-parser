import { expect } from 'chai';
import * as logger from './lib/logger';
import Tokenizer, { Token } from '../src/tokenizer';
import { countOfTokensByType, LINE_TESTS, TOKEN_TESTS } from './tokenizer.test.defs';
import { Keywords } from '../src/plugins/keywords';

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

    it(`Tests the Keywords Plugin`, function (done) {
        const keywords = new Keywords()
            .add('zephyr')
            .add('chinook')
            .add('sirocco')
            

        const text = `
        The chinook flew through the sirocco like a 
        zephyr "blowing through the" [canyons]!
        `
        const tokenizer = new Tokenizer();
        tokenizer.init(text.trim(), [keywords.apply()]);

        const pluginTokens = []

        while(tokenizer.hasMoretokens()){
            const token = tokenizer.getNextToken();
            if(token.isPlugin) {
                pluginTokens.push(token);
            }
            debug(token);
        }

        // We should have the same amount of keyword tokens
        // as the number of keywords we added.
        const pluginCount = countOfTokensByType('plugin', pluginTokens);
        expect(pluginCount, 'pluginCount').to.equal(keywords.count);

        done();
    })

    it(`Tests each line for tokens.`, function (done) {
        const tokenizer = new Tokenizer();
        LINE_TESTS.forEach( function (line) {
            const tokens: Token[] = []
            const { text, expectedStats } = line;
            tokenizer.init(text);

            while(tokenizer.hasMoretokens()) {
                const token = tokenizer.getNextToken();
                tokens.push(token);
            }

            const actualStats = {
                whitespaceCount: countOfTokensByType('whitespace', tokens),
                wordCount: countOfTokensByType('word', tokens),
                phraseCount: countOfTokensByType('phrase', tokens),
                characterCount: countOfTokensByType('character', tokens),
                periodCount: countOfTokensByType('period', tokens),
                commaCount: countOfTokensByType('comma', tokens),
                exclaCount: countOfTokensByType('exclamation-point', tokens)
            }
            
            debug({ text, expectedStats, actualStats}, "statistics");
            expect(actualStats, "actualStats").to.have.deep.equals(expectedStats, "expectedStats")

        });

        done();
    });

    it(`Tests a string of tokens.`, (done)=> {
        // Create a long string of text by joining test tokens with spaces.
        const text = TOKEN_TESTS.map((test) => {
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
                const { text, expected } = TOKEN_TESTS[testCount];
                expect(token.value, `Token value at position ${tokenCount} does not match`).to.equal(text)
                expect(token.type, `Token type at position ${tokenCount} does not match`).to.equal(expected.type);
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
        const expectedCount = TOKEN_TESTS.length * 2 - 1;
        expect(tokenCount, `count of tokens`).to.equal(expectedCount);

        done();
    })

    it(`Tests the individual tokens.`, function (done) {

        const tokenizer = new Tokenizer();

        TOKEN_TESTS.forEach((test) => {
            const { text, expected } = test;
            tokenizer.init(text);

            while (tokenizer.hasMoretokens()) {
                const token = tokenizer.getNextToken();
                debug(token, text);
                expect(token.value, `token.value`).to.equal(text);
                expect(token.type, `token.type`).to.equal(expected.type);
            }
        });

        done();
    });
});