import { PhraseTokenSubTypes, PunctuationTokenSubTypes, Token, TokenSubTypes } from "./common/token-registry";
import * as tok from "./tokenizer";
import Tokenizer from "./tokenizer";

export enum ParsedFlags {
    None = 0,
    SingleQuote = 1 << 0,
    DoubleQuote = 1 << 1,
    Brace = 1 << 2,
    Bracket = 1 << 3,
    Parenthesis = 1 << 4,
    Punctuation = 1 << 5,
    Date = 1 << 16
}
class Parser {

    constructor() {
        this._tokenizer = new Tokenizer();
    }

    private _lookahead: Token;
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

        return this.Line();
    }

    eat(tokenType: TokenSubTypes): Token {
        const token = this._lookahead;
        if (token == null) {
            throw new SyntaxError(`Unexepcted end of input, exepcted: ${tokenType}`)
        }

        if (token.subType !== tokenType) {
            throw new SyntaxError(`Unexpected token type: "${token.subType}" - "${token.value}", exepcted: ${tokenType}`)
        }

        this._lookahead = this._tokenizer.getNextToken();

        return token;
    }

    /** Main entry point.
     * Line
     *      : LineItems
     */
    Line() {
        return this.Literals();
    }

    /**
     * Literals
     *  : Literal *
     * @returns Array of Literals
     */
    Literals(): Literals {
        const items: Literals = [];

        items.push(this.Literal())

        while(this._lookahead != null) {
            items.push(this.Literal());
        } 

        return items;
    }

    /**
     * LineItem
     *  : Phrase
     *  : Word
     *  : Character
     *  : Whitespace
     *  : Punctuation
     *  : Unknown
     * @returns 
     */
    Literal() {
        switch (this._lookahead.subType) {
            case 'braced-phrase':
            case 'bracketed-phrase':
            case 'double-quoted-phrase':
            case 'single-quoted-phrase':
            case 'parenthesis-phrase':
                return this.Phrase();
                break;

            case 'word':
                return this.Word();
                break;

            case 'whitespace':
                return this.Whitespace();
                break;

            case 'character':
                return this.Character();
                break;

            case 'unknown':
                return this.Unknown();
                break;

            case 'comma':
            case 'period':
            case 'exclamation-point':
                return this.Punctuation();
                break;

            default:
                throw new SyntaxError(`Unknown lookahead type: ${this._lookahead.subType}`);
        }
    }

    Phrase(): PhraseToken {
        
        const token = this.eat(this._lookahead.subType) as PhraseToken;
        const value = token.value;
        
        token.open = {
            subType: TokenSubTypes.Character,
            value: value[0]
        }
        token.close = {
            subType: TokenSubTypes.Character,
            value: value[token.value.length - 1]
        }
        token.value = value.slice(1, -1);

        // Determine the flags
        switch (token.open.value) {
            case `"`: { token.flags = ParsedFlags.DoubleQuote; }
            case `'`: { token.flags = ParsedFlags.SingleQuote; }
            case `{`: { token.flags = ParsedFlags.Bracket; }
            case `[`: { token.flags = ParsedFlags.Brace; }
            case `(`: { token.flags = ParsedFlags.Parenthesis; }
        }

        return token;
    }

    Punctuation(): CharacterToken {
        const token = this.eat(this._lookahead.subType) as CharacterToken;
        token.flags = ParsedFlags.Punctuation;
        return token;
    }

    Unknown(): UnknownToken {
        return this.eat(TokenSubTypes.Unknown) as UnknownToken;
    }

    Whitespace(): WhitespaceToken {
        return this.eat(TokenSubTypes.Whitespace) as WhitespaceToken;
    }

    Word(): WordToken {
        return this.eat(TokenSubTypes.Word) as WordToken;
    }

    Character(): CharacterToken {
        return this.eat(TokenSubTypes.Character) as CharacterToken;
    }
}

export default Parser;

export type ParsedToken = Token & {
    flags?: ParsedFlags
}

export type UnknownToken = ParsedToken & {
    type: TokenSubTypes.Unknown;
}

export type WordToken = ParsedToken & {
    type: TokenSubTypes.Word;
}

export type PhraseToken = ParsedToken & {
    type: PhraseTokenSubTypes;
    open: CharacterToken;
    close: CharacterToken;
}

export type CharacterToken = ParsedToken & {
    type: TokenSubTypes.Character;
}

export type WhitespaceToken = ParsedToken & {
    type: TokenSubTypes.Whitespace;
}

export type PunctuationToken = ParsedToken & {
    type: PunctuationTokenSubTypes;
    value: '.' | ',' | '!'
}

export type LineItemToken = UnknownToken | CharacterToken | WordToken | PhraseToken | WhitespaceToken;

export type Literals = Array<LineItemToken>;
