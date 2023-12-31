import { registerHandlebarTemplates } from './registerHandlebarTemplates';

describe('registerHandlebarTemplates', () => {
    it('should return correct templates', () => {
        const templates = registerHandlebarTemplates({
            useUnionTypes: false,
        });
        expect(templates.index).toBeDefined();
        expect(templates.exports.routes).toBeDefined();
        expect(templates.exports['data-types']).toBeDefined();
        expect(templates.exports.client).toBeDefined();
        expect(templates.exports.hooks).toBeDefined();
        expect(templates.exports.server).toBeDefined();
        expect(templates.exports.model).toBeDefined();
        expect(templates.exports.schema).toBeDefined();
    });
});
