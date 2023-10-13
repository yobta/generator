/* eslint-disable @typescript-eslint/no-explicit-any */

import { EndpointConfig, RequestInput, EndpointOptions } from './commons';

export interface QueryHookFactory {
    <Input extends RequestInput, Output, HookOptions = unknown, HookResult extends Output = Output>(
        config: EndpointConfig
    ): (input: Input, hookOptions?: HookOptions, fetchOptions?: EndpointOptions) => HookResult;
}
