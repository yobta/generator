import type { TemplateDelegate } from 'handlebars';

import handlebars from 'handlebars';

import { registerHandlebarHelpers } from './registerHandlebarHelpers.js';
import { precompiledTemplates } from './precompileTemplates.js';

export interface Templates {
    index: TemplateDelegate;
    exports: {
        routes: TemplateDelegate;
        'data-types': TemplateDelegate;
        server: TemplateDelegate;
        client: TemplateDelegate;
        hooks: TemplateDelegate;
        model: {
            item: TemplateDelegate;
            index: TemplateDelegate;
        };
        schema: {
            item: TemplateDelegate;
            index: TemplateDelegate;
        };
    };
}

/**
 * Read all the Handlebar templates that we need and return on wrapper object
 * so we can easily access the templates in out generator / write functions.
 */
export const registerHandlebarTemplates = (root: { useUnionTypes: boolean }): Templates => {
    registerHandlebarHelpers(root);

    // Main templates (entry points for the files we write to disk)
    const templates: Templates = {
        index: handlebars.template(precompiledTemplates.templateIndex),
        exports: {
            routes: handlebars.template(precompiledTemplates.templateExportRoutes),
            'data-types': handlebars.template(precompiledTemplates.templateExportDataTypes),
            server: handlebars.template(precompiledTemplates.templateExportServer),
            client: handlebars.template(precompiledTemplates.templateExportClient),
            hooks: handlebars.template(precompiledTemplates.templateExportHooks),
            model: {
                item: handlebars.template(precompiledTemplates.templateExportModel),
                index: handlebars.template(precompiledTemplates.templateExportModelIndex),
            },
            schema: {
                item: handlebars.template(precompiledTemplates.templateExportSchema),
                index: handlebars.template(precompiledTemplates.templateExportSchemaIndex),
            },
        },
    };

    // Partials for the generations of the models, services, etc.
    handlebars.registerPartial('exportEnum', handlebars.template(precompiledTemplates.partialExportEnum));
    handlebars.registerPartial('exportInterface', handlebars.template(precompiledTemplates.partialExportInterface));
    handlebars.registerPartial('exportComposition', handlebars.template(precompiledTemplates.partialExportComposition));
    handlebars.registerPartial('exportType', handlebars.template(precompiledTemplates.partialExportType));
    handlebars.registerPartial('header', handlebars.template(precompiledTemplates.partialHeader));
    handlebars.registerPartial('isNullable', handlebars.template(precompiledTemplates.partialIsNullable));
    handlebars.registerPartial('isReadOnly', handlebars.template(precompiledTemplates.partialIsReadOnly));
    handlebars.registerPartial('isRequired', handlebars.template(precompiledTemplates.partialIsRequired));
    handlebars.registerPartial('parametersType', handlebars.template(precompiledTemplates.partialParametersType));
    handlebars.registerPartial('result', handlebars.template(precompiledTemplates.partialResult));
    handlebars.registerPartial('schema', handlebars.template(precompiledTemplates.partialSchema));
    handlebars.registerPartial('schemaArray', handlebars.template(precompiledTemplates.partialSchemaArray));
    handlebars.registerPartial('schemaDictionary', handlebars.template(precompiledTemplates.partialSchemaDictionary));
    handlebars.registerPartial('schemaEnum', handlebars.template(precompiledTemplates.partialSchemaEnum));
    handlebars.registerPartial('schemaGeneric', handlebars.template(precompiledTemplates.partialSchemaGeneric));
    handlebars.registerPartial('schemaInterface', handlebars.template(precompiledTemplates.partialSchemaInterface));
    handlebars.registerPartial('schemaComposition', handlebars.template(precompiledTemplates.partialSchemaComposition));
    handlebars.registerPartial('type', handlebars.template(precompiledTemplates.partialType));
    handlebars.registerPartial('typeArray', handlebars.template(precompiledTemplates.partialTypeArray));
    handlebars.registerPartial('typeDictionary', handlebars.template(precompiledTemplates.partialTypeDictionary));
    handlebars.registerPartial('typeEnum', handlebars.template(precompiledTemplates.partialTypeEnum));
    handlebars.registerPartial('typeGeneric', handlebars.template(precompiledTemplates.partialTypeGeneric));
    handlebars.registerPartial('typeInterface', handlebars.template(precompiledTemplates.partialTypeInterface));
    handlebars.registerPartial('typeReference', handlebars.template(precompiledTemplates.partialTypeReference));
    handlebars.registerPartial('typeUnion', handlebars.template(precompiledTemplates.partialTypeUnion));
    handlebars.registerPartial('typeIntersection', handlebars.template(precompiledTemplates.partialTypeIntersection));
    handlebars.registerPartial('base', handlebars.template(precompiledTemplates.partialBase));
    handlebars.registerPartial('tsExtention', handlebars.template(precompiledTemplates.partialTsExtention));

    return templates;
};
