import { config } from "./common/config";

const DEBUGGING: boolean = (process.env.DEBUG !== undefined);

export type TokenSpec = {
    pattern: RegExp,
    type: TokenTypes,
    isPlugin?: boolean,
    pluginName?: string;
}

export type PluginTokenSpec = {
    pattern: RegExp,
    type: string;
}

const TokenSpecs: TokenSpec[] = [
    {
        pattern: /^\s+/,
        type: 'whitespace'
    },
    {
        pattern: /^"[^"]*"/, // /((?<![\\])['"])((?:.(?!(?<![\\])\1))*.?)\1/,  // /"[^"]*"/,
        type: 'phrase',
    },
    {
        pattern: /^'[^']*'/,
        type: 'phrase'
    },
    {
        pattern: /^{[^{]*}/,
        type: 'phrase'
    },
    {
        pattern: /^\[[^\[]*\]/,
        type: 'phrase'
    },
    {
        pattern: /^\([^\(]*\)/,
        type: 'phrase'
    },
    {
        pattern: /^[\w]+/,
        type: 'word'
    },
    {
        pattern: /^[^\s\w"'(\[\]{}\.,!]/,
        type: 'character'
    },
    {
        pattern: /^\./,
        type: 'period'
    },
    {
        pattern: /^,/,
        type: 'comma'
    },
    {
        pattern: /^!/,
        type: 'exclamation-point'
    },
    {
        pattern: /^'/,
        type: 'apostrophe'
    }
]

class Tokenizer {

    // 
    private _text: string;

    //
    private _cursor: number;

    private _plugins: TokenSpec[];

    isEOF(): boolean {
        return this._cursor === this._text.length;
    }

    /**
     * Initializes the tokenizer.
     */
    init(text: string, plugins?: PluginTokenSpec[]) {
        // Store for later use.
        this._text = text;

        this._plugins = []

        // Track the current position.
        this._cursor = 0;

        // Load plugins
        if (plugins != null) {
            if (Array.isArray(plugins)) {
                plugins.forEach((plugin => {
                    if (plugin.pattern && plugin.type) {
                        this._plugins.push({
                            pattern: plugin.pattern,
                            type: 'plugin',
                            isPlugin: true,
                            pluginName: plugin.type
                        })
                    }
                }));
            }
        }
    }

    public hasMoretokens(): boolean {
        return this._cursor < this._text.length;
    }

    private _match(spec: TokenSpec, text: string) {
        const { pattern, type } = spec;
        const matched = pattern.exec(text);
        if (matched !== null) {

            const match = matched[0];
            this._cursor += match.length;

            if (spec.isPlugin) {
                return {
                    type: 'plugin',
                    isPlugin: true,
                    value: match,
                    pluginName: spec.pluginName
                }
            } else {
                return {
                    type: type,
                    value: match
                }
            }
        }
    }

    public getNextToken(): Token {
        if (!this.hasMoretokens()) {
            return null;
        }

        const current = this._text.slice(this._cursor);

        // Process plugins
        for (const plugin of this._plugins) {
            const token = this._match(plugin, current);
            if (token != null) return token as Token;
        }

        for (const spec of TokenSpecs) {
            const token = this._match(spec, current);
            if (token != null) return token as Token;
        }

        // If we get to this point, none of our RegEx's picked up a match.
        // Send it back as 'unknown'.
        const match = current;
        this._cursor += match.length;
        return {
            type: 'unknown',
            value: match
        }
    }
}

export default Tokenizer;

export type PunctuationTokenTypes = 'apostrophe' | 'period' | 'comma' | 'exclamation-point' | 'hyphen';

export type ExtendedTokenTypes = 'plugin';

export type TokenTypes = 'word' | 'phrase' | 'character' | 'whitespace' | 'unknown' | PunctuationTokenTypes | ExtendedTokenTypes

export type Token = {
    type: TokenTypes,
    value: string;
    isPlugin?: false;
}

export type PluginToken = Token & {
    isPlugin: true;
    pluginName: string;
}
