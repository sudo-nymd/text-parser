/**
 * @module tokenizer
 * @description Provides the implementation of the Tokenizer.
 */

import { text } from "stream/consumers";
import { TokenSpecs } from "./common/token-specs";
import { AnyToken, AnyTokenSpec, PluginToken, PluginTokenSpec, Token, TokenSpec, TokenTypes } from "./common/token-types";
import { validatePlugins } from "./plugins/common";

/**
 * Expose module name for testing.
 */
export const ModuleName = 'tokenizer';

/**
 * Provides a mechanism for Tokenizing an input string using
 * RegExps defined in TokenSpecs.
 */
export class Tokenizer {

    /** Tracks the current position within the input text to tokenize. */
    private _cursor: number;

    /** The text to tokenize. */
    private _inputText: string;

    /** Optional array of plugins. */
    private _plugins: PluginTokenSpec[];

    /**
     * Initializes (and resets) the Tokenizner class.
     * @param text The input text to tokenize.
     * @param plugins Optional array of plugins.
     */
    init(text: string, plugins?: PluginTokenSpec[]) {
        if (text == null) {
            throw new ReferenceError('Text should not be null!');
        }
        
        this._inputText = text;
        this._cursor = 0;
        this._plugins = (plugins != null) ? validatePlugins(plugins) : [];
    }

    /**
     * Determines if there are more tokens to process.
     * @returns TRUE if there are more tokens, FALSE if there are not.
     */
    hasMoreTokens(): boolean {
        return this._cursor < this._inputText.length;
    }

    /**
     * Gets the next token from the input text.
     * @returns The next token.
     */
    getNextToken(): Token {

        if (!this.hasMoreTokens()) {
            return null;
        }

        const current = this._inputText.slice(this._cursor);

        // Process plugins first, if any
        if (this._plugins != null) {
            for (const spec of this._plugins) {
                const token = this._match(spec, current);
                if (token != null) return token as PluginToken;
            }
        }

        // Process the rest of the token specifications
        for (const spec of TokenSpecs) {
            const token = this._match(spec, current);
            if (token != null) return token as Token;
        }

        // If we get to this point, none of our RegEx's picked up a match.
        throw new SyntaxError(`Could not match token(s) to any known token spec: "${current}"`);
    }

    /**
     * Runs the RegExp defined in spec against the text 
     * and returns a token if there is a match.
     * @param spec Metadata about the token to process, 
     * including the type and the RegExp to execute agains the input text.
     * @param text The text to match against. The start character should
     * match the character at the index of _text specified by the _cursor.
     * @returns A fresh token, if there is a match.
     */
    private _match(spec: AnyTokenSpec, text: string): AnyToken {
        const { regex, type, pluginName } = spec;
        const matched = regex.exec(text);
        
        if (matched !== null) {
            
            // Grab first match
            const match = matched[0];

            // Advance our position within the input text
            this._cursor += match.length;

            if (type === 'plugin' && pluginName != undefined) {
                // We got a plugin
                return {
                    type: TokenTypes.Plugin,
                    value: match,
                    pluginName: spec.pluginName
                } as PluginToken;
            } else {
                return {
                    type: type,
                    value: match,
                } as AnyToken;
            }
        }
    }
}