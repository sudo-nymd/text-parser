import { TokenRegExpOptions, getTokenRegExp } from "./token-regexps";
import { PhraseCloseTokenTypes, PhraseOpenTokenTypes, PhraseTokenTypes, TokenTypes } from "./token-types"

const gre = getTokenRegExp; // Alias
const greOpts = { matchFromStart: true, flags: '', matchToEnd: false }

const TokenSpecs = [
    { type: TokenTypes.Word, regex: gre(TokenTypes.Word, greOpts) },
    { type: TokenTypes.BracketOpen, regex: gre(TokenTypes.BracketOpen, greOpts) },
    { type: TokenTypes.BracketClose, regex: gre(TokenTypes.BracketClose, greOpts) },
    { type: TokenTypes.BraceOpen, regex: gre(TokenTypes.BraceOpen, greOpts) },
    { type: TokenTypes.BraceClose, regex: gre(TokenTypes.BraceClose, greOpts) },
    { type: TokenTypes.DoubleQuote, regex: gre(TokenTypes.DoubleQuote, greOpts) },
    { type: TokenTypes.SingleQuote, regex: gre(TokenTypes.SingleQuote, greOpts) },
    { type: TokenTypes.Whitespace, regex: gre(TokenTypes.Whitespace, greOpts) },
    { type: TokenTypes.Character, regex: gre(TokenTypes.Character, greOpts) }
]

export const Phrase = {
    getMatchingType: (type: PhraseTokenTypes): PhraseTokenTypes => {
        switch (type) {
            case TokenTypes.BraceOpen:
                return TokenTypes.BraceClose;
            case TokenTypes.BracketOpen:
                return TokenTypes.BracketClose;
            case TokenTypes.BraceClose:
                return TokenTypes.BraceOpen;
            case TokenTypes.BracketClose:
                return TokenTypes.BracketOpen;
            case TokenTypes.DoubleQuote:
                return TokenTypes.DoubleQuote;
            case TokenTypes.SingleQuote:
                return TokenTypes.SingleQuote;
        }
    }
}

/**
 * Expose module name for testing.
 */
const ModuleName = `token-specs`;

export { ModuleName, TokenSpecs, TokenRegExpOptions, getTokenRegExp }
