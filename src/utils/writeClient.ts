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
 * @param {Object} args
 * @param args.client Client object with all the models, services, etc.
 * @param args.templates Templates wrapper with all loaded Handlebars templates
 * @param args.output The relative location of the output directory
 * @param args.factories The relative location of the factories file
 * @param args.useUnionTypes Use union types instead of enums
 * @param args.exportServices Generate services
 * @param args.exportSchemas Generate schemas
 * @param args.indent Indentation options (4, 2 or tab)
 * @param args.postfixModels Model name postfix
 * @param args.allowImportingTsExtensions Generate .ts extentions on imports enstead .js
 * @param {string[]} args.allowedQueryHooksMethods Http methods for which hooks will be generated
 * @param {string[]} args.allowedMutationHooksMethods Http methods for which mutation hooks will be generated
 * @param {string[]} args.allowedServerMethods Http methods for which server resolvers will be generated
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
    let totalServer = 0;
    if (exportServices) {
        totalServer = await writeClientServers(partContext);
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
    await writeClientIndex({ ...partContext, totalHooks, totalServer });
};
