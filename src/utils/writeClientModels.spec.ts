import type { Client } from '../client/interfaces/Client';

import { EOL } from 'os';

import { templates } from './__mocks__/templates';
import { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import { writeClientModels } from './writeClientModels';

jest.mock('./fileSystem');

describe('writeClientModels', () => {
    it('should write to filesystem', async () => {
        const client: Client = {
            server: 'http://localhost:8080',
            version: 'v1',
            models: [
                {
                    export: 'interface',
                    name: 'User',
                    type: 'User',
                    base: 'User',
                    template: null,
                    link: null,
                    description: null,
                    isDefinition: true,
                    isReadOnly: false,
                    isRequired: false,
                    isNullable: false,
                    imports: [],
                    enum: [],
                    enums: [],
                    properties: [],
                },
            ],
            services: [
                {
                    name: 'User',
                    operations: [],
                    imports: [],
                },
            ],
        };

        await writeClientModels({
            client,
            absoluteFactoriesFile: './factories.ts',
            templates,
            outputPath: '/',
            indent: Indent.SPACE_4,
            allowImportingTsExtensions: false,
            useUnionTypes: false,
            exportSchemas: false,
            exportServices: true,
            postfixModels: '',
        });

        expect(writeFile).toBeCalledWith('/User.ts', `model${EOL}`);
        expect(writeFile).toBeCalledWith('/index.ts', `modelIndex${EOL}`);
    });
});
