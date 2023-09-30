import type { Service } from '../client/interfaces/Service';
import type { Indent } from '../Indent';
import type { Templates } from './registerHandlebarTemplates';

import { resolve } from 'path';

import { writeFile } from './fileSystem.js';
import { formatCode as f } from './formatCode.js';
import { formatIndentation as i } from './formatIndentation.js';

/**
 * Generate Services using the Handlebar template and write to disk.
 * @param services Array of Services to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param indent Indentation options (4, 2 or tab)
 */
export const writeClientRoutes = async (
    services: Service[],
    templates: Templates,
    outputPath: string,
    indent: Indent
): Promise<void> => {
    if (!services.length) {
        return;
    }
    const file = resolve(outputPath, `routes.ts`);
    const templateResult = templates.exports.routes({ services });
    await writeFile(file, i(f(templateResult), indent));
};
