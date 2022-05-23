import { dates } from '../src/plugins';
import { Token, TokenSubTypes, TokenTypes } from '../src/common/token-types';
import { randomItem, Statistics as stats } from './lib/common';

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
    return randomItem(DAYS_OF_WEEK);
}

const Tests = [
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
            "plugin": stats.countOfTokens(tokens, stats.filters.isTokenType(TokenTypes.Plugin)),
            "long-date": stats.countOfTokens(tokens, stats.filters.isPluginType('long-date')),
            "short-date": stats.countOfTokens(tokens, stats.filters.isPluginType('short-date')),
            "iso-date": stats.countOfTokens(tokens, stats.filters.isPluginType('iso-date')),
            "day-of-week": stats.countOfTokens(tokens, stats.filters.isPluginType('day-of-week'))
        }
    },

    /** The plugin(s) to test. */
    plugins: dates,

    /** The tests to execute. */
    tests: Tests
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