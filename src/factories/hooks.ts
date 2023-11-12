/* eslint-disable @typescript-eslint/no-explicit-any */

import { MakeIntelliSense } from './MakeIntelliSense';
import { EndpointConfig, RequestInput, EndpointOptions } from './commons';

export interface QueryHookFactory {
    <Input extends RequestInput, Output>(config: EndpointConfig): (
        input: MakeIntelliSense<Input>,
        hookOptions?: unknown,
        fetchOptions?: EndpointOptions
    ) => MakeIntelliSense<Output>;
}

export interface MutationHookFactory {
    <Input extends RequestInput, Output>(config: EndpointConfig): () => [
        (input: MakeIntelliSense<Input>, fetchOptions?: EndpointOptions) => Promise<MakeIntelliSense<Output>>,
        ...unknown[]
    ];
}
