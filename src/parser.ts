import { Phrase } from "./common/token-specs";
import { CharacterToken, ParsedFlags, ParsedToken, ParsedTokenTypes, PluginTokenSpec, TokenTypes, WhitespaceToken, WordToken } from "./common/token-types";
import { Token } from "./common/token-types";
import { validatePlugin } from "./plugins/common";
import { Tokenizer } from "./tokenizer";

export class Parser {

    private _plugins: PluginTokenSpec[];
    private _tokenizer: Tokenizer;
    private _lookahead: Token;

    public constructor() {
        /** The list of plugins to be used during parsing. */
        this._plugins = [];

        /** The internal Tokenizer. */
        this._tokenizer = new Tokenizer();
    }

    /**
     * Adds the plugin to the internal plugins list, which will make the
     * plugin available during parsing.
     * @param plugin The plugin to use.
     * @returns A reference to the current Parser instance (allows
     * for function chaining).
     */
    public use(plugin: PluginTokenSpec) {
        // If plugin passes muster, add to plugins array
        this._plugins.push(validatePlugin(plugin));

        // Allow function chaining
        return this;
    }

    public parse(text: string) {
        if (text === null || text.trim().length == 0) throw new ReferenceError(`Text cannot be NULL or EMPTY!`);

        this._tokenizer.init(text, this._plugins);
        this._lookahead = this._tokenizer.getNextToken();

        return this._literals();
    }

    private _literals(stopLookahead = null): ParsedToken[] {
        const items = [this._literal()];

        while (this._lookahead != null && this._lookahead.type !== stopLookahead) {
            items.push(this._literal());
        }
        return items as ParsedToken[];
    }

    private _literal(): ParsedToken | PhraseToken {
        const type: string = this._lookahead.type;
        switch (type) {

            case TokenTypes.Character:
                return this._character();

            case TokenTypes.BraceOpen:
            case TokenTypes.BracketOpen:
            case TokenTypes.SingleQuote:
            case TokenTypes.DoubleQuote:
                return this._phrase();

            case TokenTypes.Plugin:
                return this._plugin();

            case TokenTypes.Whitespace:
                return this._whitespace();

            case TokenTypes.Word:
                return this._word();
        }
    }

    private _character(): ParsedToken {
        const value = this._eat(TokenTypes.Character).value;
        let type: ParsedTokenTypes;
        switch (value) {
            case '!':
            case '.':
            case ',':
            case '?':
                type = ParsedTokenTypes.Punctuation
                break;

            default: 
                type = ParsedTokenTypes.Character;
                break;
        }
        return {
            type: type,
            flags: ParsedFlags.None,
            value: value
        };
    }

    private _phrase() {

        const reducer = (initialValue, token) => {
            return initialValue += token.value;
        }

        const startChar = this._startChar();
        const items = this._phraseItems(startChar.value);
        const value = items.reduce(reducer, '');
        const stopChar = this._stopChar();
        let flags = ParsedFlags.None;

        if (startChar.value === '"') {
            flags |= ParsedFlags.Quoted; 
            flags |= ParsedFlags.DoubleQuoted; 
        }

        if (startChar.value === "'") { 
            flags |= ParsedFlags.Quoted; 
            flags |= ParsedFlags.SingleQuoted;
        }

        if (startChar.value === "{") {
            flags |= ParsedFlags.Bracketed;
        }

        if (startChar.value === "[") {
            flags |= ParsedFlags.Braced;
        }

        return {
            type: ParsedTokenTypes.Phrase,
            flags,
            startChar,
            items,
            value,
            stopChar
        }
    }

    private _phraseItems(startChar) {
        let stopChar = Phrase.getMatchingType(startChar);        
        return this._lookahead.type !== startChar ? this._literals(stopChar) : [];
    }

    private _startChar(): CharacterToken {
        return {
            type: TokenTypes.Character,
            value: this._eat(this._lookahead.type).value
        }
    }

    private _stopChar(): ParsedToken {
        return {
            type: ParsedTokenTypes.Character,
            flags: ParsedFlags.None,
            value: this._eat(this._lookahead.type).value
        }
    }

    private _plugin(): ParsedToken {
        const token = this._eat(TokenTypes.Plugin);
        return {
            type: token.pluginName,
            flags: ParsedFlags.None,
            value: token.value
        }
    }

    private _whitespace(): ParsedToken {
        const token = this._eat(TokenTypes.Whitespace);
        return {
            type: ParsedTokenTypes.Whitespace,
            flags: ParsedFlags.None,
            value: token.value
        }
    }

    private _word(): ParsedToken {
        const token = this._eat(TokenTypes.Word);

        let flags = ParsedFlags.None;
        if ((token.value.indexOf(`'`) >= 0)) { flags |= ParsedFlags.Apostrophe; }
        if ((token.value.indexOf(`-`) >= 0)) { flags |= ParsedFlags.Hyphened; }

        return {
            type: ParsedTokenTypes.Word,
            flags: flags,
            value: token.value
        }
    }

    private _eat(type: TokenTypes | string) {

        const token = this._lookahead;

        if (token == null) {
            throw new SyntaxError(`Unexpected end of input, expected: "${type}"!`)
        }

        if (token.type !== type) {
            throw new SyntaxError(`Unexpected token: "${token.value}", expected "${type}!"`);
        }

        // Advance to the next token
        this._lookahead = this._tokenizer.getNextToken();

        return token;
    }
}

export type PhraseToken = Token & {
    startChar: CharacterToken;
    stopChar: CharacterToken;
    items: Array<WordToken | WhitespaceToken | CharacterToken>;
}

/**
 * Expose module name for testing.
 */
export const ModuleName = 'parser';

