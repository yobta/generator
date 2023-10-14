/* eslint-disable @typescript-eslint/no-explicit-any */

import { EndpointConfig, RequestInput, EndpointOptions } from './commons';

export interface QueryHookFactory {
    <Input extends RequestInput, Output>(config: EndpointConfig): (
        input: Input,
        hookOptions?: unknown,
        fetchOptions?: EndpointOptions
    ) => Output;
}
