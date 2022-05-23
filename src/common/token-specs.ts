/**
export type PunctuationTokenTypes = 'apostrophe' | 'period' | 'comma' | 'exclamation-point' | 'hyphen';

export type PhraseTokenTypes = 'single-quoted-phrase' | 'double-quoted-phrase' | 'braced-phrase' | 'bracketed-phrase' | 'parenthesis-phrase'

export type ExtendedTokenTypes = 'plugin';

export type WordTokenTypes = 'word' | 'hyphened-word'

export type TokenTypes = PhraseTokenTypes | WordTokenTypes | 'character' | 'whitespace' | 'unknown' | PunctuationTokenTypes | ExtendedTokenTypes
 */

import { PhraseTokenSubTypes, TokenSubTypes, TokenTypes } from "./token-types";

export type TokenSpec = {
    pattern: RegExp;
    subType: TokenSubTypes | string;
    type: TokenTypes;
}

export type PhraseTokenSpec = TokenSpec & {
    subType: PhraseTokenSubTypes;
    type: TokenTypes.Phrase;
    openChar: string;
    closeChar: string;
}

export type PluginTokenSpec = TokenSpec & {
    type: TokenTypes.Plugin;
    subType: string;
}

export const findPhraseByOpenChar = (char: string) => {
    return TokenSpecs.find((token: PhraseTokenSpec) => {
        return (token.type === TokenTypes.Phrase && token.openChar && token.openChar === char)
    });
}

type SpecItems = Array<TokenSpec | PhraseTokenSpec>;

export const TokenSpecs: SpecItems = [
    {
        pattern: /^\s+/,
        subType: TokenSubTypes.Whitespace,
        type: TokenTypes.Standard
    },
    {
        pattern: /^"[^"]*"/, // /((?<![\\])['"])((?:.(?!(?<![\\])\1))*.?)\1/,  // /"[^"]*"/,
        subType: TokenSubTypes.DoubleQuoted,
        type: TokenTypes.Phrase,
        openChar: `"`,
        closeChar: `"`
    },
    {
        pattern: /^'[^']*'/,
        subType: TokenSubTypes.SingleQuoted,
        type: TokenTypes.Phrase,
        openChar: `'`,
        closeChar: `'`
    },
    {
        pattern: /^{[^{]*}/,
        subType: TokenSubTypes.Bracketed,
        type: TokenTypes.Phrase,
        openChar: `{`,
        closeChar: `}`
    },
    {
        pattern: /^\[[^\[]*\]/,
        subType: TokenSubTypes.Braced,
        type: TokenTypes.Phrase,
        openChar: `[`,
        closeChar: `]`
    },
    {
        pattern: /^\([^\(]*\)/,
        subType: TokenSubTypes.Parenthesis,
        type: TokenTypes.Phrase,
        openChar: `(`,
        closeChar: `)`
    },
    {
        pattern: /^[\w]+/,
        type: TokenTypes.Standard,
        subType: TokenSubTypes.Word
    },
    {
        pattern: /^[\w]+-[\w]+/,
        type: TokenTypes.Standard,
        subType: TokenSubTypes.Hyphened
    },
    {
        pattern: /^[^\s\w"'(\[\]{}\.,!]/,
        type: TokenTypes.Standard,
        subType: TokenSubTypes.Character
    },
    {
        pattern: /^\./,
        type: TokenTypes.Standard,
        subType: TokenSubTypes.Period
    },
    {
        pattern: /^,/,
        type: TokenTypes.Standard,
        subType: TokenSubTypes.Comma
    },
    {
        pattern: /^!/,
        type: TokenTypes.Standard,
        subType: TokenSubTypes.ExclamationPoint
    },
    {
        pattern: /^'/,
        type: TokenTypes.Standard,
        subType: TokenSubTypes.Apostrophe
    }
]