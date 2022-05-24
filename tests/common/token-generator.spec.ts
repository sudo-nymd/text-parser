import { expect } from 'chai';
import * as generator from '../../src/common/token-generator'
import { TokenSuperTypes, TokenTypes } from '../../src/common/token-types';

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

describe(`Test the token-generator Module.`, function () {

    it(`Tests the Character Generator`, function(done) {
        
        function expected(value: string) {
            return {
                type: TokenTypes.Character,
                superType: TokenSuperTypes.Standard,
                value: value
            }
        }

        CHARACTERS.GOOD.split('').forEach(function (goodChar) {
            const word = generator.character(goodChar);
            expect(word).to.have.deep.equals(expected(goodChar));
        });

        CHARACTERS.BAD.split('').forEach(function (badChar) {
            const fn = () => generator.character(badChar);
            expect(fn).to.throw(SyntaxError);
        });

        done();
    })
    
    it(`Tests the Whitespace Generator`, function(done) {

        function expected(count) {
            return {
                type: TokenTypes.Whitespace,
                superType: TokenSuperTypes.Standard,
                value: ''.padEnd(count, ' ')
            }
        }
        
        for(let count = 1; count < 10; count++) {
            const ws = generator.whitespace(count);
            expect(ws).to.have.deep.equals(expected(count));
        }
        

        done();
    })

    it(`Tests the Word Generator.`, function (done) {

        function expected(value: string) {
            return {
                type: TokenTypes.Word,
                superType: TokenSuperTypes.Standard,
                value: value
            }
        }
        
        WORDS.GOOD.forEach(function(goodWord) {
            const word = generator.word(goodWord);
            expect(word).to.have.deep.equals(expected(goodWord));
        });

        WORDS.BAD.forEach(function(badWord) {
            const fn = () => generator.word(badWord);
            expect(fn).to.throw(SyntaxError);
        });

        done();
    })
});