import type { Templates } from '../registerHandlebarTemplates';

export const templates: Templates = {
    index: () => 'index',
    exports: {
        routes: {
            route: () => 'route',
            index: () => 'routesIndex',
        },
        'data-types': {
            types: () => 'factoriesTypes',
            index: () => 'factoriesIndex',
        },
        server: {
            resolver: () => 'sererResolver',
            index: () => 'serverIndex',
        },
        client: () => 'client',
        hooks: {
            resolver: () => 'hookResolver',
            index: () => 'hookIndex',
        },
        model: () => 'model',
        schema: () => 'schema',
    },
};
