import { GetRegExOptions, getRegExp } from "./token-patterns";
import { TokenTypes } from "./token-types"

const gre = getRegExp; // Alias
const greOpts: GetRegExOptions = { matchFromStart: true, flags: '', matchToEnd: false }

const TokenSpecs = [
    { type: TokenTypes.Word, regex: gre(TokenTypes.Word, greOpts) },
    { type: TokenTypes.Phrase, regex: gre(TokenTypes.Phrase, greOpts) },
    { type: TokenTypes.Whitespace, regex: gre(TokenTypes.Whitespace, greOpts) },
    { type: TokenTypes.Character, regex: gre(TokenTypes.Character, greOpts) }
]

const ModuleName = `token-specs`;

export { ModuleName, TokenSpecs, GetRegExOptions, getRegExp }
