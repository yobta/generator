import type { Operation } from '../client/interfaces/Operation.js';
import type { Service } from '../client/interfaces/Service.js';
import type { HttpMethods } from './types.js';

export const makeOperationsGetter =
    (filterMethods?: HttpMethods) =>
    ({ operations }: Service): Operation[] => {
        if (!filterMethods) return operations;
        return operations.filter(operation => filterMethods.includes(operation.method as HttpMethods[number]));
    };
