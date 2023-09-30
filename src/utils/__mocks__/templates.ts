import type { Templates } from '../registerHandlebarTemplates';

export const templates: Templates = {
    index: () => 'index',
    exports: {
        routes: () => 'routes',
        'data-types': () => 'dataTypes',
        server: () => 'server',
        client: () => 'client',
        hooks: () => 'hooks',
        model: () => 'model',
        schema: () => 'schema',
    },
};
