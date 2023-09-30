import { EOL } from 'os';

import { templates } from './__mocks__/templates';
import { writeFile } from './fileSystem';
import { writeClientDataTypes } from './writeClientDataTypes';
import { Indent } from '../Indent';
import { Service } from '../client/interfaces/Service';

jest.mock('./fileSystem');

describe('writeClientFactories', () => {
    it('should write to filesystem', async () => {
        const services: Service[] = [
            {
                name: 'User',
                operations: [],
                imports: [],
            },
        ];
        await writeClientDataTypes(services, templates, '/', Indent.SPACE_4, false);

        expect(writeFile).toBeCalledWith('/data-types.ts', `dataTypes${EOL}`);
    });
});
