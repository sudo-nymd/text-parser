
export enum TokenTypes {
    Character = 'character',
    Phrase = 'phrase',
    BracketOpen = '{',
    BracketClose = '}',
    BraceOpen = `[`,
    BraceClose = `]`,
    DoubleQuote = `"`,
    SingleQuote = `'`,
    Whitespace = 'whitespace',
    Word = 'word',
    Plugin = 'plugin'
}

export enum TokenSubTypes {
    DoubleQuoted = `double-quoted`,
    SingleQuoted = `single-quoted`,
    Bracketed = 'bracketed',
    Braced = 'braced',
}

export type Token = {
    type: TokenTypes;
    value: string;
    [key: string]: string;
}

export type PhraseOpenTokenTypes = TokenTypes.BraceOpen | TokenTypes.BracketOpen | TokenTypes.DoubleQuote | TokenTypes.SingleQuote
export type PhraseCloseTokenTypes = TokenTypes.BraceClose | TokenTypes.BracketClose | TokenTypes.DoubleQuote | TokenTypes.SingleQuote
export type PhraseTokenTypes = PhraseCloseTokenTypes | PhraseOpenTokenTypes;


export type PhraseToken = Token & {
    type: TokenTypes.Phrase;
}

export type CharacterToken = Token & {
    type: TokenTypes.Character;
}

export type WordToken = Token & {
    type: TokenTypes.Word;
}

export type WhitespaceToken = Token & {
    type: TokenTypes.Whitespace;
}

export type TokenSpec = {
    type: TokenTypes;
    regex: RegExp;
    pluginName?: string;
}

export type PluginToken = Token & {
    type: TokenTypes.Plugin;
    pluginName: string;
}

export type AnyToken = PluginToken | WordToken | CharacterToken | PhraseToken

export type PluginTokenSpec = TokenSpec & {
    type: TokenTypes.Plugin;
    pluginName: string;
}

export type AnyTokenSpec = TokenSpec | PluginTokenSpec

