import { Token } from '../src/tokenizer';
import { Statistics as stats, randomItem } from './lib/common';

const SingleTokenTests = [
    {
        text: `[brace]`,
        expected: {
            type: 'phrase'
        }
    },
    {
        text: `{bracket}`,
        expected: {
            type: 'phrase'
        }
    },
    {
        text: `{bracket phrase}`,
        expected: {
            type: 'phrase'
        }
    },
    {
        text: `[brace phrase]`,
        expected: {
            type: 'phrase'
        }
    },
    {
        text: `"double quote phrase"`,
        expected: {
            type: 'phrase'
        }
    },
    {
        text: `'single quote phrase'`,
        expected: {
            type: 'phrase'
        }
    },
    {
        text: `word`,
        expected: {
            type: 'word'
        }
    },
    {
        text: `.`,
        expected: {
            type: 'period'
        }
    },
    {
        text: `,`,
        expected: {
            type: 'comma'
        }
    },
    {
        text: `!`,
        expected: {
            type: 'exclamation-point'
        }
    }
]

const MultipleTokenTests = [
    {
        name: `Tests a Single Line`,
        text: `The quick, brown {fox} jumped [over] the [lazy] dog, and the cow "jumped over" the moon!`,
        expected: {
            ['comma']: 2,               // Should detect this many commas
            ['period']: 0,              // Should detect this many periods
            ['exclamation-point']: 1,   // Should detect this many exclamation points
            ['character']: 0,           // Should detect this many characters
            ['phrase']: 4,              // Should detect this many phrases
            ['word']: 11,               // Should detect this many words
            ['whitespace']: 14         // Should detect this many words
        }
    }
]

/**
 * TestDefinition
 * 
 * @description Used by the test runner. 
 */
export const TestDefinition = {
    /**
     * Callback that generates expected counts.
     * @param tokens Array of tokens to scan.
     * @returns The count of matching tokens.
     */
    getStatistics: function (tokens: Token[]) {
        return {
            "comma": stats.countOfTokens(tokens, stats.filters.isTokenType('comma')),
            "period": stats.countOfTokens(tokens, stats.filters.isTokenType('period')),
            "phrase": stats.countOfTokens(tokens, stats.filters.isTokenType('phrase')),
            "word": stats.countOfTokens(tokens, stats.filters.isTokenType('word')),
            "character": stats.countOfTokens(tokens, stats.filters.isTokenType('character')),
            "exclamation-point": stats.countOfTokens(tokens, stats.filters.isTokenType('exclamation-point')),
            "whitespace": stats.countOfTokens(tokens, stats.filters.isTokenType('whitespace'))
        }
    },

    /** The plugin(s) to test. */
    plugins: null,

    /** The tests to execute. */
    multipleTokenTests: MultipleTokenTests,
    singleTokenTests: SingleTokenTests
}
