
import { expect } from 'chai';
import { TokenTypes } from '../../src/common/token-types';
import { ModuleName, validatePlugin, validatePlugins } from '../../src/plugins/common';

describe(`Tests the ${ModuleName} module.`, function() {

    it(`Tests the validatePlugin() function.`, function(done) {

        const pluginName = 'test-plugin';
        const type = TokenTypes.Plugin;
        const regex = /.*/g;

        expect(() => validatePlugin(null), 'null plugin').to.throw(ReferenceError);
        
        // @ts-ignore
        expect(() => validatePlugin({ type, regex}), 'invalid name').to.throw(/plugin name/i);

        // @ts-ignore
        expect(() => validatePlugin({ pluginName, regex }), 'invalid type').to.throw(/plugin type/i);

        // @ts-ignore
        expect(() => validatePlugin({ pluginName, type }), 'invalid regex').to.throw(/plugin regex/i);

        // Let's try a valid one
        expect(validatePlugin({ type, pluginName, regex}), `plugin instance`).to.deep.equals({type, pluginName, regex});

        done();
    })

    it(`Tests the validatePlugins() function.`, function (done) {

        const pluginName = 'test-plugin';
        const type = TokenTypes.Plugin;
        const regex = /.*/g;

        expect(() => validatePlugins(null), 'null plugin').to.throw(ReferenceError);

        expect(() => validatePlugins([null]), 'array w/ null plugin').to.throw(ReferenceError);

        // @ts-ignore
        expect(() => validatePlugins({ type, pluginName, regex }), 'plugin not an array').to.throw(TypeError);

        // @ts-ignore
        expect(() => validatePlugins([{ type, regex }]), 'invalid name').to.throw(/plugin name/i);

        // @ts-ignore
        expect(() => validatePlugins([{ pluginName, regex }]), 'invalid type').to.throw(/plugin type/i);

        // @ts-ignore
        expect(() => validatePlugins([{ pluginName, type }]), 'invalid regex').to.throw(/plugin regex/i);

        // Let's try a valid one
        expect(validatePlugins([{ type, pluginName, regex }]), `plugin instance`).to.deep.equals([{ type, pluginName, regex }]);

        done();
    })
})