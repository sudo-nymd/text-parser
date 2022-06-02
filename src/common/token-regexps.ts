/**
 * @module common/token-regexps
 * @description Provides utilties for accessing the various Regular Expressions
 * that are used by the Tokenizer.
 */

import { TokenTypes } from "./token-types";

/**
 * TokenRegexps
 * 
 * @description Map of token regex patterns which allows the 
 * pattern to be looked up by index.
 */
const TokenRegExps = {}
/** Phrase: Match text between braces */
TokenRegExps['[]'] = `\\[[^\[]*\\]`;
/** Phrase: Match text between brackets */
TokenRegExps['{}'] = `{[^{]*}`
/** Phrase: match text between parenthesis */
TokenRegExps['()'] = `\\([^\\(]*\\)`;
/** Phrase: match text between single quotes */
TokenRegExps[`''`] = `'[^']*'`;
/** Phrase: match text between double quotes */
TokenRegExps[`""`] = `"[^"]*"`;

/** Phrase: match open and close brackets */
TokenRegExps[`{`] = `{`;
TokenRegExps[`}`] = `}`;

/** Phrase: match open and close braces */
TokenRegExps[`[`] = `\\[`;
TokenRegExps[`]`] = `\\]`;

/** Phrase: match open and close double-quotes */
TokenRegExps[TokenTypes.DoubleQuote] = `"`;

/** Phrase: match open and close double-quotes */
TokenRegExps[TokenTypes.SingleQuote] = `'`;

/** Match a single word */
TokenRegExps[TokenTypes.Word] = `([\\w]+(?:['-]?[\\w])*)`; // `([\\w]+(?:.['-]?[\\w]+)*)`; // `([\\w]+[\\w-']*)`;
/** Match one or more whitespace characters */
TokenRegExps[TokenTypes.Whitespace] = `\\s+`;
/** Match a single character */
TokenRegExps[TokenTypes.Character] = `[^a-zA-Z0-9{}\\[\\]"']{1}`;

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
 * Looks in the TokenRegExps map for a pattern that matches the 
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
    const pattern = TokenRegExps[key];
    if (pattern == null || pattern == undefined) {
        throw new RangeError(`The specified pattern for key "${key}" was not found!`);
    }

    // Concatenate and return
    return new RegExp(matchFromStart + pattern + matchToEnd, opts.flags);
}

export const ModuleName = 'common/token-regexps';
