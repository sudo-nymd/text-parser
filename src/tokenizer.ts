enum TokenFlags {
    None = 0,
    SingleQuote = 1 << 0,
    DoubleQuote = 1 << 1,
    Brace = 1 << 2,
    Bracket = 1 << 3,
    Date = 1 << 16
}

type TokenSpec = {
    re: RegExp,
    type: TokenTypes,
    flags: TokenFlags
}

const TokenSpecs: TokenSpec[] = [
    {
        re: /^\s+/,
        type: 'whitespace',
        flags: TokenFlags.None
    },
    {
        re: /((?<![\\])['"])((?:.(?!(?<![\\])\1))*.?)\1/,  // /"[^"]*"/,
        type: 'phrase',
        flags:TokenFlags.DoubleQuote
    },
    {
        re: /^'[^']*'/,
        type: 'phrase',
        flags: TokenFlags.SingleQuote
    },
    {
        re: /^{[^{]*}/,
        type: 'phrase',
        flags: TokenFlags.Bracket
    },
    {
        re: /^\[[^\[]*\]/,
        type: 'phrase',
        flags: TokenFlags.Brace
    }
]

class Tokenizer {

    // 
    private _text: string;

    //
    private _cursor: number;

    isEOF(): boolean {
        return this._cursor === this._text.length;
    }

    /**
     * Initializes the tokenizer.
     */
    init(text: string) {
        // Store for later use.
        this._text = text;

        // Track the current position.
        this._cursor = 0;
    }

    public hasMoretokens(): boolean {
        return this._cursor < this._text.length;
    }

    public getNextToken(): Token {
        if (!this.hasMoretokens()) {
            return null;
        }

        const current = this._text.slice(this._cursor);

        for (const {re, type, flags} of TokenSpecs) {
            const matched = re.exec(current);
            if (matched !== null) {
                
                const match = matched[0];
                this._cursor += match.length;
                return {
                    type: type,
                    value: match,
                    flags: flags
                }
            }
        }
    }
}

export default Tokenizer;

export type TokenTypes = 'word' | 'phrase' | 'character' | 'whitespace' | 'unknown';

export type Token = {
    type: TokenTypes,
    value: string;
    flags?: TokenFlags;
}

export type UnknownToken = Token & {
    type: 'unknown';
}

export type WordToken = Token & {
    type: 'word';
}

export type PhraseToken = Token & {
    type: 'phrase';
    open: CharacterToken;
    close: CharacterToken;
}

export type CharacterToken = Token & {
    type: 'character'
}

export type WhitespaceToken = Token & {
    type: 'whitespace';
}

export type LineItemToken = UnknownToken | CharacterToken | WordToken | PhraseToken | WhitespaceToken;

export type LineItems = Array<LineItemToken>;
