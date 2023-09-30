import { resolve } from 'path';

import { writeFile } from './fileSystem.js';
import { formatCode as f } from './formatCode.js';
import { formatIndentation as i } from './formatIndentation.js';
import { WriteClientPartContext } from './types.js';

/**
 * Generate Schemas using the Handlebar template and write to disk.
 * @param {Object} args
 * @param {Object} args.client OpenApi client
 * @param {Object} args.templates The loaded handlebar templates
 * @param {string} args.outputPath Directory to write the generated files to
 * @param {boolean} args.useUnionTypes Use union types instead of enums
 * @param {string} args.indent Indentation options (4, 2 or tab)
 */
export const writeClientSchemas = async ({
    client,
    templates,
    outputPath,
    useUnionTypes,
    indent,
}: WriteClientPartContext): Promise<void> => {
    for (const model of client.models) {
        const file = resolve(outputPath, `$${model.name}.ts`);
        const templateResult = templates.exports.schema({
            ...model,
            useUnionTypes,
        });
        await writeFile(file, i(f(templateResult), indent));
    }
};
