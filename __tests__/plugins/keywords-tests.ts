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
        

        expect(() => new Keywords().add(null)).to.throw(ReferenceError);
        expect(() => new Keywords().addMany(null)).to.throw(TypeError);
        expect(() => new Keywords().addMany([null])).to.throw(ReferenceError);

        // Check returned plugin value
        expect(new Keywords()
            .add('zephyr')
            .add('sirocco')
            .plugin()).to.have.deep.equal({
                type: TokenTypes.Plugin,
                pluginName: 'keywords',
                regex: /^zephyr|^sirocco/
            })

        done();
    })

    it(`Tests the Keywords Plugin w/ Tokenizer`, function (done) {
        const KEYWORDS = [
            'chinook',
            'sirocco',
            'zephyr',
            'gale-force'
        ]

        // Renamed the plugin every test run
        const PLUGIN_NAME = 'my-keywords-' + Math.random();

        const expected = KEYWORDS.map(function(keyword){
            return {
                type: TokenTypes.Plugin,
                value: keyword,
                pluginName: PLUGIN_NAME
            }
        })

        const keywords = new Keywords(PLUGIN_NAME)
            .addMany(KEYWORDS);            

        // Check instance properties
        expect(keywords.count, `keywords.count`).to.equal(KEYWORDS.length);
        expect(keywords.pluginName, `keywords.pluginName`).to.equal(PLUGIN_NAME)

        const tokenizer = new Tokenizer();
        tokenizer.init(KEYWORDS.join(' '), [keywords.plugin()]);

        const actual = [];
        while(tokenizer.hasMoreTokens()) {
            const token = tokenizer.getNextToken();
            // We only want to capture plugin tokens
            if (token.type === TokenTypes.Plugin) actual.push(token)
        }

        debug({ actual, expected });

        expect(actual).to.deep.equal(expected);

        done();
    });
});