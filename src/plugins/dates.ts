import { PluginTokenSpec } from "../tokenizer";

export const shortDate: PluginTokenSpec = {
    pattern: /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2}/,
    type: 'short-date'
}

export const longDate: PluginTokenSpec = {
    pattern: /^(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(tember)?|oct(ober)?nov(ember)?|dec(ember)?)\s+(3[01]|[12][0-9]|0?[1-9])(th|st)?(,?\s+(?:[0-9]{2})?[0-9]{2})?/i,
    type: 'long-date'
}

export const isoDate: PluginTokenSpec = {
    pattern: /^(?:[0-9]{2})?[0-9]{2}\/(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])/,
    type: 'iso-date'
}

export const dayOfWeek: PluginTokenSpec ={
    pattern: /^sun(day)?|^mon(day)?|^tue(sday)?|^wed(nesday)?|^thu(rsday)?|^fri(day)?|^sat(urday)?/i,
    type: "day-of-week"
}

export const dates = [
    shortDate,
    longDate,
    isoDate,
    dayOfWeek
]