/**
 * @module plugins/keywords
 * @description A simple module that helps the Tokenizer recognize
 * specific keywords.
 */


import { PluginTokenSpec, TokenTypes } from '../common/token-types';

/**
 * Encapsulates a list of keywords and generates the configuration 
 * neccessary for the Tokenizer to recognize the keywords in a line 
 * of text.
 */
class Keywords {

    /** The lst of configured keywords. */
    private _keywords: string[];

    /** The token's desired name. */
    private _pluginName: string;

    /**
     * Creates a new instance of the Keywords class.
     * @param pluginName The token's desired type name. 
     * @returns The Keywords instance.
     */
    constructor(pluginName: string = 'keyword') {
        this._keywords = [];
        this._pluginName = pluginName;

        // Support chaining
        return this;
    }

    /**
     * Adds a keyword to the configuration.
     *
     * @param {string} keyword The keyword to add.
     * @return {*} A reference to the Keyword class. Used to 
     * facilitate method chaining.
     * @memberof Keywords
     */
    public add(keyword: string) {
        this._keywords.push(keyword);

        // Support chaining
        return this;
    }

    /** Gets the count of configured keywords. */
    public get count(): number {
        return this._keywords.length;
    }

    public get pluginName(): string {
        return this._pluginName;
    }

    /**
     * Generates the required configuration for the Tokenizer to 
     * recognize keywords in a line of text.
     * 
     * @returns An object containing a RegExp and a type name that will be
     * used by the Tokenizer to recognize and extract tokens containing 
     * the keywords.
     */
    public plugin(): PluginTokenSpec {
        const pattern = this._formatKeywords()
        const regItem: PluginTokenSpec = {
            type: TokenTypes.Plugin,
            regex: new RegExp(pattern),
            pluginName: this._pluginName,
        }
        return regItem;
    }

    /**
     * We need to build a RegExp for Tokenizer to use consisting of
     *  '^' The "start of line" character PLUS
     *  each keyword seperated by the logical OR '|'.
     * @returns ^keyword1|^keyword2|^keyword3
     */
    private _formatKeywords() {
        return this._keywords.reduce((initialValue, keyword, index) => {
            // Don't prefix the first keyword with | 
            const prefix = (index == 0) ? '' : '|';
            return initialValue + prefix + '^' + keyword; // Caret is important!!!
        }, '');
    }
}

export { Keywords }