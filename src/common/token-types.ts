
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

export enum ParsedTokenFlags {
    None = 0,
    SingleQuoted = 1 << 0,
    DoubleQuoted = 1 << 1,
    Quoted = SingleQuoted || DoubleQuoted,
    Bracketed = 1 << 2,
    Braced = 1 << 3,
    Apostrophe = 1 << 4,
    Hyphened = 1 << 5
}

export type ParsedToken = {
    type: ParsedTokenTypes | string;
    value: any;
    flags: ParsedTokenFlags;
    [key: string]: any;
}

export type PhraseToken = ParsedToken & {
    type: ParsedTokenTypes.Phrase;
}

export enum ParsedTokenTypes {
    Phrase = 'phrase',
    Word = 'word',
    Whitespace = 'whitespace',
    Character = 'character',
    Punctuation = 'punctuation',
}

