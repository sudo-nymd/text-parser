import { bgBlueBright, blueBright, magentaBright } from 'ansi-colors';
import { expect } from 'chai';
import * as logger from './lib/logger';
import Parser from '../src/parser';

const LOGENTRY = logger.create(`START`);
const log = (msg: string | object) => logger.log(LOGENTRY, msg);
const debug = (msg: object) => logger.debug(LOGENTRY, msg);
const error = (msg: string | object) => logger.error(LOGENTRY, msg);
const warn = (msg: string | object) => logger.warn(LOGENTRY, msg);


describe(`Tests the Parser module.`, function () {
    afterEach(() => {
        // Flush logging buffer after every test!
        logger.flush(LOGENTRY);
    });

    it(`Tests the index module.`, function (done) {
        
        const parser = new Parser();
        let line = parser.parse(`'quote'one two`); debug(line);
        line = parser.parse(`"double quote"`); debug(line);
        line = parser.parse(`"escape \\"quote"`); debug(line);
        line = parser.parse(`{bracket}`); debug(line);
        line = parser.parse(`[brace]`); debug(line);
        line = parser.parse(`  `); debug(line);
        //line = parser.parse(`cat`); debug(line);
        done(); 
    });
});