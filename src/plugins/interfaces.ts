import { TokenSpec } from "../common/token-registry";

export interface IPlugin {
    plugin(): TokenSpec;
}