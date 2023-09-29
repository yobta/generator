import type { Service } from '../client/interfaces/Service';

import { EOL } from 'os';

import { templates } from './__mocks__/templates';
import { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import { writeClientRoutes } from './writeClientRoutes';

jest.mock('./fileSystem');

describe('writeClientRoutes', () => {
    it('should write to filesystem', async () => {
        const services: Service[] = [
            {
                name: 'User',
                operations: [],
                imports: [],
            },
        ];

        await writeClientRoutes(services, templates, '/', Indent.SPACE_4, false);

        expect(writeFile).toBeCalledWith('/User.ts', `route${EOL}`);
        expect(writeFile).toBeCalledWith('/index.ts', `routesIndex${EOL}`);
    });
});
