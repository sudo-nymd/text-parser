import { PluginTokenSpec, TokenTypes } from '../common/token-types'

/**
 * Validates the plugin to ensure it has required properties.
 * @param plugin The plugin to validate.
 * @returns The validated plugin.
 */
export const validatePlugin = (plugin: PluginTokenSpec) => {

    if (plugin === null) {
        throw new ReferenceError(`Plugin should not be null!`);
    }

    const { type, pluginName, regex } = plugin

    if (typeof pluginName !== 'string' || pluginName.trim().length == 0) {
        throw new Error(`Plugin name is a required parameter!`);
    }

    if (regex instanceof RegExp == false) {
        throw new Error(`Plugin regex must a valid regular expression!`);
    }

    if (type !== TokenTypes.Plugin) {
        throw new Error(`Plugin type must equal 'plugin'!`);
    }

    return plugin;
}

/**
 * Validates the array of plugins to ensure it has required properties.
 * @param plugin The array of plugins to validate.
 * @returns The validated plugin array.
 */
export const validatePlugins = (plugins: PluginTokenSpec[]) => {
    if (plugins == null || plugins == undefined) {
        throw ReferenceError(`Plugins array should not be null!`);
    }

    if (Array.isArray(plugins) == false) {
        throw new TypeError(`Plugins should be of type array!`)
    }

    plugins.forEach((plugin) => validatePlugin(plugin));

    return plugins;
}

/**
 * Export the module name for testing.
 */
export const ModuleName = `plugins/common`;