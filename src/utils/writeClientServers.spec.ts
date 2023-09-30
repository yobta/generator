import type { Client } from '../client/interfaces/Client';

import { EOL } from 'os';

import { templates } from './__mocks__/templates';
import { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import { writeClientServers } from './writeClientServers';

jest.mock('./fileSystem');

describe('writeClientServers', () => {
    it('should write to filesystem', async () => {
        const client: Client = {
            server: 'http://localhost:8080',
            version: 'v1',
            models: [],
            services: [
                {
                    name: 'User',
                    operations: [
                        {
                            service: 'service',
                            name: 'name',
                            summary: 'summary',
                            description: 'description',
                            deprecated: false,
                            method: 'GET',
                            path: 'path',
                            errors: [],
                            results: [],
                            responseHeader: 'responseHeader',
                            imports: [],
                            parameters: [],
                            parametersPath: [],
                            parametersQuery: [],
                            parametersForm: [],
                            parametersCookie: [],
                            parametersHeader: [],
                            parametersBody: null,
                        },
                    ],
                    imports: [],
                },
            ],
        };

        await writeClientServers({
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

        expect(writeFile).toBeCalledWith('/server.ts', `server${EOL}`);
    });
});
