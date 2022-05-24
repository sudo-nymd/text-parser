import { match } from "assert";
import { TokenPatterns } from "./token-specs";
import { Token, TokenTypes, TokenSuperTypes } from "./token-types";

const character = (char: string) => {
    checkValue(char, TokenTypes.Character);
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

const whitespace = (count: number = 1): Token => {
    return {
        superType: TokenSuperTypes.Standard,
        type: TokenTypes.Whitespace,
        value: ''.padEnd(count, ' ')
    }
}

const checkValue =(text: string, subType: TokenTypes) => {
    const pattern = TokenPatterns[subType].toString().slice(1, -1) + '$';
    const re = new RegExp(pattern);
    const matches = text.match(re);

    if (matches == null) throw new SyntaxError(`Text did not match criteria for type "${subType}": "${text}"!`);
}