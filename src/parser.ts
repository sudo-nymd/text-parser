import * as tok from "./tokenizer";
import Tokenizer from "./tokenizer";
class Parser {

    constructor() {
        this._tokenizer = new Tokenizer();
    }
    
    private _lookahead: tok.Token;
    private _tokenizer: Tokenizer;
    private _lineOfText: string;

    /**
     * Parses a string into an AST>
     * @param lineOfText The line of text to be parsed.
     */
    public parse(lineOfText: string) {
        this._lineOfText = lineOfText;
        this._tokenizer.init(this._lineOfText);

        // Prime the tokenizer to obtain the first
        // token which is our "lookahead". The "lookahead" 
        // is used for predictive parsing.
        this._lookahead = this._tokenizer.getNextToken();

        return this.line();
    }

    eat(tokenType: tok.TokenTypes): tok.Token {
        const token = this._lookahead;
        if(token == null) {
            throw new SyntaxError(`Unexepcted end ofinput, exepcted: ${tokenType}`)
        }

        if (token.type !== tokenType) {
            if (token == null) {
                throw new SyntaxError(`Unexpected token type: "${token.type}" - "${token.value}", exepcted: ${tokenType}`)
            }
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
        const token = this.eat('word')
        const items: tok.LineItems = []
        items.push(token as tok.LineItemToken)
        return items;
    }

    unknown(): tok.UnknownToken {
        return {
            type:'unknown',
            value: this._lineOfText
        }
    }

}

// const p = new Parser();
// p.parse(`word a : "word" "word1 word2" {word1 word2 : a the}`);
// p.parse(`a`)
// console.log(p.line())

export default Parser;