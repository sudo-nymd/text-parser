import { Token } from "../../src/tokenizer";

/**
 * Reducer that calculates the count of tokens matching either the 
 * type or the plugin name.
 * @param tokens Array of tokens to reduce.
 * @param filter Callback that provides a filter to reduce the array by.
 * @returns The count of tokens matching the filter.
 */
const countOfTokensEx = (tokens: Token[], filter: TokenFilterFunction) => {
    let initialValue = 0;

    const fn = (acc, token) => {
        const shouldReduce = (filter(token) == true);
        if (shouldReduce) {
            acc++;
        }
        return acc;
    }

    const count = tokens.reduce(fn, initialValue);
    return count;

}

type TokenFilterFunction = (token) => boolean;

const filters = {
    isTokenType: (type: string): TokenFilterFunction => {
        return (token) => { return token.type === type };
    },
    isPluginType: (name: string): TokenFilterFunction => {
        return (token) => { return token.type === 'plugin' && token.pluginName === name };
    }
}

export const Statistics = {
    filters: filters,
    countOfTokens: countOfTokensEx
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