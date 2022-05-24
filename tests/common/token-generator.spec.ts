import { expect } from 'chai';
import * as generator from '../../src/common/token-generator'
import { TokenSuperTypes, TokenTypes } from '../../src/common/token-types';

const GOOD_WORDS = [
    'the',
    "and",
    "weather",
    "dan's"
];

const BAD_WORDS = [
    `this is actually a phrase.`
]

describe(`Test the token-generator Module.`, function () {
    it(`Tests the Word Generator.`, function (done) {

        function expected(value: string) {
            return {
                type: TokenTypes.Word,
                superType: TokenSuperTypes.Standard,
                value: value
            }
        }
        
        GOOD_WORDS.forEach(function(goodWord) {
            const word = generator.word(goodWord);
            expect(word).to.have.deep.equals(expected(goodWord));
        });

        BAD_WORDS.forEach(function(badWord) {
            expect(() => { generator.word(badWord) }).to.throw(/Text did not match criteria for type/);
        });

        done();
    })
});