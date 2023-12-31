import { readFileSync } from 'fs';
import { sync } from 'glob';

import { generate } from '../src/generator.js';

describe('v2', () => {
    it('should generate', async () => {
        await generate({
            input: './test/spec/v2.json',
            output: './test/generated/v2/',
            factories: 'factories-module',
            useUnionTypes: false,
            exportSchemas: true,
            exportServices: true,
        });

        sync('./test/generated/v2/**/*.ts').forEach(file => {
            const content = readFileSync(file, 'utf8').toString();
            expect(content).toMatchSnapshot(file);
        });
    });
});

describe('v3', () => {
    it('should generate', async () => {
        await generate({
            input: './test/spec/v3.json',
            output: './test/generated/v3/',
            factories: 'factories-module',
            useUnionTypes: false,
            exportSchemas: true,
            exportServices: true,
        });

        sync('./test/generated/v3/**/*.ts')
            .slice(0, 1)
            .forEach(file => {
                const content = readFileSync(file, 'utf8').toString();
                expect(content).toMatchSnapshot(file);
            });
    });
});
