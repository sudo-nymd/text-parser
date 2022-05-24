
import { TokenPatterns } from "./token-specs";
import { Token, TokenTypes, TokenSuperTypes } from "./token-types";

export const character = (char: string) => {
    checkValue(char, TokenTypes.Character);
    return {
        type: TokenTypes.Character,
        superType: TokenSuperTypes.Standard,
        value: char
    }
}

export const word = (text: string): Token => {
    const type = TokenTypes.Word;
    checkValue(text, type);
    return {
        superType: TokenSuperTypes.Standard,
        type: type,
        value: text
    }
}

export const whitespace = (count: number = 1): Token => {
    return {
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Whitespace,
        value: ''.padEnd(count, ' ')
    }
}

const checkValue = (text: string, subType: TokenTypes) => {
    // Grab the pattern from TokenPatterns and "convert" to a 
    // regex that matches the ENTIRE string
    const re = new RegExp(convertToEndOfStringRegEx(TokenPatterns[subType]));
    const matches = text.match(re);
    // Entire string does not match
    if (matches == null) throw new SyntaxError(`Text did not match criteria for type "${subType}": "${text}"!`);
}

/**
 * Converts the existing regex to a pattern that includes matching the entire
 * input string length.
 * @param re The regex to convert.
 * @returns A regex that matches the original pattern, but to 
 * the end of the input string.
 */
const convertToEndOfStringRegEx = (re: RegExp) => {
    const pattern = re.toString().slice(1, -1) + '$';
    return pattern;
}