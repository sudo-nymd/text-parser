import { PluginTokenSpec } from "../common/token-specs";
import { TokenSuperTypes, TokenTypes } from "../common/token-types";

const emoji: PluginTokenSpec = {
    pattern: /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/,
    superType: TokenSuperTypes.Plugin,
    type: 'emojii'
}