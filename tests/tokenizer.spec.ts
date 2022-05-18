import { bgBlueBright, blueBright, magentaBright } from 'ansi-colors';
import { expect } from 'chai';
import * as logger from './lib/logger';
import Tokenizer, { Token, TokenFlags, TokenTypes } from '../src/tokenizer';

const LOGENTRY = logger.create(`START`);
const log = (msg: string | object) => logger.log(LOGENTRY, msg);
const debug = (msg: object) => logger.debug(LOGENTRY, msg);
const error = (msg: string | object) => logger.error(LOGENTRY, msg);
const warn = (msg: string | object) => logger.warn(LOGENTRY, msg);

type TokenTest = {
    tokens: string;
    expected: {
        type: TokenTypes,
        flags: TokenFlags
    }
}

const TOKEN_TESTS = [
    {
        tokens: `[brace]`,
        expected: {
            type: 'phrase',
            flags: TokenFlags.Brace
        }
    }
]


describe(`Tests the Tokenizer module.`, function () {
    afterEach(() => {
        // Flush logging buffer after every test!
        logger.flush(LOGENTRY);
    });

    it.only(`Tests the index module.`, function (done) {

        const tokenizer = new Tokenizer();
        tokenizer.init(`"quote" no [brace] (parens&) ::: (&^ $%) >`);
        while(tokenizer.hasMoretokens()) {
            const token = tokenizer.getNextToken();
            debug(token)
        }
        
        done();
    });
});