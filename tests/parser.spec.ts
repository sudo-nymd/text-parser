import { bgBlueBright, blueBright, magentaBright } from 'ansi-colors';
import { expect } from 'chai';
import * as logger from './lib/logger';
import Parser from '../src/parser';

const LOGENTRY = logger.create(`START`);
const log = (msg: string | object) => logger.log(LOGENTRY, msg);
const debug = (msg: object) => logger.debug(LOGENTRY, msg);
const error = (msg: string | object) => logger.error(LOGENTRY, msg);
const warn = (msg: string | object) => logger.warn(LOGENTRY, msg);


describe(`Tests the project setup. You can delete this after project initialization, or add "skip" to test.`, function () {
    afterEach(() => {
        // Flush logging buffer after every test!
        logger.flush(LOGENTRY);
    });

    it(`Tests the index module.`, function (done) {
        
        const parser = new Parser();
        const line = parser.parse(`  The quick brown fox jumped over the lazy dog.`);
        debug(line);

        done();
    });
});