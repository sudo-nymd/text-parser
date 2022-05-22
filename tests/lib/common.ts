import { Token } from "../../src/tokenizer";

/**
 * Reduce that calculates the count of tokens matching either the 
 * type or the plugin name.
 * @param tokens Array of tokens to reduce.
 * @param type The type of token to reduce by.
 * @param name The plugin name of token to reduce by.
 * @returns The count of tokens matching the type of the plugin name.
 */
export const countOfTokens = (tokens: Token[], type: string, name: string = null) => {
    let initialValue: number = 0;

    const fn = (acc, token) => {
        const reduce = (name === null && token.type === type) || (token.type === type && token.pluginName === name)
        if (reduce) {
            acc++;
        }
        return acc;
    }
    const count = tokens.reduce(fn, initialValue);
    return count;
}

/**
 * Returns a random item from the supplied array.
 * @param arr The list of items.
 * @returns A random item from the supplied array.
 */
export const randomItem = (arr: any[]) => {
    const index = Math.round(Math.random() * (arr.length - 1));
    return arr[index];
}