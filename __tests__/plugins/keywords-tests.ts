import { AssertionError, expect } from "chai";
import { TokenTypes } from "../../src/common/token-types";
import { Keywords, ModuleName } from "../../src/plugins/keywords";
import { Tokenizer } from "../../src/tokenizer";
import * as logger from '../lib/logger';

// "Stateless" logging functions (avoid clashes with Mocha's hijackng of "this")
const LOGENTRY = logger.create(ModuleName);
const log = (msg: string | object, src?: string) => logger.log(LOGENTRY, msg, src);
const debug = (msg: object, src?: string) => logger.debug(LOGENTRY, msg, src);
const error = (msg: string | object, src?: string) => logger.error(LOGENTRY, msg, src);
const warn = (msg: string | object, src?: string) => logger.warn(LOGENTRY, msg, src);

describe(`Tests the "${ModuleName}" Module.`, function () {

    afterEach(() => {
        // Flush logging buffer after every test!
        logger.flush(LOGENTRY);
    });

    it(`Tests that the Keywords add() and addMany() methods throw Errors.`, function(done) {
        function nullAdd() {
            new Keywords().add(null)
        }

        function nullAddMany() {
            new Keywords().add(null)
        }

        function nullInArrayAddMany() {
            new Keywords().addMany([null])
        }

        expect(nullAdd).to.throw(AssertionError);
        expect(nullAddMany).to.throw(AssertionError);
        expect(nullInArrayAddMany).to.throw(AssertionError);

        done();
    })

    it(`Tests the Keywords Plugin w/ Tokenizer`, function (done) {
        const KEYWORDS = [
            'chinook',
            'sirocco',
            'zephyr',
            'gale-force'
        ]

        const expected = KEYWORDS.map(function(keyword){
            return {
                type: TokenTypes.Plugin,
                value: keyword,
                pluginName: 'keywords'
            }
        })

        const plugin = new Keywords()
            .addMany(KEYWORDS)
            .plugin();

        const tokenizer = new Tokenizer();
        tokenizer.init(KEYWORDS.join(' '), [plugin]);

        const actual = [];
        while(tokenizer.hasMoreTokens()) {
            const token = tokenizer.getNextToken();
            if (token.type === TokenTypes.Plugin) actual.push(token)
        }

        debug({ actual, expected });

        expect(actual).to.deep.equal(expected);

        done();
    });
});