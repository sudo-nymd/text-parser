/**
 * @module plugins/dates
 * @description A module that helps the Tokenizer recognize
 * simple date formats.
 */

import { PluginTokenSpec, TokenTypes } from '../common/token-types';

/**
 * A plugin that helps the Tokenizer recognize short dates.
 * 
 * @example 1/1/2020, 1/1/20, 01/01/2020, etc.
 */
export const shortDate: PluginTokenSpec = {
    regex: /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2}/,
    pluginName: 'short-date',
    type: TokenTypes.Plugin
}

/**
 * A plugin that helps the Tokenizer recognize long dates.
 * 
 * @example Jan 1, 2020, January 1, 2020, Jan 1 2020, Jan 1st, 2020
 */
export const longDate: PluginTokenSpec = {
    regex: /^(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(tember)?|oct(ober)?nov(ember)?|dec(ember)?)\s+(3[01]|[12][0-9]|0?[1-9])(th|st)?(,?\s+(?:[0-9]{2})?[0-9]{2})?/i,
    pluginName: 'long-date',
    type: TokenTypes.Plugin,
}

/**
 * A plugin that helps the Tokenizer recognize ISO dates.
 */
export const isoDate: PluginTokenSpec = {
    regex: /^(?:[0-9]{2})?[0-9]{2}\/(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])/,
    pluginName: 'iso-date',
    type: TokenTypes.Plugin,
}

/**
 * A plugin that helps the Tokenizer recognize days of the week.
 * 
 * @example Mon Monday Tue Tuesday 
 */
export const dayOfWeek: PluginTokenSpec = {
    regex: /^sun(day)?|^mon(day)?|^tue(sday)?|^wed(nesday)?|^thu(rsday)?|^fri(day)?|^sat(urday)?/i,
    pluginName: "day-of-week",
    type: TokenTypes.Plugin,
}

/**
 * Export the module name for testing.
 */
export const ModuleName = 'plugins/dates';

/**
 * Export all as array for easy use with Tokenizer or Parser.
 */
export const dates = [
    shortDate,
    longDate,
    isoDate,
    dayOfWeek
]