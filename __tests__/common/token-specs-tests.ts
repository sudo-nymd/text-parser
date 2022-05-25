/** 
 * TOKEN-SPECS-TESTS
 * 
 */

import * as logger from '../lib/logger';
import { expect } from 'chai';
import { TokenSpecs, ModuleName, getTokenRegExp } from '../../src/common/token-specs';

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