import { TokenSpecs } from "./common/token-specs";
import { Token, TokenSpec, TokenTypes } from "./common/token-types";

export const ModuleName = 'tokenizer';

export class Tokenizer {
    private _cursor: number;
    private _text: string;

    init(text: string) {
        this._text = text;
        this._cursor = 0;
    }

    hasMoreTokens(): boolean {
        return this._cursor < this._text.length;
    }

    getNextToken(): Token {

        const current = this._text.slice(this._cursor);

        for (const spec of TokenSpecs) {
            const token = this._match(spec, current);
            if (token != null) return token as Token;
        }

        // If we get to this point, none of our RegEx's picked up a match.
        throw new SyntaxError(`Could not match token(s) to any known token spec: "${current}"`);
    }

    private _match(spec: TokenSpec, text: string) {
        const { regex, type } = spec;
        const matched = regex.exec(text);
        if (matched !== null) {

            const match = matched[0];
            this._cursor += match.length;

            if (type === 'plugin') {
                return {
                    //superType: 'plugin',
                    value: match,
                    type: spec.type
                }
            } else {
                return {
                    //superType: superType,
                    type: type,
                    value: match,
                }
            }
        }
    }
}