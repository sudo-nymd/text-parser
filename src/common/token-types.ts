
export enum TokenTypes {
    Character = 'character',
    Phrase = 'phrase',
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

export type PhraseToken = {
    type: TokenTypes.Phrase;
}

export type PluginToken = Token & {
    type: TokenTypes.Plugin;
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
}

export type PluginTokenSpec = TokenSpec & {
    type: TokenTypes.Plugin;
    pluginName: string;
}

