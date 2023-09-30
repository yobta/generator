import type { Client } from '../client/interfaces/Client';

import { EOL } from 'os';

import { templates } from './__mocks__/templates';
import { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import { writeClientClients } from './writeClientClients';

jest.mock('./fileSystem');

describe('writeClientClients', () => {
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

        await writeClientClients({
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

        expect(writeFile).toBeCalledWith('/client.ts', `client${EOL}`);
    });
});
