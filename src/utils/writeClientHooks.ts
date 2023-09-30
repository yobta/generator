import type { Service } from '../client/interfaces/Service';
import type { Indent } from '../Indent';
import type { Templates } from './registerHandlebarTemplates';

import { relative, resolve } from 'path';

import { writeFile } from './fileSystem.js';
import { formatCode as f } from './formatCode.js';
import { formatIndentation as i } from './formatIndentation.js';
import { Operation } from '../client/interfaces/Operation';
import { EndpointConfig } from '../factories';

/**
 * Generate Services using the Handlebar template and write to disk.
 * @param services Array of Services to write
 * @param factories Absolute path to factories file
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param indent Indentation options (4, 2 or tab)
 * @param allowImportingTsExtensions Generate .ts extentions on imports enstead .js
 */

type HttpMethods = EndpointConfig['method'][];

const makeOperationsGetter =
    (filterMethods?: HttpMethods) =>
    ({ operations }: Service): Operation[] => {
        if (!filterMethods) return operations;
        return operations.filter(operation => filterMethods.includes(operation.method as HttpMethods[number]));
    };

export const writeClientHooks = async (
    services: Service[],
    factories: string,
    templates: Templates,
    outputPath: string,
    indent: Indent,
    allowImportingTsExtensions: boolean
): Promise<number> => {
    const getOperations = makeOperationsGetter(['GET']);
    const file = resolve(outputPath, `hooks.ts`);
    const allOperations = services.map(getOperations).flat();
    if (!allOperations.length) {
        return 0;
    }
    const templateResult = templates.exports.hooks({
        services: services.map(service => ({ ...service, operations: getOperations(service) })),
        factories: relative(outputPath, factories),
        allowImportingTsExtensions,
    });
    await writeFile(file, i(f(templateResult), indent));
    return allOperations.length;
};
