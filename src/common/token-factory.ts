/**
 * @module common/token-factory
 * @description Provides the implementation of the TokenFactory.
 */

import { getTokenRegExp } from "./token-regexps";
import { CharacterToken, PhraseToken, TokenTypes, WhitespaceToken, WordToken } from "./token-types";

/**
 * Expose module name for testing.
 */
export const ModuleName = `token-factory`;

/**
 * Creates an instance of a PhraseToken
 * @param char The phrase text for the token.
 * @returns A fresh token.
 */
export const phrase = (phrase: string): PhraseToken => {
    // TODO Need to get this to work!!!
    //checkValue(phrase, TokenTypes.Phrase);

    return {
        type: TokenTypes.Phrase,
        value: phrase
    }
}

/**
 * Creates an instance of a CharacterToken.
 * @param char The char text for the token.
 * @returns A fresh token.
 */
export const character = (char: string): CharacterToken => {
    checkValue(char, TokenTypes.Character);
    return {
        type: TokenTypes.Character,
        value: char
    }
}

/**
 * Creates an instance of a WordToken.
 * @param text The text for the token.
 * @returns A fresh token.
 */
export const word = (text: string): WordToken => {
    const type = TokenTypes.Word;
    checkValue(text, type);
    return {
        type: type,
        value: text
    }
}

/**
 * Creates an instance of a WhitespaceToken.
 * @param count Optional number of spaces in the token.
 * @returns A fresh token.
 */
export const whitespace = (count: number = 1): WhitespaceToken => {
    return {
        type: TokenTypes.Whitespace,
        value: ''.padEnd(count, ' ')
    }
}

/**
 * Checks the text agains the specified type's RegExp .
 * @param text The text value to check.
 * @param type The type of token the text will be used for.
 */
const checkValue = (text: string, type: TokenTypes) => {
    // Grab the pattern from TokenRegExps and "convert" to a 
    // regex that matches the ENTIRE string
    const re = getTokenRegExp(type, { matchFromStart: true, flags: '', matchToEnd: true });
    const matches = text.match(re);
    // Entire string does not match
    if (matches == null) throw new SyntaxError(`Text did not match criteria for type "${type}": "${text}"!`);
}
