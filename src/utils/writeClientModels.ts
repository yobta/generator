import { resolve } from 'path';

import { rmdir, writeFile } from './fileSystem.js';
import { formatCode as f } from './formatCode.js';
import { formatIndentation as i } from './formatIndentation.js';
import { WriteClientPartContext } from './types.js';

/**
 * Generate Models using the Handlebar template and write to disk.
 * @param {Object} args
 * @param {Object} args.client OpenApi client
 * @param {Object} args.templates The loaded handlebar templates
 * @param {string} args.outputPath Directory to write the generated files to
 * @param {boolean} args.useUnionTypes Use union types instead of enums
 * @param {boolean} args.allowImportingTsExtensions Generate .ts extentions on imports enstead .js
 * @param {string} args.indent Indentation options (4, 2 or tab)
 */
export const writeClientModels = async ({
    client,
    templates,
    outputPath,
    useUnionTypes,
    indent,
    allowImportingTsExtensions,
}: WriteClientPartContext): Promise<void> => {
    if (!client.models.length) {
        await rmdir(outputPath);
        return;
    }
    for (const model of client.models) {
        const file = resolve(outputPath, `${model.name}.ts`);
        const templateResult = templates.exports.model({
            ...model,
            useUnionTypes,
            allowImportingTsExtensions,
        });
        await writeFile(file, i(f(templateResult), indent));
    }
};
