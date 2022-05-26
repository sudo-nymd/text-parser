/** 
 * TOKEN-FACTORY-TESTS
 * 
 */

import { expect } from 'chai';
import * as logger from '../lib/logger';
import * as factory from '../../src/common/token-factory'
import { TokenTypes } from '../../src/common/token-types';

// "Stateless" logging functions (avoid clashes with Mocha's hijackng of "this")
const LOGENTRY = logger.create(factory.ModuleName);
const log = (msg: string | object, src?: string) => logger.log(LOGENTRY, msg, src);
const debug = (msg: object, src?: string) => logger.debug(LOGENTRY, msg, src);
const error = (msg: string | object, src?: string) => logger.error(LOGENTRY, msg, src);
const warn = (msg: string | object, src?: string) => logger.warn(LOGENTRY, msg, src);

const WORDS = {
    GOOD: [
        'the',
        "and",
        "weather",
        "dan's"
    ],
    BAD: [
        `this is actually a phrase.`,
        'another phrase',
        '{bracketed}',
        '[braced]'
    ]
}

const CHARACTERS = {
    GOOD: `;:<>!@#$%^&*=-` +
        `৳₩₡¢﷼₻₹₪`,
    BAD: `abcdefghijklmnopqrstuvwxyz0123456789`
}

describe(`Test the ${factory.ModuleName} Module.`, function () {

    afterEach(() => {
        // Flush logging buffer after every test!
        logger.flush(LOGENTRY);
    });

    const fname1 = factory.character.name;
    it(`Tests the ${fname1} Function`, function (done) {

        function expected(value: string) {
            return {
                type: TokenTypes.Character,
                value: value
            }
        }

        CHARACTERS.GOOD.split('').forEach(function (goodChar) {
            const expectedValue = expected(goodChar);
            debug(expectedValue, `expected`);

            const actualValue = factory.character(goodChar);
            debug(actualValue, `${fname1}('${goodChar}')`);
            expect(actualValue).to.have.deep.equals(expectedValue);
        });

        CHARACTERS.BAD.split('').forEach(function (badChar) {
            expect(() => {
                // Send bad character to make sure we get the desired exception
                try { factory.character(badChar); }
                catch (err) {
                    log(err, `${fname1}('${badChar}')`);
                    throw err;
                }
            }).to.throw(SyntaxError);
        });

        // Send a phrase to make sure we get the desired exception
        expect(() => {
            try { factory.character('This is obviously a phrase'); }
            catch (err) {
                log(err, `${fname1}('This is obviously a phrase')`);
                throw err;
            }
        }).to.throw(SyntaxError);

        // Send a word to make sure we get the desired exception
        expect(() => {
            try { factory.character('cat'); }
            catch (err) {
                log(err, `${fname1}('cat')`);
                throw err;
            }
        }).to.throw(SyntaxError);

        done();
    })

    it(`Tests the Whitespace Generator`, function (done) {

        function expected(count) {
            return {
                type: TokenTypes.Whitespace,
                value: ''.padEnd(count, ' ')
            }
        }

        for (let count = 1; count < 10; count++) {
            const ws = factory.whitespace(count);
            expect(ws).to.have.deep.equals(expected(count));
        }

        // Test the default - should return one space in
        // the token's value
        expect(factory.whitespace()).to.deep.equal(expected(1));


        done();
    })

    it(`Tests the Word Generator.`, function (done) {

        function expected(value: string) {
            return {
                type: TokenTypes.Word,
                value: value
            }
        }

        WORDS.GOOD.forEach(function (goodWord) {
            const word = factory.word(goodWord);
            expect(word).to.have.deep.equals(expected(goodWord));
        });

        WORDS.BAD.forEach(function (badWord) {
            const fn = () => factory.word(badWord);
            expect(fn).to.throw(SyntaxError);
        });

        done();
    })
});