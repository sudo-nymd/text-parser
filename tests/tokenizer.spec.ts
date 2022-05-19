
import { expect } from 'chai';
import * as logger from './lib/logger';
import Tokenizer, { Token, TokenFlags, TokenTypes } from '../src/tokenizer';
import { count } from 'console';


const LOGENTRY = logger.create(`START`);
const log = (msg: string | object, src?: string) => logger.log(LOGENTRY, msg, src);
const debug = (msg: object, src?: string) => logger.debug(LOGENTRY, msg, src);
const error = (msg: string | object, src?: string) => logger.error(LOGENTRY, msg, src);
const warn = (msg: string | object, src?: string) => logger.warn(LOGENTRY, msg, src);

type TokenTest = {
    text: string;
    expected: {
        type: TokenTypes,
        flags: TokenFlags
    }
}

const countOfTokensByType = (type: TokenTypes, tokens: Token[]) => {
    let initialValue: number = 0;

    const fn = (acc, token) => {
        if (token.type === type) {
            acc++;
        }
        return acc;
    }
    const count = tokens.reduce(fn, initialValue);
    return count;
}

const LINE_TESTS = [
    {
        text: `The quick, brown {fox} jumped [over] the [lazy] dog, and the cow "jumped over" the moon!`,
        expectedStats: {
            commaCount: 2,          // Should detect this many commas
            periodCount: 0,         // Should detect this many periods
            exclaCount: 1,          // Should detect this many exclamation points
            characterCount: 0,      // Should detect this many characters
            phraseCount: 4,         // Should detect this many phrases
            wordCount: 11,          // Should detect this many words
            whitespaceCount: 14     // Should detect this many words
        }
    },
    {
        text: `This is a ; {semi-colon}`,
        expectedStats: {
            commaCount: 0,          // Should detect this many commas
            periodCount: 0,         // Should detect this many periods
            exclaCount: 0,          // Should detect this many exclamation points
            characterCount: 1,      // Should detect this many characters
            phraseCount: 1,         // Should detect this many phrases
            wordCount: 3,           // Should detect this many words
            whitespaceCount: 4      // Should detect this many words
        }
    }
]

// Test data for each type of token.
const TOKEN_TESTS: TokenTest[] = [
    {
        text: `[brace]`,
        expected: {
            type: 'phrase',
            flags: TokenFlags.Brace
        }
    },
    {
        text: `{bracket}`,
        expected: {
            type: 'phrase',
            flags: TokenFlags.Bracket
        }
    },
    {
        text: `{bracket phrase}`,
        expected: {
            type: 'phrase',
            flags: TokenFlags.Bracket
        }
    },
    {
        text: `[brace phrase]`,
        expected: {
            type: 'phrase',
            flags: TokenFlags.Brace
        }
    },
    {
        text: `"double quote phrase"`,
        expected: {
            type: 'phrase',
            flags: TokenFlags.DoubleQuote,
        }
    },
    {
        text: `'single quote phrase'`,
        expected: {
            type: 'phrase',
            flags: TokenFlags.SingleQuote,
        }
    },
    {
        text: `word`,
        expected: {
            type: 'word',
            flags: TokenFlags.None,
        }
    },
    {
        text: `.`,
        expected: {
            type: 'period',
            flags: TokenFlags.Punctuation,
        }
    },
    {
        text: `,`,
        expected: {
            type: 'comma',
            flags: TokenFlags.Punctuation,
        }
    },
    {
        text: `!`,
        expected: {
            type: 'exclamation-point',
            flags: TokenFlags.Punctuation,
        }
    }
]

// Dump a string of characters into our token tests.
const CHARACTERS = '@#$%^&*<>/:;-+=';
for (let i = 0; i < CHARACTERS.length; i++) {
    TOKEN_TESTS.push({
        text: CHARACTERS[i],
        expected: {
            type: 'character',
            flags: TokenFlags.None
        }
    });
}

describe(`Tests the Tokenizer module.`, function () {
    afterEach(() => {
        // Flush logging buffer after every test!
        logger.flush(LOGENTRY);
    });

    it.only(`Tests each line for tokens.`, function (done) {
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
                expect(token.flags, `Token flags at position ${tokenCount} does not match`).to.equal(expected.flags);
                testCount++;
            } else {
                // Every other token should be whitespace
                expect(token.value, `Token value at position ${tokenCount} does not match`).to.equal(' ')
                expect(token.type, `Token type at position ${tokenCount} does not match`).to.equal('whitespace');
                expect(token.flags, `Token flags at position ${tokenCount} does not match`).to.equal(TokenFlags.None);
            }
            tokenCount++;
        }

        // Check the count of returned tokens. We added spaces, so 
        // we should account for those.
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
                expect(token.flags, `token.flags`).to.equal(expected.flags);
            }
        });

        done();
    });
});