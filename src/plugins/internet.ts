/**
 * @module plugins/internet
 * @description A simple module that helps the Tokenizer recognize
 * email addresses and URLs.
 */

import { PluginTokenSpec, TokenTypes } from '../common/token-types';

/**
 * A plugin that helps the Tokenizer recognize emails.
 * 
 * @example someuser@somedomain.com
 */
export const email: PluginTokenSpec = {
    regex: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    type: TokenTypes.Plugin,
    pluginName: "email-address"
}

/**
 * A plugin that helps the Tokenizer recognize URLs.
 * 
 * @example http://www.microsoft.com http://www.apple.com/iphone
 */
export const url: PluginTokenSpec = {
    regex: /^(https?:\/\/)+([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?/i,
    //regex: regex,
    type: TokenTypes.Plugin,
    pluginName: "url"
}

/**
 * Export the module name for testing.
 */
export const ModuleName = 'plugins/internet';

/**
 * Export all as array for easy use with Tokenizer or Parser.
 */
export const Internet = [
    email,
    url
]