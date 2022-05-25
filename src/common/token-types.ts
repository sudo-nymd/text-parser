
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

