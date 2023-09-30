import type { Indent } from '../Indent';
import type { Templates } from './registerHandlebarTemplates';

import { resolve } from 'path';

import { writeFile } from './fileSystem.js';
import { formatCode as f } from './formatCode.js';
import { formatIndentation as i } from './formatIndentation.js';
import { Service } from '../client/interfaces/Service.js';

/**
 * Generate Services using the Handlebar template and write to disk.
 * @param services Array of Services to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param indent Indentation options (4, 2 or tab)
 * @param allowImportingTsExtensions Generate .ts extentions on imports enstead .js
 */
export const writeClientDataTypes = async (
    services: Service[],
    templates: Templates,
    outputPath: string,
    indent: Indent,
    allowImportingTsExtensions: boolean
): Promise<void> => {
    if (!services.length) {
        return;
    }
    const fileServer = resolve(outputPath, `data-types.ts`);
    const templateResult = templates.exports['data-types']({ services, allowImportingTsExtensions });
    await writeFile(fileServer, i(f(templateResult), indent));
};
