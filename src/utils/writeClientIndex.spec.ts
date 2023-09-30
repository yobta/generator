import type { Client } from '../client/interfaces/Client';

import { Indent } from '../Indent';
import { templates } from './__mocks__/templates';
import { writeFile } from './fileSystem';
import { writeClientIndex } from './writeClientIndex';

jest.mock('./fileSystem');

describe('writeClientIndex', () => {
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

        await writeClientIndex({
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
            totalHooks: 1,
            totalServer: 1,
        });

        expect(writeFile).toBeCalledWith('/index.ts', 'index');
    });
});
