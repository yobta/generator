import type { Service } from '../client/interfaces/Service';
import type { Indent } from '../Indent';
import type { Templates } from './registerHandlebarTemplates';

import { relative, resolve } from 'path';

import { writeFile } from './fileSystem.js';
import { formatCode as f } from './formatCode.js';
import { formatIndentation as i } from './formatIndentation.js';

/**
 * Generate Services using the Handlebar template and write to disk.
 * @param services Array of Services to write
 * @param factories Absolute path to factories file
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param indent Indentation options (4, 2 or tab)
 * @param allowImportingTsExtensions Generate .ts extentions on imports enstead .js
 */
export const writeClientServers = async (
    services: Service[],
    factories: string,
    templates: Templates,
    outputPath: string,
    indent: Indent,
    allowImportingTsExtensions: boolean
): Promise<void> => {
    if (!services.length) {
        return;
    }
    const file = resolve(outputPath, `server.ts`);
    const templateResult = templates.exports.server({
        services,
        factories: relative(outputPath, factories),
        allowImportingTsExtensions,
    });
    await writeFile(file, i(f(templateResult), indent));
};
