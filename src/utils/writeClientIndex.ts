import { resolve } from 'path';

import { writeFile } from './fileSystem.js';
import { sortModelsByName } from './sortModelsByName.js';
import { sortServicesByName } from './sortServicesByName.js';
import { WriteClientPartContext } from './types.js';

/**
 * Generate the OpenAPI client index file using the Handlebar template and write it to disk.
 * The index file just contains all the exports you need to use the client as a standalone
 * library. But yuo can also import individual models and services directly.
 * @param {Object} args
 * @param {Object} args.client OpenApi client
 * @param {Object} args.templates The loaded handlebar templates
 * @param {string} args.outputPath Directory to write the generated files to
 * @param {boolean} args.useUnionTypes Use union types instead of enums
 * @param {boolean} args.exportServices Generate services
 * @param {boolean} args.exportSchemas Generate schemas
 * @param {string} args.postfixModels Model name postfix
 * @param {boolean} args.allowImportingTsExtensions Generate .ts extentions on imports enstead .js
 * @param {number} args.totalHooks How many hooks had already generated
 * @param {number} args.totalServer How many server resolvers had already generated
 */
export const writeClientIndex = async ({
    client,
    templates,
    outputPath,
    useUnionTypes,
    exportServices,
    exportSchemas,
    postfixModels,
    allowImportingTsExtensions,
    totalHooks,
    totalServer,
}: WriteClientPartContext & { totalHooks: number; totalServer: number }): Promise<void> => {
    const templateResult = templates.index({
        exportServices,
        exportSchemas,
        useUnionTypes,
        postfixModels,
        server: client.server,
        version: client.version,
        models: sortModelsByName(client.models),
        services: sortServicesByName(client.services),
        allowImportingTsExtensions,
        totalHooks,
        totalServer,
    });

    await writeFile(resolve(outputPath, 'index.ts'), templateResult);
};
