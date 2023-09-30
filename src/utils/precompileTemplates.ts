import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const basePath = path.join(__dirname, '../templates');
const getTemplatePath = (realativePath: string): string => path.join(basePath, realativePath);

const templatesData = [
    { name: 'templateExportModel', filePath: 'exportModel.hbs' },
    { name: 'templateExportSchema', filePath: 'exportSchema.hbs' },
    { name: 'templateRoute', filePath: 'routes/route.hbs' },
    { name: 'templateRoutesIndex', filePath: 'routes/index.hbs' },
    { name: 'templateDataTypes', filePath: 'data-types/types.hbs' },
    { name: 'templateDataTypesIndex', filePath: 'data-types/index.hbs' },
    { name: 'templateServerResolver', filePath: 'server/resolver.hbs' },
    { name: 'templateServerIndex', filePath: 'server/index.hbs' },
    { name: 'templateExportClient', filePath: 'exportClient.hbs' },
    { name: 'templateHookResolver', filePath: 'hooks/resolver.hbs' },
    { name: 'templateHookIndex', filePath: 'hooks/index.hbs' },
    { name: 'templateIndex', filePath: 'index.hbs' },
    { name: 'partialBase', filePath: 'partials/base.hbs' },
    { name: 'partialExportComposition', filePath: 'partials/exportComposition.hbs' },
    { name: 'partialExportEnum', filePath: 'partials/exportEnum.hbs' },
    { name: 'partialExportInterface', filePath: 'partials/exportInterface.hbs' },
    { name: 'partialExportType', filePath: 'partials/exportType.hbs' },
    { name: 'partialHeader', filePath: 'partials/header.hbs' },
    { name: 'partialIsNullable', filePath: 'partials/isNullable.hbs' },
    { name: 'partialIsReadOnly', filePath: 'partials/isReadOnly.hbs' },
    { name: 'partialIsRequired', filePath: 'partials/isRequired.hbs' },
    { name: 'partialParametersType', filePath: 'partials/parametersType.hbs' },
    { name: 'partialResult', filePath: 'partials/result.hbs' },
    { name: 'partialSchema', filePath: 'partials/schema.hbs' },
    { name: 'partialSchemaArray', filePath: 'partials/schemaArray.hbs' },
    { name: 'partialSchemaComposition', filePath: 'partials/schemaComposition.hbs' },
    { name: 'partialSchemaDictionary', filePath: 'partials/schemaDictionary.hbs' },
    { name: 'partialSchemaEnum', filePath: 'partials/schemaEnum.hbs' },
    { name: 'partialSchemaGeneric', filePath: 'partials/schemaGeneric.hbs' },
    { name: 'partialSchemaInterface', filePath: 'partials/schemaInterface.hbs' },
    { name: 'partialType', filePath: 'partials/type.hbs' },
    { name: 'partialTypeArray', filePath: 'partials/typeArray.hbs' },
    { name: 'partialTypeDictionary', filePath: 'partials/typeDictionary.hbs' },
    { name: 'partialTypeEnum', filePath: 'partials/typeEnum.hbs' },
    { name: 'partialTypeGeneric', filePath: 'partials/typeGeneric.hbs' },
    { name: 'partialTypeInterface', filePath: 'partials/typeInterface.hbs' },
    { name: 'partialTypeIntersection', filePath: 'partials/typeIntersection.hbs' },
    { name: 'partialTypeReference', filePath: 'partials/typeReference.hbs' },
    { name: 'partialTypeUnion', filePath: 'partials/typeUnion.hbs' },
    { name: 'partialTsExtention', filePath: 'partials/tsExtention.hbs' },
];

export const precompiledTemplates = templatesData.reduce((acc, { name, filePath }) => {
    const content = fs.readFileSync(getTemplatePath(filePath)).toString();
    return {
        ...acc,
        // eslint-disable-next-line no-eval
        [name]: eval(
            `(() => { return ${handlebars.precompile(content, {
                strict: true,
                noEscape: true,
                preventIndent: true,
                knownHelpersOnly: true,
                knownHelpers: {
                    ifdef: true,
                    equals: true,
                    notEquals: true,
                    containsSpaces: true,
                    union: true,
                    intersection: true,
                    enumerator: true,
                    escapeComment: true,
                    escapeDescription: true,
                    camelCase: true,
                    capitalize: true,
                    operationName: true,
                },
            })} })()`
        ),
    };
}, {} as Record<string, TemplateSpecification>);
