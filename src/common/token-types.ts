
export type PhraseTokenSubTypes =
    TokenSubTypes.Braced |
    TokenSubTypes.Bracketed |
    TokenSubTypes.SingleQuoted |
    TokenSubTypes.DoubleQuoted |
    TokenSubTypes.Parenthesis

export type PunctuationTokenSubTypes =
    TokenSubTypes.Comma |
    TokenSubTypes.Period |
    TokenSubTypes.ExclamationPoint

export enum TokenTypes {
    Standard = 'standard',
    Plugin = 'plugin',
    Phrase = 'phrase',
    Punctuation = 'punctuation'
}

export enum TokenSubTypes {
    Apostrophe = 'apostrophe',
    Braced = 'braced-phrase',
    Bracketed = 'bracketed-phrase',
    Character = 'character',
    Comma = 'comma',
    DoubleQuoted = 'double-quoted-phrase',
    ExclamationPoint = 'exclamation-point',
    Hyphened = 'hyphened-word',
    Parenthesis = 'parenthesis-phrase',
    Period = 'period',
    SingleQuoted = 'single-quoted-phrase',
    Unknown = 'unknown',
    Whitespace = 'whitespace',
    Word = 'word',
}

export type Token = {
    subType: TokenSubTypes | string;
    type: TokenTypes | string;
    value: string;
}

export type PluginToken = Token & {
    type: TokenTypes.Plugin;
    subType: string;
}
