import type { Enum } from '../client/interfaces/Enum';
import type { Model } from '../client/interfaces/Model';

import camelCase from 'camelcase';
import Handlebars from 'handlebars';
import { EOL } from 'os';

import { unique } from './unique.js';
import { countOperationNames } from './countOperationNames.js';
import { Service } from '../client/interfaces/Service';
import { capitalize } from './capitalize.js';

export const registerHandlebarHelpers = (root: { useUnionTypes: boolean }): void => {
    Handlebars.registerHelper('ifdef', function (this: unknown, ...args): string {
        const options = args.pop();
        if (!args.every(value => !value)) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper(
        'equals',
        function (this: unknown, a: string, b: string, options: Handlebars.HelperOptions): string {
            return a === b ? options.fn(this) : options.inverse(this);
        }
    );

    Handlebars.registerHelper(
        'notEquals',
        function (this: unknown, a: string, b: string, options: Handlebars.HelperOptions): string {
            return a !== b ? options.fn(this) : options.inverse(this);
        }
    );

    Handlebars.registerHelper(
        'containsSpaces',
        function (this: unknown, value: string, options: Handlebars.HelperOptions): string {
            return /\s+/.test(value) ? options.fn(this) : options.inverse(this);
        }
    );

    Handlebars.registerHelper(
        'union',
        (properties: Model[], parent: string | undefined, options: Handlebars.HelperOptions): string => {
            const type = Handlebars.partials.type;
            const types = properties.map(property => type({ ...root, ...property, parent }));
            const uniqueTypes = types.filter(unique);
            let uniqueTypesString = uniqueTypes.join(' | ');
            if (uniqueTypes.length > 1) {
                uniqueTypesString = `(${uniqueTypesString})`;
            }
            return options.fn(uniqueTypesString);
        }
    );

    Handlebars.registerHelper(
        'intersection',
        (properties: Model[], parent: string | undefined, options: Handlebars.HelperOptions) => {
            const type = Handlebars.partials.type;
            const types = properties.map(property => type({ ...root, ...property, parent }));
            const uniqueTypes = types.filter(unique);
            let uniqueTypesString = uniqueTypes.join(' & ');
            if (uniqueTypes.length > 1) {
                uniqueTypesString = `(${uniqueTypesString})`;
            }
            return options.fn(uniqueTypesString);
        }
    );

    Handlebars.registerHelper(
        'enumerator',
        (
            enumerators: Enum[],
            parent: string | undefined,
            name: string | undefined,
            options: Handlebars.HelperOptions
        ) => {
            if (!root.useUnionTypes && parent && name) {
                return `${parent}.${name}`;
            }
            return options.fn(
                enumerators
                    .map(enumerator => enumerator.value)
                    .filter(unique)
                    .join(' | ')
            );
        }
    );

    Handlebars.registerHelper('escapeComment', (value: string): string => {
        return value
            .replace(/\*\//g, '*')
            .replace(/\/\*/g, '*')
            .replace(/\r?\n(.*)/g, (_, w) => `${EOL} * ${w.trim()}`);
    });

    Handlebars.registerHelper('escapeDescription', (value: string): string => {
        return value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');
    });

    Handlebars.registerHelper('camelCase', (value: string): string => {
        return camelCase(value);
    });

    Handlebars.registerHelper('capitalize', (value: string) => capitalize(value));

    Handlebars.registerHelper(
        'operationName',
        (operation: Service['operations'][number], service: Service, services: Service[]): string => {
            const { name } = operation;
            return countOperationNames(name, services) > 1 ? `${name}${service.name}` : name;
        }
    );

    Handlebars.registerHelper(
        'operationNameCapitalized',
        (operation: Service['operations'][number], service: Service, services: Service[]): string => {
            const { name } = operation;
            const nextName = countOperationNames(name, services) > 1 ? `${name}${service.name}` : name;
            return capitalize(nextName);
        }
    );
};
