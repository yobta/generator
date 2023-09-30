import type { Client } from '../client/interfaces/Client';

import { EOL } from 'os';

import { templates } from './__mocks__/templates';
import { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import { writeClientSchemas } from './writeClientSchemas';

jest.mock('./fileSystem');

describe('writeClientSchemas', () => {
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

        await writeClientSchemas({
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

        expect(writeFile).toBeCalledWith('/$User.ts', `schema${EOL}`);
        expect(writeFile).toBeCalledWith('/index.ts', `schemaIndex${EOL}`);
    });
});
