
import { getRegExp } from "./token-specs";
import { Token, TokenTypes } from "./token-types";

export const ModuleName = `token-factory`;

export const phrase = (phrase: string) => {
    //checkValue(phrase, TokenTypes.Phrase);

    return {
        type: TokenTypes.Phrase,
        value: phrase
    }
}

export const character = (char: string) => {
    checkValue(char, TokenTypes.Character);
    return {
        type: TokenTypes.Character,
        value: char
    }
}

export const word = (text: string): Token => {
    const type = TokenTypes.Word;
    checkValue(text, type);
    return {
        type: type,
        value: text
    }
}

export const whitespace = (count: number = 1): Token => {
    return {
        type: TokenTypes.Whitespace,
        value: ''.padEnd(count, ' ')
    }
}

const checkValue = (text: string, type: TokenTypes) => {
    // Grab the pattern from TokenPatterns and "convert" to a 
    // regex that matches the ENTIRE string
    const re = getRegExp(type, '', false);
    const matches = text.match(re);
    // Entire string does not match
    if (matches == null) throw new SyntaxError(`Text did not match criteria for type "${type}": "${text}"!`);
}
