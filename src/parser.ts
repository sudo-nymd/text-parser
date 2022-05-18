import { workerData } from "worker_threads";
import * as tok from "./tokenizer";
import Tokenizer from "./tokenizer";
class Parser {

    constructor() {
        this._tokenizer = new Tokenizer();
    }

    private _lookahead: tok.Token;
    private _tokenizer: Tokenizer;
    private _initialText: string;

    /**
     * Parses a string into an AST>
     * @param initialText The line of text to be parsed.
     */
    public parse(initialText: string) {
        this._initialText = initialText;
        this._tokenizer.init(this._initialText);

        // Prime the tokenizer to obtain the first
        // token which is our "lookahead". The "lookahead" 
        // is used for predictive parsing.
        this._lookahead = this._tokenizer.getNextToken();

        return this.line();
    }

    eat(tokenType: tok.TokenTypes): tok.Token {
        const token = this._lookahead;
        if (token == null) {
            throw new SyntaxError(`Unexepcted end of input, exepcted: ${tokenType}`)
        }

        if (token.type !== tokenType) {
            throw new SyntaxError(`Unexpected token type: "${token.type}" - "${token.value}", exepcted: ${tokenType}`)
        }

        this._lookahead = this._tokenizer.getNextToken();

        return token;
    }

    /** Main entry point.
     * Line
     *      : LineItems
     */
    line() {
        return this.lineItems();
    }

    character(): tok.CharacterToken {
        return {
            type: 'character',
            value: "a"
        }
    }

    lineItems(): tok.LineItems {
        const items: tok.LineItems = [];

        while(this._tokenizer.hasMoretokens()) {

            switch (this._lookahead.type) {
                case 'phrase':
                    items.push(this.phrase());
                    break;

                case 'word':
                    items.push(this.word());
                    break;

                case 'whitespace':
                    items.push(this.whitespace());
                    break;

                case 'character':
                    items.push(this.character());
                    break;

                case 'unknown':
                    items.push(this.unknown());
                    break

                default:
                    throw new SyntaxError(`Unknown lookahead type: ${this._lookahead.type}`);
            }

            //this._lookahead = this._tokenizer.getNextToken();
        } 

        return items;
    }

    phrase(): tok.PhraseToken {
        const token = this.eat('phrase') as tok.PhraseToken;
        return token;
    }

    unknown(): tok.UnknownToken {
        return this.eat('unknown') as tok.UnknownToken;
    }

    whitespace(): tok.WhitespaceToken {
        return this.eat('whitespace') as tok.WhitespaceToken;
    }

    word(): tok.WordToken {
        return this.eat('word') as tok.WordToken;
    }
}

export default Parser;