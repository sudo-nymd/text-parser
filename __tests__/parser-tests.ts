import * as logger from './lib/logger';
import { Parser, ModuleName } from '../src/parser';
import { Keywords } from '../src/plugins/keywords';
import { expect } from 'chai';

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

    it.only(`Manual Test`, function(done) {
        let text = `"This" 'is a test's' with {singles} quotes!`;
        //text = `This {is a test with brackets}!`;
        //text = `This "is a test with double quotes"!`;
        console.log(new Parser().parse(text))
        done();
    })

    it(`Tests the Parser.parse() method`, function (done) {

        const parser = new Parser();

        // @ts-ignore
        expect(() => parser.parse(null), 'null text arg').to.throw(ReferenceError);
        expect(() => parser.parse(''), 'empty text arg').to.throw(ReferenceError);
        parser.use(new Keywords()
            .add('zephyr')
            .add('sirrocco')
            .plugin());
        const parsed = parser.parse(
            `
        This is "in quotes".
        This is {another phrase}.
        This is a [braced phrase].
        This is an exclamation!!!
        Part 1; Part 2; Part 3;
        The zephyr turned into a sirrocco?
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