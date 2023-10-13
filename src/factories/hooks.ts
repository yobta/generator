/* eslint-disable @typescript-eslint/no-explicit-any */

import { EndpointConfig, RequestInput, EndpointOptions } from './commons';

export interface QueryHookFactory {
    <
        Input extends MaybeNull<RequestInput>,
        Output extends unknown, // eslint-disable-line @typescript-eslint/no-unused-vars
        HookOptions = unknown,
        HookResult = unknown
    >(
        config: EndpointConfig
    ): (input: Input, hookOptions?: HookOptions, fetchOptions?: EndpointOptions) => HookResult;
}
