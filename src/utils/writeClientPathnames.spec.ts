import type { Service } from '../client/interfaces/Service';
import type { Templates } from './registerHandlebarTemplates';

import { EOL } from 'os';

import { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import { writeClientPathnames } from './writeClientPathnames';

jest.mock('./fileSystem');

describe('writeClientPathnames', () => {
    it('should write to filesystem', async () => {
        const services: Service[] = [
            {
                name: 'User',
                operations: [],
                imports: [],
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

        await writeClientPathnames(services, templates, '/', Indent.SPACE_4);

        expect(writeFile).toBeCalledWith('/User.ts', `pathname${EOL}`);
        expect(writeFile).toBeCalledWith('/index.ts', `pathnameIndex${EOL}`);
    });
});
