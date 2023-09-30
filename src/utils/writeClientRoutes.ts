import { resolve } from 'path';

import { writeFile } from './fileSystem.js';
import { formatCode as f } from './formatCode.js';
import { formatIndentation as i } from './formatIndentation.js';
import { WriteClientPartContext } from './writeClientTypes';

/**
 * Generate Routes using the Handlebar template and write to disk.
 * @param {Object} args
 * @param {Object} args.client OpenApi client
 * @param {Object} args.templates The loaded handlebar templates
 * @param {string} args.outputPath Directory to write the generated files to
 * @param {string} args.indent Indentation options (4, 2 or tab)
 */
export const writeClientRoutes = async ({
    client,
    templates,
    outputPath,
    indent,
}: WriteClientPartContext): Promise<void> => {
    if (!client.services.length) {
        return;
    }
    const file = resolve(outputPath, `routes.ts`);
    const templateResult = templates.exports.routes({ services: client.services });
    await writeFile(file, i(f(templateResult), indent));
};
