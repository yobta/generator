import type { WriteClientArgs, WriteClientPartContext } from './types.js';

import { resolve } from 'path';

import { mkdir, rmdir } from './fileSystem.js';
import { isSubDirectory } from './isSubdirectory.js';
import { writeClientIndex } from './writeClientIndex.js';
import { writeClientModels } from './writeClientModels.js';
import { writeClientSchemas } from './writeClientSchemas.js';
import { writeClientRoutes } from './writeClientRoutes.js';
import { writeClientDataTypes } from './writeClientDataTypes.js';
import { writeClientServers } from './writeClientServers.js';
import { writeClientClients } from './writeClientClients.js';
import { writeClientHooks } from './writeClientHooks.js';

/**
 * Write our OpenAPI client, using the given templates at the given output
 * @param client Client object with all the models, services, etc.
 * @param templates Templates wrapper with all loaded Handlebars templates
 * @param output The relative location of the output directory
 * @param factories The relative location of the factories file
 * @param useUnionTypes Use union types instead of enums
 * @param exportServices Generate services
 * @param exportSchemas Generate schemas
 * @param indent Indentation options (4, 2 or tab)
 * @param postfixModels Model name postfix
 * @param allowImportingTsExtensions Generate .ts extentions on imports enstead .js
 */
export const writeClient = async (args: WriteClientArgs): Promise<void> => {
    const { client, exportServices, exportSchemas, output, factories } = args;
    const outputPath = resolve(process.cwd(), output);
    const outputPathModels = resolve(outputPath, 'models');
    const outputPathSchemas = resolve(outputPath, 'schemas');

    if (!isSubDirectory(process.cwd(), output)) {
        throw new Error(`Output folder is not a subdirectory of the current working directory`);
    }

    const partContext: WriteClientPartContext = {
        ...args,
        outputPath,
        absoluteFactoriesFile: resolve(process.cwd(), factories),
    };

    await rmdir(outputPath);
    await mkdir(outputPath);

    await writeClientDataTypes(partContext);
    await writeClientRoutes(partContext);

    let totalHooks = 0;
    if (exportServices) {
        await writeClientServers(partContext);
        await writeClientClients(partContext);
        totalHooks = await writeClientHooks(partContext);
    }

    await rmdir(outputPathSchemas);
    if (exportSchemas && client.models.length) {
        await mkdir(outputPathSchemas);
        await writeClientSchemas({ ...partContext, outputPath: outputPathSchemas });
    }

    await rmdir(outputPathModels);
    if (client.models.length) {
        await mkdir(outputPathModels);
        await writeClientModels({ ...partContext, outputPath: outputPathModels });
    }

    await mkdir(outputPath);
    await writeClientIndex({ ...partContext, totalHooks });
};
