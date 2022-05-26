import * as logger from './lib/logger';
import { Parser, ModuleName } from '../src/parser';
import { Keywords } from '../src/plugins/keywords';
import { AssertionError, expect } from 'chai';
import { TokenTypes } from '../src/common/token-types';
import { parse } from 'path';

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

    it(`Tests the Parser.parse() method`, function(done) {

        const parser = new Parser();
        const parsed = parser.parse(
        `
        This is "in quotes".
        This is {another phrase}.
        This is a [braced phrase]
        `);
        debug(parsed)
        //debug(parsed.filter((item) => item.type == TokenTypes.Phrase))

        done();
    })

    it(`Tests the Parser.use() method.`, function (done) {

        // NULL plugin spec should throw
        expect(() => {
            new Parser().use(null);
        }).to.throw(ReferenceError);

        // Incomplete plugin spec should throw
        expect(() => {
            // @ts-ignore
            new Parser().use({});
        }).to.throw(TypeError);

        // Incomplete plugin spec should throw
        expect(() => {
            // @ts-ignore
            new Parser().use({ type: TokenTypes.Character });
        }).to.throw(TypeError);

        // Wrong plugin type should throw
        expect(() => {
            new Parser().use({
                //@ts-ignore
                type: TokenTypes.Character,
                pluginName: 'test-plugin',
                regex: /.*/g
            });
        }).to.throw(TypeError);           

        const parser = new Parser();
        const actual = parser.use(
            new Keywords()
                .add('zephyr')
                .add('sirocco')
                .plugin()
            );
        
        debug(actual);
        done();
    })

});