/* eslint-disable @typescript-eslint/no-explicit-any */

import { Pretty } from './pretty';
import { EndpointConfig, RequestInput, EndpointOptions } from './commons';

export interface QueryHookFactory {
    <Input extends RequestInput, Output>(config: EndpointConfig): (
        input: Pretty<Input>,
        hookOptions?: unknown,
        fetchOptions?: EndpointOptions
    ) => Pretty<Output>;
}

export interface MutationHookFactory {
    <Input extends RequestInput, Output>(config: EndpointConfig): () => [
        (input: Pretty<Input>, fetchOptions?: EndpointOptions) => Promise<Pretty<Output>>,
        ...unknown[]
    ];
}
