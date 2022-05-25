import { TokenRegExpOptions, getTokenRegExp } from "./token-regexps";
import { TokenTypes } from "./token-types"

const gre = getTokenRegExp; // Alias
const greOpts = { matchFromStart: true, flags: '', matchToEnd: false }

const TokenSpecs = [
    { type: TokenTypes.Word, regex: gre(TokenTypes.Word, greOpts) },
    { type: TokenTypes.Phrase, regex: gre(TokenTypes.Phrase, greOpts) },
    { type: TokenTypes.Whitespace, regex: gre(TokenTypes.Whitespace, greOpts) },
    { type: TokenTypes.Character, regex: gre(TokenTypes.Character, greOpts) }
]

/**
 * Expose module name for testing.
 */
const ModuleName = `token-specs`;

export { ModuleName, TokenSpecs, TokenRegExpOptions, getTokenRegExp }
