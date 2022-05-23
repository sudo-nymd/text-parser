import { config } from "./common/config";
import { TokenSpec, TokenSpecs, PluginTokenSpec } from "./common/token-registry";
import { TokenTypes, Token, TokenSubTypes } from "./common/token-types";

const DEBUGGING: boolean = (process.env.DEBUG !== undefined);
class Tokenizer {

    // 
    private _text: string;

    //
    private _cursor: number;

    private _plugins: PluginTokenSpec[];

    _EOF(): boolean {
        return this._cursor === this._text.length;
    }

    /**
     * Initializes the tokenizer.
     */
    init(text: string, plugins?: TokenSpec[]) {
        // Store for later use.
        this._text = text;

        this._plugins = [];

        // Track the current position.
        this._cursor = 0;

        // Load plugins
        if (plugins != null) {
            if (Array.isArray(plugins)) {
                plugins.forEach((plugin => {
                    if (plugin !== null && plugin.pattern && plugin.subType) {
                        this._plugins.push({
                            type: TokenTypes.Plugin,
                            subType: plugin.subType,
                            pattern: plugin.pattern
                        });
                    }
                }));
            }
        }
    }

    public hasMoretokens(): boolean {
        return this._cursor < this._text.length && ! this._EOF();
    }

    private _match(spec: TokenSpec, text: string) {
        const { pattern, type, subType } = spec;
        const matched = pattern.exec(text);
        if (matched !== null) {

            const match = matched[0];
            this._cursor += match.length;

            if (spec.type === 'plugin' && spec.subType !== undefined) {
                return {
                    type: 'plugin',
                    value: match,
                    subType: spec.subType
                }
            } else {
                return {
                    type: type,
                    subType: subType,
                    value: match,
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
        throw new SyntaxError(`Unknown token type: "${current}"`);
    }
}

export default Tokenizer;


