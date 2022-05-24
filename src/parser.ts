import { PluginTokenSpec } from "./common/token-specs";
import { Token } from "./common/token-types";
import Tokenizer from "./tokenizer";

class Parser {

    private _plugins: PluginTokenSpec[];
    private _tokenizer: Tokenizer;
    private _lookahead: Token;

    constructor() {
        this._plugins = [];
        this._tokenizer = new Tokenizer();
    }

    use(plugin: PluginTokenSpec) {
        this._plugins.push(plugin);
        return this;
    }

    parse(text: string) {
        this._tokenizer.init(text, this._plugins);
        this._lookahead = this._tokenizer.getNextToken();
    }
}