import { Phrase } from "./common/token-specs";
import { CharacterToken, ParsedTokenFlags, ParsedToken, ParsedTokenTypes, PluginTokenSpec, TokenTypes, WhitespaceToken, WordToken } from "./common/token-types";
import { Token } from "./common/token-types";
import { validatePlugin } from "./plugins/common";
import { Tokenizer } from "./tokenizer";

export { ParsedTokenFlags, ParsedTokenTypes, ParsedToken }

export type TokenParsedCallback = (token: ParsedToken) => void;

export class Parser {

    private _plugins: PluginTokenSpec[];
    private _tokenizer: Tokenizer;
    private _lookahead: Token;
    private _notifyTokenParsedCallback: TokenParsedCallback;

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

    public parse(text: string, callback?: TokenParsedCallback) {
        if (text === null || text.trim().length == 0) throw new ReferenceError(`Text cannot be NULL or EMPTY!`);

        this._tokenizer.init(text, this._plugins);
        this._lookahead = this._tokenizer.getNextToken();
        this._notifyTokenParsedCallback = callback;

        return this._literals();
    }

    private _literals(stopLookahead = null, notify = true): ParsedToken[] {
        const items = [this._literal(notify)];

        while (this._lookahead != null && this._lookahead.type !== stopLookahead) {
            items.push(this._literal(notify));
        }
        return items as ParsedToken[];
    }

    private _literal(notify = true): ParsedToken | PhraseToken {
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
                return this._word(notify);
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
        const token = {
            type: type,
            flags: ParsedTokenFlags.None,
            value: value
        };

        return this._notifyTokenParsed(token);
    }

    private _phrase() {

        const reducer = (initialValue, token) => {
            return initialValue += token.value;
        }

        const startChar = this._startChar();
        const items = this._phraseItems(startChar.value);
        const value = items.reduce(reducer, '');
        const stopChar = this._stopChar();
        let flags = ParsedTokenFlags.None;

        if (startChar.value === '"') {
            flags |= ParsedTokenFlags.Quoted;
            flags |= ParsedTokenFlags.DoubleQuoted;
        }

        if (startChar.value === "'") {
            flags |= ParsedTokenFlags.Quoted;
            flags |= ParsedTokenFlags.SingleQuoted;
        }

        if (startChar.value === "{") {
            flags |= ParsedTokenFlags.Bracketed;
        }

        if (startChar.value === "[") {
            flags |= ParsedTokenFlags.Braced;
        }

        const token = {
            type: ParsedTokenTypes.Phrase,
            flags,
            startChar,
            items,
            value,
            stopChar
        }

        return this._notifyTokenParsed(token);
    }

    /**
     * Creates a list of parsed tokens for a Phrase.
     * @param startChar The designated Phrase's START character.
     * @returns The list of tokens.
     */
    private _phraseItems(startChar) {
        // Get the matching Phrase stop character. For example, '{' matches '}', 
        // '[' matches ']', etc.
        let stopChar = Phrase.getMatchingType(startChar);

        // Tell our literals method to NOT notify when a token is created.
        const notify = false;
        return this._lookahead.type !== startChar ? this._literals(stopChar, notify) : [];
    }

    /**
     * Creates a parsed token that represents a Phrase's START character.
     * @returns The parsed token.
     */
    private _startChar(): CharacterToken {
        return {
            type: TokenTypes.Character,
            value: this._eat(this._lookahead.type).value
        }
    }

    /**
     * Creates a parsed token that represents a Phrase's STOP character.
     * @returns The parsed token.
     */
    private _stopChar(): ParsedToken {
        return {
            type: ParsedTokenTypes.Character,
            flags: ParsedTokenFlags.None,
            value: this._eat(this._lookahead.type).value
        }
    }

    /**
     * Creates a parsed token that represents a token processed by a Plugin.
     * @returns The parsed token.
     */
    private _plugin(): ParsedToken {
        const next = this._eat(TokenTypes.Plugin);
        const token = {
            type: next.pluginName,
            flags: ParsedTokenFlags.None,
            value: next.value
        }

        return this._notifyTokenParsed(token);
    }

    /**
     * Creates a parsed token that represents a whitespace.
     * @returns The parsed token.
     */
    private _whitespace(): ParsedToken {
        const next = this._eat(TokenTypes.Whitespace);
        const token = {
            type: ParsedTokenTypes.Whitespace,
            flags: ParsedTokenFlags.None,
            value: next.value
        }

        return this._notifyTokenParsed(token);
    }

    /**
     * Creates a parsed token that represents a word.
     * @param notify Optional parameter that indicates whether the notify callback should be called
     * when a token is processed. Notify callback should NOT be called when the word
     * is part of a Phrase.
     * @returns The parsed token.
     */
    private _word(notify = true): ParsedToken {
        const next = this._eat(TokenTypes.Word);

        let flags = ParsedTokenFlags.None;
        if ((next.value.indexOf(`'`) >= 0)) { flags |= ParsedTokenFlags.Apostrophe; }
        if ((next.value.indexOf(`-`) >= 0)) { flags |= ParsedTokenFlags.Hyphened; }

        const token = {
            type: ParsedTokenTypes.Word,
            flags: flags,
            value: next.value
        }

        return (notify) ? this._notifyTokenParsed(token) : token;
    }

    /**
     * "Consumes" the next token (which must match the specified 
     * type) from the Tokenizer.
     * @param type The type of token to consume.
     * @returns The raw token from the Tokenizer.
     */
    private _eat(type: TokenTypes | string) {

        const token = this._lookahead;

        if (token == null) {
            throw new SyntaxError(`Unexpected end of input, expected: "${type}"!`)
        }

        if (token.type !== type) {
            // Lookahead type does not match requested type
            throw new SyntaxError(`Unexpected token: "${token.value}", expected "${type}!"`);
        }

        // Advance to the next token
        this._lookahead = this._tokenizer.getNextToken();

        return token;
    }

    /**
     * Notifies the client of a parsed token by calling the registered callback.
     * @param token The parsed token.
     * @returns The parsed token.
     */
    private _notifyTokenParsed(token: ParsedToken) {
        if (this._notifyTokenParsedCallback) {
            this._notifyTokenParsedCallback(token);
        }

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

