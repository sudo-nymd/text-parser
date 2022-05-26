import { TokenTypes } from "./token-types";

/**
 * Build a RegExp that matches all phrases by OR'ing (using the '|' character) each 
 * pattern together and prefixing with the matchFromStart
 * character (^).
 * @returns A RegExp pattern that will match all phrase patterns.
 */
const phraseTokenRegExes = () => {
    return `^(` + [
        TokenRegexps[`''`],
        TokenRegexps[`""`],
        TokenRegexps[`[]`],
        TokenRegexps[`{}`],
        TokenRegexps[`()`]
    ].join('|') + ')';
}

/**
 * TokenRegexps
 * 
 * @description Map of token regex patterns which allows the 
 * pattern to be looked up by index.
 */
const TokenRegexps = {}
/** Phrase: Match text between braces */
TokenRegexps['[]'] = `\\[[^\[]*\\]`;
/** Phrase: Match text between brackets */
TokenRegexps['{}'] = `{[^{]*}`
/** Phrase: match text between parenthesis */
TokenRegexps['()'] = `\\([^\\(]*\\)`;
/** Phrase: match text between single quotes */
TokenRegexps[`''`] = `'[^']*'`;
/** Phrase: match text between double quotes */
TokenRegexps[`""`] = `"[^"]*"`;

/** Phrase: match open and close brackets */
TokenRegexps[`{`] = `^{`;
TokenRegexps[`}`] = `^}`;

/** Phrase: match open and close braces */
TokenRegexps[`[`] = `^\\[`;
TokenRegexps[`]`] = `^\\]`;

/** Phrase: match open and close double-quotes */
TokenRegexps[TokenTypes.DoubleQuote] = `"`;

/** Phrase: match open and close double-quotes */
TokenRegexps[TokenTypes.SingleQuote] = `'`;

/** Match a single word */
TokenRegexps[TokenTypes.Word] = `([\\w]+[\\w'-]*)`;
/** Match one or more whitespace characters */
TokenRegexps[TokenTypes.Whitespace] = `\\s+`;
/** Match a single character */
TokenRegexps[TokenTypes.Character] = `[^a-zA-Z0-9{}\\[\\]"']{1}`;

export type TokenRegExpOptions = {
    /**
     * The flags for the RegEx instance (ex. 'gim').
     */
    flags: string;

    /**
     * Modify the RegEx pattern to match from the start of the string.
     * (Prefix with '^' character).
     */
    matchFromStart: boolean;

    /**
     * Modify the RegEx pattern to match to the end of the string.
     * (Suffix with '$' character).
     */
    matchToEnd: boolean;
}

/**
 * Looks in the TokenPatterns map for a pattern that matches the 
 * specified key and returns a new RegExp instance if found.
 * @param key The key used to lookup the pattern in  the TokenPatterns map.
 * @param options Options for retrieving the specified RegEx.
 * @returns A new RegExp instance based on the pattern found 
 * in the TokenPatterns map.
 */
export const getTokenRegExp = (key: TokenTypes | string, options?: TokenRegExpOptions) => {
    // Default options
    const opts: TokenRegExpOptions = Object.assign({
        matchFromStart: true,
        flags: '',
        matchToEnd: false
    }, options
    );

    // Prefix w/ matchFromStart character?
    const matchFromStart = (opts.matchFromStart) ? '^' : '';

    // Suffix w/ matchToEnd character?
    const matchToEnd = (opts.matchToEnd) ? '$' : '';

    // Find the RegExp pattern, and throw if we don't find it.
    const pattern = TokenRegexps[key];
    if (pattern == null || pattern == undefined) {
        throw new RangeError(`The specified pattern for key "${key}" was not found!`);
    }

    // Concatenate and return
    return new RegExp(matchFromStart + pattern + matchToEnd, opts.flags);
}

