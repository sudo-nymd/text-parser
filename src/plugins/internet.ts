import { PluginTokenSpec } from "../common/token-specs";
import { TokenSuperTypes } from "../common/token-types";

export const email: PluginTokenSpec = {
    pattern: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    superType: TokenSuperTypes.Plugin,
    type: "email-address"
}

export const url: PluginTokenSpec = {
    pattern: /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/i,
    superType: TokenSuperTypes.Plugin,
    type: "url"
}

export const Internet = [
    email,
    url
]