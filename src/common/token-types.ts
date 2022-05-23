
export type PhraseTokenSubTypes =
    TokenTypes.Braced |
    TokenTypes.Bracketed |
    TokenTypes.SingleQuoted |
    TokenTypes.DoubleQuoted |
    TokenTypes.Parenthesis

export type PunctuationTokenSubTypes =
    TokenTypes.Comma |
    TokenTypes.Period |
    TokenTypes.ExclamationPoint

export enum TokenSuperTypes {
    Standard = 'standard',
    Plugin = 'plugin',
    Phrase = 'phrase',
    Punctuation = 'punctuation'
}

export enum TokenTypes {
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
    Whitespace = 'whitespace',
    Word = 'word',
}

export type Token = {
    type: TokenTypes | string;
    superType: TokenSuperTypes | string;
    value: string;
}

export type PluginToken = Token & {
    superType: TokenSuperTypes.Plugin;
    type: string;
}
