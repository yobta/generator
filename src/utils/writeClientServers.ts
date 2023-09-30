import type { WriteClientPartContext } from './types.js';

import { relative, resolve } from 'path';

import { writeFile } from './fileSystem.js';
import { formatCode as f } from './formatCode.js';
import { formatIndentation as i } from './formatIndentation.js';
import { makeOperationsGetter } from './makeOpertaionsGetter.js';

/**
 * Generate Server using the Handlebar template and write to disk.
 * @param {Object} args
 * @param {Object} args.client OpenApi client
 * @param {Object} args.templates The loaded handlebar templates
 * @param {string} args.outputPath Directory to write the generated files to
 * @param {string} args.absoluteFactoriesFile Directory to write the generated files to
 * @param {string} args.indent Indentation options (4, 2 or tab)
 * @param {boolean} args.allowImportingTsExtensions Generate .ts extentions on imports enstead .js
 * @param {string[]} args.allowedServerMethods Http methods for which server resolvers will be generated
 */
export const writeClientServers = async ({
    client,
    absoluteFactoriesFile,
    templates,
    outputPath,
    indent,
    allowImportingTsExtensions,
    allowedServerMethods = ['GET'],
}: WriteClientPartContext): Promise<void> => {
    const getOperations = makeOperationsGetter(allowedServerMethods);
    const file = resolve(outputPath, `server.ts`);
    const allOperations = client.services.map(getOperations).flat();
    if (!allOperations.length) {
        return;
    }
    const templateResult = templates.exports.server({
        services: client.services.map(service => ({ ...service, operations: getOperations(service) })),
        factories: relative(outputPath, absoluteFactoriesFile),
        allowImportingTsExtensions,
    });
    await writeFile(file, i(f(templateResult), indent));
};
