import type { Client } from '../client/interfaces/Client';
import type { Indent } from '../Indent';
import type { Templates } from './registerHandlebarTemplates.js';
import type { EndpointConfig } from '../factories/commons';

export type HttpMethods = EndpointConfig['method'][];

export interface Dictionary<T = unknown> {
    [key: string]: T;
}

export type WriteClientArgs = {
    client: Client;
    templates: Templates;
    output: string;
    factories: string;
    useUnionTypes?: boolean;
    exportServices?: boolean;
    exportSchemas?: boolean;
    indent: Indent;
    postfixModels?: string;
    allowImportingTsExtensions?: boolean;
    allowedQueryHooksMethods?: HttpMethods;
    allowedMutationHooksMethods?: HttpMethods;
    allowedServerMethods?: HttpMethods;
};

export type WriteClientPartContext = Omit<WriteClientArgs, 'output' | 'factories'> & {
    outputPath: string;
    absoluteFactoriesFile: string;
};
