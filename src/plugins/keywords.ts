import { PluginTokenSpec } from "../tokenizer";

class Keywords {

    private _keywords: string[];

    private _typeName: string;

    constructor(typeName: string = 'keywords'){
        this._keywords = [];
        this._typeName = typeName;

        return this; // Support chaining
    }

    public add(keyword: string) {
        this._keywords.push(`^${keyword}`);
        return this; // Support chaining
    }

    public get count() : number {
        return this._keywords.length;
    }    

    public apply(): PluginTokenSpec {
        return {
            pattern: new RegExp(this._keywords.join('|')),
            type: this._typeName
        }
    }
}

export { Keywords }