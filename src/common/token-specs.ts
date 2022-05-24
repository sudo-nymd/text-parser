/**
export type PunctuationTokenTypes = 'apostrophe' | 'period' | 'comma' | 'exclamation-point' | 'hyphen';

export type PhraseTokenTypes = 'single-quoted-phrase' | 'double-quoted-phrase' | 'braced-phrase' | 'bracketed-phrase' | 'parenthesis-phrase'

export type ExtendedTokenTypes = 'plugin';

export type WordTokenTypes = 'word' | 'hyphened-word'

export type TokenTypes = PhraseTokenTypes | WordTokenTypes | 'character' | 'whitespace' | 'unknown' | PunctuationTokenTypes | ExtendedTokenTypes
 */

import { PhraseTokenSubTypes, TokenTypes, TokenSuperTypes } from "./token-types";

export type TokenSpec = {
    pattern: RegExp;
    type: TokenTypes | string;
    superType: TokenSuperTypes;
}

export type PhraseTokenSpec = TokenSpec & {
    type: PhraseTokenSubTypes;
    superType: TokenSuperTypes.Phrase;
    openChar: string;
    closeChar: string;
}

export type PluginTokenSpec = TokenSpec & {
    superType: TokenSuperTypes.Plugin;
    type: string;
}

export const findPhraseByOpenChar = (char: string) => {
    return TokenSpecs.find((token: PhraseTokenSpec) => {
        return (token.superType === TokenSuperTypes.Phrase && token.openChar && token.openChar === char)
    });
}

type SpecItems = Array<TokenSpec | PhraseTokenSpec>;

export const TokenPatterns = {
    [TokenTypes.Apostrophe]: /^'/,
    [TokenTypes.Braced]: /^\[[^\[]*\]/,
    [TokenTypes.Bracketed]: /^{[^{]*}/,
    [TokenTypes.Character]: /^[^\s\w]/, // "'(\[\]{}\.,!
    [TokenTypes.Comma]: /^,/,
    [TokenTypes.DoubleQuoted]: /^"[^"]*"/,
    [TokenTypes.ExclamationPoint]: /^!/,
    [TokenTypes.Hyphened]: /^[\w]+-[\w]+/,
    [TokenTypes.Parenthesis]: /^\([^\(]*\)/,
    [TokenTypes.Period]: /^\./,
    [TokenTypes.SingleQuoted]: /^'[^']*'/,
    [TokenTypes.Whitespace]: /^\s+/,
    [TokenTypes.Word]: /^[\w']+/,
}

export const TokenSpecs: SpecItems = [
    {
        pattern: TokenPatterns[TokenTypes.Whitespace],
        type: TokenTypes.Whitespace,
        superType: TokenSuperTypes.Standard
    },
    {
        pattern: TokenPatterns[TokenTypes.DoubleQuoted], // /((?<![\\])['"])((?:.(?!(?<![\\])\1))*.?)\1/,  // /"[^"]*"/,
        type: TokenTypes.DoubleQuoted,
        superType: TokenSuperTypes.Phrase,
        openChar: `"`,
        closeChar: `"`
    },
    {
        pattern: TokenPatterns[TokenTypes.SingleQuoted],
        type: TokenTypes.SingleQuoted,
        superType: TokenSuperTypes.Phrase,
        openChar: `'`,
        closeChar: `'`
    },
    {
        pattern: TokenPatterns[TokenTypes.Bracketed],
        type: TokenTypes.Bracketed,
        superType: TokenSuperTypes.Phrase,
        openChar: `{`,
        closeChar: `}`
    },
    {
        pattern: TokenPatterns[TokenTypes.Braced],
        type: TokenTypes.Braced,
        superType: TokenSuperTypes.Phrase,
        openChar: `[`,
        closeChar: `]`
    },
    {
        pattern: TokenPatterns[TokenTypes.Parenthesis],
        type: TokenTypes.Parenthesis,
        superType: TokenSuperTypes.Phrase,
        openChar: `(`,
        closeChar: `)`
    },
    {
        pattern: TokenPatterns[TokenTypes.Word],
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Word
    },
    {
        pattern: TokenPatterns[TokenTypes.Hyphened],
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Hyphened
    },
    {
        pattern: TokenPatterns[TokenTypes.Character],
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Character
    },
    {
        pattern: TokenPatterns[TokenTypes.Period],
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Period
    },
    {
        pattern: TokenPatterns[TokenTypes.Comma],
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Comma
    },
    {
        pattern: TokenPatterns[TokenTypes.ExclamationPoint],
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.ExclamationPoint
    },
    {
        pattern: TokenPatterns[TokenTypes.Apostrophe],
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Apostrophe
    }
]