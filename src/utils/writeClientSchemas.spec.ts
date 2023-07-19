import type { Model } from '../client/interfaces/Model';
import type { Templates } from './registerHandlebarTemplates';

import { EOL } from 'os';

import { HttpClient } from '../HttpClient';
import { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import { writeClientSchemas } from './writeClientSchemas';

jest.mock('./fileSystem');

describe('writeClientSchemas', () => {
    it('should write to filesystem', async () => {
        const models: Model[] = [
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
        ];

        const templates: Templates = {
            index: () => 'index',
            client: () => 'client',
            exports: {
                pathnames: {
                    pathname: () => 'pathname',
                    index: () => 'pathnameIndex',
                },
                factories: {
                    serverResolver: () => 'serverResolver',
                    clientResolver: () => 'clientResolver',
                    hook: () => 'hook',
                    index: () => 'factoriesIndex',
                },
                model: () => 'model',
                schema: () => 'schema',
                service: () => 'service',
            },
            core: {
                settings: () => 'settings',
                apiError: () => 'apiError',
                apiRequestOptions: () => 'apiRequestOptions',
                apiResult: () => 'apiResult',
                cancelablePromise: () => 'cancelablePromise',
                baseHttpRequest: () => 'baseHttpRequest',
                httpRequest: () => 'httpRequest',
            },
        };

        await writeClientSchemas(models, templates, '/', HttpClient.FETCH, false, Indent.SPACE_4);

        expect(writeFile).toBeCalledWith('/$User.ts', `schema${EOL}`);
    });
});
