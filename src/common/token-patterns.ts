import { TokenTypes } from "./token-types";

const phraseTokenPatterns = () => {
    return `^(` + [
        TokenPatterns[`''`],
        TokenPatterns[`""`],
        TokenPatterns[`[]`],
        TokenPatterns[`{}`],
        TokenPatterns[`()`]
    ].join('|') + ')';
}

/**
 * TokenPatterns
 * 
 * @description Map of token regex patterns which allows the 
 * pattern to be looked up by index.
 */
const TokenPatterns = {}
/** Phrase: Match text between braces */
TokenPatterns['[]'] = `\\[[^\[]*\\]`;
/** Phrase: Match text between brackets */
TokenPatterns['{}'] = `{[^{]*}`
/** Phrase: match text between parenthesis */
TokenPatterns['()'] = `\\([^\\(]*\\)`;
/** Phrase: match text between single quotes */
TokenPatterns[`''`] = `'[^']*'`;
/** Phrase: match text between double quotes */
TokenPatterns[`""`] = `"[^"]*"`;
/** Match a single phrase */
TokenPatterns[TokenTypes.Phrase] = phraseTokenPatterns();
/** Match a single word */
TokenPatterns[TokenTypes.Word] = `([\\w]+[\\w'-]*)`;
/** Match one or more whitespace characters */
TokenPatterns[TokenTypes.Whitespace] = `\\s+`;
/** Match a single character */
TokenPatterns[TokenTypes.Character] = `[^a-zA-Z0-9]{1}`;

export type GetRegExOptions = {
    flags: string;
    matchFromStart: boolean;
    matchToEnd: boolean;
}

/**
 * Looks in the TokenPatterns map for a pattern that matches the 
 * specified key and returns a new RegExp instance if found.
 * @param key The key used to lookup the pattern in  the TokenPatterns map.
 * @param flags A string that contains the RegExp flags to add.
 * @param matchToEnd Flag that indicates the end of string anchor
 * should be appended to the pattern. 
 * @returns A new RegExp instance based on the pattern found 
 * in the TokenPatterns map.
 */
export const getRegExp = (key: TokenTypes | string, options?: GetRegExOptions) => {
    const opts: GetRegExOptions = Object.assign({
        matchFromStart: true,
        flags: '',
        matchToEnd: false
    }, options
    );

    const a = (opts.matchFromStart) ? '^' : '';
    const b = (opts.matchToEnd) ? '$' : '';
    const pattern = TokenPatterns[key];
    if (pattern == null || pattern == undefined) {
        throw new RangeError(`The specified pattern for key "${key}" was not found!`);
    }
    return new RegExp(a + pattern + b, opts.flags);
}

