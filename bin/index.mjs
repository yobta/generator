#!/usr/bin/env node

'use strict';

import { program } from 'commander';

import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const params = program
    .name('generate-yobta')
    .usage('[options]')
    .version(pkg.version)
    .requiredOption('-i, --input <value>', 'OpenAPI specification, can be a path, url or string content (required)')
    .requiredOption('-f, --factories <value>', 'Path to file with factory functions (required)')
    .option('-o, --output <value>', 'Output directory (default ./generated/open-api)')
    .option('--useUnionTypes <value>', 'Use union types instead of enums', true)
    .option('--exportServices <value>', 'Write services to disk', true)
    .option('--exportSchemas', 'Write schemas to disk', false)
    .option('--indent <value>', 'Indentation options [4, 2, tabs]', '4')
    .option('--postfixModels <value>', 'Model name postfix')
    .option('--allowImportingTsExtensions', 'Generate .ts extentions on imports enstead .js', false)
    .option(
        '--allowedQueryHooksMethods <value>',
        'Http methods for which hooks will be generated (example: GET,HEAD), default GET'
    )
    .option(
        '--allowedMutationHooksMethods <value>',
        `Http methods for which mutation hooks will be generated (example: POST,PUT), default POST, souldn't intersect with allowedQueryHooksMethods`
    )
    .option(
        '--allowedServerMethods <value>',
        'Http methods for which server resolvers will be generated (example: GET,HEAD), default GET'
    )
    .parse(process.argv)
    .opts();

const OpenAPI = await import('../dist/generator.js');

if (OpenAPI) {
    OpenAPI.generate({
        input: params.input,
        output: params.output,
        factories: params.factories,
        useUnionTypes: JSON.parse(params.useUnionTypes) !== false,
        exportServices: JSON.parse(params.exportServices) === true,
        exportSchemas: JSON.parse(params.exportSchemas) === true,
        indent: params.indent,
        postfixModels: params.postfixModels,
        allowImportingTsExtensions: params.allowImportingTsExtensions,
        allowedQueryHooksMethods: params.allowedQueryHooksMethods,
        allowedMutationHooksMethods: params.allowedMutationHooksMethods,
        allowedServerMethods: params.allowedServerMethods,
    })
        .then(() => {
            process.exit(0);
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}
