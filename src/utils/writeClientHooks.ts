import type { WriteClientPartContext } from './types.js';

import { relative, resolve } from 'path';

import { writeFile } from './fileSystem.js';
import { formatCode as f } from './formatCode.js';
import { formatIndentation as i } from './formatIndentation.js';
import { makeOperationsGetter } from './makeOpertaionsGetter.js';

/**
 * Generate Hooks using the Handlebar template and write to disk.
 * @param {Object} args
 * @param {Object} args.client OpenApi client
 * @param {Object} args.templates The loaded handlebar templates
 * @param {string} args.outputPath Directory to write the generated files to
 * @param {string} args.absoluteFactoriesFile Directory to write the generated files to
 * @param {string} args.indent Indentation options (4, 2 or tab)
 * @param {boolean} args.allowImportingTsExtensions Generate .ts extentions on imports enstead .js
 * @param {string[]} args.allowedHooksMethods Http methods for which hooks will be generated
 */
export const writeClientHooks = async ({
    client,
    absoluteFactoriesFile,
    templates,
    outputPath,
    indent,
    allowImportingTsExtensions,
    allowedHooksMethods = ['GET'],
}: WriteClientPartContext): Promise<number> => {
    const getOperations = makeOperationsGetter(allowedHooksMethods);
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
