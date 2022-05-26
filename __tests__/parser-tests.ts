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

        // @ts-ignore
        expect(() => parser.parse(null), 'null text arg').to.throw(ReferenceError);
        expect(() => parser.parse(''), 'empty text arg').to.throw(ReferenceError);

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

        expect(() => new Parser().use(null)).to.throw(ReferenceError);

        const actual = new Parser()
            .use(
            new Keywords()
                .add('zephyr')
                .add('sirrocco')
                .plugin()
            )
            .parse('the zephyr turned into a sirrocco')
        
        debug(actual);
        done();
    })

});