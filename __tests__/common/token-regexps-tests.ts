import { expect } from 'chai'
import { getTokenRegExp, ModuleName } from '../../src/common/token-regexps'
import { TokenTypes } from '../../src/common/token-types'

describe(`Tests the ${ModuleName} module.`, function() {
    it(`Tests the getTokenRegExp() function.`, function(done) {

        const knownRegExps = [
            TokenTypes.Whitespace, TokenTypes.Word, 
            TokenTypes.BraceClose, TokenTypes.BraceOpen,
            TokenTypes.BracketClose, TokenTypes.BracketOpen,
            TokenTypes.SingleQuote, TokenTypes.DoubleQuote,
            TokenTypes.Character
        ]

        knownRegExps.forEach(function(knownRegExp) {

            /**
             * For each RegExp key:
             * 1) Call each known RegExp key with options for starting/ending
             * RegExp match characters.
             * 2) Check the return RegExp matches the desired options.
             */

            // Default option is matchFromStart: true, matchToEnd: false
            let actual = getTokenRegExp(knownRegExp);
            expect(actual.source.startsWith('^')).to.equal(true);
            expect(actual.source.endsWith('$')).to.equal(false);

            // Try matchFromStart: false, matchToEnd: false
            actual = getTokenRegExp(knownRegExp, { matchFromStart: false, flags: '', matchToEnd: false });
            expect(actual.source.startsWith('^')).to.equal(false);
            expect(actual.source.endsWith('$')).to.equal(false);

            // Try matchFromStart: false, matchToEnd: true
            actual = getTokenRegExp(knownRegExp, { matchFromStart: false, flags: '', matchToEnd: true });
            expect(actual.source.startsWith('^')).to.equal(false);
            expect(actual.source.endsWith('$')).to.equal(true);

            // Try matchFromStart: true, matchToEnd: true
            actual = getTokenRegExp(knownRegExp, { matchFromStart: true, flags: '', matchToEnd: true });
            expect(actual.source.startsWith('^')).to.equal(true);
            expect(actual.source.endsWith('$')).to.equal(true);

            console.log(actual)
        })

        // Ensure unknown type throws
        expect(() => getTokenRegExp('unknown!')).throws(RangeError);

        done();
    })
})