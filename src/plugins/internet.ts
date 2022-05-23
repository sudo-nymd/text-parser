import { PluginTokenSpec } from "../common/token-registry";
import { TokenTypes } from "../common/token-types";

export const email: PluginTokenSpec = {
    pattern: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    type: TokenTypes.Plugin,
    subType: "email-address"
}

export const url: PluginTokenSpec = {
    pattern: /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/i,
    type: TokenTypes.Plugin,
    subType: "url"
}

export const Internet = [
    email,
    url
]