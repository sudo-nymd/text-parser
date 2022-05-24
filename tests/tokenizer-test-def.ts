import { Token, TokenTypes } from '../src/common/token-types'
import { Statistics as stats, randomItem } from './lib/common';

type SingleTokenTest = {
    text: string,
    expected: {
        subType: TokenTypes
    }
}

const SingleTokenTests: SingleTokenTest[] = [
    {
        text: `[brace]`,
        expected: {
            subType: TokenTypes.Braced
        }
    },
    {
        text: `{bracket}`,
        expected: {
            subType: TokenTypes.Bracketed
        }
    },
    {
        text: `{bracket phrase}`,
        expected: {
            subType: TokenTypes.Bracketed
        }
    },
    {
        text: `[brace phrase]`,
        expected: {
            subType: TokenTypes.Braced
        }
    },
    {
        text: `"double quote phrase"`,
        expected: {
            subType: TokenTypes.DoubleQuoted
        }
    },
    {
        text: `'single quote phrase'`,
        expected: {
            subType: TokenTypes.SingleQuoted
        }
    },
    {
        text: `word`,
        expected: {
            subType: TokenTypes.Word
        }
    },
    {
        text: `dan's`,
        expected: {
            subType: TokenTypes.Word
        }
    },
    {
        text: `.`,
        expected: {
            subType: TokenTypes.Character
        }
    },
    {
        text: `,`,
        expected: {
            subType: TokenTypes.Character
        }
    },
    {
        text: `!`,
        expected: {
            subType: TokenTypes.Character
        }
    }
]

const MultipleTokenTests = [
    {
        name: `Tests a Single Line`,
        text: `The quick, brown {fox} jumped [over] the [lazy] dog, and the cow "jumped over" the moon!`,
        expected: {
            [TokenTypes.Character]: 3,               // Should detect this many commas
            [TokenTypes.DoubleQuoted]: 1,        // Should detect this many dbl quote phrases
            [TokenTypes.SingleQuoted]: 0,        // Should detect this many dbl quote phrases
            [TokenTypes.Word]: 11,               // Should detect this many words
            [TokenTypes.Whitespace]: 14          // Should detect this many words
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
            [TokenTypes.DoubleQuoted]: stats.countOfTokens(tokens, stats.filters.isTokenType(TokenTypes.DoubleQuoted)),
            [TokenTypes.SingleQuoted]: stats.countOfTokens(tokens, stats.filters.isTokenType(TokenTypes.SingleQuoted)),
            [TokenTypes.Word]: stats.countOfTokens(tokens, stats.filters.isTokenType(TokenTypes.Word)),
            [TokenTypes.Character]: stats.countOfTokens(tokens, stats.filters.isTokenType(TokenTypes.Character)),
            [TokenTypes.Whitespace]: stats.countOfTokens(tokens, stats.filters.isTokenType(TokenTypes.Whitespace))
        }
    },

    /** The plugin(s) to test. */
    plugins: null,

    /** The tests to execute. */
    multipleTokenTests: MultipleTokenTests,
    singleTokenTests: SingleTokenTests
}
