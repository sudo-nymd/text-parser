import { TokenSpec } from '../common/token-specs';
import { TokenTypes } from '../common/token-types';

export const shortDate: TokenSpec = {
    pattern: /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2}/,
    subType: 'short-date',
    type: TokenTypes.Plugin
}

export const longDate: TokenSpec = {
    pattern: /^(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(tember)?|oct(ober)?nov(ember)?|dec(ember)?)\s+(3[01]|[12][0-9]|0?[1-9])(th|st)?(,?\s+(?:[0-9]{2})?[0-9]{2})?/i,
    subType: 'long-date',
    type: TokenTypes.Plugin,
}

export const isoDate: TokenSpec = {
    pattern: /^(?:[0-9]{2})?[0-9]{2}\/(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])/,
    subType: 'iso-date',
    type: TokenTypes.Plugin,
}

export const dayOfWeek: TokenSpec ={
    pattern: /^sun(day)?|^mon(day)?|^tue(sday)?|^wed(nesday)?|^thu(rsday)?|^fri(day)?|^sat(urday)?/i,
    subType: "day-of-week",
    type: TokenTypes.Plugin,
}

export const dates = [
    shortDate,
    longDate,
    isoDate,
    dayOfWeek
]