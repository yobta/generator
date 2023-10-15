import type { Operation } from '../client/interfaces/Operation.js';
import type { Service } from '../client/interfaces/Service.js';
import type { HttpMethods } from './types.js';

type Arg = { methods?: HttpMethods; [key: string]: unknown };

export const makeOperationsGetter =
    ({ methods, ...extraFields }: Arg) =>
    ({ operations }: Service): Operation[] => {
        const result = methods
            ? operations.filter(operation => methods.includes(operation.method as HttpMethods[number]))
            : operations;
        return result.map(operation => ({ ...extraFields, ...operation }));
    };
