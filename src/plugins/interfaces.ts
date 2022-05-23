import { TokenRegistryItem } from "../common/token-registry";

export interface IPlugin {
    plugin(): TokenRegistryItem;
}