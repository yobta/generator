import type { Client } from '../client/interfaces/Client';

import { EOL } from 'os';

import { templates } from './__mocks__/templates';
import { writeFile } from './fileSystem';
import { writeClientDataTypes } from './writeClientDataTypes';
import { Indent } from '../Indent';

jest.mock('./fileSystem');

describe('writeClientFactories', () => {
    it('should write to filesystem', async () => {
        const client: Client = {
            server: 'http://localhost:8080',
            version: 'v1',
            models: [],
            services: [
                {
                    name: 'User',
                    operations: [],
                    imports: [],
                },
            ],
        };
        await writeClientDataTypes({
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

        expect(writeFile).toBeCalledWith('/data-types.ts', `dataTypes${EOL}`);
    });
});
