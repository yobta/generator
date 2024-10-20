import type { AnyOpenApi } from '../openApi';

import RefParser from '@apidevtools/json-schema-ref-parser';

/**
 * Load and parse the open api spec. If the file extension is ".yml" or ".yaml"
 * we will try to parse the file as a YAML spec, otherwise we will fall back
 * on parsing the file as JSON.
 * @param location: Path or url
 */
export const getOpenApiSpec = async (location: string): Promise<AnyOpenApi> => {
    return await RefParser.bundle(location, location, {});
};
