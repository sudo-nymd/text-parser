import { Token, TokenFlags, TokenTypes } from '../src/tokenizer';

export type TokenTest = {
    text: string;
    expected: {
        type: TokenTypes,
        flags: TokenFlags
    }
}

export const countOfTokensByType = (type: TokenTypes, tokens: Token[]) => {
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

export const LINE_TESTS = [
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
export const TOKEN_TESTS: TokenTest[] = [
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
export const CHARACTERS = '@#$%^&*<>/:;-+=';

for (let i = 0; i < CHARACTERS.length; i++) {
    TOKEN_TESTS.push({
        text: CHARACTERS[i],
        expected: {
            type: 'character',
            flags: TokenFlags.None
        }
    });
}