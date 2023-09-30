import type { Client } from '../client/interfaces/Client';

import { templates } from './__mocks__/templates';
import { Indent } from '../Indent';
import { mkdir, rmdir, writeFile } from './fileSystem';
import { writeClient } from './writeClient';

jest.mock('./fileSystem');

describe('writeClient', () => {
    it('should write to filesystem', async () => {
        const client: Client = {
            server: 'http://localhost:8080',
            version: 'v1',
            models: [],
            services: [],
        };

        await writeClient({
            client,
            templates,
            output: './dist',
            factories: './factories.ts',
            useUnionTypes: false,
            exportServices: true,
            exportSchemas: true,
            indent: Indent.SPACE_4,
            postfixModels: 'Model',
            allowImportingTsExtensions: false,
        });

        expect(rmdir).toBeCalled();
        expect(mkdir).toBeCalled();
        expect(writeFile).toBeCalled();
    });
});
