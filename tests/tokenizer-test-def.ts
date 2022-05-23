import { Token, TokenSubTypes } from '../src/common/token-types'
import { Statistics as stats, randomItem } from './lib/common';

type SingleTokenTest = {
    text: string,
    expected: {
        subType: TokenSubTypes
    }
}

const SingleTokenTests: SingleTokenTest[] = [
    {
        text: `[brace]`,
        expected: {
            subType: TokenSubTypes.Braced
        }
    },
    {
        text: `{bracket}`,
        expected: {
            subType: TokenSubTypes.Bracketed
        }
    },
    {
        text: `{bracket phrase}`,
        expected: {
            subType: TokenSubTypes.Bracketed
        }
    },
    {
        text: `[brace phrase]`,
        expected: {
            subType: TokenSubTypes.Braced
        }
    },
    {
        text: `"double quote phrase"`,
        expected: {
            subType: TokenSubTypes.DoubleQuoted
        }
    },
    {
        text: `'single quote phrase'`,
        expected: {
            subType: TokenSubTypes.SingleQuoted
        }
    },
    {
        text: `word`,
        expected: {
            subType: TokenSubTypes.Word
        }
    },
    {
        text: `.`,
        expected: {
            subType: TokenSubTypes.Period
        }
    },
    {
        text: `,`,
        expected: {
            subType: TokenSubTypes.Comma
        }
    },
    {
        text: `!`,
        expected: {
            subType: TokenSubTypes.ExclamationPoint
        }
    }
]

const MultipleTokenTests = [
    {
        name: `Tests a Single Line`,
        text: `The quick, brown {fox} jumped [over] the [lazy] dog, and the cow "jumped over" the moon!`,
        expected: {
            [TokenSubTypes.Comma]: 2,               // Should detect this many commas
            [TokenSubTypes.DoubleQuoted]: 1,        // Should detect this many dbl quote phrases
            [TokenSubTypes.SingleQuoted]: 0,        // Should detect this many dbl quote phrases
            [TokenSubTypes.Period]: 0,              // Should detect this many periods
            [TokenSubTypes.ExclamationPoint]: 1,    // Should detect this many exclamation points
            [TokenSubTypes.Character]: 0,           // Should detect this many characters
            //['phrase']: 3,                       // Should detect this many phrases
            [TokenSubTypes.Word]: 11,               // Should detect this many words
            [TokenSubTypes.Whitespace]: 14          // Should detect this many words
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
            [TokenSubTypes.Comma]: stats.countOfTokens(tokens, stats.filters.isTokenSubType(TokenSubTypes.Comma)),
            [TokenSubTypes.Period]: stats.countOfTokens(tokens, stats.filters.isTokenSubType(TokenSubTypes.Period)),
            [TokenSubTypes.DoubleQuoted]: stats.countOfTokens(tokens, stats.filters.isTokenSubType(TokenSubTypes.DoubleQuoted)),
            [TokenSubTypes.SingleQuoted]: stats.countOfTokens(tokens, stats.filters.isTokenSubType(TokenSubTypes.SingleQuoted)),
            [TokenSubTypes.Word]: stats.countOfTokens(tokens, stats.filters.isTokenSubType(TokenSubTypes.Word)),
            [TokenSubTypes.Character]: stats.countOfTokens(tokens, stats.filters.isTokenSubType(TokenSubTypes.Character)),
            [TokenSubTypes.ExclamationPoint]: stats.countOfTokens(tokens, stats.filters.isTokenSubType(TokenSubTypes.ExclamationPoint)),
            [TokenSubTypes.Whitespace]: stats.countOfTokens(tokens, stats.filters.isTokenSubType(TokenSubTypes.Whitespace))
        }
    },

    /** The plugin(s) to test. */
    plugins: null,

    /** The tests to execute. */
    multipleTokenTests: MultipleTokenTests,
    singleTokenTests: SingleTokenTests
}
