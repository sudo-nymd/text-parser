import { AssertionError, expect } from "chai";
import { Token, TokenTypes } from "../../src/common/token-types";
import { url, email, ModuleName } from "../../src/plugins/internet";
import { Tokenizer } from "../../src/tokenizer";
import { randomItem, Statistics } from "../lib/common";
import * as logger from '../lib/logger';

// "Stateless" logging functions (avoid clashes with Mocha's hijackng of "this")
const LOGENTRY = logger.create(ModuleName);
const log = (msg: string | object, src?: string) => logger.log(LOGENTRY, msg, src);
const debug = (msg: object, src?: string) => logger.debug(LOGENTRY, msg, src);
const error = (msg: string | object, src?: string) => logger.error(LOGENTRY, msg, src);
const warn = (msg: string | object, src?: string) => logger.warn(LOGENTRY, msg, src);

describe(`Tests the "${ModuleName}" module.`, function () {

    afterEach(() => {
        // Flush logging buffer after every test!
        logger.flush(LOGENTRY);
    });

    it(`Tests the "email" and "url" plugins.`, function(done) {
        
        const actuals: Token[] = [];
        const text = `
        For sales, please email sales@somedomain.com.
        For technical support, please email support@somedomain.com.
        Please visit our website at https://www.somedomain.com. 
        Visit our Facebook page and give us a like at https://www.facebook.com/somedomain
        `
        const tokenizer = new Tokenizer();
        tokenizer.init(text, [email, url]);

        while(tokenizer.hasMoreTokens()) {
            const token = tokenizer.getNextToken();
            if (token.type === TokenTypes.Plugin) actuals.push(token);
        }
        // Output before assertions
        debug(actuals, `tokens`);

        // Gather some stats about the tokens.
        const { filters: { isPluginType, isTokenType }, countOfTokens } = Statistics;
        const statistics = {
            countOfPluginTokens: countOfTokens(actuals, isTokenType(TokenTypes.Plugin)),
            countOfEmailTokens: countOfTokens(actuals, isPluginType('email-address')),
            countOfUrlTokens: countOfTokens(actuals, isPluginType('url'))
        }
        // Output before assertions
        debug(statistics, `statistics`);

        // Assertions
        const expectedPluginTokens = 4;
        const expectedEmailTokens = 2;
        const expectedUrlTokens = 2;
        expect(statistics.countOfPluginTokens, `Count of tokens with type = "plugin"..`).to.equal(expectedPluginTokens);
        expect(statistics.countOfEmailTokens, `Count of tokens with pluginName = "email-address"`).to.equal(expectedEmailTokens);
        expect(statistics.countOfUrlTokens, `Count of tokens with pluginName = "url"`).to.equal(expectedUrlTokens);

        done();
    })
});