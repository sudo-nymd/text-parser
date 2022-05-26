/** 
 * TOKEN-SPECS-TESTS
 * 
 */

import * as logger from '../lib/logger';
import { expect } from 'chai';
import { TokenSpecs, ModuleName, getTokenRegExp, Phrase } from '../../src/common/token-specs';
import { TokenTypes } from '../../src/common/token-types';

// "Stateless" logging functions (avoid clashes with Mocha's hijackng of "this")
const LOGENTRY = logger.create(ModuleName);
const log = (msg: string | object, src?: string) => logger.log(LOGENTRY, msg, src);
const debug = (msg: object, src?: string) => logger.debug(LOGENTRY, msg, src);
const error = (msg: string | object, src?: string) => logger.error(LOGENTRY, msg, src);
const warn = (msg: string | object, src?: string) => logger.warn(LOGENTRY, msg, src);

describe(`Tests the "${ModuleName}" Module.`, function() {

    afterEach(() => {
        // Flush logging buffer after every test!
        logger.flush(LOGENTRY);
    });

    it(`Tests the Phrase.getMatchingType() function.`, function(done) {
        
        expect(Phrase.getMatchingType(TokenTypes.BraceClose)).to.equal(TokenTypes.BraceOpen);
        expect(Phrase.getMatchingType(TokenTypes.BraceOpen)).to.equal(TokenTypes.BraceClose);
        expect(Phrase.getMatchingType(TokenTypes.BracketClose)).to.equal(TokenTypes.BracketOpen);
        expect(Phrase.getMatchingType(TokenTypes.BracketOpen)).to.equal(TokenTypes.BracketClose);
        expect(Phrase.getMatchingType(TokenTypes.SingleQuote)).to.equal(TokenTypes.SingleQuote);
        expect(Phrase.getMatchingType(TokenTypes.DoubleQuote)).to.equal(TokenTypes.DoubleQuote);

        done();
    })

    const fname1 = getTokenRegExp.name;   // Get name of exported function
    it(`Tests the {${fname1}()} Function`, function(done) {
        
        TokenSpecs.forEach(function(spec) {
            const expected = spec.regex;
            debug(expected, `expected`);
            const actual = getTokenRegExp(spec.type);
            debug(actual, `${fname1}('${spec.type}')`);
            expect(actual.source).to.equal(expected.source);
        });

        // Send an 'unknown' index to make sure we get the desired exception
        expect(() => {
            try { getTokenRegExp('foo'); }
            catch (err) {
                log(err, `${fname1}('foo')`);
                throw err;
            }
        }).to.throw(RangeError);

        done();
    });

});