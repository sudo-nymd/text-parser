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
    [TokenTypes.Whitespace]: /^\s+/
}

export const TokenSpecs: SpecItems = [
    {
        pattern: TokenPatterns[TokenTypes.Whitespace],
        type: TokenTypes.Whitespace,
        superType: TokenSuperTypes.Standard
    },
    {
        pattern: /^"[^"]*"/, // /((?<![\\])['"])((?:.(?!(?<![\\])\1))*.?)\1/,  // /"[^"]*"/,
        type: TokenTypes.DoubleQuoted,
        superType: TokenSuperTypes.Phrase,
        openChar: `"`,
        closeChar: `"`
    },
    {
        pattern: /^'[^']*'/,
        type: TokenTypes.SingleQuoted,
        superType: TokenSuperTypes.Phrase,
        openChar: `'`,
        closeChar: `'`
    },
    {
        pattern: /^{[^{]*}/,
        type: TokenTypes.Bracketed,
        superType: TokenSuperTypes.Phrase,
        openChar: `{`,
        closeChar: `}`
    },
    {
        pattern: /^\[[^\[]*\]/,
        type: TokenTypes.Braced,
        superType: TokenSuperTypes.Phrase,
        openChar: `[`,
        closeChar: `]`
    },
    {
        pattern: /^\([^\(]*\)/,
        type: TokenTypes.Parenthesis,
        superType: TokenSuperTypes.Phrase,
        openChar: `(`,
        closeChar: `)`
    },
    {
        pattern: /^[\w]+/,
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Word
    },
    {
        pattern: /^[\w]+-[\w]+/,
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Hyphened
    },
    {
        pattern: /^[^\s\w"'(\[\]{}\.,!]/,
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Character
    },
    {
        pattern: /^\./,
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Period
    },
    {
        pattern: /^,/,
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Comma
    },
    {
        pattern: /^!/,
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.ExclamationPoint
    },
    {
        pattern: /^'/,
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Apostrophe
    }
]