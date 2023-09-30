import type { Client } from '../client/interfaces/Client';
import type { Indent } from '../Indent';
import type { Templates } from './registerHandlebarTemplates.js';

export type WriteClientArgs = {
    client: Client;
    templates: Templates;
    output: string;
    factories: string;
    useUnionTypes: boolean;
    exportServices: boolean;
    exportSchemas: boolean;
    indent: Indent;
    postfixModels: string;
    allowImportingTsExtensions: boolean;
};

export type WriteClientPartContext = Omit<WriteClientArgs, 'output' | 'factories'> & {
    outputPath: string;
    absoluteFactoriesFile: string;
};
