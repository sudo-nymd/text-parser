class Tokenizer {

    private _text: string;
    private _cursor: number;

    /**
     * Initializes the tokenizer.
     */
    init(text: string) {
        this._text = text;
        this._cursor = 0;
    }

    public hasMoretokens(): boolean {
        return this._cursor < this._text.length;
    }

    public getNextToken(): Token {
        if (! this.hasMoretokens()) {
            return null;
        }

        const current = this._text.slice(this._cursor);

        if(current[0] != ' ') {
            let word = '';
            while( current[this._cursor] != ' ') {
                word += current[this._cursor++];
            }

            return {
                type: 'word',
                value: word
            }
        }

        if (current[0] == ' ') {
            let whitespace = '';
            while (current[this._cursor] === ' ') {
                whitespace += current[this._cursor++];
            }

            return {
                type: 'whitespace',
                value: whitespace
            }
        }
    }
}

export default Tokenizer;

export type TokenTypes = 'word' | 'phrase' | 'character' | 'whitespace' | 'unknown';

export type Token = {
    type: TokenTypes,
    parsedValue?: string;
    value?: string;
}

export type UnknownToken = Token & {
    type: 'unknown';
}

export type WordToken = Token & {
    type: 'word';
}

export type PhraseToken = Token & {
    type: 'phrase';
}

export type CharacterToken = Token & {
    type: 'character'
}

export type LineItemToken = UnknownToken | CharacterToken | WordToken | PhraseToken;

export type LineItems = Array<LineItemToken>;
