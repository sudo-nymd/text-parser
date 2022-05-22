import { dates, Keywords } from '../src/plugins';
import { Token } from '../src/tokenizer';

const KEYWORDS = [
    'sirocco',
    'zephyr',
    'chinook',
    'gale'
]

const randomKeyword = () => {
    const index = Math.round(Math.random() * (KEYWORDS.length - 1));
    return KEYWORDS[index];
}

const countOfTokens = (tokens: Token[], type: string, name: string = null) => {
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

const keywords = new Keywords();
KEYWORDS.forEach(function(keyword) {
    keywords.add(keyword);
});

export const keywordsPluginTestRunner = {
    getStatistics: function (tokens: Token[]) {
        return {
            "phrase": countOfTokens(tokens, 'phrase'),
            "plugin": countOfTokens(tokens, 'plugin'),
            "keyword": countOfTokens(tokens, 'plugin', 'keyword')
        }
    },
    plugins: keywords.plugin(),
    tests: tests
}

