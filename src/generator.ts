import { Indent } from './Indent.js';
import { parse as parseV2 } from './openApi/v2/index.js';
import { OpenApi as OpenApiV2 } from './openApi/v2/interfaces/OpenApi.js';
import { OpenApi as OpenApiV3 } from './openApi/v3/interfaces/OpenApi.js';
import { parse as parseV3 } from './openApi/v3/index.js';
import { getOpenApiSpec } from './utils/getOpenApiSpec.js';
import { getOpenApiVersion, OpenApiVersion } from './utils/getOpenApiVersion.js';
import { isString } from './utils/isString.js';
import { postProcessClient } from './utils/postProcessClient.js';
import { registerHandlebarTemplates } from './utils/registerHandlebarTemplates.js';
import { writeClient } from './utils/writeClient.js';
import { AnyOpenApi } from './openApi/index.js';
import { createRequestParams } from './utils/createRequestParams.js';
import { HttpMethods, WriteClientArgs } from './utils/types.js';

export type Options = {
    input: string | AnyOpenApi;
    output?: string;
    factories: string;
    useUnionTypes?: boolean;
    exportServices?: boolean;
    exportSchemas?: boolean;
    indent?: Indent;
    postfixModels?: string;
    allowImportingTsExtensions?: boolean;
    write?: boolean;
    allowedQueryHooksMethods?: string;
    allowedMutationHooksMethods?: string;
    allowedServerMethods?: string;
};

/**
 * Generate the OpenAPI client. This method will read the OpenAPI specification and based on the
 * given language it will generate the client, including the typed models, validation schemas,
 * service layer, etc.
 * @param input The relative location of the OpenAPI spec
 * @param output The relative location of the output directory
 * @param factories The relative location of the the fifle with factories (createServerResolver, createClientResolver, createHook)
 * @param useUnionTypes Use union types instead of enums
 * @param exportServices Generate services
 * @param exportSchemas Generate schemas
 * @param indent Indentation options (4, 2 or tab)
 * @param postfixModels Model name postfix
 * @param allowImportingTsExtensions (Generate .ts extentions on imports enstead .js)
 * @param write Write the files to disk (true or false)
 * @param allowedQueryHooksMethods Http methods for which hooks will be generated, default GET
 * @param allowedMutationHooksMethods Http methods for which mutations hooks will be generated, default POST
 * @param allowedServerMethods Http methods for which server resolvers will be generated, default GET
 */
export const generate = async ({
    input,
    output = 'generated/open-api',
    factories: factoriesRaw,
    useUnionTypes = true,
    exportServices = true,
    exportSchemas = false,
    indent = Indent.SPACE_4,
    postfixModels = '',
    allowImportingTsExtensions = false,
    write = true,
    allowedQueryHooksMethods,
    allowedMutationHooksMethods,
    allowedServerMethods,
}: Options): Promise<void> => {
    if (!factoriesRaw) {
        throw new Error(`Argument 'factories' is require`);
    }

    const extention = allowImportingTsExtensions ? '.ts' : '';
    const factories = factoriesRaw.replace(/\.(ts|js)$/, '') + extention;

    const openApi = isString(input) ? await getOpenApiSpec(input) : input;
    const openApiVersion = getOpenApiVersion(openApi);
    const templates = registerHandlebarTemplates({
        useUnionTypes,
    });

    const args: Omit<WriteClientArgs, 'client'> = {
        templates,
        output,
        factories,
        useUnionTypes,
        exportServices,
        exportSchemas,
        indent,
        postfixModels,
        allowImportingTsExtensions,
        allowedQueryHooksMethods: allowedQueryHooksMethods?.split(',') as HttpMethods,
        allowedMutationHooksMethods: allowedMutationHooksMethods?.split(',') as HttpMethods,
        allowedServerMethods: allowedServerMethods?.split(',') as HttpMethods,
    };

    switch (openApiVersion) {
        case OpenApiVersion.V2: {
            const client = parseV2(openApi as OpenApiV2);
            const clientFinal = postProcessClient(client);
            if (!write) break;
            await writeClient({ ...args, client: clientFinal });
            break;
        }

        case OpenApiVersion.V3: {
            const client = parseV3(openApi as OpenApiV3);
            const clientFinal = postProcessClient(client);
            if (!write) break;
            await writeClient({ ...args, client: clientFinal });
            break;
        }
    }
};

export default {
    Indent,
    generate,
    createRequestParams,
};
