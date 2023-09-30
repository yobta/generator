import { relative, resolve } from 'path';

import { writeFile } from './fileSystem.js';
import { formatCode as f } from './formatCode.js';
import { formatIndentation as i } from './formatIndentation.js';
import { WriteClientPartContext } from './writeClientTypes';

/**
 * Generate Client using the Handlebar template and write to disk.
 * @param {Object} args
 * @param {Object} args.client OpenApi client
 * @param {Object} args.templates The loaded handlebar templates
 * @param {string} args.outputPath Directory to write the generated files to
 * @param {string} args.absoluteFactoriesFile Directory to write the generated files to
 * @param {string} args.indent Indentation options (4, 2 or tab)
 * @param {boolean} args.allowImportingTsExtensions Generate .ts extentions on imports enstead .js
 */
export const writeClientClients = async ({
    client,
    absoluteFactoriesFile,
    templates,
    outputPath,
    indent,
    allowImportingTsExtensions,
}: WriteClientPartContext): Promise<void> => {
    if (!client.services.length) {
        return;
    }
    const file = resolve(outputPath, `client.ts`);
    const templateResult = templates.exports.client({
        services: client.services,
        factories: relative(outputPath, absoluteFactoriesFile),
        allowImportingTsExtensions,
    });
    await writeFile(file, i(f(templateResult), indent));
};
