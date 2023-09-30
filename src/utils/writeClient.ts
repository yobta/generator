import type { Client } from '../client/interfaces/Client';
import type { Indent } from '../Indent';
import type { Templates } from './registerHandlebarTemplates.js';

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
export const writeClient = async (
    client: Client,
    templates: Templates,
    output: string,
    factories: string,
    useUnionTypes: boolean,
    exportServices: boolean,
    exportSchemas: boolean,
    indent: Indent,
    postfixModels: string,
    allowImportingTsExtensions: boolean
): Promise<void> => {
    const outputPath = resolve(process.cwd(), output);
    const outputPathServer = resolve(outputPath, 'server');
    const outputPathModels = resolve(outputPath, 'models');
    const outputPathSchemas = resolve(outputPath, 'schemas');
    const absoluteFactoriesFile = resolve(process.cwd(), factories);

    if (!isSubDirectory(process.cwd(), output)) {
        throw new Error(`Output folder is not a subdirectory of the current working directory`);
    }

    await rmdir(outputPath);
    await mkdir(outputPath);

    await writeClientDataTypes(client.services, templates, outputPath, indent, allowImportingTsExtensions);

    await writeClientRoutes(client.services, templates, outputPath, indent);

    let totalHooks = 0;
    if (exportServices) {
        await rmdir(outputPathServer);
        await mkdir(outputPathServer);
        await writeClientServers(
            client.services,
            absoluteFactoriesFile,
            templates,
            outputPathServer,
            indent,
            allowImportingTsExtensions
        );

        await writeClientClients(
            client.services,
            absoluteFactoriesFile,
            templates,
            outputPath,
            indent,
            allowImportingTsExtensions
        );

        totalHooks = await writeClientHooks(
            client.services,
            absoluteFactoriesFile,
            templates,
            outputPath,
            indent,
            allowImportingTsExtensions
        );
    }

    if (exportSchemas) {
        await rmdir(outputPathSchemas);
        await mkdir(outputPathSchemas);
        await writeClientSchemas(client.models, templates, outputPathSchemas, useUnionTypes, indent);
    }

    await rmdir(outputPathModels);
    await mkdir(outputPathModels);
    await writeClientModels(
        client.models,
        templates,
        outputPathModels,
        useUnionTypes,
        indent,
        allowImportingTsExtensions
    );

    await mkdir(outputPath);
    await writeClientIndex(
        client,
        templates,
        outputPath,
        useUnionTypes,
        exportServices,
        exportSchemas,
        postfixModels,
        allowImportingTsExtensions,
        totalHooks
    );
};
