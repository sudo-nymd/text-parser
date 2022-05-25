import { AssertionError, expect } from "chai";
import { Token, TokenTypes } from "../../src/common/token-types";
import { dates, isoDate, longDate, ModuleName, shortDate } from "../../src/plugins/dates";
import { Tokenizer } from "../../src/tokenizer";
import { randomItem, Statistics } from "../lib/common";
import * as logger from '../lib/logger';

// "Stateless" logging functions (avoid clashes with Mocha's hijackng of "this")
const LOGENTRY = logger.create(ModuleName);
const log = (msg: string | object, src?: string) => logger.log(LOGENTRY, msg, src);
const debug = (msg: object, src?: string) => logger.debug(LOGENTRY, msg, src);
const error = (msg: string | object, src?: string) => logger.error(LOGENTRY, msg, src);
const warn = (msg: string | object, src?: string) => logger.warn(LOGENTRY, msg, src);

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

const LONG_DATES = [
    `Dec 25th`,
    `Dec 25 2020`,
    `July 4, 1980`,
    `Jul 4, 1990`,
    `Sep 15th, 2022`,
    'May 01, 20'
]

describe(`Tests the "${ModuleName}" module.`, function () {

    afterEach(() => {
        // Flush logging buffer after every test!
        logger.flush(LOGENTRY);
    });

    it(`Tests the "short-date" plugin`, function(done) {
        
        const actuals: Token[] = [];
        const text = `
        7/4/1776 is independance day. 
        So is 07/04/2022. 
        12/25/2020 is Christmas.
        2/29/2000 is a leap year. So is 2/29/1980`
        const tokenizer = new Tokenizer();
        tokenizer.init(text, [shortDate]);

        while(tokenizer.hasMoreTokens()) {
            const token = tokenizer.getNextToken();
            actuals.push(token);
        }
        // Output before assertions
        debug(actuals, `tokens`);

        // Gather some stats about the tokens.
        const { filters: { isPluginType, isTokenType }, countOfTokens } = Statistics;
        const statistics = {
            countOfPluginTokens: countOfTokens(actuals, isTokenType(TokenTypes.Plugin)),
            countOfShortDateTokens: countOfTokens(actuals, isPluginType('short-date'))
        }
        // Output before assertions
        debug(statistics, `statistics`);

        // Assertions
        const expected = 5;
        expect(statistics.countOfPluginTokens, `Count of tokens with type = "plugin"..`).to.equal(expected);
        expect(statistics.countOfShortDateTokens, `Count of tokens with pluginName = "short-date"`).to.equal(expected);

        done();
    })

    it(`Tests the "long-date" plugin`, function (done) {

        const actuals: Token[] = [];
        const text = `
        July 4, 1776 is independance day. 
        So is Jul 4 2020. 
        December 25th is Christmas.
        Feb 29 2000 is a leap year. So is February 29th 1980`
        const tokenizer = new Tokenizer();
        tokenizer.init(text, [longDate]);

        while (tokenizer.hasMoreTokens()) {
            const token = tokenizer.getNextToken();
            actuals.push(token);
        }
        // Output before assertions
        debug(actuals, `tokens`);

        // Gather some stats about the tokens.
        const { filters: { isPluginType, isTokenType }, countOfTokens } = Statistics;
        const statistics = {
            countOfPluginTokens: countOfTokens(actuals, isTokenType(TokenTypes.Plugin)),
            countOfLongDateTokens: countOfTokens(actuals, isPluginType('long-date'))
        }
        // Output before assertions
        debug(statistics, `statistics`);

        // Assertions
        const expected = 5;
        expect(statistics.countOfPluginTokens, `Count of tokens with type = "plugin"..`).to.equal(expected);
        expect(statistics.countOfLongDateTokens, `Count of tokens with pluginName = "long-date"`).to.equal(expected);

        done();
    })

    it.skip(`Tests the "iso-date" plugin`, function (done) {

        const actuals: Token[] = [];
        const text = `
        1776/04/07 is independance day. 
        So is 2022/07/04. 
        2020/12/25 is Christmas.
        2000/2/29 is a leap year. So is 1980/2/29`
        const tokenizer = new Tokenizer();
        tokenizer.init(text, [isoDate]);

        while (tokenizer.hasMoreTokens()) {
            const token = tokenizer.getNextToken();
            actuals.push(token);
        }
        // Output before assertions
        debug(actuals, `tokens`);

        // Gather some stats about the tokens.
        const { filters: { isPluginType, isTokenType }, countOfTokens } = Statistics;
        const statistics = {
            countOfPluginTokens: countOfTokens(actuals, isTokenType(TokenTypes.Plugin)),
            countOfISODateTokens: countOfTokens(actuals, isPluginType('short-date'))
        }
        // Output before assertions
        debug(statistics, `statistics`);

        // Assertions
        const expected = 5;
        expect(statistics.countOfPluginTokens, `Count of tokens with type = "plugin"..`).to.equal(expected);
        expect(statistics.countOfISODateTokens, `Count of tokens with pluginName = "iso-date"`).to.equal(expected);

        done();
    })
});