import type { Service } from '../client/interfaces/Service';

import { relative, resolve } from 'path';

import { writeFile } from './fileSystem.js';
import { formatCode as f } from './formatCode.js';
import { formatIndentation as i } from './formatIndentation.js';
import { Operation } from '../client/interfaces/Operation';
import { EndpointConfig } from '../factories';
import { WriteClientPartContext } from './writeClientTypes';

type HttpMethods = EndpointConfig['method'][];

const makeOperationsGetter =
    (filterMethods?: HttpMethods) =>
    ({ operations }: Service): Operation[] => {
        if (!filterMethods) return operations;
        return operations.filter(operation => filterMethods.includes(operation.method as HttpMethods[number]));
    };

/**
 * Generate Hooks using the Handlebar template and write to disk.
 * @param {Object} args
 * @param {Object} args.client OpenApi client
 * @param {Object} args.templates The loaded handlebar templates
 * @param {string} args.outputPath Directory to write the generated files to
 * @param {string} args.absoluteFactoriesFile Directory to write the generated files to
 * @param {string} args.indent Indentation options (4, 2 or tab)
 * @param {boolean} args.allowImportingTsExtensions Generate .ts extentions on imports enstead .js
 */
export const writeClientHooks = async ({
    client,
    absoluteFactoriesFile,
    templates,
    outputPath,
    indent,
    allowImportingTsExtensions,
}: WriteClientPartContext): Promise<number> => {
    const getOperations = makeOperationsGetter(['GET']);
    const file = resolve(outputPath, `hooks.ts`);
    const allOperations = client.services.map(getOperations).flat();
    if (!allOperations.length) {
        return 0;
    }
    const templateResult = templates.exports.hooks({
        services: client.services.map(service => ({ ...service, operations: getOperations(service) })),
        factories: relative(outputPath, absoluteFactoriesFile),
        allowImportingTsExtensions,
    });
    await writeFile(file, i(f(templateResult), indent));
    return allOperations.length;
};
