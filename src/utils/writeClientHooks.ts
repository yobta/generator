import type { WriteClientPartContext } from './types.js';

import { relative, resolve } from 'path';

import { writeFile } from './fileSystem.js';
import { formatCode as f } from './formatCode.js';
import { formatIndentation as i } from './formatIndentation.js';
import { makeOperationsGetter } from './makeOpertaionsGetter.js';
import { intersection } from './intersection.js';

/**
 * Generate Hooks using the Handlebar template and write to disk.
 * @param {Object} args
 * @param {Object} args.client OpenApi client
 * @param {Object} args.templates The loaded handlebar templates
 * @param {string} args.outputPath Directory to write the generated files to
 * @param {string} args.absoluteFactoriesFile Directory to write the generated files to
 * @param {string} args.indent Indentation options (4, 2 or tab)
 * @param {boolean} args.allowImportingTsExtensions Generate .ts extentions on imports enstead .js
 * @param {string[]} args.allowedQueryHooksMethods Http methods for which hooks will be generated
 * @param {string[]} args.allowedMutationHooksMethods Http methods for which mutation hooks will be generated
 */
export const writeClientHooks = async ({
    client,
    absoluteFactoriesFile,
    templates,
    outputPath,
    indent,
    allowImportingTsExtensions,
    allowedQueryHooksMethods = ['GET'],
    allowedMutationHooksMethods = ['POST', 'PUT', 'PATCH', 'DELETE'],
}: WriteClientPartContext): Promise<number> => {
    const intersectedMethods = intersection(allowedQueryHooksMethods, allowedMutationHooksMethods);
    if (intersectedMethods.length) {
        throw new Error(`Intersection of allowedQueryHooksMethods and allowedMutationHooksMethods isn't allowed`);
    }
    const getOperationsQuery = makeOperationsGetter({ methods: allowedQueryHooksMethods, query: true });
    const getOperationsMutation = makeOperationsGetter({ methods: allowedMutationHooksMethods, mutation: true });
    const file = resolve(outputPath, `hooks.ts`);
    const queryOperations = client.services.map(getOperationsQuery).flat();
    const mutationOperations = client.services.map(getOperationsMutation).flat();
    const allOperations = [...queryOperations, ...mutationOperations];
    if (!allOperations.length) {
        return 0;
    }
    const templateResult = templates.exports.hooks({
        services: client.services.map(service => ({
            ...service,
            operations: [...getOperationsQuery(service), ...getOperationsMutation(service)],
        })),
        factories: relative(outputPath, absoluteFactoriesFile),
        allowImportingTsExtensions,
    });
    await writeFile(file, i(f(templateResult), indent));
    return allOperations.length;
};
