import { Keywords } from '../src/plugins';
import { Token } from '../src/tokenizer';
import { countOfTokens, randomItem } from './lib/common';

/**
 * Sample data to use.
 */
const KEYWORDS = [
    'sirocco',
    'zephyr',
    'chinook',
    'gale',
    'wind',
    'hurricane',
    'tornado'
]

/**
 * Generates a random keyword.
 * @returns The keyword.
 */
const randomKeyword = () => {
    return randomItem(KEYWORDS);
}

const tests = [
    {
        name: `A couple of keywords`,
        text: `The chinook flew through the sirocco like a 
        zephyr "blowing through the" [canyons]!`,
        expected: {
            ['phrase']: 2,
            ['keyword']: 3,
            ['plugin']: 3
        }
    },
    {
        name: `Random Keywords pt. 2`,
        text: `
            This ${randomKeyword()} and ${randomKeyword()}. 
            Perhaps on ${randomKeyword()} we can meet.
            ${randomKeyword()}'s child is {full} of woe.
            `,
        expected: {
            ['plugin']: 4,
            ['keyword']: 4,
            ['phrase']: 1
        }
    }
]

/**
 * Prepare the plugin for export.
 */
const keywords = new Keywords();
KEYWORDS.forEach(function(keyword) {
    keywords.add(keyword);
});

/**
 * TestDefinition
 * 
 * @description Used by the test runner. 
 */
export const TestDefinition = {
    /**
     * Callback that generates expected counts.
     * @param tokens Array of tokens to scan.
     * @returns The count of matching tokens.
     */
    getStatistics: function (tokens: Token[]) {
        return {
            "phrase": countOfTokens(tokens, 'phrase'),
            "plugin": countOfTokens(tokens, 'plugin'),
            "keyword": countOfTokens(tokens, 'plugin', 'keyword')
        }
    },

    /** The plugin(s) to test. */
    plugins: keywords.plugin(),

    /** The tests to execute. */
    tests: tests
}

