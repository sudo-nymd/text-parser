import { dates } from '../src/plugins';
import { Token } from '../src/tokenizer';

/**
 * Sample data to use.
 */
const DAYS_OF_WEEK = [
    'Sunday',
    'Sun',
    'Monday',
    'Mon',
    'Tuesday',
    'Tue',
    'Wednesday',
    'Wed',
    'Thursday',
    'Thu',
    'Friday',
    'Fri',
    'Saturday',
    'Sat'
]

/**
 * Generates a random day of the week.
 * @returns The day of the week.
 */
const randomDayOfWeek = () => {
    const index = Math.round(Math.random() * (DAYS_OF_WEEK.length - 1));
    return DAYS_OF_WEEK[index];
}

/**
 * Reduce that calculates the count of tokens matching either the 
 * type or the plugin name.
 * @param tokens Array of tokens to reduce.
 * @param type The type of token to reduce by.
 * @param name The plugin name of token to reduce by.
 * @returns The count of tokens matching the type of the plugin name.
 */
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
        name: `ISO Date`,
        text: `
        On Monday, I have a dentist appointment. Thursday is the day before fri
        tue tuesday ISO Date 2000/01/09
        `,
        expected: {
        ['plugin']: 6,
        ['long-date']: 0,
        ['short-date']: 0,
        ['iso-date']: 1,
        ['day-of-week']: 5
    }
    },
    {
        name: `Single Long Date`,
        text: `On Dec 14, 1911, the South Pole first reached by Roald Amundsen.`,
        expected: {
            ['plugin']: 1,
            ['long-date']: 1,
            ['short-date']: 0,
            ['iso-date']: 0,
            ['day-of-week']: 0
        }
    },
    {
        name: `Tests days with "th" or "st".`,
        text: `
        June 14th 2020 was a good day.
        July 4th 2020 is my favorite holiday. Saturday the 19th is the 
        day of the next meeting
        July 4th
        May 5th
        .
        `,
        expected: {
            plugin: 5,
            ['long-date']: 4,
            ['short-date']: 0,
            ['iso-date']: 0,
            ['day-of-week']: 1
        }
    },
    {
        name: `Random Days of Week`,
        text: `
            This ${randomDayOfWeek()} and ${randomDayOfWeek()}. 
            Perhaps on ${randomDayOfWeek()} we can meet.
            ${randomDayOfWeek()}'s child is full of woe.
            `,
        expected: {
            ['plugin']: 4,
            ['long-date']: 0,
            ['short-date']: 0,
            ['iso-date']: 0,
            ['day-of-week']: 4
        }
    }
]

export const pluginDatesTestDef = {
    getStatistics: function (tokens: Token[]) {
        return {
            "plugin": countOfTokens(tokens, 'plugin'),
            "long-date": countOfTokens(tokens, 'plugin', 'long-date'),
            "short-date": countOfTokens(tokens, 'plugin', 'short-date'),
            "iso-date": countOfTokens(tokens, 'plugin', 'iso-date'),
            "day-of-week": countOfTokens(tokens, 'plugin', 'day-of-week')
        }
    },
    plugins: dates,
    tests: tests
}

/** TEMPLATE
{
    text: ``,
    expected: {
        plugin: 0,
        ['long-date']: 0,
        ['short-date']: 0,
        ['iso-date']: 0,
        ['day-of-week']: 0
    }
}
 */