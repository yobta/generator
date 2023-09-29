import type { Model } from '../client/interfaces/Model';
import type { Indent } from '../Indent';
import type { Templates } from './registerHandlebarTemplates';

import { resolve } from 'path';

import { rmdir, writeFile } from './fileSystem.js';
import { formatCode as f } from './formatCode.js';
import { formatIndentation as i } from './formatIndentation.js';

/**
 * Generate Models using the Handlebar template and write to disk.
 * @param models Array of Models to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param useUnionTypes Use union types instead of enums
 * @param indent Indentation options (4, 2 or tab)
 * @param allowImportingTsExtensions Generate .ts extentions on imports enstead .js
 */
export const writeClientModels = async (
    models: Model[],
    templates: Templates,
    outputPath: string,
    useUnionTypes: boolean,
    indent: Indent,
    allowImportingTsExtensions: boolean
): Promise<void> => {
    if (!models.length) {
        await rmdir(outputPath);
        return;
    }
    for (const model of models) {
        const file = resolve(outputPath, `${model.name}.ts`);
        const templateResult = templates.exports.model({
            ...model,
            useUnionTypes,
            allowImportingTsExtensions,
        });
        await writeFile(file, i(f(templateResult), indent));
    }
};
